<template>
  <div>
    <v-container fluid>
      <v-row>
        <v-col class="ma-2" md="12">
          <h4 class="searchbox-title">조회 조건</h4>
          <v-sheet class="pa-3" color="#F6F8F9" height="90" elevation="2">
            <v-row>
              <v-col cols="2">
                <v-text-field
                  v-model="search_bom.item"
                  @keydown.enter="getBom"
                  label="품목코드 or품목명"
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field
                  v-model="search_bom.itemVersion"
                  @keydown.enter="getBom"
                  label="완제품 버전"
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field
                  v-model="search_bom.option"
                  @keydown.enter="getBom"
                  label="완제품 규격 or 단위"
                ></v-text-field>
              </v-col>
              <v-col class="pt-5 text-right" offset="4" cols="2">
                <v-btn color="primary" x-large @click="getBom">
                  <v-icon left> mdi-magnify </v-icon>
                  조회
                </v-btn>
              </v-col>
            </v-row>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
    <v-container fluid>
      <v-row>
        <v-col class="ma-2" md="12">
          <v-row class="mb-2">
            <v-col md="2">
              <h4 class="searchbox-title">BOM 목록</h4>
            </v-col>
            <v-col class="text-right" offset-md="3" md="7">
              <v-btn
                small
                class="mr-3"
                fluid
                color="primary"
                @click="reverseItem"
              >
                역 전 개
              </v-btn>
              <v-btn small class="mr-3" fluid color="primary" @click="frontBom">
                정 전 개
              </v-btn>
              <v-btn fluid small color="primary" @click="deleteBom">
                선 택 삭 제
              </v-btn>
              <v-btn
                fluid
                small
                class="ml-3 mr-1"
                color="primary"
                @click="saveBom"
              >
                신 규 등 록
              </v-btn>
            </v-col>
          </v-row>
          <v-dialog width="1200px" v-model="interimStorage" persistent>
            <v-card height="620px">
              <v-card-title class="reverseRow">
                <span
                  class="text-h5 dialog-title font-weight-bold mb-15"
                  v-show="dialog"
                  >역전개</span
                >
                <span
                  class="text-h5 dialog-title font-weight-bold mb-15"
                  v-show="!dialog"
                  >정전개</span
                >
              </v-card-title>
              <v-data-table
                multi-sort
                fixed-header
                v-show="dialog"
                class="ml-2 mr-2 elevation-4"
                height="500"
                :headers="reverseItemHeader"
                :items="reverseTable"
                dense
                disable-pagination
                hide-default-footer
              >
                <template v-slot:no-data>
                  <h5>데이터가 없습니다.</h5>
                </template>
              </v-data-table>
              <v-data-table
                multi-sort
                fixed-header
                v-show="!dialog"
                class="ml-2 mr-2 elevation-4"
                height="500"
                :headers="frontBomHeader"
                :items="frontTable"
                disable-pagination
                hide-default-footer
                dense
              >
                <template v-slot:[`item.details`]="{ item }">
                  <td class="detailTable">
                    <v-data-table
                      multi-sort
                      fixed-header
                      :headers="frontBomItemHeader"
                      :items="item.details"
                      dense
                      disable-pagination
                      hide-default-header
                      hide-default-footer
                    >
                    </v-data-table>
                  </td>
                </template>

                <template v-slot:no-data>
                  <h5>데이터가 없습니다.</h5>
                </template>
              </v-data-table>
              <v-btn
                small
                class="closeBtn float-right mr-2 mt-3"
                color="primary"
                text
                @click="interimStorage = false"
              >
                닫기
              </v-btn>
            </v-card>
          </v-dialog>
          <v-data-table
            multi-sort
            fixed-header
            class="elevation-4"
            show-select
            item-key="itemId"
            height="650"
            v-model="bomSelected"
            :headers="totalBomHeader"
            :items="totalBomTable"
            return-object
            dense
            :options.sync="bomListCfg.options"
            :server-items-length="bomListCfg.totalCount"
            :loading="bomListCfg.loading"
            :items-per-page="bomListCfg.itemsPerPage"
            :page.sync="bomListCfg.page"
            @page-count="bomListCfg.pageCount = $event"
            @click:row="(item, slot) => slot.expand(!slot.isExpanded)"
            @dblclick:row="dblclickRow"
            hide-default-footer
          >
            <template #expanded-item="{ headers, item }">
              <td class="bomTreeTable" :colspan="headers.length">
                <v-data-table
                  multi-sort
                  class="second-tableBorder"
                  v-model="selectedChild"
                  :headers="headersChild"
                  :items="item.details"
                  dense
                  @click:row="selectedItemData"
                  @dblclick:row="dblclickRow"
                  single-select
                  return-object
                  elevation="0"
                  disable-pagination
                  hide-default-footer
                >
                  <template v-slot:item.type="{ item }">
                    <v-btn
                      class="center mt-1 mb-1 childBtn"
                      small
                      :color="getTypeColor(item.type)"
                      dark
                      style="width: 100px"
                      depressed
                    >
                      {{ item.type }}
                    </v-btn>
                  </template>
                </v-data-table>
              </td>
            </template>

            <template v-slot:item.type="{ item }">
              <v-btn
                class="center mt-1 mb-1"
                small
                :color="getTypeColor(item.type)"
                dark
                style="width: 100px"
                depressed
              >
                {{ item.type }}
              </v-btn>
            </template>

            <template v-slot:item.edit="{ item }">
              <v-icon small @click="updateBom(item)"> mdi-pencil </v-icon>
            </template>

            <template v-slot:no-data>
              <h5>데이터가 없습니다.</h5>
            </template>
          </v-data-table>
          <v-pagination
            v-model="bomListCfg.page"
            :length="bomListCfg.pageCount"
          ></v-pagination>
        </v-col>
      </v-row>
    </v-container>
    <!--BOM등록 Modal-->
    <bom-modal
      :open="bomDialog"
      :change="change"
      :stepData="step"
      :editedBomData="editedBom"
      @closeModal="closeModal"
    >
    </bom-modal>
  </div>
