import axios from "axios";

export default async function handler(req, res) {
  console.log("------");
  const storeUrl = "https://api.bigcommerce.com/stores/qjmdzrcw";
  const apiToken = "lukvrlbivyj2c3i0ghiel647g1tv60l";
  console.log("------");

    const sort = req.query.sort || 'id';
    const direction = req.query.direction || 'asc';
    let url = `${storeUrl}/v3/catalog/products?include=images,variants,custom_fields,options,modifiers,videos&is_visible=true&direction=${direction}&sort=${sort}`;
    if (req.query.category) {
      url = url + `&categories:in=${req.query.category}`;
    }
    if (req.query.keyword) {
      url = url + `&keyword=${req.query.keyword}`;
    }
    if (req.query.page) {
      url = url + `&page=${req.query.page}`;
    }
    if (req.query.idIn) {
      url = url + `&id:in=${encodeURIComponent(req.query.idIn)}`
    }else if (req.query.id) {
      url = url + `&id=${req.query.id}`
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
        return response.data;
      })
      .catch(function (error) {
        console.log(error);
        res.status(500).json({ message: 'Error!' });
      });
    res.send(result);
}
