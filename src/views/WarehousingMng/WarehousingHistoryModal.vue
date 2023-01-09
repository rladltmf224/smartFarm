<template>
  <div>
    <v-dialog v-model="open" max-width="1000px">
      <v-card>
        <v-card-title>
          <span>{{ history_modal_title }}</span>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-data-table
                :headers="headers_history"
                :items="history_list"
                item-key="id"
                fixed-header
                class="elevation-4"
                multi-sort
                dense
              >
                <template v-slot:item.status="{ item }">
                  <v-btn
                    class="text-left ma-2"
                    small
                    :color="getStatusColor(item.status)"
                    dark
                    style="width: 100px"
                    depressed
                  >
                    <v-icon left> mdi-album </v-icon>
                    {{ item.status }}
                  </v-btn>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-col class="text-right">
            <v-btn color="primary" text @click="close_history_modal">
              닫기
            </v-btn>
          </v-col>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts">
import cfg from "./config";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class WarehousingHistoryModal extends Vue {
  @Prop({ required: true }) open: boolean = false;
  @Prop() history_modal_title: string;
  @Prop() history_list: any;

  get headers_history() {
    return cfg.header.headers_history;
  }

  getStatusColor(status: string) {
    switch (status) {
      case "부분입고":
        return "orange";
      case "입고":
        return "success";
      case "반품":
        return "red";
    }
  }

  close_history_modal() {
    this.$emit("closeModal");
  }
}
</script>
