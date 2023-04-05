<template>
  <div>
    <v-dialog v-model="open_prop" max-width="1500px" persistent>
      <v-card>
        <v-card-title>
          <span></span>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-data-table :headers="headers_item" :items="joborder_list" v-model="selected" fixed-header item-key="id"
                class="elevation-4" multi-sort dense single-select @click:row="selectJobOrderDetailList"
                :footer-props="footer_option"></v-data-table>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="6">
              <h4>상세 품목</h4>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-data-table :headers="headers_item_detail" :items="joborder_detail_list" fixed-header item-key="id"
                class="elevation-4" multi-sort :footer-props="footer_option" dense>
                <template v-slot:item.normalCount="props">
                  <v-edit-dialog :return-value.sync="props.item.normalCount"
                    @save="props.item = saveOrderCount(props.item)">
                    {{ props.item.normalCount | comma }}
                    <template v-slot:input>
                      <v-text-field v-model="props.item.normalCount" label="Edit" props. single-line type="text"
                        maxlength="10"
                        oninput="this.value = this.value.replace(/[^0-9]/g, '').replace(/(^0+)/, '');"></v-text-field>
                    </template>
                  </v-edit-dialog>
                </template>

                <template v-slot:item.boxpercount="props">
                  <v-edit-dialog :return-value.sync="props.item.boxpercount"
                    @save="props.item = saveBOXperCount(props.item)">
                    {{ props.item.boxpercount | comma }}
                    <template v-slot:input>
                      <v-text-field v-model="props.item.boxpercount" label="Edit" props. single-line type="text"
                        maxlength="10"
                        oninput="this.value = this.value.replace(/[^0-9]/g, '').replace(/(^0+)/, '');"></v-text-field>
                    </template>
                  </v-edit-dialog>
                </template>

                <template v-slot:item.boxcount="props">
                  <v-edit-dialog :return-value.sync="props.item.boxcount">
                    {{ props.item.boxcount | comma }}
                    <template v-slot:input>
                      <v-text-field v-model="props.item.boxcount" label="Edit" props. single-line type="text"
                        maxlength="10"
                        oninput="this.value = this.value.replace(/[^0-9]/g, '').replace(/(^0+)/, '');"></v-text-field>
                    </template>
                  </v-edit-dialog>
                </template>

                <template v-slot:item.defectCount="props">
                  {{ props.item.defectCount | comma }}
                </template>

                <template v-slot:item.storageId="props">
                  <v-select class="select_warehousing" :items="storage_list" item-text="name" item-value="id"
                    v-model="props.item.storageId" dense></v-select>
                </template>
                <template v-slot:item.storageLocationId="props">
                  <v-select class="select_warehousing" :items="selectStorageLocation(props)" item-text="area"
                    item-value="id" v-model="props.item.storageLocationId" :disabled="props.item.storageId == 0"
                    dense></v-select>
                </template>

                <template v-slot:item.memo="props">
                  <v-edit-dialog :return-value.sync="props.item.memo">
                    {{ props.item.memo }}
                    <template v-slot:input>
                      <v-text-field v-model="props.item.memo" single-line counter></v-text-field>
                    </template>
                  </v-edit-dialog>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-col class="text-right">
            <v-btn color="success" text @click="clickSaveInfo">
              신규 등록
            </v-btn>
            <v-btn color="primary" text @click="closeModal_customer">
              닫기
            </v-btn>
          </v-col>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import cfg from "./config";
import * as api from "@/api/index.js";
import _ from "lodash";
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
})
export default class ProductWarehousingItemModal extends Vue {
  joborder_list: object[] = [];
  joborder_detail_list: object[] = [];
  storage_list: object[] = [];
  selected: object[] = [];

  selectJobOrderID: number;
  customer: object = {};
  editedCustomer: object = {};
  footer_option: {
    itemsPerPageAllText: string;
    itemsPerPageOptions: number[];
  } = {
      itemsPerPageAllText: "ALL",
      itemsPerPageOptions: [10, 20, 50, -1],
    };

  @Prop({ required: true }) open: boolean;

  get open_prop() {
    this.getDefaultData();
    return this.open;
  }

  get headers_item() {
    return cfg.header.headers_item;
  }

  get headers_item_detail() {
    return cfg.header.headers_item_detail;
  }

  created() {
    this.customer = Object.assign({}, cfg.data.customer);
    this.editedCustomer = Object.assign({}, cfg.data.editedCustomer);
  }

