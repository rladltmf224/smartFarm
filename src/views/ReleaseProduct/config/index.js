export default {
  header: {
    headers: [
      { text: "code", value: "code" },
      { text: "거래처", value: "customerName" },
      { text: "거래처 담당자", value: "requester" },
      { text: "거래처 담당자 연락처", value: "requesterContact" },
      { text: "납기일", value: "deadline" },
      { text: "생성일자", value: "createdDate" },
      { text: "수정일자", value: "modifiedDate" },
      { text: "상태", value: "status" },
    ],
    headers_detail: [
      { text: "lot", value: "lot" },
      { text: "품목명", value: "itemName" },
      { text: "수량", value: "count" },
    ],
    headers_item: [
      { text: "품목명", value: "name" },
      { text: "수량", value: "count" },
      { text: "추가", value: "add" },
      { text: "삭제", value: "edit" },
    ],
    headers_raw_add: [
      { text: "LOT", value: "productDetailLot" },
      { text: "작업지시서 코드", value: "jobOrderCode" },
      { text: "작업지시서명", value: "jobOrderName" },
      { text: "담당자", value: "jobOrderManager" },
      { text: "마감일", value: "jobOrderDeadline" },
      { text: "품목명", value: "itemName" },

      { text: "창고명", value: "storageName" },
      { text: "수량", value: "count" },
      { text: "출고수량", value: "releaseCount" },
    ],
    headers_item_add: [
      { text: "code", value: "code" },
      { text: "품목명", value: "name" },

      { text: "규격", value: "standard" },
      { text: "단위", value: "unit" },
      { text: "창고", value: "storageName" },
    ],
    headers_product_detail_add: [
      { text: "LOT", value: "itemLot" },
      { text: "품목명", value: "itemName" },

      { text: "수량", value: "count" },
      { text: "출고수량", value: "releaseCount" },
    ],
  },

  data: {
    search_dateType: [
      { name: "수정일", value: 1 },
      { name: "생성일", value: 1 },
      { name: "납기일", value: 2 },
    ],
    search_textType: [
      { name: "거래처", value: 1 },
      { name: "거래처 담당자", value: 2 },
      { name: "거래처담당자 연락처", value: 3 },
    ],
    customer: {
      companyId: "",
      customerId: "",
      statementId: "",
      requester: "",
      requesterContact: "",
      deadline: "",
      warehousingCreateDetails: [],
    },
    editedCustomer: {
      companyId: "",
      customerId: "",
      statementId: "",
      requester: "",
      requesterContact: "",
      deadline: "",
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
  },
};
