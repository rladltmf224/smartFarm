import AuthAPI from "../api/AuthAPI";

export default {
  getItemList: (params) =>
    AuthAPI.post("/api/item/search", JSON.stringify(params)),
  createItemList: (params) => AuthAPI.post("/api/item", JSON.stringify(params)),
  updateItemList: (params) => AuthAPI.put("/api/item", JSON.stringify(params)),
  deleteItemList: (params) =>
    AuthAPI.delete("/api/item", {
      params: params,
      headers: { "Content-Type": "application/json" },
    }),
  getItemPage: () => AuthAPI.get("/api/item/basicdatas"),
};
