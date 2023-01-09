<template>
  <div>
    <v-container>
      <v-row>
        <v-col md="12">
          <h4 class="searchbox-title">조회 조건</h4>
          <v-sheet class="pa-3" color="#F6F8F9" height="180">
            <v-row>
              <v-col cols="4">
                <v-text-field name="name" label="설비명" id="id"></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field name="name" label="제품명" id="id"></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col md="2">
                <v-menu
                  ref="startDate"
                  v-model="menu_start_date"
                  :close-on-content-click="false"
                  :return-value.sync="startDate"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="startDate"
                      label="시작일"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="startDate"
                    no-title
                    scrollable
                    locale="ko-KR"
                    :max="endDate"
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="primary"
                      @click="menu_start_date = false"
                    >
                      취소
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="s_date_search(startDate)"
                    >
                      확인
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col md="2">
                <v-menu
                  ref="endDate"
                  v-model="menu_end_date"
                  :close-on-content-click="false"
                  :return-value.sync="endDate"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="endDate"
                      label="종료일"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="endDate"
                    no-title
                    scrollable
                    locale="ko-KR"
                    :min="startDate"
                  >
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menu_end_date = false">
                      취소
                    </v-btn>
                    <v-btn text color="primary" @click="e_date_search(endDate)">
                      확인
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col md="6">
                <v-row>
                  <h4 class="text-lg-left pt-5">상태 :</h4>
                  <v-checkbox
                    class="ml-3"
                    color="primary"
                    label="검사 대기"
                    value="1"
                    v-model="search_status_filter"
                  >
                  </v-checkbox>
                  <v-checkbox
                    class="ml-3"
                    color="primary"
                    label="검사 진행중"
                    value="2"
                    v-model="search_status_filter"
                  >
                  </v-checkbox>
                  <v-checkbox
                    class="ml-3"
                    color="primary"
                    label="검사 완료"
                    value="3"
                    v-model="search_status_filter"
                  >
                  </v-checkbox>
                  <v-checkbox
                    class="ml-3"
                    color="primary"
                    label="설비 이상"
                    value="4"
                    v-model="search_status_filter"
                  >
                  </v-checkbox>
                </v-row>
              </v-col>
              <v-col class="text-right" md="2">
                <v-btn color="primary" x-large>검색</v-btn>
              </v-col>
            </v-row>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row>
        <v-col md="12">
          <v-row class="mb-2">
            <v-col md="2">
              <h4 class="searchbox-title">출고 이력</h4>
            </v-col>
            <v-col class="text-right" offset-md="7" md="3">
              <v-btn class="ml-9" small color="primary"
                ><v-icon left> mdi-microsoft-excel </v-icon>엑셀다운</v-btn
              >
              <v-btn class="ml-1" small color="primary"
                ><v-icon left> mdi-printer </v-icon>프린트</v-btn
              >
            </v-col>
          </v-row>

          <v-data-table
            v-model="selected"
            :headers="headers"
            :items="shipping_list"
            item-key="barcode"
            class="elevation-1"
            :search="search"
            :custom-filter="filterOnlyCapsText"
            show-select
            multi-sort
          >
            <!-- <template v-slot:top>
              <v-switch
                v-model="singleSelect"
                label="Single select"
                class="pa-3"
              ></v-switch>
            </template> -->
            <template v-slot:item.weight="{ item }">
              {{ item.weight + "kg" }}
            </template>
            <template v-slot:item.ship_weight="{ item }">
              {{ item.ship_weight + "kg" }}
            </template>
            <template v-slot:item.stock_weight="{ item }">
              {{ item.stock_weight + "kg" }}
            </template>
            <template v-slot:item.status="{ item }">
              <!-- <v-chip :color="getStatusColor(item.status)" dark>
                {{ item.status }}
              </v-chip> -->
              <v-btn
                class="text-left ma-2"
                small
                :color="getStatusColor(item.status)"
                dark
                style="width: 100px"
              >
                <v-icon left> mdi-album </v-icon>
                {{ item.status }}
              </v-btn>
            </template>
            <!-- 수정 -->
            <template v-slot:item.barcode="{ item }">
              <barcode
                v-bind:value="item.barcode"
                height="30"
                displayValue="false"
              >
              </barcode>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import VueBarcode from "vue-barcode";
import { shipping_list } from "@/demo/demo_data";
export default {
  name: "ShippingHis",
  components: {
    barcode: VueBarcode,
  },
  data() {
    return {
      search_status_filter: [],
      menu_start_date: false,
      menu_end_date: false,
      startDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      endDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),

      selected: [],
      barcodeValue: "test",
      search: "",
      calories: "",
      shipping_list: shipping_list,
    };
  },
  methods: {
    getStatusColor(status) {
      switch (status) {
        case "출고":
          return "orange";
        case "충전":
          return "success";
        case "이상 반품":
          return "red";
      }
    },
    s_date_search(v) {
      this.startDate = v;
      this.menu_start_date = false;
      this.$refs.startDate.save(v);
    },
    e_date_search(v) {
      this.endDate = v;
      this.menu_end_date = false;
      this.$refs.endDate.save(v);
    },
  },
  computed: {
    headers() {
      return [
        { text: "종류", value: "type" },
        { text: "오픈날짜", value: "createDate" },
        { text: "바코드", value: "barcode" },
        { text: "총량", value: "weight" },
        { text: "상태", value: "status" },
        { text: "출고량", value: "ship_weight" },
        { text: "잔량", value: "stock_weight" },
      ];
    },
  },
};
</script>

<style src="./Shipping_His.scss" lang="scss"></style>
