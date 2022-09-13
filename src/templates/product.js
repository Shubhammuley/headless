import React, { useEffect, useMemo, useState } from 'react';
import { Link, navigate, graphql } from 'gatsby';
import { Carousel } from "antd";
import {
  ReadOutlined,
  SafetyOutlined,
  PlaySquareOutlined,
  HeartOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Rate, Collapse, Form, Row, Col, Button  } from "antd";
// import AddToCartButton from '../components/bigcommerce/AddToCartButton';
// import ProductPrices from '../components/bigcommerce/ProductPrices';
import RootElement from '../components/base-layout';
import AddToCartForm from '../modules/addToCart';
import { getProductList, addProductToCart, createCart } from '../service';
import ProductCard from '../modules/product-card';
import DefaultLoader from '../components/PageLoading/DefaultLoader';
import WishListModal from '../modules/wishlist-modal';
import CartConfirmationModal from '../modules/addToCart/confirmation-modal';
import { useCookies } from "react-cookie";
const { Content } = Layout;
const { Panel } = Collapse;

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

function ProductDetails({
  pageContext,
  location,
  data
}) {
  // console.log(data)
  const [cookies, setCartCookie] = useCookies(["cartId"]);
  const hasCartIdCookie = cookies.hasOwnProperty('cartId');
  const [form] = Form.useForm();
  // const [product, setProduct] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedImage, updateSelectedImage] = useState();
  const [selectedVideo, setSelectedVideo] = useState();
  // const [relatedProducts, setRelatedProducts] = useState([]);
  const [addToCartLoading, setAddtoCartLoadding] = useState(false);
  const [showCartConfirmation, setCartConfirmation] = useState(false);
  const [cartDetails, setCartDetails] = useState(null);

  const product = useMemo(() => pageContext.productDetails, [pageContext]);
  const relatedProducts = useMemo(() => data.allBigCommerceProducts.nodes, [data])
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

  const addProductToWishList = () => {
    const user = localStorage.getItem('loggedUserBc');
    if (!user || user === 'null' || user === 'undefined') {
      navigate('/login', { state: location.pathname });
    } else {
      setShowModal(true);
    }
  }

  const closeModal = () => {
    setShowModal(false);
  }

  const onAddToCart = async (value) => {
    try {
      setAddtoCartLoadding(true);
      const data = {
        line_items: [
          { quantity: value.quantity || product.order_quantity_minimum || 1, product_id: pageContext.productId }
        ]
      }
      const cartId = localStorage.getItem("cartId");
      if (cartId && cartId !== 'null') {
        const response = await addProductToCart(data, cartId);
        setCartDetails(response.data);
      } else {
        const response = await createCart(data);
        // setCartCookie('cartId',response.data.id, { path: '/', expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString()});
        localStorage.setItem("cartId", response.data.id);
        console.log(response)
        setCartDetails(response.data);
      }
      setAddtoCartLoadding(false);
      setCartConfirmation(true);
    } catch (e) {
      setAddtoCartLoadding(false);
      console.log(e)
    }
  }

  const onCartConfirmationClose = () => {
    setCartDetails(null);
    setCartConfirmation(false);
  }
  useEffect(() => {
    (async () => {
      // const result = await getProductList({ id: pageContext.productId })
      if (product) {
        const productDetail = product;
        // setProduct(productDetail);
        updateSelectedImage(productDetail.images && productDetail.images.length && productDetail.images[0].url_standard);
        setSelectedVideo(productDetail.videos && productDetail.videos.length && productDetail.videos[0]);
        // const productList = await getProductList({ idIn: JSON.stringify(productDetail.related_products) })
        // setRelatedProducts(productList.data);
      }
      setLoading(false);
    })();
  }, [product]);


  // const {
  //   images,
  //   name,
  //   custom_url,
  //   page_title,
  //   price,
  //   reviews_rating_sum,
  //   upc,
  //   sku,
  //   is_free_shipping,
  //   fixed_cost_shipping_price,
  //   weight,
  //   options,
  //   description,
  //   warranty,
  //   videos,
  //   related_products,
  // } = product;


  const field = useMemo(() => {
    return product.options && product.options.map((item) => {
      return {
        name: item.display_name,
        type: item.type,
        label: item.display_name,
        options: item.option_values.map((option) => {
          return {
            name: option.label,
            value: option.id,
            valueData: option.value_data,
          }
        }),
        renderbox: (option) => {
          if (option.valueData) {
            if (option.valueData.colors && option.valueData.colors.length) {
              return option.valueData.colors.map((color) => <span style={{ color, width: "34px", height: "34px" }} />);
            }
            return option.name;
          }
          return option.name;
        },
        rules: [{ required: true, message: `${item.display_name} is required.` }]
      }
    });
  }, [product])

  return (
  <>
    <RootElement>
      <Content>
      <div className='container'>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to={`/`}>Home</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {loading ? <DefaultLoader /> : <Link to={`/products${product.custom_url && product.custom_url.url}`}>{product.page_title || product.name}</Link>}
          </Breadcrumb.Item>
        </Breadcrumb>
        <div className='site-content'>
        
          { loading ? <div>
            <DefaultLoader />
          </div> : <div>
            <div className='productView'>
            <section className='product-images productView-images'>
              <div className='productView-image-main'>
                <figure className='productView-image'>
                  <div className='productView-img-container bc-product__gallery'>
                  <img
                  src={
                    (selectedImage && selectedImage)
                  }
                  alt="Main"
                  style={{ objectFit: 'contain' }}
                />
                  </div>
                </figure>
              </div>
              <ul className='productView-thumbnails '>
              {product.images && product.images.length &&
                    product.images.map(img => (
                <li>
                  <img
                        height="100px"
                        width="100px"
                        src={img.url_thumbnail}
                        alt="Thumb"
                        key={JSON.stringify(img)}
                        onMouseEnter={() => updateSelectedImage(img.url_standard)}
                        onClick={() => updateSelectedImage(img.url_standard)}
                      />
                </li>
                ))}
              </ul>
             </section>
             <section className='product-details productView-details'>
              <div className='productView-product'>
                <h1 className='product-title productView-title'>{product.page_title || product.name}</h1>
                <Row className='price-block' justify="space-between">
                  <Col className='price-left productView-price'>
                    <div className='price-section'><span className='price'>{product.price && product.price.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 0,
                    })}</span></div>
                  </Col>
                  <Col className='product-rating'>
                    <Rate value={product.reviews_rating_sum} allowHalf disabled />({product.reviews_rating_sum})
                  </Col>
                </Row>
                <ul className='productView-info'>
                  <li><span className='productView-info-name sku-label'>SKU: </span><span className='productView-info-value'>{product.sku}</span></li>
                  {product.upc ? <li><span className='productView-info-name'>UPC: </span><span className='productView-info-value'>{product.upc}</span></li> : null}
                  <li><span className='productView-info-name'>Weight: </span><span className='productView-info-value'>{product.weight}</span></li>
                  <li><span className='productView-info-name'>Shipping: </span><span className='productView-info-value'>{product.is_free_shipping ? 'Free Shipping' : product.fixed_cost_shipping_price && product.fixed_cost_shipping_price.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 0,
                  })}</span></li>
                </ul>
              </div>
            </section>
            <section className='product-details productView-details add-to-cart'>
              <div>
                {product && !product.inventory_level ? <span>Out of stock</span> : null}
                <AddToCartForm buttonLoading={addToCartLoading} form={form} fields={field} onSubmit={onAddToCart} outOfStock={product && !product.inventory_level} minQuantity={product.order_quantity_minimum} maxQuantity={product.order_quantity_maximum} inventory={product.inventory_level} />
                <Button onClick={addProductToWishList}><HeartOutlined /></Button>
              </div>
            </section>
            <div className='product-details productView-description'>
              <Collapse defaultActiveKey={['1']} expandIconPosition="end" expandIcon={({ isActive }) => <DownOutlined rotate={isActive ? 180 : 0} />}>
                <Panel header={<><ReadOutlined /> Product Description</>} key="1">
                  <p>{product.description}</p>
                </Panel>
                {
                  product.warranty ? (
                    <Panel header={<><SafetyOutlined /> Warrant Information</>} key="2">
                      <p>{product.warranty}</p>
                    </Panel>
                  ) : null
                }
                {
                  product.videos && product.videos.length ? <>
                    <Panel header={<><PlaySquareOutlined /> Videos</>} key="3">
                      <div className='video-section'>
                        <div className='full-video'>
                          {
                            selectedVideo && selectedVideo.type === 'youtube' ? (
                              <iframe id="player" className='lazyloaded' type="text/html" width="100%" height="100%" frameBorder="0" webkitAllowFullscreen="" allowFullScreen="" src={`https://www.youtube.com/embed/${selectedVideo.video_id}`} data-video-player="" />
                            ) : null
                          }
                        </div>
                        <div className='video-list'>
                          <ul>
                            {
                              product.videos.map((video) => {
                                if (video.type === 'youtube') {
                                  return (
                                    <li onClick={() => setSelectedVideo(video)} className={`${video.id === selectedVideo.id ? "selected-video" : "not-selected"}`} key={video.id}>
                                      <div>
                                        <img class="lazyautosizes lazyloaded" data-sizes="auto" src={`//i.ytimg.com/vi/${video.video_id}/default.jpg`} sizes="120px" />
                                        <div>
                                          <h5>{video.title}</h5>
                                          <p style={{
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            display: 'block',
                                            overflow: 'hidden',
                                            width: '800px'
                                          }}>{video.description}</p>
                                        </div>
                                      </div>
                                    </li>
                                  )
                                }
                              })
                            }
                          </ul>
                        </div>
                      </div>
                    </Panel></> : null
                }
                {/* <Panel header="This is panel header 2" key="2">
                  <p>{text}</p>
                </Panel>
                <Panel header="This is panel header 3" key="3">
                  <p>{text}</p>
                </Panel> */}
              </Collapse>

            </div>
            </div>
            

            
            <div className='related-products m-t-50'>
            
              {
                relatedProducts && relatedProducts.length ? (<>
                  <div class="section-title">
                    <h2 class="page-heading">Related Products</h2>
                    <p class="page-sub-heading">Popular Trending Products</p>
                  </div>
                  <section className='product-view-card'>
                  <Carousel className="productCarousel" {...ProductSlider}>
                    {
                        relatedProducts.map((product) => (<ProductCard  productDetails={product}/>))
                      }
                    </Carousel>
                  </section>
                </>) : null
              }
            </div>
          </div>}
          {showModal ? <WishListModal isModalOpen={showModal} onClose={closeModal} productId={pageContext.productId} /> : null}
          {showCartConfirmation ? <CartConfirmationModal productId={pageContext.productId} isModalOpen={showCartConfirmation} cartDetails={cartDetails} onClose={onCartConfirmationClose} /> : null}
        </div>
        </div>
      </Content>
    </RootElement>
    </>
  );
};

