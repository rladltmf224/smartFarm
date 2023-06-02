export default {
  header: {
    itemList: [
      { text: "code", value: "code" },
      // { text: "버전", value: "version" },
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
    item_type_list: [
      { code: "SC0101", name: "종자" }, //원자재 출고에 쓰이는 종자품목
      { code: "SC0102", name: "농자재" }, //작업지시서에 입력할 상토/트레이/농약 등등
      { code: "SC0103", name: "양액" }, //양액 품목인 원자재
      { code: "SC0104", name: "기타" }, //집게등등 쓰이긴하지만 작업지시서에 등록된지않는 품목
    ],

    items_type: [{ name: "원자재" }, { name: "완제품" }, { name: "반제품" }],
  },
};

/*
 { name: "상토", value: "상토" },
      { name: "트레이", value: "트레이" },
      { name: "양액", value: "양액" },
      { name: "기타", value: "기타" },
*/
