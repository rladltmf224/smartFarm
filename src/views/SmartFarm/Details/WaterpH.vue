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
            <v-col cols="12 " class="d-flex">
              <v-col cols="2" class="">
                <v-menu
                  v-model="menu1"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y="offset-y"
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="s_date"
                      label="시작일"
                      prepend-icon="mdi-calendar"
                      readonly="readonly"
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="s_date"
                    @input="menu1 = false"
                    no-title
                  ></v-date-picker>
                </v-menu>
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
                    v-model="e_date"
                    @input="menu2 = false"
                    no-title
                    :min="s_date"
                    :max="date"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <!-- 슬라이더 -->
              <v-col class="pr-12 d-flex align-center mt-4" md="2">
                <p class="px-4" style="font-size: 12px">양액pH</p>
                <v-range-slider
                  v-model="range_ph"
                  step=".1"
                  :max="max_ph"
                  thumb-label="always"
                  :min="min_ph"
                  hide-details
                  class="align-center"
                >
                  <template v-slot:prepend> </template>
                  <template v-slot:append> </template>
                </v-range-slider>
                <!-- 양액pH -->
                <!-- 양액EC -->
              </v-col>
              <v-col class="pr-12 d-flex align-center mt-4" md="2">
                <p class="px-4" style="font-size: 12px">양액EC</p>
                <v-range-slider
                  v-model="range_ec"
                  step=".1"
                  :max="max_ec"
                  thumb-label="always"
                  :min="min_ec"
                  hide-details
                  class="align-center"
                >
                  <template v-slot:prepend> </template>
                  <template v-slot:append> </template>
                </v-range-slider>
                <!-- 양액pH -->
                <!-- 양액EC -->
              </v-col>

              <v-col cols="2" class="d-flex align-center justify-center">
                <v-btn @click="getWaterHistory()" color="primary">조회</v-btn>
              </v-col>
              <v-row></v-row>
            </v-col>
          </v-row>
        </v-sheet>
      </v-col>
    </v-container>
    <v-container fluid="fluid" class="pa-0 pa-0">
      <v-row class="ma-0 pa-0">
        <v-col class="mx-2" md="12">
          <v-row class="mb-2">
            <h5 class="searchbox-title pl-3 pt-2">양액pH 데이터</h5>
            <!-- 펼치기버튼 -->
            <v-btn
              icon
              color="grey"
              v-if="this.btnShow_Value"
              @click="btnShow()"
            >
              <v-icon>mdi-chevron-down</v-icon>
            </v-btn>
            <!-- 접기버튼 -->
            <v-btn
              icon
              color="grey"
              v-if="!this.btnShow_Value"
              @click="btnShow()"
            >
              <v-icon>mdi-chevron-up</v-icon>
            </v-btn>
            <v-col cols="12" v-show="!this.btnShow_Value">
              <v-sheet
                class="pa-12 d-flex justify-center align-center"
                color="#F6F8F9"
                height="400"
                elevation="2"
              >
                <LoadingSpinner v-if="this.isLoading"></LoadingSpinner>
                <div v-if="!this.isLoading">
                  <WaterPHGraph
                    :graph="graph"
                    v-show="!this.isLoading"
                  ></WaterPHGraph>
                </div>

                <!-- <div v-show="!this.isLoading" class="">
                  <canvas
                    class="j pa-6"
                    ref="barChart"
                    height="300"
                    width="1300"
                  />
                </div> -->
              </v-sheet>
            </v-col>
          </v-row>
          <v-col md="2" class="pa-0 ma-0">
            <h5 class="searchbox-title">양액pH 데이터 표</h5>
          </v-col>
          <!-- 데이터 테이블 -->
          <div>
            <v-data-table
              :headers="datas_header"
              :items="datas"
              :page.sync="page"
              :options.sync="options"
              :server-items-length="totalData"
              :items-per-page="itemsPerPage"
              :loading="loading"
              hide-default-footer
              class="elevation-1"
              @page-count="pageCount = $event"
              dense
              multi-sort
              :height="230"
            >
            </v-data-table>
            <div class="text-center pt-2">
              <v-pagination v-model="page" :length="pageCount"></v-pagination>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import LoadingSpinner from "./LoadingSpinner.vue"; // 로딩스피너

import WaterPHGraph from "./WaterPHGraph.vue";
import { Chart, registerables } from "chart.js"; //그래프
import zoomPlugin from "chartjs-plugin-zoom"; //그래프
import annotationPlugin from "chartjs-plugin-annotation"; //그래프
Chart.register(...registerables); //그래프
Chart.register(zoomPlugin); //그래프
Chart.register(annotationPlugin); //그래프

import DetailGraph from "./DetailGraph.vue";

import VueTimepicker from "vue2-timepicker/src/vue-timepicker.vue";
import _ from "lodash";

