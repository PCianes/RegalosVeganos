import React from 'react'
import { graphql } from 'gatsby'

import Product from '../components/product'
import Layout from '../components/layout'
import SEO from '../components/seo'

const CategoryTemplate = ({ data: propsData, location }) => {
  const { frontmatter: data, html, excerpt } = propsData.category
  const siteTitle = propsData.site.siteMetadata.title
  return (
    <Layout location={location} title={siteTitle}>
      <SEO title={data.title} description={excerpt} />
      <section>
        <header className="post-content post-content-header">
          <h1 className="post-content-title">{data.title}</h1>
          <div
            className="post-content-body"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </header>
        <div className="row">
          {data.products.length > 0 &&
            data.products.map(({ product_relation: data }) => {
              return (
                <Product
                  imageFixed={data.externalImage.childImageSharp.fixed}
                  data={data.frontmatter}
                />
              )
            })}
        </div>
      </section>
      {data.section.length > 0 &&
        data.section.map(({ title, body, products }) => {
          return (
            <section>
              <div className="post-content">
                <h2 className="post-content-title">{title}</h2>
                <div
                  className="post-content-body"
                  dangerouslySetInnerHTML={{ __html: body }}
                />
              </div>
              <div className="row">
                {products.length > 0 &&
                  products.map(({ product_relation: data }) => (
                    <Product
                      imageFixed={data.externalImage.childImageSharp.fixed}
                      data={data.frontmatter}
                    />
                  ))}
              </div>
            </section>
          )
        })}
    </Layout>
  )
}

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
            externalImage {
              childImageSharp {
                fixed(width: 200, height: 200) {
                  ...GatsbyImageSharpFixed
                }
              }
            }
            frontmatter {
              affiliate_link
              title
            }
          }
        }
        section {
          title
          body
          products {
            product_relation {
              externalImage {
                childImageSharp {
                  fixed(width: 200, height: 200) {
                    ...GatsbyImageSharpFixed
                  }
                }
              }
              frontmatter {
                affiliate_link
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
`

export default CategoryTemplate
