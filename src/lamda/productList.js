import axios from "axios";

export async function handler(req, res) {
  console.log("------");
  const storeUrl = "https://api.bigcommerce.com/stores/qjmdzrcw";
  const apiToken = "lukvrlbivyj2c3i0ghiel647g1tv60l";
  console.log("------");

    const sort = req.queryStringParameters.sort || 'id';
    const direction = req.queryStringParameters.direction || 'asc';
    let url = `${storeUrl}/v3/catalog/products?include=images,variants,custom_fields,options,modifiers,videos&is_visible=true&direction=${direction}&sort=${sort}`;
    if (req.queryStringParameters.category) {
      url = url + `&categories:in=${req.queryStringParameters.category}`;
    }
    if (req.queryStringParameters.keyword) {
      url = url + `&keyword=${req.queryStringParameters.keyword}`;
    }
    if (req.queryStringParameters.page) {
      url = url + `&page=${req.queryStringParameters.page}`;
    }
    if (req.queryStringParameters.idIn) {
      url = url + `&id:in=${encodeURIComponent(req.queryStringParameters.idIn)}`
    }else if (req.queryStringParameters.id) {
      url = url + `&id=${req.queryStringParameters.id}`
    }
    console.log(url)
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
      .then(function (response) {
        return {
          statusCode: 200,
          body: JSON.stringify({ ...response.data })
        };
      })
      .catch(function (error) {
        console.log(error);
        return {
          statusCode: 500,
          body: JSON.stringify({ error })
        }
      });
    return result;
}
