<template>
  <v-card class="my-0 mx-2image.png" max-width="500" width="200px">
    <!-- n번 구역 -->
    <div class="d-flex justify-center">
      <v-card-title><slot name="sectionNum"></slot></v-card-title>
    </div>
    <v-divider class="mx-4"></v-divider>
    <!-- 내부센서 -->
    <div class="d-flex flex-column px-3 py-3">
      <slot name="sensorInside"></slot>
    </div>
    <v-divider class="mx-4"></v-divider>
    <!-- 외부제어 -->
    <div class="d-flex flex-column py-2 px-3">
      <slot name="sensorOutside"></slot>
    </div>
    <v-divider class="mx-4"></v-divider>
    <!-- 추가제어 -->
    <div class="d-flex py-2 px-3 flex-column">
      <slot name="additionalSensor"></slot>
    </div>

    <div class="d-flex justify-space-between pt-5">
      <v-card-actions>
        <div class="text-center">
          <v-btn color="green " dark @click="lookUp()"> 조회 </v-btn>
        </div>
      </v-card-actions>
      <v-card-actions>
        <v-dialog v-model="dialog" width="500">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="grey " dark v-bind="attrs" v-on="on"> 제어 </v-btn>
          </template>

          <v-card>
            <v-card-title class="text-h5 grey lighten-2 d-flex justify-center"
              >알림</v-card-title
            >

            <v-card-text class="d-flex justify-center pt-5">
              지금은 이 서비스를 이용할 수 없습니다.
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="dialog = false"> 확인 </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card-actions>
    </div>
  </v-card>
</template>

<script>
import Data from '@/data/Data.json';
const data = Data;

export default {
  props: ['sectionNum', 'section'],
  name: 'MonitoringCard',

  data() {
    return {
      data,
      dialog: false,
    };
  },

  mounted() {},

  methods: {
    lookUp() {
      this.$router.push({
        name: 'MonitoringGraph',
        params: { sectionNum: this.sectionNum, section: this.section },
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
