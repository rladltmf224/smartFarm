<template>
  <div class="totalBox">
    <div class="filterBox">
      <v-btn-toggle
        v-model="toggle"
        color="success"
        class="filterBtnBox"
        divided
        variant="outlined"
      >
        <v-btn
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
      <v-row class="mt-2" justify="center">
        <v-col cols="2">
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
        <v-col cols="3">
          <span class="text-h4">{{ dateRangeText }}</span>
        </v-col>
        <v-col cols="4">
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
      <v-btn bottom color="pink" dark fab fixed right @click="openModal">
        <v-icon>mdi-plus</v-icon>
      </v-btn>

      <!--일정 상세보기-->
      <v-menu
        transition="slide-y-transition"
        v-model="detailMenu"
        :close-on-content-click="false"
        :nudge-width="200"
      >
        <v-card>
          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-row class="pt-2">
                  <v-col cols="9" class="pt-0">
                    <v-list-item-title
                      ><strong>{{ title }}</strong></v-list-item-title
                    ></v-col
                  >
                  <v-col cols="3" class="pt-0">
                    <v-list-item-subtitle v-show="!update">{{
                      date
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
                  <v-icon right large dense class="mr-10">
                    mdi mdi-sprout</v-icon
                  >
                  <span
                    ><strong>{{ type }}</strong></span
                  >
                </v-list-item-subtitle>
                <v-list-item-subtitle class="mb-3">
                  <v-icon right large dense class="mr-10">
                    mdi-note-edit-outline
                  </v-icon>
                  <span
                    ><strong>{{ memo == "" ? "비고없음" : memo }}</strong></span
                  >
                </v-list-item-subtitle>
                <v-list-item-subtitle class="mb-3">
                  <v-icon right large dense class="mr-10"> mdi-account </v-icon>
                  <span
                    ><strong>{{ person }} / {{ updatePerson }}</strong></span
                  ><v-spacer></v-spacer>
                </v-list-item-subtitle>
                <v-list-item-subtitle class="mb-3">
                  <v-icon right large dense class="mr-10"> mdi-palette </v-icon>
                  {{ backgroundColor }}
                  <div :style="swatchdetailStyle"></div>
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

      <!--일정 추가 Dialog-->
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

                <!-- <v-text-field
                dense
                class="highlightFont"
                placeholder="* 회사명"
                v-model="scheduleData.company"
              /> -->
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
            <v-row v-show="selected">
              <v-col cols="4" class="pa-0">
                <v-text-field
                  dense
                  filled
                  rounded
                  hide-details
                  :style="[date != '' ? colorGroup : null]"
                >
                </v-text-field>
              </v-col>
              <v-col cols="4" class="pt-0"> </v-col>
            </v-row>
            <v-row
              v-show="!selected"
              v-model="typeList"
              v-for="n in typeList"
              class="dateBox"
              :key="n.title"
            >
              <v-col cols="4" class="pa-0">
                <!-- :class="{ active: n.date != '' }"
              :style="{ backgroundColor: scheduleData.backgroundColor }" -->
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
            <v-row justify="center" class="ma-0">
              <v-checkbox
                v-model="selected"
                label="그 외 일정추가"
                class="float-center"
              ></v-checkbox>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="success" @click="saveInfo">저장</v-btn>
            <v-btn text color="success" @click="closeModal">닫기</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import Calendar from "@toast-ui/vue-calendar";
import "@toast-ui/calendar/dist/toastui-calendar.min.css";
import * as api from "@/api";

@Component({
  components: {
    Calendar,
  },
})
export default class Schedule extends Vue {
  $refs!: {
    calendar: HTMLFormElement;
    startDate: HTMLFormElement;
    updateDate: HTMLFormElement;
  };
  filterList: any[] = []; //[response] 전체 거래처 데이터(filter용)
  customerList: any[] = []; //[response] 전체 거래처 데이터
  events: any[] = []; //[response] 전체 일정 데이터
  typeList: any = [
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
  scheduleData: any = {
    title: "",
    customer: "",
    type: "",
    backgroundColor: "#4caf50",
    memo: "",
  };
  selected: boolean = false; //그 외 일정추가
  menu_update_date: boolean = false; //수정일 캘린더
  updateDate: string = "";
  update: boolean = false; //dialog 저장 or 수정
  startDate: string = "";
  detailMenu: boolean = false;
  detailEvent: any[] = [];
  resettypeData: any = [
    //reset
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
  dialog: any = ""; //일정 추가 Dialog
  selectedView: string = "month";
  title: string = ""; //상세보기 Title
  date: string = ""; //상서보기 date
  type: string = ""; //상세보기 type
  person: string = ""; //상세보기 작성자
  updatePerson: string = ""; //상세보기 수정자
  memo: string = ""; //상세보기 메모
  backgroundColor: string = ""; //상세보기 색상표
  dateRangeText: string = "";
  viewOptions: any = [
    {
      title: "Monthly",
      value: "month",
    },
    {
      title: "Weekly",
      value: "week",
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
  detail: any = {};
  mask: string = "!#XXXXXXXX";
  menu: boolean = false;
  colorMenu: boolean = false;
  toggle: boolean = false;

  get calendarInstance() {
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
      width: "120px",
      borderRadius: colorMenu ? "50%" : "4px",
      transition: "border-radius 200ms ease-in-out",
    };
  }

  get colorGroup() {
    return {
      backgroundColor: this.scheduleData.backgroundColor,
    };
  }

  @Watch("selectedView")
  changeOptions(newView: any) {
    if (newView == "3months") {
      this.$refs.calendar.month["visibleWeeksCount"] = 12;
      console.log(this.$refs.calendar.month["visibleWeeksCount"]);
      this.$refs.calendar.render();
      //this.month["visibleWeeksCount"] = 12;
      // this.$refs.calendar.setOptions(
      //   { month: { visibleWeeksCount: 12 } },
      //   true
      // );
      // console.log(this.$refs.calendar.month["visibleWeeksCount"]);
      // this.$refs.calendar.changeView("month", true);
    }
    console.log(newView);
    this.calendarInstance.changeView(newView);
    this.setDateRangeText();
  }

  s_date_search(v: any) {
    console.log(v);
    this.startDate = v;
    let startEL: any = this.$refs.startDate;
    startEL.save(v);
  }
  u_date_search(v: any) {
    console.log(v);
    this.updateDate = v;
    let updateEL: any = this.$refs.updateDate;
    updateEL.save(v);
  }

  mounted() {
    //this.$refs.calendar.addEventListeners();
    //this.calendarInstance.createEvents(this.events);
    this.setDateRangeText();
    this.getCustomer();
    this.getSchedule("");
  }

  //전체 거래List
  getCustomer() {
    api.schedule.getCustomerInfo().then((response) => {
      this.customerList = response.data.responseData;
      this.filterList = [{ customerName: "전체 일정", customerId: "" }];
      this.filterList.push(...response.data.responseData);
      console.group("getCustomer");
      console.log("getCustomer", this.customerList);
      console.groupEnd();
    });
  }

  //전체 일정List
  getSchedule(item: any) {
    let searchItem = {
      customerId: "",
    };
    searchItem.customerId = item;

    api.schedule.getScheduleInfo(searchItem).then((response) => {
      response.data.responseData.forEach((value: any) => {
        value.id = `${value.customerId}-${value.workScheduleId}`; //toast 일정데이터 선별하기 임의데이터 사용
      });

      this.events = response.data.responseData;
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
        this.dateRangeText = `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
        return;
      // case "day":
      //   this.dateRangeText = `${date.getFullYear()}.${
      //     date.getMonth() + 1
      //   }.${date.getDate()}`;
      //   return;

      case "3months":
        this.dateRangeText = `${date.getFullYear()}년 ${
          date.getMonth() + 1
        }월 ~${date.getMonth() + 4}월 `;

        return;
      default:
        this.dateRangeText = `${startYear}.${
          start.getMonth() + 1
        }.${start.getDate()} - ${startYear !== endYear ? `${endYear}.` : ""}${
          end.getMonth() + 1
        }.${end.getDate()}`;
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
  /*
  onAfterRenderEvent(title: object) {
    console.group("onAfterRenderEvent");
    console.log("Event Info : ", title);
    console.groupEnd();
  }
  */

  //update 일정
  onClickSchedule(event: any) {
    this.detailEvent = [];
    this.detailMenu = true;
    this.update = false;

    this.events.forEach((value: any) => {
      if (value.id == event.event.id) {
        let customerName = value.title.substring(0, value.title.indexOf("-"));
        let type = value.title.replace(customerName + "-", " ");
        this.title = `[${customerName}] ${type} `;
        this.date = value.start;
        this.type = value.type;
        this.person = `${value.createdId} : ${value.createdDate}`;
        this.updatePerson = `${value.modifiedId} : ${value.modifiedDate}`;
        this.memo = value.memo;
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
    for (var i = 0; i < this.typeList.length; i++) {
      if (this.typeList[i].date == "") {
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
    console.log(this.typeList);
    this.typeList.forEach((value: any) => {
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
    console.log(schedule);

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
    this.typeList = this.resettypeData;
  }
  //Modal 닫기
  closeModal() {
    this.selected = false;
    this.dialog = false;
    this.scheduleData.customer = "";
    this.scheduleData.type = "";
    this.scheduleData.memo = "";
    this.scheduleData.backgroundColor = "#4caf50";
    this.typeList = this.resettypeData;
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
              })
              .catch((error) => {
                console.log(error);
              });
          }
        });
    }
  }
}
</script>
<style src="./Schedule.scss" lang="scss"></style>
