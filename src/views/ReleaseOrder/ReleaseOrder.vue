<template>
  <div class="warehousing" fluid v-resize="onResize">
    <v-container fluid>
      <v-row no-gutters>
        <v-col class="ma-2" md="12">
          <span>조회 조건</span>
          <v-card class="pa-3" height="110">
            <v-row no-gutters>
              <v-col cols="10">
                <v-row dense>
                  <v-col cols="3">
                    <v-text-field
                      label="작업지시서명 or 코드"
                      v-model="search_condition.jobOrder"
                      @keydown.enter="getCustomer"
                      hide-details="false"
                      dense
                      solo
                      rounded
                    ></v-text-field>
                  </v-col>
                  <v-col cols="2">
                    <v-text-field
                      label="거래처명 or 코드"
                      v-model="search_condition.customer"
                      @keydown.enter="getCustomer"
                      hide-details="false"
                      dense
                      solo
                      rounded
                    ></v-text-field>
                  </v-col>
                  <v-col cols="2">
                    <v-text-field
                      label="작업지시서 담당자"
                      v-model="search_condition.jobOrderManager"
                      @keydown.enter="getCustomer"
                      hide-details="false"
                      dense
                      solo
                      rounded
                    ></v-text-field>
                  </v-col>
                  <v-col cols="2">
                    <v-select
                      :items="search_job_status_list"
                      v-model="search_condition.jobOrderStatus"
                      label="작업지시서 상태"
                      item-text="name"
                      item-value="code"
                      dense
                      solo
                      rounded
                      hide-details="false"
                    ></v-select>
                  </v-col>
                  <v-col cols="3">
                    <v-text-field
                      label="작업지시서 메모"
                      v-model="search_condition.jobOrderMemo"
                      @keydown.enter="getCustomer"
                      dense
                      solo
                      rounded
                      hide-details="false"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="2">
                    <v-select
                      :items="search_dateType"
                      v-model="search_condition.dateType"
                      label="날짜타입"
                      item-text="name"
                      item-value="value"
                      dense
                      solo
                      rounded
                    ></v-select>
                  </v-col>
                  <v-col md="2">
                    <v-menu
                      ref="startDate"
                      v-model="startDate"
                      :close-on-content-click="false"
                      :return-value.sync="search_condition.startDate"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="search_condition.startDate"
                          label="시작일"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          dense
                          solo
                          rounded
                          hide-details="false"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="search_condition.startDate"
                        no-title
                        scrollable
                        locale="ko-KR"
                        :max="search_condition.endDate"
                      >
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="startDate = false">
                          취소
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="s_date_search(search_condition.startDate)"
                        >
                          확인
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col md="2">
                    <v-menu
                      ref="endDate"
                      v-model="endDate"
                      :close-on-content-click="false"
                      :return-value.sync="search_condition.endDate"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="search_condition.endDate"
                          label="종료일"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          dense
                          solo
                          rounded
                          hide-details="false"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="search_condition.endDate"
                        no-title
                        scrollable
                        locale="ko-KR"
                        :min="search_condition.startDate"
                      >
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="endDate = false">
                          취소
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="e_date_search(search_condition.endDate)"
                        >
                          확인
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-col>

                  <v-col cols="2">
                    <v-text-field
                      label="출고코드"
                      v-model="search_condition.releaseCode"
                      @keydown.enter="getCustomer"
                      dense
                      solo
                      rounded
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
              <v-spacer></v-spacer>
              <v-col class="pt-5 text-right" cols="2">
                <v-btn color="primary" x-large @click="getCustomer">
                  <v-icon left> mdi-magnify </v-icon>
                  조회
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>

        <v-col class="ma-2" md="12">
          <v-row class="mb-2">
            <v-col md="2" align-self="center">
              <span>출고 목록</span>
            </v-col>
            <v-spacer></v-spacer>
            <v-col class="text-right" cols="4">
              <v-btn color="primary" @click="editItem"
                ><v-icon left> mdi-book-account </v-icon>출고 요청</v-btn
              >
            </v-col>
          </v-row>

          <v-card>
            <v-data-table
              :height="table_height"
              :headers="headers"
              :items="statement_list"
              item-key="jobOrderId"
              fixed-header
              dense
              multi-sort
              single-select
              @click:row="selectCustomer"
              :options.sync="releaseOrderOption.options"
              :server-items-length="releaseOrderOption.totalCount"
              :loading="releaseOrderOption.loading"
              :items-per-page="releaseOrderOption.itemsPerPage"
              :page.sync="releaseOrderOption.page"
              @page-count="releaseOrderOption.pageCount = $event"
              hide-default-footer
              loading-text="서버에 요청중...."
              no-data-text="데이터가 없습니다."
            >
              <template v-slot:[`item.jobOrderStatus`]="{ item }">
                <v-btn
                  class="text-left"
                  small
                  :color="getStatusColor(item.jobOrderStatus)"
                  dark
                  style="width: 120px"
                  depressed
                >
                  <v-icon left> mdi-album </v-icon>
                  {{ getStatusCode(item.jobOrderStatus) }}
                </v-btn>
              </template>
              <template v-slot:[`item.releaseStatus`]="{ item }">
                <v-btn
                  class="text-left"
                  small
                  :color="getStatusColor(item.releaseStatus)"
                  dark
                  style="width: 100px"
                  depressed
                >
                  <v-icon left> mdi-album </v-icon>
                  {{ item.releaseStatus }}
                </v-btn>
              </template>
              <template v-slot:[`item.totalPrice`]="{ item }">
                {{ item.totalPrice | comma }}원
              </template>
            </v-data-table>
          </v-card>
          <v-pagination
            circle
            v-model="releaseOrderOption.page"
            :length="releaseOrderOption.pageCount"
          ></v-pagination>
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
            <v-tab-item
              ><v-card>
                <v-data-table
                  height="200"
                  :headers="headers_raw"
                  :items="raw_list"
                  item-key="barcode"
                  class="elevation-4"
                  fixed-header
                  multi-sort
                  single-select
                  dense
                  hide-default-footer
                  no-data-text="데이터가 없습니다."
                >
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
  </div>
