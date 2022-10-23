import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  flags: {
    DEV_SSR: true
  },
  siteMetadata: {
    title: `Cyoanide`,
    siteUrl: `https://www.yourdomain.tld`
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  pathPrefix: `__GATSBY_IPFS_PATH_PREFIX__`,
  plugins: [
    {
      resolve: `gatsby-plugin-prettier-build`,
      options: {
        types: ['html', 'js'],
        concurrency: 20,
        verbose: false
      }
    },
    // "gatsby-plugin-ipfs",  // this + "__GATSBY_IPFS_PATH_PREFIX__" makes relative paths work for electron, see https://github.com/gatsbyjs/gatsby/discussions/14161
    "gatsby-plugin-sass",
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        "icon": "src/images/poison-svgrepo-com.svg"
      }
    },
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        "name": "images",
        "path": `${__dirname}/src/images/`
      },
      __key: "images"
    }, {
      resolve: 'gatsby-source-filesystem',
      options: {
        "name": "pages",
        "path": `${__dirname}/src/pages/`
      },
      __key: "pages"
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `game-pages`,
        path: `${__dirname}/game-pages`,
      },
      __key: "game-pages"
    }, {
      resolve: "gatsby-plugin-mdx",
      options: {
        extensions: ['.mdx', '.md', '.markdown'],
        gatsbyRemarkPlugins: ["gatsby-transformer-remark", {
          resolve: 'gatsby-remark-images',
          options: {
            linkImagesToOriginal: false,
          }
        }],
      }
    },
    "gatsby-transformer-sharp",
  ]
};

export default config;
