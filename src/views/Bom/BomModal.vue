<template>
  <div>
    <v-dialog width="1200px" v-model="openModal" persistent>
      <v-card>
        <v-card-title>
          <span v-show="!change">BOM 등록</span>
          <span v-show="change">BOM 수정</span>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="closeModal"> 닫기 </v-btn>
        </v-card-title>
        <v-card-text>
          <v-stepper v-model="step" vertical>
            <v-stepper-step :complete="step > 1" step="1">
              1. 완제품 선택
            </v-stepper-step>

            <v-stepper-content step="1">
              <v-card v-show="!change" elevation="0">
                <v-row dense>
                  <v-col cols="4">
                    <v-text-field label="품목코드 or 품목명" @keydown.enter="getProduct" v-model="searchProduct" dense solo
                      rounded elevation-0 hide-details="false"></v-text-field>
                  </v-col>
                  <v-col cols="1" align-self="center">
                    <v-btn color="primary" @click="getProduct"> 조회 </v-btn>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="12">
                    <v-card elevation="0">
                      <v-data-table multi-sort fixed-header :options.sync="bomItemListCfg.options"
                        :server-items-length="bomItemListCfg.totalCount" :loading="bomItemListCfg.loading"
                        loading-text="서버에 요청중...." no-data-text="데이터가 없습니다." :items-per-page="bomItemListCfg.itemsPerPage"
                        :page.sync="bomItemListCfg.page" @page-count="bomItemListCfg.pageCount = $event"
                        class="elevation-3 overflow-scroll" height="400" v-model="bomData.item" :headers="bomHeader"
                        :items="bomTable" item-key="id" return-object single-select dense hide-default-footer
                        @click:row="click" @dblclick:row="dblclickRow">
                      </v-data-table>
                      <v-pagination circle v-model="bomItemListCfg.page"
                        :length="bomItemListCfg.pageCount"></v-pagination>
                    </v-card>
                  </v-col>
                </v-row>
                <v-row dense class="pa-1 justify-center">
                  <v-btn v-show="!change" color="primary" @click="next" :disabled="bomData.item.length == 0">
                    다음
                  </v-btn>
                </v-row>
              </v-card>
            </v-stepper-content>

            <v-stepper-step :complete="step > 2" step="2">
              2. 원자재 선택
            </v-stepper-step>

            <v-stepper-content step="2">
              <v-card>
                <v-row>
                  <v-col>
                    <h4>1. 원자재 목록</h4>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="2">
                    <v-select label="검색" dense v-model="searchItemkeyword" :items="searchItemType" item-text="text"
                      return-object solo rounded elevation-0 hide-details="false"></v-select>
                  </v-col>
                  <v-col cols="2">
                    <v-autocomplete v-show="itemKeyword == 'customerName'" dense v-model="searchItemCustmerText"
                      @change="getItem" :items="custmerlist" item-text="name" return-object solo rounded elevation-0
                      hide-details="false"></v-autocomplete>
                    <v-select v-show="itemKeyword == 'itemtype'" dense v-model="searchTypekeyword" @change="getItem"
                      :items="itemTypelist" return-object solo rounded elevation-0 hide-details="false"></v-select>
                    <v-text-field dense v-show="itemKeyword != 'customerName' &&
                      itemKeyword != 'itemtype'
                      " v-model="searchItemText" solo rounded elevation-0 @keydown.enter="getItem"
                      hide-details="false"></v-text-field>
                  </v-col>
                  <v-col cols="2">
                    <v-btn color="primary" @click="getItem"> 조회 </v-btn>
                  </v-col>
                  <v-col cols="12">
                    <v-data-table multi-sort fixed-header v-model="plusSelected" show-select height="185"
                      class="overflow-scroll elevation-3" :headers="itemHeader" :items="itemTable" item-key="itemPriceId"
                      return-object :items-per-page="50" :footer-props="footer_option" dense @click:row="selectedItemData"
                      @dblclick:row="dblclickRow" hide-default-footer>
                    </v-data-table>
                  </v-col>
                </v-row>

                <v-row dense class="d-flex justify-center">
                  <v-col cols="1">
                    <v-btn small fluid color="deep-orange" @click="minus">
                      <v-icon>mdi-arrow-up-bold-outline</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col cols="1">
                    <v-btn small fluid color="deep-orange" @click="plus">
                      <v-icon>mdi-arrow-down-bold-outline</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="12">
                    <h4 class="searchbox-title ml-5">2. 원자재 등록</h4>
                  </v-col>
                  <v-col cols="12">
                    <v-data-table multi-sort fixed-header v-model="bomData.details" item-key="id" height="185"
                      class="overflow-scroll elevation-4" :headers="itemDetailHeader" :items="itemDetailTable"
                      return-object :items-per-page="50" :footer-props="footer_option" show-select dense
                      hide-default-footer>
                      <template v-slot:item.count="props">
                        <v-text-field class="pa-0 countFont"
                          oninput="javascript: this.value = this.value.replace(/[^0-9]/g, '');" placeholder="* 수량 필수"
                          v-model="props.item.count" single-line>
                          {{ props.item.count }}
                        </v-text-field>
                      </template>
                    </v-data-table>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex justify-center" cols="12">
                    <v-btn v-show="!change" class="align-center" color="green " @click="back">
                      이전 단계
                    </v-btn>
                    <v-btn v-show="!change" class="align-center mx-4" color="primary" :disabled="totalItem.length == 0"
                      @click="complete">
                      등 록
                    </v-btn>
                    <v-btn v-show="change" class="align-center" color="primary" @click="update"
                      :disabled="totalItem.length == 0">
                      수 정
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card>
            </v-stepper-content>
          </v-stepper>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts">
