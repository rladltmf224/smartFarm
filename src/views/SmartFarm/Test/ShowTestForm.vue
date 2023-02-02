<template>
  <v-container fluid>
    <!-- 1.테스트명 -->
    <v-row class="">
      <v-col class="d-flex align-center" md="12">
        <v-btn icon elevation="3" small class="mr-3" @click="$router.push({ name: 'ShowTest' }), removeLS()">
          <v-icon>mdi-arrow-left</v-icon></v-btn>
        <h4 class="searchbox-title">실험명:{{ testName }}</h4>
        <v-spacer></v-spacer>
        <v-btn class="mx-2" small @click="disable = true">
          <v-icon>mdi-lead-pencil</v-icon>
        </v-btn>
        <v-btn color="primary" small @click="saveMemo(), (disable = false)">
          <v-icon>mdi-check</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <!-- 2.실험메모 -->
    <v-row class="my-0">
      <v-col cols="12" class="my-0 py-0 px-0 pb-0 my-0 d-flex">
        <v-col cols="12">
          <v-textarea no-resize class="" name="input-7-1" height="100" filled label="실험조건" clearable counter
            :disabled="disable == false" v-model="testCondition"></v-textarea></v-col>
        <v-col cols="2" class="px-0 mx-0 d-flex align-center"> </v-col>
      </v-col>
    </v-row>
    <!-- 3.표 -->
    <v-row class="my-0">
      <v-col cols="12" class="" lg="12" xl="12" md="10">
        <v-sheet class="mx-auto" color="#F6F8F9" elevation="0" width="" height="760">
          <v-col cols="12" class="d-flex align-center">
            <v-btn icon fab class="px-2" x-small @click="Plus()" rounded>
              <v-icon color="primary">mdi-plus</v-icon>
            </v-btn>
            <p class="pa-0 ma-0 mx-2">페이지 추가</p>
            <v-btn icon fab class="px-2" x-small @click="getGraphData()" rounded>
              <v-icon color="primary">mdi-chart-bell-curve</v-icon>
            </v-btn>
            <p class="pa-0 ma-0 mx-2" @click="getGraphData()">그래프 조회</p>
          </v-col>
          <LoadingSpinner v-if="!isLoading"></LoadingSpinner>
          <v-slide-group v-else v-model="model" class="d-flex align-center pa-0 ma-0" center-active show-arrows>
            <v-slide-item v-for="(item, i) in table" :key="i" v-slot="{ active }">
              <v-card class="ma-4 pt-0 mt-0" height="680" width="700" style="overflow-y: auto">
                <TableCard ref="tableCard" :parentTable="item" :i="i" :ReportId="growthReportId"
                  @deletedNum="deletedNum" @resetPage="resetPage" @snackBarTrue="snackBarTrue">
                </TableCard>
              </v-card>
            </v-slide-item>
          </v-slide-group>
        </v-sheet>
      </v-col>
    </v-row>
    <!-- 4.데이터저장 후 스낵바 -->
    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ text }}
      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <!-- 5.날짜등록후 후 스낵바 -->
    <v-snackbar v-model="snackbar_date" :timeout="timeout">
      {{ text_date }}
      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar_date = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <!-- 6.삭제되었습니다.스낵바 -->
    <v-snackbar v-model="snackbar_delete" :timeout="timeout">
      {{ text_delete }}
      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar_delete = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <!-- 7.현재페이지를 삭제하시겠습니까? 다이아로그 -->
    <v-dialog v-model="deleteDialog" persistent max-width="500">
      <v-card>
        <v-card-title class="text-h5">
          현재페이지를 삭제하시겠습니까?
        </v-card-title>
        <v-card-text>
          현재페이지의 날짜 미선택 시, 작성중이던 데이터는 저장되지않습니다.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="deleteDialog = false">
            취소
          </v-btn>
          <v-btn color="red darken-1" text @click="DeleteNowPage()">
            삭제
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 8.그래프 보는 다이아로그 -->
    <v-dialog v-model="graph_dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card class="pa-0 ma-0">
        <v-toolbar color="grey lighten-2" dense elevation="0" rounded="0">
          <v-btn icon @click="resetGraphData()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>그래프(데이터 평균값)</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-row class="d-flex justify-center">
          <div v-for="(item, i) in graphData">
            <v-sheet class="d-flex flex-column justify-center">
              <TableGraph :graphData="item"></TableGraph>
            </v-sheet>
          </div>
        </v-row>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script lang="ts">

