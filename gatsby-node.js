const path = require(`path`);
const _ = require("lodash");
const { createFilePath } = require(`gatsby-source-filesystem`);

const remark = require("remark");
const remarkHTML = require("remark-html");

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  const blogPost = path.resolve(`./src/templates/blog-post.js`);
  const tagPage = path.resolve(`./src/templates/tag-page.js`);

  return graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
                tags
              }
            }
          }
        }
      }
    `
  ).then(result => {
    if (result.errors) {
      throw result.errors;
    }

    // Create blog posts pages.
    const posts = result.data.allMarkdownRemark.edges;
    const tagSet = new Set();

    posts.forEach((post, index) => {
      const previous =
        index === posts.length - 1 ? null : posts[index + 1].node;
      const next = index === 0 ? null : posts[index - 1].node;

      // Get tags for tags pages.
      if (post.node.frontmatter.tags) {
        post.node.frontmatter.tags.forEach(tag => {
          tagSet.add(tag);
        });
      }

      createPage({
        path: post.node.fields.slug,
        component: blogPost,
        context: {
          slug: post.node.fields.slug,
          previous,
          next
        }
      });
    });

    // Create tags pages.
    tagSet.forEach(tag => {
      createPage({
        path: `/tags/${_.kebabCase(tag)}/`,
        component: tagPage,
        context: {
          tag
        }
      });
    });

    return null;
  });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode });
    const collection = getNode(node.parent).sourceInstanceName;
    createNodeField({
      name: `slug`,
      node,
      value: slug
    });
    createNodeField({
      name: `collection`,
      node,
      value: collection
    });
  }
  if (node.internal.type === `PagesYaml`) {
    const { sourceInstanceName, name } = getNode(node.parent);
    createNodeField({
      name: `filename`,
      node,
      value: name
    });
    createNodeField({
      name: `collection`,
      node,
      value: sourceInstanceName
    });

    if (`home` === name) {
      const section = node.section.map(section => {
        return {
          name: section.name,
          intro: section.intro ? toHTML(section.intro) : "",
          category: section.category.map(category => {
            return {
              categoryRelation: category["category-relation"],
              image: category.image,
              intro: toHTML(category.intro)
            };
          })
        };
      });
      createNodeField({
        name: `html`,
        node,
        value: {
          title: node.title,
          intro: toHTML(node.intro),
          section
        }
      });
    }
  }
};

const toHTML = data => {
  return remark()
    .use(remarkHTML)
    .processSync(data)
    .toString();
};
