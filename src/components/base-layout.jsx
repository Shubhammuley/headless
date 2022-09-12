import React, { Fragment, useEffect, useState } from "react";
import { Link, navigate } from "gatsby";
import useTopNavigation from "../hooks/use-top-navigation";
import useBottomNavigation from "../hooks/use-bottom-navigation";
import { Menu, message, Input, Col, Row,Form,Button } from "antd";
import "./base-component.css";
import 'antd/dist/antd.css';
import "../assets/scss/theme.scss";
import { getProductList } from "../service";
import image from "../logo/logo.webp";
/*import { ReactComponent as IconUser } from '../assets/icons/user.svg';
import { ReactComponent as IconCompare } from '../assets/icons/compare.svg';
import { ReactComponent as IconSearch } from '../assets/icons/search.svg';
import { ReactComponent as IconCart } from '../assets/icons/cart.svg';*/
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DownOutlined,
  SearchOutlined,
  CloseOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useCookies } from "react-cookie";
// const { Sider } = Layout;


const openNotification = (type, messageText) => {
  if (type === "error" || type === "delete") {
    message.error(messageText);
  } else if (type === "warning") {
    message.info(messageText);
  } else {
    message.success(messageText);
  }
};
const RootElement = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["SHOP_TOKEN"]);

  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState(null);
  const [collapsed, setCollapsed] = useState(true);
  const [userDetails, setUserDetails] = useState(null);
  const [productList, setProductList] = useState([]);
  const [noProductFoundError, SetNotProductFoundError] = useState(false);
  // const [showSubNav, setShowSubNav] = useState('');

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("myCat", "Tom");
    }
    const user = localStorage && localStorage.getItem("loggedUserBc");
    if (user) {
      setUserDetails(JSON.parse(user));
    }
  }, [cookies, typeof window]);
  // const location = useLocation();
  // console.log(location)
  const topNavigation = useTopNavigation();
  const bottomNavigation = useBottomNavigation();

  const onLogout = () => {
    removeCookie();
    localStorage.setItem("loggedUserBc", "");
    setUserDetails(null);
    openNotification("sucess", "Successfully logged out");
  };
  const handleToggle = () => {
    setCollapsed(!collapsed);
  };
  const onCloseSearch = () => {
    setShowSearch(false);
    SetNotProductFoundError(false);
    setProductList([]);
  };


  const onSearch = (e) => {
    onCloseSearch();
    window.location.replace(`/search/?search_query=${encodeURIComponent(e.target.value)}`)
    console.log(e.target.value);
  };

  const searchOnChange = async (e) => {
    setSearchText(e.target.value);
    if (e.target.value && e.target.value.length >= 3) {
      try {
        const product = await getProductList({ keyword: e.target.value });
        setProductList(product.data || []);
        if (!product.data || !product.data.length) {
          SetNotProductFoundError(true);
        } else {
          SetNotProductFoundError(false);
        }
      } catch (e) {
        SetNotProductFoundError(true);
        console.log(e);
      }
    } else {
      SetNotProductFoundError(false);
      setProductList([]);
    }
  };
  const sideBar = {
    label: "Quick Links",
    children: topNavigation.map((item, index) => {
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
    
    <Fragment>
      <div class="fixed-header header">
        <div class="container" >
          <Row align="middle">
            <Col className="gutter-row" span={6}>
              <div className="header-left">
                <div class="desktop_mobile_menu">
                  <a class="trigger" href="javascript:void(0);" onClick={handleToggle}>
                    <span class="otherlinks-line-1"></span>
                    <span class="otherlinks-line-2"></span>
                    <span class="otherlinks-line-3"></span>
                    <span class="otherlinks-line-4"></span>
                  </a>
                </div>
                <Link to={"/"}>
                  <img src={image} />
                </Link>
              </div>
            </Col>
            <Col className="gutter-row header-center" span={12}>
              <nav>
              <Menu mode="horizontal" popupOffset={[0, 100]}>

                  {showSearch ? (
                    <>
                      <div>
                        <Input
                          placeholder="Search the store"
                          onChange={searchOnChange}
                          onPressEnter={onSearch}
                        />
                        <span onClick={onCloseSearch}>
                          <CloseOutlined />
                        </span>
                        {productList && productList.length ? (
                          <div className="search-product-list">
                            <ul>
                              {productList.map((item) => {
                                return (
                                  <li>
                                    <div>
                                      <div>
                                        <Link
                                          to={`/products${item.custom_url.url}`}
                                        >
                                          <img
                                            src="https://www.junglescout.com/wp-content/uploads/2021/01/product-photo-water-bottle-hero.png"
                                            width="66"
                                            alt={item.name}
                                            height="66"
                                          />
                                        </Link>
                                      </div>
                                      <div>
                                        <p>
                                          <Link
                                            to={`/products${item.custom_url.url}`}
                                          >
                                            {item.name}
                                          </Link>
                                        </p>
                                        <p>
                                          {item.price.toLocaleString(
                                            "en-US",
                                            {
                                              style: "currency",
                                              currency: "USD",
                                              minimumFractionDigits: 0,
                                            }
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        ) : <>
                          {
                            noProductFoundError ? <span>0 product results for '{searchText}'</span> : null
                          }
                        </>}
                      </div>
                    </>
                  ) : (
                    <>
                      
                        {topNavigation.map((item, index) => {
                          const { pageUrl, title, sublink } = item;
                          
                          if (sublink && sublink.length) {
                            return (
                              <Menu.SubMenu key={`${title}-${index}`} title={<><Link to={`/${pageUrl}`} >
                                {title}{" "}
                                {sublink && sublink.length && <DownOutlined />}
                              </Link></>} >
                              {sublink.map((link, indexSub) => {
                                      return (
                                        <Menu.Item key={`${link.title}-${index}-${indexSub}`}>
                                          <Link to={`/${link.pageUrl}`}>
                                            {link.title}
                                          </Link>
                                        </Menu.Item>
                                      );
                                    })}
                              </Menu.SubMenu>
                            )
                          } else {
                            return (
                              <Menu.Item key={`${title}-${index}`}>
                                <Link to={`/${pageUrl}`}>
                                  {title}{" "}
                                </Link>
                              </Menu.Item>
                            )
                          }
                          
                          // return (
                          //   <li>
                          //     <div onMouseEnter={() => setShowSubNav(`${title}-${index}`)} onMouseLeave={() => setShowSubNav('')}>
                          //       <Link to={`/${pageUrl}`}>
                          //         {title}{" "}
                          //         {sublink && sublink.length && <DownOutlined />}
                          //       </Link>
                          //       {sublink && sublink.length && showSubNav === `${title}-${index}` ? (
                          //         <ul>
                          //           {sublink.map((link) => {
                          //             return (
                          //               <li>
                          //                 <Link to={`/${link.pageUrl}`}>
                          //                   {link.title}
                          //                 </Link>
                          //               </li>
                          //             );
                          //           })}
                          //         </ul>
                          //       ) : null}
                          //     </div>
                          //   </li>
                          // );
                        })}
                </>
              )}
            </Menu>
          </nav>
          </Col>
          <Col className="gutter-row" span={6}>
          <Menu mode="horizontal">
            <Menu.SubMenu title={<><UserOutlined /></>}>
              {userDetails ? (
                <>
                <Menu.Item>
                  <Link to=''>My Account</Link>
                </Menu.Item>
                  <Menu.Item><span onClick={onLogout}>Logout</span></Menu.Item>
                </>
              ) : (
                <>
                <Menu.Item>
                  {/* <Button onClick={onLogin}>Login</Button> */}
                  <Link to={"/login"}>Login</Link>
                </Menu.Item>
                <Menu.Item>
                  <Link to=''>Register</Link>
                </Menu.Item>
                </>
              )}
              <Menu.Item>
                  <Link to=''>Gift Certificates</Link>
                </Menu.Item>
                <Menu.Item>
                  <Link to=''>Wishlist</Link>
                </Menu.Item>
            </Menu.SubMenu>
            <Menu.Item><span onClick={() => setShowSearch(true)}><SearchOutlined /></span></Menu.Item>
          </Menu>
          </Col>
        </Row>
          
        </div>
      </div>
      
          <div className={!collapsed ? "nav-bar collapsed" : "nav-bar"}>
            <Menu
              mode="inline"
              style={{
                height: "100%",
              }}
              items={[sideBar]}
            />
          </div>
          <div onClick={()=> setCollapsed(true)}>
          {children}
          </div>
          <footer className="footer">
              <div className="footer-info-inn">
                <div className="container">
                  <Row className="footer-info" gutter={20}>
                    <Col span={4} className='footer-info-col footer-info-col--small footer-store-info'>
                      <p><span>Lorem ipsum dolor sit amet,{'\n'}consectetur, LA 62303</span></p>
                      <p><span><a href="tel:636-377-2140">636-377-2140</a></span></p>
                    </Col>
                    <Col span={4} className='footer-info-col footer-info-col--small'>
                      <div className="footer-info--col-inn">
                      <h5 class="footer-info-heading footer-toggle-title">Quick Links</h5>
                      <div className="footer-toggle-content">
                      <Menu className="footer-info-list">
                      {topNavigation.map((item, index) => {
                        const { pageUrl, title } = item;
                        return (
                          <Menu.Item>
                            <Link to={`/${pageUrl}`}>{title}</Link>
                          </Menu.Item>
                        );
                      })}
                      </Menu>
                      </div>
                      </div>
                      
                    </Col>
                    <Col span={4} className='footer-info-col footer-info-col--small'>
                      <div className="footer-info--col-inn">
                      <h5 class="footer-info-heading footer-toggle-title">Popular Brands</h5>
                      <div className="footer-toggle-content">
                      <Menu className="footer-info-list">
                        <Menu.Item><Link to=''>OFS</Link></Menu.Item>
                        <Menu.Item><Link to=''>Common Good</Link></Menu.Item>
                        <Menu.Item className="view-all"><Link to=''>View All</Link></Menu.Item>
                      </Menu>
                      </div>
                      </div>
                    </Col>
                    <Col span={4} className='footer-info-col footer-info-col--small'>
                      <div className="footer-info--col-inn">
                      <h5 className="footer-info-heading footer-toggle-title">Categories</h5>
                      <div className="footer-toggle-content">
                      <Menu className="footer-info-list">
                        <Menu.Item><Link to=''>Women</Link></Menu.Item>
                        <Menu.Item><Link to=''>Men</Link></Menu.Item>
                        <Menu.Item><Link to=''>Kids</Link></Menu.Item>
                        <Menu.Item><Link to=''>Accessories</Link></Menu.Item>
                        <Menu.Item className="view-all"><Link to=''>View All</Link></Menu.Item>
                      </Menu>
                      </div>
                      </div>
                    </Col>
                  </Row>
                  <Row className="footer-mid-section" gutter={20}>
                  <Col span={8} className='footer-info-col footer-info-col--social footer-info-col--left'><h5 class="footer-info-heading">Connect With Us</h5></Col>
                  <Col span={16} className='footer-info-col footer-info-newsletter'>
                    <div className="footer-info-newsletter-inn">
                    <h5 className="footer-info-heading">Sign Up for our Newsletter</h5>
                    <Form wrapperCol={{ span: 32 }} initialValues={{ remember: true }}>
                    <Form.Item name="nl_email" rules={[{ required: true, message: 'Please input your email!' }]}>
                      <Input className="form-input" placeholder="Join our Newsletter..." />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" className='button button--primary'>Submit</Button>
                    </Form.Item>
                    </Form>
                    </div>
                  </Col>
                  <Col span={8} className='footer-info-col footer-info-col--payment'></Col>
                  </Row>
                </div>
              </div>
              <div className="footer-bar">
                <div className="container">
                  <div className="footer-bar-inn">
                    <div className="footer-copyright"><p className="powered-by"><span>© 2022</span><span className="theme-color">LifeStyle Default</span> <span className="line">|</span><span className="bigcommerce">Powered by <Link href='https://www.bigcommerce.com/?utm_source=lifestyle&amp;utm_medium=poweredbyBC' target="_blank">BigCommerce</Link><span className="line">|</span></span><Link className="site-map" href="/sitemap.php">Sitemap</Link></p></div>
                    <div className="footer-copyright">
                    <p class="powered-by">BigCommerce Theme by <Link class="theme-red-color" href="https://www.1center.co/" rel="nofollow" target="_blank">1Center</Link></p>
                    </div>
                  </div>
                </div>
              </div>
          </footer>
    </Fragment>
  );
};

export default RootElement;
