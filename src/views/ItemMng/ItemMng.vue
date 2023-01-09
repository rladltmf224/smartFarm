<template>
  <div>
    <v-container fluid>
      <v-row no-gutters>
        <v-col class="ma-2" md="12">
          <h4 class="searchbox-title">조회 조건</h4>
          <v-sheet class="pa-3" color="#F6F8F9" height="90" elevation="2">
            <v-row>
              <v-col cols="2">
                <v-text-field
                  label="코드 or 이름"
                  v-model="search_condition.item"
                  @keydown.enter="getCustomer"
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-select
                  label="타입"
                  v-model="search_condition.type"
                  :items="items_type_list"
                  item-text="name"
                  @change="getCustomer"
                ></v-select>
              </v-col>
              <v-col cols="2">
                <v-text-field
                  label="규격 or 단위"
                  v-model="search_condition.option"
                  @keydown.enter="getCustomer"
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field
                  label="버전"
                  v-model="search_condition.version"
                  @keydown.enter="getCustomer"
                ></v-text-field>
              </v-col>

              <v-col class="pt-5 text-right" offset="2" cols="2">
                <v-btn color="primary" x-large @click="getCustomer">
                  조회
                </v-btn>
              </v-col>
            </v-row>
          </v-sheet>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col class="ma-2" md="12">
          <v-row class="mb-2">
            <v-col md="2">
              <h4 class="searchbox-title">품목 목록</h4>
            </v-col>
            <v-col class="text-right" offset-md="7" md="3">
              <v-btn class="ml-1" small color="primary" @click="openModal"
                ><v-icon left> mdi-book-account </v-icon>품목 추가</v-btn
              >
            </v-col>
          </v-row>

          <v-data-table
            height="630"
            :headers="headers"
            :items="customer_list"
            class="elevation-4"
            fixed-header
            multi-sort
            dense
            @click:row="selectCustomer"
            :options.sync="itemListCfg.options"
            :server-items-length="itemListCfg.totalCount"
            :loading="itemListCfg.loading"
            :items-per-page="itemListCfg.itemsPerPage"
            :page.sync="itemListCfg.page"
            @page-count="itemListCfg.pageCount = $event"
            hide-default-footer
          >
            <template v-slot:item.edit="{ item }">
              <v-icon
                small
                class="mr-2"
                @click="editItem(item, (itemDialog_type = false))"
              >
                mdi-pencil
              </v-icon>
              <v-icon small @click="deleteItem_pop(item)"> mdi-delete </v-icon>
            </template>
          </v-data-table>
          <v-pagination
            v-model="itemListCfg.page"
            :length="itemListCfg.pageCount"
          ></v-pagination>
        </v-col>
      </v-row>
    </v-container>
    <!-- 거래처 생성 모달 -->
    <ItemModal
      :open="itemDialog"
      :editedIndex="itemDialog_type"
      :editedData="editedCustomer"
      :storageData="storage_data"
      :locationData="location_data"
      @changeStorage="getLocation"
      @closeModal="closeModal"
      @save-data="handlerSaveData"
    >
    </ItemModal>
  </div>
</template>

<script lang="ts">
import * as api from "@/api";
import cfg from "./config";
import { gridCfg } from "@/util/config/";
import ItemModal from "./ItemModal.vue";
import { Vue, Component, Watch } from "vue-property-decorator";

