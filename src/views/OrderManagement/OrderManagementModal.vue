<template>
    <v-dialog v-model="openModal" persistent max-width="1600px">
        <v-card class=" mx-auto " tile>
            <v-card-title class="text-h5" v-show="!change">
                수주 등록
            </v-card-title>
            <v-card-title class="text-h5" v-show="change">
                수주 수정
            </v-card-title>
            <v-card-text>
                <v-container id="dialogBox" max-width="1400px " fluid>
                    <v-row dense class="d-flex align-center">
                        <v-col cols="2" class="pa-0 pl-2 mr-2">
                            <v-menu tabindex="5" ref="menu_orderDate" v-model="menu_orderDate"
                                :close-on-content-click="false" :return-value.sync="menu_orderDate"
                                transition="scale-transition" offset-y min-width="auto">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field label="수주일자" v-model="order.orderDate" prepend-icon="mdi-calendar"
                                        readonly v-bind="attrs" dense v-on="on"></v-text-field>
                                </template>
                                <v-date-picker v-model="order.orderDate" no-title scrollable locale="ko-KR">
                                    <v-spacer></v-spacer>
                                    <v-btn text color="primary" @click="menu_orderDate = false">
                                        취소
                                    </v-btn>
                                    <v-btn text color="primary" @click="d_date_search_order(order.orderDate)">
                                        확인
                                    </v-btn>
                                </v-date-picker>
                            </v-menu>
                        </v-col>
                        <v-col cols="2" class="pa-0 pl-2 mr-2" v-show="change">
                            <v-text-field class="" label="수주번호" disabled v-model="order.orderNum"
                                tabindex="6"></v-text-field>
                        </v-col>

                        <v-col cols="2" class="pa-0 pl-2 mr-2">
                            <v-text-field class="" label="거래처" v-model="customerName" dense tabindex="6"></v-text-field>
                        </v-col>
                        <v-col cols="2" class="pa-0 pl-2 ">
                            <v-menu v-model="menuLoad" :close-on-content-click="false" :nudge-width="300" offset-x
                                max-height="600">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn class="mb-1" v-bind="attrs" v-on="on" small @click="getCustomer()">
                                        <v-icon class="pr-2" dense>
                                            mdi-cloud-download-outline
                                        </v-icon>
                                        불러오기
                                    </v-btn>
                                </template>
                                <v-card class="pa-3">
                                    <v-data-table :headers="datas_header_simple" :items="datas_simple" dense
                                        :items-per-page=100 item-key="name" class="elevation-1" :search="search"
                                        hide-default-footer height="300">

                                        <template v-slot:top>
                                            <v-text-field v-model="search" label="거래처명으로 검색" class="mx-4" dense
                                                append-icon="mdi-magnify"></v-text-field>
                                        </template>
                                        <template v-slot:item.customerName="{ item }">
                                            <v-btn @click="cloneItem(item)" class="ma-2" outlined color="indigo">
                                                {{ item.customerName }}
                                            </v-btn>
                                        </template>
                                    </v-data-table>
                                    </v-list-item>
                                    </v-list>
                                    <v-divider></v-divider>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn text @click="closeMenuLoadCard()">
                                            닫기
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-menu>
                        </v-col>
                    </v-row>
                    <v-sheet color="#F6F8F9" height="600">
                        <v-row v-if="!change" class="ma-0 d-flex ">
                            <v-col cols="12" class="d-flex " align-self="center">
                                <v-col cols="2">
                                    <h4 class="pl-2 mb-1">수주 품목 목록</h4>
                                    <v-data-table multi-sort disable-pagination hide-default-footer
                                        :header-props="{ sortIcon: null }" class="ml-2 mr-2  overflow-scroll elevation-4"
                                        show-select fixed-header v-model="selectedProduct" height="355"
                                        :headers="register_itemheaders" :items="itemData" return-object item-key="itemId"
                                        dense :items-per-page="50" v-show="!change">
                                        <template v-slot:top>
                                            <v-text-field v-model="searchItem" label="품목명으로 검색" class="mx-4 pt-2" dense
                                                @input="searchedItem()" append-icon="mdi-magnify"></v-text-field>
                                        </template>
                                        <template v-slot:no-data>
                                            <h5>품목이 없습니다.</h5>
                                        </template>
                                    </v-data-table>
                                </v-col>
                                <v-col cols="1" class="d-flex justify-center align-center">
                                    <v-btn small fluid color="primary" @click="plus">
                                        <v-icon>mdi-arrow-right-bold</v-icon>
                                    </v-btn>
                                </v-col>
                                <v-col cols="9">
                                    <h4 class="pl-2 mb-1">등록된 품목 목록</h4>
                                    <v-data-table multi-sort class="ml-2 mr-2 overflow-scroll elevation-4" fixed-header
                                        height="400" :headers="selectedheaders" :header-props="{ sortIcon: null }"
                                        :items="itemTable" return-object dense item-key="id" disable-pagination
                                        hide-default-footer dense>
                                        <template v-slot:item.quantity="props">
                                            <v-text-field class="pa-0 countFont"
                                                oninput="javascript: this.value = this.value.replace(/[^0-9]/g, '');"
                                                placeholder="*필수" v-model="props.item.quantity" single-line dense>
                                                {{ props.item.quantity }}
                                            </v-text-field>
                                        </template>
                                        <template v-slot:item.supplyUnitPrice="props">
                                            <v-text-field class="pa-0 countFont"
                                                oninput="javascript: this.value = this.value.replace(/[^0-9]/g, '');"
                                                placeholder="*단가" v-model="props.item.supplyUnitPrice" single-line dense>
                                                {{ props.item.supplyUnitPrice }}
                                            </v-text-field>
                                        </template>
                                        <template v-slot:item.expectedDeliveryDate="props">
                                            <v-menu :nudge-right="40" transition="scale-transition" offset-y
                                                min-width="auto">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-text-field v-model="props.item.expectedDeliveryDate"
                                                        prepend-icon="mdi-calendar" readonly v-bind="attrs" dense
                                                        v-on="on"></v-text-field>
                                                </template>
                                                <v-date-picker no-title
                                                    v-model="props.item.expectedDeliveryDate"></v-date-picker>
                                            </v-menu>
                                        </template>
                                        <template v-slot:item.memo="props">
                                            <v-text-field class="pa-0 countFont" placeholder="메모" v-model="props.item.memo"
                                                dense single-line>
                                                {{ props.item.memo }}
                                            </v-text-field>
                                        </template>
                                        <template v-slot:item.jobOrderName="props">
                                            <v-text-field class="pa-0 countFont" placeholder="작업지시명"
                                                v-model="props.item.jobOrderName" dense single-line>
                                            </v-text-field>
                                        </template>
                                        <template v-slot:item.delete="props">
                                            <v-btn icon @click="minus(props.item)">
                                                <v-icon small class="mr-2">
                                                    mdi-trash-can-outline
                                                </v-icon>
                                            </v-btn>
                                        </template>
                                        <template v-slot:no-data>
                                            <h5>선택된 수주품목이 없습니다.</h5>
                                        </template>
                                    </v-data-table>
                                </v-col>
                            </v-col>
                        </v-row>
                        <!-- 수정일때 -->
                        <v-row v-if="change" class="ma-0 d-flex ">
                            <v-col cols="12" class="d-flex " align-self="center">
                                <v-col cols="2">
                                    <h4 class="pl-2 mb-1">수주품목 목록</h4>
                                    <v-data-table multi-sort class="ml-2 mr-2 overflow-scroll elevation-4" show-select
                                        fixed-header v-model="selectedProduct" height="400" :headers="register_itemheaders"
                                        :search="searchItem" :items="itemData" return-object item-key="itemId" dense
                                        :items-per-page="50" disable-pagination hide-default-footer>
                                        <template v-slot:no-data>
                                            <h5>거래처 조회를 먼저 해주세요.</h5>
                                        </template>
                                    </v-data-table>
                                </v-col>
                                <v-col cols="1" class="d-flex justify-center align-center">
                                    <v-btn small fluid color="primary" @click="plus">
                                        <v-icon>mdi-arrow-right-bold</v-icon>
                                    </v-btn>
                                </v-col>
                                <v-col cols="8">
                                    <h4 class="pl-2 mb-1">등록된 품목 목록</h4>
                                    <v-data-table multi-sort class="ml-2 mr-2 overflow-scroll elevation-4" fixed-header
                                        height="400" :headers="selectedheaders" :items="itemTable" return-object dense
                                        item-key="id" disable-pagination hide-default-footer dense>
                                        <template v-slot:item.quantity="props">
                                            <v-text-field class="pa-0 countFont"
                                                oninput="javascript: this.value = this.value.replace(/[^0-9]/g, '');"
                                                placeholder="*필수" v-model="props.item.quantity" single-line dense>
                                                {{ props.item.quantity }}
                                            </v-text-field>
                                        </template>
                                        <template v-slot:item.memo="props">
                                            <v-text-field class="pa-0 countFont" placeholder="메모" v-model="props.item.memo"
                                                dense single-line>
                                                {{ props.item.memo }}
                                            </v-text-field>
                                        </template>
                                        <template v-slot:item.supplyUnitPrice="props">
                                            <v-text-field class="pa-0 countFont"
                                                oninput="javascript: this.value = this.value.replace(/[^0-9]/g, '');"
                                                placeholder="*단가" v-model="props.item.supplyUnitPrice" single-line dense>
                                                {{ props.item.supplyUnitPrice }}
                                            </v-text-field>
                                        </template>
                                        <template v-slot:item.expectedDeliveryDate="props">
                                            <v-menu :nudge-right="40" transition="scale-transition" offset-y
                                                min-width="auto">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-text-field v-model="props.item.expectedDeliveryDate"
                                                        prepend-icon="mdi-calendar" readonly v-bind="attrs" dense
                                                        v-on="on"></v-text-field>
                                                </template>
                                                <v-date-picker no-title
                                                    v-model="props.item.expectedDeliveryDate"></v-date-picker>
                                            </v-menu>
                                        </template>

                                        <template v-slot:item.delete="props">
                                            <v-btn icon @click="minus(props.item)">
                                                <v-icon small class="mr-2">
                                                    mdi-trash-can-outline
                                                </v-icon>
                                            </v-btn>
                                        </template>
                                        <template v-slot:no-data>
                                            <h5>선택된 수주품목이 없습니다.</h5>
                                        </template>
                                    </v-data-table>
                                </v-col>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" class="d-flex justify-center">
                                <v-col cols="12">
                                    <v-text-field class="" label="요청사항" v-model="order.memo" tabindex="6"></v-text-field>
                                </v-col>
                            </v-col>
                        </v-row>
                    </v-sheet>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-row dense>
                    <v-col class="text-right">
                        <v-btn class="mr-1" v-show="!change" color="primary" @click="complete()">
                            수주등록
                        </v-btn>
                        <v-btn class="mr-1" v-show="change" color="primary" @click="edit()">
                            수주수정
                        </v-btn>
                        <v-btn class="closeBtn" color="primary" text @click="openModal = false">
                            닫기
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-actions>
        </v-card>



    </v-dialog>
