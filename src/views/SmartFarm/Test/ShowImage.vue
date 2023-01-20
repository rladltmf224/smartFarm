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
              v-for="(item, i) in images" :key="i">
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
      images: [], //이미지 갤러리 데이터들 
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
    dialogOpen() {     // 이미지리스트 다이아로그 오픈 
      let ids = _.map(this.selected, 'growthReportId')
      console.log('셀렉티드', ids)
      this.dialog = true;

      let item = {
        growthReportIds: ids,
        sortBy: 'asc'
      }
      api.growthresearch.GetGrowthResearchOriginImageList(item).then((res) => {
        this.images = res.data.responseData
        let datas = res.data.responseData
        console.log('데이타스확인', datas)
        let testNames = _.map(datas, 'testName') //testNames 만 배열로 뽑는다.

        let detailInfo = _.map(datas, 'detailInfo') //detailInfo 만 배열로 뽑는다.

        console.log('디테일인포스', detailInfo)

        let infos = []
        for (let detailNum = 0; detailNum < detailInfo.length; detailNum++) {
          let onlyFileInfo = _.map(detailInfo[detailNum], 'fileInfo')
          console.log('파일인포 어레이', onlyFileInfo)
          infos.push(onlyFileInfo)
        }

        console.log('fileInfofileInfofileInfo', infos)



        let fullDatas = [] //for문돌릴 껍데기 배열을 만든다.

        for (let nameNum = 0; nameNum < testNames.length; nameNum++) {
          fullDatas.push({
            testName: testNames[nameNum],
            fileInfo: infos[nameNum]
          })
        }


        //fullDatas = 3번
        //fileInfo


        // for (let top = 0; top < fullDatas.length; top++) {
        //   for (let mid = 0; mid < fullDatas[top].fileInfo.length; mid++) {
        //     let imagedata = fullDatas[top].fileInfo[mid]
        //     console.log('이미지데이타', imagedata)
        //     const contentType = "image/png";
        //     const b64Data = imagedata[top].fileData;
        //     const image_data = atob(b64Data);
        //     const arraybuffer = new ArrayBuffer(image_data.length);
        //     const view = new Uint8Array(arraybuffer);
        //     for (let i = 0; i < image_data.length; i++) {
        //       view[i] = image_data.charCodeAt(i) & 0xff;
        //     }
        //     const blob = new Blob([arraybuffer], { type: contentType });
        //     const blobUrl = URL.createObjectURL(blob);
        //     fullDatas[top].fileInfo[mid].fileData = blobUrl
        //     console.log('풀데이타', fullDatas[top].fileInfo[mid].fileData)
        //   }
        // }

        console.log('블롭블롭블롭블롭블롭', fullDatas)






        // this.images = res.data.responseData
        // let res = res.data.responseData
        // console.log('res', this.images)

        // let testNames = _.map(res, 'testNames') //testNames 만 배열로 뽑는다.
        // console.log('테스트네임스 확인', testNames)



        // // for (let top = 0; top < res.length; top++) { 

        // // }








      })


    },
  },
};
</script>
<style>
tr.v-data-table__selected {
  background: rgb(224, 238, 255) !important;
}
</style>
