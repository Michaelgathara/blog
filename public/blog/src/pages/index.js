import React from "react"
import { Link, graphql } from "gatsby"
import * as styles from "../components/blog.module.css"
import Navigation from "../components/Navigation"

const links = [
  {
    text: "Main",
    url: "https://michaelgathara.com/",
  },
  {
    text: "About",
    url: "https://michaelgathara.com/about",
  },
  {
    text: "Projects",
    url: "https://michaelgathara.com/projects",
  },
  {
    text: "Blog",
    url: "https://michaelgathara.org",
  },
]

const BlogPage = ({ data }) => (
  <div className={styles.main}>
    <br></br>
    {/* <Navigation /> */}
    <h1 className={styles.name}>A Blog About Things</h1>
    <p className={styles.homeLinkText}><Link to="https://michaelgathara.com" className={styles.homeLink}>Michael Gathara's</Link> blog</p>
    <div className={styles.blogs}>
      {data.allMarkdownRemark.edges.map(post => (
        <div key={post.node.id}>
          <Link to={post.node.frontmatter.path} id={styles.blogTitle} className={styles.blogTitle}>{post.node.frontmatter.title}</Link>
          <p className={styles.blogDate}>{post.node.frontmatter.date}</p>
          {/* <hr /> */}
        </div>
      ))}
    </div>
  </div>
)

export const pageQuery = graphql`
  query BlogIndexQuery {
    allMarkdownRemark {
      edges {
        node {
          id
          frontmatter {
            path
            title
            date(formatString: "MMMM DD, YYYY")
          }
        }
      }
    }
  }
`

export default BlogPage