</template>
<script lang="ts">
import * as api from "@/api";
import cfg from "./config/index";
import _, { functionsIn } from "lodash";
import {
    Component, Vue, Prop, Watch
} from "vue-property-decorator";
import { checkPropertyChange } from "json-schema";
import { it } from "node:test";
import { strict } from "node:assert";
@Component
export default class OrderManagementModal extends Vue {
    name: string = "";
    menuLoad: boolean = false; //거래처명으로 검색 모달 
    datas_simple: any[] = [];
    datas_header_simple: any[] = [
        {
            text: "거래처명",
            value: "customerName",
        },
        {
            text: "거래처코드",
            value: "customerId", align: ' d-none'
        }
    ];
    order: any =
        {
            orderDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            orderNum: '', //수주번호
            deliveryDate: '', //납품예정일
            customerId: '',//거래처 고유아이디 
            memo: '',
            details: [] //수주품목의 디테일
        }
    customerName: '' //거래처 이름    
    itemData: any[] = []; //수주정보 상세조회 resData
    menu_orderDate: boolean = false; //수주일자 datepicker
    menu_deliveryDate: boolean = false; //납품예정일 datepicker
    customerId: number | "" = "";
    customerList: any[] = [];
    memo: string = "";
    search: string = "";
    searchItem: string = "";
    selectedProduct: [{ itemId?: number, itemName?: string }] | any[] = [];
    itemDetail: any[] = [];
    selected: [] = [];
    item: any = "";
    @Prop({ required: true }) open: boolean;
    @Prop({ required: true }) change: boolean;
    @Prop({ required: true }) orderInfoId: any;
    @Prop({ required: true }) orderInfo: any;
    @Prop({
        required: true,
        default: () => {
            return {
                name: "", //작업지시서명
                customer: "", //거래처ID
                deadline: "", //마감일
                memo: "", //메모
                //details: [], //추가한 품목 목록
            };
        },
    })
    editedCustomerData: any;

