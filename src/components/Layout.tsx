import * as React from 'react'
import { Link, useStaticQuery, graphql } from 'gatsby'
import './layout.scss'
import { Container } from 'react-bootstrap'
import { MDXProvider } from '@mdx-js/react'
import poisonIcon from '../images/poison-svgrepo-com.svg'

const shortcodes = { Link } // Provide common components here

export type LayoutProps = {
    pageTitle: string,
    children: React.ReactNode
}

const Layout = ({ pageTitle, children }: LayoutProps) => {
    const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

    return (
        <Container style={{ maxWidth: "750px" }}>
            <div className="empty-space"></div>
            <main>
                <MDXProvider components={shortcodes}>
                    {children}
                </MDXProvider>
            </main>
            <div className="empty-space"></div>
        </Container>
    )
}

export default Layout