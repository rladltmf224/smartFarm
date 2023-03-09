<template>
  <v-navigation-drawer
    app
    clipped
    permanent
    color="#f5f5f5"
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
          <v-list-item-avatar>
            <v-img src="https://randomuser.me/api/portraits/men/85.jpg" />
          </v-list-item-avatar>
          <v-list-item-title
            class="ListItemClass d-flex justify-center flex-column"
          >
            <h3 class="my-1">{{ userId }}님</h3>
            <span> 등급:관리자 </span>
          </v-list-item-title>

          <!-- 
          <v-btn icon v-if="mini" @click="mini = !mini">
            <v-icon>mdi-cog </v-icon>
          </v-btn>
          <v-list-item-title></v-list-item-title>
          <v-btn icon @click.stop="mini = !mini">
            <v-icon>mdi-cog</v-icon>
          </v-btn> -->

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

          <!--      <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-badge overlap :content="alarmOn ? alarmList.length : 0" :value="alarmOn ? alarmList.length : 0"
                color="error">
                <v-btn id="alarmBell" depressed v-bind="attrs" v-on="on" icon>
                  <v-icon v-if="alarmOn" :color="alarmList.length > 0 ? 'error' : 'black'" large>
                    mdi-bell
                  </v-icon>
                  <v-icon v-if="!alarmOn" color="grey" large>
                    mdi-bell-off
                  </v-icon>
                </v-btn>
              </v-badge>
            </template>
            <v-list>
              <v-list-item v-if="alarmOn" v-for="(alarm, index) in alarmList" :key="index" two-line>
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
    <!--  <v-list height="676" style="overflow-y: auto;overflow-x: hidden" dense nav rounded @mouseover="openTooltip()">
      <v-list-item :link="true" :to="to_home" color="primary">
        <v-list-item-icon @mouseover="openTooltip(item)">
          <v-icon>mdi-monitor</v-icon>
        </v-list-item-icon>
        <v-list-item-title>모니터링</v-list-item-title>
      </v-list-item>
      <v-list-group v-for="(item, i) in items" :key="i" mandatory>
        <template v-slot:activator class="d-flex">
          <v-list-item-icon id="result">
            <v-btn elevation="3" v-ripple="{ class: 'primary--text' }" color="white">
              <v-icon v-text="item.icon" small color="green" @mouseover="openTooltip(item)"></v-icon>
            </v-btn>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="text-subtitle-1" v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item v-for="subItem in item.subItems" :key="subItem.title" :to="subItem.to" dense>
          <v-list-item-content>
            <v-list-item-title v-text="'•  ' + subItem.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list> -->

    <v-list
      height="700"
      style="overflow-y: auto; overflow-x: hidden; display: contents"
      dense
      nav
      rounded
    >
      <v-list-item
        :link="true"
        :to="to_home"
        color="primary"
        @click="selectedPage(subItem == null)"
      >
        <v-list-item-icon @mouseover="openTooltip(item)">
          <v-icon>mdi-monitor</v-icon>
        </v-list-item-icon>
        <v-list-item-title>모니터링</v-list-item-title>
      </v-list-item>
      <v-list-group v-for="(item, i) in items" :key="i" mandatory @click="test(item)">
        <template v-slot:activator>
          <v-list-item-icon>
            <!--    <v-btn color="white" fab x-small elevation="1">
              <v-icon v-text="item.icon" small @mouseover="openTooltip(item)"></v-icon>
            </v-btn>
 -->
            <v-col id="result" class="pa-0 ma-0 d-flex align-center">
              <v-btn
                v-ripple="{ class: 'primary--text' }"
                elevation="3"
                color="white"
              >
                <v-icon
                  v-text="item.icon"
                  small
                  @mouseover="openTooltip(item)"
                  color="green"
                >
                </v-icon>
              </v-btn>
            </v-col>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title
              class="text-subtitle-1"
              v-text="item.title"
            ></v-list-item-title>
          </v-list-item-content>
        </template>
<<<<<<< HEAD
        <v-list-item v-for="subItem in item.subItems" :key="subItem.title" :to="subItem.to" dense
          @click="selectedPage(subItem)">
          <v-list-item-content>
            <v-list-item-title v-text="'•  ' + subItem.title"></v-list-item-title>
=======
        <v-list-item
          v-for="subItem in item.subItems"
          :key="subItem.title"
          :to="subItem.to"
          dense
        >
          <v-list-item-content @click="selectedPage(subItem)">
            <v-list-item-title
              v-text="'•  ' + subItem.title"
            ></v-list-item-title>
>>>>>>> e325bc2d4744348aea05b8f5ddc6e606c04a0d23
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

  test(item: any) {
    console.log('리스트', item.title)
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
    console.log('서브아이템서브아이템서브아이템', subItem)
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
<style lang="css">
.btn-gradient {
  background-image: linear-gradient(
    to right,
    rgb(153, 218, 1),
    rgb(49, 182, 56)
  );
  border: 0;
  color: rgba(var(--text-color));
}

#result .v-btn {
  min-width: 36px;
  width: 36px;
  border-radius: 11px;
}
</style>
