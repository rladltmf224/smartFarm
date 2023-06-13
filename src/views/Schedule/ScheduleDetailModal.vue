<template>
  <!-- 일정 상세보기 -->
  <v-menu
    :position-x="x"
    :position-y="y"
    absolute
    v-model="detailMenu"
    :close-on-content-click="false"
  >
    <v-card class="menuBox">
      <v-list class="pa-0">
        <v-list-item>
          <v-list-item-content>
            <v-row class="pt-0">
              <v-col cols="9" class="pt-0">
                <v-list-item-title
                  ><strong>{{
                    this.detailEvent == "" ? "없음" : title
                  }}</strong>
                </v-list-item-title>
              </v-col>
            </v-row>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <!--<v-divider></v-divider>-->
      <v-list class="pa-0">
        <v-list-item class="pt-0 pb-0">
          <v-list-item-content>
            <v-list-item-subtitle>
              <v-row class="mb-1">
                <v-col cols="6">
                  <span><strong>시작일 : </strong></span>
                  <span v-show="!update">{{
                    this.detailEvent == "" || this.detailEvent[0].start == ""
                      ? "시작일없음"
                      : `${this.detailEvent[0].start}`
                  }}</span>
                  <span v-show="update">
                    <v-menu
                      dense
                      :key="updateStartDate"
                      ref="updateDate"
                      :close-on-content-click="false"
                      :return-value.sync="updateStartDate"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          dense
                          v-model="updateStartDate"
                          prepend-icon="mdi-calendar"
                          readonly
                          label="시작일"
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="updateStartDate"
                        no-title
                        scrollable
                        locale="ko-KR"
                      >
                        <v-spacer></v-spacer>
                        <v-btn
                          text
                          color="primary"
                          @click="updateStartDate = ''"
                        >
                          취소
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </span>
                </v-col>
                <v-col cols="6">
                  <span><strong>종료일 : </strong></span>
                  <span v-show="!update">{{
                    this.detailEvent == "" || this.detailEvent[0].end == ""
                      ? "종료일없음"
                      : `${this.detailEvent[0].end}`
                  }}</span>
                  <span v-show="update">
                    <v-menu
                      dense
                      :key="updateEndDate"
                      ref="updateEndDate"
                      :close-on-content-click="false"
                      :return-value.sync="updateEndDate"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          dense
                          v-model="updateEndDate"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="updateEndDate"
                        no-title
                        scrollable
                        locale="ko-KR"
                      >
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="updateEndDate = ''">
                          취소
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </span>
                </v-col>
              </v-row>
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              <v-row class="mb-1">
                <v-col cols="6"
                  ><span><strong>작물 : </strong></span>
                  <span class="innerTextBox">{{
                    this.detailEvent == "" || this.detailEvent[0].cropName == ""
                      ? "작물없음"
                      : `${this.detailEvent[0].cropName}`
                  }}</span></v-col
                >
                <v-col cols="6">
                  <span><strong>품종 : </strong></span>
                  <span class="innerTextBox">{{
                    this.detailEvent == "" ||
                    this.detailEvent[0].varietyName == ""
                      ? "품종없음"
                      : `${this.detailEvent[0].varietyName}`
                  }}</span>
                </v-col>
              </v-row>
            </v-list-item-subtitle>
            <v-list-item-subtitle class="outBox">
              <v-row class="mb-1">
                <v-col cols="6">
                  <span><strong>등록자 : </strong></span>

                  <span class="innerTextBox">
                    {{
                      this.detailEvent == "" ||
                      this.detailEvent[0].createdId == ""
                        ? "등록자없음"
                        : `${detailEvent[0].createdId} : ${detailEvent[0].createdDate}`
                    }}
                  </span>

                  <v-spacer></v-spacer>
                </v-col>
                <v-col cols="6">
                  <span><strong>수정자 : </strong></span>

                  <span class="innerTextBox">
                    {{
                      this.detailEvent == "" ||
                      this.detailEvent[0].modifiedId == ""
                        ? "수정자없음"
                        : `${detailEvent[0].modifiedId} : ${detailEvent[0].modifiedDate}`
                    }}
                  </span>

                  <v-spacer></v-spacer>
                </v-col>
              </v-row>
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              <v-row class="mb-1">
                <v-col cols="12">
                  <span><strong>메모 : </strong></span>
                  <span v-show="!update" class="innerTextBox">{{
                    this.detailEvent == "" || this.detailEvent[0].memo == ""
                      ? "메모없음"
                      : detailEvent[0].memo
                  }}</span>
                  <v-text-field v-show="update" v-model="updateMemo">
                  </v-text-field>
                </v-col>
              </v-row>
            </v-list-item-subtitle>
            <v-list-item-subtitle class="outBox">
              <v-row class="mb-1">
                <v-col cols="12">
                  <span><strong>색상표 : </strong></span>
                  <span class="innerTextBox">{{
                    this.detailEvent == "" ||
                    this.detailEvent[0].backgroundColor == ""
                      ? "색상표 없음"
                      : detailEvent[0].backgroundColor
                  }}</span>
                  <div
                    class="innerBox"
                    :style="swatchdetailStyle"
                  ></div> </v-col
              ></v-row>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-card-actions class="pa-0">
        <v-row justify="center" class="ma-0"
          ><v-btn v-show="!update" text @click="updateStatus" class="ma-1">
            <v-icon color="success" right class="mr-1"> mdi-pencil </v-icon>
            수정
          </v-btn>
          <v-btn v-show="update" text @click="updateInfo" class="ma-1">
            <v-icon color="success" right class="mr-1">
              mdi-content-save-edit
            </v-icon>
            저장
          </v-btn>
          <v-divider
            vertical
            class="ma-1"
            v-if="title.includes('납품')"
          ></v-divider>
          <v-btn
            text
            class="ma-1"
            v-if="title.includes('납품') && detailEvent[0].isDone != 'Y'"
            @click="deliveryDone(detailEvent[0].workScheduleDetailId)"
          >
            <v-icon color="success" right class="mr-1">
              mdi-content-save-edit
            </v-icon>
            납기완료
          </v-btn>

          <v-btn
            text
            class="ma-1"
            v-if="title.includes('납품') && detailEvent[0].isDone == 'Y'"
            @click="deliveryCancel(detailEvent[0].workScheduleDetailId)"
          >
            <v-icon color="success" right class="mr-1">
              mdi mdi-content-save-off-outline
            </v-icon>
            납기취소
          </v-btn>

          <v-divider vertical class="ma-1"></v-divider>
          <v-btn text class="ma-1" @click="deleteInfo">
            <v-icon right dark class="mr-1"> mdi-delete </v-icon>삭제
          </v-btn>
        </v-row>
      </v-card-actions>
      <v-divider class="t-3"></v-divider>

      <v-card class="ma-2" elevation="0">
        <v-list v-show="historyTable.length == 0" class="text-center"
          >댓글이 존재하지않습니다.</v-list
        >
        <v-list v-show="historyTable.length != 0">
          <v-list-item
            class="historyRow mt-3"
            v-for="(item, index) in historyTable"
            :key="index"
          >
            <v-list-item-content class="pa-0">
              <v-list-item-subtitle>
                <v-row>
                  <v-col cols="2"
                    ><span>{{ item.createdId }}</span></v-col
                  >
                  <v-col cols="3"
                    ><span class="historyDate">{{
                      item.createdDate
                    }}</span></v-col
                  >
                  <v-col cols="4">
                    <v-btn
                      small
                      @click="addRecomment(item)"
                      color="success"
                      class="mr-1"
                      >답변</v-btn
                    >
                    <v-btn
                      small
                      text
                      color="success"
                      v-show="!item.updateCommentStatus"
                      @click="item.updateCommentStatus = true"
                      class="mr-1"
                      >수정</v-btn
                    >
                    <v-btn
                      small
                      text
                      color="success"
                      v-show="item.updateCommentStatus"
                      @click="updateComment(item)"
                      class="mr-1"
                      >저장</v-btn
                    >
                    <v-btn small text @click="deleteComment(item)">삭제</v-btn>
                  </v-col>
                </v-row>

                <span>
                  <v-text-field
                    solo
                    class="pa-0"
                    hide-details
                    v-model="item.workScheduleComment"
                    :readonly="!item.updateCommentStatus"
                  >
                  </v-text-field>
                  <v-card class="ml-2 mt-2 d-flex" elevation="0">
                    <v-list class="pa-0" style="width: 100%">
                      <v-list-item
                        style="background-color: #f6f8f9"
                        class="mb-1"
                        v-for="(data, index) in item.details"
                        :key="index"
                      >
                        <v-list-item-content class="pa-2">
                          <v-list-item-subtitle>
                            <v-row>
                              <v-col cols="3">{{ data.createdId }}</v-col>
                              <v-col cols="4" class="historyDate">{{
                                data.createdDate
                              }}</v-col>
                              <v-col cols="5">
                                <v-btn
                                  x-small
                                  text
                                  color="success"
                                  v-show="!data.updateReCommentStatus"
                                  @click="data.updateReCommentStatus = true"
                                  >수정</v-btn
                                >
                                <v-btn
                                  x-small
                                  text
                                  color="success"
                                  v-show="data.updateReCommentStatus"
                                  @click="updateComment(data)"
                                  >저장</v-btn
                                >
                                <v-btn
                                  x-small
                                  text
                                  @click="
                                    deleteReComment(
                                      data.workScheduleCommentDetailId
                                    )
                                  "
                                  >삭제</v-btn
                                >
                              </v-col>
                            </v-row>
                            <v-text-field
                              class="pt-0 text-caption"
                              hide-details
                              :readonly="!data.updateReCommentStatus"
                              v-model="data.workScheduleCommentSon"
                            >
                            </v-text-field>
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                      <v-row
                        class="messageBox pa-2 mt-2"
                        v-show="
                          openHistory &&
                          historyDetailId == item.workScheduleCommentId
                        "
                      >
                        <v-col cols="9" class="pa-0 text-body-1"
                          ><v-textarea
                            class="ml-2 mt-2"
                            v-model="historyReMessage"
                            auto-grow
                            rows="2"
                            row-height="15"
                          ></v-textarea
                        ></v-col>
                        <v-col
                          cols="3"
                          class="d-flex flex-column justify-center"
                          ><v-btn
                            color="success"
                            x-small
                            @click="saveHistoryDetailInfo"
                            >답글달기</v-btn
                          >
                          <v-btn
                            class="mt-1"
                            color="success"
                            @click="openHistory = false"
                            x-small
                            >닫기</v-btn
                          ></v-col
                        >
                      </v-row>
                    </v-list>
                  </v-card>
                </span>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
      <v-row class="ma-2 messageBox pa-2">
        <v-col cols="9" class="pa-0">
          <v-textarea
            solo
            hide-details
            v-model="historyMessage"
            auto-grow
            rows="3"
            row-height="15"
          ></v-textarea
        ></v-col>
        <v-col cols="2" class="pa-0"
          ><v-btn
            color="success"
            class="mx-2 py-6"
            small
            @click="saveHistoryInfo"
            >댓글달기</v-btn
          ></v-col
        >
        >
      </v-row>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import * as api from "@/api/index.js";
