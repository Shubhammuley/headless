import React, { useMemo, useEffect, useState } from "react";
import { Link, graphql } from "gatsby";
import { Breadcrumb, Layout } from "antd";
import CategorySection from "../modules/category";
import RootElement from "../components/base-layout";
import { getCategories, getProductList } from "../service";
import DefaultLoader from "../components/PageLoading/DefaultLoader";
const { Content } = Layout;

const getSortObject = (value) => {
  if (value === "date") {
    return { sort: "date_last_imported" };
  } else if (value === "totalSold") {
    return { sort: "total_sold" };
  } else if (value === "aToZ") {
    return { sort: "name" };
  } else if (value === "zToA") {
    return { sort: "name", direction: "desc" };
  } else if (value === "PriceAsc") {
    return { sort: "price" };
  } else if (value === "PriceDesc") {
    return { sort: "price", direction: "desc" };
  } else {
    return {};
  }
};

function Categories(props) {
  const [loading, setLoding] = useState(true);
  const [pageloading, setPageLoding] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProduct, setTotalProduct] = useState(0);
  const [productList, setProductList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sorting, setSorting] = useState("normal");
  // const {
  //   data: { allBigCommerceCategories },
  // } = props;

  const fetchCategories = async () => {
    try {
      setPageLoding(true);
      const category = [];
      const result = await getCategories();
      console.log(result.data);
      result.data.map((item) => {
        if (item && item.parent_id === 0) {
          const subCategories = result.data.filter(
            (subCategory) => subCategory.parent_id === item.id
          );
          category.push({ ...item, subCategories });
        }
      });
      console.log(category)
      setCategories(category);
      setPageLoding(false);
      console.log(categories);
    } catch (e) {
      console.log("first", e)
    }
  }
  useEffect(() => {
    fetchCategories()
  }, []);
  
  const getProductData = async (page, sort) => {
    try {
      setLoding(true);
      const sortObj = getSortObject(sort);
      const result = await getProductList({ page, ...sortObj });
      const list = result.data || [];
      setTotalProduct(result.meta.pagination.total);
      setProductList(list);
      setLoding(false);
    } catch (e) {
      setLoding(false);
      console.log(e);
    }
  };

  const onChangePage = (page) => {
    setCurrentPage(page);
  };

  const onChangeSorting = (value) => {
    setSorting(value);
  };

  useEffect(() => {
    getProductData(currentPage, sorting);
  }, [currentPage, sorting]);

  // const categories = useMemo(() => {
  //   const category = [];
  //   allBigCommerceCategories.nodes
  //   return category;
  // }, allBigCommerceCategories);

  return (
    <RootElement>
      <Content>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to={"/"}>Home</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to={"/categories"}>Categories</Link>
          </Breadcrumb.Item>
        </Breadcrumb>
        <div className="site-layout-content">{
          pageloading ? <><DefaultLoader /></> : (
            <CategorySection
              allCategories={categories}
              pageTitle="Categories"
              subCategory={categories}
              productList={productList}
              subCategoryTitle="Subcategories"
              total={totalProduct}
              page={currentPage}
              loading={loading}
              onPageChange={onChangePage}
              sorting={sorting}
              onChangeSorting={onChangeSorting}
            />
          )
        }

        </div>
      </Content>
    </RootElement>
  );
}

export default Categories;

// export const pageQuery = graphql`
//   query BigCommerceCategories {
//     allBigCommerceCategories {
//       nodes {
//         id
//         name
//         description
//         default_product_sort
//         parent_id
//         page_title
//         search_keywords
//         sort_order
//         views
//         is_visible
//         layout_file
//         meta_description
//         meta_keywords
//         bigcommerce_id
//         custom_url {
//           is_customized
//           url
//         }
//         image_url
//       }
//     }
//   }
// `;
