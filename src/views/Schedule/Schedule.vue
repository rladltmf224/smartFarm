<template>
  <v-card elevation="0" class="ma-2">
    <v-tabs
      v-model="tab"
      align-with-title="align-with-title"
      background-color=""
    >
      <v-tabs-slider color="primary"></v-tabs-slider>

      <v-tab v-for="item in tabList" :key="item" @click="clickTab(item)">
        {{ item }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab"></v-tabs-items>

    <div v-show="this.selectedTabs == '타임라인'">
      <v-row class="mt-1 ml-5">
        <v-col cols="9">
          <span class="text-h10 todayFont">현재날짜 : {{ today }}</span>
        </v-col>
        <v-col cols="2" class="pa-0 mr-5">
          <v-select
            rounded
            dense
            color="success"
            v-model="selectedTimelineView"
            class="view-select"
            :items="timelineViewOptions"
            item-text="title"
            item-value="value"
            hide-details
          ></v-select>
        </v-col>

        <v-btn small color="success" class="mr-5" @click="resetZoom">
          <v-icon small>mdi mdi-reload</v-icon> 새로고침
        </v-btn>
      </v-row>
      <v-spacer></v-spacer>
      <div class="graphBox">
        <canvas ref="barChart" />
      </div>

      <v-card class="timelineBox elevation-0">
        <v-expansion-panels v-model="activePanel">
          <v-expansion-panel v-for="(item, index) in panels" :key="index">
            <v-expansion-panel-header
              color="#fdfdfd"
              class="elevation-0"
              @click="moreDetail(item)"
              vaule="index"
              dense
            >
              {{ item }}
            </v-expansion-panel-header>
            <v-expansion-panel-content class="elevation-0" color="#fdfdfd">
              <v-data-table
                style="background-color: #fdfdfd"
                dense
                :headers="timelineHeader"
                :items="timelineTable"
                disable-pagination
                hide-default-footer
              ></v-data-table>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card>
    </div>

    <div class="totalBox" v-show="this.selectedTabs == '달력'">
      <div class="filterBox">
        <v-btn-toggle
          v-model="toggle"
          color="success"
          class="filterBtnBox"
          divided
          multiple
          variant="outlined"
        >
          <v-btn
            small
            color="success"
            text
            dark
            class="mb-2 addBtn"
            @click="openModal"
          >
            <v-icon color="success">mdi-plus</v-icon>일정 추가
          </v-btn>

          <v-btn
            small
            v-for="(item, i) in this.filterList"
            :key="i"
            :value="item"
            :color="toggle.length == 0 && i == 0 ? 'success' : ''"
            :disabled="item.dateDiff == null && item.customId != ''"
            active-color="success"
            rounded
            class="mb-2"
            >{{ item.customName }}
          </v-btn>
          <!--        
           :disabled="item.dateDiff == null"
            :style="[toggle.length == 0 ? testGroup : null]"
          @click="getSchedule(item.customerId)"-->
        </v-btn-toggle>
      </div>
      <div class="calendarBox">
        <v-row class="mt-2">
          <v-col cols="4" justify="left">
            <span class="text-h4">{{ dateRangeText }}</span>
          </v-col>
          <v-col cols="3" justify="right">
            <v-select
              rounded
              dense
              color="success"
              v-model="selectedView"
              class="view-select"
              :items="viewOptions"
              item-text="title"
              item-value="value"
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="4" justify="right">
            <v-btn
              class="ml-1 changeBtn"
              rounded
              text
              color="success"
              @click="onClickTodayButton"
              >Today</v-btn
            >
            <v-btn
              class="ml-1 changeBtn"
              rounded
              text
              color="success"
              @click="onClickMoveButton(-1)"
              >Prev</v-btn
            >
            <v-btn
              class="ml-1 changeBtn"
              rounded
              text
              color="success"
              @click="onClickMoveButton(1)"
              >Next</v-btn
            >
          </v-col>
        </v-row>

        <Calendar
          :usageStatistics="false"
          ref="calendar"
          class="calendarBox"
          :view="view"
          :use-detail-popup="false"
          :use-form-popup="false"
          :week="week"
          :month="month"
          :events="events"
          isReadOnly
          @beforeUpdateEvent="onBeforeUpdateEvent"
          @clickEvent="onClickSchedule"
          @clickDayName="onClickDayName"
          @clickTimezonesCollapseBtn="onClickTimezonesCollapseBtn"
          :template="{
            allday: getTemplateForAllday,
          }"
        />
      </div>
    </div>
    <ScheduleAddModal
      :open="chooseDialog"
      :totalEvents="totalEvents"
      @closeModal="closeModal_schedule"
    >
    </ScheduleAddModal>
    <ScheduleDetailModal
      :x="x"
      :y="y"
      :open="detailMenu"
      :historyOn="openHistory"
      :title="title"
      :backgroundColor="backgroundColor"
      :detail="detailEvent"
      :id="historyId"
      @closeModal="closeMenu_schedule"
    >
    </ScheduleDetailModal>
    <!-- 일정 히스토리
    <v-menu
      :position-x="x"
      :position-y="y"
      absolute
      v-model="historyMenu"
      :close-on-content-click="false"
    >
    </v-menu> -->
  </v-card>
