<template>
    <div>
        <v-container fluid>
            <v-app-bar elevation="0" dense rounded><v-app-bar-nav-icon> </v-app-bar-nav-icon>
                <v-toolbar-title>
                    <v-btn elevation="0" rounded>
                        <span>수주관리</span>
                    </v-btn>
                </v-toolbar-title>
                <v-spacer></v-spacer>
                </v-toolbar-title>
                <v-btn elevation="0" rounded>
                    <span>김이슬님</span>
                    <v-badge bordered bottom color="red" dot offset-x="10" offset-y="10">
                        <v-avatar size="30" class="mx-2">
                            <v-img src="https://cdn.vuetifyjs.com/images/lists/2.jpg"></v-img>
                        </v-avatar>
                    </v-badge>
                </v-btn>
            </v-app-bar>
            <v-row dense>
                <v-col>
                    <v-card class="white" height="85" rounded elevation="2">
                        <v-container class=" d-flex align-center">
                            <v-col cols="12" md="2">
                                <v-text-field prepend-inner-icon="mdi-magnify" color="green" outlined dense label="Search"
                                    hide-details="auto" filled></v-text-field>
                            </v-col>
                            <v-col cols="12" md="2">
                                <v-autocomplete class="text-green" color="green" hide-details dense outlined
                                    label="구역항목"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" md="2">
                                <v-autocomplete dense outlined color="green" hide-details label="시작일"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" md="2">
                                <v-autocomplete dense hide-details color="green" outlined label="종료일"></v-autocomplete>
                            </v-col>
                            <v-spacer></v-spacer>
                            <v-btn class=" btn-gradient btn-glow" color="green" dark> 조회</v-btn>
                        </v-container>
                    </v-card>
                </v-col>
            </v-row>
            <!--     <v-form v-model="valid">
                <v-container>
                    <v-row class="d-flex align-center">
                        <v-col cols="12" md="2">
                            <v-text-field prepend-inner-icon="mdi-magnify" color="green" outlined dense label="Search"
                                hide-details="auto" filled></v-text-field>
                        </v-col>
                        <v-col cols="12" md="2">
                            <v-autocomplete class="text-green" color="green" hide-details dense outlined
                                label="구역항목"></v-autocomplete>
                        </v-col>
                        <v-col cols="12" md="2">
                            <v-autocomplete dense outlined color="green" hide-details label="시작일"></v-autocomplete>
                        </v-col>
                        <v-col cols="12" md="2">
                            <v-autocomplete dense hide-details color="green" outlined label="종료일"></v-autocomplete>
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-btn class=" btn-gradient btn-glow" color="green" dark> 조회</v-btn>
                    </v-row>
                </v-container>
            </v-form> -->

            <v-row>
                <v-col>
                    <v-card rounded elevation="2" class="white">
                        <v-data-table height="700" :headers="headers" :items="customer_list" multi-sort fixed-header
                            :options.sync="options" :server-items-length="totalCount" :loading="loading"
                            :items-per-page="itemsPerPage" :page.sync="page" @page-count="pageCount = $event"
                            hide-default-footer>
                            <!-- 상세수정 -->
                            <template v-slot:item.edit="{ item }">
                                <v-btn dark elevation="0" fab x-small color="green" @click="dialog = true">
                                    <v-icon small>mdi-pencil</v-icon>
                                </v-btn>
                            </template>
                            <!-- 수주일자 -->
                            <template v-slot:item.orderDate="props">
                                <v-menu :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field hide-details="" color="green" v-model="props.item.orderDate" readonly
                                            v-bind="attrs" dense v-on="on"></v-text-field>
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
                                <v-btn outlined color=" grey" elevation="0" fab x-small @click="confirm = true">
                                    <v-icon small>mdi-trash-can-outline</v-icon>
                                </v-btn>
                            </template>
                        </v-data-table>
                        <!-- 페이지네이션 -->
                        <v-row class="py-3">
                            <v-col>
                                <v-pagination v-model="page" :length="pageCount" circle color="green"></v-pagination>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>

            <v-row justify="center">
                <v-dialog v-model="dialog" persistent max-width="400px">
                    <v-card class="rounded-card">
                        <v-card-title>
                            <span class="text-h5">신규 테스트 등록</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row> <v-col cols="12">
                                        <v-text-field outlined hide-details="" color="green" label="실험명*" dense
                                            required></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                        <v-autocomplete dense outlined color="green" hide-details
                                            label="개체수"></v-autocomplete>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                        <v-autocomplete dense outlined color="green" hide-details
                                            label="처치구수"></v-autocomplete>
                                    </v-col>

                                    <v-col cols="12">
                                        <v-sheet outlined max-height="300px" style="overflow:auto">
                                            <v-text-field outlined hide-details="" color="green" label="1번 처치구명" dense
                                                required></v-text-field>
                                        </v-sheet>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-text-field outlined hide-details="" height="100" color="green" label="비고(메모)"
                                            dense required></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn class=" btn-gradient-cancel btn-glow" color="grey" @click="dialog = false">
                                취소</v-btn>
                            <v-btn class=" btn-gradient btn-glow" color="green" dark @click="dialog = false">등록</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-row>
            <v-row justify="center">
                <v-dialog v-model="confirm" persistent max-width="500px">
                    <v-card class="rounded-card">
                        <v-card-title class="d-flex justify-center ">
                            <span class="text-h6">삭제하시겠습니까?</span>
                        </v-card-title>
                        <v-card-actions class="d-flex justify-center ">
                            <v-btn class=" btn-gradient-cancel btn-glow" color="grey" dark @click="confirm = false">
                                취소</v-btn>
                            <v-btn class=" btn-gradient btn-glow" color="green" dark @click="confirm = false">확인</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-row>
        </v-container>
    </div>