import { Vue, Component, Watch } from "vue-property-decorator";
import TableCard from "./TableCard.vue";
import TableGraph from "./TableGraph.vue";
import * as api from "@/api/index.js";
import _ from "lodash";
import LoadingSpinner from "../Loading/LodingSpinner.vue"; // 로딩스피너


@Component({
  components: {
    LoadingSpinner,
    TableCard,
    TableGraph,
  }
})

export default class ShowTestForm extends Vue {
  deletePageNum: number = 0;

  graphData: any = [];
  graph_dialog: boolean = false;
  growthReportId: any = '';
  model: any = null;
  zoomItemName: any = '';
  zoomItemUrl: any = '';
  emptyImageText: boolean = false;
  selectedImage: any = [];
  isLoading: boolean = false;
  reportItems: any = {
    growthReportId: "",
    growthReportDetailId: "",
  };
  images: any = [];
  url: any = null;
  input: any = { image: null };
  deleteDialog: boolean = false;
  deleteImageDialog: boolean = false;
  nowPageData: any = [];
  ApiResult: any = [];
  numDay: number = 0;
  growthReportDetailId: number = 0;
  numTreatment: number = 1;
  numSample: number = 1;
  number: number = 1;
  table: any = [];
  detail: any = [];
  datas_header: any = [
    { text: "처리구명", value: "treatmentName" },
    { text: "개체수", value: "sampleNumber" },
    { text: "엽수", value: "leafStage" },
    { text: "초장", value: "leafHeight" },
    { text: "엽폭", value: "leafWidth" },
    { text: "엽장", value: "leafLength" },
    { text: "경경", value: "stemThickness" },
    { text: "절간장", value: "internodeLength" }
  ];
  datas: any = [];
  snackbar: boolean = false;
  snackbar_delete: boolean = false;
  text_delete: string = '삭제되었습니다.';
  text: string = '저장되었습니다.';
  timeout: number = 1000;
  snackbar_date: boolean = false;
  text_date: string = '날짜가 등록되었습니다.';
  delete_text: string = '삭제되었습니다.';
  disable: boolean = false;
  dialog: boolean = false;
  testCondition: string = '';
  testName: string = '';
  treatmentIdDict: any = [];
  deleteTableData: any = [];

  mounted() {
    this.setId();
    this.getData();
  }

  @Watch('numDay')
  setNumDay(val: any) {
    let id: any = {
      growthReportId: this.$route.params.id, // 파라미터
    }
  }

  get id() {
    return this.$route.params.id;
  }

  setId() {
    //mount 시 이전 컴포넌트에서 받은 params를 변수에 저장한다.
    if (this.$route.params.id != null) {
      let growthReportId = this.$route.params.id;
      localStorage.setItem("growthReportId", this.$route.params.id);
    } else {
      //없으면 LS에서 빼서 저장한다.
      let growthReportId = localStorage.getItem("growthReportId");
      this.$route.params.id = growthReportId || '{}'
    }
    this.growthReportId = this.$route.params.id;
  }

