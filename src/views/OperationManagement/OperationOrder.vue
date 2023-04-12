<template>
  <div>
    <v-container fluid v-resize="onResize">
      <v-row>
        <v-col class="ma-2" cols="12">
          <span class="searchbox-title">조회 조건</span>
          <v-card class="card-shadow pa-3" height="120">
            <v-row no-gutters>
              <v-col cols="10">
                <v-row dense>
                  <v-col cols="2">
                    <v-text-field
                      solo
                      rounded
                      dense
                      hide-details="false"
                      label="작업지시서명"
                      v-model="searchJobOrder"
                      return-object
                      @keydown.enter="getSearch"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="2">
                    <v-autocomplete
                      solo
                      rounded
                      hide-details="false"
                      dense
                      label="거래처"
                      class="pl-3"
                      v-model="searchCustomer"
                      :items="searchCustomerData"
                      @change="getSearch"
                      item-value="id"
                      item-text="name"
                      return-object
                      required
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="2">
                    <v-autocomplete
                      solo
                      rounded
                      hide-details="false"
                      dense
                      label="부서"
                      class="pl-3"
                      @change="getSearch"
                      v-model="searchDepartment"
                      :items="searchDepartmentData"
                      item-text="departmentName"
                      item-value="departmentId"
                      return-object
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="2">
                    <v-autocomplete
                      solo
                      rounded
                      hide-details="false"
                      dense
                      v-model="searchCrew"
                      :items="searchCrewData"
                      @change="getSearch"
                      item-text="chargeName"
                      label="담당자"
                      return-object
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="2">
                    <v-menu
                      dense
                      ref="startDate"
                      v-model="menu_start_date"
                      :close-on-content-click="false"
                      :return-value.sync="startDate"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          hide-details="false"
                          dense
                          v-model="startDate"
                          solo
                          rounded
                          label="시작일"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="startDate"
                        no-title
                        scrollable
                        locale="ko-KR"
                        :max="endDate"
                      >
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="menu = false">
                          취소
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="s_date_search(startDate)"
                        >
                          확인
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="2">
                    <v-menu
                      dense
                      ref="endDate"
                      v-model="menu_end_date"
                      :close-on-content-click="false"
                      :return-value.sync="endDate"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          hide-details="false"
                          rounded
                          solo
                          dense
                          v-model="endDate"
                          label="종료일"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="endDate"
                        no-title
                        scrollable
                        locale="ko-KR"
                        :min="startDate"
                      >
                        <v-spacer></v-spacer>
                        <v-btn
                          text
                          color="primary"
                          @click="menu_end_date = false"
                        >
                          취소
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="e_date_search(endDate)"
                        >
                          확인
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>

                <v-row dense>
                  <v-col cols="6">
                    <v-radio-group dense v-model="row" row @change="getSearch">
                      진행 상태 :
                      <v-radio label="전체" value=""> </v-radio>
                      <v-radio label="대기" value="대기"> </v-radio>
                      <v-radio label="작업 진행중" value="작업 진행중">
                      </v-radio>
                      <v-radio label="생산 완료" value="생산 완료"> </v-radio>
                      <v-radio label="작업 종료" value="작업 종료"> </v-radio>
                    </v-radio-group>
                  </v-col>
                </v-row>
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="2" class="text-right" align-self="center">
                <v-btn color="primary" x-large @click="getSearch">
                  <v-icon left> mdi-magnify </v-icon>
                  조회
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col class="ma-2" cols="12">
          <v-row dense class="mb-1">
            <v-col cols="2">
              <span class="searchbox-title">작업지시서 목록</span>
            </v-col>
            <v-spacer></v-spacer>
            <v-col class="text-right" cols="1">
              <!-- <v-btn small class="mr-1" color="primary" @click="totalDelete">
                선 택 삭 제
              </v-btn> -->
              <v-btn color="primary" @click="add"> 작업지시서 등록 </v-btn>
            </v-col>
          </v-row>
          <v-card>
            <v-data-table
              multi-sort
              fixed-header
              class="mt-1"
              height="300"
              v-model="toatalselected"
              :headers="headers"
              :items="totalTable"
              @click:row="dataDetail"
              dense
              :options.sync="orderListCfg.options"
              :server-items-length="orderListCfg.totalCount"
              :loading="orderListCfg.loading"
              :items-per-page="orderListCfg.itemsPerPage"
              :page.sync="orderListCfg.page"
              @page-count="orderListCfg.pageCount = $event"
              hide-default-footer
              no-data-text="데이터가 없습니다."
            >
              <template v-slot:item.status="{ item }">
                <v-btn
                  class="text-left mt-1 mb-1"
                  small
                  :color="getStatusColor(item.status)"
                  dark
                  style="width: 100px"
                  depressed
                >
                  <v-icon left> mdi-album </v-icon>
                  {{ getStatusCode(item.status) }}
                </v-btn>
              </template>
              <template v-slot:[`item.deadline`]="{ item }">
                {{ item.deadline }}
              </template>
              <template v-slot:[`item.edit`]="{ item }">
                <v-icon
                  v-show="item.status == '대기' || item.status == '생산전'"
                  small
                  class="mr-1"
                  @click="changeData(item)"
                >
                  mdi-pencil
                </v-icon>
                <v-icon
                  v-show="item.status == '대기' || item.status == '생산전'"
                  small
                  @click="deleteData(item)"
                >
                  mdi-delete
                </v-icon>
              </template>

              <template v-slot:[`item.changeOrder`]="{ item }">
                <v-btn
                  v-show="item.status !== 'DONE'"
                  text
                  small
                  fluid
                  color="primary"
                  class="mr-1 editBtn"
                  :value="getStatusCodeNext(item.status).code"
                  @click="start(item, getStatusCodeNext(item.status).code)"
                >
                  {{ getStatusCodeNext(item.status).name }}
                </v-btn>
              </template>
            </v-data-table>
          </v-card>
          <v-pagination
            circle
            v-model="orderListCfg.page"
            :length="orderListCfg.pageCount"
          ></v-pagination>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col class="ma-2" cols="12">
          <v-row dense class="mb-1">
            <v-col cols="2">
              <span class="searchbox-title">작업지시서 상세목록</span>
            </v-col>
          </v-row>
          <v-card>
            <v-data-table
              multi-sort
              class="detailFont"
              fixed-header
              :headers="headersDetail"
              height="260"
              :items="datatable"
              item-key="index"
              dense
              disable-pagination
              hide-default-footer
            >
              <template v-slot:item.status="{ item }">
                <v-btn
                  class="text-left mt-1 mb-1"
                  small
                  :color="getStatusColor(item.status)"
                  dark
                  style="width: 100px"
                  depressed
                >
                  <v-icon left> mdi-album </v-icon>
                  {{ item.status }}
                </v-btn>
              </template>

              <template v-slot:item.details="{ item }">
                <td :colspan="1" class="treeTable">
                  <v-data-table
                    multi-sort
                    :headers="totalItem"
                    :items="item.details"
                    dense
                    disable-pagination
                    hide-default-footer
                    hide-default-header
                  >
                  </v-data-table>
                </td>
              </template>

              <template v-slot:item.deadline="{ item }">
                {{ item.deadline }}
              </template>
              <template v-slot:no-data>
                <h5>작업지시서 선택 시, 보여집니다.</h5>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!--작업지시서 등록 모달-->
    <order-modal
      :open="orderDialog"
      :change="change"
      :editedCustomerData="editedOrder"
      @closeModal="closeModal"
    ></order-modal>
  </div>
