<template>
  <div>
    <v-dialog v-model="open" width="700px" persistent>
      <v-card>
        <v-card-title>반품 요청</v-card-title>
        <v-card-text>
          <span>반품 사유</span>
          <v-text-field
            hide-details="false"
            dense
            solo
            class="text-box-style"
            v-model="comment"
          >
          </v-text-field>
          <v-spacer></v-spacer>
          <v-data-table
            class="mt-5"
            :headers="detail_header"
            :items="detail"
            v-model="removeItem"
            hide-default-footer
            disable-pagination
            show-select
            no-data-text="데이터가 없습니다."
          >
            <template v-slot:item.failCount="props">
              <v-text-field
                class="pa-0 countFont"
                oninput="javascript: this.value = this.value.replace(/[^0-9]/g, '');"
                placeholder="* 수량 필수"
                v-model="props.item.failCount"
                single-line
              >
                {{ props.item.failCount }}
              </v-text-field>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" @click="remove"> 반품 </v-btn>
          <v-btn color="error" @click="closeModal"> 닫기 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts">
import * as api from "@/api/index.js";
import cfg from "./config";
import jwt_decode from "jwt-decode";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

@Component
export default class WarehousingDeleteModal extends Vue {
  @Prop({ required: true }) open: boolean = false;
  @Prop({ required: true }) delete_item: object[];

  removeItem: any[] = [];
  deleteItem: any[] = [];
  selectedItem: any[];
  deleteItem_list: any[] = [];
  detail: any[] = [];
  comment: string = "";

  get detail_header() {
    return cfg.header.detail_header;
  }

  created() {}

  @Watch("delete_item")
  checkItem() {
    this.detail = [];

    this.selectedItem = this.delete_item;
    console.log(this.selectedItem);
    if (this.selectedItem.length != 0) {
      api.rawWarehousing
        .getWarehousingDetailList({ id: this.selectedItem[0].id })
        .then((response) => {
          response.data.responseData.forEach((value: any) => {
            this.detail.push({
              itemName: value.itemName,
              id: value.id,
              normalCount: value.normalCount,
              orderCount: value.orderCount,
            });
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
  remove() {
    let jwt: any = jwt_decode(this.$cookies.get("accessToken"));
    let temp = [];

    if (this.removeItem.length == 0) {
      return this.$swal({
        title: "반품품목이 선택되지 않았습니다.",
        icon: "error",
        position: "top",
        showCancelButton: false,
        showConfirmButton: false,
        toast: true,
        timer: 1500,
      });
    } else {
      for (var i = 0; i < this.removeItem.length; i++) {
        if (isNaN(this.removeItem[i].failCount)) {
          this.$swal({
            title: "반품수량을 입력하지않았습니다.",
            icon: "error",
            position: "top",
            showCancelButton: false,
            showConfirmButton: false,
            toast: true,
            timer: 1500,
          });
        } else {
          temp.push({
            materialId: this.removeItem[i].id,
            failCount: Number(this.removeItem[i].failCount),
          });
        }
      }

      let data = {
        warehousingId: this.selectedItem[0].id,
        userId: jwt.username,
        comment: this.comment,
        detail: temp,
      };

      console.log("삭제할 item", data);
      this.$swal
        .fire({
          title: "반품 요청",
          text: "반품 하시겠습니까?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
        })
        .then((result) => {
          if (result.isConfirmed) {
            api.rawWarehousing
              .deleteWarehousingList(data)
              .then((response) => {
                console.log("deleteWarehousingList", response);
                this.$swal({
                  title: "반품되었습니다.",
                  icon: "success",
                  position: "top",
                  showCancelButton: false,
                  showConfirmButton: false,
                  toast: true,
                  timer: 1500,
                });
                this.closeModal();
              })
              .catch((error) => {
                console.log(error);
                this.$swal({
                  title: "반품 실패되었습니다.",
                  icon: "error",
                  position: "top",
                  showCancelButton: false,
                  showConfirmButton: false,
                  toast: true,
                  timer: 1500,
                });
              });
          }
        });
    }
  }

  closeModal() {
    this.$emit("closeModal");
  }
}
</script>
