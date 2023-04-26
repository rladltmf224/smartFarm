<template>
  <div>
    <v-container fluid>
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
          <!--  <v-card> -->
          <!--      <v-data-table height="680" :headers="headers" :items="table_data" item-key="id" fixed-header multi-sort
              single-select dense :options.sync="options.options" :server-items-length="options.totalCount"
              :loading="options.loading" :items-per-page="options.itemsPerPage" :page.sync="options.page"
              @page-count="options.pageCount = $event" hide-default-footer>
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
                <v-btn v-else color="primary" @click="check(item.id)">
                  조치
                </v-btn>
              </template>
            </v-data-table>
          </v-card>
          <v-pagination circle v-model="testCount" :length="table_data.length" :total-visible="7"
            @input="pagecheck(options.page)"></v-pagination> -->
          <v-card>
            <v-data-table :headers="headers" :items="table_data" :items-per-page="test_itemsPerPage" hide-default-footer
              class="elevation-1" @update:options="options = $event">
              <template v-slot:bottom>
                <div class="text-center pt-2">
                  <v-pagination v-model="test_page" :length="test_options.pageCount"></v-pagination>
                </div>
              </template>
            </v-data-table>
          </v-card>



        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import * as api from "@/api";
import { gridCfg } from "@/util/config";
import { Component, Vue, Watch } from "vue-property-decorator";
import _ from "lodash";

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
    { text: "위치", value: "room" },
    { text: "제목", value: "title" },
    { text: "설정범위", value: "setRange" },
    { text: "값", value: "value" },
    { text: "타입", value: "type" },
    { text: "알람횟수", value: "num" },
    { text: "조치일시", value: "checkedDate" },
    { text: "조치자", value: "checker" },
  ];
  options: any = {};
  alarmList: any[] = [];
  table_data: any[] = []; // 테이블에 보여줄 데이터
  //test: string = ''; //테스트용

  //


  test_options: any = {
    pageCount: 1
  }
  test_page: number = 1
  test_itemsPerPage: number = 13







  //



  created() {
    this.options = Object.assign({}, gridCfg);
  }



  mounted() {
    this.getData();
  }


  get testCount() {
    return this.options.page
  }

  set testCount(val: any) {
    console.log('페이징 처리 입니다.')

    let listLeng = this.table_data.length;
    console.log('데이터총길이', listLeng)
    let listSize = this.options.page;
    console.log('listSize', listSize)
    let page = Math.floor(listLeng / listSize);
    if (listLeng % listSize > 0) page += 1;
    console.log('그래서페이지는?', page)
  }

  /*   set paginatedData(val: any) {
      let start = this.options.page * this.options.itemsPerPage;
      let end = start + this.options.itemsPerPage;
      return this.table_data.slice(start, end);
  
    } */



  @Watch("options.page", { deep: true }) //방금 누른 페이지 확인하기
  checkClickedPage(new_val: any, old_val: any) {
    console.log('new val : ' + new_val, 'old val:', old_val);
  }



  s_date_search(v: any) {
    this.search_condition.startDate = v;
    this.startDate = false;
    let startEL: any = this.$refs.startDate;
    startEL.save(v);
  }

  pagecheck(v: any) {
    console.log('방금클릭된페이지 넘버', v)
  }

  e_date_search(v: any) {
    this.search_condition.endDate = v;
    this.endDate = false;
    let endEL: any = this.$refs.endDate;
    endEL.save(v);
  }
  getData() {
    let local: any = localStorage.getItem("userId");
    let userId = JSON.parse(local) || "";
    api.alarm
      .alarmList({
        userId: userId,
        startDate: this.search_condition.startDate,
        endDate: this.search_condition.endDate,
        getAll: true,
        page: this.options.page,
        size: this.options.size,
      })
      .then((response) => {
        console.log("조회후 데이터", response);
        this.alarmList = _.map(response.data.data.content, "alarmProcess");
        this.table_data = _.uniqBy(this.alarmList, "id");
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
        console.log(this.table_data);
      });
    this.options.totalCount = 3;
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
