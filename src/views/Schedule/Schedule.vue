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

    <div v-if="this.selectedTabs == '타임라인'">
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
      <v-data-table
        class="mt-4"
        dense
        height="350"
        :items="timelineTable"
        :headers="timelineHeader"
      >
      </v-data-table>
    </div>

    <div class="totalBox" v-if="this.selectedTabs == '달력'">
      <div class="filterBox">
        <v-btn-toggle
          v-model="toggle"
          color="success"
          class="filterBtnBox"
          divided
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
            @click="getSchedule(item.customerId)"
            active-color="success"
            rounded
            class="mb-2"
            >{{ item.customerName }}
          </v-btn>
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
    <!-- 일정 추가 Dialog -->
    <v-dialog v-model="dialog" width="600px">
      <v-card>
        <v-card-title class="mx-2">일정추가</v-card-title>
        <v-card-text>
          <v-row class="mx-2">
            <v-col cols="4" fluid>
              <v-autocomplete
                dense
                class="highlightFont"
                label="회사명"
                v-model="scheduleData.customer"
                return-object
                :items="customerList"
                item-text="customerName"
                item-value="customerId"
              ></v-autocomplete>
            </v-col>
            <v-col cols="4" class="p-2">
              <v-text-field
                dense
                class="highlightFont"
                placeholder="* 작물명"
                v-model="scheduleData.type"
              />
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="4" class="p-2">
              <v-text-field
                dense
                v-model="scheduleData.backgroundColor"
                v-mask="mask"
                hide-details
                class="ma-0 pa-0 colorBox"
                solo
              >
                <template v-slot:append>
                  <v-menu
                    v-model="menu"
                    top
                    nudge-bottom="105"
                    nudge-left="16"
                    :close-on-content-click="false"
                  >
                    <template v-slot:activator="{ on }">
                      <div :style="swatchStyle" v-on="on" />
                    </template>
                    <v-card>
                      <v-card-text class="pa-0">
                        <v-color-picker
                          v-model="scheduleData.backgroundColor"
                          flat
                        />
                      </v-card-text>
                    </v-card>
                  </v-menu>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
          <v-row class="mx-2">
            <v-col cols="12" class="pt-0 pb-0">
              <v-text-field
                dense
                placeholder="비고"
                v-model="scheduleData.memo"
              />
            </v-col>
          </v-row>
          <!-- 그 외 일정 추가 -->
          <v-row justify="center" class="ma-0">
            <v-checkbox
              @click="addCalendar"
              v-model="selected"
              label="그 외 일정추가"
              class="float-center"
            ></v-checkbox>
          </v-row>
          <v-row
            v-show="selected"
            v-for="(item, index) in secondTitleList"
            :key="index"
            class="dateBox"
          >
            <v-col cols="4" class="pa-0">
              <v-text-field
                v-model="item.title"
                dense
                filled
                rounded
                hide-details
                :style="[item.date != '' ? colorGroup : null]"
              >
              </v-text-field>
            </v-col>
            <v-col cols="4" class="pt-0">
              <v-menu
                :key="item.date"
                dense
                ref="secondStartDate"
                :close-on-content-click="false"
                :return-value.sync="item.date"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    dense
                    v-model="item.date"
                    class="highlightFont"
                    label="일정"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="item.date"
                  no-title
                  scrollable
                  locale="ko-KR"
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="menu = false">
                    취소
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="ss_date_search(item.date)"
                  >
                    확인
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="2" class="pt-0">
              <v-btn
                icon
                color="success"
                @click="add"
                v-show="item.title != '' && item.date != ''"
                ><v-icon small>mdi-plus </v-icon></v-btn
              ></v-col
            >
          </v-row>
          <v-row
            v-show="!selected"
            v-model="titleList"
            v-for="n in titleList"
            class="dateBox"
            :key="n.title"
          >
            <!--:class="{ active: n.date != '' }" //:style="{ backgroundColor:
              scheduleData.backgroundColor }"-->
            <v-col cols="4" class="pa-0">
              <v-text-field
                :value="n.title"
                :readonly="n.title != ''"
                dense
                filled
                rounded
                hide-details
                :style="[n.date != '' ? colorGroup : null]"
              >
                {{ n.title }}</v-text-field
              >
            </v-col>
            <v-col cols="4" class="pt-0">
              <v-menu
                :key="n.date"
                dense
                ref="startDate"
                :close-on-content-click="false"
                :return-value.sync="n.date"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    dense
                    v-model="n.date"
                    class="highlightFont"
                    label="일정"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="n.date"
                  no-title
                  scrollable
                  locale="ko-KR"
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="menu = false">
                    취소
                  </v-btn>
                  <v-btn text color="primary" @click="s_date_search(n.date)">
                    확인
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="success" @click="saveInfo">저장</v-btn>
          <v-btn text color="success" @click="closeModal">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 일정 상세보기 -->
    <v-menu
      :position-x="x"
      :position-y="y"
      absolute
      v-model="detailMenu"
      :close-on-content-click="false"
    >
      <v-card class="menuBox">
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-row class="pt-2">
                <v-col cols="9" class="pt-0">
                  <v-list-item-title
                    ><strong>{{
                      this.detailEvent == "" ? "없음" : title
                    }}</strong></v-list-item-title
                  ></v-col
                >
                <v-col cols="6" class="pt-0">
                  <v-list-item-subtitle v-show="!update">{{
                    this.detailEvent == "" ? "일정없음" : detailEvent[0].start
                  }}</v-list-item-subtitle>
                  <v-list-item-subtitle v-show="update"
                    ><v-menu
                      dense
                      ref="updateDate"
                      v-model="menu_update_date"
                      :close-on-content-click="false"
                      :return-value.sync="updateDate"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          dense
                          v-model="updateDate"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="updateDate"
                        no-title
                        scrollable
                        locale="ko-KR"
                      >
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="menu = false">
                          취소
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="u_date_search(updateDate)"
                        >
                          확인
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-list-item-subtitle></v-col
                ></v-row
              >
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle class="mb-3">
                <v-icon right large dense class="mr-10"> mdi mdi-sprout</v-icon>
                <span
                  ><strong>{{
                    this.detailEvent == "" ? "타입없음" : detailEvent[0].type
                  }}</strong></span
                >
              </v-list-item-subtitle>
              <v-list-item-subtitle class="mb-3">
                <v-icon right large dense class="mr-10">
                  mdi-note-edit-outline
                </v-icon>
                <span
                  ><strong>{{
                    this.detailEvent == "" ? "메모없음" : detailEvent[0].memo
                  }}</strong></span
                >
              </v-list-item-subtitle>
              <v-list-item-subtitle class="mb-5 outBox">
                <v-icon right large dense class="mr-10"> mdi-account </v-icon>
                <div class="innerTextBox">
                  <span
                    ><strong
                      >등록자 :
                      {{
                        this.detailEvent == ""
                          ? "등록자없음"
                          : `${detailEvent[0].createdId} : ${detailEvent[0].createdDate}`
                      }}
                    </strong> </span
                  ><br />
                  <span>
                    <strong
                      >수정자 :
                      {{
                        this.detailEvent == ""
                          ? "수정자없음"
                          : `${detailEvent[0].modifiedId} : ${detailEvent[0].modifiedDate}`
                      }}</strong
                    >
                  </span>
                </div>
                <v-spacer></v-spacer>
              </v-list-item-subtitle>
              <v-list-item-subtitle class="mb-3 outBox">
                <v-icon right large dense class="mr-10"> mdi-palette </v-icon>
                <strong>{{
                  this.detailEvent == ""
                    ? "색상표 없음"
                    : detailEvent[0].backgroundColor
                }}</strong>
                <div class="innerBox" :style="swatchdetailStyle"></div>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider class="t-3"></v-divider>

        <v-card-actions>
          <v-row justify="center" class="ma-0"
            ><v-btn v-show="!update" text @click="updateStatus" class="ma-1">
              <v-icon color="success" right class="mr-1"> mdi-pencil </v-icon>
              수정
            </v-btn>
            <v-btn v-show="update" text @click="updateInfo" class="ma-1">
              <v-icon color="success" right class="mr-1">
                mdi-content-save-edit
              </v-icon>
              저장
            </v-btn>
            <v-divider vertical class="ma-1"></v-divider>
            <v-btn text class="ma-1" @click="deleteInfo">
              <v-icon right dark class="mr-1"> mdi-delete </v-icon>삭제
            </v-btn></v-row
          >
        </v-card-actions>
      </v-card>
    </v-menu>
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

