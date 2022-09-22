// This file has a template-y name to make gatsby create a route for each mdx node's slug (from frontmatter)
// See https://www.gatsbyjs.com/docs/tutorial/part-6/#task-create-blog-post-page-template


import React, { useEffect } from 'react'
import { graphql, HeadFC, HeadProps, PageProps } from 'gatsby'
import { GatsbyImage, getImage, ImageDataLike } from 'gatsby-plugin-image'
import Seo from '../../components/Seo'
import useSound from 'use-sound'
import { Howl, Howler } from 'howler'
import Layout from '../../components/Layout'
import { saveLevelState } from '../../SaveState'

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
      }
    }
  }
}

const GamePage = ({ data, children }: PageProps<DataProps>) => {
  useEffect(() => {
    saveLevelState(data.mdx.frontmatter.slug)
  }, [])
  const music = data.mdx.frontmatter.music?.publicURL

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
      }
    }
  }
`

export const Head: HeadFC<DataProps> = ({ data }: HeadProps<DataProps>) => <Seo title={data.mdx.frontmatter.title} />

export default GamePage