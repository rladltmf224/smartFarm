<template>
  <div>
    <v-dialog v-model="open" max-width="1400px" persistent>
      <v-card>
        <v-card-title>
          <span></span>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="2" align-self="center">
              <span>납품일자</span>
              <v-menu ref="menu" v-model="menu" :close-on-content-click="false" :return-value.sync="itemInfo.receive_date"
                transition="scale-transition" offset-y min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field solo dense v-model="itemInfo.receive_date" readonly v-bind="attrs"
                    v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="itemInfo.receive_date" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text @click="menu = false">
                    취소
                  </v-btn>
                  <v-btn text color="primary" @click="$refs.menu.save(itemInfo.receive_date)">
                    확인
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="2" align-self="center">
              <span>거래처</span>
              <v-select dense :items="customer_list" item-text="name" item-value="id" v-model="editedCustomer.customerId"
                label="거래처" solo @change="getCutomerItem()"></v-select>
            </v-col>
            <v-col cols="3" align-self="center">
              <span>품목</span>
              <v-select dense solo ref :items="item_list" item-text="itemName" item-value="itemId" label="품목"
                v-model="itemInfo.itemId" :disabled="item_list.length == 0"></v-select>
            </v-col>
            <v-col cols="2" align-self="center">
              <span>갯수</span>
              <v-text-field dense solo label="갯수" reverse type="text" maxlength="10" v-model="itemInfo.count"
                oninput="this.value = this.value.replace(/[^0-9]/g, '').replace(/(^0+)/, '');"
                @keydown.enter="add_item"></v-text-field>
            </v-col>

            <v-col cols="1" align-self="center" class="text-right">
              <v-btn color="primary" @click="add_item"> 품목 추가 </v-btn>
            </v-col>
          </v-row>
          <v-row> </v-row>
          <v-row>
            <v-col cols="6">
              <span class="searchbox-title">상세 품목</span>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-data-table height="400" :headers="headers_item" :items="item_list_modal" :expanded.sync="expanded"
                :single-expand="singleExpand" fixed-header item-key="itemId" show-expand multi-sort hide-default-footer
                dense no-data-text="데이터가 없습니다.">
                <template v-slot:item.orderCount="props">
                  <v-edit-dialog :return-value.sync="props.item.orderCount"
                    @save="props.item = saveOrderCount(props.item)">
                    {{ props.item.orderCount | comma }}
                    <template v-slot:input>
                      <v-text-field v-model="props.item.orderCount" label="Edit" props. single-line dense type="text"
                        maxlength="10"
                        oninput="this.value = this.value.replace(/[^0-9]/g, '').replace(/(^0+)/, '');"></v-text-field>
                    </template>
                  </v-edit-dialog>
                </template>

                <template v-slot:item.normalCount="props">
                  {{ props.item.normalCount | comma }}
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
                      <v-text-field v-model="props.item.memo" single-line counter dense></v-text-field>
                    </template>
                  </v-edit-dialog>
                </template>

                <template v-slot:expanded-item="{ headers, item }">
                  <td :colspan="headers.length">
                    <v-simple-table dense>
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th>갯수</th>
                            <th>삭제</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(dessert, index) in item.eachCount" :key="index">
                            <td>{{ dessert.count | comma }}</td>
                            <td>
                              <v-icon small @click="deleteDetailItem_pop(item, index)">
                                mdi-delete
                              </v-icon>
                            </td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </td>
                </template>

                <template v-slot:item.edit="{ item }">
                  <v-icon small @click="deleteItem_modal(item)">
                    mdi-delete
                  </v-icon>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-col class="text-right">
            <v-btn color="success" text @click="clickSaveInfo"> 저장 </v-btn>
            <v-btn text @click="closeModal_customer">
              닫기
            </v-btn>
          </v-col>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts">
import cfg from "./config";
import _ from "lodash";
import * as api from "@/api/index.js";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

