import * as React from "react";
import moment from "moment";
import "antd/dist/antd.css";
import { Carousel } from "antd";
import { Col, Row } from 'antd';
import { UserOutlined, CalendarOutlined } from "@ant-design/icons";
import { renderRichText } from 'gatsby-source-contentful/rich-text'
import { Link } from "gatsby";
import RootElement from "../components/base-layout";
import useAllBlogPost from "../hooks/use-all-blog-post";
import useAllHomePageSlider from "../hooks/use-all-homepage-slider";
import useGetNewProduct from '../hooks/use-all-get-new-product';
import useGetPopularProduct from '../hooks/use-all-get-propular-product';
import useProductList from '../hooks/use-all-product-list';
import ProductCard from '../modules/product-card';
import Banner1 from '../images/banner-1.jpg';
import Banner2 from '../images/banner-2.jpg';
import Banner3 from '../images/banner-3.jpg';
import Banner4 from '../images/banner-4.jpg';
// import config from '../enviornment'
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
  const allProductList = useProductList().nodes;
  const allNewProduct = useGetNewProduct();
  const allPopularProduct = useGetPopularProduct();
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
        <div className="container">
        <div class="section-title">
          <h2 class="page-heading">Most Popular Products</h2>
          <p class="page-sub-heading">Popular Trending Products</p>
        </div>
        <div className="product-scroll-list">
        {allPopularProduct && allPopularProduct.length ? <>
        <Carousel className="productCarousel" {...ProductSlider}>
          {allPopularProduct.map((item) => <ProductCard productDetails = {item}/>)}
        </Carousel>
          </> : null}
        </div>
        </div>
        <div className="container">
        <div class="section-title">
          <h2 class="page-heading">New Products</h2>
          <p class="page-sub-heading">Popular Trending Products</p>
        </div>
        <div className="product-scroll-list">
        {allNewProduct && allNewProduct.length ? <>
        <Carousel className="productCarousel" {...ProductSlider}>
          {allNewProduct.map((item) => <ProductCard productDetails = {item}/>)}
        </Carousel>
          </> : null}
        </div>
        </div>
      </div>
      <div className="home-blog-post m-b-50">
        <div className="container">
        <div class="section-title">
          <h2 class="page-heading">Lifestyle Blog</h2>
          <p class="page-sub-heading">Discover our Style</p>
        </div>
        <div className="home-blog-list-wrap m-t-30 clearfix">
        <Row className="home-blog-list" gutter={30}>
        {allBlogPost &&
          allBlogPost.length &&
          allBlogPost.map((item, index) => {
            return (
          <Col span={8} >
            <div className="home-blog-item-inner">
              <div className="home-blog-img banner-hover">
              <Link to={`/blog/${item.pageUrl}`}>
              <img src={item.image.file.url} alt={item.image.title} />
              </Link>
              </div>
              <div className="home-blog-detail">
                <div className="home-blog-detail-inner">
                  <h4><Link to={`/blog/${item.pageUrl}`}>{item.title}</Link></h4>
                  <p>{getBlogDescription(item.description)}</p>
                  <div className="blog-date display-flex justify-content-start align-item-center">
                    <div className="author"><UserOutlined /><span>{item.createdBy}</span></div>
                    <div className="date"><CalendarOutlined /> <span>{getFormatedDate(item.createdAt)}</span></div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
          );
          })}
        </Row>
        </div>
        </div>
      </div>
    </RootElement>
  );
};

export default IndexPage;

export const Head = () => <title>Lifestyle Demo</title>;
