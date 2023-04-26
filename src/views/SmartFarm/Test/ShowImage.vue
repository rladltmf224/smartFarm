<template>
  <div>
    <v-container fluid v-resize="onResize">
      <v-row>
        <v-col class="ma-2" cols="12">
          <v-row dense class="mb-2">
            <v-col cols="1" align-self="center">
              <span class="searchbox-title">실험 목록</span>
            </v-col>
            <v-spacer></v-spacer>
            <v-col class="text-right" cols="3">
              <v-btn color="primary" elevation="0" @click="dialogOpen()">이미지 조회
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-card>
        <v-data-table :headers="datas_header" :items="datas" :page.sync="page" :options.sync="options"
          :height="table_height" :server-items-length="totalData" :items-per-page="itemsPerPage" :loading="loading"
          hide-default-footer v-model="selected" show-select item-key="growthReportId" @page-count="pageCount = $event"
          multi-sort>
        </v-data-table>
      </v-card>
      <v-pagination circle v-model="page" :length="pageCount"></v-pagination>
      <!-- 이미지갤러리 다이아로그 -->
      <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card>
          <v-toolbar color="grey lighten-2" dense elevation="0" rounded="0">
            <v-btn icon @click="closeModal()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>이미지 갤러리</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <LoadingSpinner v-if="isLoading"></LoadingSpinner>
          </v-card-text>
          <v-card-text v-if="selected.length == 0" class="d-flex justify-center py-12 ">
            이미지가 없습니다.
          </v-card-text>
          <v-row v-if="!isLoading" class="mx-auto">
            <v-card style="overflow: auto" min-width="374" :loading="loading" class="mx-auto my-12" max-width="374"
              max-height="825" v-for="(item, i) in images" :key="i">
              <v-card-text class="d-flex ">
                <div>
                  {{ item.testName }}
                </div>
                <v-spacer></v-spacer>
                <v-btn text small @click="Sort(item)">
                  {{ item.sortText }}
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
              <v-card-text v-if="!item.detailInfo" class="d-flex align-center justify-center">
                <p>이미지가 없습니다.</p>
              </v-card-text>
            </v-card>
          </v-row>
        </v-card>
      </v-dialog>
    </v-container>

  </div>
</template>

<script lang="ts">
import Swal from "sweetalert2";
import util from "@/util";
import { gridCfg } from "@/util/config";
import { Vue, Component, Watch } from "vue-property-decorator";
import _ from "lodash";
import * as api from "@/api/index.js";
import LoadingSpinner from '@/views/SmartFarm/Loading/LodingSpinner.vue'
import { component } from "vue/types/umd";
import { timingSafeEqual } from "crypto";
@Component({
  components: {
    LoadingSpinner
  }
})
export default class ShowImage extends Vue {
  selected: any = [];
  table_height: number = 0;
  resImages: any = []; //서버에서 받은 이미지데이터들을 변수로저장
  sortImages: any = []; //이미지 정렬시 정렬된 데이터들,나중에 this.images에 넣을것임.
  images: any = []; //이미지 갤러리 데이터들
  sortImgText: string = '오래된 순 정렬'; //이미지 갤러리 정렬 텍스트,
  sortImgValue: boolean = true; //이미지 갤러리 정렬 불린값
  dialog: boolean = false;
  page: number = 1;
  loading: boolean = false;
  itemsPerPage: number = 12;
  options: any = {};
  totalData: number = 0;
  pageCount: number = 10;
  items: any = [];
  isLoading: boolean = false; //로딩바
  datas_header: any = [
    {
      text: "실험명(최대 5개 선택)",
      value: "testName",
    },
    {
      text: "실험명(최대 5개 선택)",
      value: "growthReportId",
      align: " d-none",
    },
  ];
  datas: any = [];

  mounted() {
    this.onResize();
    this.getData();
  }
  @Watch('selected')
  changeSelected(val: any, oldVal: any) {
    if (val.length > 5) {
      this.$nextTick(() => {
        this.selected = oldVal
      })
    }
  }

  @Watch('options', { deep: true })
  changeOptions() {
    this.getData()
  }

