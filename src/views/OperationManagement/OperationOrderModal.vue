<template>
  <div>
    <v-dialog v-model="openModal" persistent max-width="900px">
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
          <v-card elevation="4">
            <v-card-text>
              <v-form ref="form" lazy-validation>
                <v-row dense>
                  <v-col cols="3">
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
                  <v-col cols="1">
                    <v-select
                      v-model="orderData.selectObject"
                      :items="objectList"
                      item-value="value"
                      item-text="name"
                      label="목적"
                      dense
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="3">
                    <v-autocomplete
                      label="거래처"
                      v-model="orderData.customer"
                      tabindex="2"
                      item-value="id"
                      :items="customerData"
                      item-text="name"
                      :disabled="customerData.length == 0"
                      required
                      dense
                      no-data-text="검색결과가 없습니다."
                    ></v-autocomplete>
                  </v-col>

                  <v-col cols="2">
                    <v-autocomplete
                      label="부서"
                      v-model="orderData.department"
                      tabindex="3"
                      :items="departmentData"
                      item-text="departmentName"
                      item-value="departmentId"
                      @change="selectedDepartment"
                      required
                      dense
                      no-data-text="검색결과가 없습니다."
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="2">
                    <v-autocomplete
                      tabindex="4"
                      v-model="orderData.departmentchargeId"
                      item-text="chargeName"
                      item-value="id"
                      :items="departmentCrewList"
                      :disabled="departmentCrewList.length == 0"
                      label="담당자"
                      required
                      dense
                      no-data-text="검색결과가 없습니다."
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="3">
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
                <v-row dense>
                  <v-col cols="3">
                    <v-autocomplete
                      v-model="orderData.selectItem"
                      :items="itemList"
                      item-value="id"
                      item-text="name"
                      dense
                      label="품종"
                      no-data-text="검색결과가 없습니다."
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="3">
                    <v-text-field
                      label="수량"
                      type="number"
                      v-model="orderData.targetCount"
                      dense
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col cols=" 12">
                    <v-data-table
                      :headers="bomHeaders"
                      :items="bomData"
                      disable-pagination
                      item-key="id"
                      hide-default-footer
                      :items-per-page="20"
                      dense
                      no-data-text="데이터가 없습니다."
                    >
                      <template v-slot:item.targetCount="props">
                        <v-edit-dialog
                          cancel-text="취소"
                          save-text="수정"
                          v-if="!props.item.read"
                          :return-value.sync="props.item.targetCount"
                          large
                        >
                          {{ props.item.targetCount | comma }}
                          <template v-slot:input>
                            <v-text-field
                              v-model="props.item.targetCount"
                              label="Edit"
                              type="number"
                              single-line
                              counter
                              oninput="this.value = this.value.replace(/[^0-9]/g, '').replace(/(^0+)/, '');"
                            ></v-text-field>
                          </template>
                        </v-edit-dialog>
                        <span v-else-if="props.item.read">{{
                          props.item.targetCount | comma
                        }}</span>
                      </template>
                    </v-data-table>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      label="비고"
                      v-model="orderData.memo"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
        </v-card-text>
        <v-card-actions>
          <v-row dense justify="end">
            <v-btn
              v-show="change"
              class="mr-4"
              color="primary"
              @click="complete"
            >
              수 정
            </v-btn>
            <v-btn
              v-show="!change"
              :disabled="
                this.orderData.name == '' ||
                this.orderData.customer == '' ||
                this.orderData.departmentName == '' ||
                this.orderData.itemId
              "
              class="mr-1"
              color="primary"
              @click="complete('temp')"
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
            <v-btn color="error" @click="closeModal"> 닫기 </v-btn>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 임시저장 -->
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

