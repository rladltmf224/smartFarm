export default {
  header: {
    rolesList: [
      { text: "MENU", value: "menu", width: "50%" },
      { text: "접근권한", value: "permission", width: "50%" },
    ],
  },
  data: {
    filesData: {
      html: "mdi-language-html5",
      js: "mdi-nodejs",
      json: "mdi-code-json",
      md: "mdi-language-markdown",
      pdf: "mdi-file-pdf",
      png: "mdi-file-image",
      txt: "mdi-file-document-outline",
      xls: "mdi-file-excel",
      user: "mdi-account-circle-outline",
    },
    rolesData: [
      {
        menu: "기초관리",
        id: "basisManagement",
        permission: false,
      },
      {
        menu: "생산관리",
        id: "operationManagement",
        permission: false,
      },
      {
        menu: "바코드관리",
        id: "barcodeManagement",
        permission: false,
      },
      {
        menu: "공정관리",
        id: "processManagement",
        permission: false,
      },
      {
        menu: "품질관리",
        id: "qualityManagement",
        permission: false,
      },
      {
        menu: "모니터링",
        id: "productionStatusMonitoring",
        permission: false,
      },
      {
        menu: "설비정보",
        id: "equipmentInformationManagement",
        permission: false,
      },
      {
        menu: "입고관리",
        id: "warehousingManagement",
        permission: false,
      },
      {
        menu: "출고관리",
        id: "releaseManagement",
        permission: false,
      },
      {
        menu: "재고관리",
        id: "inventoryManagement",
        permission: false,
      },
      {
        menu: "권한관리",
        id: "authority",
        permission: false,
      },
    ],
    permission_list: [
      {
        name: "없음",
        value: "N",
        disabled: false,
        priority: 0,
      },
      {
        name: "읽기",
        value: "R",
        disabled: false,
        priority: 1,
      },
      {
        name: "읽기/쓰기",
        value: "W",
        disabled: false,
        priority: 2,
      },
    ],
  },
};
