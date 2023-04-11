<template>
  <div>
    <v-container fluid v-resize="onResize">
      <v-row>
        <v-col class="ma-2" cols="12">
          <span class="searchbox-title">조회 조건</span>
          <v-card class="card-shadow pa-3" height="65">
            <v-row dense>
              <v-col cols="2">
                <v-text-field label="코드 or 이름" v-model="search_condition.item" @keydown.enter="getCustomer" dense solo
                  rounded elevation-0></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-select label="타입" v-model="search_condition.type" :items="items_type_list" item-text="name"
                  @change="getCustomer" dense solo rounded></v-select>
              </v-col>
              <v-col cols="2">
                <v-text-field label="규격 or 단위" solo rounded v-model="search_condition.option" @keydown.enter="getCustomer"
                  dense solon rounded></v-text-field>
              </v-col>
              <!-- <v-col cols="1">
                <v-text-field
                  label="버전"
                  v-model="search_condition.version"
                  @keydown.enter="getCustomer"
                  dense
                  outlined
                  rounded="xl"
                ></v-text-field>
              </v-col> -->
              <v-spacer></v-spacer>

              <v-col class="text-right" cols="2">
                <v-btn color="primary" @click="getCustomer" large elevation="0">
                  조회
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>





      <v-row no-gutters>
        <v-col class="ma-2" cols="12">
          <v-row dense class="mb-2">
            <v-col cols="1" align-self="center">
              <span class="searchbox-title">품목 목록</span>
            </v-col>
            <v-spacer></v-spacer>

            <v-col class="text-right" cols="3">
              <v-btn color="primary" @click="openModal" elevation="0"><v-icon left> mdi-book-account </v-icon>품목
                추가</v-btn>
            </v-col>
          </v-row>
            <v-card>
            <v-data-table :height="table_height" :headers="headers" :items="customer_list" fixed-header multi-sort
              @click:row="selectCustomer" :options.sync="itemListCfg.options"
              :server-items-length="itemListCfg.totalCount" :loading="itemListCfg.loading"
              :items-per-page="itemListCfg.itemsPerPage" :page.sync="itemListCfg.page"
              @page-count="itemListCfg.pageCount = $event" hide-default-footer>
              <template v-slot:[`item.edit`]="{ item }">
                <v-icon small class="mr-2" @click="editItem(item, (itemDialog_type = false))">
                  mdi-pencil
                </v-icon>
                <v-icon small @click="deleteItem_pop(item)">
                  mdi-delete
                </v-icon>
              </template>
              <template v-slot:[`item.process`]="{ item }">
                <v-btn v-show="item.type == '완제품'" color="primary" @click="openProcessModal(item)"
                  elevation="0">공정관리</v-btn>
              </template>
            </v-data-table>
          </v-card>
          <v-pagination circle v-model="itemListCfg.page" :length="itemListCfg.pageCount"></v-pagination>
        </v-col>
      </v-row>
    </v-container>
    <!-- 거래처 생성 모달 -->
    <ItemModal :open="itemDialog" :editedIndex="itemDialog_type" :editedData="editedCustomer" :storageData="storage_data"
      :locationData="location_data" @changeStorage="getLocation" @closeModal="closeModal" @save-data="handlerSaveData">
    </ItemModal>
    <!-- 공정관리 모달 -->
    <v-dialog v-model="processDialog" persistent max-width="1500px" transition="dialog-transition">
      <v-card>
        <v-card-title primary-title>
          <span>공정관리</span>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="openProcessAddModal">공정추가</v-btn>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="5">
              <v-data-table :headers="headers_process" :items="processList" height="500" hide-default-footer
                class="elevation-1" item-key="processId" fixed-header single-select v-model="selectedProcess"
                @click:row="getProcessDetail">
                <template v-slot:[`item.delete`]="{ item }">
                  <v-icon small @click="deleteProcess(item)">
                    mdi-delete
                  </v-icon>
                  <v-btn icon color="primary" @click="downProcessExcel(item)">
                    <v-icon small>mdi-tray-arrow-down</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </v-col>
            <v-col cols="7">
              <v-data-table :headers="headers_processDetail" :items="processDetailList"
                :items-per-page="processDetailList.length" fixed-header height="500" :loading="processDetail_loading"
                loading-text="서버에 요청중...." no-data-text="데이터가 없습니다." hide-default-footer class="elevation-1">
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="closeProcessModal">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="ProcessAddDialog" persistent max-width="450px" transition="dialog-transition">
      <v-card>
        <v-card-title>
          <span>공정추가</span>
        </v-card-title>
        <v-card-text>
          <v-row dense>
            <v-col cols="2">
              <v-list-item-content>공정명</v-list-item-content>
            </v-col>
            <v-col cols="5">
              <v-text-field dense clearable v-model="processData.name"></v-text-field>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="2">
              <v-list-item-content>버전</v-list-item-content>
            </v-col>
            <v-col cols="2">
              <v-text-field dense type="number" step="0.1" min="1.0" v-model="processData.verson" reverse></v-text-field>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="2">
              <v-list-item-content>EXCEL</v-list-item-content>
            </v-col>
            <v-col cols="8">
              <v-file-input ref="uploadProcess" dense accept="xlsx/*" label="공정파일"
                v-model="processData.file"></v-file-input>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="saveProcess">저장</v-btn>
          <v-btn color="primary" @click="cloaseProcessAddModal">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import * as api from "@/api";