import * as api from "@/api";
import cfg from "./config";
import { gridCfg } from "@/util/config/";
import _ from "lodash";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

@Component
export default class BomModal extends Vue {
  footer_option: object = {
    //기본 페이징처리
    disableItemsPerPage: false,
    itemsPerPageAllText: "ALL",
    itemsPerPageOptions: [10, 20, 50, -1],
  };
  bomItemListCfg: any = {}; //페이징처리
  custmerlist: [] = []; //[response] 거래처 데이터
  itemKeyword: any = "";
  plusSelected: [] = []; //원자재테이블 v-model
  itemlist: [] = []; //[response] 조회된 전체 원자재 데이터
  productlist: [] = []; //[response] 조회된 전체 완제품 데이터
  searchItemkeyword: any = ""; //원자재조회조건 v-model
  searchTypekeyword: any = ""; //원자재조회조건 - 자재타입
  searchItemText: string = ""; //원자재조회조건-검색어
  searchItemCustmerText: any = ""; //원자재조회조건- 거래처
  searchProduct: string = ""; //완제품조회조건 v-model
  totalItem: any[] = []; //plus된 원자재테이블 v-model
  step: number = 1; //step단계
  bomData: { item: any; details: any } = {
    //원자재테이블 v-model
    item: [],
    details: [],
  };

  /*한번 더 체크하고 삭제할 변수
  totalData: any;
  keyword: string = "";
  product: any;
  item: any;
  
  type bomOpt = {
    options?: any;
    page: any;
    itemsPerPage: any;
    sortBy?: any;
    sortDesc?: any;
    loading: boolean;
    totalCount: number;
  };
  */

  @Prop({ required: true }) open: boolean;
  @Prop({ required: true }) change: boolean;
  @Prop({ required: true }) stepData: number;
  @Prop({
    required: true,
    default: {
      item: [], //수정 할 완제품ID
      details: [], //추가한 품목 목록
    },
  })
  editedBomData: any;

  @Watch("open")
  onGetProduct() {
    this.getProduct();
  }

  @Watch("bomItemListCfg.options", { deep: true })
  onBomItemListCfgChange() {
    this.getProduct();
  }

  @Watch("stepData")
  onStepDataChange() {
    this.step = this.stepData;
    if (this.stepData == 2) {
      this.getItem();
      this.getCustomer();
    }
  }

  @Watch("searchItemkeyword")
  onSearchItemkeyWordChange() {
    if (this.searchItemkeyword != null) {
      this.itemKeyword = this.searchItemkeyword.value;
    }
  }

