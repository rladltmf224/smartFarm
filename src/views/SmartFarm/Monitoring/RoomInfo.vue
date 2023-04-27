<template>
  <v-card class="ma-3 pb-2 card-shadow">
    <v-app-bar color="transparent" dense elevation="0">
      <!-- <v-app-bar color="#C5E1A5" dense elevation="0"> -->
      <v-toolbar-title class="d-flex flex-row justify-space-between" style="width: 100%">
        {{ roomInfo_prop.facilityName }}
        <div>
          <v-btn v-if="roomInfo_prop.facilityName == `육묘실`" color="black" text @click="openStreamModal3(roomInfo_prop)">
            <!-- 바깥조회버튼눌리면 dialog오픈 ,  -->
            <v-icon class="mr-1"> mdi-cctv </v-icon>

            실시간 관찰
          </v-btn>
          <v-btn color="black" text @click="openImgAlbum(roomInfo_prop)">
            <!-- 바깥조회버튼눌리면 dialog오픈 ,  -->
            <v-icon class="mr-1"> mdi-camera </v-icon>

            생육조사
          </v-btn>
          <v-btn color="black" text @click="
            roomInfo_prop.facilityName == `육묘실`
              ? openStreamModal1(roomInfo_prop)
              : openStreamModal2(roomInfo_prop)
          ">
            <!-- 바깥조회버튼눌리면 dialog오픈 ,  -->
            <v-icon class="mr-1"> mdi-cctv </v-icon>

            실시간 영상
          </v-btn>
          <v-btn color="#21D18E" text @click="openDialog(roomInfo_prop)">
            <!-- 바깥조회버튼눌리면 dialog오픈 ,  -->
            <v-icon class="mr-1"> mdi-eye </v-icon>

            조회
          </v-btn>
          <v-btn text class="pa-0 ma-0" color="#16A1F2" @click="goControllPage(roomInfo_prop)">
            <v-icon class="mr-1"> mdi-cog-pause </v-icon>
            <span class="subheading">제어</span>
          </v-btn>
        </div>
      </v-toolbar-title>
    </v-app-bar>

    <v-card-text>
      <div class="d-flex flex-column flex-nowrap justify-space-around">
        <!-- <v-col lg="8" md="9" sm="7" xs="12"> -->
        <div>
          <v-row class="d-flex flex-row flex-wrap justify-center" no-gutters>
            <EnvStatusChip title="대기 온도" :value="roomInfo_prop.atmosphere.temperature + '°C'"></EnvStatusChip>
            <EnvStatusChip title="대기 습도" :value="roomInfo_prop.atmosphere.humidity + '%'"></EnvStatusChip>

            <EnvStatusChip title="양액 EC" :value="roomInfo_prop.fertilizer.ec"></EnvStatusChip>
            <EnvStatusChip title="양액 pH" :value="roomInfo_prop.fertilizer.ph"></EnvStatusChip>
            <EnvStatusChip title="토양 온도" :value="roomInfo_prop.soil.temperature + '°C'"></EnvStatusChip>
            <EnvStatusChip title="토양 습도" :value="roomInfo_prop.soil.humidity + '%'"></EnvStatusChip>
            <EnvStatusChip title="토양 EC" :value="roomInfo_prop.soil.ec"></EnvStatusChip>
            <EnvStatusChip title="토양 pH" :value="roomInfo_prop.soil.ph"></EnvStatusChip>
          </v-row>
        </div>

        <!-- <v-col lg="4" md="3" sm="5" xs="12"> -->

        <v-row class="mx-1 pa-0" no-gutters>
          <EquipStatusChip v-for="(equipData, index) in roomInfo_prop.equipment" :key="index" :equipData="equipData"
            class="my-1 mx-2"></EquipStatusChip>
        </v-row>
      </div>
    </v-card-text>
    <v-dialog v-model="streamModal1" persistent max-width="1400">
      <v-card>
        <v-card-title class="headline">{{ streamModal1_title }}</v-card-title>
        <v-card-text>
          <canvas id="image1"> </canvas>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="closeModal1()">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="streamModal2" persistent max-width="1400">
      <v-card>
        <v-card-title class="headline">{{ streamModal2_title }}</v-card-title>
        <v-card-text>
          <canvas id="image2"> </canvas>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="closeModal2()">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="streamModal3" persistent max-width="1400">
      <v-card>
        <v-card-title class="headline"></v-card-title>
        <v-card-text>
          <canvas id="image3"> </canvas>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="closeModal3()">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 생육조사 갤러리 -->
    <v-dialog v-model="imgAlbumModal" persistent max-width="800">
      <v-card>
        <v-card-title class="headline"><span>{{ imgList_title }} </span> <v-spacer></v-spacer>
          <v-btn color="error" @click="closeImgAlbum">닫기</v-btn></v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-row>
                <v-col cols="4">
                  <v-menu ref="startDate" v-model="startDate" :close-on-content-click="false"
                    :return-value.sync="search_condition.startDate" transition="scale-transition" offset-y
                    min-width="auto">
                    <template v-slot:activator="{ on, attrs }">
                      <span>시작일</span>
                      <v-text-field v-model="search_condition.startDate" readonly v-bind="attrs" v-on="on" dense solo
                        rounded hide-details="false"></v-text-field>
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
                <v-col cols="4">
                  <v-menu ref="endDate" v-model="endDate" :close-on-content-click="false"
                    :return-value.sync="search_condition.endDate" transition="scale-transition" offset-y min-width="auto">
                    <template v-slot:activator="{ on, attrs }">
                      <span>종료일</span>
                      <v-text-field v-model="search_condition.endDate" readonly v-bind="attrs" v-on="on" dense solo
                        rounded hide-details="false"></v-text-field>
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
                <v-col cols="2" class="text-right">
                  <v-btn color="success" large @click="getImgList" elevation="0">조회</v-btn>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-card class="card-shadow">
                <v-data-table :headers="headers_img" :items="imgList" item-key="id" single-select height="610"
                  fixed-header @click:row="getImgDetail" :options.sync="imgOption.options"
                  :server-items-length="imgOption.totalCount" :loading="imgOption.loading"
                  :items-per-page="imgOption.itemsPerPage" :page.sync="imgOption.page"
                  @page-count="imgOption.pageCount = $event" hide-default-footer>
                  <template v-slot:item.popup="{ item }">
                    <v-btn color="info" small @click="openImgPopup(item)" dark depressed>
                      <v-icon> mdi-card-search-outline </v-icon>
                    </v-btn>
                  </template>
                </v-data-table>
              </v-card>
              <v-pagination circle v-model="imgOption.page" :length="imgOption.pageCount"></v-pagination>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jsmpeg/0.1/jsmpg.js"></script>
