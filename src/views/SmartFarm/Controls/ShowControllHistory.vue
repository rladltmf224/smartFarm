<template>
  <div>
    <v-container fluid>
      <v-row class="">
        <v-col class="ma-2" md="12">
          <h4 class="searchbox-title">조회 조건</h4>
          <v-sheet class="pa-3" color="#F6F8F9" height="80" elevation="2">
            <v-row>
              <v-col cols="12" class="">
                <v-row class="">
                  <v-col cols="2" class="d-flex align-center">
                    <v-select
                      :items="search_list2"
                      label="구역항목"
                      v-model="search_type_2"
                      item-text="roomName"
                      item-value="roomId"
                      @change="changeRoomData()"
                      dense
                    ></v-select>
                  </v-col>
                  <v-col cols="2" class="d-flex align-center">
                    <v-select
                      :items="search_list1"
                      label="제어항목"
                      v-model="search_type_1"
                      item-text="equipmentName"
                      item-value="equipmentId"
                      :disabled="search_list1.length == 0"
                      dense
                      multiple
                    ></v-select>
                  </v-col>

                  <v-col md="2" class="d-flex align-center">
                    <!-- 시작일 -->

                    <v-menu
                      ref="menu1"
                      v-model="menu1"
                      :close-on-content-click="false"
                      :return-value.sync="s_date"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="s_date"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="s_date"
                        no-title
                        scrollable
                        :max="e_date"
                      >
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="menu1 = false"
                          >Cancel</v-btn
                        >
                        <v-btn
                          text
                          color="primary"
                          @click="s_date_search(s_date)"
                          >OK</v-btn
                        >
                      </v-date-picker>
                    </v-menu>

                    <!-- 시작일 -->
                  </v-col>
                  <!-- 종료일 -->

                  <v-col md="2" class="d-flex align-center">
                    <v-menu
                      ref="menu2"
                      v-model="menu2"
                      :close-on-content-click="false"
                      :return-value.sync="e_date"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="e_date"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="e_date"
                        no-title
                        scrollable
                        :min="s_date"
                        :max="date"
                      >
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="menu2 = false"
                          >Cancel</v-btn
                        >
                        <v-btn
                          text
                          color="primary"
                          @click="e_date_search(e_date)"
                          >OK</v-btn
                        >
                      </v-date-picker>
                    </v-menu>

                    <!-- 종료일 --> </v-col
                  ><v-col cols="1">
                    <v-col class="text-right d-flex align-center">
                      <v-btn color="primary" @click="getHistory()">
                        조회
                      </v-btn>
                    </v-col>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
    <v-container fluid>
      <v-row>
        <v-col class="ma-2" md="12">
          <v-row class="">
            <v-col md="2">
              <h4 class="searchbox-title">조회결과</h4>
            </v-col>
          </v-row>

          <div>
            <v-data-table
              :headers="datas_header"
              :items="datas"
              :page.sync="page"
              :options.sync="options"
              :server-items-length="totalData"
              :items-per-page="itemsPerPage"
              :loading="loading"
              hide-default-footer
              class="elevation-1"
              @page-count="pageCount = $event"
              dense
              :height="700"
              multi-sort
            >
              <!-- 버튼을 chip으로 표현 -->
              <template v-slot:item.valueBefore="{ item }">
                <!-- 수정전 버튼만-->
                <div
                  v-if="
                    item.valueBefore == 'ON' ||
                    item.valueBefore == 'OFF' ||
                    item.valueBefore == 'AUTO' ||
                    item.valueAfter == 'ON' ||
                    item.valueAfter == 'AUTO' ||
                    item.valueAfter == 'OFF'
                  "
                >
                  <v-chip :color="getColor(item.valueBefore)" dark>
                    {{ item.valueBefore }}
                  </v-chip>
                </div>
                <!-- 수정전 숫자만 -->
                <div v-else>{{ item.valueBefore }}</div>
              </template>
              <template v-slot:item.valueAfter="{ item }">
                <!-- 수정후 버튼만 -->
                <div
                  v-if="
                    item.valueBefore == 'ON' ||
                    item.valueAfter == 'OFF' ||
                    item.valueAfter == 'AUTO' ||
                    item.valueAfter == 'ON' ||
                    item.valueAfter == 'AUTO' ||
                    item.valueAfter == 'OFF'
                  "
                >
                  <v-chip :color="getColor(item.valueAfter)" dark>
                    {{ item.valueAfter }}
                  </v-chip>
                </div>
                <!-- 수정후 숫자만 -->
                <div v-else>{{ item.valueAfter }}</div>
              </template>
              <!-- 제어명칭 -->
              <template v-slot:item.targetValue="{ item }">
                {{ item.targetValue }}
              </template>
              <!-- 제어명칭 -->
            </v-data-table>
            <div class="text-center pt-2">
              <v-pagination v-model="page" :length="pageCount"></v-pagination>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <!-- 거래처 생성 모달 -->
  </div>