    @Watch("orderInfoId") //orderInfoId로 수주 정보 상세 조회 api 연결함.
    getOrderInfoId() {
        this.order.orderNum = this.orderInfo.orderInfoCode //수주번호를 바인딩
        let param = {
            orderInfoId: this.orderInfo.orderInfoId
        }
        api.order.getOrderInfoDetail(param).then((res) => {
            if (res.status = 200) {
                console.log('수주 정보 상세 조회 api 성공', res)
                this.itemDetail = res.data.responseData
            } else {
            }
        })
    }
    @Watch("orderInfo") //부모에서 받은 orderInfo
    getOrderInfo() {
        if (this.change) {
            this.customerName = this.orderInfo.customerName
            this.order.customerId = this.orderInfo.customerId
            this.order.deliveryDate = this.orderInfo.orderDate
            this.order.orderDate = this.orderInfo.orderDate
            this.order.memo = this.orderInfo.memo
        }
    }
    @Watch('customerId')
    getCustomerInfo() {
        let id = {
            orderInfoId: this.orderInfoId
        }
        api.order.getOrderInfoItem().then((res) => {
            if (res.status == 200) {
                console.log('품목조회 api 연결 성공', res)
                this.itemData = res.data.responseData
            } else {
                this.swalFail()
            }
        })
        api.order.getCustomerNameList().then((res) => {
            if (res.status == 200) {
                console.log('거래처 조회 성공', res)
                this.datas_simple = res.data.responseData
            } else {
                this.swalFail()
            }
        })
    }

