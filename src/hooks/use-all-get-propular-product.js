import { graphql, useStaticQuery } from 'gatsby';

const useGetPopularProduct = () => {
  const {
    allBigCommerceProducts: { nodes }
  } = useStaticQuery(graphql`
  query PopularProduct {
    allBigCommerceProducts(sort: {fields: reviews_count, order: DESC}) {
      nodes {
        id
        name
        availability
        availability_description
        base_variant_id
        bigcommerce_id
        bin_picking_number
        brand_id
        calculated_price
        categories
        condition
        cost_price
        custom_fields {
          id
          name
          value
        }
        date_created
        custom_url {
          url
        }
        date_modified
        depth
        description
        fixed_cost_shipping_price
        gift_wrapping_options_type
        gtin
        height
        internal {
          content
          contentDigest
          contentFilePath
          fieldOwners
          description
          ignoreType
          mediaType
          owner
          type
        }
        inventory_level
        inventory_tracking
        inventory_warning_level
        is_condition_shown
        is_featured
        is_free_shipping
        is_preorder_only
        is_price_hidden
        is_visible
        layout_file
        map_price
        meta_description
        meta_keywords
        mpn
        open_graph_title
        open_graph_description
        open_graph_type
        open_graph_use_image
        open_graph_use_meta_description
        open_graph_use_product_name
        option_set_display
        option_set_id
        options {
          display_name
          id
          name
          option_values {
            id
            label
            is_default
            sort_order
          }
          product_id
          sort_order
          type
        }
        order_quantity_maximum
        order_quantity_minimum
        page_title
        preorder_message
        price
        price_hidden_label
        product_tax_code
        related_products
        reviews_count
        retail_price
        reviews_rating_sum
        sale_price
        search_keywords
        sku
        sort_order
        tax_class_id
        total_sold
        type
        upc
        variants {
          bin_picking_number
          calculated_price
          calculated_weight
          cost_price
          depth
          fixed_cost_shipping_price
          gtin
          height
          id
          image_url
          inventory_level
          inventory_warning_level
          is_free_shipping
          mpn
          map_price
          option_values {
            label
            id
            option_display_name
            option_id
          }
          price
          product_id
          purchasing_disabled
          purchasing_disabled_message
          retail_price
          sale_price
          sku
          sku_id
          upc
          weight
          width
        }
        view_count
        warranty
        weight
        width
      }
      pageInfo {
        currentPage
        hasNextPage
        hasPreviousPage
        itemCount
        pageCount
        perPage
        totalCount
      }
      sum(field: id)
      totalCount
    }
  }  
  `);
  return nodes;
};

export default useGetPopularProduct;