@Component({
  filters: {
    comma(val: number) {
      if (val === null) {
        console.log(val);
        val = 0;
      }
      return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
})
export default class WarehousingItemModal extends Vue {
  customer_list: object[] = [];
  item_list: object[] = [];
  storage_list: object[] = [];
  item_list_modal: any[] = [];
  singleExpand: boolean = true;
  expanded: [] = [];
  editedCustomer: any = {};
  itemInfo: any = Object.assign({}, cfg.data.inputDefaultData_item);
  menu: boolean = false;
  @Prop({ required: true }) open: boolean;
  created() {
    console.log("headers_item", cfg.header.headers_item);
  }

  get headers_item() {
    return cfg.header.headers_item;
  }

  @Watch("itemInfo.itemId")
  countCheck() {
    this.itemInfo.count = 0;
  }

  getDefaultData() {
    api.rawWarehousing
      .getWarehousingData()
      .then((response) => {
        console.log("getWarehousingData", response);
        this.customer_list = response.data.responseData.basicCustomers;
        this.storage_list = response.data.responseData.basisStorages;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  clickSaveInfo() {
    let customerInfo: any = this.editedCustomer;
    console.log("clickSaveCustomerInfo", customerInfo);
    customerInfo = {
      companyId: 1,
      code: this.editedCustomer.code,
      customerId: this.editedCustomer.customerId,
      details: this.item_list_modal,
    };

    if (customerInfo.customerId == null) {
      return this.$swal("경고", "거래처를 선택해주세요.", "error");
    }

    if (_.filter(customerInfo.details, { storageId: 0 }).length != 0) {
      return this.$swal(
        "경고",
        "품목중 창고 선택이 안된 품목이 있습니다.",
        "error"
      );
    }

    if (_.filter(customerInfo.details, { orderCount: 0 }).length != 0) {
      return this.$swal(
        "경고",
        "품목중 주문수량 입력이 안된 품목이 있습니다.",
        "error"
      );
    }

    let check_orderCount = false;
    customerInfo.details.forEach(
      (el: { orderCount: any; normalCount: any; defectCount: any }) => {
        if (
          parseInt(el.orderCount) <
          parseInt(el.normalCount) + parseInt(el.defectCount)
        ) {
          check_orderCount = true;
        }
      }
    );

    if (check_orderCount) {
      return this.$swal(
        "경고",
        "품목중 주문 수량이 잘못 입력된 품목이 있습니다.",
        "error"
      );
    }


    //details에서 date를 빼서 receive_date로 바꾸기

    let newCustomerInfo: object = {
      customerId: customerInfo.customerId,
      receive_date: customerInfo.details[0].receive_date,
      details: customerInfo.details
    }
















    console.log("생성", customerInfo);
    api.rawWarehousing
      .createWarehousingData(newCustomerInfo)
      .then((response) => {
        console.log("createCustomerItem", response);

        if (response.data.isSuccess) {
          this.$swal({
            title: "저장되었습니다.",
            icon: "success",
            position: "top",
            showCancelButton: false,
            showConfirmButton: false,
            toast: true,
            timer: 1500,
          });
          this.closeModal_customer();
          //this.getCustomer(); emit
        } else {
          this.$swal({
            title: "저장이 실패되었습니다.",
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
        this.$swal({
          title: "저장이 실패되었습니다.",
          icon: "error",
          position: "top",
          showCancelButton: false,
          showConfirmButton: false,
          toast: true,
          timer: 1500,
        });
      });
    this.closeModal_customer();
  }

  deleteItem_modal(item: object) {
    let deleteIndex = this.item_list_modal.indexOf(item);
    console.log("deleteItem_pop", deleteIndex, item);

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
          this.item_list_modal.splice(deleteIndex, 1);
        }
      });
  }

  deleteDetailItem_pop(item: any, index: any) {
    const detailindex = this.item_list_modal.findIndex((object) => {
      return object.itemId === item.itemId;
    });
    console.log(item, index, detailindex);
    this.item_list_modal[detailindex].eachCount.splice(index, 1);
    let sumData = _.sumBy(this.item_list_modal[detailindex].eachCount, "count");
    this.item_list_modal[detailindex].normalCount = sumData;
  }

  closeModal_customer() {
    //this.edit_customer = false;
    //this.itemInfo = Object.assign({}, this.itemInfo_default);
    // this.$nextTick(() => {
    //   this.item_list_modal = [];
    //   this.editedCustomer = Object.assign({}, this.customer);
    //   this.editedIndex = -1;
    // });
    // this.customer = {
    //   companyId: "",
    //   name: "",
    // };
    this.itemInfo = Object.assign({}, cfg.data.inputDefaultData_item);
    this.item_list_modal = [];
    this.editedCustomer.customerId = 0;
    this.$emit("closeModal");
  }

  editItem() {
    api.rawWarehousing
      .getWarehousingData()
      .then((response) => {
        console.log("getWarehousingData", response);
        // this.company_list = response.data.responseData.basicCompanies;
        this.customer_list = response.data.responseData.basicCustomers;
        this.storage_list = response.data.responseData.basisStorages;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getCutomerItem() {
    this.itemInfo.count = 0;
    let reqData = {
      customerId: this.editedCustomer.customerId,
    };
    api.warehousingPrice
      .getWarehousingCustomerItemData(reqData)
      .then((response) => {
        console.log("getWarehousingData", response);
        this.item_list = response.data.responseData;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  saveOrderCount(item: any) {
    console.log(item);
    item.defectCount = parseInt(item.orderCount) - parseInt(item.normalCount);
    if (
      parseInt(item.orderCount) <
      parseInt(item.normalCount) + parseInt(item.defectCount)
    ) {
      this.$swal("경고", "주문수량을 다시 입력해주세요!", "error");
      return item;
    }

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
      let resultData: any = _.filter(this.storage_list, {
        id: data.item.storageId,
      })[0];
      return resultData.storageLocations;
    }
  }

  add_item() {
    console.log('추가할 품목의 데이터', this.itemInfo.receive_date)
    if (this.itemInfo.receive_date == '') {
      return this.$swal("경고", "납품일자를 입력해주세요", "error");
    }

    if (this.itemInfo.itemId == "") {
      return this.$swal("경고", "품목을 선택해주세요!", "error");
    }

    if (this.itemInfo.count == 0) {
      return this.$swal("경고", "수량을 입력해주세요", "error");
    }





    let add_ItemData: any = _.cloneDeep(this.itemInfo);

    console.log(
      "add_item",
      _.find(this.item_list, { itemId: this.itemInfo.itemId })
    );
    if (
      _.filter(this.item_list_modal, { itemId: this.itemInfo.itemId }).length ==
      0
    ) {
      let itemName_find: any = _.find(this.item_list, {
        itemId: this.itemInfo.itemId,
      });

      add_ItemData.name = itemName_find.itemName;
      add_ItemData.normalCount = this.itemInfo.count;

      add_ItemData.eachCount.push({ count: parseInt(this.itemInfo.count) });

      this.item_list_modal.push(add_ItemData);
    } else {
      let chaneData = _.find(this.item_list_modal, {
        itemId: add_ItemData.itemId,
      });
      const index = this.item_list_modal.findIndex((object) => {
        return object.itemId === add_ItemData.itemId;
      });

      console.log("index", index, this.item_list_modal[index]);

      this.item_list_modal[index].eachCount.push({
        count: parseInt(add_ItemData.count),
      });

      let sumData = _.sumBy(this.item_list_modal[index].eachCount, "count");
      this.item_list_modal[index].normalCount = sumData;

      console.log(chaneData, index);
    }
    //this.itemInfo = Object.assign({}, this.itemInfo_default);
    this.itemInfo.eachCount = [];
  }
}
</script>
