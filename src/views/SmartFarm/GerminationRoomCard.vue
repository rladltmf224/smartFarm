<template>
  <MonitoringCardSlot :sectionNum="sectionNum" :section="section">
    <!-- 1번구역 -->
    <template #sectionNum>
      <h4>{{ sectionNum }}번 구역</h4>
    </template>
    <!-- 센서값 -->
    <template #sensorInside>
      <span
        class="d-flex"
        style="flex-wrap: nowrap; justify-content: space-between"
        v-for="(item, i) in sensor"
        :key="i"
      >
        <!-- {{
          ['temperature', 'humidity'].includes(item.col)
            ? item.korean + ' : ' + data.sensorValue[item.col][0]
            : item.korean + ' : ' + data.sensorValue[item.col]
        }} 소영선임님이 추가해주신 중!!요한 코드-->
        <p class="key2">
          <v-icon class="pr-1">{{ item.icon }}</v-icon
          >{{ item.korean }}:
        </p>
        <h4 class="pt-3">{{ data.sensorValue[item.col][i] }}{{ units[i] }}</h4>
      </span>
    </template>
    <!-- 제어기계 -->
    <template #sensorOutside>
      <span
        style="display: flex; flex-wrap: nowrap; justify-content: space-between"
        v-for="(item, i) in sensorOutdoor"
        :key="i"
      >
        <p class="key">
          <v-icon class="pr-2">{{ item.icon }}</v-icon
          >{{ item.korean }}:
        </p>
        <v-btn
          class="mt-3"
          v-if="item.value == true"
          dark
          fab
          small
          elevation="0"
          color="green"
          >on</v-btn
        >
        <v-btn
          class="mt-3"
          v-if="item.value == false"
          dark
          fab
          small
          elevation="0"
          color="grey"
          >off</v-btn
        >
      </span>
    </template>
    <!-- 추가제어기계 -->
    <template #additionalSensor>
      <span
        style="display: flex; flex-wrap: nowrap; justify-content: space-between"
        v-for="(item, i) in additionalSensor"
        :key="i"
      >
        <p class="key">
          <v-icon class="mr-2">{{ item.icon }}</v-icon
          >{{ item.korean }}:
        </p>
        <v-btn
          class="mt-3"
          v-if="item.value == true"
          dark
          fab
          small
          elevation="0"
          color="green"
          >AUTO</v-btn
        >
        <v-btn
          class="mt-3"
          v-if="item.value == false"
          dark
          fab
          small
          elevation="0"
          color="grey"
          >AUTO</v-btn
        >
      </span>
    </template>
  </MonitoringCardSlot>
</template>

<script>
import MonitoringCardSlot from '@/views/SmartFarm/MonitoringCardSlot.vue';
import Data from '@/data/Data.json';
import SensorTop from '@/views/SmartFarm/SensorTop.vue';
const data = Data;
export default {
  name: 'MonitoringCard',
  section: '발아실',
  components: { MonitoringCardSlot, SensorTop },
  props: ['sectionNum', 'controlStatus'],

  data() {
    return {
      data,
      section: '발아실',
      sectionNum: [1, 2, 3, 4, 5, 6, 7], // n번 구역
      sensor: [
        { col: 'temperature', korean: '온  도', icon: 'mdi-thermometer' },
        { col: 'humidity', korean: '습  도', icon: 'mdi-water-percent' },
      ],
      sensorOutdoor: [
        {
          col: 'fan',
          korean: '환 기 팬',
          value: data.controlStatus.fan,
          icon: 'mdi-fan',
        },
        {
          col: 'unknown',
          korean: '가 습 기',
          value: data.controlStatus.led,
          icon: 'mdi-air-humidifier',
        },
      ],
      additionalSensor: [
        {
          col: 'unknown',
          korean: '냉 방 기',
          value: data.controlStatus.boiler,
          icon: 'mdi-air-conditioner',
        },
        {
          col: 'unknown',
          korean: '난 방 기',
          value: data.controlStatus.waterpump,
          icon: 'mdi-radiator',
        },
        {
          col: 'unknown',
          korean: '관 비 기',
          value: data.controlStatus.waterpump,
          icon: 'mdi-watering-can-outline',
        },
      ],
      units: ['°C', '%', 'ppm', '°C', '%', ' dS m-1 '],
    };
  },

  mounted() {},

  methods: {},
};
</script>

<style lang="scss" scoped>
.v-btn--fab.v-size--small {
  height: 30px;
  width: 30px;
}
.v-btn.v-size--small {
  font-size: 0.55rem;
}

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

//
.key2 {
  padding-top: 10px;
  width: 87px;
  text-align: justify;
  text-justify: inter-word;
  font-size: var(--my-medium);
  line-height: 0;
}

.key2:before {
  content: '';
  display: inline-block;
  width: 100%;
}

.key2:after {
  content: '';
  display: inline-block;
  width: 100%;
}
</style>
