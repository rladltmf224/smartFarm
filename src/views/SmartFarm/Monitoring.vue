<template>
  <v-container fluid class="">
    <v-row class="d-flex align-center justify-center">
      <v-card
        v-for="(item, i) in outdoorSensor"
        :key="i"
        class="d-flex justify-center flex-column align-center mx-1 my-1 text-center"
        min-width="100"
      >
        <v-card-text class="py-2">
          <span class="text-subtitle-1 font-weight-bold">
            {{ outdoorSensor[i].sensorname }}
          </span>
          <v-spacer></v-spacer>

          <span class="text-h5 font-weight-bold" color="primary">{{
            outdoorSensor[i].value.replace(" (없음)", "")
          }}</span>
          <span class="text-subtitle-2 font-weight-bold"
            >&nbsp;{{ outdoorSensor[i].unit }}</span
          >
        </v-card-text>
      </v-card>
      <v-btn
        :loading="loading5"
        :disabled="loading5"
        color="#CFD8DC"
        class="ma-2 white--text"
        fab
        x-small
        elevation="0"
        @click="(loader = 'loading5'), getOutDoor()"
      >
        <v-icon dark> mdi-reload </v-icon>
      </v-btn>
    </v-row>

    <v-row dense class="d-flex justify-md-center align-stretch">
      <v-col
        v-for="(n, index) in cards"
        :key="index"
        lg="6"
        md="12"
        sm="12"
        xs="12"
        class="d-flex justify-center"
      >
        <RoomInfo
          :roomData="n"
          @controllPage="goControllPage"
          @selectPage="openDialog"
        >
        </RoomInfo>
      </v-col>
    </v-row>

    <!-- 조회 다이아로그 -->
    <v-row justify="center">
      <v-dialog v-model="dialog" max-width="1300">
        <v-card>
          <v-card-title class="d-flex">
            <h4 class="px-1">모니터링</h4>
            <h4 class="px-1">></h4>
            <h4 class="px-1">{{ this.section }}</h4>
            <v-btn class="ml-auto" icon @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="mb-4" color="#F6F8F9" elevation="4">
            <!-- MonitoringGraph내용 -->

            <!-- 조회일,조회시간 -->
            <v-card elevation="3">
              <v-card-text>
                <v-row dense class="align-center">
                  <v-col cols="1">
                    <h4 class="searchbox-title">조회정보</h4>
                  </v-col>

                  <!-- 시작일 -->
                  <v-col cols="3" lg="2" class="">
                    <v-menu
                      v-model="menu1"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="s_date"
                          label="시작일"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="s_date"
                        @input="menu1 = false"
                        :max="e_date"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>

                  <!-- 종료일 -->
                  <v-col cols="3" md="3" lg="2" class="">
                    <v-menu
                      v-model="menu2"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="e_date"
                          label="종료일"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="e_date"
                        @input="menu2 = false"
                        :min="s_date"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>

                  <v-btn class="ml-6 primary" @click="selectedDate()"
                    >조회</v-btn
                  >
                </v-row>
              </v-card-text>
            </v-card>

            <!-- 선택된 조회값 -->

            <v-row dense>
              <v-col cols="12">
                <div class="pa-0 d-flex align-center">
                  <h4 class="searchbox-title pr-4" style="white-space: nowrap">
                    조회 센서
                  </h4>

                  <v-chip-group
                    v-model="selection"
                    multiple
                    active-class="primary--text"
                  >
                    <v-chip v-for="tag in tags" :key="tag">
                      {{ tag }}
                    </v-chip>
                  </v-chip-group>
                </div>
              </v-col>
              <v-col cols="12">
                <LoadingSpinner v-if="this.isLoading"></LoadingSpinner>
                <!-- 온습도카드 -->
                <div v-if="!this.isLoading">
                  <v-card
                    class="ma-2"
                    v-if="this.selection.includes(0)"
                    :height="500"
                    elevation="4"
                  >
                    <v-card-title>
                      <div class="d-flex align-center">
                        <h3
                          class="pr-3 searchbox-title"
                          style="white-space: nowrap"
                        >
                          {{ newData[0].name }}
                        </h3>
                        <h5>
                          현재 온도:
                          {{ Data_TempHumid.nowValue_Temp }}
                          {{ Data_TempHumid[0].unit[0].unit }}
                          습도:
                          {{ Data_TempHumid.nowValue_Humid }}
                          {{ Data_TempHumid[0].unit[1].unit }}
                        </h5>

                        <v-select
                          class="ml-10"
                          size="1"
                          :items="selectSearchUnit"
                          v-model="temphumid_TimeUnit"
                          item-text="name"
                          item-value="value"
                          label="조회단위"
                          dense
                          @change="changeGraphDivision()"
                        ></v-select>
                      </div>
                    </v-card-title>
                    <v-card-text>
                      <v-row>
                        <v-col cols="12">
                          <TestGraphTemp
                            :Data_TempHumid="Data_TempHumid"
                            name="humid"
                            ref="graphtemp"
                          ></TestGraphTemp>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </div>
              </v-col>
              <v-col cols="12">
                <div v-if="!this.isLoading">
                  <!-- 양액ECPH카드 -->
                  <v-card
                    class="ma-2 pa-3"
                    v-if="this.selection.includes(1)"
                    elevation="4"
                  >
                    <v-card-title>
                      <h3 class="searchbox-title" style="white-space: nowrap">
                        {{ newData[1].name }}
                      </h3>
                    </v-card-title>
                    <v-card-text>
                      <TestGraphWater
                        :Data_Water="Data_Water"
                        name="ECPH"
                      ></TestGraphWater>
                    </v-card-text>
                  </v-card>
                </div>
              </v-col>
            </v-row>
            <!-- MonitoringGraph내용 -->
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
    <!-- 제어 다이아로그 -->
    <v-dialog v-model="control_modal" max-width="1300">
      <v-card>
        <v-card-title>
          <span>{{ roomName_control }}</span>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-card-text>
          <v-col align-self="center">
            <v-data-table
              :headers="headers_bala"
              :items="bala_data"
              hide-default-footer
              class="elevation-1"
              dense
              fixed-header
              height="650"
            >
              <template v-slot:[`item.currentStatus`]="{ item }">
                <div
                  class="mr-1"
                  :class="{
                    on: item.currentStatus === 'ON',
                    off: item.currentStatus === 'OFF',
                  }"
                ></div>
              </template>
              <template v-slot:[`item.controlStatus`]="{ item }">
                <v-btn-toggle mandatory v-model="item.controlStatus" disabled>
                  <v-btn
                    color="green"
                    text
                    @click="openMemoModal('control', item, 'ON')"
                    value="ON"
                    dense
                    :loading="item.loadBtn"
                  >
                    <p class="pa-0 ma-0">on</p>
                  </v-btn>

                  <v-btn
                    color="red "
                    text
                    value="OFF"
                    @click="openMemoModal('control', item, 'OFF')"
                    dense
                    :loading="item.loadBtn"
                  >
                    <p class="pa-0 ma-0">off</p>
                  </v-btn>

                  <v-btn
                    color="blue"
                    text
                    value="AUTO"
                    @click="openMemoModal('control', item, 'AUTO')"
                    dense
                    :loading="item.loadBtn"
                  >
                    <p class="pa-0 ma-0">auto</p>
                  </v-btn>
                </v-btn-toggle>
              </template>
              <template v-slot:[`item.repeatPeriod`]="{ item }">
                <div v-if="item.repeatPeriod != null" style="width: 50px">
                  <v-text-field
                    prefix="일"
                    type="number"
                    :max="99"
                    :min="0"
                    v-model="item.repeatPeriod"
                    reverse
                    readonly
                    @click="changePeriodValue(item)"
                  ></v-text-field>
                </div>
                <div v-else style="width: 50px">-</div>
              </template>
              <!-- 시간설정 -->
              <template v-slot:[`item.setting`]="{ item }">
                <!-- LED부분 -->
                <div
                  class="d-flex justify-end justify-sm-space-between align-center"
                  v-if="
                    item.equipmentType == 'LED' ||
                    item.equipmentType == 'WDP' ||
                    item.equipmentType == 'WSP'
                  "
                >
                  <table>
                    <tr v-if="item.details.length == 0">
                      <td>
                        <span> 세팅정보가 없습니다. 추가해주세요 </span>
                      </td>
                    </tr>
                    <tr
                      v-for="(data, index) in item.details"
                      :key="index + data.startTime"
                    >
                      <td>
                        <form
                          class="d-flex justify-end justify-sm-space-between align-center"
                        >
                          <input
                            @change="
                              changeValue(
                                data,
                                item.equipmentName + '_s_' + index
                              )
                            "
                            :ref="item.equipmentName + '_s_' + index"
                            class="py-1"
                            type="time"
                            v-model="data.startTime"
                            :readonly="!item.modifiedBtn"
                          />
                          <input
                            @change="
                              changeValue(
                                data,
                                item.equipmentName + '_e_' + index
                              )
                            "
                            :ref="item.equipmentName + '_e_' + index"
                            class="py-1"
                            type="time"
                            v-model="data.endTime"
                            :readonly="!item.modifiedBtn"
                          />
                          <v-btn
                            small
                            icon
                            @click="deleteSettingData(item, index)"
                            v-if="item.modifiedBtn"
                          >
                            <v-icon>mdi-minus-box-outline</v-icon>
                          </v-btn>
                        </form>
                      </td>
                    </tr>
                  </table>
                  <div class="d-flex flex-column">
                    <v-btn
                      class="ml-1 mr-1"
                      v-if="!item.modifiedBtn"
                      @click="editValue(item, 'edit')"
                      >수정</v-btn
                    >
                    <v-btn
                      class="ml-1 mr-1 my-1"
                      v-if="item.modifiedBtn"
                      @click="openMemoModal('setting', item, null)"
                      small
                      >저장</v-btn
                    >
                    <v-btn
                      class="ml-1 mr-1 my-1"
                      v-if="item.modifiedBtn"
                      @click="editValue(item, 'add')"
                      small
                      >추가</v-btn
                    >

                    <v-btn
                      class="ml-1 mr-1 my-1"
                      v-if="item.modifiedBtn"
                      @click="cancelChangeValue(item)"
                      small
                      >취소</v-btn
                    >
                  </div>
                </div>
                <!--가습기부분 -->
                <div
                  class="d-flex justify-end justify-sm-space-between align-center"
                  v-if="
                    item.equipmentType == 'HUM' || item.equipmentType == 'ACF'
                  "
                >
                  <table>
                    <tr v-if="item.details.length == 0">
                      <td>
                        <span> 세팅정보가 없습니다. 추가해주세요 </span>
                      </td>
                    </tr>
                    <tr
                      v-for="(data, index) in item.details"
                      :key="index + data.startTime"
                    >
                      <td>
                        <form
                          class="d-flex justify-end justify-sm-space-between align-center flex-wrap flex-sm-nowrap"
                        >
                          <div
                            class="d-flex justify-end justify-sm-space-between align-center flex-nowrap"
                          >
                            <input
                              @change="
                                changeValue(
                                  data,
                                  item.equipmentName + '_s_' + index
                                )
                              "
                              :ref="item.equipmentName + '_s_' + index"
                              type="time"
                              v-model="data.startTime"
                              :readonly="!item.modifiedBtn"
                            />
                            <input
                              @change="
                                changeValue(
                                  data,
                                  item.equipmentName + '_e_' + index
                                )
                              "
                              :ref="item.equipmentName + '_e_' + index"
                              type="time"
                              v-model="data.endTime"
                              :readonly="!item.modifiedBtn"
                            />
                          </div>
                          <div
                            class="d-flex justify-end justify-sm-space-between flex-nowrap"
                          >
                            <div width="20">
                              <v-text-field
                                dense
                                v-model="data.minValue"
                                min="1"
                                max="100"
                                type="number"
                                prefix="%"
                                @change="changeValue(item)"
                                :readonly="!item.modifiedBtn"
                                reverse
                                class="setting_text_width"
                              >
                              </v-text-field>
                            </div>

                            <span class="px-4">~</span>
                            <v-text-field
                              dense
                              min="1"
                              max="100"
                              type="number"
                              prefix="%"
                              v-model="data.maxValue"
                              @change="changeValue(item)"
                              :readonly="!item.modifiedBtn"
                              reverse
                              class="setting_text_width"
                            ></v-text-field>
                            <v-btn
                              small
                              icon
                              @click="deleteSettingData(item, index)"
                              v-if="item.modifiedBtn"
                            >
                              <v-icon>mdi-minus-box-outline</v-icon>
                            </v-btn>
                          </div>
                        </form>
                      </td>
                    </tr>
                  </table>
                  <div class="d-flex flex-column">
                    <v-btn
                      class="ml-1 mr-1"
                      v-if="!item.modifiedBtn"
                      @click="editValue(item)"
                      >수정</v-btn
                    >

                    <v-btn
                      class="ml-1 mr-1 my-1"
                      v-if="item.modifiedBtn"
                      @click="openMemoModal('setting', item, null)"
                      small
                      >저장</v-btn
                    >
                    <v-btn
                      class="ml-1 mr-1 my-1"
                      v-if="item.modifiedBtn"
                      @click="editValue(item, 'add')"
                      small
                      >추가</v-btn
                    >
                    <v-btn
                      class="ml-1 mr-1 my-1"
                      v-if="item.modifiedBtn"
                      @click="cancelChangeValue(item)"
                      small
                      >취소</v-btn
                    >
                  </div>
                </div>

                <!-- 에어컨부분 -->
                <div
                  class="d-flex justify-end justify-sm-space-between align-center"
                  v-if="item.equipmentType == 'ACN'"
                >
                  <table>
                    <tr v-if="item.details.length == 0">
                      <td>
                        <span> 세팅정보가 없습니다. 추가해주세요 </span>
                      </td>
                    </tr>
                    <tr
                      v-for="(data, index) in item.details"
                      :key="index + data.startTime"
                    >
                      <td>
                        <form
                          class="d-flex align-center justify-end justify-sm-space-between flex-wrap flex-sm-nowrap"
                        >
                          <div
                            class="d-flex align-center justify-end justify-sm-space-between flex-nowrap"
                          >
                            <input
                              @change="
                                changeValue(
                                  data,
                                  item.equipmentName + '_s_' + index
                                )
                              "
                              :ref="item.equipmentName + '_s_' + index"
                              type="time"
                              v-model="data.startTime"
                              :readonly="!item.modifiedBtn"
                            />
                            <input
                              @change="
                                changeValue(
                                  data,
                                  item.equipmentName + '_e_' + index
                                )
                              "
                              :ref="item.equipmentName + '_e_' + index"
                              type="time"
                              v-model="data.endTime"
                              :readonly="!item.modifiedBtn"
                            />
                          </div>
                          <div
                            class="d-flex align-center justify-end justify-sm-space-between flex-nowrap"
                          >
                            <div width="20">
                              <v-text-field
                                dense
                                v-model="data.minValue"
                                min="1"
                                max="100"
                                type="number"
                                prefix="°C"
                                @change="changeValue(item)"
                                :readonly="!item.modifiedBtn"
                                reverse
                                class="setting_text_width"
                              >
                              </v-text-field>
                            </div>

                            <span class="px-4">~</span>
                            <v-text-field
                              dense
                              min="1"
                              max="100"
                              type="number"
                              prefix="°C"
                              v-model="data.maxValue"
                              @change="changeValue(item)"
                              :readonly="!item.modifiedBtn"
                              reverse
                              class="setting_text_width"
                            ></v-text-field>
                            <v-btn
                              small
                              icon
                              @click="deleteSettingData(item, index)"
                              v-if="item.modifiedBtn"
                            >
                              <v-icon>mdi-minus-box-outline</v-icon>
                            </v-btn>
                          </div>
                        </form>
                      </td>
                    </tr>
                  </table>

                  <div class="d-flex flex-column">
                    <v-btn
                      class="ml-1 mr-1"
                      v-if="!item.modifiedBtn"
                      @click="editValue(item)"
                      >수정</v-btn
                    >

                    <v-btn
                      class="ml-1 mr-1 my-1"
                      v-if="item.modifiedBtn"
                      @click="openMemoModal('setting', item, null)"
                      small
                      >저장</v-btn
                    >
                    <v-btn
                      class="ml-1 mr-1 my-1"
                      v-if="item.modifiedBtn"
                      @click="editValue(item, 'add')"
                      small
                      >추가</v-btn
                    >
                    <v-btn
                      class="ml-1 mr-1 my-1"
                      v-if="item.modifiedBtn"
                      @click="cancelChangeValue(item)"
                      small
                      >취소</v-btn
                    >
                  </div>
                </div>
              </template>
              <template v-slot:[`item.alarm`]="{ item }">
                <v-btn text @click="openAlarmSetting(item)">
                  <v-icon dark> mdi-cog </v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-col>
        </v-card-text>
        <v-card-actions>
          <v-col class="text-right">
            <v-btn color="primary" text @click="closeControlModal">
              닫기
            </v-btn>
          </v-col>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 알람설정 -->
    <v-dialog v-model="alarm_modal" persistent max-width="650px">
      <v-card>
        <v-card-title>
          <span>
            {{ roomName_alarm }}
          </span>
        </v-card-title>
        <v-card-text>
          <v-row class="mt-2" dense align="center">
            <v-col cols="12">
              <v-row dense align="center">
                <v-col cols="2">
                  <v-chip class="" color="warning"> 주의 </v-chip>
                </v-col>
                <v-col cols="2">
                  <v-text-field
                    type=""
                    label="AUTO 30"
                    v-model="warning_alarm.min"
                    outlined
                    color
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="2">
                  <v-text-field
                    type=""
                    label="AUTO 50"
                    v-model="warning_alarm.max"
                    outlined
                    color
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-checkbox
                    label="사용여부"
                    v-model="warning_alarm.useYN"
                    dense
                  ></v-checkbox>
                </v-col>
                <v-col cols="3">
                  <v-checkbox
                    label="Push사용"
                    v-model="warning_alarm.pushYN"
                    dense
                  ></v-checkbox>
                </v-col>
              </v-row>
              <v-row dense align="center">
                <v-col cols="2">
                  <v-chip class="" color="error"> 경고 </v-chip>
                </v-col>
                <v-col cols="2">
                  <v-text-field
                    type=""
                    label="주의 20"
                    v-model="error_alarm.min"
                    outlined
                    color
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="2">
                  <v-text-field
                    type=""
                    label="주의 70"
                    v-model="error_alarm.max"
                    outlined
                    color
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-checkbox
                    label="사용여부"
                    v-model="error_alarm.useYN"
                    dense
                  ></v-checkbox>
                </v-col>
                <v-col cols="3">
                  <v-checkbox
                    label="Push사용"
                    v-model="error_alarm.pushYN"
                    dense
                  ></v-checkbox>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-col class="text-right">
            <v-btn text color="success" @click="saveAlarmSetting">저장 </v-btn>
            <v-btn text color="primary" @click="closeAlarmSetting">닫기 </v-btn>
          </v-col>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 에어컨 설정 -->
    <v-dialog v-model="airCon_modal" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">에어컨 설정정보</v-card-title>
        <v-card-text class="align-center">
          <v-btn-toggle mandatory v-model="airCon_mode">
            <v-btn text color="blue" value="cool"> 냉방 </v-btn>
            <v-btn text color="red" value="heat"> 난방 </v-btn>
          </v-btn-toggle>
          <v-text-field
            label="온도"
            type="number"
            v-model="airCon_val"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click.native="changeAirConStatus">전송</v-btn>
          <v-btn color="primary" @click.native="closeAirConModal">취소</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 메모 입력 -->
    <v-dialog v-model="memo_modal" persistent max-width="650">
      <v-card>
        <v-card-title class="headline">메모 작성</v-card-title>
        <v-card-text class="align-center">
          <v-textarea
            label="메모입력"
            v-model="memo_text"
            outlined
            maxlength="100"
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" @click.native="okModal()">확인</v-btn>
          <v-btn text color="success" @click.native="memo_modal = false"
            >취소</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 주기설정 -->
    <v-dialog v-model="period_modal" persistent max-width="350">
      <v-card>
        <v-card-title class="headline">주기 설정</v-card-title>
        <v-card-text>
          <v-row dense>
            <v-col offset="8" cols="4">
              <v-text-field
                label="설정주기"
                type="number"
                :min="0"
                :max="99"
                v-model.number="period_data.repeatPeriod"
                reverse
                prefix="일"
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="text-right">
              <span>
                현재시간이 설정시간전일 경우 금일 실행되고
                <v-spacer></v-spacer>
                {{ addData(period_data.repeatPeriod) }}부터
                실행예정입니다.</span
              >
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="period_modal = false">취소</v-btn>
          <v-btn color="primary" @click="savePeriodValue">저장</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import _ from "lodash";

