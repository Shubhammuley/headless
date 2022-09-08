import { Link } from "gatsby";
import React, { useEffect, useState } from "react";
import useBrandDetails from "../../hooks/use-brand-details";

function ProductCard({ productDetails }) {
  const result = useBrandDetails(productDetails.brand_id);
  // console.log(result)
  return (
    <div className="Product-card">
      <div className="card-inner">
        <div className="card-figure">
          <Link to={`/products${productDetails.custom_url.url}`}>
            <div className="card-img-container">
              <img
                src={productDetails.image || "https://www.junglescout.com/wp-content/uploads/2021/01/product-photo-water-bottle-hero.png"}
                width="224"
                alt={productDetails.name}
                height="224"
              />
            </div>
          </Link>
        </div>
        <div className="card-body">
          <div className="card-body-inn">
            <p className="card-text brand-name">{result.name}</p>
            <h4 className="card-title"><Link to={`/products${productDetails.custom_url.url}`}>{productDetails.name}</Link></h4>
            <div className="card-text price-block">
              <div className="price-section"><span className="price">{productDetails.price.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
              })}</span></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default ProductCard;