</template>

<script lang="ts">
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  TimeScale,
  LinearScale,
  registerables,
} from "chart.js";

import ScheduleAddModal from "./ScheduleAddModal.vue";
import ScheduleDetailModal from "./ScheduleDetailModal.vue";
import zoomPlugin from "chartjs-plugin-zoom";
import annotationPlugin from "chartjs-plugin-annotation";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "chartjs-adapter-date-fns";
import { Component, Watch, Vue } from "vue-property-decorator";
import Calendar from "@toast-ui/vue-calendar";
import "@toast-ui/calendar/dist/toastui-calendar.min.css";
import * as api from "@/api";
import cfg from "./config";
import _ from "lodash";
//import { faPersonMilitaryRifle } from "@fortawesome/free-solid-svg-icons";
//import { colors } from "vuetify/lib";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  TimeScale,
  LinearScale,
  annotationPlugin,
  zoomPlugin,
  ...registerables,
  ChartDataLabels
);
var chart: any;
@Component({
  components: {
    Calendar,
    ScheduleAddModal,
    ScheduleDetailModal,
    //Bar,
  },
})
export default class Schedule extends Vue {
  $refs!: {
    calendar: HTMLFormElement;
    updateStartDate: HTMLFormElement;
    updateEndDate: HTMLFormElement;
    barChart: HTMLCanvasElement;
  };
  today: string = ""; //현재날짜
  selectedTabs: string = "달력";
  tab: any = null;
  chart: string = "";
  chartData: any = {
    data: {
      labels: [],
      datasets: [
        {
          type: "bar",
          axis: "y",
          label: "",
          //thickness: 7,
          borderWidth: 1,
          borderSkipped: false,
          borderRadius: 20,
          borderColor: "#e7e7e7",
          backgroundColor: "#ffffff",
          data: [],
          order: 2,

          //pointStyle:"rectRounded"
          datalabels: {
            display: false, //true: 겹침 , auto: 데이터 인덱스가 가장 높은 레이블이 숨겨짐
            color: "black",
            align: "right",
            offset: -30,
            //align: "bottom",
            //offset: 20,
            font: {
              weight: "bold",
              size: "12",
            },

            formatter: (value: any) => {
              return value.t + "\n" + value.c;
            },
          },
        },
        {
          type: "bar",
          axis: "y",
          label: "",
          //thickness: 7,
          borderWidth: 1,
          borderSkipped: false,
          borderRadius: 20,
          data: [],
          order: 1,
          backgroundColor: "",
          //pointStyle:"rectRounded"
          datalabels: {
            display: true, //true: 겹침 , auto: 데이터 인덱스가 가장 높은 레이블이 숨겨짐
            color: "black",

            font: {
              weight: "bold",
              size: "10",
            },

            formatter: (value: any) => {
              return value.l + "\n" + value.c + "(" + value.v + ")";
              //return value.l;
            },
          },
        },

        {
          type: "bubble",
          axis: "y",
          pointStyle: "rectRounded",
          label: "",
          data: [],
          borderWidth: 2,
          radius: 20,
          backgroundColor: "",
          order: 1,
          datalabels: {
            display: true, //true: 겹침 , auto: 데이터 인덱스가 가장 높은 레이블이 숨겨짐
            color: "black",
            align: "right",
            offset: -10,
            font: {
              weight: "bold",
              size: "10",
            },
            formatter: (value: any) => {
              return value.l + "\n" + value.c + "(" + value.v + ")";
            },
          },
        },
      ],
    },
    options: {
      onClick: (event: any, elements: any) => {
        let item = elements[0].index;
        this.deleteTotalInfo(item);
      },
      minBarThickness: 15, //Bar 두께
      maxBarThickness: 30, //Bar 두께
      indexAxis: "y",
      scales: {
        xAxis: {
          min: "",
          max: "",
          beginAtZero: true,
          autoSkip: false,
          maxTicksLimit: 6,
          type: "time",
          grid: {
            display: true,
          },

          time: {
            parser: "yyyy-MM-dd",
            unit: "day",
            displayFormats: {
              year: "yyyy",
              month: "yyyy-MM",
              day: "yyyy-MM-dd",
              quarter: "YYYY-MM-DD",
            },
          },
          ticks: {
            source: "ticks",
            autoSkip: false,
            beginAtZero: true, //0부터 시작하는지.
            offset: false,
            // maxTicksLimit: 10,
          },
        },

        yAxes: {
          display: false,
          stacked: true,
          grid: {
            display: false,
          },
        },
      },
      plugins: {
        decimation: 30,
        annotation: {
          annotations: [
            {
              drawTime: "afterDatasetsDraw",
              type: "line",
              mode: "vertical",
              xMin: new Date().toISOString().substr(0, 10),
              xMax: new Date().toISOString().substr(0, 10),
              borderWidth: 2,
              borderColor: "#ff7b7b",
              borderDash: [5, 5],
              label: {
                borderColor: "red",
                content: "TODAY",
                enabled: true,
              },
            },
          ],
        },

        zoom: {
          zoom: {
            pinch: {
              enabled: true,
            },
            wheel: {
              enabled: false,
              speed: 0.1,
            },
            drag: {
              enabled: false,
            },
            sensitivity: 0.5,
            mode: "x",
          },
          pan: {
            enabled: true,
            mode: "x",
          },
        },

        legend: {
          display: false, // 라벨 숨기기
          labels: {
            padding: 3, // 범례간의 간격
          },
        },

        tooltip: {
          backgroundColor: "#FAFAFA",
          borderColor: "lightgreen",
          borderWidth: 1,
          bodyColor: "black",
          titleColor: "black",
          titleFontColor: "black",
          titleFontStyle: "normal",
          displayColors: false,
          bodyFontColor: "black",
          boxWidth: 15,
          callbacks: {
            label: function (tooltipItem: any) {
              if (tooltipItem.raw["x"].length == 2) {
                return (tooltipItem.formattedValue = `회사명 : ${tooltipItem.raw["t"]} 작물정보 : ${tooltipItem.raw["c"]} ,  일정기간 : ${tooltipItem.raw["x"][0]} ~ ${tooltipItem.raw["x"][1]}`);
              } else {
                return (tooltipItem.formattedValue = `회사명 : ${tooltipItem.raw["t"]} 작물정보 : ${tooltipItem.raw["c"]} ,  일정기간 : ${tooltipItem.raw["x"]}`);
              }
            },
          },
        },
      },
      responsive: true, //container에 맞게 조정되는 옵션
      maintainAspectRatio: false, //그래프의 비율 유지s
    },
  };
  selectedTimelineView: string = "day";
  activePanel: any = null;
  panels: any[] = [];
  groupBy: any[] = [];
  expanded: any[] = [];
  timelineTableList: any[] = [];
  filterList: any[] = []; //[response] 전체 거래처 데이터(filter용)
  events: any[] = []; //[response] 전체 일정 데이터
  totalEvents: any[] = []; //[response] 전체 일정 데이터
  timelineList: any[] = []; //[response] 전체 타임라인 데이터
  customerList: any[] = []; //[response] 전체 거래처 데이터
  toggle: any[] = [];
  openHistory: boolean = false;
  calendarText: string = ""; //toast v-model개념
  detailMenu: boolean = false; //상세보기 menu v-model
  chooseDialog: boolean = false; //일정추가 (신규  or 추가) Dialog
  //historyMenu: boolean = false; //히스토리 menu v-model

