<template>
  <div class="monitor-page">
    <v-container fluid>
      <v-row>
        <v-col offset-md="4" md="4"></v-col>
        <p class="text-center text-h4 monitor-title font-weight-bold">
          생산 모니터링 시스템
        </p>
        </v-col>
        <v-col class="text-right" offset-md="3" md="1"><v-btn color="normal">초기화</v-btn></v-col>
      </v-row>
      <v-row>
        <v-col md="4">
          <v-row class="text-center">
            <v-col offset-md="3" md="2" :align-self="center">
              <v-sheet class="text-center pa-4 lighten-2" color="#0F3460" height="85px" width="200px">
                <p class="ma-0 text-subtitle-1 text-center watch-title">
                  {{ nowDate }}
                </p>
                <p class="ma-0 text-h5 text-center watch-title font-weight-bold">
                  {{ nowTime }}
                </p>
              </v-sheet>
            </v-col>
          </v-row>
          <v-row class="text-center">
            <v-col md="6" :align-self="center">
              <p>전체 도달률</p>
              <Progress :transitionDuration="1000" :radius="60" :strokeWidth="20" strokeColor="#FF0000" value="0">
                <template v-slot:footer>
                  <p>목표 수 : 0</p>
                  <p>달성 수 : 10</p>
                </template>
              </Progress>
            </v-col>
            <v-col md="6" :align-self="center">
              <p>전체 불량률</p>
              <Progress :transitionDuration="1000" :radius="60" :strokeWidth="20" strokeColor="#FF0000" value="60">
                <template v-slot:footer>
                  <p>목표 수 : 10</p>
                  <p>달성 수 : 15</p>
                </template>
              </Progress>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <p>라인 별 오류 목록</p>
              <v-sheet color="#0f3460" height="150" width="auto"> </v-sheet>
            </v-col>
          </v-row>
        </v-col>
        <v-col md="8">
          <v-row>
            <v-col>
              <p>라인별 작업 기록</p>
              <table class="line-work-table">
                <thead>
                  <tr>
                    <th>라인</th>
                    <th>작업자</th>
                    <th>투입수량</th>
                    <th>가동률</th>
                    <th>총양품수량</th>
                    <th>총불량수량</th>
                    <th>TACK TIME</th>
                    <th>생산목표</th>
                    <th>공정수량</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in line_item" :key="item.index">
                    <td>{{ item.index }}라인</td>
                    <td>{{ item.user }}</td>
                    <td>{{ item.input_cnt }}</td>
                    <td>{{ item.work_per }}</td>
                    <td>{{ item.total_goods_cnt }}</td>
                    <td>{{ item.total_error_cnt }}</td>
                    <td>{{ item.tack_time }}</td>
                    <td>{{ item.obj_cnt }}</td>
                    <td>{{ item.work_cnt }}</td>
                  </tr>
                </tbody>
              </table>
            </v-col>
          </v-row>

          <v-row>
            <v-col md="4">
              <Bar :chart-data="chart.data" :options="chart.options" />
            </v-col>
            <v-col md="4"> </v-col>
            <v-col md="4"> </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col> </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { Bar } from "vue-chartjs/legacy";
import Progress from "easy-circular-progress";

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

