<template>
  <v-container class="">
    <v-row class="d-flex align-center justify-center py-4 px-3">
      <v-col cols="2" sm="3" class="d-flex align-center">
        <h4 class="pr-2 searchbox-title" style="white-space: nowrap">
          구역 선택
        </h4>

        <v-select :items="selectSection" dense solo @change="onChange()" v-model="selectedSection"></v-select>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="6" sm="7" class="ma-0 pa-0 d-flex">
        <v-card v-for="(item, i) in outdoorSensor" :key="i" class="d-flex justify-center flex-column align-center mx-1"
          min-width="80">
          <h4 class="searchbox-title">
            {{ outdoorSensor[i].sensorname }}
          </h4>
          <h5>{{ outdoorSensor[i].value }}{{ outdoorSensor[i].unit }}</h5>
        </v-card>
        <v-btn :loading="loading5" :disabled="loading5" color="#CFD8DC" class="ma-2 white--text" fab x-small elevation="0"
          @click="(loader = 'loading5'), getOutDoor()">
          <v-icon dark> mdi-reload </v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-row class="d-flex ma-0 pa-0 justify-md-center">
      <v-card max-width="500" class=" ma-3 pa-0 pb-3" v-for="(item, i) in cards" :key="i">
        <v-app-bar color="#CFD8DC" dense elevation="0">
          <v-toolbar-title>{{ item.num }}번 구역</v-toolbar-title>
        </v-app-bar>

        <v-row dense>
          <v-col cols="12" class="mt-4 mb-0 d-flex justify-center pa-4">
            <div class="d-flex px-6 flex-column ">
              <div class="d-flex">
                <h4 class="pr-5 d-flex justify-lg-space-between" style="width: 70px">
                  온 도
                </h4>
                <h4>{{ nowTemp }}{{ item.temp_unit }}</h4>
              </div>
              <div class="d-flex">
                <h4 class="pr-5 d-flex justify-lg-space-between" style="width: 70px">
                  습 도
                </h4>
                <h4>{{ nowHumid }}{{ item.humidity_unit }}</h4>
              </div>
            </div>
            <v-divider vertical class=""></v-divider>

            <div class=" d-flex px-4 justify-center">
              <div class="d-flex flex-column">
                <div class="d-flex">
                  <h4 class="pr-5 d-flex justify-lg-space-between" style="width: 70px">
                    L E D
                  </h4>
                  <h4>{{ item.LED }}</h4>
                </div>
                <div class="d-flex">
                  <h4 class="pr-5 d-flex justify-lg-space-between" style="width: 70px">
                    팬
                  </h4>
                  <h4>{{ item.fan }}</h4>
                </div>
                <div class="d-flex">
                  <h4 class="d-flex justify-lg-space-between" style="width: 70px">
                    가 습 기
                  </h4>
                  <h4>{{ item.humidifier }}</h4>
                </div>
              </div>
            </div>
          </v-col>

          <!-- 다이아로그 -->

          <!-- 다이아로그 -->
          <!--               @click="goDetailRouter()"
 -->
          <v-row class="ma-0 pa-2 " align="center" justify="end">
            <v-btn color="green" text @click="openDialog()">
              <!-- 바깥조회버튼눌리면 dialog오픈 ,  -->
              <v-icon class="mr-1"> mdi-eye </v-icon>

              조회
            </v-btn>

            <v-btn text class="pa-0 ma-0" color="primary" @click="goControllPage()">
              <v-icon class="mr-1"> mdi-cog-pause </v-icon>
              <span class="subheading">제어</span></v-btn>
          </v-row>
        </v-row>
      </v-card></v-row>

    <!-- 다이아로그 -->
    <v-row justify="center">
      <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card>
          <v-toolbar dense color="#CFD8DC" elevation="0">
            <v-btn icon @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>

            <h4 class="px-1">모니터링</h4>
            <h4 class="px-1">></h4>
            <h4 class="px-1">{{ this.section }}</h4>
            <h4 class="px-1">></h4>
            <h4 class="px-1">{{ this.sectionNum }}번구역</h4>
            <v-spacer></v-spacer>
          </v-toolbar>

          <!-- MonitoringGraph내용 -->
          <v-container fluid class="pa-0 ma-0">
            <v-row class="pa-0">
              <v-col lg="12" class="pa-0 ma-0">
                <v-sheet class="pa-8" color="#F6F8F9" max-width="auto" height="100vh" style="overflow: auto">
                  <!-- 조회일,조회시간 -->
                  <v-row class="align-center">
                    <div class="px-4">
                      <h4 class="searchbox-title">조회정보</h4>
                    </div>
                    <!-- 시작일 -->
                    <v-col cols="3" lg="2" class="">
                      <v-menu v-model="menu1" :close-on-content-click="false" :nudge-right="40"
                        transition="scale-transition" offset-y min-width="auto">
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field v-model="s_date" label="시작일" prepend-icon="mdi-calendar" readonly v-bind="attrs"
                            v-on="on"></v-text-field>
                        </template>
                        <v-date-picker v-model="s_date" @input="menu1 = false"></v-date-picker>
                      </v-menu>
                    </v-col>

                    <!-- 종료일 -->
                    <v-col cols="3" md="3" lg="2" class="">
                      <v-menu v-model="menu2" :close-on-content-click="false" :nudge-right="40"
                        transition="scale-transition" offset-y min-width="auto">
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field v-model="e_date" label="종료일" prepend-icon="mdi-calendar" readonly v-bind="attrs"
                            v-on="on"></v-text-field>
                        </template>
                        <v-date-picker v-model="e_date" @input="menu2 = false" :min="s_date" :max="date"></v-date-picker>
                      </v-menu>
                    </v-col>

                    <v-btn class="ml-6 primary" @click="selectedDate()">조회</v-btn>
                  </v-row>
                  <!-- 선택된 조회값 -->

                  <v-row>
                    <v-col cols="12">
                      <div class="pa-0 d-flex align-center">
                        <h4 class="searchbox-title pr-4" style="white-space: nowrap">
                          조회 센서
                        </h4>

                        <v-chip-group v-model="selection" multiple active-class="primary--text">
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
                        <v-card class="pa-3 ma-2" v-if="this.selection.includes(0)">
                          <div class="d-flex align-center">
                            <h3 class="pr-3 searchbox-title" style="white-space: nowrap">
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

                          <TestGraphTemp :Data_TempHumid="Data_TempHumid" name="humid"></TestGraphTemp>
                        </v-card>
                        <!-- 양액ECPH카드 -->
                        <v-card class="ma-2 pa-3" v-if="this.selection.includes(1)">
                          <h3 class="searchbox-title" style="white-space: nowrap">
                            {{ newData[1].name }}
                          </h3>
                          <TestGraphWater :Data_Water="Data_Water" name="ECPH"></TestGraphWater>
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
  </v-container>
