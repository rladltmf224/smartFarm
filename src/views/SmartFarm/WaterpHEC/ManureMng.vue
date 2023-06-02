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
                  label="코드"
                  v-model="search_condition.item"
                  @keydown.enter="getCustomer"
                  dense
                  solo
                  rounded
                  elevation-0
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field
                  label="품목명"
                  v-model="search_condition.name"
                  @keydown.enter="getCustomer"
                  dense
                  solo
                  rounded
                  elevation-0
                ></v-text-field>
              </v-col>

              <v-spacer></v-spacer>

              <v-col class="text-right" cols="2">
                <v-btn color="primary" @click="getCustomer" large elevation="0">
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
          <!--<v-pagination
            circle
            v-model="itemListCfg.page"
            :length="itemListCfg.pageCount"
          ></v-pagination>-->
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
  table_height: number = 0;
  manure_list: any[] = [];
  manure_headers: object[] = [];
  search_condition: any = {
    item: "",
    type: "",
  };
  manureDialog: boolean = false;

  created() {
    //this.itemListCfg = Object.assign({}, gridCfg);
    this.manure_headers = Object.assign([], cfg.header.manure_headers);
  }

  mounted() {
    this.onResize();
    this.getgetmanure();
  }

  @Watch("itemListCfg.options", { deep: true })
  onItemListChange() {}

  onResize() {
    this.table_height = window.innerHeight - 48 - 129 - 44 - 44 - 20;
    console.log("onResize", this.table_height);
  }

  openModal() {
    this.manureDialog = true;
  }
  closeModal() {
    this.manureDialog = false;
    this.getgetmanure();
  }
  getgetmanure() {
    api.smartfarm
      .getManureList()
      .then((response) => {
        this.manure_list = response.data.responseData;
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {});
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
                this.getgetmanure();
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
  getCustomer() {
    /*
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
          this.manure_list = response.data.responseData;
          
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.itemListCfg.loading = false;
        });
        */
  }
}
</script>

<!--<style src="../SmartFarm/SmartFarm.scss" lang="scss"></style>-->
openModal
