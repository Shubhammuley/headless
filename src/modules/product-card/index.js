import { Link } from "gatsby";
import React, { useEffect, useState } from "react";
import useBrandDetails from "../../hooks/use-brand-details";

function ProductCard({ productDetails }) {
  const result = useBrandDetails(productDetails.brand_id);
  // console.log(result)
  return (
    <div className="Product-card">
      <img
        src="https://www.junglescout.com/wp-content/uploads/2021/01/product-photo-water-bottle-hero.png"
        width="224"
        alt={productDetails.name}
        height="224"
      />
      <p><Link to={`/products${productDetails.custom_url.url}`}>{productDetails.name}</Link></p>
      <p>
        {productDetails.price.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
        })}
      </p>
    </div>
  );
}

export default ProductCard;
