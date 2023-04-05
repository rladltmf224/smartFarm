<template>
	<div>
		<v-container fluid v-resize="onResize">
			<v-row>
				<v-col class="ma-2" cols="12">
					<span class="searchbox-title">조회 조건</span>
					<v-card class="card-shadow pa-3" height="80">
						<v-row dense>
							<!-- 시작일 -->
							<v-col cols="2">
								<v-menu v-model="menu1" :close-on-content-click="false" :nudge-right="40"
									transition="scale-transition" offset-y min-width="auto">
									<template v-slot:activator="{ on, attrs }">
										<v-text-field rounded solo v-model="startDate" label="시작일" readonly dense
											hide-details="true" v-bind="attrs" v-on="on"></v-text-field>
									</template>
									<v-date-picker v-model="startDate" @input="menu1 = false" no-title></v-date-picker>
								</v-menu>
							</v-col>
							<!-- 종료일 -->
							<v-col cols="2">
								<v-menu v-model="menu2" :close-on-content-click="false" :nudge-right="40"
									transition="scale-transition" offset-y="offset-y" min-width="auto">
									<template v-slot:activator="{ on, attrs }">
										<v-text-field v-model="endDate" label="종료일" solo rounded dense readonly="readonly"
											hide-details="false " v-bind="attrs" v-on="on"></v-text-field>
									</template>
									<v-date-picker no-title v-model="endDate" @input="menu2 = false" :min="startDate"
										:max="endDate"></v-date-picker>
								</v-menu>
							</v-col>
							<!-- 검색어 -->
							<v-col cols="2">
								<v-text-field label="검색어" v-model="keyword" append-icon="mdi-magnify" dense solo
									rounded></v-text-field>
							</v-col>
							<!-- 조회버튼 -->
							<v-spacer></v-spacer>
							<v-col cols="1" class="d-flex justify-center align-center">
								<v-btn color="primary" @click="getData()">
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
							<span class="searchbox-title">실험 목록</span>
						</v-col>
						<v-spacer></v-spacer>
						<v-col class="text-right" cols="3">
							<v-btn color="primary" @click="dialogOpen" elevation="0"><v-icon left> mdi-book-account
								</v-icon>실험
								추가</v-btn>
						</v-col>
					</v-row>
					<v-card>
						<v-data-table :headers="datas_header" :items="datas" :page.sync="page" :options.sync="options"
							:server-items-length="totalData" :items-per-page="itemsPerPage" :loading="loading"
							:height="table_height" hide-default-footer multi-sort @page-count="pageCount = $event">
							<template v-slot:item.showmore="{ item }">
								<v-icon @click="$router.push({ name: 'ShowTestForm', params: { id: item.growthReportId } })"
									small>
									mdi-magnify
								</v-icon>
							</template>
							<template v-slot:item.load="{ item }">
								<v-btn small fab icon class="ma-1" @click="editItem(item)">
									<v-icon small>mdi-plus </v-icon></v-btn>
							</template>
							<template v-slot:item.delete="{ item }">
								<v-icon @click="deleteItem(item)" small>
									mdi-delete
								</v-icon>
							</template>
							<!-- 수정 -->
							<!-- 제어명칭 -->
						</v-data-table>
					</v-card>
					<v-pagination circle v-model="page" :length="pageCount"></v-pagination>
				</v-col>
			</v-row>


			<div class="text-center">
				<v-snackbar v-model="snackbar" :timeout="timeout">
					{{ text }}
				</v-snackbar>
			</div>
		</v-container>
		<!-- 신규테스트 등록 모달 -->
		<v-dialog v-model="dialog" persistent max-width="1000px">
			<v-card>
				<v-card-title>
					<span>신규테스트 등록</span>
				</v-card-title>
				<v-card-text>
					<v-row>
						<v-col cols="5">
							<v-text-field solo rounded dense label="실험군 명" :rules="nameRules" hide-details="auto"
								v-model="editedItem.testName"></v-text-field>
						</v-col>
						<v-col cols="2">
							<v-menu v-model="menu" :close-on-content-click="false" :nudge-width="400" offset-x
								max-height="600">
								<template v-slot:activator="{ on, attrs }">
									<v-btn color="primary" @click="getDataSimple()" v-bind="attrs" v-on="on"
										v-show="editedIndex == -1">
										불러오기
									</v-btn>
								</template>
								<v-card class="pa-3">
									<v-data-table :headers="datas_header_simple" :items="datas_simple" dense
										:items-per-page=100 item-key="name" class="elevation-1" :search="search"
										hide-default-footer height="300">
										<template v-slot:top>
											<v-text-field v-model="search" label="실험명으로 검색" class="mx-4"></v-text-field>
										</template>
										<template v-slot:item.testName="{ item }">
											<v-btn @click="cloneItem(item)" class="ma-2" outlined color="indigo">
												{{ item.testName }}
											</v-btn>
										</template>

									</v-data-table>
									</v-list-item>
									</v-list>
									<v-divider></v-divider>
									<v-card-actions>
										<v-spacer></v-spacer>
										<v-btn text @click="menu = false">
											닫기
										</v-btn>
										<v-btn color="primary" text @click="menu = false">
											선택
										</v-btn>
									</v-card-actions>
								</v-card>
							</v-menu>
						</v-col>
						<v-col cols="6">
							<v-text-field v-model="editedItem.numSample" type="number" ref="input" label="개체수">
							</v-text-field>
						</v-col>
						<v-col cols="6">
							<v-text-field @input="numSampleNum()" min="1" v-model="editedItem.numTreatment" type="number"
								label="처리구 수" hint="2~15개">
							</v-text-field>
						</v-col>
						<v-col v-for="idx in Array.from({ length: editedItem.numTreatment }, (v, i) => i + 1)" :key="idx"
							cols="12" sm="6" md="4">

							<v-text-field solo rounded dense clearable :placeholder="idx + '번 처리구명'" hint="최대 50자"
								v-model="nameArr[idx - 1]" type="text"> </v-text-field>
						</v-col>
						<v-col cols="12">
							<v-text-field label="작성 날짜 개수*" type="number" min="1"
								v-model="editedItem.numDay"></v-text-field>
						</v-col>
						<v-col cols="12">
							<v-text-field dense rounded solo label="실험조건" v-model="editedItem.testCondition"></v-text-field>
						</v-col>
					</v-row>

				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="primary" @click="save">저장</v-btn>
					<v-btn color="error" @click="dialogClose">닫기</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<!-- 정말 삭제하시겠습니까? -->
		<v-dialog v-model="dialogDelete" max-width="500px">
			<v-card>
				<v-card-title class="text-h5">정말 삭제하시겠습니까?</v-card-title>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="blue darken-1" text @click="closeDelete()">취소</v-btn>
					<v-btn color="blue darken-1" text @click="deleteItemConfirm()">예</v-btn>
					<v-spacer></v-spacer>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<!-- 삭제되었습니다 스낵바 -->
		<v-snackbar v-model="delete_snackbar" :timeout="timeout">
			{{ delete_text }}
			<template v-slot:action="{ attrs }">
				<v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
					Close
				</v-btn>
			</template>
		</v-snackbar>

	</div>
