const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  // productionSourceMap: false,
  // configureWebpack: {
  //   mode: "production",
  //   devtool: "eval",
  // },
  transpileDependencies: ["vuetify"],
  lintOnSave: false,
  devServer: {
    proxy: {
      "/api/": {
        //target: "http://14.47.96.237:8081", // 노서버2
        target: "http://192.168.0.126:9090", // 노서버2
        //target: "http://192.168.0.38:8080", // 노서버2

        changeOrigin: true,
      },
    },
  },
});

//target: "http://192.168.0.84:8080", // 설님 서버
//target: "http://14.47.96.237:8081", // 테육 서버
//설님 서버 id:master
//설님 서버 password:qwer1234!@