//import cfg from "./config";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
//import _ from "lodash";

@Component
export default class ScheduleDetailModal extends Vue {
  @Prop({ required: true }) x: number = 0;
  @Prop({ required: true }) y: number = 0;
  @Prop({ required: true }) title: string = "";
  @Prop({ required: true }) backgroundColor: string = "";
  @Prop({ required: true }) open: boolean = false;
  @Prop({ required: true }) historyOn: boolean = false;
  @Prop({ required: true }) detail: any[];
  @Prop({ required: true }) id: number = 0;

  $refs!: {
    updateStartDate: HTMLFormElement;
    updateEndDate: HTMLFormElement;
  };

  updateStartDate: string = ""; //[수정] 달력 v-model
  updateEndDate: string = ""; //[수정] 달력 v-model
  updateMemo: string = ""; //[수정] 메모 v-model
  update: boolean = false; //dialog 저장 or 수정
  detailEvent: any[] = []; //상세보기 일정

  colorMenu: boolean = false; //[수정]컬러판 v-model

  historyTable: any[] = [];
  historyDetailId: number = 0;
  historyMessage: string = "";
  historyReMessage: string = "";
  openHistory: boolean = false;

  get historyId() {
    return this.id;
  }

  get detailMenu() {
    this.update = false;

    this.openHistory = this.historyOn;
    this.detailEvent = this.detail;
    return this.open;
  }
  set detailMenu(val: any) {
    this.$emit("closeModal", false);
  }

