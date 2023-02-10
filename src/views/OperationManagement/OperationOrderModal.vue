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
                      return-object
                      required
                      dense
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
                      return-object
                      required
                      dense
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="2">
                    <v-autocomplete
                      tabindex="4"
                      v-model="orderData.departmentchargeName"
                      item-text="chargeName"
                      item-value="id"
                      :items="departmentCrewData"
                      :disabled="departmentCrewData.length == 0"
                      label="담당자"
                      required
                      dense
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
                      @change="getProcessList"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="3">
                    <v-select
                      label="공정설정"
                      :items="processList"
                      v-model="orderData.selectProcess"
                      item-value="processId"
                      item-text="process_name"
                      autocomplete
                      :disabled="processList.length == 0"
                      dense
                    ></v-select>
                  </v-col>
                  <v-col cols="2">
                    <v-text-field
                      v-model="orderData.itemCount"
                      type="number"
                      label="수량"
                      max="9999999"
                      step="10"
                      min="0"
                      dense
                      reverse
                      :rules="[numberRule]"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="1">
                    <v-btn color="primary" @click="openModal_equipment"
                      >시설등록</v-btn
                    >
                  </v-col>
                </v-row>
                <v-row dense>
                  <div class="d-flex">
                    <v-chip
                      v-for="data in orderData.selectEquipData_regi"
                      class="ma-1"
                      label
                      color="light-green accent-2"
                      :key="data.facilityDetailId"
                      @click:close="onClose(data)"
                      close
                    >
                      {{ data.facilityName }} ({{ data.name }})
                    </v-chip>
                  </div>
                </v-row>

                <v-row dense>
                  <v-col>
                    <v-text-field
                      class="pt-0"
                      label="비고"
                      v-model="orderData.memo"
                      tabindex="6"
                      dense
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
                this.orderData.name == '' ||
                this.orderData.customer == '' ||
                this.orderData.departmentName == '' ||
                this.orderData.item == '' ||
                this.orderData.memo == ''
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
            <v-btn
              class="closeBtn"
              color="primary"
              text
              @click="openModal = false"
            >
              닫기
            </v-btn>
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
    <!-- 시설등록 -->
    <v-dialog v-model="equipment_modal" persistent max-width="1300px">
      <v-card>
        <v-card-title primary-title>
          <div>
            <p>시설등록</p>
          </div>
        </v-card-title>
        <v-card-text>
          <!-- 시설 리스트 -->
          <v-card
            v-for="(el, index) in equipmentList"
            :key="index"
            class="mb-4"
          >
            <v-card-title>
              <span class="pr-3"
                >{{ el.facilityName }}({{ el.details.length }})
              </span>
              <span class="text-subtitle-2 pr-2">
                <v-chip
                  >미선택 :
                  {{
                    el.details.length - getUseCount(el) - getActiveCount(el)
                  }}</v-chip
                >
              </span>
              <span class="text-subtitle-2 pr-2">
                <v-chip color="primary">선택 : {{ getActiveCount(el) }}</v-chip>
              </span>
              <span class="text-subtitle-2">
                <v-chip color="light-green accent-2"
                  >사용 : {{ getUseCount(el) }}</v-chip
                >
              </span>
            </v-card-title>
            <v-card-text>
              <v-item-group multiple>
                <v-row class="d-flex justify-space-around">
                  <span v-if="el.details.length == 0"
                    ><p class="text-h6">등록된 시설이 없습니다</p></span
                  >
                  <v-item
                    v-else
                    v-for="n in el.details"
                    :key="n.facilityDetailId"
                  >
                    <v-card
                      :color="
                        n.use
                          ? 'light-green accent-2'
                          : n.active
                          ? 'primary'
                          : 'blue-grey darken-1'
                      "
                      class="d-flex align-center text-center"
                      dark
                      height="100"
                      width="100"
                      @click="toggleEquip(n)"
                    >
                      <v-card-text>
                        <div>
                          <span class="text-h6">{{ n.name }} </span>
                        </div>
                        <div><span v-if="n.use">상세정보</span></div>
                      </v-card-text>
                    </v-card>
                  </v-item>
                </v-row>
              </v-item-group>
            </v-card-text>
          </v-card>
        </v-card-text>

        <v-card-actions>
          <v-col class="text-right">
            <v-btn color="success" text @click="saveEquipmentInfo">
              저장
            </v-btn>
            <v-btn color="primary" text @click="closeModal_equipment">
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
  numberRule: any = (val: number) => {
    if (val < 0) return "Please enter a positive number";
    return true;
  };
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
  };
  itemName: any = "";
  selectedData: any;
  selectItem: any = 0;
  equipment_modal: boolean = false;
  equipmentList: any[] = [];
  selectEquipData: any[] = [];
  selectEquipData_regi: any[] = [];
  objectList: any[] = [
    { name: "납품", value: "납품" },
    { name: "실험", value: "실험" },
    { name: "기타", value: "기타" },
  ];
  selectObject: any = 0;
  processList: any[] = [];
  selectProcess: any = 0;

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
    this.getItemList();
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

  get itemTable() {
    return this.itemDetail;
  }

  mounted() {
    this.getDataList();
    this.getDepartmentList();
    this.itemDetail = [];
    this.search = "";
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

          element_sub.use = element_sub.productionId !== null ? true : false;
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
        this.customerList = [{ name: "전체", code: "", id: "" }];
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
      sortBy: [],
      sortDesc: [false],
    };
    this.selectEquipData = [];

    api.item.getItemList(reqData).then((res) => {
      console.log("getItemList", res);
      this.itemList = res.data.responseData;
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
  checkTempSave() {
    return (
      this.orderData.name == "" &&
      this.orderData.customer == "" &&
      this.orderData.departmentName == "" &&
      this.orderData.item == "" &&
      this.orderData.memo == ""
    );
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
  complete(type?: string) {
    this.selectedData = [];

    let joborder = {
      name: this.orderData.name,
      accountId: this.orderData.departmentchargeId,
      customerId: this.orderData.customer.id,
      itemId: this.orderData.selectItem,
      processId: this.orderData.selectProcess,
      orderInfoDetailId: 1,
      totalCount: this.orderData.itemCount,
      type: this.orderData.selectObject,
      deadline: this.orderData.deadline,
      memo: this.orderData.memo,
    };
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

    if (!validation_check) {
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
    } else {
      this.$swal({
        title: "입력칸의 공백을 확인해주세요",
        icon: "error",
        position: "top",
        showCancelButton: false,
        showConfirmButton: false,
        toast: true,
        timer: 1500,
      });
    }
  }
  changeOn() {
    this.selectedData = [];

    if (
      this.orderData.name == "" ||
      this.orderData.customer == "" ||
      this.orderData.department == "" ||
      this.orderData.departmentchargeId == "" ||
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
    //console.log("aboutTemp", item);

    this.interimStorage = false;
    this.orderData.name = item.item.name;
    this.orderData.accountId = item.item.name;
    this.orderData.department = item.item.departmentId;
    this.orderData.departmentchargeId = item.item.chargeId;
    this.orderData.selectItem = item.item.itemId;
    this.orderData.selectProcess = item.item.processId;
    this.orderData.customer = item.item.customer;
    this.orderData.selectObject = item.item.type;
    this.orderData.itemCount = item.item.totalCount;
    this.orderData.deadline = item.item.deadline;
    this.orderData.memo = item.item.memo;
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
        text: "해당 시설을 취소 하시겠습니까?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "취소",
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
  getProcessList() {
    let reqData = {
      itemId: this.orderData.selectItem,
    };
    api.process.getProcessListbyItem(reqData).then((res) => {
      console.log("getProcessListbyItem", res.data.responseData);

      this.processList = res.data.responseData;
    });
  }
}
</script>
<style src="./OperationOrder.scss" lang="scss"></style>
