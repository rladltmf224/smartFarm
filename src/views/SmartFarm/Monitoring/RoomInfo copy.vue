<template>
  <v-card class="ma-3 pb-2 card-shadow" max-width="515">
    <v-app-bar color="transparent" dense elevation="0">
      <!-- <v-app-bar color="#C5E1A5" dense elevation="0"> -->
      <v-toolbar-title
        class="d-flex flex-row justify-space-between"
        style="width: 100%"
      >
        {{ roomInfo_prop.facilityName }}
        <div>
          <v-btn color="black" text @click="openStreamModal(roomInfo_prop)">
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
    <!-- <v-dialog v-model="streamModal" persistent max-width="500">
      <v-card>
        <v-card-title class="headline">headline</v-card-title>
        <v-card-text>
          <img id="image" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click.native="streamModal = false"
            >Disagree</v-btn
          >
          <v-btn color="primary" flat @click.native="streamModal = false"
            >Agree</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog> -->
  </v-card>
</template>
<script>
import EquipStatusChip from "./EquipStatusChip.vue";
import EnvStatusChip from "./EnvStatusChip.vue";
import { io } from "socket.io-client";
export default {
  name: "RoomInfo",
  props: ["roomData"],
  data() {
    this.streamModal = false;
  },
  components: {
    EquipStatusChip,
    EnvStatusChip,
  },
  computed: {
    roomInfo_prop() {
      return this.roomData;
    },
  },
  methods: {
    goControllPage(data) {
      this.$emit("controllPage", data);
    },
    openDialog(data) {
      this.$emit("selectPage", data);
    },
    openStreamModal(data) {
      this.streamModal = true;
      const socket = io.connect("http://192.168.0.61:3030");
      socket.on("image1", (image) => {
        // console.log('data', data);
        const img = document.getElementById("image");
        img.src = `data:image/jpeg;base64,${image}`;
      });
    },
  },
};
</script>

<style lang="scss"></style>
