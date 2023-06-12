<template>
  <div
    class="chart-container"
    style="position: relative; height: 35vh; width: 80vw"
  >
    <canvas class="j" ref="barChart" />
  </div>
</template>

<script>
import { Chart, registerables } from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import annotationPlugin from "chartjs-plugin-annotation";
Chart.register(...registerables);
Chart.register(zoomPlugin);
Chart.register(annotationPlugin);
let test;

export default {
  name: "MESFEWaterPHGraph",
  props: {
    graph: {
      type: [Array, Object],
      default: null,
    },
  },
  data() {
    return {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "양액pH",
            data: [],
            fill: false,
            borderColor: "red",
            tension: 0.1,
            backgroundColor: "red",
            pointRadius: 3,
            borderWidth: 1,
            yAxisID: "y",
          },
          {
            label: "양액EC",
            data: [],
            fill: false,
            borderColor: "blue",
            tension: 0.1,
            backgroundColor: "blue",
            pointRadius: 3,
            borderWidth: 1,
            yAxisID: "y1",
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
            min: 3,
            max: 10,
            type: "linear",
            display: true,

            position: "left",
            title: {
              display: true,
              text: " ",
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
            max: 5,
            title: {
              display: true,
              text: " ",
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
        },
      },
    };
  },

  mounted() {
    console.log("부모한테받은데이터 ", this.graph);
    this.data.labels = this.graph.date;
    this.data.datasets[0].data = this.graph.AllData_PH;
    this.data.datasets[1].data = this.graph.AllData_EC;
    // this.options = {
    //   responsive: false,
    //   scales: {
    //     yAxes: [
    //       {
    //         ticks: {
    //           min: 0,
    //           max: 20,
    //           fontSize: 14,
    //         },
    //       },
    //     ],
    //   },
    // };
    this.createChart();
  },

  methods: {
    createChart() {
      test = new Chart(this.$refs.barChart, {
        type: "line",
        data: this.data,
        options: this.options,
      });
      // test.scales.y.max = 10;
      // test.scales.y.min = 0;
      // test.update();
      // test;
      console.log("chart", test);
    },
  },
};
</script>

<style lang="scss" scoped></style>
