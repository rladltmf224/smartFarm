<template>
  <div>
    <v-dialog v-model="open" width="550px" persistent>
      <v-card>
        <v-card-title>반품 요청</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="5">
              <span>반품 항목</span>
              <v-select
                dense
                v-model="deleteItem"
                :items="option"
                item-text="itemName"
                item-value="id"
                return-object
                @change="changeOption()"
              ></v-select
            ></v-col>
            <v-col cols="7"
              ><span v-if="deleteItem == ''">반품 사유</span>
              <v-text-field
                v-if="deleteItem == ''"
                hide-details="false"
                dense
              ></v-text-field
            ></v-col>
          </v-row>
          <v-data-table
            :headers="detail_header"
            :items="detail"
            v-if="deleteItem != ''"
          >
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="closeModal"> 닫기 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts">
import * as api from "@/api/index.js";
import cfg from "./config";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

@Component
export default class WarehousingDeleteModal extends Vue {
  @Prop({ required: true }) open: boolean = false;
  @Prop({ required: true }) delete_item: any[] = [];

  deleteItem: string = "";
  selectedItem: any[];
  option: any[] = [
    {
      itemName: "전체",
      id: "",
    },
  ];
  reset_option: any[] = [
    {
      itemName: "전체",
      id: "",
    },
  ];
  deleteItem_list: any[] = [];
  detail: any[] = [];

  get detail_header() {
    return cfg.header.detail_header;
  }

  @Watch("delete_item")
  updateItemInfo() {
    this.selectedItem = this.delete_item;
    console.log(this.selectedItem);
    if (this.selectedItem.length != 0) {
      this.option = [...this.reset_option];
      api.rawWarehousing
        .getWarehousingDetailList({ id: this.selectedItem[0].id })
        .then((response) => {
          response.data.responseData.forEach((value: any) => {
            this.option.push({
              itemName: value.itemName,
              id: value.id,
            });
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  created() {
    this.deleteItem = "";
  }
  closeModal() {
    this.$emit("closeModal");
  }
  changeOption() {
    if (this.deleteItem != "") {
      this.detail.push(this.deleteItem);
      this.deleteItem_list.push(this.deleteItem);
      console.log(this.deleteItem_list);
    }
  }
}
</script>
