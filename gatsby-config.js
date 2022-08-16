module.exports = {
  siteMetadata: {
    title: `life-style-demo`,
    siteUrl: `https://www.yourdomain.tld`
  },
  plugins: [{
    resolve: 'gatsby-source-contentful',
    options: {
      "accessToken": "rv4pSW7OxlBFzgEsemknDueAQ3nCeNqiMj4ZFPvAJ6w",
      "spaceId": "mjr4oaaljn50"
    }
  }, "gatsby-plugin-sass"]
};