  getDefaultData() {
    api.rawWarehousing
      .getWarehousingData()
      .then((response) => {
        console.log("getStorageList", response);
        this.storage_list = response.data.responseData.basisStorages;
      })
      .catch((error) => {
        console.log(error);
      });
    let list_condition: any = {};
    list_condition.page = 1;
    list_condition.size = 9999;
    list_condition.sortBy = [];
    list_condition.sortDesc = [false];
    api.productWarehousing
      .getProductWarehousingJoborderList(list_condition)
      .then((response) => {
        console.log("getProductWarehousingJoborderList", response);
        this.joborder_list = response.data.responseData;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  selectJobOrderDetailList(item: any, row: any) {
    row.select(true);
    this.selectJobOrderID = item.id;
    let reqdata = {
      id: item.id,
    };
    api.productWarehousing
      .getProductWarehousingJoborderDetailList(reqdata)
      .then((response) => {
        console.log("getProductWarehousingJoborderDetailList", response);
        let joborder_detail = response.data.responseData;
        joborder_detail.forEach((el: any) => {
          el.orderCount = el.count;
          el.normalCount = 0;
          el.defectCount = 0;
          el.boxpercount = 0;
          el.boxcount = 0;
          el.storageId = 0;
          el.memo = "";
        });
        this.joborder_detail_list = _.cloneDeep(joborder_detail);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  saveOrderCount(item: any) {
    if (parseInt(item.orderCount) < parseInt(item.normalCount)) {
      this.$swal("경고", "주문수량을 다시 입력해주세요!", "error");
      return item;
    }
    item.defectCount = parseInt(item.orderCount) - parseInt(item.normalCount);
    item.count = item.normalCount;
    console.log(item);

    return item;
  }

  selectStorageLocation(data: any) {
    console.log(
      "selectStorageLocation",
      data.item.storageId,
      _.filter(this.storage_list, { id: data.item.storageId })[0]
    );
    if (data.item.storageId == 0) {
      return [];
    } else {
      let resData: any = _.filter(this.storage_list, {
        id: data.item.storageId,
      })[0];
      return resData.storageLocations;
    }
  }

  clickSaveInfo() {
    let customerInfo: any = this.editedCustomer;
    console.log("clickSaveCustomerInfo", customerInfo);
    let detailData: any = new Promise((resolve, reject) => {
      this.joborder_detail_list.forEach((el: any) => {
        el.eachCount = [];
        for (let i = 0; i < el.boxcount; i++) {
          if (
            (el.normalCount - el.boxpercount * (i + 1)) % el.boxpercount ==
            0
          ) {
            //let eachVal = el.normalCount % el.boxcount;

            el.eachCount.push({ count: el.boxpercount });
          } else {
            console.log(
              "eachCount",
              el.normalCount - el.boxpercount * (i + 1),
              el.boxpercount
            );
            let eachVal =
              (el.normalCount - el.boxpercount * (i + 1)) % el.boxpercount;
            el.eachCount.push({
              count: Math.floor(
                eachVal > 0 ? el.boxpercount : el.normalCount % el.boxpercount
              ),
            });
          }
        }
        console.log("eachCount", el.eachCount);
      });

      resolve("success");
    });

    customerInfo = {
      jobOrderId: this.selectJobOrderID,
      details: this.joborder_detail_list,
    };
    let boxCheck = _.filter(customerInfo.details, { boxpercount: 0 });

    if (boxCheck.length != 0) {
      return this.$swal("경고", "박스당 갯수가 설정되지 않았습니다.", "error");
    }

    if (_.filter(customerInfo.details, { normalCount: 0 }).length != 0) {
      return this.$swal("경고", "정상수량이 입력되지않았습니다.", "error");
    }

    console.log("생성", customerInfo);
    api.productWarehousing
      .createProductWarehousingData(customerInfo)
      .then((response) => {
        console.log("createCustomerItem", response);
        if (response.status == 200) {
          this.closeModal_customer();
          this.$swal({
            title: "저장되었습니다.",
            icon: "success",
            position: "top",
            showCancelButton: false,
            showConfirmButton: false,
            toast: true,
            timer: 1500,
          });
          //this.getCustomer();
        }
      })
      .catch((error) => {
        this.$swal("경고", "", "error");
        console.log(error);
      });
    this.closeModal_customer();
  }

  saveBOXperCount(item: any) {
    if (parseInt(item.normalCount) < parseInt(item.boxpercount)) {
      this.$swal("경고", "원자재 출고 절차 진행을 먼저 해주세요!", "error");
      return item;
    }
    item.boxcount = parseInt(item.normalCount) / parseInt(item.boxpercount);
    if (parseInt(item.normalCount) % parseInt(item.boxpercount) != 0) {
      item.boxcount++;
    }
    item.boxcount = Math.floor(item.boxcount);
    console.log(item);

    return item;
  }
  closeModal_customer() {
    this.joborder_list = [];
    this.joborder_detail_list = [];
    this.$emit("closeModal");
  }
}
</script>