</template>

<script>
import * as api from "@/api/index.js";
export default {
  name: "CustomerMng",

  data() {
    return {
      //이슬이꺼
      //테스트
      page: 1,
      totalData: 0, //총 데이타의 개수 백엔드에서받아서 교체할것임
      loading: false,
      itemsPerPage: 20,
      pageCount: 10,
      options: {},
      datas_header: [
        {
          text: "이름",
          align: "start",
          value: "equipmentName",
        },
        { text: "제어명칭", value: "targetValue" },

        { text: "수정전", value: "valueBefore" },
        { text: "수정후", value: "valueAfter" },
        { text: "수정시간", value: "createdDate" },
      ],
      datas: [],
      startDate: false,
      endDate: false,
      date: new Date().toISOString().substr(0, 10),
      s_date: new Date().toISOString().substr(0, 10),
      e_date: new Date().toISOString().substr(0, 10),
      menu1: false,
      menu2: false,
      search_list1: [],
      search_type_1: [],
      search_list2: [],
      search_type_2: "",

      search_condition: {
        controlItem: [],
        selectedRoom: "",
        startDate: "",
        endDate: "",
      },
    };
  },
  created() {
    api.smartfarm.getRoomlist().then((res) => {
      console.log("getRoomlist", res);
      this.search_list2 = res.data.responseData;
    });
  },
  mounted() {
    this.BeforeWeeks();
    this.getHistory();
  },
  watch: {
    options: {
      handler() {
        this.getHistory();
      },
      deep: true,
    },
  },
  methods: {
    changeRoomData() {
      let reqData = {
        roomId: this.search_type_2,
      };

      api.smartfarm.getEquipmentlist(reqData).then((res) => {
        console.log("getEquipmentlist", res);
        this.search_list1 = res.data.responseData;
      });
    },
    // 시작일을 일주일전으로
    BeforeWeeks() {
      let nowDate = new Date();
      let weekDate = nowDate.getTime() - 7 * 24 * 60 * 60 * 1000;
      nowDate.setTime(weekDate);

      let weekYear = nowDate.getFullYear();
      let weekMonth = nowDate.getMonth() + 1;
      let weekDay = nowDate.getDate();

      if (weekMonth < 10) {
        weekMonth = "0" + weekMonth;
      }
      if (weekDay < 10) {
        weekDay = "0" + weekDay;
      }

      let resultDate = weekYear + "-" + weekMonth + "-" + weekDay;
      this.s_date = resultDate;
      console.log(resultDate);
    },
    // 시작일을 일주일전으로
    // 수정전,수정후 버튼색
    getColor(valueBefore) {
      if (valueBefore == "ON") return "green";
      else if (valueBefore == "OFF") return "grey";
      else if (valueBefore == "AUTO") return "blue";
      else return "yellow";
    },
    // 제어상태 히스토리 api
    getHistory() {
      this.loading = true;
      const { page, itemsPerPage, sortBy, sortDesc } = this.options;

      var item = {
        room: this.search_type_2,
        equipmentIds: this.search_type_1,
        startDate: this.s_date,
        endDate: this.e_date,
        page: page,
        size: itemsPerPage, //보여주고싶은 행의개수
        sortBy: sortBy,
        sortDesc: sortDesc,
      };
      api.smartfarm
        .getEquipmentHistory(item)
        .then((response) => {
          console.log("리스폰스리스폰스리스폰스리스폰스", response);
          this.loading = false; //로딩바
          this.datas = response.data.responseData;
          this.totalData = response.data.totalCount; //나타낼 행의 개수
        })
        .catch((error) => {
          console.log(error);
        });
    },

    s_date_search(v) {
      this.s_date = v;
      this.menu1 = false;
      this.$refs.menu1.save(v);
    },
    e_date_search(v) {
      this.e_date = v;
      this.menu2 = false;
      this.$refs.menu2.save(v);
    },
  },

  computed: {},
};
</script>
