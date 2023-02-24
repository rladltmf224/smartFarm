import AuthAPI from "../api/AuthAPI";

export default {
  getTotalScheduleInfo: () =>
    AuthAPI.get("/api/workschedule/totalDate", {
      headers: { "Content-Type": "application/json" },
    }),
  getCustomerInfo: () =>
    AuthAPI.get("/api/workschedule/customer", {
      headers: { "Content-Type": "application/json" },
    }),
  getScheduleInfo: (params) =>
    AuthAPI.post("/api/workschedule/search", JSON.stringify(params), {
      headers: { "Content-Type": "application/json" },
    }),
  saveScheduleInfo: (params) =>
    AuthAPI.post("/api/workschedule", JSON.stringify(params), {
      headers: { "Content-Type": "application/json" },
    }),
  updateScheduleInfo: (params) =>
    AuthAPI.put("/api/workschedule", JSON.stringify(params), {
      headers: { "Content-Type": "application/json" },
    }),
  deleteScheduleInfo: (params) =>
    AuthAPI.delete("/api/workschedule", {
      headers: { "Content-Type": "application/json" },
      params: { workScheduleId: params },
    }),
};
