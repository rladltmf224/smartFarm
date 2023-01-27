<template>
  <div>
    <v-container fluid>
      <v-row no-gutters>
        <v-col class="ma-2" md="12">
          <h4 class="searchbox-title">조회 조건</h4>
          <v-sheet class="pa-3" color="#F6F8F9" height="70" elevation="2">
            <v-row no-gutters>
              <v-col cols="10">
                <v-row no-gutters>
                  <v-col cols="2">
                    <v-menu
                      ref="startDate"
                      v-model="startDate"
                      :close-on-content-click="false"
                      :return-value.sync="search_condition.startDate"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="search_condition.startDate"
                          label="시작일"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          dense
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="search_condition.startDate"
                        no-title
                        scrollable
                        locale="ko-KR"
                        :max="search_condition.endDate"
                      >
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="startDate = false">
                          취소
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="s_date_search(search_condition.startDate)"
                        >
                          확인
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col md="2">
                    <v-menu
                      ref="endDate"
                      v-model="endDate"
                      :close-on-content-click="false"
                      :return-value.sync="search_condition.endDate"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="search_condition.endDate"
                          label="종료일"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          dense
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="search_condition.endDate"
                        no-title
                        scrollable
                        locale="ko-KR"
                        :min="search_condition.startDate"
                      >
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="endDate = false">
                          취소
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="e_date_search(search_condition.endDate)"
                        >
                          확인
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
              </v-col>
              <v-col class="text-right align-self-center" offset="1" cols="1">
                <v-btn color="primary" large @click="getProcessData">
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
              <h4 class="searchbox-title">공정 목록</h4>
            </v-col>
            <v-col class="text-right" offset-md="7" md="3">
              <v-btn small color="primary"
                ><v-icon left> mdi-book-account </v-icon>공정등록</v-btn
              >
            </v-col>
          </v-row>

          <v-data-table
            height="680"
            :headers="headers_process"
            :items="processList"
            class="elevation-4"
            multi-sort
            fixed-header
            dense
          >
            <template v-slot:[`item.edit`]="{ item }">
              <v-icon small class="mr-2" @click="editItem(item)">
                mdi-pencil
              </v-icon>
            </template>
            <template v-slot:[`item.delete`]="{ item }">
              <v-icon small class="mr-2" @click="delete_pop(item)">
                mdi-delete
              </v-icon>
            </template>
          </v-data-table>

          <!-- <v-pagination
            v-model="operationOpt.page"
            :length="operationOpt.pageCount"
          ></v-pagination> -->
        </v-col>
      </v-row>
      <!-- 생산등록 -->
      <!-- <v-dialog v-model="operation_modal" max-width="1000px" persistent>
        <v-card>
          <v-card-title>
            <span>{{ modal_title }}</span>
            <v-spacer></v-spacer>
          </v-card-title>
          <v-card-text>
            <v-card elevation="4">
              <v-card-text>
                <v-row dense class="align-self-center">
                  <v-col cols="3">
                    <v-autocomplete
                      v-model="selectItem"
                      :items="itemList"
                      item-value="id"
                      item-text="name"
                      dense
                      label="품종"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="2">
                    <v-text-field
                      v-model="selectItemCount"
                      label="갯수"
                      type="number"
                      dense
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row dense class="align-self-center">
                  <v-col cols="2">
                    <v-select
                      :items="objectList"
                      item-value="value"
                      item-text="name"
                      label="목적"
                      dense
                    ></v-select>
                  </v-col>
                  <v-col cols="2">
                    <v-select
                      v-model="selectOperation"
                      :items="operationReqList"
                      label="공정"
                      dense
                    ></v-select>
                  </v-col>
                  <v-col cols="2">
                    <v-btn color="primary" small>공정등록</v-btn>
                  </v-col>
                  <v-col cols="2">
                    <v-menu
                      ref="deadDate"
                      v-model="deadDate"
                      :close-on-content-click="false"
                      :return-value.sync="deadDate_date"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="deadDate_date"
                          label="마감일"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          dense
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="deadDate_date"
                        no-title
                        scrollable
                        locale="ko-KR"
                      >
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="deadDate = false">
                          취소
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="dead_date_search(deadDate_date)"
                        >
                          확인
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="2">
                    <v-chip
                      v-for="data in selectEquipData_regi"
                      label
                      color="success"
                      :key="data.facilityDetailId"
                    >
                      {{ data.name }}
                    </v-chip>
                  </v-col>
                  <v-col cols="1">
                    <v-btn color="primary" small @click="openModal_equipment"
                      >시설등록</v-btn
                    >
                  </v-col>
                  <v-col cols="12"
                    ><v-text-field
                      label="요청사항"
                      name="name"
                      textarea
                    ></v-text-field
                  ></v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-card-text>
          <v-card-actions>
            <v-col class="text-right">
              <v-btn color="success" text @click="saveOperationInfo">
                저장
              </v-btn>
              <v-btn color="primary" text @click="closeModal_operation">
                닫기
              </v-btn>
            </v-col>
          </v-card-actions>
        </v-card>
      </v-dialog> -->
    </v-container>
  </div>
</template>
<script lang="ts">
import * as api from "@/api";
import { Component, Watch, Vue } from "vue-property-decorator";
import cfg from "./config";

@Component
export default class ProcessMng extends Vue {
  startDate: any = "";
  endDate: any = "";
  search_condition: any = {};
  processList: any = [];

  get headers_process() {
    return cfg.header.headers_process;
  }

  created() {
    this.getProcessData();
  }

  getProcessData() {
    // const { page, itemsPerPage, sortBy, sortDesc } = this.operationOpt.options;
    // this.search_condition.page = page;
    // this.search_condition.size = itemsPerPage;
    // this.search_condition.sortBy = sortBy;
    // this.search_condition.sortDesc = sortDesc;
    //this.operationOpt.loading = true;
    api.process.getProcessList(this.search_condition).then((res) => {
      //this.operationReqList=res.data.re

      try {
        console.log("getProcessList", res.data.responseData);
        this.processList = res.data.responseData;
        //this.operationOpt.loading = false;
      } catch (error) {
        console.log("error", error);
      }
    });
  }

  s_date_search(v: any) {
    this.search_condition.startDate = v;
    this.startDate = false;
    console.log("startDateEl", this.$refs.startDate);
    let startDate: any = this.$refs.startDate;
    startDate.save(v);
  }

  e_date_search(v: any) {
    this.search_condition.endDate = v;
    this.endDate = false;
    let endDate: any = this.$refs.endDate;
    endDate.save(v);
  }

  editItem(data: any) {
    let reqData: {
      processId: number;
    } = {
      processId: data.itemId,
    };
    api.process.getProcessDetail(reqData).then((res) => {
      console.log("getProcessDetail", res);
    });
  }

  delete_pop(data: any) {
    let deleteItem = {
      processId: data.itemId,
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
          api.item
            .deleteItemList(deleteItem)
            .then((response) => {
              if (response.status == 200) {
                api.process.deleteProcessData(deleteItem).then((res) => {
                  console.log("deleteProcessData", res);
                  this.$swal.fire("성공", "삭제되었습니다.", "success");
                });
              } else {
                this.$swal.fire("실패", "관리자에게 문의바랍니다.", "error");
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
>
