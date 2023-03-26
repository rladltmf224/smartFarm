export default {
  header: {
    headers: [
      { text: "작업지시코드", value: "code", width: "10%" },
      { text: "작업지시서명", value: "name" },
      { text: "회사", value: "customer.name" },
      { text: "상태", value: "status", width: "7%" },
      { text: "납기일", value: "deadline", width: "7%" },
      { text: "작성자", value: "createdName" },
      { text: "부서", value: "departmentName", width: "7%" },
      { text: "담당자", value: "chargeName" },
      { text: "수정자", value: "modifiedName" },
      { text: "수정일", value: "modifiedDate", width: "7%" },
      { text: "등록일", value: "createdDate", width: "7%" },
      { text: "상태변경", value: "changeOrder" },
      { text: "수정/삭제", value: "edit", width: "5%" },
    ],
    headersDetail: [
      { text: "작업지시코드", value: "code" },
      { text: "작업지시서명", value: "name" },
      { text: "회사", value: "customer.name" },
      { text: "상태", value: "status" },
      { text: "납기일", value: "deadline" },
      { text: "부서", value: "departmentName" },
      { text: "담당자", value: "chargeName" },
      { text: "수정자", value: "modifiedName" },
      { text: "수정일", value: "modifiedDate" },
      { text: "품목정보", value: "details" },
      { text: "작성자", value: "createdName" },
      { text: "등록일", value: "createdDate" },
      { text: "비고", value: "memo" },
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
  },
  data: {
    status: [
      { code: "WAIT", name: "대기" },
      { code: "SPROUT", name: "발아" },
      { code: "SEED1", name: "1차육묘" },
      { code: "GRAFT", name: "접목활착" },
      { code: "SEED2", name: "2차육묘" },
      { code: "DONE", name: "완료" },
    ],
    status2: [
      { code: "대기", name: "대기" },
      { code: "작업 진행중", name: "작업 진행중" },
      { code: "생산 완료", name: "생산 완료" },
      { code: "완료", name: "완료" },
    ],
  },
};
