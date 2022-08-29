import * as React from "react";
import moment from "moment";
import "antd/dist/antd.css";
import { Carousel } from "antd";
import { UserOutlined, CalendarOutlined } from "@ant-design/icons";
import { renderRichText } from 'gatsby-source-contentful/rich-text'
import { Link } from "gatsby";
import RootElement from "../components/base-layout";
import useAllBlogPost from "../hooks/use-all-blog-post";
import useAllHomePageSlider from "../hooks/use-all-homepage-slider";
import useProductList from '../hooks/use-all-product-list';
import ProductCard from '../modules/product-card';

const contentStyle = {
  height: "100px",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  background: "#364d79",
};

const getFormatedDate = (date) => {
  return date ? moment(date).format("Do MMM YYYY") : moment().format()
}

const getBlogDescription = (description) => {
  return renderRichText(description)[0].props.children;
}
const IndexPage = () => {
  const allBlogPost = useAllBlogPost();
  const allHomePageSlider = useAllHomePageSlider();
  const allProductList = useProductList();
  // console.log(allProductList)
  return (
    <RootElement>
      <Carousel autoplay>
        {allHomePageSlider &&
          allHomePageSlider.length &&
          allHomePageSlider.map((item) => (
            <div style={contentStyle}>
              <img
                src={item.file.url}
                alt={item.title}
                style={{ width: "inherit" }}
              />
            </div>
          ))}
      </Carousel>
      <div className="product-list">
        <h3>Featured Products</h3>
        <div className="product-scroll-list">
          {allProductList && allProductList.length ? <>
            {allProductList.map((item) => <ProductCard productDetails = {item}/>)}
          </> : null}
        </div>
      </div>
      <div>
        <h3>Lifestyle Blog</h3>
        {allBlogPost &&
          allBlogPost.length &&
          allBlogPost.map((item, index) => {
            return (
              <div>
                <img src={item.image.file.url} alt={item.image.title} />
                <span><Link to={`/blog/${item.pageUrl}`}>{item.title}</Link></span>
                <span><UserOutlined /> {item.createdBy} <CalendarOutlined /> {getFormatedDate(item.createdAt)}</span>
                <span style={{ 
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'block',
                  overflow: 'hidden',
                  width: '500px'
                }}>{getBlogDescription(item.description)}</span>
              </div>
            );
          })}
      </div>
    </RootElement>
  );
};

export default IndexPage;

export const Head = () => <title>Lifestyle Demo</title>;
