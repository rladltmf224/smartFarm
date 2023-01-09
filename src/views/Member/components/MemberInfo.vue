<template>
  <div>
    <v-row>
      <v-col md="2">
        <h4 class="searchbox-title">권한 설정</h4>
      </v-col>
      <v-col class="text-right" offset-md="3" md="7">
        <v-btn v-if="inputType == ''" color="primary" @click="dialog3 = true"
          >부서생성</v-btn
        >
        <v-btn
          v-if="inputType == '' && dept_name != ''"
          class="ml-2"
          color="primary"
          @click="clickCreateUserBtn"
          >유저생성</v-btn
        >
        <v-btn
          v-if="inputType == ''"
          class="ml-2"
          color="primary"
          @click="clickUpdateBtn"
          >수정</v-btn
        >
        <v-btn
          v-if="inputType != ''"
          class="ml-2"
          color="primary"
          @click="saveItem"
          >저장</v-btn
        >
        <v-btn
          v-if="inputType != ''"
          class="ml-2"
          color="error"
          @click="cancelBtn"
          >취소</v-btn
        >
      </v-col>
    </v-row>

    <v-sheet class="pa-5" color="#F6F8F9" max-width="auto" height="840">
      <div v-if="status == 'U'">
        <v-row>
          <v-col cols="6">
            <v-select
              :items="items"
              item-text="name"
              item-value="id"
              label="부서"
              v-model="dept_val"
              disabled
            ></v-select>
          </v-col>
        </v-row>
        <v-form ref="form" lazy-validation>
          <v-row>
            <v-col cols="4">
              <v-text-field
                name="name"
                label="아이디"
                id="id"
                v-model="user_ID"
                :rules="user_id_rule"
                :disabled="inputType == '' || status != 'U'"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                name="name"
                label="이름"
                v-model="user_name"
                :rules="user_nm_rule"
                :disabled="inputType == '' || status != 'U'"
                required
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </div>

      <div v-if="status == 'D'">
        <v-row>
          <v-col cols="6">
            <v-text-field
              name="name"
              label="부서명"
              id="id"
              v-model="dept_name"
              disabled
            ></v-text-field>
          </v-col>
        </v-row>
      </div>

      <v-sheet
        class="pa-3 lighten-2 rounded-xl"
        style="overflow-y: auto; height: 680px"
      >
        <v-data-table
          v-if="selectNode != ''"
          ref="roleList"
          :headers="headers_table"
          :items="desserts_table"
          :height="650"
          hide-default-footer
          fixed-header
          class="elevation-2"
          locale="ko-KR"
          dense
        >
          <template #item="{ item }">
            <tr>
              <td>{{ item.menu }}</td>
              <td>
                <v-select
                  :items="permission_list"
                  item-text="name"
                  item-value="value"
                  label="권한"
                  v-model="item.permission"
                  :disabled="inputType == ''"
                >
                </v-select>
                <span></span>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-sheet>
    </v-sheet>
  </div>
</template>

<script>
import _ from "lodash";
import {
  createDepartmentItem,
  createUserItem,
  updateDepartmentItem,
  updateUserItem,
} from "@/api/index.js";
export default {
  data: () => ({
    inputType: "",
    status: "",
    dept_val: "",
    dept_name: "",
    user_ID: "",
  }),
  props: () => ({}),
  methods: {
    clickCreateUserBtn() {
      this.inputType = "C";
      this.status = "U";
      this.dept_val = this.selectNode.id;
      this.user_name = "";
      this.dept_name = "";
      this.user_ID = "";
      this.desserts_table = this.dept_role;
    },
    clickUpdateBtn() {
      if (this.dept_name != "" || this.selectNode != "") {
        this.inputType = "U";
      } else {
        this.$swal("경고", "부서나 유저를 선택해주세요", "error");
      }
    },
    saveItem() {
      if (this.inputType == "C") {
        if (this.status == "U") {
          console.log("createUserItem");
          this.createUserItem();
        } else if (this.status == "D") {
          this.createDeptItem();
        }
      } else if (this.inputType == "U") {
        if (this.status == "U") {
          console.log("createUserItem");
          this.modifiedUserItem();
        } else if (this.status == "D") {
          this.modifiedDeptItem();
        }
      }
    },
    cancelBtn() {
      this.status = "";
      this.inputType = "";
      this.selectTreeNode2(this.selectNode);
    },
    createUserItem() {
      let dept_role = new Map();
      _.map(this.desserts_table, (el) => {
        dept_role.set(el.id, "N");
      });
      const validate = this.$refs.form.validate();
      dept_role = Object.fromEntries(dept_role);
      console.log("dept_role", dept_role);
      console.log("validate", validate);

      let userItem = {
        userName: this.user_name,
        departmentId: this.dept_val,
        userId: this.user_ID,
      };
      if (validate) {
        createUserItem(userItem)
          .then((response) => {
            console.log("createUserItem", response);
            if (response.status == 200) {
              this.inputType = "";
            }

            this.getdeptItem();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    createDeptItem() {
      let dept_role = new Map();
      _.map(this.desserts_table, (el) => {
        dept_role.set(el.id, "N");
      });

      dept_role = Object.fromEntries(dept_role);
      console.log("dept_role", dept_role);
      let deptItem = {
        name: this.new_dept_name,
        departmentRoles: dept_role,
      };

      createDepartmentItem(deptItem)
        .then((response) => {
          console.log("createDepartmentItem", response);
          if (response.status == 200) {
            this.inputType = "";
          }
          this.getdeptItem();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    modifiedUserItem() {
      let deptItem = {
        userId: this.user_ID,
        userName: this.user_name,
        departmentId: this.dept_val,
        accountRoles: this.makeJsonRoleData(),
      };

      updateUserItem(deptItem)
        .then((response) => {
          console.log("updateUserItem", response);
          if (response.status == 200) {
            this.inputType = "";
          }
          this.getdeptItem();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    modifiedDeptItem() {
      let deptItem = {
        name: this.dept_name,
        departmentRoles: this.makeJsonRoleData(),
      };

      updateDepartmentItem(deptItem)
        .then((response) => {
          console.log("updateDepartmentItem", response);
          this.getdeptItem();
          if (response.status == 200) {
            this.inputType = "";
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style lang="" scoped></style>
