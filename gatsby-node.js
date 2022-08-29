const path = require("path");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;
  return new Promise((resolve, reject) => {
    resolve(
      graphql(`
        {
          allContentfulNavigation(
            sort: { fields: updatedAt, order: DESC }
            filter: {}
          ) {
            nodes {
              navigation
              openInNewTab
              pageContent {
                raw
              }
              pageUrl
              sublink {
                pageUrl
                template
                title
              }
              template
              title
              updatedAt
            }
          }
        }
      `).then((result) => {
        if (result.errors) {
          reject(result.errors);
        }
        result.data.allContentfulNavigation.nodes.forEach((node) => {
          const pageTemplate = path.resolve(
            `src/templates/${node.template}.js`
          );
          console.log(node.pageUrl);
          createPage({
            path: node.pageUrl,
            component: pageTemplate,
            context: {
              pageUrl: node.pageUrl,
              contentfulPage: node,
              allNodes: result.data.allContentfulNavigation.nodes,
            },
          });
        });
        return;
      })
    ),
      resolve(
        graphql(`
          {
            allContentfulBlog(
              sort: { fields: updatedAt, order: DESC }
              filter: {}
            ) {
              nodes {
                createdBy
                createdAt
                pageUrl
                title
                image {
                  file {
                    url
                  }
                }
                description {
                  raw
                }
              }
            }
            allBigCommerceProducts {
              nodes {
                id
                name
                custom_url {
                  url
                }
              }
            }
            allBigCommerceCategories {
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
        `).then((result) => {
          if (result.errors) {
            reject(result.errors);
          }

          const categories = result.data.allBigCommerceCategories.nodes;

          const category = [];
          categories.map((item) => {
            if (item && item.parent_id === 0) {
              const subCategories = categories.filter((subCategory) => {
                if (subCategory.parent_id === item.bigcommerce_id) {
                  createPage({
                    path: subCategory.custom_url.url,
                    component: path.resolve(`src/templates/categories.js`),
                    context: {
                      categoryId: subCategory.bigcommerce_id,
                      description: subCategory.description,
                      category: subCategory,
                      parentCategory: item,
                      categories,
                    },
                  });
                  return subCategory;
                }
              });
              category.push({ ...item, subCategories });
              createPage({
                path: item.custom_url.url,
                component: path.resolve(`src/templates/categories.js`),
                context: {
                  categoryId: item.bigcommerce_id,
                  description: item.description,
                  category: { ...item, subCategories },
                  subCategories,
                  categories
                },
              });
            }
          });

          category.forEach;
          const products = result.data.allBigCommerceProducts.nodes;

          products.forEach(({ custom_url, id }) => {
            createPage({
              path: `/products${custom_url.url}`,
              component: path.resolve(`src/templates/product.js`),
              context: {
                productId: id,
              },
            });
          });
          const blogPostTemplate = path.resolve("src/templates/blog-post.js");
          result.data.allContentfulBlog.nodes.forEach((node) => {
            console.log(node.pageUrl);
            createPage({
              path: `blog/${node.pageUrl}`,
              component: blogPostTemplate,
              context: {
                pageUrl: `blog/${node.pageUrl}`,
                contentfulPage: node,
              },
            });
          });
          return;
        })
      );
  });
};

