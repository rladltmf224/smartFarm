<template>
  <div>
    <v-container dense class="ma-0 pa-0">
      <v-col class="pa-0 ma-0" md="12">
        <v-sheet
          class="mx-4 mt-3 pa-0 ma-0 d-flex align-center"
          color="#F6F8F9"
          height="60"
          elevation="2"
        >
          <v-row>
            <v-col cols="12  " class="d-flex">
              <v-row class="pa-0 ma-0">
                <v-col cols="2 " class="">
                  <v-menu
                    v-model="menu1"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="s_date"
                        label="시작일"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="s_date"
                      @input="menu1 = false"
                      no-title
                      :max="e_date"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="2" class="d-flex justify-center align-center">
                  <!-- 시작시간 -->
                  <vue-timepicker
                    class="timeBox"
                    v-model="startTime"
                  ></vue-timepicker>
                </v-col>
                <v-col cols="2" class="">
                  <v-menu
                    v-model="menu2"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y="offset-y"
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="e_date"
                        label="종료일"
                        prepend-icon="mdi-calendar"
                        readonly="readonly"
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>

                    <v-date-picker
                      no-title
                      v-model="e_date"
                      @input="menu2 = false"
                      :min="s_date"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="2" class="d-flex justify-center align-center">
                  <vue-timepicker v-model="endTime"></vue-timepicker>
                </v-col>
                <v-col cols="1" class="d-flex align-center justify-center">
                  <v-select
                    v-model="user_auth"
                    label="조회단위"
                    :items="authList"
                    item-text="name"
                    item-value="value"
                  ></v-select>
                </v-col>
              </v-row>
              <v-col cols="2" class="d-flex align-center justify-center">
                <v-btn @click="getDataforTable()" color="primary">조회</v-btn>
              </v-col>
              <v-row></v-row>
            </v-col>
          </v-row>
        </v-sheet>
      </v-col>
    </v-container>
    <v-container fluid="fluid" class="pa-0 pa-0">
      <v-row class="ma-0 pa-0">
        <v-col class="" md="12">
          <!-- <v-row class="mb-2">
            <h5 class="searchbox-title pl-3 pt-2">온습도 데이터</h5>
            <v-btn icon color="grey" v-if="this.btnShow_Value" @click="btnShow()">
              <v-icon>mdi-chevron-down</v-icon>
            </v-btn>

            <v-btn
              icon
              color="grey"
              v-if="!this.btnShow_Value"
              @click="btnShow()"
            >

              <v-icon>mdi-chevron-up</v-icon>
            </v-btn>
            <v-col cols="12" v-show="!this.btnShow_Value">
              <v-sheet class="" color="#F6F8F9" height="400" elevation="2">
                <div class="d-flex pl-3 pt-3 align-center">
                  <h5 class="searchbox-title">
                    현재 온도:
                    {{ this.nowValue[0].value }}
                    {{ this.nowValue[0].unit }}
                    {{ this.nowValue[1].name }}:
                    {{ this.nowValue[1].value }}
                    {{ this.nowValue[1].unit }}
                  </h5>
                </div>
                <LoadingSpinner v-if="this.isLoading"></LoadingSpinner>
                <div class="d-flex justify-center" v-if="!this.isLoading">
                  <TempHumidGraph :graph="graph" v-show="!this.isLoading"></TempHumidGraph>
                </div>

                <div v-show="!this.isLoading" class="">
                  <canvas
                    class="j pa-6"
                    ref="barChart"
                    height="300"
                    width="1300"
                  />
                </div>

              </v-sheet>
            </v-col>
          </v-row> -->
          <v-col md="2" class="pa-0 ma-0">
            <h5 class="searchbox-title">온습도 데이터 표</h5>
          </v-col>
          <!-- 데이터 테이블 -->
          <div>
            <v-data-table
              :headers="datas_header"
              :items="datas"
              multi-sort
              :page.sync="page"
              :options.sync="options"
              :server-items-length="totalData"
              :items-per-page="itemsPerPage"
              :loading="loading"
              dense
              hide-default-footer
              @page-count="pageCount = $event"
              class="elevation-1"
            >
            </v-data-table>
            <div class="text-center pt-2">
              <v-pagination
                v-model="page"
                :total-visible="11"
                :length="pageCount"
              ></v-pagination>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import LoadingSpinner from "./LoadingSpinner.vue"; // 로딩스피너
import TempHumidGraph from "./TempHumidGraph.vue";
import { Chart, registerables } from "chart.js"; //그래프
import zoomPlugin from "chartjs-plugin-zoom"; //그래프
import annotationPlugin from "chartjs-plugin-annotation"; //그래프
Chart.register(...registerables); //그래프
Chart.register(zoomPlugin); //그래프
Chart.register(annotationPlugin); //그래프

