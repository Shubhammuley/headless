import React, { useEffect, useMemo, useState } from 'react';
import { Link, navigate } from 'gatsby';
import {
  ReadOutlined,
  SafetyOutlined,
  PlaySquareOutlined,
  HeartOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Rate, Collapse, Form, Button } from "antd";
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

function ProductDetails({
  pageContext,
  location
}) {
  const [cookies, setCartCookie] = useCookies(["cartId"]);
  const hasCartIdCookie = cookies.hasOwnProperty('cartId');
  const [form] = Form.useForm();
  const [product, setProduct] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedImage, updateSelectedImage] = useState();
  const [selectedVideo, setSelectedVideo] = useState();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [addToCartLoading, setAddtoCartLoadding] = useState(false);
  const [showCartConfirmation, setCartConfirmation] = useState(false);
  const [cartDetails, setCartDetails] = useState(null);

  const addProductToWishList = () => {
    const user = localStorage.getItem('loggedUserBc');
    if(!user || user === 'null' || user === 'undefined') {
      navigate('/login', {state: location.pathname }); 
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
      if(cartId && cartId !== 'null') {
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
    } catch(e) {
      setAddtoCartLoadding(false);
      console.log(e)
    }
  }

  const onCartConfirmationClose = () => {
    setCartDetails(null);
    setCartConfirmation(false);
  }
  useEffect(()=> {
    (async () => {
      const result = await getProductList({ id: pageContext.productId })
      if(result && result.data && result.data.length) {
        const productDetail = result.data[0];
        setProduct(productDetail);
        updateSelectedImage(productDetail.images && productDetail.images.length && productDetail.images[0].url_standard);
        setSelectedVideo(productDetail.videos && productDetail.videos.length && productDetail.videos[0]);
        const productList = await getProductList({ idIn: JSON.stringify(productDetail.related_products) })
        setRelatedProducts(productList.data);
      }
      setLoading(false);
    })();
  }, [pageContext]);

  
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
    <RootElement>
      <Content>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to={`/`}>Home</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
          {loading? <DefaultLoader /> : <Link to={`/products${product.custom_url && product.custom_url.url}`}>{product.page_title || product.name}</Link>}
          </Breadcrumb.Item>
        </Breadcrumb>
        <div className='site-content'>
          { loading ? <div>
            <DefaultLoader />
          </div> : <div>
            <section className='product-images'>
              <div className="bc-product__gallery">
                <img
                  src={
                    (selectedImage && selectedImage)
                  }
                  alt="Main"
                  style={{ objectFit: 'contain' }}
                />
                <div
                  style={{
                    display: 'flex',
                    cursor: 'pointer',
                  }}>
                  {product.images && product.images.length ?
                    product.images.map(img => (
                      <img
                        height="100px"
                        width="100px"
                        src={img.url_thumbnail}
                        alt="Thumb"
                        key={JSON.stringify(img)}
                        onMouseEnter={() => updateSelectedImage(img.url_standard)}
                        onClick={() => updateSelectedImage(img.url_standard)}
                      />
                    )) : null }
                </div>
              </div>

            </section>
            <section className='product-details'>
              <div>
                <h1 className='product-title'>{product.page_title || product.name}</h1>
                <div className='price-block'>
                  <div className='price-left'>
                    <div><span>{product.price && product.price.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 0,
                    })}</span></div>
                  </div>
                  <div className='product-rating'>
                    <Rate value={product.reviews_rating_sum} allowHalf disabled />({product.reviews_rating_sum})
                  </div>
                </div>
                <ul>
                  <li><span>SKU: </span><span>{product.sku}</span></li>
                  {product.upc ? <li><span>UPC: </span><span>{product.upc}</span></li> : null}
                  <li><span>Weight: </span><span>{product.weight}</span></li>
                  <li><span>Shipping: </span><span>{product.is_free_shipping ? 'Free Shipping' : product.fixed_cost_shipping_price && product.fixed_cost_shipping_price.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 0,
                  })}</span></li>
                </ul>
              </div>
            </section>
            <section className='product-details add-to-cart'>
              <div>
                {console.log(product) }
                {product && !product.inventory_level ? <span>Out of stock</span> : null }
                <AddToCartForm buttonLoading={addToCartLoading} form={form} fields={field} onSubmit={onAddToCart} outOfStock={product && !product.inventory_level} minQuantity={product.order_quantity_minimum} maxQuantity={product.order_quantity_maximum} inventory={product.inventory_level} />
                <Button onClick={addProductToWishList}><HeartOutlined /></Button>
              </div>
            </section>

            <div className='product-details'>
              <Collapse defaultActiveKey={['1']} expandIconPosition="end">
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
            <div className='related-products'>
              {
                relatedProducts && relatedProducts.length ? (<>
                  <div className='relative-title'>
                    <h2>Related Products</h2>
                    <p>Popular Trending Products</p>
                  </div>
                  <section className='product-view-card'>
                    <div>
                      {
                        relatedProducts.map((product) => (<ProductCard  productDetails={product}/>))
                      }
                    </div>
                  </section>
                </>) : null
              }
            </div>
          </div>}
          {showModal ? <WishListModal isModalOpen={showModal} onClose={closeModal} productId={pageContext.productId}/> : null }
          {showCartConfirmation ? <CartConfirmationModal productId={pageContext.productId} isModalOpen={showCartConfirmation} cartDetails={cartDetails} onClose={onCartConfirmationClose} /> : null}
        </div>
      </Content>
    </RootElement>
  );
};

