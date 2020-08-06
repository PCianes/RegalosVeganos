import React from "react";
import { graphql } from "gatsby";
import Img from "gatsby-image";

import Layout from "../components/layout";
import SEO from "../components/seo";

class CategoryTemplate extends React.Component {
  render() {
    const { frontmatter: data, html, excerpt } = this.props.data.category;
    const siteTitle = this.props.data.site.siteMetadata.title;

    return (
      <Layout location={this.props.location} title={siteTitle}>
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
              data.products.map(product => {
                return <p>{product.product_relation}</p>;
              })}
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
                  products.map(product => {
                    return <p>{product.product_relation}</p>;
                  })}
              </section>
            );
          })}
      </Layout>
    );
  }
}

export default CategoryTemplate;

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
          product_relation
        }
        section {
          title
          body
          products {
            product_relation
          }
        }
      }
      html
    }
  }
`;
