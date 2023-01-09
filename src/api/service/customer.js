import AuthAPI from "../api/AuthAPI";

export default {
  postCustomerList: (params) =>
    AuthAPI.post("/api/customer/search", JSON.stringify(params)),
  createCustomerItem: (params) =>
    AuthAPI.post("/api/customer", JSON.stringify(params)),
  updateCustomerItem: (params) =>
    AuthAPI.put("/api/customer", JSON.stringify(params)),
};
