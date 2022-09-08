import axios from "axios";

export default async function handler(req, res) {
    const storeUrl = "https://api.bigcommerce.com/stores/qjmdzrcw";
    const apiToken = "lukvrlbivyj2c3i0ghiel647g1tv60l";

    const data = JSON.stringify({
        ...req.body,
        channel_id: 1,
    });
    const config = {
        method: "post",
        withCredentials: false,
        mode: "no-cors",
        url: `${storeUrl}/v3/carts`,
        headers: {
            "sec-ch-ua":
                '"Chromium";v="104", " Not A;Brand";v="99", "Google Chrome";v="104"',
            Referer: "http://localhost:8000/",
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            "X-Auth-Token": apiToken,
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
            res.header(response.headers);
            console.log(response.data)
            return { ...response.data };
        })
        .catch(function (error) {
          res.status(500).json({ message:  error.response.data});
        });
    // res.cookie
    res.send(result);
}
