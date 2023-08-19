// src/templates/blogTemplate.js

import React from "react"
import { Helmet } from "react-helmet";
import { Link, graphql } from "gatsby"
import * as styles from "../components/blog.module.css"
import { defineCustomElements as deckDeckGoHighlightElement } from "@deckdeckgo/highlight-code/dist/loader";


deckDeckGoHighlightElement();

export default function Template({
  data, 
}) {
  const { markdownRemark } = data 
  const { frontmatter, html } = markdownRemark
  return (
    <div className="blog-post-container">
      <Helmet>
        <title>{frontmatter.title}</title>
        <meta name="description" content={frontmatter.desc}/>
      </Helmet>
      {/* {this.props.headComponents} */}
      <div className="blog-post">
        <h1 className={styles.blogPostTitle} id={styles.blogPostTitle}>{frontmatter.title}</h1>
        <div className={styles.goingBack}>
          <Link to="/" className={styles.goBack}><span className={styles.leftArrow}>&lt;</span>  More Posts</Link>
          {/* <Link to="https://michaelgathara.org" className={styles.goNext}>More Posts <span className={styles.leftArrow}>&gt;</span></Link> */}
          <br></br>
          <hr></hr>
        </div>
        <h2 className={styles.blogPostDate}>{frontmatter.date}</h2>
        <div
          className={styles.blogPostContent}
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <div className={styles.goingBack}>
          <Link to="/" className={styles.goBack}><span className={styles.leftArrow}>&lt;</span>  More Posts</Link>
          {/* <Link to="https://michaelgathara.org" className={styles.goNext}>More Posts <span className={styles.leftArrow}>&gt;</span></Link> */}
          <br></br>
          <hr></hr>
        </div>
        <br></br><br></br>
      </div>
    </div>
  )
}

export const pageQuery = graphql`
  query($slug: String!) {
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