@Component({
  components: {
    ItemModal,
  },
  filters: {
    comma(val: number) {
      if (val === null) {
        val = 0;
      }
      return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
})
export default class Item extends Vue {
  itemDialog: boolean = false;
  itemDialog_type: boolean = false;
  edit_customer: boolean = false;
  items_storage: [] = [];
  items_location: [] = [];
  itemListCfg: any = {};
  storage_data: [] = [];
  location_data: [] = [];
  items_type_list: object[] = [];
  items_type: object[] = [];
  customer: object = {};
  editedCustomer: any = {
    id: 1,
    code: "",
    standard: "",
    type: "",
    unit: "",
    storageId: "",
    storageLocationId: "",
  };
  editedIndex: number = -1;
  customer_list: object[] = [];
  search_condition: any = {
    item: "",
    type: "",
    option: "",
    version: "",
  };

  get headers() {
    return cfg.header.itemList;
  }

  created() {
    this.itemListCfg = Object.assign({}, gridCfg);
    this.items_type_list = Object.assign([], cfg.data.items_type_list);
    this.items_type = Object.assign([], cfg.data.items_type);
  }

  @Watch("itemListCfg.options", { deep: true })
  onItemListChange() {
    this.getCustomer();
  }

  handlerSaveData(data: any, editedIndex: number) {
    if (editedIndex > -1) {
      data = {
        version: data.version,
        name: data.name,
        id: data.id,
        standard: data.standard,
        code: data.code,
        type: data.type,
        unit: data.unit,
        storageId: data.storageId,
        storageLocationId: data.storageLocationId,
      };
      api.item
        .updateItemList(data)
        .then((response) => {
          console.log("updateItemList", response);
          this.alertResult(response.data.isSuccess);
          this.$emit("closeModal", false);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      api.item
        .createItemList(data)
        .then((response) => {
          console.log("createCustomerItem", response);
          this.alertResult(response.data.isSuccess);
          this.$emit("closeModal", false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  alertResult(isSuccess: boolean) {
    if (isSuccess) {
      this.$swal({
        title: "수정되었습니다.",
        icon: "success",
        position: "top",
        showCancelButton: false,
        showConfirmButton: false,
        toast: true,
        timer: 1500,
      });
    } else {
      this.$swal({
        title: "등록이 실패되었습니다.",
        icon: "error",
        position: "top",
        showCancelButton: false,
        showConfirmButton: false,
        toast: true,
        timer: 1500,
      });
    }
  }

  selectCustomer(data: any) {
    console.log("selectCustomer", data);
  }

  getCustomer() {
    const { page, itemsPerPage, sortBy, sortDesc } = this.itemListCfg.options;

    this.search_condition.page = page;
    this.search_condition.size = itemsPerPage;
    this.search_condition.sortBy = sortBy;
    this.search_condition.sortDesc = sortDesc;
    this.itemListCfg.loading = true;
    api.item
      .getItemList(this.search_condition)
      .then((response) => {
        console.log("getCustomerList", response);
        this.customer_list = response.data.responseData;
        this.itemListCfg.totalCount = response.data.totalCount;
        this.itemListCfg.loading = false;
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.itemListCfg.loading = false;
      });
  }

  deleteItem(item: any) {
    api.item
      .deleteItemList(item)
      .then((response) => {
        this.getCustomer();
        this.$swal.fire("성공", "삭제되었습니다.", "success");
        console.log("getCustomerList", response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  openModal() {
    this.itemDialog = true;
    this.itemDialog_type = true;
    api.item
      .getItemPage()
      .then((response) => {
        console.log("openModal_customer", response);
        this.storage_data = response.data.responseData.basicStorages;

        console.log("this.items_location", this.items_location);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  closeModal() {
    this.itemDialog = false;
    this.editedCustomer = Object.assign({}, this.customer);
    this.getCustomer();
    console.log("closeModal");
  }

  async editItem(item: any, edit_type: any) {
    console.log(this);

    this.editedIndex = this.customer_list.indexOf(item);
    this.editedCustomer = Object.assign({}, item);

    api.item
      .getItemPage()
      .then((response) => {
        console.log("openModal_customer", response);
        this.storage_data = response.data.responseData.basicStorages;

        console.log("this.items_location", this.items_location);
      })
      .catch((error) => {
        console.log(error);
      });
    await this.getLocation(this.editedCustomer.storageId);
    this.itemDialog = true;
    this.itemDialog_type = edit_type;
    this.edit_customer = true;
  }

  deleteItem_pop(item: any) {
    //this.deleteIndex = this.customer_list.indexOf(item);
    console.log("deleteItem_pop", item);
    let deleteItem = {
      id: item.id,
    };

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
          this.deleteItem(deleteItem);
        }
      });
  }

  getLocation(id: any) {
    this.location_data = [];

    let storageId = {
      storageId: id,
    };
    api.stock
      .getStockTakingLocationList(storageId)
      .then((response) => {
        this.location_data = response.data.responseData;
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
</script>

<style src="./ItemMng.scss" lang="scss"></style>
