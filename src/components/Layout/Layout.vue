<template>
  <v-app class="pa-6">
    <Sidebar />
    <v-main class="content background-color ">
      <AppBar></AppBar>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Sidebar from "@/components/Sidebar/Sidebar.vue";
import AppBar from '@/components/Layout/AppBar.vue'
@Component({
  components: {
    Sidebar, AppBar
  },
})
export default class Layout extends Vue { }
</script>

<style src="./Layout.scss" lang="scss"></style>



<style lang="css">
.background-color {
  background: #f5f5f5
}
</style>

