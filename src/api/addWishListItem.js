import axios from "axios";

export default async function handler(req, res) {
    const storeUrl = "https://api.bigcommerce.com/stores/qjmdzrcw";
    const apiToken = "lukvrlbivyj2c3i0ghiel647g1tv60l";

    const config = {
        method: "post",
        withCredentials: false,
        mode: "no-cors",
        url: `${storeUrl}/v3/wishlists/${req.body.wishListId}/items`,
        headers: {
            "sec-ch-ua":
                '"Chromium";v="104", " Not A;Brand";v="99", "Google Chrome";v="104"',
            Referer: "http://localhost:8000/",
            "X-Auth-Token": apiToken,
            "Content-Type": "application/json",
        },
        data: JSON.stringify({ items: req.body.wishListItem }),
    };
  
      const result = await axios(config)
        .then(function (response) {
          return response.data;
        })
        .catch(function (error) {
          console.log(error.response.data);
          res.status(500).json({ message: error.response.data });
        });
      res.send(result);
}
