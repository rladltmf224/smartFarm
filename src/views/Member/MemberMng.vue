<template>
  <div>
    <v-container fluid>
      <v-row>
        <!-- 부서/직원 검색 -->
        <v-col md="4">

          <v-col>
            <h4 class="searchbox-title">부서/직원 검색</h4>
          </v-col>
          <v-sheet color="#f5f5f5" max-width="500" height="850">
            <v-sheet class="mb-4 pa-2 blue-grey lighten-2">
              <v-text-field v-model="searchTxt" label="검색어를 입력해주세요." dark flat solo-inverted hide-details clearable
                clear-icon="mdi-close-circle-outline"></v-text-field>
            </v-sheet>
            <v-card class="pa-4 lighten-2 " style="overflow-y: auto; height: 730px">
              <v-treeview v-model="tree" :open="initiallyOpen" :items="items" :search="searchTxt" activatable
                item-key="name" color="primary" :return-object="true" @update:active="selectTreeNode">
                <template v-slot:prepend="{ item, open }">
                  <v-icon v-if="!item.file" color="#ffc27a">
                    {{ open ? "mdi-folder-open" : "mdi-folder" }}
                  </v-icon>
                  <v-icon v-else>
                    {{ files[item.file] }}
                  </v-icon>
                </template>
              </v-treeview>
            </v-card>
          </v-sheet>
        </v-col>

        <!-- 권한 설정 -->
        <v-col md="8">
          <v-row>
            <v-col md="2">
              <h4 class="searchbox-title">권한 설정</h4>
            </v-col>
            <v-col class="text-right mb-2" offset-md="3" md="7">
              <v-btn v-if="inputType == ''" color="primary" @click="dialog3 = true">부서생성</v-btn>
              <v-btn v-if="inputType == '' && dept_name != ''" class="ml-2" color="primary"
                @click="clickCreateUserBtn">유저생성</v-btn>
              <v-btn v-if="inputType == ''" class="ml-2" color="primary" @click="clickUpdateBtn">수정</v-btn>
              <v-btn v-if="inputType != ''" class="ml-2" color="primary" @click="saveItem">저장</v-btn>
              <v-btn v-if="inputType != ''" class="ml-2" color="error" @click="cancleBtn">취소</v-btn>
            </v-col>
          </v-row>

          <v-card class="pa-5" max-width="auto" height="815">
            <div v-if="status == 'U'">
              <v-row>
                <v-col cols="6">
                  <v-select dense :items="items" item-text="name" item-value="id" label="부서" v-model="dept_val"
                    disabled></v-select>
                </v-col>
                <!-- <v-col cols="6">
                  <v-text-field name="name" label="직급" id="id"></v-text-field>
                </v-col> -->
              </v-row>
              <v-form ref="form" lazy-validation>
                <v-row>
                  <v-col cols="4">
                    <v-text-field name="name" label="아이디" id="id" v-model="user_ID" :rules="user_id_rule"
                      :disabled="inputType == '' || status != 'U'" required></v-text-field>
                  </v-col>
                  <v-col cols="4">
                    <v-text-field name="name" label="이름" v-model="user_name" :rules="user_nm_rule"
                      :disabled="inputType == '' || status != 'U'" required></v-text-field>
                  </v-col>
                  <v-col cols="4">
                    <v-text-field name="name" label="전화번호" v-model="phone_number" :rules="phone_nb_rule"
                      :disabled="inputType == '' || status != 'U'" required></v-text-field>
                  </v-col>
                </v-row>
              </v-form>
            </div>

            <div v-if="status == 'D'">
              <v-row>
                <v-col cols="6">
                  <v-text-field name="name" label="부서명" id="id" v-model="dept_name" disabled></v-text-field>
                </v-col>
              </v-row>
            </div>


            <v-data-table v-if="selectNode != ''" ref="roleList" :headers="headers_table" :items="rolesData" :height="650"
              hide-default-footer fixed-header class="elevation-0" locale="ko-KR" dense>
              <template #item="{ item }">
                <tr>
                  <td>{{ item.menu }}</td>
                  <td>
                    <v-select :items="permission_list" item-text="name" item-value="value" label="권한"
                      v-model="item.permission" :disabled="inputType == ''">
                    </v-select>
                    <span></span>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="dialog3" max-width="300px">
      <v-card>
        <v-card-title>
          <span>신규 부서생성</span>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-card-text>
          <v-col align-self="center">
            <v-text-field name="name" label="부서명" id="id" v-model="new_dept_name"></v-text-field>
          </v-col>
        </v-card-text>
        <v-card-actions>
          <v-col class="text-right">
            <v-btn color="success" text @click="clickSaveDeptItem_Modal">
              저장
            </v-btn>
            <v-btn color="primary" text @click="dialog3 = false"> 닫기 </v-btn>
          </v-col>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import * as api from "@/api";