export default ProductDetails;


export const query = graphql`
query BigCommercerRelatedProducts ($relatedProducts: [Int!]){
  allBigCommerceProducts(
      filter: {bigcommerce_id: {in: $relatedProducts}}
      sort: {fields: name, order: ASC}) {
    nodes {
      id
      name
      availability
      availability_description
      base_variant_id
      bigcommerce_id
      bin_picking_number
      brand_id
      calculated_price
      categories
      condition
      cost_price
      custom_fields {
        id
        name
        value
      }
      date_created
      custom_url {
        url
      }
      date_modified
      depth
      description
      fixed_cost_shipping_price
      gift_wrapping_options_type
      gtin
      height
      internal {
        content
        contentDigest
        contentFilePath
        fieldOwners
        description
        ignoreType
        mediaType
        owner
        type
      }
      inventory_level
      inventory_tracking
      inventory_warning_level
      is_condition_shown
      is_featured
      is_free_shipping
      is_preorder_only
      is_price_hidden
      is_visible
      layout_file
      map_price
      meta_description
      meta_keywords
      mpn
      open_graph_title
      open_graph_description
      open_graph_type
      open_graph_use_image
      open_graph_use_meta_description
      open_graph_use_product_name
      option_set_display
      option_set_id
      options {
        display_name
        id
        name
        option_values {
          id
          label
          is_default
          sort_order
        }
        product_id
        sort_order
        type
      }
      order_quantity_maximum
      order_quantity_minimum
      page_title
      preorder_message
      price
      price_hidden_label
      product_tax_code
      related_products
      reviews_count
      retail_price
      reviews_rating_sum
      sale_price
      search_keywords
      sku
      sort_order
      tax_class_id
      total_sold
      type
      upc
      variants {
        bin_picking_number
        calculated_price
        calculated_weight
        cost_price
        depth
        fixed_cost_shipping_price
        gtin
        height
        id
        image_url
        inventory_level
        inventory_warning_level
        is_free_shipping
        mpn
        map_price
        option_values {
          label
          id
          option_display_name
          option_id
        }
        price
        product_id
        purchasing_disabled
        purchasing_disabled_message
        retail_price
        sale_price
        sku
        sku_id
        upc
        weight
        width
      }
      view_count
      warranty
      weight
      width
    }
    pageInfo {
      currentPage
      hasNextPage
      hasPreviousPage
      itemCount
      pageCount
      perPage
      totalCount
    }
    sum(field: id)
    totalCount
  }
}  
`;
