import { Link } from "gatsby";
import React, { useMemo } from "react";
import { Pagination, Select } from "antd";
import SideBar from "./sidebar";
import DefaultLoader from "../../components/PageLoading";
import ProductList from "../product-list";
const { Option } = Select;

function CategorySection(props) {
  const {
    allCategories,
    pageTitle,
    category,
    subCategory,
    subCategoryTitle,
    productList,
    page,
    total,
    loading,
    onPageChange,
    sorting,
    onChangeSorting,
  } = props;

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

  return (
    <div>
      <div className="category-banner-section">
        <div className="category-left-section ">
          <h1 className="page-heading">{pageTitle || category.name}</h1>
          {category && category.description ? (
            <p>{category.description}</p>
          ) : null}
        </div>
      </div>
      <div className="category-page">
      <SideBar categories={allCategories} />
      <div className="page-content">
        <div className="subcategory-wrap">
          {subCategory && subCategory.length ? (
            <>
              <div className="sub-category-heading">
                <h3>{subCategoryTitle}</h3>
              </div>
              <div className="sub-category-wrap">
                <ul className="sub-category-block custom-row">
                  {subCategory.map((item) => {
                    return (
                      <div className="category-image-inner">
                        <div className="sub-category-img-block banner-hover">
                          <Link to={item.custom_url.url}>
                            {item.url ? (
                              <img
                                src={item.url}
                                height="224"
                                width="224"
                                alt={item.name}
                              />
                            ) : (
                              <img
                                src="https://demofree.sirv.com/nope-not-here.jpg"
                                height="224"
                                width="224"
                                alt={item.name}
                              />
                            )}
                          </Link>
                        </div>
                        <p className="sub-category-name">
                          <Link to={item.custom_url.url}>{item.name}</Link>
                        </p>
                      </div>
                    );
                  })}
                </ul>
              </div>
            </>
          ) : null}
        </div>
        <div className="product-listing-container">
          <div className="actionBar-main">
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
          </div>
          <div>
            {loading ? (
              <>
                <DefaultLoader />
              </>
            ) : (
              <>
                <ProductList productList={productList} />
                {total > 10  && productList.length? (
                  <div className="pagination">
                    <Pagination
                      current={page}
                      total={total}
                      onChange={onPageChange}
                      showTotal={(total, range) =>
                        `${range[0]}-${range[1]} of ${total} items`
                      }
                    />
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default CategorySection;
