<template>
  <div>
    <v-container fluid>
      <v-row>
        <v-col class="ma-2" md="12">
          <v-row class="mb-2">
            <v-col md="2">
              <h4 class="searchbox-title">발아실</h4>
            </v-col>
          </v-row>

          <template>
            <v-data-table :headers="headers_bala" :items="bala_data" hide-default-footer class="elevation-1">
              <template v-slot:item.controlStatus="{ item }">
                <v-btn-toggle mandatory v-model="item.controlStatus">
                  <v-btn color="green" text @click="clickChangeStatus(item, 'ON')" value="ON">
                    <p class="pa-0 ma-0">on</p>
                  </v-btn>

                  <v-btn color="red " text value="OFF" @click="clickChangeStatus(item, 'OFF')">
                    <p class="pa-0 ma-0">off</p>
                  </v-btn>

                  <v-btn color="blue" text value="AUTO" @click="clickChangeStatus(item, 'AUTO')">
                    <p class="pa-0 ma-0">auto</p>
                  </v-btn>
                </v-btn-toggle>
              </template>
              <!-- 상태 -->
              <template v-slot:item.controlStatus="{ item }">
                <v-btn-toggle mandatory v-model="item.controlStatus">
                  <v-btn color="green" text @click="clickChangeStatus(item, 'ON')" value="ON">
                    <p class="pa-0 ma-0">on</p>
                  </v-btn>

                  <v-btn color="red " text value="OFF" @click="clickChangeStatus(item, 'OFF')">
                    <p class="pa-0 ma-0">off</p>
                  </v-btn>

                  <v-btn color="blue" text value="AUTO" @click="clickChangeStatus(item, 'AUTO')">
                    <p class="pa-0 ma-0">auto</p>
                  </v-btn>
                </v-btn-toggle>
              </template>
              <!-- 시간설정 -->
              <template v-slot:item.setting="{ item }">
                <!-- LED부분 -->
                <div class="d-flex" style="width: 500px"
                  v-if="item.equipmentName != '가습기' && item.equipmentName != '에어컨'">
                  <form>
                    <p>
                      <input @change="changeValue(item)" id="Timeinput" class="py-2" type="time"
                        v-model="item.minValue" />
                    </p>
                  </form>

                  <p class="pt-6 px-4">~</p>
                  <form>
                    <p>
                      <input @change="changeValue(item)" id="Timeinput" class="py-2" type="time"
                        v-model="item.maxValue" />
                    </p>
                  </form>

                  <v-btn class="ml-6 mt-2 mr-3" v-if="item.modifiedBtn" @click="editValue(item)">수정</v-btn>
                  <p style="font-size: 2px; color: red" class="pt-4 px-2" v-if="item.timeChecker">
                    설정시간을 확인해주세요.
                  </p>
                  <v-snackbar v-model="snackbar" :timeout="timeout">
                    {{ text }}

                    <template v-slot:action="{ attrs }">
                      <v-btn color="" text v-bind="attrs" @click="snackbar = false">
                        Close
                      </v-btn>
                    </template>
                  </v-snackbar>
                </div>
                <!--가습기부분 -->
                <div class="d-flex align-center" style="width: 500px" v-if="item.equipmentName == '가습기'">
                  <div class="" style="width: 108px">
                    <v-text-field dense v-model="item.minValue" min="1" max="100" type="number"
                      @change="changeValue(item)"></v-text-field>
                  </div>

                  <p class="pt-6 px-4">~</p>
                  <div class="" style="width: 108px">
                    <v-text-field dense min="1" max="100" type="number" v-model="item.maxValue"
                      @change="changeValue(item)"></v-text-field>
                  </div>

                  <v-btn class="ml-6 mt-2 mr-3" v-if="item.modifiedBtn" @click="editValue(item)">수정</v-btn>
                  <v-snackbar v-model="snackbar" :timeout="timeout">
                    {{ text }}

                    <template v-slot:action="{ attrs }">
                      <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
                        Close
                      </v-btn>
                    </template>
                  </v-snackbar>
                </div>
                <!-- 에어컨부분 -->
                <div class="d-flex align-center" style="width: 500px" v-if="item.equipmentName == '에어컨'">
                  <div class="d-flex align-center" style="width: 108px">
                    <v-text-field dense v-model="item.minValue" min="1" max="100" type="number"
                      @change="changeValue(item)"></v-text-field>°C
                  </div>

                  <p class="pt-6 px-4">~</p>
                  <div class="d-flex align-center" style="width: 108px">
                    <v-text-field dense min="1" max="100" type="number" v-model="item.maxValue"
                      @change="changeValue(item)"></v-text-field>°C
                  </div>

                  <v-btn class="ml-6 mt-2 mr-3" v-if="item.modifiedBtn" @click="editValue(item)">수정</v-btn>
                  <v-snackbar v-model="snackbar" :timeout="timeout">
                    {{ text }}

                    <template v-slot:action="{ attrs }">
                      <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
                        Close
                      </v-btn>
                    </template>
                  </v-snackbar>
                </div>



              </template>
            </v-data-table>
          </template>
        </v-col>
      </v-row>
      <!-- 활착실1 -->
      <v-row>
        <v-col class="ma-2" md="12">
          <v-row class="mb-2">
            <v-col md="2">
              <h4 class="searchbox-title">활착실1</h4>
            </v-col>
          </v-row>

          <template>
            <v-data-table :headers="headers_nur" :items="nur_data" hide-default-footer class="elevation-1">
              <!-- 상태 -->
              <template v-slot:item.controlStatus="{ item }">
                <v-btn-toggle mandatory v-model="item.controlStatus">
                  <v-btn color="green" text @click="clickChangeStatus(item, 'ON')" value="ON">
                    <p class="pa-0 ma-0">on</p>
                  </v-btn>

                  <v-btn color="red " text value="OFF" @click="clickChangeStatus(item, 'OFF')">
                    <p class="pa-0 ma-0">off</p>
                  </v-btn>

                  <v-btn color="blue" text value="AUTO" @click="clickChangeStatus(item, 'AUTO')">
                    <p class="pa-0 ma-0">auto</p>
                  </v-btn>
                </v-btn-toggle>
              </template>
              <!-- 시간설정 -->
              <template v-slot:item.setting="{ item }">
                <div class="d-flex" style="width: 500px"
                  v-if="item.equipmentName != '가습기' && item.equipmentName != '에어컨'">
                  <form>
                    <p>
                      <input @change="changeValue(item)" id="Timeinput" class="py-2" type="time"
                        v-model="item.minValue" />
                    </p>
                  </form>

                  <p class="pt-6 px-4">~</p>
                  <form>
                    <input @change="changeValue(item)" id="Timeinput" class="py-2" type="time"
                      v-model="item.maxValue" />
                  </form>

                  <v-btn class="ml-6 mt-2 mr-3" v-if="item.modifiedBtn" @click="editValue(item)">수정</v-btn>
                  <p style="font-size: 2px; color: red" class="pt-4 px-2" v-if="item.timeChecker">
                    설정시간을 확인해주세요.
                  </p>
                  <v-snackbar v-model="snackbar" :timeout="timeout">
                    {{ text }}

                    <template v-slot:action="{ attrs }">
                      <v-btn color="" text v-bind="attrs" @click="snackbar = false">
                        Close
                      </v-btn>
                    </template>
                  </v-snackbar>
                </div>
                <!--습도설정 -->
                <div class="d-flex align-center" style="width: 500px" v-if="item.equipmentName == '가습기'">
                  <div class="" style="width: 108px">
                    <v-text-field class="pt-4" dense v-model="item.minValue" type="number"
                      @change="changeValue(item)"></v-text-field>
                  </div>
                  <!-- 실시간으로 validation 막기 -->
                  <p class="pt-6 px-4">~</p>
                  <div class="" style="width: 108px">
                    <v-text-field class="pt-4" dense v-model="item.maxValue" type="number" single-line
                      @change="changeValue(item)"></v-text-field>
                  </div>

                  <v-btn class="ml-6 mt-2 mr-3" v-if="item.modifiedBtn" @click="editValue(item)">수정</v-btn>
                  <v-snackbar v-model="snackbar" :timeout="timeout">
                    {{ text }}

                    <template v-slot:action="{ attrs }">
                      <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
                        Close
                      </v-btn>
                    </template>
                  </v-snackbar>
                </div>
                <!-- 에어컨부분 -->
                <div class="d-flex align-center" style="width: 500px" v-if="item.equipmentName == '에어컨'">
                  <div class="d-flex align-center" style="width: 108px">
                    <v-text-field dense v-model="item.minValue" min="1" max="100" type="number"
                      @change="changeValue(item)"></v-text-field>°C
                  </div>

                  <p class="pt-6 px-4">~</p>
                  <div class="d-flex align-center" style="width: 108px">
                    <v-text-field dense min="1" max="100" type="number" v-model="item.maxValue"
                      @change="changeValue(item)"></v-text-field>°C
                  </div>

                  <v-btn class="ml-6 mt-2 mr-3" v-if="item.modifiedBtn" @click="editValue(item)">수정</v-btn>
                  <v-snackbar v-model="snackbar" :timeout="timeout">
                    {{ text }}

                    <template v-slot:action="{ attrs }">
                      <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
                        Close
                      </v-btn>
                    </template>
                  </v-snackbar>
                </div>
              </template>
            </v-data-table>
          </template>
        </v-col>
      </v-row>
      <!-- 활착실2 -->
      <v-row>
        <v-col class="ma-2" md="12">
          <v-row class="mb-2">
            <v-col md="2">
              <h4 class="searchbox-title">활착실2</h4>
            </v-col>
          </v-row>

          <template>
            <v-data-table :headers="headers_nur" :items="nur_data" hide-default-footer class="elevation-1">
              <!-- 상태 -->
              <template v-slot:item.controlStatus="{ item }">
                <v-btn-toggle mandatory v-model="item.controlStatus">
                  <v-btn color="green" text @click="clickChangeStatus(item, 'ON')" value="ON">
                    <p class="pa-0 ma-0">on</p>
                  </v-btn>

                  <v-btn color="red " text value="OFF" @click="clickChangeStatus(item, 'OFF')">
                    <p class="pa-0 ma-0">off</p>
                  </v-btn>

                  <v-btn color="blue" text value="AUTO" @click="clickChangeStatus(item, 'AUTO')">
                    <p class="pa-0 ma-0">auto</p>
                  </v-btn>
                </v-btn-toggle>
              </template>
              <!-- 시간설정 -->
              <template v-slot:item.setting="{ item }">
                <div class="d-flex" style="width: 500px"
                  v-if="item.equipmentName != '가습기' && item.equipmentName != '에어컨'">
                  <form>
                    <p>
                      <input @change="changeValue(item)" id="Timeinput" class="py-2" type="time"
                        v-model="item.minValue" />
                    </p>
                  </form>

                  <p class="pt-6 px-4">~</p>
                  <form>
                    <input @change="changeValue(item)" id="Timeinput" class="py-2" type="time"
                      v-model="item.maxValue" />
                  </form>

                  <v-btn class="ml-6 mt-2 mr-3" v-if="item.modifiedBtn" @click="editValue(item)">수정</v-btn>
                  <p style="font-size: 2px; color: red" class="pt-4 px-2" v-if="item.timeChecker">
                    설정시간을 확인해주세요.
                  </p>
                  <v-snackbar v-model="snackbar" :timeout="timeout">
                    {{ text }}

                    <template v-slot:action="{ attrs }">
                      <v-btn color="" text v-bind="attrs" @click="snackbar = false">
                        Close
                      </v-btn>
                    </template>
                  </v-snackbar>
                </div>
                <!--습도설정 -->
                <div class="d-flex align-center" style="width: 500px" v-if="item.equipmentName == '가습기'">
                  <div class="" style="width: 108px">
                    <v-text-field class="pt-4" dense v-model="item.minValue" type="number"
                      @change="changeValue(item)"></v-text-field>
                  </div>
                  <!-- 실시간으로 validation 막기 -->
                  <p class="pt-6 px-4">~</p>
                  <div class="" style="width: 108px">
                    <v-text-field class="pt-4" dense v-model="item.maxValue" type="number" single-line
                      @change="changeValue(item)"></v-text-field>
                  </div>

                  <v-btn class="ml-6 mt-2 mr-3" v-if="item.modifiedBtn" @click="editValue(item)">수정</v-btn>
                  <v-snackbar v-model="snackbar" :timeout="timeout">
                    {{ text }}

                    <template v-slot:action="{ attrs }">
                      <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
                        Close
                      </v-btn>
                    </template>
                  </v-snackbar>
                </div>
                <!-- 에어컨부분 -->
                <div class="d-flex align-center" style="width: 500px" v-if="item.equipmentName == '에어컨'">
                  <div class="d-flex align-center" style="width: 108px">
                    <v-text-field dense v-model="item.minValue" min="1" max="100" type="number"
                      @change="changeValue(item)"></v-text-field>°C
                  </div>

                  <p class="pt-6 px-4">~</p>
                  <div class="d-flex align-center" style="width: 108px">
                    <v-text-field dense min="1" max="100" type="number" v-model="item.maxValue"
                      @change="changeValue(item)"></v-text-field>°C
                  </div>

                  <v-btn class="ml-6 mt-2 mr-3" v-if="item.modifiedBtn" @click="editValue(item)">수정</v-btn>
                  <v-snackbar v-model="snackbar" :timeout="timeout">
                    {{ text }}

                    <template v-slot:action="{ attrs }">
                      <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
                        Close
                      </v-btn>
                    </template>
                  </v-snackbar>
                </div>
              </template>
            </v-data-table>
          </template>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import { getEquipmentInfo, editEquipmentInfo } from '@/api/index.js';

