import AuthAPI from "../api/AuthAPI";

export default {
  getReleaseProductList: (params) =>
    AuthAPI.post("/api/release/product/search", JSON.stringify(params)),
  createReleaseProductOrderData: (params) =>
    AuthAPI.post("/api/release/product", JSON.stringify(params)),
  updateReleaseProductProcess: (params) =>
    AuthAPI.put("/api/release/product", JSON.stringify(params)),
  deleteReleaseProductList: (params) =>
    AuthAPI.delete("/api/release/product", {
      headers: { "Content-Type": "application/json" },
      params: params,
    }),
  updateReleaseProductDone: (params) =>
    AuthAPI.put("/api/release/product/complete", JSON.stringify(params)),
  getReleaseProducCustomer: (params) =>
    AuthAPI.get("/api/release/product/customer", {
      headers: { "Content-Type": "application/json" },
      params: params,
    }),
  getReleaseProductDetailList: (params) =>
    AuthAPI.get("/api/release/product/detail", {
      headers: { "Content-Type": "application/json" },
      params: params,
    }),
  getReleaseProductItemList: (params) =>
    AuthAPI.get("/api/release/product/item", {
      headers: { "Content-Type": "application/json" },
      params: params,
    }),
  getReleaseProductStockList: (params) =>
    AuthAPI.post("/api/release/product/status", JSON.stringify(params)),

  getReleaseProductList_edit: (params) =>
    AuthAPI.post("/api/editRelease/product/search", JSON.stringify(params)),
  getReleaseProductJobList: () =>
    AuthAPI.get("/api/editRelease/product/jobOrder", {
      headers: { "Content-Type": "application/json" },
    }),

  getReleaseProductJobDone: (params) =>
    AuthAPI.post("/api/editRelease/product", JSON.stringify(params)),
  deleteReleaseProductJobData: (params) =>
    AuthAPI.delete("/api/editRelease/product", {
      headers: { "Content-Type": "application/json" },
      params: params,
    }),
};
