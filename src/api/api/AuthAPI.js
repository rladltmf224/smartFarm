import Vue from "vue";
import axios from "axios";
import store from "@/store/index";
import router from "@/router/index";
import VueJwtDecode from "vue-jwt-decode";

// Axios Interceptor
function setInterceptors(instance) {
  // 요청 직전에 가로채서 동작을 제어

  instance.interceptors.request.use(
    async function (config) {
      if (Vue.$cookies.isKey("accessToken")) {
        // 헤더에 사용자 토큰 추가
        config.headers.Authorization =
          "Bearer " + Vue.$cookies.get("accessToken");
        config.headers["Content-Type"] = "application/json";

        //console.log("accessToken", config);
      } else if (Vue.$cookies.isKey("refreshToken")) {
        console.log("refresh Token으로 access Token을 재발급 받겠습니다");
        await store
          .dispatch("tokenRefresh")
          .then((response) => {
            let decodeData = VueJwtDecode.decode(
              Vue.$cookies.get("accessToken")
            );
            console.log(
              "access Token : ",
              Vue.$cookies.get("accessToken"),
              VueJwtDecode.decode(Vue.$cookies.get("accessToken"), decodeData)
            );
            config.headers.Authorization =
              "Bearer " + Vue.$cookies.get("accessToken");
            config.headers["Content-Type"] = "application/json";
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        alert("다시 로그인하세요");
        router.push({ path: "Login" });
      }

      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  // 응답을 받고 then catch로 처리하기 직전에 가로채서 동작을 제어
  instance.interceptors.response.use(
    function (response) {
      return response;
    },
    // 401 : 토큰 만료됨
    // 400 & 유효한 토큰이 아닙니다 : 토큰 자체가 이상함
    async function (error) {
      const {
        config,
        response: { status },
      } = error;

      if (
        status == 401 ||
        error.response.data.message == "JWT 토큰 정보가 올바르지 않습니다." ||
        error.response.data.message == "유효한 토큰이 아닙니다."
      ) {
        const originalRequest = config;
        await store
          .dispatch("tokenRefresh")
          .then((response) => {
            console.log("response", response);
            originalRequest.headers.Authorization =
              "Bearer " + Vue.$cookies.get("accessToken");
          })
          .catch((error) => {
            console.log(error);
            const {
              config,
              response: { status },
            } = error;
            if (
              status == 401 ||
              error.response.data.message ==
                "JWT 토큰 정보가 올바르지 않습니다." ||
              error.response.data.message == "유효한 토큰이 아닙니다."
            ) {
              alert("다시 로그인하세요");
              router.push({ path: "Login" });
              return;
            }
          });
        return axios(originalRequest);
      }
      return Promise.reject(error);
    }
  );

  return instance;
}

// 인스턴스 생성
function createInstance() {
  console.log("create AuthAPI Instance");
  const instance = axios.create({
    //baseURL: process.env.VUE_APP_API_URL,
    // baseUrl: {
    //   dev: '/api/',
    //   pro: '/api/'
    // }
  });

  return setInterceptors(instance);
}

const instance = createInstance();

// 각 메소드별 함수를 생성해 주세요.
export default {
  async get(...options) {
    try {
      const res = await instance.get(...options);
      return res;
    } catch (e) {
      return e.response;
    }
  },

  async post(...options) {
    try {
      const res = await instance.post(...options);
      console.log("res", res);
      return res;
    } catch (e) {
      return e.response;
    }
  },

  async put(...options) {
    try {
      const res = await instance.put(...options);
      return res;
    } catch (e) {
      return e.response;
    }
  },

  async delete(...options) {
    try {
      const res = await instance.delete(...options);
      return res;
    } catch (e) {
      return e.response;
    }
  },
};
