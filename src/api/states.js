import axios from "axios";

export default async function handler(req, res) {
    const storeUrl = "https://api.bigcommerce.com/stores/qjmdzrcw";
    const apiToken = "lukvrlbivyj2c3i0ghiel647g1tv60l";


    if(!req.query.stateId) {
      res.status(500).json({ error: "Please pass stateId"});

      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Please pass stateId" })
      }
    }
    const config = {
        method: "get",
        withCredentials: false,
        mode: "no-cors",
        url: `${storeUrl}/v2/countries/${req.query.stateId}/states?limit=100`,
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
          console.log(error.response.data);
          res.status(500).json({ message: 'Error!' });
        });
      res.send(result);
}
