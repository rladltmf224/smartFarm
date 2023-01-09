<template>
  <v-container class="">
    <!-- 헤더 -->
    <v-row class="d-flex align-center py-4 px-3">
      <v-col cols="1" class="d-flex justify-center ma-0 pa-0">
        <h4 class="searchbox-title" style="white-space: nowrap">구역 선택</h4>
      </v-col>
      <v-col cols="2" class="ma-0 pa-0">
        <v-select :items="selectSection" dense solo @change="onChange()" v-model="selectedSection"></v-select>
      </v-col>
      <v-col cols="3" class="d-flex justify-end ma-0 pa-0 pr-4">
        <h6 class="searchbox-title" @click="getData()">
          <v-icon class="pr-1">mdi-reload</v-icon>마지막 측정시간:{{
              modifiedDate
          }}
        </h6>
      </v-col>
      <v-col cols="6" class="ma-0 pa-0 d-flex">
        <div v-for="(item, i) in outdoorSensor" :key="i" class="d-flex justify-center flex-column align-center mx-1"
          style="width: 16%; border: 1px solid grey; border-radius: 4px">
          <h4 class="searchbox-title">
            {{ outdoorSensor[i].sensorname }}
          </h4>
          <h5>{{ outdoorSensor[i].value }}{{ outdoorSensor[i].unit }}</h5>
        </div>
      </v-col>
    </v-row>

    <v-row class="red d-flex" v-if="yes">
      <v-col cols="12" class="" style="overflow: auto; padding-left: 325px">
      </v-col>
    </v-row>

    <v-row class="" v-if="yes">
      <v-card class="ma-2 my-12" width="300" color="#F6F8F9">
        <v-card-text>
          <v-row align="center" class="mx-0"> </v-row>
          <!-- 내부환경 -->
          <div class="my-4 text-subtitle-1">내부 환경</div>

          <div class="d-flex justify-center" style="width: 140px">
            <div class="d-flex flex-column">
              <div class="d-flex">
                <h5 class="pr-5 d-flex justify-lg-space-between" style="width: 70px">
                  온 도
                </h5>
              </div>
              <div class="d-flex">
                <h5 class="pr-5 d-flex justify-lg-space-between" style="width: 70px">
                  습 도
                </h5>
                <h5>70%</h5>
              </div>
            </div>
          </div>
        </v-card-text>

        <v-divider class="mx-4"></v-divider>
        <!-- 제어divider환경 -->
        <v-card-text>
          <div class="my-4 text-subtitle-1">제어 환경</div>
          <div class="d-flex justify-center" style="width: 140px">
            <div class="d-flex flex-column">
              <div class="d-flex">
                <h5 class="pr-5 d-flex justify-lg-space-between" style="width: 70px">
                  L E D
                </h5>
                <h5>40°C</h5>
              </div>
              <div class="d-flex">
                <h5 class="pr-5 d-flex justify-lg-space-between" style="width: 70px">
                  팬
                </h5>
                <h5>70%</h5>
              </div>
              <div class="d-flex">
                <h5 class="d-flex justify-lg-space-between" style="width: 70px">
                  가 습 기
                </h5>
                <h5>70%</h5>
              </div>
            </div>
          </div>
        </v-card-text>
        <!-- 하단부 -->
        <v-card-actions>
          <v-list-item class="grow">
            <v-list-item-avatar color="grey darken-3">
              <v-img class="elevation-6" alt=""
                src="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"></v-img>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>1번</v-list-item-title>
            </v-list-item-content>

            <v-row align="center" justify="end">
              <v-btn text class="pa-0 ma-0">
                <v-icon class="mr-1"> mdi-eye </v-icon>
                <span class="subheading mr-2">조회</span></v-btn>
              <v-btn text class="pa-0 ma-0">
                <v-icon class="mr-1"> mdi-cog-pause </v-icon>
                <span class="subheading">제어</span></v-btn>
            </v-row>
          </v-list-item>
        </v-card-actions>
      </v-card>
    </v-row>

    <v-row class="d-flex justify-md-center">
      <v-card width="350" class="ma-3 pa-0" v-for="(item, i) in cards" :key="i">
        <v-app-bar color="#CFD8DC" dense elevation="0">
          <v-toolbar-title>{{ item.num }}번 구역</v-toolbar-title>
        </v-app-bar>

        <v-row dense>
          <v-col cols="12" class="mt-4 mb-0 d-flex justify-center pa-4">
            <div class="d-flex px-6 flex-column">
              <div class="d-flex">
                <h5 class="pr-5 d-flex justify-lg-space-between" style="width: 70px">
                  온 도
                </h5>
                <h5>{{ item.Temperature }}{{ item.temp_unit }}</h5>
              </div>
              <div class="d-flex">
                <h5 class="pr-5 d-flex justify-lg-space-between" style="width: 70px">
                  습 도
                </h5>
                <h5>{{ item.Humidity }}{{ item.humidity_unit }}</h5>
              </div>
            </div>
            <v-divider vertical class=""></v-divider>

            <div class="d-flex px-4 justify-center">
              <div class="d-flex flex-column">
                <div class="d-flex">
                  <h5 class="pr-5 d-flex justify-lg-space-between" style="width: 70px">
                    L E D
                  </h5>
                  <h5>{{ item.LED }}</h5>
                </div>
                <div class="d-flex">
                  <h5 class="pr-5 d-flex justify-lg-space-between" style="width: 70px">
                    팬
                  </h5>
                  <h5>{{ item.fan }}</h5>
                </div>
                <div class="d-flex">
                  <h5 class="d-flex justify-lg-space-between" style="width: 70px">
                    가 습 기
                  </h5>
                  <h5>{{ item.humidifier }}</h5>
                </div>
              </div>
            </div>
          </v-col>

          <!-- 다이아로그 -->

          <!-- 다이아로그 -->
          <!--               @click="goDetailRouter()"
 -->
          <v-row class="ma-0 pa-2" align="center" justify="end">
            <v-btn color="green" @click.stop="dialog = true" text>
              <v-icon class="mr-1"> mdi-eye </v-icon>

              조회
            </v-btn>

            <v-btn text class="pa-0 ma-0" color="primary" @click="goControllPage()">
              <v-icon class="mr-1"> mdi-cog-pause </v-icon>
              <span class="subheading">제어</span></v-btn>
          </v-row>
        </v-row>
      </v-card></v-row><v-row>
      <div>
        <textarea v-model="message" />
        <v-btn @click="sendRequestBody()">전송</v-btn>
      </div>
    </v-row>

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
          <MonitoringGraph :sectionNum="this.sectionNum" :section="this.section"></MonitoringGraph>
        </v-card>
      </v-dialog>
    </v-row>
    <!-- 다이아로그 -->
  </v-container>
