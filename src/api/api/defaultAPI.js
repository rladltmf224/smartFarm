import axios from "axios";

// 인스턴스 생성
function createInstance() {
  console.log("create defaultAPI Instance");
  const instance = axios.create({
    // baseURL: process.env.VUE_APP_API_URL,
    // baseUrl: {
    //   dev: '/api/',
    //   pro: '/api/'
    // }
  });

  return instance;
}

const instance = createInstance();

console.log("default 인스턴스 생성", instance.defaults.baseURL);

// 각 메소드별 함수를 생성해 주세요.
export default {
  async get(...options) {
    try {
      const res = await instance.get(...options);
      return res;
    } catch (e) {
      return e;
    }
  },

  async post(...options) {
    try {
      const res = await instance.post(...options);
      return res;
    } catch (e) {
      return e;
    }
  },

  async put(...options) {
    try {
      const res = await instance.put(...options);
      return res;
    } catch (e) {
      return e;
    }
  },

  async delete(...options) {
    try {
      const res = await instance.delete(...options);
      return res;
    } catch (e) {
      return e;
    }
  },
};
