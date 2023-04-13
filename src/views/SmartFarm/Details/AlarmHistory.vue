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
            <v-data-table :loading="loading" dense :height="table_height" :headers="headers" :items="cloneItems"
              multi-sort :items-per-page="itemsPerPage" hide-default-footer @update:options="options = $event"
              @click:header="onHeaderClick">
              <template v-slot:bottom>
                <div class="text-center pt-2">
                  <v-pagination v-model="page" :length="options.pageCount"></v-pagination>
                </div>
              </template>
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
          <v-pagination v-model="pagination.page" :length="pages" circle @input="onPageChange"></v-pagination>
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
    { text: "알람횟수", value: "num", sortable: false },
    { text: "조치일시", value: "checkedDate", sortable: false },
    { text: "조치자", value: "checker", sortable: false },
  ];
  alarmList: any[] = [];
  table_data: any[] = []; // 테이블에 보여줄 데이터
  options: any = {
    pageCount: 1,
  }
  page: number = 1
  itemsPerPage: number = 15
  pagination: any = {
    page: 1,
    total: 0,
    rowsPerPage: 15
  }
  table_height: number = 0;
  sortState: any = [];
  loading: boolean = false;
  created() {
    //this.options = Object.assign({}, gridCfg);
  }





  @Watch('options', { deep: true })
  changeOptions() {
    let header = this.options.sortBy;
    let value = this.options.sortDesc;

    let sortState = header.map((columnName: any, index: any) => {
      return { ascending: value[index], columnName };
    });

    this.sortState = sortState;

    this.getData()



    /*     let obj: any = {}; //파라미터로 넣을 객체 만들기
    
        for (let i = 0; i < header.length; i++) { //선택된 header만큼 반복해라
          obj[`sort${i + 1}`] = value[i] ? `${header[i]},desc` : `${header[i]},asc`;
        }
     */
    //obj객체의 키가sort1,sort2..이렇게1씩증가함.
    //header의 값이 참이면 desc고 거짓이면 asc라고 값을 넣음.


    // this.getData()

  }
  getData() {
    this.loading = true;
    const { sortBy, sortDesc } = this.options;
    let local: any = localStorage.getItem("userId");
    let userId = JSON.parse(local) || "";
    let param: any = {
      userId: userId,
      startDate: this.search_condition.startDate,
      endDate: this.search_condition.endDate,
      getAll: true,
      page: this.pagination.page,
      size: this.pagination.rowsPerPage,
    }



    let str: any = JSON.stringify(param)
    str = str.slice(0, -1);
    str = str.substring(1);



    let queryString = "?";
    queryString += "userId=" + userId;
    queryString += "&page=" + this.pagination.page;
    queryString += "&size=20";
    queryString += "&startDate=" + this.search_condition.startDate;
    queryString += "&endDate=" + this.search_condition.endDate;


    let sortState = this.sortState;
    sortState.forEach((state: any) => {
      queryString += "&sort=" + state.columnName + ',' + (state.ascending ? "asc" : "desc")
    });


    api.alarm
      .alarmList(
        queryString
      )
      .then((response) => {
        this.loading = false;
        this.alarmList = _.map(response.data.data.content, "alarmProcess");
        console.log("1111111111111", this.alarmList);
        this.table_data = _.uniqBy(this.alarmList, "id");
        console.log("22222222222", this.table_data);
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
          this.table_data[i]["createdDate"] = new Date(
            this.table_data[i]["createdDate"][0],
            this.table_data[i]["createdDate"][1] - 1,
            this.table_data[i]["createdDate"][2],
            this.table_data[i]["createdDate"][3],
            this.table_data[i]["createdDate"][4],
            this.table_data[i]["createdDate"][5],
            this.table_data[i]["createdDate"][6]
          )
            .toISOString()
            .replace("T", " ")
            .replace(".000Z", "");
          if (this.table_data[i]["checkedDate"]) {
            this.table_data[i]["checkedDate"] = new Date(
              this.table_data[i]["checkedDate"][0],
              this.table_data[i]["checkedDate"][1] - 1,
              this.table_data[i]["checkedDate"][2],
              this.table_data[i]["checkedDate"][3],
              this.table_data[i]["checkedDate"][4],
              this.table_data[i]["checkedDate"][5],
              this.table_data[i]["checkedDate"][6]
            )
              .toISOString()
              .replace("T", " ")
              .replace(".000Z", "");
          }
        }
        this.pagination.total = this.table_data.length //페이징처리를 위해 코드추가함
        console.log(this.table_data);
      });
    this.options.totalCount = 3;
  }














  mounted() {
    this.onResize();
    this.getData();
  }



  onHeaderClick() {
    console.log('우앵')
  }


  onResize() {
    this.table_height = window.innerHeight - 48 - 129 - 44 - 44 - 20;
    console.log("onResize", this.table_height);
  }

  onPageChange(event: any) { //클릭한 페이지의 숫자를 콘솔에띄우기
    console.log(event)
  }

  get pages() {
    return Math.ceil(this.pagination.total / this.pagination.rowsPerPage)
  }


  get cloneItems() { //table_data를 cloneItems로 변환
    var clone = JSON.parse(JSON.stringify(this.table_data));
    var startFrom = (this.pagination.page * this.pagination.rowsPerPage) - this.pagination.rowsPerPage;
    return clone.splice(startFrom, this.pagination.rowsPerPage);
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