</template>
<script lang="ts">
import * as api from "@/api/index.js";
import { Vue, Component, Watch } from "vue-property-decorator";
import { component } from "vue/types/umd";

@Component({
	components: {

	}
})
export default class ShowTest extends Vue {
	page: number = 1;
	loading: boolean = false;
	itemsPerPage: number = 12;
	options: any = {};
	totalData: number = 0;
	pageCount: number = 10;
	keyword: string = '';
	nameRules: any = [
		(v: any) => !!v || '실험군 명을 입력해주세요.',
		(v: any) => (v && v.length <= 50) || '50자 이내입니다.',
	];
	items: any = [];
	menu: boolean = false;
	snackbar: boolean = false;
	delete_snackbar: boolean = false;
	delete_text: string = "삭제되었습니다.";
	text: string = '등록되었습니다.';
	timeout: number = 2000;
	search: string = '';
	startDate: any = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
		.toISOString()
		.substr(0, 10);
	endDate: any = new Date().toISOString().substr(0, 10);
	dialog: boolean = false;
	dialogDelete: boolean = false;
	editedIndex: number = -1;
	datas_header: any = [
		{ text: "실험명", value: "testName" },
		{ text: "작성날짜 개수", value: "numDay" },
		{ text: "개체 수", value: "numSample" },
		{ text: "처리구 개수", value: "numTreatment" },
		{ text: "메모", value: "testCondition" },
		{ text: "상세조회", value: "showmore" },
		{ text: "해당실험 기반 생성", value: "load" },
		{ text: "삭제", value: "delete" },
	];
	datas: any = [];
	datas_header_simple: any = [{ text: '실험명', value: 'testName' }];
	datas_simple: any = [];
	menu1: boolean = false;
	menu2: boolean = false;
	editedItem: any = {
		testName: "",
		testCondition: '',
		numTreatment: 1,
		numSample: 2,
		numDay: 1,
		treatmentNames: [],
	};
	table_height: number = 0;
	nameArr: any = [];
	defaultItem: any = {
		testName: "",
		testCondition: '',
		numTreatment: 1,
		numSample: 2,
		numDay: 1,
		treatmentNames: [],
	}

	@Watch('dialog')
	dialogChange(val: boolean) {
		val || this.close()
	}

	@Watch('dialogDelete')
	dialogDeleteChange(val: boolean) {
		val || this.closeDelete()
	}

	@Watch('options', { deep: true })
	changeOptions() {
		this.getData()
	}

