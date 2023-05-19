<template>
  <div>
    <v-dialog v-model="openModal" max-width="800px">
      <v-card>
        <v-card-title>
          <span>{{ editedType ? "거래처 생성" : "거래처 수정" }}</span>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-card-text>
          <v-row dense>
            <v-col cols="2" align-self="center" v-if="!editedIndex">
              <span>code</span>
              <v-text-field label="code" v-model.trim="customerData.code" disabled dense solo hide-details="false"
                class="text-box-style"></v-text-field>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col align-self="center">
              <span>거래처명</span>
              <v-text-field label="거래처명" v-model.trim="customerData.name" dense solo hide-details="false"
                class="text-box-style"></v-text-field>
            </v-col>
            <v-col align-self="center">
              <span>대표자명</span>
              <v-text-field label="대표자명" v-model.trim="customerData.ownerName" dense solo hide-details="false"
                class="text-box-style"></v-text-field>
            </v-col>

            <v-col align-self="center">
              <span>연락처</span>
              <v-text-field label="연락처" dense :value="customerData.contactPoint | PhoneMask"
                @input="(value) => (customerData.contactPoint = value)" solo hide-details="false"
                class="text-box-style"></v-text-field>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col align-self="center">
              <span>거래처 유형</span>
              <v-select v-model="customerData.type" :items="customer_type" label="거래처 유형" item-text="name"
                item-value="name" dense solo hide-details="false" class="text-box-style"></v-select>
            </v-col>
            <v-col align-self="center">
              <span>사업자등록번호</span>
              <v-text-field label="사업자등록번호" :value="customerData.businessRegisterNumber | bizNumMask" @input="(value) => (customerData.businessRegisterNumber = value)
                " dense solo hide-details="false" class="text-box-style"></v-text-field>
            </v-col>
            <v-col align-self="center">
              <span>담당자</span>
              <v-text-field label="담당자" v-model.trim="customerData.manager" dense solo hide-details="false"
                class="text-box-style"></v-text-field>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="2" align-self="center">
              <span>업태</span>
              <v-text-field label="업태" v-model="customerData.businessCondition" dense solo hide-details="false"
                class="text-box-style"></v-text-field>
            </v-col>
            <v-col cols="2" align-self="center">
              <span>업종</span>
              <v-text-field label="업종" v-model="customerData.businessCategory" dense solo hide-details="false"
                class="text-box-style"></v-text-field>
            </v-col>
          </v-row>

          <v-row dense>
            <v-col cols="8" align-self="center">
              <span>주소</span>
              <v-text-field label="주소" v-model="customerData.address" dense solo hide-details="false"
                class="text-box-style"></v-text-field>
            </v-col>
          </v-row>

          <v-row dense>
            <v-col cols="8" align-self="center">
              <span>영문주소</span>
              <v-text-field label="영문주소" v-model="customerData.englishAddress" dense solo hide-details="false"
                class="text-box-style"></v-text-field>
            </v-col>
          </v-row>

          <v-row dense>
            <v-col cols="4" align-self="center">
              <span>거래처 이메일</span>
              <v-text-field label="거래처 이메일" v-model.trim="customerData.emailAddress" dense solo hide-details="false"
                class="text-box-style"></v-text-field>
            </v-col>
            <v-col cols="4" align-self="center">
              <span>거래처 팩스번호</span>
              <v-text-field label="거래처 팩스번호" :value="customerData.faxNumber | PhoneMask"
                @input="(value) => (customerData.faxNumber = value)" dense solo hide-details="false"
                class="text-box-style"></v-text-field>
            </v-col>
            <v-col cols="4" align-self="center">
              <span>거래처 전화번호</span>
              <v-text-field label="거래처 전화번호" :value="customerData.telephone | PhoneMask"
                @input="(value) => (customerData.telephone = value)" dense solo hide-details="false"
                class="text-box-style"></v-text-field>
            </v-col>
          </v-row>

          <v-row dense>
            <v-col align-self="center">
              <span>비고</span>
              <v-text-field label="비고" v-model="customerData.memo" dense solo hide-details="false"
                class="text-box-style"></v-text-field>
            </v-col>
          </v-row>

          <v-row dense>
            <v-col cols="2">
              <span>사용여부</span>
              <v-select :items="search_list4" v-model="customerData.isValid" label="사용여부" item-text="name"
                item-value="name" dense solo hide-details="false" class="text-box-style"></v-select>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" @click="clickSaveCustomerInfo"> 저장 </v-btn>
          <v-btn color="error" @click="openModal = false"> 닫기 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts">
import util from "@/util";
import "@/util/filters";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class CustomerModal extends Vue {
  customer_type: object[] = [
    { name: "매입거래처", value: "매입거래처" },
    { name: "매출거래처", value: "매출거래처" },
    { name: "병합거래처", value: "병합거래처" },
    { name: "기타거래처", value: "기타거래처" },
  ];
  search_list4: object[] = [
    { name: "사용", value: "사용" },
    { name: "미사용", value: "미사용" },
  ];

  @Prop({ required: true }) readonly open: boolean;
  @Prop({
    required: true,
    default: {
      id: "",
      name: "", //거래처 이름
      manager: "", //담당자
      contactPoint: "", //담당자 연락처
      type: "", //거래처 유형 (매입거래처, 매출거래처, 병합거래처, 기타거래처)
      businessRegisterNumber: "", //사업자 등록번호
      ownerName: "", //대표자명
      businessCondition: "", //업태
      businessCategory: "", //업종
      address: "", //주소
      englishAddress: "", //영문 주소
      emailAddress: "", //이메일
      telephone: "", //거래처 전화번호
      faxNumber: "", //팩스 번호
      isValid: "", //사용 여부
      memo: "", //비고
    },
  })
  editedCustomerData: object;

  @Prop({ required: true }) editedIndex: boolean;

  get openModal() {
    return this.open;
  }

  set openModal(val: any) {
    this.$emit("closeModal");
  }

  get customerData() {
    return this.editedCustomerData;
  }

  get editedType() {
    return this.editedIndex;
  }

  clickSaveCustomerInfo() {
    let customerInfo: any = this.customerData;
    customerInfo.contactPoint = util.replaceOnlyNum(customerInfo.contactPoint);
    customerInfo.businessRegisterNumber = util.replaceOnlyNum(
      customerInfo.businessRegisterNumber
    );
    customerInfo.faxNumber = util.replaceOnlyNum(customerInfo.faxNumber);
    customerInfo.telephone = util.replaceOnlyNum(customerInfo.telephone);

    console.log("clickSaveCustomerInfo", customerInfo);
    this.$emit("save-customer", customerInfo, this.editedType);
  }
}
</script>
