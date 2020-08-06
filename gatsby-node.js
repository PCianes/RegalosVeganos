const path = require(`path`);
const _ = require("lodash");
const {
  createFilePath,
  createRemoteFileNode
} = require(`gatsby-source-filesystem`);

const remark = require("remark");
const remarkHTML = require("remark-html");

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  const categoryPage = path.resolve(`./src/templates/category-page.js`);
  const blogPost = path.resolve(`./src/templates/blog-post.js`);
  const tagPage = path.resolve(`./src/templates/tag-page.js`);

  return graphql(
    `
      {
        categories: allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
          filter: { fields: { collection: { eq: "categories" } } }
        ) {
          edges {
            node {
              fields {
                slug
              }
            }
          }
        }
        blog: allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
          filter: { fields: { collection: { eq: "blog" } } }
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

    //Create main categories pages
    result.data.categories.edges.forEach(category => {
      createPage({
        path: category.node.fields.slug,
        component: categoryPage,
        context: {
          slug: category.node.fields.slug
        }
      });
    });

    // Create blog posts pages.
    const posts = result.data.blog.edges;
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

exports.onCreateNode = async ({
  node,
  actions,
  getNode,
  createNodeId,
  cache,
  store
}) => {
  const { createNodeField, createNode } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode });
    const relation = `${slug.substring(1)}index`;
    const collection = getNode(node.parent).sourceInstanceName;
    createNodeField({
      name: `slug`,
      node,
      value: slug
    });
    //New field ready to mapping in gatsby-config.js according to setup on Netlify CMS
    createNodeField({
      name: `relation`,
      node,
      value: relation
    });
    createNodeField({
      name: `collection`,
      node,
      value: collection
    });
    if ("product" === collection) {
      //Create a fileNode which is essentially downloading the file (image) from a remore url and storing that as an object"
      const fileNode = await createRemoteFileNode({
        url: node.frontmatter["thumbnail-link"],
        cache,
        createNode,
        createNodeId,
        store
      });
      if (fileNode) {
        node.externalImage___NODE = fileNode.id;
      }
    }
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
              relation: category["category-relation"],
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
