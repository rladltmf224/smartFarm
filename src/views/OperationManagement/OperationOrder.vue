<template>
  <div>
    <v-container fluid>
      <v-row>
        <v-col class="ma-2" cols="12">
          <span class="searchbox-title">조회 조건</span>
          <v-card class="card-shadow pa-3" height="130">
            <v-row no-gutters>
              <v-col cols="10">
                <v-row dense>
                  <v-col cols="2">
                    <v-text-field
                      solo
                      rounded
                      dense
                      hide-details="true"
                      label="작업지시서명"
                      v-model="searchJobOrder"
                      return-object
                      @keydown.enter="getSearch"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="2">
                    <span class="text"></span>
                    <v-autocomplete
                      solo
                      rounded
                      hide-details="true"
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
                      no-data-text="검색결과가 없습니다."
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="2">
                    <v-autocomplete
                      solo
                      rounded
                      hide-details="true"
                      dense
                      label="부서"
                      class="pl-3"
                      @change="selectedDepartment"
                      v-model="searchDepartment"
                      :items="searchDepartmentData"
                      return-object
                      item-text="departmentName"
                      item-value="departmentId"
                      no-data-text="검색결과가 없습니다."
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="2">
                    <v-autocomplete
                      solo
                      rounded
                      hide-details="true"
                      dense
                      v-model="searchCrew"
                      :items="searchCrewData"
                      @change="getSearch"
                      item-text="chargeName"
                      item-value="id"
                      label="담당자"
                      return-object
                      no-data-text="검색결과가 없습니다."
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
                          hide-details="true"
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
                          hide-details="true"
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
                  <v-col cols="12" align-self="center">
                    <v-radio-group dense v-model="row" row @change="getSearch">
                      진행 상태 :
                      <v-radio label="전체" value=""> </v-radio>
                      <v-radio label="대기" value="SA01"> </v-radio>
                      <v-radio label="진행중" value="SA02"> </v-radio>
                      <v-radio label="완료" value="SA03"> </v-radio>
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
            <v-col cols="2" align-self="center">
              <span class="searchbox-title">작업지시서 목록</span>
            </v-col>
            <v-spacer></v-spacer>
            <v-col class="text-right" cols="2">
              <v-btn color="primary" @click="add"> 작업지시서 등록 </v-btn>
            </v-col>
          </v-row>
          <v-card>
            <v-data-table
              multi-sort
              fixed-header
              height="300"
              v-model="clickedNum"
              item-key="jobOrderId"
              :headers="headers"
              :items="totalTable"
              @click:row="dataDetail"
              dense
              single-select
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
                  class="text-left"
                  small
                  :color="getStatusColor(item.status)"
                  dark
                  style="width: 100px"
                  depressed
                >
                  <v-icon left> mdi-album </v-icon>
                  {{ getStatusCode(item.status, statusCode) }}
                </v-btn>
              </template>
              <template v-slot:[`item.deadline`]="{ item }">
                {{ item.deadline }}
              </template>
              <template v-slot:[`item.changeOrder`]="{ item }">
                <v-btn
                  v-show="item.status !== 'JO_DONE'"
                  small
                  fluid
                  color="info"
                  class="mr-1 editBtn"
                  :value="getStatusCodeNext(item.status, statusCode).code"
                >
                  {{ getStatusCodeNext(item.status, statusCode).name }}
                </v-btn>
              </template>
              <template v-slot:[`item.edit`]="{ item }">
                <v-icon
                  v-if="item.status == 'SA01'"
                  small
                  @click="changeData(item)"
                >
                  mdi-pencil
                </v-icon>
                <v-icon
                  v-if="item.status == 'SA01'"
                  small
                  @click="deleteItem_pop(item)"
                >
                  mdi-delete
                </v-icon>
              </template>
              <template v-slot:[`item.addManure`]="{ item }">
                <v-btn
                  small
                  depressed
                  @click="openManureModal(item.jobOrderId)"
                >
                  농자재추가
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
          <v-row dense>
            <v-col cols="2" align-self="center">
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
              no-data-text="작업지시서 선택 시, 보여집니다."
            >
              <template v-slot:[`item.status`]="{ item }">
                <v-btn
                  class="text-left mt-1 mb-1"
                  small
                  dark
                  style="width: 100px"
                  depressed
                >
                  <v-icon left> mdi-album </v-icon>
                  {{ getStatusCode(item.status, statusCode_detail) }}
                </v-btn>
              </template>
              <template v-slot:item.print="{ item }">
                <v-icon small @click="openPrintModal(item)">
                  mdi-printer
                </v-icon>
              </template>
              <template v-slot:[`item.work`]="{ item }">
                <v-btn
                  v-show="item.status !== 'SB08'"
                  text
                  small
                  fluid
                  color="primary"
                  class="mr-1 editBtn"
                  :value="
                    getStatusCodeNext(item.status, statusCode_detail).code
                  "
                  @click="
                    start_detail(
                      item,
                      getStatusCodeNext(item.status, statusCode_detail).code
                    )
                  "
                >
                  {{ getStatusCodeNext(item.status, statusCode_detail).name }}
                </v-btn>
              </template>

              <template v-slot:item.deadline="{ item }">
                {{ item.deadline }}
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!--작업지시서 등록 모달-->
    <OrderModal
      :open="orderDialog"
      :change="change"
      :editedCustomerData="editedOrder"
      @closeModal="closeModal"
    ></OrderModal>

    <v-dialog v-model="updateStatus" width="450px">
      <v-card>
        <v-card-title> </v-card-title>

        <v-card-text class="pb-0">
          <v-row dense>
            <v-col align-self="center">
              <span>품목</span>
              <v-text-field
                label="품목"
                v-model.trim="this.itemName"
                dense
                solo
                disabled
                hide-details="false"
              ></v-text-field>
            </v-col>
            <v-col align-self="center">
              <span>투입수량</span>
              <v-text-field
                v-model.trim="this.exCount"
                dense
                solo
                disabled
                hide-details="false"
              ></v-text-field>
            </v-col>
            <v-col align-self="center">
              <span>다음단계</span>
              <v-text-field
                dense
                :value="this.nextStep"
                solo
                disabled
                hide-details="false"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col cols="6" class="pb-0">
              <span>불량갯수</span>
              <v-text-field
                v-model="orderData.inputCount"
                placeholder="불량 개수 입력"
                oninput="javascript: this.value = this.value.replace(/[^0-9]/g, '');"
                :rules="countRules"
                solo
              ></v-text-field>
            </v-col>
            <v-col cols="6" class="pb-0">
              <span class="ml-5">불량률</span>
              <v-text-field
                color="red"
                class="percentFont ml-5"
                v-model="percent"
                solo
                hide-details
                text-h4
                flat
              >
              </v-text-field>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col align-self="center">
              <span>비고</span>
              <v-text-field
                v-model="orderData.memo"
                dense
                solo
                hide-details="false"
                class="text-box-style"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="success" @click="done()">진행</v-btn>
          <v-btn color="error" @click="updateStatus = false">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 프린트수량입력 -->
    <v-dialog v-model="printOpen" width="400px" persistent>
      <v-card>
        <v-card-title>라벨 프린트</v-card-title>
        <v-card-text v-if="loadingSpinner">
          <LoadingSpinner></LoadingSpinner>
        </v-card-text>
        <v-card-text v-else>
          <span> 타이틀 </span>
          <v-radio-group dense row class="mt-0" v-model="printData.printType">
            <v-radio dense label="거래처명" value="C" color="success"></v-radio>
            <v-radio
              dense
              label="작업지시서명"
              value="T"
              color="success"
            ></v-radio>
          </v-radio-group>
          <span>파종날짜</span>
          <v-menu
            dense
            ref="print_sowingDate"
            v-model="print_menu_start_date"
            :close-on-content-click="false"
            :return-value.sync="print_sowingDate"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                class="text-box-style"
                hide-details="true"
                dense
                v-model="print_sowingDate"
                solo
                rounded
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="print_sowingDate"
              no-title
              scrollable
              locale="ko-KR"
            >
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="print_menu = false">
                취소
              </v-btn>
              <v-btn
                text
                color="primary"
                @click="print_s_date_search(print_sowingDate)"
              >
                확인
              </v-btn>
            </v-date-picker>
          </v-menu>
          <span>프린트할 수량</span>
          <v-text-field
            min="0"
            hide-details="true"
            type="number"
            dense
            solo
            max="999"
            class="text-box-style"
            placeholder="최대 999개"
            v-model="printData.printNum"
          >
          </v-text-field>
          <v-spacer></v-spacer>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" @click="print()"> 출력 </v-btn>
          <v-btn color="error" @click="closePrintModal()"> 닫기 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--농자재 추가 모달-->
    <OrderAddItemModal
      :open="itemDialog"
      @closeModal="closeItemModal"
      :id="orderId"
    >
    </OrderAddItemModal>
  </div>
