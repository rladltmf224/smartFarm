<template>
  <div>
    <v-container fluid>
      <v-row>
        <v-col class="ma-2" md="12">
          <h4 class="searchbox-title">조회 조건</h4>
          <v-card class="pa-3" height="90">
            <v-row>
              <v-col cols="2">
                <v-text-field label="시설명" v-model="search_condition.name"></v-text-field>
              </v-col>

              <v-col class="pt-5 text-right" offset="8" cols="2">
                <v-btn color="primary" x-large> 조회 </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-container fluid>
      <v-row>
        <v-col class="ma-2" md="12">
          <v-row>
            <v-col cols="6">
              <v-row class="mb-2">
                <v-col cols="9">
                  <h4 class="searchbox-title">시설 목록</h4>
                </v-col>
                <v-col cols="3" class="text-right">
                  <v-btn @click="openModal_facility" small color="primary"><v-icon left> mdi-book-account </v-icon>시설
                    추가</v-btn>

                  <!-- 시설 등록 -->
                  <v-dialog v-model="facility_modal" max-width="500px">
                    <v-card>
                      <v-card-title>
                        <span>{{ modal_title }}</span>
                        <v-spacer></v-spacer>
                      </v-card-title>
                      <v-card-text>
                        <v-col align-self="center">
                          <v-text-field label="시설명" v-model="facilityName"></v-text-field>
                        </v-col>
                      </v-card-text>
                      <v-card-actions>
                        <v-col class="text-right">
                          <v-btn color="success" text @click="saveFacilityInfo">
                            저장
                          </v-btn>

                          <v-btn color="primary" text @click="closeModal_facility">
                            닫기
                          </v-btn>
                        </v-col>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-col>
              </v-row>
              <v-card>
                <v-data-table multi-sort fixed-header height="630" :headers="headers" v-model="facilityTable"
                  :items="facilityList" item-key="facilityId" dense single-select @click:row="selectFacility"
                  hide-default-footer>
                  <template v-slot:item.edit="{ item }">
                    <v-icon small class="mr-2" @click="editFacility(item)">
                      mdi-pencil
                    </v-icon>
                    <v-icon small @click="deleteFacility(item)">
                      mdi-delete
                    </v-icon>
                  </template>
                </v-data-table>
              </v-card>
            </v-col>
            <v-col cols="6">
              <v-row class="mb-2">
                <v-col cols="6">
                  <h4 class="searchbox-title">시설 구역 목록</h4>
                </v-col>
                <v-col cols="6" class="text-right pl-2">
                  <v-btn class="text-right ml-2" small color="primary" @click="saveLocation"><v-icon
                      small>mdi-content-save-check</v-icon> 구역 저장
                  </v-btn>
                  <v-btn class="text-right ml-2" small color="primary" @click="addLocation"><v-icon small>mdi-plus
                    </v-icon> 구역 추가
                  </v-btn>
                  <v-btn class="text-right ml-2" small color="primary" @click="deleteLocation"><v-icon small>mdi-minus
                    </v-icon> 구역 삭제
                  </v-btn>
                </v-col>
              </v-row>
              <v-card>
                <v-data-table dense fixed-header multi-sort height="630" v-model="locationTable"
                  :headers="Locationheaders" :items="locationList" item-key="code" show-select :expanded.sync="expanded"
                  hide-default-footer>
                  <template v-slot:item.name="props">
                    <v-edit-dialog :return-value.sync="props.item.name">
                      {{ props.item.name }}
                      <template v-slot:input>
                        <v-text-field v-model="props.item.name" placeholder="* 구역명" single-line counter
                          dense></v-text-field>
                      </template>
                    </v-edit-dialog>
                  </template>

                  <template v-slot:item.memo="props">
                    <v-edit-dialog :return-value.sync="props.item.memo" v-show="props.item.jobOrderId != null">
                      {{ props.item.memo }}
                      <template v-slot:input>
                        <v-text-field v-model="props.item.memo" placeholder="* 비고" single-line counter
                          dense></v-text-field>
                      </template>
                    </v-edit-dialog>
                  </template>

                  <!--<template v-slot:item.name="props">
                  <v-text-field
                    dense
                    class="pa-0"
                    placeholder=""
                    v-model="props.item.name"
                    single-line
                  >
                    {{ props.item.name }}
                  </v-text-field>
                </template>

                <template v-slot:item.memo="props">
                  <v-text-field
                    dense
                    class="pa-0"
                    placeholder=""
                    v-model="props.item.memo"
                    single-line
                  >
                    {{ props.item.memo }}
                  </v-text-field>
                </template>-->

                  <template v-slot:item.jobOrderId="{ item }">
                    <v-btn class="center mt-1 mb-1 childBtn" small :color="getColor(item.jobOrderId)" dark
                      style="width: 100px" depressed>
                      {{ item.jobOrderId == null ? "사용가능" : "사용중" }}
                    </v-btn>
                  </template>

                  <template v-slot:no-data>
                    <h5>데이터가 없습니다.</h5>
                  </template>
                </v-data-table>
              </v-card>

            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import * as api from "@/api";
