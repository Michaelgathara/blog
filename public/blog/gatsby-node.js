// gatsby-node.js
const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const blogPostTemplate = path.resolve(`src/templates/blogTemplate.js`);

  const result = await graphql(`
    query {
      allMarkdownRemark {
        edges {
          node {
            frontmatter {
              date(formatString: "MMMM DD, YYYY")
              path
              title
              desc
            }
            html
          }
        }
      }
    }
  `);

  if (result.errors) {
    throw result.errors;
  }

  result.data.allMarkdownRemark.edges.forEach((edge) => {
    createPage({
      path: edge.node.frontmatter.path,
      component: blogPostTemplate,
      context: {
        slug: edge.node.frontmatter.path, 
      },
    });
  });
};
