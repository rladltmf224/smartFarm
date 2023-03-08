<template>
  <v-app id="inspire">



    <v-main style="background-color:#E8F5E9">
      <!-- Login Component -->




      <v-card class="background d-flex justify-center" elevation="0">
        <v-toolbar color="transparent" dark elevation="0">
          <v-app-bar-nav-icon></v-app-bar-nav-icon>
          <v-toolbar-title>
            SmartFarm System
          </v-toolbar-title>
          <v-row>
            <v-col cols="7" class="text-center mx-auto">
              <v-btn text>Text1</v-btn>
              <v-btn text>Text2</v-btn>
              <v-btn text>Text3</v-btn>
              <v-btn text>Text4</v-btn>
              <v-btn text>Text5</v-btn>
            </v-col>
          </v-row>
          <v-btn icon>
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>mdi-heart</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </v-toolbar>
      </v-card>
      <v-card class="loginCard " elevation="6">
        <div class="pa-10 ">
          <div style="width:100px;height:100px" class="mx-auto">
            <img src="./twim_logo_green.png" style="width:100px;">
          </div>
          <form>
            <v-row dense>
              <v-col cols="12">
                <v-text-field label="사번" outlined rounded dense prepend-inner-icon="mdi-account" v-model="username">
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field prepend-inner-icon="mdi-lock" rounded outlined dense type="password" label="비밀번호"
                  v-model="password"></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-checkbox v-model="checkbox_ID" label="ID 저장" dense></v-checkbox>
              </v-col>
              <v-col cols="6">
                <v-checkbox v-model="checkbox_IDPW" color="green" label="ID/PW 저장" dense></v-checkbox>
              </v-col>
            </v-row>

            <v-btn type="button" color="blue lighten-1 text-capitalize" depressed large block dark class="mb-3 gradient"
              @click="loginManager">접속</v-btn>
          </form>
          <!-- <a id="kakao-login-btn" :href="loginWithKakao()">
                  <img
                    src="https://k.kakaocdn.net/14/dn/btroDszwNrM/I6efHub1SN5KCJqLm1Ovx1/o.jpg"
                    width="222"
                    alt="카카오 로그인 버튼"
                  />
                </a> -->
        </div>
      </v-card>
      <v-card elevation="0" color="transparent">
        <v-row>
          <v-col cols="12" class="mx-auto text-center">
            <a href="" class="mx-4 text-decoration-none">Creative</a>
            <a href="" class="mx-4 text-decoration-none">About Us</a>
            <a href="" class="mx-4 text-decoration-none">Blog</a>
            <a href="" class="mx-4 text-decoration-none">License</a>
          </v-col>
        </v-row>

      </v-card>

      <!--   <v-container style="max-width: 450px;" fill-height>

        <v-layout align-center row wrap>
          <v-flex xs12>



            <v-card>
              <div class="pa-10">
                <h1 style="text-align: center">MES</h1>
                <form>
                  <v-row dense>
                    <v-col cols="12">
                      <v-text-field label="사번" prepend-inner-icon="mdi-account" v-model="username">
                      </v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field prepend-inner-icon="mdi-lock" type="password" label="비밀번호"
                        v-model="password"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-checkbox v-model="checkbox_ID" label="ID 저장" dense></v-checkbox>
                    </v-col>
                    <v-col cols="6">
                      <v-checkbox v-model="checkbox_IDPW" label="ID/PW 저장" dense></v-checkbox>
                    </v-col>
                  </v-row>

                  <v-btn type="button" color="blue lighten-1 text-capitalize" depressed large block dark class="mb-3"
                    @click="loginManager">접속</v-btn>
                </form>
             <a id="kakao-login-btn" :href="loginWithKakao()">
                  <img
                    src="https://k.kakaocdn.net/14/dn/btroDszwNrM/I6efHub1SN5KCJqLm1Ovx1/o.jpg"
                    width="222"
                    alt="카카오 로그인 버튼"
                  />
                </a> -->
      <!--    </div>
      </v-card>
      </v-flex>
      </v-layout>
      <v-card class="mx-auto">

      </v-card>
      </v-container>  -->
    </v-main>

  </v-app>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import * as api from "@/api";

@Component
export default class Login extends Vue {
  //username?: string = "master";
  //password?: string = "qwer1234!@";

  // username?: string = "yskim";

  // username?: string = "bswoo";

  // password?: string = "a12345678!@";
  checkbox_ID: boolean = false;
  checkbox_IDPW: boolean = false;
  check_Type: string = "";
  yes: boolean = false;
  username?: string = "" || this.$cookies.get("id");

  password?: string = "" || this.$cookies.get("pw");

  pushToken: string | null = "";

  created() {
    this.$store.commit("setCurrent", "nothing");

    if (this.$cookies.isKey("id") && this.$cookies.isKey("pw")) {
      this.checkbox_IDPW = true;
    } else if (this.$cookies.isKey("id")) {
      this.checkbox_ID = true;
    }
  }

  @Watch("checkbox_ID")
  onCheckboxIDChange() {
    if (this.checkbox_ID) {
      this.checkbox_IDPW = false;
    }
  }

  @Watch("checkbox_IDPW")
  onCheckboxIDPWChange() {
    if (this.checkbox_IDPW) {
      this.checkbox_ID = false;
    }
  }

  async loginManager(): Promise<unknown> {

    if (this.checkbox_ID) {
      this.check_Type = "ID";
      this.$store.commit("setSaveType", "ID");
    } else if (this.checkbox_IDPW) {
      this.check_Type = "IDPW";
      this.$store.commit("setSaveType", "IDPW");
    } else {
      this.check_Type = "";
      this.$store.commit("setSaveType", "");
    }
    // this.pushToken = await api.webpush.subscribe();
    await this.$store
      .dispatch("getUserInfo", {
        account: {
          userId: this.username,
          userPw: this.password,
          // pushToken: {
          //   token: this.pushToken,
          //   device:
          //     /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          //       navigator.userAgent
          //     )
          //       ? 0
          //       : 1,
          //   userAgent:
          //     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36 Edg/109.0.1518.78",
          // },
        },
        type: this.check_Type,
      })
      .then((res) => {
        console.log("res", res);
      });
    console.log("loginManager", this.$store.state.userId);
    if (this.$store.state.userId !== "") {
      this.$router.push({ path: "monitoring" });
      let userId = this.$store.state.userId
      localStorage.setItem("userId", JSON.stringify(userId));
      return;
    }
    // this.$router.push({ path: "monitoring" });

    this.username = "";
    this.password = "";
    this.$swal.fire("ERROR", "ID/PW를 확인해주시길 바랍니다", "error");
    return;
  }

  // loginWithKakao(): void {
  //   api.kakao.loginKakao();
  // }
}
</script>






<style lang="scss">
.v-application .mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: all .15s ease;
}

.background {
  background-image: url(./back_blur.jpg);
  background-size: cover;
  background-position: 50% center;
  height: 400px;
  margin: 25px;
  border-radius: 20px !important;
  /* filter: brightness(60%); */
}

.loginCard {
  position: relative;
  width: 80%;
  max-width: 467px;
  margin: auto;
  top: -254px;
}
</style>


<style lang="css">
.gradient {
  background-image: linear-gradient(to right, rgb(153, 218, 1), rgb(49, 182, 56));
  border: 0;
  color: rgba(var(--text-color));
}
</style>