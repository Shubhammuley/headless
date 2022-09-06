import axios from "axios";

export async function handler(req, res) {
    const storeUrl = "https://api.bigcommerce.com/stores/qjmdzrcw";
    const apiToken = "lukvrlbivyj2c3i0ghiel647g1tv60l";

    const {
        password,
        email,
        countryCode,
        firstName,
        lastName,
        address1,
        address2,
        company,
        city,
        state,
        zipCode,
        phone,
      } = JSON.parse(req.body);
      const data = JSON.stringify([
        {
          email,
          first_name: firstName,
          last_name: lastName,
          company,
          phone,
          addresses: [
            {
              first_name: firstName,
              last_name: lastName,
              address1,
              address2,
              postal_code: zipCode,
              state_or_province: state,
              city,
              country_code: countryCode,
              authentication: {
                new_password: password,
              },
            },
          ],
        },
      ]);
      const config = {
        method: "post",
        withCredentials: false,
        mode: "no-cors",
        url: `${storeUrl}/v3/customers`,
        headers: {
          "sec-ch-ua":
            '"Chromium";v="104", " Not A;Brand";v="99", "Google Chrome";v="104"',
          Referer: "http://localhost:8000/",
          "X-Auth-Token": apiToken,
          "Content-Type": "application/json",
        },
        data,
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
