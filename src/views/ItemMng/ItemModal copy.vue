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
          <v-row no-gutters>
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
          <v-row>
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
          <v-row>
            <v-col cols="6" align-self="center">
              <v-select
                :items="storageData"
                label="지정창고"
                :value="itemData.storageId"
                item-text="name"
                item-value="id"
                @change="getLocation"
              ></v-select>
            </v-col>
            <v-col cols="6" align-self="center">
              <v-select
                :items="locationData"
                label="지정구역"
                :value="itemData.storageLocationId"
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

<script>
export default {
  name: "MESFEItemModal",
  data() {
    return {
      items_type: [{ name: "원자재" }, { name: "완제품" }, { name: "반제품" }],
    };
  },
  props: {
    open: {
      type: Boolean,
      required: true,
    },
    editedData: {
      type: Object,
      required: true,
      default: () => {
        return {
          id: 1,
          code: "",
          standard: "",
          type: "",
          unit: "",
          storageId: "",
          storageLocationId: "",
        };
      },
    },
    editedIndex: {
      type: Boolean,
      required: true,
    },
    storageData: {
      type: Array,
      required: true,
    },
    locationData: {
      type: Array,
      required: true,
    },
  },

  computed: {
    openModal: {
      get() {
        return this.open;
      },
      set() {
        this.$emit("closeModal");
      },
    },
    itemData() {
      return this.editedData;
    },
    items_storage() {
      return this.storageData;
    },
    editedType() {
      return this.editedIndex;
    },
  },
  methods: {
    alertResult(isSuccess) {
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
    },
    getLocation(item) {
      console.log("location", item);
      this.$emit("changeStorage", item);
    },
    clickSaveInfo() {
      let customerInfo = this.itemData;
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
    },
  },
};
</script>

<style></style>
