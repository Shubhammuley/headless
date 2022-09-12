import React from "react";
import { Menu, InputNumber, Form, Button } from "antd";
import { Link } from "gatsby";

function SideBar({ categories }) {
  const sideBar = {
    label: "Categories",
    key: "category",
    children: categories.map((item, index) => {
      const key = String(index + 1);
      const returnObj = {
        key: `sub${key}`,
        label: <Link to={`/${item.id}`}>{item.name}</Link>,
      };
      const children =
        item.subCategories &&
        item.subCategories.length &&
        item.subCategories.map((subCategory, index) => {

          return {
            key: `child${key} ${index}`,
            label: <Link to={`/${subCategory.parent_id}/${subCategory.id}`}>{subCategory.name}</Link>,
          };
        });
      returnObj.children = children;
      return returnObj;
    }),
  };
  return (
    <div className="page-sidebar">
      <Menu
        mode="inline"
        defaultOpenKeys={["category"]}
        style={{
          height: "100%",
          width: "100%",
        }}
        items={[sideBar]}
      />
      <Menu
        mode="inline"
        defaultOpenKeys={["price"]}
        style={{
          height: "100%",
          width: "100%",
        }}
        items={[
          {
            label: "Refined by",
            key: "price",
          },
        ]}
      />
      <Menu
        mode="inline"
        defaultOpenKeys={["price"]}
        style={{
          height: "100%",
          width: "fit-content",
        }}
        items={[
          {
            label: "Price",
            key: "price",
            children: [
              {
                label: (
                  <>
                    <Form className="form-minMaxRow">
                      <Form.Item name="min">
                        <InputNumber placeholder="min" />
                      </Form.Item>
                      <Form.Item name="max">
                        <InputNumber placeholder="max" />
                      </Form.Item>
                      <Form.Item type="primary" htmlType="submit">
                        <Button>Update</Button>
                      </Form.Item>
                    </Form>
                  </>
                ),
                key: 1,
              },
            ],
          },
        ]}
      />
    </div>
  );
}

export default SideBar;
