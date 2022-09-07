import axios from "axios";

export default async function handler(req, res) {
    const storeUrl = "https://api.bigcommerce.com/stores/qjmdzrcw";
    const apiToken = "lukvrlbivyj2c3i0ghiel647g1tv60l";


    if(!req.body.name) {
      res.status(500).json({ error: "Please provide wishlist name"});

      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Please pass stateId" })
      }
    }

    if(!req.body.customerId) {
      res.status(500).json({ error: "Please provide valid customerId"});
       return {
        statusCode: 500,
        body: JSON.stringify({ error: "Please pass stateId" })
      }
    }
    const data = {
        name: req.body.name,
        customer_id: req.body.customerId,
        is_public: req.body.isPublic || false
    };

    if(req.body.wishListItem && req.body.wishListItem.length) {
        data.items = req.body.wishListItem;
    }
    console.log(data)
    const config = {
        method: "post",
        withCredentials: false,
        mode: "no-cors",
        url: `${storeUrl}/v3/wishlists`,
        headers: {
            "sec-ch-ua":
                '"Chromium";v="104", " Not A;Brand";v="99", "Google Chrome";v="104"',
            Referer: "http://localhost:8000/",
            "X-Auth-Token": apiToken,
            "Content-Type": "application/json",
        },
        data: JSON.stringify(data),
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
