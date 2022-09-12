import React from 'react'
import Categories from '../../templates/categories';

function ChileCategories(props) {
  console.log(props)
  const categoryId = props['child-category'];  
  return <Categories location={props.location} categoryId={parseInt(categoryId)} />
}

export default ChileCategories