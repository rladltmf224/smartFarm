<template>
  <div class="warehousing">
    <v-container fluid>
      <v-row dense>
        <v-col class="ma-2" md="12">
          <h4 class="searchbox-title">조회 조건</h4>
          <v-sheet class="pa-3" color="#F6F8F9" height="60" elevation="2">
            <v-row>
              <v-col cols="2">
                <v-text-field
                  label="입고코드"
                  v-model="search_condition.code"
                  @keydown.enter="getCustomer"
                  dense
                ></v-text-field>
              </v-col>

              <v-col class="pt-2 text-right" offset="8" cols="2">
                <v-btn color="primary" large @click="getCustomer">
                  <v-icon left> mdi-magnify </v-icon>
                  조회
                </v-btn>
              </v-col>
            </v-row>
          </v-sheet>
        </v-col>
        <v-col class="ma-2" md="12">
          <v-row class="mb-2" dense>
            <v-col md="2">
              <h4 class="searchbox-title">완제품 입고 목록</h4>
            </v-col>
            <v-col class="text-right" offset-md="7" md="3">
              <v-btn class="ml-1" small color="primary" @click="editItem"
                ><v-icon left> mdi-pencil-plus </v-icon>완제품 입고 추가</v-btn
              >
            </v-col>
          </v-row>

          <v-data-table
            height="330"
            :headers="headers"
            :items="statement_list"
            item-key="id"
            class="elevation-4"
            fixed-header
            multi-sort
            single-select
            dense
            @click:row="selectCustomer"
            :options.sync="productListOption.options"
            :server-items-length="productListOption.totalCount"
            :loading="productListOption.loading"
            :items-per-page="productListOption.itemsPerPage"
            :page.sync="productListOption.page"
            @page-count="productListOption.pageCount = $event"
            hide-default-footer
          >
            <template v-slot:item.code="{ item }">
              <v-btn
                class="text-left mt-1 mb-1"
                small
                @click="selectHistory(item)"
              >
                {{ item.code }}
              </v-btn>
            </template>
            <template v-slot:item.status="{ item }">
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
            <template v-slot:item.edit="{ item }">
              <v-btn
                v-if="item.status != '반품'"
                small
                @click="deleteItem_pop(item)"
                color="error"
              >
                입고 취소
              </v-btn>
            </template>
          </v-data-table>
          <v-pagination
            v-model="productListOption.page"
            :length="productListOption.pageCount"
          ></v-pagination>
        </v-col>
        <v-col class="ma-2" md="12">
          <v-row dense class="mb-2">
            <v-col md="2">
              <h4 class="searchbox-title">입고 상세</h4>
            </v-col>
          </v-row>
          <v-data-table
            height="300"
            :headers="headers_detail"
            :items="statement_detail_list"
            item-key="barcode"
            class="elevation-4"
            fixed-header
            :items-per-page="5"
            hide-default-footer
            multi-sort
            dense
          >
            <template v-slot:item.lot="{ item }">
              <v-btn
                class="text-left mt-1 mb-1"
                small
                @click="selectLotProduct(item)"
              >
                {{ item.lot }}
              </v-btn>
            </template>
            <template v-slot:item.orderCount="props">
              {{ props.item.orderCount | comma }}
            </template>
            <template v-slot:item.normalCount="props">
              {{ props.item.normalCount | comma }}
            </template>

            <template v-slot:item.defectCount="props">
              {{ props.item.defectCount | comma }}
            </template>

            <template v-slot:item.edit="{ item }">
              <!-- <v-icon small class="mr-2" @click="editItem(item)">
                mdi-pencil
              </v-icon> -->
              <v-icon small @click="deleteItem_pop(item)"> mdi-delete </v-icon>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>

    <!-- 생성 모달 -->
    <ProductWarehousingItemModal
      :open="edit_customer"
      @closeModal="closeModal_customer"
    >
    </ProductWarehousingItemModal>

    <!-- 이력 모달 -->
    <ProductWarehousingHistoryModal
      :open="history_modal"
      :item_history_modal="item_history_modal"
      :history_modal_title="history_modal_title"
      @closeModal="close_history_modal"
    >
    </ProductWarehousingHistoryModal>

    <!-- 완제품 LOT 상세 모달 -->
    <ProductWarehousingLotModal
      :open="lot_modal"
      :item_lot_modal="item_lot_modal"
      :lot_modal_title="lot_modal_title"
      @closeModal="close_lot_modal"
    >
    </ProductWarehousingLotModal>
  </div>
</template>

<script lang="ts">
import cfg from "./config";
import * as api from "@/api/index.js";
import ProductWarehousingItemModal from "./ProductWarehousingItemModal.vue";
import ProductWarehousingHistoryModal from "./ProductWarejousingHistoryModal.vue";
import ProductWarehousingLotModal from "./ProductWarejousingLotModal.vue";
import { gridCfg } from "@/util/config";
import { Vue, Component, Watch } from "vue-property-decorator";