  @Watch("editedBomData")
  onEditedBomData() {
    var resultId = _.get(this.editedBomData.item, "itemId");
    var resultDetails = _.get(this.editedBomData.item, "details");

    this.bomData["item"] = [resultId];
    this.bomData["details"] = resultDetails;
    this.totalItem = this.bomData["details"];
  }

  mounted() {
    this.getProduct();
  }
  created() {
    this.bomItemListCfg = Object.assign({}, gridCfg);
  }

  getItem() {
    let data: any = {};

    if (this.searchItemkeyword != null) {
      if (this.searchItemText != null) {
        data["item"] = this.searchItemText;
      }
    }

    if (this.itemKeyword === "customerName") {
      if (this.searchItemCustmerText != null) {
        data["item"] = "";
        data["type"] = "";
        data["customer"] = this.searchItemCustmerText.name;
      }
    }

    if (this.itemKeyword == "itemtype") {
      if (this.searchTypekeyword != null) {
        data["item"] = "";
        data["customer"] = "";
        data["type"] = this.searchTypekeyword.value;
      }
    }

    api.bom
      .getBomItemPage(data)
      .then((response) => {
        this.itemlist = response.data.responseData;
      })
      .catch((error) => {
        console.log(error);
      });
  }
  getCustomer() {
    api.bom
      .getBomCustomer()
      .then((response) => {
        this.custmerlist = response.data.responseData;
      })
      .catch((error) => {
        console.log(error);
      });
  }
  getProduct() {
    const { page, itemsPerPage, sortBy, sortDesc } =
      this.bomItemListCfg.options;

    let data: any = {
      bomCheck: false,
      page: page,
      size: itemsPerPage,
      sortBy: sortBy,
      sortDesc: sortDesc,
    };

    if (this.searchProduct != "") {
      data = {
        bomCheck: false,
        item: this.searchProduct,
        page: page,
        size: itemsPerPage,
        sortBy: sortBy,
        sortDesc: sortDesc,
      };
    }
    this.bomItemListCfg.loading = true;
    api.bom
      .getProductList(data)
      .then((response) => {
        this.productlist = response.data.responseData;
        this.bomItemListCfg.totalCount = response.data.totalCount;
        this.bomItemListCfg.loading = false;
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.bomItemListCfg.loading = false;
      });
  }
  selectedItemData(item: any, row: any) {
    row.select(true);
  }