exports.onCreateDevServer = ({ app }) => {
  const storeUrl = "https://api.bigcommerce.com/stores/qjmdzrcw";
  const apiToken = "lukvrlbivyj2c3i0ghiel647g1tv60l";

  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.get("/BC/getToken", async function(req, res) {
    const data = JSON.stringify({
      channel_id: 1,
      expires_at: 1661407865,
      allowed_cors_origins: ["http://localhost:8000"],
    });

    const config = {
      method: "post",
      withCredentials: false,
      mode: "no-cors",
      url: `${storeUrl}/v3/storefront/api-token`,
      headers: {
        "sec-ch-ua":
          '"Chromium";v="104", " Not A;Brand";v="99", "Google Chrome";v="104"',
        Referer: "http://localhost:8000/",
        "X-Auth-Token": apiToken,
        "Content-Type": "application/json",
      },
      data: data,
    };

    const result = await axios(config)
      .then(function(response) {
        return response.data;
      })
      .catch(function(error) {
        console.log(error);
      });
    res.send(result);
  });

  app.post("/BC/login", async function(req, res) {
    const data = JSON.stringify({
      operationName: "Login",
      variables: {
        email: req.body.email,
        pass: req.body.password,
      },
      query:
        "mutation Login($email: String!, $pass: String!) {\n  login(email: $email, password: $pass) {\n    result\n    customer {\n      company\n      lastName\n      firstName\n      entityId\n      email\n      taxExemptCategory\n    }\n  }\n}\n",
    });

    const config = {
      method: "post",
      withCredentials: false,
      mode: "no-cors",
      url: "https://new-theme-5.mybigcommerce.com/graphql",
      headers: {
        "sec-ch-ua":
          '"Chromium";v="104", " Not A;Brand";v="99", "Google Chrome";v="104"',
        Referer: "http://localhost:8000/",
        authorization: `Bearer ${req.body.token}`,
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        "sec-ch-ua-mobile": "?0",
        "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36",
        "sec-ch-ua-platform": '"Linux"',
      },
      data: data,
    };

    const result = await axios(config)
      .then(function(response) {
        res.header(response.headers);
        return { data: response.data.data.login, tokens: response.headers };
      })
      .catch(function(error) {
        console.log(error);
      });
    // res.cookie
    res.send(result);
  });

  app.get("/BC/countries", async function(req, res) {
    const config = {
      method: "get",
      withCredentials: false,
      mode: "no-cors",
      url: `${storeUrl}/v2/countries?limit=239`,
      headers: {
        "sec-ch-ua":
          '"Chromium";v="104", " Not A;Brand";v="99", "Google Chrome";v="104"',
        Referer: "http://localhost:8000/",
        "X-Auth-Token": apiToken,
        "Content-Type": "application/json",
      },
    };

    const result = await axios(config)
      .then(function(response) {
        return response.data;
      })
      .catch(function(error) {
        console.log(error);
      });
    res.send(result);
  });

  app.get("/BC/states/:stateId", async function(req, res) {
    const config = {
      method: "get",
      withCredentials: false,
      mode: "no-cors",
      url: `${storeUrl}/v2/countries/${req.params.stateId}/states?limit=100`,
      headers: {
        "sec-ch-ua":
          '"Chromium";v="104", " Not A;Brand";v="99", "Google Chrome";v="104"',
        Referer: "http://localhost:8000/",
        "X-Auth-Token": apiToken,
        "Content-Type": "application/json",
      },
    };

    const result = await axios(config)
      .then(function(response) {
        return response.data;
      })
      .catch(function(error) {
        console.log(error);
      });
    res.send(result);
  });

  app.post("/BC/signUp", async function(req, res) {
    const {
      password,
      email,
      countryCode,
      firstName,
      lastName,
      address1,
      address2,
      company,
      city,
      state,
      zipCode,
      phone,
    } = req.body;
    const data = JSON.stringify([
      {
        email,
        first_name: firstName,
        last_name: lastName,
        company,
        phone,
        addresses: [
          {
            first_name: firstName,
            last_name: lastName,
            address1,
            address2,
            postal_code: zipCode,
            state_or_province: state,
            city,
            country_code: countryCode,
            authentication: {
              new_password: password,
            },
          },
        ],
      },
    ]);
    const config = {
      method: "post",
      withCredentials: false,
      mode: "no-cors",
      url: `${storeUrl}/v3/customers`,
      headers: {
        "sec-ch-ua":
          '"Chromium";v="104", " Not A;Brand";v="99", "Google Chrome";v="104"',
        Referer: "http://localhost:8000/",
        "X-Auth-Token": apiToken,
        "Content-Type": "application/json",
      },
      data,
    };

    const result = await axios(config)
      .then(function(response) {
        return response.data;
      })
      .catch(function(error) {
        console.log(error.response.data);
        res.status(422);
      });
    res.send(result);
  });

  app.get("/BC/productList", async function(req, res) {
    const sort = req.query.sort || 'id';
    const direction = req.query.direction || 'asc';
    let url = `${storeUrl}/v3/catalog/products?include=images,variants,custom_fields,options,modifiers,videos&is_visible=true&direction=${direction}&sort=${sort}`;
    if(req.query.category) {
      url= url + `&categories:in=${req.query.category}`;
    }
    if(req.query.keyword) {
      url= url + `&keyword=${req.query.keyword}`;
    }
    if(req.query.page) {
      url = url+ `&page=${req.query.page}`;
    }
    const config = {
      method: "get",
      withCredentials: false,
      mode: "no-cors",
      url,
      headers: {
        "sec-ch-ua":
          '"Chromium";v="104", " Not A;Brand";v="99", "Google Chrome";v="104"',
        Referer: "http://localhost:8000/",
        "X-Auth-Token": apiToken,
        "Content-Type": "application/json",
      },
    };

    const result = await axios(config)
      .then(function(response) {
        return response.data;
      })
      .catch(function(error) {
        console.log(error);
      });
    res.send(result);
  });

  app.listen(
    8088,
    console.log(
      "\x1b[32m",
      `listening to changes for live preview at route /___BCPreview`
    )
  );
};
