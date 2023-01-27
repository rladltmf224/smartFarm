<template>
  <v-app id="inspire">
    <v-main class="blue-grey lighten-4">
      <!-- Login Component -->
      <v-container style="max-width: 450px" fill-height>
        <v-layout align-center row wrap>
          <v-flex xs12>
            <v-card>
              <div class="pa-10">
                <h1 style="text-align: center">MES</h1>
                <form>
                  <v-text-field label="사번" prepend-inner-icon="mdi-account" v-model="username">
                  </v-text-field>
                  <v-text-field prepend-inner-icon="mdi-lock" type="password" label="비밀번호"
                    v-model="password"></v-text-field>
                  <v-btn type="button" color="blue lighten-1 text-capitalize" depressed large block dark class="mb-3"
                    @click="loginManager">접속</v-btn>
                </form>
              </div>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Login extends Vue {
  username?: string = "yskim";
  password?: string = "a12345678!@";
  // username?: string = "qwert";
  // password?: string = "a12345678!@";

  created() {
    this.$store.commit("setCurrent", "nothing");
  }

  async loginManager(): Promise<unknown> {
    await this.$store.dispatch("getUserInfo", {
      account: { userId: this.username, userPw: this.password },
    });

    this.$router.push({ path: "home" });
    return;
  }
}
</script>
