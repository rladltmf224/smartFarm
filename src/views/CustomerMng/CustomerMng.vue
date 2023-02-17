<template>
  <div>
    <v-container fluid>
      <v-row no-gutters>
        <v-col class="ma-2" md="12">
          <h4 class="searchbox-title">조회 조건</h4>
          <v-sheet class="pa-3" color="#F6F8F9" height="120" elevation="2">
            <v-row no-gutters>
              <v-col cols="10">
                <v-row>
                  <v-col cols="2">
                    <v-select :items="search_list1" label="선택" v-model="search_type_1" item-text="name" item-value="value"
                      dense></v-select>
                  </v-col>

                  <v-col cols="2">
                    <v-text-field label="검색어1" v-model="search_text_1" @keydown.enter="getCustomer" dense></v-text-field>
                  </v-col>
                  <v-col cols="2">
                    <v-select :items="search_list2" label="선택" v-model="search_type_2" item-text="name" item-value="value"
                      dense></v-select>
                  </v-col>

                  <v-col cols="2">
                    <v-text-field label="검색어2" v-model="search_text_2" @keydown.enter="getCustomer" dense></v-text-field>
                  </v-col>
                  <v-col cols="2">
                    <v-select :items="customer_type" label="거래처 유형" v-model="search_condition.type" item-text="name"
                      item-value="value" @change="getCustomer" dense></v-select>
                  </v-col>
                  <v-col cols="1">
                    <v-select :items="search_list3" label="사용여부" v-model="search_condition.isValid" item-text="name"
                      item-value="value" @change="getCustomer" dense></v-select>
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col cols="2">
                    <v-menu ref="startDate" v-model="startDate" :close-on-content-click="false"
                      :return-value.sync="search_condition.startDate" transition="scale-transition" offset-y
                      min-width="auto">
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field v-model="search_condition.startDate" label="시작일" prepend-icon="mdi-calendar"
                          readonly v-bind="attrs" v-on="on" dense></v-text-field>
                      </template>
                      <v-date-picker v-model="search_condition.startDate" no-title scrollable locale="ko-KR"
                        :max="search_condition.endDate">
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="startDate = false">
                          취소
                        </v-btn>
                        <v-btn text color="primary" @click="s_date_search(search_condition.startDate)">
                          확인
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col md="2">
                    <v-menu ref="endDate" v-model="endDate" :close-on-content-click="false"
                      :return-value.sync="search_condition.endDate" transition="scale-transition" offset-y
                      min-width="auto">
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field v-model="search_condition.endDate" label="종료일" prepend-icon="mdi-calendar" readonly
                          v-bind="attrs" v-on="on" dense></v-text-field>
                      </template>
                      <v-date-picker v-model="search_condition.endDate" no-title scrollable locale="ko-KR"
                        :min="search_condition.startDate">
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="endDate = false">
                          취소
                        </v-btn>
                        <v-btn text color="primary" @click="e_date_search(search_condition.endDate)">
                          확인
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
              </v-col>
              <v-col class="text-right align-self-center" cols="2">
                <v-btn color="primary" x-large @click="getCustomer">
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
              <h4 class="searchbox-title">출고 이력</h4>
            </v-col>
            <v-col class="text-right" offset-md="7" md="3">
              <v-btn small color="primary" @click="(customerDialog = true), (customerDialog_type = true)"><v-icon left>
                  mdi-book-account </v-icon>거래처 추가</v-btn>
              <!-- <v-btn class="ml-4" small color="primary"
                    ><v-icon left> mdi-microsoft-excel </v-icon>엑셀다운</v-btn
                  > -->
            </v-col>
          </v-row>

          <v-data-table height="640" :headers="headers" :items="customer_list" item-key="barcode" class="elevation-4"
            :search="search" multi-sort fixed-header dense :options.sync="customerOption.options"
            :server-items-length="customerOption.totalCount" :loading="customerOption.loading"
            :items-per-page="customerOption.itemsPerPage" :page.sync="customerOption.page"
            @page-count="customerOption.pageCount = $event" hide-default-footer>
            <template v-slot:item.contactPoint="props">
              {{ props.item.contactPoint | PhoneMask }}
            </template>
            <template v-slot:item.edit="{ item }">
              <v-icon small class="mr-2" @click="editItem(item, (customerDialog_type = false))">
                mdi-pencil
              </v-icon>
            </template>
          </v-data-table>
          <v-pagination v-model="customerOption.page" :length="customerOption.pageCount"></v-pagination>
        </v-col>
      </v-row>
    </v-container>
    <!-- 거래처 생성 모달 -->
    <CustomerModal :open="customerDialog" :editedIndex="customerDialog_type" :editedCustomerData="editedCustomer"
      @closeModal="closeModal" @save-customer="handlerSaveModal">
    </CustomerModal>
  </div>
</template>

<script lang="ts">
import * as api from "@/api";
import cfg from "./config/index";
import util from "@/util";
import { gridCfg } from "@/util/config";
import CustomerModal from "./CustomerModal.vue";
import "@/util/filters";
import { Vue, Component, Watch } from "vue-property-decorator";
// interface bomOpt {
//   options?: any;
//   page: any;
//   itemsPerPage: any;
//   sortBy?: any;
//   sortDesc?: any;
//   loading: boolean;
//   totalCount?: number;
//   pageCount?: number;
// }

