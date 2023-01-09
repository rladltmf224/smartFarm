import AuthAPI from "../api/AuthAPI";

export default {
  getProductWarehousingList: (params) =>
    AuthAPI.post("/api/warehousing/product/list", JSON.stringify(params)),
  createProductWarehousingData: (params) =>
    AuthAPI.post("/api/warehousing/product", JSON.stringify(params)),
  getProductWarehousingDetailList: (params) =>
    AuthAPI.get("/api/warehousing/product/detail", {
      headers: { "Content-Type": "application/json" },
      params: params,
    }),
  getProductWarehousingHistoryList: (params) =>
    AuthAPI.post("/api/warehousing/product/history", JSON.stringify(params)),
  getProductWarehousingJoborderList: (params) =>
    AuthAPI.post("/api/warehousing/product/joborder", JSON.stringify(params)),
  getProductWarehousingJoborderDetailList: (params) =>
    AuthAPI.get("/api/warehousing/product/joborder/detail", {
      headers: { "Content-Type": "application/json" },
      params: params,
    }),
  deleteProductWarehousingList: (params) =>
    AuthAPI.delete("/api/warehousing/product", {
      headers: { "Content-Type": "application/json" },
      params: params,
    }),
  getProductLOTHistoryList: (params) =>
    AuthAPI.post(
      "/api/warehousing/product/detail/status",
      JSON.stringify(params)
    ),
};
