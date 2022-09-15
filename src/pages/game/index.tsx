import * as React from 'react'
import { Link, graphql } from 'gatsby'
import Layout from '../../components/Layout'
import Seo from '../../components/Seo'

const Games = ({ data }: { data: any }) => {
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
  query {
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