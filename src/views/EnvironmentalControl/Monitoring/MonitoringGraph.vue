<template>
  <v-container fluid class="pa-0 ma-0">
    <v-row class="pa-0">
      <v-col lg="12" class="pa-0 ma-0">
        <v-sheet
          class="pa-8"
          color="#F6F8F9"
          max-width="auto"
          height="840"
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

            <v-btn class="ml-6 primary" @click="selectedDate()">조회</v-btn>
          </v-row>
          <!-- 선택된 조회값 -->

          <v-row>
            <v-col cols="12">
              <div class="pa-0 d-flex align-center">
                <h4 class="searchbox-title" style="white-space: nowrap">
                  조회 센서
                </h4>
                <v-chip-group
                  mandatory
                  class="d-flex pl-6"
                  v-model="selection"
                  active-class="primary--text"
                  multiple
                  column
                >
                  <v-chip
                    v-for="size in newData"
                    :key="size.item"
                    :value="size"
                  >
                    {{ size.name }}
                  </v-chip>
                </v-chip-group>
              </div>
            </v-col>
          </v-row>
          <!-- {{ selection }} -->
          <v-sheet
            v-if="this.selection != ''"
            class="pa-4 lighten-2"
            style="overflow-y: auto; height: 630px"
          >
            <LoadingSpinner v-if="this.isLoading"></LoadingSpinner>
            <div v-else>
              <TestGraphTemp
                :GraphData_TempHumid="GraphData_TempHumid"
                :GraphData_PHEC="GraphData_PHEC"
                v-for="(item, i) in selection"
                :key="i"
                class="my-4"
              ></TestGraphTemp>
            </div>
          </v-sheet>

          <v-sheet
            class="pa-4 lighten-2 d-flex justify-center align-center"
            style="overflow-y: auto; height: 630px"
            v-if="this.selection == ''"
          >
            <h4 class="searchbox-title">조회를 해주세요.</h4>
          </v-sheet>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import VueTimepicker from "vue2-timepicker/src/vue-timepicker.vue";

import TestGraphTemp from "@/views/Graph/TestGraphTemp.vue";
import LoadingSpinner from "@/components/Loading/LodingSpinner.vue"; //로딩스피너
import { mapGetters } from "vuex";

