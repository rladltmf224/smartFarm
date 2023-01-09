<template>
  <div style="width: 200px">
    <p>1번 센서</p>
    <line-chart :options="options" :chartData="chartData"></line-chart>
  </div>
</template>

<script>
import LineChart from '~/components/common/Chart/LineChart';
import { Line, mixins } from 'vue-chartjs'; //또는 'vue-chartjs/legacy'
const { reactiveProp } = mixins;

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: ['options'],
  mounted() {
    // this.chartData is created in the mixin.
    // If you want to pass options please create a local options object
    this.renderChart(this.chartData, this.options);
  },
};
</script>
