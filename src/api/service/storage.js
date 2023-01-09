import AuthAPI from "../api/AuthAPI";

export default {
  getStorageList: (params) =>
    AuthAPI.post("/api/storage/list", JSON.stringify(params)),
  createStorageList: (params) =>
    AuthAPI.post("/api/storage", JSON.stringify(params)),
  updateStorageList: (params) =>
    AuthAPI.put("/api/storage", JSON.stringify(params)),
  deleteStorageList: (params) =>
    AuthAPI.delete("/api/storage", {
      params: params,
      headers: { "Content-Type": "application/json" },
    }),
  getStorageLocationList: (params) =>
    AuthAPI.post("/api/storage/location/list", JSON.stringify(params)),
  createLocationList: (params) =>
    AuthAPI.post("/api/storage/location", JSON.stringify(params)),
  deleteStorageLocationList: (params) =>
    AuthAPI.delete("/api/storage/location", {
      params: {
        ids: params.ids
          .toString()
          .replace("[", "")
          .replace("]", "")
          .replace(" ", ""),
      },
    }),
};
