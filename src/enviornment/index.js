const ENV = "development";
const config = require('./' + ENV);
const apiEnv = 'netlify_lambda';
const apiUrl = config[apiEnv]
module.exports = {
    apiUrl,
    config
};
