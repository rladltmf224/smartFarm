<template>
  <div>
    <v-dialog v-model="open_prop" max-width="700px">
      <v-card>
        <v-card-title>
          <span> 창고 변경 </span>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-card-text>
          <v-col cols="12">
            <v-row no-gutters>
              <v-col cols="5">
                <v-text-field
                  v-model="originalData.original_storageName"
                  label="기존 창고"
                  :disabled="originalData.original_storageName != ''"
                ></v-text-field>
                <v-text-field
                  v-model="originalData.original_locationName"
                  label="기존 구역"
                  :disabled="originalData.original_locationName != ''"
                ></v-text-field>
              </v-col>
              <v-col cols="2" align-self="center">
                <v-icon large class="ml-5" color="primary">
                  mdi-swap-horizontal-bold
                </v-icon>
              </v-col>
              <v-col cols="5">
                <v-autocomplete
                  v-model="update_storageName"
                  return-object
                  item-text="storageName"
                  item-value="storageId"
                  :items="totalStorage_list_prop"
                  label="변경 할 창고"
                  @change="getLocation"
                ></v-autocomplete>
                <v-autocomplete
                  v-model="update_locationeName"
                  return-object
                  item-text="area"
                  item-value="storageLocationId"
                  :items="totalLocation_list"
                  label="변경 할 구역"
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-col>
        </v-card-text>
        <v-card-actions>
          <v-col class="text-right">
            <v-btn color="success" text @click="clickSaveStorage"> 변경 </v-btn>
            <v-btn color="primary" text @click="close_modal"> 닫기 </v-btn>
          </v-col>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts">
import * as api from "@/api";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class ProductStockStorage extends Vue {
  changeStorageId: number | null = null;
  original_storageName: string = "";
  original_locationName: string = "";
  update_storageName: any = "";
  update_locationeName: any = "";
  original_storageId: number | "" = "";
  totalLocation_list: [] = [];
  totalStorage: [] = [];
  @Prop({ required: true }) open: boolean = false;
  @Prop({ required: true }) originalData: {
    original_storageName: string;
    original_locationName: string;
    original_storageId: number | "";
  };
  @Prop({ required: true }) totalStorage_list: object[] = [];

  get totalStorage_list_prop() {
    return this.totalStorage_list;
  }

  get open_prop() {
    return this.open;
  }

  set open_prop(val: any) {
    this.close_modal();
  }

  close_modal() {
    this.update_storageName = "";
    this.update_locationeName = "";
    this.$emit("closeModal");
  }

  getLocation() {
    this.totalStorage = [];

    let storageId = {
      storageId: this.update_storageName.storageId,
    };
    api.stock
      .getStockTakingLocationList(storageId)
      .then((response) => {
        this.totalLocation_list = response.data.responseData;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  clickSaveStorage() {
    if (this.update_storageName != "") {
      //   let item = {
      //     productDetailId: this.originalData.original_storageId,
      //     storageId: this.update_storageName.storageId,
      //     storageLocationId: this.update_locationeName.storageLocationId,
      //   };
      let item = {
        productDetailId: this.originalData.original_storageId,
        changeStorageName: this.update_storageName.storageName,
        changeStorageLocation: this.update_locationeName.area,
      };
      api.stock
        .updateProductWarehousing(item)
        .then((response) => {
          this.$swal({
            title: "변경되었습니다.",
            icon: "success",
            position: "top",
            showCancelButton: false,
            showConfirmButton: false,
            toast: true,
            timer: 1500,
          });
          this.close_modal();
        })
        .catch((error) => {
          this.$swal({
            title: "변경에 실패되었습니다.",
            icon: "error",
            position: "top",
            showCancelButton: false,
            showConfirmButton: false,
            toast: true,
            timer: 1500,
          });
        });
    } else {
      this.$swal({
        title: "변경할 창고를 선택해주세요.",
        icon: "warning",
        position: "top",
        showCancelButton: false,
        showConfirmButton: false,
        toast: true,
        timer: 1500,
      });
    }
  }
}
</script>
