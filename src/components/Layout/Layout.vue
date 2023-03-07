<template>
  <v-app class="pa-6">
    <Sidebar />
    <v-main class="content background-color ">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Sidebar from "@/components/Sidebar/Sidebar.vue";
@Component({
  components: {
    Sidebar,
  },
})
export default class Layout extends Vue { }
</script>

<style src="./Layout.scss" lang="scss"></style>



<style lang="css">
.background-color {
  background: #F1F8E9
}
</style>

