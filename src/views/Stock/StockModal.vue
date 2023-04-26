<template>
  <div>
    <v-dialog v-model="openModal" max-width="1400px" height="900">
      <v-card>
        <v-card-title>
          <span> 재 고 현 황 </span>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-col cols="12">
          <v-row>
            <v-col cols="10">
              <v-text-field
                v-model="memo"
                label="비고"
                dense
                solo
                hide-details="false"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-btn color="primary" @click="getExcel">
                전 체 엑 셀 다 운
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
        <v-data-table
          fixed-header
          dense
          multi-sort
          :items="stockTable"
          :headers="stockHeader"
          class="overflow-scroll elevation-4 ml-2 mr-2"
          height="500"
          return-object
          :items-per-page="50"
          loading-text="서버에 요청중...."
          no-data-text="데이터가 없습니다."
          :footer-props="footer_option"
        >
          <template v-slot:item.currentCount="props">
            <v-text-field
              class="pa-0 countFont"
              oninput="javascript: this.value = this.value.replace(/[^0-9]/g, '');"
              placeholder="* 수량 필수"
              v-model="props.item.currentCount"
              single-line
            >
              {{ props.item.currentCount }}
            </v-text-field>
          </template>
          <template v-slot:item.storageName="{ item }">
            {{ item.storageName }} &nbsp;
            <v-btn
              text
              x-small
              fluid
              color="primary"
              class="editBtn"
              @click="edit_changeStorage(item)"
            >
              <v-icon x-small> mdi-pencil </v-icon>
            </v-btn>
          </template>
        </v-data-table>

        <v-dialog v-model="edit_storage" max-width="700px">
          <v-card>
            <v-card-title>
              <span> 창고 변경 </span>
              <v-spacer></v-spacer>
            </v-card-title>
            <v-card-text>
              <v-col cols="12">
                <v-row>
                  <v-col cols="5">
                    <span>기존 창고</span>
                    <v-text-field
                      v-model="original_storageName"
                      label="기존 창고"
                      :disabled="original_storageName != ''"
                      dense
                      solo
                      hide-details="false"
                      class="text-box-style"
                    ></v-text-field>
                    <span>기존 구역</span>
                    <v-text-field
                      v-model="original_locationName"
                      label="기존 구역"
                      :disabled="original_locationName != ''"
                      dense
                      solo
                      hide-details="false"
                      class="text-box-style"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="2" align-self="center">
                    <v-icon large class="ml-5" color="primary">
                      mdi-swap-horizontal-bold
                    </v-icon>
                  </v-col>
                  <v-col cols="5">
                    <span>변경 할 창고</span>
                    <v-autocomplete
                      v-model="update_storageName"
                      return-object
                      item-text="storageName"
                      item-value="storageId"
                      :items="storage_list"
                      label="변경 할 창고"
                      @change="getLocation"
                      dense
                      solo
                      hide-details="false"
                      class="text-box-style"
                    ></v-autocomplete>
                    <span>변경 할 구역</span>
                    <v-autocomplete
                      v-model="update_locationeName"
                      return-object
                      item-text="area"
                      item-value="storageLocationId"
                      :items="location_list"
                      label="변경 할 구역"
                      dense
                      solo
                      hide-details="false"
                      class="text-box-style"
                    ></v-autocomplete>
                  </v-col>
                </v-row>
              </v-col>
            </v-card-text>
            <v-card-actions>
              <v-col class="text-right">
                <v-btn color="success" text @click="clickSaveStorage">
                  적용
                </v-btn>
                <v-btn color="primary" text @click="edit_storage = false">
                  취소
                </v-btn>
              </v-col>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-card-actions>
          <v-col class="text-right">
            <v-btn color="success" text @click="complete"> 등록 </v-btn>
            <v-btn color="primary" text @click="openModal = false">
              닫기
            </v-btn>
          </v-col>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts">
