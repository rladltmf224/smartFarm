<template>
  <div>
    <v-container fluid v-resize="onResize">
      <v-row>
        <v-col md="4">
          <v-row>
            <v-col>
              <span>실사 조회</span>
            </v-col>
          </v-row>

          <v-sheet class="pa-5" color="#F6F8F9" max-width="600">
            <v-card
              height="115px"
              class="pa-4 lighten-2"
              style="overflow-y: auto"
            >
              <v-row class="clockRow">
                <v-col cols="5" class="pa-0">
                  <v-menu
                    ref="startDate"
                    v-model="menu_start_date"
                    :close-on-content-click="false"
                    :return-value.sync="search_stock.startDate"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        class="ml-6"
                        v-model="search_stock.startDate"
                        label="시작일"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        dense
                        solo
                        rounded
                        hide-details="false"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="search_stock.startDate"
                      no-title
                      scrollable
                      locale="ko-KR"
                      :max="search_stock.endDate"
                    >
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="cancelStart">
                        취소
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="s_date_search(search_stock.startDate)"
                      >
                        확인
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="1" class="ml-5">
                  <span class="text-h5 dialog-title font-weight-bold mt-10">
                    -
                  </span>
                </v-col>
                <v-col cols="5" class="pa-0">
                  <v-menu
                    ref="endDate"
                    v-model="menu_end_date"
                    :close-on-content-click="false"
                    :return-value.sync="search_stock.endDate"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        class="ml-4"
                        v-model="search_stock.endDate"
                        label="종료일"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        dense
                        solo
                        rounded
                        hide-details="false"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="search_stock.endDate"
                      no-title
                      scrollable
                      locale="ko-KR"
                      :min="search_stock.startDate"
                    >
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="cancelEnd">
                        취소
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="e_date_search(search_stock.endDate)"
                      >
                        확인
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
              <v-row class="clockRow">
                <v-col cols="12" class="pa-0">
                  <v-radio-group
                    class="ml-6"
                    v-model="row"
                    @change="getSearch"
                    row
                  >
                    <v-radio label="전체" value=""> </v-radio>
                    <v-radio label="일주일 전" value="week"> </v-radio>
                    <v-radio label="한달 전" value="month"> </v-radio>
                    <v-radio label="일년 전" value="year"> </v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>
            </v-card>

            <v-row class="ma-1" dense>
              <v-col cols="6">
                <v-text-field
                  v-model="search_stock.createdId"
                  @keydown.enter="getSearch"
                  return-object
                  label="등록자"
                  dense
                  solo
                  rounded
                  hide-details="false"
                ></v-text-field>
              </v-col>
              <v-col cols="2" class="text-right">
                <v-btn color="primary" small class="mt-2" @click="getSearch">
                  <v-icon left> mdi-magnify </v-icon>
                  조회
                </v-btn>
              </v-col>
            </v-row>
            <v-card>
              <v-data-table
                multi-sort
                fixed-header
                height="580"
                item-key="inventoryCheckId"
                :items="stockTakingTable"
                :headers="checkListHeader"
                @click:row="selectedStock"
                single-select
                :options.sync="stockListCfg.options"
                :server-items-length="stockListCfg.totalCount"
                :loading="stockListCfg.loading"
                :items-per-page="stockListCfg.itemsPerPage"
                :page.sync="stockListCfg.page"
                @page-count="stockListCfg.pageCount = $event"
                hide-default-footer
                loading-text="서버에 요청중...."
                no-data-text="데이터가 없습니다."
                class="overflow-scroll ml-2 mr-2"
              >
              </v-data-table>
            </v-card>
            <v-pagination
              circle
              v-model="stockListCfg.page"
              :length="stockListCfg.pageCount"
            ></v-pagination>
          </v-sheet>
        </v-col>

        <v-col md="8">
          <v-row>
            <v-col md="2">
              <span>실사 상세 조회</span>
            </v-col>
            <v-col class="text-right" offset-md="3" md="7"> </v-col>
          </v-row>
          <v-sheet class="pa-5" color="#F6F8F9" max-width="auto">
            <v-col class="text-right" offset-md="9" md="3">
              <v-btn
                class="saveStock"
                color="primary"
                @click="open_dialog"
                small
              >
                실 사 등 록
              </v-btn>
            </v-col>
            <v-card>
              <v-data-table
                fixed-header
                multi-sort
                v-model="lotTable"
                :items="stockTakingDetailTable"
                :height="table_height"
                item-key="itemId"
                single-select
                :options.sync="stockDetailListCfg.options"
                :server-items-length="stockDetailListCfg.totalCount"
                :loading="stockDetailListCfg.loading"
                :items-per-page="stockDetailListCfg.itemsPerPage"
                :page.sync="stockDetailListCfg.page"
                @page-count="stockDetailListCfg.pageCount = $event"
                hide-default-footer
                :headers="checkListDetailHeader"
                loading-text="서버에 요청중...."
                no-data-text="데이터가 없습니다."
                @click:row="(item, slot) => slot.expand(!slot.isExpanded)"
                class="overflow-scroll ml-2 mr-2"
              >
                <template #expanded-item="{ headers, item }">
                  <td class="stockTreeTable" :colspan="headers.length">
                    <v-data-table
                      fixed-header
                      multi-sort
                      class="second-tableBorder"
                      :headers="checkListLotHeader"
                      :items="item.detail"
                      dense
                      single-select
                      return-object
                      elevation="0"
                      disable-pagination
                      hide-default-footer
                    >
                    </v-data-table>
                  </td>
                </template>
                <template v-slot:item.itemType="{ item }">
                  <v-btn
                    class="center mt-1 mb-1 childBtn"
                    small
                    :color="getTypeColor(item.itemType)"
                    dark
                    style="width: 100px"
                    depressed
                  >
                    {{ item.itemType }}
                  </v-btn>
                </template>
              </v-data-table>
            </v-card>
            <v-pagination
              circle
              v-model="stockDetailListCfg.page"
              :length="stockDetailListCfg.pageCount"
            ></v-pagination>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
    <!-- 실사 등록 Modal -->
    <stock-modal :open="stockDialog" @closeModal="closeModal"> </stock-modal>
  </div>