@Component({
  components: {
    CustomerModal,
  },
})
export default class Customer extends Vue {
  //@Ref() startDataEL: HTMLHtmlElement;

  customerDialog: boolean = false;
  customerDialog_type: boolean = false;
  startDate: boolean = false;
  endDate: boolean = false;
  customerOption: any = {};
  customer_type: object[] = [];
  edit_customer: boolean = false;
  selected: [] = [];
  search: string = "";
  search_type_1: string = "";
  search_text_1: string = "";
  search_type_2: string = "";
  search_text_2: string = "";
  customer: object = {};
  editedCustomer: object = {
    id: "",
    name: "", //거래처 이름
    manager: "", //담당자
    contactPoint: "", //담당자 연락처
    type: "", //거래처 유형 (매입거래처, 매출거래처, 병합거래처, 기타거래처)
    businessRegisterNumber: "", //사업자 등록번호
    ownerName: "", //대표자명
    businessCondition: "", //업태
    businessCategory: "", //업종
    address: "", //주소
    englishAddress: "", //영문 주소
    emailAddress: "", //이메일
    telephone: "", //거래처 전화번호
    faxNumber: "", //팩스 번호
    isValid: "", //사용 여부
    memo: "", //비고
  };
  search_list1: object[] = [];
  search_list2: object[] = [];
  search_list3: object[] = [];
  search_list4: object[] = [];
  search_condition: any = {
    startDate: "",
    endDate: "",
    createdId: "",
    customer: "",
    type: "",
    business: "",
    isValid: "",
    memo: "",
  };
  editedIndex: number = -1;
  customer_list: [] = [];

  created() {
    this.customer = Object.assign({}, this.editedCustomer);
    this.search_list1 = cfg.data.search_list1;
    this.search_list2 = cfg.data.search_list2;
    this.search_list3 = cfg.data.search_list3;
    this.search_list4 = cfg.data.search_list3;
    this.customer_type = cfg.data.customer_type;
    this.customerOption = Object.assign({}, gridCfg);

    //console.log("startDataEL", this.startDataEL);
  }

  mounted() {
    console.log(util);
    this.getCustomer();
  }

  @Watch("edit_customer")
  onEditCustomerChange(val: object) {
    return val || this.closeModal_customer();
  }

  @Watch("customerOption.options", { deep: true })
  onOptionChange() {
    this.getCustomer();
  }

  get headers() {
    return cfg.header.customerList;
  }
  get formTitle() {
    return this.editedIndex === -1 ? "거래처 생성" : "거래처 수정";
  }

  handlerSaveModal(data: object, editedType: boolean) {
    if (!editedType) {
      api.customer
        .updateCustomerItem(data)
        .then((response) => {
          this.alertResult(response.data.isSuccess);
          this.closeModal();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      api.customer
        .createCustomerItem(data)
        .then((response) => {
          this.alertResult(response.data.isSuccess);
          this.closeModal();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
  alertResult(isSuccess: boolean) {
    if (isSuccess) {
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
  }
  closeModal() {
    this.customerDialog = false;
    this.editedCustomer = Object.assign({}, this.customer);
    this.getCustomer();
    console.log("closeModal");
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
  selectCustomer(data: object) {
    console.log("selectCustomer", data);
  }
  getCustomer() {
    if (this.search_type_1 != "") {
      this.search_condition.customer =
        this.search_type_1 + "-" + this.search_text_1;
    }
    if (this.search_type_2 != "") {
      this.search_condition.business =
        this.search_type_2 + "-" + this.search_text_2;
    }

    const { page, itemsPerPage, sortBy, sortDesc } =
      this.customerOption.options;
    this.search_condition.page = page;
    this.search_condition.size = itemsPerPage;
    this.search_condition.sortBy = sortBy;
    this.search_condition.sortDesc = sortDesc;
    this.customerOption.loading = true;
    console.log("customerOption", this.customerOption);

    api.customer
      .postCustomerList(this.search_condition)
      .then((response) => {
        console.log("postCustomerList", response);
        this.customer_list = response.data.responseData;
        this.customerOption.totalCount = response.data.totalCount;
        this.customerOption.loading = false;
      })
      .catch((error) => {
        console.log(error);
        this.customerOption.loading = false;
      });
  }

  closeModal_customer() {
    this.edit_customer = false;
    this.$nextTick(() => {
      this.editedCustomer = Object.assign({}, this.customer);
      this.editedIndex = -1;
    });
    this.customer = {
      code: "",
      contactPoint: "",
      manager: "",
      name: "",
    };
  }
  editItem(item: any, edit_type: boolean) {
    this.customerDialog = true;
    //this.editedIndex = this.customer_list.indexOf(JSON.stringify(item));
    this.editedCustomer = Object.assign({}, item);
    this.customerDialog_type = edit_type;
    this.edit_customer = true;
  }
}
</script>

<style src="./CustomerMng.scss" lang="scss"></style>
