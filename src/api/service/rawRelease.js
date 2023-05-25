import AuthAPI from "../api/AuthAPI";

export default {
  getReleaseList: (params) =>
    AuthAPI.post("/api/release/search", JSON.stringify(params)),
  createReleaseOrderData: (params) =>
    AuthAPI.post("/api/release", JSON.stringify(params)),
  updateReleaseProcess: (params) =>
    AuthAPI.put("/api/release/", JSON.stringify(params)),
  updateReleaseDone: (params) =>
    AuthAPI.put("/api/release/complete", JSON.stringify(params)),
  deleteReleaseList: (params) =>
    AuthAPI.delete("/api/release", JSON.stringify(params)),
  getReleaseBOMList: () => AuthAPI.get("/api/release/bom"),
  getReleaseBOMDetailList: () => AuthAPI.get("/api/release/bomdetail"),
  getReleaseRawDetailList: (params) =>
    AuthAPI.get("/api/release/rawmaterial", {
      headers: { "Content-Type": "application/json" },
      params: params,
    }),
  getReleaseJoborderList: (params) =>
    AuthAPI.get("/api/release/joborder", {
      headers: { "Content-Type": "application/json" },
      params: params,
    }),
  getReleaseJoborderDetailList: (params) =>
    AuthAPI.get("/api/release/joborder/detail", {
      headers: { "Content-Type": "application/json" },
      params: params,
    }),
  getReleaseOrderRawData: (params) =>
    AuthAPI.get("/api/release/item", {
      headers: { "Content-Type": "application/json" },
      params: params,
    }),
  // getReleaseOrderReleaseData: (params) =>
  //   AuthAPI.get("/api/release/detail", {
  //     headers: { "Content-Type": "application/json" },
  //     params: params,
  //   }),
  getReleaseOrderRawDetailData: (params) =>
    AuthAPI.get("/api/release/childitem", {
      headers: { "Content-Type": "application/json" },
      params: params,
    }),
  getReleaseOrderRawDetailCheckData: (params) =>
    AuthAPI.get("/api/release/rawmaterial/check", {
      headers: { "Content-Type": "application/json" },
      params: params,
    }),
  getReleaseOrderRawBefore: (params) =>
    AuthAPI.get("/api/editRelease/before", {
      headers: { "Content-Type": "application/json" },
      params: params,
    }),
  getReleaseOrderRawAfter: (params) =>
    AuthAPI.get("/api/editRelease/after", {
      headers: { "Content-Type": "application/json" },
      params: params,
    }),

  postReleaseOrderRawRegi: (params) =>
    AuthAPI.post("/api/editRelease", JSON.stringify(params)),
};
