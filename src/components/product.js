import React from 'react'
import Img from 'gatsby-image'

function Product({ imageFluid, data: { title, affiliate_link } }) {
  return (
    <div className="col-3 product-card shadow" style={{ textAlign: 'center' }}>
      <a target="_blank" href={affiliate_link} rel="noreferrer">
        <Img fluid={imageFluid} className="kg-image" />
      </a>
      <a target="_blank" href={affiliate_link} rel="noreferrer">
        <blockquote>{title}</blockquote>
      </a>
    </div>
  )
}

export default Product
