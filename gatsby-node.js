'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');
const pMap = require('p-map');
const globby = require('globby');
const isTextPath = require('is-text-path');
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

const TRANSFORM_CONCURRENCY = 10;

const getRelativePrefix = (path) => {
    const depth = path.split('/').length - 2;
    const relativePrefix = depth > 0 ? '../'.repeat(depth) : './';

    return relativePrefix;
};

const relativizeHtmlFiles = async () => {
    // Replaces all /__GATSBY_IPFS_PATH_PREFIX__/ strings with the correct relative paths
    // based on the depth of the file within the `public/` folder
    const paths = await globby(['public/**/*.html']);

    await pMap(paths, async (path) => {
        const buffer = await readFileAsync(path);
        let contents = buffer.toString();

        // Skip if there's nothing to do
        if (!contents.includes('__GATSBY_IPFS_PATH_PREFIX__')) {
            return;
        }

        const relativePrefix = getRelativePrefix(path);

        contents = contents
        .replace(/\/__GATSBY_IPFS_PATH_PREFIX__\//g, () => relativePrefix);

        await writeFileAsync(path, contents);
    }, { concurrency: TRANSFORM_CONCURRENCY });
};

const relativizeJsFiles = async () => {
    // Replaces all "/__GATSBY_IPFS_PATH_PREFIX__" strings with __GATSBY_IPFS_PATH_PREFIX__
    // Replaces all "/__GATSBY_IPFS_PATH_PREFIX__/" strings with __GATSBY_IPFS_PATH_PREFIX__ + "/"
    // Replaces all "/__GATSBY_IPFS_PATH_PREFIX__/xxxx" strings with __GATSBY_IPFS_PATH_PREFIX__ + "/xxxx"
    // Also ensures that `__GATSBY_IPFS_PATH_PREFIX__` is defined in case this JS file is outside the document context, e.g.: in a worker
    const paths = await globby(['public/**/*.js']);

    await pMap(paths, async (path) => {
        const buffer = await readFileAsync(path);
        let contents = buffer.toString();

        // Skip if there's nothing to do
        if (!contents.includes('__GATSBY_IPFS_PATH_PREFIX__')) {
            return;
        }

        // DO NOT remove the extra spaces, otherwise the code will be invalid when minified,
        // e.g.: return"__GATSBY_IPFS_PATH_PREFIX__/static/..." -> return __GATSBY_IPFS_PATH_PREFIX + "/static/..."
        // TODO: THIS IS THE LINE (tested & confirmed)
        // Output SHOULD be: "We couldn't load \"/__GATSBY_IPFS_PATH_PREFIX__/page-data/sq/d/" +
        contents = contents
        // Fix issue with rendered mdx img tags (but may break other stuff..?)
        .replace(/\/__GATSBY_IPFS_PATH_PREFIX__\/static/g, "/static")
        .replace(/["']\/__GATSBY_IPFS_PATH_PREFIX__['"]/g, () => ' __GATSBY_IPFS_PATH_PREFIX__ ')
        // Excluding \ with a lookback fixes unexpected character error (was replacing inside a string)
        // Excluding the (src=) thing prevents messing up rendered mdx img tags  (double check if necessary)
        // But fixing the rendered img tags requires also fixing `srcSet`s, so `contents = contents.replace(/\/__GATSBY_IPFS_PATH_PREFIX__\/static/g, "/static")` from above is required
        .replace(/(?<!\\|src=|src":)(["'])\/__GATSBY_IPFS_PATH_PREFIX__\/([^'"]*?)(['"])/g, (matches, g1, g2, g3) => ` __GATSBY_IPFS_PATH_PREFIX__ + ${g1}/${g2}${g3}`)  // `"We couldn't load "/__GATSBY_IPFS_FAKE_PREFIX__/page-data/sq/d/" +`

        // "We couldn't load \"/__GATSBY_IPFS_PATH_PREFIX__/page-data/sq/d/" + +  <-- correct
        // "We couldn't load "/__GATSBY_IPFS_FAKE_PREFIX__/page-data/sq/d/" +   <-- first replace (incorrect)
        // "We couldn't load "/__GATSBY_IPFS_FAKE_PREFIX__/page-data/sq/d/" +   <-- second replace (no change)
        // "We couldn't load \ __GATSBY_IPFS_PATH_PREFIX__ + "/page-data/sq/d/" + <-- observed bad value

        // New error: 
        // .register __GATSBY_IPFS_PATH_PREFIX__ + ("/sw.js")  <-- observed bad value
        // .register("/__GATSBY_IPFS_PATH_PREFIX__/sw.js") <-- correct

        // New new error:
        // src= __GATSBY_IPFS_PATH_PREFIX__ + "/static/a85c9d53b205520fef7f5527490bcaf8/6aca1/jake-weirick-Zu6wtAvLWgE-unsplash.jpg"  <-- observed bad value
        // src= __GATSBY_IPFS_PATH_PREFIX__ + "/static/09181539da3eef417b1ea48ae88c8566/6aca1/tim-mossholder-9UjEyzA6pP4-unsplash.jpg"  <-- correct
        


        // regex101: https://regex101.com/r/n8G9fc/1

        await writeFileAsync(path, contents);
    }, { concurrency: TRANSFORM_CONCURRENCY });
};

