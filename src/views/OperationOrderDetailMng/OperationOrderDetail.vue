<template>
  <div>
    <v-container persistent fluid>
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
                      label="작업지시서코드"
                      v-model="searchJobOrder"
                      return-object
                      @keydown.enter="getSearch"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="2">
                    <v-text-field
                      solo
                      rounded
                      dense
                      hide-details="true"
                      label="품목명"
                      v-model="searchItemName"
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
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="12" align-self="center">
                    <v-radio-group dense v-model="row" row @change="getSearch">
                      진행 상태 :
                      <v-radio label="전체" value=""> </v-radio>
                      <v-radio label="준비" value="SB01"> </v-radio>
                      <v-radio label="파종" value="SB02"> </v-radio>
                      <v-radio label="발아" value="SB03"> </v-radio>
                      <v-radio label="1차육묘" value="SB04"> </v-radio>
                      <v-radio label="접목" value="SB05"> </v-radio>
                      <v-radio label="활착" value="SB06"> </v-radio>
                      <v-radio label="2차육묘" value="SB07"> </v-radio>
                      <v-radio label="완료" value="SB08"> </v-radio>
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
              <span class="searchbox-title">작업지시서 상세목록</span>
            </v-col>
          </v-row>
          <v-card>
            <v-data-table
              multi-sort
              fixed-header
              :height="table_height"
              :headers="headers"
              :items="totalTable"
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
              <template v-slot:[`item.status`]="{ item }">
                <v-btn
                  class="text-left mt-1 mb-1"
                  small
                  :color="getStatusColor(item.status)"
                  dark
                  style="width: 100px"
                  depressed
                >
                  <v-icon left> mdi-album </v-icon>
                  {{ getStatusCode(item.status, statusCode_detail) }}
                </v-btn>
              </template>

              <template v-slot:[`item.work`]="{ item }">
                <v-btn
                  v-show="item.status !== 'JOD_DONE'"
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
              <template v-slot:[`item.detail`]="{ item }">
                <v-btn small depressed @click="showDetailDialog(item)"
                  >상세보기</v-btn
                >
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
    </v-container>

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
              </v-text-field
            ></v-col>
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

    <v-dialog v-model="showDetail" max-width="800px">
      <v-card>
        <v-card-title> </v-card-title>
        <v-card-text>
          <v-row dense>
            <v-col cols="4" align-self="center">
              <span>작업지시코드</span>
              <v-text-field
                v-model="detailJobOrderData.code"
                disabled
                dense
                solo
                hide-details="false"
                class="text-box-style"
              ></v-text-field>
            </v-col>
            <v-col cols="3" align-self="center">
              <span>생성일</span>
              <v-text-field
                v-model="detailJobOrderData.createdDate"
                disabled
                dense
                solo
                hide-details="false"
                class="text-box-style"
              ></v-text-field>
            </v-col>
            <v-col cols="2" align-self="center">
              <span>작성자</span>
              <v-text-field
                v-model="detailJobOrderData.createdId"
                disabled
                dense
                solo
                hide-details="false"
                class="text-box-style"
              ></v-text-field>
            </v-col>
            <v-col cols="3" align-self="center">
              <span>거래처</span>
              <v-text-field
                v-model="detailJobOrderData.customer"
                disabled
                dense
                solo
                hide-details="false"
                class="text-box-style"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="3" align-self="center">
              <span>수정자</span>
              <v-text-field
                v-model="detailJobOrderData.modifiedId"
                disabled
                dense
                solo
                hide-details="false"
                class="text-box-style"
              ></v-text-field>
            </v-col>
            <v-col cols="3" align-self="center">
              <span>수정일</span>
              <v-text-field
                v-model="detailJobOrderData.modifiedDate"
                disabled
                dense
                solo
                hide-details="false"
                class="text-box-style"
              ></v-text-field>
            </v-col>
            <v-col cols="6" align-self="center">
              <span>메모</span>
              <v-text-field
                v-model="detailJobOrderData.memo"
                disabled
                dense
                solo
                hide-details="false"
                class="text-box-style"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="3" align-self="center">
              <span>작업지시서명</span>
              <v-text-field
                v-model="detailJobOrderData.name"
                disabled
                dense
                solo
                hide-details="false"
                class="text-box-style"
              ></v-text-field>
            </v-col>
            <v-col cols="3" align-self="center">
              <span>상태</span>
              <v-text-field
                v-model="detailJobOrderData.status"
                disabled
                dense
                solo
                hide-details="false"
                class="text-box-style"
              >
              </v-text-field>
            </v-col>
            <v-col cols="3" align-self="center">
              <span>목표수량</span>
              <v-text-field
                v-model="detailJobOrderData.targetCount"
                disabled
                dense
                solo
                hide-details="false"
                class="text-box-style"
              ></v-text-field>
            </v-col>
            <v-col cols="3" align-self="center">
              <span>타입</span>
              <v-text-field
                v-model="detailJobOrderData.type"
                disabled
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
          <v-btn color="error" @click="showDetail = false">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts">
