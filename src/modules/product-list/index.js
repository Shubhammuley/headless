import React from "react";
import ProductCard from "../product-card";

function ProductList({ productList }) {
  return (
    <div className="product-view-mode">
      <ul className="productGrid product-grid-view">
        {productList.map((item) => (
          <li className="product">
            <ProductCard productDetails={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductList;
