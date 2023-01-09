export default {
  header: {
    headers: [
      { text: "품목코드", value: "itemCode" },
      { text: "품목명", value: "itemName", width: "20%" },
      { text: "품목타입", value: "type" },
      { text: "LOT코드", value: "lot", width: "15%" },
      { text: "수량", value: "count" },
      { text: "입고일자", value: "productWarehousingDate" },
      { text: "담당자", value: "chargeName" },
      { text: "창고", value: "storageName", width: "20%" },
      { text: "구역", value: "storageArea" },
    ],
    headers_detail: [
      { text: "품목명", value: "itemName" },
      { text: "최근 입고일자", value: "recentCreatedDate" },
      { text: "총 재고수량", value: "sumCount" },
    ],
  },
  data: {},
};