</template>

<script lang="ts">
import * as api from "@/api";
import util from "@/util";
import cfg from "./index";
import { gridCfg } from "@/util/config";
import OrderManagementModal from "./OrderManagementModal.vue";
import HeaderBox from "./HeaderBox.vue";
import "@/util/filters";
import { Vue, Component, Watch } from "vue-property-decorator";
@Component({
    components: {
        OrderManagementModal,
        HeaderBox
    },
})
export default class Customer extends Vue {
    //@Ref() startDataEL: HTMLHtmlElement;
    confirm: boolean = false;
    dialog: boolean = false;
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

<style lang="css">
.btn {
    font-family: 'DM Sans', sans-serif;
    font-size: 18px;
    padding: 12px 32px;
    margin: 1rem;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.3s ease;
    border-radius: 50px;
}

.btn:hover {
    transition: all 0.3s ease;
}

.btn-primary {
    background-color: rgb(var(--primary-color));
    border: 1px solid rgb(var(--primary-color));
    color: rgb(var(--text-color));
}

/* https://thegraph.com/en/ */
.btn-semi-transparent {
    background-color: rgba(var(--primary-color), 0.15);
    border: 1px solid rgba(var(--primary-color), 0.25);
    color: rgba(var(--text-color), 0.8);
}

.btn-semi-transparent:hover {
    background-color: rgba(var(--primary-color), 0.35);
    border: 1px solid rgba(var(--primary-color), 0.5);
    color: rgba(var(--text-color), 0.9);
}

.btn-glow:hover {
    box-shadow: rgba(var(--primary-color), 0.5) 0px 0px 20px 0px;
}

/* https://sushi.com/ */
.btn-gradient {
    background-image: linear-gradient(to right, rgb(153, 218, 1), rgb(49, 182, 56));
    border: 0;
    color: rgba(var(--text-color));
}

.btn-gradient-cancel {
    background-image: linear-gradient(to right, rgb(217 217 217), rgb(179 170 170));
    border: 0;
    color: rgba(var(--text-color));
}



/* https://sushi.com/ */
.btn-gradient-border {
    color: rgba(var(--text-color));
    border: 2px double transparent;
    background-image: linear-gradient(rgb(13, 14, 33), rgb(13, 14, 33)), radial-gradient(circle at left top, rgb(1, 110, 218), rgb(217, 0, 192));
    background-origin: border-box;
    background-clip: padding-box, border-box;
}


/* data-table 행 mouse hover 시 컬러 */
.v-data-table tbody tr:hover:not(.v-data-table__expanded__content) {
    background: #f6fff3 !important;
}

.v-data-table-header {
    height: 40px;
}

/* text-field 흰색으로 채움 */
.v-input {
    background: white;
}

/* text-field 흰색으로 채움 */
.v-text-field--filled.v-input--dense.v-text-field--single-line>.v-input__control>.v-input__slot,
.v-text-field--filled.v-input--dense.v-text-field--outlined>.v-input__control>.v-input__slot,
.v-text-field--filled.v-input--dense.v-text-field--outlined.v-text-field--filled>.v-input__control>.v-input__slot,
.v-text-field--full-width.v-input--dense.v-text-field--single-line>.v-input__control>.v-input__slot,
.v-text-field--full-width.v-input--dense.v-text-field--outlined>.v-input__control>.v-input__slot,
.v-text-field--full-width.v-input--dense.v-text-field--outlined.v-text-field--filled>.v-input__control>.v-input__slot,
.v-text-field--outlined.v-input--dense.v-text-field--single-line>.v-input__control>.v-input__slot,
.v-text-field--outlined.v-input--dense.v-text-field--outlined>.v-input__control>.v-input__slot,
.v-text-field--outlined.v-input--dense.v-text-field--outlined.v-text-field--filled>.v-input__control>.v-input__slot {
    background: white;
}

/* pagination 버튼 배경색 */
.v-application .green {
    background-image: linear-gradient(to right, rgb(153, 218, 1), rgb(49, 182, 56)) !important;
}

/* data-table 삭제 버튼 배경색 */
.delete {
    background-image: linear-gradient(to right, rgb(161, 161, 161), rgb(109, 109, 109)) !important;
}

/* 다이아로그 라운드니스 */
.v-sheet.v-card {
    border-radius: 12px;
    background-color: #F2F3F8;
}
</style>