</template>

<script lang="ts">
import _ from "lodash";
import * as api from "@/api";
import { gridCfg, JO_code, JOD_code } from "@/util/config";
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
  table_height: number = 0;
  startDate: boolean = false;
  endDate: boolean = false;
  releaseOrderOption: any = {};
  search_dateType: object[] = [];
  search_job_status_list: object[] = [];
  search_condition: any = {};
  tabs: any = null;
  edit_customer: boolean = false;
  reversal_rawModal: boolean = false;
  selected_check: [] = [];
  way_list: object[] = [];
  customer: object = {};
  editedCustomer: object = {};
  itemInfo: object = {};
  itemInfo_default: object = {};
  editedItemInfo: object = {};
  statement_list: [] = [];
  statement_detail_list: [] = [];
  customer_list: [] = [];
  item_list: [] = [];
  bom_list_modal: any[] = [];
  statement_list_modal: [] = [];
  raw_list_modal: [] = [];
  company_list: [] = [];
  txtSelectCount_check: any = 0;
  selectItemID: any = "";
  select_rawID: any = 0;
  release_list: [] = [];
  raw_list: [] = [];
  process_status: any = JO_code;

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

  mounted() {
    this.onResize();
  }

  onResize() {
    this.table_height = window.innerHeight - 48 - 134 - 200 - 200 - 35;
    console.log("onResize", this.table_height);
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
    /* 출고요청 목록
    api.rawRelease
      .getReleaseOrderReleaseData(reqData_raw)
      .then((response) => {
        console.log("getReleaseOrderRawData", response);
        this.release_list = response.data.responseData;
      })
      .catch((error) => {
        console.log(error);
      });
    */
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

  closeModal_customer() {
    this.edit_customer = false;
    this.getCustomer();
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
  editItem() {
    this.edit_customer = true;
  }

  getStatusCode(status: string) {
    if (status === undefined) {
      return "";
    }
    if (_.find(this.process_status, { code: status }).name == undefined) {
      return "오류";
    }
    return _.find(this.process_status, { code: status }).name;
  }
}
</script>

<style src="./ReleaseOrder.scss" lang="scss" scoped></style>
