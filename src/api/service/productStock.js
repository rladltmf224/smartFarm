import AuthAPI from "../api/AuthAPI";

export default {
  postProductStockData: (params) =>
    AuthAPI.post("/api/inventory/product/search", JSON.stringify(params)),
  getProductStockDetailList: (params) =>
    AuthAPI.get("/api/inventory/product/detail", {
      headers: { "Content-Type": "application/json" },
      params: params,
    }),
  getProductStockItemList: (params) =>
    AuthAPI.get("/api/inventory/product/itemid", {
      headers: { "Content-Type": "application/json" },
      params: params,
    }),
  getProductStockItemTotal: (params) =>
    AuthAPI.get("/api/inventory/product/total", {
      headers: { "Content-Type": "application/json" },
      params: params,
    }),
};
