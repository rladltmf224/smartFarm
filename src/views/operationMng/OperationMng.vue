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
                <v-btn color="primary" large @click="getOperationData()">
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
              <h4 class="searchbox-title">생산 목록</h4>
            </v-col>
            <v-col class="text-right" offset-md="7" md="3">
              <v-btn small color="primary" @click="createItem()"
                ><v-icon left> mdi-book-account </v-icon>생산등록</v-btn
              >
            </v-col>
          </v-row>

          <v-data-table
            height="700"
            :headers="headers_operation"
            :items="operationOrderList"
            item-key="barcode"
            class="elevation-4"
            multi-sort
            fixed-header
            dense
            :options.sync="operationOpt.options"
            :server-items-length="operationOpt.totalCount"
            :loading="operationOpt.loading"
            :items-per-page="operationOpt.itemsPerPage"
            :page.sync="operationOpt.page"
            @page-count="operationOpt.pageCount = $event"
            hide-default-footer
          >
          </v-data-table>
          <template v-slot:[`item.edit`]="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">
              mdi-pencil
            </v-icon>
          </template>

          <v-pagination
            v-model="operationOpt.page"
            :length="operationOpt.pageCount"
          ></v-pagination>
        </v-col>
      </v-row>
      <!-- 생산등록 -->
      <v-dialog v-model="operation_modal" max-width="1000px" persistent>
        <v-card>
          <v-card-title>
            <span>{{ modal_title }}</span>
            <v-spacer></v-spacer>
          </v-card-title>
          <v-card-text>
            <!-- <v-card class="mb-4" elevation="4">
              <v-card-text>
                <v-row dense class="align-self-center">
                  <v-col cols="2">
                    <v-text-field
                      name="name"
                      label="조건1"
                      id="id"
                      dense
                    ></v-text-field>
                  </v-col>
                  <v-col cols="2">
                    <v-text-field
                      name="name"
                      label="조건2"
                      id="id"
                      dense
                    ></v-text-field>
                  </v-col>
                  <v-col cols="2">
                    <v-text-field
                      name="name"
                      label="조건3"
                      id="id"
                      dense
                    ></v-text-field>
                  </v-col>
                  <v-col cols="2">
                    <v-btn color="primary">조회</v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card> -->
            <v-card class="mb-4" elevation="4">
              <v-card-text>
                <v-data-table
                  height="200"
                  :headers="headers_operationRegi"
                  :items="operationReqList"
                  item-key="barcode"
                  multi-sort
                  fixed-header
                  dense
                  :options.sync="operationRegiOpt.options"
                  :server-items-length="operationRegiOpt.totalCount"
                  :loading="operationRegiOpt.loading"
                  :items-per-page="operationRegiOpt.itemsPerPage"
                  :page.sync="operationRegiOpt.page"
                  @page-count="operationRegiOpt.pageCount = $event"
                  hide-default-footer
                >
                </v-data-table>
                <template v-slot:[`item.edit`]="{ item }">
                  <v-icon small class="mr-2" @click="editItem(item)">
                    mdi-pencil
                  </v-icon>
                </template>
              </v-card-text>
            </v-card>
            <v-card elevation="4">
              <v-card-text>
                <v-row dense class="align-self-center">
                  <v-col cols="2">
                    <v-select :items="objectList" label="목적" dense></v-select>
                  </v-col>
                </v-row>
                <v-row dense class="align-self-center">
                  <v-col cols="2">
                    <v-select :items="objectList" label="목적" dense></v-select>
                  </v-col>
                  <v-col cols="2">
                    <v-select
                      :items="operationReqList"
                      label="공정"
                      dense
                    ></v-select>
                  </v-col>
                  <v-col cols="2">
                    <v-btn color="primary" small>공정등록</v-btn>
                  </v-col>
                  <v-col cols="2">
                    <v-select
                      :items="operationReqList"
                      label="시설"
                      dense
                    ></v-select>
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
      </v-dialog>
      <!-- 시설등록 -->
      <v-dialog v-model="equipment_modal" persistent max-width="1200px">
        <v-card>
          <v-card-title primary-title>
            <div>
              <p>시설등록</p>
            </div>
          </v-card-title>
          <v-card-text>
            <!-- 발아실 -->
            <v-card class="mb-4">
              <v-card-text>
                <v-item-group multiple :value="selectEquipData">
                  <v-row class="d-flex justify-space-between">
                    <v-item v-for="(n, i) in germination_arr" :key="i">
                      <v-card
                        :color="n.use ? 'success' : n.active ? 'primary' : ''"
                        class="d-flex align-center text-center"
                        dark
                        height="200"
                        width="200"
                        @click="toggleEquip(n)"
                      >
                        <v-card-text>
                          <div>
                            <span class="text-h6">{{ n.name }}</span>
                          </div>
                          <div><span>상세정보</span></div>
                        </v-card-text>
                      </v-card>
                    </v-item>
                  </v-row>
                </v-item-group>
              </v-card-text>
            </v-card>

            <!-- 활착실 -->
            <v-card class="mb-4">
              <v-card-text>
                <v-item-group multiple :value="selectEquipData">
                  <v-row class="d-flex justify-space-between">
                    <v-item v-for="(n, i) in survival_arr" :key="i">
                      <v-card
                        :color="n.use ? 'success' : n.active ? 'primary' : ''"
                        class="d-flex align-center text-center"
                        dark
                        height="200"
                        width="150"
                        @click="toggleEquip(n)"
                      >
                        <v-card-text>
                          <div>
                            <span class="text-h6">{{ n.name }}</span>
                          </div>
                          <div><span>상세정보</span></div>
                        </v-card-text>
                      </v-card>
                    </v-item>
                  </v-row>
                </v-item-group>
              </v-card-text>
            </v-card>
            <!-- 육묘실 -->
            <v-card elevation="4">
              <v-card-text>
                <v-item-group multiple :value="selectEquipData">
                  <v-row class="d-flex justify-space-between">
                    <v-item v-for="(n, i) in seeding_arr" :key="i">
                      <v-card
                        :color="n.use ? 'success' : n.active ? 'primary' : ''"
                        class="d-flex align-center text-center"
                        dark
                        height="200"
                        width="200"
                        @click="toggleEquip(n)"
                      >
                        <v-card-text>
                          <div>
                            <span class="text-h6">{{ n.name }}</span>
                          </div>
                          <div><span>상세정보</span></div>
                        </v-card-text>
                      </v-card>
                    </v-item>
                  </v-row>
                </v-item-group>
              </v-card-text>
            </v-card>
          </v-card-text>

          <v-card-actions>
            <v-col class="text-right">
              <v-btn color="success" text @click="saveEquipmentInfo">
                저장
              </v-btn>
              <v-btn color="primary" text @click="closeModal_equipment">
                닫기
              </v-btn>
            </v-col>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>
