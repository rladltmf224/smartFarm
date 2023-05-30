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
  getFilterCustomer: () =>
    AuthAPI.get("/api/workschedule/customerlist", {
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
    AuthAPI.put("/api/workschedule/detail", JSON.stringify(params), {
      headers: { "Content-Type": "application/json" },
    }),
  updateTotalScheduleInfo: (params) =>
    AuthAPI.put("/api/workschedule", JSON.stringify(params), {
      headers: { "Content-Type": "application/json" },
    }),
  deleteScheduleInfo: (params) =>
    AuthAPI.delete("/api/workschedule/detail", {
      headers: { "Content-Type": "application/json" },
      params: { workScheduleDetailId: params },
    }),
  getCustomerScheduleInfo: (params) =>
    AuthAPI.get("/api/workschedule", {
      headers: { "Content-Type": "application/json" },
      params: params,
    }),
  deleteTotalScheduleInfo: (params) =>
    AuthAPI.delete("/api/workschedule", {
      headers: { "Content-Type": "application/json" },
      params: { workScheduleId: params },
    }),
  saveCommentInfo: (params) =>
    AuthAPI.post("/api/workschedule/comment", JSON.stringify(params), {
      headers: { "Content-Type": "application/json" },
    }),
  getCommentInfo: (params) =>
    AuthAPI.get("/api/workschedule/comment", {
      headers: { "Content-Type": "application/json" },
      params: params,
    }),
  deleteCommentInfo: (params) =>
    AuthAPI.post("/api/workschedule/commentDelete", JSON.stringify(params), {
      headers: { "Content-Type": "application/json" },
    }),
  getTodayScheduleInfo: () =>
    AuthAPI.get("/api/workschedule/today", {
      headers: { "Content-Type": "application/json" },
    }),
  updateScheduleState: (params) =>
    AuthAPI.put("/api/workschedule/detail/done", JSON.stringify(params), {
      headers: { "Content-Type": "application/json" },
    }),
};