<script>
import EquipStatusChip from "./EquipStatusChip.vue";
import EnvStatusChip from "./EnvStatusChip.vue";
import { gridCfg } from "@/util/config";
import * as api from "@/api";
import cfg from "./config";

export default {
  name: "RoomInfo",
  data() {
    return {
      streamModal1: false,
      streamModal2: false,
      streamModal3: false,
      imgAlbumModal: false,
      streamModal1_title: "",
      streamModal2_title: "",
      socket: null,
      imgList: [],
      facilityData: "",
      selectImgData: "",
      imgList_title: "",
      search_condition: {
        startDate: new Date().toISOString().substr(0, 10),
        endDate: new Date().toISOString().substr(0, 10),
        page: "",
        size: "",
        sortBy: "",
        sortDesc: "",
      },
      startDate: false,
      endDate: false,
      imgOption: {},
      stream1: null,
      stream2: null,
      stream3: null,
      socket1: null,
      socket2: null,
      socket3: null,
      popCnt: 0,
      popArr: [],
    };
  },
  props: ["roomData"],

  components: {
    EquipStatusChip,
    EnvStatusChip,
  },
  computed: {
    roomInfo_prop() {
      return this.roomData;
    },
    headers_img() {
      return cfg.hearer.hearer_img;
    },
  },
  watch: {
    "imgOption.options": {
      handler() {
        this.getImgList();
      },
      deep: true,
    },
  },
  created() {
    // this.socket = io("http://14.47.96.237:5100");
    console.log("socket", this.socket);
    this.imgOption = Object.assign({}, gridCfg);
    this.imgOption.options.itemsPerPage = 11;
  },
  beforeDestroy() {
    console.log("Start beforeDestroy");
  },
  methods: {
    s_date_search(v) {
      this.search_condition.startDate = v;
      this.startDate = false;
      console.log("startDateEl", this.$refs.startDate);
      let startDate = this.$refs.startDate;
      startDate.save(v);
    },
    e_date_search(v) {
      this.search_condition.endDate = v;
      this.endDate = false;
      let endDate = this.$refs.endDate;
      endDate.save(v);
    },
    goControllPage(data) {
      this.$emit("controllPage", data);
    },
    openDialog(data) {
      this.$emit("selectPage", data);
    },
    openImgAlbum(data) {
      this.imgAlbumModal = true;
      this.facilityData = data;
      this.getImgList();

      //this.getImgList();
    },
    getImgList() {
      const { page, itemsPerPage, sortBy, sortDesc } = this.imgOption.options;
      let reqData = {
        facilityId: this.facilityData.facilityId,
        page: page,
        size: itemsPerPage,
        sortBy: sortBy,
        sortDesc: sortDesc,
        startDate: this.search_condition.startDate,
        endDate: this.search_condition.endDate,
      };
      this.imgOption.loading = true;
      this.imgList_title = this.facilityData.facilityName;
      api.smartfarm.getImgList(reqData).then((res) => {
        console.log("res", res);
        this.imgList = res.data.responseData;
        this.imgOption.totalCount = res.data.totalCount;
        this.imgOption.loading = false;
      });
    },
    closeImgAlbum() {
      this.imgList = [];
      this.selectImgData = {};
      this.imgAlbumModal = false;
    },
    getImgDetail(item, row) {
      row.select(true);
      console.log("item", item);
      this.selectImgData = item;
    },

    openStreamModal1(data) {
      //console.log("data", data, this.$refs.img1);
      this.streamModal1_title = data.facilityName;

      let canvas1 = document.querySelector("#image1");
      this.socket1 = new WebSocket("ws://14.47.96.237:5100");
      this.stream1 = new jsmpeg(this.socket1, {
        canvas: canvas1,
      });
      this.streamModal1 = true;
      console.log("stream1", this.stream1, this.socket1);
    },
    openStreamModal2(data) {
      // console.log("data", data, this.$refs.img2);
      this.streamModal2_title = data.facilityName;

      let canvas2 = document.querySelector("#image2");

      this.socket2 = new WebSocket("ws://14.47.96.237:5101");
      this.stream2 = new jsmpeg(this.socket2, {
        canvas: canvas2,
      });
      this.streamModal2 = true;
      console.log("stream2", this.stream2, this.socket2);
    },
    openStreamModal2(data) {
      // console.log("data", data, this.$refs.img2);

      this.streamModal2 = true;

      let canvas2 = document.querySelector("#image2");

      this.socket2= new WebSocket("ws://14.47.96.237:5101");
      this.stream2 = new jsmpeg(this.socket2, {
        canvas: canvas2,
      });
      console.log("stream3", this.stream2, this.socket2);
    },
    openStreamModal3(data) {
      // console.log("data", data, this.$refs.img2);

      this.streamModal3 = true;

      let canvas3 = document.querySelector("#image3");

      this.socket3= new WebSocket("ws://14.47.96.237:5102");
      this.stream3 = new jsmpeg(this.socket3, {
        canvas: canvas3,
      });
      console.log("stream3", this.stream3, this.socket3);
    },
    closeModal1() {
      this.streamModal1 = false;
      this.socket1.close();
    },

    closeModal2() {
      this.streamModal2 = false;
      this.socket2.close();
    },

    closeModal3() {
      this.streamModal3 = false;
      this.socket3.close();
    },
    openImgPopup(data) {
      let width = 430;
      let height = 430;

      let uri = data.url;
      let left = screen.width ? (screen.width - width) / 2 : 0;
      let top = screen.height ? (screen.height - height) / 2 : 0;

      let attr = `top=${top}, left=${left}, width=${width}, height=${height}, resizable=no,status=no `;

      // window.open(
      //   uri,
      //   `${data.filename}`,
      //   this.getPopOptions2(width, height, this.popCnt)
      // );

      window.open(
        `ImgPopup.html?src=${data.url}&name=${data.filename}`,
        `${data.filename}`,
        this.getPopOptions2(width, height, this.popCnt)
      );
      this.popCnt++;
    },
    getPopOptions2(width, height, num) {
      let rtnVal;

      let nWidth = width;
      let nHeight = height;
      let nLeft = num * 30;
      let nTop = num * 30;

      let strOption = "";
      strOption += "left=" + nLeft + ",";
      strOption += "top=" + nTop + ",";
      strOption += "width=" + nWidth + ",";
      strOption += "height=" + nHeight + ",";
      strOption +=
        "toolbar=no, status=no, menubar=no, resizable=yes, location=no scrollbars=yes";

      rtnVal = strOption;
      return rtnVal;
    },
  },
};
</script>

<style lang="scss">
.img-align {
  display: block;
  margin: auto;
}
</style>
