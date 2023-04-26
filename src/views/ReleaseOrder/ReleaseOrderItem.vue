<template>
  <div>
    <v-dialog v-model="open_prop" max-width="1000px" persistent>
      <v-card>
        <v-card-title>
          <span>자재 추가</span>
          <v-spacer></v-spacer>
          <span
            >출고할 수량 : {{ txtReleaseCount }} | 선택된 수량 :
            {{ txtSelectCount }}</span
          >
        </v-card-title>
        <v-card-text>
          <v-row dense>
            <v-col>
              <v-data-table
                height="300"
                ref="rawGrid"
                v-model="selected_data"
                :headers="headers_raw_add"
                :items="raw_detail_list_prop"
                item-key="rawMaterialDetailId"
                fixed-header
                class="elevation-4"
                @item-selected="addRawItem"
                @toggle-select-all="totalAddRawItem"
                hide-default-footer
                multi-sort
                show-select
                dense
                disable-pagination
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
                        type="text"
                        maxlength="10"
                        oninput="this.value = this.value.replace(/[^0-9]/g, '').replace(/(^0+)/, '');"
                      ></v-text-field>
                    </template>
                  </v-edit-dialog>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="saveRawData"> 출고 추가 </v-btn>
          <v-btn color="error" @click="closeRawDetail"> 닫기 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts">
import * as api from "@/api";
import cfg from "./config";
import _ from "lodash";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

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
export default class ReleaseOrderItem extends Vue {
  txtSelectCount: number = 0;
  selected_data: object[] = [];
  @Prop({ required: true }) open: boolean;
  @Prop({ required: true }) selected: any;
  @Prop({ required: true }) txtReleaseCount: number;
  @Prop({ required: true }) raw_detail_list: object[];

  get headers_raw_add() {
    return cfg.header.headers_raw_add;
  }

  get raw_detail_list_prop() {
    return this.raw_detail_list;
  }

  get open_prop(): any {
    this.openModal();
    return this.open;
  }

  openModal() {
    console.log("selected", this.selected);
    //this.selected_data = _.cloneDeep(this.selected);
    // let sum_data = _.cloneDeep(this.selected);
    // this.txtSelectCount = _.sumBy(sum_data, "count");
  }

  addRawItem(item: any) {
    console.log("addRawItem", item, this.selected_data);

    let sumData = 0;
    if (this.selected_data != undefined) {
      this.selected_data.forEach((el: any) => {
        sumData += parseInt(el.releaseCount);
      });
      if (item.value) {
        sumData += parseInt(item.item.releaseCount);
      } else if (!item.value) {
        sumData -= parseInt(item.item.releaseCount);
      }
    } else {
      sumData = item.item.releaseCount;
    }

    console.log("sumData", sumData);

    this.txtSelectCount = sumData;
  }

  closeRawDetail() {
    this.txtSelectCount = 0;
    this.selected_data = [];
    this.$emit("closeModal");
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

  saveRawData() {
    console.log("saveRawData", this.$refs.rawGrid);
    let reqData = {
      releaseCode: "123123", // 코드는 곧 사라질 예정
      jobOrderId: this.selected.jobOrderId,
      jobOrderDetailId: this.selected.jobOrderDetailId,
      itemId: this.selected.itemId,
      count: this.selected.targetCount,
      details: this.selected_data.map((el: any) => {
        return { materialId: el.materialId, count: el.releaseCount };
      }),
    };

    api.rawRelease.postReleaseOrderRawRegi(reqData).then((res) => {
      console.log("postReleaseOrderRawRegi", res);
      if (res.status == 400) {
        this.$swal({
          title: res.data.message,
          icon: "error",
          position: "top",
          showCancelButton: false,
          showConfirmButton: false,
          toast: true,
          timer: 1500,
        });
      }

      this.$emit("saveItem", this.selected_data, this.txtSelectCount);

      this.closeRawDetail();

      this.selected_data = [];
      this.txtSelectCount = 0;
    });
  }

  saveReleaseCount(item: any) {
    item.releaseCount = parseInt(item.releaseCount);
    let sumData = 0;
    this.selected_data.forEach((el: any) => {
      sumData += parseInt(el.releaseCount);
    });
    console.log("sumData", sumData);

    this.txtSelectCount = sumData;

    return item;
  }
}
</script>
