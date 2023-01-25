<template>
  <div>
    <v-container fluid>
      <v-row>
        <v-col class="ma-2" md="12">
          <h4 class="searchbox-title">조회 조건</h4>
          <v-sheet class="pa-3" color="#F6F8F9" height="80" elevation="2">
            <v-row class="">
              <v-col cols="2" class="pl-12 d-flex align-center">
                <v-select
                  class="select pt-4"
                  :items="search_list1"
                  label="조회항목"
                  v-model="search_type_1"
                  item-text="name"
                  item-value="value"
                  dense
                ></v-select>
              </v-col>
              <v-col
                md="4"
                class="pa-0 ma-0 d-flex align-center justify-center"
              >
                <v-menu
                  ref="test_menu1"
                  v-model="test_menu1"
                  :close-on-content-click="false"
                  :return-value.sync="test_date1"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="test_date1"
                      label="시작일"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="test_date1" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="test_menu1 = false">
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.test_menu1.save(test_date1)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
                <!-- 시작일테스트 -->
                <!-- 종료일테스트 -->
                <v-menu
                  ref="test_menu2"
                  v-model="test_menu2"
                  :close-on-content-click="false"
                  :return-value.sync="test_date2"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="test_date2"
                      label="종료일"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="test_date2" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="test_menu2 = false">
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.test_menu2.save(test_date2)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
                <!-- 종료일테스트 -->
              </v-col>
              <!-- 범위슬라이더 -->
              <v-col class="pr-12 d-flex align-center mt-4" md="4">
                <p class="px-4" style="font-size: 12px">양액pH</p>
                <v-range-slider
                  v-model="range"
                  step=".1"
                  :max="max"
                  thumb-label="always"
                  :min="min"
                  hide-details
                  class="align-center"
                >
                  <template v-slot:prepend> </template>
                  <template v-slot:append> </template>
                </v-range-slider>
                <!-- 양액pH -->
                <!-- 양액EC -->
                <p class="px-4" style="font-size: 12px">양액EC</p>

                <v-range-slider
                  v-model="EC_range"
                  step=".1"
                  thumb-label="always"
                  :max="EC_max"
                  :min="EC_min"
                  hide-details
                  class="align-center"
                >
                  <template v-slot:append> </template>
                </v-range-slider>
              </v-col>
              <!-- 범위슬라이더 -->
              <!-- 조회버튼 -->
              <v-col cols="1" class="d-flex justify-center align-center">
                <v-btn color="primary" @click="getWaterHistory()"> 조회 </v-btn>
              </v-col>
            </v-row>
            <!-- 조회버튼 -->
            <!-- 여기row
                 -->
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
    <v-container fluid>
      <v-row class="text-right">
        <v-col>
          <v-btn color="primary" @click="editItem(defaultItem)"
            >데이터 추가</v-btn
          >
        </v-col>
      </v-row>

      <v-row>
        <v-col class="ma-2" md="12">
          <div>
            <v-data-table
              :headers="datas_header"
              :items="datas"
              :page.sync="page"
              :options.sync="options"
              :server-items-length="totalData"
              :items-per-page="itemsPerPage"
              :loading="loading"
              dense
              hide-default-footer
              multi-sort
              @page-count="pageCount = $event"
              class="elevation-1"
              height="670"
            >
              <!-- 버튼을 chip으로 표현 -->
              <template v-slot:item.inputDate="{ item }">
                <!-- 수정전 버튼만-->
                {{ item.inputDate }}
                <!-- 수정전 숫자만 -->
              </template>
              <template v-slot:item.division="{ item }">
                {{ item.division }}
              </template>
              <!-- 제어명칭 -->
              <template v-slot:item.ec="{ item }">
                {{ item.ec }}
              </template>
              <template v-slot:item.ph="{ item }">
                {{ item.ph }}
              </template>
              <template v-slot:item.memo="{ item }">
                {{ item.memo }}
              </template>
              <!-- 수정 -->
              <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="editItem(item)">
                  mdi-pencil
                </v-icon>
              </template>
              <!-- 수정 -->
              <!-- 제어명칭 -->
            </v-data-table>
            <div class="text-center pt-2">
              <v-pagination v-model="page" :length="pageCount"></v-pagination>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <!-- 거래처 생성 모달 -->
    <v-dialog v-model="dialog" max-width="600px" persistent>
      <v-card>
        <v-card-text>
          <v-card-title>
            <span class="text-h5">데이터 추가</span>
          </v-card-title>
          <v-container>
            <!-- 상단 -->
            <v-row class="d-flex justify-center">
              <v-col cols="12" sm="6" md="6">
                <v-menu
                  ref="DIA_menu1"
                  v-model="DIA_menu1"
                  :close-on-content-click="false"
                  :return-value.sync="DIA_s_date"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="editedItem.inputDate"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <!-- 날짜 -->
                  <!--                     v-model="DIA_s_date" -->
                  <v-date-picker
                    v-model="editedItem.inputDate"
                    no-title
                    scrollable
                    :max="DIA_e_date"
                  >
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="DIA_menu1 = false"
                      >Cancel</v-btn
                    >
                    <v-btn
                      text
                      color="primary"
                      @click="DIA_s_date_search(DIA_s_date)"
                      >OK</v-btn
                    >
                  </v-date-picker>
                </v-menu>
              </v-col>
              <!-- 날짜 -->

              <v-col cols="12" sm="2" md="4">
                <v-select
                  class="pa-0 pt-4"
                  :items="search_list2"
                  label="오전/오후"
                  v-model="editedItem.division"
                  item-text="name"
                  item-value="value"
                  dense
                ></v-select>
              </v-col>
              <v-row>
                <v-row class="d-flex justify-center">
                  <v-col cols="12" sm="6" md="4">
                    <!-- <v-text-field
                      class=""
                      v-model.number="editedItem.ph"
                      label="양액pH(4~8사이)"
                      type="number"
                      @change="pH_Num_Check()"
                    ></v-text-field> -->

                    <v-text-field
                      type="number"
                      step="any"
                      min="0"
                      ref="input"
                      label="양액pH(4~8사이)"
                      :rules="[pH_numberRule]"
                      v-model.number="editedItem.ph"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4" class="">
                    <!-- <v-text-field
                      v-model.number="editedItem.ec"
                      label="양액EC(0.3~2.5사이)"
                      type="number"
                    ></v-text-field> -->

                    <v-text-field
                      type="number"
                      step="any"
                      min="0"
                      ref="input"
                      label="양액EC(0.3~2.5사이)"
                      :rules="[EC_numberRule]"
                      v-model.number="editedItem.ec"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="d-flex justify-center">
                  <v-col cols="12" class="d-flex justify-center" sm="12" md="6">
                    <v-text-field
                      maxlength="100"
                      style="width: 300px"
                      v-model="editedItem.memo"
                      label="메모"
                    ></v-text-field> </v-col></v-row
              ></v-row>
            </v-row>
            <!-- 상단 -->
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>

          <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Swal from "sweetalert2";

