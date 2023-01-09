<template>
  <div class="warehousing">
    <v-container fluid>
      <v-row no-gutters>
        <v-col class="ma-2" md="12">
          <h4 class="searchbox-title">조회 조건</h4>
          <v-sheet class="pa-3" color="#F6F8F9" height="70" elevation="2">
            <v-row>
              <v-col cols="10">
                <v-row>
                  <v-col cols="2">
                    <v-text-field
                      label="LOT 코드"
                      v-model="search_text"
                      @keydown.enter="getCustomer"
                      dense
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
              <v-col class="pt-2 text-right" cols="2">
                <v-btn color="primary" x-large @click="getCustomer">
                  <v-icon left> mdi-magnify </v-icon>
                  조회
                </v-btn>
              </v-col>
            </v-row>
          </v-sheet>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col class="pt-0 pb-0">
          <v-tabs v-model="tabs" align-with-title>
            <v-tabs-slider color="blue"></v-tabs-slider>

            <v-tab v-for="item in way_list" :key="item.name">
              {{ item.name }}
            </v-tab>
          </v-tabs>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col md="12">
          <v-row>
            <v-col md="2">
              <h4 class="searchbox-title"></h4>
            </v-col>
          </v-row>

          <v-tabs-items v-model="tabs">
            <v-tab-item>
              <v-row class="mb-3">
                <v-col>
                  <span>LOT 원자재 재고정보</span>
                  <v-data-table
                    height="80"
                    :headers="headers_forward_raw_detail"
                    :items="rawHousingData"
                    item-key="barcode"
                    class="elevation-4"
                    :items-per-page="1"
                    fixed-header
                    multi-sort
                    single-select
                    dense
                    hide-default-footer
                  >
                  </v-data-table>
                </v-col>
              </v-row>
              <v-spacer></v-spacer>
              <span class="text-subtitle">조회리스트</span>

              <v-data-table
                height="550"
                :headers="headers_forward"
                :items="forward_list"
                item-key="barcode"
                class="elevation-4"
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
              <v-pagination
                v-model="forwardListCfg.page"
                :length="forwardListCfg.pageCount"
              ></v-pagination>
            </v-tab-item>
            <v-tab-item>
              <v-data-table
                height="700"
                :headers="headers_backward"
                :items="backward_list"
                item-key="barcode"
                fixed-header
                class="elevation-4"
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
              <v-pagination
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
