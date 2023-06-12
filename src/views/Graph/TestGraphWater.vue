<template>
  <div>
    <div class="d-flex justify-center">
      <div class="chart-container">
        <canvas v-if="" class="j" ref="barChart" height="350" />
      </div>
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

export default {
  props: {
    Data_Water: {
      type: [Array, Object],
      default: null,
    },
    name: {
      type: String,
    },
  },

  mounted() {
    this.$nextTick(function () {
      this.MakeGraph();
    });
  },
  data: () => ({
    unit: "온도",
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
          yAxisID: "y1",
        },
        {
          label: "양액EC",
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
          max: 4,
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
          min: 4,
          max: 8,
          title: {
            display: true,
            text: " ",
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

      var chart = new Chart(this.$refs.barChart, {
        type: "line",
        data: this.data,
        options: this.options,
      });
      // this.graph_TempHumid();
      console.log("createChartttttttttttttttttt", this.name);
      chart.update();
      console.log("createChartttttttttttttttttt", this.name);
    },
    MakeGraph() {
      let AM = _.filter(this.Data_Water.value, { division: "오전" });

      let PM = _.filter(this.Data_Water.value, { division: "오후" });

      let inputDate = _.map(this.Data_Water.value, "inputDate");
      console.log("inputDate", inputDate);

      let AMPM_Result_PH = _.map(this.Data_Water.value, "ph");
      let AMPM_Result_EC = _.map(this.Data_Water.value, "ec");
      console.log("오전오후순서대로값", AMPM_Result_PH, AMPM_Result_EC);

      // 오전/오후 + inputData
      var PluseDivAndInputDate = [];

      for (var i = 0; i < this.Data_Water.value.length; i++) {
        PluseDivAndInputDate.push(
          this.Data_Water.value[i].inputDate +
            " " +
            this.Data_Water.value[i].division
        );
      }
      console.log("PluseDivAndInputDate", PluseDivAndInputDate);
      // 소영선임님이 알려준신 nextTick

      this.data.labels = PluseDivAndInputDate;
      this.data.datasets[0].data = AMPM_Result_PH;
      this.data.datasets[1].data = AMPM_Result_EC;

      // this.$nextTick(function () {
      this.createChart();
      // });
    },
  },
};
</script>
