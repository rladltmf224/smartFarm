<template>
  <div>
    <v-btn @click="check()">으아아</v-btn>
    <canvas class="j pa-6" ref="barChart" height="300vh" width="1600vw" />
  </div>
</template>

<script>
import { Chart, registerables } from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import annotationPlugin from "chartjs-plugin-annotation";

Chart.register(...registerables);
Chart.register(zoomPlugin);
Chart.register(annotationPlugin);

export default {
  // props: {
  //   newData: {
  //     type: [Array, Object],
  //     default: null,
  //   },
  //   TimeRange: {
  //     type: [Array, Object],
  //     default: null,
  //   },
  //   DataValues: {
  //     type: [Array, Object],
  //     default: null,
  //   },
  // },

  data: () => ({
    newData: [],
    unit: [
      {
        temperature: "°C",
        humidity: "%",
      },
    ],

    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "",
          data: [],
          fill: false,
          borderColor: "red",
          tension: 0.1,
          backgroundColor: "red",
          pointRadius: 1,
          borderWidth: 0.1,
          yAxisID: "y1",
        },
        {
          label: "",
          data: [],
          fill: false,
          borderColor: "blue",
          tension: 0.1,
          backgroundColor: "blue",
          pointRadius: 1, //점 크기
          borderWidth: 0.1, //라인굵기
          yAxisID: "y",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,

      stacked: false,

      events: ["mousemove", "mouseout", "click", "touchstart", "touchmove"],
      interaction: {
        mode: "index",
        intersect: false,
      },
      pan: {
        enabled: true,
        mode: "x",
      },
      responsive: false,
      scales: {
        y: {
          // beginAtZero: true,
          // min: 0,
          // max: 100,
          type: "linear",
          display: true,

          position: "left",
          title: {
            display: true,
            text: "습도 %",
          },
        },
        y1: {
          type: "linear",
          display: true,
          position: "right",
          grid: {
            drawOnChartArea: false, // only want the grid lines for one axis to show up
          },
          // min: 0,
          // max: 40,
          title: {
            display: true,
            text: "온도 °C",
          },
          grid: {
            drawOnChartArea: false, // only want the grid lines for one axis to show up
          },
        },
        x: {
          ticks: {
            autoSkip: true, // 👈
            maxTicksLimit: 20, // 👈
          },
        },
      },

      plugins: {
        tooltip: {
          // Tooltip will only receive click events
          events: ["mousemove"],
        },
        title: {
          display: true,
        },
        autocolors: false,
        interaction: {
          mode: "index",
          intersect: false,
        },
        stacked: false,
        autocolors: false,
        // annotation: {
        //   annotations: {
        //     line1: {
        //       type: 'line',
        //       yMin: 20,
        //       yMax: 20,
        //       borderColor: 'pink',
        //       borderWidth: 4,
        //     },
        //   },
        // },
        zoom: {
          zoom: {
            wheel: {
              enabled: true,
            },
            pinch: {
              enabled: true,
            },
            mode: "xy",
          },
          pan: {
            enabled: true,
          },
          limits: {
            x: { min: 0, max: 2e3, minRange: 10000000 },
            y: { min: 0, max: 100, minRange: 10 },
          },
        },
      },
    },
  }),

  mounted() {
    this.test();
    this.createChart();
  },
  // computed: {
  //   checkData: function () {
  //     if (this.newData[1].name == '양액pH') {
  //       alert('양액입니다');
  //     }
  //   },
  // },
  methods: {
    createChart() {
      new Chart(this.$refs.barChart, {
        type: "line",
        data: this.data,
        options: this.options,
      });
    },
    getTempHumid() {
      var GraphDate = _.map(this.DataValues, "date");
      var changed_24Hours_Date = [];

      var changed_24Hours_Date = [];
      for (var i = 0; i < GraphDate.length; i++) {
        const TIME_ZONE = 3240 * 10000;
        const d = new Date(GraphDate[i]);

        const date = new Date(+d + TIME_ZONE).toISOString().split("T")[0];

        const time = d.toTimeString().split(" ")[0];
        // 2022-12-12 14:00 방식화
        var changed_24Hours_Date_Arr = date + " " + time;
        //초 짜르기
        var cutted_24Hours_Date = changed_24Hours_Date_Arr.substr(0, 16);

        //초 짜른 날짜를 어레이에 담기
        changed_24Hours_Date.push(cutted_24Hours_Date);
      }

      var min_Temp_Value = _.map(this.DataValues, "min_Temp_Value");
      var min_Humid_Value = _.map(this.DataValues, "min_Humid_Value");
      var hour_Temp_Value = _.map(this.DataValues, "hour_Temp_Value");
      var hour_Humid_Value = _.map(this.DataValues, "hour_Humid_Value");

      this.data.labels = changed_24Hours_Date;
      this.data.datasets[0].data = min_Temp_Value;
      this.data.datasets[1].data = min_Humid_Value;

      console.log("뉴데이타뉴데이타뉴데이타뉴데이타", this.newData);
      if (this.newData.division == "minute") {
        this.data.labels = changed_24Hours_Date;
        this.data.datasets[0].data = min_Temp_Value;
        this.data.datasets[1].data = min_Humid_Value;
        this.data.datasets[0].label = this.newData.first_tag;
      } else if (this.newData.division == "hour") {
        this.data.labels = changed_24Hours_Date;
        this.data.datasets[0].data = hour_Temp_Value;
        this.data.datasets[1].data = hour_Humid_Value;
        // this.data.datasets[0].pointRadius = 3;
        // this.data.datasets[0].borderWidth = 2;
        // this.data.datasets[1].borderWidth = 2;
        // this.data.datasets[1].pointRadius = 3;
        // this.data.datasets[1].label = this.newData.humidTag;
      }
    },
    getWaterPH() {
      this.data.labels = this.newData[1].inputDate;
      this.data.datasets[0].data = this.newData[1].AM_ph;
      this.data.datasets[1].data = this.newData[1].PM_ph;
    },

    test() {
      console.log("부모에서준부모에서준부모에서준", this.newData);
      if (this.newData[0].name == "온/습도") {
        console.log("온습도입니다");
        this.getTempHumid();
      } else if (this.newData[1].name == "양액pH") {
        this.getWaterPH();
        console.log("양액pH입니다.");
      } else {
        console.log("양액EC입니다.");
      }
    },
  },
};
</script>
