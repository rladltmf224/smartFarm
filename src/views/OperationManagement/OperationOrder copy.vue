<template>
  <div>
    <v-container fluid>
      <v-row>
        <v-col class="ma-2" md="12">
          <h4 class="searchbox-title">조회 조건</h4>
          <v-sheet class="pa-3" color="#F6F8F9" height="120" elevation="2">
            <v-row>
              <v-col cols="10">
                <v-row class="pa-0 mt-1 searchRow">
                  <v-col cols="2" class="pt-0">
                    <v-text-field
                      dense
                      label="작업지시서"
                      v-model="searchJobOrder"
                      return-object
                      @keydown.enter="getSearch"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="2" class="pt-0">
                    <v-autocomplete
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

                  <v-col cols="2" class="pt-0">
                    <v-autocomplete
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
                  <v-col cols="2" class="pt-0">
                    <v-autocomplete
                      dense
                      class="pl-3"
                      v-model="searchCrew"
                      :items="searchCrewData"
                      @change="getSearch"
                      item-text="chargeName"
                      label="담당자"
                      return-object
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="2" class="pt-0">
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
                          dense
                          v-model="startDate"
                          label="시작일"
                          prepend-icon="mdi-calendar"
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
                  <v-col cols="2" class="pt-0">
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
                          dense
                          v-model="endDate"
                          label="종료일"
                          prepend-icon="mdi-calendar"
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
                  <v-col cols="10" class="pt-0">
                    <v-radio-group
                      dense
                      v-model="row"
                      row
                      class="statusBox"
                      @change="getSearch"
                    >
                      진행 상태 :
                      <v-radio class="pl-5" label="전체" value=""> </v-radio>
                      <v-radio class="pl-5" label="대기" value="대기">
                      </v-radio>
                      <v-radio label="작업 진행중" value="작업 진행중">
                      </v-radio>
                      <v-radio label="생산 완료" value="생산 완료"> </v-radio>
                      <v-radio label="작업 종료" value="작업 종료"> </v-radio>
                    </v-radio-group>
                  </v-col>
                </v-row>
              </v-col>
              <v-col class="pt-5 text-right" cols="2">
                <v-btn color="primary" x-large @click="getSearch">
                  <v-icon left> mdi-magnify </v-icon>
                  조회
                </v-btn>
              </v-col>
            </v-row>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>

    <v-container fluid>
      <v-row class="orderTableRow">
        <v-col class="ma-2" md="12">
          <v-row class="mb-2">
            <v-col md="2">
              <h4 class="searchbox-title">작업지시서 목록</h4>
            </v-col>
            <v-col class="text-right" offset-md="3" md="7">
              <v-btn small class="mr-1" color="primary" @click="totalDelete">
                선 택 삭 제
              </v-btn>
              <v-btn small class="mr-1" color="primary" @click="add">
                작업지시서 등록
              </v-btn>
            </v-col>
          </v-row>
          <v-data-table
            multi-sort
            fixed-header
            class="mt-1 elevation-4"
            height="333"
            v-model="toatalselected"
            :headers="headers"
            :items="totalTable"
            show-select
            @click:row="dataDetail"
            dense
            :options.sync="orderListCfg.options"
            :server-items-length="orderListCfg.totalCount"
            :loading="orderListCfg.loading"
            :items-per-page="orderListCfg.itemsPerPage"
            :page.sync="orderListCfg.page"
            @page-count="orderListCfg.pageCount = $event"
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

            <template v-slot:item.deadline="{ item }">
              {{ item.deadline }}
            </template>

            <template v-slot:item.edit="{ item }">
              <v-icon
                v-show="item.status == '대기'"
                small
                class="mr-1"
                @click="changeData(item)"
              >
                mdi-pencil
              </v-icon>
              <v-icon
                v-show="item.status == '대기'"
                small
                @click="deleteData(item)"
              >
                mdi-delete
              </v-icon>
            </template>

            <template v-slot:item.changeOrder="{ item }">
              <v-btn
                v-show="item.status == '대기'"
                text
                small
                fluid
                color="primary"
                class="mr-1 editBtn"
                value="작업 진행중"
                @click="start(item)"
              >
                시 작
              </v-btn>
              <v-btn
                v-show="item.status == '작업 진행중'"
                small
                fluid
                text
                color="primary"
                class="mr-1 editBtn"
                @click="finish(item)"
              >
                생 산 완 료
              </v-btn>
            </template>
          </v-data-table>
          <v-pagination
            v-model="orderListCfg.page"
            :length="orderListCfg.pageCount"
          ></v-pagination>
        </v-col>
      </v-row>
    </v-container>
    <v-container fluid>
      <v-row class="orderTableRow">
        <v-col class="ma-2" md="12">
          <v-row class="mb-2">
            <v-col md="2">
              <h4 class="searchbox-title">작업지시서 상세목록</h4>
            </v-col>
          </v-row>
          <v-data-table
            multi-sort
            class="elevation-4 detailFont"
            fixed-header
            :headers="headersDetail"
            height="220"
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