  //ScheduleDetailModal에게 보내지는 데이터
  x: number = 0;
  y: number = 0;
  title: string = ""; //상세보기 Title
  backgroundColor = ""; //상세보기 색상표
  detailEvent: any[] = []; //상세보기 일정
  historyId: number = 0;
  //tost ui 관련 옵션
  dateRangeText: string = ""; //달력 날짜
  selectedView: string = "month";
  view: string = "month";
  week: any = {
    dayNames: ["일", "월", "화", "수", "목", "금", "토"],
    taskView: false,
    eventView: true,
  };
  month: any = {
    dayNames: ["일", "월", "화", "수", "목", "금", "토"],
    visibleEventCount: 10,
    //visibleWeeksCount: 5, //보여줄 주단위
  };

  get calendarInstance() {
    //'GetInstance'는 호출 값을 한 번만 제공합니다.
    // 두 번 이상 호출하면 'null'을 호출하기 때문에 오류가 발생합니다.
    return this.$refs.calendar.getInstance();
  }

  get timelineTable() {
    return this.timelineTableList;
  }

  get tabList() {
    return cfg.data.tabList;
  }

  get timelineViewOptions() {
    return cfg.data.timelineViewOptions;
  }

  get timelineHeader() {
    return cfg.header.timelineHeader;
  }