</template>

<script lang="ts">
import * as api from "@/api";
import cfg from "./config";
import { gridCfg } from "@/util/config/";
import OrderModal from "./OperationOrderModal.vue";
import OrderAddItemModal from "./OperationOrderAddItem.vue";
import LoadingSpinner from "@/components/Loading/LodingSpinner.vue"; //로딩스피너
import { Component, Vue, Watch } from "vue-property-decorator";
import _ from "lodash";

@Component({
  components: {
    OrderModal,
    LoadingSpinner,
    OrderAddItemModal,
  },
})
export default class OperationOrder extends Vue {
  countRules: any[] = [
    (v: any) =>
      !(v.length > 1 && v.charAt(0) == "0") || "0를 삭제 후 재입력해주세요",
  ];
  orderId: string = "";
  itemName: string = "";
  nextStep: string = "";
  updateStatus: boolean = false;
  exCount: number = 0;
  percent: string = "0%";
  orderData: any = {
    inputCount: 0,
    memo: "",
  };
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
  departmentCrewList: any[] = [];
  statusCode: any = [];
  statusCode_detail: any = [];
  joborder: any = {};
  clickedNum: any = [];
  seletedJobOrderId: any = [];
  printOpen: boolean = false;
  printData: any = {
    printNum: 1,
    printType: "C",
  };
  print_menu_start_date: boolean = false;
  print_printType: string = "";
  print_menu: boolean = false;
  print_sowingDate: any = "";
  loadingSpinner: boolean = false;
  itemDialog: boolean = false;

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

