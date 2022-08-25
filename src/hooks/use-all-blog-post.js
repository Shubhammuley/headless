import { graphql, useStaticQuery } from "gatsby";

const useAllBlogPost = () => {
  const {
    allContentfulBlog: { nodes },
  } = useStaticQuery(graphql`
    query AllBlog {
      allContentfulBlog(sort: { fields: updatedAt, order: DESC }, filter: {}) {
        nodes {
          createdBy
          createdAt
          pageUrl
          title
          image {
            file {
              url
            }
          }
          description {
            raw
          }
        }
      }
    }
  `);
  return nodes;
};

export default useAllBlogPost;
