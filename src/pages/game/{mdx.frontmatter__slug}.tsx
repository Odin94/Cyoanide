// This file has a template-y name to make gatsby create a route for each mdx node's slug (from frontmatter)
// See https://www.gatsbyjs.com/docs/tutorial/part-6/#task-create-blog-post-page-template


import * as React from 'react'
import { graphql } from 'gatsby'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import Layout from '../../components/Layout'
import Seo from '../../components/Seo'

export type GamePageProps = {
  data: any,
  children: React.ReactNode
}


const GamePage = ({ data, children }: GamePageProps) => {
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
      }
    }
  }
`

export const Head = ({ data }: { data: any }) => <Seo title={data.mdx.frontmatter.title} />

export default GamePage