<template>
  <!-- <v-row dense> -->
  <div class="d-flex flex-row flex-nowrap">
    <div
      class="mx-1"
      :class="{
        on: equipData.currentStatus === 'ON',
        off: equipData.currentStatus === 'OFF',
      }"
    ></div>

    <span class="text-truncate text-center" style="width: 80px"
      >{{ equipData.equipmentName }}

      {{ equipData.currentMode }}
    </span>
    <!-- <span v-if="equipData.currentMode != null"></span> -->

    <div class="d-flex align-center">
      <v-chip
        v-if="equipData.controlStatus === 'AUTO'"
        color="blue"
        small
        style="width: 60px; color: white"
        class="d-flex justify-center"
      >
        AUTO
      </v-chip>
      <v-chip
        v-if="equipData.controlStatus === 'ON'"
        color="success"
        small
        style="width: 60px"
        class="d-flex justify-center"
      >
        ON
      </v-chip>
      <v-chip
        v-if="equipData.controlStatus === 'OFF'"
        color="error"
        small
        style="width: 60px"
        class="d-flex justify-center"
      >
        OFF
      </v-chip>
      <v-chip v-if="equipData.controlStatus === null" small> EMPTY </v-chip>
    </div>
    <!-- </v-row> -->
  </div>
</template>

<script>
export default {
  props: ["equipData"],
};
</script>

<style lang="scss">
div {
  %circle {
    margin: 7px;
    width: 13px;
    height: 13px;
    border-radius: 50%;
  }

  .on {
    @extend %circle;
    background: #4baf50;
  }

  .off {
    @extend %circle;
    background: #ff5252;
  }
}
</style>
