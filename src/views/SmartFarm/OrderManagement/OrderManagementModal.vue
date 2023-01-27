<template>
    <div>
        <v-dialog v-model="openModal" persistent max-width="1500px">
            <v-card>
                <v-card-title class="display-flex justify-space-between pa-0 pl-2 pt-2 pr-10">
                    <span class="text-h5 dialog-title font-weight-bold pt-3 pl-3" v-show="!change">수주 등록</span>
                    <span class="text-h5 dialog-title font-weight-bold pt-3 pl-3" v-show="change">수주 수정</span>
                </v-card-title>
                <v-card-text>
                    <v-container id="dialogBox" max-width="1400px " class="overflow-hidden" fluid>
                        <v-container fluid class="pa-0">
                            <v-container id="main" grid-list-md text-xs-center fluid>
                                <v-form ref="form" lazy-validation>
                                    <v-row class="d-flex align-center">
                                        <v-col cols="2" class="pa-0 pl-2 mr-2">
                                            <v-menu tabindex="5" ref="menu_orderDate" v-model="menu_orderDate"
                                                :close-on-content-click="false" :return-value.sync="menu_orderDate"
                                                transition="scale-transition" offset-y min-width="auto">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-text-field label="수주일자" v-model="order.orderDate"
                                                        prepend-icon="mdi-calendar" readonly v-bind="attrs"
                                                        v-on="on"></v-text-field>
                                                </template>
                                                <v-date-picker v-model="order.orderDate" no-title scrollable
                                                    locale="ko-KR">
                                                    <v-spacer></v-spacer>
                                                    <v-btn text color="primary" @click="menu_orderDate = false">
                                                        취소
                                                    </v-btn>
                                                    <v-btn text color="primary"
                                                        @click="d_date_search_order(order.orderDate)">
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
                                            <v-menu tabindex="5" ref="menu_deliveryDate" v-model="menu_deliveryDate"
                                                :close-on-content-click="false" :return-value.sync="menu_deliveryDate"
                                                transition="scale-transition" offset-y min-width="auto">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-text-field label="납품예정일" v-model="order.deliveryDate"
                                                        prepend-icon="mdi-calendar" readonly v-bind="attrs"
                                                        v-on="on"></v-text-field>
                                                </template>
                                                <v-date-picker v-model="order.deliveryDate" no-title scrollable
                                                    locale="ko-KR">
                                                    <v-spacer></v-spacer>
                                                    <v-btn text color="primary" @click="menu_deliveryDate = false">
                                                        취소
                                                    </v-btn>
                                                    <v-btn text color="primary"
                                                        @click="d_date_search_delivery(order.deliveryDate)">
                                                        확인
                                                    </v-btn>
                                                </v-date-picker>
                                            </v-menu>
                                        </v-col>
                                        <v-col cols="2" class="pa-0 pl-2 mr-2">
                                            <v-text-field class="" label="거래처" v-model="customerName" disabled
                                                tabindex="6"></v-text-field>
                                        </v-col>
                                        <v-menu v-model="menuLoad" :close-on-content-click="false" :nudge-width="400"
                                            offset-x max-height="600">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-btn v-bind="attrs" v-on="on" small @click="getCustomer()">
                                                    불러오기
                                                </v-btn>
                                            </template>

                                            <v-card class="pa-3">
                                                <v-data-table :headers="datas_header_simple" :items="datas_simple" dense
                                                    :items-per-page=100 item-key="name" class="elevation-1"
                                                    :search="search" hide-default-footer height="300">
                                                    <template v-slot:top>
                                                        <v-text-field v-model="search" label="거래처명으로 검색" class="mx-4"
                                                            append-icon="mdi-magnify"></v-text-field>
                                                    </template>
                                                    <template v-slot:item.customerName="{ item }">
                                                        <v-btn @click="cloneItem(item)" class="ma-2" outlined
                                                            color="indigo">
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
                                    </v-row>
                                </v-form>
                            </v-container>
                        </v-container>
                        <v-sheet color="#F6F8F9" height="600">
                            <v-container fluid>
                                <v-row>
                                    <v-col class="pa-0">
                                        <h4 class="searchbox-title pt-3 ml-5">수주품목 목록</h4>
                                    </v-col>
                                </v-row>
                            </v-container>
                            <v-container fluid class="d-flex pt-0 pb-0">
                                <v-col cols="3" class=" pa-0 d-flex align-center">
                                    <v-text-field class="mr-10 pa-0 ml-3" v-model="searchItem" placeholder="수주품목명 검색"
                                        append-icon="mdi-magnify"></v-text-field>
                                </v-col>
                            </v-container>

                            <v-container fluid class="pa-0">
                                <v-data-table multi-sort class="ml-2 mr-2 overflow-scroll elevation-4" show-select
                                    fixed-header v-model="selectedProduct" height="180" :headers="register_itemheaders"
                                    :search="searchItem" :items="itemData" return-object item-key="itemId" dense
                                    :items-per-page="50" :footer-props="footer_option" v-show="change">
                                    <template v-slot:no-data>
                                        <h5>조회된 수주품목이 없습니다.(수정버젼)</h5>
                                    </template>
                                </v-data-table>

                                <!-- check가 false일때 (등록화면일때) -->
                                <v-data-table multi-sort class="ml-2 mr-2 overflow-scroll elevation-4" show-select
                                    fixed-header v-model="selectedProduct" height="180" :headers="register_itemheaders"
                                    :items="itemData" return-object item-key="itemId" dense :items-per-page="50"
                                    :footer-props="footer_option" v-show="!change">
                                    <template v-slot:no-data>
                                        <h5>조회된 수주품목이 없습니다.(등록버젼)</h5>
                                    </template>
                                </v-data-table>
                            </v-container>
                            <v-container fluid class="d-flex justify-center pa-0">
                                <v-col cols="1">
                                    <v-btn small fluid color="deep-orange" @click="plus">
                                        <v-icon>mdi-arrow-down-bold-outline</v-icon>
                                    </v-btn>
                                </v-col>
                            </v-container>
                            <v-container fluid class="pa-0">
                                <v-col class="pa-0">
                                    <h4 class="searchbox-title mx-5">등록된 수주품목</h4>
                                </v-col>
                                <!-- 수정버젼일때 -->
                                <v-data-table multi-sort class="ml-2 mr-2 overflow-scroll elevation-4" fixed-header
                                    height="180" :headers="selectedheaders" :items="itemTable" return-object
                                    item-key="id" disable-pagination hide-default-footer dense v-show="change">
                                    <!-- 수량 -->
                                    <template v-slot:item.quantity="props">
                                        <v-text-field class="pa-0 countFont"
                                            oninput="javascript: this.value = this.value.replace(/[^0-9]/g, '');"
                                            placeholder="* 수량 필수" v-model="props.item.quantity" single-line>
                                            {{ props.item.quantity }}
                                        </v-text-field>
                                    </template>
                                    <!-- 단가 -->
                                    <template v-slot:item.supplyUnitPrice="props">
                                        <v-text-field class="pa-0 countFont"
                                            oninput="javascript: this.value = this.value.replace(/[^0-9]/g, '');"
                                            placeholder="*단가" v-model="props.item.supplyUnitPrice" single-line>
                                            {{ props.item.supplyUnitPrice }}
                                        </v-text-field>
                                    </template>
                                    <!-- 납품예정일 -->
                                    <template v-slot:item.expectedDeliveryDate="props">
                                        <v-menu :close-on-content-click="false" :nudge-right="40"
                                            transition="scale-transition" offset-y min-width="auto">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field v-model="props.item.expectedDeliveryDate" label="납품예정일"
                                                    prepend-icon="mdi-calendar" readonly v-bind="attrs"
                                                    v-on="on"></v-text-field>
                                            </template>
                                            <v-date-picker no-title
                                                v-model="props.item.expectedDeliveryDate"></v-date-picker>
                                        </v-menu>
                                    </template>
                                    <!-- 비고(메모) -->
                                    <template v-slot:item.memo="props">
                                        <v-text-field class="pa-0 countFont" placeholder="메모" v-model="props.item.memo"
                                            single-line>
                                            {{ props.item.memo }}
                                        </v-text-field>
                                    </template>
                                    <!-- 삭제 -->
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
                                <!-- 등록버젼일때 -->
                                <v-data-table multi-sort class="ml-2 mr-2 overflow-scroll elevation-4" fixed-header
                                    height="180" :headers="selectedheaders" :items="itemTable" return-object
                                    item-key="id" disable-pagination hide-default-footer dense v-show="!change">
                                    <!-- 수량 -->
                                    <template v-slot:item.quantity="props">
                                        <v-text-field class="pa-0 countFont"
                                            oninput="javascript: this.value = this.value.replace(/[^0-9]/g, '');"
                                            placeholder="*수량" v-model="props.item.quantity" single-line>
                                            {{ props.item.quantity }}
                                        </v-text-field>
                                    </template>
                                    <!-- 단가 -->
                                    <template v-slot:item.supplyUnitPrice="props">
                                        <v-text-field class="pa-0 countFont"
                                            oninput="javascript: this.value = this.value.replace(/[^0-9]/g, '');"
                                            placeholder="*단가" v-model="props.item.supplyUnitPrice" single-line>
                                            {{ props.item.supplyUnitPrice }}
                                        </v-text-field>
                                    </template>
                                    <!-- 납품예정일 -->
                                    <template v-slot:item.expectedDeliveryDate="props">
                                        <v-menu :close-on-content-click="false" :nudge-right="40"
                                            transition="scale-transition" offset-y min-width="auto">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field v-model="props.item.expectedDeliveryDate" label="납품예정일"
                                                    prepend-icon="mdi-calendar" readonly v-bind="attrs"
                                                    v-on="on"></v-text-field>
                                            </template>
                                            <v-date-picker no-title
                                                v-model="props.item.expectedDeliveryDate"></v-date-picker>
                                        </v-menu>
                                    </template>
                                    <!-- 비고(메모) -->
                                    <template v-slot:item.memo="props">
                                        <v-text-field class="pa-0 countFont" placeholder="메모" v-model="props.item.memo"
                                            single-line>
                                            {{ props.item.memo }}
                                        </v-text-field>
                                    </template>
                                    <!-- 삭제 -->
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
                            </v-container>
                        </v-sheet>
                        <v-container fluid>
                            <v-row class="d-flex align-center">
                                <v-col cols="12" class=" pa-0 d-flex align-center pt-6">
                                    <v-text-field class="" label="요청사항" v-model="order.memo"
                                        tabindex="6"></v-text-field>
                                </v-col>
                            </v-row>
                        </v-container>
                        <v-container fluid>
                            <v-row>
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
                        </v-container>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>
