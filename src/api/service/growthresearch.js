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
  GetGrowthResearchImage: (
    params //사진 개별조회
  ) =>
    AuthAPI.get("/api/growth/image", {
      params: params,
    }),
  GetGrowthResearchImageList: (
    params //사진 리스트 조회
  ) =>
    AuthAPI.get("/api/growth/imageList", {
      params: params,
    }),

  SaveGrowthResearchImage: (groupData) => {
    let form = new FormData();
    form.append("growthReportId", groupData["growthReportId"]); //growthReportId
    form.append("growthReportDetailId", groupData["growthReportDetailId"]); //growthReportDetailId
    form.append("treatmentId", groupData["treatmentId"]); //treatmentId
    form.append("files", groupData["files"]); //files (사진들 어레이)
    console.log("그룹데이타", groupData);
    return AuthAPI.post("/api/growth/image", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  //GetGrowthResearchListInGallery:

  GetGrowthResearchListInGallery: (params) =>
    AuthAPI.post("/api/growth/list", JSON.stringify(params), {
      headers: { "Content-Type": "application/json" },
    }),

  DeleteGrowthResearchImage: (params) =>
    AuthAPI.post("/api/growth/image/delete", JSON.stringify(params), {
      headers: { "Content-Type": "application/json" },
    }),
  DeleteGrowthResearchDate: (
    params //01-11 10:27 am , 현재페이지 삭제 리퀘스트 파람인데 바디로 되어있어서 파람으로 변경함.
  ) =>
    AuthAPI.delete("/api/growth/detail", {
      params: params,
    }),
  GetGrowthResearchGraphData: (params) =>
    AuthAPI.get("/api/growth/graph", {
      params: params,
    }),
};