import cfg from "./config";
import { gridCfg } from "@/util/config/";
import _ from "lodash";
import { Vue, Component, Watch } from "vue-property-decorator";

@Component
export default class Facilitymng extends Vue {
  tempIdx: number = -1; //저장 전의 임의의 데이터
  storageListCfg: any = {}; //시설 페이징
  locationListCfg: any = {}; //구역 페이징
  search_condition: any = {
    //검색 조회 조건
    name: "",
    page: 0,
    size: 0,
    sortBy: [],
    sortDesc: [],
  };
  search_location: any = {
    storageId: "",
    page: 0,
    size: 0,
    sortBy: [],
    sortDesc: [],
  };
  /*신규*/
  expanded: [] = []; //테이블내의 확장기능
  facilityList: any[] = []; //[response] 시설 데이터
  locationList: any[] = []; //[response] 전체 구역 데이터
  locationTable: any[] = []; //창고구역 테이블 v-model
  facilityTable: any[] = [];
  facility_modal: boolean = false; //시설추가 Modal
  facilityName: string = ""; //수정할 수정Name
  facilityId: string = ""; //수정할 수정ID
  locationMemo: string = "";
  locationName: string = "";
  state: boolean = false; //Modal창 등록 or 수정

  created() {
    //this.storageListCfg = Object.assign({}, gridCfg);
    //this.locationListCfg = Object.assign({}, gridCfg);
  }

  get headers() {
    return cfg.header.headers;
  }
  get Locationheaders() {
    return cfg.header.Locationheaders;
  }

  get modal_title() {
    return this.state == false ? "시설 등록" : " 시설 수정";
  }

  mounted() {
    this.getFacilityData();
  }

  @Watch("facilityTable")
  getData() {
    return this.facilityList;
  }

  @Watch("locationTable")
  getData2() {
    return this.locationList;
  }
  /*
  @Watch("edit_customer")
  onEditCustomerChange(val: any) {
    val || this.closeModal_customer();
  }

  @Watch("storageListCfg.options", { deep: true })
  onStorageListCfgChange() {
    this.getCustomer();
  }

  @Watch("locationListCfg.options", { deep: true })
  onLocationListCfg() {
    if (this.search_location.storageId != "") {
      const { page, itemsPerPage, sortBy, sortDesc } =
        this.locationListCfg.options;

      this.search_location.page = page;
      this.search_location.size = itemsPerPage;
      this.search_location.sortBy = sortBy;
      this.search_location.sortDesc = sortDesc;
      this.locationListCfg.loading = true;

      api.storage
        .getStorageLocationList(this.search_location)
        .then((response) => {
          this.location_list = response.data.responseData;
          this.locationListCfg.totalCount = response.data.totalCount;
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.locationListCfg.loading = false;
        });
    }
  }
*/

  // 시설 정보 불러오기
  getFacilityData() {
    api.facility.getFacilityList().then((res) => {
      res.data.responseData.forEach((element: any) => {
        element.details.forEach((element_sub: any) => {
          element_sub.code = element_sub.facilityDetailId;
        });
      });
      this.facilityList = res.data.responseData;

      if (this.facilityId != "") {
        this.facilityList.forEach((value: any) => {
          if (value["facilityId"] == this.facilityId) {
            this.locationList = value["details"];
          }
        });
      }
      console.log("facilityList", this.facilityList);
    });
  }
  //시설 등록 Modal
  openModal_facility() {
    this.facility_modal = true;
    this.state = false;
  }
  closeModal_facility() {
    this.facility_modal = false;
    this.facilityName = "";
  }