import * as api from "@/api";
export default {
  name: "InputData",

  data() {
    return {
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
      // 레인지슬라이더
      min: 4,
      EC_min: 0.3,
      max: 8,
      EC_max: 2.5,
      range: [4, 8],
      EC_range: [0.3, 2.5],
      // 레인지슬라이더
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

      desserts: [],
      editedIndex: -1,

      // 데이터테이블 테스트
      //이슬이꺼
      //테스트
      page: 1,
      totalData: 0, //총 데이타의 개수 백엔드에서받아서 교체할것임
      loading: false,
      itemsPerPage: 20,
      pageCount: 10,
      options: {},
      datas_header: [
        {
          text: "날짜",

          value: "inputDate",
        },
        { text: "오전/오후", value: "division" },

        { text: "ec", value: "ec" },
        { text: "ph", value: "ph" },
        { text: "비고(양액명)", value: "memo" },
        { text: "수정", value: "actions" },
      ],
      datas: [],
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
        memo: "",
        ph: 0,
        ec: 0,
        division: "",
        inputDate: "",
      },
      defaultItem: {
        memo: "",
        ph: 4,
        ec: 2.5,
        division: "",
        inputDate: new Date().toISOString().substr(0, 10),
      },
      editedIndex: -1,
    };
  },
  mounted() {
    this.BeforeWeeks();
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
        this.getWaterHistory();
      },
      deep: true,
    },
  },
  methods: {
    // 시작일을 일주일전으로
    // BeforeWeeks() {
    //   let nowDate = new Date();
    //   let weekDate = nowDate.getTime() - 7 * 24 * 60 * 60 * 1000;
    //   nowDate.setTime(weekDate);

    //   let weekYear = nowDate.getFullYear();
    //   let weekMonth = nowDate.getMonth() + 1;
    //   let weekDay = nowDate.getDate();

    //   if (weekMonth < 10) {
    //     weekMonth = '0' + weekMonth;
    //   }
    //   if (weekDay < 10) {
    //     weekDay = '0' + weekDay;
    //   }

    //   let resultDate = weekYear + '-' + weekMonth + '-' + weekDay;
    //   this.test_date1 = resultDate;
    //   console.log(resultDate);
    // },
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
    //스윗알러트
    //pH 넘버 유효성
    pH_Num_Check() {
      console.log(this.editedItem.ph);
    },
    //pH 넘버 유효성
    // 다이로그닫을때
    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.desserts.splice(this.editedIndex, 1);
      this.closeDelete();
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    // 다이로그닫을때
    // 데이어 추가시 오전/오후 디폴트
    getAmPm() {
      let today = new Date();
      let hours = today.getHours(); // 시
      let minutes = today.getMinutes(); // 분
      if (hours < 12) {
        this.defaultItem.division = "오전";
      } else if (hours >= 12 && minutes > 0) {
        this.defaultItem.division = "오후";
      }
      console.log(hours + ":" + minutes);
    },
    // 데이어 추가시 오전/오후 디폴트
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
      var item = {
        ec: this.editedItem.ec,
        ph: this.editedItem.ph,
        inputDate: this.editedItem.inputDate,
        division: this.editedItem.division,
        memo: this.editedItem.memo,
      };

      if (this.editedIndex == -1) {
        console.log("등록버젼입니다.");

        api.smartfarm
          .waterECpHRegister(item)
          .then((response) => {
            this.getWaterHistory();
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
        api.smartfarm.waterECpHEdit(item).then((response) => {
          this.getWaterHistory();
        });

        console.log("edit버젼입니다/");
      }

      this.close();
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    editItem(item) {
      this.getAmPm();
      this.editedIndex = this.datas.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    // 테스트 데이타테이블
    // 수정전,수정후 버튼색
    getColor(valueBefore) {
      if (valueBefore == "ON") return "green";
      else if (valueBefore == "OFF") return "grey";
      else if (valueBefore == "AUTO") return "blue";
      else return "yellow";
    },
    // 제어상태 히스토리 api
    getWaterHistory() {
      // getAmPm();
      this.loading = true;
      const { page, itemsPerPage, sortBy, sortDesc } = this.options;

      var item = {
        searchTarget: this.search_type_1,
        startDate: this.test_date1,
        endDate: this.test_date2,
        ec: this.EC_range,
        ph: this.range,
        page: page,
        size: itemsPerPage, //보여주고싶은 행의개수
        sortBy: sortBy,
        sortDesc: sortDesc,
      };
      console.log("리퀘스트파라미터", item);
      api.smartfarm
        .waterECpHInfo(item)
        .then((res) => {
          console.log("통신후", res);
          if (res.status == 200) {
            console.log("통신후 데이타만있는거", res.data.responseData);
            this.loading = false; //로딩바
            this.datas = res.data.responseData;
            this.totalData = res.totalCount;
          } else {
            console.log("통신후 데이타만있는거", res.data.responseData);
            this.loading = false; //로딩바
            this.$swal.fire(
              "ERROR",
              "서버와 통신이 원활하지않습니다.",
              "ERROR"
            );
          }
        })
        .catch((error) => {
          console.log("에러입니다.");
          this.loading = false; //로딩바

          console.log(error);
        });
    },

    s_date_search(v) {
      this.s_date = v;
      this.menu1 = false;
      this.$refs.menu1.save(v);
    },
    e_date_search(v) {
      this.e_date = v;
      this.menu2 = false;
      this.$refs.menu2.save(v);
    },
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
  },
  created() {},
};
</script>
<style>
.select {
  max-width: 200px;
}
</style>
