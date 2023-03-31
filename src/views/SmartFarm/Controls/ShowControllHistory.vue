<template>
  <div>
    <v-container fluid v-resize="onResize">
      <v-row>
        <v-col class="ma-2" cols="12">
          <span class="searchbox-title">조회 조건</span>
          <v-card class="card-shadow pa-3" height="65">
            <v-row dense>
              <v-col cols="2">
                <v-select :items="search_list2" label="구역항목" v-model="search_type_2" item-text="facilityName" solo rounded
                  item-value="facilityId" @change="changeRoomData()" dense></v-select>
              </v-col>
              <v-col cols="2">
                <v-select :items="search_list1" label="제어항목" v-model="search_type_1" item-text="equipmentName" solo
                  rounded item-value="equipmentId" :disabled="search_list1.length == 0" dense multiple></v-select>
              </v-col>
              <v-col cols="2">
                <v-menu ref="menu1" v-model="menu1" :close-on-content-click="false" :return-value.sync="s_date"
                  transition="scale-transition" offset-y min-width="290px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field v-model="s_date" prepend-icon="mdi-calendar" readonly v-bind="attrs"
                      v-on="on"></v-text-field>
                  </template>
                  <v-date-picker v-model="s_date" no-title scrollable :max="e_date">
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menu1 = false">Cancel</v-btn>
                    <v-btn text color="primary" @click="s_date_search(s_date)">OK</v-btn>
                  </v-date-picker>
                </v-menu>

                <!-- 시작일 -->
              </v-col>
              <v-col cols="2">
                <v-menu ref="menu2" v-model="menu2" :close-on-content-click="false" :return-value.sync="e_date"
                  transition="scale-transition" offset-y min-width="290px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field v-model="e_date" prepend-icon="mdi-calendar" readonly v-bind="attrs"
                      v-on="on"></v-text-field>
                  </template>
                  <v-date-picker v-model="e_date" no-title scrollable :min="s_date" :max="date">
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menu2 = false">Cancel</v-btn>
                    <v-btn text color="primary" @click="e_date_search(e_date)">OK</v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-spacer></v-spacer>
              <v-col class="text-right" cols="2">
                <v-btn color="primary" @click="getHistory" large elevation="0">
                  조회
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col class="ma-2" cols="12">
          <v-row dense class="mb-2">
            <v-col cols="1" align-self="center">
              <span class="searchbox-title">조회 결과</span>
            </v-col>
          </v-row>

          <v-card>
            <v-data-table :headers="datas_header" :items="datas" :page.sync="page" :options.sync="options"
              :server-items-length="totalData" :items-per-page="itemsPerPage" :loading="loading" hide-default-footer
              @page-count="pageCount = $event" :height="table_height" multi-sort>
              <!-- 버튼을 chip으로 표현 -->
              <template v-slot:item.before="{ item }">
                <!-- 수정전 버튼만-->
                <div v-if="
                  item.before == 'ON' ||
                  item.before == 'OFF' ||
                  item.before == 'AUTO'
                ">
                  <v-chip :color="getColor(item.before)" dark class="d-flex justify-center">
                    {{ item.settingTemperatureBefore || item.before }}
                  </v-chip>
                </div>
                <!-- 수정전 숫자만 -->
                <span v-else v-html="item.before"></span>
                <!-- <div v-else>{{ item.before }}</div> -->
              </template>
              <template v-slot:item.after="{ item }">
                <!-- 수정후 버튼만 -->
                <div v-if="
                  item.after == 'ON' ||
                  item.after == 'AUTO' ||
                  item.after == 'OFF'
                ">
                  <v-chip :color="getColor(item.after)" dark class="d-flex justify-center">
                    {{ item.settingTemperatureAfter || item.after }}
                  </v-chip>
                </div>
                <!-- 수정후 숫자만 -->
                <span v-else v-html="item.after"></span>
                <!-- <div v-else>{{ item.after }}</div> -->
              </template>
              <template v-slot:item.humidifier="{ item }">
                <v-chip v-if="item.humidifier" :color="getColor(item.humidifier)" dark class="d-flex justify-center">
                  {{ item.humidifier }}
                </v-chip>
              </template>
              <template v-slot:item.airFan="{ item }">
                <v-chip v-if="item.airFan" :color="getColor(item.airFan)" dark class="d-flex justify-center">
                  {{ item.airFan }}
                </v-chip>
              </template>
              <template v-slot:item.ledFirst="{ item }">
                <v-chip v-if="item.ledFirst" :color="getColor(item.ledFirst)" dark class="d-flex justify-center">
                  {{ item.ledFirst }}
                </v-chip>
              </template>
              <template v-slot:item.ledSecond="{ item }">
                <v-chip v-if="item.ledSecond" :color="getColor(item.ledSecond)" dark class="d-flex justify-center">
                  {{ item.ledSecond }}
                </v-chip>
              </template>
            </v-data-table>
          </v-card> <v-pagination circle v-model="page" :length="pageCount"></v-pagination>
        </v-col>
      </v-row>
      <!-- 거래처 생성 모달 -->
    </v-container>
  </div>
