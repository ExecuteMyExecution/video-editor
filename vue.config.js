const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  // publicPath: process.env.NODE_ENV == "development" ? "/static" : "/app/static",
  devServer: {
    open: true,
    host: 'localhost',
  }
})
