<template>
  <v-navigation-drawer
    app
    clipped
    permanent
    color="#F6F8F9"
    :mini-variant="mini"
  >
    <v-container class="px-0 text-h4 sidebar-main-text home" @click="goHome">
      <!--   <v-icon v-if="!mini" @click.stop="mini = !mini" color="lightgrey" transparent>
        mdi-chevron-left
      </v-icon> -->
      <!-- 
      <v-icon v-else @click.stop="mini = !mini" color="lightgrey">
        mdi-arrow-expand-right
      </v-icon> -->

      <!--     <v-icon v-else @click.stop="mini = !mini" color="lightgrey">mdi-chevron-right</v-icon> -->
      <v-list height="100" dense>
        <v-list-item class="px-2">
          <v-btn icon v-if="mini" @click="mini = !mini">
            <v-icon>mdi-page-last </v-icon>
          </v-btn>
          <v-list-item-title></v-list-item-title>
          <v-btn icon @click.stop="mini = !mini">
            <v-icon>mdi-page-first</v-icon>
          </v-btn>
        </v-list-item>
        <v-list-item class="px-2">
          <v-btn icon @click="mini = !mini" @mouseover="openTooltip(item)">
            <v-icon>mdi-account</v-icon>
          </v-btn>
          <v-list-item-title> {{ userId }}님 </v-list-item-title>
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
                    large
                  >
                    mdi-bell
                  </v-icon>
                  <v-icon v-if="!alarmOn" color="grey" large>
                    mdi-bell-off
                  </v-icon>
                </v-btn>
              </v-badge>
            </template>
            <v-list>
              <v-list-item
                v-if="alarmOn"
                v-for="(alarm, index) in alarmList"
                :key="index"
                two-line
              >
                <v-list-item-content
                  @click="removeAlarm(alarm)"
                  class="alarmItem"
                >
                  <v-list-item-title>
                    <v-chip class="mr-3" color="warning"> 주의 </v-chip
                    >{{ alarm.title }}
                  </v-list-item-title>
                  <v-list-item-subtitle class="pl-15">{{
                    alarm.body
                  }}</v-list-item-subtitle>
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
        </v-list-item>
      </v-list>

      <!--   <v-menu offset-y>
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
                large
              >
                mdi-bell
              </v-icon>
              <v-icon v-if="!alarmOn" color="grey" large> mdi-bell-off </v-icon>
            </v-btn>
          </v-badge>
        </template>
        <v-list>
          <v-list-item
            v-if="alarmOn"
            v-for="(alarm, index) in alarmList"
            :key="index"
            two-line
          >
            <v-list-item-content @click="removeAlarm(alarm)" class="alarmItem">
              <v-list-item-title>
                <v-chip class="mr-3" color="warning"> 주의 </v-chip>{{ alarm.title }}
              </v-list-item-title>
              <v-list-item-subtitle class="pl-15">{{
                alarm.body
              }}</v-list-item-subtitle>
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
      </v-menu> -->
    </v-container>
    <v-divider></v-divider>
    <v-list
      height="600"
      style="overflow-y: auto; overflow-x: hidden"
      dense
      nav
      rounded
    >
      <v-list-item :link="true" :to="to_home" color="primary">
        <v-list-item-icon @mouseover="openTooltip(item)">
          <v-icon>mdi-monitor</v-icon>
        </v-list-item-icon>
        <v-list-item-title>모니터링</v-list-item-title>
      </v-list-item>
      <v-list-group v-for="(item, i) in items" :key="i" mandatory>
        <template v-slot:activator>
          <v-list-item-icon>
            <v-icon v-text="item.icon" @mouseover="openTooltip(item)"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title
              class="text-subtitle-1"
              v-text="item.title"
            ></v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item
          v-for="subItem in item.subItems"
          :key="subItem.title"
          :to="subItem.to"
          dense
        >
          <v-list-item-content>
            <v-list-item-title
              v-text="'- ' + subItem.title"
            ></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>
    <v-divider></v-divider>
    <v-list height="100" dense nav rounded>
      <v-list-item @click="userInfoDialog = true" @mouseover="openTooltip()">
        <v-list-item-icon>
          <v-icon>mdi-account-circle-outline</v-icon>
        </v-list-item-icon>
        <v-list-item-title>비밀번호 변경</v-list-item-title>
      </v-list-item>
      <v-list-item @click="logout" @mouseover="openTooltip()">
        <v-list-item-icon>
          <v-icon>mdi-power</v-icon>
        </v-list-item-icon>
        <v-list-item-title>로그아웃</v-list-item-title>
      </v-list-item>
    </v-list>

    <!-- <v-list dense>
      <v-subheader>개발예정</v-subheader>
      <v-divider></v-divider>
      <v-list-item v-for="(item, i) in items_dev" :key="i" :to="item.to" color="primary" mandatory>
        <v-list-item-icon>
          <v-icon v-text="item.icon"></v-icon>
        </v-list-item-icon>

        <v-list-item-title class="text-subtitle-1" v-text="item.title"></v-list-item-title>
      </v-list-item>
    </v-list> -->
    <!-- <a id="kakao-login-btn" :href="loginWithKakao()">
      <img
        src="https://k.kakaocdn.net/14/dn/btroDszwNrM/I6efHub1SN5KCJqLm1Ovx1/o.jpg"
        width="222"
        alt="카카오 로그인 버튼"
      />
    </a> -->
    <!-- <v-btn class="ma-2" color="indigo" dark @click="getKakaoUserToken">
      카카오 사용자 토큰 받기
    </v-btn> -->
    <!-- <template v-slot:append>
      <v-btn class="ma-2" color="indigo" dark @click="userInfoDialog = true">
        <v-icon dark> mdi-account-circle-outline </v-icon>
      </v-btn>
     <v-btn class="ma-2" color="indigo" dark>
        <v-icon dark> mdi-cog-outline </v-icon>
      </v-btn>
      <v-btn class="ma-2" color="indigo" dark @click="logout">
        <v-icon dark> mdi-power </v-icon>
      </v-btn>
    </template> -->

    <!--비밀번호 변경 dialog-->
    <SidebarUserInfo
      :open="userInfoDialog"
      @closeModal="close"
      @save-info="handlerSaveInfo"
    ></SidebarUserInfo>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { demo_side_data } from "@/demo/demo_data";
