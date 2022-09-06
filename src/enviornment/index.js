const ENV = "development";
const config = require('./' + ENV);
const apiEnv = 'gatsby_url';
const apiUrl = config[apiEnv]
module.exports = {
    apiUrl,
    config
};
