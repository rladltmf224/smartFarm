<template>
  <div>
    <!-- 일정 분류 나누는  Dialog -->
    <v-dialog v-model="chooseDialog" width="400px">
      <v-card>
        <v-card-title class="mx-2">일정선택</v-card-title>
        <v-card-actions class="justify-center">
          <v-btn x-large color="success" @click="chooseAddModal">
            <v-icon>mdi mdi-calendar-plus</v-icon>신규
          </v-btn>
          <v-btn x-large color="success" @click="chooseExistingModal"
            ><v-icon>mdi mdi-calendar-cursor</v-icon>기존일정에 수정
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 일정 추가 Dialog -->
    <v-dialog v-model="dialog" width="750px" persistent>
      <v-card>
        <v-card-title class="mx-2">{{
          this.existing ? "일정 수정" : "일정 추가"
        }}</v-card-title>
        <v-card-text>
          <v-row class="mx-2">
            <v-col cols="3" fluid>
              <span>회사명</span>
              <v-autocomplete
                solo
                dense
                hide-details="false"
                class="highlightFont"
                label="회사명"
                v-model="scheduleData.customer"
                return-object
                :items="customerList"
                item-text="customerName"
                item-value="customerId"
                no-data-text="검색결과가 없습니다."
              ></v-autocomplete>
            </v-col>
            <v-col cols="2" fluid v-show="existing">
              <v-menu
                v-model="menuLoad"
                :close-on-content-click="false"
                :nudge-width="300"
                offset-x
                max-height="600"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    @click="getExistingCalendar"
                    v-bind="attrs"
                    v-on="on"
                    v-show="existing"
                  >
                    불러오기
                  </v-btn>
                </template>
                <v-card class="pa-3">
                  <v-data-table
                    class=""
                    dense
                    height="350"
                    :items="existingTable"
                    :headers="existingHeader"
                    hide-default-footer
                    @click:row="clickedExisting"
                    single-select
                  >
                  </v-data-table>
                  <v-card-actions>
                    <v-btn text @click="menuLoad = false"> 닫기 </v-btn>
                  </v-card-actions>
                </v-card>
              </v-menu>
            </v-col>

            <v-col cols="2" class="p-2">
              <span>작물명</span>
              <v-text-field
                dense
                solo
                hide-details="false"
                class="highlightFont"
                placeholder="* 작물명"
                v-model="scheduleData.cropName"
              />
            </v-col>
            <v-col cols="2" class="p-2">
              <span>품종명</span>
              <v-text-field
                dense
                solo
                hide-details="false"
                class="highlightFont"
                placeholder="* 품종명"
                v-model="scheduleData.varietyName"
              />
            </v-col>

            <v-col cols="3" class="p-2">
              <span>색상표</span>
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

          <v-row
            v-for="(item, index) in titleList"
            class="dateBox mt-5"
            :key="item.title"
          >
            <v-col cols="2" class="pa-0">
              <v-text-field
                :value="item.title"
                :readonly="item.title != ''"
                dense
                filled
                rounded
                hide-details
                :style="[
                  item.start != '' && item.end != '' ? colorGroup : null,
                ]"
              >
                {{ item.title }}</v-text-field
              >
            </v-col>

            <v-col cols="3" class="pt-0">
              <v-menu
                :key="item.start"
                dense
                ref="startDate"
                :close-on-content-click="false"
                :return-value.sync="item.start"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    dense
                    v-model="item.start"
                    class="highlightFont"
                    label="시작일"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  :max="item.end"
                  @change="checkText(index, item.start)"
                  v-model="item.start"
                  no-title
                  scrollable
                  locale="ko-KR"
                >
                  <v-spacer></v-spacer>

                  <v-btn text color="primary" @click="item.start = ''">
                    취소
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="3" class="pt-0">
              <v-menu
                :key="item.end"
                dense
                ref="endDate"
                :close-on-content-click="false"
                :return-value.sync="item.end"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    dense
                    v-model="item.end"
                    class="highlightFont"
                    label="종료일"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  :min="item.start"
                  @change="autoText(index, item.end)"
                  v-model="item.end"
                  no-title
                  scrollable
                  locale="ko-KR"
                >
                  <v-spacer></v-spacer>

                  <v-btn text color="primary" @click="item.end = ''">
                    취소
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="4" class="pa-0">
              <v-text-field
                dense
                v-model="item.memo"
                placeholder="비고"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row
            v-for="(item, index) in secondTitleList"
            :key="index"
            justify="center"
            class="ml-40"
          >
            <v-col cols="2" class="pa-0">
              <v-text-field
                v-model="item.title"
                dense
                filled
                rounded
                hide-details
                :style="[
                  item.title != '' && item.start != '' && item.end != ''
                    ? colorGroup
                    : null,
                ]"
              >
              </v-text-field>
            </v-col>
            <v-col cols="3" class="pt-0">
              <v-menu
                :key="item.start"
                dense
                ref="secondStartDate"
                :close-on-content-click="false"
                :return-value.sync="item.start"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    dense
                    v-model="item.start"
                    class="highlightFont"
                    label="일정"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="item.start"
                  no-title
                  scrollable
                  locale="ko-KR"
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="menu = false">
                    취소
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="3" class="pt-0">
              <v-menu
                :key="item.end"
                dense
                ref="secondEndDate"
                :close-on-content-click="false"
                :return-value.sync="item.end"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    dense
                    v-model="item.end"
                    class="highlightFont"
                    label="종료일"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="item.end"
                  no-title
                  scrollable
                  locale="ko-KR"
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="menu = false">
                    취소
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="4" class="pa-0">
              <v-row>
                <v-col cols="9">
                  <v-text-field dense placeholder="비고" v-model="item.memo"
                /></v-col>
                <v-col cols="1">
                  <v-btn
                    icon
                    color="success"
                    @click="add"
                    v-show="
                      index == secondTitleList.length - 1 &&
                      item.title != '' &&
                      item.start != '' &&
                      item.end != ''
                    "
                    ><v-icon small>mdi-plus </v-icon></v-btn
                  >
                </v-col></v-row
              >
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
  </div>
