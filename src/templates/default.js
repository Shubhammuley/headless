import React from "react";
import { Breadcrumb, Layout, Menu } from "antd";
import RootElement from "../components/base-layout";
import { renderRichText } from "gatsby-source-contentful/rich-text";
import { Link } from "gatsby";
const { Content, Sider } = Layout;

function Default({ pageContext, location }) {
  const { contentfulPage, allNodes } = pageContext;
  const breadCrumbs = location?.pathname?.split("/");

  const sideBar = {
    label: "Quick Links",
    children: allNodes
      .filter((item) => item.navigation === "topNavigation")
      .map((item, index) => {
        const key = String(index + 1);
        const returnObj = {
          key: `sub${key}`,
          label: <Link to={`/${item.pageUrl}`}>{item.title}</Link>,
        };
        const children =
          item.sublink &&
          item.sublink.length &&
          item.sublink.map((item, index) => {
            return {
              key: `child${key}`,
              label: <Link to={`/${item.pageUrl}`}>{item.title}</Link>,
            };
          });
        returnObj.children = children;
        return {
          ...returnObj,
        };
      }),
  };
  return (
    <>
      <RootElement>
        <Content>
          <Sider className="site-layout-background" width={200}>
            <Menu
              mode="inline"
              // defaultSelectedKeys={['1']}
              // defaultOpenKeys={['sub1']}
              style={{
                height: "100%",
              }}
              items={[sideBar]}
            />
          </Sider>
          <Breadcrumb
            style={{
              margin: "16px 0",
            }}
          >
            {breadCrumbs.map((item) => {
              let title = item ? item : "Home";
              if (item === contentfulPage.pageUrl) {
                title = contentfulPage.title;
              }
              return (
                <Breadcrumb.Item>
                  <Link to={`/${item}`}>{title}</Link>
                </Breadcrumb.Item>
              );
            })}
          </Breadcrumb>
          <div className="site-layout-content">
            <h1>{contentfulPage.title}</h1>
            {renderRichText(contentfulPage.pageContent, {})}
          </div>
        </Content>
      </RootElement>
    </>
  );
}

export default Default;

export const Head = ({ pageContext }) => {
  const { contentfulPage } = pageContext;
  return <title>{contentfulPage.title}</title>;
};
