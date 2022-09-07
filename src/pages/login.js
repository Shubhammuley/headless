import React, { useEffect } from "react";
import { Breadcrumb, Layout, message } from "antd";
import axios from "axios";
import RootElement from "../components/base-layout";
import { Link, navigate } from "gatsby";
import { Button, Form, Input } from "antd";
import { useCookies } from "react-cookie";

const { Content } = Layout;

const openNotification = (type, messageText) => {
  if (type === "error" || type === "delete") {
    message.error(messageText);
  } else if (type === "warning") {
    message.info(messageText);
  } else {
    message.success(messageText);
  }
};
const parseCookie = (str) => {
  const obj = {};
  str.split(";").map((item) => {
    obj[item.split("=")[0]] = item.split("=")[1];
  });
  return obj;
};

function Login() {
  const [cookies, setCookie] = useCookies(["SHOP_TOKEN"]);

  useEffect(() => {
    const user = localStorage.getItem('loggedUserBc');
    console.log(typeof user);
    if(user && user !== 'null' && user !== 'undefined') {
      navigate('/'); 
    }
  }, []);

  const onLogin = async (value, force) => {
    try {
    const { email, password } = value;
    let token = localStorage.getItem("token");

    if (!token || force) {
      const config = {
        method: "get",
        url: "/api/getToken",
      };

      const result = await axios(config)
        .then(function(response) {
          return response.data;
        })
        .catch(function(error) {
          console.log(error);
        });
      token = result.data.token;
      localStorage.setItem("token", token);
    }

    const login = await axios({
      method: "post",
      url: "/api/login",
      data: {
        email,
        password,
        token: token,
      },
    });
    console.log(login)
    localStorage.setItem(
      "loggedUserBc",
      JSON.stringify(login.data.data.customer)
    );
    // document.cookie = login.data.headers.set-cookie[0];
    login.data.tokens["set-cookie"] &&
      login.data.tokens["set-cookie"].map((item) => {
        // console.log(item.split(';'));
        console.log(parseCookie(item));
        if (Object.keys(parseCookie(item)).includes("SHOP_TOKEN")) {
          setCookie(
            "SHOP_TOKEN",
            parseCookie(item)["SHOP_TOKEN"],
            parseCookie(item)
          );
        }
        openNotification('sucess', 'Login successfull');
        navigate('/');
      });
    } catch (e) {
        console.log(e)
        openNotification('error', 'Invalid credentails');
    }
  };
  return (
    <RootElement>
      <Content>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to={"/"}>Home</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to={"/login"}>Login</Link>
          </Breadcrumb.Item>
        </Breadcrumb>
        <div className="site-layout-content">
          <h1>Sign in</h1>
          <div>
            <Form
              name="basic"
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 9,
              }}
              autoComplete="off"
              onFinish={onLogin}
            >
              <Form.Item
                label="Email Address:"
                name="email"
                rules={[
                  {
                    type: "email",
                    message:
                      "Please use a valid email address, such as user@example.com.",
                  },
                  {
                    required: true,
                    message:
                      "Please use a valid email address, such as user@example.com.",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "You must enter a password.",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                wrapperCol={{
                  offset: 8,
                  span: 16,
                }}
              >
                <Button type="primary" htmlType="submit">
                  SIGN IN
                </Button>
              </Form.Item>
            </Form>
          </div>
          <div className="side">
            <h3>New Customer?</h3>
            <p>Create an account with us and you'll be able to:</p>
            <ul>
              <li>Check out faster</li>
              <li>Save multiple shipping addresses</li>
              <li>Access your order history</li>
              <li>Track new orders</li>
              <li>Save items to your Wish List</li>
            </ul>
            <Button><Link to={'/signup'}>Create Account</Link></Button>
          </div>
        </div>
      </Content>
    </RootElement>
  );
}

export default Login;
