import React, { useEffect, useState } from "react";
import { Breadcrumb, Layout, message, Button, Form, Input, Select } from "antd";
import { Link, navigate } from "gatsby";
import RootElement from "../components/base-layout";
import { getCountries, getStates, signUp } from "../service";
import PageLoading from "../components/PageLoading";

const { Content } = Layout;
const { Option } = Select;

const openNotification = (type, messageText) => {
  if (type === "error" || type === "delete") {
    message.error(messageText);
  } else if (type === "warning") {
    message.info(messageText);
  } else {
    message.success(messageText);
  }
};

const confirmPasswordFieldValidator = ({ getFieldValue }) => ({
  validator(rule, value) {
    if (
      getFieldValue("confirmPassword") &&
      value &&
      getFieldValue("confirmPassword") !== getFieldValue("password")
    ) {
      return Promise.reject(new Error("Your passwords do not match."));
    }

    if (value) {
      return Promise.resolve();
    }
  },
});
function SignUp() {
  const [loading, setLoading] = useState(true);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState(null);


  const onLoadFunction = async () => {
    try {
      setLoading(true);
      const contries = await getCountries();
      const selectedCountry = contries.find((country) => country.country_iso2 == 'US');
      if (selectedCountry) {
        const statesResult = await getStates(selectedCountry.id);
        setStates(statesResult || null);
      } else {
        setStates(null);
      }
            
      setLoading(false);
      setCountries(contries);
    } catch {
      setLoading(false);
    }
  }
  useEffect(() => {
    onLoadFunction();
  }, []);

  const onFinish = async (value) => {
    try {
       await signUp(value);
       navigate('/'); 
       openNotification("success", 'Sign up succesfull.')
    } catch(e) {
        console.log(e)
       openNotification("error", 'Sign up Fail.')
    
    }
    console.log(value);
  }
  const onChange = async (value) => {
    try {
      const selectedCountry = countries.find(
        (country) => country.country_iso2 === value
      );
      if (selectedCountry) {
        const statesResult = await getStates(selectedCountry.id);
        setStates(statesResult || null);
      } else {
        setStates(null);
      }
    } catch {
      setStates(null);
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
            <Link to={"/SignUp"}>Create account</Link>
          </Breadcrumb.Item>
        </Breadcrumb>
        <div className="site-layout-content">
          <h1>New Account</h1>
          <div>
            {loading ? (
              <PageLoading />
            ) : (
              <Form
                name="basic"
                labelCol={{
                  span: 8,
                }}
                wrapperCol={{
                  span: 9,
                }}
                initialValues={{ countryCode: "US" }}
                autoComplete="off"
                onFinish={onFinish}
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
                  label="Confirm Password"
                  name="confirmPassword"
                  rules={[
                    {
                      required: true,
                      message: "You must enter a password.",
                    },
                    ({ getFieldValue }) =>
                      confirmPasswordFieldValidator({ getFieldValue }),
                  ]}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item
                  label="First name"
                  name="firstName"
                  rules={[
                    {
                      required: true,
                      message: "The 'First Name' field cannot be blank.",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Last Name"
                  name="lastName"
                  rules={[
                    {
                      required: true,
                      message: "The 'Last Name' field cannot be blank.",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Company Name"
                  name="company"
                  rules={[
                    {
                      required: true,
                      message: "The 'Company Name' field cannot be blank.",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item label="Phone Number" name="phone">
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Address Line 1"
                  name="address1"
                  rules={[
                    {
                      required: true,
                      message: "The 'Address Line 1' field cannot be blank.",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item label="Address Line 2" name="address2">
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Suburb/City"
                  name="city"
                  rules={[
                    {
                      required: true,
                      message: "The 'Suburb/City' field cannot be blank.",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Country"
                  name="countryCode"
                  rules={[
                    {
                      required: true,
                      message: "The 'Country' field cannot be blank.",
                    },
                  ]}
                >
                  <Select placeholder="Choose a country" onChange={onChange}>
                    {countries.map((option) => (
                      <Option value={option.country_iso2}>
                        {option.country}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="State/Province"
                  name="state"
                  rules={[
                    {
                      required: true,
                      message: "The 'State/Province' field cannot be blank.",
                    },
                  ]}
                >
                  {states && states.length ? (
                    <Select placeholder="Choose a state" onChange={onChange}>
                      {states.map((option) => (
                        <Option value={option.state}>{option.state}</Option>
                      ))}
                    </Select>
                  ) : (
                    <Input />
                  )}
                </Form.Item>

                <Form.Item
                  label="Zip/Postcode"
                  name="zipCode"
                  rules={[
                    {
                      required: true,
                      message: "The 'Zip/Postcode' field cannot be blank.",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  wrapperCol={{
                    offset: 8,
                    span: 16,
                  }}
                >
                  <Button type="primary" htmlType="submit">
                    Create Account
                  </Button>
                </Form.Item>
              </Form>
            )}
          </div>
        </div>
      </Content>
    </RootElement>
  );
}

export default SignUp;
