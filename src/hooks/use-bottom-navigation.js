import { graphql, useStaticQuery } from 'gatsby';

const useBottomNavigation = () => {
  const {
    allContentfulNavigation: { nodes }
  } = useStaticQuery(graphql`
    query BottomNavQuery {
      allContentfulNavigation(
        filter: { navigation: { eq: "bottomNavigation" } }
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

export default useBottomNavigation;
