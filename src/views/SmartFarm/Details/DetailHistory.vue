<template>
  <div>
    <v-container fluid="fluid" class="pa-0 ma-0">
      <v-row dense class="ma-0 pa-0">
        <v-col class="ma-2" md="12">
          <!-- 조회 위치 -->
          <v-row class="">
            <v-col cols="11" class="">
              <v-row class="pa-0 ma-0 d-flex">
                <v-col cols="2" class="pa-0 ma-0">
                  <v-select
                    :items="search_list1"
                    label="실 선택"
                    v-model="search_type_1"
                    item-text="name"
                    item-value="value"
                    dense="dense"
                    single-line
                    return-object
                  ></v-select>
                </v-col>

                <!-- <v-col cols="2" class="pa-0 ma-0 pl-4">
                  <v-select
                    :items="search_list2"
                    label="구역 선택"
                    v-model="search_type_2"
                    item-text="name"
                    item-value="value"
                    dense="dense"
                    single-line
                  ></v-select>
                </v-col> -->
              </v-row>
              <v-row dense class="">
                <!-- 탭스 -->
                <v-col class="pa-0 ma-0">
                  <v-tabs
                    v-model="tab"
                    align-with-title="align-with-title"
                    background-color=""
                  >
                    <v-tabs-slider color="primary"></v-tabs-slider>

                    <v-tab
                      v-for="item in items"
                      :key="item"
                      @click="clickTest(item)"
                    >
                      {{ item }}
                    </v-tab>
                  </v-tabs>

                  <v-tabs-items v-model="tab"></v-tabs-items>
                </v-col>

                <!-- 탭스 -->
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <TempHumid
        v-if="this.search_type_1 != null && this.selectedTabs == '온/습도'"
        :search_type_1="search_type_1"
      ></TempHumid>
      <WaterpH
        v-if="this.search_type_1 != null && this.selectedTabs == '양액pH/EC'"
        :search_type_1="search_type_1"
      ></WaterpH>
      <v-row> </v-row>
    </v-container>
  </div>
</template>

<script>
import _ from "lodash";
import LoadingSpinner from "../Loading/LodingSpinner.vue"; // 로딩스피너
import TempHumid from "./TempHumid.vue";
import WaterpH from "./WaterpH.vue";

import {
  temphumid,
  getWaterEC,
  getWaterPH,
  temphumidValue,
  getTableDataTempHumid,
} from "@/api/index.js";

import * as api from "@/api/index.js";
import VueTimepicker from "vue2-timepicker/src/vue-timepicker.vue";
import DetailGraph from "./DetailGraph.vue";

