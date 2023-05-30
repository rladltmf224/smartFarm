<template>
  <v-app-bar color="transparent" dense elevation="0">
    <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
    <v-toolbar-title>
      <div class="AppBar">
        <div>
          <slot
            >{{ pageTitleName }}
            <span v-if="pageTitleName"> ></span>
            {{ pageName }}
          </slot>
        </div>
      </div>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <Alarm></Alarm>
    <v-menu
      offset-y
      v-model="menu"
      :close-on-content-click="false"
      location="end"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          elevation="0"
          color="transparent"
          rounded
          v-bind="attrs"
          v-on="on"
        >
          <v-badge bordered bottom color="red" dot offset-x="10" offset-y="10">
            <v-avatar size="30" class="mx-2">
              <v-img src="@/assets/images/icon.png" />
            </v-avatar>
          </v-badge>
          <span>{{ userId }}님</span>
        </v-btn>
      </template>

      <v-card width="250">
        <v-list>
          <v-list-item class="d-flex flex-column">
            <v-card
              elevation="0"
              class="pa-0 mb-1"
              width="230"
              v-for="(item, index) in todayTotalList"
              :key="index"
            >
              <v-card-text>
                <v-row :link="true" :to="to_schedule">
                  <v-col cols="1" class="pa-1 todayListBox mr-4"> </v-col>
                  <v-col cols="10" class="pa-0"
                    ><span>
                      {{ `${item.customerName}의 ${item.title} 일정` }}</span
                    ><br />
                    <span style="font-size: 9px">{{
                      `${item.start} ~ ${item.end}`
                    }}</span></v-col
                  >
                </v-row>
                <!--{{ `[${item.customerName}]${item.title}` }}-->
              </v-card-text>
            </v-card>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list dense nav rounded>
          <v-list-item
            @click="mySettingDialog = true"
            @mouseover="openTooltip()"
          >
            <v-list-item-icon>
              <v-icon>mdi-account-circle-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-title>회원정보 변경</v-list-item-title>
          </v-list-item>
          <v-list-item
            @click="userInfoDialog = true"
            @mouseover="openTooltip()"
          >
            <v-list-item-icon>
              <v-icon>mdi-account-circle-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-title>비밀번호 변경</v-list-item-title>
          </v-list-item>
          <!-- <v-list-item @click="logout" @mouseover="openTooltip()">
        <v-btn block class="btn-gradient" dark v-if="!mini">
          <v-icon>mdi-power</v-icon>
          <span style="color:white">로그아웃</span>
        </v-btn>
      </v-list-item> -->

          <!--비밀번호 변경 dialog-->
          <SidebarUserInfo
            :open="userInfoDialog"
            @closeModal="close"
            @log-out="logout"
            @save-info="handlerSaveInfo"
          >
          </SidebarUserInfo>

          <SidebarMySetting
            :open="mySettingDialog"
            @closeModal="mySettingDialog = false"
            @save-info="handlerSaveInfo"
          >
          </SidebarMySetting>
        </v-list>
      </v-card>
    </v-menu>
  </v-app-bar>
</template>

<script lang="ts">
import { demo_side_data } from "@/demo/demo_data";
import _ from "lodash";
import jwt_decode from "jwt-decode";
import * as api from "@/api/index.js";
import { Component, Vue, Ref, Watch } from "vue-property-decorator";
import SidebarUserInfo from "@/components/Sidebar/SidebarUserInfo.vue";
import SidebarMySetting from "@/components/Sidebar/SidebarMySetting.vue";
import { mapGetters, mapState } from "vuex";
import Alarm from "../Sidebar/Alarm.vue";

@Component({
  components: {
    SidebarUserInfo,
    SidebarMySetting,
    Alarm,
  },
  computed: {
    pageName() {
      return this.$store.state.pageName;
    },
    pageTitleName() {
      return this.$store.state.pageTitleName;
    },
  },
})
export default class Sidebar extends Vue {
  @Ref() form: HTMLFormElement;
  to_schedule?: string = "schedule";
  menu: boolean = false;
  userId: string = "";
  mini: boolean = false;
  alarmOn: boolean = true;
  tooltip: boolean = false;
  userInfoDialog: boolean = false;
  mySettingDialog: boolean = false;
  to_home?: string = "monitoring";
  to_notdev?: string = "notdev";
  items?: any[] = [];
  items_dev?: any[] = [];
  password?: string = "";
  changePassword?: string = "";
  value?: boolean = false;
  changeValue?: boolean = false;
  passwordRules: any[] = [
    (v: any) => !!v || "비밀번호는 필수입니다",
    (v: any) =>
      /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{10,16}$/.test(
        v
      ) || "10 ~ 16자 영문, 숫자, 특수문자만 가능합니다.",
  ];

  changePasswordRules: any[] = [
    (v: any) => !!v || "비밀번호 확인은 필수입니다",
  ];
  userInfo?: object;
  todayList: any[] = [];
  todayTotalList: any[] = [];
  i: number = 0;

  // @Watch("alarmList.length", { deep: true })
  // onAlarmListChanged(newVal: number, oldVal: number): void {
  //   // 새로운 알림이 생긴 경우
  //   if (newVal - oldVal > 0) {
  //     let alarmIcon: HTMLElement | null = document.getElementById("alarmBell");
  //     if (alarmIcon) alarmIcon.click();
  //   }
  // }

