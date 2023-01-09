import AuthAPI from "../api/AuthAPI";

export default {
  getLOTtrackingForward: (params) =>
    AuthAPI.post("/api/operation/lottracking/forward", JSON.stringify(params)),
  getLOTtrackingBackward: (params) =>
    AuthAPI.post("/api/operation/lottracking/backward", JSON.stringify(params)),
};