import * as api from "@/api";
import cfg from "./config";
import * as XLSX from "xlsx";
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class StockModal extends Vue {
  memo: string = "";
  footer_option: {
    disableItemsPerPage: boolean;
    itemsPerPageAllText: string;
    itemsPerPageOptions: number[];
  } = {
    disableItemsPerPage: false,
    itemsPerPageAllText: "ALL",
    itemsPerPageOptions: [10, 20, 50, -1],
  };
  edit_storage: boolean = false;
  original_storageName: string = "";
  original_locationName: string = "";
  update_storageName: any = "";
  update_locationeName: string = "";
  storage_list: any[] = [];
  location_list: any[] = [];
  stocklist: any[] = [];
  productsList: any[] = [];
  rawMaterialsList: any[] = [];
  halfProductsList: any[] = [];

  @Prop({ required: true }) open: boolean;

  get openModal() {
    this.getStock();
    return this.open;
  }

  set openModal(val: any) {
    this.$emit("closeModal", false);
  }

  get stockHeader() {
    return cfg.header.stockHeader;
  }

  get stockTable() {
    return this.stocklist;
  }

  getStock() {
    this.memo = "";
    this.stocklist = [];
    this.productsList = [];
    this.rawMaterialsList = [];
    this.halfProductsList = [];

    api.stock
      .getStockList()
      .then((response) => {
        for (var i = 0; i < response.data.responseData.length; i++) {
          if (response.data.responseData[i].itemType == "완제품") {
            this.productsList.push(response.data.responseData[i]);
          }

          if (response.data.responseData[i].itemType == "원자재") {
            this.rawMaterialsList.push(response.data.responseData[i]);
          }

          if (response.data.responseData[i].itemType == "반제품") {
            this.halfProductsList.push(response.data.responseData[i]);
          }
        }
        this.stocklist = this.stocklist.concat(
          this.productsList,
          this.rawMaterialsList,
          this.halfProductsList
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getExcel() {
    let name = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10);

    function renameKey(obj: any, oldKey: any, newKey: any) {
      obj[newKey] = obj[oldKey];
      delete obj[oldKey];
    }

    function DeleteKey(obj: any, oldKey: any) {
      delete obj[oldKey];
    }

    const arr = this.stocklist;

    //한글버전으로 수정
    const serverColumn = [
      "itemType",
      "itemLot",
      "itemCode",
      "itemName",
      "itemVersion",
      "itemStandard",
      "itemUnit",
      "storageName",
      "area",
      "count",
    ];
    const renameColumn = [
      "타입",
      "LOT",
      "품목코드",
      "품목명",
      "버전",
      "규격",
      "단위",
      "창고",
      "구역",
      "이전재고",
    ];

    for (var k = 0; k < serverColumn.length; k++) {
      arr.forEach((obj) => renameKey(obj, serverColumn[k], renameColumn[k]));
    }

    //ID 값 삭제
    arr.forEach((obj) => DeleteKey(obj, "materialId"));
    arr.forEach((obj) => DeleteKey(obj, "itemId"));
    arr.forEach((obj) => DeleteKey(obj, "storageId"));
    arr.forEach((obj) => DeleteKey(obj, "storageLocationId"));

    const updatedJson = JSON.stringify(arr);

    var data = XLSX.utils.json_to_sheet(JSON.parse(updatedJson));
    var productData = XLSX.utils.json_to_sheet(this.productsList);
    var rawMaterialsData = XLSX.utils.json_to_sheet(this.rawMaterialsList);
    var halfProductsData = XLSX.utils.json_to_sheet(this.halfProductsList);

    var totalBook = XLSX.utils.book_new();

    //북마크 생성
    const bookName = ["전체", "완제품", "원자재", "반제품"];
    const dataName = [data, productData, rawMaterialsData, halfProductsData];

    for (var i = 0; i < bookName.length; i++) {
      XLSX.utils.book_append_sheet(totalBook, dataName[i], bookName[i]);
    }

    // 엑셀 파일명
    XLSX.writeFile(totalBook, name + ".xlsx");
  }
  edit_changeStorage(item: any) {
    //this.changeStorageId = item.itemId;
    this.edit_storage = true;

    //this.original_storageId = item.id;
    this.original_storageName = item.storageName;
    this.original_locationName = item.area;

    this.update_storageName = "";
    this.update_locationeName = "";

    //창고목록 불러오기
    api.stock
      .getStockTakingStorageList()
      .then((response) => {
        this.storage_list = response.data.responseData;
      })
      .catch((error) => {
        console.log(error);
      });
  }
  getLocation() {
    this.location_list = [];

    let storageId: any = {
      storageId: this.update_storageName.storageId,
    };
    api.stock
      .getStockTakingLocationList(storageId)
      .then((response) => {
        this.location_list = response.data.responseData;
      })
      .catch((error) => {
        console.log(error);
      });
  }
  clickSaveStorage() {
    // for (var i = 0; i < this.stocklist.length; i++) {
    //   if (this.stocklist[i].itemId == this.changeStorageId) {
    //     this.stocklist[i].area = this.update_locationeName.area;
    //     this.stocklist[i].storageName = this.update_storageName.storageName;
    //   }
    // }
    this.edit_storage = false;
  }
  complete() {
    let stockItem: any = {
      memo: this.memo,
      details: [],
    };
    for (var i = 0; i < this.stockTable.length; i++) {
      if (
        this.stockTable[i].currentCount == null ||
        this.stockTable[i].currentCount == ""
      ) {
        return this.$swal({
          title: "입력되지 않은 현재고가 존재합니다.",
          icon: "error",
          position: "top",
          showCancelButton: false,
          showConfirmButton: false,
          toast: true,
          timer: 1500,
        });
      } else {
        stockItem["details"].push({
          materialId: this.stockTable[i].materialId,
          itemId: this.stockTable[i].itemId,
          storageId: this.stockTable[i].storageId,
          storageLocationId: this.stockTable[i].storageLocationId,
          previousCount: String(this.stockTable[i].count),
          currentCount: this.stockTable[i].currentCount,
        });
      }
    }

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
          api.stock
            .saveStockTakingList(stockItem)
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
</script>
<style src="./Stock.scss" lang="scss"></style>
