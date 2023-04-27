export default {
  header: {
    headers: [
      { text: "작업지지서 코드", value: "jobOrderCode" },
      { text: "작업지시서명", value: "jobOrderName" },
      { text: "작업지시서 상태", value: "jobOrderStatus" },
      { text: "거래처", value: "customerName" },
      { text: "작업지시서 생성일", value: "jobOrderCreatedDate" },
      { text: "작업지시서 생성자", value: "jobOrderCreatedId" },
      { text: "작업지시서 수정일", value: "jobOrderModifiedDate" },
      { text: "작업지시서 수정자", value: "jobOrderModifiedId" },
    ],
    headers_release: [
      { text: "완제품코드", value: "itemCode" },
      { text: "완제품명", value: "itemName" },
      { text: "원자재코드", value: "childItemCode" },
      { text: "원자재명", value: "childItemName" },
      { text: "주문수량", value: "orderCount" },
      { text: "출고수량", value: "releaseCount" },
      { text: "환입수량", value: "reversalCount" },
    ],
    headers_raw: [
      { text: "품목코드", value: "itemCode" },
      { text: "품목명", value: "itemName" },
      { text: "타입", value: "itemType" },
      { text: "규격", value: "itemStandard" },
      { text: "단위", value: "itemUnit" },
      { text: "주문수량", value: "orderCount" },
    ],
    headers_item: [
      { text: "작업지지서 코드", value: "jobOrderCode" },
      { text: "작업지시서명", value: "jobOrderName" },
      { text: "작업지시서 상태", value: "jobOrderStatus" },

      { text: "작업지시서 생성일", value: "jobOrderCreatedDate" },
      { text: "작업지시서 생성자", value: "jobOrderCreatedId" },
      { text: "작업지시서 수정일", value: "jobOrderModifiedDate" },
      { text: "작업지시서 수정자", value: "jobOrderModifiedId" },
    ],
    headers_item_detail: [
      { text: "품목코드", value: "itemCode" },
      { text: "품목명", value: "itemName" },
      { text: "타입", value: "itemType" },
      { text: "규격", value: "itemStandard" },
      { text: "단위", value: "itemUnit" },
      { text: "주문수량", value: "orderCount" },
    ],
    headers_raw_detail: [
      { text: "품목코드", value: "itemCode" },
      { text: "품목명", value: "itemName" },
      { text: "자재타입", value: "itemType" },
      { text: "규격", value: "itemStandard" },
      { text: "단위", value: "itemUnit" },
      { text: "현재고", value: "inventoryCount" },
      { text: "주문수량", value: "orderCount" },
      { text: "출고수량", value: "releaseCount" },
      { text: "환입수량", value: "reversalCount" },
      { text: "자재추가", value: "add" },
      // { text: "자재환입", value: "reversal" },
    ],
    headers_raw_add: [
      { text: "lot", value: "lot" },
      { text: "품목명", value: "itemName" },

      { text: "창고명", value: "storageName" },
      { text: "수량", value: "count" },
      { text: "출고수량", value: "releaseCount" },
      { text: "입고일자", value: "createdDate" },
      { text: "수정일자", value: "modifiedDate" },
    ],
    headers_raw_reversal: [
      { text: "lot", value: "lot" },
      { text: "품목명", value: "itemName" },

      { text: "창고명", value: "storageName" },
      { text: "출고수량", value: "count" },
      { text: "환입수량", value: "reversalCount" },
      { text: "입고일자", value: "createdDate" },
      { text: "수정일자", value: "modifiedDate" },
    ],
    headers_before: [
      { text: "작업지시서명", value: "jobOrderName" },
      { text: "거래처명", value: "customerName" },
      { text: "상태", value: "jobOrderDetailStatus" },
      { text: "마감일", value: "jobOrderDeadline" },
      { text: "품목명", value: "itemName" },
      { text: "투입수량", value: "targetCount" },
      { text: "출고관리", value: "add" },
    ],
    headers_after: [
      { text: "작업지시서명", value: "jobOrderName" },
      { text: "거래처명", value: "customerName" },
      { text: "상태", value: "jobOrderDetailStatus" },
      { text: "마감일", value: "jobOrderDeadline" },
      { text: "품목명", value: "itemName" },
      { text: "투입수량", value: "targetCount" },
      { text: "출고수량", value: "releaseCount" },
      { text: "출고관리", value: "add" },
    ],
  },
  data: {
    search_dateType: [
      { name: "수정일", value: 1 },
      { name: "납기일", value: 2 },
    ],
    search_job_status_list: [
      { name: "전체", value: "" },
      { name: "대기", value: "대기" },
      { name: "작업 진행중", value: "작업 진행중" },
      { name: "생산 완료", value: "생산 완료" },
      { name: "작업 종료", value: "작업 종료" },
    ],
    way_list: [{ name: "출고요청목록" }, { name: "원제품목록" }],
    customer: {
      companyId: "",
      customerId: "",
      statementId: "",
      warehousingCreateDetails: [],
    },
    editedCustomer: {
      companyId: "",
      customerId: "",
      statementId: "",
      warehousingCreateDetails: [],
    },
    itemInfo: {
      count: 0,
      itemId: "",
      name: "",
      price: 0,
      supplyPrice: 0,
      taxAmount: 0,
      unitPrice: 0,
    },
    itemInfo_default: {
      count: 0,
      itemId: "",
      name: "",
      price: 0,
      supplyPrice: 0,
      taxAmount: 0,
      unitPrice: 0,
    },
    editedItemInfo: {
      count: 0,
      itemId: "",
      price: 0,
      supplyPrice: 0,
      taxAmount: 0,
      unitPrice: 0,
    },
  },
};
