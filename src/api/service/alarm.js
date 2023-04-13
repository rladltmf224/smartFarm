import AuthAPI from "../api/AuthAPI";

export default {
  alarmList: (params) => AuthAPI.get("/api/push/alimtalk/alarmlist" + params),
  alarmCheck: (params) => {
    let form = new FormData();

    Object.keys(params).forEach((key) => {
      form.append(key, String(params[key]));
    });
    return AuthAPI.put("/api/push/alimtalk/check", form);
  },
  sendAlarm: (params) => {
    return AuthAPI.post("/api/push/alimtalk/send/test", params, {
      headers: { "Content-Type": "application/json" },
    });
  },
};
