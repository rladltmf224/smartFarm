import Vue from "vue";
import Vuex from "vuex";
import api from "@/api/service/login";
import { Alarm } from "./modules/alarm.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    pageName: "모니터링", //app bar default 페이지이름
    // nothing: 아무것도 안함
    // pending: 데이터 기다리는중
    // manager: 로그인 성공
    // worker: 작업자로 로그인
    // fail: 로그인 실패
    // error: 에러
    current: "worker",
    // accessToken: '',
    // refreshToken: '',
    userId: "",
    userInfo: null,
    // on : 서버 연결
    // postman : 포스트맨 (서버 연결 끊겼을 때)
    // off : Data.json (인터넷 안될 때)
    mode: "on",
    save_type: "",
  },
  getters: {
    GET_CURRENT: (state) => state.current,
    // 'GET_ACCESS_TOKEN': state => state.accessToken,
    //'GET_REFRESH_TOKEN': state => state.refreshToken,
    GET_USERID: (state) => state.userId,
    GET_USERINFO: (state) => state.userInfo,
  },
  mutations: {
    // 로그인 성공하면 토큰 저장
    setUserId(state, loginData) {
      console.log("#####", state, loginData);
      console.log(loginData);
      state.userId = loginData["userId"]; //강서버
      // state.userId = loginData['username']  // 노서버
      // state.accessToken = loginData['accessToken']
      //state.refreshToken = loginData['refreshToken']
      Vue.$cookies.set("accessToken", loginData["accessToken"], 60 * 30); // 30분
      Vue.$cookies.set("refreshToken", loginData["refreshToken"], "7d"); // 7일
    },
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
      Vue.$cookies.set("userInfo", userInfo, "7d");
    },
    synchronizeUserInfo(state) {
      let info = Vue.$cookies.get("userInfo");
      state.userInfo = info;
      state.userId = info["userId"];
    },
    setSaveType(state, type) {
      state.save_type = type;
    },
    setCurrent(state, current) {
      state.current = current;
    },
    setPageName(state, pageName) {
      state.pageName = pageName;
      console.log("뮤테이션 페이지네임", pageName);
    },

    logout(state) {
      state.userId = "";
      state.userInfo = null;
      Vue.$cookies.remove("accessToken");
      Vue.$cookies.remove("refreshToken");
      Vue.$cookies.remove("userInfo");
      if (state.save_type == "ID") {
        Vue.$cookies.remove("pw");
      }

      if (state.save_type == "") {
        Vue.$cookies.remove("pw");
        Vue.$cookies.remove("id");
      }

      console.log("로그아웃");
    },
  },
  actions: {
    getUserInfo: async function ({ commit }, data) {
      commit("setCurrent", "pending");
      await api
        .login(data["account"])
        .then((response) => {
          console.log("getUserInfo", response);

          if (response.status == 200) {
            if (data.type == "ID") {
              Vue.$cookies.set("id", data.account.userId, "7d"); // 7일
            }

            if (data.type == "IDPW") {
              Vue.$cookies.set("id", data.account.userId, "7d"); // 7일
              Vue.$cookies.set("pw", data.account.userPw, "7d"); // 7일
            }
            commit("setUserId", response.data.responseData);
            return response;
          } else {
            commit("setCurrent", "fail");
            return response;
          }
        })
        .catch((error) => {
          console.log("Error in getUserInfo");
          //console.log(error.response.data.detailMessage);

          commit("setCurrent", "error");
          return error;
        });
    },
    getUserData: async function ({ commit }, userId) {
      // 로그인(Login.vue) or 개인정보수정(MyInfo.vue) 할 때 씀
      await api
        .getUserData(userId)
        .then((response) => {
          console.log("UserData");
          console.log(response.data.responseData);
          let myInfo = JSON.parse(JSON.stringify(response.data.responseData));
          // let myInfo = response.data.data

          let roles = myInfo["accountRoles"];
          let rolesAfter = {
            id: roles["id"],

            InspectionStatus: true,
            InspectionControl: true,
            SpecialControl: roles["specialControl"] == "Y" ? true : false,

            EquipmentInfoRegistration:
              roles["equipmentInfoRegistration"] == "Y" ? true : false,
            InspectionItemsRegistration:
              roles["inspectionItemsRegistration"] == "Y" ? true : false,
            ModelRegistration: roles["modelRegistration"] == "Y" ? true : false,
            AlarmSetting: roles["alarmSetting"] == "Y" ? true : false,

            RecipeLookup: roles["recipeLookup"] == "Y" ? true : false,
            InspectionProcessDesign:
              roles["inspectionProcessDesign"] == "Y" ? true : false,
            RecipeDistribution:
              roles["recipeDistribution"] == "Y" ? true : false,

            InspectionData: roles["inspectionData"] == "Y" ? true : false,
            EquipmentData: roles["equipmentData"] == "Y" ? true : false,
            AuxiliaryData: roles["auxiliaryData"] == "Y" ? true : false,
            AlarmHistory: roles["alarmHistory"] == "Y" ? true : false,
            ProgramLog: roles["programLog"] == "Y" ? true : false,

            Authority: roles["authority"] == "Y" ? true : false,

            master: roles["master"] == "Y" ? true : false,
          };
          myInfo["accountRoles"] = rolesAfter;

          let fav = myInfo["favorites"];
          let favAfter = {
            id: fav["id"],

            InspectionStatus: fav["inspectionStatus"] == "Y" ? true : false,
            InspectionControl: fav["inspectionControl"] == "Y" ? true : false,
            SpecialControl: fav["specialControl"] == "Y" ? true : false,

            EquipmentInfoRegistration:
              fav["equipmentInfoRegistration"] == "Y" ? true : false,
            InspectionItemsRegistration:
              fav["inspectionItemsRegistration"] == "Y" ? true : false,
            ModelRegistration: fav["modelRegistration"] == "Y" ? true : false,
            AlarmSetting: fav["alarmSetting"] == "Y" ? true : false,

            RecipeLookup: fav["recipeLookup"] == "Y" ? true : false,
            InspectionProcessDesign:
              fav["inspectionProcessDesign"] == "Y" ? true : false,
            RecipeDistribution: fav["recipeDistribution"] == "Y" ? true : false,

            InspectionData: fav["inspectionData"] == "Y" ? true : false,
            EquipmentData: fav["equipmentData"] == "Y" ? true : false,
            AuxiliaryData: fav["auxiliaryData"] == "Y" ? true : false,
            AlarmHistory: fav["alarmHistory"] == "Y" ? true : false,
            ProgramLog: fav["programLog"] == "Y" ? true : false,

            Authority: fav["authority"] == "Y" ? true : false,
          };
          myInfo["favorites"] = favAfter;

          commit("setUserInfo", myInfo);
          commit("setCurrent", "manager");
          return;
        })
        .catch((error) => {
          console.log("getUserData Error");
          console.log(error.response.data.detailMessage);
          commit("setCurrent", "fail");
          return;
        });
    },
    tokenRefresh: async function ({ commit }) {
      commit("setCurrent", "pending");
      await api
        .tokenRefresh()
        .then((response) => {
          console.log("response tokenRefresh", response);
          if (response.data) {
            console.log("응답옴");
            // commit('setUserId', response.data);    // 노서버
            commit("setUserId", response.data.responseData); // 강서버
            commit("setCurrent", "manager");
            return;
          } else {
            commit("setCurrent", "fail");
            //Vue.$router.push({path:"Login"});
            return;
          }
        })
        .catch((error) => {
          console.log("Error in tokenRefresh");
          console.log(error);
          commit("setCurrent", "error");
          //Vue.$router.push({path:"Login"});
          return Promise.reject(error);
        });
    },
  },
  modules: {
    ALARM: Alarm,
  },
});
