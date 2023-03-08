<template>
  <div>
    <v-dialog v-model="open_prop" max-width="950px" persistent>
      <v-card>
        <v-card-title>
          <span>출하 등록</span>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="2" align-self="center">
              <v-select :items="customer_list" item-text="name" item-value="id" label="거래처"
                v-model="editedCustomer.customerId" dense></v-select>
            </v-col>
            <v-col cols="2" align-self="center">
              <v-text-field v-model="editedCustomer.requester" label="요청자" dense></v-text-field>
            </v-col>
            <v-col cols="3" align-self="center">
              <v-text-field v-model="editedCustomer.requesterContact" label="요청자 연락처" dense></v-text-field>
            </v-col>
            <v-col md="2">
              <v-menu ref="deadDate" v-model="deadDate" :close-on-content-click="false"
                :return-value.sync="editedCustomer.deadline" transition="scale-transition" offset-y min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="editedCustomer.deadline" label="마감일" prepend-icon="mdi-calendar" readonly
                    v-bind="attrs" v-on="on" dense></v-text-field>
                </template>
                <v-date-picker v-model="editedCustomer.deadline" no-title scrollable locale="ko-KR">
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="deadDate = false">
                    취소
                  </v-btn>
                  <v-btn text color="primary" @click="dead_date_search(editedCustomer.deadline)">
                    확인
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-row> </v-row>
          <v-row>
            <v-col cols="6">
              <h4>상세 품목</h4>
            </v-col>
            <v-col offset="4" cols="1" align-self="center" class="text-right">
              <v-btn color="primary" @click="openItemModal"> 품목 추가 </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-data-table height="300" :headers="headers_item" :items="item_list_modal" fixed-header item-key="barcode"
                class="elevation-4" multi-sort dense>
                <template v-slot:item.count="props">
                  {{ props.item.count | comma }}
                </template>
                <template v-slot:item.add="{ item }">
                  <v-btn small class="mr-2" @click="selectRawDetail(item)">
                    자재 추가
                  </v-btn>
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
    <ReleaseProductItemModal :open="item_modal" @addItem="addItem" @closeModal="closeItemModal">
    </ReleaseProductItemModal>
    <ReleaseOrderModal :open="add_rawModal" @addRaw="addRaw" @closeModal="closeRawDetail"></ReleaseOrderModal>
  </div>
</template>
<script lang="ts">
import cfg from "./config";
import _ from "lodash";
import * as api from "@/api";
import { Component, Vue, Prop } from "vue-property-decorator";
import ReleaseProductItemModal from "./ReleaseProductItemModal.vue";
import ReleaseOrderModal from "../ReleaseOrder/ReleaseOrderModal.vue";

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
    ReleaseProductItemModal,
    ReleaseOrderModal,
  },
})
export default class ReleaseProductAddModal extends Vue {
  customer_list: object[] = [];
  item_list_modal: object[] = [];
  item_modal: boolean = false;
  add_rawModal: boolean = false;
  editedCustomer: any = {
    customerId: 0,
    requester: "",
    requesterContact: "",
    deadline: "",
    details: [],
  };
  deadDate: boolean = false;

  @Prop({ required: true }) open: boolean;
  get open_prop() {
    this.getList();
    return this.open;
  }

  set open_prop(val: any) {
    this.$emit("closeModal");
  }

  get headers_item() {
    return cfg.header.headers_item;
  }

  openItemModal() {
    this.item_modal = true;
  }

  closeItemModal() {
    this.item_modal = false;
  }

  addRaw() { }

  addItem(data: object[]) {
    data.forEach((el: { id: number; name: string; code: string }) => {
      if (
        _.filter(this.item_list_modal, { productDetailId: el.id }).length == 0
      ) {
        this.item_list_modal.push({
          count: 0,
          productDetailId: el.id,
          name: el.name,
          code: el.code,
          details: [],
        });
      }
    });
  }
  getList() {
    api.productRelease
      .getReleaseProducCustomer()
      .then((response) => {
        console.log("getReleaseProducCustomer", response);
        this.customer_list = response.data.responseData;
      })
      .catch((error) => {
        console.log(error);
      });
    // api.productRelease
    //   .getReleaseProductItemList()
    //   .then((response) => {
    //     console.log("getReleaseProductItemList", response);
    //     this.item_list = response.data.responseData;
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  }

  dead_date_search(v: any) {
    this.editedCustomer.deadline = v;
    this.deadDate = false;
    let deadEL: any = this.$refs.deadDate;
    deadEL.save(v);
  }

  closeModal_customer() {
    this.open_prop = false;
  }
  closeRawDetail() {
    this.add_rawModal = false;
  }

  selectRawDetail(item: any) {
    // this.txtReleaseCount = item.count;
    // this.select_rawID = item.productDetailId;
    // if (item.details.length != 0) {
    //   this.selected = item.details;
    //   let sumData = 0;
    //   this.selected.forEach((el) => {
    //     sumData += parseInt(el.releaseCount);
    //   });
    //   this.txtSelectCount = sumData;
    // }

    let reqData = {
      item: item.name,
      check: 1,
    };
    console.log("reqData", reqData, item);
    api.productRelease
      .getReleaseProductStockList(reqData)
      .then((response) => {
        console.log("getReleaseRawDetailList", response);
        response.data.forEach((el: any) => {
          el.productDetailId = el.id;
          el.releaseCount = el.count;
        });

        this.add_rawModal = true;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  deleteItem_modal(item: any) {
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

  clickSaveInfo() {
    let customerInfo = this.editedCustomer;
    console.log("clickSaveCustomerInfo", customerInfo);

    if (
      this.editedCustomer.customerId == undefined ||
      this.editedCustomer.customerId == ""
    ) {
      return this.$swal("경고", "거래처를 선택해주세요.", "error");
    }

    if (
      this.editedCustomer.requester == undefined ||
      this.editedCustomer.requester == ""
    ) {
      return this.$swal("경고", "담당자를 입력해주세요.", "error");
    }

    if (
      this.editedCustomer.requesterContact == undefined ||
      this.editedCustomer.requesterContact == ""
    ) {
      return this.$swal("경고", "담당자 연락처를 입력해주세요.", "error");
    }

    if (
      this.editedCustomer.deadline == undefined ||
      this.editedCustomer.deadline == ""
    ) {
      return this.$swal("경고", "마감일를 입력해주세요.", "error");
    }

    if (this.item_list_modal.length == 0) {
      return this.$swal("경고", "출하할 품목을 등록해주세요", "error");
    }

    let check_item_count = false;
    customerInfo = {
      customerId: this.editedCustomer.customerId,
      requester: this.editedCustomer.requester,
      requesterContact: this.editedCustomer.requesterContact,
      deadline: this.editedCustomer.deadline,
      details: [],
    };
    this.item_list_modal.forEach((el: any) => {
      if (el.details.length != 0) {
        customerInfo.details.push(...el.details);
      }

      if (el.count == 0) {
        check_item_count = true;
      }
    });
    if (check_item_count) {
      return this.$swal("경고", "출하할 품목의 수량이 0이 있습니다.", "error");
    }
    console.log("생성", customerInfo);
    api.productRelease
      .createReleaseProductOrderData(customerInfo)
      .then((response) => {
        console.log("createCustomerItem", response);
        this.item_list_modal = [];
        this.closeModal_customer();
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
</script>
