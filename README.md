<p align="center">
  <a href="https://www.odin-matthias.de">
    <img alt="Cyoanide" src="./src/images/poison-svgrepo-com.svg" width="60" />
  </a>
</p>
<h1 align="center">
  ☣ Cyoanide ☣
</h1>

## Summary
Choose Your Own Adventure game "engine" built with Gatsby.


## How to run
* Install dependencies: `npm install`
* Run in dev mode: `npm run develop`
* Open http://localhost:8000

Use `npm run build` to build.


## How to use
This section details how to build your own game using Cyoanide. [Find a demo here.](https://cyoanide.odin-matthias.de/game)

Cyoanide, at its core, works like a Gatsby starter (see [Gatsby](https://www.gatsbyjs.com)). This means you use it as a starting project for your Gatsby-powered static website and you can modify the design and add content in the form of markdown documents. On top, Cyoanide provides player decision path tracking and background music support. Look into the `game-pages/CampingGame` folder for an example.

### Writing your Story
Each scene/page in your story should be within a folder under `game-pages`. The folder should have a descriptive name of your scene and contain a [Markdown](https://www.markdownguide.org/cheat-sheet/) file called `index.mdx` and optional image/music files used in the scene.

Your `index.mdx` must start with frontmatter that contains configs. Some configs are necessary, some are optional.

```Markdown
---
<!-- Put this only on the entrypoint to your story - it will make the page show up under /game -->
story_start: true

<!-- Put this only on the entrypoint to your story - this cover image will be shown for your story start under /game -->
story_cover_image: "./mark-boss-dWs3M2rnBk8-unsplash.jpg"

<!-- mandatory slug for your page - this will be the URL used for navigating -->
slug: "start"

<!-- mandatory title for your page -->
title: "Start of the game"

<!-- optional background music for your page -->
music: "./chill-abstract-intention-12099.mp3"
---

You can nest folders however you want. It can be helpful to use that to logically structure your story to make the folder structure easier to navigate. This will not impact your game links as they are based entirely on the `slug` attribute in your frontmatter.

## Markdown text goes here, below the frontmatter

Lorem ipsum dolor sit amet
```

To link to another scene, simply add a Link component to that scene's slug.

```Markdown
---
<!-- mandatory slug for your page - this will be the URL used for navigating -->
slug: "second-scene"

<!-- mandatory title for your page -->
title: "Second scene"
---

You meet a spooky ghost!

<!-- Including react components here is an MDXjs feature -->
<!-- "../second-scene" will take you from /game/start to /game/second-scene -->
<Link to="../second-scene">Stay here</Link>

<Link to="../start">Run back to the first scene</Link>

```

### Including Images
To include images, put the image file in the same folder as the `index.mdx` and then include it as a regular markdown image.

```Markdown

## Headline
Some text

![img](./image-name.jpg)

More text

```


### Adding Background Music
If you put `music: "./relative-path-to-your-music.mp3"` into your scene's `index.mdx` frontmatter and put your audio file called `relative-path-to-your-music.mp3` next to `index.mdx` in the folder (or anywhere else in `game-pages` if you adjust the path), Cyoanide will loop the music in the background while the player is in your scene. 

Moving to a different scene will stop the music and start that scene's music, if any is configured. If the new scene has the same background music configured in its frontmatter, Cyoanide will simply continue playing the music.


### Advanced: Using MDX
[MDX](https://mdxjs.com) allows you to use React components and run Javascript code in your markdown files. 

#### Using React Components

```MDX
---
slug: "second-scene"
title: "Second scene"
---

import { Component } from ".../some/path/component"

## Title

<Component></Component>

```

#### Running Javascript
Basic Javascript can be run the same way you would in React's JSX

```MDX
---
slug: "second-scene"
title: "Second scene"
---

## Title

{ Math.random() > 0.5 
  ? <div>
      <p>Greater One!</p>
      <p>Note that we have to write HTML in here and can't use Markdown</p>
    </div> 
  : <p>Smaller than one!</p> 
}
```

### Accessing choices taken in the past
Sometimes a choice a player makes will impact the story later than in the very next scene, so it's not enough to have links based on player choices, we must also be able to look back on past player choices.

Every time a user clicks a link in your game, the scene's slug is added to their browser's local storage. Cyoanide provides a helper function to access this data:

```MDX
---
slug: "second-scene"
title: "Second scene"
---

## Title

<!-- Unfortunately this import uses a relative path, so you may have to add more "../" depending on how deeply nested in folders your scene is. Sorry! -->
<!-- getLevelState() returns a list containing the slugs of all visited pages, eg. ["start", "second-scene"] -->
import { getLevelState } from '../src/SaveState'


<!-- Check if 2 of 3 possible actions have been taken -->
{
  ["one-action", "another-action", "third-action"].filter((it) => getLevelState().includes(it)).length >= 2
      ? <div>
          <p>I already did two things today, time to go home!</p>
          <Link to="../go-home">Go home</Link>
        </div>
      : <div>
          <p>I haven't done two things yet, better do more things!</p>
          <!-- Only show links to actions that haven't been taken yet -->
          {!getLevelState().includes("one-action") ? <Link to="../one-action">Do action one</Link> : null }
          {!getLevelState().includes("another-action") ? <Link to="../another-action">Do another action</Link> : null }
          {!getLevelState().includes("third-action") ? <Link to="../third-action">Do 3rd action</Link> : null }
        </div>
}

<!-- Change text based on past action taken -->
{
  getLevelState().includes("action-one") 
      ? <p>I just remembered that I have taken action one this morning.</p>
      </p> 
      : <p>I don't remember what actions I took this morning, but it sure wasn't action one!</p>
}
```

`getLevelState()` will update whenever the user enters a scene, either by clicking a link or by navigating back / forward in the browser. If the current scene is already stored in the level state, all stored scene-slugs after the current scene's slug will be deleted to synchronize level state with the game state the user experiences - effectively making the browser back navigation an undo action on the last choice.

### Distributing as Desktop App
Cyoanide can almost kind of be built as a Desktop app using Electron.

To develop in Electron, run:

* `npm run build:electron-main` to build Electron to folder `electron-build` (should contain only `electron.js`)
* `npm run build` to build the web version
* `npm start` to host the web version locally (must be on port 8000)
* `npm run run:electron` to run cyoanide in electron
* `npm run build:electron` to bundle electron to an executable (currently uses windows, replace "--windowns" with "--linux" to build on linux - linux build is untested)

**LIMITATIONS FOR ELECTRON DEPLOYMENT:** Unfortunately Gatsby doesn't play nicely with relative links, which is what is required to access files in the bundled Electron application. See [this discussion](https://github.com/gatsbyjs/gatsby/discussions/14161). Using `gatsby-plugin-ipfs` I could almost make it work, since this plugin allows to use proper relative paths. With this, Electron goes to the right paths (meaning `./game` rather than `C://game`), but doesn't load the `index.html` files in these paths. One way to fix this is to manually add `/index.html` to all Gatsby `<Link>` tags, which will actually make it work. I'm not happy with the solution and since this is just a hobby project and I have no need to deploy to Electron, I'll leave it at this. A possible fix is to extend what `gatsby-plugin-ipfs` does in its `gatsby-node.js` to automatically add `/index.html` to all links. Or maybe Gatsby fixes its config some day.

### Troubleshooting
* `SyntaxError: [...] index.mdx: Invalid left-hand side in prefix operation. (1:2)` - Happens whenever something is wrong with mdx syntax - probably something related to react components or js. Wrongly indicates `---` from frontmatter, which is usually not the actual issue
  * One common issue is using ">" inside an HTML tag in mdx, eg. `<Link to="...">> do thing</Link>`. Put these in a code block like `<Link to "...">{"> do thing"}</Link>`


### Potential Improvements
* Allow deploying only the game instead of the Cyoanide home page etc.
* Recognize if player has existing game save and ask if they want to continue their save if they're on a "wrong" page
* Fix Electron path issues
* Add pretty fade and text effects
* Add style templates for unique story feel

### Credits
* Poison bottle logo: [svgrepo](https://www.svgrepo.com/svg/230355/poison)
* Photos from [unsplash](https://www.unsplash.com) - see filenames for individual credit
* Big Bad Evil from sample story: [spoiler!!](https://scp-wiki.wikidot.com/scp-966)
* "Scary Forest" music by <a href="https://pixabay.com/users/sergequadrado-24990007/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=music&amp;utm_content=90162">SergeQuadrado</a>