  getData(callChildSave: boolean = false) {
    let id = {
      growthReportId: this.$route.params.id, // 파라미터
    };
    api.growthresearch.LookUpGrowthResearchData(id).then((res) => {
      this.isLoading = true;
      console.log("데이터 조회성공", res);
      //각 데이터 평균 구해서 push하기
      let resDetail = res.data.responseData.details;
      this.ApiResult = res.data.responseData; //res.Data를 변수로 저장.
      this.treatmentIdDict = res.data.responseData.treatmentInfos;
      this.table = []; //1.빈 리스트 선언.. 모든페이지에 대한 데이터묶음.즉 내가 기존에 만들었던
      //let myResult = []
      if (this.ApiResult.details == null) {
        //details 아예 null일때 빈테이블생성해주세요.
        console.log("details가null일때 빈테이블생성해주세요.");
        console.log("111111111111111111");
        this.MakeTable();
      } else {
        //details가 몇개만 null일때 또는 모~두 null일때
        // let fullres = res.data.responseData.details
        this.ApiResult.details = this.ApiResult.details.sort(function (a: any, b: any) {
          return b.growthReportDetailId - a.growthReportDetailId;
        });
        console.log(this.ApiResult);
        for (
          let DetailNum = 0;
          DetailNum < this.ApiResult.details.length;
          DetailNum++
        ) {
          //for문으로 details의 lenth만큼 1씩증가하는 변수생성
          if (this.ApiResult.details[DetailNum].treatments.length == 0) {
            //****여기가중요 *****
            console.log(
              "treatmeants가 null인것만 골라서 PlusTable해주고, 아니면 실제데이터를 바인딩해주세요. <==필터를 써야할까 ?"
            );
            this.PlusTable(
              this.ApiResult.details[DetailNum].growthReportDetailId,
              this.ApiResult.details[DetailNum].reportDate
            );
          } else {
            //treatments가 모두 null이 아니면 실제 데이터를 바인딩해주세요
            let pageItem = this.ApiResult.details[DetailNum];
            console.log("페이지아이템", pageItem);
            let resultItem: any = {
              growthReportDetailId: pageItem.growthReportDetailId,
              carousel_date: pageItem.reportDate,
              carousel_data: [],
            };
            let treatmentNameList = _.map(
              pageItem.treatments,
              "treatmentName"
            );
            let treatmentNameUniqList = Array.from(
              new Set(treatmentNameList)
            );
            treatmentNameUniqList.forEach(function (tr) {
              let trList: any = _.filter(pageItem.treatments, {
                treatmentName: tr,
              });
              resultItem.carousel_data.push(trList[0]);
            });
            // myResult.push(resultItem)
            // this.table = myResult
            this.table.push(resultItem);
            console.log("디스테이블", this.table);
          }
        }
      }
      //소영선임님이 알려주신 실제데이터 넣는 방법.
      //1.   this.ApiResult.length만큼 리스트 돌린다.
      // for (let pageIdx = 0; pageIdx < this.ApiResult.details.length; pageIdx++) {
      //     let pageItem = this.ApiResult.details[pageIdx] //첫번째 idx의 item.
      //     let resultItem = {
      //         growthReportDetailId: pageItem.growthReportDetailId, //resultItem에 서버에서 가져온 growth 어쩌구를 넣는다.
      //         carousel_date: pageItem.reportDate,  //resultItem에 서버에서 가져온 reportData를  넣는다.
      //         carousel_data: [] // resultItem의 carousel_data 빈 어레이로 선언.
      //     } // <= 한페이지에 대한 데이터묶음임. for문끝나고 myResult에 넣어줘야함.

      //     let treatmentNameList = _.map(pageItem.treatments, 'treatmentName')       // treatmentName으로만 이루어진 어레이 만듬
      //     let treatmentNameUniqList = Array.from(new Set(treatmentNameList)) // treatmentName으로만 이루어진 어레이에 중복값을 제거 후 리스트로 바꿈

      //     treatmentNameUniqList.forEach(function (tr) { //tr = 이름일뿐인데.. treatmentName 순서대로 돌아감.
      //         // treatmentName이 111을 가진 어레이를  resultItem.carousel_data = [] 에 넣어줄것임. 3333번참조
      //         //pageItem.treatments에서 111을가진 원소들을 뽑아야됨.

      //         //서버에서 가져온 treatments에서 treatmentName이 111인 원소로 이루어진 리스트
      //         let trList = _.filter(pageItem.treatments, { treatmentName: tr }) //forEach의 tr을 value위치에 넣는다.

      //         //push를하면 어레이가 담기는것.지금은 어레이필요없어서 [] 벗김.
      //         //(3333번)
      //         resultItem.carousel_data.push(trList[0])

      //     })
      //     myResult.push(resultItem)
      // }
      // this.table = myResult
      //3.화면에 필요한것들을 각각 바인딩해준다.
      this.numDay = res.data.responseData.numDay; //페이지개수
      this.testCondition = res.data.responseData.testCondition; //실험조건
      this.testName = res.data.responseData.testName; //실험명
      this.numTreatment = res.data.responseData.numTreatment; //처리구 개수
      this.numSample = res.data.responseData.numSample; //개체수
    });

    // if (callChildSave) {
    //   console.log("SSSSSSSSSSSSSSSSSSSSooooooooooooooo");
    //   console.log(this.$refs);
    //   console.log(this.$refs.tableCard);
    //   this.$refs.tableCard[0].Save();
    // }
  }


