<template>
  <div class="warehousing">
    <v-container fluid v-resize="onResize">
      <v-row>
        <v-col class="ma-2" md="12">
          <span>조회 조건</span>
          <v-card class="card-shadow pa-3" height="65">
            <v-row>
              <v-col cols="1">
                <v-text-field
                  label="code"
                  v-model="search_condition.code"
                  @keydown.enter="getCustomer"
                  dense
                  solo
                  rounded
                  elevation-0
                ></v-text-field>
              </v-col>

              <v-col cols="1">
                <v-text-field
                  label="거래처명"
                  v-model="search_condition.customer"
                  @keydown.enter="getCustomer"
                  dense
                  solo
                  rounded
                  elevation-0
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field
                  label="요청자명 or 요청자 연락처"
                  v-model="search_condition.requester"
                  @keydown.enter="getCustomer"
                  dense
                  solo
                  rounded
                  elevation-0
                ></v-text-field>
              </v-col>

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
                  elevation-0
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
                      elevation-0
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
                      elevation-0
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

              <v-spacer></v-spacer>
              <v-col class="text-right" cols="2">
                <v-btn color="primary" large elevation="0" @click="getCustomer">
                  조회
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col class="ma-2" md="12">
          <v-row class="mb-2">
            <v-col md="2" align-self="center">
              <span>출고요청 목록</span>
            </v-col>
            <v-spacer></v-spacer>
            <v-col class="text-right" cols="4">
              <v-btn elevation="0" color="primary" @click="editItem"
                ><v-icon left> mdi-book-account </v-icon>출하 추가</v-btn
              >
            </v-col>
          </v-row>
          <v-card>
            <v-data-table
              :height="table_height"
              :headers="headers"
              fixed-header
              :items="statement_list"
              item-key="barcode"
              multi-sort
              @click:row="selectCustomer"
              :options.sync="productOption.options"
              :server-items-length="productOption.totalCount"
              :loading="productOption.loading"
              :items-per-page="productOption.itemsPerPage"
              :page.sync="productOption.page"
              @page-count="productOption.pageCount = $event"
              hide-default-footer
              loading-text="서버에 요청중...."
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
                  {{ item.status }}
                </v-btn>
              </template>
              <template v-slot:[`item.edit`]="{ item }">
                <v-btn
                  v-if="item.status == '출고 완료'"
                  small
                  @click="deleteItem_pop(item)"
                  color="error"
                >
                  반품 요청
                </v-btn>
                <v-btn
                  v-if="item.status == '출고 요청'"
                  small
                  @click="processItem(item)"
                  color="info"
                >
                  출고 진행요청
                </v-btn>

                <v-btn
                  v-if="item.status == '출고 진행'"
                  small
                  @click="processItem(item)"
                  color="info"
                >
                  출고 완료요청
                </v-btn>
              </template>
            </v-data-table>
          </v-card>
          <v-pagination
            circle
            v-model="productOption.page"
            :length="productOption.pageCount"
          ></v-pagination>
        </v-col>
      </v-row>

      <v-row>
        <v-col class="ma-2" md="12">
          <v-row dense class="mb-2">
            <v-col cols="2" align-self="center">
              <span>출고 상세(원자재)</span>
            </v-col>
          </v-row>
          <v-card>
            <v-data-table
              height="230"
              :headers="headers_detail"
              :items="statement_detail_list"
              fixed-header
              item-key="barcode"
              hide-default-footer
              multi-sort
              no-data-text="데이터가 없습니다."
            >
              <template v-slot:[`item.count`]="props">
                <v-edit-dialog :return-value.sync="props.item.count">
                  {{ props.item.count | comma }}
                  <template v-slot:input>
                    <v-text-field
                      v-model="props.item.count"
                      :rules="[max25chars]"
                      label="Edit"
                      single-line
                      counter
                    ></v-text-field>
                  </template>
                </v-edit-dialog>
              </template>
              <template v-slot:[`item.standard`]="props">
                <v-edit-dialog :return-value.sync="props.item.standard">
                  {{ props.item.standard | comma }}
                  <template v-slot:input>
                    <v-text-field
                      v-model="props.item.standard"
                      :rules="[max25chars]"
                      label="Edit"
                      single-line
                      counter
                    ></v-text-field>
                  </template>
                </v-edit-dialog>
              </template>
              <template v-slot:[`item.storageId`]="props">
                <v-select
                  :items="storage_list"
                  item-text="name"
                  item-value="id"
                  label="창고"
                  v-model="props.item.storageId"
                ></v-select>
                <v-edit-dialog :return-value.sync="props.item.storageId">
                  <template v-slot:input>
                    <v-select
                      :items="storage_list"
                      item-text="name"
                      item-value="id"
                      label="창고"
                      v-model="props.item.storageId"
                    ></v-select>
                  </template>
                </v-edit-dialog>
              </template>
              <template v-slot:[`item.supplyPrice`]="props">
                <v-edit-dialog :return-value.sync="props.item.supplyPrice">
                  {{ props.item.supplyPrice | comma }}원
                  <template v-slot:input>
                    <v-text-field
                      v-model="props.item.supplyPrice"
                      :rules="[max25chars]"
                      label="Edit"
                      single-line
                      counter
                    ></v-text-field>
                  </template>
                </v-edit-dialog>
              </template>
              <template v-slot:item.taxAmount="props">
                <v-edit-dialog :return-value.sync="props.item.taxAmount">
                  {{ props.item.taxAmount | comma }}원
                  <template v-slot:input>
                    <v-text-field
                      v-model="props.item.taxAmount"
                      :rules="[max25chars]"
                      label="Edit"
                      single-line
                      counter
                    ></v-text-field>
                  </template>
                </v-edit-dialog>
              </template>

              <template v-slot:[`item.unitPrice`]="props">
                <v-edit-dialog :return-value.sync="props.item.unitPrice">
                  {{ props.item.unitPrice | comma }}원
                  <template v-slot:input>
                    <v-text-field
                      v-model="props.item.unitPrice"
                      :rules="[max25chars]"
                      label="Edit"
                      single-line
                      counter
                    ></v-text-field>
                  </template>
                </v-edit-dialog>
              </template>
              <template v-slot:[`item.price`]="props">
                <v-edit-dialog :return-value.sync="props.item.price">
                  {{ props.item.price | comma }}원
                  <template v-slot:input>
                    <v-text-field
                      v-model="props.item.price"
                      :rules="[max25chars]"
                      label="Edit"
                      single-line
                      counter
                    ></v-text-field>
                  </template>
                </v-edit-dialog>
              </template>
              <template v-slot:[`item.edit`]="{ item }">
                <v-icon small @click="deleteItem_pop(item)">
                  mdi-delete
                </v-icon>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <!-- 생성 모달 -->

    <ReleaseProductAddModal
      :open="edit_customer"
      @closeModal="closeModal_customer"
    >
    </ReleaseProductAddModal>
  </div>
