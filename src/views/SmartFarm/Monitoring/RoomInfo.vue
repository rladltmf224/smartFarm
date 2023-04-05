<template>
  <v-card class="ma-3 pb-2 card-shadow">
    <v-app-bar color="transparent" dense elevation="0">
      <!-- <v-app-bar color="#C5E1A5" dense elevation="0"> -->
      <v-toolbar-title
        class="d-flex flex-row justify-space-between"
        style="width: 100%"
      >
        {{ roomInfo_prop.facilityName }}
        <div>
          <v-btn color="black" text @click="openImgAlbum(roomInfo_prop)">
            <!-- 바깥조회버튼눌리면 dialog오픈 ,  -->
            <v-icon class="mr-1"> mdi-camera </v-icon>

            생육조사
          </v-btn>
          <v-btn
            color="black"
            text
            disabled
            @click="
              roomInfo_prop.facilityName == `육묘실`
                ? openStreamModal1(roomInfo_prop)
                : openStreamModal2(roomInfo_prop)
            "
          >
            <!-- 바깥조회버튼눌리면 dialog오픈 ,  -->
            <v-icon class="mr-1"> mdi-cctv </v-icon>

            실시간 영상
          </v-btn>
          <v-btn color="#21D18E" text @click="openDialog(roomInfo_prop)">
            <!-- 바깥조회버튼눌리면 dialog오픈 ,  -->
            <v-icon class="mr-1"> mdi-eye </v-icon>

            조회
          </v-btn>
          <v-btn
            text
            class="pa-0 ma-0"
            color="#16A1F2"
            @click="goControllPage(roomInfo_prop)"
          >
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
            <EnvStatusChip
              title="대기 온도"
              :value="roomInfo_prop.atmosphere.temperature + '°C'"
            ></EnvStatusChip>
            <EnvStatusChip
              title="대기 습도"
              :value="roomInfo_prop.atmosphere.humidity + '%'"
            ></EnvStatusChip>
            <EnvStatusChip
              title="대기 농도"
              :value="roomInfo_prop.atmosphere.co2 + '%'"
            ></EnvStatusChip>
            <EnvStatusChip
              title="양액 EC"
              :value="roomInfo_prop.fertilizer.ec"
            ></EnvStatusChip>
            <EnvStatusChip
              title="양액 pH"
              :value="roomInfo_prop.fertilizer.ph"
            ></EnvStatusChip>
            <EnvStatusChip
              title="토양 온도"
              :value="roomInfo_prop.soil.temperature + '°C'"
            ></EnvStatusChip>
            <EnvStatusChip
              title="토양 습도"
              :value="roomInfo_prop.soil.humidity + '%'"
            ></EnvStatusChip>
            <EnvStatusChip
              title="토양 EC"
              :value="roomInfo_prop.soil.ec"
            ></EnvStatusChip>
            <EnvStatusChip
              title="토양 pH"
              :value="roomInfo_prop.soil.ph"
            ></EnvStatusChip>
            <EnvStatusChip
              title="광원 광도"
              :value="roomInfo_prop.light.luminosity"
            ></EnvStatusChip>
          </v-row>
        </div>

        <!-- <v-col lg="4" md="3" sm="5" xs="12"> -->

        <v-row class="mx-1 pa-0" no-gutters>
          <EquipStatusChip
            v-for="(equipData, index) in roomInfo_prop.equipment"
            :key="index"
            :equipData="equipData"
            class="my-1 mx-2"
          ></EquipStatusChip>
        </v-row>
      </div>
    </v-card-text>
    <v-dialog v-model="streamModal1" persistent max-width="1400">
      <v-card>
        <v-card-title class="headline">{{ streamModal1_title }}</v-card-title>
        <v-card-text>
          <img ref="img1" id="image1" />
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
          <img ref="img2" id="image2" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="closeModal2()">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 생육조사 갤러리 -->
    <v-dialog v-model="imgAlbumModal" persistent max-width="1400">
      <v-card>
        <v-card-title class="headline">{{ imgList_title }}</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-row>
                <v-col cols="2">
                  <v-menu
                    ref="startDate"
                    v-model="startDate"
                    :close-on-content-click="false"
                    :return-value.sync="search_condition.startDate"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <span>시작일</span>
                      <v-text-field
                        v-model="search_condition.startDate"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        dense
                        solo
                        rounded
                        hide-details="false"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="search_condition.startDate"
                      no-title
                      scrollable
                      locale="ko-KR"
                      :max="search_condition.endDate"
                    >
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="startDate = false">
                        취소
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="s_date_search(search_condition.startDate)"
                      >
                        확인
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="2">
                  <v-menu
                    ref="endDate"
                    v-model="endDate"
                    :close-on-content-click="false"
                    :return-value.sync="search_condition.endDate"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <span>종료일</span>
                      <v-text-field
                        v-model="search_condition.endDate"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        dense
                        solo
                        rounded
                        hide-details="false"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="search_condition.endDate"
                      no-title
                      scrollable
                      locale="ko-KR"
                      :min="search_condition.startDate"
                    >
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="endDate = false">
                        취소
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="e_date_search(search_condition.endDate)"
                      >
                        확인
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="2" align-self="end">
                  <v-btn color="success" large>조회</v-btn>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="4">
              <v-card>
                <v-data-table
                  :headers="headers_img"
                  :items="imgList"
                  item-key="id"
                  single-select
                  height="620"
                  fixed-header
                  @click:row="getImgDetail"
                  :options.sync="customerOption.options"
                  :server-items-length="customerOption.totalCount"
                  :loading="customerOption.loading"
                  :items-per-page="customerOption.itemsPerPage"
                  :page.sync="customerOption.page"
                  @page-count="customerOption.pageCount = $event"
                >
                </v-data-table>
              </v-card>
              <v-pagination
                circle
                v-model="customerOption.page"
                :length="customerOption.pageCount"
              ></v-pagination>
            </v-col>
            <v-col cols="8">
              <v-card height="620">
                <v-card-title>
                  <span>{{ selectImgData.filename }}</span>
                </v-card-title>
                <v-card-text primary-title>
                  <div v-if="selectImgData.facilityName != undefined">
                    <v-row dense>
                      <v-col cols="12">
                        <span> 장소 : {{ selectImgData.facilityName }} </span>
                        <span>
                          장비상태 : {{ selectImgData.equipmentName }}({{
                            selectImgData.equipmentStatus
                          }})</span
                        >
                      </v-col>

                      <v-col cols="12" align-self="center">
                        <img
                          class="img-align"
                          :src="selectImgData.url"
                          width="340"
                        />
                      </v-col>
                      <v-col cols="12">
                        <span></span>
                      </v-col>
                    </v-row>
                  </div>
                  <div v-else>
                    <div class="text-center">
                      <h3>이미지를 선택해주세요</h3>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="closeImgAlbum">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script>