</template>
<script lang="ts">
import * as api from "@/api/index.js";
import cfg from "./config";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import _ from "lodash";

@Component
export default class ScheduleAddModal extends Vue {
  $refs!: {
    secondStartDate: HTMLFormElement;
    secondEndDate: HTMLFormElement;
    endDate: HTMLFormElement;
  };
  @Prop({ required: true }) open: boolean = false;

  totalEvents: any[] = []; //[response] 전체 일정 데이터
  existing: boolean = false; //추가 일정 상태
  secondResetTypeData: any = []; //그 외 일정 v-model
  secondTitleList: any = [{ title: "", start: "", end: "", memo: "" }]; //그 외 일정 v-model
  dialog: any = ""; //일정 추가 Dialog
  scheduleData: any = {
    //[등록,수정,삭제]기능관련 DATA
    title: "",
    customer: "",
    cropName: "",
    varietyName: "",
    backgroundColor: "#4caf50",
  };
  customerList: any[] = []; //[response] 전체 거래처 데이터
  menuLoad: boolean = false; //거래처별 일정 불러오는 menu
  existingTableList: any[] = [];
  clickedExistingId: string = ""; //불러오기로 선택된 workScheduleId
  mask: string = "!#XXXXXXXX"; //[등록,수정]색상표 기본형식
  menu: boolean = false; //[등록]컬러판 v-model
  secondStartDate: string = ""; //[등록] 달력 v-model
  secondEndDate: String = "";
  titleList: any = [
    {
      title: "파종",
      start: "",
      end: "",
      memo: "",
    },
    {
      title: "발아",
      start: "",
      end: "",
      memo: "",
    },
    {
      title: "1차육묘",
      start: "",
      end: "",
      memo: "",
    },
    {
      title: "접목 & 활착",
      start: "",
      end: "",
      memo: "",
    },

    {
      title: "2차육묘",
      start: "",
      end: "",
      memo: "",
    },
    {
      title: "납품",
      start: "",
      end: "",
      memo: "",
    },
  ];
  get chooseDialog() {
    this.getSchedule();
    this.scheduleData.customer = "";
    this.scheduleData.cropName = "";
    this.scheduleData.varietyName = "";
    this.scheduleData.backgroundColor = "#4caf50";
    return this.open;
  }
  set chooseDialog(val: any) {
    this.$emit("closeModal", false);
  }

  get resetTypeData() {
    return cfg.data.resetTypeData;
  }

  get existingTable() {
    return this.existingTableList;
  }