  deletedNum(data: any, data2: any) {
    //자식에서 삭제할 페이지 고유 num 보내서 받는 api
    console.log("자식에서준거", data, data2);
    this.deletePageNum = data; //i
    this.deleteTableData = data2; //i번째 table의 정보
    console.log(this.deletePageNum, "이랑", this.deleteTableData);
    if (this.deleteTableData.carousel_date == "") {
      console.log("이프문걸림");
      this.table.splice(this.deletePageNum, 1);
      this.snackbar_delete = true;
      this.getData();
    } else {
      console.log("엘스문걸림");
      this.deleteDialog = true;
    }
  }

  resetPage() {
    //자식에서 날짜 받고 다시 getData하는 메서드
    console.log("자식에서 데이터받았으니까 리로드할것임");
    this.getData(true);
  }

  snackBarTrue(data: any) {
    //자식에서 스낵바 true 보내주면  부모에서 true해줌
    console.log("자식에서받은거", data);
    if (data == 'save') {
      this.snackbar = true;
    } if (data == 'delete') {
      this.snackbar_delete = true;
    } else {
      console.log("세이브가아님.");
    }
  }
  DeleteNowPage() {
    console.log('삭제시킬것임삭제시킬것임삭제시킬것임')
    if (this.deleteTableData.growthReportDetailId == "") {
      console.log("growthReportDetailId가 없으니까 그냥삭제시킨다.");
    } else {
      let id = {
        growthReportDetailId: this.deleteTableData.growthReportDetailId,
      };
      console.log("ididididididididididididididid", id);

      api.growthresearch.DeleteGrowthResearchDate(id).then((res) => {
        console.log("삭제가 완료되었습니다.", res);
        this.deleteDialog = false;
        this.table.splice(this.deletePageNum, 1);
        this.deleteDialog = false;
        this.snackbar_delete = true;
        this.getData();
      });
    }
  }
  resetGraphData() {
    this.graphData = [];
    this.graph_dialog = false;
  }
  getGraphData() {
    this.graph_dialog = true;

    let id: any = {
      growthReportId: this.growthReportId,
    };

    api.growthresearch.GetGrowthResearchGraphData(id).then((res) => {
      //1.resData의 averageDatas를 합친다.
      let resData: any = res.data.responseData;
      let fullData: any = [];
      let dates: any = [];
      for (let dataLeng: any = 0; dataLeng < resData.length; dataLeng++) {
        for (
          let avgLeng: any = 0;
          avgLeng < resData[dataLeng].averageDatas.length;
          avgLeng++
        ) {
          dates.push(resData[dataLeng].reportDate);
          fullData.push(resData[dataLeng].averageDatas[avgLeng]);
        }
      }
      let uniqDates: any = _.uniq(dates);
      console.log('uniqDatesuniqDatesuniqDates', uniqDates)

      console.log(
        "1.resData의 averageDatas를 합친다.",
        _.sortBy(fullData, "treatmentName")
      );
      console.log("1-1 데이트로만 이루어진 어레이.", uniqDates);

      let uniqData: any = _.uniqBy(fullData, "treatmentName"); //2.uniqBy만 써서 한개의 고유  treatmentName 을 가진 배열만 담는다.

      console.log(
        "2.uniqBy만 써서 한개의 고유  treatmentName 을 가진 배열만 담는다.",
        uniqData
      );

      let onlyName: any = _.map(uniqData, "treatmentName"); //3.map을 써서 treatmentName으로만 배열에 담는다.['처치구1,'처치구2','처치구3'..]

      console.log(
        "3.map을 써서 treatmentName으로만 배열에 담는다.",
        onlyName
      );

      let setObj_avgInternodeLength: any = []; //4. name:'',data:[] <== 오브젝트 형태를 담은 배열을 담는다.
      let setObj_avgLeafHeight: any = []; //4. name:'',data:[] <== 오브젝트 형태를 담은 배열을 담는다.
      let setObj_avgLeafLength: any = []; //4. name:'',data:[] <== 오브젝트 형태를 담은 배열을 담는다.
      let setObj_avgLeafStage: any = []; //4. name:'',data:[] <== 오브젝트 형태를 담은 배열을 담는다.
      let setObj_avgLeafWidth: any = []; //4. name:'',data:[] <== 오브젝트 형태를 담은 배열을 담는다.
      let setObj_avgStemThickness: any = []; //4. name:'',data:[] <== 오브젝트 형태를 담은 배열을 담는다.

      for (
        let onlyNameLeng = 0;
        onlyNameLeng < onlyName.length;
        onlyNameLeng++
      ) {
        setObj_avgInternodeLength.push({
          name: onlyName[onlyNameLeng],
          data: [],
        });
        setObj_avgLeafHeight.push({ name: onlyName[onlyNameLeng], data: [] });
        setObj_avgLeafLength.push({ name: onlyName[onlyNameLeng], data: [] });
        setObj_avgLeafStage.push({ name: onlyName[onlyNameLeng], data: [] });
        setObj_avgLeafWidth.push({ name: onlyName[onlyNameLeng], data: [] });
        setObj_avgStemThickness.push({
          name: onlyName[onlyNameLeng],
          data: [],
        });
      }

      setObj_avgInternodeLength.forEach((el: any) => {
        //5.이중 forEach써서 name과treatmentName이같으면 avgInternodeLength값을 넣어준다.
        fullData.forEach((el2: any) => {
          if (el2.treatmentName == el.name) {
            console.log("el2.avgInternodeLength", el2.avgInternodeLength);
            el.data.push(el2.avgInternodeLength);
          }
        });
      });
      let avgInternodeLength_data: any = {
        treatmentData: setObj_avgInternodeLength,
        dataName: "avgInternodeLength",
        date: uniqDates,
      };

      setObj_avgLeafHeight.forEach((el: any) => {
        //5.이중 forEach써서 name과treatmentName이같으면 avgInternodeLength값을 넣어준다.
        fullData.forEach((el2: any) => {
          if (el2.treatmentName == el.name) {
            console.log("el2.avgLeafHeight", el2.avgLeafHeight);
            el.data.push(el2.avgLeafHeight);
          }
        });
      });
      let avgLeafHeight_data: any = {
        treatmentData: setObj_avgLeafHeight,
        dataName: "avgLeafHeight",
        date: uniqDates,
      };

      setObj_avgLeafLength.forEach((el: any) => {
        //5.이중 forEach써서 name과treatmentName이같으면 avgInternodeLength값을 넣어준다.
        fullData.forEach((el2: any) => {
          if (el2.treatmentName == el.name) {
            console.log("el2.avgLeafLength", el2.avgLeafLength);
            el.data.push(el2.avgLeafLength);
          }
        });
      });

      let avgLeafLength_data: any = {
        treatmentData: setObj_avgLeafLength,
        dataName: "avgLeafLength",
        date: uniqDates,
      };

      setObj_avgLeafStage.forEach((el: any) => {
        //5.이중 forEach써서 name과treatmentName이같으면 avgInternodeLength값을 넣어준다.
        fullData.forEach((el2: any) => {
          if (el2.treatmentName == el.name) {
            console.log("el2.avgLeafStage", el2.avgLeafStage);
            el.data.push(el2.avgLeafStage);
          }
        });
      });

      let avgLeafStage_data: any = {
        treatmentData: setObj_avgLeafStage,
        dataName: "avgLeafStage",
        date: uniqDates,
      };

      setObj_avgLeafWidth.forEach((el: any) => {
        //5.이중 forEach써서 name과treatmentName이같으면 avgInternodeLength값을 넣어준다.
        fullData.forEach((el2: any) => {
          if (el2.treatmentName == el.name) {
            console.log("el2.avgLeafWidth", el2.avgLeafWidth);
            el.data.push(el2.avgLeafWidth);
          }
        });
      });

      let avgLeafWidth_data: any = {
        treatmentData: setObj_avgLeafWidth,
        dataName: "avgLeafWidth",
        date: uniqDates,
      };

      setObj_avgStemThickness.forEach((el: any) => {
        //5.이중 forEach써서 name과treatmentName이같으면 avgInternodeLength값을 넣어준다.
        fullData.forEach((el2: any) => {
          if (el2.treatmentName == el.name) {
            console.log("el2.avgStemThickness", el2.avgStemThickness);
            el.data.push(el2.avgStemThickness);
          }
        });
      });

      let avgStemThickness_data: any = {
        treatmentData: setObj_avgStemThickness,
        dataName: "avgStemThickness",
        date: uniqDates,
      };

      let graphData: any = [];

      graphData.push(
        avgInternodeLength_data,
        avgLeafHeight_data,
        avgLeafLength_data,
        avgLeafStage_data,
        avgLeafWidth_data,
        avgStemThickness_data
      );
      this.graphData = graphData;
      console.log("최종", graphData);
    });
  }
  //뒤로가기 버튼 눌렀을때 LS에있는값 빼는 메서드
  removeLS() {
    localStorage.removeItem("growthReportId");
  }
  //실험조건 수정 후 저장
  saveMemo() {
    let id = {
      growthReportId: this.$route.params.id, // 파라미터
      testCondition: this.testCondition,
    };
    api.growthresearch.SaveGrowthResearchMemo(id).then((res) => {
      this.snackbar = true;
    });
    this.snackbar = true;
  }
  // 초기 테이블 생성 method
  MakeTable(detailId = "", reportDate = "", tableSize = 1) {
    let table = [];
    for (let ii = 0; ii < tableSize; ii++) {
      table.push({
        carousel_date: reportDate,
        growthReportDetailId: detailId, //날짜 id (화면에서 안보임)
        carousel_data: Array.from(
          { length: this.ApiResult.numTreatment },
          (v, i) =>
            Object.assign(
              {},
              {
                treatmentName: this.treatmentIdDict[i]["treatmentName"], //처리구명
                treatmentId: this.treatmentIdDict[i]["treatmentId"], //처리구 id (화면에서 안보임)
                datas: Array.from(
                  { length: this.ApiResult.numSample },
                  (v, i) =>
                    Object.assign(
                      {},
                      {
                        growthDataId: null, //데이터 수정용
                        sampleNumber: i + 1,
                        leafStage: 0,
                        leafHeight: 0,
                        leafWidth: 0,
                        leafLength: 0,
                        stemThickness: 0,
                        internodeLength: 0,
                      }
                    )
                ),
              }
            )
        ),
      });
    }
    this.table = table;
    console.log("메잌테이블", this.table);
  }
  Plus() {
    this.PlusTable(); //MakeTable() 메서드와 비슷한 메서드임.
  }
  PlusTable(detailId = "", reportDate = "") {
    this.table.unshift({
      carousel_date: reportDate,
      growthReportDetailId: detailId, //날짜 id (화면에서 안보임)
      carousel_data: Array.from(
        { length: this.ApiResult.numTreatment },
        (v, i) =>
          Object.assign(
            {},
            {
              treatmentName: this.treatmentIdDict[i]["treatmentName"], //처리구명
              treatmentId: this.treatmentIdDict[i]["treatmentId"], //처리구 id (화면에서 안보임)
              datas: Array.from(
                { length: this.ApiResult.numSample },
                (v, i) =>
                  Object.assign(
                    {},
                    {
                      growthDataId: null, //데이터 수정용
                      sampleNumber: i + 1,
                      leafStage: 0,
                      leafHeight: 0,
                      leafWidth: 0,
                      leafLength: 0,
                      stemThickness: 0,
                      internodeLength: 0,
                    }
                  )
              ),
            }
          )
      ),
    });
    console.log("플러스테이블", this.table);
  }




}




</script>

<style lang="scss" scoped>
::v-deep .v-text-field__details {
  display: none;
}

::v-deep .v-carousel__controls {
  height: 30px;
}
</style>