import DetailGraph from "./DetailGraph.vue";

import VueTimepicker from "vue2-timepicker/src/vue-timepicker.vue";
import _ from "lodash";
// import {
//   temphumid,
//   getWaterEC,
//   getWaterPH,
//   temphumidValue,
//   waterECpHInfo,
//   getTableDataTempHumid,
//   getTableDataTempHumidHour,
// } from "@/api/index.js";

import * as api from "@/api/index.js";
export default {
  name: "TempHumid",
  props: ["search_type_1"],
  components: {
    VueTimepicker,
    DetailGraph,
    LoadingSpinner,
    TempHumidGraph,
  },
  data() {
    return {
      btnShow_Value: false,
      //프롭스용
      graph: [
        {
          label_1: "",
          label_2: "",
          date: [],
          min_data_1: [],
          min_data_2: [],
          hour_data_1: [],
          hour_data_2: [],
        },
      ],
      //프롭스용
      // 실시간 값용
      nowValue: [
        { name: "온도", value: 0, unit: "°C" },
        { name: "습도", value: 0, unit: "%" },
      ],
      // 실시간 값용
      // 그래프용
      unit: [
        {
          temperature: "°C",
          humidity: "%",
        },
      ],

      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "온도",
            data: [],
            fill: false,
            borderColor: "red",
            tension: 0.1,
            backgroundColor: "red",
            pointRadius: 1,
            borderWidth: 0.1,
            yAxisID: "y1",
          },
          {
            label: "습도",
            data: [],
            fill: false,
            borderColor: "blue",
            tension: 0.1,
            backgroundColor: "blue",
            pointRadius: 1, //점 크기
            borderWidth: 0.1, //라인굵기
            yAxisID: "y",
          },
        ],
      },
      options_graph: {
        responsive: true,
        maintainAspectRatio: false,

        stacked: false,

        events: ["mousemove", "mouseout", "click", "touchstart", "touchmove"],
        interaction: {
          mode: "index",
          intersect: false,
        },
        pan: {
          enabled: true,
          mode: "x",
        },
        responsive: false,
        scales: {
          y: {
            beginAtZero: true,
            min: 0,
            max: 100,
            type: "linear",
            display: true,

            position: "left",
            title: {
              display: true,
              text: "습도 %",
            },
          },
          y1: {
            type: "linear",
            display: true,
            position: "right",
            grid: {
              drawOnChartArea: false, // only want the grid lines for one axis to show up
            },
            min: 0,
            max: 40,
            title: {
              display: true,
              text: "온도 °C",
            },
            grid: {
              drawOnChartArea: false, // only want the grid lines for one axis to show up
            },
          },
          x: {
            ticks: {
              autoSkip: true, // 👈
              maxTicksLimit: 20, // 👈
            },
          },
        },

        plugins: {
          tooltip: {
            // Tooltip will only receive click events
            events: ["mousemove"],
          },
          title: {
            display: true,
          },
          autocolors: false,
          interaction: {
            mode: "index",
            intersect: false,
          },
          stacked: false,
          autocolors: false,
          // annotation: {
          //   annotations: {
          //     line1: {
          //       type: 'line',
          //       yMin: 20,
          //       yMax: 20,
          //       borderColor: 'pink',
          //       borderWidth: 4,
          //     },
          //   },
          // },
          zoom: {
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true,
              },
              mode: "xy",
            },
            pan: {
              enabled: true,
            },
            limits: {
              x: { min: 0, max: 2e3, minRange: 10000000 },
              y: { min: 0, max: 100, minRange: 10 },
            },
          },
        },
      },
      // 그래프용

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
        { text: "습도", value: "humidity" },
      ],

      datas: [],
      page: 1,
      totalData: 0,
      loading: false,
      itemsPerPage: 18,
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
      items: ["온/습도", "양액pH", "양액EC"],
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

      // search_type_1: {
      //   name: "육묘실",
      //   value: 1,
      // },
      search_type_2: 1,

      // search_list1: [
      //   {
      //     name: "육묘실",
      //     value: 1,
      //   },
      //   {
      //     name: "발아활착실",
      //     value: 2,
      //   },
      // ],

      search_list2: [
        {
          name: "1번구역",
          value: 1,
        },
        {
          name: "2번구역",
          value: 2,
        },
        {
          name: "3번구역",
          value: 3,
        },
        {
          name: "4번구역",
          value: 4,
        },
        {
          name: "5번구역",
          value: 5,
        },
        {
          name: "6번구역",
          value: 6,
        },
        {
          name: "7번구역",
          value: 7,
        },
      ],

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
  watch: {
    options: {
      handler() {
        this.getDataforTable();
      },
      deep: true,
    },
  },
  mounted() {
    this.getDataforTable();
  },

  methods: {
    btnShow() {
      this.btnShow_Value = !this.btnShow_Value;
    },

    /*
    // api
    getTempHumidData() {
      this.loading = true;
      const { page, itemsPerPage } = this.options;
      this.isLoading = true;

      let GetTempHumidParams = {
        roomId: this.search_type_1.value, //실
        section: this.search_type_2, //구역 넘버

        startDate: this.s_date + " " + this.startTime, //시작일
        endDate: this.e_date + " " + this.endTime, //종료일
        division: this.user_auth, //조회단위
      };

      api.smartfarm.temphumid(GetTempHumidParams).then((res) => {
        if (this.user_auth == "minute") {
          //for문 탈출하기 with 소영선임님
          let input_start = this.s_date + " " + this.startTime;
          let input_end = this.e_date + " " + this.endTime;

          let start_date = new Date(input_start);
          let end_date = new Date(input_end);
          let o = res.data.responseData;
          let source = _.sortBy(o, "createdDate"); //서버에서 받은 데이터를 날짜만 뽑아서  정렬
          let result = [];
          let i = 0;
          let date = start_date;

          while (date <= end_date) {
            let temp = source[i]; //그냥 2022-12-12 14:00 형식

            if (temp != undefined) {
              let today = new Date(temp.createdDate); //날짜 표준화형식
              if (date.getTime() == today.getTime()) {
                result.push({
                  date: date.toString(),
                  hour_Temp_Value: temp["temperatureAVG"], //이따 확인해야할것- 설님
                  hour_Humid_Value: temp["humidityAVG"], //이따 확인해야할것- 설님
                  min_Humid_Value: temp["humidity"],
                  min_Temp_Value: temp["temperature"],
                });
                i++;
                date.setMinutes(date.getMinutes() + 1);
                continue;
              }
            }
            result.push({
              date: date.toString(),
              hour_Humid_Value: 0,
              hour_Temp_Value: 0,
              min_Humid_Value: 0,
              min_Temp_Value: 0,
            });
            date.setMinutes(date.getMinutes() + 1);
          }
          console.log("최종", result);

          var GraphDate = _.map(result, "date");
          var changed_24Hours_Date = [];

          for (let i = 0; i < GraphDate.length; i++) {
            const TIME_ZONE = 3240 * 10000;
            const d = new Date(GraphDate[i]);

            const date = new Date(+d + TIME_ZONE).toISOString().split("T")[0];

            const time = d.toTimeString().split(" ")[0];
            // 2022-12-12 14:00 방식화
            var changed_24Hours_Date_Arr = date + " " + time;
            //초 짜르기
            var cutted_24Hours_Date = changed_24Hours_Date_Arr.substr(0, 16);

            //초 짜른 날짜를 어레이에 담기
            //    날짜: changed_24Hours_Date

            changed_24Hours_Date.push(cutted_24Hours_Date);
          }
          this.isLoading = false;

          // 여기서 그래프만들기
          var graph_date = changed_24Hours_Date;
          var graph_min_y1 = _.map(result, "min_Temp_Value"); // min일때 y축 1
          var graph_min_y2 = _.map(result, "min_Humid_Value"); // min일때 y축 2

          // 그래프 데이터에 바인딩

          this.graph.date = graph_date;
          this.graph.min_data_1 = graph_min_y1;
          this.graph.min_data_2 = graph_min_y2;

          this.getNowValue();
          this.getTableData_TempHumid();
        } else if (this.user_auth == "hour") {
          //for문 탈출하기 with 소영선임님
          let input_start = this.s_date + " " + this.startTime;
          let input_end = this.e_date + " " + this.endTime;
          let start_date = new Date(input_start);
          let end_date = new Date(input_end);
          console.log("엔드데이트", end_date);
          let o = res.data.responseData;
          let source = _.sortBy(o, "createdDate"); //서버에서 받은 데이터를 날짜만 뽑아서  정렬

          let result = [];
          let i = 0;
          let date = start_date;

          while (date <= end_date) {
            let temp = source[i]; //그냥 2022-12-12 14:00 형식

            if (temp != undefined) {
              let today = new Date(temp.createdDate); //날짜 표준화형식
              if (date.getTime() == today.getTime()) {
                result.push({
                  date: date.toString(),
                  hour_Temp_Value: temp.temperatureAVG,
                  hour_Humid_Value: temp.humidityAVG,
                  min_Humid_Value: 0,
                  min_Temp_Value: 0,
                });
                i++;
                date.setHours(date.getHours() + 1);
                console.log("리절트", result);
                continue;
              }
            }
            result.push({
              date: date.toString(),
              hour_Temp_Value: 0,
              hour_Humid_Value: 0,
              min_Humid_Value: 0,
              min_Temp_Value: 0,
            });
            date.setHours(date.getHours() + 1);
          }
          console.log("최종", result);

          var GraphDate = _.map(result, "date");
          var changed_24Hours_Date = [];

          for (let i = 0; i < GraphDate.length; i++) {
            const TIME_ZONE = 3240 * 10000;
            const d = new Date(GraphDate[i]);

            const date = new Date(+d + TIME_ZONE).toISOString().split("T")[0];

            const time = d.toTimeString().split(" ")[0];
            // 2022-12-12 14:00 방식화
            var changed_24Hours_Date_Arr = date + " " + time;
            //초 짜르기
            var cutted_24Hours_Date = changed_24Hours_Date_Arr.substr(0, 16);

            //초 짜른 날짜를 어레이에 담기
            //    날짜: changed_24Hours_Date

            changed_24Hours_Date.push(cutted_24Hours_Date);
          }
          this.isLoading = false;

          // 여기서 그래프만들기
          var graph_date = changed_24Hours_Date;

          var graph_hour_y1 = _.map(result, "hour_Temp_Value"); // min일때 y축 1
          var graph_hour_y2 = _.map(result, "hour_Humid_Value"); // min일때 y축 2
          // 그래프 데이터에 바인딩

          this.graph.date = graph_date;

          this.graph.min_data_1 = graph_hour_y1;
          this.graph.min_data_2 = graph_hour_y2;
          this.getNowValue();
          this.getTableData_TempHumid_Hour();
        }
      });
    },
    */

    // 그래프 삭제
    // -> 그래프용 데이터 불러오는 getTempHumidData() 삭제하면서 만듦
    getDataforTable() {
      // this.getNowValue(); 그래프 사라지면서 현재 온습도 보여주는 것도 사라짐
      if (this.user_auth == "minute") {
        this.getTableData_TempHumid();
      } else if (this.user_auth == "hour") {
        this.getTableData_TempHumid_Hour();
      } else {
        console.log("user_auth가 이상하다!!!");
      }
    },
    // 페이징용 데이타테이블 api 분단위
    getTableData_TempHumid() {
      this.loading = true;
      const { page, itemsPerPage, sortBy, sortDesc } = this.options;
      let GetTempHumidParams = {
        room: this.search_type_1.name,
        facilityId: this.search_type_1.id, //실
        section: this.search_type_2, //구역 넘버

        startDate: this.s_date + " " + this.startTime, //시작일
        endDate: this.e_date + " " + this.endTime, //종료일
        page: page,
        size: itemsPerPage,
        sortBy: sortBy,
        sortDesc: sortDesc,
      };

      api.smartfarm
        .getTableDataTempHumid(GetTempHumidParams)
        .then((res) => {
          // 이걸로 테이블만들기
          this.loading = false; //로딩바
          // this.datas_header[1].value = "temperature";
          // this.datas_header[5].value = "humidity";
          this.datas = res.data.responseData;
          this.totalData = res.data.totalCount;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 페이징용 데이타테이블 api 시간단위

    getTableData_TempHumid_Hour() {
      this.loading = true;
      const { page, itemsPerPage, sortBy, sortDesc } = this.options;

      let GetTempHumidParams = {
        room: this.search_type_1.name,
        facilityId: this.search_type_1.id, //실
        section: this.search_type_2, //구역 넘버
        startDate: this.s_date + " " + this.startTime, //시작일
        endDate: this.e_date + " " + this.endTime, //종료일
        page: page,
        size: itemsPerPage,
        sortBy: sortBy,
        sortDesc: sortDesc,
      };

      api.smartfarm
        .getTableDataTempHumidHour(GetTempHumidParams)
        .then((res) => {
          this.loading = false; //로딩바
          //this.datas_header[1].value = "temperatureAVG";
          //this.datas_header[5].value = "humidityAVG";
          this.datas = res.data.responseData;
          this.totalData = res.data.totalCount;
        });
    },
    //현재온습도
    getNowValue() {
      let item = {
        facilityId: this.search_type_1.id,
        section: this.search_type_2,
      };

      api.smartfarm.temphumidValue(item).then((res) => {
        this.nowValue[0].value = res.data.responseData.temperature;
        this.nowValue[1].value = res.data.responseData.humidity;
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