import zoomPlugin from "chartjs-plugin-zoom";
import annotationPlugin from "chartjs-plugin-annotation";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "chartjs-adapter-date-fns";
import { Component, Watch, Vue } from "vue-property-decorator";
import Calendar from "@toast-ui/vue-calendar";
import "@toast-ui/calendar/dist/toastui-calendar.min.css";
import * as api from "@/api";

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
    //Bar,
  },
})
export default class Schedule extends Vue {
  $refs!: {
    calendar: HTMLFormElement;
    startDate: HTMLFormElement;
    secondStartDate: HTMLFormElement;
    updateDate: HTMLFormElement;
    barChart: HTMLCanvasElement;
  };
  today: string = ""; //현재날짜
  selectedTabs: string = "달력";
  tab: any = null;
  tabList: any = ["달력", "타임라인"];
  chart: string = "";
  chartData: any = {
    data: {
      labels: [],
      datasets: [
        {
          type: "bar",
          axis: "y",
          label: "",
          backgroundColor: [],
          borderWidth: 1,
          borderSkipped: false,
          borderRadius: 20,
          data: [],
        },
        {
          type: "bubble",
          label: "",
          data: [],
          backgroundColor: "[]",
        },
      ],
    },
    options: {
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
          },

          limits: {},
        },

