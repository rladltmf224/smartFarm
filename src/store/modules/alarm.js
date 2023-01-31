import _ from "lodash";

export const Alarm = {
  namespaced: true,
  state: {
    alarmList: [
      { title: "에어컨", body: "에어컨이 동작하지 않습니다" },
      { title: "가습기", body: "습도가 30% 이하로 떨어진지 1시간 경과" },
    ],
  },
  getters: {
    GET_ALARM_LIST: (state) => state.alarmList,
  },
  mutations: {
    addAlarm(state, alarm) {
      state.alarmList.push(alarm);
    },
    removeAlarm(state, alarm) {
      console.log("SSSSSSS remove", alarm);
      state.alarmList = _.reject(state.alarmList, alarm);
    },
  },
};
