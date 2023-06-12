<template>
  <div>
    <div class="chart-container">
      <canvas ref="barChart" />
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import annotationPlugin from "chartjs-plugin-annotation";
import _ from "lodash";

Chart.register(...registerables);
Chart.register(zoomPlugin);
Chart.register(annotationPlugin);
var chart;

export default {
  props: {
    Data_TempHumid: {
      type: [Array, Object],
      default: null,
    },
    name: {
      type: String,
    },
  },
  computed: {
    graph_data() {
      return this.Data_TempHumid;
    },
  },

  async mounted() {
    this.$nextTick(function () {
      this.MakeGraph();
    });
  },
  data: () => ({
    chart: "",
    GraphData: [],
    unit: "온도",
    type: "line",
    data: {
      labels: [1, 1, 1, 1],
      datasets: [
        {
          label: "1,1,1,1",
          data: [2, 3, 4, 5],
          fill: false,
          borderColor: "red",
          tension: 0.1,
          backgroundColor: "red",
          pointRadius: 2,
          borderWidth: 1,
          yAxisID: "y1",
          datalabels: {
            display: false,
          },
        },
        {
          label: "1,2,1,1",
          data: [2, 3, 2, 4],
          fill: false,
          borderColor: "blue",
          tension: 0.1,
          backgroundColor: "blue",
          pointRadius: 2, //점 크기
          borderWidth: 1, //라인굵기
          yAxisID: "y",
          datalabels: {
            display: false,
          },
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
      scales: {
        y: {
          // beginAtZero: true,
          min: 0,
          max: 100,
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
          min: 0,
          max: 40,
          title: {
            display: true,
            text: "온도 °C",
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

  methods: {
    createChart() {
      if (chart !== undefined) {
        chart.destroy();
      }

      chart = new Chart(this.$refs.barChart, {
        type: "line",
        data: this.data,
        options: this.options,
      });

      chart.canvas.parentNode.style.height = "400px";
      //chart.canvas.parentNode.style.width = "1200px";

      chart.resize();

      // console.log("createChartttttttttttttttttt", this.name);
      // chart.update();
      // console.log("createChartttttttttttttttttt", this.name);
    },

    MakeGraph() {
      console.log("Data_TempHumid", this.Data_TempHumid.value);
      this.data.labels = this.graph_data.value.map((el) => {
        return el.createdDate;
      });
      this.data.datasets[0].label = "온도";
      this.data.datasets[1].label = "습도";
      this.data.datasets[0].data = this.graph_data.value.map((el) => {
        return el.temperature;
      });
      this.data.datasets[1].data = this.graph_data.value.map((el) => {
        return el.humidity;
      });

      // this.$nextTick(function () {
      this.createChart();
      // });
    },
    reloadChart() {
      console.log("reloadChart", this.graph_data);
      this.data.labels = this.graph_data.value.map((el) => {
        return el.createdDate;
      });
      this.data.datasets[0].label = "온도";
      this.data.datasets[1].label = "습도";
      this.data.datasets[0].data = this.graph_data.value.map((el) => {
        return el.temperature;
      });
      this.data.datasets[1].data = this.graph_data.value.map((el) => {
        return el.humidity;
      });

      chart.update();
      chart.resetZoom();
      console.log("chart", this.data.datasets);
    },
  },
};
</script>
<style lang="scss">
// .chart-container {
//   width: auto;
// }
</style>