  get viewOptions() {
    return cfg.data.viewOptions;
  }

  @Watch("toggle")
  changeBtn() {
    console.log("toggle도는 횟수");
    //let tempTotal = JSON.parse(JSON.stringify(this.totalEvents));
    let tempId: any = [];

    this.toggle.forEach((data: any) => {
      tempId.push(data.customId);
    });
    var total = tempId.find((e: any) => e === "");

    if (total == undefined) {
      if (this.toggle.length != 0 && tempId.length != 0) {
        this.getSchedule(tempId);
      } else {
        this.getSchedule([]);
      }
    } else {
      this.getSchedule([]);
    }
    tempId = [];
  }

  /*
    if (
      this.toggle.length == 0 ||
      (this.toggle.length == 1 && this.toggle[0].customId == "")
    ) {
      console.log("2");
      this.getSchedule([]);
      this.getFilter();
    } else {
      if (total != undefined) {
        this.toggle = [];
        tempId = [];
      }
      console.log("3");
      this.getSchedule(tempId);
      */
  /*
      else {
        tempTotal.forEach((value: any) => {
          tempId.forEach((value_detail: any) => {
            if (value.customerId == value_detail) {
              value.details.forEach((detail: any) => {
                this.events.push(detail);
              });
            }
          });
        });
      }
      */

  @Watch("selectedView")
  changeOptions(newView: any) {
    this.calendarInstance.changeView(newView);
    this.setDateRangeText();
  }

  @Watch("selectedTimelineView")
  changeTimelineOptions() {
    if (this.selectedTimelineView == "month") {
      this.chartData.options.scales.xAxis.time.unit = "month";
      this.chartData.data["datasets"][0].datalabels.display = true;
      //데이터 안보이도록 설정
      this.chartData.data["datasets"][1].data = [];
      this.chartData.data["datasets"][2].data = [];
      this.getmonthDate();
      chart.resize();
    } else {
      this.chartData.options.scales.xAxis.time.unit = "day";
      this.chartData.data["datasets"][0].datalabels.display = false;
      this.getTotalSchedule();
    }
  }

  mounted() {
    this.setDateRangeText();
    //this.getCustomer();
    this.getFilter();
    this.getSchedule([]);
  }

  resetZoom() {
    chart.resetZoom();
  }

