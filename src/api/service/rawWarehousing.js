import AuthAPI from "../api/AuthAPI";

export default {
  getStatementList: () => AuthAPI.get("/api/statement"),
  getStatementDetailList: (params) =>
    AuthAPI.post("/api/statement/detail", {
      params: params,
    }),
  getWarehousingData: () => AuthAPI.get("/api/warehousing/basicdatas"),
  createWarehousingData: (params) =>
    AuthAPI.post("/api/warehousing", JSON.stringify(params)),
  getWarehousingList: (params) =>
    AuthAPI.post("/api/warehousing/list", JSON.stringify(params)),
  getWarehousingDetailList: (params) =>
    AuthAPI.get("/api/warehousing/detail", {
      params: params,
    }),
  updateWarehousingList: (params) =>
    AuthAPI.put("/api/warehousing", JSON.stringify(params)),
  deleteWarehousingList: (params) =>
    AuthAPI.post("/api/warehousing/cancel", JSON.stringify(params)),
  getWarehousingHistoryList: (params) =>
    AuthAPI.get("/api/warehousing/history", {
      params: params,
    }),
};
