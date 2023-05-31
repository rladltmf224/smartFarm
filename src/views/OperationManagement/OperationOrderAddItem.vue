<template>
  <div>
    <v-dialog persistent v-model="manureDialog" max-width="800px">
      <v-card class="card-shadow box-radius">
        <v-card-title>
          <span>농자재 추가</span>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-card-text>
          <v-row no-gutters>
            <v-col class="ma-2" cols="12">
              <v-row dense class="mb-2">
                <v-col cols="3" align-self="center">
                  <span class="searchbox-title">투입되어있는 농자재 목록</span>
                </v-col>
                <v-spacer></v-spacer>
                <v-col class="text-right" cols="3">
                  <v-btn color="primary" elevation="0" @click="openItem"
                    >농자재 추가</v-btn
                  >
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-data-table
            :headers="manure_header"
            :items="manure_list"
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
          <v-btn color="success">완료</v-btn>
          <v-btn color="error" @click="close">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--농자재 추가 모달-->
    <v-dialog persistent v-model="itemDialog" max-width="800px">
      <v-card class="card-shadow box-radius">
        <v-card-title>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <span class="searchbox-title">원자재 목록</span>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-data-table
                :headers="manure_header"
                :items="manure_list"
                disable-pagination
                hide-default-footer
                show-select
                loading-text="서버에 요청중...."
                no-data-text="데이터가 없습니다."
                class="elevation-1"
                fixed-header
              >
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success">추가</v-btn>
          <v-btn color="error" @click="closeItem">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import cfg from "./config/index";

@Component
export default class OrderAddItemModal extends Vue {
  @Prop({ required: true }) readonly open: boolean;
  manure_header: any[] = [];
  manure_list: any[] = [];
  itemDialog: boolean = false;
  item_type: any[] = [];

  get manureDialog() {
    return this.open;
  }
  set manureDialog(val: any) {
    this.$emit("closeModal", false);
  }

  created() {
    this.manure_header = Object.assign([], cfg.header.manure_header);
    this.item_type = Object.assign([], cfg.data.item_type);
  }

  close() {
    this.$emit("closeModal", false);
  }
  openItem() {
    this.itemDialog = true;
  }
  closeItem() {
    this.itemDialog = false;
  }
}
</script>