import _ from "lodash";
import cfg from "./config";
import { Component, Vue, Ref } from "vue-property-decorator";
import AppBar from '@/components/Layout/AppBar.vue'
@Component({
  components: {
    AppBar
  },
})

export default class Member extends Vue {
  @Ref() form: HTMLFormElement;



  dialog3: boolean = false;
  new_dept_name: string = "";
  initiallyOpen: string[] = ["public"];
  permission_list: object[] = cfg.data.permission_list;
  status: string = "";
  searchTxt: string = "";
  user_ID: string = "";
  dept: string = "";
  dept_val: string = "";
  dept_name: string = "";
  user_name: string = "";
  phone_number: string = "";
  files: {} = cfg.data.filesData;
  inputType: string = "";
  selectNode: any = "";
  tree: [] = [];
  dept_list: string[] = ["정수기 부서", "청정기 부서", "비데 부서"];
  dept_role: any = "";
  items: any[] = [];
  rolesData: object[] = cfg.data.rolesData;
  user_id_rule: any[] = [
    (v: string) => !!v || "아이디는 필수 입력사항입니다.",
    (v: string) =>
      /^[a-zA-Z0-9]*$/.test(v) ||
      "아이디는 영문+숫자 5 ~ 10자만 입력 가능합니다.",
    (v: string) =>
      !(v && v.length >= 15) || "아이디는 10자 이상 입력할 수 없습니다.",
  ];
  user_nm_rule: any[] = [
    (v: string) => !!v || "이름은 필수 입력사항입니다.",
    (v: string) =>
      !(v && v.length >= 30) || "이름은 30자 이상 입력할 수 없습니다.",
    (v: string) =>
      !/[~!@#$%^&*()_+|<>?:{}]/.test(v) ||
      "이름에는 특수문자를 사용할 수 없습니다.",
  ];
  phone_nb_rule: any[] = [
    (v: string) => !!v || "전화번호는 필수 입력사항입니다.",
    (v: string) =>
      !(v && v.length >= 12) || "전화번호는 12자 이상 입력할 수 없습니다.",
    (v: string) =>
      !/[ㄱ-ㅎ가-힣a-zA-Z]/.test(v) ||
      "전화번호에는 숫자 외 입력할 수 없습니다.",
  ];

  get headers_table() {
    return cfg.header.rolesList;
  }

  mounted() {
    this.getdeptItem();
  }

  searchUsesr(e: { target: any }) {
    this.searchTxt = e.target.value;
  }

  changePermission(data: object) {
    console.log("changePermission", data);
  }

  selectTreeNode(node: any[]) {
    console.log("selectTreeNode", node);
    let selectedNode = node[0];
    this.selectNode = selectedNode;
    this.inputType = "";

    if (selectedNode == undefined || node.length == 0) {
      return;
    }
    switch (selectedNode.type) {
      case "user":
        this.status = "U";
        this.user_ID = selectedNode.userId;
        this.dept_val = selectedNode.dept_id;
        this.user_name = selectedNode.name;
        this.phone_number = selectedNode.phoneNumber
          ? selectedNode.phoneNumber
          : "";
        this.rolesData.forEach((element: any) => {
          element.permission = selectedNode.accountRoles[element.id];
        });

        return;
      case "dept":
        this.dept_name = selectedNode.name;

        this.rolesData.forEach((element: any) => {
          element.permission = selectedNode.departmentRoles[element.id];
        });
        this.dept_role = this.rolesData;
        return (this.status = "D");
    }
  }

  selectTreeNode2(node: any[]) {
    console.log("selectTreeNode", node);
    let selectedNode: any = node;
    this.selectNode = selectedNode;
    this.inputType = "";

    if (selectedNode == undefined) {
      return;
    }
    switch (selectedNode.type) {
      case "user":
        this.status = "U";
        this.user_ID = selectedNode.userId;
        this.dept_val = selectedNode.dept_id;
        this.user_name = selectedNode.name;
        this.phone_number = selectedNode.phoneNumber
          ? selectedNode.phoneNumber
          : "";
        this.rolesData.forEach((element: any) => {
          element.permission = selectedNode.accountRoles[element.id];
        });

        return;
      case "dept":
        this.dept_name = selectedNode.name;
        this.rolesData.forEach((element: any) => {
          element.permission = selectedNode.departmentRoles[element.id];
        });
        return (this.status = "D");
    }
  }

  cancleBtn() {
    this.status = "";
    this.inputType = "";
    this.selectTreeNode2(this.selectNode);
  }

  getdeptItem() {
    //this.item = [];
    api.department
      .getDepartmentItem()
      .then((response) => {
        console.log("getDepartmentItem", response);

        this.items = _.map(response.data.responseData, function (item) {
          let detp_Id = item.id;

          let result_sub = _.map(item.accounts, function (item) {
            return {
              name: item.userName,
              type: "user",
              file: "user",
              userId: item.userId,
              accountRoles: item.accountRoles,
              dept_id: detp_Id,
              id: item.id,
              phoneNumber: item.phoneNumber,
            };
          });
          let result = {
            name: item.name,
            type: "dept",
            children: result_sub,
            departmentRoles: item.departmentRoles,
            id: item.id,
          };
          return result;
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  makeJsonRoleData() {
    let dept_role = new Map();
    _.map(
      this.rolesData,
      (el: { menu: string; id: string; permission: boolean }) => {
        dept_role.set(el.id, el.permission);
      }
    );

    dept_role = Object.fromEntries(dept_role);
    return dept_role;
  }

  createDeptItem() {
    let dept_role = new Map();
    _.map(this.rolesData, (el: any) => {
      dept_role.set(el.id, "N");
    });

    dept_role = Object.fromEntries(dept_role);
    console.log("dept_role", dept_role);
    let deptItem = {
      name: this.new_dept_name,
      departmentRoles: dept_role,
    };
    api.department
      .createDepartmentItem(deptItem)
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
  }

  createUserItem() {
    let dept_role = new Map();
    _.map(this.rolesData, (el: any) => {
      dept_role.set(el.id, "N");
    });
    const validate = this.form.validate();
    dept_role = Object.fromEntries(dept_role);
    console.log("dept_role", dept_role);
    console.log("validate", validate);

    let userItem = {
      userName: this.user_name,
      departmentId: this.dept_val,
      userId: this.user_ID,
      phoneNumber: this.phone_number,
    };
    if (validate) {
      api.department
        .createUserItem(userItem)
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
  }
  resetRole() {
    for (let item in this.items) {
      this.items[item] = "N";
      console.log(this.items[item]);
    }
  }

  clickSaveDeptItem_Modal() {
    this.createDeptItem();
    this.dialog3 = false;
  }

  clickCreateBtn() {
    this.inputType = "C";
    this.dept_val = "";
    this.user_name = "";
    this.dept_name = "";
    this.phone_number = "";

    this.rolesData.forEach((el: any) => {
      el.permission = "N";
    });
  }

  clickCreateUserBtn() {
    this.inputType = "C";
    this.status = "U";
    this.dept_val = this.selectNode.id;
    this.user_name = "";
    this.phone_number = "";
    this.dept_name = "";
    this.user_ID = "";
    this.rolesData = this.dept_role;
  }

  modifiedDeptItem() {
    let deptItem = {
      name: this.dept_name,
      departmentRoles: this.makeJsonRoleData(),
    };
    api.department
      .updateDepartmentItem(deptItem)
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
  }
  modifiedUserItem() {
    let deptItem = {
      userId: this.user_ID,
      userName: this.user_name,
      phoneNumber: this.phone_number,
      departmentId: this.dept_val,
      accountRoles: this.makeJsonRoleData(),
    };
    api.department
      .updateUserItem(deptItem)
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
  }

  clickUpdateBtn() {
    if (this.dept_name != "" || this.selectNode != "") {
      this.inputType = "U";
    } else {
      this.$swal("경고", "부서나 유저를 선택해주세요", "error");
    }
  }

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
  }
}
</script>

<style src="./MemberMng.scss" lang="scss"></style>
