<template>
  <v-card elevation="0" class="ma-2">
    <v-tabs
      v-model="tab"
      align-with-title="align-with-title"
      background-color=""
    >
      <v-tabs-slider color="primary"></v-tabs-slider>

      <v-tab v-for="item in tabList" :key="item" @click="clickTab(item)">
        {{ item }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab"></v-tabs-items>

    <div v-show="this.selectedTabs == '타임라인'">
      <v-row class="mt-1 ml-5">
        <v-col cols="9">
          <span class="text-h10 todayFont">현재날짜 : {{ today }}</span>
        </v-col>
        <v-col cols="2" class="pa-0 mr-5">
          <v-select
            rounded
            dense
            color="success"
            v-model="selectedTimelineView"
            class="view-select"
            :items="timelineViewOptions"
            item-text="title"
            item-value="value"
            hide-details
          ></v-select>
        </v-col>

        <v-btn small color="success" class="mr-5" @click="resetZoom">
          <v-icon small>mdi mdi-reload</v-icon> 새로고침
        </v-btn>
      </v-row>
      <v-spacer></v-spacer>
      <div class="graphBox">
        <canvas ref="barChart" />
      </div>

      <v-card class="timelineBox elevation-0">
        <v-expansion-panels v-model="activePanel">
          <v-expansion-panel v-for="(item, index) in panels" :key="index">
            <v-expansion-panel-header
              color="#fdfdfd"
              class="elevation-0"
              @click="moreDetail(item)"
              vaule="index"
              dense
            >
              {{ item }}
            </v-expansion-panel-header>
            <v-expansion-panel-content class="elevation-0" color="#fdfdfd">
              <v-data-table
                style="background-color: #fdfdfd"
                dense
                :headers="timelineHeader"
                :items="timelineTable"
                disable-pagination
                hide-default-footer
              ></v-data-table>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card>
    </div>

    <div class="totalBox" v-show="this.selectedTabs == '달력'">
      <div class="filterBox">
        <v-btn-toggle
          v-model="toggle"
          color="success"
          class="filterBtnBox"
          divided
          multiple
          variant="outlined"
        >
          <v-btn
            small
            color="success"
            text
            dark
            class="mb-2 addBtn"
            @click="openModal"
          >
            <v-icon color="success">mdi-plus</v-icon>일정 추가
          </v-btn>

          <v-btn
            small
            v-for="(item, i) in this.filterList"
            :key="i"
            :value="item"
            :color="toggle.length == 0 && i == 0 ? 'success' : ''"
            active-color="success"
            rounded
            class="mb-2"
            >{{ item.customerName }}
          </v-btn>
          <!--             :style="[toggle.length == 0 ? testGroup : null]"
   
            @click="getSchedule(item.customerId)"-->
        </v-btn-toggle>
      </div>
      <div class="calendarBox">
        <v-row class="mt-2">
          <v-col cols="4" justify="left">
            <span class="text-h4">{{ dateRangeText }}</span>
          </v-col>
          <v-col cols="3" justify="right">
            <v-select
              rounded
              dense
              color="success"
              v-model="selectedView"
              class="view-select"
              :items="viewOptions"
              item-text="title"
              item-value="value"
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="4" justify="right">
            <v-btn
              class="ml-1 changeBtn"
              rounded
              text
              color="success"
              @click="onClickTodayButton"
              >Today</v-btn
            >
            <v-btn
              class="ml-1 changeBtn"
              rounded
              text
              color="success"
              @click="onClickMoveButton(-1)"
              >Prev</v-btn
            >
            <v-btn
              class="ml-1 changeBtn"
              rounded
              text
              color="success"
              @click="onClickMoveButton(1)"
              >Next</v-btn
            >
          </v-col>
        </v-row>

        <Calendar
          :usageStatistics="false"
          ref="calendar"
          class="calendarBox"
          :view="view"
          :use-detail-popup="false"
          :use-form-popup="false"
          :week="week"
          :month="month"
          :events="events"
          isReadOnly
          @beforeUpdateEvent="onBeforeUpdateEvent"
          @clickEvent="onClickSchedule"
          @clickDayName="onClickDayName"
          @clickTimezonesCollapseBtn="onClickTimezonesCollapseBtn"
          :template="{
            allday: getTemplateForAllday,
          }"
        />
      </div>
    </div>
    <!-- 일정 분류 나누는  Dialog -->
    <v-dialog v-model="chooseDialog" width="400px">
      <v-card>
        <v-card-title class="mx-2">일정선택</v-card-title>
        <v-card-actions class="justify-center">
          <v-btn x-large color="success" @click="chooseAddModal">
            <v-icon>mdi mdi-calendar-plus</v-icon>신규
          </v-btn>
          <v-btn x-large color="success" @click="chooseExistingModal"
            ><v-icon>mdi mdi-calendar-cursor</v-icon>기존일정에 수정
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 일정 추가 Dialog -->
    <v-dialog v-model="dialog" width="750px">
      <v-card>
        <v-card-title class="mx-2">{{
          this.existing ? "일정 수정" : "일정 추가"
        }}</v-card-title>
        <v-card-text>
          <v-row class="mx-2">
            <v-col cols="3" fluid>
              <span>회사명</span>
              <v-autocomplete
                solo
                dense
                hide-details="false"
                class="highlightFont"
                label="회사명"
                v-model="scheduleData.customer"
                return-object
                :items="customerList"
                item-text="customerName"
                item-value="customerId"
              ></v-autocomplete>
            </v-col>
            <v-col cols="2" fluid v-show="existing">
              <v-menu
                v-model="menuLoad"
                :close-on-content-click="false"
                :nudge-width="300"
                offset-x
                max-height="600"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    small
                    @click="getExistingCalendar"
                    v-bind="attrs"
                    v-on="on"
                    v-show="existing"
                  >
                    불러오기
                  </v-btn>
                </template>
                <v-card class="pa-3">
                  <v-data-table
                    class=""
                    dense
                    height="350"
                    :items="existingTable"
                    :headers="existingHeader"
                    hide-default-footer
                    @click:row="clickedExisting"
                    single-select
                  >
                  </v-data-table>
                  <v-card-actions>
                    <v-btn text @click="menuLoad = false"> 닫기 </v-btn>
                  </v-card-actions>
                </v-card>
              </v-menu>
            </v-col>

            <v-col cols="2" class="p-2">
              <span>작물명</span>
              <v-text-field
                dense
                solo
                hide-details="false"
                class="highlightFont"
                placeholder="* 작물명"
                v-model="scheduleData.cropName"
              />
            </v-col>
            <v-col cols="2" class="p-2">
              <span>품종명</span>
              <v-text-field
                dense
                solo
                hide-details="false"
                class="highlightFont"
                placeholder="* 품종명"
                v-model="scheduleData.varietyName"
              />
            </v-col>

            <v-col cols="3" class="p-2">
              <span>색상표</span>
              <v-text-field
                dense
                v-model="scheduleData.backgroundColor"
                v-mask="mask"
                hide-details
                class="ma-0 pa-0 colorBox"
                solo
              >
                <template v-slot:append>
                  <v-menu
                    v-model="menu"
                    top
                    nudge-bottom="105"
                    nudge-left="16"
                    :close-on-content-click="false"
                  >
                    <template v-slot:activator="{ on }">
                      <div :style="swatchStyle" v-on="on" />
                    </template>
                    <v-card>
                      <v-card-text class="pa-0">
                        <v-color-picker
                          v-model="scheduleData.backgroundColor"
                          flat
                        />
                      </v-card-text>
                    </v-card>
                  </v-menu>
                </template>
              </v-text-field>
            </v-col>
          </v-row>

          <v-row
            v-for="(item, index) in titleList"
            class="dateBox mt-5"
            :key="item.title"
          >
            <v-col cols="2" class="pa-0">
              <v-text-field
                :value="item.title"
                :readonly="item.title != ''"
                dense
                filled
                rounded
                hide-details
                :style="[
                  item.start != '' && item.end != '' ? colorGroup : null,
                ]"
              >
                {{ item.title }}</v-text-field
              >
            </v-col>

            <v-col cols="3" class="pt-0">
              <v-menu
                :key="item.start"
                dense
                ref="startDate"
                :close-on-content-click="false"
                :return-value.sync="item.start"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    dense
                    v-model="item.start"
                    class="highlightFont"
                    label="시작일"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  :max="item.end"
                  @change="checkText(index)"
                  v-model="item.start"
                  no-title
                  scrollable
                  locale="ko-KR"
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="item.start = ''">
                    취소
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="3" class="pt-0">
              <v-menu
                :key="item.end"
                dense
                ref="endDate"
                :close-on-content-click="false"
                :return-value.sync="item.end"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    dense
                    v-model="item.end"
                    class="highlightFont"
                    label="종료일"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  :min="item.start"
                  @change="autoText(index, item.end)"
                  v-model="item.end"
                  no-title
                  scrollable
                  locale="ko-KR"
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="item.end = ''">
                    취소
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="4" class="pa-0">
              <v-text-field
                dense
                v-model="item.memo"
                placeholder="비고"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row
            v-for="(item, index) in secondTitleList"
            :key="index"
            justify="center"
            class="ml-40"
          >
            <v-col cols="2" class="pa-0">
              <v-text-field
                v-model="item.title"
                dense
                filled
                rounded
                hide-details
                :style="[
                  item.title != '' && item.start != '' && item.end != ''
                    ? colorGroup
                    : null,
                ]"
              >
              </v-text-field>
            </v-col>
            <v-col cols="3" class="pt-0">
              <v-menu
                :key="item.start"
                dense
                ref="secondStartDate"
                :close-on-content-click="false"
                :return-value.sync="item.start"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    dense
                    v-model="item.start"
                    class="highlightFont"
                    label="일정"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="item.start"
                  no-title
                  scrollable
                  locale="ko-KR"
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="menu = false">
                    취소
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="secondS_date_search(item.start)"
                  >
                    확인
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="3" class="pt-0">
              <v-menu
                :key="item.end"
                dense
                ref="secondEndDate"
                :close-on-content-click="false"
                :return-value.sync="item.end"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    dense
                    v-model="item.end"
                    class="highlightFont"
                    label="종료일"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="item.end"
                  no-title
                  scrollable
                  locale="ko-KR"
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="menu = false">
                    취소
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="secondE_date_search(item.end)"
                  >
                    확인
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="4" class="pa-0">
              <v-row>
                <v-col cols="9">
                  <v-text-field dense placeholder="비고" v-model="item.memo"
                /></v-col>
                <v-col cols="1">
                  <v-btn
                    icon
                    color="success"
                    @click="add"
                    v-show="
                      index == secondTitleList.length - 1 &&
                      item.title != '' &&
                      item.start != '' &&
                      item.end != ''
                    "
                    ><v-icon small>mdi-plus </v-icon></v-btn
                  >
                </v-col></v-row
              >
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="success" @click="saveInfo">저장</v-btn>
          <v-btn text color="success" @click="closeModal">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
                            label="종료일"
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
                          <v-btn
                            text
                            color="primary"
                            @click="updateEndDate = ''"
                          >
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
                      this.detailEvent == "" ||
                      this.detailEvent[0].cropName == ""
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
            <v-divider vertical class="ma-1"></v-divider>
            <v-btn text class="ma-1" @click="deleteInfo">
              <v-icon right dark class="mr-1"> mdi-delete </v-icon>삭제
            </v-btn></v-row
          >
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
                      <v-btn small text @click="deleteComment(item)"
                        >삭제</v-btn
                      >
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

    <!-- 일정 히스토리-->
    <v-menu
      :position-x="x"
      :position-y="y"
      absolute
      v-model="historyMenu"
      :close-on-content-click="false"
    >
    </v-menu>
  </v-card>
