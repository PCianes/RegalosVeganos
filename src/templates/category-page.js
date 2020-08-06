import React from "react";
import { graphql } from "gatsby";

import Product from "../components/product";
import Layout from "../components/layout";
import SEO from "../components/seo";

const CategoryTemplate = ({ data: propsData, location }) => {
  const { frontmatter: data, html, excerpt } = propsData.category;
  const siteTitle = propsData.site.siteMetadata.title;
  return (
    <Layout location={location} title={siteTitle}>
      <SEO title={data.title} description={excerpt} />
      <article className="post-content">
        <header className="post-content-header">
          <h1 className="post-content-title">{data.title}</h1>
        </header>
        <div
          className="post-content-body"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <div>
          {data.products.length > 0 &&
            data.products.map(product => (
              <Product data={product.product_relation.frontmatter} />
            ))}
        </div>
      </article>
      {data.section.length > 0 &&
        data.section.map(({ title, body, products }) => {
          return (
            <section>
              <h2>{title}</h2>
              <div
                className="post-content-body"
                dangerouslySetInnerHTML={{ __html: body }}
              />
              {products.length > 0 &&
                products.map(product => (
                  <Product data={product.product_relation.frontmatter} />
                ))}
            </section>
          );
        })}
    </Layout>
  );
};

export const pageQuery = graphql`
  query CategoryBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    category: markdownRemark(fields: { slug: { eq: $slug } }) {
      frontmatter {
        title
        products {
          product_relation {
            frontmatter {
              affiliate_link
              thumbnail_link
              title
            }
          }
        }
        section {
          title
          body
          products {
            product_relation {
              frontmatter {
                affiliate_link
                thumbnail_link
                title
              }
            }
          }
        }
      }
      html
      excerpt
    }
  }
`;

export default CategoryTemplate;
