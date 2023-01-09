<template>
  <v-dialog v-model="dialog" width="500">
    <v-card height="300">
      <v-card-title
        class="display-flex justify-space-between pa-0 pl-2 pt-2 pr-10"
      >
        <span class="text-h6 dialog-title font-weight-bold pt-3 pl-3"
          >비밀번호 변경</span
        >
      </v-card-title>
      <v-form ref="form" lazy-validation>
        <v-row class="rowBox class mt-5 m-2">
          <v-col cols="4">
            <v-subheader><strong>신규 비밀번호</strong></v-subheader>
          </v-col>
          <v-col cols="7">
            <v-text-field
              v-model.trim="password"
              :rules="passwordRules"
              :append-icon="value ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="() => (value = !value)"
              :type="!value ? 'password' : 'text'"
              outlined
              dense
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row class="rowBox mt-6 m-2">
          <v-col cols="4">
            <v-subheader><strong>비밀번호 확인</strong></v-subheader>
          </v-col>
          <v-col cols="7">
            <v-text-field
              v-model.trim="changePassword"
              :rules="changePasswordRules"
              :append-icon="changeValue ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="() => (changeValue = !changeValue)"
              :type="!changeValue ? 'password' : 'text'"
              outlined
              dense
              required
            ></v-text-field>
          </v-col>
        </v-row>
      </v-form>
      <v-row class="rowBox mt-10">
        <v-container fluid class="d-flex justify-center pt-2 pl-0 pr-0">
          <v-btn
            color="primary"
            :disabled="
              (password == '' && changePassword == '') ||
              (password == null && changePassword == null)
            "
            @click="change"
          >
            확 인
          </v-btn>
          <v-btn text color="primary" class="editBtn ml-5" @click="close">
            취 소
          </v-btn>
        </v-container>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Ref, Prop, Emit } from "vue-property-decorator";
import jwt_decode from "jwt-decode";

@Component
export default class SidebarUserInfo extends Vue {
  @Ref() form: HTMLFormElement;
  @Prop() open: boolean = false;

  get dialog() {
    return this.open;
  }

  password?: string = "";
  changePassword?: string = "";
  passwordRules: any[] = [
    (v: any) => !!v || "비밀번호는 필수입니다",
    (v: any) =>
      /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{10,16}$/.test(
        v
      ) || "10 ~ 16자 영문, 숫자, 특수문자만 가능합니다.",
  ];
  value?: boolean = false;
  changeValue?: boolean = false;
  changePasswordRules: any[] = [
    (v: any) => !!v || "비밀번호 확인은 필수입니다",
  ];

  @Emit("save-info")
  change(): any {
    if (this.form.validate()) {
      this.$swal({
        title: "비밀번호가 동일하지 않습니다.",
        icon: "error",
        position: "top",
        showCancelButton: false,
        showConfirmButton: false,
        toast: true,
        timer: 1500,
      });
      return;
    }

    if (this.password == this.changePassword) {
      let jwt: any = jwt_decode(this.$cookies.get("accessToken"));
      let userInfo: object = {
        userId: jwt.username,
        changePw: this.password,
        checkChangePw: this.changePassword,
      };

      return userInfo;
    }
  }
  @Emit("closeModal")
  close(): boolean {
    this.form.reset();
    //this.open = false;
    return false;
  }
}
</script>