  getdayDate() {
    const now = new Date();
    const day = now.getDate();

    this.chartData.options.scales.xAxis.min = new Date(
      //new Date().setDate(day - 5)
      new Date().setDate(day - 3)
    )
      .toISOString()
      .substr(0, 10);
    this.chartData.options.scales.xAxis.max = new Date(
      //new Date().setDate(day + 7)
      new Date().setDate(day + 4)
    )
      .toISOString()
      .substr(0, 10);
  }

  getmonthDate() {
    const now = new Date();
    const month = now.getMonth();

    this.chartData.options.scales.xAxis.time.unit = "month";
    this.chartData.options.scales.xAxis.min = new Date(
      //new Date().setMonth(month - 4)
      new Date().setMonth(month - 2)
    )
      .toISOString()
      .substr(0, 10);
    this.chartData.options.scales.xAxis.max = new Date(
      //new Date().setMonth(month + 9)
      new Date().setMonth(month + 5)
    )
      .toISOString()
      .substr(0, 10);
  }

  //전체 타임라인List
  async getTotalSchedule() {
    this.timelineList = [];
    let searchItem = {
      customerId: [],
    };
    let yArea = new Set();
    let groupList = new Set();
    let oneDayColor: any = [];
    let oneDayData: any = [];
    let scheduleData: any = [];
    let scheduleColor: any = [];

    this.today = new Date()
      .toISOString()
      .substr(0, 10)
      .replace("-", "년")
      .replace("-", "월")
      .concat("일");

    //일정별 전체 기간 일정은 바차트로
    api.schedule.getScheduleInfo(searchItem).then((response) => {
      response.data.responseData.forEach((value: any) => {
        this.selectedTimelineView = "day";
        value.details.forEach((value_detail: any) => {
          value_detail["cropName"] = value.cropName;
          value_detail["varietyName"] = value.varietyName;
          value_detail["backgroundColor"] = value.backgroundColor;
          value_detail["customerName"] = value.customerName;
          value_detail["workScheduleId"] = value.workScheduleId;
          value_detail["customerId"] = value.customerId;
          value_detail[
            "id"
          ] = `${value.customerId}-${value_detail.workScheduleId}`; //toast 일정데이터 선별하기 임의데이터 사용
          yArea.add(`${value.customerId}-${value_detail.workScheduleId}`);

          if (value_detail.start != value_detail.end) {
            scheduleData.push({
              x: [value_detail.start, value_detail.end],
              y: value_detail.id,
              t: value_detail.customerName,
              l: `[${value.customerName}]${value_detail.title}`,
              c: value_detail.cropName,
              v: value_detail.varietyName,
            });
            scheduleColor.push(value_detail.backgroundColor);
          } else {
            if (
              _.filter(oneDayData, {
                x: value_detail.start,
                y: value_detail.id,
              }).length == 0
            ) {
              oneDayData.push({
                x: value_detail.start,
                y: value_detail.id,
                t: value_detail.customerName,
                l: `[${value.customerName}]${value_detail.title}`,
                c: value.cropName,
                v: value.varietyName,
                //r: 15,
                r: 15,
              });
              oneDayColor.push(value_detail.backgroundColor);
            } else {
              oneDayData.forEach((data: any) => {
                if (
                  data.x == value_detail.start &&
                  data.y == value_detail.id &&
                  data.c == value_detail.cropName &&
                  data.v == value_detail.varietyName
                ) {
                  data.l = data.l.concat(
                    "," +
                      value_detail.title.replace(
                        value_detail.customerName + "-",
                        " "
                      )
                  );
                }
              });
            }
          }
        });
      });

      api.schedule.getTotalScheduleInfo().then((response) => {
        response.data.responseData.forEach((value: any) => {
          groupList.add(value.customerName);
          this.timelineList.push({
            x: [value.start, value.end],
            w: value.workScheduleId,
            y: `${value.customerId}-${value.workScheduleId}`,
            t: value.customerName,
            c: `${value.cropName}(${value.varietyName})`,
          });
        });
        this.panels = Array.from(groupList);
      });

      this.chartData.data["labels"] = Array.from(yArea);
      this.chartData.data["datasets"][0].data = this.timelineList;
      this.chartData.data["datasets"][1].data = scheduleData;
      this.chartData.data["datasets"][1].backgroundColor = scheduleColor;
      this.chartData.data["datasets"][2].data = oneDayData;
      this.chartData.data["datasets"][2].backgroundColor = oneDayColor;
      this.getdayDate();

      //createGraph 함수
      return new Promise((resolve) => {
        if (chart !== undefined) {
          chart.destroy();
        }

        chart = new ChartJS(this.$refs.barChart, {
          type: "bar",
          data: this.chartData.data,
          options: this.chartData.options,
        });

        chart.canvas.parentNode.style.height = "400px";
        chart.canvas.style.backgroundColor = "#fdfdfd";
        chart.resize();

        resolve(chart);
      });
    });

    console.group("getTotalSchedule");
    console.log("getTotalSchedule", this.timelineList);
    console.groupEnd();
  }