import * as api from "@/api/index.js";
export default {
  name: "TempHumid",
  components: {
    VueTimepicker,
    DetailGraph,
    WaterPHGraph,
    LoadingSpinner,
  },
  data() {
    return {
      graph: [
        {
          label_1: "",
          label_2: "",
          date: [],
          AllData_PH: [],
          AllData_EC: [],
        },
      ],
      btnShow_Value: false,

      // 그래프용
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "오전",
            data: [],
            fill: false,
            borderColor: "red",
            tension: 0.1,
            backgroundColor: "red",
            pointRadius: 3,
            borderWidth: 3,
            yAxisID: "y1",
          },
          {
            label: "오후",
            data: [],
            fill: false,
            borderColor: "blue",
            tension: 0.1,
            backgroundColor: "blue",
            pointRadius: 3, //점 크기
            borderWidth: 3, //라인굵기
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
            // beginAtZero: true,
            min: 0,
            max: 10,
            type: "linear",
            display: true,

            position: "left",
            title: {
              display: true,
              text: "",
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
            max: 10,
            title: {
              display: true,
              text: "",
            },
            grid: {
              drawOnChartArea: false, // only want the grid lines for one axis to show up
            },
          },
          x: {
            ticks: {
              autoSkip: true, // 👈
              maxTicksLimit: 10, // 👈
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
              x: { min: 0, max: 2e3, minRange: 10 },
              y: { min: 0, max: 100, minRange: 10 },
            },
          },
        },
      },
      // 그래프용

      // 레인지슬라이더
      min_ph: 4,
      min_ec: 0.3,
      max_ph: 8,
      max_ec: 2.5,
      range_ph: [4, 8],
      range_ec: [0.3, 2.5],
      // 레인지슬라이더
      DataValues: [],
      //   데이터테이블
      datas_header: [
        {
          text: "날짜",

          value: "inputDate",
        },
        { text: "오전/오후", value: "division" },
        { text: "ph", value: "ph" },
        { text: "ec", value: "ec" },

        { text: "메모", value: "memo" },
      ],
      datas: [],
      page: 1,
      totalData: 0,
      loading: false,
      itemsPerPage: 6,
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
      search_type_1: "육묘실",
      search_type_2: 1,

      search_list1: [
        {
          name: "육묘실",
          value: "육묘실",
        },
        {
          name: "발아실",
          value: "발아실",
        },
        {
          name: "활착실",
          value: "활착실",
        },
      ],
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

  // async mounted() {
  //   this.$nextTick(function () {
  //     this.BeforeWeeks();

  //     this.createChart();
  //   });
  // },

  mounted() {
    this.BeforeWeeks();

    // this.createChart();
  },

  watch: {
    options: {
      handler() {
        this.getWaterHistory();
      },
      deep: true,
    },
  },

  methods: {
    btnShow() {
      this.btnShow_Value = !this.btnShow_Value;
    },
    // 시작일을 일주일전으로
    BeforeWeeks() {
      let nowDate = new Date();
      let weekDate = nowDate.getTime() - 7 * 24 * 60 * 60 * 1000;
      nowDate.setTime(weekDate);

      let weekYear = nowDate.getFullYear();
      let weekMonth = nowDate.getMonth() + 1;
      let weekDay = nowDate.getDate();

      if (weekMonth < 10) {
        weekMonth = "0" + weekMonth;
      }
      if (weekDay < 10) {
        weekDay = "0" + weekDay;
      }

      let resultDate = weekYear + "-" + weekMonth + "-" + weekDay;
      this.s_date = resultDate;
      console.log(resultDate);
    },
    // 시작일을 일주일전으로
    // 그래프 그릴 용도 api

    getWaterECData() {
      this.isLoading = true;

      let item = {
        startDate: this.s_date,
        endDate: this.e_date,
        ec: this.range_ec,
        ph: this.range_ph,
      };
      api.smartfarm.getWaterpHECHistory(item).then((res) => {
        console.log("EC의 리스폰스 데이타", res);
        let AM = _.filter(res.data.responseData, { division: "오전" });

        let PM = _.filter(res.data.responseData, { division: "오후" });
        let inputDate = _.map(res.data.responseData, "inputDate");

        let AMPM_Result_PH = _.map(res.data.responseData, "ph");
        let AMPM_Result_EC = _.map(res.data.responseData, "ec");
        console.log("오전오후순서대로값", AMPM_Result_PH, AMPM_Result_EC);
        // 오전/오후 + inputData
        var PluseDivAndInputDate = [];

        for (var i = 0; i < res.data.responseData.length; i++) {
          PluseDivAndInputDate.push(
            res.data.responseData[i].inputDate +
              " " +
              res.data.responseData[i].division
          );
        }
        // // 소영선임님이 알려준신 nextTick
        // this.$nextTick(function () {
        //   this.createChart();
        // });
        this.isLoading = false;

        this.graph.AllData_PH = AMPM_Result_PH;
        this.graph.AllData_EC = AMPM_Result_EC;
        this.graph.date = PluseDivAndInputDate;
      });
    },
    // 데이터 테이블 만들 용도 api
    getWaterHistory() {
      this.getWaterECData();

      // getAmPm();
      this.loading = true;
      const { page, itemsPerPage, sortBy, sortDesc } = this.options;

      var item = {
        searchTarget: "ph",
        startDate: this.s_date,
        endDate: this.e_date,
        ec: this.range_ec,
        ph: this.range_ph,
        page: page,
        size: itemsPerPage, //보여주고싶은 행의개수
        sortBy: sortBy,
        sortDesc: sortDesc,
      };
      console.log("리퀘스트파라미터", item);
      api.smartfarm
        .waterECpHInfo(item)
        .then((res) => {
          console.log("통신후", res.data);
          console.log("통신후 데이타만있는거", res.data.responseData);
          this.loading = false; //로딩바
          this.datas = res.data.responseData;
          this.totalData = res.data.totalCount;
        })
        .catch((error) => {
          console.log("에러입니다.");

          console.log(error);
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
