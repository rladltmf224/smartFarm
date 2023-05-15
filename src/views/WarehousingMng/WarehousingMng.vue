<template>
  <div class="warehousing">
    <v-container fluid v-resize="onResize">
      <v-row>
        <v-col class="ma-2" md="12">
          <span class="searchbox-title">조회 조건</span>
          <v-card class="card-shadow pa-3" height="65">
            <v-row>
              <v-col cols="2">
                <v-text-field
                  dense
                  solo
                  rounded
                  elevation-0
                  label="입고코드"
                  v-model="search_condition.code"
                  @keydown.enter="getCustomer"
                ></v-text-field>
              </v-col>
              <v-spacer></v-spacer>
              <v-col class="text-right" cols="2">
                <v-btn color="primary" large elevation="0" @click="getCustomer">
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
          <v-row dense class="mb-2">
            <v-col cols="2" align-self="center">
              <span class="searchbox-title">입고 목록</span>
            </v-col>
            <v-spacer></v-spacer>
            <v-col class="text-right" cols="4">
              <v-btn elevation="0" color="primary" @click="editItem"
                ><v-icon left> mdi-pencil-plus </v-icon>입고 추가</v-btn
              >
            </v-col>
          </v-row>

          <v-card>
            <!-- :height="table_height" -->
            <v-data-table
              height="40vh"
              :headers="headers"
              :items="statement_list"
              item-key="id"
              multi-sort
              single-select
              fixed-header
              disable-items-per-page
              @click:row="selectCustomer"
              :options.sync="warehousingListCfg.options"
              :server-items-length="warehousingListCfg.totalCount"
              :loading="warehousingListCfg.loading"
              :items-per-page="warehousingListCfg.itemsPerPage"
              :page.sync="warehousingListCfg.page"
              @page-count="warehousingListCfg.pageCount = $event"
              hide-default-footer
              loading-text="서버에 요청중...."
              no-data-text="데이터가 없습니다."
            >
              <template v-slot:item.code="{ item }">
                <v-btn
                  class="closeBtn text-left mt-1 mb-1"
                  text
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
                  elevation=""
                >
                  반품 요청
                </v-btn>
              </template>
            </v-data-table>
          </v-card>
          <v-pagination
            circle
            v-model="warehousingListCfg.page"
            :length="warehousingListCfg.pageCount"
          ></v-pagination>
        </v-col>
        <v-col class="ma-2" md="12">
          <v-row dense class="mb-2">
            <v-col md="2">
              <h4 class="searchbox-title">입고 상세</h4>
            </v-col>
          </v-row>
          <v-card>
            <!-- :height="table_height2" -->
            <v-data-table
              height="20vh"
              :headers="headers_detail"
              :items="statement_detail_list"
              fixed-header
              item-key="barcode"
              multi-sort
              hide-default-footer
              disable-pagination
              dense
              no-data-text="데이터가 없습니다."
            >
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
    <WarehousingItemModal
      ref="ItemModal"
      :open="edit_customer"
      @closeModal="closeModal_customer"
    >
    </WarehousingItemModal>

    <!-- 이력 모달 -->
    <WarehousingHistoryModal
      :open="history_modal"
      :history_modal_title="history_modal_title"
      :history_list="item_history_modal"
      @closeModal="closeModal_history"
    ></WarehousingHistoryModal>

    <!-- 반품 요청 (개별 반품처리를 위한) 모달
    <WarehousingDeleteModal
      :open="delete_modal"
      @closeModal="closeModal_deleteItem"
      :delete_item="delete_item"
    ></WarehousingDeleteModal>-->
  </div>
</template>

<script lang="ts">
import { gridCfg } from "@/util/config";
import * as api from "@/api";
import cfg from "./config";
import WarehousingItemModal from "./WarehousingItemModal.vue";
import WarehousingHistoryModal from "./WarehousingHistoryModal.vue";
//import WarehousingDeleteModal from "./WarehousingDeleteModal.vue";
import { Vue, Component, Watch } from "vue-property-decorator";