        legend: {
          display: false, // 라벨 숨기기
          labels: {
            padding: 3, // 범례간의 간격
          },
        },

        datalabels: {
          display: true,
          color: "black",
          font: {
            weight: "bold",
            size: "12",
          },

          formatter: (value: any) => {
            return value.y;
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
                return (tooltipItem.formattedValue = `${tooltipItem.raw["x"][0]} ~ ${tooltipItem.raw["x"][1]}`);
              } else {
                return (tooltipItem.formattedValue = `${tooltipItem.raw["x"]}`);
              }
            },
          },
        },
      },
      responsive: true, //container에 맞게 조정되는 옵션
      maintainAspectRatio: false, //그래프의 비율 유지
    },
  };
  selectedTimelineView: string = "month";
  timelineViewOptions: any = [
    {
      title: "Monthly",
      value: "month",
    },
    {
      title: "Day",
      value: "day",
    },
  ];
  timelineTableList: any[] = [];
  timelineHeader: any = [
    { text: "일정명", value: "title" },
    { text: "타입", value: "type" },
    { text: "일정", value: "start" },
    { text: "생성자", value: "createdId" },
    { text: "생성일", value: "createdDate" },
    { text: "수정자", value: "modifiedId" },
    { text: "수정일", value: "modifiedDate" },
    { text: "비고", value: "memo" },
  ];
  filterList: any[] = []; //[response] 전체 거래처 데이터(filter용)
  customerList: any[] = []; //[response] 전체 거래처 데이터
  events: any[] = []; //[response] 전체 일정 데이터
  timelineList: any[] = []; //[response] 전체 타임라인 데이터
  secondTitleList: any = [{ title: "", date: "" }]; //그 외 일정 v-model
  titleList: any = [
    {
      title: "파종",
      date: "",
    },
    {
      title: "1차육묘",
      date: "",
    },
    {
      title: "접목",
      date: "",
    },
    {
      title: "2차육묘",
      date: "",
    },
    {
      title: "납품",
      date: "",
    },
  ];
  resettypeData: any = [
    //resetDATA
    {
      title: "파종",
      date: "",
    },
    {
      title: "1차육묘",
      date: "",
    },
    {
      title: "접목",
      date: "",
    },
    {
      title: "2차육묘",
      date: "",
    },
    {
      title: "납품",
      date: "",
    },
  ];
  //[등록,수정,삭제]기능관련 DATA
  scheduleData: any = {
    title: "",
    customer: "",
    type: "",
    backgroundColor: "#4caf50",
    memo: "",
  };
  x: number = 0;
  y: number = 0;
  calendarText: string = ""; //toast v-model개념
  selected: boolean = false; //그 외 일정추가
  menu_update_date: boolean = false; //수정일 캘린더
  updateDate: string = ""; //[수정] 달력 v-model
  update: boolean = false; //dialog 저장 or 수정
  startDate: string = ""; //[등록] 달력 v-model
  secondStartDate: string = ""; //[등록] 달력 v-model
  dialog: any = ""; //일정 추가 Dialog
  detailMenu: boolean = false; //상세보기 menu v-model
  detailEvent: any[] = []; //상세보기 일정
  title: string = ""; //상세보기 Title
  backgroundColor = ""; //상세보기 색상표
  mask: string = "!#XXXXXXXX"; //[등록,수정]색상표 기본형식
  menu: boolean = false; //[등록]컬러판 v-model
  colorMenu: boolean = false; //[수정]컬러판 v-model
  toggle: boolean = false;

  //tost ui 관련 옵션
  dateRangeText: string = ""; //달력 날짜
  selectedView: string = "month";
  viewOptions: any = [
    {
      title: "Monthly",
      value: "month",
    },
    {
      title: "Weekly",
      value: "week",
    },
    {
      title: "Day",
      value: "day",
    },
  ];
  view: string = "month";
  week: any = {
    dayNames: ["일", "월", "화", "수", "목", "금", "토"],
    taskView: false,
    eventView: true,
  };
  month: any = {
    dayNames: ["일", "월", "화", "수", "목", "금", "토"],
    visibleWeeksCount: 5, //보여줄 주단위
  };

  get calendarInstance() {
    //'GetInstance'는 호출 값을 한 번만 제공합니다.
    // 두 번 이상 호출하면 'null'을 호출하기 때문에 오류가 발생합니다.
    return this.$refs.calendar.getInstance();
  }

  get swatchStyle() {
    const { menu } = this;
    return {
      backgroundColor: this.scheduleData.backgroundColor,
      cursor: "pointer",
      height: "30px",
      width: "30px",
      borderRadius: menu ? "50%" : "4px",
      transition: "border-radius 200ms ease-in-out",
    };
  }
  get swatchdetailStyle() {
    const { colorMenu } = this;
    return {
      backgroundColor: this.backgroundColor,
      cursor: "pointer",
      height: "30px",
      width: "70px",
      borderRadius: colorMenu ? "50%" : "4px",
      transition: "border-radius 200ms ease-in-out",
    };
  }

  get colorGroup() {
    return {
      backgroundColor: this.scheduleData.backgroundColor,
    };
  }

  get timelineTable() {
    return this.timelineTableList;
  }

  @Watch("selectedView")
  changeOptions(newView: any) {
    this.calendarInstance.changeView(newView);
    this.setDateRangeText();
  }

  @Watch("selectedTimelineView")
  changeTimelineOptions() {
    if (this.selectedTimelineView == "month") {
      this.chartData.options.scales.xAxis.time.unit = "month";
      this.getmonthDate();
      chart.resize();
    } else {
      this.chartData.options.scales.xAxis.time.unit = "day";
      this.getdayDate();
      chart.resize();
    }
  }

  @Watch("secondTitleList")
  addSecondTitle() {
    console.log("secondTitleList", this.secondTitleList);
    return this.secondTitleList;
  }

  s_date_search(v: any) {
    console.log(v);
    this.startDate = v;
    let startEL: any = this.$refs.startDate;
    startEL.save(v);
  }
  ss_date_search(v: any) {
    console.log(v);
    this.secondStartDate = v;
    let startEL: any = this.$refs.secondStartDate;
    startEL.save(v);
  }
  u_date_search(v: any) {
    console.log(v);
    this.updateDate = v;
    let updateEL: any = this.$refs.updateDate;
    updateEL.save(v);
  }

  mounted() {
    this.setDateRangeText();
    this.getCustomer();
    this.getSchedule("");
  }

  resetZoom() {
    chart.resetZoom();
  }

  getdayDate() {
    const now = new Date();
    const day = now.getDate();

    this.chartData.options.scales.xAxis.min = new Date(
      new Date().setDate(day - 5)
    )
      .toISOString()
      .substr(0, 10);
    this.chartData.options.scales.xAxis.max = new Date(
      new Date().setDate(day + 7)
    )
      .toISOString()
      .substr(0, 10);
  }

  getmonthDate() {
    const now = new Date();
    const month = now.getMonth();

    this.chartData.options.scales.xAxis.time.unit = "month";
    this.chartData.options.scales.xAxis.min = new Date(
      new Date().setMonth(month - 4)
    )
      .toISOString()
      .substr(0, 10);
    this.chartData.options.scales.xAxis.max = new Date(
      new Date().setMonth(month + 9)
    )
      .toISOString()
      .substr(0, 10);
  }

  //전체 타임라인List
  async getTotalSchedule() {
    let yArea: any = [];
    let xArea: any = [];
    let oneDayColor: any = [];
    let oneDayData: any = [];
    let color: any = [];
    let all: any = [];

    this.today = new Date()
      .toISOString()
      .substr(0, 10)
      .replace("-", "년")
      .replace("-", "월")
      .concat("일");
    api.schedule.getTotalScheduleInfo().then((response) => {
      this.selectedTimelineView = "month";
      this.timelineList = response.data.responseData;

      //bubble -하루단위 일정, bar -하루이상 일정
      response.data.responseData.forEach((value: any) => {
        yArea.push(value.customerName);
        all.push(value.start, value.end);
        if (value.start == value.end) {
          oneDayData.push({
            x: value.start,
            y: value.customerName,
            r: 15,
          });
          oneDayColor.push(value.backgroundColor);
        } else {
          xArea.push({
            x: [value.start, value.end],
            y: value.customerName,
          });
          color.push(value.backgroundColor);
        }
      });

      /*데이터 중 이른/늦은 날짜 기준
      minDate = all.reduce((prev: any, curr: any) => {
          return new Date(prev).getTime() <= new Date(curr).getTime()
            ? prev
            : curr;
        });

        maxDate = all.reduce((prev: any, curr: any) => {
          return new Date(prev).getTime() <= new Date(curr).getTime()
            ? curr
            : prev;
        });
        */

      this.chartData.data["labels"] = yArea;
      this.chartData.data["datasets"][0].data = xArea;
      this.chartData.data["datasets"][0].backgroundColor = color;
      this.chartData.data["datasets"][1].data = oneDayData;
      this.chartData.data["datasets"][1].backgroundColor = oneDayColor;
      this.getmonthDate();

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
        chart.resize();

        console.group("createChart");
        console.log("createChart", chart);
        console.groupEnd();
        resolve(chart);
      });
    });
    console.group("getTotalSchedule");
    console.log("getTotalSchedule", this.timelineList);
    console.groupEnd();
  }
  //전체 거래List
  getCustomer() {
    api.schedule.getCustomerInfo().then((response) => {
      this.customerList = response.data.responseData;

      console.group("getCustomer");
      console.log("getCustomer", this.customerList);
      console.groupEnd();
    });
  }

  //전체 일정List
  getSchedule(item: any) {
    this.filterList = [];
    this.filterList = [{ customerName: "전체 일정", customerId: "" }];
    let tempFilter = new Set();
    let searchItem = {
      customerId: "",
    };
    searchItem.customerId = item;

    api.schedule.getScheduleInfo(searchItem).then((response) => {
      response.data.responseData.forEach((value: any) => {
        value.id = `${value.customerId}-${value.workScheduleId}`; //toast 일정데이터 선별하기 임의데이터 사용
      });

      this.events = response.data.responseData;
      this.timelineTableList = response.data.responseData;
      this.events.forEach((value: any) => {
        tempFilter.add(value.customerId);
        this.customerList.forEach((item: any) => {
          if (Array.from(tempFilter).includes(item.customerId)) {
            this.filterList.push(item);
          }
        });
      });

      this.filterList = Array.from(new Set(this.filterList));
      console.group("getSchedule");
      console.log("getSchedule", this.events);
      console.groupEnd();
    });
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
    let customerName = event.title.substring(0, event.title.indexOf("-"));
    let type = event.title.replace(customerName + "-", " ");
    return `[${customerName}] ${type} `;
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
    //상세일정 일정옆에 띄우기
    this.x = event.nativeEvent.pageX;
    this.y = event.nativeEvent.pageY;

    this.detailEvent = [];
    this.detailMenu = true;
    this.update = false;

    this.events.forEach((value: any) => {
      if (value.id == event.event.id) {
        let customerName = value.title.substring(0, value.title.indexOf("-"));
        let type = value.title.replace(customerName + "-", " ");

        this.title = `[${customerName}] ${type} `;
        this.backgroundColor = value.backgroundColor;
        this.detailEvent.push(value);
      }
    });
    console.group("onClickSchedule");
    console.log("onClickSchedule", this.detailEvent);
    console.groupEnd();
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
  //그 외 일정 추가
  addCalendar() {
    //console.log("addCalendar");
    this.titleList = [...this.resettypeData];
    console.log(this.titleList, this.resettypeData);
    // this.secondTitleList.push({ title: "", date: "" });
  }
  add() {
    this.secondTitleList.push({ title: "", date: "" });
  }
  //일정 등록 이벤트
  saveInfo() {
    this.update = false;
    let schedule: any[] = [];

    if (this.scheduleData.customer == "" || this.scheduleData.type == "") {
      return this.$swal({
        title: "필수정보가 등록되지않았습니다.",
        icon: "error",
        position: "top",
        showCancelButton: false,
        showConfirmButton: false,
        toast: true,
        timer: 1500,
      });
    }

    /* 모든일정 등록 옵션
    for (var i = 0; i < this.titleList.length; i++) {
      if (this.titleList[i].date == "") {
        check = false;
        return this.$swal({
          title: "등록되지 않은 일정이 존재합니다.",
          icon: "error",
          position: "top",
          showCancelButton: false,
          showConfirmButton: false,
          toast: true,
          timer: 1500,
        });
      }
    }
    */
    /*selected  true : 그 외일정 추가 경우 , false : 고정일정 추가 경우*/
    if (this.selected == false) {
      this.titleList.forEach((value: any) => {
        if (value.date != "") {
          schedule.push({
            customerId: this.scheduleData.customer.customerId,
            title: `${this.scheduleData.customer.customerName}-${value.title}`,
            type: this.scheduleData.type,
            backgroundColor: this.scheduleData.backgroundColor,
            start: value.date,
            end: value.date,
            category: "allday",
            isAllDay: "true",
            memo: this.scheduleData.memo,
          });
        }
      });
    } else {
      this.secondTitleList.forEach((value: any) => {
        if (value.title != "" && value.date != "") {
          schedule.push({
            customerId: this.scheduleData.customer.customerId,
            title: `${this.scheduleData.customer.customerName}-${value.title}`,
            type: this.scheduleData.type,
            backgroundColor: this.scheduleData.backgroundColor,
            start: value.date,
            end: value.date,
            category: "allday",
            isAllDay: "true",
            memo: this.scheduleData.memo,
          });
        }
      });
    }

    api.schedule
      .saveScheduleInfo(schedule)
      .then((response) => {
        if (response.status == 200) {
          this.$swal({
            title: "일정이 등록되었습니다.",
            icon: "success",
            position: "top",
            showCancelButton: false,
            showConfirmButton: false,
            toast: true,
            timer: 1500,
          });
        } else {
          this.$swal({
            title: "등록이 실패되었습니다.",
            icon: "error",
            position: "top",
            showCancelButton: false,
            showConfirmButton: false,
            toast: true,
            timer: 1500,
          });
        }
        //일정 데이터 불러오기
        this.dialog = false;
        this.getSchedule("");
        this.getTotalSchedule();
        this.getTotalSchedule();
      })
      .catch((error) => {
        console.log(error);
      });
  }
  openModal() {
    this.selected = false;
    this.dialog = !this.dialog;
    this.scheduleData.customer = "";
    this.scheduleData.type = "";
    this.scheduleData.memo = "";
    this.scheduleData.backgroundColor = "#4caf50";
    this.titleList = [...this.resettypeData];
  }
  //Modal 닫기
  closeModal() {
    this.selected = false;
    this.dialog = false;
    this.scheduleData.customer = "";
    this.scheduleData.type = "";
    this.scheduleData.memo = "";
    this.scheduleData.backgroundColor = "#4caf50";
    this.titleList = [...this.resettypeData];
  }
  updateStatus() {
    this.update = true;
  }

  updateInfo() {
    let updateSchedule: any = {};

    if (this.updateDate == "") {
      return this.$swal({
        title: "일정이 등록 되지않았습니다.",
        icon: "error",
        position: "top",
        showCancelButton: false,
        showConfirmButton: false,
        toast: true,
        timer: 1500,
      });
    } else {
      this.detailEvent.forEach((value: any) => {
        updateSchedule["workScheduleId"] = value.workScheduleId;
        updateSchedule["customerId"] = value.customerId;
        updateSchedule["title"] = value.title;
        updateSchedule["type"] = value.type;
        updateSchedule["backgroundColor"] = value.backgroundColor;
        updateSchedule["start"] = this.updateDate;
        updateSchedule["end"] = this.updateDate;
        updateSchedule["category"] = value.category;
        updateSchedule["isAllDay"] = value.isAllDay;
        updateSchedule["memo"] = value.memo;
      });

      console.group("updateInfo");
      console.log("updateInfo", updateSchedule);
      console.groupEnd();

      api.schedule
        .updateScheduleInfo(updateSchedule)
        .then((response) => {
          if (response.status == 200) {
            this.$swal({
              title: "일정이 수정되었습니다.",
              icon: "success",
              position: "top",
              showCancelButton: false,
              showConfirmButton: false,
              toast: true,
              timer: 1500,
            });
          } else {
            this.$swal({
              title: "수정이 실패되었습니다.",
              icon: "error",
              position: "top",
              showCancelButton: false,
              showConfirmButton: false,
              toast: true,
              timer: 1500,
            });
          }
          //일정 데이터 불러오기
          this.detailMenu = false;
          this.getSchedule("");
          this.getTotalSchedule();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  deleteInfo() {
    let deleteItem = 0;
    if (this.detailEvent.length == 0) {
      return this.$swal({
        title: "삭제가 실패되었습니다.",
        icon: "error",
        position: "top",
        showCancelButton: false,
        showConfirmButton: false,
        toast: true,
        timer: 1500,
      });
    } else {
      deleteItem = this.detailEvent[0].workScheduleId;

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
              .deleteScheduleInfo(deleteItem)
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

                  this.detailMenu = false;
                  this.getSchedule("");
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
                this.getSchedule("");
                this.getTotalSchedule();
              })
              .catch((error) => {
                console.log(error);
              });
          }
        });
    }
  }
  clickTab(item: any) {
    this.selectedTabs = item;

    if (this.selectedTabs == "달력") {
      this.getSchedule("");
    } else {
      this.getTotalSchedule();
    }
  }
}
</script>
<style src="./Schedule.scss" lang="scss"></style>
