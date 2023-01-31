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
          </v-data-table>

          <!-- <v-pagination
            v-model="operationOpt.page"
            :length="operationOpt.pageCount"
          ></v-pagination> -->
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
            <!-- <v-card class="mb-4" elevation="4">
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
            </v-card> -->
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
                </v-row>
                <v-row dense class="align-self-center">
                  <v-col cols="1">
                    <v-btn color="primary" small @click="openModal_equipment"
                      >시설등록</v-btn
                    >
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
                </v-row>
                <v-row dense class="align-self-center">
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
            <v-card
              v-for="(el, index) in equipmentList"
              :key="index"
              class="mb-4"
            >
              <v-card-title>
                {{ el.facilityName }}
              </v-card-title>
              <v-card-text>
                <v-item-group multiple :value="selectEquipData">
                  <v-row class="d-flex justify-space-around">
                    <v-item v-for="n in el.details" :key="n.facilityDetailId">
                      <v-card
                        :color="
                          n.use ? 'success' : n.active ? 'primary' : 'normal'
                        "
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
                          <div><span v-if="n.use">상세정보</span></div>
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
import _ from "lodash";

@Component
export default class OperationMng extends Vue {
  selectEquipData: any[] = [];
  selectEquipData_regi: any[] = [];
  startDate: any = "";
  endDate: any = "";
  deadDate: any = false;
  deadDate_date: any = "";
  search_condition: any = {};
  operationOpt: any;
  operationRegiOpt: any;
  itemList: any[] = [];
  selectItem: any = 0;
  selectItemCount: number = 0;
  selectOprationID: any = 0;
  selectOperation: any = 0;
  objectList: any[] = [
    { name: "납품", value: "납품" },
    { name: "실험", value: "실험" },
    { name: "기타", value: "기타" },
  ];

