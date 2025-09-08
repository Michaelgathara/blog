import React from "react"
import { Link, graphql } from "gatsby"
import * as styles from "../components/blog.module.css"
import ThemeToggle from "../components/ThemeToggle"

const BlogPage = ({ data }) => (
  <div className={styles.main}>
    <ThemeToggle />
    <h1 className={styles.name}>A Blog About Things</h1>
    <p className={styles.homeLinkText}><Link to="https://michaelgathara.com" className={styles.homeLink}>Michael Gathara's</Link> blog</p>
    <div className={styles.blogs}>
      {data.allMarkdownRemark.edges.map(post => (
        <div key={post.node.id}>
          <Link to={post.node.frontmatter.path} className={styles.blogTitle}>{post.node.frontmatter.title}</Link>
          <p className={styles.blogDate}>{post.node.frontmatter.date}</p>
        </div>
      ))}
    </div>
  </div>
)

export const pageQuery = graphql`
  query BlogIndexQuery {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          id
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            path
            title
          }
        }
      }
    }
  }
`

export default BlogPage
