const ENV = "development";
const config = require('./' + ENV);
const apiEnv = process.env.NODE_ENV === 'production' ? 'netlify_lambda' : 'gatsby_url';
const apiUrl = config[apiEnv]
module.exports = {
    apiUrl,
    config
};