  @Watch("orderData.inputCount")
  checkCount() {
    let stringNum = this.orderData.inputCount.toString();
    if (this.orderData.inputCount > this.exCount) {
      this.$swal({
        title: "투입수량보다 클 순 없습니다.",
        icon: "error",
        position: "top",
        showCancelButton: false,
        showConfirmButton: false,
        toast: true,
        timer: 1500,
      });
      return (this.percent = "0%");
    } else if (
      this.orderData.inputCount != 0 &&
      stringNum.length >= 1 &&
      stringNum.charAt(0) != "0"
    ) {
      let temp = (this.orderData.inputCount / this.exCount) * 100;
      let totalTemp = temp.toString().split(".");
      if (totalTemp.length != 1) {
        let firstNum = totalTemp[0].toString();
        let secondNum = totalTemp[1].toString().slice(0, 2);
        return (this.percent = `${firstNum}.${secondNum}%`);
      } else {
        let firstNum = totalTemp[0].toString();
        return (this.percent = `${firstNum}.00%`);
      }
    } else {
      return (this.percent = "0%");
    }
  }

  get searchCustomerData() {
    return this.customerList;
  }

  get searchDepartmentData() {
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
    this.statusCode = _.cloneDeep(cfg.data.status_JO);
    this.statusCode_detail = _.cloneDeep(cfg.data.status_JOD);
    this.orderListCfg.options.itemsPerPage = 6;
  }

  mounted() {
    this.getSearch();
    this.getDataList();
    this.getDepartmentList();
    this.setNowDate();
  }

  setNowDate() {
    //파종날짜를 현재로 디폴트하기
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    this.print_sowingDate = `${year}-${month}-${day}`;
  }

