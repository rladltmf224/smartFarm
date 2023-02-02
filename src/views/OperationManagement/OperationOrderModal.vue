<template>
  <div>
    <v-dialog v-model="openModal" persistent max-width="1500px">
      <v-card>
        <v-card-title>
          <span class="text-h5 dialog-title font-weight-bold" v-show="!change"
            >작업지시서 등록</span
          >
          <span class="text-h5 dialog-title font-weight-bold" v-show="change"
            >작업지시서 수정</span
          >
        </v-card-title>
        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-row dense>
              <v-col cols="2">
                <v-text-field
                  label="작업지시서명"
                  oninput="javascript: if (this.value.length > 50) this.value = this.value.slice(0, 50);"
                  :rules="ordername_rule"
                  v-model="orderData.name"
                  tabindex="1"
                  required
                  dense
                ></v-text-field>
              </v-col>

              <v-col cols="2">
                <v-autocomplete
                  label="거래처"
                  v-model="orderData.customer"
                  tabindex="2"
                  item-value="id"
                  :items="customerData"
                  item-text="name"
                  return-object
                  required
                  dense
                ></v-autocomplete>
              </v-col>

              <v-col cols="1">
                <v-autocomplete
                  label="부서"
                  v-model="orderData.department"
                  tabindex="3"
                  :items="departmentData"
                  item-text="departmentName"
                  item-value="departmentId"
                  @change="selectedDepartment"
                  return-object
                  required
                  dense
                ></v-autocomplete>
              </v-col>
              <v-col cols="1">
                <v-autocomplete
                  tabindex="4"
                  v-model="orderData.departmentchargeName"
                  item-text="chargeName"
                  item-value="id"
                  :items="departmentCrewData"
                  label="담당자"
                  return-object
                  required
                  dense
                ></v-autocomplete>
              </v-col>
              <v-col cols="2">
                <v-menu
                  tabindex="5"
                  ref="deadline"
                  v-model="menu_deadline_date"
                  :close-on-content-click="false"
                  :return-value.sync="deadline"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      label="마감일"
                      v-model="orderData.deadline"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      dense
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="orderData.deadline"
                    no-title
                    scrollable
                    locale="ko-KR"
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="primary"
                      @click="menu_deadline_date = false"
                    >
                      취소
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="d_date_search(deadline)"
                    >
                      확인
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
            <v-row dense> </v-row>

            <v-row dense>
              <v-col cols="6">
                <v-text-field
                  class="pt-0"
                  label="비고"
                  v-model="orderData.memo"
                  tabindex="6"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-col class="text-right">
            <v-btn
              :disabled="itemTable.length == 0"
              v-show="change"
              class="mr-4"
              color="primary"
              @click="changeOn"
            >
              수 정
            </v-btn>
            <v-btn
              v-show="!change"
              :disabled="
                this.orderData.name == '' &&
                this.orderData.customer == '' &&
                this.orderData.departmentName == '' &&
                this.orderData.item == '' &&
                this.orderData.memo == ''
              "
              class="mr-1"
              color="primary"
              @click="getTemp"
            >
              임 시 저 장
            </v-btn>
            <v-btn
              v-show="!change"
              class="mr-1"
              color="primary"
              @click="tempOpen"
            >
              임 시 저 장 불 러 오 기
            </v-btn>
            <v-btn
              class="mr-1"
              v-show="!change"
              color="primary"
              @click="complete"
            >
              등 록
            </v-btn>
            <v-btn
              class="closeBtn"
              color="primary"
              text
              @click="openModal = false"
            >
              닫기
            </v-btn>
          </v-col>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog width="1200px" v-model="interimStorage" persistent>
      <v-card elevation="4">
        <v-card-title class="temp-title">
          <span class="text-h5 dialog-title font-weight-bold"
            >임시 저장 목록</span
          >
        </v-card-title>
        <v-card-text>
          <v-row dense>
            <v-col cols="3">
              <span class="text-h7 dialog-title font-weight-bold pl-20"
                >현재 임시저장된 총 : {{ templist.length }} 개</span
              >
            </v-col>
            <v-col cols="12">
              <v-data-table
                multi-sort
                fixed-header
                class="mr-2 ml-2 elevation-4"
                height="300"
                :sort-by="['createdDate']"
                :sort-desc="true"
                @dblclick:row="aboutTemp"
                :headers="tempheader"
                :items="templist"
                disable-pagination
                hide-default-footer
                dense
              >
                <template v-slot:[`item.deadline`]="{ item }">
                  {{ item.deadline }}
                </template>

                <template v-slot:[`item.details`]="{ item }">
                  <tr v-for="(i, index) in item.details" :key="index">
                    <td>{{ i.itemName }} /{{ i.count }}개</td>
                  </tr>
                </template>

                <template v-slot:[`item.edit`]="{ item }">
                  <v-icon small @click="tempDelete(item)"> mdi-delete </v-icon>
                </template>

                <template v-slot:no-data>
                  <h5>임시저장된 데이터가 없습니다.</h5>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-col class="text-right">
            <v-btn
              class="closeBtn mr-2"
              fluid
              color="primary"
              @click="removeTemp"
            >
              전 체 삭 제
            </v-btn>
            <v-btn
              class="closeBtn"
              color="primary"
              text
              @click="interimStorage = false"
            >
              닫기
            </v-btn>
          </v-col>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts">
