<template>
  <v-card class="ma-3 pb-2">
    <v-app-bar color="#CFD8DC" dense elevation="0">
      <v-toolbar-title>{{ roomInfo_prop.roomName }}</v-toolbar-title>
    </v-app-bar>
    <v-card-text>
      <v-row dense class="align-self-center">
        <v-col cols="12">
          <v-row no-gutters>
            <v-col cols="12">
              <b class="text-h6 font-weight-regular">대기 </b>
              <span class="text-h6 font-weight-bold"
                >온도 : {{ roomInfo_prop.atmosphere.temperature }} °C
              </span>
              <span class="text-h6 font-weight-bold"
                >습도 : {{ roomInfo_prop.atmosphere.humidity }} %
              </span>
              <span class="text-h6 font-weight-bold"
                >Co2 농도 : {{ roomInfo_prop.atmosphere.co2 }} %</span
              >
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12">
              <b class="text-h6 font-weight-bold">양액 </b>
              <span class="text-h6 font-weight-bold"
                >EC : {{ roomInfo_prop.fertilizer.ec }}
              </span>
              <span class="text-h6 font-weight-bold"
                >pH : {{ roomInfo_prop.fertilizer.ph }}
              </span>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12">
              <b class="text-h6 font-weight-bold">토양 </b>
              <span class="text-h6 font-weight-bold"
                >온도 : {{ roomInfo_prop.soil.temperature }}°C
              </span>
              <span class="text-h6 font-weight-bold"
                >습도 : {{ roomInfo_prop.soil.temperature }}%
              </span>
              <span class="text-h6 font-weight-bold"
                >EC : {{ roomInfo_prop.soil.ec }}
              </span>
              <span class="text-h6 font-weight-bold"
                >pH : {{ roomInfo_prop.soil.ph }}
              </span>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12">
              <b class="text-h6 font-weight-bold">광원 </b>
              <span class="text-h6 font-weight-bold"
                >광도 : {{ roomInfo_prop.light.luminosity }}</span
              >
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row dense class="text-center align-self-center">
        <v-col
          v-for="(equipData, index) in roomInfo_prop.equipment"
          cols="4"
          class="d-flex align-center"
          :key="index"
        >
          <div
            class="mr-1"
            :class="{
              on: equipData.currentStatus === 'ON',
              off: equipData.currentStatus === 'OFF',
            }"
          ></div>
          <b class="text-subtitle-1 font-weight-bold mr-1 text-truncate">{{
            equipData.equipmentName
          }}</b>
          <EquipStatusChip :status="equipData.controlStatus"></EquipStatusChip>
        </v-col>
      </v-row>
      <v-row class="pr-3" justify="end">
        <v-btn color="green" text @click="openDialog(roomInfo_prop)">
          <!-- 바깥조회버튼눌리면 dialog오픈 ,  -->
          <v-icon class="mr-1"> mdi-eye </v-icon>

          조회
        </v-btn>

        <v-btn
          text
          class="pa-0 ma-0"
          color="primary"
          @click="goControllPage(roomInfo_prop)"
        >
          <v-icon class="mr-1"> mdi-cog-pause </v-icon>
          <span class="subheading">제어</span></v-btn
        >
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script>
import EquipStatusChip from "./EquipStatusChip.vue";
export default {
  name: "RoomInfo",
  props: ["roomData"],
  components: {
    EquipStatusChip,
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
  },
};
</script>

<style lang="scss">
div {
  %circle {
    width: 13px;
    height: 13px;
    border-radius: 50%;
  }

  .on {
    @extend %circle;
    background: greenyellow;
  }

  .off {
    @extend %circle;
    background: red;
  }
}
</style>