</template>

<script lang="ts">
import cfg from "./config";
import { gridCfg } from "@/util/config";
import * as api from "@/api";
import ReleaseProductAddModal from "./ReleaseProductAddModal.vue";
import { Component, Vue, Watch } from "vue-property-decorator";

@Component({
  components: {
    ReleaseProductAddModal,
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
export default class ReleaseProduct extends Vue {
  table_height: number = 0;
  max25chars: any = (v: any) => v.length <= 25 || "Input too long!";
  deadDate: boolean = false;
  startDate: boolean = false;
  endDate: boolean = false;
  search_dateType: any[] = [];
  search_textType: any[] = [];
  storage_list: object[] = [];

  search_condition: any = {
    code: "", //출하 요청 코드
    customer: "", //거래처 이름
    requester: "", //요청자 이름 또는 요청자 연락처
    dateType: 1, //1: 납기일 2: 수정일
    startDate: "", //기간 별 조회
    endDate: "",
    //"status":"" 추후에 사용
  };
  edit_customer: boolean = false;

  productOption: any = {};
  editedCustomer: any = {};

  statement_list: [] = [];
  statement_detail_list: [] = [];

  selectItemID: any = "";

  get headers() {
    return cfg.header.headers;
  }

  get headers_detail() {
    return cfg.header.headers_detail;
  }

  @Watch("productOption.options", { deep: true })
  onProductOptionChange() {
    this.getCustomer();
  }

  created() {
    this.search_dateType = cfg.data.search_dateType;
    this.search_textType = cfg.data.search_textType;
    this.productOption = Object.assign({}, gridCfg);
  }
  mounted() {
    this.onResize();
  }

  onResize() {
    this.table_height = window.innerHeight - 48 - 120 - 250 - 200 - 15;
  }

  dead_date_search(v: any) {
    this.editedCustomer.deadline = v;
    this.deadDate = false;
    let deadEL: any = this.$refs.deadDate;
    deadEL.save(v);
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

  closeModal_customer() {
    this.edit_customer = false;
    this.getCustomer();
  }

  selectCustomer(data: any) {
    console.log("selectCustomer", data);
    this.selectItemID = data.id;
    api.storage
      .getStorageList()
      .then((response) => {
        console.log("getStorageList", response);
        this.storage_list = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    api.productRelease
      .getReleaseProductDetailList({ id: data.id })
      .then((response) => {
        console.log("getReleaseProductDetailList", response);
        this.statement_detail_list = response.data.responseData;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getCustomer() {
    const { page, itemsPerPage, sortBy, sortDesc } = this.productOption.options;
    this.search_condition.page = page;
    this.search_condition.size = itemsPerPage;
    this.search_condition.sortBy = sortBy;
    this.search_condition.sortDesc = sortDesc;
    this.productOption.loading = true;
    api.productRelease
      .getReleaseProductList(this.search_condition)
      .then((response) => {
        console.log("getReleaseProductList", response);
        this.statement_list = response.data.responseData;
        this.productOption.totalCount = response.data.totalCount;
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.productOption.loading = false;
      });
  }

  getStatusColor(status: string) {
    switch (status) {
      case "출고 진행":
        return "orange";
      case "출하 요청":
        return "success";
      case "제품 환불":
        return "red";
    }
  }
  processItem(item: any) {
    let processData = {
      id: item.id,
    };

    if (item.status == "출고 요청") {
      api.productRelease
        .updateReleaseProductProcess(processData)
        .then((response) => {
          console.log("updateReleaseProductProcess", response);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    if (item.status == "출고 진행") {
      api.productRelease
        .updateReleaseProductDone(processData)
        .then((response) => {
          console.log("updateReleaseProductDone", response);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  editItem() {
    this.edit_customer = true;
  }
}
</script>

<style src="./ReleaseProduct.scss" lang="scss" scoped></style>
