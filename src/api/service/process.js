import AuthAPI from "../api/AuthAPI";

export default {
  getProcessList: (params) =>
    AuthAPI.get("/api/process", {
      params: params,
      headers: { "Content-Type": "application/json" },
    }),
  getProcessDetail: (params) =>
    AuthAPI.get("/api/process/detail", {
      params: params,
      headers: { "Content-Type": "application/json" },
    }),
  postProcessData: (params) =>
    AuthAPI.post("/api/process", JSON.stringify(params)),
  putProcessData: (params) =>
    AuthAPI.put("/api/process", JSON.stringify(params), {
      headers: { "Content-Type": "application/json" },
    }),
  deleteProcessData: (params) =>
    AuthAPI.delete("/api/process", {
      params: params,
    }),
};
