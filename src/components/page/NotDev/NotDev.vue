<template>
  <div>
    <v-container fill-height fluid>
      <v-row class="mt-15 pt-15 text-center " align="center" justify="center">
        <v-col cols="12">
          <!-- <v-icon class="text-center text-h1" color="green"> mdi-check-outline </v-icon> -->
          <v-progress-circular indeterminate color="green" :size="100" :width="15"></v-progress-circular>
        </v-col>
        <v-col cols="8">

          <v-card rounded="5">
            <v-card-text>
              <p class="text-center text-h4 font-weight-bold content_conf">
                업체의 제조현장에 공정단계가 달라 요청받아 <br></br>개발예정인 페이지입니다.
              </p>
            </v-card-text>
          </v-card>

        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "MESFENotDev",

  data() {
    return {};
  },

  mounted() { },

  methods: {},
};
</script>

<style lang="scss" scoped>
.content_conf {
  color: "black"
}
</style>
