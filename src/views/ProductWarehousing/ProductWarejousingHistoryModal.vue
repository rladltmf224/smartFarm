<template>
  <div>
    <v-dialog v-model="open" max-width="1000px">
      <v-card>
        <v-card-title>
          <span>{{ history_modal_title }}</span>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-card-text>
          <v-row dense>
            <v-col>
              <v-data-table
                :headers="headers_history"
                fixed-header
                :items="item_history_modal"
                item-key="id"
                class="elevation-4"
                multi-sort
                :footer-props="footer_option"
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
            <v-btn color="primary" text @click="close_modal"> 닫기 </v-btn>
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
export default class ProductWarehousingHistoryModal extends Vue {
  @Prop({ required: true }) open: boolean = false;
  @Prop({ required: true }) item_history_modal: object[];
  @Prop({ required: true }) history_modal_title: string;

  footer_option: {
    itemsPerPageAllText: string;
    itemsPerPageOptions: number[];
  } = {
    itemsPerPageAllText: "ALL",
    itemsPerPageOptions: [10, 20, 50, -1],
  };

  get headers_history() {
    return cfg.header.headers_history;
  }

  close_modal() {
    this.$emit("closeModal");
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
}
</script>