</template>
<script lang="ts">
import * as api from "@/api";
import cfg from "./config";
import { gridCfg } from "@/util/config/";
import BomModal from "@/views/Bom/BomModal.vue";
import { Vue, Component, Watch } from "vue-property-decorator";

@Component({
  components: {
    BomModal,
  },
})
export default class Bom extends Vue {
  bomDialog: boolean = false;
  search_bom: {
    item: string;
    itemVersion: string;
    page: any;
    size: any;
    sortBy: any;
    sortDesc: any;
  } = {
    item: "",
    itemVersion: "",
    page: 1,
    size: 0,
    sortBy: [],
    sortDesc: [true, false],
  };
  editedBom: { item: any; details: any } = {
    item: [],
    details: [],
  };
  bomSelected: [{ itemId: any }] | [];
  bomlist: [] = [];
  item: { itemId?: any } = {};
  bom: object = {};
  bomListCfg: any = {};
  product: object = {};
  totalItem: [] = [];
  totalData: [] = [];
  reverseItemData: [] = [];
  frontBomData: any[] = [];
  row: any = "";
  interimStorage: boolean = false;
  dialog: boolean = false;
  change: boolean = false;
  selectedChild: [{ itemId: any }] | [];
  step: number = 1;

  get totalBomTable() {
    return this.bomlist;
  }
  get reverseTable() {
    return this.reverseItemData;
  }
  get frontTable() {
    return this.frontBomData;
  }
  get headersChild() {
    return cfg.header.headersChild;
  }
  get totalBomHeader() {
    return cfg.header.totalBomHeader;
  }
  get reverseItemHeader() {
    return cfg.header.reverseItemHeader;
  }
  get frontBomHeader() {
    return cfg.header.frontBomHeader;
  }
  get frontBomItemHeader() {
    return cfg.header.frontBomItemHeader;
  }

  @Watch("bomSelected")
  onBomSelectChange() {
    if (this.bomSelected.length !== 0) {
      this.change = true;
    } else {
      this.change = false;
    }
  }

  @Watch("bomListCfg.options", { deep: true })
  onBomListCfgChange() {
    this.getBom();
  }

  mounted() {
    this.getBom();
  }

  created() {
    this.bomListCfg = Object.assign({}, gridCfg);
  }

