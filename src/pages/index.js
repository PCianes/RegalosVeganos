import React from 'react'
import { graphql, Link } from 'gatsby'
import Img from 'gatsby-image'

import Layout from '../components/layout'
import SEO from '../components/seo'

import '../style/normalize.css'
import '../style/all.scss'

const Index = ({ data }) => {
  const { title, intro, section } = data.home.fields.html
  return (
    <Layout title={data.site.siteMetadata.title}>
      <SEO
        lang="es"
        title="Regalos Veganos"
        keywords={[
          `veganos`,
          `regalos veganos`,
          `veganismo`,
          `vegan`,
          `tienda veganos`,
        ]}
      />
      <header className="post-content post-content-header">
        <h1 className="post-content-title">{title}</h1>
        <div
          className="post-content-body"
          dangerouslySetInnerHTML={{ __html: intro }}
        />
      </header>
      {section.length > 0 &&
        section.map(({ name, intro, category }) => {
          return (
            <section>
              <div className="post-content">
                <h2>{name}</h2>
                <div
                  className="post-content-body"
                  dangerouslySetInnerHTML={{ __html: intro }}
                />
              </div>
              <div className="row">
                {category.length > 0 &&
                  category.map(({ relation, intro, image }) => {
                    return (
                      <article
                        className="col post-content home product-card shadow"
                        style={{ textAlign: 'center' }}
                      >
                        <Link class="post-card-link" to={relation.fields.slug}>
                          <h3>{relation.frontmatter.title}</h3>
                        </Link>
                        <Link class="post-card-link" to={relation.fields.slug}>
                          <Img
                            className="kg-image"
                            fluid={image.childImageSharp.fluid}
                          />
                        </Link>
                        <p
                          dangerouslySetInnerHTML={{ __html: intro }}
                          style={{ padding: '25px' }}
                        ></p>
                      </article>
                    )
                  })}
              </div>
            </section>
          )
        })}
    </Layout>
  )
}

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
              relation {
                frontmatter {
                  title
                }
                fields {
                  slug
                }
              }
              intro
              image {
                childImageSharp {
                  fluid(maxHeight: 350) {
                    ...GatsbyImageSharpFluid
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

export default Index