  click(item: any, row: any) {
    row.select(true);
  }
  dblclickRow(item: any, row: any) {
    row.select(false);
  }
  plus() {
    if (this.plusSelected.length == 0) {
      this.$swal({
        title: "원자재가 선택되지 않았습니다.",
        icon: "warning",
        position: "top",
        showCancelButton: false,
        showConfirmButton: false,
        toast: true,
        timer: 1500,
      });
    } else {
      if (this.plusSelected.length != 0) {
        let totalID = _.map(this.totalItem, "itemId");
        for (var i = 0; i < this.plusSelected.length; i++) {
          let plusItem: any = this.plusSelected[i];
          if (totalID.includes(plusItem.id)) continue;
          plusItem["itemId"] = plusItem["id"];
          plusItem["count"] = null;
          this.totalItem.push(plusItem);
          totalID.push(plusItem.id);
        }

        this.plusSelected = [];
      }
    }
  }
  minus() {
    if (this.bomData.details.length == 0) {
      this.$swal({
        title: "취소시킬 원자재가 선택되지 않았습니다.",
        icon: "warning",
        position: "top",
        showCancelButton: false,
        showConfirmButton: false,
        toast: true,
        timer: 1500,
      });
    } else {
      if (this.bomData.details.length != 0) {
        let removeID: any = [];
        this.bomData.details.forEach((value: any) => {
          removeID.push(value.id);
        });
        this.totalItem = _.reject(this.totalItem, function (o) {
          return removeID.includes(o.id);
        });
        this.bomData.details = [];
      }
    }
  }
  complete() {
    let totalData = [];

    if (this.bomData.item.length != 0 && this.totalItem.length != 0) {
      let check = true;

      for (var i = 0; i < this.totalItem.length; i++) {
        if (this.totalItem[i].count == null || this.totalItem[i].count == "") {
          check = false;
          this.$swal({
            title: "입력된 수량이 없는 원자재는 등록되지않습니다.",
            icon: "error",
            position: "top",
            showCancelButton: false,
            showConfirmButton: false,
            toast: true,
            timer: 1500,
          });
        } else {
          totalData.push({
            childId: this.totalItem[i].id,
            count: this.totalItem[i].count,
          });
        }
      }
      if (check) {
        let data = {
          itemId: this.bomData.item[0].id,
          details: totalData,
        };

        this.$swal
          .fire({
            title: "등록",
            text: "해당 데이터를 등록하시겠습니까?",
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "등록",
          })
          .then((result) => {
            if (result.isConfirmed) {
              api.bom
                .createBomList(data)
                .then((response) => {
                  if (response.status == 200) {
                    this.$swal({
                      title: "등록되었습니다.",
                      icon: "success",
                      position: "top",
                      showCancelButton: false,
                      showConfirmButton: false,
                      toast: true,
                      timer: 1500,
                    });
                    this.step = 1;
                    this.bomData.item = [];
                    this.plusSelected = [];
                    this.totalItem = [];
                    this.searchProduct = "";
                    this.searchItemkeyword = "";
                    this.searchItemCustmerText = "";
                    this.searchItemText = "";
                    this.openModal = false;
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
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          });
      }
    }
  }

  update() {
    let totalData = [];
    let check = true;
    for (var i = 0; i < this.totalItem.length; i++) {
      if (this.totalItem[i].count == null || this.totalItem[i].count == "") {
        check = false;
        this.$swal({
          title: "입력된 수량이 없는 원자재는 등록되지않습니다.",
          icon: "error",
          position: "top",
          showCancelButton: false,
          showConfirmButton: false,
          toast: true,
          timer: 1500,
        });
      } else {
        totalData.push({
          childId: this.totalItem[i].itemId,
          count: this.totalItem[i].count,
        });
      }
    }

    if (check) {
      let data = {
        details: totalData,
        itemId: this.bomData.item[0],
      };

      this.$swal
        .fire({
          title: "수정",
          text: "해당 데이터를 수정하시겠습니까?",
          icon: "info",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "수정",
        })
        .then((result) => {
          if (result.isConfirmed) {
            api.bom
              .updateBomList(data)
              .then((response: any) => {
                this.$swal({
                  title: "수정되었습니다.",
                  icon: "success",
                  position: "top",
                  showCancelButton: false,
                  showConfirmButton: false,
                  toast: true,
                  timer: 1500,
                });
                this.step = 1;
                this.bomData.item = [];
                this.plusSelected = [];
                this.totalItem = [];
                this.openModal = false;
              })
              .catch((error: any) => {
                this.$swal({
                  title: "수정 실패되었습니다.",
                  icon: "error",
                  position: "top",
                  showCancelButton: false,
                  showConfirmButton: false,
                  toast: true,
                  timer: 1500,
                });
              });
          }
        });
    }
  }
  back() {
    this.step = 1;
    this.plusSelected = [];
    this.totalItem = [];
    this.searchProduct = "";
    this.searchItemkeyword = "";
    this.searchItemCustmerText = "";
    this.searchItemText = "";
    this.getProduct();
  }
  next() {
    this.step = 2;
    this.getItem();
    this.getCustomer();
  }

  closeModal() {
    this.step = 1;
    this.bomData.item = [];
    this.plusSelected = [];
    this.totalItem = [];
    this.searchProduct = "";
    this.searchItemkeyword = "";
    this.searchItemCustmerText = "";
    this.searchItemText = "";
    this.openModal = false;
  }

  get openModal() {
    return this.open;
  }
  set openModal(val: any) {
    this.$emit("closeModal", false);
  }

  get bomTable() {
    return this.productlist;
  }

  get itemTable() {
    return this.itemlist;
  }

  get itemDetailTable() {
    return this.totalItem;
  }

  get bomHeader() {
    return cfg.header.bomHeader;
  }

  get itemHeader() {
    return cfg.header.itemHeader;
  }

  get itemDetailHeader() {
    return cfg.header.itemDetailHeader;
  }

  get searchItemType() {
    return cfg.header.searchItemType;
  }

  get itemTypelist() {
    return cfg.header.itemTypelist;
  }
}
</script>

<style src="./Bom.scss" lang="scss"></style>
