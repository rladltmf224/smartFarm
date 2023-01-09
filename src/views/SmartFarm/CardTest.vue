<template>
  <!-- 센서 컴포넌트 제작을 위한 연습용 컴포넌트입니다. -->
  <MonitoringCardSlot>
    <template #sectionNum>
      <h4>n번구역</h4>
    </template>
    <template #sensorInside>
      <SectionNum></SectionNum>
    </template>
  </MonitoringCardSlot>
</template>

<script>
import MonitoringCardSlot from '@/views/SmartFarm/MonitoringCardSlot.vue';
import SectionNum from '@/views/SmartFarm/SectionNum.vue';
export default {
  name: 'MESFECardTest',
  components: { MonitoringCardSlot, SectionNum },
  data() {
    return {};
  },

  mounted() {},

  methods: {},
};
</script>

<style lang="scss" scoped></style>
