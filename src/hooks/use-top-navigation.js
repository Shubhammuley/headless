import { graphql, useStaticQuery } from 'gatsby';

const useTopNavigation = () => {
  const {
    allContentfulNavigation: { nodes }
  } = useStaticQuery(graphql`
    query TopNavQuery {
      allContentfulNavigation(
        filter: { navigation: { eq: "topNavigation" } }
        sort: { fields: title }
      ) {
        nodes {
          navigation
          openInNewTab
          pageContent {
            raw
          }
          pageUrl
          sublink {
            pageUrl
            template
            title
          }
          template
          title
          updatedAt
        }
      }
    }
  `);
  return nodes;
};

export default useTopNavigation;