@Component({
  components: {
    ProductWarehousingItemModal,
    ProductWarehousingHistoryModal,
    ProductWarehousingLotModal,
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
export default class ProductWarehousing extends Vue {
  dialog_customer: boolean = false;
  edit_customer: boolean = false;
  history_modal: boolean = false;
  product_modal: boolean = false;
  lot_modal: boolean = false;
  history_modal_title: string = "";
  lot_modal_title: string = "";
  selected: [] = [];
  item_lot_modal: [] = [];
  storageLocation_list: [] = [];
  selectJobOrderID: string = "";
  productListOption: any = {};
  search_condition: any = {
    code: "",
  };

  statement_list: [] = [];
  statement_detail_list: [] = [];
  item_list_modal: any[] = [];
  item_history_modal: [] = [];
  joborder_list: [] = [];
  joborder_detail_list: [] = [];
  company_list: [] = [];
  selectItemID: string = "";

  created() {
    this.productListOption = Object.assign({}, gridCfg);
  }

  @Watch("edit_customer")
  onEditCustomer(val: any) {
    val || this.closeModal_customer();
  }

  @Watch("productListOption.options", { deep: true })
  onProductListOption() {
    this.getCustomer();
  }

  get headers() {
    return cfg.header.headers;
  }
  get headers_detail() {
    return cfg.header.headers_detail;
  }

  getStatusColor(status: string) {
    switch (status) {
      case "부분입고":
        return "orange";
      case "입고":
        return "success";
      case "반품":
        return "red";
    }
  }
  selectCustomer(data: any, row: any) {
    console.log("selectCustomer", data);
    row.select(true);
    this.selectItemID = data.id;

    api.productWarehousing
      .getProductWarehousingDetailList({ id: data.id })
      .then((response) => {
        console.log("getWarehousingDetailList", response);
        this.statement_detail_list = response.data.responseData;
      })
      .catch((error) => {
        console.log(error);
      });
  }
  getCustomer() {
    const { page, itemsPerPage, sortBy, sortDesc } =
      this.productListOption.options;
    this.search_condition.page = page;
    this.search_condition.size = itemsPerPage;
    this.search_condition.sortBy = sortBy;
    this.search_condition.sortDesc = sortDesc;
    this.productListOption.loading = true;
    api.productWarehousing
      .getProductWarehousingList(this.search_condition)
      .then((response) => {
        console.log("getProductWarehousingList", response);
        this.statement_list = response.data.responseData;
        this.productListOption.totalCount = response.data.totalCount;
        this.productListOption.loading = false;
      })
      .catch((error) => {
        console.log(error);
        this.productListOption.loading = false;
      });
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
  openModal_customer() {
    this.dialog_customer = true;
  }
  deleteDetailItem_pop(item: any, index: any) {
    const detailindex = this.item_list_modal.findIndex((object: any) => {
      return object.itemId === item.itemId;
    });
    console.log(item, index, detailindex);
    this.item_list_modal[detailindex].eachCount.splice(index, 1);
  }

  closeModal_customer() {
    this.edit_customer = false;
  }

  editItem(item: any) {
    // api.rawWarehousing
    //   .getWarehousingData()
    //   .then((response) => {
    //     console.log("getStorageList", response);
    //     this.storage_list = response.data.responseData.basisStorages;
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
    let list_condition: any = {};
    list_condition.page = 1;
    list_condition.size = 9999;
    list_condition.sortBy = [];
    list_condition.sortDesc = [false];
    api.productWarehousing
      .getProductWarehousingJoborderList(list_condition)
      .then((response) => {
        console.log("getProductWarehousingJoborderList", response);
        this.joborder_list = response.data.responseData;
      })
      .catch((error) => {
        console.log(error);
      });

    // this.editedIndex = -1;
    // this.editedCustomer = Object.assign({}, item);
    this.edit_customer = true;
  }

  deleteItem_pop(item: any) {
    this.$swal
      .fire({
        title: "취소 요청",
        text: "입고 취소하시겠습니까?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "입고취소",
      })
      .then((result) => {
        console.log("deleteItem_pop", result);
        if (result.isConfirmed) {
          let reqDate = {
            id: item.id,
          };
          api.productWarehousing
            .deleteProductWarehousingList(reqDate)
            .then((response) => {
              console.log("deleteWarehousingList", response);
              this.getCustomer();
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });
  }

  selectHistory(item: any) {
    let reqData: any = {
      id: item.id,
    };

    reqData.page = 1;
    reqData.size = 9999;
    reqData.sortBy = [];
    reqData.sortDesc = [false];
    api.productWarehousing
      .getProductWarehousingHistoryList(reqData)
      .then((response) => {
        console.log("getWarehousingHistoryList", response);
        this.history_modal_title = item.code;
        this.item_history_modal = response.data.responseData;
        this.open_history_modal();
      })
      .catch((error) => {
        console.log(error);
      });
  }
  selectLotProduct(item: any) {
    console.log("selectLotProduct", item);
    let reqData: any = {
      lot: item.lot,
    };
    reqData.page = 1;
    reqData.size = 9999;
    reqData.sortBy = [];
    reqData.sortDesc = [false];
    api.productWarehousing
      .getProductLOTHistoryList(reqData)
      .then((response) => {
        console.log("getWarehousingHistoryList", response.data.responseData);
        this.lot_modal_title = item.lot;
        this.item_lot_modal = response.data.responseData;
        this.open_lot_modal();
      })
      .catch((error) => {
        console.log(error);
      });
  }
  open_lot_modal() {
    this.lot_modal = true;
  }
  open_history_modal() {
    this.history_modal = true;
  }
  close_history_modal() {
    this.getCustomer();
    this.history_modal = false;
  }
  close_lot_modal() {
    this.lot_modal = false;
    this.getCustomer();
  }
}
</script>

<style src="./ProductWarehousing.scss" lang="scss"></style>
