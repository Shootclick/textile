module.exports = {
  "devServer": {
    "proxy": {
      "/api": {
        "target": "http://localhost:8080",
        "ws": true,
        "changeOrigin": true
      }
    }
  },
  "transpileDependencies": [
    "vuetify"
  ]
}
if(process.env.NODE_ENV === 'production'){
  module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
    ? '././'
    : '/',
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].minify.removeAttributeQuotes = false;
        return args;
      })
  },
  "transpileDependencies": [
    "vuetify"
  ]
  }
}