<template>
  <div>
    <v-dialog v-model="open_prop" max-width="1000px" persistent>
      <v-card>
        <v-card-title>
          <span>완제품 목록</span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="3">
              <v-text-field v-model="search_item_condition.item" label="품목명 or 품목코드" @keydown.enter="getItem"
                dense></v-text-field>
            </v-col>
            <v-col cols="1">
              <v-btn color="primary" @click="getItem"> 조회 </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-data-table height="360" ref="itemGrid" v-model="selected_item" :headers="headers_item_add" fixed-header
                :items="product_list" item-key="id" class="elevation-4" multi-sort show-select dense
                :options.sync="itemOption.options" :server-items-length="itemOption.totalCount"
                :loading="itemOption.loading" :items-per-page="itemOption.itemsPerPage" :page.sync="itemOption.page"
                @page-count="itemOption.pageCount = $event" hide-default-footer>
              </v-data-table>
              <v-pagination v-model="itemOption.page" :length="itemOption.pageCount"></v-pagination>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-col class="text-right">
            <v-btn color="success" text @click="saveItemList"> 품목추가 </v-btn>
            <v-btn color="primary" text @click="closeItemModal"> 닫기 </v-btn>
          </v-col>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts">
import cfg from "./config";
import { gridCfg } from "@/util/config";
import _ from "lodash";
import * as api from "@/api";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component
export default class ReleaseProductItemModal extends Vue {
  search_item_condition: any = {
    item: "",
    type: "완제품",
  };
  selected_item: [] = [];
  product_list: [] = [];
  itemOption: any = {};

  @Prop({ required: true }) open: boolean;

  @Watch("itemOption.options", { deep: true })
  onItemOptionChange() {
    this.getItem();
  }

  get open_prop() {
    return this.open;
  }

  set open_prop(val: any) {
    this.$emit("closeModal");
  }

  get headers_item_add() {
    return cfg.header.headers_item_add;
  }

  beforeUpdated() {
    this.itemOption = Object.assign({}, gridCfg);
  }

  getItem() {
    const { page, itemsPerPage, sortBy, sortDesc } = this.itemOption.options;
    this.search_item_condition.page = page;
    this.search_item_condition.size = itemsPerPage;
    this.search_item_condition.sortBy = sortBy;
    this.search_item_condition.sortDesc = sortDesc;
    this.itemOption.loading = true;

    api.item
      .getItemList(this.search_item_condition)
      .then((response) => {
        console.log("openItemModal", response);
        this.product_list = response.data.responseData;
        this.itemOption.totalCount = response.data.totalCount;
        this.itemOption.loading = false;
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.itemOption.loading = false;
      });
  }

  saveItemList() {
    this.$emit("addItem", this.selected_item);
    this.closeItemModal();
  }

  closeItemModal() {
    this.open_prop = false;
    this.selected_item = [];
  }
}
</script>
