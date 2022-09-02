import axios from "axios";

export default async function handler(req, res) {
    const storeUrl = "https://api.bigcommerce.com/stores/qjmdzrcw";
    const apiToken = "lukvrlbivyj2c3i0ghiel647g1tv60l";
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
        .then(function (response) {
            res.header(response.headers);
            return { data: response.data.data.login, tokens: response.headers };
        })
        .catch(function (error) {
            console.log(error);
        });
    // res.cookie
    res.send(result);
}