import * as api from "@/api";
import cfg from "./config";
import _ from "lodash";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
@Component
export default class OperationOrderModal extends Vue {
  footer_option: {
    disableItemsPerPage: boolean;
    itemsPerPageAllText: string;
    itemsPerPageOptions: number[];
  } = {
    disableItemsPerPage: false,
    itemsPerPageAllText: "ALL",
    itemsPerPageOptions: [10, 20, 50, -1],
  };
  ordername_rule: any[] = [
    (v: any) =>
      !(v && v.length >= 50) || "작업지시서명 50자 이상 입력할 수 없습니다.",
  ];
  name: string = "";
  customerId: number | "" = "";
  customerList: any[] = [];
  departmentList: any[] = [];
  keyword: string = "";
  deadline: string = "";
  menu_deadline_date: boolean = false;
  memo: string = "";
  itemList: any[] = [];
  search: string = "";
  searchlist: any[] = [];
  selectedProduct: [] = [];
  itemDetail: any[] = [];
  selected: [] = [];
  interimStorage: boolean = false;
  templist: any[] = [];
  item: any = "";
  departmentCrewList: any[] = [];
  orderData: any = [];
  itemName: any = "";
  selectedData: any;

  @Prop({ required: true }) open: boolean;
  @Prop({ required: true }) change: boolean;
  @Prop({
    required: true,
    default: () => {
      return {
        name: "", //작업지시서명
        customer: "", //거래처ID
        department: "", //부서
        departmentchargeName: "", //담당자
        deadline: "", //마감일
        memo: "", //메모
        //details: [], //추가한 품목 목록
      };
    },
  })
  editedCustomerData: any;

  @Watch("orderData.department")
  onOrderDataChange() {
    if (
      this.orderData.department != "" &&
      this.orderData.department.departmentName != "전체"
    ) {
      this.getDepartmentCrewList();
    } else {
      this.orderData.departmentchargeName = "";
    }
  }

  @Watch("editedCustomerData")
  onEditedCustomerDataChange() {
    this.itemDetail = [];
    this.orderData = this.editedCustomerData;
    var resultDetails: any = _.get(this.editedCustomerData, "details");
    const newArray = resultDetails.map((item: any) => {
      return {
        id: item.itemId,
        name: item.itemName,
        version: item.itemVersion,
        count: item.count,
      };
    });
    this.itemDetail = newArray;
  }

  @Watch("item")
  onItemChange() {
    if (this.item != null) {
      this.itemName = this.item.name;
    }
  }

  get openModal() {
    return this.open;
  }
  set openModal(val: any) {
    this.$emit("closeModal", false);
  }
  get customerData() {
    return this.customerList;
  }

