import React, { useMemo, useEffect, useState } from "react";
import RootElement from "../components/base-layout";
import { Link } from "gatsby";
import { Breadcrumb, Layout } from "antd";
import { makeTitle } from "../utils";
import CategorySection from "../modules/category";
// import useProductList from "../hooks/use-all-product-list";
import { getProductList, getCategories } from '../service';
import DefaultLoader from "../components/PageLoading/DefaultLoader";

const { Content } = Layout;

const getSortObject = (value) => {
  if (value === 'date') {
    return { sort: 'date_last_imported', }
  } else if (value === 'totalSold') {
    return { sort: 'total_sold' };
  } else if (value === 'aToZ') {
    return { sort: 'name' };
  } else if (value === 'zToA') {
    return { sort: 'name', direction: 'desc' };
  } else if (value === 'PriceAsc') {
    return { sort: 'price' };
  } else if (value === 'PriceDesc') {
    return { sort: 'price', direction: 'desc' };
  } else {
    return {};
  }
}

function Categories({ location, categoryId }) {
  const [loading, setLoding] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProduct, setTotalProduct] = useState(0);
  const [productList, setProductList] = useState([]);
  const [sorting, setSorting] = useState('normal');
  const [pageloading, setPageLoding] = useState(true);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState({});
  const [subCategories, setSubCategories] = useState([]);

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
      const categoryDetails = result.data.find((item) =>  parseInt(item.id) === categoryId);
      const subCategoriesDetails = result.data.filter((item) => item.parent_id === categoryId);
      console.log(categoryDetails)
      setCategory(categoryDetails);
      setSubCategories(subCategoriesDetails);
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
      const result = await getProductList({ page, ...sortObj, category: categoryId });
      const list = result.data || [];
      setTotalProduct(result.meta.pagination.total);
      setProductList(list);
      setLoding(false);
    } catch (e) {
      setLoding(false);
      console.log(e);
    }
  }

  const onChangePage = (page) => {
    setCurrentPage(page);
  };

  const onChangeSorting = (value) => {
    setSorting(value);
  }

  useEffect(() => {
    getProductData(currentPage, sorting);
  }, [currentPage, sorting, categoryId]);


  // const { subCategories } = pageContext;

  const breadCrumbs = location?.pathname?.split("/");
  const url = [];
  return (
    <RootElement>
      <Content>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to={`/`}>Home</Link>
          </Breadcrumb.Item>
          {breadCrumbs.map((item) => {
            if (item) {
              let title = makeTitle(item);
              url.push(item);
              return (
                <Breadcrumb.Item>
                  <Link to={`/${url.join("/")}`}>{title}</Link>
                </Breadcrumb.Item>
              );
            }
          })}
        </Breadcrumb>
        <div className="site-layout-content">
          {
            pageloading ? <><DefaultLoader /></> : (<CategorySection
              allCategories={categories}
              pageTitle={category.name}
              subCategory={subCategories}
              productList={productList}
              subCategoryTitle={`Subcategory of ${category.name}`}
              category={category}
              total={totalProduct}
              page={currentPage}
              loading={loading}
              onPageChange={onChangePage}
              sorting={sorting}
              onChangeSorting={onChangeSorting}
            />)
          }

        </div>
      </Content>
    </RootElement>
  );
}

export default Categories;