</template>

<script lang="ts">
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  TimeScale,
  LinearScale,
  registerables,
} from "chart.js";

import zoomPlugin from "chartjs-plugin-zoom";
import annotationPlugin from "chartjs-plugin-annotation";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "chartjs-adapter-date-fns";
import { Component, Watch, Vue } from "vue-property-decorator";
import Calendar from "@toast-ui/vue-calendar";
import "@toast-ui/calendar/dist/toastui-calendar.min.css";
import * as api from "@/api";
import _, { indexOf, template } from "lodash";
import { faPersonMilitaryRifle } from "@fortawesome/free-solid-svg-icons";
import { colors } from "vuetify/lib";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  TimeScale,
  LinearScale,
  annotationPlugin,
  zoomPlugin,
  ...registerables,
  ChartDataLabels
);
var chart: any;
@Component({
  components: {
    Calendar,
    //Bar,
  },
})
export default class Schedule extends Vue {
  $refs!: {
    calendar: HTMLFormElement;
    startDate: HTMLFormElement;
    endDate: HTMLFormElement;
    secondStartDate: HTMLFormElement;
    secondEndDate: HTMLFormElement;
    updateStartDate: HTMLFormElement;
    updateEndDate: HTMLFormElement;
    barChart: HTMLCanvasElement;
  };
  today: string = ""; //현재날짜
  selectedTabs: string = "달력";
  tab: any = null;
  tabList: any = ["달력", "타임라인"];
  chart: string = "";
  chartData: any = {
    data: {
      labels: [],
      datasets: [
        {
          type: "bar",
          axis: "y",
          label: "",
          //thickness: 7,
          borderWidth: 1,
          borderSkipped: false,
          borderRadius: 20,
          borderColor: "#e7e7e7",
          backgroundColor: "#ffffff",
          data: [],
          order: 2,

          //pointStyle:"rectRounded"
          datalabels: {
            display: false, //true: 겹침 , auto: 데이터 인덱스가 가장 높은 레이블이 숨겨짐
            color: "black",
            align: "right",
            offset: -30,
            //align: "bottom",
            //offset: 20,
            font: {
              weight: "bold",
              size: "12",
            },

            formatter: (value: any) => {
              return value.t + "\n" + value.c;
            },
          },
        },
        {
          type: "bar",
          axis: "y",
          label: "",
          //thickness: 7,
          borderWidth: 1,
          borderSkipped: false,
          borderRadius: 20,
          data: [],
          order: 1,
          backgroundColor: "",
          //pointStyle:"rectRounded"
          datalabels: {
            display: true, //true: 겹침 , auto: 데이터 인덱스가 가장 높은 레이블이 숨겨짐
            color: "black",

            font: {
              weight: "bold",
              size: "10",
            },

            formatter: (value: any) => {
              return value.l + "\n" + value.c + "(" + value.v + ")";
              //return value.l;
            },
          },
        },

        {
          type: "bubble",
          axis: "y",
          pointStyle: "rectRounded",
          label: "",
          data: [],
          borderWidth: 2,
          radius: 20,
          backgroundColor: "",
          order: 1,
          datalabels: {
            display: true, //true: 겹침 , auto: 데이터 인덱스가 가장 높은 레이블이 숨겨짐
            color: "black",
            align: "right",
            offset: -10,
            font: {
              weight: "bold",
              size: "10",
            },
            formatter: (value: any) => {
              return value.l + "\n" + value.c + "(" + value.v + ")";
            },
          },
        },
      ],
    },
    options: {
      onClick: (event: any, elements: any) => {
        let item = elements[0].index;
        this.deleteTotalInfo(item);
      },
      minBarThickness: 15, //Bar 두께
      maxBarThickness: 30, //Bar 두께
      indexAxis: "y",
      scales: {
        xAxis: {
          min: "",
          max: "",
          beginAtZero: true,
          autoSkip: false,
          maxTicksLimit: 6,
          type: "time",
          grid: {
            display: true,
          },

          time: {
            parser: "yyyy-MM-dd",
            unit: "day",
            displayFormats: {
              year: "yyyy",
              month: "yyyy-MM",
              day: "yyyy-MM-dd",
              quarter: "YYYY-MM-DD",
            },
          },
          ticks: {
            source: "ticks",
            autoSkip: false,
            beginAtZero: true, //0부터 시작하는지.
            offset: false,
            // maxTicksLimit: 10,
          },
        },

        yAxes: {
          display: false,
          stacked: true,
          grid: {
            display: false,
          },
        },
      },
      plugins: {
        decimation: 30,
        annotation: {
          annotations: [
            {
              drawTime: "afterDatasetsDraw",
              type: "line",
              mode: "vertical",
              xMin: new Date().toISOString().substr(0, 10),
              xMax: new Date().toISOString().substr(0, 10),
              borderWidth: 2,
              borderColor: "#ff7b7b",
              borderDash: [5, 5],
              label: {
                borderColor: "red",
                content: "TODAY",
                enabled: true,
              },
            },
          ],
        },

        zoom: {
          zoom: {
            pinch: {
              enabled: true,
            },
            wheel: {
              enabled: false,
              speed: 0.1,
            },
            drag: {
              enabled: false,
            },
            sensitivity: 0.5,
            mode: "x",
          },
          pan: {
            enabled: true,
          },

          limits: {},
        },

        legend: {
          display: false, // 라벨 숨기기
          labels: {
            padding: 3, // 범례간의 간격
          },
        },

        tooltip: {
          backgroundColor: "#FAFAFA",
          borderColor: "lightgreen",
          borderWidth: 1,
          bodyColor: "black",
          titleColor: "black",
          titleFontColor: "black",
          titleFontStyle: "normal",
          displayColors: false,
          bodyFontColor: "black",
          boxWidth: 15,
          callbacks: {
            label: function (tooltipItem: any) {
              if (tooltipItem.raw["x"].length == 2) {
                return (tooltipItem.formattedValue = `회사명 : ${tooltipItem.raw["t"]} 작물정보 : ${tooltipItem.raw["c"]} ,  일정기간 : ${tooltipItem.raw["x"][0]} ~ ${tooltipItem.raw["x"][1]}`);
              } else {
                return (tooltipItem.formattedValue = `회사명 : ${tooltipItem.raw["t"]} 작물정보 : ${tooltipItem.raw["c"]} ,  일정기간 : ${tooltipItem.raw["x"]}`);
              }
            },
          },
        },
      },
      responsive: true, //container에 맞게 조정되는 옵션
      maintainAspectRatio: false, //그래프의 비율 유지s
    },
  };
  selectedTimelineView: string = "day";
  timelineViewOptions: any = [
    {
      title: "Day",
      value: "day",
    },
    {
      title: "Monthly",
      value: "month",
    },
  ];
  activePanel: any = null;
  panels: any[] = [];
  groupBy: any[] = [];
  expanded: any[] = [];
  timelineTableList: any[] = [];
  timelineHeader: any = [
    { text: "일정명", value: "title" },
    { text: "작물명", value: "cropName" },
    { text: "품종명", value: "varietyName" },
    { text: "시작일", value: "start" },
    { text: "종료일", value: "end" },
    { text: "생성자", value: "createdId" },
    { text: "생성일", value: "createdDate" },
    { text: "수정자", value: "modifiedId" },
    { text: "수정일", value: "modifiedDate" },
    { text: "비고", value: "memo" },
  ];

