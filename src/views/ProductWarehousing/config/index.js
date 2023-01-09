export default {
  header: {
    headers: [
      { text: "입고코드", value: "code" },
      { text: "작업지시서명", value: "jobOrderName" },
      { text: "상태", value: "status" },
      { text: "반품", value: "edit" },
    ],
    headers_detail: [
      { text: "품목명", value: "itemName" },
      { text: "LOT", value: "lot" },
      { text: "주문수량", value: "orderCount" },
      { text: "정상수량", value: "normalCount" },

      { text: "불량수량", value: "defectCount" },
      { text: "창고", value: "storageName" },
    ],
    headers_item: [
      { text: "작업지시코드", value: "code" },
      { text: "accountName", value: "accountName" },
      { text: "작업지시서명", value: "name" },

      { text: "마감일", value: "deadline" },
      { text: "거래처명", value: "customerName" },

      { text: "상태", value: "status" },
      { text: "비고", value: "memo" },
    ],
    headers_item_detail: [
      { text: "품목명", value: "itemName", width: "8%" },
      { text: "주문수량", value: "orderCount", width: "5%" },
      { text: "정상수량", value: "normalCount", width: "5%" },

      { text: "불량수량", value: "defectCount", width: "5%" },
      { text: "박스당 수량", value: "boxpercount", width: "5%" },
      { text: "박스수량", value: "boxcount", width: "5%" },
      { text: "총 생산갯수", value: "count", width: "5%" },
      { text: "창고", value: "storageId", width: "12%" },
      { text: "창고구역", value: "storageLocationId", width: "7%" },
      { text: "비고", value: "memo", width: "10%" },
    ],
    headers_history: [
      { text: "상태", value: "status" },
      { text: "일자", value: "createdDate" },
      { text: "품목명", value: "itemName" },

      { text: "증가수량", value: "increaseCount" },
      { text: "감소수량", value: "decreaseCount" },
      { text: "입고일자", value: "createdDate" },
    ],
    headers_lot: [
      { text: "품목코드", value: "itemCode" },
      { text: "품목명", value: "itemName" },
      { text: "작업지시서 코드", value: "jobOrderCode" },
      { text: "작업지시서명", value: "jobOrderName" },
      { text: "작업지서서 담당자", value: "jobOrderManager" },
      { text: "마감일", value: "jobOrderDeadline" },
      { text: "LOT코드", value: "lot" },
      { text: "수량", value: "count" },

      { text: "창고", value: "storageName" },
    ],
  },
  data: {
    customer: {
      code: "",
      companyId: "",
      customerId: "",
      warehousingCreateDetails: [],
    },
    editedCustomer: {
      code: "",
      companyId: "",
      customerId: "",
      warehousingCreateDetails: [],
    },
    itemInfo: {
      count: 0,
      itemId: "",
      name: "",
      defectCount: 0,
      eachCount: [],
      memo: "",
      normalCount: 0,
      orderCount: 0,
      storageId: 0,
      storageLocationId: 0,
    },
    itemInfo_default: {
      count: 0,
      itemId: "",
      name: "",
      defectCount: 0,
      eachCount: [],
      memo: "",
      normalCount: 0,
      orderCount: 0,
      storageId: 0,
      storageLocationId: 0,
    },
    editedItemInfo: {
      count: 0,
      itemId: "",
    },
  },
};
