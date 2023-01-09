<template>
  <div>
    <v-chip v-if="status === 'AUTO'" color="primary" small> AUTO </v-chip>
    <v-chip v-if="status === 'ON'" color="success" small> ON </v-chip>
    <v-chip v-if="status === 'OFF'" color="error" small> OFF </v-chip>
  </div>
</template>

<script>
export default {
  props: ["status"],
};
</script>