  getFilter() {
    //let resetArray: any = [];
    this.filterList = [];
    this.filterList = [{ customName: "전체 일정", customId: "" }];
    console.log("getFilter()", this.filterList);
    api.schedule.getFilterCustomer().then((response) => {
      response.data.responseData.forEach((data: any) => {
        this.filterList.push(data);
      });
    });

    console.log("최종 버전", this.filterList);
  }
  //전체 거래List
  /*
  getCustomer() {
    api.schedule.getCustomerInfo().then((response) => {
      this.customerList = response.data.responseData;

      console.group("getCustomer");
      console.log("getCustomer", this.customerList);
      console.groupEnd();
    });
  }
  */

  //전체 일정List
  getSchedule(item: any) {
    this.totalEvents = [];
    this.events = [];
    let searchItem = {
      customList: [],
    };
    searchItem.customList = item;

    api.schedule.getScheduleInfo(searchItem).then((response) => {
      this.totalEvents = response.data.responseData;

      response.data.responseData.forEach((value: any) => {
        value.details.forEach((detailVAlue: any) => {
          detailVAlue["customerName"] = value.customerName;
          detailVAlue["category"] = "allday";
          detailVAlue["isAllDay"] = "true";
          detailVAlue["cropName"] = value.cropName;
          detailVAlue["varietyName"] = value.varietyName;
          detailVAlue["backgroundColor"] = value.backgroundColor;

          detailVAlue[
            "id"
          ] = `${value.customerId}-${detailVAlue.workScheduleDetailId}`; //toast 일정데이터 선별하기 임의데이터 사용
          this.events.push(detailVAlue);
          //this.timelineTableList.push(detailVAlue);
        });
      });

      /*
      this.totalEvents.forEach((value: any) => {
        if (
          value.details.length != 0 &&
          _.filter(this.filterList, {
            customerName: value.customerName,
            customerId: value.customerId,
          }).length == 0
        ) {
          this.filterList.push({
            customerName: value.customerName,
            customerId: value.customerId,
          });
        }
      });
      */

      console.group("getSchedule");
      console.log("getSchedule", this.events);
      console.groupEnd();
    });

    console.log("-- 최종 events--", this.events);
  }

  //일정표에 표시되는 년월
  setDateRangeText() {
    const date = this.calendarInstance.getDate();
    const start = this.calendarInstance.getDateRangeStart();
    const end = this.calendarInstance.getDateRangeEnd();

    const startYear = start.getFullYear();
    const endYear = end.getFullYear();

    switch (this.selectedView) {
      case "month":
        this.dateRangeText = `${date.getFullYear()}년${date.getMonth() + 1}월`;

        return;
      case "day":
        this.dateRangeText = `${date.getFullYear()}년${
          date.getMonth() + 1
        }월${date.getDate()}일`;

        return;
      default:
        this.dateRangeText = `${startYear}년${
          start.getMonth() + 1
        }월${start.getDate()}일 - ${
          startYear !== endYear ? `${endYear}.` : ""
        }${end.getMonth() + 1}월${end.getDate()}일`;
    }
  }
  //일정 title 커스텀
  getTemplateForAllday(event: any) {
    this.events.forEach((value: any) => {
      if (value.id == event.id) {
        event["customerName"] = value.customerName;
        event["commentCount"] = value.commentCount;
      }
    });

    return event.commentCount != 0
      ? `[${event.customerName}]${event.title} (${event.commentCount})`
      : `[${event.customerName}]${event.title}`;
  }

