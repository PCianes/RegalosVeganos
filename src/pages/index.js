import React from "react";
import { graphql } from "gatsby";

import Img from "gatsby-image";

import Layout from "../components/layout";
import SEO from "../components/seo";
import PostCard from "../components/postCard";

import { Link } from "gatsby";

import "../style/normalize.css";
import "../style/all.scss";

const Index = ({ data }) => {
  const { site, blog } = data;
  const siteTitle = site.siteMetadata.title;
  const posts = blog.edges;
  const { title, intro, section } = data.home.fields.html;
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
        <h1 className="page-head-title">{title}</h1>
        <article class="post-content page-template no-image">
          <div
            className="post-content-body"
            dangerouslySetInnerHTML={{ __html: intro }}
          />
        </article>
      </header>
      {section.length > 0 &&
        section.map(section => {
          return (
            <section>
              <h2>{section.name}</h2>
              <div
                className="post-content-body"
                dangerouslySetInnerHTML={{ __html: section.intro }}
              />
              {section.category.length > 0 &&
                section.category.map(({ link, intro, image }) => {
                  return (
                    <article>
                      <div className="post-content-image">
                        <Link to={link}>
                          <Img
                            className="kg-image"
                            fixed={image.childImageSharp.fixed}
                          />
                        </Link>
                      </div>
                      <p dangerouslySetInnerHTML={{ __html: intro }}></p>
                    </article>
                  );
                })}
            </section>
          );
        })}
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
              link
              intro
              image {
                childImageSharp {
                  fixed(width: 300) {
                    ...GatsbyImageSharpFixed
                  }
                }
              }
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