<script lang="ts">
import * as api from "@/api";
import cfg from "./config";
import { gridCfg } from "@/util/config";
import { Component, Vue, Watch } from "vue-property-decorator";

@Component
export default class OperationMng extends Vue {
  selectEquipData: any[] = [];
  startDate: any = "";
  endDate: any = "";
  search_condition: any = {};
  operationOpt: any;
  operationRegiOpt: any;
  objectList: any[] = [];

  operationOrderList: any[] = [
    { equipment: "" },
    { edit: "" },
    { delete: "`" },
  ];
  operationReqList: any[] = [{ equipment: "" }, { edit: "" }, { delete: "`" }];
  operation_modal: boolean = false;
  equipment_modal: boolean = false;
  operation_modal_mode: string = "C";
  germination_arr: any[] = [
    { name: "육묘다이1", use: true, active: true },
    { name: "육묘다이2", use: false, active: false },
    { name: "육묘다이3", use: false, active: false },
    { name: "육묘다이4", use: true, active: true },
  ];

  survival_arr: any[] = [
    { name: "활착실1", use: true, active: true },
    { name: "활착실2", use: false, active: false },
    { name: "활착실3", use: false, active: false },
    { name: "활착실4", use: true, active: true },
    { name: "활착실5", use: true, active: true },
    { name: "활착실6", use: true, active: true },
  ];

  seeding_arr: any[] = [
    { name: "섹터1", use: true, active: true },
    { name: "섹터2", use: false, active: false },
    { name: "섹터3", use: false, active: false },
    { name: "섹터4", use: true, active: true },
  ];

  get headers_operation() {
    return cfg.header.headers_operation;
  }

  get headers_operationRegi() {
    return cfg.header.headers_operationRegi;
  }

  get modal_title() {
    return this.operation_modal_mode == "C"
      ? "생산관리 등록"
      : " 생산관리 수정";
  }

  @Watch("operationOpt.options", { deep: true })
  onOperationOptChange() {}
  @Watch("operationRegiOpt.options", { deep: true })
  onOperationRegiOptChange() {}

  created() {
    this.operationOpt = Object.assign({}, gridCfg);
    this.operationRegiOpt = Object.assign({}, gridCfg);
  }

  toggleEquip(btnData: any) {
    console.log(btnData);
    if (btnData.use) {
      return;
    }
    return (btnData.active = !btnData.active);
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

  getOperationData() {
    // const { page, itemsPerPage, sortBy, sortDesc } = this.operationOpt.options;
    // this.search_condition.page = page;
    // this.search_condition.size = itemsPerPage;
    // this.search_condition.sortBy = sortBy;
    // this.search_condition.sortDesc = sortDesc;
    // this.operationOpt.loading = true;
    api.production.getProdutionList(this.search_condition).then((res) => {
      //this.operationReqList=res.data.re

      try {
        console.log("getOperationData", res.data.responseData);
        this.operationOpt.loading = false;
      } catch (error) {
        console.log("error", error);
      }
    });
  }

  editItem(item: any) {
    this.operation_modal = true;
    this.operation_modal_mode = "M";
    console.log("editItem", item);
  }

  openModal_equipment() {
    this.equipment_modal = true;
  }

  closeModal_equipment() {
    this.equipment_modal = false;
  }

  closeModal_operation() {
    this.operation_modal = false;
  }

  saveOperationInfo(data: any) {
    let reqData = {
      itemId: data.itemId,
      processId: data.processId,
      counts: data.counts,
      productionDate: data.productionDate,
      facilityDetailIds: data.facilityDetailIds,
    };

    api.production.postProdutionData(reqData).then((res) => {
      console.log("res", res);
    });
  }
  saveEquipmentInfo() {}

  createItem() {
    this.operation_modal = true;
    this.operation_modal_mode = "C";
  }
}
</script>
<style src="./OperationMng.scss" lang="scss"></style>
