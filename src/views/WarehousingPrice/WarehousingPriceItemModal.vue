<template>
  <div>
    <!-- 생성 모달 -->
    <v-dialog v-model="open" max-width="1200px" persistent>
      <v-card>
        <v-card-title>
          <span>품목 추가</span>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="2" align-self="center">
              <v-text-field
                label="품목명 or 품목코드"
                v-model.trim="search_condition_modal.item"
                @keydown.enter="search_itemList"
                dense
                solo
                hide-details="false"
              ></v-text-field>
            </v-col>

            <v-col cols="2">
              <v-btn color="primary" @click="search_itemList"> 조회 </v-btn>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="6">
              <h4>품목 목록</h4>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-data-table
                height="380"
                v-model="selectItemList"
                :headers="headers_item"
                :items="itemList"
                item-key="itemId"
                class="elevation-4"
                show-select
                multi-sort
                dense
                :options.sync="itemListCfg.options"
                :server-items-length="itemListCfg.totalCount"
                :loading="itemListCfg.loading"
                :items-per-page="itemListCfg.itemsPerPage"
                :page.sync="itemListCfg.page"
                @page-count="itemListCfg.pageCount = $event"
                hide-default-footer
              >
                <template v-slot:item.storageId="props">
                  <v-select
                    class="select"
                    :items="storage_list"
                    item-text="name"
                    item-value="id"
                    v-model="props.item.storageId"
                    dense
                  ></v-select>
                </template>
              </v-data-table>
              <v-pagination
                circle
                v-model="itemListCfg.page"
                :length="itemListCfg.pageCount"
              ></v-pagination>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-col class="text-right">
            <v-btn color="success" text @click="add_item"> 품목추가 </v-btn>
            <v-btn color="primary" text @click="close_item_modal"> 닫기 </v-btn>
          </v-col>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import cfg from "./config";
import * as api from "@/api/index.js";
import { gridCfg } from "@/util/config/";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

@Component
export default class WarehousingPriceItemModal extends Vue {
  selectItemList: object[] = [];
  itemList: object[] = [];
  search_condition_modal: {
    customerId?: number;
    item: string;
    types: string[];
    page?: number;
    size?: number;
    sortBy?: string[];
    sortDesc?: boolean[];
  } = {
    item: "",
    types: ["원자재", "반제품"],
  };
  itemListCfg: any = {};

  @Prop({ required: true }) open: boolean;
  @Prop({ required: true }) customerID: number;
  @Prop({ required: true }) checkDuplication: any;

  get headers_item() {
    return cfg.header.itemList;
  }

  @Watch("open")
  getItem() {
    this.search_itemList();
  }

  @Watch("itemListCfg.options", { deep: true })
  onItemListCfg() {
    if (this.open) {
      return this.search_itemList();
    }
  }

  created() {
    this.itemListCfg = Object.assign({}, gridCfg);
  }

  close_item_modal() {
    this.$emit("closeModal");
  }

  add_item() {
    //기존 품목과 새로등록할 품목의 중복체크도함.
    let A = this.checkDuplication; //기존에 있던 데이터
    let B = this.selectItemList; //새롭게 등록할 데이터
    let isDuplicate = false;

    A.forEach((itemA: any) => {
      B.forEach((itemB: any) => {
        if (itemA.itemId === itemB.itemId) {
          isDuplicate = true;
          return;
        }
      });
      if (isDuplicate) {
        return;
      }
    });

    if (!isDuplicate) {
      this.$emit("addItemList", this.selectItemList);
    } else {
      this.$swal("경고", "중복된 품목은 추가할 수 없습니다.", "error");
    }
  }

  search_itemList() {
    console.log("------ 선택");
    this.search_condition_modal.customerId = this.customerID;
    const { page, itemsPerPage, sortBy, sortDesc } = this.itemListCfg.options;
    console.log("search_itemList", this.itemListCfg.options);
    this.search_condition_modal.page = page;
    this.search_condition_modal.size = itemsPerPage;
    this.search_condition_modal.sortBy = sortBy;
    this.search_condition_modal.sortDesc = sortDesc;
    this.itemListCfg.loading = true;
    console.log("search_condition_modal", this.search_condition_modal);

    api.warehousingPrice
      .postWarehousingItemData(this.search_condition_modal)
      .then((response) => {
        console.log("postWarehousingItemData", response);

        this.itemList = response.data.responseData;
        this.itemListCfg.totalCount = response.data.totalCount;
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.itemListCfg.loading = false;
      });
  }
}
</script>

<style></style>
