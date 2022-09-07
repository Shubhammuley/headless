import axios from "axios";
import environmentConfig from "../enviornment";

export const getCountries = async () => {
  const config = {
      method: "get",
      url: environmentConfig.apiUrl.getCountries,
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
      url: `${environmentConfig.apiUrl.getState}?stateId=${countryId}`,
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
      url: environmentConfig.apiUrl.signUp,
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

export const getProductList = async ({ page = 1, sort= 'id', direction= 'asc', category= null, keyword, idIn, id }) => {
  let url = `${environmentConfig.apiUrl.getProduct}?page=${page}&sort=${sort}&direction=${direction}`;
  if (category) {
    url = url + `&category=${category}`;
  }

  if (keyword) {
    url = url + `&keyword=${keyword}`;
  }

  if(idIn) {
    url = url + `&idIn=${idIn}`;
  } else if (id) {
    url = url + `&id=${id}`;
  }
  const config = {
      method: "get",
      url,
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


export const createWishList = async (data) => {
  const config = {
      method: "post",
      url: environmentConfig.apiUrl.createWishList,
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

export const getAllWishLists = async (customerId) => {
  const config = {
      method: "get",
      url: `${environmentConfig.apiUrl.getAllWishLists}?customerId=${customerId}`,
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

export const addProductToWishList = async (data) => {
  const config = {
      method: "post",
      url: `${environmentConfig.apiUrl.addWishListItem}`,
      data
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