  filterList: any[] = []; //[response] 전체 거래처 데이터(filter용)
  customerList: any[] = []; //[response] 전체 거래처 데이터
  events: any[] = []; //[response] 전체 일정 데이터
  totalEvents: any[] = []; //[response] 전체 일정 데이터
  timelineList: any[] = []; //[response] 전체 타임라인 데이터
  secondTitleList: any = [{ title: "", start: "", end: "", memo: "" }]; //그 외 일정 v-model
  secondResetTypeData: any = []; //그 외 일정 v-model
  titleList: any = [
    {
      title: "파종",
      start: "",
      end: "",
      memo: "",
    },
    {
      title: "발아",
      start: "",
      end: "",
      memo: "",
    },
    {
      title: "1차육묘",
      start: "",
      end: "",
      memo: "",
    },
    {
      title: "접목 & 활착",
      start: "",
      end: "",
      memo: "",
    },

    {
      title: "2차육묘",
      start: "",
      end: "",
      memo: "",
    },
    {
      title: "납품",
      start: "",
      end: "",
      memo: "",
    },
  ];
  resetTypeData: any = [
    //resetDATA
    {
      title: "파종",
      start: "",
      end: "",
      memo: "",
    },
    {
      title: "발아",
      start: "",
      end: "",
      memo: "",
    },
    {
      title: "1차육묘",
      start: "",
      end: "",
      memo: "",
    },
    {
      title: "접목 & 활착",
      start: "",
      end: "",
      memo: "",
    },

    {
      title: "2차육묘",
      start: "",
      end: "",
      memo: "",
    },
    {
      title: "납품",
      start: "",
      end: "",
      memo: "",
    },
  ];
  //[등록,수정,삭제]기능관련 DATA
  scheduleData: any = {
    title: "",
    customer: "",
    cropName: "",
    varietyName: "",
    backgroundColor: "#4caf50",
  };
  x: number = 0;
  y: number = 0;

