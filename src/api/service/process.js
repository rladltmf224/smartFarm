import AuthAPI from "../api/AuthAPI";

export default {
  getProcessListbyItem: (params) =>
    AuthAPI.get("/api/process", {
      params: params,
      headers: { "Content-Type": "application/json" },
    }),
  getProcessDetail: (params) =>
    AuthAPI.get("/api/process/detail", {
      params: params,
      headers: { "Content-Type": "application/json" },
    }),
  getProcessExcelDown: (params) =>
    AuthAPI.get("/api/process/download", {
      params: params,
      headers: { "Content-Type": "application/json" },
      responseType: "blob",
    }),

  deleteProcess: (params) =>
    AuthAPI.delete("/api/process", {
      params: params,
    }),

  postProcess: (params) =>
    AuthAPI.post("/api/process", params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};
