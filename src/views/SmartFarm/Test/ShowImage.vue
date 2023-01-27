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
            <v-chip v-for="(item, i) in selected" :key="i">
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
      <!-- 이미지갤러리 다이아로그 -->
      <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card>
          <v-toolbar color="grey lighten-2" dense elevation="0" rounded="0">
            <v-btn icon @click="closeModal()">
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
              <v-card-text class="d-flex ">
                <div>
                  {{ item.testName }}
                </div>
                <v-spacer></v-spacer>
                <v-btn text small @click="Sort()">
                  {{ sortImgText }}
                </v-btn>
              </v-card-text>
              <v-divider class=""></v-divider>
              <v-card-text class="">
                <!-- 사진들어갈곳 -->
                <div v-for="(child, i) in item.detailInfo" :key="i">
                  <div v-for="(mini, i) in child.fileInfo" :key="i">
                    <v-img max-height="200" max-width="374" class="ma-4" :src="mini.fileData"></v-img>
                    <h6>{{ child.reportDate }}</h6>
                  </div>
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
      resImages: [], //서버에서 받은 이미지데이터들을 변수로저장
      images: [], //이미지 갤러리 데이터들 
      sortImgText: '최근순 정렬', //이미지 갤러리 정렬 텍스트,
      sortImgValue: false, //이미지 갤러리 정렬 불린값
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

    closeModal() { //이미지 갤러리 모달 닫기  
      console.log(this.images)
      console.log('최근순최근순최근순최근순최근순최근순최근순최근순')

      this.sortImgText = '최근순 정렬'
      this.dialog = false
      this.images = []
      console.log(this.images)

    },



    Sort() {  //이미지 갤러리 정렬 버튼 클릭 시

      this.sortImgValue = !this.sortImgValue
      if (this.sortImgValue) {
        this.sortImgText = '최근순 정렬'
      } else {
        this.sortImgText = '오래된 순 정렬'
      }
      this.getImageList()
    },
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
      this.dialog = true;
      let item = {
        growthReportIds: ids,
        sortBy: 'asc'
      }
      this.getImageAPI(item)
    },
    getImageAPI(item) { //이미지 리스트 api 연결하는 메서드
      this.loading = true;
      api.growthresearch.GetGrowthResearchOriginImageList(item).then((res) => {
        console.log('이미지갤러리 조회성공', res)
        this.resImages = res.data.responseData
        this.makeImageArr()
        this.loading = false;
      })
    },
    makeImageArr() {
      let newImgArr = []
      let data = this.resImages
      for (let top = 0; top < data.length; top++) {
        for (let mid = 0; mid < data[top].detailInfo.length; mid++) {
          for (let bottom = 0; bottom < data[top].detailInfo[mid].fileInfo.length; bottom++) {
            let images = []
            let imagedata = data[top].detailInfo[mid].fileInfo[bottom]
            const contentType = "image/png";
            const b64Data = imagedata.fileData;
            const image_data = atob(b64Data);
            const arraybuffer = new ArrayBuffer(image_data.length);
            const view = new Uint8Array(arraybuffer);
            for (let i = 0; i < image_data.length; i++) {
              view[i] = image_data.charCodeAt(i) & 0xff;
            }
            const blob = new Blob([arraybuffer], { type: contentType }); // base64 -> blob
            const blobUrl = URL.createObjectURL(blob);
            console.log('블롭블롭', blobUrl)
            data[top].detailInfo[mid].fileInfo[bottom].fileData = blobUrl
          }
          this.images = data
          console.log('this.imagesthis.imagesthis.images', this.images)
        }
      }
    },
    getImageList() {
      let ids = _.map(this.selected, 'growthReportId')
      if (this.sortImgValue) {
        console.log('최근순 정렬합니다.')
        let item = {
          growthReportIds: ids,
          sortBy: 'asc'
        }
        this.getImageAPI(item)
      } else {
        console.log('오로된순 정렬합니다.')
        let item = {
          growthReportIds: ids,
          sortBy: 'desc'
        }
        this.getImageAPI(item)
      }
    }
  },
};
</script>
<style>
tr.v-data-table__selected {
  background: rgb(224, 238, 255) !important;
}
</style>
