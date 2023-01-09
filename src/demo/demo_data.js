/* eslint-disable no-unused-vars */
let demo_side_data = [
  {
    title: "기초관리",
    active: true,
    icon: "mdi-folder",
    role: "ROLE_basisManagement",
    use: "Y",
    sort: 1,
    subItems: [
      {
        title: "유저관리",
        to: "membermng",
      },
      {
        title: "거래처관리",
        to: "customermng",
      },
      {
        title: "품목관리",
        to: "itemmng",
      },
      {
        title: "BOM관리",
        to: "bom",
      },
      {
        title: "창고관리",
        to: "storagemng",
      },
      {
        title: "구매단가(거래처)",
        to: "warehousingprice",
      },
    ],
  },
  {
    title: "생산관리",
    active: true,
    icon: "mdi-folder",
    role: "ROLE_operationManagement",
    use: "Y",
    sort: 5,
    subItems: [
      {
        title: "작업지시서 등록",
        to: "operationOrder",
      },
      {
        title: "LOT 추적",
        to: "lottracking",
      },
    ],
  },
  {
    title: "바코드관리",
    active: true,
    icon: "mdi-folder",
    role: "ROLE_barcodeManagement",
    use: "N",
    sort: 3,
    to: "barcodemng",
    subItems: [
      // {
      //   title: "제품 출하요청",
      //   to: "releaseproductorder",
      // },
    ],
  },
  {
    title: "공정관리",
    active: true,
    icon: "mdi-folder",
    role: "ROLE_processManagement",
    use: "N",
    to: "processmng",
    sort: 6,
    subItems: [],
  },
  {
    title: "품질관리",
    active: true,
    icon: "mdi-folder",
    role: "ROLE_qualityManagement",
    use: "N",
    to: "qualitymng",
    sort: 7,
    subItems: [],
  },
  // {
  //   title: "모니터링",
  //   active: true,
  //   icon: "mdi-folder",
  //   role: "ROLE_productionStatusMonitoring",
  //   use: "N",
  //   to: "monitoring",
  //   sort: 8,
  //   subItems: [
  //     // {
  //     //   title: "모니터링-1",
  //     //   to: "monitoring",
  //     // },
  //   ],
  // },
  {
    title: "설비정보",
    active: true,
    icon: "mdi-folder",
    role: "ROLE_equipmentInformationManagement",
    use: "N",
    to: "equipment",
    sort: 2,
    subItems: [],
  },
  {
    title: "입고관리",
    active: true,
    icon: "mdi-folder",
    role: "ROLE_warehousingManagement",
    use: "Y",
    sort: 4,
    subItems: [
      {
        title: "원자재 입고관리",
        to: "warehousingmng",
      },
      {
        title: "완제품 입고관리",
        to: "productwarehousing",
      },
    ],
  },
  {
    title: "출고관리",
    active: true,
    icon: "mdi-folder",
    role: "ROLE_releaseManagement",
    use: "Y",
    sort: 9,
    subItems: [
      {
        title: "원자재 출고관리",
        to: "releaseorder",
      },
      {
        title: "완제품 출하관리",
        to: "releaseproduct",
      },
      // {
      //   title: "출고이력",
      //   to: "shippinghis",
      // },
    ],
  },
  {
    title: "재고관리",
    active: true,
    icon: "mdi-folder",
    role: "ROLE_inventoryManagement",
    use: "Y",
    sort: 10,
    subItems: [
      {
        title: "완제품 재고조회",
        to: "productstock",
      },
      {
        title: "원자재 재고조회",
        to: "rawmaterialstock",
      },
      {
        title: "재고실사",
        to: "stock",
      },
    ],
  },
];

let user_list = [
  {
    name: "정수기 부서",
    type: "detp",
    children: [
      {
        name: "김서울",
        rank: "부장",
        file: "user",
        type: "user",
      },
      {
        name: "이인천",
        rank: "차장",
        file: "user",
        type: "user",
      },
      {
        name: "서용인",
        rank: "과장",
        file: "user",
        type: "user",
      },
      {
        name: "구동탄",
        rank: "대리",
        file: "user",
        type: "user",
      },
      {
        name: "신수원",
        rank: "주임",
        file: "user",
        type: "user",
      },
      {
        name: "박평택",
        rank: "사원",
        file: "user",
        type: "user",
      },
    ],
  },
  {
    name: "청정기 부서",
    type: "detp",
    children: [
      {
        name: "김서울",
        rank: "부장",
        file: "user",
        type: "user",
      },
      {
        name: "이인천",
        rank: "차장",
        file: "user",
        type: "user",
      },
      {
        name: "서용인",
        rank: "과장",
        file: "user",
        type: "user",
      },
      {
        name: "구동탄",
        rank: "대리",
        file: "user",
        type: "user",
      },
      {
        name: "신수원",
        rank: "주임",
        file: "user",
        type: "user",
      },
      {
        name: "박평택",
        rank: "사원",
        file: "user",
        type: "user",
      },
    ],
  },
  {
    name: "비데 부서",
    type: "detp",
    children: [
      {
        name: "김서울",
        rank: "부장",
        file: "user",
      },
      {
        name: "이인천",
        rank: "차장",
        file: "user",
      },
      {
        name: "서용인",
        rank: "과장",
        file: "user",
      },
      {
        name: "구동탄",
        rank: "대리",
        file: "user",
      },
      {
        name: "신수원",
        rank: "주임",
        file: "user",
      },
      {
        name: "박평택",
        rank: "사원",
        file: "user",
      },
    ],
  },
];

let shipping_list = [
  {
    type: "강력분",
    createDate: "22-02-23",
    barcode: 22323442,
    weight: 30,
    status: "출고",
    ship_weight: 20,
    stock_weight: 20,
  },
  {
    type: "찹쌀가루",
    createDate: "22-02-22",
    barcode: 22039492,
    weight: 30,
    status: "출고",
    ship_weight: 10,
    stock_weight: 20,
  },
  {
    type: "설탕",
    createDate: "22-02-22",
    barcode: 22012392,
    weight: 50,
    status: "출고",
    ship_weight: 35,
    stock_weight: 15,
  },
  {
    type: "소금",
    createDate: "22-02-22",
    barcode: 22012123,
    weight: 50,
    status: "충전",
    ship_weight: 50,
    stock_weight: 50,
  },
  {
    type: "소금",
    createDate: "22-02-22",
    barcode: 22012123,
    weight: 50,
    status: "이상 반품",
    ship_weight: 50,
    stock_weight: 50,
  },
];

export { demo_side_data, user_list, shipping_list };
