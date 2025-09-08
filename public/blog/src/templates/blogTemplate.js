// src/templates/blogTemplate.js

import React from "react"
import { Helmet } from "react-helmet"
import { Link, graphql } from "gatsby"
import * as styles from "../components/blog.module.css"
import { defineCustomElements as deckDeckGoHighlightElement } from "@deckdeckgo/highlight-code/dist/loader"
import ThemeToggle from "../components/ThemeToggle"
import ReadingProgress from "../components/ReadingProgress"
import CodeBlock from "../components/CodeBlock"
import { calculateReadingTime, extractTextFromHtml } from "../utils/readingTime"

const PostNavigation = () => (
  <div className={styles.goingBack}>
    <Link to="/" className={styles.goBack}>
      <span className={styles.leftArrow}>←</span> Back to All Posts
    </Link>
    <hr />
  </div>
)

deckDeckGoHighlightElement()

export default function Template({ data }) {
  const { markdownRemark } = data
  const { frontmatter, html } = markdownRemark
  const readingTime = calculateReadingTime(extractTextFromHtml(html))
  
  return (
    <div className="blog-post-container">
      <Helmet>
        <title>{frontmatter.title}</title>
        <meta name="description" content={frontmatter.desc} />
      </Helmet>
      <ThemeToggle />
      <ReadingProgress />
      <CodeBlock />
      <div className="blog-post">
        <h1 className={styles.blogPostTitle} id={styles.blogPostTitle}>
          {frontmatter.title}
        </h1>
        <div className={styles.blogPostDate}>
          {frontmatter.date} • {readingTime}
        </div>
        <PostNavigation />
        <div
          className={styles.blogPostContent}
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <PostNavigation />
      </div>
    </div>
  )
}

export const pageQuery = graphql`
  query ($slug: String!) {
    markdownRemark(frontmatter: { path: { eq: $slug } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        path
        title
        desc
      }
    }
  }
`
