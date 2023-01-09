<template>
  <div>
    <v-dialog v-model="open" max-width="1600px">
      <v-card>
        <v-card-title>
          <span>{{ lot_modal_title }}</span>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-data-table
                :headers="headers_lot"
                :items="item_lot_modal"
                fixed-header
                item-key="id"
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
export default class ProductWarehousingLotModal extends Vue {
  @Prop({ required: true }) open: boolean = false;
  @Prop({ required: true }) item_lot_modal: object[];
  @Prop({ required: true }) lot_modal_title: string;

  get headers_lot() {
    return cfg.header.headers_lot;
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
