<template>
  <div class="warehousing">
    <v-container fluid>
      <v-row>
        <v-col class="ma-2" md="12">
          <h4 class="searchbox-title">조회 조건</h4>
          <v-card class="pa-3" height="140">
            <v-row>
              <v-col cols="10">
                <v-row>
                  <v-col cols="3">
                    <v-text-field
                      label="작업지시서명 or 코드"
                      v-model="search_condition.jobOrder"
                      @keydown.enter="getCustomer"
                      dense
                      solo
                      rounded
                    ></v-text-field>

                  </v-col>
                  <v-col cols="2">
                    <v-text-field label="거래처명 or 코드" v-model="search_condition.customer" @keydown.enter="getCustomer"
                      dense></v-text-field>
                  </v-col>
                  <v-col cols="2">
                    <v-text-field label="작업지시서 담당자" v-model="search_condition.jobOrderManager"
                      @keydown.enter="getCustomer" dense></v-text-field>
                  </v-col>
                  <v-col cols="2">
                    <v-select :items="search_job_status_list" v-model="search_condition.jobOrderStatus" label="작업지시서 상태"
                      item-text="name" item-value="value" dense></v-select>
                  </v-col>
                  <v-col cols="3">
                    <v-text-field label="작업지시서 메모" v-model="search_condition.jobOrderMemo" @keydown.enter="getCustomer"
                      dense></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="2">
                    <v-select :items="search_dateType" v-model="search_condition.dateType" label="날짜타입" item-text="name"
                      item-value="value" dense></v-select>
                  </v-col>
                  <v-col md="2">
                    <v-menu ref="startDate" v-model="startDate" :close-on-content-click="false"
                      :return-value.sync="search_condition.startDate" transition="scale-transition" offset-y
                      min-width="auto">
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field v-model="search_condition.startDate" label="시작일" prepend-icon="mdi-calendar"
                          readonly v-bind="attrs" v-on="on" dense></v-text-field>
                      </template>
                      <v-date-picker v-model="search_condition.startDate" no-title scrollable locale="ko-KR"
                        :max="search_condition.endDate">
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="startDate = false">
                          취소
                        </v-btn>
                        <v-btn text color="primary" @click="s_date_search(search_condition.startDate)">
                          확인
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col md="2">
                    <v-menu ref="endDate" v-model="endDate" :close-on-content-click="false"
                      :return-value.sync="search_condition.endDate" transition="scale-transition" offset-y
                      min-width="auto">
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field v-model="search_condition.endDate" label="종료일" prepend-icon="mdi-calendar" readonly
                          v-bind="attrs" v-on="on" dense></v-text-field>
                      </template>
                      <v-date-picker v-model="search_condition.endDate" no-title scrollable locale="ko-KR"
                        :min="search_condition.startDate">
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="endDate = false">
                          취소
                        </v-btn>
                        <v-btn text color="primary" @click="e_date_search(search_condition.endDate)">
                          확인
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-col>

                  <v-col cols="2">
                    <v-text-field label="출고코드" v-model="search_condition.releaseCode" @keydown.enter="getCustomer"
                      dense></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="2">
                <v-col class="pt- text-right">
                  <v-btn color="primary" x-large @click="getCustomer">
                    조회
                  </v-btn>
                </v-col>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col class="ma-2 mt-0" md="12">
          <v-row class="mb-1">
            <v-col md="2">
              <h4 class="searchbox-title">출고 목록</h4>
            </v-col>
            <v-col class="text-right" offset-md="7" md="3">
              <v-btn class="ml-1" small color="primary" @click="editItem"><v-icon left> mdi-book-account </v-icon>출고
                요청</v-btn>
            </v-col>
          </v-row>
          <v-card>

            <v-data-table height="315" :headers="headers" :items="statement_list" item-key="jobOrderId" fixed-header dense
              multi-sort single-select @click:row="selectCustomer" :options.sync="releaseOrderOption.options"
              :server-items-length="releaseOrderOption.totalCount" :loading="releaseOrderOption.loading"
              :items-per-page="releaseOrderOption.itemsPerPage" :page.sync="releaseOrderOption.page"
              @page-count="releaseOrderOption.pageCount = $event" hide-default-footer>
              <template v-slot:[`item.jobOrderStatus`]="{ item }">
                <v-btn class="text-left" small :color="getStatusColor(item.jobOrderStatus)" dark style="width: 120px"
                  depressed>
                  <v-icon left> mdi-album </v-icon>
                  {{ item.jobOrderStatus }}
                </v-btn>
              </template>
              <template v-slot:[`item.releaseStatus`]="{ item }">
                <v-btn class="text-left" small :color="getStatusColor(item.releaseStatus)" dark style="width: 100px"
                  depressed>
                  <v-icon left> mdi-album </v-icon>
                  {{ item.releaseStatus }}
                </v-btn>
              </template>
              <template v-slot:[`item.totalPrice`]="{ item }">
                {{ item.totalPrice | comma }}원
              </template>
              <template v-slot:[`item.edit`]="{ item }">
                <v-btn v-if="item.status == '출고 요청'" small class="mr-2" @click="releaseProcess(item)">
                  출고진행
                </v-btn>
                <v-btn v-if="item.status == '출고 진행'" small class="mr-2" @click="releaseDone(item)">
                  출고완료
                </v-btn>
                <v-btn v-if="item.status != '출고 취소'" small class="mr-2" @click="releaseCancle(item)">
                  출고취소
                </v-btn>
              </template>
            </v-data-table>
            <v-col>
              <v-pagination circle v-model="releaseOrderOption.page"
                :length="releaseOrderOption.pageCount"></v-pagination></v-col>
          </v-card>
        </v-col>
        <v-col cols="12" class="pt-0 pb-0">
          <v-tabs v-model="tabs" align-with-title>
            <v-tabs-slider color="green"></v-tabs-slider>
            <v-tab v-for="item in way_list" :key="item.name">
              {{ item.name }}
            </v-tab>
          </v-tabs>
        </v-col>
        <v-col cols="12">
          <v-tabs-items v-model="tabs">
            <v-tab-item>
              <v-card>
                <v-data-table height="180" :headers="headers_release" :items="release_list" item-key="barcode"
                  class="elevation-4" fixed-header multi-sort single-select dense hide-default-footer>
                </v-data-table>
              </v-card>
            </v-tab-item>
            <v-tab-item><v-card>
                <v-data-table height="180" :headers="headers_raw" :items="raw_list" item-key="barcode" class="elevation-4"
                  fixed-header multi-sort single-select dense hide-default-footer>
                </v-data-table>
              </v-card>

            </v-tab-item>
          </v-tabs-items>
        </v-col>
      </v-row>
    </v-container>

    <!-- 생성 모달 -->

    <ReleaseOrderModal :open="edit_customer" @closeModal="closeModal_customer">
    </ReleaseOrderModal>

    <!--자재 환입 모달 -->
    <v-dialog v-model="reversal_rawModal" max-width="1000px" persistent>
      <v-card>
        <v-card-title>
          <span>자재 환입</span>
          <v-spacer></v-spacer>
          <span>출고된 수량 : {{ txtReleaseCount_check }} | 선택된 수량 :
            {{ txtSelectCount_check }}</span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-data-table height="300" ref="rawGrid" v-model="selected_check" :headers="headers_raw_reversal"
                :items="raw_reversal_list" item-key="rawMaterialDetailId" class="elevation-4"
                @item-selected="addRawItem_reversal" hide-default-footer multi-sort show-select dense>
                <template v-slot:item.reversalCount="props">
                  <v-edit-dialog :return-value.sync="props.item.reversalCount"
                    @save="props.item = saveReversalCount(props.item)">
                    {{ props.item.reversalCount | comma }}
                    <template v-slot:input>
                      <v-text-field v-model="props.item.reversalCount" label="Edit" single-line type="text" maxlength="10"
                        oninput="this.value = this.value.replace(/[^0-9]/g, '').replace(/(^0+)/, '');"></v-text-field>
                    </template>
                  </v-edit-dialog>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-col class="text-right">
            <v-btn color="success" text @click="saveRawData_reversal">
              환입 추가
            </v-btn>
            <v-btn color="primary" text @click="closeRawReversalDetail">
              닫기
            </v-btn>
          </v-col>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import _ from "lodash";
