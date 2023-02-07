<template>
  <div class="d-flex flex-column align-center mx-3 my-2" style="width: 70px">
    <v-chip small>
      <strong>{{ title }}</strong>
    </v-chip>
    <div class="text-h5 font-weight-bold">{{ value }}</div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class Facilitymng extends Vue {
  @Prop({ required: true }) readonly title: string;
  @Prop({ required: true }) readonly value: string;
}
</script>
