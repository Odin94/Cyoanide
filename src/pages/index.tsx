import * as React from "react"
import { graphql, HeadFC, Link, PageProps } from "gatsby"

import 'bootstrap/dist/css/bootstrap.min.css'
import "../styles.scss"
import NavbarLayout from "../components/NavbarLayout"
import Seo from "../components/Seo"
import { StaticImage } from "gatsby-plugin-image"
import { Howler } from 'howler'


const IndexPage = ({ data }: PageProps<Queries.IndexPageQuery>) => {
  const pages = data.allMdx.nodes

  Howler.stop()

  if (pages.length === 0) {
    return (
      <p>No mdx pages found. Add some to src/markdown-pages</p>
    )
  }

  return (
    <NavbarLayout pageTitle="Home Page">
      <p>Choose your own adventure!</p>
      <StaticImage className="index-image"
        alt="night sky in the forrest"
        src="https://images.unsplash.com/photo-1515444744559-7be63e1600de?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
      />
      <p style={{ marginTop: "25px" }}>Check out the <a style={{ display: "inline" }} href="https://github.com/Odin94/Cyoanide">README on Github</a> for instructions on how to use Cyoanide to write your own stories.</p>
      <p>Check out the <Link style={{ display: "inline" }} to="/games">Games Page</Link> to see stories hosted here.</p>
      <p>Check out my <a style={{ display: "inline" }} href="https://odin-matthias.de/posts/2022-10-03--cyoanide-a-choose-your-own-adventure-engine/cyoanide-a-choose-your-own-adventure-engine">Development Blog</a> for info on the throughts & tech behind Cyoanide.</p>
    </NavbarLayout>
  )
}

export default IndexPage

export const Head: HeadFC = () => <Seo title="Home Page" />


export const pageQuery = graphql`
  query IndexPage {
    allMdx(sort: {fields: frontmatter___date, order: DESC}) {
      nodes {
        id
        excerpt
        body
        frontmatter {
          title
          slug
          date(formatString: "MMMM DD, YYYY")
        }
      }
    }
  }
`