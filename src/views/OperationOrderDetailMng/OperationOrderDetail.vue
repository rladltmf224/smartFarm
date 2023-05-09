<template>
  <div>
    작업지시서 상세관리페이지입니다.
  </div>
</template>

<script lang="ts">
import cfg from "./config";
import _ from "lodash";
import * as api from "@/api/index.js";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

export default class OperationOrderDetail extends Vue {
  operationOrderDetail_data: object[] = [];

  get headers_List() {
    return cfg.header.headers_Detail;
  }
}
</script>

<style lang="scss" src="./OperationOrderDetail.scss"></style>
