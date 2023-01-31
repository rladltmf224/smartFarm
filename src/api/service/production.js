import AuthAPI from "../api/AuthAPI";

export default {
  getProdutionList: (params) =>
    AuthAPI.get("/api/production", {
      params: params,
      headers: { "Content-Type": "application/json" },
    }),
  postProdutionData: (params) =>
    AuthAPI.post("/api/production", JSON.stringify(params)),
  putProdutionData: (params) =>
    AuthAPI.put("/api/production", JSON.stringify(params), {
      headers: { "Content-Type": "application/json" },
    }),
  deleteProdutionData: (params) =>
    AuthAPI.delete("/api/production", {
      params: params,
    }),
};
