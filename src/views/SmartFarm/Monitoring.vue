<template>
  <v-container fluid class="">
    <v-row class="d-flex align-center justify-center">
      <v-card
        v-for="(item, i) in outdoorSensor"
        :key="i"
        class="d-flex justify-center flex-column align-center mx-1"
        min-width="100"
      >
        <v-card-text>
          <span class="text-h5 font-weight-bold">
            {{ outdoorSensor[i].sensorname }}
          </span>
          <v-spacer></v-spacer>

          <span class="text-h6"
            >{{ outdoorSensor[i].value }}{{ outdoorSensor[i].unit }}</span
          >
        </v-card-text>
      </v-card>
      <v-btn
        :loading="loading5"
        :disabled="loading5"
        color="#CFD8DC"
        class="ma-2 white--text"
        fab
        x-small
        elevation="0"
        @click="(loader = 'loading5'), getOutDoor()"
      >
        <v-icon dark> mdi-reload </v-icon>
      </v-btn>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-badge overlap content="3">
            <v-btn depressed v-bind="attrs" v-on="on" icon>
              <v-icon color="black" large> mdi-bell </v-icon>
            </v-btn>
          </v-badge>
        </template>
        <v-list>
          <v-list-item v-for="(item, index) in items" :key="index">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-row>

    <v-row dense class="d-flex justify-md-center align-stretch">
      <v-col v-for="(n, index) in cards" :key="index" cols="3">
        <RoomInfo
          :roomData="n"
          @controllPage="goControllPage"
          @selectPage="openDialog"
        >
        </RoomInfo>
      </v-col>
    </v-row>

    <!-- 다이아로그 -->
    <v-row justify="center">
      <v-dialog
        v-model="dialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <v-card>
          <v-toolbar dense color="#CFD8DC" elevation="0">
            <v-btn icon @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>

            <h4 class="px-1">모니터링</h4>
            <h4 class="px-1">></h4>
            <h4 class="px-1">{{ this.section }}</h4>

            <v-spacer></v-spacer>
          </v-toolbar>

          <!-- MonitoringGraph내용 -->
          <v-container fluid class="pa-0 ma-0">
            <v-row class="pa-0">
              <v-col lg="12" class="pa-0 ma-0">
                <v-sheet
                  class="pa-8"
                  color="#F6F8F9"
                  max-width="auto"
                  height="100vh"
                  style="overflow: auto"
                >
                  <!-- 조회일,조회시간 -->
                  <v-row class="align-center">
                    <div class="px-4">
                      <h4 class="searchbox-title">조회정보</h4>
                    </div>
                    <!-- 시작일 -->
                    <v-col cols="3" lg="2" class="">
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
                        ></v-date-picker>
                      </v-menu>
                    </v-col>

                    <!-- 종료일 -->
                    <v-col cols="3" md="3" lg="2" class="">
                      <v-menu
                        v-model="menu2"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="e_date"
                            label="종료일"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="e_date"
                          @input="menu2 = false"
                          :min="s_date"
                          :max="date"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>

                    <v-btn class="ml-6 primary" @click="selectedDate()"
                      >조회</v-btn
                    >
                  </v-row>
                  <!-- 선택된 조회값 -->

                  <v-row>
                    <v-col cols="12">
                      <div class="pa-0 d-flex align-center">
                        <h4
                          class="searchbox-title pr-4"
                          style="white-space: nowrap"
                        >
                          조회 센서
                        </h4>

                        <v-chip-group
                          v-model="selection"
                          multiple
                          active-class="primary--text"
                        >
                          <v-chip v-for="tag in tags" :key="tag">
                            {{ tag }}
                          </v-chip>
                        </v-chip-group>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row class="d-flex">
                    <v-col cols="12">
                      <LoadingSpinner v-if="this.isLoading"></LoadingSpinner>
                      <!-- 온습도카드 -->
                      <div class="d-flex" v-if="!this.isLoading">
                        <v-card
                          class="pa-3 ma-2"
                          v-if="this.selection.includes(0)"
                        >
                          <div class="d-flex align-center">
                            <h3
                              class="pr-3 searchbox-title"
                              style="white-space: nowrap"
                            >
                              {{ newData[0].name }}
                            </h3>
                            <h5>
                              현재 온도:
                              {{ Data_TempHumid.nowValue_Temp }}
                              {{ Data_TempHumid[0].unit[0].unit }}
                              습도:
                              {{ Data_TempHumid.nowValue_Humid }}
                              {{ Data_TempHumid[0].unit[1].unit }}
                            </h5>
                          </div>

                          <TestGraphTemp
                            :Data_TempHumid="Data_TempHumid"
                            name="humid"
                          ></TestGraphTemp>
                        </v-card>
                        <!-- 양액ECPH카드 -->
                        <v-card
                          class="ma-2 pa-3"
                          v-if="this.selection.includes(1)"
                        >
                          <h3
                            class="searchbox-title"
                            style="white-space: nowrap"
                          >
                            {{ newData[1].name }}
                          </h3>
                          <TestGraphWater
                            :Data_Water="Data_Water"
                            name="ECPH"
                          ></TestGraphWater>
                        </v-card>
                      </div>
                    </v-col>
                  </v-row>
                </v-sheet>
              </v-col>
            </v-row>
          </v-container>
          <!-- MonitoringGraph내용 -->
        </v-card>
      </v-dialog>
    </v-row>
    <!-- 다이아로그 -->
    <v-dialog v-model="control_modal" max-width="1000px">
      <v-card>
        <v-card-title>
          <span>{{ roomName_control }}</span>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-card-text>
          <v-col align-self="center">
            <v-data-table
              :headers="headers_bala"
              :items="bala_data"
              hide-default-footer
              class="elevation-1"
            >
              <template v-slot:[`item.controlStatus`]="{ item }">
                <v-btn-toggle mandatory v-model="item.controlStatus" disabled>
                  <v-btn
                    color="green"
                    text
                    @click="clickChangeStatus(item, 'ON')"
                    value="ON"
                    dense
                    :loading="item.loadBtn"
                  >
                    <p class="pa-0 ma-0">on</p>
                  </v-btn>

                  <v-btn
                    color="red "
                    text
                    value="OFF"
                    @click="clickChangeStatus(item, 'OFF')"
                    dense
                    :loading="item.loadBtn"
                  >
                    <p class="pa-0 ma-0">off</p>
                  </v-btn>

                  <v-btn
                    color="blue"
                    text
                    value="AUTO"
                    @click="clickChangeStatus(item, 'AUTO')"
                    dense
                    :loading="item.loadBtn"
                  >
                    <p class="pa-0 ma-0">auto</p>
                  </v-btn>
                </v-btn-toggle>
              </template>
              <!-- 시간설정 -->
              <template v-slot:[`item.setting`]="{ item }">
                <!-- LED부분 -->
                <div
                  class="d-flex"
                  v-if="
                    item.equipmentName == 'LED-1' ||
                    item.equipmentName == 'LED-2' ||
                    item.equipmentName == '환기팬'
                  "
                >
                  <form class="d-flex align-center">
                    <label for="Timeinput">시작 : </label>
                    <input
                      @change="changeValue(item)"
                      id="Timeinput1"
                      class="py-2"
                      type="time"
                      v-model="item.minValue"
                      :readonly="!item.modifiedBtn"
                    />
                    <label for="Timeinput2">종료 : </label>
                    <input
                      @change="changeValue(item)"
                      id="Timeinput2"
                      class="py-2"
                      type="time"
                      v-model="item.maxValue"
                      :readonly="!item.modifiedBtn"
                    />
                  </form>

                  <v-btn
                    class="ml-3 mt-2 mr-3"
                    v-if="!item.modifiedBtn"
                    @click="editValue(item)"
                    >수정</v-btn
                  >
                  <v-btn
                    class="ml-3 mt-2 mr-3"
                    v-if="item.modifiedBtn"
                    @click="saveChangeValue(item)"
                    small
                    >저장</v-btn
                  >
                  <v-btn
                    class="ml-3 mt-2 mr-3"
                    v-if="item.modifiedBtn"
                    @click="editValue(item)"
                    small
                    >추가</v-btn
                  >
                  <v-btn
                    class="ml-3 mt-2 mr-3"
                    v-if="item.modifiedBtn"
                    @click="cancelChangeValue(item)"
                    small
                    >취소</v-btn
                  >
                  <p
                    style="font-size: 2px; color: red"
                    class="pt-4 px-2"
                    v-if="item.timeChecker"
                  >
                    설정시간을 확인해주세요.
                  </p>
                </div>
                <!--가습기부분 -->
                <div
                  class="d-flex align-center"
                  style="width: 300x"
                  v-if="item.equipmentName == '가습기'"
                >
                  <div class="" style="width: 108px">
                    <v-text-field
                      dense
                      v-model="item.minValue"
                      min="1"
                      max="100"
                      type="number"
                      suffix="%"
                      @change="changeValue(item)"
                    ></v-text-field>
                  </div>

                  <p class="pt-6 px-4">~</p>
                  <div class="" style="width: 108px">
                    <v-text-field
                      dense
                      min="1"
                      max="100"
                      type="number"
                      suffix="%"
                      v-model="item.maxValue"
                      @change="changeValue(item)"
                    ></v-text-field>
                  </div>

                  <v-btn
                    class="ml-3 mt-2 mr-3"
                    v-if="!item.modifiedBtn"
                    @click="editValue(item)"
                    >수정</v-btn
                  >

                  <v-btn
                    class="ml-3 mt-2 mr-3"
                    v-if="item.modifiedBtn"
                    @click="saveChangeValue(item)"
                    small
                    >저장</v-btn
                  >
                  <v-btn
                    class="ml-3 mt-2 mr-3"
                    v-if="item.modifiedBtn"
                    @click="cancelChangeValue(item)"
                    small
                    >취소</v-btn
                  >
                </div>
                <!-- 에어컨부분 -->
                <div
                  class="d-flex align-center"
                  v-if="item.equipmentName == '에어컨'"
                >
                  <div class="d-flex align-center">
                    <v-text-field
                      dense
                      v-model="item.minValue"
                      min="1"
                      max="100"
                      type="number"
                      @change="changeValue(item)"
                    ></v-text-field
                    >°C
                  </div>

                  <span class="ml-3 mr-3"> ~ </span>
                  <div class="d-flex align-center">
                    <v-text-field
                      dense
                      min="1"
                      max="100"
                      type="number"
                      v-model="item.maxValue"
                      @change="changeValue(item)"
                    ></v-text-field
                    >°C
                  </div>

                  <v-btn
                    class="ml-3 mt-2 mr-3"
                    v-if="!item.modifiedBtn"
                    @click="editValue(item)"
                    >수정</v-btn
                  >

                  <v-btn
                    class="ml-3 mt-2 mr-3"
                    v-if="item.modifiedBtn"
                    @click="saveChangeValue(item)"
                    small
                    >저장</v-btn
                  >
                  <v-btn
                    class="ml-3 mt-2 mr-3"
                    v-if="item.modifiedBtn"
                    @click="cancelChangeValue(item)"
                    small
                    >취소</v-btn
                  >
                </div>
                <!-- 급수/배수 -->
                <div
                  class="d-flex"
                  v-if="
                    item.equipmentName == '급수펌프' ||
                    item.equipmentName == '배수펌프'
                  "
                >
                  <form class="d-flex align-center">
                    <label for="Timeinput">시작 : </label>
                    <input
                      @change="changeValue(item)"
                      id="Timeinput1"
                      class="py-2"
                      type="time"
                      v-model="item.minValue"
                      :readonly="!item.modifiedBtn"
                    />
                    <label for="Timeinput2">종료 : </label>
                    <input
                      @change="changeValue(item)"
                      id="Timeinput2"
                      class="py-2"
                      type="time"
                      v-model="item.maxValue"
                      :readonly="!item.modifiedBtn"
                    />
                  </form>
                  <v-btn
                    class="ml-3 mt-2 mr-3"
                    v-if="!item.modifiedBtn"
                    @click="editValue(item)"
                    >수정</v-btn
                  >

                  <v-btn
                    class="ml-3 mt-2 mr-3"
                    v-if="item.modifiedBtn"
                    @click="saveChangeValue(item)"
                    small
                    >저장</v-btn
                  >
                  <v-btn
                    class="ml-3 mt-2 mr-3"
                    v-if="item.modifiedBtn"
                    @click="cancelChangeValue(item)"
                    small
                    >취소</v-btn
                  >
                </div>
              </template>
              <template v-slot:[`item.alarm`]="{ item }">
                <v-btn text @click="openAlarmSetting(item)">
                  <v-icon dark> mdi-cog </v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-col>
        </v-card-text>
        <v-card-actions>
          <v-col class="text-right">
            <v-btn color="primary" text @click="closeControlModal">
              닫기
            </v-btn>
          </v-col>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="alarm_modal" persistent max-width="650px">
      <v-card>
        <v-card-title>
          <span>
            {{ roomName_alarm }}
          </span>
        </v-card-title>
        <v-card-text>
          <v-row class="mt-2" dense align="center">
            <v-col cols="12">
              <v-row dense align="center">
                <v-col cols="2">
                  <v-chip class="" color="warning"> 주의 </v-chip>
                </v-col>
                <v-col cols="2">
                  <v-text-field
                    type=""
                    label="AUTO 30"
                    v-model="warning_alarm.min"
                    outlined
                    color
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="2">
                  <v-text-field
                    type=""
                    label="AUTO 50"
                    v-model="warning_alarm.max"
                    outlined
                    color
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-checkbox
                    label="사용여부"
                    v-model="warning_alarm.useYN"
                    dense
                  ></v-checkbox>
                </v-col>
                <v-col cols="3">
                  <v-checkbox
                    label="Push사용"
                    v-model="warning_alarm.pushYN"
                    dense
                  ></v-checkbox>
                </v-col>
              </v-row>
              <v-row dense align="center">
                <v-col cols="2">
                  <v-chip class="" color="error"> 경고 </v-chip>
                </v-col>
                <v-col cols="2">
                  <v-text-field
                    type=""
                    label="주의 20"
                    v-model="error_alarm.min"
                    outlined
                    color
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="2">
                  <v-text-field
                    type=""
                    label="주의 70"
                    v-model="error_alarm.max"
                    outlined
                    color
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-checkbox
                    label="사용여부"
                    v-model="error_alarm.useYN"
                    dense
                  ></v-checkbox>
                </v-col>
                <v-col cols="3">
                  <v-checkbox
                    label="Push사용"
                    v-model="error_alarm.pushYN"
                    dense
                  ></v-checkbox>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-col class="text-right">
            <v-btn text color="success" @click="saveAlarmSetting">저장 </v-btn>
            <v-btn text color="primary" @click="closeAlarmSetting">닫기 </v-btn>
          </v-col>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="airCon_modal" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">에어컨 설정정보</v-card-title>
        <v-card-text class="align-center">
          <v-btn-toggle mandatory v-model="airCon_mode">
            <v-btn text color="blue" value="heat"> 냉방 </v-btn>
            <v-btn text color="red" value="cool"> 난방 </v-btn>
          </v-btn-toggle>
          <v-text-field
            label="온도"
            type="number"
            v-model="airCon_val"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click.native="changeAirConStatus">전송</v-btn>
          <v-btn color="primary" @click.native="closeAirConModal">취소</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import _ from "lodash";

