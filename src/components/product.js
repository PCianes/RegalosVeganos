import React from 'react'
import Img from 'gatsby-image'

function Product({ imageFixed, data: { title, affiliate_link } }) {
  return (
    <div>
      <p>{title}</p>
      <p>{affiliate_link}</p>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div style={{ width: '100%' }}>
          <a href="#">
            <Img fixed={imageFixed} />
          </a>
        </div>
      </div>
    </div>
  )
}

export default Product