export default {
  name: "Monitoring",
  data: () => ({
    now: 0,
    nowTime: 0,
    nowDate: 0,
    chartData: {
      labels: ["January", "February", "March"],
      datasets: [
        {
          label: "Data One",
          backgroundColor: "#f87979",
          data: [40, 20, 12],
        },
      ],
    },
    chartOptions: {
      responsive: true,
      maintainAspectRatio: false,
    },
    chart: {
      data: {
        labels: ["하나", "둘", "셋", "넷", "다섯", "여섯"],
        datasets: [
          {
            label: "",
            backgroundColor: "pink",
            pointBackgroundColor: "white",
            borderWidth: 0,
            fill: true,
            tension: 0.1,
            barPercentage: 0.7,
            data: [3, 2, 7, 5, 4, 9],
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
        scales: {
          x: {
            min: 0,
            max: 10,
            grid: {
              drawBorder: false,
              color: "black",
              lineWidth: 1,
            },
            ticks: {
              callback: (val, index) => {
                return val !== 0 ? val : "";
              },
              padding: 3,
              stepSize: 2,
            },
          },
          y: {
            ticks: {},
            grid: {
              display: false,
            },
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 5000,
        },
      },
    },
    line_item: [
      {
        index: 1,
        user: "없음",
        input_cnt: 4,
        work_per: 0,
        total_goods_cnt: 0,
        total_error_cnt: 1,
        tack_time: 0,
        obj_cnt: 0,
        work_cnt: 2,
      },
      {
        index: 2,
        user: "없음",
        input_cnt: 5,
        work_per: 0,
        total_goods_cnt: 1,
        total_error_cnt: 2,
        tack_time: 0,
        obj_cnt: 0,
        work_cnt: 3,
      },
      {
        index: 3,
        user: "없음",
        input_cnt: 6,
        work_per: 0,
        total_goods_cnt: 2,
        total_error_cnt: 3,
        tack_time: 0,
        obj_cnt: 0,
        work_cnt: 4,
      },
      {
        index: 4,
        user: "없음",
        input_cnt: 5,
        work_per: 0,
        total_goods_cnt: 3,
        total_error_cnt: 4,
        tack_time: 0,
        obj_cnt: 0,
        work_cnt: 5,
      },
      {
        index: 5,
        user: "없음",
        input_cnt: 6,
        work_per: 0,
        total_goods_cnt: 4,
        total_error_cnt: 5,
        tack_time: 0,
        obj_cnt: 0,
        work_cnt: 6,
      },
    ],
  }),
  components: {
    Progress,
    Bar,
  },
  props: {
    chartId: {
      type: String,
      default: "doughnut-chart",
    },
    datasetIdKey: {
      type: String,
      default: "label",
    },
    width: {
      type: Number,
      default: 400,
    },
    height: {
      type: Number,
      default: 400,
    },
    cssClasses: {
      default: "",
      type: String,
    },
    styles: {
      type: Object,
      default: () => { },
    },
    plugins: {
      type: Array,
      default: () => [],
    },
  },
  created() {
    //this.searchTimes();
    this.nowTimesYYMMDD();
    this.nowTimesHHMM();
    this.setDate();
    setInterval(this.nowTimesYYMMDD.bind(this), 1000);
    setInterval(this.nowTimesHHMM.bind(this), 1000);
  },
  mounted() {
    this.updateNow();
    setInterval(this.updateNow.bind(this), 1000);
  },
  methods: {
    updateNow() {
      this.now = Math.round(Date.now() / 1000);
    },
    setDate() {
      let year = new Date().getFullYear();
      let month =
        new Date().getMonth() + 1 < 10
          ? "0" + (new Date().getMonth() + 1)
          : new Date().getMonth() + 1;
      let date =
        new Date().getDate() < 10
          ? "0" + new Date().getDate()
          : new Date().getDate();
      let hh =
        new Date().getHours() < 10
          ? "0" + new Date().getHours()
          : new Date().getHours();
      let mm =
        new Date().getMinutes() < 10
          ? "0" + new Date().getMinutes()
          : new Date().getMinutes();
      let ss =
        new Date().getSeconds() < 10
          ? "0" + new Date().getSeconds()
          : new Date().getSeconds();
      return {
        year: year,
        month: month,
        date: date,
        hh: hh,
        mm: mm,
        ss: ss,
      };
    },
    nowTimesYYMMDD() {
      this.nowDate =
        this.setDate().year +
        "-" +
        this.setDate().month +
        "-" +
        this.setDate().date;
    },
    nowTimesHHMM() {
      this.nowTime = this.setDate().hh + ":" + this.setDate().mm;
    },
  },
};
</script>

<style scoped src="./Monitoring.scss" lang="scss"></style>