import LoadingSpinner from "./Loading/LodingSpinner.vue"; // 로딩스피너
import axios from "axios";
import cfg from "./Config";

import * as api from "@/api/index.js";
import Data from "@/data/Data.json";

import TestGraphTemp from "./TestGraphTemp.vue";
import TestGraphWater from "./TestGraphWater.vue";
import RoomInfo from "./Monitoring/RoomInfo.vue";

const data = Data;

export default {
  name: "MESFE2Monitoring",
  components: {
    LoadingSpinner,
    TestGraphTemp,
    TestGraphWater,
    RoomInfo,
  },
  data() {
    return {
      airCon_modal: false,
      airCon_mode: "heat",
      airCon_val: 0,
      airCon_data: "",
      // 외부센서로딩
      roomName_control: "",
      items: [
        { title: "알람이력1" },
        { title: "알람이력2" },
        { title: "알람이력3" },
      ],
      headers_bala: [
        {
          text: "이름",
          align: "center",
          sortable: false,
          value: "equipmentName",
          width: "4%",
        },
        {
          text: "상태",
          value: "controlStatus",
          sortable: false,
          width: "2%",
          align: "center",
        },

        { text: "상세설정", value: "setting", width: "15%", align: "center" },
        { text: "알람설정", value: "alarm", width: "4%", align: "center" },
      ],

      loader: null,
      loading: false,
      loading2: false,
      loading3: false,
      loading4: false,
      loading5: false,

      // 외부센서로딩
      // MonitoringGraph
      // 데이터기다리기
      isLoading: true,
      // 데이터기다리기
      // 온습도데이터
      Data_TempHumid: [
        {
          name: "온/습도",
          value: [],
          startDate: "",
          endDate: "",
          nowValue_Temp: 0,
          nowValue_Humid: 0,
          unit: [
            { name: "온도", unit: "°C" },
            { name: "습도", unit: "%" },
          ],
        },
      ],
      Data_Water: [
        {
          name: "양액pH/EC",
          value: "",
          startDate: "",
          endDate: "",
          nowValue: "",
        },
      ],
      // 온습도데이터
      // chip
      tags: ["온/습도", "양액pH/EC"],
      // chip
      //datepicker
      date: new Date().toISOString().substr(0, 10),
      s_date: new Date().toISOString().substr(0, 10),
      e_date: new Date().toISOString().substr(0, 10),
      menu1: false,
      menu2: false,
      //datepicker
      //  checkbox
      selected: ["온/습도", "양액pH/EC"],
      //  checkbox

      selection: [0, 1],
      newData: [
        {
          name: "온/습도",
          value: "",
          startDate: "",
          endDate: "",
          nowValue: "",
        },

        {
          name: "양액pH/EC",
          value: "",
          startDate: "",
          endDate: "",
          nowValue: "",
        },
      ],

      // MonitoringGraph
      //다이아로그
      dialog: false,
      control_modal: false,
      alarm_modal: false,
      notifications: false,
      sound: true,
      widgets: false,
      //다이아로그
      // 현재온습도
      nowTemp: 0,
      nowHumid: 0,
      cards: [],
      // 현재온습도
      yes: false,
      data,
      selectedSection: "육묘실", // 1.구역 디폴트값 육묘실
      selectSection: ["육묘실", "활착실", "발아실"], // 2.구역선택,
      solarRadiation: "",
      modifiedDate: "",
      rainfall: "",
      windDirection: "",
      windSpeed: "",
      outdoorTemperature: "",
      outdoorHumidity: "",
      outdoorSensor: [
        //5.외부센서,측정값
        {
          sensorname: "일사량",
          value: "-",
          unit: "kWh/m2",
        },
        {
          sensorname: "강수량",
          value: "-",
          unit: "",
        },
        {
          sensorname: "풍속(남북)",
          value: "-",
          unit: "m/s",
        },
        {
          sensorname: "풍향",
          value: "-",
          unit: "",
        },
        {
          sensorname: "온도",
          value: "-",
          unit: "°C",
        },
        {
          sensorname: "습도",
          value: "-",
          unit: "%",
        },

        //외부센서 측정값
      ],
      showSection: 1, //1,2,3에 따라 섹션 라우터 변경함
      sectionNum: 1,
      section: "육묘실",
      logs: [],
      status: "disconnected",
      // 웹소켓
      socket: null,
      message: "",
      receivedMessage: [],
      textarea: "",
      socketId: "",
      bala_data: [],
      roomName_alarm: "",
      warning_alarm: {
        min: 0,
        max: 0,
        useYN: true,
        pushYN: false,
      },
      error_alarm: {
        min: 0,
        max: 0,
        useYN: true,
        pushYN: false,
      },
      ControlModal_currentVal: "",

      // 웹소켓
    };
  },

  mounted() {
    this.getOutDoor();
    this.BeforeWeeks;
    //this.getEquipMentInFormation();
    console.log("템프휴미드", this.Data_TempHumid[0].unit[0].unit);

    api.smartfarm.getRoomData().then((res) => {
      console.log("getRoomData", res);
      this.cards = res.data.responseData;
    });
  },
  watch: {
    loader() {
      const l = this.loader;
      this[l] = !this[l];

      setTimeout(() => (this[l] = false), 200);

      this.loader = null;
    },
  },
  async created() {
    // this.cards = Object.assign({}, cfg.data.monitorData);
    // var ws = new WebSocket("ws://192.168.0.231:8080/ws");
    // this.socket = ws;
    // console.log("웹소켓확인", ws);
    // //이벤트 헨들러
    // ws.onopen = function () {
    //   // console.log('[open] 커넥션이 만들어졌습니다.');
    //   var item = {
    //     api: "roomValue",
    //     method: "add",
    //     parameters: {},
    //   };
    //   ws.send(JSON.stringify(item));
    // };
    // let _this = this; //소영선임님이 알려주신 this안될때 대처법
    // ws.onmessage = function (event) {
    //   if (event.data === undefined) {
    //     console.log("웹소켓연결되지않음");
    //   } else {
    //     if (event.data.api == "roomValue") {
    //       //console.log("웹소켓으로 받은데이터", event.data);
    //       // JSON.parse로풀기
    //       const obj = JSON.parse(event.data);
    //       this.cards = obj[0];
    //       console.log("obj", obj);
    //     }
    //   }
    // };
    // ws.onclose = (evt) => {
    //   console.log(evt);
    // };
    // ws.onerror = (evt) => {
    //   console.log(evt);
    // };
    // // 보내는 코드
  },

  methods: {
    openControlModal(data) {
      let reqData = {
        roomId: data.roomId,
      };
      this.ControlModal_currentVal = reqData.roomId;
      api.smartfarm.getRoomContoller(reqData).then((res) => {
        console.log("getRoomContoller", res.data.responseData);
        res.data.responseData.forEach((element) => {
          element.modifiedBtn = false;
          element.loadBtn = false;
        });
        this.bala_data = res.data.responseData;
        this.roomName_control = data.roomName;
        this.control_modal = true;
      });
    },
    openAlarmSetting(roomData) {
      this.roomName_alarm = roomData.roomName;
      this.alarm_modal = true;
    },
    saveAlarmSetting() {
      this.closeAlarmSetting();
    },
    closeAlarmSetting() {
      this.alarm_modal = false;
    },
    closeControlModal() {
      this.control_modal = false;
      this.bala_data = [];
      this.roomName_control = "";
    },
    clickChangeStatus(item, status) {
      console.log("clickChangeStatus", item, status);
      if (item.controlStatus === status) {
        return false;
      }

      let req_data = {
        equipmentId: item.equipmentId,
        controlStatus: status,
      };

      if (item.equipmentName === "에어컨" && status == "ON") {
        this.airCon_modal = true;
        //item.loadBtn = true;
        this.airCon_data = item;
        //this.getDeviceList();
        return false;
      }

      this.editStatus(req_data);
      return;
    },
    changeAirConStatus() {
      let req_data = {
        equipmentId: this.airCon_data.equipmentId,
        controlStatus: "ON",
        ACType: this.airCon_mode,
        settingTemperature: this.airCon_val,
      };

      this.editStatus(req_data);
      this.closeAirConModal();
    },
    closeAirConModal() {
      this.airCon_modal = false;
      this.airCon_val = 0;
      this.airCon_mode = "cool";
      this.getDeviceList();
    },
    // 가습기 숫자입력 0~100
    changeValue(item) {
      item.modifiedBtn = true;
      item.modifiedText = false;
      item.timeChecker = false;
      //최저습도는 최고습도보다 높을수없음.
      if (item.equipmentName == "가습기") {
        if (item.maxValue < item.minValue) {
          item.minValue = 0;
        } else if (item.minValue > 100) {
          var editedMinNum = item.minValue.substr(0, 2);
          item.minValue = editedMinNum;
          // item.minValue = 100;
        } else if (item.minValue < 0) {
          item.minValue = 0;
        } else if (item.maxValue > 100) {
          var editedMaxNum = item.maxValue.substr(0, 2);
          item.maxValue = editedMaxNum;
        }
      }

      //시간 입력할때 시간막기
      if (item.equipmentName == "LED" || item.equipmentName == "팬") {
        if (item.minValue > item.maxValue) {
          console.log("시간막아야됌");
          item.timeChecker = true;
          item.modifiedBtn = false;
        } else {
          item.timeChecker = false;
        }
      }
    },
    //시간설정 수정할때
    editValue(item) {
      item.modifiedBtn = true;
    },
    saveChangeValue(item) {
      let req_data = {
        equipmentId: item.equipmentId,
        minValue: item.minValue,
        maxValue: item.maxValue,
        delayValue: item?.delayValue,
      };

      api.smartfarm
        .editEquipmentSetting(req_data)
        .then((res) => {
          console.log("성공");
          if (res.status == 200) {
            this.getDeviceList();
          } else {
            this.getDeviceList();
          }
        })
        .catch((error) => {
          console.log("실패");
          this.getDeviceList();
        });
    },
    cancelChangeValue(item) {
      return (item.modifiedBtn = false);
    },

    // 제어상태변경 api입니다
    async editStatus(item) {
      console.log("제어상태변경api", item);
      let dataIndex = this.bala_data.findIndex(
        (i) => i.equipmentId == this.airCon_data.equipmentId
      );
      //this.bala_data[dataIndex].loadBtn = true;
      let resData = await api.smartfarm
        .editEquipmentCtrl(item)
        .then((response) => {
          console.log("editEquipmentCtrl", response.status);
          if (response.status == 200) {
            //
            this.getDeviceList();
          } else {
            this.$swal({
              title: "상태변경이 실패되었습니다.",
              icon: "error",
              position: "top",
              showCancelButton: false,
              showConfirmButton: false,
              toast: true,
              timer: 1500,
            });
            //this.bala_data[dataIndex].loadBtn = false;
            this.getDeviceList();
          }
          return response;
        })
        .catch((error) => {
          console.log(error);
        });
      //this.bala_data[dataIndex].loadBtn = false;

      console.log("resData", resData);
    },
    getDeviceList() {
      let reqData = {
        roomId: this.ControlModal_currentVal,
      };
      api.smartfarm.getRoomContoller(reqData).then((res) => {
        console.log("getRoomContoller", res.data.responseData);
        res.data.responseData.forEach((element) => {
          element.modifiedBtn = false;
          element.loadBtn = false;
        });
        this.bala_data = res.data.responseData;
      });
      // getEquipmentInfo()
      //   .then((response) => {
      //     // 발아/활착실 바인딩
      //     console.log("showcontroll의 리스폰스", response);
      //     let balaResult = _.filter(response.data.responseData, {
      //       room: "발아/활착실",
      //     });
      //     console.log("balaResult", balaResult);
      //     let nurResult = _.filter(response.data.responseData, {
      //       room: "육묘실",
      //     });
      //     console.log("맨처음 api 성공", balaResult, nurResult);
      //     balaResult.forEach((element) => {
      //       element.modifiedBtn = false;
      //     });

      //     nurResult.forEach((element) => {
      //       element.modifiedBtn = false;
      //     });

      //     this.bala_data = balaResult;
      //     this.nur_data = nurResult;
      //   })
      //   .catch((error) => {
      //     console.log("api통신 실패");
      //     console.log(error);
      //   });
    },
    onChange() {
      console.log("선택된구역", this.selectedSection);
    },
    // 기상센서 api 호출 전 데이터초기화
    resetOutDoorValue() {
      for (var i = 0; i < this.outdoorSensor.length; i++) {
        this.outdoorSensor[i].value = "-";
      }
    },
    // 기상센서 api 호출 전 데이터초기화

    // 기상센서api
    getOutDoor() {
      this.resetOutDoorValue();
      //- Base_time : 0200, 0500, 0800, 1100, 1400, 1700, 2000, 2300 (1일 8회) 두시,다섯시 ... 이때 예보를함 (업데이트시간)
      let baseTime = 0;
      let date = new Date();
      let baseArr = [2, 5, 8, 11, 14, 17, 20, 23];

      for (let i = 0; i < baseArr.length; i++) {
        console.log(baseArr[i], i, date.getHours());
        if (baseArr[i] > date.getHours()) {
          //지금시간이랑 비교해서 baseArr[i]이 크면,
          console.log(baseArr[i - 1]); //하나뺀걸 가져옴.
          baseTime = baseArr[i - 1];
          break;
        } else if (baseArr[i] > date.getHours() && i == 0) {
          //만약에 0시나 1시일 경우 baseTime을 23시로
          baseTime = 23;
          break;
        }
      }

      console.log("baseTime", baseTime);

      let baseDate = `${date.getFullYear()}${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}${
        baseTime == 23
          ? (date.getDate() - 1).toString().padStart(2, "0")
          : date.getDate().toString().padStart(2, "0")
      }`; //금일. //padStart = 빈값을 0으로 대체
      console.log(baseDate);
      let reqData = {
        ServiceKey:
          "wj8ZRg3W8rO130Cl7eOUkJQ9Xq6OMen3Qwt7BhjXS0JoMz33mL3PXGeQddnGZJM80yO77v7paxo2H5hFtSHkCw==",
        pageNo: encodeURIComponent(1),
        numOfRows: encodeURIComponent(36), //12시간의 데이터= 1시간
        dataType: encodeURIComponent("JSON"),
        base_date: encodeURIComponent(baseDate),
        base_time: encodeURIComponent(
          `${baseTime.toString().padStart(2, "0")}00`
        ),
        nx: encodeURIComponent("62"),
        ny: encodeURIComponent("119"),
      };
      axios
        .get(
          "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst",
          {
            headers: { "Content-Type": "text/xml;charset=UTF-8" },
            params: reqData,
          }
        )
        .then((res) => {
          console.log(res);

          console.log(res.data.response.body.items);
          var Arr = res.data.response.body.items.item;

          var Out_RainFall = _.filter(Arr, { category: "PCP" });
          console.log("강수량", Out_RainFall[0].fcstValue);
          this.outdoorSensor[1].value = Out_RainFall[0].fcstValue;

          var Out_Humid = _.filter(Arr, { category: "REH" });
          console.log("습도", Out_Humid[0].fcstValue);
          this.outdoorSensor[5].value = Out_Humid[0].fcstValue;

          var Out_Temp = _.filter(Arr, { category: "TMP" });
          console.log("온도", Out_Temp[0].fcstValue);
          this.outdoorSensor[4].value = Out_Temp[0].fcstValue;

          var Out_WindSpeed_South = _.filter(Arr, { category: "VVV" });
          console.log("남북쪽풍속", Out_WindSpeed_South[0].fcstValue);
          console.log("남북쪽풍속", Out_WindSpeed_South);
          this.outdoorSensor[2].value = Out_WindSpeed_South[0].fcstValue;

          var Out_WindDirection = _.filter(Arr, { category: "VEC" });

          //(풍향값 + 22.5 * 0.5) / 22.5)
          this.outdoorSensor[3].value = Math.floor(
            (parseInt(Out_WindDirection[0].fcstValue) + 22.5 * 0.5) / 22.5
          );
          // console.log(
          //   "outdoorSensor",
          //   this.outdoorSensor[3].value,
          //   cfg.data.windDirectionData
          // );

          this.outdoorSensor[3].value = cfg.data.windDirectionData.filter(
            (el) => {
              return el.val === this.outdoorSensor[3].value;
            }
          );
          //console.log(this.outdoorSensor[3].value);
          this.outdoorSensor[3].value = this.outdoorSensor[3].value[0].DI;

          //console.log(cfg.data.windDirectionData);
        });
    },
    // 기상센서api
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
    async openDialog(data) {
      console.log("openDialog", data);
      this.dialog = true;
      this.section = data.roomName;
      await this.selectedDate(data);
    },
    closeDialog() {
      this.dialog = false;
    },
    // 시작일을 일주일전으로
    //  MonitoringGraph

    // 병수선임님이 알려준 비동기 api여러개 처리법
    selectedDate(data) {
      let filter = {
        roomId: data.roomId,
        startDate: this.s_date,
        endDate: this.e_date,
      };

      this.isLoading = true;

      let p1 = new Promise((resolve, reject) => {
        api.smartfarm.getGraphTempHumid(filter).then((res) => {
          let result = res.data.responseData;
          this.Data_TempHumid.value = result;
          this.Data_TempHumid.startDate = this.s_date;
          this.Data_TempHumid.endDate = this.e_date;
          resolve(res);
        });
      });
      let p2 = new Promise((resolve, reject) => {
        api.smartfarm.getGraphWaterPhEC(filter).then((res) => {
          let result = res.data.responseData;
          this.Data_Water.value = result;
          this.Data_Water.startDate = this.s_date;
          this.Data_Water.endDate = this.e_date;
          resolve(res);
        });
      });
      let item = {
        roomId: data.roomId,
      };
      let p3 = new Promise((resolve, reject) => {
        api.smartfarm.temphumidValue(item).then((res) => {
          let result = res.data.responseData;
          this.Data_TempHumid.nowValue = result;
          this.Data_TempHumid.nowValue_Temp = result.temperature;
          this.Data_TempHumid.nowValue_Humid = result.humidity;
          resolve(res);
        });
      });

      Promise.all([p1, p2, p3])
        .then((values) => {
          console.log(values);
          this.isLoading = false;
        })
        .catch((error) => {
          console.log(error.message);
          this.isLoading = false;
        });

      // 줄여볼수있으면줄여보기

      // 병수선임님이 알려준 비동기 api여러개 처리법
    },
    //  MonitoringGraph
    sendRequestBody() {
      this.message = {
        api: "temphumidValue",
        method: "add",
        parameters: {
          room: "육묘실",
          section: 1,
        },
      };

      this.socket.send(JSON.stringify(this.message));
    },
    // 웹소켓
    goControllPage(data) {
      //제어페이지로 가는 api
      console.log("goControllPage", data);
      this.openControlModal(data);
    },
    goDetailRouter() {
      //조회페이지로 가는api
      console.log("섹션넘", this.sectionNum, this.section);
      this.$router.push({
        name: "MonitoringGraph",
        params: { sectionNum: this.sectionNum, section: this.section },
      });
    },

    getData() {
      this.getNowData();
    },
    getAllData() {
      this.getNowData;
      //this.getEquipMentInFormation();
    },
    getNowData() {
      var item = {
        room: "육묘실",
        section: 1,
      };
      api.smartfarm.temphumidValue(item).then((res) => {
        console.log(res);
        this.cards[0].Temperature = res.data.responseData.temperature;
        this.cards[0].Humidity = res.data.responseData.humidity;
        console.log(this.cards);
      });
      // this.getEquipMentInFormation();
    },
    // 제어항목조회
    getEquipMentInFormation() {
      api.smartfarm.getEquipmentInfo().then((res) => {
        console.log("제어항목조회", res);
        this.cards[0].LED = res.data.responseData[3].controlStatus;
        this.cards[0].humidifier = res.data.responseData[4].controlStatus;
        this.cards[0].fan = res.data.responseData[5].controlStatus;
        console.log("제어항목조회후", this.cards);
      });
    },
    // 제어항목조회
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-text-field__details {
  display: none;
}

div {
  %circle {
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }

  .on {
    @extend %circle;
    background: greenyellow;
  }

  .off {
    @extend %circle;
    background: red;
  }
}
</style>