@Component({
  filters: {
    comma(val: any) {
      if (val === null) {
        console.log(val);
        val = 0;
      }
      return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
})
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
  numberRule: any = (val: number) => {
    if (val < 0) return "Please enter a positive number";
    return true;
  };
  name: string = "";
  customerId: number | "" = "";
  customerList: any[] = [];
  departmentList: any[] = [];
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
  orderData: any = {
    name: "",
    selectObject: "",
    customer: "",
    department: "",
    departmentchargeName: "",
    deadline: "",
    selectItem: "",
    selectProcess: "",
    selectEquipData_regi: [],
    memo: "",
    targetCount: 0,
  };
  itemName: any = "";
  selectedData: any;
  selectItem: any = 0;
  equipment_modal: boolean = false;
  equipmentList: any[] = [];
  selectEquipData: any[] = [];
  selectEquipData_regi: any[] = [];
  objectList: any[] = [
    { name: "납품", value: "ORDER" },
    { name: "실험", value: "TEST" },
  ];
  selectObject: any = 0;
  processList: any[] = [];
  selectProcess: any = 0;
  bomData: any[] = [];

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
  onDepartmentDataChange() {
    if (this.orderData.department != 0) {
      this.getDepartmentCrewList();
    } else {
      this.orderData.departmentchargeId = "";
      this.orderData.departmentchargeName = "";
      this.departmentCrewList = [];
    }
  }

  @Watch("orderData.selectItem")
  onItemDataChange() {
    if (this.orderData.selectItem != 0) {
      this.bomData = [];
      this.getProcessList();
    } else {
      this.orderData.selectProcess = "";
      this.bomData = [];
    }
  }

  @Watch("editedCustomerData")
  onEditedCustomerDataChange() {
    console.log("editedCustomerData", this.editedCustomerData);
  }

  @Watch("item")
  onItemChange() {
    if (this.item != null) {
      this.itemName = this.item.name;
    }
  }

  @Watch("orderData.targetCount")
  onTargetCountChange(val: any) {
    console.log("onTargetCountChange", val);
    const regex = /[^0-9]/g;
    let getKeyword = val;

    if (regex.test(getKeyword)) {
      val = getKeyword.replace(regex, "");
      //asdklj  34532
    }

    val = val.replaceAll("^0+", "");

    if (this.bomData.length != 0) {
      this.bomData.forEach((el) => {
        if (el.read) {
          el.targetCount = val;
        }
      });
    }

    //return val;
  }

  get openModal() {
    this.getItemList();
    if (this.open && this.change) {
      this.getDetailData(this.editedCustomerData.jobOrderId);
    }
    return this.open;
  }
  set openModal(val: any) {
    this.$emit("closeModal", false);
  }
  get customerData() {
    return this.customerList;
  }

  get bomHeaders() {
    return cfg.header.bomHeaders;
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

  get itemTable() {
    return this.itemDetail;
  }

  mounted() {
    this.getDataList();
    this.getDepartmentList();
    this.itemDetail = [];
    this.search = "";
  }

  getDetailData(id: any) {
    let reqData = {
      jobOrderId: id,
    };
    this.orderData.id = id;
    console.log("asdasd", reqData);
    api.operation
      .getJobOrerDetail(reqData)
      .then((res) => {
        console.log("getJobOrerDetail", res);

        if (res.data.isSuccess) {
          this.orderData.name = res.data.responseData.jobOrderName;
          this.orderData.customer = res.data.responseData.customerId;
          this.orderData.department = res.data.responseData.departmentId;
          this.orderData.departmentchargeId = res.data.responseData.accountId;
          this.orderData.selectItem = res.data.responseData.itemId;
          // this.orderData.selectProcess = res.data.responseData.processId;
          this.orderData.itemCount = res.data.responseData.totalCount;
          this.orderData.selectObject = res.data.responseData.type;
          this.orderData.deadline = res.data.responseData.deadline;
          this.orderData.memo = res.data.responseData.memo;
          // this.orderData.selectEquipData_regi = _.cloneDeep(
          //   res.data.responseData.facilityDetails.forEach((element: any) => {
          //     element.use = element.jobOrderId !== null ? true : false;
          //     element.active = true;
          //   })
          // );

          // console.log(
          //   "selectEquipData_regi",
          //   res.data.responseData.facilityDetails
          // );

          // this.orderData.selectEquipData_regi = [
          //   ...res.data.responseData.facilityDetails,
          // ];
          console.log("------------", this.orderData);
        } else {
          this.closeModal();
          this.$swal({
            title: "정보를 가져오지 못했습니다. 다시 시도해주시기 바랍니다.",
            icon: "error",
            position: "top",
            showCancelButton: false,
            showConfirmButton: false,
            toast: true,
            timer: 1500,
          });
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  }

  toggleEquip(btnData: any) {
    console.log(btnData);
    if (btnData.use) {
      return;
    }
    btnData.active = !btnData.active;
    if (btnData.active) {
      this.selectEquipData.push(btnData);
    } else {
      this.selectEquipData = this.selectEquipData.filter(
        (element) => element.facilityDetailId !== btnData.facilityDetailId
      );
    }

    return;
  }

  openModal_equipment() {
    this.equipment_modal = true;
    this.selectEquipData = _.cloneDeep(this.selectEquipData_regi);
    api.facility.getFacilityList().then((res) => {
      console.log("getFacilityList", res);
      res.data.responseData.forEach((element: any) => {
        element.details.forEach((element_sub: any) => {
          element_sub.facilityName = element.facilityName;

          element_sub.use = element_sub.jobOrderId !== null ? true : false;
          if (
            _.filter(this.selectEquipData_regi, {
              facilityDetailId: element_sub.facilityDetailId,
            }).length !== 0
          ) {
            element_sub.active = true;
          } else {
            element_sub.active = false;
          }
        });
      });
      this.equipmentList = res.data.responseData;

      console.log("equipmentList", this.equipmentList);
    });
  }

  saveEquipmentInfo() {
    this.equipment_modal = false;
    this.orderData.selectEquipData_regi = _.cloneDeep(this.selectEquipData);
  }
  closeModal_equipment() {
    this.equipment_modal = false;
    this.selectEquipData = [];
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
        this.customerList = [{ name: "선택", code: "", id: "" }];
        this.customerList.push(...response.data.responseData.basicCustomers);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getItemList() {
    let reqData = {
      page: 1,
      size: 9999,
      type: "완제품",
      sortBy: [],
      sortDesc: [false],
    };
    this.selectEquipData = [];

    api.item.getItemList(reqData).then((res) => {
      //console.log("getItemList", res);
      this.itemList = res.data.responseData;
    });
  }
  getDepartmentList() {
    api.operation
      .getDepartmentDataPage()
      .then((response) => {
        this.departmentList = [{ departmentName: "선택", departmentId: 0 }];
        this.departmentList.push(...response.data.responseData);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  getDepartmentCrewList() {
    if (this.orderData.department != 0) {
      let joborder = {
        departmentId: this.orderData.department,
      };

      return api.operation
        .getDepartmentCrewDataPage(joborder)
        .then((response) => {
          this.departmentCrewList = response.data.responseData;
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      return (this.departmentCrewList = []);
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
  selectedDepartment(data: any) {
    this.orderData.departmentchargeId = "";
    if (this.orderData.department != 0) {
      console.log("selectedDepartment", data);
      this.getDepartmentCrewList();
    } else {
      this.departmentCrewList = [];
    }
  }
  checkTempSave() {
    return (
      this.orderData.name == "" &&
      this.orderData.customer == "" &&
      this.orderData.departmentName == "" &&
      this.orderData.item == "" &&
      this.orderData.memo == ""
    );
  }
  complete(type?: string) {
    this.selectedData = [];

    let joborder: any = {
      name: this.orderData.name,
      accountId: this.orderData.departmentchargeId,
      customerId: this.orderData.customer,
      itemId: this.orderData.selectItem,
      // processId: this.orderData.selectProcess,
      orderInfoDetailId: 1,
      totalCount: this.orderData.itemCount,
      type: this.orderData.selectObject,
      deadline: this.orderData.deadline,
      memo: this.orderData.memo,
      details: this.bomData,
      targetCount: this.orderData.targetCount,
    };
    joborder.facilityDetailIds = _.map(
      this.orderData.selectEquipData_regi,
      (el) => {
        return el.facilityDetailId;
      }
    );
    // validation check -> use _.map
    if (type == "temp") {
      return this.getTemp(joborder);
    }

    let validation_check: boolean = false;
    console.log("joborder");

    for (const [key, value] of Object.entries(joborder)) {
      if (key == "memo") {
        continue;
      }
      console.log(`${key}: ${value}`);

      if (value === "" || value === undefined || value === 0) {
        validation_check = true;
        break;
      }
      //
    }

    // if (validation_check) {
    //   return this.$swal({
    //     title: "입력칸의 공백을 확인해주세요",
    //     icon: "error",
    //     position: "top",
    //     showCancelButton: false,
    //     showConfirmButton: false,
    //     toast: true,
    //     timer: 1500,
    //   });
    // }

    if (this.change) {
      joborder.id = this.orderData.id;
      api.operation
        .makeOperationOrderPage(joborder)
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
            targetCount: 0,
            details: [],
          };
          this.openModal = false;
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      api.operation
        .makeOperationOrderPage(joborder)
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

  getTemp(joborderTemp: any) {
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
    console.log("aboutTemp", item.item);

    this.interimStorage = false;
    this.orderData.name = item.item.name;
    this.orderData.accountId = item.item.name;
    this.orderData.department = item.item.departmentId;
    this.orderData.departmentchargeId = item.item.chargeId;
    this.orderData.departmentchargeName = item.item.chargeName;
    this.orderData.selectItem = item.item.itemId;
    this.orderData.selectProcess = item.item.processId;
    this.orderData.customer = item.item.customer;
    this.orderData.selectObject = item.item.type;
    this.orderData.itemCount = item.item.totalCount;
    this.orderData.deadline = item.item.deadline;
    this.orderData.memo = item.item.memo;
    this.orderData.selectEquipData_regi = item.item.facilityDetails;

    this.getDepartmentCrewList();
  }

  getActiveCount(data: any) {
    let ActiveCnt = _.filter(data.details, { active: true });
    if (ActiveCnt == undefined) {
      return 0;
    }
    return ActiveCnt.length;
  }

  getUseCount(data: any) {
    let UseCnt = _.filter(data.details, { use: true });
    if (UseCnt == undefined) {
      return 0;
    }
    return UseCnt.length;
  }
  onClose(data: any) {
    console.log("data", data);
    this.$swal
      .fire({
        title: "삭제",
        text: "해당 시설을 삭제 하시겠습니까?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "삭제",
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.orderData.selectEquipData_regi = _.reject(
            this.orderData.selectEquipData_regi,
            {
              facilityDetailId: data.facilityDetailId,
            }
          );
        }
      });
  }
  closeModal() {
    this.openModal = false;
    this.orderData.name = "";
    this.orderData.departmentchargeId = "";
    this.orderData.customer = "";
    this.orderData.selectItem = 0;
    this.orderData.selectProcess = 0;
    this.orderData.department = 0;
    this.orderData.targetCount = 0;
    this.orderData.itemCount = "";
    this.orderData.selectObject = "";
    this.orderData.deadline = "";
    this.orderData.memo = "";
    this.orderData.selectEquipData_regi = [];
    this.bomData = [];
  }
  getProcessList() {
    let reqData = {
      itemId: this.orderData.selectItem,
    };

    api.operation.getItemListByBom(reqData).then((res) => {
      console.log("getItemListByBom", res);
      if (res.data.responseData.length != 0) {
        let bomData = res.data.responseData.details.map((item: any) => {
          delete item.bomDetailId;
          return item;
        });
        if (res.data.responseData.productionType == "실생묘") {
          res.data.responseData.details.forEach((element: any) => {
            element.targetCount = this.orderData.targetCount;
            element.read = true;
            return element;
          });
          this.bomData = res.data.responseData.details;
        } else if (res.data.responseData.productionType == "접목묘") {
          let arrData = [];
          arrData = res.data.responseData.details;

          arrData.forEach((element: any) => {
            element.targetCount = 0;
            element.read = false;
            return element;
          });
          arrData.push({
            itemName: res.data.responseData.itemName,
            itemId: res.data.responseData.itemId,
            count: 1,
            targetCount: this.orderData.targetCount,
            read: true,
          });
          this.bomData = arrData;
        }
        console.log("bomData", bomData);
      }
    });
  }

  saveTargetCount(count: string) {
    return parseInt(count);
  }
}
</script>
<style src="./OperationOrder.scss" lang="scss"></style>