</template>

<script lang="ts">
import * as api from "@/api";
import cfg from "./config";
import { gridCfg } from "@/util/config/";
import StockModal from "./StockModal.vue";
import { Vue, Component, Watch } from "vue-property-decorator";

@Component({
  components: {
    StockModal,
  },
})
export default class Stock extends Vue {
  table_height: number = 0;
  stockListCfg: any = {};
  stockDetailListCfg: any = {};
  lotTable: [] = [];
  checkLotId: any = null;
  changeStorageId: any = null;
  menu_start_date: boolean = false;
  menu_end_date: boolean = false;
  search_stock: any = {
    startDate: "",
    endDate: "",
    createdId: "",
    page: 0,
    size: 0,
    sortBy: [],
    sortDesc: [],
  };
  id: any = {
    inventoryCheckId: "",
    page: 0,
    size: 0,
    sortBy: [],
    sortDesc: [],
  };
  row: any = "";
  stockDialog: boolean = false;
  stocktakinglist: [] = [];
  stocktakingDetaillist: [] = [];
  item: object = {};

  get stockTakingTable() {
    return this.stocktakinglist;
  }

  get stockTakingDetailTable() {
    return this.stocktakingDetaillist;
  }

  get checkListHeader() {
    return cfg.header.checkListHeader;
  }

  get checkListDetailHeader() {
    return cfg.header.checkListDetailHeader;
  }

  get checkListLotHeader() {
    return cfg.header.checkListLotHeader;
  }

  @Watch("stockListCfg.options", { deep: true })
  onStockListCfgChange() {
    this.getSearch();
  }

