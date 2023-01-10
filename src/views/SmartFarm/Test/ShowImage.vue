<template>
  <v-app>
    <v-container fluid>
      <v-row>
        <v-col cols="12" class="d-flex">
          <h4 class="searchbox-title">이미지 갤러리</h4>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="d-flex ">
          <v-chip-group multiple active-class="primary--text pa-0 ma-0">
            <v-chip v-for="item in selected" :key="item">
              {{ item.testName }}
            </v-chip>
          </v-chip-group>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="dialogOpen">조회</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-data-table :headers="datas_header" :items="datas" :page.sync="page" :options.sync="options"
            :server-items-length="totalData" :items-per-page="itemsPerPage" :loading="loading" dense hide-default-footer
            v-model="selected" show-select item-key="testName" multi-sort @page-count="pageCount = $event"
            class="elevation-1">
            <template v-slot:item.testName="{ item }">
              <td>{{ item.testName }}</td>
            </template>
            <!-- 체크박스 -->
            <template #item="{ item }">
              <tr>
                <td>
                  <v-checkbox></v-checkbox>
                </td>
                <td>{{ item.testName }}</td>
                <td><v-checkbox></v-checkbox></td> <!-- 여기 v-model -->
              </tr>
            </template>
          </v-data-table>
          <div class="text-center pt-2">
            <v-pagination v-model="page" :length="pageCount"></v-pagination>
            <!-- <h5>Selected: {{ selected }}</h5> -->
          </div>
        </v-col>
      </v-row>
      <div class="text-center">
        <v-snackbar v-model="snackbar" :timeout="timeout">
          {{ text }}
        </v-snackbar>
      </div>
      <!-- 이미지갤러리 다이아로그 -->
      <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card>
          <v-toolbar color="grey lighten-2" dense elevation="0" rounded="0">
            <v-btn icon @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>이미지 갤러리</v-toolbar-title>
          </v-toolbar>
          <v-row class="mx-auto">
            <v-card style="overflow: auto" :loading="loading" class="mx-auto my-12" width="374" height="825"
              v-for="(item, i) in selected" :key="item">
              <v-card-text>
                <div class="text-subtitle-1">
                  {{ item.testName }}
                </div>
              </v-card-text>
              <v-divider class=""></v-divider>
              <v-card-text class="">
                <!-- 사진들어갈곳 -->
                <div v-for="(item, i) in 5">
                  <h6 class="pa-0 ma-0">2022-12-24</h6>
                  <v-img max-height="200" class="ma-4" src="https://cdn.vuetifyjs.com/images/cards/cooking.png"></v-img>
                </div>
              </v-card-text>
            </v-card>
          </v-row>
        </v-card>
      </v-dialog>
    </v-container>
  </v-app>
</template>

<script>
import Swal from "sweetalert2";

