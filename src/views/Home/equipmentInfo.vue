<template>
  <v-card class="" color="grey lighten-3">
    <v-img
      src="@/assets/images/clipboardImage_22_1026_090133_128.png"
      height="450"
      contain
    ></v-img>
    <v-card-title>
      <v-row no-gutters>
        <v-col cols="2">
          <span class="font-weight-bold">{{ data }}</span
          ><span class="text-caption">호기</span>
        </v-col>
        <v-col cols="9">
          <v-progress-linear
            color="light-blue"
            height="10"
            :value="process_val"
            striped
          >
          </v-progress-linear>
        </v-col>
      </v-row>
    </v-card-title>

    <v-card-text>
      <v-row no-gutters>
        <v-col cols="4">
          <v-row class="text-center" no-gutters>
            <v-col cols="12">
              <span class="text-h6 font-weight-black">{{ process_val }}%</span>
            </v-col>
            <v-col cols="12">
              <span class="text-caption font-weight-black">PLC연결상태</span>
            </v-col>
            <v-col cols="12">
              <v-chip class="ma-2" :color="status" text-color="white" small>
                {{
                  status == "green"
                    ? "가동"
                    : status == "orange"
                    ? "대기"
                    : "비가동"
                }}
              </v-chip>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="8">
          <v-row no-gutters class="text-center">
            <v-col cols="6">
              <v-row dense>
                <v-col cols="6"> <span class="text-caption">제품</span></v-col>
                <v-col cols="6">
                  <span class="font-weight-bold"
                    >TW{{ data > 9 ? data : "0" + data }}</span
                  ></v-col
                >
                <v-col cols="6">
                  <span class="text-caption">목표량</span></v-col
                >
                <v-col cols="6">
                  <span class="font-weight-bold">{{
                    randomVal2()
                  }}</span></v-col
                >
                <v-col cols="6">
                  <span class="text-caption">생산량</span></v-col
                >
                <v-col cols="6">
                  <span class="font-weight-bold">{{
                    randomVal2()
                  }}</span></v-col
                >
              </v-row>
            </v-col>
            <v-col cols="6">
              <v-row dense class="text-center">
                <v-col cols="6"> <span class="text-caption">수율</span></v-col>
                <v-col cols="6" class="align-self-center">
                  <v-progress-linear
                    color="orange lighten-1"
                    height="6"
                    :value="process_val"
                    striped
                  >
                  </v-progress-linear>
                </v-col>
                <v-col cols="6"> <span class="text-caption">효율</span></v-col>
                <v-col cols="6" class="align-self-center"
                  ><v-progress-linear
                    color="purple lighten-1"
                    height="6"
                    :value="process_val"
                    striped
                  >
                  </v-progress-linear
                ></v-col>
                <v-col cols="6"> <span class="text-caption">BPM</span></v-col>
                <v-col cols="6">
                  <span class="font-weight-bold">{{ randomVal() }}</span></v-col
                >
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class EquipmentInfo extends Vue {
  status: string = "green";
  interval: any = {};
  value: number = 0;
  process_val: number = 0;

  @Prop() data: number;

  beforeDestroy() {
    clearInterval(this.interval);
  }
  mounted() {
    this.process_val = this.randomVal3();
    this.randomYN();
    if (this.status == "green") {
      this.interval = setInterval(() => {
        this.process_val += parseFloat(
          (Math.random() * (10 - 1) + 1).toFixed(1)
        );
        if (this.process_val === 100 || this.process_val > 100) {
          return (this.process_val = 0);
        }
      }, 30000);
    }
  }

  randomYN() {
    switch (this.data) {
      case 2:
        this.status = "orange";
        break;
      case 3:
        this.status = "red";
        break;
      default:
        this.status = "green";
    }
  }

  randomVal(): number {
    return Math.floor(Math.random() * (100 - 1) + 1);
  }
  randomVal2(): number {
    return Math.floor(Math.random() * (1000 - 100) + 1);
  }
  randomVal3(): number {
    return parseFloat((Math.random() * (100 - 1) + 1).toFixed(1));
  }
}
</script>
