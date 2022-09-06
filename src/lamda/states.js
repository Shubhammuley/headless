import axios from "axios";

export async function handler(req, res) {
    console.log(req)
    const storeUrl = "https://api.bigcommerce.com/stores/qjmdzrcw";
    const apiToken = "lukvrlbivyj2c3i0ghiel647g1tv60l";

    if(!req.queryStringParameters.stateId) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Please pass stateId" })
      }
    }
    const config = {
        method: "get",
        withCredentials: false,
        mode: "no-cors",
        url: `${storeUrl}/v2/countries/${req.queryStringParameters.stateId}/states?limit=100`,
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
