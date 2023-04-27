<template>
  <div class="warehousing">
    <v-container fluid v-resize="onResize">
      <v-row no-gutters>
        <v-col class="ma-2" md="12">
          <span>조회 조건</span>
          <v-card class="card-shadow pa-3" height="110">
            <v-row no-gutters>
              <v-col cols="10">
                <v-row dense>
                  <v-col cols="3">

                    <v-text-field label="품목명 or 품목코드" v-model="search_condition.item" @keydown.enter="getCustomer" dense
                      solo rounded hide-details="false"></v-text-field>
                  </v-col>

                  <v-col cols="2">
                    <v-text-field label="입고코드" v-model="search_condition.warehousingCode" @keydown.enter="getCustomer"
                      dense solo rounded hide-details="false"></v-text-field>
                  </v-col>

                  <v-col cols="2">
                    <v-text-field label="LOT코드" v-model="search_condition.rawMaterialLot" @keydown.enter="getCustomer"
                      dense solo rounded hide-details="false"></v-text-field>
                  </v-col>
                  <v-col cols="2">
                    <v-select label="자재타입" v-model="search_condition.status" :items="rawmaterial_list" item-text="name"
                      item-value="value" @change="getCustomer" dense solo rounded hide-details="false"></v-select>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="2">

                    <v-select label="창고" v-model="search_condition.storage" :items="storage_list_search" item-text="name"
                      item-value="id" @change="getCustomer" dense solo rounded hide-details="false"></v-select>
                  </v-col>
                  <v-col md="2">
                    <v-menu ref="startDate" v-model="startDate" :close-on-content-click="false"
                      :return-value.sync="search_condition.startDate" transition="scale-transition" offset-y
                      min-width="auto">
                      <template v-slot:activator="{ on, attrs }">

                        <v-text-field v-model="search_condition.startDate" label="시작일" readonly v-bind="attrs" v-on="on"
                          dense solo rounded hide-details="false"></v-text-field>
                      </template>
                      <v-date-picker v-model="search_condition.startDate" no-title scrollable locale="ko-KR"
                        :max="search_condition.endDate">
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="startDate = false">
                          취소
                        </v-btn>
                        <v-btn text color="primary" @click="s_date_search(search_condition.startDate)">
                          확인
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col md="2">
                    <v-menu ref="endDate" v-model="endDate" :close-on-content-click="false"
                      :return-value.sync="search_condition.endDate" transition="scale-transition" offset-y
                      min-width="auto">
                      <template v-slot:activator="{ on, attrs }">

                        <v-text-field v-model="search_condition.endDate" label="종료일" readonly v-bind="attrs" v-on="on"
                          dense solo rounded hide-details="false"></v-text-field>
                      </template>
                      <v-date-picker v-model="search_condition.endDate" no-title scrollable locale="ko-KR"
                        :min="search_condition.startDate">
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="endDate = false">
                          취소
                        </v-btn>
                        <v-btn text color="primary" @click="e_date_search(search_condition.endDate)">
                          확인
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
              </v-col>
              <v-col class="pt-5 text-right" cols="2">
                <v-btn color="primary" x-large @click="getCustomer">
                  <v-icon left> mdi-magnify </v-icon>
                  조회
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col class="ma-2" md="12">
          <v-row no-gutters class="mb-2">
            <v-col md="2">
              <span>원자재 재고 목록</span>
            </v-col>
          </v-row>
          <v-card>

            <v-data-table :height="table_height" :headers="headers" :items="statement_list" item-key="barcode"
              fixed-header multi-sort single-select :options.sync="rawmaterialStockOption.options"
              :server-items-length="rawmaterialStockOption.totalCount" :loading="rawmaterialStockOption.loading"
              :items-per-page="rawmaterialStockOption.itemsPerPage" :page.sync="rawmaterialStockOption.page"
              @page-count="rawmaterialStockOption.pageCount = $event" hide-default-footer loading-text="서버에 요청중...."
              no-data-text="데이터가 없습니다.">
              <template v-slot:item.storageName="{ item }">
                {{ item.storageName }} &nbsp;
                <v-btn text x-small fluid color="primary" class="editBtn" @click="edit_changeStorage(item)">
                  <v-icon x-small> mdi-pencil </v-icon>
                </v-btn>
              </template>

              <template v-slot:item.count="props">
                <span class="text-right"> {{ props.item.count | comma }}</span>
              </template>
            </v-data-table>


          </v-card>
          <v-pagination circle v-model="rawmaterialStockOption.page"
            :length="rawmaterialStockOption.pageCount"></v-pagination>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col class="ma-2" md="12">
          <v-row no-gutters class="mb-2">
            <v-col md="2">
              <span>검색된 품목별 리스트</span>
            </v-col>
          </v-row>
          <v-card>

            <v-data-table height="270" :headers="headers_detail" :items="item_list" item-key="barcode" :items-per-page="5"
              hide-default-footer fixed-header multi-sort no-data-text="데이터가 없습니다.">
              <template v-slot:item.sumCount="props">
                {{ props.item.sumCount | comma }}
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- 창고 변경 모달 -->
    <RawmaterialStockStorage :open="edit_storage" :originalData="originalData" :totalStorage_list="totalStorage_list"
      @closeModal="close_modal">
    </RawmaterialStockStorage>
  </div>
