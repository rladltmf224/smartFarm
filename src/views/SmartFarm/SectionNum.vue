<template>
  <div class="d-flex flex-column">
    <span
      class="d-flex"
      style="flex-wrap: nowrap; justify-content: space-between"
      v-for="(item, i) in sensor"
      :key="i"
      ><p class="key">{{ item.korean }}:</p>
      <h4 class="pl-3">{{ data.sensorValue[item.col][i] }}{{ units[i] }}</h4>
    </span>
  </div>
</template>

<script>
import Data from '@/data/Data.json';
const data = Data;
export default {
  name: 'MESFESectionNum',

  data() {
    return {
      data,
      sensor: [
        { col: 'temperature', korean: '온 도' },
        { col: 'humidity', korean: '습 도' },
        { col: 'CO2', korean: 'c o 2' },
        { col: 'rootZoneTemp', korean: '근 권 온 도' },
        { col: 'rootZoneHumid', korean: '근 권 수 분' },
        { col: 'soilEC', korean: '토 양 EC' },
        { col: 'soilpH', korean: '토 양 pH' },
      ],
      units: ['°C', '%', 'ppm', '°C', '%', ' dS m-1 '],
    };
  },

  mounted() {},

  methods: {},
};
</script>

<style lang="scss" scoped>
.key {
  padding-top: 10px;
  width: 95px;
  text-align: justify;
  text-justify: inter-word;
  font-size: var(--my-medium);
  line-height: 0;
}

.key:before {
  content: '';
  display: inline-block;
  width: 100%;
}

.key:after {
  content: '';
  display: inline-block;
  width: 100%;
}
</style>