  get existingHeader() {
    return cfg.header.existingHeader;
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

  get colorGroup() {
    return {
      backgroundColor: this.scheduleData.backgroundColor,
    };
  }

  @Watch("secondTitleList")
  addSecondTitle() {
    return this.secondTitleList;
  }

  @Watch("titleList", { deep: true })
  checkList() {
    return this.titleList;
  }

  created() {
    this.getCustomer();
  }

  chooseAddModal() {
    this.titleList = JSON.parse(JSON.stringify(this.resetTypeData));
    this.secondTitleList = JSON.parse(JSON.stringify(this.secondResetTypeData));
    this.add();
    this.dialog = true;
    this.existing = false;
  }

  add() {
    this.secondTitleList.push({ title: "", start: "", end: "", memo: "" });
  }
  chooseExistingModal() {
    this.dialog = true;
    this.existing = true;
    this.titleList = JSON.parse(JSON.stringify(this.resetTypeData));
    this.secondTitleList = JSON.parse(JSON.stringify(this.secondResetTypeData));
  }

  getSchedule() {
    this.totalEvents = [];
    let searchItem = {
      customList: [],
    };
    console.log(searchItem);
    api.schedule.getScheduleInfo(searchItem).then((response) => {
      this.totalEvents = response.data.responseData;

      response.data.responseData.forEach((value: any) => {
        value.details.forEach((detailVAlue: any) => {
          detailVAlue["backgroundColor"] = value.backgroundColor;
        });
      });
    });
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

  getExistingCalendar() {
    //거래처별 저장된 일정들 가져오기
    let searchItem = {
      customerId: "",
    };

    if (this.scheduleData.customer != "") {
      searchItem.customerId = this.scheduleData.customer.customerId;

      api.schedule.getCustomerScheduleInfo(searchItem).then((response) => {
        response.data.responseData.forEach((value: any) => {
          value.id = `${value.customerId}-${value.workScheduleId}`;
        });

        this.existingTableList = response.data.responseData;
      });
    }
  }

  clickedExisting(item: any, row: any) {
    let check: boolean = false; //고정일정 외의 추가일정 생성하는 코드
    this.titleList = JSON.parse(JSON.stringify(this.resetTypeData));
    this.secondTitleList = JSON.parse(JSON.stringify(this.secondResetTypeData));
    this.clickedExistingId = item.workScheduleId;
    this.scheduleData.cropName = item.cropName;
    this.scheduleData.varietyName = item.varietyName;
    row.select(true);

    this.totalEvents.forEach((value: any) => {
      if (
        item.cropName == value.cropName &&
        item.varietyName == value.varietyName &&
        item.customerId == value.customerId &&
        item.workScheduleId == value.workScheduleId
      ) {
        value.details.forEach((value_detail: any) => {
          this.scheduleData.backgroundColor = value_detail.backgroundColor;

          let onlyTitle = _.map(this.titleList, "title"); // [파종, 1차육묘, ...]
          if (onlyTitle.includes(value_detail.title)) {
            this.titleList[onlyTitle.indexOf(value_detail.title)] = {
              title: value_detail.title,
              start: value_detail.start,
              end: value_detail.end,
              memo: value_detail.memo,
            };
          } else {
            check = true;
            this.secondTitleList.push({
              title: value_detail.title,
              start: value_detail.start,
              end: value_detail.end,
              memo: value_detail.memo,
            });
          }
        });
      }
    });

    if (!check) this.add();
  }

  //일정 등록 이벤트
  saveInfo() {
    let schedule: any = {
      cropName: "",
      varietyName: "",
      backgroundColor: "",
      details: [],
    };

    if (
      this.scheduleData.customer == "" ||
      this.scheduleData.cropName == "" ||
      this.scheduleData.varietyName == ""
    ) {
      return this.$swal({
        title: "필수정보가 등록되지않았습니다.",
        icon: "error",
        position: "top",
        showCancelButton: false,
        showConfirmButton: false,
        toast: true,
        timer: 1500,
      });
    } else {
      schedule.cropName = this.scheduleData.cropName;
      schedule.varietyName = this.scheduleData.varietyName;
      schedule.backgroundColor = this.scheduleData.backgroundColor;

      this.titleList.forEach((value: any) => {
        if (value.start != "" && value.end != "") {
          schedule.details.push({
            title: value.title,
            start: value.start,
            end: value.end,
            memo: value.memo,
          });
        }
      });

      this.secondTitleList.forEach((value: any) => {
        if (value.title != "" && value.start != "" && value.end != "") {
          schedule.details.push({
            title: value.title,
            start: value.start,
            end: value.end,
            memo: value.memo,
          });
        }
      });
    }

    if (this.existing) {
      schedule["workScheduleId"] = this.clickedExistingId;
      api.schedule
        .updateTotalScheduleInfo(schedule)
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
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          //일정 데이터 불러오기
          this.dialog = false;
          this.$emit("closeModal");
          this.$emit("getFilter");
          this.$emit("getEvent");
        });
    } else {
      schedule["customerId"] = this.scheduleData.customer.customerId;
      schedule["category"] = "allday";
      schedule["isAllDay"] = "true";
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
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          //일정 데이터 불러오기
          this.dialog = false;
          this.$emit("closeModal");
          this.$emit("getFilter");
          this.$emit("getEvent");
        });
    }
  }

  checkText(item: any, data: any) {
    //시작일
    if (item != 0 && item != 6) {
      if (
        this.titleList[item]["start"] != "" &&
        new Date(this.titleList[item - 1]["end"]).getTime() >
          new Date(this.titleList[item]["start"]).getTime()
      ) {
        this.titleList[item]["start"] = "";

        return this.$swal({
          title: "이전 일정보다 빠른 일정은 존재할 수 없습니다.",
          icon: "error",
          position: "top",
          showCancelButton: false,
          showConfirmButton: false,
          toast: true,
          timer: 1500,
        });
      }
    }

    //실시간 Rerendering을 위한작업
    this.$set(this.titleList, this.titleList[item]["start"], data);
  }
  autoText(item: any, data: any) {
    //종료일 ->다음날 시작일
    if (item != 5) {
      this.titleList[item + 1]["start"] = data;
      return this.titleList;
    }

    //실시간 Rerendering을 위한작업
    this.$set(this.titleList, this.titleList[item]["start"], data);
  }
  //Modal 닫기
  closeModal() {
    this.dialog = false;
    this.chooseDialog = false;
    this.scheduleData.customer = "";
    this.scheduleData.cropName = "";
    this.scheduleData.varietyName = "";
    this.scheduleData.backgroundColor = "#4caf50";
  }
}
</script>
