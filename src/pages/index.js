import React from "react";
import { graphql } from "gatsby";

import Layout from "../components/layout";
import SEO from "../components/seo";
import PostCard from "../components/postCard";

import "../style/normalize.css";
import "../style/all.scss";

const Index = ({ data }) => {
  const { site, blog } = data;
  const siteTitle = site.siteMetadata.title;
  const posts = blog.edges;
  const { title, intro } = data.home.fields.html;
  let postCounter = 0;
  return (
    <Layout title={siteTitle}>
      <SEO
        lang="es"
        title="Regalos Veganos"
        keywords={[
          `veganos`,
          `regalos veganos`,
          `veganismo`,
          `vegan`,
          `tienda veganos`
        ]}
      />

      <header className="page-head">
        <h2 className="page-head-title">{title}</h2>
        <div
          className="post-content-body"
          dangerouslySetInnerHTML={{ __html: intro }}
        />
      </header>

      <div className="post-feed">
        {posts.map(({ node }) => {
          postCounter++;
          return (
            <PostCard
              key={node.fields.slug}
              count={postCounter}
              node={node}
              postClass={`post`}
            />
          );
        })}
      </div>
    </Layout>
  );
};

export const query = graphql`
  {
    site {
      siteMetadata {
        title
        description
      }
    }
    home: pagesYaml(
      fields: { collection: { eq: "pages" }, filename: { eq: "home" } }
    ) {
      fields {
        html {
          title
          intro
          section {
            name
            intro
            category {
              categoryRelation
              image
              intro
            }
          }
        }
      }
    }
    blog: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { fields: { collection: { eq: "blog" } } }
      limit: 5
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM D, YYYY")
            title
            description
            tags
            thumbnail {
              childImageSharp {
                fluid(maxWidth: 1360) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }
  }
`;

export default Index;