    get openModal() {
        if (this.change) { //수정일때
            let param = {
                customerId: this.order.customerId,
                itemName: this.searchItem
            }
            api.order.getOrderInfoItem(param).then((res) => {
                if (res.status == 200) {
                    this.itemData = res.data.responseData
                } else {
                    this.swalFail()
                }
            })
            api.order.getCustomerNameList().then((res) => {
                if (res.status == 200) {
                    console.log('거래처 조회 성공', res)
                    this.datas_simple = res.data.responseData
                } else {
                    this.swalFail()
                }
            })
        } else {
            console.log('등록일때입니다', this.itemDetail)
            this.itemDetail = []
            this.customerName = ''
        }
        return this.open;
    }
    set openModal(val: any) {
        if (this.change) {
            console.log('등록버젼입니다.')
            this.order = []
            this.itemData = []
            this.itemDetail = []
            this.$emit("closeModal", false);
        } else if (!this.change) {
            console.log('수정버젼입니다.')
            this.order.orderNum = 0
            this.order = []
            this.itemData = []
            this.$emit("closeModal", false);
        }
    }
    get customerData() {
        return this.customerList;
    }
    get itemheaders() {
        return cfg.header.orderitemheaders;
    }
    get register_itemheaders() {
        return cfg.header.register_itemheaders;
    }
    get selectedheaders() {
        return cfg.header.selectedheaders;
    }
    get tempheader() {
        return cfg.header.tempheader;
    }
    get itemTable() {
        return this.itemDetail
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
    d_date_search_order(v: any) { //수주일자
        this.order.orderDate = v;
        this.menu_orderDate = false;
        let orderDate: any = this.$refs.menu_orderDate;
        orderDate.save(v);
    }
    d_date_search_delivery(v: any) { //수주일자
        this.order.deliveryDate = v;
        this.menu_deliveryDate = false;
        let deliveryDate: any = this.$refs.menu_deliveryDate;
        deliveryDate.save(v);
    }
    plus() {
        if (this.selectedProduct.length == 0) {
            this.$swal({
                title: "품목이 선택되지 않았습니다.",
                icon: "warning",
                position: "top",
                showCancelButton: false,
                showConfirmButton: false,
                toast: true,
                timer: 1500,
            });
        } else {
            if (this.itemDetail.length == 0) {
                let totalID: any = _.map(this.itemDetail, "itemId");
                for (var i = 0; i < this.selectedProduct.length; i++) {
                    let plusItem: any = this.selectedProduct[i];
                    if (totalID.includes(plusItem.id)) continue;
                    plusItem["quantity"] = null;
                    plusItem["expectedDeliveryDate"] = null;
                    plusItem["supplyUnitPrice"] = null;
                    plusItem["memo"] = null;
                    plusItem["itemName"] = plusItem.itemName
                    this.itemDetail.push(plusItem);
                }
            } else {
                let dupYN: boolean = false
                let origin: any[] = this.selectedProduct
                let anys: any[] = this.itemDetail
                origin.forEach(function (el) {
                    anys.forEach(function (el2) {
                        if (el.itemId == el2.itemId) {
                            dupYN = true
                        }
                    })
                })
                if (dupYN) {
                    this.$swal({
                        title: "품목을 중복해서 등록할 수 없습니다.",
                        icon: "warning",
                        position: "top",
                        showCancelButton: false,
                        showConfirmButton: false,
                        toast: true,
                        timer: 1500,
                    });
                } else {
                    let totalID: any = _.map(this.itemDetail, "itemId");
                    for (var i = 0; i < this.selectedProduct.length; i++) {
                        let plusItem: any = this.selectedProduct[i];
                        if (totalID.includes(plusItem.id)) continue;
                        //plusItem["id"] = plusItem["id"];
                        plusItem["quantity"] = null;
                        plusItem["expectedDeliveryDate"] = null;
                        plusItem["supplyUnitPrice"] = null;
                        plusItem["memo"] = null;
                        this.itemDetail.push(plusItem);
                    }
                }
            }
        }
        this.selectedProduct = []
    }
    minus(item: any) {
        for (let i = 0; i < this.itemDetail.length; i++) {
            if (this.itemDetail[i].itemId === item.itemId) {
                this.itemDetail.splice(i, 1);
                i--;
            }
        }
    }
    complete() { //최종 수주 등록
        this.$swal
            .fire({
                title: "등록",
                text: "해당 데이터를 등록하시겠습니까?",
                icon: "info",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "등록",
            }).then((res) => {
                if (res.isConfirmed) {
                    this.order.details = this.itemDetail
                    for (let i = 0; i < this.order.details.length; i++) { //this.order.details의itemName을 뺀다 (백엔드요청)
                        delete this.order.details[i].itemName
                    }
                    this.validCheck_register()
                }
            })
    }
    validCheck_register() {
        let validYN: boolean = false
        for (let i = 0; i < this.order.details.length; i++) {
            let temp = this.order.details[i]
            let order = this.order
            console.log(temp, order)
            if (temp.expectedDeliveryDate == null || temp.quantity == null || temp.supplyUnitPrice == null || order.customerId == '' || order.details == null) {
                validYN = true
            }

            /*  if (temp.expectedDeliveryDate == null) {
                 console.log('111111111111111')
             } else if (temp.quantity == null) {
                 console.log('22222222222222')
             } else if (temp.supplyUnitPrice == null) {
                 console.log('3333333333333')
             } else if (temp.name == null) {
                 console.log('4444444444444')
             } else if (order.customerId == null) {
                 console.log('55555555555555')
             } else if (order.deliveryDate == '') {
                 console.log(order)
                 console.log('666666666666')
             } else if (order.details == null) {
                 console.log('7777777777777777')
             } */
        }

        if (!validYN) {
            this.register()
        } else {
            this.$swal({
                title: "입력 정보를 확인해주세요.",
                icon: "error",
                position: "top",
                showCancelButton: false,
                showConfirmButton: false,
                toast: true,
                timer: 1500,
            });
        }
    }
    register() {
        let item = {
            customerId: this.order.customerId,
            details: this.order.details,
            memo: this.order.memo,
            orderDate: this.order.orderDate
        }
        console.log(item)
        api.order.saveOrderInfo(item).then((res) => {
            if (res.status == 200) {
                this.$swal({
                    title: "등록되었습니다.",
                    icon: "success",
                    position: "top",
                    showCancelButton: false,
                    showConfirmButton: false,
                    toast: true,
                    timer: 1500,
                });
                this.openModal = false
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
        })
    }
    edit() {  //수주 정보 수정
        this.order.details = this.itemDetail
        for (let i = 0; i < this.order.details.length; i++) { //this.order.details의itemName을 뺀다 (백엔드요청)
            delete this.order.details[i].itemName
        }
        let body = {
            orderInfoId: this.order.orderNum,
            orderDate: this.order.orderDate,
            customerId: this.order.customerId,
            memo: this.order.memo,
            details: this.order.details
        }
        this.$swal
            .fire({
                title: "수정",
                text: "수정하시겠습니까?",
                icon: "info",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "수정",
            }).then((res) => {
                // if (res.isConfirmed) {
                //     api.order.editOrderInfo(body).then((res: any) => {
                //         if (res.status == 200) {
                //             console.log('수주정보수정 성공,', res)
                //             this.$swal({
                //                 title: "수정되었습니다.",
                //                 icon: "success",
                //                 position: "top",
                //                 showCancelButton: false,
                //                 showConfirmButton: false,
                //                 toast: true,
                //                 timer: 1500,
                //             });
                //             this.openModal = false
                //         } else {
                //             this.$swal({
                //                 title: "수정이 실패되었습니다.",
                //                 icon: "error",
                //                 position: "top",
                //                 showCancelButton: false,
                //                 showConfirmButton: false,
                //                 toast: true,
                //                 timer: 1500,
                //             });
                //         }

                //     })
                // }
                if (res.isConfirmed) {
                    this.validCheck_edit()
                }
            })
    }
    validCheck_edit() {
        let validYN: boolean = false //수주품목 유효성 검사
        for (let i = 0; i < this.order.details.length; i++) {
            let temp = this.order.details[i]
            let order = this.order
            if (temp.expectedDeliveryDate == null || temp.quantity == null || temp.supplyUnitPrice == null || order.customerId == '' || order.deliveryDate == '' || order.details == null) {
                validYN = true
            }
        }
        if (!validYN) {
            let body = {
                orderInfoId: this.order.orderNum,
                orderDate: this.order.orderDate,
                customerId: this.order.customerId,
                memo: this.order.memo,
                details: this.order.details
            }
            api.order.editOrderInfo(body).then((res: any) => {
                if (res.status == 200) {
                    this.openModal = false
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
                        title: "수정이 실패되었습니다.",
                        icon: "error",
                        position: "top",
                        showCancelButton: false,
                        showConfirmButton: false,
                        toast: true,
                        timer: 1500,
                    });
                }
            })
        } else {
            this.$swal({
                title: "유효성 검사 실패",
                icon: "error",
                position: "top",
                showCancelButton: false,
                showConfirmButton: false,
                toast: true,
                timer: 1500,
            });
        }
    }
    getData() {  //거래처 상세조회 불러오기 api
        console.log('거래처 상세조회 api 연결하겠습니다.')
        let id = {
            orderInfoId: this.orderInfoId
        }
        api.order.getOrderInfoDetail(id).then((res) => {
            console.log('수주정보 상세조회 성공', res)
            this.itemDetail = res.data.responseData
            this.order.memo = res.data.responseData.memo
        })
    }
    getItems() {
        console.log('품목조회  api 연결하겠습니다.')
        api.order.getOrderInfoItem().then((res) => {
            console.log('품목조회 api 연결 성공', res)
            this.itemData = res.data.responseData
        })

        console.log('브랜치테스트용 ')
    }
    cloneItem(item: any) { //거래처 명 클릭 시 
        console.log('cloneItemcloneItemcloneItemcloneItemcloneItem')
        this.order.customerId = item.customerId
        this.customerName = item.customerName

        console.log(item.customerId)

        let param = {
            customerId: this.order.customerId,
            itemName: this.searchItem
        }
        api.order.getOrderInfoItem(param).then((res) => {
            console.log('수주 아이템 조회(개선) api 연결 성공', res)
            this.itemData = res.data.responseData
        })
    }

    searchedItem() {
        console.log('품목명으로 검색', this.searchItem)
        let param = {
            customerId: this.order.customerId,
            itemName: this.searchItem
        }
        api.order.getOrderInfoItem(param).then((res) => {
            console.log('수주 아이템 조회(개선) api 연결 성공', res)
            this.itemData = res.data.responseData
        })
    }
    closeMenuLoadCard(event: any, item: any) { //그냥 닫기 클릭 시 
        this.menuLoad = false
    }
    getCustomer(item: any) {
        api.order.getCustomerNameList().then((res) => {
            console.log('거래처 조회 성공', res)
            this.datas_simple = res.data.responseData
        })
    }
}
</script>
<style src="./OrderManagement.scss" lang="scss">

</style>