import { graphql, Link, PageProps } from 'gatsby'
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { Howler } from 'howler'
import React, { useEffect, useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { LoadSavedGameModal } from '../../components/LoadSavedGameModal'
import NavbarLayout from '../../components/NavbarLayout'
import Seo from '../../components/Seo'

const Games = ({ data }: PageProps<Queries.GamesQuery>) => {
  let [modalComponent, setModalComponent] = useState(<></>)
  useEffect(() => {
    // has to be inside useEffect because we don't want to render it during SSR
    setModalComponent(<LoadSavedGameModal />)
  }, [])

  Howler.stop()

  if (data.allMdx.nodes.length === 0) {
    return (
      <>
        <h1>No games available</h1>
        <h2>Add a folder containing an .mdx file to game-pages and make sure the frontmatter contains "story_start: true"</h2>
      </>
    )
  }

  return (
    <NavbarLayout pageTitle="Games">
      <Row>
        {
          data.allMdx.nodes.map((node: any) => {
            const image = getImage(node.frontmatter.story_cover_image)
            return (
              <Col sm={8} key={node.id} style={{ marginTop: "25px" }}>
                <Link to={`/game/${node.frontmatter.slug}`}>
                  <Card style={{ background: "#151515", color: "white" }} className="hover-link">
                    <Card.Title style={{ textAlign: "center", fontSize: "2em", padding: "5px" }}>{node.frontmatter.title}</Card.Title>
                    {image ? <GatsbyImage image={image} alt="" objectFit={"contain"} /> : null}
                    <Card.Text style={{ padding: "18px" }}>
                      {node.excerpt}
                    </Card.Text>
                  </Card>
                </Link>
              </Col>
            )
          })
        }
      </Row>
      {modalComponent}
    </NavbarLayout >
  )
}

export const query = graphql`
  query Games {
    allMdx(
      filter: { frontmatter: { story_start: { eq: true } } }, 
      sort: { fields: frontmatter___date, order: DESC }
      ) {
      nodes {
        frontmatter {
          date(formatString: "MMMM D, YYYY")
          title
          slug
          story_cover_image {
            childImageSharp {
              gatsbyImageData(
                placeholder: BLURRED
              )
            }
          }
        }
        id
        excerpt
      }
    }
  }
`

export const Head = () => <Seo title="Games" />

export default Games