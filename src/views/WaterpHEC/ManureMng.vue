<template>
  <div>
    <v-container fluid v-resize="onResize">
      <v-row>
        <v-col class="ma-2" cols="12">
          <span class="searchbox-title">조회 조건</span>
          <v-card class="card-shadow pa-3" height="65">
            <v-row dense>
              <v-col cols="2">
                <v-text-field
                  label="품목명"
                  v-model="search_manure.name"
                  @keydown.enter="getManure"
                  dense
                  solo
                  rounded
                  elevation-0
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-menu
                  dense
                  ref="startDate"
                  v-model="menu_start_date"
                  :close-on-content-click="false"
                  :return-value.sync="search_manure.startDate"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      hide-details="true"
                      dense
                      v-model="search_manure.startDate"
                      solo
                      rounded
                      label="시작일"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="search_manure.startDate"
                    no-title
                    scrollable
                    locale="ko-KR"
                    :max="search_manure.endDate"
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="primary"
                      @click="menu_start_date = false"
                    >
                      취소
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="s_date_search(search_manure.startDate)"
                    >
                      확인
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="2">
                <v-menu
                  dense
                  ref="endDate"
                  v-model="menu_end_date"
                  :close-on-content-click="false"
                  :return-value.sync="search_manure.endDate"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      hide-details="true"
                      rounded
                      solo
                      dense
                      v-model="search_manure.endDate"
                      label="종료일"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="search_manure.endDate"
                    no-title
                    scrollable
                    locale="ko-KR"
                    :min="search_manure.startDate"
                  >
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menu_end_date = false">
                      취소
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="e_date_search(search_manure.endDate)"
                    >
                      확인
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-spacer></v-spacer>

              <v-col class="text-right" cols="2">
                <v-btn color="primary" @click="getManure" large elevation="0">
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
              <span class="searchbox-title">투입된 양액 목록</span>
            </v-col>
            <v-spacer></v-spacer>

            <v-col class="text-right" cols="3">
              <v-btn color="primary" elevation="0" @click="openModal"
                ><v-icon left> mdi-book-account </v-icon>양액 추가</v-btn
              >
            </v-col>
          </v-row>
          <v-card>
            <v-data-table
              :headers="manure_headers"
              :height="table_height"
              :items="manure_list"
              loading-text="서버에 요청중...."
              no-data-text="데이터가 없습니다."
              hide-default-footer
              class="elevation-1"
              fixed-header
              :options.sync="manureCfg.options"
              :server-items-length="manureCfg.totalCount"
              :items-per-page="manureCfg.itemsPerPage"
              :page.sync="manureCfg.page"
              @page-count="manureCfg.pageCount = $event"
              :loading="manureCfg.loading"
            >
              <template v-slot:item.cancel="{ item }">
                <v-btn
                  small
                  depressed
                  color="error"
                  elevation=""
                  @click="cancelData(item.id)"
                  v-show="item.status == 'USE'"
                >
                  취소요청
                </v-btn>
                <span v-show="item.status != 'USE'">사용취소</span>
              </template>
              <!--:headers="headers"
                :items="customer_list"
                fixed-header
                multi-sort
                @click:row="selectCustomer"
                :options.sync="itemListCfg.options"
                :server-items-length="itemListCfg.totalCount"
                :loading="itemListCfg.loading"
                :items-per-page="itemListCfg.itemsPerPage"
                :page.sync="itemListCfg.page"
                @page-count="itemListCfg.pageCount = $event"
                hide-default-footer-->
            </v-data-table>
          </v-card>
          <v-pagination
            circle
            v-model="manureCfg.page"
            :length="manureCfg.pageCount"
          ></v-pagination>
        </v-col>
      </v-row>
    </v-container>
    <ManureMngAddModal :open="manureDialog" @closeModal="closeModal">
    </ManureMngAddModal>
  </div>
</template>

<script lang="ts">
import * as api from "@/api";
import cfg from "./config";
import { gridCfg } from "@/util/config/";
import ManureMngAddModal from "./ManureMngAddModal.vue";
import { Vue, Component, Watch } from "vue-property-decorator";

@Component({
  components: {
    ManureMngAddModal,
  },
})
export default class Item extends Vue {
  menu_start_date: boolean = false;
  menu_end_date: boolean = false;
  table_height: number = 0;
  manure_list: any[] = [];
  manure_headers: object[] = [];
  search_manure: {
    //페이징처리

    name: "";
    page: any;
    size: any;
    sortBy: any;
    sortDesc: any;
    startDate: any;
    endDate: any;
  } = {
    name: "",
    page: 1,
    size: 0,
    sortBy: [],
    sortDesc: [true, false],
    startDate: "",
    endDate: "",
  };
  manureDialog: boolean = false;
  manureCfg: any = {}; //페이징변수

  created() {
    this.manureCfg = Object.assign({}, gridCfg);
    this.manure_headers = Object.assign([], cfg.header.manure_headers);
  }

  mounted() {
    this.onResize();
  }

  @Watch("manureCfg.options", { deep: true })
  manureChange() {
    this.getManure();
  }

  onResize() {
    this.table_height = window.innerHeight - 48 - 129 - 44 - 44 - 20;
    console.log("onResize", this.table_height);
  }
  s_date_search(v: any) {
    this.search_manure.startDate = v;
    this.menu_start_date = false;
    let startEL: any = this.$refs.startDate;
    startEL.save(v);
  }

  e_date_search(v: any) {
    this.search_manure.endDate = v;
    this.menu_end_date = false;
    let endEL: any = this.$refs.endDate;
    endEL.save(v);
  }

  openModal() {
    this.manureDialog = true;
  }
  closeModal() {
    this.manureDialog = false;
    this.getManure();
  }
  getManure() {
    const { page, itemsPerPage, sortBy, sortDesc } = this.manureCfg.options;
    this.search_manure.page = page;
    this.search_manure.size = itemsPerPage;
    this.search_manure.sortBy = sortBy;
    this.search_manure.sortDesc = sortDesc;

    api.smartfarm
      .getManureList(this.search_manure)
      .then((response) => {
        this.manure_list = response.data.responseData;
        this.manureCfg.totalCount = response.data.totalCount;
        this.manureCfg.loading = false;
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.manureCfg.loading = false;
      });
  }
  cancelData(item: any) {
    let data = {
      id: item,
    };

    this.$swal
      .fire({
        title: "사용취소",
        text: "해당 데이터를 사용취소 하시겠습니까?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "삭제",
      })

      .then((result) => {
        if (result.isConfirmed) {
          api.smartfarm
            .deleteManure(data)
            .then((response) => {
              if (response.status == 200) {
                this.$swal({
                  title: "취소되었습니다",
                  icon: "success",
                  position: "top",
                  showCancelButton: false,
                  showConfirmButton: false,
                  toast: true,
                  timer: 1500,
                });
                this.getManure();
              } else {
                this.$swal({
                  title: "취소에 실패되었습니다.",
                  icon: "error",
                  position: "top",
                  showCancelButton: false,
                  showConfirmButton: false,
                  toast: true,
                  timer: 1500,
                });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });
  }
}
</script>