  mounted() {
    this.getTodayInfo();

    this.getUserId();
    let decodeData: any = jwt_decode(this.$cookies.get("refreshToken"));
    decodeData = decodeData.roles.split(",");
    let menu_Data: any = [];
    decodeData.forEach((el: string) => {
      let menu_name = el.split("_")[0] + "_" + el.split("_")[1];
      if (el.split("_").length == 3) {
        if (_.filter(demo_side_data, { role: menu_name }).length != 0) {
          menu_Data.push(_.filter(demo_side_data, { role: menu_name })[0]);
        }
      }
    });
    menu_Data = _.filter(menu_Data, { use: "Y" });
    //this.items_dev = _.filter(demo_side_data, { use: "N" });
    this.items = _.sortBy(menu_Data, "sort");
    this.items.push(
      {
        title: "완제품관리",
        active: true,
        icon: "mdi-stack-overflow",
        role: "ROLE_operationManagement",
        use: "Y",
        sort: 5,
        subItems: [
          {
            title: "공정관리",
            to: "processmng",
          },
        ],
      },
      {
        title: "환경관리",
        active: true,
        icon: "mdi-weather-partly-snowy-rainy",
        role: "ROLE_operationManagement",
        use: "Y",
        sort: 5,
        subItems: [
          {
            title: "환경 조회 및 제어",
            to: "Monitoring",
          },
          {
            title: "이력 조회",
            to: "DetailHistory",
          },
        ],
      }
    );
    this.items.push({
      title: "양액",
      active: true,
      icon: "mdi-water-circle",
      role: "ROLE_operationManagement",
      use: "Y",
      sort: 5,
      subItems: [
        {
          title: "양액EC/pH 데이터",
          to: "InputData",
        },
        {
          title: "양액관리",
          to: "ManureMng",
        },
      ],
    });
    this.items.push({
      title: "제어",
      active: true,
      icon: "mdi-air-conditioner",
      role: "ROLE_operationManagement",
      use: "Y",
      sort: 5,
      subItems: [
        {
          title: "제어이력 조회",
          to: "ShowControllHistory",
        },
      ],
    });
    this.items.push({
      title: "실험",
      active: true,
      icon: "mdi-test-tube",
      role: "ROLE_operationManagement",
      use: "Y",
      sort: 5,
      subItems: [
        {
          title: "실험 조회",
          to: "ShowTest",
        },
        {
          title: "이미지 갤러리",
          to: "ShowImage",
        },
      ],
    });
    this.items.push({
      title: "수주관리",
      active: true,
      icon: "mdi-order-bool-descending",
      role: "ROLE_operationManagement",
      use: "Y",
      sort: 5,
      subItems: [
        {
          title: "수주관리",
          to: "OrderManagement",
        },
      ],
    });

    for (let i = 0; i < this.items.length; i++) {
      //tooltip을 위한 데이터를
      this.items[i].tooltip = false;
    }
  }

  /*  get pageName() {
     return this.$store.state.pageName;
   } */

  // alarmToggle() {
  //   this.alarmOn = !this.alarmOn;
  //   if (this.alarmOn) {
  //     console.log("알람을 받습니다");
  //   } else {
  //     console.log("알람을 받지 않습니다");
  //   }
  // }

  // removeAlarm(alarm: Object): void {
  //   this.$store.commit("ALARM/removeAlarm", alarm);
  // }

  goHome(): void {
    this.$router.push("/monitoring").catch(() => {});

    return;
  }

  // ${this.sectionNum}에 없으면
  // LS에 있는걸 store에 옮겨넣어요
  getUserId(): void {
    if (this.userId == "") {
      console.log("유저아이디가없음", this.userId);
      let local: any = localStorage.getItem("userId");
      (this.userId = JSON.parse(local) || ""),
        console.log("유저아이디가없음2222", this.userId);
    } else if (this.userId != "") {
      console.log("유저아이디가있음");
    }
  }

  openTooltip(item: any): void {
    this.mini = false;
  }

  logout(): void {
    // api.webpush.unsubscribe();
    this.$store.commit("logout");

    this.$router.push({ path: "login" });
    localStorage.removeItem("userId");

    return;
  }
  handlerSaveInfo(userInfo: object): void {
    this.$swal
      .fire({
        title: "수정",
        text: "해당 데이터를 수정 이후 재로그인 해주셔야합니다",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "수정",
      })
      .then((result) => {
        if (result.isConfirmed) {
          api.login
            .updateUserInfoPage(userInfo)
            .then((response: object) => {
              this.$swal({
                title: "수정되었습니다.",
                icon: "success",
                position: "top",
                showCancelButton: false,
                showConfirmButton: false,
                toast: true,
                timer: 1500,
              });

              //수정된 이후의 상황
              this.logout();
            })
            .catch((error: object) => {
              this.$swal({
                title: "수정 실패되었습니다.",
                icon: "error",
                position: "top",
                showCancelButton: false,
                showConfirmButton: false,
                toast: true,
                timer: 1500,
              });
            });
        }
      });
    return;
  }

  close(): void {
    //this.form.reset();
    this.userInfoDialog = false;
    return;
  }

  // 알람 삭제
  removeAlarm(alarm: Object): void {
    this.$store.commit("ALARM/removeAlarm", alarm);
  }

  alarmToggle() {
    this.alarmOn = !this.alarmOn;
    if (this.alarmOn) {
      console.log("알람을 받습니다");
    } else {
      console.log("알람을 받지 않습니다");
    }
  }

  getTodayInfo() {
    this.todayTotalList = [];
    api.schedule.getTodayScheduleInfo().then((response) => {
      this.todayTotalList = response.data.responseData;
    });
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
