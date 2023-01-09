import AuthAPI from "../api/AuthAPI";

export default {
  updateProductWarehousing: (params) =>
    AuthAPI.put("/api/inventory/product/storage", {
      headers: { "Content-Type": "application/json" },
      params: params,
    }),
  updateItemWarehousing: (params) =>
    AuthAPI.put("/api/inventory/rawmaterial/storage", JSON.stringify(params)),
  getStockList: () => AuthAPI.get("/api/inventory/check/lists"),
  getStockTakingList: (params) =>
    AuthAPI.post("/api/inventory/check/search", JSON.stringify(params)),
  getStockTakingDetailList: (params) =>
    AuthAPI.post("/api/inventory/check/detail", JSON.stringify(params)),
  getStockTakingLotList: (params) =>
    AuthAPI.post("/api/inventory/check/lot", {
      headers: { "Content-Type": "application/json" },
      params: params,
    }),
  getStockTakingStorageList: () => AuthAPI.get("/api/inventory/check/storage"),
  getStockTakingLocationList: (params) =>
    AuthAPI.get("/api/inventory/check/storagelocation", {
      headers: { "Content-Type": "application/json" },
      params: params,
    }),
  saveStockTakingList: (params) => AuthAPI.post("/api/inventory/check", params),
};