</template>

<script lang="ts">
import * as api from "@/api";
import cfg from "./config";
import { gridCfg } from "@/util/config/";
import OrderModal from "./OperationOrderModal.vue";
import { Component, Vue, Watch } from "vue-property-decorator";
import _ from "lodash";

@Component({
  components: {
    OrderModal,
  },
})
export default class OperationOrder extends Vue {
  orderListCfg: any = {};
  orderDialog: boolean = false;
  editedOrder: any = {
    name: "", //작업지시서명
    customer: "", //거래처ID
    department: "", //부서
    departmentchargeName: "", //담당자
    deadline: "", //마감일
    memo: "", //메모
    details: [], //추가한 품목 목록
  };
  searchJobOrder: string = "";
  searchCustomer: any = "";
  searchDepartment: any = "";
  searchCrew: any = "";
  id: number | "" = "";
  change: boolean = false;
  departmentList: any[] = [];
  datatable: any[] = [];
  toatalselected: any[] = [];
  row: any = "";
  menu_start_date: boolean = false;
  menu_end_date: boolean = false;
  customerList: any[] = [];
  selectedData: any[] = [];
  totalData: any[] = [];
  startDate: string = "";
  endDate: string = "";
  jobordeList: any = {};
  departmentCrewList: any;
  statusCode: any = [];

