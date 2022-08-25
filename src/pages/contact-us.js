import React, { useState } from "react";
import { Breadcrumb, Layout } from "antd";
import { Link } from "gatsby";
import { Button, Form, Input } from "antd";
import RootElement from "../components/base-layout";
const { Content } = Layout;
const { TextArea } = Input;
function ContactUs() {
  const [form] = Form.useForm();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [formSubmitted, setFromSubmitted] = useState(false);

  const onSubmit = (value) => {
    console.log(value);
    setButtonLoading(true);
    setTimeout(() => {
      form.resetFields();
      setFromSubmitted(true);
      setButtonLoading(false);
    }, 5000);
  };
  return (
    <RootElement>
      <Content>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to={"/"}>Home</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to={"/about"}>About</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to={"/contact-us"}>Contact Us</Link>
          </Breadcrumb.Item>
        </Breadcrumb>
        <div className="site-layout-content">
          <h1>Contact Us</h1>
          <div className="contact-us-form">
            {formSubmitted ? (
              <div id="contact-us-success">
                We've received your feedback and will respond shortly if
                required. <Link to="/">Continue</Link>.
              </div>
            ) : (
              <>
                <p>We're happy to answer questions or help you with returns.</p>
                <p>Please fill out the form below if you need assistance.</p>
                <Form onFinish={onSubmit} form={form}>
                  <Form.Item label="Full Name" name="fullName">
                    <Input />
                  </Form.Item>
                  <Form.Item label="Phone Number" name="phoneNumber">
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Email Address"
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
                  <Form.Item label="Order Number" name="orderNumber">
                    <Input />
                  </Form.Item>
                  <Form.Item label="Company Name" name="companyName">
                    <Input />
                  </Form.Item>
                  <Form.Item label="RMA Number" name="rmaNumber">
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Comments/Questions"
                    name="comment"
                    rules={[
                      {
                        required: true,
                        message: "You must enter your question.",
                      },
                    ]}
                  >
                    <TextArea rows={4} />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={buttonLoading}
                    >
                      SUBMIT FORM
                    </Button>
                  </Form.Item>
                </Form>
              </>
            )}
          </div>
        </div>
      </Content>
    </RootElement>
  );
}

export default ContactUs;