const relativizeMiscAssetFiles = async () => {
    // Replaces all /__GATSBY_IPFS_PATH_PREFIX__/ strings to standard relative paths
    const paths = await globby(['public/**/*', '!public/**/*.html', '!public/**/*.js']);

    await pMap(paths, async (path) => {
        // Skip if this is not a text file
        if (!isTextPath(path)) {
            return;
        }

        const buffer = await readFileAsync(path);
        let contents = buffer.toString();

        // Skip if there's nothing to do
        if (!contents.includes('__GATSBY_IPFS_PATH_PREFIX__')) {
            return;
        }

        const relativePrefix = getRelativePrefix(path);

        contents = contents
        // TODO: some icons seem to use relative paths - do another replace?
        .replace(/\/__GATSBY_IPFS_PATH_PREFIX__\/icons/g, "/icons")  // need to replace icon path in manifest.webmanifest
        // TODO: This one may not be needed
        .replace(/\/__GATSBY_IPFS_PATH_PREFIX__\/static/g, "/static")  // need to replace static links in compiled mdx within js (and here maybe in mdx files pre-compilation..?)
        .replace(/\/__GATSBY_IPFS_PATH_PREFIX__\//g, () => relativePrefix);

        await writeFileAsync(path, contents);
    }, { concurrency: TRANSFORM_CONCURRENCY });
};

const injectScriptInHtmlFiles = async () => {
    // Injects a script into the <head> of all HTML files that defines the
    // __GATSBY_IPFS_PATH_PREFIX__ variable
    const scriptBuffer = await readFileAsync(path.resolve(__dirname, 'runtime/head-script.js'));
    const scriptContents = scriptBuffer.toString();

    const paths = await globby(['public/**/*.html']);

    await pMap(paths, async (path) => {
        let contents = await readFileAsync(path);

        contents = contents
        .toString()
        .replace(/<head>/, () => `<head><script>${scriptContents}</script>`);

        await writeFileAsync(path, contents);
    }, { concurrency: TRANSFORM_CONCURRENCY });
};

exports.onPreBootstrap = ({ store, reporter }) => {
    const { config, program } = store.getState();

    if (!/\/?__GATSBY_IPFS_PATH_PREFIX__/.test(config.pathPrefix)) {
        reporter.panic('The pathPrefix must be set to __GATSBY_IPFS_PATH_PREFIX__ in your gatsby-config.js file');
    }

    if (program._[0] === 'build' && !program.prefixPaths) {
        reporter.panic('The build command must be run with --prefix-paths');
    }
};

exports.onPostBuild = async () => {
    // Relativize all occurrences of __GATSBY_IPFS_PATH_PREFIX__ within the built files
    await relativizeHtmlFiles();
    await relativizeJsFiles();
    await relativizeMiscAssetFiles();

    // Inject the runtime script into the <head> of all HTML files
    await injectScriptInHtmlFiles();
};
