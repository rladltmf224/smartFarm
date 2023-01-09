import AuthAPI from "../api/AuthAPI";

export default {
  postWarehousingCustomerData: (params) =>
    AuthAPI.post("/api/item/price/customer", JSON.stringify(params)),
  getWarehousingCustomerItemData: (params) =>
    AuthAPI.get("/api/item/price/customer/item", {
      headers: { "Content-Type": "application/json" },
      params: params,
    }),
  getWarehousingItemHistoryData: (params) =>
    AuthAPI.get("/api/item/price/history", {
      headers: { "Content-Type": "application/json" },
      params: params,
    }),
  postWarehousingItemData: (params) =>
    AuthAPI.post("/api/item/price/item", JSON.stringify(params)),
  postWarehousingItemRegiData: (params) =>
    AuthAPI.post("/api/item/price", JSON.stringify(params)),
  deleteWarehousingItemData: (params) =>
    AuthAPI.post("/api/item/price", {
      headers: { "Content-Type": "application/json" },
      params: params,
    }),
};