  historyId: number = 0;
  historyDetailId: number = 0;
  historyMessage: string = "";
  historyReMessage: string = "";
  historyTable: any[] = [];
  openHistory: boolean = false;
  calendarText: string = ""; //toast v-model개념
  menu_update_date: boolean = false; //수정일 캘린더
  updateStartDate: string = ""; //[수정] 달력 v-model
  updateEndDate: string = ""; //[수정] 달력 v-model
  updateMemo: string = ""; //[수정] 메모 v-model
  update: boolean = false; //dialog 저장 or 수정
  startDate: string = ""; //[등록] 달력 v-model
  endDate: string = ""; //[등록] 달력 v-model
  secondStartDate: string = ""; //[등록] 달력 v-model
  secondEndDate: String = "";
  chooseDialog: any = ""; //일정추가 (신규  or 추가) Dialog
  existing: boolean = false; //추가 일정 상태
  existingTableList: any[] = [];
  clickedExistingId: string = ""; //불러오기로 선택된 workScheduleId
  existingHeader: any = [
    { text: "작물명", value: "cropName" },
    { text: "품종명", value: "varietyName" },
    { text: "생성자", value: "createdId" },
    { text: "생성일", value: "createdDate" },
    { text: "수정자", value: "modifiedId" },
    { text: "수정일", value: "modifiedDate" },
  ];
  historyMenu: boolean = false; //히스토리 menu v-model
  menuLoad: boolean = false; //거래처별 일정 불러오는 menu
  dialog: any = ""; //일정 추가 Dialog
  detailMenu: boolean = false; //상세보기 menu v-model
  detailEvent: any[] = []; //상세보기 일정
  title: string = ""; //상세보기 Title
  backgroundColor = ""; //상세보기 색상표
  mask: string = "!#XXXXXXXX"; //[등록,수정]색상표 기본형식
  menu: boolean = false; //[등록]컬러판 v-model
  colorMenu: boolean = false; //[수정]컬러판 v-model
  toggle: any[] = [];
  //tost ui 관련 옵션
  dateRangeText: string = ""; //달력 날짜
  selectedView: string = "month";
  viewOptions: any = [
    {
      title: "Monthly",
      value: "month",
    },
    {
      title: "Weekly",
      value: "week",
    },
    {
      title: "Day",
      value: "day",
    },
  ];
  view: string = "month";
  week: any = {
    dayNames: ["일", "월", "화", "수", "목", "금", "토"],
    taskView: false,
    eventView: true,
  };
  month: any = {
    dayNames: ["일", "월", "화", "수", "목", "금", "토"],
    visibleEventCount: 10,
    //visibleWeeksCount: 5, //보여줄 주단위
  };

