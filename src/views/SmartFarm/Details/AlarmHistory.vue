<template>
  <div>
    <v-container fluid v-resize="onResize">
      <v-row>
        <v-col class="ma-2" cols="12">
          <span class="searchbox-title">조회 조건</span>
          <v-card class="card-shadow pa-3" height="65">
            <v-row dense>
              <v-col cols="2">
                <v-menu ref="startDate" v-model="startDate" :close-on-content-click="false"
                  :return-value.sync="search_condition.startDate" transition="scale-transition" offset-y min-width="auto">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field v-model="search_condition.startDate" label="시작일" prepend-icon="mdi-calendar" readonly
                      v-bind="attrs" v-on="on" dense></v-text-field>
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
                  :return-value.sync="search_condition.endDate" transition="scale-transition" offset-y min-width="auto">
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
              <v-spacer></v-spacer>
              <v-col class="text-right" cols="2">
                <v-btn color="primary" @click="getData()" large elevation="0">
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
              <span class="searchbox-title"></span>
            </v-col>
          </v-row>
          <v-card>
            <v-data-table :height="table_height" :headers="headers" :items="table_data" fixed-header multi-sort
              :options.sync="itemListCfg.options" :server-items-length="itemListCfg.totalCount"
              :loading="itemListCfg.loading" :items-per-page="itemListCfg.itemsPerPage" :page.sync="itemListCfg.page"
              @page-count="itemListCfg.pageCount = $event" hide-default-footer>
              <template v-slot:item.value="{ item }">
                <span v-html="item.value"></span>
              </template>
              <template v-slot:item.type="{ item }">
                <v-chip class="mr-3" :color="item.type == 'caution' ? 'warning' : 'error'">
                  {{ item.type == "caution" ? "주의" : "경고" }}
                </v-chip>
              </template>
              <template v-slot:item.checkedDate="{ item }">
                <span v-if="item.checkedDate" v-html="item.checkedDate"></span>
                <v-btn v-else color="primary" elevation="0" @click="check(item.id)">
                  조치
                </v-btn>
              </template>
            </v-data-table>
          </v-card>
          <v-pagination circle v-model="itemListCfg.page" :length="itemListCfg.pageCount"></v-pagination>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import * as api from "@/api";
import { gridCfg } from "@/util/config";
import { Component, Vue, Watch } from "vue-property-decorator";
import _, { clone } from "lodash";
import { stringify } from "querystring";


@Component({
  components: {},
  filters: {},
})
export default class AlarmHistory extends Vue {
  startDate: boolean = false;
  endDate: boolean = false;
  search_condition: any = {
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  };
  headers: any[] = [
    { text: "발생일시", value: "createdDate" },
    { text: "위치", value: "room", sortable: false },
    { text: "제목", value: "title", sortable: false },
    { text: "설정범위", value: "setRange", sortable: false },
    { text: "값", value: "value", sortable: false },
    { text: "타입", value: "type", sortable: false },
    { text: "조치일시", value: "checkedDate", sortable: false },
    { text: "조치자", value: "checker", sortable: false },
  ];
  alarmList: any[] = [];
  table_data: any[] = []; // 테이블에 보여줄 데이터
  table_height: number = 0;
  sortState: any = [];
  queryString: string = '';
  loading: boolean = false;
  itemListCfg: any = {};

  created() {
    this.itemListCfg = Object.assign({}, gridCfg);
  }
  mounted() {
    this.onResize();
  }