<script lang="ts">
import * as api from "@/api";
import cfg from "./config/index";
import _, { functionsIn } from "lodash";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { checkPropertyChange } from "json-schema";
import { it } from "node:test";
import { strict } from "node:assert";

@Component
export default class OrderManagementModal extends Vue {
    footer_option: {
        disableItemsPerPage: boolean;
        itemsPerPageAllText: string;
        itemsPerPageOptions: number[];
    } = {
            disableItemsPerPage: false,
            itemsPerPageAllText: "ALL",
            itemsPerPageOptions: [10, 20, 50, -1],
        };
    ordername_rule: any[] = [
        (v: any) =>
            !(v && v.length >= 50) || "작업지시서명 50자 이상 입력할 수 없습니다.",
    ];
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
    accountName: string = "";
    order: any =
        {
            orderDate: "2023-01-13",  //수주일자
            orderNum: '', //수주번호
            deliveryDate: '', //납품예정일
            customerId: '',//거래처 고유아이디 
            memo: '',
            details: [] //수주품목의 디테일
        }
    customerName: '' //거래처 이름    
    request: string = ''; //요청사항
    itemData: any[] = []; //수주정보 상세조회 resData
    menu_orderDate: boolean = false; //수주일자 datepicker
    menu_deliveryDate: boolean = false; //납품예정일 datepicker
    customerId: number | "" = "";
    customerList: any[] = [];
    departmentList: any[] = [];
    keyword: string = "";
    deadline: string = "";
    menu_deadline_date: boolean = false;
    memo: string = "";
    itemList: any[] = [];
    search: string = "";
    searchItem: string = "";
    searchlist: any[] = [];
    selectedProduct: [{ itemId?: number, itemName?: string }] | any[] = [];
    itemDetail: any[] = [];
    selected: [] = [];
    interimStorage: boolean = false;
    templist: any[] = [];
    item: any = "";
    departmentCrewList: any[] = [];
    orderData: any = [];
    itemName: any = "";
    selectedData: any;

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
                department: "", //부서
                departmentchargeName: "", //담당자
                deadline: "", //마감일
                memo: "", //메모
                //details: [], //추가한 품목 목록
            };
        },
    })
    editedCustomerData: any;
    @Watch("item")
    onItemChange() {
        if (this.item != null) {
            this.itemName = this.item.name;
        }
    }
    @Watch('selectedProduct')
    chack() {
        console.log('셀렉티드프로덕트', this.selectedProduct)
    }


    @Watch("orderInfoId") //orderInfoId로 수주 정보 상세 조회 api 연결함.
    getOrderInfoId() {
        console.log('오더넘', this.order.orderNum)
        this.order.orderNum = this.orderInfoId //수주번호를 바인딩
        let id = {
            orderInfoId: this.orderInfoId
        }
        api.order.getOrderInfoDetail(id).then((res) => {
            console.log('품목조회 api 연결 성공', res)
            this.itemDetail = res.data.responseData
        })
    }
    @Watch("orderInfo") //부모에서 받은 orderInfo
    getOrderInfo() {
        console.log('오더인포', this.orderInfo)
        console.log('오더', this.order)
        if (this.change) {
            this.customerName = this.orderInfo.customerName
            this.customerId = this.orderInfo.customerId
            this.order.deliveryDate = this.orderInfo.orderDate
            this.order.orderDate = this.orderInfo.orderDate
            this.order.memo = this.orderInfo.memo
        }
    }
    @Watch('customerId')
    getCustomerInfo() {
        console.log('거래처고유아이디거래처고유아이디', this.customerId)
        api.order.getItems().then((res) => {
            console.log('품목조회 api 연결 성공', res)
            this.itemData = res.data.responseData
        })
        api.order.getCustomerNameList().then((res) => {
            console.log('거래처 조회 성공', res)
            this.datas_simple = res.data.responseData
        })
    }
    get openModal() {
        if (this.change) {
            api.order.getItems().then((res) => {
                console.log('품목조회 api 연결 성공', res)
                this.itemData = res.data.responseData
            })
            api.order.getCustomerNameList().then((res) => {
                console.log('거래처 조회 성공', res)
                this.datas_simple = res.data.responseData
            })
        }
        return this.open;
    }
    set openModal(val: any) {
        if (this.change) {
            console.log('등록버젼입니다.')
            this.order = []
            this.itemData = []
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
    get departmentData() {
        return this.departmentList;
    }
    get departmentCrewData() {
        return this.departmentCrewList;
    }
    get itemTable() {
        return this.itemDetail
    }
    mounted() {
        this.itemDetail = [];
        this.search = "";
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

        // if (this.selectedProduct == null) { //선택된게 있어?
        //     console.log('선택된게 없어,swal띄울게', this.selectedProduct)
        //     this.$swal({
        //         title: "품목이 선택되지 않았습니다.",
        //         icon: "warning",
        //         position: "top",
        //         showCancelButton: false,
        //         showConfirmButton: false,
        //         toast: true,
        //         timer: 1500,
        //     });
        // } else {
        //     console.log('선택된게있어', this.selectedProduct.length)
        //     console.log('선택된게있어.그안의내용물이야', this.selectedProduct)

        //     if (this.itemDetail.length == 0) { //장바구니 비었어? 
        //         console.log('장바구니 비었어,넣을게')
        //         let totalID: any = _.map(this.itemDetail, "itemId");
        //         for (var i = 0; i < this.selectedProduct.length; i++) {
        //             let plusItem: any = this.selectedProduct[i];
        //             if (totalID.includes(plusItem.id)) continue;
        //             plusItem["quantity"] = null;
        //             plusItem["expectedDeliveryDate"] = null;
        //             plusItem["supplyUnitPrice"] = null;
        //             plusItem["memo"] = null;
        //             this.itemDetail.push(plusItem);
        //         }
        //     } else {
        //         console.log('장바구니에 상품담겨있어,중복값체크할게', this.selectedProduct, this.itemDetail)
        //         let dupYN: boolean = false //forEach를 통한 중복값체크 중..
        //         let origin: any[] = this.selectedProduct
        //         let anys: any[] = this.itemDetail
        //         origin.forEach(function (el) {
        //             anys.forEach(function (el2) {
        //                 if (el.itemId == el2.itemId) {
        //                     dupYN = true
        //                 }
        //             })
        //         })
        //         if (dupYN) { //장바구니안에 중복값있어?
        //             console.log('장바구니 안에 중복된상품있어,swal띄울게.')
        //             this.$swal({
        //                 title: "중복해서 품목을 등록할 수 없습니다.",
        //                 icon: "warning",
        //                 position: "top",
        //                 showCancelButton: false,
        //                 showConfirmButton: false,
        //                 toast: true,
        //                 timer: 1500,
        //             });
        //             dupYN = false
        //         } else { //장바구니안에 중복값 없어?
        //             console.log('장바구니 안에 중복값없어.넣을게.', this.selectedProduct, this.itemDetail)
        //             let totalID: any = _.map(this.itemDetail, "itemId");
        //             for (var i = 0; i < this.selectedProduct.length; i++) {
        //                 let plusItem: any = this.selectedProduct[i];
        //                 if (totalID.includes(plusItem.id)) continue;
        //                 plusItem["quantity"] = null;
        //                 plusItem["expectedDeliveryDate"] = null;
        //                 plusItem["supplyUnitPrice"] = null;
        //                 plusItem["memo"] = null;
        //                 this.itemDetail.push(plusItem);
        //             }
        //         }
        //     }
        // }
        // this.selectedProduct = null

        //let selectedProductLength: number = this.selectedProduct.length
        //console.log('selectedProductLength', this.selectedProduct.length)
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
            console.log('selectedProduct', this.selectedProduct)
            console.log('itemDetail', this.itemDetail)
            if (this.itemDetail.length == 0) {
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
            } else {
                let dupYN: boolean = false
                let origin: any[] = this.selectedProduct
                let anys: any[] = this.itemDetail
                origin.forEach(function (el) {
                    anys.forEach(function (el2) {
                        if (el == el2) {
                            dupYN = true
                        }
                    })
                })
                if (dupYN) {
                    this.$swal({
                        title: "중복입니다.",
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
                    this.validCheck()



                }
            })
    }
    validCheck() { //수주 정보 유효성 검사 
        let validYN: boolean = false //수주품목 유효성 검사
        for (let i = 0; i < this.order.details.length; i++) {
            let temp = this.order.details[i]
            let order = this.order
            if (temp.expectedDeliveryDate == null || temp.quantity == null || temp.supplyUnitPrice == null || order.customerId == '' || order.deliveryDate == '' || order.details == null) {
                validYN = true
            }
        }
        if (!validYN) {
            let body = this.order
            api.order.saveOrderInfo(body).then((res: any) => {
                if (res.status == 200) {
                    this.openModal = false
                    this.$swal({
                        title: "등록되었습니다.",
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
    edit() {  //수주 정보 수정
        this.order.details = this.itemDetail
        for (let i = 0; i < this.order.details.length; i++) { //this.order.details의itemName을 뺀다 (백엔드요청)
            delete this.order.details[i].itemName
        }
        this.validCheck()
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
        api.order.getItems().then((res) => {
            console.log('품목조회 api 연결 성공', res)
            this.itemData = res.data.responseData
        })
    }
    cloneItem(item: any) { //거래처 명 클릭 시 
        this.order.customerId = item.customerId
        this.customerName = item.customerName
        this.getItems()
    }
    closeMenuLoadCard(event: any, item: any) { //그냥 닫기 클릭 시 
        this.menuLoad = false
    }
    closeModal(item: any) {
        this.change = false;
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
