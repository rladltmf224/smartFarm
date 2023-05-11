export default {
  header: {
    headers_Detail: [
      { text: "품목코드", value: "itemCode" },
      { text: "품목명", value: "itemName" },
      { text: "타입", value: "itemType" },
      { text: "상태", value: "status" },
      { text: "투입수량", value: "targetCount" },
      { text: "담당자", value: "createdId" },
      { text: "등록일", value: "createdDate" },
      { text: "수정자", value: "modifiedId" },
      { text: "수정일자", value: "modifiedDate" },
      { text: "진행", value: "work" },
    ],
    headers_Details_Details: [
      { text: "거래처", value: "customer" },
      { text: "마감일", value: "deadLine" },
      { text: "품목코드", value: "itemCode" },
      { text: "품목명", value: "itemName" },
      { text: "작업지시서 코드", value: "jobOrderCode" },
      { text: "상태", value: "status" },
      { text: "진행", value: "work" },
      { text: "상세", value: "detail" },
    ],
  },
  data: {
    status_JO: [
      { code: "JO_WAIT", name: "대기" },
      { code: "JO_ING", name: "진행중" },
      { code: "JO_DONE", name: "완료" },
    ],
    status_JOD: [
      { code: "JOD_WAIT", name: "준비" },
      { code: "JOD_SOWING", name: "파종" },
      { code: "JOD_SPROUT", name: "발아" },
      { code: "JOD_SEED1", name: "1차육묘" },
      { code: "JOD_GRAFT", name: "접목" },
      { code: "JOD_ROOTAGE", name: "활착" },
      { code: "JOD_SEED2", name: "2차육묘" },
      { code: "JOD_DONE", name: "완료" },
    ],
    status2: [
      { code: "대기", name: "대기" },
      { code: "작업 진행중", name: "작업 진행중" },
      { code: "생산 완료", name: "생산 완료" },
      { code: "완료", name: "완료" },
    ],
  },
};
