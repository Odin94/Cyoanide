import * as React from 'react'
import { Link, graphql, PageProps } from 'gatsby'
import Layout from '../../components/Layout'
import Seo from '../../components/Seo'

const Games = ({ data }: PageProps<Queries.GamesQuery>) => {
  return (
    <Layout pageTitle="My Games">
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
    </Layout>
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

export const Head = () => <Seo title="My Games" />

export default Games