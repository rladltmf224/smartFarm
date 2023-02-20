<template>
    <div>
        <v-container fluid>
            <v-row no-gutters>
                <v-col class="ma-2" md="12">
                    <h4 class="searchbox-title">조회 조건</h4>
                    <v-sheet class="pa-3" color="#F6F8F9" height="80" elevation="2">
                        <v-row no-gutters class="d-flex align-center">
                            <v-col cols="10">
                                <v-row>
                                    <v-col cols="2">
                                        <v-text-field label="수주번호" v-model="search_condition.orderInfoCode"
                                            dense></v-text-field>
                                    </v-col>
                                    <v-col cols="2">
                                        <v-text-field label="거래처명" v-model="search_condition.customerName"
                                            dense></v-text-field>
                                    </v-col>
                                    <v-col cols="2">
                                        <v-menu ref="order_startDate" v-model="order_startDate"
                                            :close-on-content-click="false"
                                            :return-value.sync="search_condition.order_startDate"
                                            transition="scale-transition" offset-y min-width="auto">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field v-model="search_condition.order_startDate" label="수주시작일"
                                                    prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"
                                                    dense></v-text-field>
                                            </template>
                                            <v-date-picker v-model="search_condition.order_startDate" no-title scrollable
                                                locale="ko-KR" :max="search_condition.order_endDate">
                                                <v-spacer></v-spacer>
                                                <v-btn text color="primary" @click="order_startDate = false">
                                                    취소
                                                </v-btn>
                                                <v-btn text color="primary" @click="
                                                    s_date_search_order(
                                                        search_condition.order_startDate
                                                    )
                                                ">
                                                    확인
                                                </v-btn>
                                            </v-date-picker>
                                        </v-menu>
                                    </v-col>
                                    <v-col md="2">
                                        <v-menu ref="order_endDate" v-model="order_endDate" :close-on-content-click="false"
                                            :return-value.sync="search_condition.order_endDate"
                                            transition="scale-transition" offset-y min-width="auto">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field v-model="search_condition.order_endDate" label="수주종료일"
                                                    prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"
                                                    dense></v-text-field>
                                            </template>
                                            <v-date-picker v-model="search_condition.order_endDate" no-title scrollable
                                                locale="ko-KR" :min="search_condition.order_startDate">
                                                <v-spacer></v-spacer>
                                                <v-btn text color="primary" @click="order_endDate = false">
                                                    취소
                                                </v-btn>
                                                <v-btn text color="primary" @click="
                                                    e_date_search_order(search_condition.order_endDate)
                                                ">
                                                    확인
                                                </v-btn>
                                            </v-date-picker>
                                        </v-menu>
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-col class="text-right align-self-center" cols="2">
                                <v-btn color="primary" x-large @click="getOrderAccounts()">
                                    조회
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-sheet>
                </v-col>
            </v-row>
            <v-row no-gutters>
                <v-col class="ma-2" md="12">
                    <v-row class="mb-1 ">
                        <v-col md="2">
                            <h4 class="searchbox-title">수주 목록</h4>
                        </v-col>
                        <v-col class="text-right" offset-md="7" md="3">
                            <v-btn small color="primary" @click="add()"><v-icon left> mdi-book-account </v-icon>수주
                                등록</v-btn>
                        </v-col>
                    </v-row>
                    <v-data-table height="690" :headers="headers" :items="customer_list" item-key="barcode"
                        class="elevation-4" :search="search" multi-sort fixed-header dense :options.sync="options"
                        :server-items-length="totalCount" :loading="loading" :items-per-page="itemsPerPage"
                        :page.sync="page" @page-count="pageCount = $event" hide-default-footer>
                        <template v-slot:item.edit="{ item }">
                            <v-icon small class="mr-2" @click="editItem(item, (customerDialog_type = false))">
                                mdi-pencil
                            </v-icon>
                        </template>
                        <template v-slot:item.detail="{ item }">
                            <v-btn icon>
                                <v-icon small>mdi-magnify</v-icon>
                            </v-btn>
                        </template>
                        <template v-slot:item.delete="{ item }">
                            <v-btn icon @click="deleteItem(item)">
                                <v-icon small class="mr-2"> mdi-trash-can-outline </v-icon>
                            </v-btn>
                        </template>
                    </v-data-table>
                    <v-row class="py-3">
                        <v-col>
                            <v-pagination v-model="page" :length="pageCount"></v-pagination>
                        </v-col>
                    </v-row>

                </v-col>
            </v-row>
        </v-container>
        <!-- 거래처 생성 모달 -->
        <OrderManagementModal :open="orderDialog" :orderInfoId="orderInfoId" :orderInfo="orderInfo" :change="change"
            :editedCustomerData="editedOrder" @closeModal="closeModal">
        </OrderManagementModal>
    </div>
</template>

