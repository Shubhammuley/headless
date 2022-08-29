import { graphql, useStaticQuery } from "gatsby";

const useBrandDetails = (brandId) => {
  const { bigCommerceBrands } = useStaticQuery(graphql`
    query BrandQuery {
      bigCommerceBrands(bigcommerce_id: { eq: 502 }) {
        id
        image_url
        bigcommerce_id
        name
        page_title
      }
    }
  `);
  return bigCommerceBrands;
};

export default useBrandDetails;
