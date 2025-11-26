/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

import Header from "./Navigation"
import "./layout.css"

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
      redbullIcon: file(relativePath: { eq: "redbull.png" }) {
        childImageSharp {
          gatsbyImageData(width: 20, height: 20, placeholder: BLURRED)
        }
      }
    }
  `)

  return (
    <>
      <Header siteTitle={data.site.siteMetadata?.title || `Title`} />
      <div
        style={{
          margin: `0 auto`,
          maxWidth: `var(--size-content)`,
          padding: `var(--size-gutter)`,
        }}
      >
        <main>{children}</main>
        <footer
          style={{
            marginTop: `var(--space-5)`,
            fontSize: `var(--font-sm)`,
          }}
        >
          © {new Date().getFullYear()} &middot; Built by Michael Gathara with
          {` `}
          <GatsbyImage
            image={getImage(data.redbullIcon)}
            alt="Red Bull"
            style={{
              display: "inline-block",
              verticalAlign: "middle",
              marginLeft: "4px",
            }}
          />
        </footer>
      </div>
    </>
  )
}

export default Layout
