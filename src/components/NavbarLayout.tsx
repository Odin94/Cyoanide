import * as React from 'react'
import { Link, useStaticQuery, graphql } from 'gatsby'
import './layout.scss'
import { Container } from 'react-bootstrap'
import { MDXProvider } from '@mdx-js/react'
import poisonIcon from '../images/poison-svgrepo-com.svg'

const shortcodes = { Link } // Provide common components here

export type NavbarLayoutProps = {
    pageTitle: string,
    children: React.ReactNode
}

const NavbarLayout = ({ pageTitle, children }: NavbarLayoutProps) => {
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
            <p align="center">
                <img alt="Cyoanide" src={poisonIcon} width="60" />
            </p>
            <header className='site-title'>{data.site.siteMetadata.title}</header>
            <nav>
                <ul className="nav-links">
                    <li className="nav-link-item">
                        <Link to="/" className="nav-link-text">
                            Home
                        </Link>
                    </li>
                    <li className="nav-link-item">
                        <Link to="https://github.com/Odin94/Cyaonide" className="nav-link-text">
                            Github
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
                <MDXProvider components={shortcodes}>
                    {children}
                </MDXProvider>
            </main>
            <div className="empty-space"></div>
        </Container>
    )
}

export default NavbarLayout