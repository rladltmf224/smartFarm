export default {
  header: {
    totalBomHeader: [
      { text: "타입", value: "type", width: "10%" },
      { text: "품목코드", value: "code" },
      { text: "품목명", value: "name" },
      { text: "규격", value: "standard" },
      { text: "단위", value: "unit" },
      { text: "수정", value: "edit" },
    ],
    bomHeader: [
      { text: "타입", value: "type" },
      { text: "완제품코드", value: "code" },
      { text: "완제품명", value: "name" },
      { text: "단위", value: "unit" },
      { text: "규격", value: "standard" },
      { text: "창고", value: "storageName" },
      { text: "구역", value: "area" },
    ],
    itemHeader: [
      { text: "타입", value: "type" },
      { text: "거래처", value: "customer" },
      { text: "원자재코드", value: "code" },
      { text: "원자재명", value: "name" },
      { text: "창고", value: "storageName" },
      { text: "구역", value: "area" },
      { text: "규격", value: "standard" },
      { text: "단위", value: "unit" },
    ],
    itemDetailHeader: [
      { text: "타입", value: "type" },
      { text: "창고", value: "storageName" },
      { text: "구역", value: "area" },
      { text: "원자재코드", value: "code" },
      { text: "원자재명", value: "name" },
      { text: "개수", value: "count", width: "10%" },
    ],
    searchType: [
      { text: "코드", value: "itemCode" },
      { text: "품목명", value: "itemName" },
    ],
    searchItemType: [
      { text: "거래처", value: "customerName" },
      { text: "자재 타입", value: "itemtype" },
      { text: "코드 or 이름", value: "itemCode" },
    ],
    reverseItemHeader: [
      { text: "타입", value: "type" },
      { text: "원자재코드", value: "code" },
      { text: "원자재명", value: "name" },
      { text: "사용된 개수", value: "childCount" },
      { text: "규격", value: "standard" },
      { text: "단위", value: "unit" },
    ],
    frontBomHeader: [
      { text: "코드", value: "code" },
      { text: "완제품명", value: "name" },
      { text: "타입", value: "type" },
      { text: "원자재 정보", value: "details" },
      { text: "규격", value: "standard" },
      { text: "단위", value: "unit" },
    ],
    headersChild: [
      { text: "타입", value: "type", width: "10%" },
      { text: "코드", value: "code" },
      { text: "자재명", value: "name" },
      { text: "창고", value: "storageName" },
      { text: "개수", value: "count" },
    ],
    frontBomItemHeader: [
      { text: "타입", value: "type" },
      { text: "원자재 코드", value: "code" },
      { text: "원자재명", value: "name", width: "50%" },
      { text: "개수", value: "count", width: "10%" },
    ],
    itemTypelist: [
      { text: "전체", value: "" },
      { text: "원자재", value: "원자재" },
      { text: "반제품", value: "반제품" },
    ],
  },
  data: {
    bom_type: [
      { code: "접목묘", name: "접목묘" },
      { code: "실생묘", name: "실생묘" },
    ],
  },
};
