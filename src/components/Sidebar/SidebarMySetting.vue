<template>
  <!-- 생성 모달 -->
  <v-dialog v-model="dialog" max-width="600px" persistent>
    <v-card>
      <v-card-title>
        <span>내 정보 수정</span>
        <v-spacer></v-spacer>
      </v-card-title>
      <div class="px-7">
        <v-text-field
          label="부서"
          v-model="userInfo.departmentName"
          disabled
        ></v-text-field>
        <v-text-field
          label="이름"
          v-model="userInfo.userName"
          disabled
        ></v-text-field>
        <v-text-field
          label="전화번호"
          v-model="userInfo.phoneNumber"
        ></v-text-field>
        <div class="d-flex flex-row align-center">
          <v-subheader><strong>SMS 수신</strong></v-subheader>
          <div style="width: 15px"></div>
          <v-btn-toggle v-model="userInfo.alarmYN">
            <v-btn color="blue" text :value="true" dense height="30">
              <p class="pa-0 ma-0">ON</p>
            </v-btn>
            <v-btn color="red" text :value="false" dense height="30">
              <p class="pa-0 ma-0">OFF</p>
            </v-btn>
          </v-btn-toggle>
        </div>
      </div>
      <v-card-actions>
        <v-col class="text-right">
          <v-btn color="success" text @click="save"> 저장 </v-btn>
          <v-btn color="primary" text @click="close"> 닫기 </v-btn>
        </v-col>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Ref, Prop, Emit, Watch } from "vue-property-decorator";
import jwt_decode from "jwt-decode";
import * as api from "@/api/index.js";
import _ from "lodash";

@Component
export default class SidebarUserInfo extends Vue {
  @Ref() form: HTMLFormElement;
  @Prop() open: boolean = false;

  userInfo: any = {
    departmentName: "",
    userName: "",
    phoneNumber: "",
    alarmYN: false,
  };

  get dialog() {
    return this.open;
  }

  @Watch("dialog")
  getUserInfo() {
    if (this.dialog) {
      let userId: string | null = localStorage.getItem("userId");
      userId = userId ? userId.replace(/"/g, "") : userId;
      api.login.getSMSInfo({ userId: userId }).then((response) => {
        this.userInfo = response.data.responseData;
      });
    }
  }

  @Emit("closeModal")
  close(): boolean {
    // this.form.reset();
    //this.open = false;
    let jwt: any = jwt_decode(this.$cookies.get("accessToken"));
    console.log("ssssss", jwt);
    return false;
  }

  @Emit("closeModal")
  save(): void {
    let userId: string | null = localStorage.getItem("userId");
    let request = {
      userId: userId ? userId.replace(/"/g, "") : userId,
      phoneNumber: this.userInfo.phoneNumber,
      alarmYN: this.userInfo.alarmYN,
    };

    api.login
      .putSMSInfo(request)
      .then((response) => {
        this.$swal({
          title: "정보 수정에 성공하였습니다.",
          icon: "success",
          position: "top",
          showCancelButton: false,
          showConfirmButton: false,
          toast: true,
          timer: 1500,
        });
        this.close();
      })
      .catch((error) => {
        this.$swal({
          title: "정보 수정에 실패하였습니다.",
          icon: "error",
          position: "top",
          showCancelButton: false,
          showConfirmButton: false,
          toast: true,
          timer: 1500,
        });
      });
  }
}
</script>