import * as api from "@/api/index.js";
export default {
  name: "InputData",
  data() {
    return {
      // 여기서 부터 작업
      selected: [],
      dialog: false,
      // 여기서 부터 작업
      page: 1,
      loading: false,
      itemsPerPage: 12,
      options: {},
      totalData: 0, //총 데이타의 개수 백엔드에서받아서 교체할것임
      pageCount: 10,
      keyword: "", //검색어
      // 모달창 등록 시 유효성검사
      nameRules: [
        (v) => !!v || "실험군 명을 입력해주세요.",
        (v) => (v && v.length <= 50) || "50자 이내입니다.",
      ],

      // 모달창 등록 시 유효성검사
      // 모달창 오른쪽 메뉴
      items: [],
      selectedItem: 0,
      fav: true,
      menu: false,
      message: false,
      hints: true,
      // 모달창 오른쪽 메뉴
      // 상세조회 페이지로 보낼 res 데이터
      res: "",
      // 상세조회 페이지로 보낼 res 데이터
      // 스낵바
      snackbar: false,
      delete_snackbar: false,
      delete_text: "삭제되었습니다.",
      text: "등록되었습니다.",
      timeout: 2000,
      // 스낵바
      // 데이터테이블검색기능
      search: "",
      // 데이터테이블검색기능
      // 테스트날짜
      // 1
      test_date1: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      test_menu1: false,
      test_modal1: false,
      // 1
      // 2
      test_date2: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      test_menu2: false,
      test_modal2: false,
      // 2
      // 테스트
      // 이미 있는 날짜일 시 dialog 띄우기
      DateCheck_dialog: false,
      // 이미 있는 날짜일 시 dialog 띄우기
      // 넘버유효성체크
      pH_numberRule: (val) => {
        7;
        if (val < 4 || val > 8) return "4~8 사이입니다.";
        8;
        return true;
        9;
      },
      EC_numberRule: (val) => {
        7;
        if (val < 0.3 || val > 2.5) return "0.3~2.5 사이입니다.";
        8;
        return true;
        9;
      },
      // 넘버유효성체크
      // 데이터추가시 날짜
      DIA_date: new Date().toISOString().substr(0, 10),
      DIA_s_date: new Date().toISOString().substr(0, 10),
      DIA_e_date: new Date().toISOString().substr(0, 10),
      DIA_menu1: false,
      DIA_menu2: false,
      // 데이터추가시 날짜
      // 데이터테이블 테스트
      dialog: false,
      dialogDelete: false,
      editedIndex: -1,
      // 데이터테이블 테스트
      //이슬이꺼
      //테스트
      datas_header: [
        {
          text: "실험명",
          value: "testName",
        },
        {
          text: "선택(최대 5개)",
          value: "selected",
        },
      ],
      datas: [],

      datas_simple: [],
      startDate: false,
      endDate: false,
      date: new Date().toISOString().substr(0, 10),
      s_date: new Date().toISOString().substr(0, 10),
      e_date: new Date().toISOString().substr(0, 10),
      menu1: false,
      menu2: false,
      search_list1: [
        { name: "양액EC", value: "ec" },
        { name: "양액pH", value: "ph" },
        { name: "전체", value: "all" },
      ],
      search_type_1: "all",
      search_list2: [
        { name: "오전", value: "오전" },
        { name: "오후", value: "오후" },
      ],
      search_type_2: "발아/활착실",
      search_condition: {
        controlItem: [],
        selectedRoom: "",
        startDate: "",
        endDate: "",
      },
      editedItem: {
        //모달
        testName: "",
        testCondition: "",
        numTreatment: 1,
        numSample: 2,
        numDay: 1,
        treatmentNames: [],
      },
      nameArr: [],
      defaultItem: {
        testName: "",
        testCondition: "",
        numTreatment: 1,
        numSample: 2,
        numDay: 1,
        treatmentNames: [],
      },
      editedIndex: -1,
    };
  },
  mounted() {
    this.twoMonthAgo();
    this.getData();
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    options: {
      handler() {
        this.getData();
      },
      deep: true,
    },
    selected(val, oldVal) { //최대 5개 선택
      if (val.length > 5) {
        this.$nextTick(() => {
          this.selected = oldVal
        })
      }
    },
  },
  methods: {
    twoMonthAgo() {
      var now = new Date(); // 현재 날짜 및 시간
      var twoMonthAgo = new Date(now.setMonth(now.getMonth() - 2)); // 한달 전
      const year = twoMonthAgo.getFullYear();
      const month = ("0" + (twoMonthAgo.getMonth() + 1)).slice(-2);
      const day = ("0" + twoMonthAgo.getDate()).slice(-2);
      const dateStr = year + "-" + month + "-" + day;
      this.test_date1 = dateStr;
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    // 행 삭제
    // 데이터 테이블 검색api
    filterOnlyCapsText(value, search, item) {
      return (
        value != null &&
        search != null &&
        typeof value === "string" &&
        value.toString().toLocaleUpperCase().indexOf(search) !== -1
      );
    },
    // 데이터 테이블 검색api
    // 불러올때 간단한 데이터테이블  만드는 api
    getDataSimple() {
      api.growthresearch.LoadGrowthResearch().then((res) => {
        this.datas_simple = res.data.responseData;
      });
    },
    // 불러올때 간단한 데이터테이블  만드는 api

    // 생육조사 일지 조회 api
    getData() {
      this.loading = true;
      const { page, itemsPerPage, sortBy, sortDesc } = this.options;
      let item = {
        testName: this.keyword, //검색어
        startDate: this.test_date1, //시작일
        endDate: this.e_date, //종료일
        page: page, //페이지 수
        size: itemsPerPage, //보여주고싶은 행의개수
        sortBy: sortBy, //sortby
        sortDesc: sortDesc, //sortDesc
      };
      api.growthresearch
        .getGrowthResearch(item)
        .then((res) => {
          this.loading = false;
          this.datas = res.data.responseData;
          this.items = res.data.responseData;
          this.totalData = res.data.totalCount;
        })
        .catch((error) => { });
    },
    // 생육조사 일지 조회 api
    // 다이아로그오픈
    dialogOpen() {
      this.dialog = true;
    },
    // 다이아로그오픈
    // 다이아로그 닫기
    dialogClose() {
      this.editedItem = {
        testName: "",
        testCondition: "",
        numTreatment: 1,
        numSample: 2,
        numDay: 1,
        treatmentNames: [],
      };
      this.defaultItem = {
        testName: "",
        testCondition: "",
        numTreatment: 1,
        numSample: 2,
        numDay: 1,
        treatmentNames: [],
      };
      (this.nameArr = []), (this.dialog = false);
    },
    // 다이아로그 닫기
    // 등록버튼 누르면 이동하는 메서드
    CompletedRegister() { },
    // 등록버튼 누르면 이동하는 메서드
    // 시작일을 한달전으로
    BeforeWeeks() {
      let nowDate = new Date();
      let weekDate = nowDate.getTime();
      nowDate.setTime(weekDate);
      let weekYear = nowDate.getFullYear();
      let weekMonth = nowDate.getMonth();
      let weekDay = nowDate.getDate();
      if (weekMonth < 10) {
        weekMonth = "0" + weekMonth;
      }
      if (weekDay < 10) {
        weekDay = "0" + weekDay;
      }
      let resultDate = weekYear + "-" + weekMonth + "-" + weekDay;
      this.test_date1 = resultDate;
    },
    // 시작일을 일주일전으로
    //스윗알러트
    testSweet() {
      this.$swal({
        title: "이미 등록되어있는 날짜입니다.다른 날짜를 선택해주세요.",
        icon: "error",
        position: "top",
        showCancelButton: false,
        showConfirmButton: false,
        toast: true,
        timer: 2000,
      });
    },
    deleteItem(item) {
      //휴지통 눌렀을때
      let id = item.growthReportId;
      this.editedIndex = this.datas.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      //예를 눌렀을때
      this.datas.splice(this.editedIndex, 1);
      let id = {
        growthReportId: this.editedItem.growthReportId,
      };
      api.growthresearch.DeleteGrowthResearch(id).then((res) => { });
      this.closeDelete();
      this.delete_snackbar = true;
    },
    closeDelete() {
      //삭제취소눌렀을때
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    // 데이터 추가시 날짜
    DIA_s_date_search(v) {
      this.DIA_s_date = v;
      this.DIA_menu1 = false;
      this.$refs.DIA_menu1.save(v);
    },
    DIA_e_date_search(v) {
      this.DIA_e_date = v;
      this.DIA_menu2 = false;
      this.$refs.DIA_menu2.save(v);
    },
    // 데이터 추가시 날짜
    // 테스트 데이타테이블
    save() {
      if (this.editedItem.testName == "") {
        alert("실험군 명을 입력해주세요.");
        return;
      } else if (this.nameArr.length == 0) {
        alert("처리구명을 입력해주세요.");
        return;
      } else if (this.editItem.testName != "") {
        var item = {
          testName: this.editedItem.testName,
          testCondition: this.editedItem.testCondition,
          numTreatment: this.editedItem.numTreatment,
          numSample: this.editedItem.numSample,
          numDay: this.editedItem.numDay,
          treatmentNames: this.nameArr,
        };
        if (this.editedIndex == -1) {
          console.log("등록버젼입니다.");
          api.growthresearch
            .RegisterGrowthResearch(item)
            .then((response) => {
              this.dialogClose();
              this.nameArr = [];
              this.getData();
            })
            .catch((error) => {
              console.log(error.response.status);
              console.log(error.response);
              if (error.response.status == 400) {
                this.testSweet();
                return;
              }
            });
        } else {
          // 수정api연결해야함.
          item.id = this.editedItem.id;
          api.growthresearch.RegisterGrowthResearch(item).then((response) => {
            this.getData();
          });
        }
        this.snackbar = true;
      }
      this.close();
    },
    editItem(item) {
      this.editedIndex = this.datas.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
      let id = {
        growthReportId: item.growthReportId,
      };
      api.growthresearch.MakeBeforeTestDefaulted(id).then((res) => {
        this.nameArr = res.data.responseData.treatmentNames;
      });
    },
    cloneItem(item) {
      let id = {
        growthReportId: item.growthReportId,
      };
      api.growthresearch.MakeBeforeTestDefaulted(id).then((res) => {
        this.datas_simple = res.data.responseData;
        this.editedItem = this.datas_simple;
        this.nameArr = res.data.responseData.treatmentNames;
      });
      this.editedIndex = this.datas_simple.indexOf(item);
      this.editedItem = Object.assign({}, item);
    },
  },
};
</script>
<style>
tr.v-data-table__selected {
  background: rgb(224, 238, 255) !important;
}
</style>
