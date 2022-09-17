// This file has a template-y name to make gatsby create a route for each mdx node's slug (from frontmatter)
// See https://www.gatsbyjs.com/docs/tutorial/part-6/#task-create-blog-post-page-template


import React from 'react'
import { graphql, HeadFC, HeadProps, PageProps } from 'gatsby'
import { GatsbyImage, getImage, ImageDataLike } from 'gatsby-plugin-image'
import Layout from '../../components/Layout'
import Seo from '../../components/Seo'
import useSound from 'use-sound'
import { Howl, Howler } from 'howler'

// type auto-generation from queries only works if queries can be named
// query in template-y files can't be named because they'd create multiple queries with the same name
type DataProps = {
  mdx: {
    frontmatter: {
      title: string
      date: string,
      hero_image_alt: string,
      hero_image_credit_link: string,
      hero_image_credit_text: string,
      hero_image: ImageDataLike
      music?: {
        publicURL?: string
      }
    }
  }
}

const GamePage = ({ data, children }: PageProps<DataProps>) => {
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

  const image = getImage(data.mdx.frontmatter.hero_image)!

  return (
    <Layout pageTitle={data.mdx.frontmatter.title}>
      <p>{data.mdx.frontmatter.date}</p>
      <GatsbyImage
        image={image}
        alt={data.mdx.frontmatter.hero_image_alt}
      />
      <p>
        Photo Credit:{" "}
        <a href={data.mdx.frontmatter.hero_image_credit_link}>
          {data.mdx.frontmatter.hero_image_credit_text}
        </a>
      </p>
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
        date(formatString: "MMMM DD, YYYY")
        hero_image_alt
        hero_image_credit_link
        hero_image_credit_text
        hero_image {
          childImageSharp {
            gatsbyImageData
          }
        }
        music {
          publicURL
        }
      }
    }
  }
`

export const Head: HeadFC<DataProps> = ({ data }: HeadProps<DataProps>) => <Seo title={data.mdx.frontmatter.title} />

export default GamePage