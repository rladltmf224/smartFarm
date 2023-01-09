export default {
  header: {
    stockHeader: [
      { text: "타입", value: "itemType" },
      { text: "LOT", value: "itemLot" },
      { text: "품목코드", value: "itemCode" },
      { text: "품목명", value: "itemName" },
      { text: "버전", value: "itemVersion" },
      { text: "규격", value: "itemStandard" },
      { text: "단위", value: "itemUnit" },
      { text: "창고", value: "storageName" },
      { text: "구역", value: "area" },
      { text: "이전재고", value: "count" },
      { text: "현재고", value: "currentCount", width: "10%" },
    ],
    checkListHeader: [
      { text: "실사일자", value: "createdDate" },
      { text: "등록자", value: "createdId" },
      { text: "비고", value: "memo" },
    ],
    checkListDetailHeader: [
      { text: "타입", value: "itemType" },
      { text: "품목코드", value: "itemCode" },
      { text: "버전", value: "itemVersion" },
      { text: "품목명", value: "itemName" },
      { text: "규격", value: "itemStandard" },
      { text: "단위", value: "itemUnit" },
      { text: "이전수량", value: "sumPreviousCount" },
      { text: "현재수량", value: "sumCurrentCount" },
    ],
    checkListLotHeader: [
      { text: "LOT", value: "lot" },
      { text: "창고", value: "storageName" },
      { text: "구역", value: "area" },
      { text: "이전수량", value: "previousCount" },
      { text: "현재수량", value: "currentCount" },
    ],
  },
};
