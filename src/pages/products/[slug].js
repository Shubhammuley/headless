import React from 'react';
import ProductDetails from '../../templates/product';

function ProductDetailsPage(props) {
  console.log(props)
  return (
    <ProductDetails location={props.location} productId={props.slug}/>
  )
}

export default ProductDetailsPage