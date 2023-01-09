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
      { text: "수정", value: "edit" },
    ],
  },
  data: {
    items_type_list: [
      { name: "전체", value: "" },
      { name: "원자재", value: "원자재" },
      { name: "완제품", value: "완제품" },
      { name: "반제품", value: "반제품" },
    ],
    items_type: [{ name: "원자재" }, { name: "완제품" }, { name: "반제품" }],
  },
};
