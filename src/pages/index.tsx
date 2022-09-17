import * as React from "react"
import { graphql, HeadFC, PageProps } from "gatsby"
import { Container, Row, Col } from "react-bootstrap"

import 'bootstrap/dist/css/bootstrap.min.css'
import "../styles.scss"
import Layout from "../components/Layout"
import Seo from "../components/Seo"
import { StaticImage } from "gatsby-plugin-image"



const IndexPage = ({ data }: PageProps<Queries.IndexPageQuery>) => {
  const pages = data.allMdx.nodes

  Howler.stop()

  if (pages.length === 0) {
    return (
      <p>No mdx pages found. Add some to src/markdown-pages</p>
    )
  }

  return (
    <Container style={{ marginTop: "40px" }}>
      <Row xs={4}>
        <Col>
          <h1>Hi</h1>
          <p>You come across a thing</p>
          <a href="/">investigate</a>
        </Col>
      </Row>

      <Layout pageTitle="Home Page">
        <p>I'm making this by following the Gatsby Tutorial.</p>
        <StaticImage className="dog-image"
          alt="Clifford, a reddish-brown pitbull, posing on a couch and looking stoically at the camera"
          src="https://pbs.twimg.com/media/E1oMV3QVgAIr1NT?format=jpg&name=large"
        />
        <ul>
          {pages.map((page: any) => {
            return (
              <li key={page.frontmatter.slug}>
                <a href={page.frontmatter.slug}>{page.frontmatter.title}</a>
              </li>
            )
          })}
        </ul>
      </Layout>
    </Container>
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