	mounted() {
		this.onResize();
		this.twoMonthAgo();
		this.getData();
	}

	onResize() {
		this.table_height = window.innerHeight - 301;
		console.log("onResize", this.table_height);
	}


	twoMonthAgo() {
		var now = new Date();	// 현재 날짜 및 시간
		var twoMonthAgo = new Date(now.setMonth(now.getMonth() - 2));	// 한달 전
		const year = twoMonthAgo.getFullYear();
		const month = ('0' + (twoMonthAgo.getMonth() + 1)).slice(-2);
		const day = ('0' + twoMonthAgo.getDate()).slice(-2);
		const dateStr = year + '-' + month + '-' + day;
		this.startDate = dateStr
	}

	close() {
		this.dialog = false;
		this.$nextTick(() => {
			this.editedItem = Object.assign({}, this.defaultItem);
			this.editedIndex = -1;
		});
	}

	getDataSimple() {
		api.growthresearch.LoadGrowthResearch().then((res) => {
			this.datas_simple = res.data.responseData;
		});
	}

	getData() {
		this.loading = true;
		const { page, itemsPerPage, sortBy, sortDesc } = this.options;
		let item = {
			testName: this.keyword,			//검색어
			startDate: this.startDate,			//시작일
			endDate: this.endDate,			//종료일
			page: page,			//페이지 수
			size: itemsPerPage, //보여주고싶은 행의개수
			sortBy: sortBy,			//sortby
			sortDesc: sortDesc,			//sortDesc
		}
		api.growthresearch.getGrowthResearch(item)
			.then((res) => {
				this.loading = false;
				this.datas = res.data.responseData;
				this.items = res.data.responseData;
				this.totalData = res.data.totalCount;
			})
			.catch((error) => {
			});
	}

	dialogOpen() {// 다이아로그오픈
		this.dialog = true;
	}

	dialogClose() {// 다이아로그 닫기
		this.editedItem = {
			testName: "",
			testCondition: '',
			numTreatment: 1,
			numSample: 2,
			numDay: 1,
			treatmentNames: [],
		}
		this.defaultItem = {
			testName: "",
			testCondition: '',
			numTreatment: 1,
			numSample: 2,
			numDay: 1,
			treatmentNames: [],
		}
		this.nameArr = [],
			this.dialog = false;
	}

	deleteItem(item: any) { //휴지통 눌렀을때 
		let id = item.growthReportId
		this.editedIndex = this.datas.indexOf(item);
		this.editedItem = Object.assign({}, item);
		this.dialogDelete = true;
	}

	deleteItemConfirm() { //예를 눌렀을때
		this.datas.splice(this.editedIndex, 1)
		let id = {
			growthReportId: this.editedItem.growthReportId
		}
		api.growthresearch.DeleteGrowthResearch(id).then((res) => {
		})
		this.closeDelete();
		this.delete_snackbar = true
	}

	closeDelete() { //삭제취소눌렀을때 
		this.dialogDelete = false;
		this.$nextTick(() => {
			this.editedItem = Object.assign({}, this.defaultItem);
			this.editedIndex = -1;
		});
	}

	save() {
		if (this.editedItem.testName == '') {
			alert('실험군 명을 입력해주세요.')
			return
		} else if (this.nameArr.length == 0) {
			alert('처리구명을 입력해주세요.')
			return
		}
		else if (this.editedItem.testName != '') {
			var item = {
				testName: this.editedItem.testName,
				testCondition: this.editedItem.testCondition,
				numTreatment: this.editedItem.numTreatment,
				numSample: this.editedItem.numSample,
				numDay: this.editedItem.numDay,
				treatmentNames: this.nameArr,
			};
			if (this.editedIndex == -1) { //신규 등록일 때
				api.growthresearch.RegisterGrowthResearch(item)
					.then((response) => {
						this.dialogClose()
						this.nameArr = [];
						this.getData();
					})
					.catch((error) => {
						console.log(error.response.status);
						console.log(error.response);
						if (error.response.status == 400) {
							console.log('dd')
							return;
						}
					});
			}
			this.snackbar = true
		}
		this.close();
	}

	editItem(item: any) {
		this.editedIndex = this.datas.indexOf(item);
		this.editedItem = Object.assign({}, item);
		this.dialog = true;
		let id = {
			growthReportId: item.growthReportId,
		};
		api.growthresearch.MakeBeforeTestDefaulted(id).then((res) => {
			this.nameArr = res.data.responseData.treatmentNames;
		});
	}

	cloneItem(item: any) {
		let id = {
			growthReportId: item.growthReportId,
		};
		api.growthresearch.MakeBeforeTestDefaulted(id).then((res) => {
			this.editedItem = res.data.responseData
			this.nameArr = res.data.responseData.treatmentNames;
		})
	}

}

</script>

<style src="../SmartFarm.scss" lang="scss">
.v-text-field__details {
	display: none;
}
</style>