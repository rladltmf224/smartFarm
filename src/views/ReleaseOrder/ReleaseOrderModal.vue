<template>
  <div>
    <v-dialog v-model="open_prop" max-width="1200px" persistent>
      <v-card class="card-shadow" elevation="0">
        <v-card-title>
          <span>출고 요청</span>
        </v-card-title>
        <v-card-text>
          <v-row dense>
            <v-col align-self="center">
              <span>원자재 출고 목록(대기)</span>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12">
              <v-data-table
                ref="rawListGrid"
                height="320"
                :headers="headers_before"
                fixed-header
                :items="before_list_modal"
                item-key="id"
                class="elevation-4"
                multi-sort
                hide-default-footer
                dense
                disable-pagination
              >
                <template v-slot:item.count="props">
                  {{ props.item.count | comma }}
                </template>
                <template v-slot:item.releaseCount="props">
                  {{ props.item.releaseCount | comma }}
                </template>
                <template v-slot:item.jobOrderDetailStatus="{ item }">
                  {{ getStatusCode(item.jobOrderDetailStatus, jod_code) }}
                </template>

                <template v-slot:item.add="{ item }">
                  <v-btn small @click="selectRawDetail(item)">
                    자재 추가
                  </v-btn>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col align-self="center">
              <span>원자재 출고 목록(진행)</span>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12">
              <v-data-table
                ref="rawListGrid"
                height="320"
                :headers="headers_after"
                fixed-header
                :items="after_list_modal"
                item-key="id"
                class="elevation-4"
                multi-sort
                hide-default-footer
                dense
                disable-pagination
              >
                <template v-slot:item.count="{ item }">
                  {{ item.count | comma }}
                </template>
                <template v-slot:item.releaseCount="{ item }">
                  {{ item.releaseCount | comma }}
                </template>

                <template v-slot:item.jobOrderDetailStatus="{ item }">
                  {{ getStatusCode(item.jobOrderDetailStatus, jod_code) }}
                </template>

                <template v-slot:item.add="{ item }">
                  <v-btn small @click="selectRawDetail(item)">
                    자재 추가
                  </v-btn>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="closeModal_customer"> 닫기 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <ReleaseOrderItem
      :open="add_rawModal"
      :raw_detail_list="raw_detail_list"
      :txtReleaseCount="txtReleaseCount"
      :selected="selected"
      @closeModal="closeModal_Item"
      @saveItem="saveSelectedItem"
    >
    </ReleaseOrderItem>
  </div>
</template>
<script lang="ts">
import * as api from "@/api";
import { JOD_code } from "@/util/config";
import _ from "lodash";
import cfg from "./config";
import { Vue, Component, Prop } from "vue-property-decorator";
import ReleaseOrderItem from "./ReleaseOrderItem.vue";

@Component({
  filters: {
    comma(val: any) {
      if (val === null) {
        console.log(val);
        val = 0;
      }
      return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
  components: {
    ReleaseOrderItem,
  },
})
export default class ReleaseOrderModal extends Vue {
  joborder_list_modal: object[] = [];
  joborder_detail_list_modal: object[] = [];
  raw_list_modal: object[] = [];
  before_list_modal: object[] = [];
  after_list_modal: object[] = [];
  raw_detail_list: object[] = [];
  selected_job: any[] = [];
  selected_item: any[] = [];
  selected: object[] = [];
  txtReleaseCount: number = 0;
  select_rawID: number = 0;
  add_rawModal: boolean = false;
  editedCustomer: any;
  jod_code: any = JOD_code;

  @Prop({ required: true }) open: boolean = false;

  get headers_item() {
    return cfg.header.headers_item;
  }

  get headers_item_detail() {
    return cfg.header.headers_item_detail;
  }

  get headers_raw_detail() {
    return cfg.header.headers_raw_detail;
  }
  get headers_before() {
    return cfg.header.headers_before;
  }
  get headers_after() {
    return cfg.header.headers_after;
  }
  get open_prop() {
    this.open_modal();
    return this.open;
  }

  saveSelectedItem(item: object[], count: number) {
    console.log("saveSelectedItem", item, count);
    this.getRawBeforeData();
    this.getRawAfterData();
  }

  getRawBeforeData() {
    return api.rawRelease
      .getReleaseOrderRawBefore()
      .then((response) => {
        console.log("getReleaseOrderRawBefore", response);
        this.before_list_modal = response.data.responseData;

        this.before_list_modal.forEach((el: any) => {
          el.releaseCount = 0;
          return el;
        });

        console.log("getReleaseOrderRawData", this.before_list_modal);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getRawAfterData() {
    return api.rawRelease
      .getReleaseOrderRawAfter()
      .then((response) => {
        console.log("getReleaseOrderRawAfter", response);
        this.after_list_modal = response.data.responseData;

        // this.after_list_modal.forEach((el: any) => {
        //   el.releaseCount = 0;
        //   return el;
        // });

        console.log("getReleaseOrderRawData", this.after_list_modal);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  open_modal() {
    if (this.open) {
      this.getRawBeforeData();
      this.getRawAfterData();
    }
  }
  closeModal_Item() {
    this.add_rawModal = false;
  }

  closeModal_customer() {
    this.$emit("closeModal");
    this.joborder_list_modal = [];
    this.joborder_detail_list_modal = [];
    this.raw_list_modal = [];
  }

  selectRawDetail(item: any) {
    this.txtReleaseCount = item.targetCount;
    this.select_rawID = item.jobOrderDetailId;
    console.log("selectRawDetail", item);
    this.selected = item;
    let reqData = {
      childItemId: item.itemId,
    };
    api.rawRelease
      .getReleaseRawDetailList(reqData)
      .then((response) => {
        console.log("getReleaseRawDetailList", response);
        let list_data = [];
        response.data.responseData.forEach((el: any) => {
          //el.releaseCount = el.count;
          el.releaseCount = 0;
        });
        if (this.selected != undefined) {
          response.data.responseData.forEach((el: any) => {
            console.log(
              _.filter(this.selected, {
                rawMaterialDetailId: el.rawMaterialDetailId,
              })
            );
            if (
              _.filter(this.selected, {
                rawMaterialDetailId: el.rawMaterialDetailId,
              }).length != 0
            ) {
              list_data.push(
                _.filter(this.selected, {
                  rawMaterialDetailId: el.rawMaterialDetailId,
                })[0]
              );
            } else {
              list_data.push(el);
            }
            console.log(el);
          });
        } else {
          list_data = response.data.responseData;
        }
        list_data = response.data.responseData;
        console.log("list_data", list_data);
        list_data.forEach((element: any) => {
          element.materialId = element.rawMaterialDetailId;
        });
        this.raw_detail_list = list_data;
        this.add_rawModal = true;
      })
      .catch((error) => {
        console.log(error);
        this.add_rawModal = true;
      });
  }

  getStatusCode(status: string, code: any[]) {
    if (_.find(code, { code: status }) === undefined) {
      return "";
    }
    if (status === undefined) {
      return "";
    }
    if (_.find(code, { code: status }).name == undefined) {
      return "오류";
    }
    return _.find(code, { code: status }).name;
  }
}
</script>