export default ProductDetails;


// export const query = graphql`
//     query($productId: String!) {
//       bigCommerceProducts(id: {eq: $productId}) {
//         id
//         availability
//         availability_description
//         base_variant_id
//         bigcommerce_id
//         bin_picking_number
//         brand_id
//         calculated_price
//         categories
//         condition
//         cost_price
//         custom_fields {
//           id
//           name
//           value
//         }
//         date_created  
//         date_modified
//         depth
//         description
//         fixed_cost_shipping_price
//         gift_wrapping_options_type
//         gtin
//         height
//         inventory_level
//         inventory_tracking
//         is_condition_shown
//         inventory_warning_level
//         is_featured
//         is_preorder_only
//         is_free_shipping
//         is_price_hidden
//         is_visible
//         layout_file
//         map_price
//         meta_description
//         mpn
//         name
//         options {
//           display_name
//           name
//           id
//           option_values {
//             id
//             is_default
//             label
//             sort_order
//             value_data {
//               colors
//             }
//           }
//           type
//           sort_order
//           product_id
//         }
//         meta_keywords
//         order_quantity_maximum
//         order_quantity_minimum
//         page_title
//         preorder_message
//         price
//         price_hidden_label
//         product_tax_code
//         related_products
//         retail_price
//         reviews_count
//         reviews_rating_sum
//         sale_price
//         search_keywords
//         sku
//         tax_class_id
//         sort_order
//         total_sold
//         type
//         upc
//         view_count
//         variants {
//           bin_picking_number
//           calculated_weight
//           calculated_price
//           cost_price
//           depth
//           fixed_cost_shipping_price
//           gtin
//           height
//           id
//           image_url
//           inventory_level
//           inventory_warning_level
//           is_free_shipping
//           map_price
//           option_values {
//             id
//             label
//             option_display_name
//             option_id
//           }
//           mpn
//           price
//           product_id
//           purchasing_disabled
//           purchasing_disabled_message
//           retail_price
//           sale_price
//           sku
//           upc
//           sku_id
//           weight
//           width
//         }
//         warranty
//         weight
//         width
//         images {
//           date_modified
//           url_standard
//           url_thumbnail
//           url_tiny
//           url_zoom
//           is_thumbnail
//           sort_order
//           product_id
//           description
//           id
//           image_file
//         }
//         custom_url {
//           is_customized
//           url
//         }
//         videos {
//           description
//           id
//           length
//           product_id
//           sort_order
//           title
//           type
//           video_id
//         }
//       }
//     }
    
// `;
