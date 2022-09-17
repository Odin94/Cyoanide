import * as React from 'react'
import { Link, useStaticQuery, graphql } from 'gatsby'
import './layout.scss'
import { Container } from 'react-bootstrap'
import { MDXProvider } from '@mdx-js/react'

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
        <Container>
            <header className='site-title'>{data.site.siteMetadata.title}</header>
            <nav>
                <ul className="nav-links">
                    <li className="nav-link-item">
                        <Link to="/" className="nav-link-text">
                            Home
                        </Link>
                    </li>
                    <li className="nav-link-item">
                        <Link to="/about" className="nav-link-text">
                            About
                        </Link>
                    </li>
                    <li className="nav-link-item">
                        <Link to="/game" className="nav-link-text">
                            Games
                        </Link>
                    </li>
                </ul>
            </nav>
            <main>
                <h1 className="heading">{pageTitle}</h1>
                <MDXProvider components={shortcodes}>
                    {children}
                </MDXProvider>
            </main>
            <div className="empty-space"></div>
        </Container>
    )
}

export default Layout