import LoadingSpinner from "./Loading/LodingSpinner.vue"; // 로딩스피너
import axios from "axios";
import cfg from "./Config";

import * as api from "@/api/index.js";
import Data from "@/data/Data.json";

import TestGraphTemp from "./TestGraphTemp.vue";
import TestGraphWater from "./TestGraphWater.vue";
import RoomInfo from "./Monitoring/RoomInfo.vue";

import { mapGetters } from "vuex";

const data = Data;
let weatherFn;

export default {
  name: "MESFE2Monitoring",
  components: {
    LoadingSpinner,
    TestGraphTemp,
    TestGraphWater,
    RoomInfo,
  },
  data() {
    return {
      period_data: "",
      period_modal: false,
      airCon_modal: false,
      airCon_mode: "heat",
      airCon_val: 0,
      airCon_data: "",
      // 외부센서로딩
      roomName_control: "",
      // items: [
      //   { title: "알람이력1" },
      //   { title: "알람이력2" },
      //   { title: "알람이력3" },
      // ],
      headers_bala: [
        {
          text: "이름",
          align: "center",
          sortable: false,
          value: "equipmentName",
          width: "4%",
        },
        {
          text: "상태",
          value: "currentStatus",
          sortable: false,
          width: "2%",
          align: "center",
        },
        {
          text: "제어상태",
          value: "controlStatus",
          sortable: false,
          width: "2%",
          align: "center",
        },
        {
          text: "주기",
          value: "repeatPeriod",
          sortable: false,
          width: "4%",
          align: "center",
        },

        { text: "상세설정", value: "setting", width: "15%", align: "center" },
        { text: "알람설정", value: "alarm", width: "1%", align: "center" },
      ],

      loader: null,
      loading: false,
      loading2: false,
      loading3: false,
      loading4: false,
      loading5: false,
      selectSearchUnit: [
        { name: "1분", value: "1M" },
        { name: "5분", value: "5M" },
        { name: "1시간", value: "1H" },
      ],
      temphumid_TimeUnit: "1H",

      // 외부센서로딩
      // MonitoringGraph
      // 데이터기다리기
      isLoading: true,
      // 데이터기다리기
      // 온습도데이터
      Data_TempHumid: [
        {
          name: "온/습도",
          value: [],
          startDate: "",
          endDate: "",
          nowValue_Temp: 0,
          nowValue_Humid: 0,
          unit: [
            { name: "온도", unit: "°C" },
            { name: "습도", unit: "%" },
          ],
        },
      ],
      Data_Water: [
        {
          name: "양액pH/EC",
          value: "",
          startDate: "",
          endDate: "",
          nowValue: "",
        },
      ],
      // 온습도데이터
      // chip
      tags: ["온/습도", "양액pH/EC"],
      // chip
      //datepicker
      date: new Date().toISOString().substr(0, 10),
      s_date: new Date().toISOString().substr(0, 10),
      e_date: new Date().toISOString().substr(0, 10),
      menu1: false,
      menu2: false,
      //datepicker
      //  checkbox
      selected: ["온/습도", "양액pH/EC"],
      //  checkbox

      selection: [0, 1],
      newData: [
        {
          name: "온/습도",
          value: "",
          startDate: "",
          endDate: "",
          nowValue: "",
        },

        {
          name: "양액pH/EC",
          value: "",
          startDate: "",
          endDate: "",
          nowValue: "",
        },
      ],

      // MonitoringGraph
      //다이아로그
      dialog: false,
      control_modal: false,
      alarm_modal: false,
      notifications: false,
      sound: true,
      widgets: false,
      //다이아로그
      // 현재온습도
      nowTemp: 0,
      nowHumid: 0,
      cards: [],
      // 현재온습도
      yes: false,
      data,
      selectedSection: "육묘실", // 1.구역 디폴트값 육묘실
      selectSection: ["육묘실", "활착실", "발아실"], // 2.구역선택,
      solarRadiation: "",
      modifiedDate: "",
      rainfall: "",
      windDirection: "",
      windSpeed: "",
      outdoorTemperature: "",
      outdoorHumidity: "",
      outdoorSensor: [
        //5.외부센서,측정값
        {
          sensorname: "일사량",
          value: "-",
          unit: "kWh/m2",
        },
        {
          sensorname: "강수량",
          value: "-",
          unit: "",
        },
        {
          sensorname: "풍속(남북)",
          value: "-",
          unit: "m/s",
        },
        {
          sensorname: "풍향/풍속",
          value: "-",
          unit: "",
        },
        {
          sensorname: "온도",
          value: "-",
          unit: "°C",
        },
        {
          sensorname: "습도",
          value: "-",
          unit: "%",
        },

        //외부센서 측정값
      ],
      showSection: 1, //1,2,3에 따라 섹션 라우터 변경함
      sectionNum: 1,
      section: "육묘실",
      logs: [],
      status: "disconnected",
      // 웹소켓
      socket: null,
      message: "",
      receivedMessage: [],
      textarea: "",
      socketId: "",
      bala_data: [],
      roomName_alarm: "",
      roomID: "",
      warning_alarm: {
        min: 0,
        max: 0,
        useYN: true,
        pushYN: false,
      },
      error_alarm: {
        min: 0,
        max: 0,
        useYN: true,
        pushYN: false,
      },
      ControlModal_currentVal: "",
      detailData_before: "",

      // memo
      memo_modal: false,
      memo_version: "",
      memo_text: "",
      temp_save_item: null,
      temp_save_status: null,
    };
  },

  mounted() {
    this.getOutDoor();

    weatherFn = setInterval(() => {
      this.getOutDoor();
    }, 60 * 1000);
    this.BeforeWeeks;
    //this.getEquipMentInFormation();
    console.log("템프휴미드", this.Data_TempHumid[0].unit[0].unit);

    api.smartfarm.getRoomData().then((res) => {
      console.log("getRoomData", res);
      this.cards = res.data.responseData;
    });
  },
  destroyed() {
    clearInterval(weatherFn);
  },
  watch: {
    loader() {
      const l = this.loader;
      this[l] = !this[l];

      setTimeout(() => (this[l] = false), 200);

      this.loader = null;
    },
  },
  async created() {
    //this.cards = Object.assign({}, cfg.data.monitorData);
    var ws = new WebSocket("ws://14.47.96.237:8081/ws");
    this.socket = ws;
    console.log("웹소켓확인", ws);
    //이벤트 헨들러
    ws.onopen = function () {
      // console.log('[open] 커넥션이 만들어졌습니다.');
      var item = {
        api: "roomValue",
        method: "add",
        parameters: {},
      };
      ws.send(JSON.stringify(item));
    };
    let vue_this = this;
    let obj;
    ws.onmessage = function (event) {
      if (event !== null && event !== undefined) {
        obj = JSON.parse(event.data);
        if (obj.api == "roomValue") {
          vue_this.cards = obj.data[0];
        }
      }
    };
    ws.onclose = (evt) => {
      console.log(evt);
    };
    ws.onerror = (evt) => {
      console.log(evt);
    };
    // 보내는 코드
  },

  methods: {
    deleteSettingData(item, index) {
      this.$swal
        .fire({
          title: "삭제",
          text: "해당 세팅데이터를 삭제하시겠습니까?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "삭제",
        })
        .then((result) => {
          if (result.isConfirmed) {
            return item.details.splice(index, 1);
          }
        });
    },
    openControlModal(data) {
      let reqData = {
        roomId: data.roomId,
      };
      this.ControlModal_currentVal = reqData.roomId;
      api.smartfarm.getRoomContoller(reqData).then((res) => {
        console.log("getRoomContoller", res.data.responseData);
        res.data.responseData.forEach((element) => {
          element.modifiedBtn = false;
          element.loadBtn = false;

          // element.details.forEach((el_sub) => {
          //   el_sub.modifiedBtn = false;
          //   el_sub.loadBtn = false;
          // });
        });
        this.bala_data = res.data.responseData;
        this.roomName_control = data.roomName;
        this.control_modal = true;
      });
    },
    getRoomData() {
      api.smartfarm.getRoomData().then((res) => {
        console.log("getRoomData", res);
        this.cards = res.data.responseData;
      });
    },
    openAlarmSetting(roomData) {
      this.roomName_alarm = roomData.roomName;
      this.alarm_modal = true;
    },
    saveAlarmSetting() {
      this.closeAlarmSetting();
    },
    closeAlarmSetting() {
      this.alarm_modal = false;
    },
    closeControlModal() {
      this.control_modal = false;
      this.bala_data = [];
      this.roomName_control = "";
    },
    clickChangeStatus(item, status, memo) {
      console.log("clickChangeStatus", item, status);

      // openMemoModal에서 체크함
      // if (item.controlStatus === status) {
      //   return false;
      // }

      let req_data = {
        equipmentId: item.equipmentId,
        controlStatus: status,
        memo: memo,
      };

      if (item.equipmentName === "에어컨" && status == "ON") {
        this.airCon_modal = true;
        //item.loadBtn = true;
        this.airCon_data = item;
        this.airCon_val = item.settingTemperature;
        this.airCon_mode = item.acType;
        //this.getDeviceList();
        return false;
      }

      this.editStatus(req_data);
      return;
    },
    changeAirConStatus() {
      let req_data = {
        equipmentId: this.airCon_data.equipmentId,
        controlStatus: "ON",
        acType: this.airCon_mode,
        settingTemperature: this.airCon_val,
      };

      this.editStatus(req_data);
      this.closeAirConModal();
    },
    closeAirConModal() {
      this.airCon_modal = false;
      this.airCon_val = 0;
      this.airCon_mode = "";
      this.getDeviceList();
    },
    // 가습기 숫자입력 0~100
    changeValue(item, id) {
      let html = this.$refs[id];
      console.log("changeValue", html, id);

      item.modifiedBtn = true;
      item.modifiedText = false;
      item.timeChecker = false;
      //최저습도는 최고습도보다 높을수없음.
      if (item.equipmentName == "가습기") {
        if (item.maxValue < item.minValue) {
          item.minValue = 0;
        } else if (item.minValue > 100) {
          var editedMinNum = item.minValue.substr(0, 2);
          item.minValue = editedMinNum;
          // item.minValue = 100;
        } else if (item.minValue < 0) {
          item.minValue = 0;
        } else if (item.maxValue > 100) {
          var editedMaxNum = item.maxValue.substr(0, 2);
          item.maxValue = editedMaxNum;
        }
      }
    },
    //시간설정 수정할때
    editValue(item, type) {
      item.modifiedBtn = true;

      if (type == "add") {
        return item.details.push({
          startTime: "00:00",
          endTime: "00:00",
          minValue: "ON",
          maxValue: "ON",
        });
      }

      if (type == "edit") {
        return (this.detailData_before = Object.assign({}, item.details));
      }
    },
    openMemoModal(mode, item, status) {
      if (mode == "control") {
        if (item.controlStatus === status) return;
      }
      this.memo_text = "";
      this.memo_modal = true;
      this.memo_version = mode;
      this.temp_save_item = item;
      this.temp_save_status = status;
    },
    okModal() {
      if (this.memo_version == "control")
        this.clickChangeStatus(
          this.temp_save_item,
          this.temp_save_status,
          this.memo_text
        );
      else if (this.memo_version == "setting")
        this.saveChangeValue(this.temp_save_item, this.memo_text);
      else console.log("???");
      this.memo_modal = false;
      this.memo_version = "";
      this.temp_save_item = null;
      this.temp_save_status = null;
    },
    saveChangeValue(item, memo) {
      let req_data = {
        equipmentId: item.equipmentId,
        details: item.details,
        memo: memo,
      };

      let validationYN_date = true;
      let validationYN_val = true;

      req_data.details.forEach((el) => {
        if (el.startTime > el.endTime) {
          validationYN_date = false;
          return false;
        }

        if (el.equipmentType == "LED" || el.equipmentType == '"ACF"') {
          if (el.startTime > el.endTime) {
            validationYN_val = false;
            return false;
          }
        }
      });

      if (!validationYN_date) {
        //날짜확인
        return this.$swal({
          title: "날짜를 다시 확인해주세요",
          icon: "error",
          position: "top",
          showCancelButton: false,
          showConfirmButton: false,
          toast: true,
          timer: 1500,
        });
      }

      if (!validationYN_val) {
        //값확인.
        return this.$swal({
          title: "세팅값을 다시 확인해주세요",
          icon: "error",
          position: "top",
          showCancelButton: false,
          showConfirmButton: false,
          toast: true,
          timer: 1500,
        });
      }

      if (validationYN_val && validationYN_date) {
        api.smartfarm
          .editEquipmentSetting(req_data)
          .then((res) => {
            console.log("성공");
            if (res.status == 200) {
              this.getDeviceList();
            } else {
              this.getDeviceList();
            }
          })
          .catch((error) => {
            console.log("실패");
            this.getDeviceList();
          });
      }
    },
    cancelChangeValue(item) {
      console.log(
        "cancelChangeValue",
        Object.entries(this.detailData_before).toString() ===
          Object.entries(item.details).toString()
      );
      //Object.entries(this.detailData_before).toString() === Object.entries(item.details).toString();

      let compareVal =
        Object.entries(this.detailData_before).toString() ===
        Object.entries(item.details).toString();

      if (!compareVal) {
        return this.$swal
          .fire({
            title: "확인",
            text: "변경된 데이터가 있습니다. 취소하시겠습니까?",
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "취소",
          })
          .then((result) => {
            if (result.isConfirmed) {
              return (item.modifiedBtn = false);
            }
          });
      } else {
        return (item.modifiedBtn = false);
      }
    },

    // 제어상태변경 api입니다
    async editStatus(item) {
      console.log("제어상태변경api", item);
      let dataIndex = this.bala_data.findIndex(
        (i) => i.equipmentId == this.airCon_data.equipmentId
      );
      //this.bala_data[dataIndex].loadBtn = true;

      await api.smartfarm
        .editEquipmentCtrl(item)
        .then((response) => {
          console.log("editEquipmentCtrl", response.status, this);

          if (response.status == 200) {
            //
            this.getDeviceList();
          } else {
            this.$swal({
              title: "상태변경이 실패되었습니다.",
              icon: "error",
              position: "top",
              showCancelButton: false,
              showConfirmButton: false,
              toast: true,
              timer: 1500,
            });
            // this.bala_data[dataIndex].loadBtn = false;
            this.getDeviceList();
          }
        })
        .catch((error) => {
          console.log(error);
          this.getDeviceList();
        });
    },
    getDeviceList() {
      let reqData = {
        roomId: this.ControlModal_currentVal,
      };
      api.smartfarm.getRoomContoller(reqData).then((res) => {
        console.log("getRoomContoller", res.data.responseData);
        res.data.responseData.forEach((element) => {
          element.modifiedBtn = false;
          element.loadBtn = false;
        });
        this.bala_data = res.data.responseData;
      });
      // getEquipmentInfo()
      //   .then((response) => {
      //     // 발아/활착실 바인딩
      //     console.log("showcontroll의 리스폰스", response);
      //     let balaResult = _.filter(response.data.responseData, {
      //       room: "발아/활착실",
      //     });
      //     console.log("balaResult", balaResult);
      //     let nurResult = _.filter(response.data.responseData, {
      //       room: "육묘실",
      //     });
      //     console.log("맨처음 api 성공", balaResult, nurResult);
      //     balaResult.forEach((element) => {
      //       element.modifiedBtn = false;
      //     });

      //     nurResult.forEach((element) => {
      //       element.modifiedBtn = false;
      //     });

      //     this.bala_data = balaResult;
      //     this.nur_data = nurResult;
      //   })
      //   .catch((error) => {
      //     console.log("api통신 실패");
      //     console.log(error);
      //   });
    },
    onChange() {
      console.log("선택된구역", this.selectedSection);
    },
    // 기상센서 api 호출 전 데이터초기화
    resetOutDoorValue() {
      for (var i = 0; i < this.outdoorSensor.length; i++) {
        this.outdoorSensor[i].value = "-";
      }
    },
    // 기상센서 api 호출 전 데이터초기화

    // 기상센서api
    getOutDoor() {
      this.resetOutDoorValue();
      let baseTime = 0;
      let date = new Date();
      let pty_code = [
        "없음",
        "비",
        "비/눈",
        "눈",
        "빗방울",
        "빗방울눈날림",
        "눈날림",
      ];

      if (date.getMinutes() < 30) {
        baseTime = `${(date.getHours() - 1).toString().padStart(2, "0")}59`;
      } else {
        baseTime = `${date.getHours().toString().padStart(2, "0")}${date
          .getMinutes()
          .toString()
          .padStart(2, "0")}`;
      }

      if (date.getHours() == 0 && date.getMinutes() < 30) {
        baseTime = `2359`;
      }

      console.log("baseTime", baseTime);

      let baseDate = `${date.getFullYear()}${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}${
        baseTime == 23
          ? (date.getDate() - 1).toString().padStart(2, "0")
          : date.getDate().toString().padStart(2, "0")
      }`; //금일. //padStart = 빈값을 0으로 대체
      console.log(baseDate);
      let reqData = {
        ServiceKey:
          "wj8ZRg3W8rO130Cl7eOUkJQ9Xq6OMen3Qwt7BhjXS0JoMz33mL3PXGeQddnGZJM80yO77v7paxo2H5hFtSHkCw==",
        pageNo: encodeURIComponent(1),
        numOfRows: encodeURIComponent(36), //12시간의 데이터= 1시간
        dataType: encodeURIComponent("JSON"),
        base_date: encodeURIComponent(baseDate),
        base_time: encodeURIComponent(baseTime),
        nx: encodeURIComponent("62"),
        ny: encodeURIComponent("119"),
      };
      axios
        .get(
          "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst",
          {
            headers: { "Content-Type": "text/xml;charset=UTF-8" },
            params: reqData,
          }
        )
        .then((res) => {
          console.log(res);

          if (res.data.response.body === undefined) {
            this.getOutDoor();
            return;
          }

          console.log(res.data.response.body.items);
          var Arr = res.data.response.body.items.item;

          var Out_RainFall = _.filter(Arr, { category: "RN1" });
          console.log("강수량", Out_RainFall[0].obsrValue);
          this.outdoorSensor[1].value = Out_RainFall[0].obsrValue;
          let Out_RainType = _.filter(Arr, { category: "PTY" });
          let Out_RainFall_str = "";
          switch (Out_RainFall) {
            case Out_RainFall < 1:
              Out_RainFall_str = "1.0mm미만";
              break;
            case 30:
              Out_RainFall_str = "30.0~50.0mm";
              break;
            case 50:
              Out_RainFall_str = "50.0mm이상";
              break;
            default:
              Out_RainFall_str = `${Out_RainFall[0].obsrValue}mm`;
          }
          this.outdoorSensor[1].value = `${Out_RainFall_str} (${
            pty_code[Out_RainType[0].obsrValue]
          })`;

          var Out_Humid = _.filter(Arr, { category: "REH" });
          console.log("습도", Out_Humid[0].obsrValue);
          this.outdoorSensor[5].value = Out_Humid[0].obsrValue;

          var Out_Temp = _.filter(Arr, { category: "T1H" });
          console.log("온도", Out_Temp[0].obsrValue);
          this.outdoorSensor[4].value = Out_Temp[0].obsrValue;

          var Out_WindSpeed_South = _.filter(Arr, { category: "VVV" });
          console.log("남북쪽풍속", Out_WindSpeed_South[0].obsrValue);
          console.log("남북쪽풍속", Out_WindSpeed_South);
          this.outdoorSensor[2].value = Out_WindSpeed_South[0].obsrValue;

          var Out_WindDirection = _.filter(Arr, { category: "VEC" });
          var Out_WindSpeed = _.filter(Arr, { category: "WSD" });

          //(풍향값 + 22.5 * 0.5) / 22.5)
          this.outdoorSensor[3].value = Math.floor(
            (parseInt(Out_WindDirection[0].obsrValue) + 22.5 * 0.5) / 22.5
          );
          // console.log(
          //   "outdoorSensor",
          //   this.outdoorSensor[3].value,
          //   cfg.data.windDirectionData
          // );

          this.outdoorSensor[3].value = cfg.data.windDirectionData.filter(
            (el) => {
              return el.val === this.outdoorSensor[3].value;
            }
          );
          //console.log(this.outdoorSensor[3].value);
          this.outdoorSensor[3].value = this.outdoorSensor[3].value[0].DI;
          this.outdoorSensor[3].value = `${this.outdoorSensor[3].value} ${Out_WindSpeed[0].obsrValue}m/s`;
          //console.log(cfg.data.windDirectionData);
        });
    },
    // 기상센서api
    // 시작일을 일주일전으로
    BeforeWeeks() {
      let nowDate = new Date();
      let weekDate = nowDate.getTime() - 7 * 24 * 60 * 60 * 1000;
      nowDate.setTime(weekDate);

      let weekYear = nowDate.getFullYear();
      let weekMonth = nowDate.getMonth() + 1;
      let weekDay = nowDate.getDate();

      if (weekMonth < 10) {
        weekMonth = "0" + weekMonth;
      }
      if (weekDay < 10) {
        weekDay = "0" + weekDay;
      }

      let resultDate = weekYear + "-" + weekMonth + "-" + weekDay;
      this.s_date = resultDate;
      console.log(resultDate);
    },
    async openDialog(data) {
      console.log("openDialog", data);
      this.dialog = true;
      this.section = data.roomName;
      this.roomID = data.roomId;
      await this.selectedDate();
    },
    closeDialog() {
      this.dialog = false;
    },
    // 시작일을 일주일전으로
    //  MonitoringGraph

    // 병수선임님이 알려준 비동기 api여러개 처리법
    selectedDate() {
      this.isLoading = true;

      let p1 = this.getGraphTempData();
      let p2 = this.getGraphWaterData();

      let p3 = this.getCurrntTempHumidData();

      Promise.all([p1, p2, p3])
        .then((values) => {
          console.log(values);
          this.isLoading = false;
        })
        .catch((error) => {
          console.log(error.message);
          this.isLoading = false;
        });

      // 줄여볼수있으면줄여보기

      // 병수선임님이 알려준 비동기 api여러개 처리법
    },
    getGraphTempData() {
      let filter = {
        roomId: this.roomID,
        startDate: this.s_date,
        endDate: this.e_date,
        division: this.temphumid_TimeUnit,
      };

      return new Promise((resolve, reject) => {
        api.smartfarm.getGraphTempHumid(filter).then((res) => {
          let result = res.data.responseData;
          this.Data_TempHumid.value = result;
          this.Data_TempHumid.startDate = this.s_date;
          this.Data_TempHumid.endDate = this.e_date;
          resolve(res);
        });
      });
    },
    async changeGraphDivision() {
      let resData = await this.getGraphTempData();
      let resData2 = await this.getCurrntTempHumidData();
      console.log("changeGraphDivision", resData);
      if (resData2.data.isSuccess) {
        this.$refs.graphtemp.reloadChart();
      }
    },
    getGraphWaterData() {
      let filter = {
        roomId: this.roomID,
        startDate: this.s_date,
        endDate: this.e_date,
      };

      return new Promise((resolve, reject) => {
        api.smartfarm.getGraphWaterPhEC(filter).then((res) => {
          let result = res.data.responseData;
          this.Data_Water.value = result;
          this.Data_Water.startDate = this.s_date;
          this.Data_Water.endDate = this.e_date;
          resolve(res);
        });
      });
    },
    getCurrntTempHumidData() {
      let item = {
        roomId: this.roomID,
      };

      return new Promise((resolve, reject) => {
        api.smartfarm.temphumidValue(item).then((res) => {
          let result = res.data.responseData;
          this.Data_TempHumid.nowValue = result;
          this.Data_TempHumid.nowValue_Temp = result.temperature;
          this.Data_TempHumid.nowValue_Humid = result.humidity;
          console.log("result", this.Data_TempHumid);
          resolve(res);
        });
      });
    },
    //  MonitoringGraph
    sendRequestBody() {
      this.message = {
        api: "temphumidValue",
        method: "add",
        parameters: {
          room: "육묘실",
          section: 1,
        },
      };

      this.socket.send(JSON.stringify(this.message));
    },
    // 웹소켓
    goControllPage(data) {
      //제어페이지로 가는 api
      console.log("goControllPage", data);
      this.openControlModal(data);
    },
    goDetailRouter() {
      //조회페이지로 가는api
      console.log("섹션넘", this.sectionNum, this.section);
      this.$router.push({
        name: "MonitoringGraph",
        params: { sectionNum: this.sectionNum, section: this.section },
      });
    },

    getData() {
      this.getNowData();
    },
    getAllData() {
      this.getNowData;
      //this.getEquipMentInFormation();
    },
    getNowData() {
      var item = {
        room: "육묘실",
        section: 1,
      };
      api.smartfarm.temphumidValue(item).then((res) => {
        console.log(res);
        this.cards[0].Temperature = res.data.responseData.temperature;
        this.cards[0].Humidity = res.data.responseData.humidity;
        console.log(this.cards);
      });
      // this.getEquipMentInFormation();
    },
    // 제어항목조회
    getEquipMentInFormation() {
      api.smartfarm.getEquipmentInfo().then((res) => {
        console.log("제어항목조회", res);
        this.cards[0].LED = res.data.responseData[3].controlStatus;
        this.cards[0].humidifier = res.data.responseData[4].controlStatus;
        this.cards[0].fan = res.data.responseData[5].controlStatus;
        console.log("제어항목조회후", this.cards);
      });
    },
    changePeriodValue(data) {
      this.period_modal = true;
      console.log("data", data);
      this.period_data = Object.assign({}, data);
    },
    addData(add) {
      let date = new Date();
      date.setDate(date.getDate() + add);
      return `${date.getFullYear()}년 ${
        date.getMonth() + 1
      }월 ${date.getDate()}일`;
    },
    savePeriodValue() {
      this.period_modal = false;
      let reqData = {
        equipmentId: this.period_data.equipmentId,
        repeatPeriod: this.period_data.repeatPeriod, // 입력 안하면 기본값 1로 입력
      };
      api.smartfarm.editPeriodSetting(reqData).then((res) => {
        if (res.status == 200) {
          console.log("editPeriodSetting", res);
          this.$swal({
            title: "주기일자가 변경되었습니다.",
            icon: "success",
            position: "top",
            showCancelButton: false,
            showConfirmButton: false,
            toast: true,
            timer: 1500,
          });
          this.getDeviceList();
        }
      });

      return;
    },

    // 제어항목조회
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-text-field__details {
  display: none;
}

div {
  %circle {
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }

  .on {
    @extend %circle;
    background: greenyellow;
  }

  .off {
    @extend %circle;
    background: red;
  }
}

.setting_text_width {
  width: 60px;
}
</style>
