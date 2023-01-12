<template>
  <v-app>
    <v-container fluid>
      <v-row>
        <v-col cols="12" class="d-flex">
          <h4 class="searchbox-title">이미지 갤러리</h4>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="d-flex ">
          <v-chip-group multiple active-class="primary--text pa-0 ma-0">
            <v-chip v-for="item in selected" :key="item">
              {{ item.testName }}
            </v-chip>
          </v-chip-group>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="dialogOpen()">조회</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-data-table :headers="datas_header" :items="datas" :page.sync="page" :options.sync="options"
            :server-items-length="totalData" :items-per-page="itemsPerPage" :loading="loading" hide-default-footer
            v-model="selected" show-select item-key="testName" class="elevation-1" @page-count="pageCount = $event"
            dense multi-sort>



          </v-data-table>
          <div class="text-center pt-2">
            <v-pagination v-model="page" :length="pageCount"></v-pagination>
            <h5>Selected: {{ selected }}</h5>
          </div>
        </v-col>
      </v-row>




      <div class="text-center">
        <v-snackbar v-model="snackbar" :timeout="timeout">
          {{ text }}
        </v-snackbar>
      </div>
      <!-- 이미지갤러리 다이아로그 -->
      <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card>
          <v-toolbar color="grey lighten-2" dense elevation="0" rounded="0">
            <v-btn icon @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>이미지 갤러리</v-toolbar-title>
          </v-toolbar>
          <v-card-text v-if="selected.length == 0" class="d-flex justify-center py-12 ">
            이미지가 없습니다.
          </v-card-text>
          <v-row v-else class="mx-auto">
            <v-card style="overflow: auto" :loading="loading" class="mx-auto my-12" max-width="374" max-height="825"
              v-for="(item, i) in selected" :key="item">
              <v-card-text>
                <div class="text-subtitle-1">
                  {{ item.testName }}
                </div>
              </v-card-text>
              <v-divider class=""></v-divider>
              <v-card-text class="">
                <!-- 사진들어갈곳 -->
                <div v-for="(item, i) in 5">
                  <h6 class="pa-0 ma-0">2022-12-24</h6>
                  <v-img max-height="200" class="ma-4" src="https://cdn.vuetifyjs.com/images/cards/cooking.png"></v-img>
                </div>
              </v-card-text>
            </v-card>
          </v-row>

        </v-card>
      </v-dialog>
    </v-container>
  </v-app>
</template>

<script>
import Swal from "sweetalert2";

import * as api from "@/api/index.js";
export default {
  name: "InputData",
  data() {
    return {
      selected: [],
      dialog: false,
      page: 1,
      loading: false,
      itemsPerPage: 12,
      options: {},
      totalData: 0,
      pageCount: 10,
      items: [],
      datas_header: [
        {
          text: "실험명(최대 5개 선택)",
          value: "testName",
        },
      ],
      datas: [],
    };
  },
  mounted() {
    this.getData();
  },
  watch: {
    options: {
      handler() {
        this.getData();
      },
      deep: true,
    },
    selected(val, oldVal) { //최대 5개 선택
      if (val.length > 5) {
        this.$nextTick(() => {
          this.selected = oldVal
        })
      }
    },
  },
  methods: {
    getData() {     // 생육조사 일지 조회 api
      this.loading = true;
      const { page, itemsPerPage, sortBy, sortDesc } = this.options;
      let item = {
        page: page, //페이지 수
        size: itemsPerPage, //보여주고싶은 행의개수
        sortBy: sortBy, //sortby
        sortDesc: sortDesc, //sortDesc  
      };
      api.growthresearch
        .GetGrowthResearchListInGallery(item)
        .then((res) => {
          this.loading = false;
          this.datas = res.data.responseData;
          this.items = res.data.responseData;
          this.totalData = res.data.totalCount;
        })
        .catch((error) => { });
    },
    // 생육조사 일지 조회 api
    dialogOpen() {     // 다이아로그오픈
      this.dialog = true;

    },
  },
};
</script>
<style>
tr.v-data-table__selected {
  background: rgb(224, 238, 255) !important;
}
</style>
