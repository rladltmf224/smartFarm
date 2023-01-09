import AuthAPI from "../api/AuthAPI";

export default {
  getBomPage: (params) =>
    AuthAPI.post("/api/bom/search", JSON.stringify(params)),
  getBomItemPage: (params) =>
    AuthAPI.post("/api/bom/item", JSON.stringify(params)),
  createBomList: (params) => AuthAPI.post("/api/bom", JSON.stringify(params)),
  updateBomList: (params) => AuthAPI.put("/api/bom", JSON.stringify(params)),
  getBomCustomer: () => AuthAPI.get("/api/bom/customer"),
  getProductList: (params) =>
    AuthAPI.post("/api/bom/product", JSON.stringify(params)),
  getItemHistoryList: (params) =>
    AuthAPI.get("/api/bom/backward", {
      params: params,
      headers: { "Content-Type": "application/json" },
    }),
  getBomHistoryList: (params) =>
    AuthAPI.get("/api/bom/forward", {
      params: params,
      headers: { "Content-Type": "application/json" },
    }),
  deleteBomList: (params) =>
    AuthAPI.delete("/api/bom", {
      headers: { "Content-Type": "application/json" },
      params: {
        itemId: params.itemId
          .toString()
          .replace("[", "")
          .replace("]", "")
          .replace(" ", ""),
      },
    }),
};
