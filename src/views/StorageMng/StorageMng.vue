<template>
  <div>
    <v-container fluid>
      <v-row>
        <v-col class="ma-2" md="12">
          <h4 class="searchbox-title">조회 조건</h4>
          <v-card class="pa-3" height="90">
            <v-row>
              <v-col cols="2">
                <v-text-field label="창고명" v-model="search_condition.name" @keydown.enter="getCustomer"></v-text-field>
              </v-col>

              <v-col class="pt-5 text-right" offset="8" cols="2">
                <v-btn color="primary" x-large @click="getCustomer">
                  조회
                </v-btn>
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
                  <h4 class="searchbox-title">창고 목록</h4>
                </v-col>
                <v-col cols="3" class="text-right">
                  <v-btn small color="primary" @click="editItem"><v-icon left> mdi-book-account </v-icon>창고 추가
                  </v-btn>
                </v-col>
              </v-row>
              <v-card>
                <v-data-table multi-sort fixed-header height="600" :headers="headers" :items="customer_list" item-key="id"
                  :search="search" dense single-select @click:row="selectCustomer" :options.sync="storageListCfg.options"
                  :server-items-length="storageListCfg.totalCount" :loading="storageListCfg.loading"
                  :items-per-page="storageListCfg.itemsPerPage" :page.sync="storageListCfg.page"
                  @page-count="storageListCfg.pageCount = $event" hide-default-footer>
                  <template v-slot:item.edit="{ item }">
                    <v-icon small class="mr-2" @click="editItem(item)">
                      mdi-pencil
                    </v-icon>
                    <v-icon small @click="deleteItem_pop(item)">
                      mdi-delete
                    </v-icon>
                  </template>
                </v-data-table>
                <v-col>
                  <v-pagination circle v-model="storageListCfg.page" :length="storageListCfg.pageCount"></v-pagination>
                </v-col>

              </v-card>

            </v-col>

            <v-col cols="6">
              <v-row class="mb-2">
                <v-col cols="8">
                  <h4 class="searchbox-title">창고 구역 목록</h4>
                </v-col>
                <v-col cols="4" class="pl-70">
                  <v-btn class="text-right ml-2" v-show="update == true" small color="green" @click="saveLocation"
                    :disabled="location_list.length == 0"><v-icon small>mdi-check </v-icon>저장
                  </v-btn>
                  <v-btn class="text-right ml-2" v-show="update == false" small color="green" @click="updateLocation"
                    :disabled="location_list.length == 0"><v-icon small>mdi-pencil </v-icon> 수정
                  </v-btn>
                  <v-btn class="text-right ml-2" small color="primary" @click="addLocation"
                    :disabled="location_list.length == 0"><v-icon small>mdi-plus </v-icon> 추가
                  </v-btn>
                  <v-btn class="text-right ml-2" v-show="update == false" small color="primary" @click="deleteLocation"
                    :disabled="location_list.length == 0"><v-icon small>mdi-minus </v-icon> 삭제
                  </v-btn>
                </v-col>
              </v-row>
              <v-card>
                <v-data-table fixed-header multi-sort height="600" v-model="locationTable" :headers="Locationheaders"
                  :items="location_list" :show-select="update == false" item-key="storageLocationId" dense
                  :options.sync="locationListCfg.options" :server-items-length="locationListCfg.totalCount"
                  :loading="locationListCfg.loading" :items-per-page="locationListCfg.itemsPerPage"
                  :page.sync="locationListCfg.page" @page-count="locationListCfg.pageCount = $event" hide-default-footer>
                  <template v-slot:item.storageArea="props">
                    <v-text-field :disabled="update == false" class="pa-0" placeholder="" v-model="props.item.storageArea"
                      single-line>
                      {{ props.item.storageArea }}
                    </v-text-field>
                  </template>
                  <template v-slot:item.memo="props">
                    <v-text-field :disabled="update == false" class="pa-0" placeholder="" v-model="props.item.memo"
                      single-line>
                      {{ props.item.memo }}
                    </v-text-field>
                  </template>
                  <template v-slot:item.isValid="props">
                    <v-checkbox class="editRow" v-model="props.item.isValid"
                      :value="props.item.isValid == true ? 'F' : 'Y'" :disabled="update == false"></v-checkbox>
                  </template>
                  <template v-slot:item.delete="{ item }">
                    <v-icon small @click="deleteTemp(item)" v-show="item.storageLocationId < 0">
                      mdi-delete
                    </v-icon>
                  </template>
                </v-data-table>
                <v-col>
                  <v-pagination circle v-model="locationListCfg.page" :length="locationListCfg.pageCount"></v-pagination>
                </v-col>

              </v-card>

            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="edit_customer" max-width="600px">
      <v-card>
        <v-card-title>
          <span>{{ formTitle }}</span>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-card-text>
          <v-col align-self="center">
            <v-text-field label="창고명" v-model="editedCustomer.name"></v-text-field>
          </v-col>
        </v-card-text>
        <v-card-actions>
          <v-col class="text-right">
            <v-btn color="success" text @click="clickSaveInfo"> 저장 </v-btn>
            <v-btn color="primary" text @click="closeModal_customer">
              닫기
            </v-btn>
          </v-col>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import * as api from "@/api";
