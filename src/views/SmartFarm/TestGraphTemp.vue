<template>
  <div>
    <div class="chart-container">
      <canvas class="j" ref="barChart" height="300" />
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
    Data_TempHumid: {
      type: [Array, Object],
      default: null,
    },
    name: {
      type: String,
    },
  },

  async mounted() {
    console.log(
      "마운티드 됐습니다.마운티드 됐습니다.마운티드 됐습니다.",
      this.name
    );
    // this.MakeGraph();
    this.$nextTick(function () {
      this.MakeGraph();
    });
  },
  data: () => ({
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
          pointRadius: 3,
          borderWidth: 1,
          yAxisID: "y1",
        },
        {
          label: "1,2,1,1",
          data: [2, 3, 2, 4],
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

      var chart = new Chart(this.$refs.barChart, {
        type: "line",
        data: this.data,
        options: this.options,
      });

      console.log("createChartttttttttttttttttt", this.name);
      chart.update();
      console.log("createChartttttttttttttttttt", this.name);
    },

    MakeGraph() {
      let input_start = this.Data_TempHumid.startDate + " 00:00";
      let input_end = this.Data_TempHumid.endDate + " 23:59";

      let start_date = new Date(input_start);
      let end_date = new Date(input_end);
      let o = this.Data_TempHumid.value;
      let source = _.sortBy(o, "createdDate"); //서버에서 받은 데이터를 날짜만 뽑아서  정렬
      let result = [];
      let i = 0;
      let date = start_date;
      while (date <= end_date) {
        let temp = source[i]; //그냥 2022-12-12 14:00 형식
        if (temp != undefined) {
          let today = new Date(temp.createdDate); //날짜 표준화형식
          if (date.getTime() == today.getTime()) {
            result.push({
              date: date.toString(),
              hour_Temp_Value: temp["temperatureAVG"],
              hour_Humid_Value: temp["humidityAVG"],
            });
            i++;
            date.setHours(date.getHours() + 1);
            continue;
          }
        }
        result.push({
          date: date.toString(),
          hour_Humid_Value: 0,
          hour_Temp_Value: 0,
        });
        date.setHours(date.getHours() + 1);
      }
      console.log("최종", result);

      // 날짜가공

      let GraphDate = _.map(result, "date");
      let changed_24Hours_Date = [];

      for (let i = 0; i < GraphDate.length; i++) {
        const TIME_ZONE = 3240 * 10000;
        const d = new Date(GraphDate[i]);

        const date = new Date(+d + TIME_ZONE).toISOString().split("T")[0];

        const time = d.toTimeString().split(" ")[0];
        // 2022-12-12 14:00 방식화
        var changed_24Hours_Date_Arr = date + " " + time;
        //초 짜르기
        var cutted_24Hours_Date = changed_24Hours_Date_Arr.substr(0, 16);

        //초 짜른 날짜를 어레이에 담기
        //    날짜: changed_24Hours_Date

        changed_24Hours_Date.push(cutted_24Hours_Date);
      }

      let GraphData1 = _.map(result, "hour_Temp_Value");
      let GraphData2 = _.map(result, "hour_Humid_Value");
      let InputGraphDate = changed_24Hours_Date;

      this.data.labels = InputGraphDate;
      this.data.datasets[0].label = "온도";
      this.data.datasets[1].label = "습도";
      this.data.datasets[0].data = GraphData1;
      this.data.datasets[1].data = GraphData2;

      // this.$nextTick(function () {
      this.createChart();
      // });
    },
  },
};
</script>