  //시설 등록 함수
  saveFacilityInfo() {
    let info;
    let updateItem;

    if (this.facilityName == "") {
      this.$swal({
        title: "추가 하고자 하는 카테고리명을 입력해주세요.",
        icon: "error",
        position: "top",
        showCancelButton: false,
        showConfirmButton: false,
        toast: true,
        timer: 2000,
      });
    }

    //등록일때
    if (this.facilityName != "" && this.state == false) {
      info = {
        facilityName: this.facilityName,
      };

      api.facility
        .postFacilityData(info)
        .then((response) => {
          if (response.status == 200) {
            this.$swal({
              title: "등록되었습니다.",
              icon: "success",
              position: "top",
              showCancelButton: false,
              showConfirmButton: false,
              toast: true,
              timer: 1500,
            });

            this.facility_modal = false;
            this.facilityName = "";
            //데이터 갱신
            this.getFacilityData();
          } else if (response.status == 400) {
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
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      //수정일때
      updateItem = {
        facilityId: this.facilityId,
        facilityName: this.facilityName,
      };

      api.facility
        .putFacilityData(updateItem)
        .then((response) => {
          if (response.status == 200) {
            this.$swal({
              title: "수정되었습니다.",
              icon: "success",
              position: "top",
              showCancelButton: false,
              showConfirmButton: false,
              toast: true,
              timer: 1500,
            });

            this.facility_modal = false;
            this.facilityName = "";
            //데이터 갱신
            this.getFacilityData();
          } else if (response.status == 400) {
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
        });
    }
  }
  //시설 수정 함수
  editFacility(item: any) {
    this.facility_modal = true;
    this.facilityId = item.facilityId;
    this.facilityName = item.facilityName;
    this.state = true;
  }

  //시설 삭제 함수
  deleteFacility(item: any) {
    let deleteItem = {
      facilityId: item.facilityId,
    };

    this.$swal
      .fire({
        title: "삭제",
        text: "해당 데이터를 삭제 하시겠습니까?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "삭제",
      })
      .then((result) => {
        if (result.isConfirmed) {
          api.facility
            .deleteFacilityData(deleteItem)
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
                //데이터 갱신
                this.getFacilityData();
              } else if (response.status == 400) {
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
            });
        }
      });
  }

  //시설구역 상세 보기 함수
  selectFacility(row: any) {
    this.facilityId = row.facilityId;
    this.locationList = [];
    this.locationTable = [];
    let removeID: any = [];

    //시설 클릭시, 해당 구역에 대한 정보불러오는 함수
    this.facilityList.forEach((value) => {
      if (value["facilityId"] == row.facilityId) {
        this.locationList = value["details"];
      }
    });

    //신규추가 이후에 저장하지않았던 데이터가 존재할시 지워주는 함수
    this.locationList.forEach((value: any) => {
      if (value.code < -1) {
        removeID.push(value.code);
      }
    });
    this.locationList = _.reject(this.locationList, function (o) {
      return removeID.includes(o.code);
    });

    console.log("locationList", this.locationList);
  }

  addLocation() {
    //구역추가 함수
    this.locationList.push({
      name: "",
      memo: "",
      code: this.tempIdx--,
      facilityDetailId: null,
      jobOrderId: null,
    });
  }

  saveLocation() {
    this.locationTable = [];
    let saveItem = {};
    let check = true;
    for (var i = 0; i < this.locationList.length; i++) {
      if (this.locationList[i].name == "") {
        return this.$swal({
          title: "구역명을 입력해주세요",
          icon: "error",
          position: "top",
          showCancelButton: false,
          showConfirmButton: false,
          toast: true,
          timer: 1500,
        });
      } else {
        //구역명 중복 방지
        let duplicate = _.map(this.locationList, "name");
        let duplicateSize = new Set([...duplicate]).size;

        if (this.locationList.length != duplicateSize) {
          check = false;
          return this.$swal({
            title: "이미 사용중인 구역명이므로 수정해주세요.",
            icon: "error",
            position: "top",
            showCancelButton: false,
            showConfirmButton: false,
            toast: true,
            timer: 1500,
          });
        } else {
          this.locationTable.push({
            facilityDetailId: this.locationList[i].facilityDetailId,
            name: this.locationList[i].name,
            memo: this.locationList[i].memo,
          });
        }
      }
    }
    if (check) {
      saveItem = {
        facilityId: this.facilityId,
        facilityLocations: this.locationTable,
      };
      console.log("saveItem", saveItem);
      api.facility
        .postFacilityDetailData(saveItem)
        .then((response) => {
          //저장이 안되었으므로 리셋
          if (response.status == 200) {
            console.log("등록");
            this.$swal({
              title: "등록되었습니다.",
              icon: "success",
              position: "top",
              showCancelButton: false,
              showConfirmButton: false,
              toast: true,
              timer: 1500,
            });
            //데이터 갱신
            this.getFacilityData();
          }
          if (response.status == 400) {
            console.log("등록error");
            if (response.status.data.message == "이미 사용중인 구역명입니다.") {
              this.$swal({
                title: "이미 사용중인 구역명입니다.",
                icon: "error",
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
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  deleteLocation() {
    let removeID: any = [];
    let removeItem: any = [];

    if (this.locationTable.length == 0) {
      return this.$swal({
        title: "삭제할 구역을 선택하세요",
        icon: "error",
        position: "top",
        showCancelButton: false,
        showConfirmButton: false,
        toast: true,
        timer: 1500,
      });
    }

    if (this.locationTable.length != 0) {
      for (var i = 0; i < this.locationTable.length; i++) {
        if (this.locationTable[i].code <= -1) {
          removeID.push(this.locationTable[i].code);
          this.locationList = _.reject(this.locationList, function (o) {
            return removeID.includes(o.code);
          });
        } else {
          removeItem.push(this.locationTable[i].facilityDetailId);
        }
      }
      console.log("removeItem", removeItem);

      if (removeItem.length != 0) {
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
              api.facility
                .deleteFacilityDetailData(removeItem)
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

                    //데이터 갱신
                    this.getFacilityData();
                  } else {
                    this.$swal({
                      title: "삭제에 실패되었습니다.",
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
                });
            }
          });
      }
    }
  }

  getColor(jobOrderId: number) {
    if (jobOrderId == null) return "success";
    else if (jobOrderId != null) return "primary";
    else return "black";
  }
}
</script>

<style src="./Facilitymng.scss" lang="scss"></style>
