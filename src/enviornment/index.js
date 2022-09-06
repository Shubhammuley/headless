const ENV = process.env.NODE_ENV || 'development';
const config = require('./' + ENV);
const apiEnv = process.env.API_URL || 'netlify_lambda';
const apiUrl = config[apiEnv]
module.exports = {
    apiUrl,
    config
};