  s_date_search(v: any) {
    this.startDate = v;
    this.menu_start_date = false;
    let startEL: any = this.$refs.startDate;
    startEL.save(v);
  }
  print_s_date_search(v: any) {
    this.print_sowingDate = v;
    this.print_menu_start_date = false;
    let startEL: any = this.$refs.print_sowingDate;
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
    this.toatalselected = [];
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
  selectedDepartment() {
    if (this.searchDepartment.departmentId != "") {
      this.getDepartmentCrewList();
    } else {
      this.departmentCrewList = [];
    }
  }
  getDepartmentCrewList() {
    if (this.searchDepartment != "") {
      let joborder = {
        departmentId: this.searchDepartment.departmentId,
      };

      api.operation
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

  dataDetail(item: any, row: any) {
    row.select(true);
    let reqData = {
      jobOrderId: item.jobOrderId,
    };
    this.seletedJobOrderId = reqData;
    console.log("reqDatareqDatareqData", reqData);
    api.operation.getJobOrerDetail(reqData).then((res) => {
      console.log("getJobOrerDetail", res);
      this.datatable = res.data.responseData;
    });
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

  start_detail(item: any, code: string) {
    this.joborder = {};
    this.orderData.memo = "";
    this.orderData.inputCount = 0;
    this.updateStatus = true;
    this.nextStep = "";
    this.itemName = item.itemName;
    this.exCount = item.targetCount;

    let temp = this.statusCode_detail.find((item: any) => item.code == code);
    this.nextStep = temp.name;

    this.joborder = {
      jobOrderDetailId: item.jobOrderDetailId,
      status: code,
    };

    console.log("111111111111", this.joborder);
  }

  done() {
    this.joborder["failCount"] = this.orderData.inputCount;
    this.joborder["comment"] = this.orderData.memo;
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
            .updateOperationOrderPage(this.joborder)
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
                this.updateStatus = false;
                this.getSearch();
                this.toatalselected = [];
                /*  this.datatable = []; */

                let reqData = this.seletedJobOrderId;
                api.operation.getJobOrerDetail(reqData).then((res) => {
                  this.datatable = res.data.responseData;
                });
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

  changeData(item: any) {
    this.change = true;
    this.orderDialog = true;
    //this.getDataList();
    //this.getDepartmentList();

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
  openManureModal(item: any) {
    this.orderId = item;
    this.itemDialog = true;
  }
  closeItemModal() {
    this.itemDialog = false;
  }
  openPrintModal(item: any) {
    console.log(item);
    this.print_printType = "C";
    this.printOpen = true;
    this.printData.jobOrderDetailId = item.jobOrderDetailId;
  }

  print() {
    if (this.print_sowingDate == "") {
      alert("날짜를 기입해주세요.");
    } else if (this.printData.printNum == "") {
      alert("수량을 선택하세요.");
    } else {
      this.loadingSpinner = true;
      let param: any = {
        sowingDate: this.print_sowingDate.replace(/-/g, ""),
        joborderdetailId: this.printData.jobOrderDetailId,
        printCount: this.printData.printNum,
        printType: this.printData.printType,
      };
      api.operation
        .printLabelApi(param)
        .then((response: any) => {
          this.$swal({
            title: "출력을 요청했습니다.",
            icon: "success",
            position: "top",
            showCancelButton: false,
            showConfirmButton: false,
            toast: true,
            timer: 1500,
          });
        })
        .catch((error: any) => {
          console.log(error);
          this.$swal({
            title: "출력이 실패되었습니다.다시 시도해주세요.",
            icon: "error",
            position: "top",
            showCancelButton: false,
            showConfirmButton: false,
            toast: true,
            timer: 1500,
          });
        })
        .finally(() => {
          this.closePrintModal();
        });
    }
  }
  closePrintModal() {
    this.printOpen = false;
    this.printData.printNum = 1;
    this.loadingSpinner = false;
  }

  getStatusColor(status: string) {
    switch (status) {
      case "SA01":
        return "orange";
      case "SA02":
        return "green";
      case "SA03":
        return "#757575";
    }
  }

  /*   getStatusCode(status: string, code: any[]) {
      if (status === undefined) {
        return "";
      }
      if (_.find(code, { code: status }).name == undefined) {
        return "오류";
      }
      return _.find(code, { code: status }).name;
    } */

  getStatusCode(status: any, code: any) {
    //위 코드에서 에러나서 예외처리,수정함.
    if (status === undefined) {
      return "";
    }
    const foundItem = _.find(code, { code: status });
    if (foundItem && foundItem.name !== undefined) {
      return foundItem.name;
    } else {
      return "오류";
    }
  }

  getStatusCodeNext(status: any, code: any) {
    if (status === undefined) {
      return "오류";
    }
    const foundItem = _.find(code, { code: status });
    if (foundItem && foundItem.name !== undefined) {
      const index = code.findIndex((item: any) => item.code === status);
      if (index === -1) {
        return "오류";
      }
      if (index === code.length - 1) {
        return code[index];
      } else {
        return code[index + 1];
      }
    } else {
      return "오류";
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

  deleteItem_pop(item: any) {
    //this.deleteIndex = this.customer_list.indexOf(item);
    console.log("deleteItem_pop", item);
    let deleteItem = {
      jobOrderId: item.jobOrderId,
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
          api.operation.deleteorderList(deleteItem).then((res) => {
            this.getSearch();
            console.log("res", res.data.isSuccess);
            if (res.data.isSuccess) {
              this.datatable = [];
              return this.$swal.fire("성공", "삭제되었습니다.", "success");
            }

            return this.$swal.fire("실패", "관리자에게 문의바랍니다.", "error");
          });
        }
      });
  }
}
</script>
<style src="./OperationOrder.scss" lang="scss"></style>
