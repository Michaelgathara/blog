import React from "react"
import PropTypes from "prop-types"

export default class HTML extends React.Component {
  render() {
    return (
      <html {...this.props.htmlAttributes}>
        <head>
          <title>Michael's Blog</title>
          {/* <meta name="description" content="Michael Gathara's blog about things"/> */}
          {/* og:image is set per-page via Helmet */}
          <link
            rel="stylesheet"
            href="https://michaelgathara.com/assets/main.css"
          />
          <meta
            name="keywords"
            content="michael,michael gathara, gathara, michaelgathara, michael.gathara, michael github, michael gathara github, hoover high school, hoover city schools, michael hoover high school, al.com, al michael gathara, michael gathara al, projects, programmer, africa michael gathara, michael gathara uab, uab, mike uab, mikegtr, mikegtrm, top software blogger, best software blogs, best swe bloggers, top linkedin voices"
          />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta name="apple-mobile-web-app-status-bar-style" content="#000" />
          <meta name="theme-color" content="#000" />
          <meta name="author" content="Michael Gathara" />
          {/* og:image is set per-page via Helmet */}
          <link
            rel="icon"
            href="https://michaelgathara.com/images/favicon.ico"
          />

          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-0RBF5MZ61K"
          ></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-0RBF5MZ61K');
              `,
            }}
          />

          {/* existing head component */}
          {this.props.headComponents}
        </head>
        <body {...this.props.bodyAttributes}>
          {this.props.preBodyComponents}
          <div
            key={`body`}
            id="___gatsby"
            dangerouslySetInnerHTML={{ __html: this.props.body }}
          />

          {this.props.postBodyComponents}
          <script
            type="text/javascript"
            src="https://michaelgathara.com/assets/index.js"
          ></script>
        </body>
      </html>
    )
  }
}

HTML.propTypes = {
  htmlAttributes: PropTypes.object,
  headComponents: PropTypes.array,
  bodyAttributes: PropTypes.object,
  preBodyComponents: PropTypes.array,
  body: PropTypes.string,
  postBodyComponents: PropTypes.array,
}
