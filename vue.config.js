const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  // productionSourceMap: false,
  // configureWebpack: {
  //   mode: "production",
  //   devtool: "eval",115,007 5781 	109,226
  // },
  transpileDependencies: ["vuetify"],
  lintOnSave: false,
  devServer: {
    proxy: {
      "/api/": {
        //target: "http://14.47.96.237:8081", // 메인
        //target: "http://192.168.0.231:8080", // 메인
        //target: "http://192.168.0.84:8080", // 박설 연구원
        //target: "http://192.168.0.61:8089", // 노현종 선임
        //target: "http://192.168.0.126:9090", // 정호윤 연구원
        //target: "http://192.168.0.193:8081", // 대일책임님
        target: "http://192.168.0.43:8089", // 병수선임님
        //target: "http://192.168.0.239:8080", // 변동된메인ip
        changeOrigin: true,
      },
    },
  },
  outputDir:
    "C:/Users/TWIM/Desktop/Server/SmartFarm_BE/SmartFarm_BE/tsmartfarm/src/main/resources/static",
  runtimeCompiler: true,
});