</template>

<script>
import {
  outdoorHistory,
  temphumidValue,
  getEquipmentInfo,
} from '@/api/index.js';
import Data from '@/data/Data.json';
import MonitoringGraph from './MonitoringGraph.vue';
import CardTest from './CardTest.vue';
const data = Data;

export default {
  name: 'MESFE2Monitoring',
  components: {
    MonitoringGraph,

    CardTest,
  },
  data() {
    return {
      //다이아로그
      dialog: false,
      notifications: false,
      sound: true,
      widgets: false,
      //다이아로그
      // 현재온습도
      nowTemp: 0,
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
        },
        {
          num: 3,

          Temperature: 0,
          Humidity: 0,
          unit: 'kWh/m2',
          fan: 'OFF',
          LED: 'OFF',
          humidifier: 'OFF',
        },

        {
          num: 4,

          Temperature: 0,
          Humidity: 0,
          unit: 'kWh/m2',
          fan: 'OFF',
          LED: 'OFF',
          humidifier: 'OFF',
        },

        {
          num: 5,

          Temperature: 0,
          Humidity: 0,
          unit: 'kWh/m2',
          fan: 'OFF',
          LED: 'OFF',
          humidifier: 'OFF',
        },

        {
          num: 6,

          Temperature: 0,
          Humidity: 0,
          unit: 'kWh/m2',
          fan: 'OFF',
          LED: 'OFF',
          humidifier: 'OFF',
        },

        {
          num: 7,

          Temperature: 0,
          Humidity: 0,
          unit: 'kWh/m2',
          fan: 'OFF',
          LED: 'OFF',
          humidifier: 'OFF',
        },
        {
          num: 8,

          Temperature: 0,
          Humidity: 0,
          unit: 'kWh/m2',
          fan: 'OFF',
          LED: 'OFF',
          humidifier: 'OFF',
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
          value: this.solarRadiation,
          unit: 'kWh/m2',
        },
        {
          sensorname: '강수량',
          value: this.rainfall,
          unit: 'mm',
        },
        {
          sensorname: '풍향',
          value: this.windDirection,
          unit: 'm/s',
        },
        {
          sensorname: '풍속',
          value: this.windSpeed,
          unit: 'm/s',
        },
        {
          sensorname: '온도',
          value: this.outdoorTemperature,
          unit: '°C',
        },
        {
          sensorname: '습도',
          value: this.outdoorHumidity,
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
    // this.getNowData();

    console.log('cookie', this.$cookies.get('accessToken'));
  },

  async created() {
    var ws = new WebSocket('ws://192.168.0.12:8080/ws');
    this.socket = ws;
    console.log('웹소켓확인', ws);
    //이벤트 헨들러
    ws.onopen = function () {
      console.log('[open] 커넥션이 만들어졌습니다.');
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

    // this.sendRequestBody();

    ws.onmessage = function (event) {
      // console.log('서버로부터 전송받은데이터:' + event + '\n');
      // console.log('서버로부터받은 깐 데이터', event.data);
      if (event.data === undefined) {
        console.log('언디파인드입니다');
      } else {
        console.log('데이터가있습니다', event.data);
        var TempData = event.data[0];
        console.log('TempData', TempData);
        this.cards[0].Temperature = TempData;
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
    // 웹소켓
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
    onChange() {
      console.log(this.selectedSection);
    },
    getData() {
      // outdoorHistory()
      //   .then((response) => {
      //     console.log(response.data);
      //     this.modifiedDate = response.data.modifiedDate;
      //     this.outdoorSensor[0].value = response.data.solarRadiation;
      //     this.outdoorSensor[1].value = response.data.rainfall;
      //     this.outdoorSensor[2].value = response.data.windDirection;
      //     this.outdoorSensor[3].value = response.data.windSpeed;
      //     this.outdoorSensor[4].value = response.data.outdoorTemperature;
      //     this.outdoorSensor[5].value = response.data.outdoorHumidity;
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //     alert('통신실패');
      //     this.modifiedDate = '-';
      //     this.outdoorSensor[0].value = '-';
      //     this.outdoorSensor[1].value = '-';
      //     this.outdoorSensor[2].value = '-';
      //     this.outdoorSensor[3].value = '-';
      //     this.outdoorSensor[4].value = '-';
      //     this.outdoorSensor[5].value = '-';
      //   });
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
