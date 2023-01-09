<template>
  <div class="d-flex pb-2 justify-center">
    <GerminationRoomCard
      class="mx-3"
      v-for="(item, i) in sectionNum"
      :key="i"
      :sectionNum="sectionNum[i]"
    ></GerminationRoomCard>
  </div>
</template>

<script>
import GerminationRoomCard from './GerminationRoomCard.vue';

export default {
  name: 'GerminationRoom',
  components: { GerminationRoomCard },
  data() {
    return {
      message: '1',
      sectionNum: [1, 2, 3, 4], //구역 숫자
      controlStatus: [
        //제어 항목
        { col: 'fan', korean: 'LED 보 조 등' },
        { col: 'fan', korean: '가 습 기' },
      ],
      additionalControlStatus: [
        //추가 제어 항목
        { col: 'fan', korean: '냉 방 기' },
        { col: 'fan', korean: '난 방 기' },
        { col: 'fan', korean: '관 비 기' },
      ],
    };
  },

  mounted() {},

  methods: {},
};
</script>

<style lang="scss" scoped></style>
