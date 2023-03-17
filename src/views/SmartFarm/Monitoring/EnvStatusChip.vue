<template>
  <div class="d-flex flex-column align-center mx-3 my-2" style="width: 70px">
    <v-chip small :color="whatColor()">
      <strong>{{ title }}</strong>
    </v-chip>
    <div class="text-h5">{{ value }}</div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class Facilitymng extends Vue {
  @Prop({ required: true }) readonly title: string;
  @Prop({ required: true }) readonly value: string;

  whatColor(): string {
    switch (this.title.substr(0, 2)) {
      case "대기":
        return "#afafc3";
      case "양액":
        return "#b0c0b4";
      case "토양":
        return "#beb6b1";
      case "광원":
        return "#c1afbd";
      default:
        return "#000000";
    }
  }
}
</script>
