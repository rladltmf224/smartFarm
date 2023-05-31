<template>
  <div>
    <!-- 생성 모달 -->
    <v-dialog persistent v-model="manureDialog" max-width="800px">
      <v-card class="card-shadow box-radius">
        <v-card-title>
          <span>양액 추가</span>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="manureAdd_headers"
            item="manureAdd_list"
            disable-pagination
            hide-default-footer
            show-select
            loading-text="서버에 요청중...."
            no-data-text="데이터가 없습니다."
            class="elevation-1"
            fixed-header
          >
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success">사용완료</v-btn>
          <v-btn color="error" @click="close">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import cfg from "./config/index";

@Component
export default class ManureMngAddModal extends Vue {
  @Prop({ required: true }) readonly open: boolean;
  manureAdd_headers: any[] = [];
  get manureDialog() {
    return this.open;
  }
  set manureDialog(val: any) {
    this.$emit("closeModal", false);
  }

  created() {
    this.manureAdd_headers = Object.assign([], cfg.header.manureAdd_headers);
  }
  close() {
    this.$emit("closeModal", false);
  }
}
</script>
