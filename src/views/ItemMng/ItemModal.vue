<template>
  <div>
    <!-- 생성 모달 -->
    <v-dialog persistent v-model="openModal" max-width="800px">
      <v-card class="card-shadow box-radius">
        <v-card-title>
          <span>{{ editedType ? "품목 생성" : "품목 수정" }}</span>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-card-text>
          <v-row dense>
            <v-col cols="2" align-self="center" v-if="!editedType">
              <span>code</span>
              <v-text-field v-model="itemData.code" disabled solo hide-details="false"
                class="text-box-style"></v-text-field>
            </v-col>

            <v-col cols="3" align-self="center">

              <span>품목명</span>
              <v-text-field v-model="itemData.name" solo hide-details="false" class="text-box-style"></v-text-field>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="3" align-self="center">
              <span>규격</span>
              <v-text-field v-model="itemData.standard" solo hide-details="false" class="text-box-style"></v-text-field>
            </v-col>
            <v-col cols="3" align-self="center">
              <span>unit</span>
              <v-text-field v-model="itemData.unit" solo hide-details="false" class="text-box-style"></v-text-field>
            </v-col>
            <v-col cols="2" align-self="center">
              <span>타입</span>
              <v-select :items="items_type" v-model="itemData.type" item-text="name" item-value="name" solo
                hide-details="false" class="text-box-style"></v-select>
            </v-col>
            <v-col v-if="itemData.type == '완제품'" cols="2" align-self="center">
              <span>완제품 타입</span>
              <v-select :items="product_type" v-model="itemData.productionType" item-text="name" item-value="name" solo
                hide-details="false" class="text-box-style"></v-select>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="6" align-self="center">
              <span>지정창고</span>
              <v-select :items="storageData" v-model="itemData.storageId" item-text="name" item-value="id"
                @change="getLocation" solo hide-details="false" class="text-box-style"></v-select>
            </v-col>
            <v-col cols="6" align-self="center">
              <span>지정구역</span>
              <v-select :items="locationData" v-model="itemData.storageLocationId" item-text="area"
                item-value="storageLocationId" solo hide-details="false" class="text-box-style"></v-select>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="clickSaveInfo" elevation="0">
            저장
          </v-btn>
          <v-btn color="error" @click="openModal = false" elevation="0">
            닫기
          </v-btn>
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
  product_type: object[] = [];
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
      productionType: "",
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
    this.product_type = cfg.data.product_type_list;
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
    console.log('기존 데이터 ', this.itemData)
    console.log("후처리한 데이터", customerInfo);

    if (customerInfo.name == null) {
      return this.$swal("경고", "품목명을 입력해주세요", "error");
    }

    if (customerInfo.standard == null) {
      return this.$swal("경고", "규격을 입력해주세요", "error");
    }

    if (customerInfo.type == "") {
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

  checkDup() { //품목명 중복체크


  }


}
</script>
