export default {
  header: {
    timelineHeader: [
      { text: "일정명", value: "title" },
      { text: "작물명", value: "cropName" },
      { text: "품종명", value: "varietyName" },
      { text: "시작일", value: "start" },
      { text: "종료일", value: "end" },
      { text: "생성자", value: "createdId" },
      { text: "생성일", value: "createdDate" },
      { text: "수정자", value: "modifiedId" },
      { text: "수정일", value: "modifiedDate" },
      { text: "비고", value: "memo" },
    ],
    existingHeader: [
      { text: "작물명", value: "cropName" },
      { text: "품종명", value: "varietyName" },
      { text: "생성자", value: "createdId" },
      { text: "생성일", value: "createdDate" },
      { text: "수정자", value: "modifiedId" },
      { text: "수정일", value: "modifiedDate" },
    ],
  },
  data: {
    tabList: ["달력", "타임라인"],

    timelineViewOptions: [
      {
        title: "Day",
        value: "day",
      },
      {
        title: "Monthly",
        value: "month",
      },
    ],

    resetTypeData: [
      //resetDATA
      {
        title: "파종",
        start: "",
        end: "",
        memo: "",
      },
      {
        title: "발아",
        start: "",
        end: "",
        memo: "",
      },
      {
        title: "1차육묘",
        start: "",
        end: "",
        memo: "",
      },
      {
        title: "접목 & 활착",
        start: "",
        end: "",
        memo: "",
      },

      {
        title: "2차육묘",
        start: "",
        end: "",
        memo: "",
      },
      {
        title: "납품",
        start: "",
        end: "",
        memo: "",
      },
    ],

    viewOptions: [
      {
        title: "Monthly",
        value: "month",
      },
      {
        title: "Weekly",
        value: "week",
      },
      {
        title: "Day",
        value: "day",
      },
    ],
  },
};
