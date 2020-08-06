import React from "react";
import Image from "gatsby-image";

function Product({ data: { title, affiliate_link, thumbnail_link } }) {
  return (
    <div>
      <p>{title}</p>
      <p>{affiliate_link}</p>
      <img width="200px" src={thumbnail_link} alt={title} />
    </div>
  );
}

export default Product;
