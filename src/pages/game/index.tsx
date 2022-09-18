import * as React from 'react'
import { Link, graphql, PageProps } from 'gatsby'
import NavbarLayout from '../../components/NavbarLayout'
import Seo from '../../components/Seo'
import { Howler } from 'howler'


const Games = ({ data }: PageProps<Queries.GamesQuery>) => {
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
      {
        data.allMdx.nodes.map((node: any) => (
          <article key={node.id}>
            <h2>
              <Link to={`/game/${node.frontmatter.slug}`}>
                {node.frontmatter.title}
              </Link>
            </h2>
          </article>
        ))
      }
    </NavbarLayout>
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
        }
        id
        excerpt
      }
    }
  }
`

export const Head = () => <Seo title="Games" />

export default Games