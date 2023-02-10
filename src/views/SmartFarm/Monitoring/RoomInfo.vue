<template>
  <v-card class="ma-3 pb-2" max-width="515">
    <v-app-bar color="#CFD8DC" dense elevation="0">
      <v-toolbar-title
        class="d-flex flex-row justify-space-between"
        style="width: 100%"
      >
        {{ roomInfo_prop.roomName }}
        <div>
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
            <span class="subheading">제어</span>
          </v-btn>
        </div>
      </v-toolbar-title>
    </v-app-bar>
    <!-- <v-card-text>
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
    </v-card-text> -->
    <v-card-text>
      <div class="d-flex flex-column flex-nowrap justify-space-around">
        <!-- <v-col lg="8" md="9" sm="7" xs="12"> -->
        <div>
          <v-row class="d-flex flex-row flex-wrap" no-gutters>
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
  </v-card>
</template>
<script>
import EquipStatusChip from "./EquipStatusChip.vue";
import EnvStatusChip from "./EnvStatusChip.vue";
export default {
  name: "RoomInfo",
  props: ["roomData"],
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
  },
};
</script>

<style lang="scss"></style>
