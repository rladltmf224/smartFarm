<template>
  <v-navigation-drawer
    app
    clipped
    permanent
    color="#f5f5f5"
    :mini-variant="mini"
    class="my-4 ms-4 border-radius-lg"
  >
    <v-container class="px-0 text-h4 sidebar-main-text home" @click="goHome">
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
      <v-list-group
        v-for="(item, i) in items"
        :key="i"
        mandatory
        class="pb-1 mx-2"
      >
        <template v-slot:activator>
          <v-list-item-icon class="shadow border-radius-md mx-2 align-center">
            <!-- <v-icon v-text="item.icon" small @mouseover="openTooltip(item)">
            </v-icon> -->
            <div>
              <svg
                width="12px"
                height="12px"
                viewBox="0 0 45 40"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <title>shop</title>
                <g
                  stroke="none"
                  stroke-width="1"
                  fill="none"
                  fill-rule="evenodd"
                >
                  <g
                    transform="translate(-1716.000000, -439.000000)"
                    fill="#FFFFFF"
                    fill-rule="nonzero"
                  >
                    <g transform="translate(1716.000000, 291.000000)">
                      <g transform="translate(0.000000, 148.000000)">
                        <path
                          class="color-background"
                          d="M46.7199583,10.7414583 L40.8449583,0.949791667 C40.4909749,0.360605034 39.8540131,0 39.1666667,0 L7.83333333,0 C7.1459869,0 6.50902508,0.360605034 6.15504167,0.949791667 L0.280041667,10.7414583 C0.0969176761,11.0460037 -1.23209662e-05,11.3946378 -1.23209662e-05,11.75 C-0.00758042603,16.0663731 3.48367543,19.5725301 7.80004167,19.5833333 L7.81570833,19.5833333 C9.75003686,19.5882688 11.6168794,18.8726691 13.0522917,17.5760417 C16.0171492,20.2556967 20.5292675,20.2556967 23.494125,17.5760417 C26.4604562,20.2616016 30.9794188,20.2616016 33.94575,17.5760417 C36.2421905,19.6477597 39.5441143,20.1708521 42.3684437,18.9103691 C45.1927731,17.649886 47.0084685,14.8428276 47.0000295,11.75 C47.0000295,11.3946378 46.9030823,11.0460037 46.7199583,10.7414583 Z"
                          opacity="0.598981585"
                        ></path>
                        <path
                          class="color-background"
                          d="M39.198,22.4912623 C37.3776246,22.4928106 35.5817531,22.0149171 33.951625,21.0951667 L33.92225,21.1107282 C31.1430221,22.6838032 27.9255001,22.9318916 24.9844167,21.7998837 C24.4750389,21.605469 23.9777983,21.3722567 23.4960833,21.1018359 L23.4745417,21.1129513 C20.6961809,22.6871153 17.4786145,22.9344611 14.5386667,21.7998837 C14.029926,21.6054643 13.533337,21.3722507 13.0522917,21.1018359 C11.4250962,22.0190609 9.63246555,22.4947009 7.81570833,22.4912623 C7.16510551,22.4842162 6.51607673,22.4173045 5.875,22.2911849 L5.875,44.7220845 C5.875,45.9498589 6.7517757,46.9451667 7.83333333,46.9451667 L19.5833333,46.9451667 L19.5833333,33.6066734 L27.4166667,33.6066734 L27.4166667,46.9451667 L39.1666667,46.9451667 C40.2482243,46.9451667 41.125,45.9498589 41.125,44.7220845 L41.125,22.2822926 C40.4887822,22.4116582 39.8442868,22.4815492 39.198,22.4912623 Z"
                        ></path>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
            </div>
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
          color="#3a416f"
          dense
        >
          <v-list-item-content @click="selectedPage(subItem)">
            <v-list-item-title
              v-text="'•  ' + subItem.title"
            ></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>

    <v-list dense nav rounded>
      <v-list-item @click="mySettingDialog = true" @mouseover="openTooltip()">
        <v-list-item-icon>
          <v-icon>mdi-account-circle-outline</v-icon>
        </v-list-item-icon>
        <v-list-item-title>회원정보 변경</v-list-item-title>
      </v-list-item>
      <v-list-item @click="userInfoDialog = true" @mouseover="openTooltip()">
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
    </v-list>
    <template v-slot:append v-if="!mini" @click="logout">
      <div class="pa-2">
        <v-btn block class="btn-gradient" dark> 로그아웃 </v-btn>
      </div>
    </template>

    <!--비밀번호 변경 dialog-->
    <SidebarUserInfo
      :open="userInfoDialog"
      @closeModal="close"
      @save-info="handlerSaveInfo"
    ></SidebarUserInfo>

    <SidebarMySetting
      :open="mySettingDialog"
      @closeModal="mySettingDialog = false"
      @save-info="handlerSaveInfo"
    >
    </SidebarMySetting>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { demo_side_data } from "@/demo/demo_data";
import _ from "lodash";
import jwt_decode from "jwt-decode";
import * as api from "@/api/index.js";
import { Component, Vue, Ref, Watch } from "vue-property-decorator";
import SidebarUserInfo from "./SidebarUserInfo.vue";
import SidebarMySetting from "./SidebarMySetting.vue";
import { mapGetters } from "vuex";

@Component({
  components: {
    SidebarUserInfo,
    SidebarMySetting,
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

  selectedPage(subItem: any) {
    if (subItem.title == undefined) {
      this.$store.commit("setPageName", "모니터링");
      let pageName = "모니터링";
      localStorage.setItem("setPageName", pageName);
    } else {
      this.$store.commit("setPageName", subItem.title);
      let pageName = subItem.title;
      localStorage.setItem("setPageName", pageName);
    }
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
