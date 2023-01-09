import "@/utils/charts/global";
import { Bar } from "~/external/vue-chartjs-3.5.1/src/index";

export default {
  extends: Bar,
  props: ["chartData", "options"],
  watch: {
    chartData: {
      handler() {
        this.renderChart(this.chartData, this.options);
      },
      deep: true,
    },
  },
  mounted() {
    this.renderChart(this.chartData, this.options);
  },
};