import * as api from "@/api";
import cfg from "./config";
import { gridCfg } from "@/util/config/";
import { Component, Vue, Watch } from "vue-property-decorator";
import _ from "lodash";

@Component({
  components: {},
})
export default class OperationOrder extends Vue {
  countRules: any[] = [
    (v: any) =>
      !(v.length > 1 && v.charAt(0) == "0") || "0를 삭제 후 재입력해주세요",
  ];
  showDetail: boolean = false;
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
  searchItemName: string = "";
  searchJobOrder: string = "";
  searchCustomer: any = "";
  id: number | "" = "";
  departmentList: any[] = [];
  row: any = "";
  menu_start_date: boolean = false;
  menu_end_date: boolean = false;
  customerList: any[] = [];
  totalData: any[] = [];
  startDate: string = "";
  endDate: string = "";
  jobordeList: any = {};
  statusCode: any = [];
  statusCode_detail: any = [];
  joborder: any = {};
  detailJobOrderData: any = [];
  table_height: number = 0;

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

  get totalTable() {
    return this.totalData;
  }
  get headers() {
    return cfg.header.headers_Details_Details;
  }
  get detail_jobOrder_headers() {
    return cfg.header.detail_jobOrder;
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
    this.onResize();
  }

  onResize() {
    this.table_height = window.innerHeight - 48 - 129 - 94 - 44 - 20;
    console.log("onResize", this.table_height);
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

  showDetailDialog(item: any) {
    this.showDetail = true;
    let param = {
      code: item.jobOrderCode,
    };
    api.operation
      .searchJobOrderCode(param)
      .then((res) => {
        this.detailJobOrderData = res.data.responseData;
        let resData = res.data.responeData;

        this.detailJobOrderData.createdDate =
          this.detailJobOrderData.createDate.substr(0, 10);
        this.detailJobOrderData.modifiedDate =
          this.detailJobOrderData.modifiedDate.substr(0, 10);

        let statusList: { [key: string]: string } = {
          SA02: "진행중",
          SA01: "대기",
          SA03: "완료",
        };

        if (statusList.hasOwnProperty(this.detailJobOrderData.status)) {
          this.detailJobOrderData.status =
            statusList[this.detailJobOrderData.status];
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  getSearch() {
    const { page, itemsPerPage, sortBy, sortDesc } = this.orderListCfg.options;

    this.jobordeList = {
      joborder: this.searchJobOrder,
      item: this.searchItemName,
      customer: "",
      status: this.row,
      page: page,
      size: itemsPerPage,
      sortBy: sortBy,
      sortDesc: sortDesc,
    };

    this.orderListCfg.loading = true;

    if (this.searchCustomer != "") {
      this.jobordeList["customer"] = this.searchCustomer.code;
    }
    api.operation
      .getTotalDetailOrderListPage(this.jobordeList)
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

  start_detail(item: any, code: string) {
    console.log("startDetail", item);
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
              } else {
                console.log(response);
                this.$swal({
                  title: response.data.message,
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
  getStatusColor(status: string) {
    if (status == "SB01") return "orange";
    if (status == "SB08") return "#757575";
    else return "green";
  }
  getStatusCode(status: string, code: any[]) {
    if (status === undefined) {
      return "";
    }
    const foundCode = _.find(code, { code: status }); //code배열에서 status와 일치하는 객체를찾음
    if (foundCode === undefined || foundCode.name === undefined) {
      return "오류";
    }
    //정의되지않으면 오류로 반환함.
    return foundCode.name; //정의됐으면 name으로 반환함.
  }
  getStatusCodeNext(status: any, code: any[]) {
    if (status == undefined) {
      return "오류";
    }
    if (_.find(code, { code: status }).name == undefined) {
      return "오류";
    }
    const index: number = code.findIndex((item: any) => item.code === status);

    //console.log("status", status, index);

    if (index == code.length - 1) {
      //console.log("getStatusCodeNext2", index);
      return code[index];
    } else {
      // console.log("getStatusCodeNext1", index, this.statusCode[index + 1]);

      return code[index + 1];
    }
  }
}
</script>
<style src="./OperationOrderDetail.scss" lang="scss"></style>
