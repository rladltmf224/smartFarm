<template>
  <div>
    <v-dialog persistent v-model="manureDialog" max-width="900px">
      <v-card class="card-shadow box-radius">
        <v-card-title>
          <span>농자재 추가</span>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-card-text>
          <v-row no-gutters>
            <v-col class="ma-2" cols="12">
              <v-row dense class="mb-2">
                <v-col cols="3" align-self="center">
                  <span class="searchbox-title">투입되어있는 농자재 목록</span>
                </v-col>
                <v-spacer></v-spacer>
                <v-col class="text-right" cols="3">
                  <v-btn color="primary" elevation="0" @click="openItem"
                    >농자재 추가</v-btn
                  >
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-data-table
            height="300"
            :headers="selectedItem_header"
            :items="selectedItem_list"
            v-model="selectedTable"
            disable-pagination
            hide-default-footer
            loading-text="서버에 요청중...."
            no-data-text="데이터가 없습니다."
            class="elevation-1"
            fixed-header
          >
          </v-data-table>
          <v-row dense class="mt-5 mb-2">
            <span class="searchbox-title" v-show="addData.length != 0"
              >추가한 농자재 목록</span
            >
          </v-row>
          <v-data-table
            height="300"
            v-show="addData.length != 0"
            :headers="selectedAddItem_header"
            :items="addData"
            item-key="lot"
            disable-pagination
            hide-default-footer
            loading-text="서버에 요청중...."
            no-data-text="데이터가 없습니다."
            class="elevation-1"
            fixed-header
          >
            <template v-slot:item.status="{ item }">
              <v-btn
                class="text-left mt-1 mb-1"
                small
                dark
                :color="item.status == 'add' ? '' : 'green'"
                style="width: 100px"
                depressed
              >
                <v-icon left> mdi-album </v-icon>
                {{ item.status == "add" ? "추가" : "신규" }}
              </v-btn>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" @click="done">완료</v-btn>
          <v-btn color="error" @click="close">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--농자재 추가 모달-->
    <v-dialog persistent v-model="itemDialog" max-width="900px">
      <v-card class="card-shadow box-radius">
        <v-card-title>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <span class="searchbox-title">원자재 목록</span>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-data-table
                height="450"
                :headers="item_header"
                :items="item_list"
                v-model="itemTable"
                item-key="materialId"
                disable-pagination
                hide-default-footer
                show-select
                loading-text="서버에 요청중...."
                no-data-text="데이터가 없습니다."
                class="elevation-1"
                fixed-header
              >
                <template v-slot:item.useCount="props">
                  <v-text-field
                    class="pa-0 countFont"
                    oninput="javascript: this.value = this.value.replace(/[^0-9]/g, '');"
                    placeholder="* 수량 필수"
                    v-model="props.item.useCount"
                    single-line
                  >
                    {{ props.item.useCount }}
                  </v-text-field>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" @click="add">추가</v-btn>
          <v-btn color="error" @click="closeItem">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts">
import * as api from "@/api";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import cfg from "./config/index";

@Component
export default class OrderAddItemModal extends Vue {
  @Prop({ required: true }) readonly open: boolean;
  @Prop({ required: true }) id: number;
  totalData: any[] = [];
  selectedAddItem_header: any[] = [];
  selectedItem_header: any[] = [];
  selectedItem_list: any[] = [];
  item_header: any[] = [];
  item_list: any[] = [];
  itemDialog: boolean = false;
  itemTable: any[] = [];
  addData: any[] = [];
  selectedTable: any[] = [];
  get manureDialog() {
    this.addData = [];
    this.itemTable = [];
    this.getSelectedItemList();
    return this.open;
  }
  set manureDialog(val: any) {
    this.$emit("closeModal", false);
  }
  get orderId() {
    return this.id;
  }

  created() {
    this.item_header = Object.assign([], cfg.header.item_header);
    this.selectedItem_header = Object.assign(
      [],
      cfg.header.selectedItem_header
    );
    this.selectedAddItem_header = Object.assign(
      [],
      cfg.header.selectedAddItem_header
    );
  }
  getSelectedItemList() {
    let data = {
      jobOrderId: this.orderId,
    };
    api.operation
      .getUseItemList(data)
      .then((response) => {
        this.selectedItem_list = response.data.responseData;
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {});
  }
  getItemList() {
    api.operation
      .getTotalItemList()
      .then((response) => {
        this.item_list = response.data.responseData;
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {});
  }
  close() {
    this.$emit("closeModal", false);
  }
  add() {
    this.totalData = [];

    if (this.itemTable.length != 0) {
      for (var i = 0; i < this.itemTable.length; i++) {
        if (
          this.itemTable[i].useCount == null ||
          this.itemTable[i].useCount == ""
        ) {
          return this.$swal({
            title: "선택된 품목 중 수량이 작성되지 않은 품목이 존재합니다.",
            icon: "error",
            position: "top",
            showCancelButton: false,
            showConfirmButton: false,
            toast: true,
            timer: 1500,
          });
        } else {
          this.totalData.push(this.itemTable[i]);
        }
      }
    }

    if (this.selectedItem_list.length != 0) {
      for (var j = 0; j < this.totalData.length; j++) {
        for (var k = 0; k < this.selectedItem_list.length; k++) {
          if (this.totalData[j].lot == this.selectedItem_list[k].lot) {
            this.totalData[j]["status"] = "add";
            this.totalData[j]["id"] = this.selectedItem_list[k].id;
            this.totalData[j]["useCount"] =
              Number(this.totalData[j].useCount) +
              Number(this.selectedItem_list[k].count);
          } else {
            this.totalData[j]["useCount"] = Number(this.totalData[j].useCount);
          }
        }
      }
    }

    this.addData = [...this.totalData];
    this.itemDialog = false;
  }
  done() {
    let data: any = {
      jobOrderId: this.orderId,
      detail: [],
    };

    let tempAdd: any[] = [];

    if (this.addData.length == 0) {
      return this.$swal({
        title: "추가할 농자재가 존재하지않습니다.",
        icon: "error",
        position: "top",
        showCancelButton: false,
        showConfirmButton: false,
        toast: true,
        timer: 1500,
      });
    } else {
      this.addData.forEach((value: any) => {
        console.log();
        if (Object.keys(value).includes("status")) {
          tempAdd.push({
            id: value.id,
            materialId: value.materialId,
            count: Number(value.useCount),
          });
        } else {
          tempAdd.push({
            id: "",
            materialId: value.materialId,
            count: Number(value.useCount),
          });
        }
      });
      data.detail = [...tempAdd];
    }

    console.log(data);
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
          api.operation
            .updateUseItemList(data)
            .then((response) => {
              if (response.status == 200) {
                this.$swal({
                  title: "사용완료 되었습니다.",
                  icon: "success",
                  position: "top",
                  showCancelButton: false,
                  showConfirmButton: false,
                  toast: true,
                  timer: 1500,
                });
                this.close();
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
  openItem() {
    this.itemDialog = true;
    this.getItemList();
  }
  closeItem() {
    this.itemDialog = false;
  }
}
</script>
