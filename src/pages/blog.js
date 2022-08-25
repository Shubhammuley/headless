import React from "react";
import { Breadcrumb, Layout, Menu } from "antd";
import { UserOutlined, CalendarOutlined } from "@ant-design/icons";
import { Link } from "gatsby";
import { renderRichText } from "gatsby-source-contentful/rich-text";
import moment from "moment";
import RootElement from "../components/base-layout";
import useAllBlogPost from "../hooks/use-all-blog-post";

const { Content } = Layout;

const getFormatedDate = (date) => {
  return date ? moment(date).format("Do MMM YYYY") : moment().format();
};

const getBlogDescription = (description) => {
  return renderRichText(description)[0].props.children;
};

function BlogPost({ location }) {
  const breadCrumbs = location?.pathname?.split("/");
  const allBlogPost = useAllBlogPost();
  const url = [];

  return (
    <RootElement>
      <Content>
        <Breadcrumb
          style={{
            margin: "16px 0",
          }}
        >
          {breadCrumbs.map((item) => {
            if (item) {
              url.push(item);
            }
            let title = item ? "Blog" : "Home";
            return (
              <Breadcrumb.Item>
                <Link to={`/${url.join("/")}`}>{title}</Link>
              </Breadcrumb.Item>
            );
          })}
        </Breadcrumb>
        <div className="site-layout-content">
          <h1>Blog</h1>
          {allBlogPost &&
            allBlogPost.length &&
            allBlogPost.map((item, index) => {
              return (
                <div>
                  <img src={item.image.file.url} alt={item.image.title} />
                  <span>
                    <Link to={`/blog/${item.pageUrl}`}>{item.title}</Link>
                  </span>
                  <span>
                    <UserOutlined /> {item.createdBy} <CalendarOutlined />{" "}
                    {getFormatedDate(item.createdAt)}
                  </span>
                  <span
                    style={{
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      display: "block",
                      overflow: "hidden",
                      width: "500px",
                    }}
                  >
                    {getBlogDescription(item.description)}
                  </span>
                </div>
              );
            })}
        </div>
      </Content>
    </RootElement>
  );
}

export default BlogPost;

export const Head = () => {
  return (
    <>
      <title>Blog - Lifestyle Demo</title>
      <script type="text/javascript">console.log("hello")</script>
    </>
  );
};