import _ from "lodash";
import jwt_decode from "jwt-decode";
import * as api from "@/api/index.js";
import { Component, Vue, Ref, Watch } from "vue-property-decorator";
import SidebarUserInfo from "./SidebarUserInfo.vue";
import { mapGetters } from "vuex";

@Component({
  components: {
    SidebarUserInfo,
  },
  computed: {
    ...mapGetters({
      alarmList: "ALARM/GET_ALARM_LIST",
    }),
  },
})
export default class Sidebar extends Vue {
  @Ref() form: HTMLFormElement;
  userId: string = "";
  mini: boolean = false;
  alarmOn: boolean = true;
  tooltip: boolean = false;
  userInfoDialog: boolean = false;
  to_home?: string = "monitoring";
  to_notdev?: string = "notdev";
  items?: any[] = [];
  items_dev?: any[] = [];
  dialog: boolean = false;
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

  mounted() {
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

  @Watch("alarmList.length", { deep: true })
  onAlarmListChanged(newVal: number, oldVal: number): void {
    // 새로운 알림이 생긴 경우
    if (newVal - oldVal > 0) {
      let alarmIcon: HTMLElement | null = document.getElementById("alarmBell");
      if (alarmIcon) alarmIcon.click();
    }
  }

  // loginWithKakao(): void {
  //   api.kakao.loginKakao();
  // }

  // getKakaoUserToken(): void {
  //   let response = api.kakao.getUserToken();
  //   console.log("KKKKKKKKKKKKKKKKK", response);
  // }
}
</script>

<style src="./Sidebar.scss" lang="scss"></style>