<script lang="ts">
import * as api from "@/api";
import util from "@/util";
import cfg from "./index";
import { gridCfg } from "@/util/config";
import OrderManagementModal from "./OrderManagementModal.vue";
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
        OrderManagementModal,
    },
})
export default class Customer extends Vue {
    //@Ref() startDataEL: HTMLHtmlElement;
    orderDialog: boolean = false;
    editedOrder: any = {
        name: "", //작업지시서명
        customer: "", //거래처ID
        department: "", //부서
        departmentchargeName: "", //담당자
        deadline: "", //마감일
        memo: "", //메모
        details: [], //추가한 품목 목록
    };
    // 2023-01-12
    search_condition: any = {
        customerName: "",
        orderInfoCode: "",
        order_startDate: "",
        order_endDate: "",
        delivery_startDate: "",
        delivery_endDate: "",
    };
    totalCount: number = 0;
    pageCount: number = 0;
    page: number = 1;
    size: number = 10;
    options: any = {};
    order_startDate: boolean = false;
    order_endDate: boolean = false;
    delivery_startDate: boolean = false;
    delivery_endDate: boolean = false;
    orderInfo: [] = []; // 수주정보상세조회 orderInfo
    orderInfoId: number = 0; // 수주정보상세조회 orderInfoId

    // 2023-01-12
    change: boolean = false;
    customerDialog: boolean = false;
    customerDialog_type: boolean = false;
    loading: boolean = false;
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
    editedIndex: number = -1;
    customer_list: [] = [];

    @Watch("edit_customer")
    onEditCustomerChange(val: object) {
        return val || this.closeModal_customer();
    }

    @Watch("options", { deep: true })
    onOptionChange() {
        this.getOrderAccounts();
    }

    get headers() {
        //data-table의 header를 가져온다.
        return cfg.header.orderList;
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
    deleteItem(item: any) {
        this.$swal
            .fire({
                title: "삭제",
                text: "해당 수주를 삭제하시겠습니까?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "삭제",
            })
            .then((result) => {
                if (result.isConfirmed) {
                    let id = {
                        orderInfoId: item.orderInfoId,
                    };
                    api.order.deleteOrderInfo(id).then((res) => {
                        console.log("수주 정보 삭제 성공");
                        this.$swal({
                            title: "삭제되었습니다.",
                            icon: "info",
                            position: "top",
                            showCancelButton: false,
                            showConfirmButton: false,
                            toast: true,
                            timer: 1500,
                        });
                        this.getOrderAccounts();
                    });
                }
            });
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
        this.orderInfoId = 0;
        this.orderDialog = false;
        this.editedCustomer = Object.assign({}, this.customer);
        this.getOrderAccounts();
    }
    s_date_search_order(v: any) {
        this.search_condition.order_startDate = v;
        this.order_startDate = false;
        let startDate: any = this.$refs.order_startDate;
        startDate.save(v);
    }

    s_date_search_delivery(v: any) {
        this.search_condition.delivery_startDate = v;
        this.delivery_startDate = false;
        let startDate: any = this.$refs.delivery_startDate;
        startDate.save(v);
    }

    e_date_search_order(v: any) {
        this.search_condition.order_endDate = v;
        this.order_endDate = false;
        let endDate: any = this.$refs.order_endDate;
        endDate.save(v);
    }

    e_date_search_delivery(v: any) {
        this.search_condition.delivery_endDate = v;
        this.delivery_endDate = false;
        let endDate: any = this.$refs.delivery_endDate;
        endDate.save(v);
    }
    selectCustomer(data: object) {
        console.log("selectCustomer", data);
    }
    /*  getCustomer() {
         // 수주 정보 조회
         this.loading = true;
         let item = {
             customerName: this.search_condition.customerName, //거래처명
             orderInfoCode: this.search_condition.orderInfoCode, // 수주 코드
             orderDate: "", // 수주 일자
             page: this.page, // 페이징 기능
             size: this.size, // 페이징 기능
             sortBy: [], // 정렬 기능
             sortDesc: [false], // 정렬 기능
         };
         api.order.getOrderInfo(item).then((res: any) => {
             this.loading = false;
             this.customer_list = res.data.responseData;
             console.log("수주 정보 조회 성공", res);
         });
     } */
    getOrderAccounts() {
        console.log('getAccounts')
        const { page, itemsPerPage, sortBy, sortDesc } = this.options;
        this.loading = true;
        let item = {
            code: this.search_condition.orderInfoCode,
            startDate: this.search_condition.order_startDate,
            endDate: this.search_condition.order_endDate,
            memo: this.search_condition.memo,
            customer_name: this.search_condition.customerName,
            page: page,
            size: itemsPerPage,
            sortBy: sortBy,
            sortDesc: sortDesc,
        };
        api.order.getAccounts(item).then((res: any) => {
            this.loading = false;
            this.customer_list = res.data.responseData;
            this.totalCount = res.data.totalCount;
            console.log("수주 정보 조회 성공", res);
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
        this.orderDialog = true;
        // this.editedIndex = this.customer_list.indexOf(JSON.stringify(item));
        this.change = true;
        this.orderInfoId = item.orderInfoId;
        this.orderInfo = item;
        //this.editedCustomer = Object.assign({}, item);
        // this.customerDialog_type = edit_type;
        // this.edit_customer = true;
    }

    add() {
        this.orderDialog = true;
        this.change = false;
        // this.editedOrder = {
        //     name: "",
        //     customer: "",
        //     department: "",
        //     departmentchargeName: "",
        //     deadline: "",
        //     memo: "",
        //     details: [],
        // };
    }
}
</script>

<style src="./OrderManagement.scss" lang="scss"></style>
