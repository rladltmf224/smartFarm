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
    AuthAPI.post("/api/orderinfo", JSON.stringify(params), {
      headers: { "Content-Type": "application/json" },
    }),

  getOrderInfoDetail: (
    params //수주 정보 상세 조회
  ) =>
    AuthAPI.get("/api/orderinfo/detail", {
      params: params,
    }),

  /* getItems: (
    params //수주 정보 등록 - 품목 조회
  ) =>
    AuthAPI.post("/api/orderinfo/item", JSON.stringify(params), {
      headers: { "Content-Type": "application/json" },
    }) */

  // editOrderInfo: (
  //   params //수주 정보 등록 - 품목 조회
  // ) =>
  //   AuthAPI.put("/api/orderinfo/item", JSON.stringify(params), {
  //     headers: { "Content-Type": "application/json" },
  //   }),

  editOrderInfo: (
    params //수주 정보 수정
  ) =>
    AuthAPI.put("/api/orderinfo", JSON.stringify(params), {
      headers: { "Content-Type": "application/json" },
    }),

  deleteOrderInfo: (
    params //수주 정보 삭제
  ) =>
    AuthAPI.delete("/api/orderinfo", {
      params: params,
    }),

  getAccounts: (
    params //수주 검색 (동적쿼리 & 페이징 추가)
  ) =>
    AuthAPI.post("/api/orderinfo/search/querydsl", JSON.stringify(params), {
      headers: { "Content-Type": "application/json" },
    }),

  getDepartments: (
    params //수주 등록을 위한 부서 조회
  ) =>
    AuthAPI.get("/api/orderinfo/department", JSON.stringify(params), {
      headers: { "Content-Type": "application/json" },
    }),

  getDepartmentsAccount: (
    params //수주 등록을 위한 부서에 따른 사용자 조회
  ) =>
    AuthAPI.get("/api/orderinfo/account", {
      params: params,
    }),

  getOrderInfoItem: (
    params //수주 아이템 조회 (개선)
  ) =>
    AuthAPI.post("/api/orderinfo/item", JSON.stringify(params), {
      headers: { "Content-Type": "application/json" },
    }),
};
