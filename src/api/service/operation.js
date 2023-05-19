import AuthAPI from "../api/AuthAPI";

export default {
  getTotalOrderListPage: (params) =>
    AuthAPI.post("/api/operation/joborder/search", JSON.stringify(params)),
  getTotalDetailOrderListPage: (params) =>
    AuthAPI.post(
      "/api/operation/joborder/detail/search",
      JSON.stringify(params)
    ),
  getOperationOrderPage: (params) =>
    AuthAPI.post(
      "/api/operation/joborder/detail/search",
      JSON.stringify(params)
    ),
  getBasicDataPage: () => AuthAPI.get("/api/operation/joborder/basicdatas"),
  getOperationOrderChangePage: (params) =>
    AuthAPI.put("/api/operation/joborder", JSON.stringify(params)),
  makeOperationOrderPage: (params) =>
    AuthAPI.post("/api/operation/joborder", JSON.stringify(params)),

  
  
  
  
  
  getDepartmentDataPage: () =>
    AuthAPI.get("/api/operation/joborder/department"),

  searchJobOrderCode: (params) =>
    AuthAPI.get("/api/operation/joborder/search/code", {
      params: params,
    }),

  getDepartmentCrewDataPage: (params) =>
    AuthAPI.get("/api/operation/joborder/department/account", {
      params: params,
    }),
  deleteorderList: (params) =>
    AuthAPI.delete("/api/operation/joborder", {
      params: params,
    }),
  getOrderTempPage: (params) =>
    AuthAPI.post("/api/operation/joborder/temp", JSON.stringify(params)),
  getOrderTempListPage: () => AuthAPI.get("/api/operation/joborder/temp"),
  getJobOrerDetail: (params) =>
    AuthAPI.get("/api/operation/joborder/detail", {
      params: params,
    }),
  deletetempList: (params) =>
    AuthAPI.delete("/api/operation/joborder/temp", {
      params: {
        id: params.id
          .toString()
          .replace("[", "")
          .replace("]", "")
          .replace(" ", ""),
      },
    }),
  updateOperationOrderPage: (params) =>
    AuthAPI.put("/api/operation/joborder/status", JSON.stringify(params)),
  getItemListByBom: (params) =>
    AuthAPI.get("/api/operation/joborder/item/bom", {
      params: params,
    }),
};
