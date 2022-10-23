// This file has a template-y name to make gatsby create a route for each mdx node's slug (from frontmatter)
// See https://www.gatsbyjs.com/docs/tutorial/part-6/#task-create-blog-post-page-template


import React from 'react'
import { graphql, HeadFC, HeadProps, PageProps } from 'gatsby'
import Seo from '../../components/Seo'
import useSound from 'use-sound'
import { Howl, Howler } from 'howler'
import Layout from '../../components/Layout'
import { saveGameName, saveLevelState } from '../../SaveState'

// type auto-generation from queries only works if queries can be named
// query in template-y files can't be named because they'd create multiple queries with the same name
type DataProps = {
  mdx: {
    frontmatter: {
      title: string
      date: string,
      slug: string,
      music?: {
        publicURL?: string
      },
      story_start?: boolean
    }
  }
}

const GamePage = ({ data, children }: PageProps<DataProps>) => {
  const music = data.mdx.frontmatter.music?.publicURL

  React.useEffect(() => {
    if (data.mdx.frontmatter.story_start) {
      saveGameName(data.mdx.frontmatter.title)
    }
  }, [])


  // Can't do this inside something like useEffect(fn, []) because mdx doesn't re-render when data changes
  // (at least I couldn't make a dependency to "children" clear to react)
  // thus inside the mdx files it would sometimes have outdated levelState info
  saveLevelState(data.mdx.frontmatter.slug)

  React.useEffect(() => {
    saveLevelState(data.mdx.frontmatter.slug)
  }, [data.mdx.frontmatter.slug])

  const musicIsAlreadyPlaying = (Howler as any)._howls.find((howl: Howl | any) => {
    return howl._src === music && howl.playing()
  })

  if (!musicIsAlreadyPlaying) {
    Howler.stop()

    if (music) {
      const [play, { stop, sound: Howl }] = useSound(music, { loop: true });
      play()
    }
  }

  return (
    <Layout pageTitle={data.mdx.frontmatter.title}>
      {children}
    </Layout>
  )
}

// Using $id query variable (https://www.gatsbyjs.com/docs/tutorial/part-6/#render-post-contents-in-the-blog-post-page-template)
export const query = graphql`
  query($id: String) {
    mdx(id: {eq: $id}) {
      frontmatter {
        title
        slug
        date(formatString: "MMMM DD, YYYY")
        music {
          publicURL
        }
        story_start
      }
    }
  }
`

export const Head: HeadFC<DataProps> = ({ data }: HeadProps<DataProps>) => <Seo title={data.mdx.frontmatter.title} />

export default GamePage