export default {
  name: "DetailHistory",

  data() {
    return {
      // 이슬
      DataValues: [],
      //   데이터테이블
      datas_header: [
        {
          text: "날짜",

          value: "createdDate",
        },
        { text: "온도", value: "temperature" },
        { text: "센서명", value: "sensorCode" },
        { text: "온도", value: "temperature" },
        { text: "실 이름", value: "room" },
        { text: "구역 숫자", value: "sectionNumber" },

        { text: "습도", value: "humidity" },
      ],
      datas: [],
      page: 1,
      totalData: 0,
      loading: false,
      itemsPerPage: 20,
      pageCount: 10,
      options: {},
      //   데이터테이블
      TimeRange: [],
      isLoading: true,
      startTime: "01:00",
      endTime: "12:00",
      yes: false,
      // 눌린tabs
      selectedTabs: "온/습도",
      tab: 0,
      items: ["온/습도", "양액pH/EC"],
      text:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor" +
        " incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis no" +
        "strud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",

      // 날짜
      // 데이터테이블

      desserts: [
        {
          name: "2022-12-14 13:00",
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          iron: "1%",
        },
      ],
      // 데이터테이블
      date: new Date().toISOString().substr(0, 10),
      s_date: new Date().toISOString().substr(0, 10),
      e_date: new Date().toISOString().substr(0, 10),
      menu1: false,
      menu2: false,
      // 날짜 이슬
      authList: [
        {
          name: "분",
          value: "minute",
        },
        {
          name: "시간",
          value: "hour",
        },
      ],
      user_auth: "minute",

      user_auth_rule: [(v) => !!v || "조회단위는 필수 선택 사항입니다."],
      // 조회단위 조회단위
      startDate: false,
      endDate: false,
      search_type_1: null,
      search_list1: [],

      editedIndex: -1,
      customer_list: [],
      rules: {
        required: (value) => !!value || "Required.",
        counter: (value) => value.length <= 20 || "Max 20 characters",
        email: (value) => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail.";
        },
      },
      //   api 파라미터
      getDataItem: "",
      //   그래프제작용데이터
      responseResult: "",
      //   api 파라미터
      newData: [
        {
          name: "온/습도", //센서명
          min_data1: [],
          min_data2: [],
          hour_data1: [],
          hour_data2: [],
          sensorName: "", //센서이름
          first_tag: "온도", //첫번째 라벨
          second_tag: "습도", //두번째 라벨
          now_data1: "",
          now_data2: "",
          createdDate: [],
          num: "",
          division: "",
        },
        {
          name: "양액pH",
          AM_ph: [],
          PM_ph: [],
          inputDate: "",
        },
      ],
    };
  },
  mounted() {
    api.smartfarm.temphumidRoomList().then((response) => {
      this.search_list1 = response.data.responseData;
      this.search_type_1 = this.search_list1[0];
    });
  },
  watch: {
    options: {
      handler() {
        this.getTempHumidData();
      },
      deep: true,
    },
  },
  components: {
    VueTimepicker,
    DetailGraph,
    TempHumid,
    WaterpH,
    LoadingSpinner,
  },
  methods: {
    // //온/습도 데이터 가져오는api
    // getTempHumidData() {
    //   this.isLoading = true;
    //   let GetTempHumidParams = {
    //     room: this.search_type_1, //실
    //     section: this.search_type_2, //구역 넘버
    //     startDate: this.s_date + " " + this.startTime, //시작일
    //     endDate: this.e_date + " " + this.endTime, //종료일
    //     division: this.user_auth, //조회단위
    //   };

    //   api.smartfarm.temphumid(GetTempHumidParams).then((res) => {
    //     this.isLoading = false;

    //     this.responseResult = res.data;
    //     this.newData[0].min_data1 = _.map(this.responseResult, "temperature");
    //     this.newData[0].min_data2 = _.map(this.responseResult, "humidity");
    //     this.newData[0].createdDate = _.map(this.responseResult, "createdDate");
    //     this.newData[0].division = res.data[0].division;
    //     this.newData[0].sensorName = res.data[0].sensorCode;

    //     //for문 탈출하기 with 소영선임님
    //     let input_start = this.s_date + " " + this.startTime;
    //     let input_end = this.e_date + " " + this.endTime;

    //     let start_date = new Date(input_start);
    //     let end_date = new Date(input_end);
    //     let o = res.data;
    //     let source = _.sortBy(o, "createdDate"); //서버에서 받은 데이터를 날짜만 뽑아서  정렬

    //     let result = [];
    //     let i = 0;
    //     let date = start_date;

    //     while (date <= end_date) {
    //       let temp = source[i]; //그냥 2022-12-12 14:00 형식

    //       if (temp != undefined) {
    //         let today = new Date(temp.createdDate); //날짜 표준화형식
    //         if (date.getTime() == today.getTime()) {
    //           result.push({
    //             date: Date(temp["createdDate"]).toString(),
    //             hour_Humid_Value: temp["humidityAVG"],
    //             hour_Temp_Value: temp["temperatureAVG"],
    //             min_Humid_Value: temp["humidity"],
    //             min_Temp_Value: temp["temperature"],
    //           });
    //           i++;
    //           date.setMinutes(date.getMinutes() + 1);
    //           continue;
    //         }
    //       }
    //       result.push({
    //         date: date.toString(),
    //         hour_Humid_Value: 0,
    //         hour_Temp_Value: 0,
    //         min_Humid_Value: 0,
    //         min_Temp_Value: 0,
    //       });
    //       date.setMinutes(date.getMinutes() + 1);
    //     }
    //     console.log("최종", result);
    //     this.DataValues = result;
    //   });
    // },
    // // 온/습도 분단위 테이블데이터 가져오는api
    // getTableData_TempHumid() {
    //   this.loading = true;
    //   const { page, itemsPerPage } = this.options;

    //   let GetTempHumidParams = {
    //     room: this.search_type_1, //실
    //     section: this.search_type_2, //구역 넘버
    //     startDate: this.s_date + " " + this.startTime, //시작일
    //     endDate: this.e_date + " " + this.endTime, //종료일
    //     page: page - 1,
    //     size: itemsPerPage, //보여주고싶은 행의개수
    //   };
    //   api.smartfarm
    //     .getTableDataTempHumid(GetTempHumidParams)
    //     .then((res) => {
    //       console.log(res);
    //       // 이걸로 테이블만들기

    //       this.loading = false; //로딩바
    //       this.datas = res.data.readTempHumidSensorResponseDtos;
    //       this.totalData = res.totalCount;
    //       console.log("테이블데이타테이블데이타테이블데이타", this.datas);
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // },
    // //양액PH 데이터 가져오는 api
    // getWaterPHData() {
    //   this.isLoading = true;

    //   let GetWaterPHParams = {
    //     startDate: this.s_date,
    //     endDate: this.e_date,
    //   };

    //   api.smartfarm.getWaterPH(GetWaterPHParams).then((res) => {
    //     this.isLoading = false;

    //     let AM = _.filter(res.data.responseData, { division: "오전" });
    //     let PM = _.filter(res.data.responseData, { division: "오후" });
    //     let inputDate = _.map(res.data.responseData, "inputDate");
    //     let onlyAMResult = _.map(AM, "ph"); //오전값만있는어레이
    //     let onlyPMResult = _.map(PM, "ph"); //오전값만있는어레이
    //     let onlyOneDate = _.uniq(inputDate);

    //     this.newData[1].AM_ph = onlyAMResult;
    //     this.newData[1].PM_ph = onlyPMResult;
    //     this.newData[1].inputDate = onlyOneDate;
    //     console.log("phDataphDataphData", this.newData[1]);
    //   });
    // },

    // //양액EC 데이터 가져오는 api
    // getWaterECData() {
    //   let GetWaterECParams = {
    //     startDate: this.s_date,
    //     endDate: this.e_date,
    //   };
    //   api.smartfarm.getWaterEC(GetWaterECParams).then((res) => {
    //     console.log(res);
    //   });
    // },
    clickTest(item) {
      this.selectedTabs = item;
    },
    // 이슬
  },

  computed: {},
};
</script>
<style scoped>
.vue__time-picker input.display-time {
  border: 1px solid #d2d2d2;
}

.timeBox {
  border: 1px solid #000000;
}

.v-text-field.v-text-field--enclosed .v-text-field__details {
  padding-top: 0px;
  margin-bottom: 0px;
}

::v-deep .v-text-field__details {
  display: none;
}

::v-deep .v-slide-group__content {
  display: flex;
  flex: 1 0 auto;
  position: relative;
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  white-space: nowrap;
  height: 42px;
}
</style>
