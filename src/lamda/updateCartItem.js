import axios from "axios";

export  async function handler(req, res) {
    const storeUrl = "https://api.bigcommerce.com/stores/qjmdzrcw";
    const apiToken = "lukvrlbivyj2c3i0ghiel647g1tv60l";
    const data = req.body;

    const parseCookie = (str) => {
        const obj = {};
        str.split(";").map((item) => {
            obj[item.split("=")[0]] = item.split("=")[1];
        });
        return obj;
    };
    const cookies = parseCookie(req.headers.cookie || "");

    if (!cookies || !cookies.cartId) {
        res.status(500).json({ message: "Cart not found " });
    }

    const config = {
        method: "PUT",
        withCredentials: false,
        mode: "no-cors",
        url: `${storeUrl}/v3/carts/${req.queryStringParameters.cartId}/items/${req.query.itemId}`,
        headers: {
            "sec-ch-ua":
                '"Chromium";v="104", " Not A;Brand";v="99", "Google Chrome";v="104"',
            Referer: "http://localhost:8000/",
            "Access-Control-Allow-Origin": "*",
            "X-Auth-Token": apiToken,
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
        .then(function (response) {
            // res.header(response.headers);
            console.log(response.data)
            return { statusCode: 200, body: { ...response.data } };
        })
        .catch(function (error) {
            return {
                statusCode: 500,
                body: { message: error.response.data }
            }
        //   res.status(500).json({ message:  error.response.data});
        });
    // res.cookie
    // res.send(result);
    return result;
}
