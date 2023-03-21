<template>
  <v-app id="inspire">
    <v-main class="login-background">
      <!-- Login Component -->

      <v-card class="loginCard card-shadow" rounded="xl">
        <div class="pa-10">
          <div style="width: 100px; height: 100px" class="mx-auto">
            <img src="./twim_logo_green.png" style="width: 100px" />
          </div>
          <form>
            <v-row dense>
              <font-awesome-icon icon="fa-solid fa-user-secret" />

              <v-col cols="12">
                <v-text-field
                  label="사번"
                  solo
                  rounded
                  prepend-inner-icon="mdi-account"
                  v-model="username"
                >
                </v-text-field>
                <v-text-field
                  prepend-inner-icon="mdi-lock"
                  rounded
                  solo
                  type="password"
                  label="비밀번호"
                  v-model="password"
                ></v-text-field>
              </v-col>

              <v-col cols="6">
                <v-checkbox
                  v-model="checkbox_ID"
                  label="ID 저장"
                  dense
                ></v-checkbox>
              </v-col>
              <v-col cols="6">
                <v-checkbox
                  v-model="checkbox_IDPW"
                  label="ID/PW 저장"
                  dense
                ></v-checkbox>
              </v-col>
            </v-row>

            <v-btn
              type="button"
              color="#16A2F1"
              depressed
              large
              block
              dark
              class="mb-3 gradient"
              @click="loginManager"
              >접속</v-btn
            >
          </form>
        </div>
      </v-card>
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
      let userId = this.$store.state.userId;
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
  transition: all 0.15s ease;
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
  width: 80%;
  max-width: 467px;
  margin: auto;
  box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.05) !important;
  margin-top: 13%;
}

.login-background {
  background-color: #e7ebee;
  background-image: radial-gradient(
    55% 116% at left,
    rgb(38, 217, 143) 61%,
    rgb(38, 217, 143) 92%,
    transparent 92%
  );
}

.theme--light.v-text-field--solo > .v-input__control > .v-input__slot {
  background: #e7ebee;
  box-shadow: none !important;
}

.loginCard {
  font-family: "Pretendard" !important;
}
</style>
