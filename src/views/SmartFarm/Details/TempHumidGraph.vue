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

export default {
  name: "MESFETempHumidGraph",
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
            label: "온도",
            data: [],
            fill: false,
            borderColor: "red",
            tension: 0.1,
            backgroundColor: "red",
            pointRadius: 3,
            borderWidth: 1,
            yAxisID: "y1",
          },
          {
            label: "습도",
            data: [],
            fill: false,
            borderColor: "blue",
            tension: 0.1,
            backgroundColor: "blue",
            pointRadius: 3, //점 크기
            borderWidth: 1, //라인굵기
            yAxisID: "y",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, //반응형

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
    };
  },

  mounted() {
    console.log("부모에서받은거", this.graph);
    console.log("그래프데이터", this.data);

    this.data.labels = this.graph.date;
    this.data.datasets[0].data = this.graph.min_data_1;
    this.data.datasets[1].data = this.graph.min_data_2;

    this.createChart();
  },

  methods: {
    createChart() {
      new Chart(this.$refs.barChart, {
        type: "line",
        data: this.data,
        options: this.options,
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
