<template>
  <v-navigation-drawer app clipped permanent :width="240" color="#F6F8F9">
    <v-container class="text-h4 sidebar-main-text home" @click="goHome">
      T-MES
    </v-container>

    <v-divider></v-divider>

    <v-list height="560" dense nav rounded>
      <v-list-item :link="true" :to="to_home" color="primary">
        <v-list-item-icon>
          <v-icon>mdi-monitor</v-icon>
        </v-list-item-icon>

        <v-list-item-title>모니터링</v-list-item-title>
      </v-list-item>

      <v-list-group v-for="(item, i) in items" :key="i" mandatory>
        <template v-slot:activator>
          <v-list-item-icon>
            <v-icon v-text="item.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="text-subtitle-1" v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </template>

        <v-list-item v-for="subItem in item.subItems" :key="subItem.title" :to="subItem.to" dense>
          <v-list-item-content>
            <v-list-item-title v-text="'- ' + subItem.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
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
    <template v-slot:append>
      <v-btn class="ma-2" color="indigo" dark @click="userInfoDialog = true">
        <v-icon dark> mdi-account-circle-outline </v-icon>
      </v-btn>
      <v-btn class="ma-2" color="indigo" dark>
        <v-icon dark> mdi-cog-outline </v-icon>
      </v-btn>
      <v-btn class="ma-2" color="indigo" dark @click="logout">
        <v-icon dark> mdi-power </v-icon>
      </v-btn>
    </template>

    <!--비밀번호 변경 dialog-->
    <SidebarUserInfo :open="userInfoDialog" @closeModal="close" @save-info="handlerSaveInfo"></SidebarUserInfo>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { demo_side_data } from "@/demo/demo_data";
import _ from "lodash";
import jwt_decode from "jwt-decode";
import * as api from "@/api/index.js";
import { Component, Vue, Ref } from "vue-property-decorator";
import SidebarUserInfo from "./SidebarUserInfo.vue";

@Component({
  components: {
    SidebarUserInfo,
  },
})
export default class Sidebar extends Vue {
  @Ref() form: HTMLFormElement;

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
        icon: "mdi-folder",
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
      icon: "mdi-folder",
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
      icon: "mdi-folder",
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
      icon: "mdi-folder",
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
      icon: "mdi-folder",
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
  }
  goHome(): void {

    this.$router.push("/monitoring").catch(() => { });

    return;
  }

  logout(): void {
    this.$store.commit("logout");
    this.$router.push({ path: "login" });
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
}
</script>

<style src="./Sidebar.scss" lang="scss">

</style>
