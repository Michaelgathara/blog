/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/
 */

/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: `Michael Gathara's Blog`,
    description: `Michael Gathara's blog about things he finds interesting.`,
    author: `@michaelgathara`,
    siteUrl: `https://michaelgathara.org`,
  },
  plugins: [
    `gatsby-plugin-image`,
    `gatsby-plugin-react-helmet`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/static/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `assets`,
        path: `${__dirname}/src/assets`,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Michael Gathara's Blog`,
        short_name: `Michael Gathara's Blog`,
        start_url: `/`,
        // This will impact how browsers show your PWA/website
        // https://css-tricks.com/meta-theme-color-and-trickery/
        theme_color: `#0000`,
        display: `minimal-ui`,
        icon: `src/assets/icon.png`,
        icons: [
          {
            src: `src/assets/icon-16x16.png`,
            sizes: `16x16`,
            type: `image/png`,
          },
          {
            src: `src/assets/icon-512x512.png`,
            sizes: `512x512`,
            type: `image/png`,
          },
          {
            src: `src/assets/icon-192x192.png`,
            sizes: `192x192`,
            type: `image/png`,
          },
        ]
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `blogs`,
        path: `${__dirname}/content/blogs`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: "language-",
              inlineCodeMarker: null,
              aliases: {},
              showLineNumbers: false,
              noInlineHighlight: false,
              languageExtensions: [
                {
                  language: "superscript",
                  extend: "javascript",
                  definition: {
                    superscript_types: /(SuperType)/,
                  },
                  insertBefore: {
                    function: {
                      superscript_keywords: /(superif|superelse)/,
                    },
                  },
                },
              ],
              prompt: {
                user: "root",
                host: "localhost",
                global: false,
              },
              escapeEntities: {},
            },
          },
        ],
      },
    },
    // {
    //   resolve: `gatsby-transformer-remark`,
    //   options: {
    //     plugins: [
    //       {
    //         resolve: `gatsby-remark-highlight-code`,
    //         options: {
    //           terminal: "ubuntu",
    //           theme: "blackboard",
    //         }
    //       }
    //     ]
    //   }
    // },
    // {
    //   resolve: `gatsby-plugin-mdx`,
    //   options: {
    //     gatsbyRemarkPlugins: [
    //       {
    //         resolve: `gatsby-remark-highlight-code`,
    //         options: {
    //           terminal: "ubuntu",
    //           theme: "blackboard",
    //         }
    //       },
    //     ],
    //   },
    // },
  ],
}
