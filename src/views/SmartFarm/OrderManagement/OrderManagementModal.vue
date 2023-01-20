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
                                            <v-text-field class="" label="수주번호:193871" disabled v-model="order.orderNum"
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
                                            <v-text-field class="" label="거래처" v-model="accountName" disabled
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
                                    <v-text-field class="mr-10 pa-0 ml-3" v-model="search"
                                        placeholder="수주품목명 검색"></v-text-field>
                                </v-col>
                            </v-container>

                            <v-container fluid class="pa-0">
                                <v-data-table multi-sort class="ml-2 mr-2 overflow-scroll elevation-4" show-select
                                    fixed-header v-model="selectedProduct" height="180" :headers="itemheaders"
                                    :items="itemData" return-object item-key="itemId" dense :items-per-page="50"
                                    :footer-props="footer_option" v-show="change">
                                    <template v-slot:no-data>
                                        <h5>조회된 수주품목이 없습니다.</h5>
                                    </template>
                                </v-data-table>
                                <!-- check가 false일때 (등록화면일때) -->
                                <v-data-table multi-sort class="ml-2 mr-2 overflow-scroll elevation-4" show-select
                                    fixed-header v-model="selectedProduct" height="180" :headers="register_itemheaders"
                                    :items="itemData" return-object item-key="itemId" dense :items-per-page="50"
                                    :footer-props="footer_option" v-show="!change">
                                    <template v-slot:no-data>
                                        <h5>조회된 수주품목이 없습니다.</h5>
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
                                <v-data-table multi-sort class="ml-2 mr-2 overflow-scroll elevation-4" show-select
                                    fixed-header height="180" v-model="orderData.details" :headers="selectedheaders"
                                    :items="itemTable" return-object item-key="id" disable-pagination
                                    hide-default-footer dense v-show="change">
                                    <template v-slot:item.count="props">
                                        <v-text-field class="pa-0 countFont"
                                            oninput="javascript: this.value = this.value.replace(/[^0-9]/g, '');"
                                            placeholder="*수량" v-model="props.item.count" single-line>
                                            {{ props.item.count }}
                                        </v-text-field>
                                    </template>
                                    <template v-slot:item.count="props">
                                        <v-text-field class="pa-0 countFont"
                                            oninput="javascript: this.value = this.value.replace(/[^0-9]/g, '');"
                                            placeholder="*단가" v-model="props.item.count" single-line>
                                            {{ props.item.count }}
                                        </v-text-field>
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
                                        <v-menu tabindex="5" ref="menu_expectedDeliveryDate"
                                            v-model="menu_expectedDeliveryDate" :close-on-content-click="false"
                                            :return-value.sync="menu_expectedDeliveryDate" transition="scale-transition"
                                            offset-y min-width="auto">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field label="납품예정일" v-model="props.item.expectedDeliveryDate"
                                                    prepend-icon="mdi-calendar" readonly v-bind="attrs"
                                                    v-on="on"></v-text-field>
                                            </template>
                                            <v-date-picker v-model="props.item.expectedDeliveryDate" no-title scrollable
                                                locale="ko-KR">
                                                <v-spacer></v-spacer>
                                                <v-btn text color="primary" @click="menu_expectedDeliveryDate = false">
                                                    취소
                                                </v-btn>
                                                <v-btn text color="primary"
                                                    @click="d_date_expectedDeliveryDate(props.item.expectedDeliveryDate)">
                                                    확인
                                                </v-btn>
                                            </v-date-picker>
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
                                        <v-btn icon @click="minus()">
                                            <v-icon small class="mr-2">
                                                mdi-trash-can-outline
                                            </v-icon>
                                        </v-btn>
                                    </template>
                                    <template v-slot:no-data>
                                        <h5>선택된 수주품목이 없습니다.(등록버젼)</h5>
                                    </template>
                                </v-data-table>
                            </v-container>
                        </v-sheet>
                        <v-container fluid>
                            <v-row class="d-flex align-center">
                                <v-col cols="12" class=" pa-0 d-flex align-center pt-6">
                                    <v-text-field class="" label="요청사항" v-model="request" tabindex="6"></v-text-field>
                                </v-col>
                            </v-row>
                        </v-container>
                        <v-container fluid>
                            <v-row>
                                <v-col class="text-right">
                                    <v-btn class="mr-1" v-show="!change" color="primary" @click="complete()">
                                        수주등록
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
import _ from "lodash";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { checkPropertyChange } from "json-schema";

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
            orderNum: 0, //수주번호
            deliveryDate: '', //납품예정일
            accountName: '' //거래처 
        }

    request: string = ''; //요청사항
    itemData: any[] = []; //수주정보 상세조회 resData





    menu_orderDate: boolean = false; //수주일자 datepicker
    menu_deliveryDate: boolean = false; //납품예정일 datepicker



    menu_expectedDeliveryDate: boolean = false; //수주품목 납품예정일 menu  




    customerId: number | "" = "";
    customerList: any[] = [];
    departmentList: any[] = [];
    keyword: string = "";
    deadline: string = "";
    menu_deadline_date: boolean = false;
    memo: string = "";
    itemList: any[] = [];
    search: string = "";
    searchlist: any[] = [];
    selectedProduct: [] = [];
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

    @Watch("orderData.department")
    onOrderDataChange() {
        if (
            this.orderData.department != "" &&
            this.orderData.department.departmentName != "전체"
        ) {
            this.getDepartmentCrewList();
        } else {
            this.orderData.departmentchargeName = "";
        }
    }





    @Watch("editedCustomerData")
    onEditedCustomerDataChange() {
        this.itemDetail = [];
        this.orderData = this.editedCustomerData;
        var resultDetails: any = _.get(this.editedCustomerData, "details");
        const newArray = resultDetails.map((item: any) => {
            return {
                id: item.itemId,
                name: item.itemName,
                version: item.itemVersion,
                count: item.count,
            };
        });
        this.itemDetail = newArray;
    }

    @Watch("item")
    onItemChange() {
        if (this.item != null) {
            this.itemName = this.item.name;
        }
    }

    @Watch("change")
    checkChange() {
        console.log('체인지체크', this.change)
    }


    // @Watch("orderInfoId") //orderInfoId로 수주 정보 상세 조회 api 연결함.
    // getDetailData() {
    //     console.log('우아앙', this.orderInfoId)
    //     console.log('this.order.orderNum', this.order.orderNum)

    //     this.order.orderNum = this.orderInfoId //수주번호를 바인딩

    //     // let id = {
    //     //     orderInfoId: this.orderInfoId
    //     // }


    //     // api.order.getOrderInfoDetail(id).then((res) => {
    //     //     console.log('수주정보 상세조회 성공', res)
    //     //     this.itemData = res.data.responseData
    //     //     console.log(this.order.orderNum, '오더넘오더넘오더넘')
    //     //     console.log(res.data.responseData.orderInfoDetailId, 'orderInfoDetailId')
    //     //     this.order.orderNum = res.data.responseData.orderInfoDetailId //수주번호를 바인딩

    //     // })
    // }

    @Watch("orderInfoId") //orderInfoId로 수주 정보 상세 조회 api 연결함.
    getOrderInfoId() {

        this.order.orderNum = this.orderInfoId //수주번호를 바인딩


        this.getData()

        // let id = {
        //     orderInfoId: this.orderInfoId
        // }


        // api.order.getOrderInfoDetail(id).then((res) => {
        //     console.log('수주정보 상세조회 성공', res)
        //     this.itemData = res.data.responseData
        //     console.log(this.order.orderNum, '오더넘오더넘오더넘')
        //     console.log(res.data.responseData.orderInfoDetailId, 'orderInfoDetailId')
        //     this.order.orderNum = res.data.responseData.orderInfoDetailId //수주번호를 바인딩

        // })
    }









    get openModal() {
        return this.open;
    }
    set openModal(val: any) {
        this.order.orderNum = 0
        this.itemData = []
        this.$emit("closeModal", false);
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
    // get itemData() {

    //     if (this.search != "") {
    //         this.searchlist = [];

    //         for (var i = 0; i < this.itemList.length; i++) {
    //             if (this.itemList[i].name.includes(this.search)) {
    //                 this.searchlist.push(this.itemList[i]);
    //             }
    //         }
    //     } else {
    //         this.searchlist = this.itemList;
    //     }
    //     return this.searchlist;
    // }





    get itemTable() {
        return this.itemDetail
    }

    mounted() {
        //this.getDataList();
        //this.getDepartmentList();
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

    d_date_expectedDeliveryDate(v: any) { //수주일자
        this.menu_expectedDeliveryDate = false;
        let expectedDeliveryDate: any = this.$refs.menu_deliveryDate;
        expectedDeliveryDate.save(v);
    }




    getDataList() {
        api.operation
            .getBasicDataPage()
            .then((response) => {
                this.customerList = [{ name: "전체", code: "", id: "" }];
                this.customerList.push(...response.data.responseData.basicCustomers);
                this.itemList = response.data.responseData.basicItems;
            })
            .catch((error) => {
                console.log(error);
            });
    }
    getDepartmentList() {

        api.operation
            .getDepartmentDataPage()
            .then((response) => {
                this.departmentList = [{ departmentName: "전체", departmentId: "" }];
                this.departmentList.push(...response.data.responseData);
            })
            .catch((error) => {
                console.log(error);
            });
    }
    getDepartmentCrewList() {
        let joborder;
        if (this.orderData.department != "") {
            this.keyword = this.orderData.department.departmentId;
        }

        joborder = {
            departmentId: this.keyword,
        };
        if (this.keyword != null) {
            api.operation
                .getDepartmentCrewDataPage(joborder)
                .then((response) => {
                    this.departmentCrewList = response.data.responseData;
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }
    getTempList() {
        api.operation
            .getOrderTempListPage()
            .then((response) => {
                this.templist = response.data.responseData;
            })
            .catch((error) => {
                console.log(error);
            });
    }
    selectedDepartment() {
        if (
            this.orderData.department != "" &&
            this.orderData.department.departmentName != "전체"
        ) {
            this.getDepartmentCrewList();
        } else {
            this.orderData.departmentchargeName = "";
        }
    }
    plus() {

        console.log('선택된품목', this.selectedProduct)
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
            if (this.selectedProduct.length != 0) {
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
                console.log('플러스아이템', this.itemDetail)

                this.selectedProduct = [];
            }
        }
    }
    minus() {
        console.log('itemTableitemTableitemTable', this.itemDetail)
        if (this.orderData.details.length == 0) {
            this.$swal({
                title: "취소시킬 원자재가 선택되지 않았습니다.",
                icon: "warning",
                position: "top",
                showCancelButton: false,
                showConfirmButton: false,
                toast: true,
                timer: 1500,
            });
        } else {
            if (this.orderData.details.length != 0) {
                let removeID: any = [];
                for (var i = 0; i < this.orderData.details.length; i++) {
                    removeID.push(this.orderData.details[i].id);
                }
                this.itemDetail = _.reject(this.itemDetail, function (o) {
                    return removeID.includes(o.id);
                });
                this.orderData.details = [];
            }
        }
    }
    // complete() {
    //     this.selectedData = [];

    //     if (
    //         this.orderData.name == "" ||
    //         this.orderData.customer == "" ||
    //         this.orderData.department == "" ||
    //         this.orderData.departmentchargeName == "" ||
    //         this.orderData.deadline == "" ||
    //         this.itemTable.length == 0
    //     ) {
    //         this.$swal({
    //             title: "입력칸의 공백을 확인해주세요",
    //             icon: "error",
    //             position: "top",
    //             showCancelButton: false,
    //             showConfirmButton: false,
    //             toast: true,
    //             timer: 1500,
    //         });
    //     } else {
    //         let check = true;

    //         for (var i = 0; i < this.itemTable.length; i++) {
    //             if (this.itemTable[i].count == null) {
    //                 check = false;
    //                 this.$swal({
    //                     title: "입력된 수량이 없는 품목은 등록되지않습니다.",
    //                     icon: "error",
    //                     position: "top",
    //                     showCancelButton: false,
    //                     showConfirmButton: false,
    //                     toast: true,
    //                     timer: 1500,
    //                 });
    //             } else {
    //                 this.selectedData.push({
    //                     itemId: this.itemTable[i].id,
    //                     itemName: this.itemTable[i].name,
    //                     count: this.itemTable[i].count,
    //                 });
    //             }
    //         }
    //         if (check) {
    //             let joborder;

    //             joborder = {
    //                 name: this.orderData.name,
    //                 accountId: this.orderData.departmentchargeName,
    //                 customerId: this.orderData.customer.id,
    //                 deadline: this.orderData.deadline,
    //                 memo: this.orderData.memo,
    //                 details: this.selectedData,
    //             };
    //             api.operation
    //                 .getOperationOrderPage(joborder)
    //                 .then((response) => {
    //                     if (response.status == 200) {
    //                         this.$swal({
    //                             title: "등록되었습니다.",
    //                             icon: "success",
    //                             position: "top",
    //                             showCancelButton: false,
    //                             showConfirmButton: false,
    //                             toast: true,
    //                             timer: 1500,
    //                         });
    //                         this.orderData = {
    //                             name: "",
    //                             customer: "",
    //                             department: "",
    //                             departmentchargeName: "",
    //                             deadline: "",
    //                             memo: "",
    //                             details: [],
    //                         };
    //                         this.openModal = false;
    //                     } else {
    //                         this.$swal({
    //                             title: "등록이 실패되었습니다.",
    //                             icon: "error",
    //                             position: "top",
    //                             showCancelButton: false,
    //                             showConfirmButton: false,
    //                             toast: true,
    //                             timer: 1500,
    //                         });
    //                     }
    //                 })
    //                 .catch((error) => {
    //                     console.log(error);
    //                 });
    //         }
    //     }
    // }
    complete() { //최종 수주 등록

        console.log('최종수주등록 리퀘스트바디', this.order)
        let body = {

        }

        // api.order.saveOrderInfo(body).then((res: any) => {

        // })


    }




    changeOn() {
        this.selectedData = [];

        if (
            this.orderData.name == "" ||
            this.orderData.customer == "" ||
            this.orderData.department == "" ||
            this.orderData.departmentchargeName == "" ||
            this.orderData.deadline == "" ||
            this.itemTable.length == 0
        ) {
            this.$swal({
                title: "입력칸의 공백을 확인해주세요",
                icon: "error",
                position: "top",
                showCancelButton: false,
                showConfirmButton: false,
                toast: true,
                timer: 1500,
            });
        } else {
            let check = true;

            for (var i = 0; i < this.itemTable.length; i++) {
                if (this.itemTable[i].count == null) {
                    check = false;
                    this.$swal({
                        title: "입력된 수량이 없는 품목은 등록되지않습니다.",
                        icon: "error",
                        position: "top",
                        showCancelButton: false,
                        showConfirmButton: false,
                        toast: true,
                        timer: 1500,
                    });
                } else {
                    this.selectedData.push({
                        itemId: this.itemTable[i].id,
                        itemName: this.itemTable[i].name,
                        count: this.itemTable[i].count,
                    });
                }
            }

            if (check) {
                let joborder;

                joborder = {
                    name: this.orderData.name,
                    accountId: this.departmentCrewList[0].id,
                    id: this.orderData.id,
                    deadline: this.orderData.deadline,
                    memo: this.orderData.memo,
                    details: this.selectedData,
                };
                api.operation
                    .getOperationOrderChangePage(joborder)
                    .then((response) => {
                        if (response.status == 200) {
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
                        this.orderData = {
                            name: "",
                            customer: "",
                            department: "",
                            departmentchargeName: "",
                            deadline: "",
                            memo: "",
                            details: [],
                        };
                        this.openModal = false;
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        }
    }



    getData() {  //거래처 상세조회 불러오기 api
        console.log('거래처 상세조회 api 연결하겠습니다.')
        let id = {
            orderInfoId: this.orderInfoId
        }

        api.order.getOrderInfoDetail(id).then((res) => {
            console.log('수주정보 상세조회 성공', res)
            this.itemData = res.data.responseData
        })
    }

    getItems() {
        console.log('품목조회  api 연결하겠습니다.')
        api.order.getItems().then((res) => {
            console.log('품목조회 api 연결 성공', res)
            this.itemData = res.data.responseData
        })

    }



    getTemp() {
        this.selectedData = [];
        let joborderTemp;

        joborderTemp = {
            accountId: null,
            name: this.orderData.name,
            customerId: null,
            deadline: this.orderData.deadline,
            memo: this.orderData.memo,
            details: this.selectedData,
        };

        if (this.itemTable != null) {
            for (var i = 0; i < this.itemTable.length; i++) {
                this.selectedData.push({
                    itemId: this.itemTable[i].id,
                    count: this.itemTable[i].count,
                });
            }
        }

        if (this.orderData.departmentchargeName == null) {
            joborderTemp["accountId"] = null;
        } else if (this.orderData.departmentchargeName != "") {
            joborderTemp["accountId"] = this.orderData.departmentchargeName.id;
        }

        if (this.orderData.customer == null) {
            joborderTemp["customerId"] = null;
        } else if (
            this.orderData.customer != "" ||
            this.orderData.customer != null
        ) {
            joborderTemp["customerId"] = this.orderData.customer.id;
        }
        api.operation
            .getOrderTempPage(joborderTemp)
            .then((response) => {
                if (response.status == 200) {
                    this.$swal({
                        title: "임시 저장되었습니다.",
                        icon: "success",
                        position: "top",
                        showCancelButton: false,
                        showConfirmButton: false,
                        toast: true,
                        timer: 1500,
                    });
                    this.getTempList();
                    this.itemName = null;
                } else {
                    this.$swal({
                        title: "임시 저장이 실패되었습니다.",
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
            });
    }
    tempOpen() {
        this.interimStorage = true;
        this.getTempList();
    }

    removeTemp() {
        let joborderTemp: any = {
            id: [],
        };

        for (var k = 0; k < this.templist.length; k++) {
            joborderTemp.id.push(this.templist[k].id);
        }

        this.$swal
            .fire({
                title: "삭제",
                text: "해당 데이터를 전체 삭제 하시겠습니까?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "삭제",
            })
            .then((result) => {
                if (result.isConfirmed) {
                    api.operation
                        .deletetempList(joborderTemp)
                        .then((response) => {
                            if (response.status == 200) {
                                this.$swal({
                                    title: "삭제되었습니다",
                                    icon: "success",
                                    position: "top",
                                    showCancelButton: false,
                                    showConfirmButton: false,
                                    toast: true,
                                    timer: 1500,
                                });
                                this.interimStorage = true;
                                this.getTempList();
                            } else {
                                this.$swal({
                                    title: "삭제가 실패되었습니다.",
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
                        });
                }
            });
    }
    tempDelete(item: any) {
        let joborderTemp = {
            id: item.id,
        };

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
                    api.operation
                        .deletetempList(joborderTemp)
                        .then((response) => {
                            if (response.status == 200) {
                                this.$swal({
                                    title: "삭제되었습니다",
                                    icon: "success",
                                    position: "top",
                                    showCancelButton: false,
                                    showConfirmButton: false,
                                    toast: true,
                                    timer: 1500,
                                });
                                this.getTempList();
                                this.interimStorage = true;
                                this.orderData = {
                                    name: "",
                                    customer: "",
                                    department: "",
                                    departmentchargeName: "",
                                    deadline: "",
                                    memo: "",
                                    details: [],
                                };
                            } else {
                                this.$swal({
                                    title: "삭제 실패되었습니다.",
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
                        });
                }
            });
    }
    aboutTemp(event: any, item: any) {
        this.itemDetail = [];

        this.interimStorage = false;
        this.orderData.name = item.name;
        //customer 변수 확인 필요
        // if (this.customer != null) {
        //   this.orderData.customer = item.customer.id;
        // }
        this.orderData.department = {
            departmentId: item.departmentId,
            departmentName: item.departmentName,
        };
        this.orderData.departmentchargeName = item.chargeName;
        this.orderData.deadline = item.deadline;
        this.orderData.memo = item.memo;

        for (var i = 0; i < item.details.length; i++) {
            this.itemDetail[i] = {
                count: item.details[i].count,
                id: item.details[i].itemId,
                name: item.details[i].itemName,
                version: item.details[i].itemVersion,
            };
        }
    }

    cloneItem(item: any) { //거래처 명 클릭 시 
        this.accountName = item.customerName
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
            console.log(this.datas_simple, '데이타스심플데이타스심플데이타스심플')
        })
    }





}
</script>
<style src="./OrderManagement.scss" lang="scss">

</style>
