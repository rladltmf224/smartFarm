<template>
  <div>
    <v-container fluid>
      <v-row no-gutters>
        <v-col class="ma-2" cols="12">
          <span>조회 조건</span>
          <v-card class="card-shadow pa-3" height="65">
            <v-row dense>
              <v-col cols="2">
                <v-text-field
                  label="LOT 코드"
                  v-model="search_text"
                  @keydown.enter="getCustomer"
                  dense
                  color="info"
                  solo
                  rounded
                  elevation-0
                ></v-text-field>
              </v-col>
              <v-spacer></v-spacer>
              <v-col class="text-right" cols="2">
                <v-btn color="primary" large @click="getCustomer" elevation-0>
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
          <v-tabs v-model="tabs" align-with-title>
            <v-tabs-slider color="blue"></v-tabs-slider>

            <v-tab v-for="item in way_list" :key="item.name">
              {{ item.name }}
            </v-tab>
          </v-tabs>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col class="ma-2" cols="12">
          <v-tabs-items v-model="tabs">
            <v-tab-item>
              <v-row class="mb-1">
                <v-col>
                  <span>LOT 원자재 재고정보</span>
                  <v-card class="card-shadow">
                    <v-data-table
                      height="80"
                      :headers="headers_forward_raw_detail"
                      :items="rawHousingData"
                      item-key="barcode"
                      :items-per-page="1"
                      fixed-header
                      multi-sort
                      single-select
                      dense
                      hide-default-footer
                    >
                    </v-data-table>
                  </v-card>
                </v-col>
              </v-row>

              <span class="text-subtitle">조회리스트</span>
              <v-card class="card-shadow">
                <v-data-table
                  height="500"
                  :headers="headers_forward"
                  :items="forward_list"
                  item-key="barcode"
                  fixed-header
                  multi-sort
                  single-select
                  dense
                  :options.sync="forwardListCfg.options"
                  :server-items-length="forwardListCfg.totalCount"
                  :loading="forwardListCfg.loading"
                  :items-per-page="forwardListCfg.itemsPerPage"
                  :page.sync="forwardListCfg.page"
                  @page-count="forwardListCfg.pageCount = $event"
                  hide-default-footer
                >
                </v-data-table>
              </v-card>
              <v-pagination
                circle
                v-model="forwardListCfg.page"
                :length="forwardListCfg.pageCount"
              ></v-pagination>
            </v-tab-item>
            <v-tab-item>
              <v-card>
                <v-data-table
                  height="700"
                  :headers="headers_backward"
                  :items="backward_list"
                  item-key="barcode"
                  fixed-header
                  multi-sort
                  single-select
                  dense
                  :options.sync="backwardListCfg.options"
                  :server-items-length="backwardListCfg.totalCount"
                  :loading="backwardListCfg.loading"
                  :items-per-page="backwardListCfg.itemsPerPage"
                  :page.sync="backwardListCfg.page"
                  @page-count="backwardListCfg.pageCount = $event"
                  hide-default-footer
                >
                </v-data-table>
              </v-card>

              <v-pagination
                circle
                v-model="backwardListCfg.page"
                :length="backwardListCfg.pageCount"
              ></v-pagination>
            </v-tab-item>
          </v-tabs-items>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import cfg from "./config";
import * as api from "@/api";
import { gridCfg } from "@/util/config/";
import { Component, Vue, Watch } from "vue-property-decorator";

@Component
export default class LotTracking extends Vue {
  tabs: any = null;
  forwardListCfg: any = {};
  backwardListCfg: any = {};
  way_list: object[] = [{ name: "순방향" }, { name: "역방향" }];
  forward_list: [] = [];
  forward_raw_list: [] = [];
  backward_list: [] = [];
  rawHousingData: any[] = [];
  search_text: string = "";
  search_condition_forward: object = {
    rawMaterialLot: "",
  };
  search_condition_backward: object = {
    productLot: "",
  };

  get headers_forward() {
    return cfg.header.forwardList;
  }

  get headers_forward_raw_detail() {
    return cfg.header.forwardDetailList;
  }
  get headers_backward() {
    return cfg.header.backwardList;
  }

  @Watch("forwardListCfg.options", { deep: true })
  onForawrdListCfgChange() {
    this.getCustomer();
  }

  @Watch("backwardListCfg.options", { deep: true })
  onBackawrdListCfgChange() {
    this.getCustomer();
  }

  created() {
    this.forwardListCfg = Object.assign({}, gridCfg);
    this.backwardListCfg = Object.assign({}, gridCfg);
  }

  getCustomer() {
    let reqData: any;
    if (this.search_text == "") {
      this.forward_list = [];
      this.backward_list = [];
      return;
    }

    if (this.tabs == 0) {
      reqData = {
        rawMaterialLot: this.search_text,
      };

      const { page, itemsPerPage, sortBy, sortDesc } =
        this.forwardListCfg.options;
      reqData.page = page;
      reqData.size = itemsPerPage;
      reqData.sortBy = sortBy;
      reqData.sortDesc = sortDesc;
      this.forwardListCfg.loading = true;
      api.LOT.getLOTtrackingForward(reqData)
        .then((response: any) => {
          this.rawHousingData = [];
          console.log("postProductStockData", response);
          this.forward_list = response.data.responseData.lotTrackingData;
          this.rawHousingData.push(
            response.data.responseData.rawMaterialDetailData
          );
          this.forwardListCfg.totalCount = response.data.totalCount;
          this.forwardListCfg.loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.forwardListCfg.loading = false;
        });
    } else if (this.tabs == 1) {
      reqData = {
        productLot: this.search_text,
      };

      const { page, itemsPerPage, sortBy, sortDesc } =
        this.backwardListCfg.options;
      reqData.page = page;
      reqData.size = itemsPerPage;
      reqData.sortBy = sortBy;
      reqData.sortDesc = sortDesc;
      this.backwardListCfg.loading = true;
      api.LOT.getLOTtrackingBackward(reqData)
        .then((response) => {
          console.log("postProductStockData", response);
          this.backward_list = response.data.responseData;
          this.backwardListCfg.totalCount = response.data.totalCount;
          this.backwardListCfg.loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.backwardListCfg.loading = false;
        });
    }
  }
}
</script>

<style src="./LotTracking.scss" lang="scss"></style>