  get itemheaders() {
    return cfg.header.itemheaders;
  }
  get selectedheaders() {
    return cfg.header.selectedheaders;
  }
  get tempheader() {
    return cfg.header.tempheader;
  }
  get departmentData() {
    return this.departmentList;
  }
  get departmentCrewData() {
    return this.departmentCrewList;
  }
  get itemData() {
    if (this.search != "") {
      this.searchlist = [];

      for (var i = 0; i < this.itemList.length; i++) {
        if (this.itemList[i].name.includes(this.search)) {
          this.searchlist.push(this.itemList[i]);
        }
      }
    } else {
      this.searchlist = this.itemList;
    }
    return this.searchlist;
  }
  get itemTable() {
    return this.itemDetail;
  }

  mounted() {
    this.getDataList();
    this.getDepartmentList();
    this.itemDetail = [];
    this.search = "";
  }

  d_date_search(v: any) {
    this.deadline = v;
    this.menu_deadline_date = false;
    let deadEL: any = this.$refs.deadline;
    deadEL.save(v);
  }
  getDataList() {
    api.operation
      .getBasicDataPage()
      .then((response) => {
        this.customerList = [{ name: "전체", code: "", id: "" }];
        this.customerList.push(...response.data.responseData.basicCustomers);
        this.itemList = response.data.responseData.basicItems;
      })
      .catch((error) => {
        console.log(error);
      });
  }
  getDepartmentList() {
    api.operation
      .getDepartmentDataPage()
      .then((response) => {
        this.departmentList = [{ departmentName: "전체", departmentId: "" }];
        this.departmentList.push(...response.data.responseData);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  getDepartmentCrewList() {
    let joborder;
    if (this.orderData.department != "") {
      this.keyword = this.orderData.department.departmentId;
    }

    joborder = {
      departmentId: this.keyword,
    };
    if (this.keyword != null) {
      api.operation
        .getDepartmentCrewDataPage(joborder)
        .then((response) => {
          this.departmentCrewList = response.data.responseData;
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
  getTempList() {
    api.operation
      .getOrderTempListPage()
      .then((response) => {
        this.templist = response.data.responseData;
      })
      .catch((error) => {
        console.log(error);
      });
  }
  selectedDepartment() {
    if (
      this.orderData.department != "" &&
      this.orderData.department.departmentName != "전체"
    ) {
      this.getDepartmentCrewList();
    } else {
      this.orderData.departmentchargeName = "";
    }
  }
  plus() {
    if (this.selectedProduct.length == 0) {
      this.$swal({
        title: "품목이 선택되지 않았습니다.",
        icon: "warning",
        position: "top",
        showCancelButton: false,
        showConfirmButton: false,
        toast: true,
        timer: 1500,
      });
    } else {
      if (this.selectedProduct.length != 0) {
        let totalID: any = _.map(this.itemDetail, "id");

        for (var i = 0; i < this.selectedProduct.length; i++) {
          let plusItem: any = this.selectedProduct[i];
          if (totalID.includes(plusItem.id)) continue;
          //plusItem["id"] = plusItem["id"];
          plusItem["count"] = null;
          this.itemDetail.push(plusItem);
        }

        this.selectedProduct = [];
      }
    }
  }
  minus() {
    if (this.orderData.details.length == 0) {
      this.$swal({
        title: "취소시킬 원자재가 선택되지 않았습니다.",
        icon: "warning",
        position: "top",
        showCancelButton: false,
        showConfirmButton: false,
        toast: true,
        timer: 1500,
      });
    } else {
      if (this.orderData.details.length != 0) {
        let removeID: any = [];
        for (var i = 0; i < this.orderData.details.length; i++) {
          removeID.push(this.orderData.details[i].id);
        }
        this.itemDetail = _.reject(this.itemDetail, function (o) {
          return removeID.includes(o.id);
        });
        this.orderData.details = [];
      }
    }
  }
  complete() {
    this.selectedData = [];

    if (
      this.orderData.name == "" ||
      this.orderData.customer == "" ||
      this.orderData.department == "" ||
      this.orderData.departmentchargeName == "" ||
      this.orderData.deadline == "" ||
      this.itemTable.length == 0
    ) {
      this.$swal({
        title: "입력칸의 공백을 확인해주세요",
        icon: "error",
        position: "top",
        showCancelButton: false,
        showConfirmButton: false,
        toast: true,
        timer: 1500,
      });
    } else {
      let check = true;

      for (var i = 0; i < this.itemTable.length; i++) {
        if (this.itemTable[i].count == null) {
          check = false;
          this.$swal({
            title: "입력된 수량이 없는 품목은 등록되지않습니다.",
            icon: "error",
            position: "top",
            showCancelButton: false,
            showConfirmButton: false,
            toast: true,
            timer: 1500,
          });
        } else {
          this.selectedData.push({
            itemId: this.itemTable[i].id,
            itemName: this.itemTable[i].name,
            count: this.itemTable[i].count,
          });
        }
      }
      if (check) {
        let joborder;

        joborder = {
          name: this.orderData.name,
          accountId: this.orderData.departmentchargeName,
          customerId: this.orderData.customer.id,
          deadline: this.orderData.deadline,
          memo: this.orderData.memo,
          details: this.selectedData,
        };
        api.operation
          .getOperationOrderPage(joborder)
          .then((response) => {
            if (response.status == 200) {
              this.$swal({
                title: "등록되었습니다.",
                icon: "success",
                position: "top",
                showCancelButton: false,
                showConfirmButton: false,
                toast: true,
                timer: 1500,
              });
              this.orderData = {
                name: "",
                customer: "",
                department: "",
                departmentchargeName: "",
                deadline: "",
                memo: "",
                details: [],
              };
              this.openModal = false;
            } else {
              this.$swal({
                title: "등록이 실패되었습니다.",
                icon: "error",
                position: "top",
                showCancelButton: false,
                showConfirmButton: false,
                toast: true,
                timer: 1500,
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  }
  changeOn() {
    this.selectedData = [];

    if (
      this.orderData.name == "" ||
      this.orderData.customer == "" ||
      this.orderData.department == "" ||
      this.orderData.departmentchargeName == "" ||
      this.orderData.deadline == "" ||
      this.itemTable.length == 0
    ) {
      this.$swal({
        title: "입력칸의 공백을 확인해주세요",
        icon: "error",
        position: "top",
        showCancelButton: false,
        showConfirmButton: false,
        toast: true,
        timer: 1500,
      });
    } else {
      let check = true;

      for (var i = 0; i < this.itemTable.length; i++) {
        if (this.itemTable[i].count == null) {
          check = false;
          this.$swal({
            title: "입력된 수량이 없는 품목은 등록되지않습니다.",
            icon: "error",
            position: "top",
            showCancelButton: false,
            showConfirmButton: false,
            toast: true,
            timer: 1500,
          });
        } else {
          this.selectedData.push({
            itemId: this.itemTable[i].id,
            itemName: this.itemTable[i].name,
            count: this.itemTable[i].count,
          });
        }
      }

      if (check) {
        let joborder;

        joborder = {
          name: this.orderData.name,
          accountId: this.departmentCrewList[0].id,
          id: this.orderData.id,
          deadline: this.orderData.deadline,
          memo: this.orderData.memo,
          details: this.selectedData,
        };
        api.operation
          .getOperationOrderChangePage(joborder)
          .then((response) => {
            if (response.status == 200) {
              this.$swal({
                title: "수정되었습니다.",
                icon: "success",
                position: "top",
                showCancelButton: false,
                showConfirmButton: false,
                toast: true,
                timer: 1500,
              });
            } else {
              this.$swal({
                title: "수정이 실패되었습니다.",
                icon: "error",
                position: "top",
                showCancelButton: false,
                showConfirmButton: false,
                toast: true,
                timer: 1500,
              });
            }
            this.orderData = {
              name: "",
              customer: "",
              department: "",
              departmentchargeName: "",
              deadline: "",
              memo: "",
              details: [],
            };
            this.openModal = false;
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  }
  getTemp() {
    this.selectedData = [];
    let joborderTemp;

    joborderTemp = {
      accountId: null,
      name: this.orderData.name,
      customerId: null,
      deadline: this.orderData.deadline,
      memo: this.orderData.memo,
      details: this.selectedData,
    };

    if (this.itemTable != null) {
      for (var i = 0; i < this.itemTable.length; i++) {
        this.selectedData.push({
          itemId: this.itemTable[i].id,
          count: this.itemTable[i].count,
        });
      }
    }

    if (this.orderData.departmentchargeName == null) {
      joborderTemp["accountId"] = null;
    } else if (this.orderData.departmentchargeName != "") {
      joborderTemp["accountId"] = this.orderData.departmentchargeName.id;
    }

    if (this.orderData.customer == null) {
      joborderTemp["customerId"] = null;
    } else if (
      this.orderData.customer != "" ||
      this.orderData.customer != null
    ) {
      joborderTemp["customerId"] = this.orderData.customer.id;
    }
    api.operation
      .getOrderTempPage(joborderTemp)
      .then((response) => {
        if (response.status == 200) {
          this.$swal({
            title: "임시 저장되었습니다.",
            icon: "success",
            position: "top",
            showCancelButton: false,
            showConfirmButton: false,
            toast: true,
            timer: 1500,
          });
          this.getTempList();
          this.itemName = null;
        } else {
          this.$swal({
            title: "임시 저장이 실패되었습니다.",
            icon: "error",
            position: "top",
            showCancelButton: false,
            showConfirmButton: false,
            toast: true,
            timer: 1500,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  tempOpen() {
    this.interimStorage = true;
    this.getTempList();
  }
  removeTemp() {
    let joborderTemp: any = {
      id: [],
    };

    for (var k = 0; k < this.templist.length; k++) {
      joborderTemp.id.push(this.templist[k].id);
    }

    this.$swal
      .fire({
        title: "삭제",
        text: "해당 데이터를 전체 삭제 하시겠습니까?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "삭제",
      })
      .then((result) => {
        if (result.isConfirmed) {
          api.operation
            .deletetempList(joborderTemp)
            .then((response) => {
              if (response.status == 200) {
                this.$swal({
                  title: "삭제되었습니다",
                  icon: "success",
                  position: "top",
                  showCancelButton: false,
                  showConfirmButton: false,
                  toast: true,
                  timer: 1500,
                });
                this.interimStorage = true;
                this.getTempList();
              } else {
                this.$swal({
                  title: "삭제가 실패되었습니다.",
                  icon: "error",
                  position: "top",
                  showCancelButton: false,
                  showConfirmButton: false,
                  toast: true,
                  timer: 1500,
                });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });
  }
  tempDelete(item: any) {
    let joborderTemp = {
      id: item.id,
    };

    this.$swal
      .fire({
        title: "삭제",
        text: "해당 데이터를 삭제 하시겠습니까?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "삭제",
      })
      .then((result) => {
        if (result.isConfirmed) {
          api.operation
            .deletetempList(joborderTemp)
            .then((response) => {
              if (response.status == 200) {
                this.$swal({
                  title: "삭제되었습니다",
                  icon: "success",
                  position: "top",
                  showCancelButton: false,
                  showConfirmButton: false,
                  toast: true,
                  timer: 1500,
                });
                this.getTempList();
                this.interimStorage = true;
                this.orderData = {
                  name: "",
                  customer: "",
                  department: "",
                  departmentchargeName: "",
                  deadline: "",
                  memo: "",
                  details: [],
                };
              } else {
                this.$swal({
                  title: "삭제 실패되었습니다.",
                  icon: "error",
                  position: "top",
                  showCancelButton: false,
                  showConfirmButton: false,
                  toast: true,
                  timer: 1500,
                });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });
  }
  aboutTemp(event: any, item: any) {
    this.itemDetail = [];

    this.interimStorage = false;
    this.orderData.name = item.name;
    //customer 변수 확인 필요
    // if (this.customer != null) {
    //   this.orderData.customer = item.customer.id;
    // }
    this.orderData.department = {
      departmentId: item.departmentId,
      departmentName: item.departmentName,
    };
    this.orderData.departmentchargeName = item.chargeName;
    this.orderData.deadline = item.deadline;
    this.orderData.memo = item.memo;

    for (var i = 0; i < item.details.length; i++) {
      this.itemDetail[i] = {
        count: item.details[i].count,
        id: item.details[i].itemId,
        name: item.details[i].itemName,
        version: item.details[i].itemVersion,
      };
    }
  }
}
</script>
<style src="./OperationOrder.scss" lang="scss"></style>