export default {
  data() {
    return {
      //스낵바
      snackbar: false,
      text: '수정되었습니다.',
      timeout: 2000,
      //스낵바
      headers_bala: [
        {
          text: '이름',
          align: 'start',
          sortable: false,
          value: 'equipmentName',
        },
        { text: '기능', value: 'controlStatusㄴ', sortable: false },
        { text: '상태', value: 'controlStatus', sortable: false },

        { text: '상세설정', value: 'setting', sortable: false },
      ],
      headers_nur: [],
      bala_data: [],
      nur_data: [],
    };
  },
  created() {
    this.headers_nur = this.headers_bala;
  },
  methods: {
    //제어 상태 변경 api put

    clickChangeStatus(item, status) {
      if (item.controlStatus == status) {
        return;
      }
      var req_data = {
        equipmentId: item.equipmentId,
        equipmentName: item.equipmentName,
        room: item.room,
        controlStatus: status,
      };

      this.editStatus(req_data);
    },
    // 가습기 숫자입력 0~100
    changeValue(item) {
      item.modifiedBtn = true;
      item.modifiedText = false;
      item.timeChecker = false;
      //최저습도는 최고습도보다 높을수없음.
      if (item.equipmentName == '가습기') {
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

      //시간 입력할때 시간막기
      if (item.equipmentName == 'LED' || item.equipmentName == '팬') {
        if (item.minValue > item.maxValue) {
          console.log('시간막아야됌');
          item.timeChecker = true;
          item.modifiedBtn = false;
        } else {
          item.timeChecker = false;
        }
      }
    },
    //시간설정 수정할때
    editValue(item) {
      item.modifiedBtn = false;
      item.modifiedText = true;
      this.snackbar = true;

      let req_data = {
        equipmentId: item.equipmentId,
        equipmentName: item.equipmentName,
        room: item.room,
        minValue: item.minValue,
        maxValue: item.maxValue,
      };

      editEquipmentInfo(req_data)
        .then((res) => {
          console.log('성공');
          if (res.status == 200) {
            this.getDeviceList();
          }
        })
        .catch((error) => {
          console.log('실패');
        });
    },

    // 제어상태변경 api입니다
    editStatus(item) {
      console.log('제어상태변경api', item);

      editEquipmentInfo(item)
        .then((response) => {
          console.log('editEquipmentInfo', response.status);
          if (response.status == 200) {
            this.getDeviceList();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getDeviceList() {
      getEquipmentInfo()
        .then((response) => {
          // 발아/활착실 바인딩
          console.log('showcontroll의 리스폰스', response);
          let balaResult = _.filter(response.data.responseData, {
            room: '발아/활착실',
          });
          console.log('balaResult', balaResult);
          let nurResult = _.filter(response.data.responseData, {
            room: '육묘실',
          });
          console.log('맨처음 api 성공', balaResult, nurResult);
          balaResult.forEach((element) => {
            element.modifiedBtn = false;
          });

          nurResult.forEach((element) => {
            element.modifiedBtn = false;
          });

          this.bala_data = balaResult;
          this.nur_data = nurResult;
        })
        .catch((error) => {
          console.log('api통신 실패');
          console.log(error);
        });
    },
  },
  mounted() {
    this.getDeviceList();
  },
};
</script>

<style lang="scss" scoped>
.inputMinValue {
  border-color: grey;
  border-bottom-style: solid;
  border-bottom-color: grey;
  border-bottom-width: 0.5px;
}

#Timeinput {
  border-color: grey;
  border-bottom-style: solid;
  border-bottom-color: grey;
  border-bottom-width: 0.5px;
}

.inputText {
  border-color: grey;
  border-bottom-style: solid;
  border-bottom-color: grey;
  border-bottom-width: 0.5px;
}

.fade-out-box {
  display: inline-block;
  padding: 10px;
  animation: fadeout 2s;
  -moz-animation: fadeout 2s;
  /* Firefox */
  -webkit-animation: fadeout 2s;
  /* Safari and Chrome */
  -o-animation: fadeout 2s;
  /* Opera */
  animation-fill-mode: forwards;
}

@keyframes fadeout {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}

@-moz-keyframes fadeout {

  /* Firefox */
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}

@-webkit-keyframes fadeout {

  /* Safari and Chrome */
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}

@-o-keyframes fadeout {

  /* Opera */
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}
</style>
