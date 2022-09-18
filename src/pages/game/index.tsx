import * as React from 'react'
import { Link, graphql, PageProps } from 'gatsby'
import NavbarLayout from '../../components/NavbarLayout'
import Seo from '../../components/Seo'

const Games = ({ data }: PageProps<Queries.GamesQuery>) => {
  Howler.stop()
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
    allMdx(sort: {fields: frontmatter___date, order: DESC}) {
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