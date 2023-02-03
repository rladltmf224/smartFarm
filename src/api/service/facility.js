import AuthAPI from "../api/AuthAPI";

export default {
  getFacilityList: (params) =>
    AuthAPI.get("/api/facility", {
      params: params,
      headers: { "Content-Type": "application/json" },
    }),
  postFacilityData: (params) =>
    AuthAPI.post("/api/facility", JSON.stringify(params)),
  putFacilityData: (params) =>
    AuthAPI.put("/api/facility", JSON.stringify(params), {
      headers: { "Content-Type": "application/json" },
    }),
  deleteFacilityData: (params) =>
    AuthAPI.delete("/api/facility", {
      params: params,
    }),
  postFacilityDetailData: (params) =>
    AuthAPI.post("/api/facility/detail", JSON.stringify(params)),
  deleteFacilityDetailData: (params) =>
    AuthAPI.delete(
      "/api/facility/detail",
      { data: { ids: params } },
      {
        headers: { "Content-Type": "application/json" },
      }
    ),
};