  //month에서 일정표 늘릴 수있는 옵션
  onClickTimezonesCollapseBtn() {
    const newTheme = {
      "week.daygridLeft.width": "100px",
      "week.timegridLeft.width": "100px",
    };

    this.calendarInstance.setTheme(newTheme);
  }

  onBeforeUpdateEvent(updateData: any) {
    console.log("onBeforeUpdateEvent", updateData);
  }
  onClickDayName(date: object) {
    console.group("onClickDayName");
    console.log("Date : ", date);
    console.groupEnd();
  }

  //update 일정
  onClickSchedule(event: any) {
    console.log("1");
    //상세일정 일정옆에 띄우기
    this.x = event.nativeEvent.pageX;
    this.y = event.nativeEvent.pageY;
    this.detailEvent = [];

    //상세일정관련 데이터들
    this.detailMenu = true;
    //this.openHistory = false;

    this.events.forEach((value: any) => {
      if (value.id == event.event.id) {
        this.title = `[${value.customerName}] ${value.title} `;
        this.backgroundColor = value.backgroundColor;
        this.detailEvent.push(value);
        console.log("----", this.detailEvent);
        this.historyId = this.detailEvent[0].workScheduleDetailId;
      }
    });
    //this.getTotalComment();
  }

  //TODAY 버튼 이벤트
  onClickTodayButton() {
    this.calendarInstance.today();
    this.setDateRangeText();
  }
  //PREV,NEXT 버튼 이벤트
  onClickMoveButton(offset: any) {
    this.calendarInstance.move(offset);
    this.setDateRangeText();
  }

  openModal() {
    this.chooseDialog = true;
  }

  clickTab(item: any) {
    this.selectedTabs = item;

    if (this.selectedTabs == "달력") {
      this.getSchedule([]);
    } else {
      this.getTotalSchedule();
    }
  }
  deleteTotalInfo(item: any) {
    let deleteItem = 0;
    deleteItem = this.timelineList[item].w;

    this.$swal
      .fire({
        title: "삭제",
        text: "해당 데이터를 삭제하시겠습니까?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "삭제",
      })
      .then((result) => {
        if (result.isConfirmed) {
          api.schedule
            .deleteTotalScheduleInfo(deleteItem)
            .then((response) => {
              if (response.status == 200) {
                this.$swal({
                  title: "삭제되었습니다.",
                  icon: "success",
                  position: "top",
                  showCancelButton: false,
                  showConfirmButton: false,
                  toast: true,
                  timer: 1500,
                });
              } else {
                this.$swal({
                  title: "삭제가 실패되었습니다.",
                  icon: "error",
                  position: "top",
                  showCancelButton: false,
                  showConfirmButton: false,
                  toast: true,
                  timer: 1500,
                });
              }
              //일정 데이터 불러오기
              this.getTotalSchedule();
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });
  }

  /*
  back(item: any) {
    //this.historyMenu = false;
    this.detailMenu = true;
    this.events.forEach((value: any) => {
      if (value.id == item) {
        this.title = `[${value.customerName}] ${value.title} `;
        this.backgroundColor = value.backgroundColor;
        this.detailEvent.push(value);
      }
    });
  }


  openModalHistory(item: any) {
    this.detailMenu = false;
    //this.historyMenu = true;
    this.historyId = item;
    this.getTotalComment();
  }
  */
  moreDetail(item: any) {
    this.timelineTableList = [];

    this.events.forEach((value: any) => {
      if (item == value.customerName) {
        this.timelineTableList.push(value);
      }
    });
  }

  closeModal_schedule() {
    this.chooseDialog = false;
    this.getSchedule([]);
    this.getFilter();
    //this.getSchedule([]);
    //this.getTotalSchedule();
  }
  closeMenu_schedule() {
    console.log("1");
    this.detailMenu = false;
    console.log("2");
    this.getSchedule([]);
    console.log("3");
    this.getFilter();
    //this.getTotalSchedule();
  }
}
</script>
<style src="./Schedule.scss" lang="scss"></style>
