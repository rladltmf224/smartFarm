export default {
  header: {
    itemList: [
      { text: "code", value: "code" },
      { text: "버전", value: "version" },
      { text: "품목명", value: "name" },
      { text: "규격", value: "standard" },
      { text: "타입", value: "type" },
      { text: "unit", value: "unit" },
      { text: "창고", value: "storageName" },
      { text: "구역", value: "storageArea" },
      { text: "공정", value: "process" },
      { text: "수정/삭제", value: "edit" },
    ],
    processList: [
      { text: "공정명", value: "processName" },
      { text: "버전", value: "processVersion" },
      { text: "등록일자", value: "createdDate" },
      { text: "삭제/다운", value: "delete" },
    ],
    processDetailList: [
      { text: "일자", value: "days" },
      { text: "시간", value: "times" },
      { text: "시설명", value: "facilityName" },
      { text: "비료", value: "fertilizer" },
      { text: "온도", value: "temperature" },
      { text: "습도", value: "humidity" },
      { text: "광도", value: "luminosity" },
      { text: "급수", value: "moisture" },
      { text: "담당자", value: "taskName" },
      { text: "급수", value: "moisture" },
    ],
  },
  data: {
    items_type_list: [
      { name: "전체", value: "" },
      { name: "원자재", value: "원자재" },
      { name: "완제품", value: "완제품" },
      { name: "반제품", value: "반제품" },
    ],
    product_type_list: [
      { name: "실생묘", value: "실생묘" },
      { name: "접목묘", value: "접목묘" },
    ],
    items_type: [{ name: "원자재" }, { name: "완제품" }, { name: "반제품" }],
  },
};
