<template>
    <div>
        <v-container fluid>
            <!-- 조회조건 -->
            <v-row no-gutters>
                <v-col class="ma-2" md="12">
                    <h4 class="searchbox-title">조회 조건</h4>
                    <v-sheet class="pa-3" height="80" elevation="2">
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
                                    <v-col cols="3">
                                        <v-text-field label="요청사항" v-model="search_condition.memo" dense></v-text-field>
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

            <!--  <Header></Header> -->


            <!-- 수주목록 -->
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
                    <!-- 수주 목록 테이블 -->
                    <v-card>


                        <v-data-table height="637" :headers="headers" :items="customer_list" :search="search" multi-sort
                            fixed-header dense :options.sync="options" :server-items-length="totalCount" :loading="loading"
                            :items-per-page="itemsPerPage" :page.sync="page" @page-count="pageCount = $event"
                            hide-default-footer>
                            <!-- 상세수정 -->
                            <template v-slot:item.edit="{ item }">
                                <div class="d-flex justify-center">
                                    <v-icon small class="mr-2" @click="editItem(item, (customerDialog_type = false))">
                                        mdi-pencil
                                    </v-icon>
                                </div>
                            </template>
                            <!-- 수주일자 -->
                            <template v-slot:item.orderDate="props">
                                <v-menu :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field v-model="props.item.orderDate" readonly v-bind="attrs" dense
                                            v-on="on"></v-text-field>
                                    </template>
                                    <v-date-picker @change="editTableOrderInfo(props.item)" no-title locale="ko-KR"
                                        v-model="props.item.orderDate"></v-date-picker>
                                </v-menu>
                            </template>
                            <!-- 요청사항 -->
                            <template v-slot:item.memo="props">
                                <v-edit-dialog :return-value.sync="props.item.memo" large persistent
                                    @save="editTableOrderInfo(props.item)" cancel-text="취소" save-text="수정">
                                    <div>{{ props.item.memo }}</div>
                                    <template v-slot:input>
                                        <div class="mt-4 title">Update Iron</div>
                                    </template>
                                    <template v-slot:input>
                                        <v-text-field v-model="props.item.memo" label="Edit" single-line
                                            autofocus></v-text-field>
                                    </template>
                                </v-edit-dialog>
                            </template>
                            <!-- 수주삭제 -->
                            <template v-slot:item.delete="{ item }">
                                <div class="d-flex justify-center">
                                    <v-btn icon @click="deleteItem(item)">
                                        <v-icon small class="mr-2"> mdi-trash-can-outline </v-icon>
                                    </v-btn>
                                </div>
                            </template>
                        </v-data-table>
                        <!-- 페이지네이션 -->
                        <v-row class="py-3">
                            <v-col>
                                <v-pagination circle v-model="page" :length="pageCount"></v-pagination>
                            </v-col>
                        </v-row>
                    </v-card>
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
import Header from '@/components/Layout/Header.vue'
@Component({
    components: {
        OrderManagementModal, Header
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
    menu_orderDate: boolean = false; //수주일자 datepicker
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
    itemsPerPage: number = 13;
    page: number = 1;
    size: number = 20;
    options: any = {};
    order_startDate: boolean = false;
    order_endDate: boolean = false;
    delivery_startDate: boolean = false;
    delivery_endDate: boolean = false;
    orderInfo: [] = []; // 수주정보상세조회 orderInfo
    orderInfoId: number = 0; // 수주정보상세조회 orderInfoId
    editedMemo: string = ''
    change: boolean = false;
    customerDialog: boolean = false;
    customerDialog_type: boolean = false;
    loading: boolean = false;
    customerOption: any = {};
    customer_type: object[] = [];
    edit_customer: boolean = false;
    selected: [] = [];
    search: string = "";
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

    deleteItem(item: any) {
        this.$swal
            .fire({
                title: "삭제",
                text: "해당 수주를 삭제하시겠습니까?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "예",
                cancelButtonText: "아니오",
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
    editTableOrderInfo(item: any) { //수주 즉시 수정 
        let param: any = {
            orderInfoId: item.orderInfoId,
            orderDate: item.orderDate,
            memo: item.memo
        }
        api.order.editOrderInfo(param).then((res) => {
            if (res.status == 200) {
                console.log('수주 즉시 수정 성공', res)
                this.swalSuccess()
                this.getOrderAccounts()
            } else {
                this.swalFail()
            }
        })
    }
    swalSuccess() {
        this.$swal({
            title: "수정되었습니다.",
            icon: "success",
            position: "top",
            showCancelButton: false,
            showConfirmButton: false,
            toast: true,
            timer: 1500,
        });
    }

    swalFail() {
        this.$swal({
            title: "조회에 실패하였습니다.",
            icon: "error",
            position: "top",
            showCancelButton: false,
            showConfirmButton: false,
            toast: true,
            timer: 1500,
        });
    }

    closeModal() {
        this.orderInfoId = 0;
        this.orderDialog = false;
        this.editedCustomer = Object.assign({}, this.customer);
        this.getOrderAccounts();
    }
    date(v: any) { //수주일자
        //this.order.orderDate = v;
        this.menu_orderDate = false;
        let orderDate: any = this.$refs.menu_orderDate;
        orderDate.save(v);
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
    getOrderAccounts() {
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
            if (res.status == 200) {
                this.customer_list = res.data.responseData;
                this.totalCount = res.data.totalCount;
            } else {
                this.$swal.fire("오류", "조회에 실패하였습니다.", "error");
            }
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
    }
}
</script>

<style src="../SmartFarm.scss" lang="scss"></style>
