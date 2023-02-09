import AuthAPI from "../api/AuthAPI";

export default {
  getProcessListbyItem: (params) =>
    AuthAPI.get("/api/process/byitem", {
      params: params,
      headers: { "Content-Type": "application/json" },
    }),
};
