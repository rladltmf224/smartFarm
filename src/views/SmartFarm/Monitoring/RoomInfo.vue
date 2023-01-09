<template>
  <v-card class="ma-3 pb-3">
    <v-app-bar color="#CFD8DC" dense elevation="0">
      <v-toolbar-title>{{ roomInfo_prop.roomName }}</v-toolbar-title>
    </v-app-bar>
    <v-card-title> </v-card-title>
    <v-card-text>
      <v-row dense>
        <v-col cols="12">
          <b class="text-h5 font-weight-bold">대기 </b>
          <span class="text-h6"
            >온도 : {{ roomInfo_prop.atmosphere.temperature }} °C
          </span>
          <span class="text-h6"
            >습도 : {{ roomInfo_prop.atmosphere.humidity }} %
          </span>
          <span class="text-h6"
            >Co2 농도 : {{ roomInfo_prop.atmosphere.co2 }} %</span
          >

          <v-spacer></v-spacer>

          <b class="text-h5 font-weight-bold">양액 </b>
          <span class="text-h6">EC : {{ roomInfo_prop.fertilizer.ec }} </span>
          <span class="text-h6">pH : {{ roomInfo_prop.fertilizer.ph }} </span>

          <v-spacer></v-spacer>
          <b class="text-h5 font-weight-bold">토양 </b>
          <span class="text-h6"
            >온도 : {{ roomInfo_prop.soil.temperature }}°C
          </span>
          <span class="text-h6"
            >습도 : {{ roomInfo_prop.soil.temperature }}%
          </span>
          <span class="text-h6">EC : {{ roomInfo_prop.soil.ec }} </span>
          <span class="text-h6">pH : {{ roomInfo_prop.soil.ph }} </span>
          <v-spacer></v-spacer>

          <b class="text-h5 font-weight-bold">광원 </b>
          <span class="text-h6"
            >광도 : {{ roomInfo_prop.light.luminosity }}</span
          >
        </v-col>
      </v-row>

      <v-row dense class="text-center align-self-center">
        <v-col cols="2">
          <b class="text-h6">냉방기</b>
        </v-col>
        <v-col cols="2" class="pt-2">
          <EquipStatusChip
            :status="roomInfo_prop.equipment.airConditioner"
          ></EquipStatusChip>
        </v-col>
        <v-col cols="2">
          <b class="text-h6">난방기</b>
        </v-col>
        <v-col cols="2" class="pt-2">
          <EquipStatusChip
            :status="roomInfo_prop.equipment.heater"
          ></EquipStatusChip>
        </v-col>
        <v-col cols="2">
          <b class="text-h6">LED</b>
        </v-col>
        <v-col cols="2" class="pt-2">
          <EquipStatusChip
            :status="roomInfo_prop.equipment.led"
          ></EquipStatusChip>
        </v-col>
        <v-col cols="2">
          <b class="text-h6">가습기</b>
        </v-col>
        <v-col cols="2" class="pt-2">
          <EquipStatusChip
            :status="roomInfo_prop.equipment.humidifier"
          ></EquipStatusChip>
        </v-col>
        <v-col cols="2">
          <b class="text-h6">환풍기</b>
        </v-col>
        <v-col cols="2" class="pt-2">
          <EquipStatusChip
            :status="roomInfo_prop.equipment.ventilator"
          ></EquipStatusChip>
        </v-col>
        <v-col cols="2">
          <b class="text-h6">환기팬</b>
        </v-col>
        <v-col cols="2" class="pt-2">
          <EquipStatusChip
            :status="roomInfo_prop.equipment.airCirculator"
          ></EquipStatusChip>
        </v-col>
      </v-row>
      <v-row class="pr-3" align="center" justify="end">
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
