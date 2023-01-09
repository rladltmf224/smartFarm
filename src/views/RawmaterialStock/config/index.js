export default {
  header: {
    headers: [
      { text: "품목코드", value: "itemCode", width: "15%" },
      { text: "품목명", value: "itemName", width: "15%" },
      { text: "품목타입", value: "itemType" },
      { text: "LOT코드", value: "lot", width: "20%" },
      { text: "수량", value: "count" },
      { text: "입고일자", value: "warehousingDate" },
      { text: "창고", value: "storageName" },
      { text: "구역", value: "storageArea" },
    ],
    headers_detail: [
      { text: "품목명", value: "itemName" },
      { text: "최근 입고일자", value: "recentCreatedDate" },
      { text: "총 재고수량", value: "sumCount" },
    ],
  },
  data: {
    rawmaterial_list: [
      {
        name: "전체",
        value: "",
      },
      {
        name: "원자재",
        value: "원자재",
      },
      {
        name: "반제품",
        value: "반제품",
      },
    ],
  },
};
