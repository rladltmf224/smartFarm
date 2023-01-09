import AuthAPI from "../api/AuthAPI";

export default {
  getGrowthResearch: (params) =>
    AuthAPI.post("/api/growth/search", JSON.stringify(params), {
      headers: { "Content-Type": "application/json" },
    }),
  LoadGrowthResearch: (params) =>
    AuthAPI.get("/api/growth", {
      params: params,
    }),
  MakeBeforeTestDefaulted: (params) =>
    AuthAPI.get("/api/growth/load", {
      params: params,
    }),

  RegisterGrowthResearch: (params) =>
    AuthAPI.post("/api/growth", JSON.stringify(params), {
      headers: { "Content-Type": "application/json" },
    }),
  LookUpGrowthResearchData: (params) =>
    AuthAPI.get("/api/growth/data", {
      params: params,
    }),
  DeleteGrowthResearch: (params) =>
    AuthAPI.delete("/api/growth", {
      params: params,
    }),
  EditGrowthResearchDate: (params) =>
    AuthAPI.post("/api/growth/detail", JSON.stringify(params), {
      headers: { "Content-Type": "application/json" },
    }),
  SaveGrowthResearchData: (params) =>
    AuthAPI.post("/api/growth/data", JSON.stringify(params), {
      headers: { "Content-Type": "application/json" },
    }),
  SaveGrowthResearchMemo: (params) =>
    AuthAPI.put("/api/growth", JSON.stringify(params), {
      headers: { "Content-Type": "application/json" },
    }),
  GetGrowthResearchImage: (params) =>
    AuthAPI.get("/api/growth/image", {
      params: params,
    }),
  GetGrowthResearchImageList: (params) =>
    AuthAPI.get("/api/growth/imageList", {
      params: params,
    }),
  SaveGrowthResearchImage: function (groupData) {
    let form = new FormData();
    form.append("growthReportId", groupData["growthReportId"]); //growthReportId
    form.append("growthReportDetailId", groupData["growthReportDetailId"]); //growthReportDetailId
    form.append("treatmentId", groupData["treatmentId"]); //growthReportDetailId
    form.append("files", groupData["files"]); //files (사진들 어레이)
    AuthAPI.get("/api/growth/image", {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  DeleteGrowthResearchImage: (params) =>
    AuthAPI.post("/api/growth/image/delete", JSON.stringify(params), {
      headers: { "Content-Type": "application/json" },
    }),
  DeleteGrowthResearchDate: (params) =>
    AuthAPI.delete("/api/growth/detail", JSON.stringify(params), {
      headers: { "Content-Type": "application/json" },
    }),
  GetGrowthResearchGraphData: (params) =>
    AuthAPI.get("/api/growth/graph", {
      params: params,
    }),
};
