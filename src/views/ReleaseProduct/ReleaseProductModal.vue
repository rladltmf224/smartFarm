<template>
  <div>
    <v-dialog v-model="open_prop" max-width="1450px" persistent>
      <v-card>
        <v-card-title>
          <span>자재 추가</span>
          <v-spacer></v-spacer>
          <span> 선택된 수량 : {{ txtSelectCount }}</span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-data-table
                ref="rawGrid"
                v-model="selected_data"
                :headers="headers_product_detail_add"
                :items="product_detail_list_prop"
                fixed-header
                item-key="materialId"
                class="elevation-4"
                @item-selected="addRawItem"
                @toggle-select-all="totalAddRawItem"
                multi-sort
                show-select
                dense
              >
                <template v-slot:item.releaseCount="props">
                  <v-edit-dialog
                    :return-value.sync="props.item.releaseCount"
                    @save="props.item = saveReleaseCount(props.item)"
                  >
                    {{ props.item.releaseCount | comma }}
                    <template v-slot:input>
                      <v-text-field
                        v-model="props.item.releaseCount"
                        label="Edit"
                        single-line
                        type="number"
                        counter
                      ></v-text-field>
                    </template>
                  </v-edit-dialog>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-col class="text-right">
            <v-btn color="success" text @click="saveRawData"> 자재 추가 </v-btn>
            <v-btn color="primary" text @click="closeRawDetail"> 닫기 </v-btn>
          </v-col>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts">
import cfg from "./config";
import { gridCfg } from "@/util/config";
import _ from "lodash";
import * as api from "@/api";
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  filters: {
    comma(val: any) {
      if (val === null) {
        console.log(val);
        val = 0;
      }
      return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
})
export default class ReleaseProductItemModal extends Vue {
  txtSelectCount: number = 0;
  raw_detail_list: object[] = [];
  selected_data: object[] = [];

  @Prop({ required: true }) open: boolean = false;
  @Prop({ required: true }) product_detail_list: object[];
  @Prop({ required: true }) selected: object[];
  //@Prop({ required: true }) txtReleaseCount: number = 0;

  get headers_product_detail_add() {
    return cfg.header.headers_product_detail_add;
  }

  get product_detail_list_prop() {
    return this.product_detail_list;
  }

  get open_prop() {
    return this.open;
  }

  set open_prop(val: any) {
    this.$emit("closeModal");
  }
  openModal() {
    this.selected_data = _.cloneDeep(this.selected);
    let sum_data = _.cloneDeep(this.selected);
    this.txtSelectCount = _.sumBy(sum_data, "count");
  }

  addRawItem(item: any) {
    console.log("addRawItem", item, this.selected);

    let sumData = 0;
    this.selected_data.forEach((el: any) => {
      sumData += parseInt(el.releaseCount);
    });
    if (item.value) {
      sumData += parseInt(item.item.releaseCount);
    } else if (!item.value) {
      sumData -= parseInt(item.item.releaseCount);
    }

    console.log("sumData", sumData);

    this.txtSelectCount = sumData;
  }

  totalAddRawItem(item: any) {
    console.log("totalAddRawItem", item, this.selected_data);

    if (!item.value) {
      this.txtSelectCount = 0;
    } else {
      let sum_data = _.cloneDeep(item.items);

      console.log(_.sumBy(sum_data, "count"));

      this.txtSelectCount = _.sumBy(sum_data, "count");
    }
  }

  saveReleaseCount(item: any) {
    item.count = parseInt(item.releaseCount);
    let sumData = 0;
    this.selected_data.forEach((el: any) => {
      sumData += parseInt(el.releaseCount);
    });
    console.log("sumData", sumData);

    this.txtSelectCount = sumData;

    return item;
  }

  saveRawData() {
    console.log("saveRawData", this.selected_data, this.txtSelectCount);
    this.$emit("saveData", this.selected_data, this.txtSelectCount);

    // this.item_list_modal.forEach((el) => {
    //   console.log(el, this.select_rawID);
    //   if (el.productDetailId == this.select_rawID) {
    //     el.details = this.selected;
    //     el.count = parseInt(this.txtSelectCount);
    //   }
    // });

    this.closeRawDetail();
  }

  closeRawDetail() {
    this.selected_data = [];
    this.txtSelectCount = 0;
    this.raw_detail_list = [];

    this.open_prop = false;
  }
}
</script>
