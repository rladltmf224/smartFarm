<template>
  <div>
    <!-- <v-btn small color="green" @click="connectAlarm">알람받기</v-btn> -->
    <!-- <v-btn small color="green" @click.stop="disconnectAlarm">알람끄기</v-btn> -->
    <!-- <v-btn small color="green" @click.stop="addAlarm">알람추가</v-btn>
    <v-btn small color="green" @click.stop="removeAlarm">알람제거</v-btn> -->
    <!-- <v-btn small color="green" @click.stop="sendAlarm">알람전송</v-btn> -->
    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-badge
          overlap
          :content="alarmOn ? alarmList.length : 0"
          :value="alarmOn ? alarmList.length : 0"
          color="error"
        >
          <v-btn id="alarmBell" depressed v-bind="attrs" v-on="on" icon>
            <v-icon
              v-if="alarmOn"
              :color="alarmList.length > 0 ? 'error' : 'black'"
            >
              mdi-bell
            </v-icon>
            <v-icon v-if="!alarmOn" color="grey"> mdi-bell-off </v-icon>
          </v-btn>
        </v-badge>
      </template>
      <v-list class="alarmList">
        <v-list-item v-for="(alarm, index) in alarmList" :key="index" two-line>
          <v-list-item-content v-if="alarmOn" class="alarmItem">
            <v-list-item-title
              class="d-flex flex-row justify-space-between align-center"
            >
              <div>
                <v-chip
                  class="mr-3"
                  :color="alarm.type == 'caution' ? 'warning' : 'error'"
                >
                  {{ alarm.type == "caution" ? "주의" : "경고" }} </v-chip
                >{{ alarm.room + " " + alarm.title }}
              </div>
              <v-btn class="hidden-button" @click="checkAlarm(alarm)"
                >조 치</v-btn
              >
            </v-list-item-title>
            <v-list-item-subtitle class="pl-15">
              <span
                v-html="
                  '발&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp생 : ' +
                  alarm.createdDate +
                  '<br>' +
                  alarm.title.replace(' 이상', '') +
                  '설정 : ' +
                  alarm.setRange +
                  '<br>' +
                  alarm.value
                "
              ></span>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content @click="alarmToggle()" class="alarmItem">
            <v-list-item-title class="d-flex justify-center">
              {{ alarmOn ? "알람 끄기" : "알람 켜기" }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script lang="ts">
import _ from "lodash";
import * as api from "@/api/index.js";
import { Component, Vue, Ref, Watch } from "vue-property-decorator";
import ReconnectingWebSocket from "reconnecting-websocket";

type typeAlarm = {
  id: number; // 알람id (알람이력id 아님)
  type: string; // 알람타임 (경고, 위험 등)
  createdDate: string; // 알람 발생 시각 (알람 받은 시각 아님)
  room: string;
  title: string;
  setRange: string;
  value: string;
};

@Component({
  components: {},
  computed: {},
})
export default class Alarm extends Vue {
  alarmOn: boolean = false;
  socketAlarm: any = null;
  alarmList: typeAlarm[] = [];
  exampleAlarm: any[] = [
    {
      id: 236,
      userId: "dikang",
      userName: "dikang",
      phoneNumber: "01096445080",
      sendAlimTalk: false,
      isRead: false,
      alarmProcess: {
        id: 9001,
        type: "caution",
        content:
          "[T-FES 알림]\n\nroom : 육묘실\n알림 : 온도 이상\n설정범위 : 23.0 ~ 25.0\n현재상태\n- 대기온도 25.1'C\n- 대기습도 50.0%\n\n* 본 알림은 T-FES 이용자 전용 서비스이며, 알림수신에 동의한 이용자에게만 발송됩니다.",
        isChecked: false,
        checker: null,
        alarmTargets: [
          {
            id: 1,
            account: {
              id: 17,
              userId: "dikang",
              serName: "dikang",
              phoneNumber: "01096445080",
              alarmYN: false,
              department: {
                id: 1,
                name: "마스터부서",
              },
            },
          },
        ],
        createdDate: "2023-03-09T10:54:29.402785",
        checkedDate: null,
      },
      createdDate: "2023-03-09T15:53:46.520505",
      readDate: null,
    },
    {
      id: 6763,
      userId: "dikang",
      userName: "dikang",
      phoneNumber: "01096445080",
      sendAlimTalk: false,
      isRead: false,
      alarmProcess: {
        id: 9002,
        type: "warning",
        content:
          "[T-FES 알림]\n\nroom : 발아활착실\n알림 : 습도 이상\n설정범위 : 40.0 ~ 60.0\n현재상태\n- 대기온도 33.6'C\n- 대기습도 70.0%\n\n* 본 알림은 T-FES 이용자 전용 서비스이며, 알림수신에 동의한 이용자에게만 발송됩니다.",
        isChecked: false,
        checker: null,
        alarmTargets: [
          {
            id: 1,
            account: {
              id: 17,
              userId: "dikang",
              serName: "dikang",
              phoneNumber: "01096445080",
              alarmYN: false,
              department: {
                id: 1,
                name: "마스터부서",
              },
            },
          },
        ],
        createdDate: "2023-03-09T10:54:29.402785",
        checkedDate: null,
      },
      createdDate: "2023-03-09T15:53:46.520505",
      readDate: null,
    },
    {
      id: 253,
      userId: "dikang",
      userName: "dikang",
      phoneNumber: "01096445080",
      sendAlimTalk: false,
      isRead: false,
      alarmProcess: {
        id: 9003,
        type: "caution",
        content:
          "[T-FES 알림]\n\nroom : 육묘실\n알림 : 습도 이상\n설정범위 : 60.0 ~ 70.0\n현재상태\n- 대기온도 28.5'C\n- 대기습도 56.8%\n\n* 본 알림은 T-FES 이용자 전용 서비스이며, 알림수신에 동의한 이용자에게만 발송됩니다.",
        isChecked: false,
        checker: null,
        alarmTargets: [
          {
            id: 1,
            account: {
              id: 17,
              userId: "dikang",
              serName: "dikang",
              phoneNumber: "01096445080",
              alarmYN: false,
              department: {
                id: 1,
                name: "마스터부서",
              },
            },
          },
        ],
        createdDate: "2023-03-09T10:54:29.402785",
        checkedDate: null,
      },
      createdDate: "2023-03-09T15:53:46.520505",
      readDate: null,
    },
  ];
  exampleCheckAlarm: any[] = [
    {
      checkedDate: "2023-03-03T14:57:45.1403311",
      checked: true,
      id: 9001,
      checker: "tester",
    },
    {
      checkedDate: "2023-03-03T14:57:45.1403311",
      checked: true,
      id: 9002,
      checker: "tester",
    },
    {
      checkedDate: "2023-03-03T14:57:45.1403311",
      checked: true,
      id: 9003,
      checker: "tester",
    },
  ];
  tempIdxAdd: number = 0;
  tempIdxRemove: number = 0;

  created() {}

  mounted() {}

  beforeDestroy() {
    this.disconnectAlarm();
  }

  addAlarm() {
    this.alarmList.push(
      this.editAlarm(
        this.exampleAlarm[this.tempIdxAdd++ % this.exampleAlarm.length]
      )
    );
  }

  removeAlarm() {
    console.log(this.alarmList);
    this.alarmList = _.reject(this.alarmList, {
      id: this.exampleCheckAlarm[this.tempIdxRemove++].id,
    });
    console.log(this.alarmList);
  }

  sendAlarm() {
    api.alarm
      .sendAlarm({ userIdList: ["sylee"] })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  editAlarm(alarm: any) {
    let content = alarm.alarmProcess.content.split("\n");
    let temp: typeAlarm = {
      id: alarm.alarmProcess.id,
      type: alarm.alarmProcess.type,
      createdDate: alarm.alarmProcess.createdDate,
      room: content[2].replace("room : ", ""),
      title: content[3].replace("알림 : ", ""),
      setRange: content[4].replace("설정범위 : ", ""),
      value:
        content[6].replace("- ", "") + "<br>" + content[7].replace("- ", ""),
    };
    return temp;
  }

  connectAlarm() {
    this.socketAlarm = new ReconnectingWebSocket(
      "ws://14.47.96.237:8081/alarm?token=Bearer " +
        this.$cookies.get("accessToken"),
      [],

      {
        // WebSocket: undefined,  // WebSocket constructor, if none provided, defaults to global WebSocket
        maxReconnectionDelay: 60000, // max delay in ms between reconnections
        minReconnectionDelay: 3000, // min delay in ms between reconnections
        reconnectionDelayGrowFactor: 1.5, // how fast the reconnection delay grows
        minUptime: 5000, // min time in ms to consider connection as stable
        connectionTimeout: 4000, // retry connect if not connected after this time, in ms
        maxRetries: 10, // maximum number of retries
        maxEnqueuedMessages: Infinity, // maximum number of messages to buffer until reconnection
        startClosed: false, // start websocket in CLOSED state, call `.reconnect()` to connect
        debug: false, // enables debug output
      }
    );
    this.socketAlarm.onopen = () => {
      console.log("socketAlarm : onopen");
    };
    this.socketAlarm.onmessage = (message: any) => {
      console.log("socketAlarm : onmessage", message.data);
      let data = JSON.parse(message.data);

      // 신규 알람 발생
      if (Object.keys(data).includes("createdDate")) {
        this.alarmList.push(this.editAlarm(data));
      }

      // 내가 아닌 누군가가 알람을 조치한 경우
      if (Object.keys(data).includes("checkedDate")) {
        this.alarmList = _.reject(this.alarmList, { id: data.id });
      }
    };
    this.socketAlarm.onerror = (error: any) => {
      console.log("socketAlarm : onerror", error);
    };
    this.socketAlarm.onclose = () => {
      console.log("socketAlarm : onclose");
    };
  }

  disconnectAlarm() {
    if (this.socketAlarm) this.socketAlarm.close();
  }

  // 알람 조치
  checkAlarm(alarm: typeAlarm): void {
    this.$swal
      .fire({
        title: "확인",
        text: "해당 알람을 조치하셨습니까?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "조치완료",
        cancelButtonText: "취소",
      })
      .then((result) => {
        if (result.isConfirmed) {
          api.alarm
            .alarmCheck({ id: alarm.id })
            .then((response) => {
              console.log(response);
              this.alarmList = _.reject(this.alarmList, alarm);
              this.$swal({
                title: "조치 완료",
                icon: "success",
                position: "top",
                showCancelButton: false,
                showConfirmButton: false,
                toast: true,
                timer: 1500,
              });
            })
            .catch((error) => {
              console.log(error);
              this.$swal({
                title: "실패",
                icon: "error",
                position: "top",
                showCancelButton: false,
                showConfirmButton: false,
                toast: true,
                timer: 1500,
              });
            });

          // 테스트
          // this.alarmList = _.reject(this.alarmList, alarm);
          // this.$swal({
          //   title: "조치 완료",
          //   icon: "success",
          //   position: "top",
          //   showCancelButton: false,
          //   showConfirmButton: false,
          //   toast: true,
          //   timer: 1500,
          // });
        }
      });
  }

  alarmToggle() {
    this.alarmOn = !this.alarmOn;
    if (this.alarmOn) {
      console.log("알람을 받습니다");
      this.connectAlarm();
    } else {
      console.log("알람을 받지 않습니다");
      this.disconnectAlarm();
    }
  }

  @Watch("alarmList.length", { deep: true })
  onAlarmListChanged(newVal: number, oldVal: number): void {
    // 새로운 알림이 생긴 경우
    if (newVal - oldVal > 0) {
      let alarmIcon: HTMLElement | null = document.getElementById("alarmBell");
      if (alarmIcon) alarmIcon.click();
    }
  }
}
</script>

<style scoped>
.hidden-button {
  box-shadow: 0px 0px 0px 0px !important;
  background: transparent !important;
  color: transparent !important;
}
.alarmList {
  max-height: 500px;
  overflow-y: auto;
}

.alarmItem {
  width: 360px;
  padding: 5px;
  margin: 5px;
}
.alarmItem:hover {
  background: lightgrey;
  cursor: pointer;
}
.alarmItem:hover .hidden-button {
  background: white !important;
  color: green !important;
}
</style>