import EquipStatusChip from "./EquipStatusChip.vue";
import EnvStatusChip from "./EnvStatusChip.vue";
import { gridCfg } from "@/util/config";
import { io } from "socket.io-client";
import * as api from "@/api";
import cfg from "./config";

export default {
  name: "RoomInfo",
  data() {
    return {
      streamModal1: false,
      streamModal2: false,
      imgAlbumModal: false,
      streamModal1_title: "",
      streamModal2_title: "",
      socket: null,
      imgList: [],
      facilityData: "",
      selectImgData: "",
      imgList_title: "",
      search_condition: {
        startDate: "",
        endDate: "",
        page: "",
        size: "",
        sortBy: "",
        sortDesc: "",
      },
      startDate: false,
      endDate: false,
      imgOption: {},
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
    "customerOption.options": {
      deep: true,
      handler() {
        this.getImgList();
      },
    },
  },
  created() {
    // this.socket = io("http://14.47.96.237:5100");
    console.log("socket", this.socket);
    this.customerOption = Object.assign({}, gridCfg);
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
    },
    getImgList() {
      let reqData = {
        facilityId: this.facilityData.facilityId,
      };
      this.imgList_title = this.facilityData.facilityName;
      api.smartfarm.getImgList(reqData).then((res) => {
        console.log("res", res);
        this.imgList = res.data.responseData;
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

      this.streamModal1 = true;

      this.socket.emit("start1");
      this.socket.on("image1", (image) => {
        // console.log('data', data);
        const img = document.getElementById("image1");
        console.log("openStreamModal1", img);
        img.src = `data:image/jpeg;base64,${image}`;
      });
    },
    openStreamModal2(data) {
      // console.log("data", data, this.$refs.img2);
      this.streamModal2_title = data.facilityName;

      this.streamModal2 = true;
      this.socket.emit("start2");
      this.socket.on("image2", (image) => {
        const img = document.getElementById("image2");
        console.log("openStreamModal2", img);
        img.src = `data:image/jpeg;base64,${image}`;
      });
    },
    closeModal1() {
      this.socket.emit("stop1");

      this.streamModal1 = false;
    },

    closeModal2() {
      this.socket.emit("stop2");

      this.streamModal2 = false;
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
