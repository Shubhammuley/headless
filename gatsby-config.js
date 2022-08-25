module.exports = {
  siteMetadata: {
    title: `demo-gatsby-with-contentful`,
    siteUrl: `https://www.yourdomain.tld`
  },
  plugins: [{
    resolve: 'gatsby-source-contentful',
    options: {
      "accessToken": "q_MNfYpq9cV9140D0ry3Hn_yDFyiQDp8H-OwedTS-YI",
      "spaceId": "vigbzuzeralu"
    }
  }, {
    resolve: 'gatsby-source-bigcommerce',
    options: {
      // REQUIRED
      clientId: 'o0eqscj0wpelynkfmdun6s13pys7j5m',
      secret: 'be374b5e46eab33699140427b0c9cd73f24a08c16439cdf4b14926cbb1cb4d19',
      accessToken: 'lukvrlbivyj2c3i0ghiel647g1tv60l',
      storeHash: 'qjmdzrcw',
      endpoints: {
        BigCommerceProducts: '/catalog/products?include=images,variants,custom_fields,options,modifiers,videos&is_visible=true',
        BigCommerceCategories: '/catalog/categories',
        BigCommerceBrands: "/catalog/brands"
      }
    }
  }, "gatsby-plugin-sass", `gatsby-plugin-image`]
};