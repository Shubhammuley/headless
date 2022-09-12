import React from 'react'
import Categories from '../../templates/categories';

function CategoriesPage(props) {
  console.log(props)
  const categoryId = props.category_slug;  
  return <Categories location={props.location} categoryId={parseInt(categoryId)} />
}

export default CategoriesPage