  operationOrderList: any[] = [];
  operationReqList: any[] = [{ equipment: "" }, { edit: "" }, { delete: "`" }];
  operation_modal: boolean = false;
  equipment_modal: boolean = false;
  equipmentList: any[] = [];
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
    this.getItemList();
    this.getOperationData();
  }

  getItemList() {
    let reqData = {
      page: 1,
      size: 9999,
      sortBy: [],
      sortDesc: [false],
    };

    api.item.getItemList(reqData).then((res) => {
      console.log("getItemList", res);
      this.itemList = res.data.responseData;
    });
  }

  toggleEquip(btnData: any) {
    console.log(btnData);
    if (btnData.use) {
      return;
    }
    btnData.active = !btnData.active;
    if (btnData.active) {
      this.selectEquipData.push(btnData);
    } else {
      this.selectEquipData = this.selectEquipData.filter(
        (element) => element.facilityDetailId !== btnData.facilityDetailId
      );
    }

    return;
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

  dead_date_search(v: any) {
    this.deadDate_date = v;
    this.deadDate = false;
    let deadDate: any = this.$refs.deadDate;
    deadDate.save(v);
  }

  getOperationData() {
    // const { page, itemsPerPage, sortBy, sortDesc } = this.operationOpt.options;
    // this.search_condition.page = page;
    // this.search_condition.size = itemsPerPage;
    // this.search_condition.sortBy = sortBy;
    // this.search_condition.sortDesc = sortDesc;
    this.operationOpt.loading = true;
    api.production.getProdutionList(this.search_condition).then((res) => {
      //this.operationReqList=res.data.re

      try {
        console.log("getOperationData", res.data.responseData);
        this.operationOrderList = res.data.responseData;
        this.operationOpt.loading = false;
      } catch (error) {
        console.log("error", error);
      }
    });
  }

  editItem(item: any) {
    this.operation_modal = true;
    this.operation_modal_mode = "M";
    this.selectOprationID = item.productionId;
    console.log("editItem", item);
  }

  openModal_equipment() {
    this.equipment_modal = true;
    this.selectEquipData = _.cloneDeep(this.selectEquipData_regi);
    api.facility.getFacilityList().then((res) => {
      console.log("getFacilityList", res);
      res.data.responseData.forEach((element: any) => {
        element.details.forEach((element_sub: any) => {
          element_sub.name = element.facilityName + element_sub.serialNumbers;
          element_sub.use = element_sub.productionId !== null ? true : false;
          if (
            _.filter(this.selectEquipData_regi, {
              facilityDetailId: element_sub.facilityDetailId,
            }).length !== 0
          ) {
            element_sub.active = true;
          } else {
            element_sub.active = false;
          }
        });
      });
      this.equipmentList = res.data.responseData;

      console.log("equipmentList", this.equipmentList);
    });
  }

  closeModal_equipment() {
    this.equipment_modal = false;
    this.selectEquipData = [];
  }

  closeModal_operation() {
    this.operation_modal = false;
    this.selectEquipData_regi = [];
    this.selectItem = 0;
    this.selectItemCount = 0;
    this.selectOperation = 0;
    this.deadDate_date = "";
  }

  saveOperationInfo() {
    let reqData: any = {
      itemId: this.selectItem,
      //processId: this.selectOperation,
      processId: 1,
      counts: this.selectItemCount,
      productionDate: this.deadDate_date,
      facilityDetailIds: this.selectEquipData_regi.map((el) => {
        return el.facilityDetailId;
      }),
    };

    if (reqData.itemId == 0) {
      return this.$swal({
        title: "품목을 선택해주세요.",
        icon: "error",
        position: "top",
        showCancelButton: false,
        showConfirmButton: false,
        toast: true,
        timer: 1500,
      });
    }

    if (reqData.processId == 0) {
      return this.$swal({
        title: "공정을 선택해주세요.",
        icon: "error",
        position: "top",
        showCancelButton: false,
        showConfirmButton: false,
        toast: true,
        timer: 1500,
      });
    }

    if (reqData.counts == 0) {
      return this.$swal({
        title: "갯수를 입력해주세요.",
        icon: "error",
        position: "top",
        showCancelButton: false,
        showConfirmButton: false,
        toast: true,
        timer: 1500,
      });
    }

    if (reqData.counts == 0) {
      return this.$swal({
        title: "갯수를 입력해주세요.",
        icon: "error",
        position: "top",
        showCancelButton: false,
        showConfirmButton: false,
        toast: true,
        timer: 1500,
      });
    }

    if (reqData.productionDate == "") {
      this.$swal({
        title: "마감일을 선택해주세요.",
        icon: "error",
        position: "top",
        showCancelButton: false,
        showConfirmButton: false,
        toast: true,
        timer: 1500,
      });
    }

    if (reqData.facilityDetailIds.length == 0) {
      this.$swal({
        title: "시설을 선택해주세요.",
        icon: "error",
        position: "top",
        showCancelButton: false,
        showConfirmButton: false,
        toast: true,
        timer: 1500,
      });
    }
    if (this.operation_modal_mode == "C") {
      api.production.postProdutionData(reqData).then((res) => {
        console.log("res", res);
        if (res.status == 200) {
          this.closeModal_operation();
          this.$swal({
            title: "추가되었습니다.",
            icon: "success",
            position: "top",
            showCancelButton: false,
            showConfirmButton: false,
            toast: true,
            timer: 1500,
          });
        } else {
          this.$swal("경고", "관리자에게 문의주시기바랍니다.", "error");
        }
      });
    } else if (this.operation_modal_mode == "M") {
      reqData.productionId = this.selectOprationID;
      api.production.putProdutionData(reqData).then((res) => {
        console.log("res", res);
        if (res.status == 200) {
          this.closeModal_operation();
          this.$swal({
            title: "수정되었습니다.",
            icon: "success",
            position: "top",
            showCancelButton: false,
            showConfirmButton: false,
            toast: true,
            timer: 1500,
          });
        } else {
          this.$swal("경고", "관리자에게 문의주시기바랍니다.", "error");
        }
      });
    }
  }
  saveEquipmentInfo() {
    this.equipment_modal = false;
    this.selectEquipData_regi = _.cloneDeep(this.selectEquipData);
  }

  createItem() {
    this.operation_modal = true;
    this.operation_modal_mode = "C";
  }
}
</script>
<style src="./OperationMng.scss" lang="scss"></style>
