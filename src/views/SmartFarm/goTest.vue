<template>
  <div
    class="chart-container"
    style="position: relative; height: 40vh; width: 70vw"
  >
    <canvas class="j" ref="barChart" />
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import annotationPlugin from 'chartjs-plugin-annotation';

Chart.register(...registerables);
Chart.register(zoomPlugin);
Chart.register(annotationPlugin);

export default {
  props: {
    GraphData_TempHumid: {
      type: [Array, Object],
      default: null,
    },
    GraphData_PHEC: {
      type: [Array, Object],
      default: null,
    },
    s_date: {
      type: [Array, Object, String, Number, Date],
      default: null,
    },
    e_date: {
      type: [Array, Object, String, Number, Date],
      default: null,
    },
    selection: {
      type: [Array, Object, String, Number, Date],
      default: null,
    },
  },

  mounted() {
    console.log(
      'ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ',
      this.selection
    );

    if (this.selection == '온/습도') {
      console.log('온습도만그리세요');
    } else {
      console.log('양액ph를그리세요');
    }

    console.log(
      '온습도온습도온습도온습도온습도온습도',
      this.GraphData_TempHumid
    );
    console.log('양액EC양액EC양액EC양액EC양액EC양액EC', this.GraphData_PHEC);
    console.log('체크체크체크체크', this.GraphData_PHEC[0].ec);

    this.graph_TempHumid();

    this.createChart();
  },
  data: () => ({
    unit: '온도',
    type: 'line',
    data: {
      labels: [1, 1, 1, 1],
      datasets: [
        {
          label: '1,1,1,1',
          data: [2, 3, 4, 5],
          fill: false,
          borderColor: 'red',
          tension: 0.1,
          backgroundColor: 'red',
          pointRadius: 3,
          borderWidth: 1,
          yAxisID: 'y1',
        },
        {
          label: '1,2,1,1',
          data: [2, 3, 2, 4],
          fill: false,
          borderColor: 'blue',
          tension: 0.1,
          backgroundColor: 'blue',
          pointRadius: 3, //점 크기
          borderWidth: 1, //라인굵기
          yAxisID: 'y',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,

      stacked: false,

      events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
      interaction: {
        mode: 'index',
        intersect: false,
      },
      pan: {
        enabled: true,
        mode: 'x',
      },
      scales: {
        y: {
          // beginAtZero: true,
          min: 0,
          max: 100,
          type: 'linear',
          display: true,

          position: 'left',
          title: {
            display: true,
            text: '습도 %',
          },
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          grid: {
            drawOnChartArea: false, // only want the grid lines for one axis to show up
          },
          min: 0,
          max: 40,
          title: {
            display: true,
            text: '온도 °C',
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
          events: ['mousemove'],
        },
        title: {
          display: true,
        },
        autocolors: false,
        interaction: {
          mode: 'index',
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
            mode: 'xy',
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
      new Chart(this.$refs.barChart, {
        type: 'line',
        data: this.data,
        options: this.options,
      });
    },
    graph_TempHumid() {
      let input_start = this.s_date + ' 00:00';
      let input_end = this.e_date + ' 23:59';

      let start_date = new Date(input_start);
      let end_date = new Date(input_end);
      let o = this.GraphData_TempHumid;
      let source = _.sortBy(o, 'createdDate'); //서버에서 받은 데이터를 날짜만 뽑아서  정렬

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
              hour_Temp_Value: temp['temperatureAVG'],
              hour_Humid_Value: temp['humidityAVG'],
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
      console.log('최종', result);

      // 날짜가공

      let GraphDate = _.map(result, 'date');
      let changed_24Hours_Date = [];

      for (let i = 0; i < GraphDate.length; i++) {
        const TIME_ZONE = 3240 * 10000;
        const d = new Date(GraphDate[i]);

        const date = new Date(+d + TIME_ZONE).toISOString().split('T')[0];

        const time = d.toTimeString().split(' ')[0];
        // 2022-12-12 14:00 방식화
        var changed_24Hours_Date_Arr = date + ' ' + time;
        //초 짜르기
        var cutted_24Hours_Date = changed_24Hours_Date_Arr.substr(0, 16);

        //초 짜른 날짜를 어레이에 담기
        //    날짜: changed_24Hours_Date

        changed_24Hours_Date.push(cutted_24Hours_Date);
      }

      // 그래프만들기

      let GraphData1 = _.map(result, 'hour_Temp_Value');
      let GraphData2 = _.map(result, 'hour_Humid_Value');
      let InputGraphDate = changed_24Hours_Date;

      this.data.labels = InputGraphDate;
      this.data.datasets[0].label = '온도';
      this.data.datasets[1].label = '습도';
      this.data.datasets[0].data = GraphData1;
      this.data.datasets[1].data = GraphData2;
    },
    graph_WaterPHEC() {
      this.data.labels = [4, 4, 4, 4, 4, 4, 4, 4];
    },
  },

  watch: {
    selection: function () {
      console.log('SSSSSSSSSSSSSSSS', this.selection);
    },
  },
};
</script>