import * as api from "@/api";
import { gridCfg } from "@/util/config";
import cfg from "./config";
import ReleaseOrderModal from "./ReleaseOrderModal.vue";
import { Component, Vue, Watch } from "vue-property-decorator";

@Component({
  components: {
    ReleaseOrderModal,
  },
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
export default class ReleaseOrder extends Vue {
  startDate: boolean = false;
  endDate: boolean = false;
  releaseOrderOption: any = {};
  search_dateType: object[] = [];
  search_job_status_list: object[] = [];
  search_condition: any = {};
  max25chars: any = (v: any) => v.length <= 25 || "Input too long!";
  tabs: any = null;
  selectedId: number = -1;
  edit_customer: boolean = false;
  reversal_rawModal: boolean = false;
  selected_check: [] = [];
  way_list: object[] = [];
  customer: object = {};
  editedCustomer: object = {};
  itemInfo: object = {};
  itemInfo_default: object = {};
  editedItemInfo: object = {};
  editedIndex: number = -1;
  statement_list: [] = [];
  statement_detail_list: [] = [];
  customer_list: [] = [];
  item_list: [] = [];
  bom_list_modal: any[] = [];
  statement_list_modal: [] = [];
  raw_list_modal: [] = [];
  raw_detail_list: [] = [];
  raw_reversal_list: [] = [];
  company_list: [] = [];
  txtReleaseCount_check: any = 0;
  txtSelectCount_check: any = 0;
  selectItemID: any = "";
  select_rawID: any = 0;
  release_list: [] = [];
  raw_list: [] = [];

  get headers() {
    return cfg.header.headers;
  }

  get headers_release() {
    return cfg.header.headers_release;
  }

  get headers_raw() {
    return cfg.header.headers_raw;
  }

  get headers_raw_reversal() {
    return cfg.header.headers_raw_reversal;
  }

  @Watch("releaseOrderOption.options", { deep: true })
  onReleaseOrderOption() {
    this.getCustomer();
  }

  created() {
    this.search_dateType = cfg.data.search_dateType;
    this.search_job_status_list = cfg.data.search_job_status_list;
    this.way_list = cfg.data.way_list;
    this.customer = Object.assign({}, cfg.data.customer);
    this.editedCustomer = Object.assign({}, cfg.data.editedCustomer);
    this.itemInfo = Object.assign({}, cfg.data.itemInfo);
    this.itemInfo_default = Object.assign({}, cfg.data.itemInfo_default);
    this.editedItemInfo = Object.assign({}, cfg.data.editedItemInfo);
    this.releaseOrderOption = Object.assign({}, gridCfg);
  }

  s_date_search(v: any) {
    this.search_condition.startDate = v;
    this.startDate = false;
    let startEL: any = this.$refs.startDate;
    startEL.save(v);
  }
  e_date_search(v: any) {
    this.search_condition.endDate = v;
    this.endDate = false;
    let endEL: any = this.$refs.endDate;
    endEL.save(v);
  }
  selectCustomer(data: any, row: any) {
    row.select(true);
    console.log("selectCustomer", data);
    this.selectItemID = data.id;

    let reqData_raw = {
      jobOrderId: data.jobOrderId,
    };
    api.rawRelease
      .getReleaseOrderReleaseData(reqData_raw)
      .then((response) => {
        console.log("getReleaseOrderRawData", response);
        this.release_list = response.data.responseData;
      })
      .catch((error) => {
        console.log(error);
      });
    api.rawRelease
      .getReleaseOrderRawData(reqData_raw)
      .then((response) => {
        console.log("getReleaseOrderRawData", response);
        this.raw_list = response.data.responseData;
      })
      .catch((error) => {
        console.log(error);
      });
  }
  getCustomer() {
    const { page, itemsPerPage, sortBy, sortDesc } =
      this.releaseOrderOption.options;
    this.search_condition.page = page;
    this.search_condition.size = itemsPerPage;
    this.search_condition.sortBy = sortBy;
    this.search_condition.sortDesc = sortDesc;
    this.search_condition.notComp = 0;

    this.releaseOrderOption.loading = true;
    api.rawRelease
      .getReleaseList(this.search_condition)
      .then((response) => {
        console.log("getReleaseList", response);
        this.statement_list = response.data.responseData;
        this.releaseOrderOption.totalCount = response.data.totalCount;
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.releaseOrderOption.loading = false;
      });
  }

  saveRawData_reversal() {
    console.log("saveRawData_reversal", this.$refs.rawGrid);

    this.raw_list_modal.forEach((el: any) => {
      console.log(el, this.select_rawID);
      if (el.itemId == this.select_rawID) {
        el.rawMaterialDetails = this.selected_check;
        el.reversalCount = parseInt(this.txtSelectCount_check);
      }
    });
    let gridEL: any = this.$refs.rawListGrid;
    gridEL.$forceUpdate();

    this.closeRawReversalDetail();
  }

  saveReversalCount(item: any) {
    item.reversalCount = parseInt(item.reversalCount);
    let sumData = 0;
    this.selected_check.forEach((el: any) => {
      sumData += parseInt(el.reversalCount);
    });
    console.log("sumData", sumData);

    this.txtSelectCount_check = sumData;

    return item;
  }

  addRawItem_reversal(item: any) {
    console.log("addRawItem_reversal", item, this.selected_check);
    let select_reversal = this.selected_check;

    let sumData = 0;
    if (select_reversal != undefined) {
      select_reversal.forEach((el: any) => {
        sumData += parseInt(el.reversalCount);
      });
      if (item.value) {
        sumData += parseInt(item.item.reversalCount);
      } else if (!item.value) {
        sumData -= parseInt(item.item.reversalCount);
      }
    } else {
      sumData = item.item.reversalCount;
    }

    console.log("sumData", sumData);

    this.txtSelectCount_check = sumData;
  }

  closeRawReversalDetail() {
    this.txtSelectCount_check = 0;
    this.reversal_rawModal = false;
    this.selected_check = [];
  }

  processItem() {
    let processData = {
      id: this.selectItemID,
      warehousingUpdateDetails: this.statement_detail_list,
    };
    api.rawWarehousing
      .updateWarehousingList(processData)
      .then((response) => {
        console.log("createCustomerItem", response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  closeModal_customer() {
    this.edit_customer = false;
    this.getCustomer();
  }
  getStatusColor(status: string) {
    switch (status) {
      case "출고 요청":
        return "primary";
      case "작업 진행중":
        return "orange";
      case "출하 요청":
        return "success";
      case "제품 환불":
        return "red";
      case "생산 완료":
        return "success";
    }
  }
  editItem() {
    this.edit_customer = true;
  }
  editItem_modal(item: any) {
    api.item
      .getItemPage()
      .then((response) => {
        console.log("getItemPage", response);
        this.company_list = response.data.basicCompanies;
        this.customer_list = response.data.basicCustomers;
        this.statement_list_modal = response.data.basicStatements;
        this.item_list = response.data.basicItems;
      })
      .catch((error) => {
        console.log(error);
      });

    //this.editedIndex = this.statement_list_modal.indexOf(item);
    this.editedCustomer = Object.assign({}, item);
    this.edit_customer = true;
  }
  deleteItem_modal(item: any) {
    let deleteIndex = this.bom_list_modal.indexOf(item);
    console.log("deleteItem_pop", deleteIndex, item);

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
          this.bom_list_modal.splice(deleteIndex, 1);
        }
      });
  }
  releaseProcess(item: any) {
    console.log("deleteItem_pop", item);

    this.$swal
      .fire({
        title: "출고 진행",
        text: "출고진행으로 변경하시겠습니까?",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "진행",
      })
      .then((result) => {
        if (result.isConfirmed) {
          api.rawRelease.updateReleaseProcess(item).then((response) => {
            if (response.status == 200) {
              this.getCustomer();
            }
          });
        }
      });
  }
  releaseDone(item: any) {
    console.log("deleteItem_pop", item);

    this.$swal
      .fire({
        title: "출고 완료",
        text: "출고완료로 변경하시겠습니까?",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "완료",
      })
      .then((result) => {
        if (result.isConfirmed) {
          api.rawRelease.updateReleaseDone(item).then((response) => {
            if (response.status == 200) {
              this.getCustomer();
            }
          });
        }
      });
  }
  releaseCancle(item: any) {
    console.log("deleteItem_pop", item);

    this.$swal
      .fire({
        title: "출고 취소",
        text: "출고취소로 변경하시겠습니까?",
        icon: "error",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "취소",
      })
      .then((result) => {
        if (result.isConfirmed) {
          let reqData = {
            id: item.id,
          };
          api.rawRelease.deleteReleaseList(reqData).then((response) => {
            if (response.status == 200) {
              this.getCustomer();
            }
          });
        }
      });
  }
}
</script>

<style src="./ReleaseOrder.scss" lang="scss" scoped></style>