  @Watch("stockDetailListCfg.options", { deep: true })
  onStockDetailListCfgChange() {
    if (this.id.inventoryCheckId != "") {
      const { page, itemsPerPage, sortBy, sortDesc } =
        this.stockDetailListCfg.options;

      this.id.page = page;
      this.id.size = itemsPerPage;
      this.id.sortBy = sortBy;
      this.id.sortDesc = sortDesc;
      this.stockDetailListCfg.loading = true;

      api.stock
        .getStockTakingDetailList(this.id)
        .then((response) => {
          console.log(response.data);
          this.stocktakingDetaillist = response.data.responseData;
          this.stockDetailListCfg.totalCount = response.data.totalCount;
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.stockDetailListCfg.loading = false;
        });
    }
  }

  mounted() {
    this.getSearch();
    this.onResize();
  }

  onResize() {
    this.table_height = window.innerHeight - 48 - 129 - 20 - 20 - 15;
  }

  created() {
    this.stockListCfg = Object.assign({}, gridCfg);
    this.stockDetailListCfg = Object.assign({}, gridCfg);
  }

  s_date_search(v: any) {
    this.search_stock.startDate = v;
    this.menu_start_date = false;
    let startEL: any = this.$refs.startDate;
    startEL.save(v);
  }
  e_date_search(v: any) {
    this.search_stock.endDate = v;
    this.menu_end_date = false;
    let endEL: any = this.$refs.endDate;
    endEL.save(v);
  }
  open_dialog() {
    this.stockDialog = true;
  }
  getSearch() {
    if (this.row != "") {
      this.search_stock.startDate = "";
      this.search_stock.endDate = "";

      this.search_stock.endDate = new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10);
      this.search_stock.startDate = "";

      const now = new Date();

      const day = now.getDate();
      const month = now.getMonth();
      const year = now.getFullYear();

      if (this.row == "week") {
        this.search_stock.startDate = new Date(new Date().setDate(day - 7))
          .toISOString()
          .substr(0, 10);
      }
      if (this.row == "month") {
        this.search_stock.startDate = new Date(new Date().setMonth(month - 1))
          .toISOString()
          .substr(0, 10);
      }
      if (this.row == "year") {
        this.search_stock.startDate = new Date(new Date().setFullYear(year - 1))
          .toISOString()
          .substr(0, 10);
      }
    } else if (this.row == "") {
      this.search_stock.startDate = "";
      this.search_stock.endDate = "";
    }
    const { page, itemsPerPage, sortBy, sortDesc } = this.stockListCfg.options;
    this.search_stock.page = page;
    this.search_stock.size = itemsPerPage;
    this.search_stock.sortBy = sortBy;
    this.search_stock.sortDesc = sortDesc;
    this.stockListCfg.loading = true;

    api.stock
      .getStockTakingList(this.search_stock)
      .then((response) => {
        this.stocktakinglist = response.data.responseData;
        this.stockListCfg.totalCount = response.data.totalCount;
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.stockListCfg.loading = false;
      });
  }
  selectedStock(item: any, row: any) {
    row.select(true);
    const { page, itemsPerPage, sortBy, sortDesc } =
      this.stockDetailListCfg.options;
    this.stockDetailListCfg.loading = true;
    this.lotTable = [];
    this.checkLotId = item.inventoryCheckId;

    this.id = {
      inventoryCheckId: item.inventoryCheckId,
      page: page,
      size: itemsPerPage,
      sortBy: sortBy,
      sortDesc: sortDesc,
    };
    api.stock
      .getStockTakingDetailList(this.id)
      .then((response) => {
        console.log(response.data);
        this.stocktakingDetaillist = response.data.responseData;
        this.stockDetailListCfg.totalCount = response.data.totalCount;
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.stockDetailListCfg.loading = false;
      });
  }
  getTypeColor(type: string) {
    if (type == "완제품") return "primary";
    else if (type == "원자재") return "green";
    else if (type == "반제품") return "green darken-3";
    else return "black";
  }
  closeModal() {
    this.stockDialog = false;
    this.getSearch();
  }
  cancelStart() {
    this.search_stock.startDate = "";
    //this.s_date_search();
  }
  cancelEnd() {
    this.search_stock.endDate = "";
    //this.e_date_search();
  }
}
</script>
<style src="./Stock.scss" lang="scss"></style>
