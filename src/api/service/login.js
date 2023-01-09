import AuthAPI from "../api/AuthAPI";
import defaultAPI from "../api/defaultAPI";
import Vue from "vue";
export default {
  login: (params) =>
    defaultAPI.post("/api/account/login", JSON.stringify(params)),
  logout: () => AuthAPI.get("api/account/logout"),
  getUserData: (userID) => {
    console.log("getUserData : " + userID);
    AuthAPI.get("api/account/logout", {
      params: {
        userId: "master",
      },
    });
  },
  tokenRefresh: () => {
    console.log("token refresh");
    console.log(Vue.$cookies.get("refreshToken"));

    return defaultAPI.post(
      "/api/account/refreshtoken",
      JSON.stringify({ refreshToken: Vue.$cookies.get("refreshToken") }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  },
  updateUserInfoPage: (params) =>
    AuthAPI.post("/api/account/changepw", JSON.stringify(params)),
};
