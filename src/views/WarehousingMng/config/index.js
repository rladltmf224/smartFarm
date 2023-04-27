export default {
  header: {
    headers: [
      { text: "입고코드", value: "code" },
      { text: "입고날짜", value: "createdDate" },
      { text: "거래처", value: "customerName" },
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
      { text: "납품날짜", value: "date" },
    ],
    headers_item: [
      { text: "품목명", value: "name", width: "15%" },
      { text: "주문수량", value: "orderCount", width: "8%" },
      { text: "정상수량", value: "normalCount", width: "8%" },
      { text: "불량수량", value: "defectCount", width: "8%" },
      { text: "납품일자", value: "date", width: "12%" },

      { text: "창고", value: "storageId", width: "12%" },
      { text: "창고구역", value: "storageLocationId", width: "10%" },
      { text: "비고", value: "memo" },
      { text: "삭제", value: "edit", width: "4%", sortable: false },
      { text: "", value: "data-table-expand" },
    ],
    headers_history: [
      { text: "상태", value: "status" },
      { text: "품목명", value: "itemName" },

      { text: "증가수량", value: "increaseCount" },
      { text: "감소수량", value: "decreaseCount" },
      { text: "입고일자", value: "createdDate" },
    ],
  },
  data: {
    inputDefaultData_item: {
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
      date: "",
    },
    inputDefaultData_customer: {
      code: "",
      companyId: "",
      customerId: "",
      warehousingCreateDetails: [],
    },
  },
};