  updateS_date_search(v: any) {
    this.updateStartDate = v;
    let updateStartEL: any = this.$refs.updateStartDate;
    updateStartEL.save(v);
  }
  updateE_date_search(v: any) {
    this.updateEndDate = v;
    let updateEndEL: any = this.$refs.updateEndDate;
    updateEndEL.save(v);
  }

  get swatchdetailStyle() {
    const { colorMenu } = this;
    return {
      backgroundColor: this.backgroundColor,
      cursor: "pointer",
      height: "20px",
      width: "70px",
      borderRadius: colorMenu ? "50%" : "4px",
      transition: "border-radius 200ms ease-in-out",
    };
  }

  @Watch("detailEvent")
  getComment() {
    this.getTotalComment();
  }

  updateStatus() {
    this.update = true;
  }

  updateInfo() {
    let updateSchedule: any = {};

    if (this.updateStartDate == "" && this.updateEndDate == "") {
      return this.$swal({
        title: "일정이 등록 되지않았습니다.",
        icon: "error",
        position: "top",
        showCancelButton: false,
        showConfirmButton: false,
        toast: true,
        timer: 1500,
      });
    } else {
      this.detailEvent.forEach((value: any) => {
        updateSchedule["workScheduleDetailId"] = value.workScheduleDetailId;
        updateSchedule["start"] = this.updateStartDate;
        updateSchedule["end"] = this.updateEndDate;
        updateSchedule["memo"] = this.updateMemo;
      });

      console.group("updateInfo");
      console.log("updateInfo", updateSchedule);
      console.groupEnd();

      api.schedule
        .updateScheduleInfo(updateSchedule)
        .then((response) => {
          if (response.status == 200) {
            this.$swal({
              title: "일정이 수정되었습니다.",
              icon: "success",
              position: "top",
              showCancelButton: false,
              showConfirmButton: false,
              toast: true,
              timer: 1500,
            });
          } else {
            this.$swal({
              title: "수정이 실패되었습니다.",
              icon: "error",
              position: "top",
              showCancelButton: false,
              showConfirmButton: false,
              toast: true,
              timer: 1500,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          //일정 데이터 불러오기
          this.$emit("closeModal");
          this.$emit("getFilter");
          this.$emit("getEvent");
        });
    }
  }

  deliveryDone(item: any) {
    let data = {
      workScheduleDetailId: item,
      isDone: "Y",
    };

    this.$swal
      .fire({
        title: "납기완료",
        text: "납기완료 하시겠습니까?",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "수정",
      })
      .then((result) => {
        if (result.isConfirmed) {
          api.schedule
            .updateScheduleState(data)
            .then((response: any) => {
              this.$swal({
                title: "납기완료 되었습니다.",
                icon: "success",
                position: "top",
                showCancelButton: false,
                showConfirmButton: false,
                toast: true,
                timer: 1500,
              });
            })
            .catch((error: any) => {
              this.$swal({
                title: "납기완료가 실패되었습니다.",
                icon: "error",
                position: "top",
                showCancelButton: false,
                showConfirmButton: false,
                toast: true,
                timer: 1500,
              });
            })

            .finally(() => {
              //일정 데이터 불러오기
              this.$emit("closeModal");
              this.$emit("getFilter");
              this.$emit("getEvent");
            });
        }
      });
  }

  deliveryCancel(item: any) {
    let data = {
      workScheduleDetailId: item,
      isDone: "N",
    };

    this.$swal
      .fire({
        title: "납기취소",
        text: "납기취소 하시겠습니까?",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "수정",
      })
      .then((result) => {
        if (result.isConfirmed) {
          api.schedule
            .updateScheduleState(data)
            .then((response: any) => {
              this.$swal({
                title: "납기취소 되었습니다.",
                icon: "success",
                position: "top",
                showCancelButton: false,
                showConfirmButton: false,
                toast: true,
                timer: 1500,
              });
            })
            .catch((error: any) => {
              this.$swal({
                title: "납기취소가 실패되었습니다.",
                icon: "error",
                position: "top",
                showCancelButton: false,
                showConfirmButton: false,
                toast: true,
                timer: 1500,
              });
            })
            .finally(() => {
              //일정 데이터 불러오기

              this.$emit("closeModal");
              this.$emit("getFilter");
              this.$emit("getEvent");
            });
        }
      });
  }
  deleteInfo() {
    let deleteItem = 0;
    if (this.detailEvent.length == 0) {
      return this.$swal({
        title: "삭제가 실패되었습니다.",
        icon: "error",
        position: "top",
        showCancelButton: false,
        showConfirmButton: false,
        toast: true,
        timer: 1500,
      });
    } else {
      deleteItem = this.detailEvent[0].workScheduleDetailId;

      this.$swal
        .fire({
          title: "삭제",
          text: "해당 기간 전체를 삭제하시겠습니까?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "삭제",
        })
        .then((result) => {
          if (result.isConfirmed) {
            api.schedule
              .deleteScheduleInfo(deleteItem)
              .then((response) => {
                if (response.status == 200) {
                  this.$swal({
                    title: "삭제되었습니다.",
                    icon: "success",
                    position: "top",
                    showCancelButton: false,
                    showConfirmButton: false,
                    toast: true,
                    timer: 1500,
                  });
                } else {
                  this.$swal({
                    title: "삭제가 실패되었습니다.",
                    icon: "error",
                    position: "top",
                    showCancelButton: false,
                    showConfirmButton: false,
                    toast: true,
                    timer: 1500,
                  });
                }
              })
              .catch((error) => {
                console.log(error);
              })
              .finally(() => {
                //일정 데이터 불러오기
                this.$emit("closeModal");
                this.$emit("getFilter");
                this.$emit("getEvent");
              });
          }
        });
    }
  }
  addRecomment(item: any) {
    this.historyReMessage = "";
    this.historyDetailId = item.workScheduleCommentId;
    this.openHistory = true;
  }

  updateComment(item: any) {
    let updateItem = {};
    if (item.updateCommentStatus) {
      updateItem = {
        workScheduleDetailId: this.historyId,
        workScheduleCommentId: item.workScheduleCommentId,
        type: "comment",
        comment: item.workScheduleComment,
      };
    } else {
      updateItem = {
        workScheduleDetailId: this.historyId,
        workScheduleCommentDetailId: item.workScheduleCommentDetailId,
        type: "son",
        comment: item.workScheduleCommentSon,
      };
    }

    api.schedule
      .saveCommentInfo(updateItem)
      .then((response) => {
        if (response.status == 200) {
          this.$swal({
            title: "댓글이 수정되었습니다.",
            icon: "success",
            position: "top",
            showCancelButton: false,
            showConfirmButton: false,
            toast: true,
            timer: 1500,
          });
        } else {
          this.$swal({
            title: "수정에 실패되었습니다.",
            icon: "error",
            position: "top",
            showCancelButton: false,
            showConfirmButton: false,
            toast: true,
            timer: 1500,
          });
        }

        this.getTotalComment();
        this.openHistory = false;
      })
      .catch((error) => {
        console.log(error);
      });
  }
  deleteComment(item: any) {
    if (item.details.length != 0) {
      return this.$swal({
        title: "하위댓글이 존재시에는 삭제가 불가능합니다.",
        icon: "error",
        position: "top",
        showCancelButton: false,
        showConfirmButton: false,
        toast: true,
        timer: 1500,
      });
    } else {
      let deleteItem = {
        workScheduleCommentId: item.workScheduleCommentId,
      };

      api.schedule
        .deleteCommentInfo(deleteItem)
        .then((response) => {
          if (response.status == 200) {
            this.$swal({
              title: "댓글이 삭제되었습니다.",
              icon: "success",
              position: "top",
              showCancelButton: false,
              showConfirmButton: false,
              toast: true,
              timer: 1500,
            });
          } else {
            this.$swal({
              title: "삭제가 실패되었습니다.",
              icon: "error",
              position: "top",
              showCancelButton: false,
              showConfirmButton: false,
              toast: true,
              timer: 1500,
            });
          }

          this.getTotalComment();
          this.openHistory = false;
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
  deleteReComment(data: any) {
    let deleteItem = {
      workScheduleCommentDetailId: data,
    };

    api.schedule
      .deleteCommentInfo(deleteItem)
      .then((response) => {
        if (response.status == 200) {
          this.$swal({
            title: "댓글이 삭제되었습니다.",
            icon: "success",
            position: "top",
            showCancelButton: false,
            showConfirmButton: false,
            toast: true,
            timer: 1500,
          });
        } else {
          this.$swal({
            title: "삭제가 실패되었습니다.",
            icon: "error",
            position: "top",
            showCancelButton: false,
            showConfirmButton: false,
            toast: true,
            timer: 1500,
          });
        }

        this.getTotalComment();
        this.openHistory = false;
      })
      .catch((error) => {
        console.log(error);
      });
  }
  saveHistoryDetailInfo() {
    let saveItem = {
      workScheduleDetailId: this.historyId,
      workScheduleCommentId: this.historyDetailId,
      type: "son",
      comment: this.historyReMessage,
    };

    api.schedule
      .saveCommentInfo(saveItem)
      .then((response) => {
        if (response.status == 200) {
          this.$swal({
            title: "댓글이 등록되었습니다.",
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

        this.getTotalComment();
        this.openHistory = false;
      })
      .catch((error) => {
        console.log(error);
      });
  }
  saveHistoryInfo() {
    if (this.historyMessage == "") {
      return this.$swal({
        title: "댓글을 작성해주세요.",
        icon: "error",
        position: "top",
        showCancelButton: false,
        showConfirmButton: false,
        toast: true,
        timer: 1500,
      });
    } else {
      let saveItem: any = {
        workScheduleDetailId: this.historyId,
        type: "comment",
        comment: this.historyMessage,
      };

      api.schedule
        .saveCommentInfo(saveItem)
        .then((response) => {
          if (response.status == 200) {
            this.$swal({
              title: "댓글이 등록되었습니다.",
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
          this.getTotalComment();
          this.historyMessage = "";
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
  getTotalComment() {
    this.historyTable = [];
    let searchItem = {
      workScheduleDetailId: this.historyId,
    };
    api.schedule.getCommentInfo(searchItem).then((response) => {
      response.data.responseData.forEach((value: any) => {
        value["updateCommentStatus"] = false;
        if (value.details.length != 0) {
          value.details.forEach((data: any) => {
            data["updateReCommentStatus"] = false;
          });
        }
      });
      this.historyTable = response.data.responseData;
    });
  }
}
</script>
