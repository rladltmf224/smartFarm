<template>
  <div class="warehousing">
    <v-container fluid v-resize="onResize">
      <v-row>
        <v-col class="" lg="12">
          <span class="searchbox-title">조회 조건</span>
          <v-card class="pa-3" height="60">
            <v-row>
              <v-col cols="2">
                <v-text-field
                  label="거래처명"
                  v-model="search_condition.customer"
                  @keydown.enter="getCustomer"
                  dense
                  solo
                  rounded
                  elevation-0
                  hide-details="false"
                ></v-text-field>
              </v-col>
              <v-spacer></v-spacer>
              <v-col class="pt-3 text-right" cols="3">
                <v-btn color="primary" @click="getCustomer">
                  <v-icon left> mdi-magnify </v-icon>
                  조회
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="4">
          <v-row dense>
            <v-col class="mb-1 pt-3" cols="4" align-self="center">
              <span class="">거래처 목록</span>
            </v-col>
            <v-col cols="12">
              <v-card>
                <v-data-table
                  :height="customerList_height"
                  :headers="headers"
                  :items="statement_list"
                  item-key="id"
                  multi-sort
                  single-select
                  fixed-header
                  dense
                  @click:row="selectCustomerItem"
                  :options.sync="customerListCfg.options"
                  :server-items-length="customerListCfg.totalCount"
                  :loading="customerListCfg.loading"
                  :items-per-page="customerListCfg.itemsPerPage"
                  :page.sync="customerListCfg.page"
                  @page-count="customerListCfg.pageCount = $event"
                  hide-default-footer
                >
                </v-data-table>
              </v-card>
              <v-pagination
                circle
                v-model="customerListCfg.page"
                :length="customerListCfg.pageCount"
              ></v-pagination>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="8">
          <v-row dense>
            <v-col cols="4" align-self="center">
              <span class="searchbox-title">등록된 품목</span>
            </v-col>
            <v-spacer></v-spacer>
            <v-col class="text-right" cols="5" align-self="center">
              <v-btn class="ml-1" color="success" @click="saveCustomerItem"
                >적용</v-btn
              >
              <v-btn class="ml-1" color="primary" @click="editItem"
                ><v-icon left> mdi-pencil-plus </v-icon>품목 추가</v-btn
              >
            </v-col>
            <v-col cols="12">
              <v-card>
                <v-data-table
                  :height="itemList_height"
                  :headers="headers_detail"
                  :items="statement_detail_list"
                  item-key="itemId"
                  single-select
                  multi-sort
                  hide-default-footer
                  dense
                  @click:row="selectItemHistory"
                >
                  <template v-slot:[`item.unitPrice`]="props">
                    <v-edit-dialog
                      :return-value.sync="props.item.unitPrice"
                      @save="props.item = saveUnitPrice(props.item)"
                    >
                      {{ props.item.unitPrice | comma }}
                      <template v-slot:input>
                        <v-text-field
                          v-model="props.item.unitPrice"
                          label="Edit"
                          single-line
                          type="text"
                          maxlength="15 "
                          oninput="this.value = this.value.replace(/[^0-9]/g, '').replace(/(^0+)/, '');"
                        ></v-text-field>
                      </template>
                    </v-edit-dialog>
                  </template>

                  <template v-slot:[`item.supplyPrice`]="props">
                    {{ props.item.supplyPrice | comma }}
                  </template>

                  <template v-slot:[`item.taxAmount`]="props">
                    {{ props.item.taxAmount | comma }}
                  </template>

                  <template v-slot:[`item.delete`]="{ item }">
                    <v-icon small @click="deleteItem_pop(item)">
                      mdi-delete
                    </v-icon>
                  </template>
                </v-data-table>
              </v-card>
            </v-col>

            <v-col cols="2">
              <span class="searchbox-title">변경 이력</span>
            </v-col>
            <v-col cols="12">
              <v-card>
                <v-data-table
                  :height="changeList_height"
                  :headers="headers_history"
                  :items="item_history_list"
                  multi-sort
                  hide-default-footer
                  dense
                >
                  <template v-slot:[`item.unitPrice`]="props">
                    {{ props.item.unitPrice | comma }}
                  </template>
                  <template v-slot:[`item.supplyPrice`]="props">
                    {{ props.item.supplyPrice | comma }}
                  </template>

                  <template v-slot:[`item.taxAmount`]="props">
                    {{ props.item.taxAmount | comma }}
                  </template>
                </v-data-table>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>

    <!-- 생성 모달 -->
    <WarehousingPriceItemModal
      :open="edit_customer"
      :customerID="selectCustomerID"
      @addItemList="handlerSaveItemModal"
      @closeModal="close_item_modal"
    ></WarehousingPriceItemModal>
  </div>
