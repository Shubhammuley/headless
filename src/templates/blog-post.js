import React from "react";
import { Breadcrumb, Layout } from "antd";
import { Link } from "gatsby";
import moment from "moment";
import { renderRichText } from "gatsby-source-contentful/rich-text";
import RootElement from "../components/base-layout";

const { Content } = Layout;

const getBreadCrumTitle = (string) => {
  if (!string) {
    return "Home";
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const getFormatedDate = (date) => {
  return date ? moment(date).format("Do MMM YYYY") : moment().format();
};

function BlogPost({ pageContext, location }) {
  const { contentfulPage } = pageContext;
  const breadCrumbs = location?.pathname?.split("/");
  console.log(breadCrumbs);
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
            let title = item ? getBreadCrumTitle(item) : "Home";
            if (item === contentfulPage.pageUrl) {
              title = contentfulPage.title;
            }
            return (
              <Breadcrumb.Item>
                <Link to={`/${url.join("/")}`}>{title}</Link>
              </Breadcrumb.Item>
            );
          })}
        </Breadcrumb>

        <div className="site-layout-content">
          <div>
            <img
              src={contentfulPage.image.file.url}
              alt={contentfulPage.title}
            />
          </div>
          <h1>{contentfulPage.title}</h1>
          <span>
            {contentfulPage.createdBy} on{" "}
            {getFormatedDate(contentfulPage.createdAt)}
          </span>
          {renderRichText(contentfulPage.description, {})}
        </div>
      </Content>
    </RootElement>
  );
}

export default BlogPost;

export const Head = ({ pageContext }) => {
  const { contentfulPage } = pageContext;
  return <title>{contentfulPage.title}</title>;
};
