import React, { Fragment, useEffect, useState } from "react";
import { Link } from "gatsby";
import axios from "axios";
import useTopNavigation from "../hooks/use-top-navigation";
import useBottomNavigation from "../hooks/use-bottom-navigation";
import { Menu, message } from "antd";
import "./base-component.css";
import image from "../logo/logo.webp";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DownOutlined,
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
  const [cookies, setCookie, removeCookie ] = useCookies(["SHOP_TOKEN"]);

  const [collapsed, setCollapsed] = useState(true);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('myCat', 'Tom');
    }
    const user = localStorage && localStorage.getItem('loggedUserBc');
    if(user) {
      console.log(cookies);
      console.log(user)
      setUserDetails(JSON.parse(user));
    }
  }, [cookies, typeof window]);
  // const location = useLocation();
  // console.log(location)
  const topNavigation = useTopNavigation();
  const bottomNavigation = useBottomNavigation();

  const onLogout = () => {
    removeCookie();
    localStorage.setItem('loggedUserBc', '');
    setUserDetails(null);
    openNotification("sucess", "Successfully logged out");
  }
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
      <div class="fixed-header">
        <div class="container">
          <nav>
            <ul id="nav">
              <li>
                {React.createElement(
                  collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                  {
                    className: "trigger",
                    onClick: () => setCollapsed(!collapsed),
                  }
                )}
                <Link to={"/"}>
                  <img src={image} />
                </Link>
              </li>
              {topNavigation.map((item, index) => {
                const { pageUrl, title, sublink } = item;
                return (
                  <li>
                    <Link to={`/${pageUrl}`}>
                      {title} {sublink && sublink.length && <DownOutlined />}
                    </Link>
                    {sublink && sublink.length ? (
                      <ul>
                        {sublink.map((link) => {
                          return (
                            <li>
                              <Link to={`/${link.pageUrl}`}>{link.title}</Link>
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}
                  </li>
                );
              })}
              { userDetails ? <><span>Hey, {userDetails.firstName} </span> <span onClick={onLogout}>Logout</span></> : <li>
                {/* <Button onClick={onLogin}>Login</Button> */}
                <Link to={'/login'}>Login</Link>
              </li>}
            </ul>
          </nav>
        </div>
      </div>
      <div
        class="container"
        style={{
          marginTop: "100px",
          marginBottom: "500px",
          paddingBottom: "200px",
        }}
      >
        {!collapsed && (
          <div>
            <Menu
              mode="inline"
              style={{
                height: "100%",
              }}
              items={[sideBar]}
            />
          </div>
        )}
        {children}
      </div>
      <div class="fixed-footer">
        <div class="container">
          <div>
            <span>Lorem ipsum dolor sit amet, consectetur, LA 62303</span>
            <span>
              <a href="tel:636-377-2140">636-377-2140</a>
            </span>
          </div>
          <h3>Quick Links</h3>
          <ul>
            {topNavigation.map((item, index) => {
              const { pageUrl, title } = item;
              return (
                <li>
                  <Link to={`/${pageUrl}`}>{title}</Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Fragment>
  );
};

export default RootElement;