@Component({
  components: {
    WarehousingItemModal,
    WarehousingHistoryModal,
    //WarehousingDeleteModal
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
export default class WarehousingMng extends Vue {
  //delete_modal: boolean = false; 반품 요청 (개별 반품처리)
  //delete_item: any[] = []; 반품 요청 (개별 반품처리)
  table_height: number = 0;
  table_height2: number = 0;
  edit_customer: boolean = false;
  history_modal: boolean = false;
  history_modal_title: string = "";
  warehousingListCfg: any = {};
  search_condition: any = {
    code: "",
  };
  statement_list: any[] = [];
  statement_detail_list: any[] = [];
  item_list: any[] = [];
  item_list_modal: any[] = [];
  item_history_modal: any[] = [];
  selectItemID: string = "";

  @Watch("edit_customer")
  onEditCustomer(val: any) {
    val || this.closeModal_customer();
  }

  /*
  @Watch("delete_modal")
  onDeleteItem(val: any) {
    val || this.closeModal_deleteItem();
  }
  */

  @Watch("warehousingListCfg.options", { deep: true })
  onWarehousingListCfg() {
    this.getCustomer();
  }

  get headers() {
    return cfg.header.headers;
  }

  get headers_detail() {
    return cfg.header.headers_detail;
  }

  created() {
    this.warehousingListCfg = Object.assign({}, gridCfg);
    this.warehousingListCfg.options.itemsPerPage = 8;
  }

  mounted() {
    this.onResize();
  }

  onResize() {
    this.table_height = window.innerHeight - 48 - 97 - 400;
    this.table_height2 = window.innerHeight - 48 - 97 - 400 - 100 - 115;
  }

  closeModal_history() {
    this.history_modal = false;
    this.getCustomer();
  }
  // changeText() {
  //   console.log(this.itemInfo.count);
  //   this.itemInfo.count = this.itemInfo.count.replace(/[^0-9]/g, "");
  // }
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

    api.rawWarehousing
      .getWarehousingDetailList({ id: data.id })
      .then((response) => {
        console.log("getWarehousingDetailList", response);

        this.statement_detail_list = response.data.responseData;
      })
      .catch((error) => {
        console.log(error);
      });
  }
  getCustomer() {
    this.statement_detail_list = [];

    const { page, itemsPerPage, sortBy, sortDesc } =
      this.warehousingListCfg.options;
    this.search_condition.page = page;
    this.search_condition.size = itemsPerPage;
    this.search_condition.sortBy = sortBy;
    this.search_condition.sortDesc = sortDesc;
    this.warehousingListCfg.loading = true;
    api.rawWarehousing
      .getWarehousingList(this.search_condition)
      .then((response) => {
        console.log("getWarehousingList", response);
        this.statement_list = response.data.responseData;
        this.warehousingListCfg.totalCount = response.data.totalCount;
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.warehousingListCfg.loading = false;
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

  closeModal_customer() {
    this.edit_customer = false;
    this.getCustomer();
  }

  /*반품 요청 (개별 반품처리)
  closeModal_deleteItem() {
    this.delete_modal = false;
    this.getCustomer();
  }
  */

  // getCutomerItem() {
  //   let reqData = {
  //     customerId: this.editedCustomer.customerId,
  //   };
  //   api.warehousingPrice
  //     .getWarehousingCustomerItemData(reqData)
  //     .then((response) => {
  //       console.log("getWarehousingData", response);
  //       this.item_list = response.data.responseData;
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }
  editItem() {
    this.edit_customer = true;
    let itemModalEL: any = this.$refs.ItemModal;
    itemModalEL.getDefaultData();
    console.log("editItem", this.$refs);
  }

  deleteItem_pop(item: any) {
    /*반품 요청 (개별 반품처리)
    this.delete_item = [];
    this.delete_item.push(item);
    this.delete_modal = true;
    */
    this.$swal
      .fire({
        title: "반품 요청",
        text: "반품 하시겠습니까?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "반품",
        inputLabel: "반품 사유",
        input: "text",
      })
      .then((result) => {
        console.log("deleteItem_pop", result);
        if (result.isConfirmed) {
          let reqDate = {
            id: item.id,
            memo: result.value,
          };
          api.rawWarehousing
            .deleteWarehousingList(reqDate)
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
  deleteItem_modal(item: any) {
    let deleteIndex = this.item_list_modal.indexOf(item);
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
          this.item_list_modal.splice(deleteIndex, 1);
        }
      });
  }
  selectHistory(item: any) {
    let reqData = {
      id: item.id,
    };
    api.rawWarehousing
      .getWarehousingHistoryList(reqData)
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
  open_history_modal() {
    this.history_modal = true;
  }
}
</script>

<style src="./WarehousingMng.scss" lang="scss"></style>