  closeModal() { //이미지 갤러리 모달 닫기  
    this.dialog = false
    this.images = []
  }

  onResize() {
    this.table_height = window.innerHeight - 200;
    console.log("onResize", this.table_height);
  }


  Sort(item: any) {  //이미지 갤러리 정렬 버튼 클릭 시
    this.sortImgValue = !this.sortImgValue
    if (this.sortImgValue) {
      item.sortText = '오래된 순 정렬'
      this.sortImgValue = true
    } else {
      item.sortText = '최신순 정렬'
      this.sortImgValue = false
    }
    if (this.sortImgValue) {
      let growthArr = []
      growthArr.push(item.growthReportId)
      let id = {
        growthReportIds: growthArr,
        sortBy: 'asc'
      }
      api.growthresearch.GetGrowthResearchOriginImageList(id).then((res) => {
        this.sortImages = res.data.responseData
        this.makeSortImage()
      })
    } else {
      let growthArr = []
      growthArr.push(item.growthReportId)
      let id = {
        growthReportIds: growthArr,
        sortBy: 'desc'
      }
      api.growthresearch.GetGrowthResearchOriginImageList(id).then((res) => {
        this.sortImages = res.data.responseData
        this.makeSortImage()
      })
    }
  }
  getData() {     // 생육조사 일지 리스트 조회 api
    this.loading = true;
    const { page, itemsPerPage, sortBy, sortDesc } = this.options;

    let item: any = {
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
        console.log('디스데이타스', this.datas)
        this.items = res.data.responseData;
        this.totalData = res.data.totalCount;
      })
      .catch((error) => { });
  }
  dialogOpen() {     // 이미지리스트 다이아로그 오픈 
    let ids = _.map(this.selected, 'growthReportId')
    this.dialog = true;
    let item = {
      growthReportIds: ids,
      sortBy: 'asc'
    }
    this.getImageAPI(item)
  }
  getImageAPI(item: any) { //이미지 리스트 api 연결하는 메서드
    this.isLoading = true;
    api.growthresearch.GetGrowthResearchOriginImageList(item).then((res) => {
      if (res.status == 200) {
        console.log('이미지갤러리 조회성공', res)
        this.resImages = res.data.responseData
        this.makeImageArr()
        this.isLoading = false;
      } else {
        this.dialog = false;
        this.$swal({
          title: "오류입니다.다시 시도해주세요.",
          icon: "info",
          position: "top",
          showCancelButton: false,
          showConfirmButton: false,
          toast: true,
          timer: 1500,
        });
      }

    })
  }
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
          data[top].detailInfo[mid].fileInfo[bottom].fileData = blobUrl
          data[top].sortText = '오래된 순 정렬'

        }
        this.images = data
      }
    }
  }
  getImageList() {
    let ids = _.map(this.selected, 'growthReportId')
    if (this.sortImgValue) {
      let item = {
        growthReportIds: ids,
        sortBy: 'asc'
      }
      this.getImageAPI(item)
    } else {
      let item = {
        growthReportIds: ids,
        sortBy: 'desc'
      }
      this.getImageAPI(item)
    }
  }

  makeSortImage() {
    let newImgArr = []
    let data = this.sortImages
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
          data[top].detailInfo[mid].fileInfo[bottom].fileData = blobUrl
        }
        //this.images = data
        console.log('원본 이미지 리스트', this.images)
        console.log('넣을 정렬된 이미지 리스트 ', this.sortImages)
        this.changeSortedImg()
      }
    }
  }

  changeSortedImg() { //정렬된 이미지만 this.images에 넣기
    let originArr = this.images
    let sortedArr = this.sortImages
    originArr.forEach(function (el: any) {
      sortedArr.forEach(function (el2: any) {
        if (el.growthReportId == el2.growthReportId) {
          el.detailInfo = el2.detailInfo
        }
      })
    })
    this.images = originArr
  }
}
</script>
<style>
tr.v-data-table__selected {
  background: rgb(224, 238, 255) !important;
}

.v-card {
  background-color: white;
  box-shadow: 0 20px 27px 0 rgba(0, 0, 0, 0.05) !important;
}
</style>
