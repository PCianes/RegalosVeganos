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
      <header className="page-head">
        <h1 className="page-head-title">{title}</h1>
        <div
          className="post-content-body"
          dangerouslySetInnerHTML={{ __html: intro }}
        />
      </header>
      {section.length > 0 &&
        section.map(({ name, intro, category }) => {
          return (
            <section>
              <h2>{name}</h2>
              <div
                className="post-content-body"
                dangerouslySetInnerHTML={{ __html: intro }}
              />
              {category.length > 0 &&
                category.map(({ relation, intro, image }) => {
                  return (
                    <article className="post-content-body">
                      <Link class="post-card-link" to={relation.fields.slug}>
                        <h3>{relation.frontmatter.title}</h3>
                        <Img
                          className="kg-image"
                          fixed={image.childImageSharp.fixed}
                        />
                      </Link>
                      <p dangerouslySetInnerHTML={{ __html: intro }}></p>
                    </article>
                  )
                })}
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
  }
`

export default Index
