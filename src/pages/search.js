import React, { useEffect, useState, useMemo } from "react";
import { Link, graphql } from "gatsby";
import { Breadcrumb, Layout, Pagination, Select } from "antd";
import RootElement from "../components/base-layout";
import SearchSideBar from '../modules/category/search-sideBar';
import DefaultLoader from "../components/PageLoading";
import ProductList from "../modules/product-list";
import { getProductList } from "../service";

const { Content } = Layout;
const { Option } = Select;

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

function Search({ location, data }) {
  useEffect(() => {
    console.log('---', location)
  }, [location])
  const [loading, setLoding] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProduct, setTotalProduct] = useState(0);
  const [productList, setProductList] = useState([]);
  const [sorting, setSorting] = useState("normal");
  const [searchParam, setSearchParam] = useState(null);
  const [category, setCategory] = useState(null);

  const filterOption = useMemo(() => {
    return [
      { label: "Featured Items", value: "normal" },
      { label: "Newest Item", value: "date" },
      { label: "Bestseller", value: "totalSold" },
      { label: "A to Z", value: "aToZ" },
      { label: "Z to A", value: "zToA" },
      { label: "Price: Ascending", value: "PriceAsc" },
      { label: "Price: Descending", value: "PriceDesc" },
    ];
  }, []);

  const getProductData = async (page, sort, keyword, category) => {
    try {
      setLoding(true);
      const sortObj = getSortObject(sort);
      const result = await getProductList({ page, ...sortObj, keyword, category });
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
    const params = new URLSearchParams(location.search);
    const parameter1 = params.get("search_query");
    const param2 = params.get("category");
    setSearchParam(parameter1);
    setCategory(parseInt(param2));
    getProductData(currentPage, sorting, param2);
  }, [currentPage, sorting]);

    // const {
    //   data: { allBigCommerceCategories },
    // } = props;

  return (
    <RootElement>
      <Content>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to={"/"}>Home</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to={"/search"}>Search</Link>
          </Breadcrumb.Item>
        </Breadcrumb>
        <div className="site-layout-content">
          <div>
            <div className="category-banner-section">
              <div className="category-left-section ">
                <h1 className="page-heading">
                  {totalProduct} results for '{searchParam}'
                </h1>
              </div>
            </div>
            <SearchSideBar categories={data.allBigCommerceCategories.nodes} selectedCategory={category} searchParam={searchParam}/>
            <div className="page-content">
              <div className="product-listing-container">
                <div className="actionBar-main">
                  {productList.length ? (
                    <Select
                      value={sorting}
                      style={{ width: "content-fit" }}
                      onChange={onChangeSorting}
                    >
                      {filterOption &&
                        filterOption.map((item) => (
                          <Option value={item.value}>{item.label}</Option>
                        ))}
                    </Select>
                  ) : null}
                </div>
                <div>
                  {loading ? (
                    <>
                      <DefaultLoader />
                    </>
                  ) : (
                    <>
                      {productList.length ? (
                        <>
                          <ProductList productList={productList} />
                          {totalProduct > 10 ? (
                            <div className="pagination">
                              <Pagination
                                current={currentPage}
                                total={totalProduct}
                                onChange={onChangePage}
                                showTotal={(total, range) =>
                                  `${range[0]}-${range[1]} of ${total} items`
                                }
                              />
                            </div>
                          ) : null}
                        </>
                      ) : (
                        <>
                          <div className="panel panel--large">
                            <div className="panel-body">
                              {/* <div className="search-suggestion">
                                {" "}
                                Did you mean: <strong>n maxsa</strong>
                              </div>
                              <div className="search-suggestion">
                                <p>
                                  {" "}
                                  Your search for " <strong>n,msadsa</strong>"
                                  did not match any products or information.{" "}
                                </p>
                              </div> */}
                              <div className="search-suggestion">
                                <h5 className="suggestion-title">
                                  Suggestions:
                                </h5>
                                <ul>
                                  <li>
                                    Make sure all words are spelled correctly.
                                  </li>
                                  <li>Try different keywords.</li>
                                  <li>Try more general keywords.</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Content>
    </RootElement>
  );
}

export default Search;

export const pageQuery = graphql`
  query BigCommerceCategoriesForSearch {
    allBigCommerceCategories(filter: {parent_id: {eq: 0}}) {
      nodes {
        id
        name
        description
        default_product_sort
        parent_id
        page_title
        search_keywords
        sort_order
        views
        is_visible
        layout_file
        meta_description
        meta_keywords
        bigcommerce_id
        custom_url {
          is_customized
          url
        }
        image_url
      }
    }
  }
`;
