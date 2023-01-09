export default {
  header: {
    forwardList: [
      { text: "원자재 재고 LOT", value: "rawMaterialLot" },
      { text: "완제품 재고 LOT", value: "productLot" },
      { text: "완제품명", value: "itemName" },
      { text: "원자재명", value: "childItemName" },
      { text: "생성자 ID", value: "createdId" },
      { text: "생성일자", value: "createdDate" },
    ],
    forwardDetailList: [
      { text: "품목코드", value: "itemCode" },
      { text: "품목명", value: "itemName" },
      { text: "품목타입", value: "itemType" },
      { text: "LOT", value: "lot" },
      { text: "규격", value: "standard" },
      { text: "재고수량", value: "count" },
      { text: "창고명", value: "storageName" },
      { text: "창고구역", value: "storageArea" },
    ],
    backwardList: [
      { text: "원자재 재고 LOT", value: "rawMaterialLot" },
      { text: "완제품 재고 LOT", value: "productLot" },
      { text: "완제품명", value: "itemName" },
      { text: "원자재명", value: "childItemName" },
      { text: "생성자 ID", value: "createdId" },
      { text: "생성일자", value: "createdDate" },
    ],
  },
};
