import * as React from "react"
import { graphql, HeadFC, PageProps } from "gatsby"
import { Container, Row, Col } from "react-bootstrap"

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