<template>
  <div>
    <v-dialog v-model="open_prop" max-width="1600px" persistent>
      <v-card>
        <v-card-title>
          <v-row>
            <v-col cols="8">
              <p></p>
            </v-col>
            <v-spacer></v-spacer>

            <v-col class="text-right">
              <v-btn color="primary" @click="closeModal_customer"> 닫기 </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-data-table
                height="200"
                :headers="headers_item"
                :items="joborder_list_modal"
                v-model="selected_job"
                fixed-header
                item-key="jobOrderId"
                class="elevation-4"
                @click:row="selectJoborderDetailList"
                multi-sort
                hide-default-footer
                dense
                single-select
              >
              </v-data-table>
            </v-col>
          </v-row>

          <v-row>
            <v-row>
              <v-col cols="2">
                <span class="searchbox-title">완제품 목록</span>
              </v-col>
            </v-row>

            <v-col cols="12">
              <v-data-table
                height="200"
                :headers="headers_item_detail"
                :items="joborder_detail_list_modal"
                item-key="itemId"
                class="elevation-4"
                v-model="selected_item"
                fixed-header
                multi-sort
                dense
                hide-default-footer
                single-select
                @click:row="selectBOMList"
              >
                <template v-slot:item.supplyPrice="props">
                  <v-edit-dialog :return-value.sync="props.item.supplyPrice">
                    {{ props.item.supplyPrice | comma }}원
                    <template v-slot:input>
                      <v-text-field
                        v-model="props.item.supplyPrice"
                        :rules="[max25chars]"
                        label="Edit"
                        single-line
                        counter
                      ></v-text-field>
                    </template>
                  </v-edit-dialog>
                </template>

                <template v-slot:item.taxAmount="props">
                  <v-edit-dialog :return-value.sync="props.item.taxAmount">
                    {{ props.item.taxAmount | comma }}원
                    <template v-slot:input>
                      <v-text-field
                        v-model="props.item.taxAmount"
                        :rules="[max25chars]"
                        label="Edit"
                        single-line
                        counter
                      ></v-text-field>
                    </template>
                  </v-edit-dialog>
                </template>

                <template v-slot:item.unitPrice="props">
                  <v-edit-dialog :return-value.sync="props.item.unitPrice">
                    {{ props.item.unitPrice | comma }}원
                    <template v-slot:input>
                      <v-text-field
                        v-model="props.item.unitPrice"
                        :rules="[max25chars]"
                        label="Edit"
                        single-line
                        counter
                      ></v-text-field>
                    </template>
                  </v-edit-dialog>
                </template>

                <template v-slot:item.edit="{ item }">
                  <v-icon small @click="deleteItem_modal(item)">
                    mdi-delete
                  </v-icon>
                </template>
              </v-data-table>
            </v-col>
          </v-row>

          <v-row>
            <v-row>
              <v-col>
                <h4 class="searchbox-title">원자재 출고 목록</h4>
              </v-col>
              <v-col class="text-right">
                <v-btn color="primary" @click="clickSaveInfo">
                  자재 출고
                </v-btn>
              </v-col>
            </v-row>

            <v-col cols="12">
              <v-data-table
                ref="rawListGrid"
                height="200"
                :headers="headers_raw_detail"
                fixed-header
                :items="raw_list_modal"
                item-key="id"
                class="elevation-4"
                multi-sort
                hide-default-footer
                dense
              >
                <template v-slot:item.count="props">
                  {{ props.item.count | comma }}
                </template>
                <template v-slot:item.releaseCount="props">
                  {{ props.item.releaseCount | comma }}
                </template>

                <template v-slot:item.add="{ item }">
                  <v-btn small class="mr-2" @click="selectRawDetail(item)">
                    자재 추가
                  </v-btn>
                </template>
                <template v-slot:item.reversal="{ item }">
                  <v-btn
                    small
                    class="mr-2"
                    @click="selectRawReleaseDetail(item)"
                  >
                    자재 환입
                  </v-btn>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions> </v-card-actions>
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
  edit_customer: boolean;
  joborder_list_modal: object[] = [];
  joborder_detail_list_modal: object[] = [];
  raw_list_modal: object[] = [];
  raw_detail_list: object[] = [];
  selected_job: any[] = [];
  selected_item: any[] = [];
  selected: object[] = [];
  txtReleaseCount: number = 0;
  select_rawID: number;
  add_rawModal: boolean = false;
  editedCustomer: any;
  max25chars: any = (v: any) => v.length <= 25 || "Input too long!";

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
  get open_prop() {
    this.open_modal();
    return this.open;
  }

  //   set open_prop() {
  //     this.$emit("closeModal");
  //   }

  //   get joborder_list_modal_prop() {
  //     return this.joborder_list_modal;
  //   }

  saveSelectedItem(item: object[], count: number) {
    console.log("saveSelectedItem", item, count);

    this.raw_list_modal.forEach((el: any) => {
      console.log(el, this.select_rawID);
      if (el.itemId == this.select_rawID) {
        el.rawMaterialDetails = item;
        el.releaseCount = count;
      }
    });
  }

  open_modal() {
    let search: any = {
      notComp: "1",
    };

    search.page = 1;
    search.size = 9999;
    search.sortBy = [];
    search.sortDesc = [false];
    if (this.open) {
      api.rawRelease
        .getReleaseList(search)
        .then((response) => {
          console.log("getReleaseList", response);
          this.joborder_list_modal = response.data.responseData;
        })
        .catch((error) => {
          console.log(error);
        });
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
    //this.editedCustomer = Object.assign({}, this.customer);
    //this.editedIndex = -1;
    // this.selectedId = -1;
    // this.customer = {
    //   companyId: "",
    //   name: "",
    // };
  }

  selectJoborderDetailList(item: any, row: any) {
    row.select(true);
    let reqData_raw = {
      jobOrderId: item.jobOrderId,
    };
    this.selected_item = [];
    this.raw_list_modal = [];
    api.rawRelease
      .getReleaseOrderRawData(reqData_raw)
      .then((response) => {
        console.log("getReleaseOrderRawData", response);
        this.joborder_detail_list_modal = response.data.responseData;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  selectBOMList(item: any, row: any) {
    row.select(true);

    let reqData_rawDetail = {
      jobOrderId: item.jobOrderId,
      itemId: item.itemId,
    };
    api.rawRelease
      .getReleaseOrderRawDetailData(reqData_rawDetail)
      .then((response) => {
        console.log("getReleaseOrderRawData", response);
        this.raw_list_modal = response.data.responseData;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  selectRawDetail(item: any) {
    this.txtReleaseCount = item.orderCount;
    this.select_rawID = item.itemId;
    console.log("selectRawDetail", item);
    this.selected = item.rawMaterialDetails;
    let reqData = {
      childItemId: item.itemId,
    };
    api.rawRelease
      .getReleaseRawDetailList(reqData)
      .then((response) => {
        console.log("getReleaseRawDetailList", response);
        let list_data = [];
        response.data.responseData.forEach((el: any) => {
          el.releaseCount = el.count;
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
        console.log("list_data", list_data);
        this.raw_detail_list = list_data;
        this.add_rawModal = true;
      })
      .catch((error) => {
        console.log(error);
        this.add_rawModal = true;
      });
  }

  selectRawReleaseDetail(item: any) {
    let txtReleaseCount_check: number = item.releaseCount;
    let select_rawID: number = item.itemId;
    console.log("selectRawReleaseDetail", item);
    let selected: object[] = item.rawMaterialDetails;
    let reqData: any = {
      childItemId: this.select_rawID,
      jobOrderId: this.selected_job[0].jobOrderId,
    };
    api.rawRelease
      .getReleaseOrderRawDetailCheckData(reqData)
      .then((response) => {
        console.log("getReleaseOrderRawDetailCheckData", response);
        response.data.forEach((el: any) => {
          el.reversalCount = el.count;
        });

        //this.raw_reversal_list = response.data;

        //this.reversal_rawModal = true;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  clickSaveInfo() {
    let customerInfo: any = this.editedCustomer;
    console.log("clickSaveCustomerInfo", customerInfo);
    this.raw_list_modal.forEach((el: any) => {
      el.rawMaterialDetailId = el.itemId;
      el.count = el.releaseCount;
    });
    customerInfo = {
      releaseId: "",
      jobOrderId: this.selected_job[0].jobOrderId,
      details: this.raw_list_modal,
    };
    this.raw_list_modal.forEach((el: any) => {
      console.log("el", el);
      el.childItemId = el.itemId;
      el.itemId = this.selected_item[0].itemId;
    });

    console.log("생성", customerInfo);
    api.rawRelease
      .createReleaseOrderData(customerInfo)
      .then((response) => {
        console.log("createCustomerItem", response);
        if (response.status == 200) {
          this.$swal("성공", "자재가 입력되었습니다", "success");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
</script>
