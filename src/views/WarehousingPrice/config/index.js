export default {
  header: {
    customerList: [
      //거래처목록
      { text: "거래처명", value: "name" },
      { text: "담당자명", value: "manager" },
      { text: "거래처 대표명", value: "ownerName" },
      { text: "타입", value: "type" },
    ],
    regiItemList: [
      //등록된 품목
      { text: "품목명", value: "itemName" },
      { text: "타입", value: "itemType" },
      { text: "버전", value: "itemVersion" },
      { text: "창고", value: "storageName" },

      { text: "매입가", value: "unitPrice" },
      { text: "공급가액", value: "supplyPrice" },
      { text: "부가세", value: "taxAmount" },
      { text: "삭제", value: "delete" },
    ],
    itemList: [
      //품목 목록
      { text: "품목명", value: "itemName" },
      { text: "품목코드", value: "itemCode" },

      { text: "품목타입", value: "itemType" },
      { text: "버전", value: "itemVersion" },

      { text: "규격", value: "standard" },
      { text: "단위", value: "unit" },
      { text: "창고명", value: "storage" },
      { text: "창고위치", value: "storageArea" },
    ],
    changeHistory: [
      { text: "품목명", value: "itemName" },
      { text: "품목코드", value: "itemCode" },

      { text: "매입가", value: "unitPrice" },
      { text: "공급가액", value: "supplyPrice" },
      { text: "부가세", value: "taxAmount" },
      { text: "변경일자", value: "updateDate" },
    ],
  },
};
