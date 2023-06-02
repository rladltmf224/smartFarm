export default {
  header: {
    headers: [
      { text: "작업지시코드", value: "jobOrderCode", width: "8%" },
      { text: "작업지시서명", value: "jobOrderName", width: "7%" },
      { text: "거래처", value: "customer.name", width: "6%" },
      { text: "상태", value: "status", width: "2%" },
      { text: "납기일", value: "deadline", width: "6%" },
      { text: "작성자", value: "createdName", width: "5%" },
      { text: "부서", value: "departmentName", width: "5%" },
      { text: "담당자", value: "chargeName", width: "5%" },
      { text: "수정자", value: "modifiedName", width: "5%" },
      { text: "수정일", value: "modifiedDate", width: "7%" },
      { text: "등록일", value: "createdDate", width: "7%" },
      // { text: "상태변경", value: "changeOrder" },
      { text: "수정/삭제", value: "edit", width: "5%" },
      { text: "농자재추가", value: "addManure", width: "5%" },
    ],
    headersDetail: [
      { text: "품목코드", value: "itemCode" },
      { text: "품목명", value: "itemName" },
      { text: "타입", value: "itemType" },
      { text: "상태", value: "status" },
      { text: "투입수량", value: "targetCount" },
      { text: "담당자", value: "createdId" },
      { text: "등록일", value: "createdDate" },
      { text: "수정자", value: "modifiedId" },
      { text: "수정일자", value: "modifiedDate" },
      { text: "진행", value: "work" },
      { text: "라벨 프린트", value: "print" },
    ],
    itemheaders: [
      { text: "타입", value: "type" },
      { text: "버전", value: "version" },
      { text: "품목코드", value: "code" },
      { text: "품목명", value: "name" },
      { text: "단위", value: "standard" },
      { text: "기준단위", value: "unit" },
    ],
    selectedheaders: [
      { text: "버전", value: "version" },
      { text: "품목명", value: "name" },
      { text: "수량", value: "count", width: "10%" },
    ],
    tempheader: [
      { text: "작업지시서명", value: "name" },
      { text: "거래처", value: "customer.name" },
      { text: "납기일", value: "deadline" },
      { text: "부서", value: "departmentName" },
      { text: "담당자", value: "chargeName" },
      { text: "품목정보", value: "details" },
      { text: "비고", value: "memo" },
      { text: "등록일", value: "createdDate" },
      { text: "삭제", value: "edit" },
    ],
    totalItem: [
      { text: "버전", value: "itemVersion" },
      { text: "원자재명", value: "itemName" },
      { text: "개수", value: "count" },
    ],
    bomHeaders: [
      { text: "품목명", value: "itemName" },
      { text: "투입수량(BOM기준)", value: "count" },
      { text: "투입수량", value: "targetCount" },
    ],
    selectedItem_header: [
      { text: "lot", value: "lot" },
      { text: "품목명", value: "itemName" },
      { text: "재고 수량", value: "stockCount" },
      { text: "등록한 수량", value: "count" },
      { text: "작성자", value: "createId" },
      { text: "작성일", value: "createDate" },
      { text: "수정자", value: "modifiedId" },
      { text: "수정일", value: "modifiedDate" },
    ],
    selectedAddItem_header: [
      //{ text: "신규여부", value: "status" },
      { text: "lot", value: "lot" },
      { text: "품목명", value: "itemName" },
      { text: "거래처", value: "customer" },
      { text: "창고", value: "storage" },
      { text: "구역", value: "storageLocation" },
      { text: "입고된 수량", value: "count" },
      { text: "투입된 수량", value: "useCount" },
    ],
    item_header: [
      { text: "lot", value: "lot" },
      { text: "품목명", value: "itemName" },
      { text: "거래처", value: "customer" },
      { text: "창고", value: "storage" },
      { text: "구역", value: "storageLocation" },
      { text: "입고된 수량", value: "count" },
      { text: "투입된 수량", value: "useCount" },
    ],
  },
  data: {
    status_JO: [
      { code: "SA01", name: "대기" },
      { code: "SA02", name: "진행중" },
      { code: "SA03", name: "완료" },
    ],
    status_JOD: [
      { code: "SB01", name: "준비" },
      { code: "SB02", name: "파종" },
      { code: "SB03", name: "발아" },
      { code: "SB04", name: "1차육묘" },
      { code: "SB05", name: "접목" },
      { code: "SB06", name: "활착" },
      { code: "SB07", name: "2차육묘" },
      { code: "SB08", name: "완료" },
    ],
    status2: [
      { code: "대기", name: "대기" },
      { code: "작업 진행중", name: "작업 진행중" },
      { code: "생산 완료", name: "생산 완료" },
      { code: "완료", name: "완료" },
    ],
    item_type: [
      { text: "상토", value: "상토" },
      { text: "트레이", value: "트레이" },
      { text: "양액", value: "양액" },
      { text: "기타", value: "기타" },
    ],
  },
};
