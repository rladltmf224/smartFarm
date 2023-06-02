<template>
  <div>
    <!-- 생성 모달 -->
    <v-dialog persistent v-model="manureDialog" max-width="800px">
      <v-card class="card-shadow box-radius">
        <v-card-title>
          <span>양액 추가</span>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-card-text>
          <v-data-table
            height="450"
            fixed-header
            :headers="manureAdd_headers"
            :items="manureAdd_list"
            v-model="manureTable"
            disable-pagination
            hide-default-footer
            show-select
            item-key="lot"
            loading-text="서버에 요청중...."
            no-data-text="데이터가 없습니다."
            class="elevation-1"
          >
            <template v-slot:item.finishCount="props">
              <v-text-field
                class="pa-0 countFont"
                oninput="javascript: this.value = this.value.replace(/[^0-9]/g, '');"
                placeholder="* 수량 필수"
                v-model="props.item.finishCount"
                single-line
              >
                {{ props.item.finishCount }}
              </v-text-field>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" @click="done">사용완료</v-btn>
          <v-btn color="error" @click="close">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import cfg from "./config/index";
import * as api from "@/api";

@Component
export default class ManureMngAddModal extends Vue {
  @Prop({ required: true }) readonly open: boolean;
  manureAdd_headers: any[] = [];
  manureAdd_list: any[] = [];
  manureTable: any[] = [];

  get manureDialog() {
    return this.open;
  }
  set manureDialog(val: any) {
    this.$emit("closeModal", false);
  }

  created() {
    this.manureAdd_headers = Object.assign([], cfg.header.manureAdd_headers);
    this.getItemList();
  }
  getItemList() {
    api.smartfarm
      .getItemList()
      .then((response) => {
        this.manureAdd_list = response.data.responseData;
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {});
  }
  done() {
    let tempDetail = [];
    let totalData: any = {};

    if (this.manureTable.length != 0) {
      for (var i = 0; i < this.manureTable.length; i++) {
        if (
          this.manureTable[i].finishCount == null ||
          this.manureTable[i].finishCount == ""
        ) {
          return this.$swal({
            title: "선택된 품목 중 수량이 작성되지 않은 양액이 존재합니다.",
            icon: "error",
            position: "top",
            showCancelButton: false,
            showConfirmButton: false,
            toast: true,
            timer: 1500,
          });
        } else {
          tempDetail.push({
            materialId: this.manureTable[i].materialId,
            count: Number(this.manureTable[i].finishCount),
          });
        }
      }

      totalData["useDate"] = new Date().toISOString().substr(0, 10);
      totalData["detail"] = tempDetail;

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
            api.smartfarm
              .createItemList(totalData)
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
                  this.manureTable = [];
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
  close() {
    this.$emit("closeModal", false);
  }
}
</script>
<style src="@/views/SmartFarm/SmartFarm.scss" lang="scss"></style>
