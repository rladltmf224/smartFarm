import AuthAPI from "../api/AuthAPI";

export default {
  getOrderInfo: (
    params //수주 정보 조회
  ) =>
    AuthAPI.post("/api/orderinfo/search", JSON.stringify(params), {
      headers: { "Content-Type": "application/json" },
    }),

  getCustomerNameList: (
    params //수주 정보 등록 - 거래처 조회
  ) =>
    AuthAPI.post("/api/orderinfo/customer", JSON.stringify(params), {
      headers: { "Content-Type": "application/json" },
    }),

  saveOrderInfo: (
    params //수주 정보 등록
  ) =>
    AuthAPI.get("/api/orderinfo", JSON.stringify(params), {
      headers: { "Content-Type": "application/json" },
    }),

  getOrderInfoDetail: (
    params //수주 정보 상세 조회
  ) =>
    AuthAPI.get("/api/orderinfo/detail", {
      params: params,
    }),

  getItems: (
    params //수주 정보 등록 - 품목 조회
  ) =>
    AuthAPI.post("/api/orderinfo/item", JSON.stringify(params), {
      headers: { "Content-Type": "application/json" },
    }),
};
