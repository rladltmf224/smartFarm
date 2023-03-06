import AuthAPI from "../api/AuthAPI";

export default {
  getDepartmentItem: () => AuthAPI.get("/api/department"),
  createDepartmentItem: (params) =>
    AuthAPI.post("/api/department", JSON.stringify(params)),
  createUserItem: (params) =>
    AuthAPI.post("/api/account", JSON.stringify(params)),
  updateDepartmentItem: (params) =>
    AuthAPI.delete("/api/department", JSON.stringify(params)),
  updateUserItem: (params) =>
    AuthAPI.put("/api/account", JSON.stringify(params)),
};