</template>

<script>
import _ from 'lodash';

import LoadingSpinner from './Loading/LodingSpinner.vue'; // 로딩스피너
import axios from 'axios';
import Vue from 'vue';
import {
  outdoorHistory,
  getEquipmentInfo,
  temphumidValue,
  getGraphWaterPhEC, //양액 EC,PH 그래프 (모니터링페이지)
  getGraphTempHumid, //온습도 그래프 (모니터링페이지)
} from '@/api/index.js';
import Data from '@/data/Data.json';
import MonitoringGraph from './MonitoringGraph.vue';
import CardTest from './CardTest.vue';
import TestGraphTemp from './TestGraphTemp.vue';
import TestGraphWater from './TestGraphWater.vue';

const data = Data;

export default {
  name: 'MESFE2Monitoring',
  components: {
    MonitoringGraph,
    CardTest,
    LoadingSpinner,
    TestGraphTemp,
    TestGraphWater,
  },
  data() {
    return {
      // 외부센서로딩
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
          name: '온/습도',
          value: [],
          startDate: '',
          endDate: '',
          nowValue_Temp: 0,
          nowValue_Humid: 0,
          unit: [
            { name: '온도', unit: '°C' },
            { name: '습도', unit: '%' },
          ],
        },
      ],
      Data_Water: [
        {
          name: '양액pH/EC',
          value: '',
          startDate: '',
          endDate: '',
          nowValue: '',
        },
      ],
      // 온습도데이터
      // chip
      tags: ['온/습도', '양액pH/EC'],
      // chip
      //datepicker
      date: new Date().toISOString().substr(0, 10),
      s_date: new Date().toISOString().substr(0, 10),
      e_date: new Date().toISOString().substr(0, 10),
      menu1: false,
      menu2: false,
      //datepicker
      //  checkbox
      selected: ['온/습도', '양액pH/EC'],
      //  checkbox

      selection: [0, 1],
      newData: [
        {
          name: '온/습도',
          value: '',
          startDate: '',
          endDate: '',
          nowValue: '',
        },

        {
          name: '양액pH/EC',
          value: '',
          startDate: '',
          endDate: '',
          nowValue: '',
        },
      ],

      // MonitoringGraph
      //다이아로그
      dialog: false,
      notifications: false,
      sound: true,
      widgets: false,
      //다이아로그
      // 현재온습도
      nowTemp: 0,
      nowHumid: 0,
      cards: [
        //5.외부센서,측정값
        {
          num: 1,
          Temperature: 0,
          Humidity: 0,
          unit: 'kWh/m2',
          fan: '',
          LED: '',
          humidifier: '',
          temp_unit: '°C',
          humidity_unit: '%',
        },
        {
          num: 2,

          Temperature: 0,
          Humidity: 0,
          unit: 'kWh/m2',
          fan: 'OFF',
          LED: 'OFF',
          humidifier: 'OFF',
          temp_unit: '°C',
          humidity_unit: '%',
        },
        {
          num: 3,

          Temperature: 0,
          Humidity: 0,
          unit: 'kWh/m2',
          fan: 'OFF',
          LED: 'OFF',
          humidifier: 'OFF',
          temp_unit: '°C',
          humidity_unit: '%',
        },

        {
          num: 4,

          Temperature: 0,
          Humidity: 0,
          unit: 'kWh/m2',
          fan: 'OFF',
          LED: 'OFF',
          humidifier: 'OFF',
          temp_unit: '°C',
          humidity_unit: '%',
        },

        {
          num: 5,

          Temperature: 0,
          Humidity: 0,
          unit: 'kWh/m2',
          fan: 'OFF',
          LED: 'OFF',
          humidifier: 'OFF',
          temp_unit: '°C',
          humidity_unit: '%',
        },

        {
          num: 6,

          Temperature: 0,
          Humidity: 0,
          unit: 'kWh/m2',
          fan: 'OFF',
          LED: 'OFF',
          humidifier: 'OFF',
          temp_unit: '°C',
          humidity_unit: '%',
        },

        {
          num: 7,

          Temperature: 0,
          Humidity: 0,
          unit: 'kWh/m2',
          fan: 'OFF',
          LED: 'OFF',
          humidifier: 'OFF',
          temp_unit: '°C',
          humidity_unit: '%',
        },
        {
          num: 8,

          Temperature: 0,
          Humidity: 0,
          unit: 'kWh/m2',
          fan: 'OFF',
          LED: 'OFF',
          humidifier: 'OFF',
          temp_unit: '°C',
          humidity_unit: '%',
        },
        {
          num: 8,

          Temperature: 0,
          Humidity: 0,
          unit: 'kWh/m2',
          fan: 'OFF',
          LED: 'OFF',
          humidifier: 'OFF',
          temp_unit: '°C',
          humidity_unit: '%',
        },

        //외부센서 측정값
      ],
      // 현재온습도
      yes: false,
      data,
      selectedSection: '육묘실', // 1.구역 디폴트값 육묘실
      selectSection: ['육묘실', '활착실', '발아실'], // 2.구역선택,
      solarRadiation: '',
      modifiedDate: '',
      rainfall: '',
      windDirection: '',
      windSpeed: '',
      outdoorTemperature: '',
      outdoorHumidity: '',
      outdoorSensor: [
        //5.외부센서,측정값
        {
          sensorname: '일사량',
          value: '-',
          unit: 'kWh/m2',
        },
        {
          sensorname: '강수량',
          value: '-',
          unit: '',
        },
        {
          sensorname: '풍속(동서)',
          value: '-',
          unit: 'm/s',
        },
        {
          sensorname: '풍속(남북)',
          value: '-',
          unit: 'm/s',
        },
        {
          sensorname: '풍향',
          value: '-',
          unit: 'm/s',
        },
        {
          sensorname: '온도',
          value: '-',
          unit: '°C',
        },
        {
          sensorname: '습도',
          value: '-',
          unit: '%',
        },

        //외부센서 측정값
      ],
      showSection: 1, //1,2,3에 따라 섹션 라우터 변경함
      sectionNum: 1,
      section: '육묘실',
      logs: [],
      status: 'disconnected',
      // 웹소켓
      socket: null,
      message: '',
      receivedMessage: [],
      textarea: '',
      socketId: '',

      // 웹소켓
    };
  },

  mounted() {
    this.getOutDoor();
    this.BeforeWeeks;
    this.getEquipMentInFormation();
    console.log('템프휴미드', this.Data_TempHumid[0].unit[0].unit);
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
    var ws = new WebSocket('ws://192.168.0.12:8080/ws');
    this.socket = ws;
    console.log('웹소켓확인', ws);
    //이벤트 헨들러
    ws.onopen = function () {
      // console.log('[open] 커넥션이 만들어졌습니다.');
      var item = {
        api: 'temphumidValue',
        method: 'add',
        parameters: {
          room: '육묘실',
          section: 1,
        },
      };
      ws.send(JSON.stringify(item));
    };
    let _this = this; //소영선임님이 알려주신 this안될때 대처법
    ws.onmessage = function (event) {
      if (event.data === undefined) {
        console.log('웹소켓연결되지않음');
      } else {
        // console.log('웹소켓으로 받은데이터', event.data);
        // JSON.parse로풀기
        const obj = JSON.parse(event.data);

        // console.log('소켓으로받은현재온도', obj.data[0].temperature);
        // console.log('소켓으로받은현재습도', obj.data[0].humidity);
        _this.nowTemp = obj.data[0].temperature;
        _this.nowHumid = obj.data[0].humidity;
        // console.log('디스로그디스로그디스로그', _this.logs);
      }
    };

    ws.onclose = (evt) => {
      console.log(evt);
    };
    ws.onerror = (evt) => {
      console.log(evt);
    };

    // 보내는 코드
  },

  methods: {
    onChange() {
      console.log('선택된구역', this.selectedSection);
    },
    // 기상센서 api 호출 전 데이터초기화
    resetOutDoorValue() {
      for (var i = 0; i < this.outdoorSensor.length; i++) {
        this.outdoorSensor[i].value = '-';
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

      console.log('baseTime', baseTime);

      let baseDate = `${date.getFullYear()}${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}${baseTime == 23
          ? (date.getDate() - 1).toString().padStart(2, '0')
          : date.getDate().toString().padStart(2, '0')
        }`; //금일. //padStart = 빈값을 0으로 대체
      console.log(baseDate);
      let reqData = {
        ServiceKey:
          'wj8ZRg3W8rO130Cl7eOUkJQ9Xq6OMen3Qwt7BhjXS0JoMz33mL3PXGeQddnGZJM80yO77v7paxo2H5hFtSHkCw==',
        pageNo: encodeURIComponent(1),
        numOfRows: encodeURIComponent(36), //12시간의 데이터= 1시간
        dataType: encodeURIComponent('JSON'),
        base_date: encodeURIComponent(baseDate),
        base_time: encodeURIComponent(
          `${baseTime.toString().padStart(2, '0')}00`
        ),
        nx: encodeURIComponent('62'),
        ny: encodeURIComponent('119'),
      };
      axios
        .get(
          'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst',
          {
            headers: { 'Content-Type': 'text/xml;charset=UTF-8' },
            params: reqData,
          }
        )
        .then((res) => {
          console.log(res);

          console.log(res.data.response.body.items);
          var Arr = res.data.response.body.items.item;

          var Out_RainFall = _.filter(Arr, { category: 'PCP' });
          console.log('강수량', Out_RainFall[0].fcstValue);
          this.outdoorSensor[1].value = Out_RainFall[0].fcstValue;

          var Out_Humid = _.filter(Arr, { category: 'REH' });
          console.log('습도', Out_Humid[0].fcstValue);
          this.outdoorSensor[6].value = Out_Humid[0].fcstValue;

          var Out_Temp = _.filter(Arr, { category: 'TMP' });
          console.log('온도', Out_Temp[0].fcstValue);
          this.outdoorSensor[5].value = Out_Temp[0].fcstValue;

          var Out_WindSpeed_EeastWest = _.filter(Arr, { category: 'UUU' });
          console.log('동서쪽풍속', Out_WindSpeed_EeastWest[0].fcstValue);
          this.outdoorSensor[2].value = Out_WindSpeed_EeastWest[0].fcstValue;

          var Out_WindSpeed_South = _.filter(Arr, { category: 'VVV' });
          console.log('남북쪽풍속', Out_WindSpeed_South[0].fcstValue);
          console.log('남북쪽풍속', Out_WindSpeed_South);
          this.outdoorSensor[3].value = Out_WindSpeed_South[0].fcstValue;

          var Out_WindDirection = _.filter(Arr, { category: 'VEC' });
          console.log('풍향', Out_WindDirection[0].fcstValue);
          this.outdoorSensor[4].value = Out_WindDirection[0].fcstValue;
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
        weekMonth = '0' + weekMonth;
      }
      if (weekDay < 10) {
        weekDay = '0' + weekDay;
      }

      let resultDate = weekYear + '-' + weekMonth + '-' + weekDay;
      this.s_date = resultDate;
      console.log(resultDate);
    },
    async openDialog() {
      this.dialog = true;
      await this.selectedDate();
    },
    closeDialog() {
      this.dialog = false;
    },
    // 시작일을 일주일전으로
    //  MonitoringGraph

    // 병수선임님이 알려준 비동기 api여러개 처리법
    selectedDate() {
      let filter = {
        room: this.section,
        section: this.sectionNum,
        startDate: this.s_date,
        endDate: this.e_date,
      };

      this.isLoading = true;

      let p1 = new Promise((resolve, reject) => {
        getGraphTempHumid(filter).then((res) => {
          let result = res.data.responseData;
          this.Data_TempHumid.value = result;
          this.Data_TempHumid.startDate = this.s_date;
          this.Data_TempHumid.endDate = this.e_date;
          resolve(res);
        });
      });
      let p2 = new Promise((resolve, reject) => {
        getGraphWaterPhEC(filter).then((res) => {
          let result = res.data.responseData;
          this.Data_Water.value = result;
          this.Data_Water.startDate = this.s_date;
          this.Data_Water.endDate = this.e_date;
          resolve(res);
        });
      });
      let item = {
        room: this.section,
        section: this.sectionNum,
      };
      let p3 = new Promise((resolve, reject) => {
        temphumidValue(item).then((res) => {
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
        });

      // 줄여볼수있으면줄여보기

      // 병수선임님이 알려준 비동기 api여러개 처리법
    },
    //  MonitoringGraph
    sendRequestBody() {
      this.message = {
        api: 'temphumidValue',
        method: 'add',
        parameters: {
          room: '육묘실',
          section: 1,
        },
      };

      this.socket.send(JSON.stringify(this.message));
    },
    // 웹소켓
    goControllPage() {
      //제어페이지로 가는 api
      this.$router.push({
        name: 'ShowControll',
        params: { sectionNum: this.sectionNum, section: this.section },
      });
    },
    goDetailRouter() {
      //조회페이지로 가는api
      console.log('섹션넘', this.sectionNum, this.section);
      this.$router.push({
        name: 'MonitoringGraph',
        params: { sectionNum: this.sectionNum, section: this.section },
      });
    },

    getData() {
      this.getNowData();
    },
    getAllData() {
      this.getNowData;
      this.getEquipMentInFormation();
    },
    getNowData() {
      var item = {
        room: '육묘실',
        section: 1,
      };
      temphumidValue(item).then((res) => {
        console.log(res);
        this.cards[0].Temperature = res.data.responseData.temperature;
        this.cards[0].Humidity = res.data.responseData.humidity;
        console.log(this.cards);
      });
      this.getEquipMentInFormation();
    },
    // 제어항목조회
    getEquipMentInFormation() {
      getEquipmentInfo().then((res) => {
        console.log('제어항목조회', res);
        this.cards[0].LED = res.data.responseData[3].controlStatus;
        this.cards[0].humidifier = res.data.responseData[4].controlStatus;
        this.cards[0].fan = res.data.responseData[5].controlStatus;
        console.log('제어항목조회후', this.cards);
      });
    },
    // 제어항목조회
  },
};
</script>

<style scoped>
::v-deep .v-text-field__details {
  display: none;
}
</style>
