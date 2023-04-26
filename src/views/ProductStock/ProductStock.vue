<template>
  <div class="warehousing">
    <v-container fluid v-resize="onResize">
      <v-row no-gutters>
        <v-col class="ma-2" md="12">
          <span>조회 조건</span>
          <v-card class="pa-3" height="65">
            <v-row dense>
              <v-col cols="2">
                <v-text-field label="품목명 or 품목코드" v-model="search_condition.item" @keydown.enter="getCustomer" dense solo
                  rounded hide-details="false"></v-text-field>
              </v-col>

              <v-col cols="2">
                <v-text-field label="작업지시코드" v-model="search_condition.jobOrderCode" @keydown.enter="getCustomer" dense
                  solo rounded hide-details="false"></v-text-field>
              </v-col>

              <v-col cols="2">
                <v-text-field label="LOT코드" v-model="search_condition.productLot" @keydown.enter="getCustomer" dense solo
                  rounded hide-details="false"></v-text-field>
              </v-col>

              <v-col cols="2">
                <v-select label="창고" v-model="search_condition.storage" :items="storage_list_search" item-text="name"
                  item-value="id" @change="getCustomer" dense solo rounded hide-details="false"></v-select>
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="2" class="text-right" align-self="center">
                <v-btn color="primary" large @click="getCustomer">
                  <v-icon left> mdi-magnify </v-icon>
                  조회
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col class="ma-2" md="12">
          <v-row no-gutters class="mb-2">
            <v-col md="2">
              <span>완제품 재고 목록</span>
            </v-col>
          </v-row>
          <v-card>
            <v-data-table :height="table_height" :headers="headers" :items="statement_list" fixed-header
              item-key="barcode" multi-sort single-select :options.sync="productStockOption.options"
              :server-items-length="productStockOption.totalCount" :loading="productStockOption.loading"
              :items-per-page="productStockOption.itemsPerPage" :page.sync="productStockOption.page"
              @page-count="productStockOption.pageCount = $event" hide-default-footer loading-text="서버에 요청중...."
              no-data-text="데이터가 없습니다.">
              <template v-slot:item.storageName="{ item }">
                {{ item.storageName }} &nbsp;
                <v-btn text x-small fluid color="green" class="editBtn" @click="edit_changeStorage(item)">
                  <v-icon x-small> mdi-pencil </v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card>
          <v-pagination circle v-model="productStockOption.page" :length="productStockOption.pageCount"></v-pagination>
        </v-col>
        <v-col class="ma-2" md="12">
          <v-row no-gutters class="mb-2">
            <v-col md="2">
              <span>검색된 품목별 리스트</span>
            </v-col>
          </v-row>
          <v-card>
            <v-data-table height="300" :headers="headers_detail" :items="item_list" item-key="barcode" hide-default-footer
              fixed-header multi-sort no-data-text="데이터가 없습니다." dense>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <!-- 창고 변경 모달 -->
    <ProductStockStorage :open="edit_storage" :originalData="originalData" :totalStorage_list="totalStorage_list"
      @closeModal="close_modal">
    </ProductStockStorage>
  </div>
</template>

<script lang="ts">
import _ from "lodash";
import cfg from "./config";
import { gridCfg } from "@/util/config";
import * as api from "@/api";
import ProductStockStorage from "./ProductStockStorage.vue";
import { Component, Watch, Vue } from "vue-property-decorator";

@Component({
  components: {
    ProductStockStorage,
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
export default class ProductStock extends Vue {
  table_height: number = 0;
  changeStorageId: number | null = null;
  original_storageName: string = "";
  original_locationName: string = "";
  update_storageName: string = "";
  update_locationeName: string = "";
  original_storageId: number | "" = "";
  totalStorage_list: [] = [];
  totalLocation_list: [] = [];
  edit_storage: boolean = false;
  productStockOption: any = {};
  statement_list: [] = [];
  storage_list_search: any[] = [];
  item_list: [] = [];
  search_condition: any = {
    item: "",
    jobOrderCode: "",
    productLot: "",
    storage: "",
    checkCount: "1",
  };
  originalData: {
    original_storageName: string;
    original_locationName: string;
    original_storageId: number | "";
  } = {
      original_storageName: "",
      original_locationName: "",
      original_storageId: "",
    };

  get headers() {
    return cfg.header.headers;
  }

  get headers_detail() {
    return cfg.header.headers_detail;
  }

  @Watch("productStockOption.options", { deep: true })
  onProductStockOptionChange() {
    this.getCustomer();
  }

  created() {
    this.productStockOption = Object.assign({}, gridCfg);
  }

  mounted() {
    this.getStorage();
    this.onResize();
  }

  onResize() {
    this.table_height = window.innerHeight - 48 - 129 - 200 - 150 - 95;
    console.log("onResize", this.table_height);
  }

  getStorage() {
    let list_condition: any = {};
    list_condition.page = 1;
    list_condition.size = 9999;
    list_condition.sortBy = [];
    list_condition.sortDesc = [false];
    api.storage
      .getStorageList(list_condition)
      .then((response) => {
        response.data.responseData.forEach((el: any) => {
          el.id = el.name;
        });
        this.storage_list_search = [{ name: "전체", id: "" }];
        this.storage_list_search.push(...response.data.responseData);
        console.log("getStorageList", this.storage_list_search);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  getCustomer() {
    const { page, itemsPerPage, sortBy, sortDesc } =
      this.productStockOption.options;
    this.search_condition.page = page;
    this.search_condition.size = itemsPerPage;
    this.search_condition.sortBy = sortBy;
    this.search_condition.sortDesc = sortDesc;
    this.productStockOption.loading = true;
    api.productStock
      .postProductStockData(this.search_condition)
      .then((response) => {
        console.log("postProductStockData", response);
        this.statement_list = response.data.responseData;
        this.productStockOption.totalCount = response.data.totalCount;

        this.productStockOption.loading = false;
      })
      .catch((error) => {
        this.productStockOption.loading = false;
        console.log(error);
      });
    api.productStock
      .getProductStockItemTotal()
      .then((response) => {
        console.log("postProductStockData", response);
        this.item_list = response.data.responseData;
      })
      .catch((error) => {
        console.log(error);
      });
  }
  close_modal() {
    this.edit_storage = false;
    this.getStorage();
    this.getCustomer();
  }

  edit_changeStorage(item: any) {
    this.changeStorageId = item.itemId;

    this.original_storageId = item.id;
    this.original_storageName = item.storageName;
    this.original_locationName = item.storageArea;

    this.originalData.original_storageId = item.id;
    this.originalData.original_storageName = item.storageName;
    this.originalData.original_locationName = item.storageArea;

    this.update_storageName = "";
    this.update_locationeName = "";

    api.stock
      .getStockTakingStorageList()
      .then((response) => {
        this.totalStorage_list = response.data.responseData;
        this.edit_storage = true;
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
</script>

<style src="./ProductStock.scss" lang="scss"></style>