  get calendarInstance() {
    //'GetInstance'는 호출 값을 한 번만 제공합니다.
    // 두 번 이상 호출하면 'null'을 호출하기 때문에 오류가 발생합니다.
    return this.$refs.calendar.getInstance();
  }

  get swatchStyle() {
    const { menu } = this;
    return {
      backgroundColor: this.scheduleData.backgroundColor,
      cursor: "pointer",
      height: "30px",
      width: "30px",
      borderRadius: menu ? "50%" : "4px",
      transition: "border-radius 200ms ease-in-out",
    };
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

  get colorGroup() {
    return {
      backgroundColor: this.scheduleData.backgroundColor,
    };
  }

  get timelineTable() {
    return this.timelineTableList;
  }

  get existingTable() {
    return this.existingTableList;
  }

  @Watch("toggle")
  changeBtn() {
    this.events = [];
    let tempTotal = JSON.parse(JSON.stringify(this.totalEvents));
    let tempId: any = [];

    this.toggle.forEach((data: any) => {
      tempId.push(data.customerId);
    });
    var total = tempId.find((e: any) => e === "");

    if (this.toggle.length == 0) {
      this.getSchedule("");
    } else {
      if (total != undefined) {
        this.toggle = [];
        tempId = [];
      } else {
        tempTotal.forEach((value: any) => {
          tempId.forEach((value_detail: any) => {
            if (value.customerId == value_detail) {
              value.details.forEach((detail: any) => {
                this.events.push(detail);
              });
            }
          });
        });
      }
    }
  }

  @Watch("selectedView")
  changeOptions(newView: any) {
    this.calendarInstance.changeView(newView);
    this.setDateRangeText();
  }

  @Watch("selectedTimelineView")
  changeTimelineOptions() {
    if (this.selectedTimelineView == "month") {
      this.chartData.options.scales.xAxis.time.unit = "month";
      this.chartData.data["datasets"][0].datalabels.display = true;
      //데이터 안보이도록 설정
      this.chartData.data["datasets"][1].data = [];
      this.chartData.data["datasets"][2].data = [];
      this.getmonthDate();
      chart.resize();
    } else {
      this.chartData.options.scales.xAxis.time.unit = "day";
      this.chartData.data["datasets"][0].datalabels.display = false;
      this.getTotalSchedule();
    }
  }

  @Watch("secondTitleList")
  addSecondTitle() {
    return this.secondTitleList;
  }

  s_date_search(v: any) {
    this.startDate = v;
    let startEL: any = this.$refs.startDate;
    startEL.save(v);
  }
  e_date_search(v: any) {
    this.endDate = v;
    let endEL: any = this.$refs.endDate;
    endEL.save(v);
  }
  secondS_date_search(v: any) {
    this.secondStartDate = v;
    let startEL: any = this.$refs.secondStartDate;
    startEL.save(v);
  }
  secondE_date_search(v: any) {
    this.secondEndDate = v;
    let endEL: any = this.$refs.secondEndDate;
    endEL.save(v);
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

  mounted() {
    this.setDateRangeText();
    this.getCustomer();
    this.getSchedule("");
  }

  resetZoom() {
    chart.resetZoom();
  }

  getdayDate() {
    const now = new Date();
    const day = now.getDate();

    this.chartData.options.scales.xAxis.min = new Date(
      //new Date().setDate(day - 5)
      new Date().setDate(day - 3)
    )
      .toISOString()
      .substr(0, 10);
    this.chartData.options.scales.xAxis.max = new Date(
      //new Date().setDate(day + 7)
      new Date().setDate(day + 4)
    )
      .toISOString()
      .substr(0, 10);
  }

  getmonthDate() {
    const now = new Date();
    const month = now.getMonth();

    this.chartData.options.scales.xAxis.time.unit = "month";
    this.chartData.options.scales.xAxis.min = new Date(
      //new Date().setMonth(month - 4)
      new Date().setMonth(month - 2)
    )
      .toISOString()
      .substr(0, 10);
    this.chartData.options.scales.xAxis.max = new Date(
      //new Date().setMonth(month + 9)
      new Date().setMonth(month + 5)
    )
      .toISOString()
      .substr(0, 10);
  }

  //전체 타임라인List
  async getTotalSchedule() {
    this.timelineList = [];
    let searchItem = {
      customerId: "",
    };
    let yArea = new Set();
    let groupList = new Set();
    let oneDayColor: any = [];
    let oneDayData: any = [];
    let scheduleData: any = [];
    let scheduleColor: any = [];

    this.today = new Date()
      .toISOString()
      .substr(0, 10)
      .replace("-", "년")
      .replace("-", "월")
      .concat("일");

    //일정별 전체 기간 일정은 바차트로
    api.schedule.getScheduleInfo(searchItem).then((response) => {
      response.data.responseData.forEach((value: any) => {
        this.selectedTimelineView = "day";
        value.details.forEach((value_detail: any) => {
          value_detail["cropName"] = value.cropName;
          value_detail["varietyName"] = value.varietyName;
          value_detail["backgroundColor"] = value.backgroundColor;
          value_detail["customerName"] = value.customerName;
          value_detail["workScheduleId"] = value.workScheduleId;
          value_detail["customerId"] = value.customerId;
          value_detail[
            "id"
          ] = `${value.customerId}-${value_detail.workScheduleId}`; //toast 일정데이터 선별하기 임의데이터 사용
          yArea.add(`${value.customerId}-${value_detail.workScheduleId}`);

          if (value_detail.start != value_detail.end) {
            scheduleData.push({
              x: [value_detail.start, value_detail.end],
              y: value_detail.id,
              t: value_detail.customerName,
              l: `[${value.customerName}]${value_detail.title}`,
              c: value_detail.cropName,
              v: value_detail.varietyName,
            });
            scheduleColor.push(value_detail.backgroundColor);
          } else {
            if (
              _.filter(oneDayData, {
                x: value_detail.start,
                y: value_detail.id,
              }).length == 0
            ) {
              oneDayData.push({
                x: value_detail.start,
                y: value_detail.id,
                t: value_detail.customerName,
                l: `[${value.customerName}]${value_detail.title}`,
                c: value.cropName,
                v: value.varietyName,
                //r: 15,
                r: 15,
              });
              oneDayColor.push(value_detail.backgroundColor);
            } else {
              oneDayData.forEach((data: any) => {
                if (
                  data.x == value_detail.start &&
                  data.y == value_detail.id &&
                  data.c == value_detail.cropName &&
                  data.v == value_detail.varietyName
                ) {
                  data.l = data.l.concat(
                    "," +
                      value_detail.title.replace(
                        value_detail.customerName + "-",
                        " "
                      )
                  );
                }
              });
            }
          }
        });
      });

      api.schedule.getTotalScheduleInfo().then((response) => {
        response.data.responseData.forEach((value: any) => {
          groupList.add(value.customerName);
          this.timelineList.push({
            x: [value.start, value.end],
            w: value.workScheduleId,
            y: `${value.customerId}-${value.workScheduleId}`,
            t: value.customerName,
            c: `${value.cropName}(${value.varietyName})`,
          });
        });
        this.panels = Array.from(groupList);
      });

      this.chartData.data["labels"] = Array.from(yArea);
      this.chartData.data["datasets"][0].data = this.timelineList;
      this.chartData.data["datasets"][1].data = scheduleData;
      this.chartData.data["datasets"][1].backgroundColor = scheduleColor;
      this.chartData.data["datasets"][2].data = oneDayData;
      this.chartData.data["datasets"][2].backgroundColor = oneDayColor;
      this.getdayDate();

      //createGraph 함수
      return new Promise((resolve) => {
        if (chart !== undefined) {
          chart.destroy();
        }

        chart = new ChartJS(this.$refs.barChart, {
          type: "bar",
          data: this.chartData.data,
          options: this.chartData.options,
        });

        chart.canvas.parentNode.style.height = "400px";
        chart.canvas.style.backgroundColor = "#fdfdfd";
        chart.resize();

        resolve(chart);
      });
    });

    console.group("getTotalSchedule");
    console.log("getTotalSchedule", this.timelineList);
    console.groupEnd();
  }
  //전체 거래List
  getCustomer() {
    api.schedule.getCustomerInfo().then((response) => {
      this.customerList = response.data.responseData;

      console.group("getCustomer");
      console.log("getCustomer", this.customerList);
      console.groupEnd();
    });
  }

  //전체 일정List
  getSchedule(item: any) {
    //this.timelineTableList = [];
    this.totalEvents = [];
    this.events = [];
    this.filterList = [];
    this.filterList = [{ customerName: "전체 일정", customerId: "" }];

    let searchItem = {
      customerId: "",
    };
    searchItem.customerId = item;

    api.schedule.getScheduleInfo(searchItem).then((response) => {
      this.totalEvents = response.data.responseData;

      response.data.responseData.forEach((value: any) => {
        value.details.forEach((detailVAlue: any) => {
          detailVAlue["customerName"] = value.customerName;
          detailVAlue["category"] = "allday";
          detailVAlue["isAllDay"] = "true";
          detailVAlue["cropName"] = value.cropName;
          detailVAlue["varietyName"] = value.varietyName;
          detailVAlue["backgroundColor"] = value.backgroundColor;

          detailVAlue[
            "id"
          ] = `${value.customerId}-${detailVAlue.workScheduleDetailId}`; //toast 일정데이터 선별하기 임의데이터 사용
          this.events.push(detailVAlue);
          //this.timelineTableList.push(detailVAlue);
        });
      });

      this.totalEvents.forEach((value: any) => {
        if (
          value.details.length != 0 &&
          _.filter(this.filterList, {
            customerName: value.customerName,
            customerId: value.customerId,
          }).length == 0
        ) {
          this.filterList.push({
            customerName: value.customerName,
            customerId: value.customerId,
          });
        }
      });

      console.group("getSchedule");
      console.log("getSchedule", this.events);
      console.groupEnd();
    });
  }

  //일정표에 표시되는 년월
  setDateRangeText() {
    const date = this.calendarInstance.getDate();
    const start = this.calendarInstance.getDateRangeStart();
    const end = this.calendarInstance.getDateRangeEnd();

    const startYear = start.getFullYear();
    const endYear = end.getFullYear();

    switch (this.selectedView) {
      case "month":
        this.dateRangeText = `${date.getFullYear()}년${date.getMonth() + 1}월`;

        return;
      case "day":
        this.dateRangeText = `${date.getFullYear()}년${
          date.getMonth() + 1
        }월${date.getDate()}일`;

        return;
      default:
        this.dateRangeText = `${startYear}년${
          start.getMonth() + 1
        }월${start.getDate()}일 - ${
          startYear !== endYear ? `${endYear}.` : ""
        }${end.getMonth() + 1}월${end.getDate()}일`;
    }
  }
  //일정 title 커스텀
  getTemplateForAllday(event: any) {
    this.events.forEach((value: any) => {
      if (value.id == event.id) {
        event["customerName"] = value.customerName;
        event["commentCount"] = value.commentCount;
      }
    });

    return event.commentCount != 0
      ? `[${event.customerName}]${event.title} (${event.commentCount})`
      : `[${event.customerName}]${event.title}`;
  }

  //month에서 일정표 늘릴 수있는 옵션
  onClickTimezonesCollapseBtn() {
    const newTheme = {
      "week.daygridLeft.width": "100px",
      "week.timegridLeft.width": "100px",
    };

    this.calendarInstance.setTheme(newTheme);
  }

  onBeforeUpdateEvent(updateData: any) {
    console.log("onBeforeUpdateEvent", updateData);
  }
  onClickDayName(date: object) {
    console.group("onClickDayName");
    console.log("Date : ", date);
    console.groupEnd();
  }

  //update 일정
  onClickSchedule(event: any) {
    //상세일정 일정옆에 띄우기
    this.x = event.nativeEvent.pageX;
    this.y = event.nativeEvent.pageY;

    this.detailEvent = [];
    this.detailMenu = true;
    this.openHistory = false;
    this.update = false;

    this.events.forEach((value: any) => {
      if (value.id == event.event.id) {
        this.title = `[${value.customerName}] ${value.title} `;
        this.backgroundColor = value.backgroundColor;
        this.detailEvent.push(value);
        this.historyId = this.detailEvent[0].workScheduleDetailId;
      }
    });
    this.getTotalComment();
    console.group("onClickSchedule");
    console.log("onClickSchedule", this.detailEvent);
    console.groupEnd();
  }

  //TODAY 버튼 이벤트
  onClickTodayButton() {
    this.calendarInstance.today();
    this.setDateRangeText();
  }
  //PREV,NEXT 버튼 이벤트
  onClickMoveButton(offset: any) {
    this.calendarInstance.move(offset);
    this.setDateRangeText();
  }
  add() {
    this.secondTitleList.push({ title: "", start: "", end: "", memo: "" });
  }
  //일정 등록 이벤트
  saveInfo() {
    this.update = false;
    let schedule: any = {
      cropName: "",
      varietyName: "",
      backgroundColor: "",
      details: [],
    };

    if (
      this.scheduleData.customer == "" ||
      this.scheduleData.cropName == "" ||
      this.scheduleData.varietyName == ""
    ) {
      return this.$swal({
        title: "필수정보가 등록되지않았습니다.",
        icon: "error",
        position: "top",
        showCancelButton: false,
        showConfirmButton: false,
        toast: true,
        timer: 1500,
      });
    } else {
      schedule.cropName = this.scheduleData.cropName;
      schedule.varietyName = this.scheduleData.varietyName;
      schedule.backgroundColor = this.scheduleData.backgroundColor;

      this.titleList.forEach((value: any) => {
        if (value.start != "" && value.end != "") {
          schedule.details.push({
            title: value.title,
            start: value.start,
            end: value.end,
            memo: value.memo,
          });
        }
      });

      this.secondTitleList.forEach((value: any) => {
        if (value.title != "" && value.start != "" && value.end != "") {
          schedule.details.push({
            title: value.title,
            start: value.start,
            end: value.end,
            memo: value.memo,
          });
        }
      });
    }

    if (this.existing) {
      schedule["workScheduleId"] = this.clickedExistingId;
      api.schedule
        .updateTotalScheduleInfo(schedule)
        .then((response) => {
          if (response.status == 200) {
            this.$swal({
              title: "일정이 등록되었습니다.",
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
          //일정 데이터 불러오기
          this.dialog = false;
          this.chooseDialog = false;
          this.getSchedule("");
          this.getTotalSchedule();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      schedule["customerId"] = this.scheduleData.customer.customerId;
      schedule["category"] = "allday";
      schedule["isAllDay"] = "true";
      api.schedule
        .saveScheduleInfo(schedule)
        .then((response) => {
          if (response.status == 200) {
            this.$swal({
              title: "일정이 등록되었습니다.",
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
          //일정 데이터 불러오기
          this.dialog = false;
          this.chooseDialog = false;
          this.getSchedule("");
          this.getTotalSchedule();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
  chooseAddModal() {
    this.titleList = JSON.parse(JSON.stringify(this.resetTypeData));
    this.secondTitleList = JSON.parse(JSON.stringify(this.secondResetTypeData));
    this.add();
    this.dialog = true;
    this.existing = false;
  }

  chooseExistingModal() {
    this.dialog = true;
    this.existing = true;
    this.titleList = JSON.parse(JSON.stringify(this.resetTypeData));
    this.secondTitleList = JSON.parse(JSON.stringify(this.secondResetTypeData));
  }

  getExistingCalendar() {
    //거래처별 저장된 일정들 가져오기
    let searchItem = {
      customerId: "",
    };

    if (this.scheduleData.customer != "") {
      searchItem.customerId = this.scheduleData.customer.customerId;

      api.schedule.getCustomerScheduleInfo(searchItem).then((response) => {
        response.data.responseData.forEach((value: any) => {
          value.id = `${value.customerId}-${value.workScheduleId}`;
        });

        this.existingTableList = response.data.responseData;
      });
    }
  }

  clickedExisting(item: any, row: any) {
    this.titleList = JSON.parse(JSON.stringify(this.resetTypeData));
    this.secondTitleList = JSON.parse(JSON.stringify(this.secondResetTypeData));
    this.clickedExistingId = item.workScheduleId;
    this.scheduleData.cropName = item.cropName;
    this.scheduleData.varietyName = item.varietyName;
    row.select(true);

    this.totalEvents.forEach((value: any) => {
      if (
        item.cropName == value.cropName &&
        item.varietyName == value.varietyName &&
        item.customerId == value.customerId &&
        item.workScheduleId == value.workScheduleId
      ) {
        value.details.forEach((value_detail: any) => {
          this.scheduleData.backgroundColor = value_detail.backgroundColor;

          let onlyTitle = _.map(this.titleList, "title"); // [파종, 1차육묘, ...]
          if (onlyTitle.includes(value_detail.title)) {
            this.titleList[onlyTitle.indexOf(value_detail.title)] = {
              title: value_detail.title,
              start: value_detail.start,
              end: value_detail.end,
              memo: value_detail.memo,
            };
          } else {
            this.secondTitleList.push({
              title: value_detail.title,
              start: value_detail.start,
              end: value_detail.end,
              memo: value_detail.memo,
            });
          }
        });
      }
    });
  }
  openModal() {
    this.chooseDialog = !this.chooseDialog;
    this.scheduleData.customer = "";
    this.scheduleData.cropName = "";
    this.scheduleData.varietyName = "";
    this.scheduleData.backgroundColor = "#4caf50";
  }
  //Modal 닫기
  closeModal() {
    this.dialog = false;
    this.chooseDialog = false;
    this.scheduleData.customer = "";
    this.scheduleData.cropName = "";
    this.scheduleData.varietyName = "";
    this.scheduleData.backgroundColor = "#4caf50";
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
          //일정 데이터 불러오기
          this.detailMenu = false;
          this.getSchedule("");
        })
        .catch((error) => {
          console.log(error);
        });
    }
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
                //일정 데이터 불러오기
                this.detailMenu = false;
                this.getSchedule("");
              })
              .catch((error) => {
                console.log(error);
              });
          }
        });
    }
  }
  clickTab(item: any) {
    this.selectedTabs = item;

    if (this.selectedTabs == "달력") {
      this.getSchedule("");
    } else {
      this.getTotalSchedule();
    }
  }
  deleteTotalInfo(item: any) {
    let deleteItem = 0;
    deleteItem = this.timelineList[item].w;

    this.$swal
      .fire({
        title: "삭제",
        text: "해당 데이터를 삭제하시겠습니까?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "삭제",
      })
      .then((result) => {
        if (result.isConfirmed) {
          api.schedule
            .deleteTotalScheduleInfo(deleteItem)
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
              //일정 데이터 불러오기
              this.getTotalSchedule();
            })
            .catch((error) => {
              console.log(error);
            });
        }
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
  openModalHistory(item: any) {
    this.detailMenu = false;
    this.historyMenu = true;
    this.historyId = item;
    this.getTotalComment();
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
  back(item: any) {
    this.historyMenu = false;
    this.detailMenu = true;
    this.events.forEach((value: any) => {
      if (value.id == item) {
        this.title = `[${value.customerName}] ${value.title} `;
        this.backgroundColor = value.backgroundColor;
        this.detailEvent.push(value);
      }
    });
  }
  moreDetail(item: any) {
    this.timelineTableList = [];

    this.events.forEach((value: any) => {
      if (item == value.customerName) {
        this.timelineTableList.push(value);
      }
    });
  }
  autoText(item: any, data: any) {
    if (item != 6) {
      this.titleList[item + 1]["start"] = data;
      return this.titleList;
    }
  }
  checkText(item: any) {
    if (item != 0 && item != 6) {
      if (
        this.titleList[item]["start"] != "" &&
        new Date(this.titleList[item - 1]["end"]).getTime() >
          new Date(this.titleList[item]["start"]).getTime()
      ) {
        this.titleList[item]["start"] = "";

        return this.$swal({
          title: "이전 일정보다 빠른 일정은 존재할 수 없습니다.",
          icon: "error",
          position: "top",
          showCancelButton: false,
          showConfirmButton: false,
          toast: true,
          timer: 1500,
        });
      }
    }
  }
}
</script>
<style src="./Schedule.scss" lang="scss"></style>