  @Watch("searchDepartment")
  onSearchDepartmentChange() {
    if (
      this.searchDepartment != "" &&
      this.searchDepartment.departmentName != "전체"
    ) {
      this.getDepartmentCrewList();
    } else {
      this.searchCrew = "";
    }
  }

  @Watch("orderListCfg.options", { deep: true })
  onOrderListCfgChange() {
    this.getSearch();
  }

  get searchCustomerData() {
    return this.customerList;
  }

  get searchDepartmentData() {
    return this.departmentList;
  }
  get searchdepartmentData() {
    return this.departmentList;
  }
  get searchCrewData() {
    return this.departmentCrewList;
  }

  get totalTable() {
    return this.totalData;
  }
  get headers() {
    return cfg.header.headers;
  }
  get headersDetail() {
    return cfg.header.headersDetail;
  }

  get totalItem() {
    return cfg.header.totalItem;
  }

  created() {
    this.orderListCfg = Object.assign({}, gridCfg);
    this.editedOrder = Object.assign({}, this.editedOrder);
    this.statusCode = _.cloneDeep(cfg.data.status);
    this.orderListCfg.options.itemsPerPage = 6;
  }

  mounted() {
    this.getSearch();
    this.getDataList();
    this.getDepartmentList();
  }

  s_date_search(v: any) {
    this.startDate = v;
    this.menu_start_date = false;
    let startEL: any = this.$refs.startDate;
    startEL.save(v);
  }
  e_date_search(v: any) {
    this.endDate = v;
    this.menu_end_date = false;
    let endEL: any = this.$refs.endDate;
    endEL.save(v);
  }