</template>

<script>
import * as api from "@/api/index.js";
export default {
  name: "CustomerMng",

  data() {
    return {
      table_height: 0,
      page: 1,
      totalData: 0, //총 데이타의 개수 백엔드에서받아서 교체할것임
      loading: false,
      itemsPerPage: 12,
      pageCount: 10,
      options: {},
      datas_header: [
        {
          text: "이름",
          align: "start",
          value: "equipmentName",
        },
        { text: "제어명칭", value: "targetValue" },

        { text: "수정전", value: "before" },
        { text: "수정후", value: "after" },
        { text: "수정시간", value: "createdDate" },
        { text: "온도", value: "temperature" },
        { text: "습도", value: "humidity" },
        { text: "에어컨", value: "settingTemperature" },
        { text: "가습기", value: "humidifier" },
        { text: "환기팬", value: "airFan" },
        { text: "LED1", value: "ledFirst" },
        { text: "LED2", value: "ledSecond" },
        { text: "수정자", value: "createdId" },
        { text: "메모", value: "memo", width: "200px" },
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
    this.onResize();
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
        facilityId: this.search_type_2,
      };

      api.smartfarm.getEquipmentlist(reqData).then((res) => {
        console.log("getEquipmentlist", res);
        this.search_type_1 = [];
        this.search_list1 = res.data.responseData;
      });
    },
    onResize() {
      this.table_height = window.innerHeight - 48 - 129 - 44 - 44 - 20;
      console.log("onResize", this.table_height);
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
    getColor(value) {
      if (value == "ON") return "green";
      else if (value == "OFF") return "grey";
      else if (value == "AUTO") return "blue";
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
          this.datas.forEach((row) => {
            row["before"] = "";
            row["after"] = "";

            if (row["targetValue"] == "설정변경") {
              row["details"].forEach((detail) => {
                if (
                  detail["startTimeBefore"] ||
                  detail["endTimeBefore"] ||
                  detail["minValueBefore"] ||
                  detail["maxValueBefore"]
                ) {
                  row["before"] +=
                    detail["startTimeBefore"] +
                    "~" +
                    detail["endTimeBefore"] +
                    "  " +
                    detail["minValueBefore"];
                  if (detail["minValueBefore"] != detail["maxValueBefore"]) {
                    row["before"] += "~" + detail["maxValueBefore"];
                  }
                  row["before"] += "<br>";
                }
                if (
                  detail["startTimeAfter"] ||
                  detail["endTimeAfter"] ||
                  detail["minValueAfter"] ||
                  detail["maxValueAfter"]
                ) {
                  row["after"] +=
                    detail["startTimeAfter"] +
                    "~" +
                    detail["endTimeAfter"] +
                    "  " +
                    detail["minValueAfter"];
                  if (detail["minValueAfter"] != detail["maxValueAfter"]) {
                    row["after"] += "~" + detail["maxValueAfter"];
                  }
                  row["after"] += "<br>";
                }
              });
            } else if (row["targetValue"] == "주기설정") {
              row["before"] =
                "설정값 : " +
                row["settingTemperatureBefore"] +
                "<br>기준날짜 : " +
                row["standardDateBefore"] +
                "<br>반복기간 : " +
                row["repeatPeriodBefore"];
              row["after"] =
                "설정값 : " +
                row["settingTemperatureAfter"] +
                "<br>기준날짜 : " +
                row["standardDateAfter"] +
                "<br>반복기간 : " +
                row["repeatPeriodAfter"];
            } else {
              row["before"] = row["statusBefore"];
              row["after"] = row["statusAfter"];
            }
          });
          console.log("SSSSSSSSSSS", this.datas);
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

<style scoped>
.v-chip {
  height: 27px;
  width: 60px;
}

.v-card {
  background-color: white;
  box-shadow: 0 20px 27px 0 rgba(0, 0, 0, 0.05) !important;
}
</style>
