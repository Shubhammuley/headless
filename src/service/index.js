import axios from "axios";

export const getCountries = async () => {
  const config = {
      method: "get",
      url: "http://localhost:8088/BC/countries",
    };
    const result = await axios(config)
      .then(function(response) {
        return response.data;
      })
      .catch(function(error) {
        console.log(error);
      });
    return result;
}

export const getStates = async (countryId) => {
  const config = {
      method: "get",
      url: `http://localhost:8088/BC/states/${countryId}`,
    };
    const result = await axios(config)
      .then(function(response) {
        return response.data;
      })
      .catch(function(error) {
        console.log(error.message);
      });
    return result;
}

export const signUp = async (data) => {
  const config = {
      method: "post",
      url: `http://localhost:8088/BC/signUp`,
      data,
    };
    const result = await axios(config)
      .then(function(response) {
        return response.data;
      })
      .catch(function(error) {
        // console.log(error.message);
        throw Error(error.message);
      });
    return result;
}