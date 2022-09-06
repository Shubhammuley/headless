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
import Banner1 from '../images/banner-1.jpg';
import Banner2 from '../images/banner-2.jpg';
import Banner3 from '../images/banner-3.jpg';
import Banner4 from '../images/banner-4.jpg';
import config from '../enviornment'
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
console.log(config)

  const allBlogPost = useAllBlogPost();
  const allHomePageSlider = useAllHomePageSlider();
  const allProductList = useProductList();
  // console.log(allProductList)
  const ProductSlider = {
    dots: false,
    arrows: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };
  return (
    <RootElement>
      <Carousel className="heroCarousel" autoplay arrows>
        {allHomePageSlider &&
          allHomePageSlider.length &&
          allHomePageSlider.map((item) => (
            <div style={contentStyle}>
              <img
                src={item.file.url}
                alt={item.title}
                style={{ width: "inherit" }}
              />
              <div data-animation-in="fadeIn" class="animated fadeIn heroCarousel-content">
                <h1 data-animation-in="slideInUp" class="animated slideInUp heroCarousel-title">SHOWCASE YOUR BRAND</h1>
                <p data-animation-in="slideInUp" class="animated slideInUp  heroCarousel-description">SLICK CAROUSEL DESIGN</p>
                    <span data-animation-in="slideInUp" class="animated slideInUp heroCarousel-action button button--primary button--large">
                      <span class="heroCarousel-action-inn">
                        Buy Now
                      </span>
                    </span>
            </div>
            </div>
          ))}
      </Carousel>
      <div className="promotional-banner m-b-60">
        <div className="container">
        <div className="grid-box">
          <div className="grid"><a href=""><img src={Banner1} /></a></div>
          <div className="grid"><a href=""><img src={Banner2} /></a></div>
          <div className="grid"><a href=""><img src={Banner3} /></a></div>
          <div className="grid"><a href=""><img src={Banner4} /></a></div>
        </div>
        </div>
      </div>
      <div className="product-list product-section m-b-40">
        <div className="container">
        <div class="section-title">
          <h2 class="page-heading">Featured Products</h2>
          <p class="page-sub-heading">Popular Trending Products</p>
        </div>
        <div className="product-scroll-list">
        {allProductList && allProductList.length ? <>
        <Carousel className="productCarousel" {...ProductSlider}>
          {allProductList.map((item) => <ProductCard productDetails = {item}/>)}
        </Carousel>
          </> : null}
        </div>
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
