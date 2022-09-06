import axios from "axios";

export async function handler(req, res) {
    const storeUrl = "https://api.bigcommerce.com/stores/qjmdzrcw";
    const apiToken = "lukvrlbivyj2c3i0ghiel647g1tv60l";
    const data = JSON.stringify({
        channel_id: 1186477,
        expires_at: 1725183309,
        allowed_cors_origins: ["https://life-style-demo.netlify.app"],
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