  saveBom() {
    this.change = false;
    this.bomDialog = true;
    this.step = 1;
  }
  updateBom(item: { item: any; details: any }) {
    this.change = true;
    this.bomDialog = true;
    this.step = 2;
    this.editedBom = Object.assign({}, item);
    this.editedBom.item = item;
    this.editedBom.details = item.details;
  }
  deleteBom() {
    this.item = { itemId: [] };

    if (this.bomSelected.length == 0) {
      return this.$swal({
        title: "삭제 할 BOM을 선택해주세요.",
        icon: "error",
        position: "top",
        showCancelButton: false,
        showConfirmButton: false,
        toast: true,
        timer: 1500,
      });
    } else {
      for (var k = 0; k < this.bomSelected.length; k++) {
        this.item.itemId.push(this.bomSelected[k].itemId);
      }

      this.$swal
        .fire({
          title: "삭제",
          text: "해당 데이터를 삭제하시겠습니까?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "삭제",
        })
        .then((result) => {
          if (result.isConfirmed) {
            api.bom
              .deleteBomList(this.item)
              .then((response) => {
                if (response.status == 200) {
                  this.$swal({
                    title: "삭제되었습니다.",
                    icon: "success",
                    position: "top",
                    showCancelButton: false,
                    showConfirmButton: false,
                    toast: true,
                    timer: 1500,
                  });

                  this.getBom();
                } else {
                  this.$swal({
                    title: "삭제가 실패되었습니다.",
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
  getBom() {
    const { page, itemsPerPage, sortBy, sortDesc } = this.bomListCfg.options;
    this.search_bom.page = page;
    this.search_bom.size = itemsPerPage;
    this.search_bom.sortBy = sortBy;
    this.search_bom.sortDesc = sortDesc;

    this.bomListCfg.loading = true;

    api.bom
      .getBomPage(this.search_bom)
      .then((response) => {
        this.bomlist = response.data.responseData;
        this.bomListCfg.totalCount = response.data.totalCount;
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.bomListCfg.loading = false;
      });
  }
  selectedItemData(item: object, row: any) {
    row.select(true);
  }
  click(item: object, row: any) {
    row.select(true);
  }
  dblclickRow(item: object, row: any) {
    row.select(false);
  }
  reverseItem() {
    this.dialog = true;
    this.item = {};

    if (this.selectedChild.length == 0) {
      return this.$swal({
        title: "원자재를 선택해주세요",
        icon: "info",
        position: "top",
        showCancelButton: false,
        showConfirmButton: false,
        toast: true,
        timer: 1500,
      });
    }

    this.interimStorage = true;
    this.item["itemId"] = this.selectedChild[0].itemId;
    api.bom
      .getItemHistoryList(this.item)
      .then((response) => {
        this.reverseItemData = response.data.responseData;
      })
      .catch((error) => {
        console.log(error);
      });
  }
  frontBom() {
    this.dialog = false;
    this.item = {};
    this.frontBomData = [];

    if (this.bomSelected.length == 0) {
      return this.$swal({
        title: "BOM을 선택해주세요",
        icon: "info",
        position: "top",
        showCancelButton: false,
        showConfirmButton: false,
        toast: true,
        timer: 1500,
      });
    }

    if (this.bomSelected.length > 1) {
      return this.$swal({
        title: "한개만 선택해주세요",
        icon: "info",
        position: "top",
        showCancelButton: false,
        showConfirmButton: false,
        toast: true,
        timer: 1500,
      });
    }

    if (this.bomSelected.length == 1) {
      this.interimStorage = true;
      this.item["itemId"] = this.bomSelected[0].itemId;
      api.bom
        .getBomHistoryList(this.item)
        .then((response: any) => {
          let resData: any = response;
          //resData = resData.data.responseData;
          this.frontBomData.push(resData.data.responseData);
          console.log(this.frontBomData);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
  closeModal() {
    this.step = 0;
    this.bomDialog = false;
    this.getBom();
  }
  getTypeColor(type: string) {
    if (type == "완제품") return "primary";
    else if (type == "원자재") return "green";
    else if (type == "반제품") return "green darken-3";
    else return "black";
  }
}
</script>
<style src="./Bom.scss" lang="scss"></style>