</template>

<script lang="ts">
import _ from "lodash";
import cfg from "./config";
import * as api from "@/api/index.js";
import { gridCfg } from "@/util/config/";
import WarehousingPriceItemModal from "./WarehousingPriceItemModal.vue";
import { Vue, Component, Watch } from "vue-property-decorator";

@Component({
  components: {
    WarehousingPriceItemModal,
  },
  filters: {
    comma(val: number) {
      if (val === null) {
        console.log(val);
        val = 0;
      }
      return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
})
export default class WarehousingPrice extends Vue {
  itemDialog: boolean = false;
  itemDialog_type: string = "";
  edit_customer: boolean = false;
  history_modal_title: string = "";
  customer_item_list: [] = [];
  item_history_list: [] = [];
  customerListCfg: any = {};
  itemListCfg: object = {};
  search_condition: any = {
    customer: "",
    type: "매입거래처",
  };
  search_condition_modal: { item: string; types: string[] } = {
    item: "",
    types: ["원자재", "반제품"],
  };
  customer: object = {
    code: "",
    companyId: "",
    customerId: "",
    warehousingCreateDetails: [],
  };
  editedCustomer: object = {
    code: "",
    companyId: "",
    customerId: "",
    warehousingCreateDetails: [],
  };

  itemInfo: object = {
    count: 0,
    itemId: "",
    name: "",
    defectCount: 0,
    eachCount: [],
    memo: "",
    normalCount: 0,
    orderCount: 0,
    storageId: 0,
  };
  itemInfo_default: object = {};
  selected_item: [] = [];
  editedIndex: number = -1;
  statement_list: any[] = [];
  statement_detail_list: any[] = [];
  storage_list: any[] = [];
  item_list_modal: any[] = [];
  selectCustomerID: string = "";
  itemModal_Loading: boolean = false;
  customerList_height: number = 0;
  itemList_height: number = 0;
  changeList_height: number = 0;

  created() {
    this.customerListCfg = Object.assign({}, gridCfg);
    this.itemInfo_default = Object.assign({}, this.itemInfo);
  }

  get headers() {
    return cfg.header.customerList;
  }
  get headers_detail() {
    return cfg.header.regiItemList;
  }

  get headers_history() {
    return cfg.header.changeHistory;
  }

  @Watch("edit_customer")
  onEditCustomer(val: any) {
    val || this.closeModal_customer();
  }

  @Watch("customerListCfg.options", { deep: true })
  onCustomerListCfg() {
    this.getCustomer();
  }

  mounted() {
    this.onResize();
  }

  // closeModal() {
  //   this.item = false;
  //   this.itemInfo = Object.assign({}, this.itemInfo_default);
  //   this.getCustomer();
  //   console.log("closeModal");
  // }
  // changeText() {
  //   console.log(this.itemInfo.count);
  //   this.itemInfo.count = this.itemInfo.count.replace(/[^0-9]/g, "");
  // }

  onResize() {
    this.customerList_height = window.innerHeight - 48 - 129 - 90;
    this.itemList_height = window.innerHeight - 48 - 550;
    this.changeList_height = window.innerHeight - 48 - 550;
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

  selectCustomerItem(data: any, row: any) {
    console.log("selectCustomerItem", data);
    this.selectCustomerID = data.id;
    let reqData = {
      customerId: data.id,
    };
    api.warehousingPrice
      .getWarehousingCustomerItemData(reqData)
      .then((response) => {
        console.log("getWarehousingCustomerItemData", response);
        row.select(true);
        this.statement_detail_list = response.data.responseData;
      })
      .catch((error) => {
        console.log(error);
      });
  }
  selectItemHistory(data: any, row: any) {
    console.log("selectItemHistory", data);
    let reqData = {
      itemPriceId: data.itemPriceId,
      itemId: data.itemId,
    };
    row.select(true);
    if (data.itemPriceId != undefined) {
      api.warehousingPrice
        .getWarehousingItemHistoryData(reqData)
        .then((response) => {
          console.log("postWarehousingCustomerData", response);

          this.item_history_list = response.data.responseData;
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
  getCustomer() {
    const { page, itemsPerPage, sortBy, sortDesc } =
      this.customerListCfg.options;
    this.search_condition.page = page;
    this.search_condition.size = itemsPerPage;
    this.search_condition.sortBy = sortBy;
    this.search_condition.sortDesc = sortDesc;
    this.customerListCfg.loading = true;
    api.warehousingPrice
      .postWarehousingCustomerData(this.search_condition)
      .then((response) => {
        console.log("postWarehousingCustomerData", response);
        this.statement_list = response.data.responseData;
        this.customerListCfg.totalCount = response.data.totalCount;
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.customerListCfg.loading = false;
      });
  }
  saveUnitPrice(item: any) {
    item.unitPrice = parseInt(item.unitPrice);
    item.supplyPrice = Math.round(item.unitPrice * 0.9);
    item.taxAmount = item.unitPrice - item.supplyPrice;
    return item;
  }
  saveCustomerItem() {
    if (this.selectCustomerID == "") {
      return this.$swal("경고", "거래처를 선택해주세요!", "error");
    }

    let validation = false;
    this.statement_detail_list.forEach((el) => {
      if (el.unitPrice == 0) {
        validation = true;
      }
    });

    if (validation) {
      return this.$swal(
        "경고",
        "매입가가 입력이 안된 품목이 있습니다.",
        "error"
      );
    }

    let reqData = {
      customerId: this.selectCustomerID,
      itemPrices: this.statement_detail_list,
    };
    api.warehousingPrice
      .postWarehousingItemRegiData(reqData)
      .then((response) => {
        console.log("postWarehousingItemRegiData", response);
        if (response.status == 200) {
          this.$swal("성공", "설정되었습니다.", "success");
          this.getCustomer();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  deleteDetailItem_pop(item: any, index: any) {
    const detailindex = this.item_list_modal.findIndex((object) => {
      return object.itemId === item.itemId;
    });
    console.log(item, index, detailindex);
    this.item_list_modal[detailindex].eachCount.splice(index, 1);
    let sumData = _.sumBy(this.item_list_modal[detailindex].eachCount, "count");
    this.item_list_modal[detailindex].normalCount = sumData;
  }

  // closeModal_item() {
  //   this.add_item = false;
  // }
  closeModal_customer() {
    this.edit_customer = false;
    this.itemInfo = Object.assign({}, this.itemInfo_default);
    this.$nextTick(() => {
      this.item_list_modal = [];
      this.editedCustomer = Object.assign({}, this.customer);
      this.editedIndex = -1;
    });
    this.customer = {
      companyId: "",
      name: "",
    };
  }
  saveOrderCount(item: any) {
    console.log(item);
    item.defectCount = parseInt(item.orderCount) - parseInt(item.normalCount);
    if (
      parseInt(item.orderCount) <
      parseInt(item.normalCount) + parseInt(item.defectCount)
    ) {
      this.$swal("경고", "주문수량을 다시 입력해주세요!", "error");
      return item;
    }

    return item;
  }
  editItem() {
    if (this.selectCustomerID == "") {
      return this.$swal("경고", "거래처를 선택해주세요", "error");
    }

    this.openItemListModal();
  }

  openItemListModal() {
    this.edit_customer = true;
  }
  deleteItem_pop(item: any) {
    let deleteIndex = this.statement_detail_list.indexOf(item);
    console.log("deleteItem_pop", deleteIndex, item);

    this.$swal
      .fire({
        title: "삭제 요청",
        text: "품목을 하시겠습니까?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "삭제",
      })
      .then((result) => {
        console.log("deleteItem_pop", result);
        if (result.isConfirmed) {
          if (item.itemPriceId == undefined) {
            this.statement_detail_list.splice(deleteIndex, 1);
          } else {
            let reqDate = {
              itemPriceId: item.itemPriceId,
            };
            api.warehousingPrice
              .deleteWarehousingItemData(reqDate)
              .then((response) => {
                console.log("deleteWarehousingList", response);
                this.statement_detail_list.splice(deleteIndex, 1);
                this.$swal({
                  title: "품목이 삭제되었습니다.",
                  icon: "success",
                  position: "top",
                  showCancelButton: false,
                  showConfirmButton: false,
                  toast: true,
                  timer: 1500,
                });
              })
              .catch((error) => {
                console.log(error);
              });
          }
        }
      });
  }
  close_item_modal() {
    this.edit_customer = false;
    this.selected_item = [];
  }
  handlerSaveItemModal(item: object[]) {
    console.log("handlerSaveItemModal", item);

    item.forEach(
      (el: {
        itemId: number;
        itemName: string;
        itemType: string;
        itemVersion: string;
        storage: string;
        storageArea: string;
      }) => {
        let data: object = {
          itemId: el.itemId,
          itemName: el.itemName,
          itemType: el.itemType,
          itemVersion: el.itemVersion,
          storageName: el.storage,
          storageArea: el.storageArea,
          currency: "KRW",
          unitPrice: 0,
          supplyPrice: 0,
          taxAmount: 0,
        };
        this.statement_detail_list.unshift(data);
      }
    );
    this.close_item_modal();
  }
}
</script>

<style src="./WarehousingPrice.scss" lang="scss"></style>
