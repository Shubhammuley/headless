import { graphql, useStaticQuery } from "gatsby";

const useAllHomePageSlider = () => {
  const {
    allContentfulAsset: { nodes },
  } = useStaticQuery(graphql`
  query MyQuery {
    allContentfulAsset(filter: {title: {eq: "home-page-slider"}}) {
      nodes {
          title
          publicUrl
          file {
            url
          }
        }
    }
  }
  `);
  return nodes;
};

export default useAllHomePageSlider;
