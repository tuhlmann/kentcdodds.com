const path = require('path')
const componentWithMDXScope = require('gatsby-mdx/component-with-mdx-scope')

// this allows prettier to know it's graphql and format it appropriately
const graphql = String.raw

exports.createPages = async ({ graphql: gql, actions }) => {
  const { createPage } = actions
  const result = await gql(
    graphql`
      {
        allMdx {
          edges {
            node {
              id
              frontmatter {
                title
              }
              parent {
                ... on File {
                  name
                  sourceInstanceName
                }
              }
              code {
                scope
              }
            }
          }
        }
      }
    `,
  )

  if (result.errors) {
    console.log(result.errors)
    throw result.errors
  }
  // Create blog posts pages.
  result.data.allMdx.edges.forEach(({ node }) => {
    createPage({
      path: `/${node.parent.name}`,
      component: componentWithMDXScope(
        path.resolve('./src/components/posts-page-layout.js'),
        node.code.scope,
      ),
      context: { id: node.id },
    })
  })
}

/* eslint no-console:0 */
