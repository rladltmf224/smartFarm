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
            <v-data-table dense :height="table_height" :headers="headers" :items="table_data" multi-sort
              :items-per-page="options.itemsPerPage" hide-default-footer :page.sync="options.page" :options.sync="options"
              item-key="newKey">
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
          <v-pagination v-model="options.page" :length="options.pageCount" circle :total-visible="11"></v-pagination>
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
    // { text: "알람횟수", value: "num", sortable: false },
    { text: "조치일시", value: "checkedDate", sortable: false },
    { text: "조치자", value: "checker", sortable: false },
  ];
  alarmList: any[] = [];
  table_data: any[] = []; // 테이블에 보여줄 데이터
  options: any = {
    page: 0
  }
  page: number = 0;
  itemsPerPage: number = 15
  table_height: number = 0;
  sortState: any = [];

  created() {
    this.options = Object.assign({}, gridCfg);
  }

  @Watch('options', { deep: true })
  changeOptions() {
    let header = this.options.sortBy;
    let value = this.options.sortDesc;

    let sortState = header.map((columnName: any, index: any) => { //선택된 sort를 이쁘게가공하기
      return { ascending: value[index], columnName };
    });

    this.sortState = sortState;

    this.getData()


  }
  getData() {
    const { sortBy, sortDesc, page, itemsPerPage } = this.options;
    let local: any = localStorage.getItem("userId");
    let userId = JSON.parse(local) || "";
    let param: any = {
      userId: userId,
      startDate: this.search_condition.startDate,
      endDate: this.search_condition.endDate,
      getAll: true,
      page: this.options.page,
      size: this.options.itemsPerPage,
    }


    let str: any = JSON.stringify(param)
    str = str.slice(0, -1);
    str = str.substring(1);

    let pageNum = this.options.page - 1


    let queryString = "?";
    queryString += "userId=" + userId;
    queryString += "&page=" + pageNum;
    queryString += "&size=" + this.options.itemsPerPage;
    queryString += "&startDate=" + this.search_condition.startDate;
    queryString += "&endDate=" + this.search_condition.endDate;


    let sortState = this.sortState;
    this.sortState.forEach((state: any) => {
      queryString += "&sort=" + state.columnName + ',' + (state.ascending ? "asc" : "desc")
    });
    api.alarm
      .alarmList(
        queryString
      )
      .then((response) => {
        this.options.pageCount = response.data.data.totalPages;
        this.table_data = _.map(response.data.data.content, "alarmProcess"); //여기가 문제같음.







        //this.table_data = _.uniqBy(this.alarmList, "id");
        for (let i = 0; i < this.table_data.length; i++) {
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

          //발생일시를 가공
          let date = this.table_data[i]["createdDate"]
          this.table_data[i]["createdDate"] = `${date[0]}-${(date[1] < 10 ? '0' : '') + date[1]}-${(date[2] < 10 ? '0' : '') + date[2]} ${(date[3] < 10 ? '0' : '') + date[3]}:${(date[4] < 10 ? '0' : '') + date[4]}:${(date[5] < 10 ? '0' : '') + date[5]}`;
          //조치일시를 가공
          let checkedDate = this.table_data[i].checkedDate
          if (this.table_data[i].checkedDate) {
            this.table_data[i]["checkedDate"] = `${checkedDate[0]}-${(date[1] < 10 ? '0' : '') + checkedDate[1]}-${(checkedDate[2] < 10 ? '0' : '') + checkedDate[2]} ${(checkedDate[3] < 10 ? '0' : '') + checkedDate[3]}:${(checkedDate[4] < 10 ? '0' : '') + checkedDate[4]}:${(date[5] < 10 ? '0' : '') + checkedDate[5]}`;
          }


        }


        //table_data의 length만큼 새로운key와 value추가
        for (let k = 0; k < this.table_data.length; k++) {
          this.table_data[k].newKey = k
        }
        console.log(this.table_data);



      });
  }

  mounted() {
    this.onResize();
    this.getData();
  }
  onResize() {
    this.table_height = window.innerHeight - 48 - 129 - 44 - 44 - 20;
    console.log("onResize", this.table_height);
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
  check(id: number): void {
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

<style lang="scss" scoped></style>