</template>

<script lang="ts">
import * as api from "@/api";
import { gridCfg } from "@/util/config";
import cfg from "./config";
import RawmaterialStockStorage from "./RawmaterialStockStorage.vue";
import { Component, Vue, Watch } from "vue-property-decorator";

@Component({
  components: {
    RawmaterialStockStorage,
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
export default class RawmaterialStock extends Vue {
  table_height: number = 0;
  changeStorageId: number | null = null;
  original_storageName: string = "";
  original_locationName: string = "";
  update_storageName: string = "";
  update_locationeName: string = "";
  original_storageId: number | "" = "";
  totalStorage_list: [] = [];
  totalLocation_list: [] = [];
  rawmaterialStockOption: any = {};
  startDate: boolean = false;
  endDate: boolean = false;
  edit_storage: boolean = false;
  rawmaterial_list: any[] = [];
  statement_list: [] = [];
  storage_list: [] = [];
  storage_list_search: any[] = [];
  item_list: [] = [];
  search_condition: any = {
    item: "",
    warehousingCode: "",
    rawMaterialLot: "",
    status: "",
    storage: "",
    checkCount: "1",
    startDate: "",
    endDate: "",
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

  created() {
    this.rawmaterial_list = cfg.data.rawmaterial_list;
    this.rawmaterialStockOption = Object.assign({}, gridCfg);
  }

  mounted() {
    this.getStorage();
    this.onResize();
  }

  onResize() {
    this.table_height = window.innerHeight - 48 - 129 - 210 - 150 - 95;
    console.log("onResize", this.table_height);
  }

  @Watch("rawmaterialStockOption.options", { deep: true })
  onRawmaterialStockOptionChange() {
    this.getCustomer();
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
  getStorage() {
    let list_condition: any = {};
    list_condition.page = 1;
    list_condition.size = 9999;
    list_condition.sortBy = [];
    list_condition.sortDesc = [false];
    api.storage
      .getStorageList(list_condition)
      .then((response) => {
        console.log("getStorage", response);
        response.data.responseData.forEach((el: any) => {
          el.id = el.name;
        });
        this.storage_list_search = [{ name: "전체", id: "" }];
        this.storage_list_search.push(...response.data.responseData);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  getCustomer() {
    const { page, itemsPerPage, sortBy, sortDesc } =
      this.rawmaterialStockOption.options;
    this.search_condition.page = page;
    this.search_condition.size = itemsPerPage;
    this.search_condition.sortBy = sortBy;
    this.search_condition.sortDesc = sortDesc;
    this.rawmaterialStockOption.loading = true;
    api.rawStock
      .postRawmaterialStockData(this.search_condition)
      .then((response) => {
        console.log("postProductStockData", response);
        this.statement_list = response.data.responseData;
        this.rawmaterialStockOption.totalCount = response.data.totalCount;

        this.rawmaterialStockOption.loading = false;
      })
      .catch((error) => {
        console.log(error);
        this.rawmaterialStockOption.loading = false;
      });
    api.rawStock
      .getReleaseProductItemTotal()
      .then((response) => {
        console.log("postProductStockData", response);
        this.item_list = response.data.responseData;
      })
      .catch((error) => {
        console.log(error);
      });
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

    //창고목록 불러오기
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
  close_modal() {
    this.edit_storage = false;
    this.getStorage();
    this.getCustomer();
  }
}
</script>

<style src="./RawmaterialStock.scss" lang="scss"></style>