  getSearch() {
    const { page, itemsPerPage, sortBy, sortDesc } = this.orderListCfg.options;

    this.jobordeList = {
      jobOrder: this.searchJobOrder,
      department: "",
      chargeName: "",
      customer: "",
      startDate: this.startDate,
      endDate: this.endDate,
      status: this.row,
      page: page,
      size: itemsPerPage,
      sortBy: sortBy,
      sortDesc: sortDesc,
    };

    this.orderListCfg.loading = true;
    if (this.searchDepartment != "") {
      if (this.searchDepartment.departmentName == "전체") {
        this.jobordeList["department"] = "";
      } else {
        this.jobordeList["department"] = this.searchDepartment.departmentName;
      }
    }

    if (this.searchCrew != "") {
      this.jobordeList["chargeName"] = this.searchCrew.chargeName;
    }

    if (this.searchCustomer != "") {
      this.jobordeList["customer"] = this.searchCustomer.code;
    }
    api.operation
      .getTotalOrderListPage(this.jobordeList)
      .then((response) => {
        this.totalData = response.data.responseData;
        this.orderListCfg.totalCount = response.data.totalCount;
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.orderListCfg.loading = false;
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
    //확인 필요
    let joborder: any;

    //totalDepartment 선언 안되있음
    // if (this.searchDepartment != "" && this.totalDepartment == "") {
    //   this.keyword = this.searchDepartment.departmentId;
    // } else if (this.totalDepartment != "" && this.searchDepartment == "") {
    //   this.keyword = this.totalDepartment.departmentId;
    // }

    // joborder = {
    //   departmentId: this.keyword,
    // };
    // if (this.keyword != null) {
    //   api.operation
    //     .getDepartmentCrewDataPage(joborder)
    //     .then((response) => {
    //       this.departmentCrewList = response.data.responseData;
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // }
  }

  getDataList() {
    api.operation
      .getBasicDataPage()
      .then((response) => {
        this.customerList = [{ name: "전체", code: "", id: "" }];
        this.customerList.push(...response.data.responseData.basicCustomers);
        //this.itemList = response.data.responseData.basicItems;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  dataDetail(item: object) {
    this.datatable = [];

    this.datatable.push(item);
  }
  add() {
    this.orderDialog = true;
    this.editedOrder = {
      name: "",
      customer: "",
      department: "",
      departmentchargeName: "",
      deadline: "",
      memo: "",
      details: [],
    };
  }
  start(item: any, code: string) {
    let joborder: object;

    joborder = {
      jobOrderId: item.id,
      status: code,
    };

    this.$swal
      .fire({
        text: "작업을 진행하시겠습니까?",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "진행",
      })
      .then((result) => {
        if (result.isConfirmed) {
          api.operation
            .updateOperationOrderPage(joborder)
            .then((response) => {
              if (response.status == 200) {
                this.$swal({
                  title: "작업을 진행하겠습니다.",
                  icon: "success",
                  position: "top",
                  showCancelButton: false,
                  showConfirmButton: false,
                  toast: true,
                  timer: 1500,
                });
                this.getSearch();
                this.toatalselected = [];
                this.datatable = [];
              } else {
                this.$swal({
                  title: "상태변경이 실패되었습니다.",
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

  finish(item: any) {
    let joborder: { jobOrderId: number; status: string };

    joborder = {
      jobOrderId: item.id,
      status: "완료",
    };

    this.$swal
      .fire({
        text: "생산을 완료하시겠습니까?",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "완료",
      })
      .then((result) => {
        if (result.isConfirmed) {
          api.operation
            .updateOperationOrderPage(joborder)
            .then((response) => {
              if (response.status == 200) {
                this.$swal({
                  title: "생산이 완료되었습니다.",
                  icon: "success",
                  position: "top",
                  showCancelButton: false,
                  showConfirmButton: false,
                  toast: true,
                  timer: 1500,
                });
                this.getSearch();
                this.toatalselected = [];
                this.datatable = [];
              } else {
                this.$swal({
                  title: "상태변경이 실패되었습니다.",
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

  totalDelete() {
    let joborder: any = {
      id: [],
    };

    if (this.toatalselected.length == 0) {
      return this.$swal({
        title: "삭제 할 목록이 없습니다.",
        icon: "error",
        position: "top",
        showCancelButton: false,
        showConfirmButton: false,
        toast: true,
        timer: 1500,
      });
    }

    for (var k = 0; k < this.toatalselected.length; k++) {
      if (this.toatalselected[k].status != "대기") {
        this.$swal({
          title: "대기 상태에서만 삭제가 가능합니다.",
          icon: "error",
          position: "top",
          showCancelButton: false,
          showConfirmButton: false,
          toast: true,
          timer: 1500,
        });
      } else {
        joborder.id.push(this.toatalselected[k].id);

        if (joborder != "") {
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
                  .deleteorderList(joborder)
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
                      this.getSearch();
                      this.toatalselected = [];
                      this.datatable = [];
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
      }
    }
  }
  changeData(item: any) {
    this.change = true;
    this.orderDialog = true;
    this.getDataList();
    this.getDepartmentList();
    this.editedOrder = Object.assign({}, item);
    this.editedOrder.department = {
      departmentId: item.departmentId,
      departmentName: item.departmentName,
    };
    this.editedOrder.departmentchargeName = {
      id: item.chargeId,
      chargeName: item.chargeName,
    };
  }
  deleteData(item: any) {
    let joborder: any = {
      id: item.id,
    };

    if (item.status == "생산전") {
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
              .deleteorderList(joborder)
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
                  this.getSearch();
                  this.datatable = [];
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
    } else {
      this.$swal({
        title: "대기 상태에서만 삭제가 가능합니다.",
        icon: "error",
        position: "top",
        showCancelButton: false,
        showConfirmButton: false,
        toast: true,
        timer: 1500,
      });
    }
  }
  getStatusColor(status: string) {
    if (status == "생산전") return "orange";
    else if (status == "생산중") return "blue darken-1";
    else if (status == "생산 완료") return "green";
    else return "black";
  }

  getStatusCode(status: string) {
    if (status === undefined) {
      return "";
    }
    if (_.find(this.statusCode, { code: status }).name == undefined) {
      return "오류";
    }
    return _.find(this.statusCode, { code: status }).name;
  }
  getStatusCodeNext(status: any) {
    if (status == undefined) {
      return "오류";
    }
    if (_.find(this.statusCode, { code: status }).name == undefined) {
      return "오류";
    }
    const index: number = this.statusCode.findIndex(
      (item: any) => item.code === status
    );

    console.log("status", status, index);

    if (index == this.statusCode.length - 1) {
      console.log("getStatusCodeNext2", index);
      return this.statusCode[index];
    } else {
      console.log("getStatusCodeNext1", index, this.statusCode[index + 1]);

      return this.statusCode[index + 1];
    }
  }
  closeModal() {
    this.orderDialog = false;
    this.change = false;
    this.editedOrder = {
      name: "",
      customer: "",
      department: "",
      departmentchargeName: "",
      deadline: "",
      memo: "",
      details: [],
    };
    this.getSearch();
  }
}
</script>
<style src="./OperationOrder.scss" lang="scss"></style>
