import AuthAPI from "../api/AuthAPI";

export default {
  indoorHistory: () =>
    AuthAPI.get("/api/sensor/history/indoor", {
      headers: { "Content-Type": "application/json" },
      params: {
        createdDate: "2022-09-26 14:05", //조회날짜
        division: "minute", //구분
        room: 1, //실 이름
        section: 1, //구역 이름
      },
    }),
  temphumidValue: (params) =>
    AuthAPI.get("/api/temphumid/value/", {
      headers: { "Content-Type": "application/json" },
      params: params,
    }),
  crop: (params) =>
    AuthAPI.get("/api/crop", {
      params: params,
    }),
  temphumid: (params) =>
    AuthAPI.get("/api/temphumid/history", {
      params: params,
    }),
  temphumidRoomList: () => AuthAPI.get("/api/temphumid/roomlist"),
  co2: (params) =>
    AuthAPI.get("/api/sensor/history/co2", {
      params: params,
    }),
  soil: (params) =>
    AuthAPI.get("/api/sensor/history/soil", {
      params: params,
    }),
  outdoor: (params) =>
    AuthAPI.get("/api/sensor/history/outdoor", {
      params: params,
    }),
  getEquipmentInfo: () => AuthAPI.get("/api/equipment/info"),
  getEquipmentlist: (item) =>
    AuthAPI.get("/api/equipment/equipment", { params: item }),
  getRoomlist: () => AuthAPI.get("/api/equipment/room"),
  editEquipmentCtrl: (item) => {
    return AuthAPI.put("/api/equipment/control", JSON.stringify(item), {
      headers: { "Content-Type": "application/json" },
    });
  },
  editEquipmentSetting: (item) =>
    AuthAPI.put("/api/equipment/setting", JSON.stringify(item), {
      headers: { "Content-Type": "application/json" },
    }),
  getEquipmentHistory: (params) =>
    AuthAPI.post("/api/equipment/history", JSON.stringify(params), {
      // 리퀘스트바디
      headers: { "Content-Type": "application/json" },
      // 리퀘스트바디
      // 파라미터
      params: {
        page: params.page,
        size: params.size,
      },
      // 파라미터
    }),
  waterECpHInfo: (params) =>
    AuthAPI.post("/api/fertilizer/search", JSON.stringify(params), {
      headers: { "Content-Type": "application/json" },
    }),
  waterECpHRegister: (params) =>
    AuthAPI.post("/api/fertilizer", JSON.stringify(params), {
      headers: { "Content-Type": "application/json" },
    }),
  waterECpHEdit: (params) =>
    AuthAPI.put("/api/fertilizer", JSON.stringify(params), {
      headers: { "Content-Type": "application/json" },
    }),
  getWaterPH: (params) =>
    AuthAPI.get("/api/fertilizer/value/ph", {
      params: params,
    }),
  getWaterEC: (params) =>
    AuthAPI.get("/api/fertilizer/value/ec", {
      params: params,
    }),
  getWaterpHECHistory: (params) =>
    AuthAPI.post("/api/fertilizer", JSON.stringify(params), {
      headers: { "Content-Type": "application/json" },
    }),
  getTableDataTempHumid: (params) =>
    AuthAPI.post(
      "/api/temphumid/history/table/minute",
      JSON.stringify(params),
      {
        headers: { "Content-Type": "application/json" },
      }
    ),
  getTableDataTempHumidHour: (params) =>
    AuthAPI.post("/api/temphumid/history/table/hour", JSON.stringify(params), {
      headers: { "Content-Type": "application/json" },
    }),
  getGraphWaterPhEC: (params) =>
    AuthAPI.get("/api/fertilizer/monitoring", {
      params: params,
    }),

  getGraphTempHumid: (params) =>
    AuthAPI.get("/api/temphumid/monitoring", {
      params: params,
    }),
  getRoomData: (params) =>
    AuthAPI.get("/api/monitoring", {
      params: params,
    }),
  getRoomContoller: (params) =>
    AuthAPI.get("/api/equipment/info", {
      params: params,
    }),
};