  @Watch('itemListCfg.options', { deep: true })
  changeOptions() {
    this.getData()
  }
  setSorts() {
    const { sortBy, sortDesc } = this.itemListCfg.options;

    if (sortBy && sortDesc) {
      const sortState = sortBy.map((columnName: any, index: any) => ({
        ascending: sortDesc[index],
        columnName,
      }));
      this.sortState = sortState;
    }
  }
  getData() { //api 통신
    this.setSorts()
    this.makeParam()
    this.loading = true;
    api.alarm
      .alarmList(
        this.queryString
      )
      .then((response) => {
        this.itemListCfg.totalCount = response.data.data.totalElements;
        this.table_data = response.data.data.content
        this.loading = false;
        this.setContentString()
        this.setContentDate()
      }).catch((error) => {
        console.error(error)
      })
  }
  makeParam() { //api통신에 필요한 파라미터 가공
    let local: any = localStorage.getItem("userId");
    let userId = JSON.parse(local) || "";
    let param_page = this.itemListCfg.options.page - 1;
    let param_size = this.itemListCfg.options.itemsPerPage + 2;




    let param: any = {
      userId: userId,
      startDate: this.search_condition.startDate,
      endDate: this.search_condition.endDate,
      getAll: true,
      page: param_page,
      size: param_size
    }

    let queryString = "?"; //파라미터를 쿼리스트링파라미터로 바꾸는 과정 
    queryString += "userId=" + userId;
    queryString += "&page=" + param_page;
    queryString += "&size=" + param_size;
    queryString += "&startDate=" + this.search_condition.startDate;
    queryString += "&endDate=" + this.search_condition.endDate;

    this.sortState.forEach((state: any) => { //sortState 배열에서 참이면 asc 거짓이면 desc
      queryString += "&sort=" + state.columnName + ',' + (state.ascending ? "asc" : "desc")
    });
    this.queryString = queryString
  }
  setContentString() { //api 통신후 res.data안의 content string을 가공
    for (let i = 0; i < this.table_data.length; i++) { //res.data의 content string을 가공한다.
      let content = this.table_data[i].content.split("\n");
      this.table_data[i]["room"] = content[2].replace("room : ", "");
      this.table_data[i]["title"] = content[3].replace("알림 : ", "");
      this.table_data[i]["setRange"] = content[4].replace(
        "설정범위 : ",
        ""
      );
      this.table_data[i]["value"] =
        content[6].replace("- ", "") +
        "<br>" +
        content[7].replace("- ", "");
      this.table_data[i]["num"] = _.filter(this.alarmList, {
        id: this.table_data[i].id,
      }).length;
    }
  }
  setContentDate() { //api 통신후 res.data안의 date를 가공
    for (let i = 0; i < this.table_data.length; i++) { //res.data의 content string을 가공한다.
      //발생일시를 가공 
      let date = this.table_data[i]["createdDate"]
      this.table_data[i]["createdDate"] = `${date[0]}-${(date[1] < 10 ? '0' : '') + date[1]}-${(date[2] < 10 ? '0' : '') + date[2]} ${(date[3] < 10 ? '0' : '') + date[3]}:${(date[4] < 10 ? '0' : '') + date[4]}:${(date[5] < 10 ? '0' : '') + date[5]}`;
      //조치일시를 가공
      let checkedDate = this.table_data[i].checkedDate
      if (this.table_data[i].checkedDate) {
        this.table_data[i]["checkedDate"] = `${checkedDate[0]}-${(date[1] < 10 ? '0' : '') + checkedDate[1]}-${(checkedDate[2] < 10 ? '0' : '') + checkedDate[2]} ${(checkedDate[3] < 10 ? '0' : '') + checkedDate[3]}:${(checkedDate[4] < 10 ? '0' : '') + checkedDate[4]}:${(date[5] < 10 ? '0' : '') + checkedDate[5]}`;
      }
    }
  }
  onResize() {
    this.table_height = window.innerHeight - 48 - 129 - 44 - 44 - 20;
  }
  s_date_search(v: any) {
    this.search_condition.startDate = v;
    this.startDate = false;
    let startEL: any = this.$refs.startDate;
    startEL.save(v);
  }
  e_date_search(v: any) {
    this.search_condition.endDate = v;
    this.endDate = false;
    let endEL: any = this.$refs.endDate;
    endEL.save(v);
  }
  check(id: number): void { //조치버튼 클릭 시
    api.alarm
      .alarmCheck({ id: id })
      .then((response) => {
        if (response.status == 200) {
          this.getData();
          this.$swal({
            title: "알람을 조치 처리했습니다",
            icon: "success",
            position: "top",
            showCancelButton: false,
            showConfirmButton: false,
            toast: true,
            timer: 1500,
          });
        } else {
          this.$swal({
            title: "알람 조치 처리에 실패하였습니다",
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
        this.$swal({
          title: "알람 조치 처리에 실패하였습니다",
          icon: "error",
          position: "top",
          showCancelButton: false,
          showConfirmButton: false,
          toast: true,
          timer: 1500,
        });
      });
  }
}
</script>

<style lang="scss" src="../SmartFarm.scss" scoped></style>
