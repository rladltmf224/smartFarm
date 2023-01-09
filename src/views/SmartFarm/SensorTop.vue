<template>
  <div class="d-flex flex-column">
    <span v-for="(item, i) in sensor" :key="i"
      ><p>{{ item.korean }}:{{}}</p></span
    >
  </div>
</template>

<script>
import MonitoringCardSlot from '@/views/SmartFarm/MonitoringCardSlot.vue';
export default {
  name: 'MESFESensorTop',
  components: { MonitoringCardSlot },
  data() {
    return {
      sensor: [
        { col: 'temperature', korean: '온 도' },
        { col: 'humidity', korean: '습 도' },
        { col: 'CO2', korean: 'c o 2' },
        { col: 'rootZoneTemp', korean: '근 권 온 도' },
        { col: 'rootZoneHumid', korean: '근 권 수 분' },
        { col: 'soilEC', korean: '토 양 EC' },
        { col: 'soilpH', korean: '토 양 pH' },
      ],
    };
  },

  mounted() {},

  methods: {},
};
</script>

<style lang="scss" scoped></style>