import cfg from "./config";
import { gridCfg } from "@/util/config/";
import _ from "lodash";
import { Vue, Component, Watch } from "vue-property-decorator";

@Component
export default class Storage extends Vue {
  tempIdx: number = -1;
  locationTable: any[] = [];
  update: boolean = false;
  storageListCfg: any = {};
  locationListCfg: any = {};
  search_condition: any = {
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
  edit_customer: boolean = false;
  search: string = "";
  customer: object = {
    companyId: "",
    name: "",
    storageArea: ["기본창고"],
  };
  locationList: object = {
    storageId: "",
    storageLocations: [],
  };
  editedCustomer: object = {
    companyId: 1,
    name: "",
    storageArea: ["기본창고"],
  };
  editedIndex: number = -1;
  customer_list: object[] = [];
  location_list: any[] = [];
  rules: object = {
    required: (value: any) => !!value || "Required.",
    counter: (value: any) => value.length <= 20 || "Max 20 characters",
    email: (value: any) => {
      const pattern =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return pattern.test(value) || "Invalid e-mail.";
    },
  };

  created() {
    this.storageListCfg = Object.assign({}, gridCfg);
    this.locationListCfg = Object.assign({}, gridCfg);
  }

  get headers() {
    return cfg.header.headers;
  }
  get Locationheaders() {
    return cfg.header.Locationheaders;
  }
  get formTitle() {
    return this.editedIndex === -1 ? "창고 생성" : "창고 수정";
  }

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

  selectCustomer(data: any, row: any) {
    this.update = false;
    row.select(true);
    this.location_list = [];
    this.locationTable = [];

    const { page, itemsPerPage, sortBy, sortDesc } =
      this.locationListCfg.options;
    this.search_location.page = page;
    this.search_location.size = itemsPerPage;
    this.search_location.sortBy = sortBy;
    this.search_location.sortDesc = sortDesc;
    this.locationListCfg.loading = true;

    this.search_location.storageId = data.id;
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
  getCustomer() {
    const { page, itemsPerPage, sortBy, sortDesc } =
      this.storageListCfg.options;
    this.search_condition.page = page;
    this.search_condition.size = itemsPerPage;
    this.search_condition.sortBy = sortBy;
    this.search_condition.sortDesc = sortDesc;
    this.storageListCfg.loading = true;

    api.storage
      .getStorageList(this.search_condition)
      .then((response) => {
        this.customer_list = response.data.responseData;
        this.storageListCfg.totalCount = response.data.totalCount;
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.storageListCfg.loading = false;
      });
  }
  deleteItem(item: any) {
    api.storage
      .deleteStorageList(item)
      .then((response) => { })
      .catch((error) => {
        console.log(error);
      });
  }
  clickSaveInfo() {
    let customerInfo: any = this.editedCustomer;

    if (customerInfo.name == null) {
      return this.$swal("경고", "창고명을 입력해주세요", "error");
    }
    if (this.editedIndex > -1) {
      customerInfo = {
        id: customerInfo.id,
        name: customerInfo.name,
        storageArea: ["기본창고"],
      };
      api.storage
        .updateStorageList(customerInfo)
        .then((response) => {
          this.closeModal_customer();
          this.getCustomer();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      customerInfo["storageArea"] = ["기본창고"];
      api.storage
        .createStorageList(customerInfo)
        .then((response) => {
          this.closeModal_customer();
          this.getCustomer();
        })
        .catch((error) => {
          console.log(error);
        });
    }
    this.closeModal_customer();
  }
  // openModal_customer() {
  //   this.dialog_customer = true;
  // }
  closeModal_customer() {
    this.edit_customer = false;
    this.$nextTick(() => {
      this.editedCustomer = Object.assign({}, this.customer);
      this.editedIndex = -1;
    });
    this.customer = {
      companyId: "",
      name: "",
      storageArea: ["기본창고"],
    };
  }
  editItem(item: any) {
    this.editedIndex = this.customer_list.indexOf(item);
    this.editedCustomer = Object.assign({}, item);
    this.edit_customer = true;
  }
  deleteItem_pop(item: any) {
    let deleteItem = {
      id: item.id,
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
          api.storage
            .deleteStorageList(deleteItem)
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
              } else if (response.status == 400) {
                console.log(response.status);
                return this.$swal({
                  title: "이미 사용중인 창고는 삭제가 불가합니다.",
                  icon: "error",
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
              this.getCustomer();
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });
  }
  addLocation() {
    this.update = true;
    this.location_list.push({
      storageName: this.location_list[0].storageName,
      storageArea: "",
      storageLocationId: this.tempIdx--,
      memo: "",
      isValid: "Y",
    });
  }
  saveLocation() {
    this.locationTable = [];
    this.locationList = {};

    let check = true;
    for (var i = 0; i < this.location_list.length; i++) {
      if (this.location_list[i].storageArea == "") {
        check = false;
        return this.$swal({
          title: "창고명을 입력해주세요",
          icon: "error",
          position: "top",
          showCancelButton: false,
          showConfirmButton: false,
          toast: true,
          timer: 1500,
        });
      }

      if (this.location_list[i].storageArea != "") {
        if (this.location_list[i].isValid == null) {
          this.location_list[i].isValid = "F";
        }

        if (this.location_list[i].storageLocationId < 0) {
          this.location_list[i].storageLocationId = null;
        }

        this.locationTable.push({
          storageLocationId: this.location_list[i].storageLocationId,
          area: this.location_list[i].storageArea,
          memo: this.location_list[i].memo,
          isValid: this.location_list[i].isValid,
        });
      }
    }

    if (check) {
      this.locationList = {
        storageId: this.location_list[0].storageId,
        storageLocations: this.locationTable,
      };

      this.$swal
        .fire({
          title: "저장",
          text: "해당 데이터를 저장하시겠습니까?",
          icon: "info",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "저장",
        })
        .then((result) => {
          if (result.isConfirmed) {
            api.storage
              .createLocationList(this.locationList)
              .then((response) => {
                if (response.status == 200) {
                  this.$swal({
                    title: "저장되었습니다.",
                    icon: "success",
                    position: "top",
                    showCancelButton: false,
                    showConfirmButton: false,
                    toast: true,
                    timer: 1500,
                  });
                  this.locationTable = [];
                  this.update = false;
                  this.getCustomer();
                  api.storage
                    .getStorageLocationList(this.search_location)
                    .then((response) => {
                      this.location_list = response.data.responseData;
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                } else {
                  this.$swal({
                    title: "저장이 실패되었습니다.",
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
                this.$swal({
                  title: "저장이 실패되었습니다.",
                  icon: "error",
                  position: "top",
                  showCancelButton: false,
                  showConfirmButton: false,
                  toast: true,
                  timer: 1500,
                });
              });
          }
        });
    }
  }
  updateLocation() {
    this.update = true;
  }
  deleteLocation() {
    const totalListCount = this.location_list.length;

    let check: boolean = true;
    let Item: any = {
      ids: [],
    };
    if (totalListCount < 1 || totalListCount == this.locationTable.length) {
      return this.$swal({
        title: "1개이상의 구역은 존재해야합니다.",
        icon: "error",
        position: "top",
        showCancelButton: false,
        showConfirmButton: false,
        toast: true,
        timer: 1500,
      });
    }

    if (totalListCount > 1) {
      for (var i = 0; i < this.locationTable.length; i++) {
        check = false;
        Item.ids.push(this.locationTable[i].storageLocationId);
      }

      if (!check) {
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
              api.storage
                .deleteStorageLocationList(Item)
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
                    this.locationTable = [];
                    this.update = false;
                    this.getCustomer();
                    api.storage
                      .getStorageLocationList(this.search_location)
                      .then((response) => {
                        this.location_list = response.data.responseData;
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  } else if (response.status == 400) {
                    console.log(response.status);
                    return this.$swal({
                      title: "이미 사용중인 구역은 삭제가 불가합니다.",
                      icon: "error",
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
                });
            }
          });
      }
    }
  }
  deleteTemp(item: any) {
    let removeID: any = [];

    removeID.push(item.storageLocationId);
    this.location_list = _.reject(this.location_list, function (o) {
      return removeID.includes(o.storageLocationId);
    });
  }
}
</script>

<style src="./StorageMng.scss" lang="scss"></style>
