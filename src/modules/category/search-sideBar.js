import React, { useEffect, useState } from "react";
import { Menu, InputNumber, Form, Button, Checkbox } from "antd";

function SearchSideBar({ categories, selectedCategory, searchParam }) {
  const [categoryList, setCategoryList] = useState([]);
  const onClick = (e) => {
    if(e.target.checked) {
      const category = categories.filter((item) => item.bigcommerce_id === e.target.value);
      setCategoryList(category);
      window.location.replace(`/search/?search_query=${encodeURIComponent(searchParam)}&category=${e.target.value}`)
      // window.history.pushState({}, '', `/search/?search_query=${encodeURIComponent(searchParam)}&category=${e.target.value}`)
    } else {
      window.location.replace(`/search/?search_query=${encodeURIComponent(searchParam)}`)
      // window.history.pushState({}, '', `/search/?search_query=${encodeURIComponent(searchParam)}`)
      setCategoryList(categories);
    }
  }

  const clearCategoryFilter = () => {
    window.location.replace(`/search/?search_query=${encodeURIComponent(searchParam)}`);
  }
  useEffect(() => {
    if(selectedCategory) {
      const category = categories.filter((item) => item.bigcommerce_id === selectedCategory);
      console.log(category)
      setCategoryList(category);
    } else {
      setCategoryList(categories);
    }
  }, [categories, selectedCategory])
  const sideBar = {
    label: <>Categories {selectedCategory ? <span onClick={clearCategoryFilter}>Clear</span> : null} </>,
    key: "category",
    children: categoryList.map((item, index) => {
      const key = String(index + 1);
      const returnObj = {
        key: `sub${key}`,
        label: <Checkbox onChange={onClick} value={item.bigcommerce_id} checked={item.bigcommerce_id === selectedCategory}>{item.name}</Checkbox>,
      };
      return returnObj;
    }),
  };
  return (
    <div>
      <Menu
        mode="inline"
        defaultOpenKeys={["category"]}
        style={{
          height: "100%",
          width: "fit-content",
        }}
        items={[sideBar]}
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
                    <Form>
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

export default SearchSideBar;
