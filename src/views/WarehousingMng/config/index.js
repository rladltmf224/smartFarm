export default {
  header: {
    headers: [
      { text: "입고코드", value: "code" },
      { text: "입고날짜", value: "createdDate" },
      { text: "납품일자", value: "receiveDate" },
      { text: "거래처", value: "customerName" },
      { text: "상태", value: "status" },
      { text: "입고처리 담당자", value: "createName" },
      { text: "반품요청 처리자", value: "returnName" },
      { text: "반품", value: "edit" },
    ],
    headers_detail: [
      { text: "품목명", value: "itemName" },
      { text: "LOT", value: "lot" },
      { text: "제조사", value: "manufacturer" },
      { text: "주문수량", value: "orderCount" },
      { text: "정상수량", value: "normalCount" },

      { text: "불량수량", value: "defectCount" },
      { text: "창고", value: "storageName" },
    ],
    headers_item: [
      { text: "품목명", value: "name", width: "15%" },
      { text: "거래처", value: "customer", width: "10%" },
      { text: "제조사", value: "manufacturer", width: "10%" },
      { text: "주문수량", value: "orderCount", width: "8%" },
      { text: "정상수량", value: "normalCount", width: "8%" },
      { text: "불량수량", value: "defectCount", width: "8%" },

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
    detail_header: [
      { text: "반품 항목", value: "itemName", width: "25%" },
      { text: "주문 수량", value: "orderCount", width: "25%" },
      { text: "정상 수량", value: "normalCount", width: "25%" },
      { text: "반품 수량", value: "failCount", width: "25%" },
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
