<template>
  <v-navigation-drawer
    app
    clipped
    permanent
    color="white"
    :mini-variant="mini"
    class="py-4 border-radius-lg hover"
  >
    <v-container class="px-0 text-h4 sidebar-main-text home" @click="goHome">
      <v-list-item class="px-2">
        <v-img
          v-if="!mini"
          style="width: 130px"
          class="ml-12"
          src="@/assets/images/logo_green.png"
        />
        <v-btn icon v-if="mini" @click="mini = !mini">
          <v-icon>mdi-page-last </v-icon>
        </v-btn>

        <v-btn icon @click.stop="mini = !mini">
          <v-icon>mdi-page-first</v-icon>
        </v-btn>
      </v-list-item>
    </v-container>
    <v-divider></v-divider>

    <v-list
      height="700"
      style="overflow-y: auto; overflow-x: hidden; display: contents"
      dense
      nav
    >
      <v-list-item
        class="pb-1 mx-2"
        :link="true"
        :to="to_home"
        @click="selectedPage(subItem == null)"
      >
        <v-list-item-icon @mouseover="openTooltip(item)">
          <v-icon>mdi-monitor</v-icon>
        </v-list-item-icon>
        <v-list-item-title>모니터링</v-list-item-title>
      </v-list-item>
      <v-list-item class="pb-1 mx-2" :link="true" :to="to_schedule" @click="putSchedule()">
        <v-list-item-icon @mouseover="openTooltip(item)">
          <v-icon>mdi mdi-calendar-month-outline</v-icon>
        </v-list-item-icon>
        <v-list-item-title>일정관리</v-list-item-title>
      </v-list-item>
      <v-list-group
        v-for="(item, i) in items"
        :key="i"
        class="pb-1 mx-2"
        active-class="active-group"
        mandatory
        @click="test(item)"
      >
        <template v-slot:activator>
          <v-list-item-icon
            class="border-radius-md mx-2 align-center"
            style="height: 28px; width: 28px; padding: 6px"
          >
            <v-icon v-text="item.icon" small @mouseover="openTooltip(item)">
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title
              class="ms-1 text-subtitle-1"
              v-text="item.title"
            ></v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item
          v-for="subItem in item.subItems"
          :key="subItem.title"
          :to="subItem.to"
          color="F3F4FD"
          class="ps-10"
          active-class="active-item-title"
          active-color="red"
          dense
        >
          <v-list-item-content @click="selectedPage(subItem)">
            <v-list-item-title
              color="#b5b4c7"
              v-text="'•  ' + subItem.title"
            ></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>

    <template v-slot:append v-if="!mini">
      <div class="pa-2">
        <v-btn block color="#27d98f" dark elevation="0" @click="logout">
          로그아웃
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { demo_side_data } from "@/demo/demo_data";
import _ from "lodash";
import jwt_decode from "jwt-decode";
import * as api from "@/api/index.js";
import { Component, Vue, Ref, Watch } from "vue-property-decorator";

import { mapGetters } from "vuex";
import Alarm from "./Alarm.vue";

@Component({
  components: {
    Alarm,
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
  mySettingDialog: boolean = false;
  to_home?: string = "monitoring";
  to_schedule?: string = "schedule";
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
    this.setPageName();
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
        icon: "mdi-sitemap-outline",
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
          {
            title: "알람이력 조회",
            to: "AlarmHistory",
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
    this.items.push({
      title: "소비재관리",
      active: true,
      icon: "mdi-package-variant-closed",
      role: "ROLE_operationManagement",
      use: "Y",
      sort: 5,
      subItems: [
        {
          title: "캘린더",
          to: "calendar",
        },
      ],
    });

    for (let i = 0; i < this.items.length; i++) {
      //tooltip을 위한 데이터를
      this.items[i].tooltip = false;
    }
  }

  test(item: any) {
    console.log("리스트", item.title);
  }

  goHome(): void {

    this.$store.commit("setPageName", "모니터링");
    this.$router.push("/monitoring").catch(() => { });

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

  selectedPage(subItem: any) {
    console.log("서브아이템서브아이템서브아이템", subItem);
    if (subItem.title == undefined) {
      this.$store.commit("setPageName", "모니터링");
      let pageName = "모니터링";
      localStorage.setItem("setPageName", pageName);
    } else if (subItem.title == '일정관리') {
      this.$store.commit("setPageName", "일정관리");
      let pageName = "일정관리";
      localStorage.setItem("setPageName", pageName);
    }
    else {
      this.$store.commit("setPageName", subItem.title);
      let pageName = subItem.title;
      localStorage.setItem("setPageName", pageName);
    }
  }

  putSchedule() {
    this.$store.commit("setPageName", "일정관리");
  }

  setPageName() {
    let origin = this.$store.state.pageName;
    if (!origin) {
      let getItem = localStorage.getItem("setPageName");
      this.$store.commit("setPageName", getItem);
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
    console.log("handlerSaveInfo 눌림");
    console.log("userInfo", userInfo);
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
}
</script>

<style src="./Sidebar.scss" lang="scss"></style>
<style src="./Sidebar.sass" lang="sass"></style>
