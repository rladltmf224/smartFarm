<template>
  <div class="monitor-page">
    <v-container fluid>
      <v-row>
        <v-col cols="4">
          <v-card color="grey lighten-3" height="235">
            <v-card-title>
              <span class="text-h6 font-weight-bold">실적</span>
            </v-card-title>

            <v-card-text>
              <div>
                <v-row no-gutters>
                  <v-col cols="4" class="text-center">
                    <v-progress-circular
                      :rotate="-90"
                      :size="120"
                      :width="17"
                      :value="day_val"
                      color="primary"
                    >
                      <p class="progress_title font-weight-bold">
                        일간<br />
                        {{ day_val }}%
                      </p>
                    </v-progress-circular>
                  </v-col>
                  <v-col cols="4" class="text-center">
                    <v-progress-circular
                      :rotate="-90"
                      :size="120"
                      :width="17"
                      :value="week_val"
                      color="purple"
                    >
                      <p class="progress_title font-weight-bold">
                        <span>주간</span><br />
                        <span>{{ week_val }}%</span>
                      </p>
                    </v-progress-circular>
                  </v-col>
                  <v-col cols="4" class="text-center">
                    <v-progress-circular
                      :rotate="-90"
                      :size="120"
                      :width="17"
                      :value="month_val"
                      color="green"
                    >
                      <p class="progress_title font-weight-bold">
                        월간<br />
                        {{ month_val }}%
                      </p>
                    </v-progress-circular>
                  </v-col>
                </v-row>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="3">
          <v-card class="" color="grey lighten-3" height="235">
            <v-card-title>
              <span class="text-h6 font-weight-bold">생산성</span>
            </v-card-title>

            <v-card-text>
              <v-row justify="space-between">
                <v-col>
                  <Bar
                    :chart-data="chart.data"
                    :chart-options="chart.options"
                    :height="140"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="5">
          <v-card class="" color="grey lighten-3" height="235">
            <v-card-title>
              <span class="text-h6 font-weight-bold">시간별 생산추이</span>
            </v-card-title>

            <v-card-text>
              <v-row justify="space-between">
                <v-col>
                  <Bar
                    :chart-data="chart_time.data"
                    :chart-options="chart_time.options"
                    :height="173"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-for="(n, index) in 4" :key="index" cols="3">
          <equipmentInfoVue :data="index + 1"></equipmentInfoVue>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);
import { Bar } from "vue-chartjs/legacy";
import { Component, Vue } from "vue-property-decorator";

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
} from "chart.js";
import equipmentInfoVue from "../Home/equipmentInfo.vue";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

@Component({
  components: {
    equipmentInfoVue,
    Bar,
  },
})
export default class Home extends Vue {
  interval: any = {};
  value: number = 0;
  day_val: number = 0;
  week_val: number = 0;
  month_val: number = 0;
  chartData: object = {
    labels: ["January", "February", "March"],
    datasets: [
      {
        label: "Data One",
        backgroundColor: "#f87979",
        data: [40, 20, 12],
      },
    ],
  };
  chartOptions: object = {
    responsive: true,
    maintainAspectRatio: false,
  };

  chart: any = {
    data: {
      labels: ["수율", "효율", "LOSS"],
      datasets: [
        {
          axis: "y",
          label: "",
          backgroundColor: ["orange", "purple", "blue"],
          pointBackgroundColor: "white",
          borderWidth: 0,
          fill: true,
          tension: 0.1,
          barPercentage: 1,
          data: [70, 73, 20],
        },
      ],
    },
    options: {
      indexAxis: "y",
      plugins: {
        legend: {
          display: false,
        },
        datalabels: {
          display: false,
        },
        tooltip: {
          boxWidth: 15,
        },
      },

      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 2000,
      },
    },
  };
  chart_time: any = {
    data: {
      labels: [
        "0시",
        "1시",
        "2시",
        "3시",
        "4시",
        "5시",
        "6시",
        "7시",
        "8시",
        "9시",
        "10시",
        "11시",
        "12시",
        "13시",
        "14시",
        "15시",
        "16시",
        "17시",
        "18시",
        "19시",
        "20시",
        "21시",
        "22시",
        "23시",
      ],
      datasets: [
        {
          label: "",
          backgroundColor: "red",
          pointBackgroundColor: "white",
          borderWidth: 0,
          fill: true,
          tension: 0.1,
          barPercentage: 0.8,
          data: [3, 2, 7, 5, 4, 9, 2, 3, 1, 2, 5, 1, 2, 3, 5, 1, 2, 3, 5],
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: false,
        },
        datalabels: {
          display: false,
        },
        tooltip: {
          boxWidth: 15,
        },
      },

      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 2000,
      },
    },
  };

  status: string = "red";
  now: number = 0;

  mounted() {
    this.updateNow();
    setInterval(this.updateNow.bind(this), 1000);
    this.day_val = this.randomVal2();
    this.week_val = this.randomVal2();
    this.month_val = this.randomVal2();
    this.interval = setInterval(() => {
      if (this.value === 100) {
        return (this.value = 0);
      }
      this.value += 10;
      this.randomYN();

      this.day_val = this.randomVal2();
      this.week_val = this.randomVal2();
      this.month_val = this.randomVal2();

      this.chart_time.data.datasets.data;
      let time_data: number[] = [];
      let time_data2: number[] = [];

      this.chart_time.data.labels.forEach(() => {
        time_data.push(this.randomVal3());
      });

      this.chart.data.labels.forEach(() => {
        time_data2.push(this.randomVal2());
      });

      this.chart_time.data.datasets[0].data = Object.assign([], time_data);
      this.chart.data.datasets[0].data = Object.assign([], time_data2);
      //
    }, 100000);
  }

  randomVal() {
    return Math.floor(Math.random() * (100 - 1) + 1);
  }
  randomVal2() {
    return parseFloat((Math.random() * (100 - 1) + 1).toFixed(1));
  }
  randomVal3() {
    return Math.floor(Math.random() * (1000 - 100) + 1);
  }
  randomYN() {
    let count = Math.floor(Math.random() * (10 - 0) + 1);
    if (count % 2 == 0) {
      return (this.status = "green");
    } else {
      return (this.status = "red");
    }
  }
  updateNow() {
    this.now = Math.round(Date.now() / 1000);
  }
}
</script>

<style scoped src="./Home.scss" lang="scss"></style>
