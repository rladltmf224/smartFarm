import AuthAPI from "../api/AuthAPI";

export default {
  postRawmaterialStockData: (params) =>
    AuthAPI.post("/api/inventory/rawmaterial", JSON.stringify(params)),
  getReleaseProductItemTotal: (params) =>
    AuthAPI.get("/api/inventory/rawmaterial/total", {
      headers: { "Content-Type": "application/json" },
      params: params,
    }),
};
