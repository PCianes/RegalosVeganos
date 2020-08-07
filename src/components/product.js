import React from 'react'
import Img from 'gatsby-image'

function Product({ imageFixed, data: { title, affiliate_link } }) {
  return (
    <div className="col-3" style={{ textAlign: 'center' }}>
      <a target="_blank" href={affiliate_link} rel="noreferrer">
        <Img fixed={imageFixed} className="kg-image shadow" />
        <blockquote>{title}</blockquote>
      </a>
    </div>
  )
}

export default Product