import * as api from "@/api/index.js";
import Data from "@/data/Data.json";
const data = Data;
import _ from "lodash";
export default {
  props: {
    section: {
      type: [Array, Object, String],
      default: null,
    },
    sectionNum: {
      type: [Array, Object, String, Number],
      default: null,
    },
  },
  name: "MESFEMonitoringGraph",
  components: { TestGraphTemp, LoadingSpinner },

  data() {
    return {
      // 자식한테 보낼값
      GraphData_TempHumid: [],
      GraphData_PHEC: [],
      // 자식한테 보낼값
      startTime: "00:00",
      TimeRange: [],
      endTime: "12:00",
      //datepicker
      date: new Date().toISOString().substr(0, 10),
      s_date: new Date().toISOString().substr(0, 10),
      e_date: new Date().toISOString().substr(0, 10),
      menu1: false,
      menu2: false,
      //datepicker
      //responseData
      allData: "",
      //responseData
      selectedValue: false,
      selection: [],

      exampleSensor: "",

      nowTime: new Date(),
      data,
      select: { state: "Florida", abbr: "FL" },
      authList: [
        { name: "분", value: "minute" },
        { name: "시간", value: "hour" },
      ],
      user_auth: "minute",

      user_auth_rule: [(v) => !!v || "조회단위는 필수 선택 사항입니다."],

      selected: {},

      room: this.$route.params.section,
      item: {},
      temphumidItem: "",
      cropName: "",
      sowingDay: "",
      menu: false,
      cropInfo: {},
      selectedTime: "12:00",
      temphumidData: [],
      soilData: [],
      co2Data: [],
      outdoorData: [],
      inTemperature: [],
      inputDate: [2022, 9, 6, 3, 14],
      dataObj: {},
      newData: [
        {
          name: "온/습도",
          resData: [],
          resData2: [],
          selectedName: [],
          num: 3,
          sensorNames: [],
          createdDate: [],
          division: "",
          tempTag: "온도",
          humidTag: "습도",
          AVG: [],
          AVG2: [],
          nowTemp: "",
          nowHumid: "",
          startDate: "",
          endDate: "",
        },

        {
          name: "양액pH/EC",
          resData: [],
          selectedName: [],
          sensorNames: [],
          division: "",
          tempTag: "양액 pH",
          humidTag: "양액 pH",
          createdDate: [],
          startDate: "",
          endDate: "",
        },
      ],
      isLoading: true,
    };
  },
  computed: {
    ...mapGetters({
      cropname: "GET_CROPNAME",
      sowingday: "GET_SOWINGDAY",
      cropstatus: "GET_CROPSTATUS",
    }),
    newInfo: function () {
      return [
        { key: "작물명", content: this.cropname },
        { key: "파종일", content: this.sowingday },
        { key: "작물상태", content: this.cropstatus },
      ];
    },
  },

  mounted() {
    this.room = this.section;
  },
  created() {
    // this.getToday();
    // ${this.sectionNum}에 있으면
    // store에 넣고, LS에 넣고
    console.log(this.section, this.sectionNum);
    this.room = this.section;
    if (this.sectionNum != null && this.room != null) {
      this.$store.commit("setSectionNum", `${this.sectionNum}`);
      localStorage.setItem("sectionNum", `${this.sectionNum}`);
      this.$store.commit("setRoom", `${this.room}`);
      localStorage.setItem("room", `${this.room}`);
    } else if (this.sectionNum == null && this.room == null) {
      this.room = localStorage.getItem("room");
      this.sectionNum = localStorage.getItem("sectionNum");
      this.$store.commit("setSectionNum", `${this.sectionNum}`);
    }

    // ${this.sectionNum}에 없으면
    // LS에 있는걸 store에 옮겨넣어요

    this.getTime();

    this.selectedDate();
  },

  methods: {
    test() {
      //시작날짜+시작시간 더하기
      var plusStartDate = this.s_date + " " + this.startTime + ":00";
      //표준시로 바꾸기
      let localStartDate = Date.parse(plusStartDate);
      // 최종시작날짜

      //밀리초를 날짜로 변환
      let milliseconds = localStartDate;
      let dddddate = new Date(milliseconds);

      //종료날짜+종료시간 더하기
      var plusEndDate = this.e_date + " " + this.endTime + ":00";
      // 밀리초화하기
      let localEndDate = Date.parse(plusEndDate);

      //각각 밀리초화 한 시작시간과 종료시간

      //시작시간~종료시간 의 범위를 밀리초로 계산하고 어레이에 담기
      let rangeArr = [];
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

    transferDate(dateList, type) {
      console.log(dateList);
      function leftPad(value) {
        if (value >= 10) return value;
        else return `0${value}`;
      }

      let date = new Date(
        dateList[0],
        dateList[1],
        dateList[2],
        dateList[3],
        dateList[4]
      );

      const year = date.getFullYear();
      const month = leftPad(date.getMonth());
      const day = leftPad(date.getDate());
      const hour = date.getHours();
      const minute = leftPad(date.getMinutes());

      if (type == "time") return [hour, minute].join(":");
      if (type == "date") return [month, day].join("-");
    },

    getTime() {
      const date = new Date();
      const hr = String(date.getHours()).padStart(2, "0");
      const min = String(date.getMinutes()).padStart(2, "0");
      const cropedTime = hr + ":" + min;
      this.selectedTime = cropedTime;
    },

    async selectedDate() {
      this.test();

      // ====================== ************병수선임님 *******************

      //파라미터에 같이보낼 현재시간 14:00형식으로 구하기
      const date = new Date();

      const hours = ("0" + date.getHours()).slice(-2);
      const minutes = ("0" + date.getMinutes()).slice(-2);
      const timeStr = " " + hours + ":" + minutes;

      //파라미터에 같이보낼 현재시간 14:00형식으로 구하기

      let filter = {
        facilityId: this.room,
        section: this.sectionNum,
        startDate: this.s_date,
        endDate: this.e_date,
      };

      this.isLoading = true;
      api.smartfarm.getGraphTempHumid(filter).then((res) => {
        this.isLoading = false;
        this.GraphData_TempHumid = res.data.responseData;
      });

      api.smartfarm.getGraphWaterPhEC(filter).then((res) => {
        this.GraphData_PHEC = res.data.responseData;
      });

      //     temphumid(filter).then((result) => {
      //       this.isLoading = false;
      //       console.log('템프휴미디의 결과', result.data.responseData);
      //       this.allData = result.data.responseData;
      //       //responseData의temperature을 newData에 바인딩
      //       this.newData[0].resData = _.map(this.allData, 'temperature');
      //       //responseData의 humid를 newData에 바인딩
      //       this.newData[0].resData2 = _.map(this.allData, 'humidity');
      //       //responseData의 temperatureAVG를 newData에 바인딩
      //       this.newData[0].AVG = _.map(this.allData, 'temperatureAVG');
      //       //responseData의 humidityAVG를 newData에 바인딩
      //       this.newData[0].AVG2 = _.map(this.allData, 'humidityAVG');
      //       //responseData의 createdDate를 로컬데이트로 가공
      //       this.newData[0].createdDate = _.map(this.allData, 'createdDate');

      //       this.newData[0].sensorNames = _.map(this.allData, 'sensorCode');
      //       // responseData의 division을 data return으로 저장
      //       this.newData[0].division = this.allData[0].division;
      //     });

      //     try {
      //       var temphumidResult = await temphumid;

      //       this.newData[0].createdDate = _.map(temphumidResult, 'createdDate');
      //       this.newData[0].division = _.map(temphumidResult, 'division');
      //       this.newData[0].sensorNames = _.map(temphumidResult, 'sensorCode');
      //     } catch (e) {
      //       // this.newData[0].resData = [];
      //       // this.newData[0].resData2 = [];

      //       console.log('temphumid api의 에러입니다.', e);
      //     }
      //   },

      //   getData() {
      //     this.item = {
      //       room: this.room,
      //       section: this.sectionNum,
      //     };
      //     crop(this.item)
      //       .then((response) => {
      //         console.log(response.data);
      //         this.$store.commit(
      //           'setCropName',
      //           `${response.data.cropInfo.cropName}`
      //         ); //작물명 스토어에 저장
      //         const cropedSowingDay = response.data.createdDate.substr(0, 8);
      //         this.$store.commit('setSowingDay', cropedSowingDay); //파종일 스토어에 저장
      //         this.$store.commit('setCropStatus', `${response.data.cropStatus}`); //작물상태 스토어에 저장
      //       })
      //       .catch((error) => {
      //         console.log(error);
      //       });
      //   },

      //   goBack() {
      //     this.$router.push('Monitoring');
      //     localStorage.setItem('room', '');
      //     localStorage.setItem('sectionNum', '');
      //     localStorage.setItem('cropInfo', '');
      //     this.$store.commit('setCropName', '');
      //     this.$store.commit('setCropStatus', '');
      //     this.$store.commit('setSowingDay', '');
      //   },
      //   change() {
      //     console.log(this.selection);
      //     console.log('칩이선택되었습니다.');
      //   },
      // },
    },
  },
};
</script>

<style lang="scss" scoped>
input {
  border-color: grey;
  border-bottom-style: solid;
  border-bottom-color: grey;
  border-bottom-width: 0.5px;
}
</style>