<script>
import * as api from "@/api";
import cfg from "./config";
import { gridCfg } from "@/util/config/";
import OrderModal from "./OperationOrderModal.vue";

export default {
  name: "OperationOrder",
  components: { OrderModal },
  mounted() {
    this.getSearch();
    this.getDataList();
    this.getDepartmentList();
  },
  data() {
    return {
      orderListCfg: {},
      orderDialog: false,
      editedOrder: {
        name: "", //작업지시서명
        customer: "", //거래처ID
        department: "", //부서
        departmentchargeName: "", //담당자
        deadline: "", //마감일
        memo: "", //메모
        details: [], //추가한 품목 목록
      },
      searchJobOrder: "",
      searchCustomer: "",
      searchDepartment: "",
      searchCrew: "",
      id: "",
      change: false,
      departmentList: [],
      datatable: [],
      toatalselected: [],
      row: "",
      menu_start_date: false,
      menu_end_date: false,
      customerList: [],
      selectedData: [],
      totalData: [],
      startDate: "",
      endDate: "",
      jobordeList: {},
    };
  },
  created() {
    this.orderListCfg = Object.assign({}, gridCfg);
    this.editedOrder = Object.assign({}, this.editedOrder);
  },
  methods: {
    s_date_search(v) {
      this.startDate = v;
      this.menu_start_date = false;
      this.$refs.startDate.save(v);
    },
    e_date_search(v) {
      this.endDate = v;
      this.menu_end_date = false;
      this.$refs.endDate.save(v);
    },

    getSearch() {
      const { page, itemsPerPage, sortBy, sortDesc } =
        this.orderListCfg.options;

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
    },
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
    },
    getDepartmentCrewList() {
      let joborder;

      if (this.searchDepartment != "" && this.totalDepartment == "") {
        this.keyword = this.searchDepartment.departmentId;
      } else if (this.totalDepartment != "" && this.searchDepartment == "") {
        this.keyword = this.totalDepartment.departmentId;
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
    },

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
    },

    dataDetail(item) {
      this.datatable = [];

      this.datatable.push(item);
    },
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
    },
    start(item) {
      let joborder;

      joborder = {
        jobOrderId: item.id,
        status: "시작",
      };

      this.$swal
        .fire({
          text: "작업을 진행하시겠습니까?",
          icon: "Info",
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
    },

    finish(item) {
      let joborder;

      joborder = {
        jobOrderId: item.id,
        status: "완료",
      };
      this.$swal
        .fire({
          text: "생산을 완료하시겠습니까?",
          icon: "Info",
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
    },

    totalDelete() {
      let joborder = {
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

          if (this.joborder != "") {
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
    },
    changeData(item) {
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
    },
    deleteData(item) {
      let joborder = {
        id: item.id,
      };

      if (item.status == "대기") {
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
    },
    getStatusColor(status) {
      if (status == "대기") return "orange";
      else if (status == "작업 진행중") return "blue darken-1";
      else if (status == "생산 완료") return "green";
      else return "black";
    },
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
    },
  },
  computed: {
    searchCustomerData() {
      return this.customerList;
    },
    searchDepartmentData() {
      return this.departmentList;
    },
    searchdepartmentData() {
      return this.departmentList;
    },
    searchCrewData() {
      return this.departmentCrewList;
    },

    totalTable: function () {
      return this.totalData;
    },
    headers: function () {
      return cfg.header.headers;
    },
    headersDetail: function () {
      return cfg.header.headersDetail;
    },

    totalItem: function () {
      return cfg.header.totalItem;
    },
  },
  watch: {
    searchDepartment: function () {
      if (
        this.searchDepartment != "" &&
        this.searchDepartment.departmentName != "전체"
      ) {
        this.getDepartmentCrewList();
      } else {
        this.searchCrew = "";
      }
    },
    "orderListCfg.options": {
      handler() {
        this.getSearch();
      },
      deep: true,
    },
  },
};
</script>
<style src="./OperationOrder.scss" lang="scss"></style>
