<template>
  <div>
    <!-- 생성 모달 -->
    <v-dialog v-model="openModal" max-width="600px">
      <v-card>
        <v-card-title>
          <span>{{ editedType ? "품목 생성" : "품목 수정" }}</span>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-card-text>
          <v-row dense>
            <v-col cols="3" align-self="center">
              <v-text-field
                label="code"
                v-model="itemData.code"
                disabled
              ></v-text-field>
            </v-col>
            <v-col cols="3" align-self="center">
              <v-text-field
                label="버전"
                v-model="itemData.version"
              ></v-text-field>
            </v-col>
            <v-col cols="6" align-self="center">
              <v-text-field
                label="품목명"
                v-model="itemData.name"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="4" align-self="center">
              <v-text-field
                label="규격"
                v-model="itemData.standard"
              ></v-text-field>
            </v-col>
            <v-col cols="4" align-self="center">
              <v-text-field label="unit" v-model="itemData.unit"></v-text-field>
            </v-col>
            <v-col cols="4" align-self="center">
              <v-select
                :items="items_type"
                label="타입"
                v-model="itemData.type"
                item-text="name"
                item-value="name"
              ></v-select>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="6" align-self="center">
              <v-select
                :items="storageData"
                label="지정창고"
                v-model="itemData.storageId"
                item-text="name"
                item-value="id"
                @change="getLocation"
              ></v-select>
            </v-col>
            <v-col cols="6" align-self="center">
              <v-select
                :items="locationData"
                label="지정구역"
                v-model="itemData.storageLocationId"
                item-text="area"
                item-value="storageLocationId"
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-col class="text-right">
            <v-btn color="success" text @click="clickSaveInfo"> 저장 </v-btn>
            <v-btn color="primary" text @click="openModal = false">
              닫기
            </v-btn>
          </v-col>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import cfg from "./config/index";

@Component
export default class ItemModal extends Vue {
  items_type: object[] = [];
  storageID: number = 0;
  locationID: number = 0;

  @Prop({ required: true }) readonly open: boolean;
  @Prop({
    required: true,
    default: {
      id: 1,
      code: "",
      standard: "",
      type: "",
      unit: "",
      storageId: "",
      storageLocationId: "",
    },
  })
  editedData: object;
  @Prop({ required: true }) editedIndex: boolean;
  @Prop({ required: true }) storageData: object[];
  @Prop({ required: true }) locationData: object[];

  created() {
    this.items_type = cfg.data.items_type;
  }

  get openModal() {
    return this.open;
  }

  set openModal(val: any) {
    this.$emit("closeModal");
  }

  get itemData() {
    return this.editedData;
  }

  get items_storage() {
    return this.storageData;
  }

  get editedType() {
    return this.editedIndex;
  }

  alertResult(isSuccess: boolean) {
    if (isSuccess) {
      this.$swal({
        title: "수정되었습니다.",
        icon: "success",
        position: "top",
        showCancelButton: false,
        showConfirmButton: false,
        toast: true,
        timer: 1500,
      });
    } else {
      this.$swal({
        title: "등록이 실패되었습니다.",
        icon: "error",
        position: "top",
        showCancelButton: false,
        showConfirmButton: false,
        toast: true,
        timer: 1500,
      });
    }
  }

  getLocation(item: object) {
    console.log("location", item);
    //this.itemData.storageId = item.id;
    this.$emit("changeStorage", item);
  }

  clickSaveInfo() {
    let customerInfo: any = this.itemData;
    console.log("clickSaveCustomerInfo", customerInfo);

    if (customerInfo.version == null) {
      return this.$swal("경고", "버전을 입력해주세요", "error");
    }

    if (customerInfo.name == null) {
      return this.$swal("경고", "품목명을 입력해주세요", "error");
    }

    if (customerInfo.standard == null) {
      return this.$swal("경고", "규격을 입력해주세요", "error");
    }

    if (customerInfo.type == null) {
      return this.$swal("경고", "타입을 선택해주세요", "error");
    }

    if (customerInfo.storageId == null) {
      return this.$swal("경고", "창고를 선택해주세요.", "error");
    }

    if (customerInfo.storageLocationId == null) {
      return this.$swal("경고", "구역을 선택해주세요.", "error");
    }
    this.$emit("save-data", customerInfo, this.editedIndex);
  }
}
</script>

<style></style>