import cfg from "./config";
import { gridCfg } from "@/util/config/";
import ItemModal from "./ItemModal.vue";
import { Vue, Component, Watch } from "vue-property-decorator";

@Component({
  components: {
    ItemModal,
  },
  filters: {
    comma(val: number) {
      if (val === null) {
        val = 0;
      }
      return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
})
export default class Item extends Vue {
  windowSize: any = {
    x: 0,
    y: 0,
  };
  table_height: number = 0;
  itemDialog: boolean = false;
  itemDialog_type: boolean = false;
  processDialog: boolean = false;
  ProcessAddDialog: boolean = false;
  edit_customer: boolean = false;
  items_storage: [] = [];
  items_location: [] = [];
  itemListCfg: any = {};
  storage_data: [] = [];
  location_data: [] = [];
  items_type_list: object[] = [];
  items_type: object[] = [];
  customer: object = {};
  processList: object[] = [];
  processDetailList: object[] = [];
  processDetail_loading: boolean = false;
  editedCustomer: any = {
    id: 1,
    code: "",
    standard: "",
    type: "",
    unit: "",
    storageId: "",
    storageLocationId: "",
  };
  processData: any = {
    name: "",
    verson: 0,
    file: "",
  };
  editedIndex: number = -1;
  //customer_list: object[] = [];
  customer_list: Array<string> = [];




  search_condition: any = {
    item: "",
    type: "",
    option: "",
    version: "",
  };
  selectItemID: number = 0;
  selectedProcess: object = {};

  get headers() {
    return cfg.header.itemList;
  }

  get headers_process() {
    return cfg.header.processList;
  }
  get headers_processDetail() {
    return cfg.header.processDetailList;
  }

  created() {
    this.itemListCfg = Object.assign({}, gridCfg);
    this.items_type_list = Object.assign([], cfg.data.items_type_list);
    this.items_type = Object.assign([], cfg.data.items_type);
  }

  mounted() {
    this.onResize();
  }

  @Watch("itemListCfg.options", { deep: true })
  onItemListChange() {
    this.getCustomer();
  }

  onResize() {
    this.table_height = window.innerHeight - 48 - 129 - 44 - 44 - 20;
    console.log("onResize", this.table_height);
  }

  handlerSaveData(data: any, editedIndex: number) {
    if (!editedIndex) {
      data = {
        version: data.version,
        name: data.name,
        id: data.id,
        standard: data.standard,
        code: data.code,
        type: data.type,
        unit: data.unit,
        storageId: data.storageId,
        storageLocationId: data.storageLocationId,
      };
      api.item
        .updateItemList(data)
        .then((response) => {
          console.log("updateItemList", response);
          this.alertResult(response.data.isSuccess);
          this.closeModal();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      api.item
        .createItemList(data)
        .then((response) => {
          console.log("createCustomerItem", response);
          this.alertResult(response.data.isSuccess);
          this.closeModal();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  alertResult(isSuccess: boolean) {
    if (isSuccess) {
      this.$swal({
        title: "저장되었습니다.",
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

  selectCustomer(data: any) {
    console.log("selectCustomer", data);
  }

  getCustomer() {
    const { page, itemsPerPage, sortBy, sortDesc } = this.itemListCfg.options;

    this.search_condition.page = page;
    this.search_condition.size = itemsPerPage;
    this.search_condition.sortBy = sortBy;
    this.search_condition.sortDesc = sortDesc;
    this.itemListCfg.loading = true;
    api.item
      .getItemList(this.search_condition)
      .then((response) => {
        console.log("getCustomerList", response);
        this.customer_list = response.data.responseData;
        this.itemListCfg.totalCount = response.data.totalCount;
        this.itemListCfg.loading = false;
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.itemListCfg.loading = false;
      });
  }
  downProcessExcel(item: any) {
    console.log("downProcessExcel", item);
    let reqData = {
      processId: item.processId,
    };
    let date = new Date();
    api.process.getProcessExcelDown(reqData).then((response) => {
      console.log("getProcessExcelDown", response.headers);

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: response.headers["content-type"] })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${item.processName}_${item.processVersion}_${date.getFullYear()}${(
          date.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
    });
  }

  deleteItem(item: any) {
    console.log("item", item);
  }

  openProcessModal(item: any) {
    this.processDialog = true;
    this.selectItemID = item.id;
    this.getProcessList();
  }

  closeProcessModal() {
    this.processDialog = false;
    this.processList = [];
    this.processDetailList = [];
    this.selectedProcess = {};
  }

  openProcessAddModal() {
    this.ProcessAddDialog = true;
  }

  openModal() {
    this.itemDialog = true;
    this.itemDialog_type = true;
    api.item
      .getItemPage()
      .then((response) => {
        console.log("openModal_customer", response);
        this.storage_data = response.data.responseData.basicStorages;

        console.log("this.items_location", this.items_location);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  closeModal() {
    this.itemDialog = false;
    this.editedCustomer = Object.assign({}, this.customer);
    this.getCustomer();
    console.log("closeModal");
  }

  async editItem(item: any, edit_type: any) {
    console.log(this);

    this.editedIndex = this.customer_list.indexOf(item);
    this.editedCustomer = Object.assign({}, item);

    api.item
      .getItemPage()
      .then((response) => {
        console.log("openModal_customer", response);
        this.storage_data = response.data.responseData.basicStorages;

        console.log("this.items_location", this.items_location);
      })
      .catch((error) => {
        console.log(error);
      });
    await this.getLocation(this.editedCustomer.storageId);
    this.itemDialog = true;
    this.itemDialog_type = edit_type;
    this.edit_customer = true;
  }

  deleteItem_pop(item: any) {
    //this.deleteIndex = this.customer_list.indexOf(item);
    console.log("deleteItem_pop", item);
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
          api.item
            .deleteItemList(deleteItem)
            .then((response) => {
              if (response.status == 200) {
                this.getCustomer();
                this.$swal.fire("성공", "삭제되었습니다.", "success");
                console.log("getCustomerList", response);
              } else {
                this.$swal.fire("실패", "관리자에게 문의바랍니다.", "error");
              }
            })
            .catch((error) => {
              console.log(error);
            });

          this.deleteItem(deleteItem);
        }
      });
  }

  getLocation(id: any) {
    this.location_data = [];

    let storageId = {
      storageId: id,
    };
    api.stock
      .getStockTakingLocationList(storageId)
      .then((response) => {
        this.location_data = response.data.responseData;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getProcessList() {
    let reqData: any = {
      itemId: this.selectItemID,
    };

    console.log('mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm', reqData)


    api.process
      .getProcessListbyItem(reqData)
      .then((res) => {
        console.log("getProcessListbyItem", res);
        console.log('mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm11111', this.processList)
        //this.processList = res.data.responseData;
        console.log('mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm22222', this.processList)
      })
      .catch((err) => {
        console.log("err", err);
      });
  }

  getProcessDetail(item: any, row: any) {
    row.select(true);
    let reqData = {
      processId: item.processId,
    };
    this.processDetail_loading = true;

    api.process
      .getProcessDetail(reqData)
      .then((res) => {
        console.log("getProcessDetail", res);
        this.processDetailList = res.data.responseData;
        this.processDetail_loading = false;
      })
      .catch((err) => {
        console.log("err", err);
        this.processDetail_loading = false;
      });
  }

  saveProcess() {
    let reqData = {
      CreateProcessDto: {
        processName: this.processData.name,
        processVersion: this.processData.verson,
        itemId: this.selectItemID,
      },
      ExcelFile: this.processData.file,
    };

    const formData = new FormData();
    formData.append("ExcelFile", this.processData.file);
    formData.append(
      "CreateProcessDto",
      new Blob([JSON.stringify(reqData.CreateProcessDto)], {
        type: "application/json",
      })
    );

    console.log("reqData", formData);

    api.process.postProcess(formData).then((res) => {
      console.log("postProcess", res);
      if (res.status == 200) {
        this.$swal({
          title: "공정이 등록되었습니다.",
          icon: "success",
          position: "top",
          showCancelButton: false,
          showConfirmButton: false,
          toast: true,
          timer: 1500,
        });
      } else {
        this.$swal.fire("실패", "관리자에게 문의바랍니다.", "error");
      }

      this.cloaseProcessAddModal();
    });
  }

  cloaseProcessAddModal() {
    this.processData.name = "";
    (this.processData.verson = 1.0), (this.processData.file = "");
    this.processData.verson = 0;
    this.ProcessAddDialog = false;
    this.processDetailList = [];
    this.getProcessList();
  }

  deleteProcess(item: any) {
    let reqData = {
      processId: item.processId,
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
          api.process
            .deleteProcess(reqData)
            .then((response) => {
              if (response.status == 200) {
                this.processDetailList = [];
                this.getProcessList();
                this.$swal({
                  title: "삭제되었습니다.",
                  icon: "success",
                  position: "top",
                  showCancelButton: false,
                  showConfirmButton: false,
                  toast: true,
                  timer: 1500,
                });
                console.log("deleteProcess", response);
              } else {
                this.$swal.fire("실패", "관리자에게 문의바랍니다.", "error");
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });
  }
}
</script>

<style src="../SmartFarm/SmartFarm.scss" lang="scss"></style>
