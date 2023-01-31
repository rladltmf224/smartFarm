<template>
	<v-app>
		<v-container fluid>
			<v-row>
				<v-col class="ma-2" md="12">
					<h4 class="searchbox-title">조회 조건</h4>
					<v-sheet class="pa-3" color="#F6F8F9" height="80" elevation="2">
						<v-row>
							<!-- 시작일 -->
							<v-col cols="2">
								<v-menu v-model="menu1" :close-on-content-click="false" :nudge-right="40"
									transition="scale-transition" offset-y min-width="auto">
									<template v-slot:activator="{ on, attrs }">
										<v-text-field v-model="startDate" label="시작일" prepend-icon="mdi-calendar"
											readonly v-bind="attrs" v-on="on"></v-text-field>
									</template>
									<v-date-picker v-model="startDate" @input="menu1 = false" no-title></v-date-picker>
								</v-menu>
							</v-col>
							<!-- 종료일 -->
							<v-col cols="2">
								<v-menu v-model="menu2" :close-on-content-click="false" :nudge-right="40"
									transition="scale-transition" offset-y="offset-y" min-width="auto">
									<template v-slot:activator="{ on, attrs }">
										<v-text-field v-model="endDate" label="종료일" prepend-icon="mdi-calendar"
											readonly="readonly" v-bind="attrs" v-on="on"></v-text-field>
									</template>
									<v-date-picker no-title v-model="endDate" @input="menu2 = false" :min="startDate"
										:max="endDate"></v-date-picker>
								</v-menu>
							</v-col>
							<!-- 검색어 -->
							<v-col cols="2">
								<v-text-field label="검색어" v-model="keyword" append-icon="mdi-magnify"></v-text-field>
							</v-col>
							<!-- 조회버튼 -->
							<v-col cols="1" class="d-flex justify-center align-center">
								<v-btn color="primary" @click="getData()">
									조회
								</v-btn>
							</v-col>
						</v-row>
					</v-sheet>
				</v-col>
			</v-row>

			<v-row class="text-right ">
				<v-col class="mt-0  pt-2 pb-0 mb-0">
					<v-btn color="primary" @click="dialogOpen">신규테스트 등록</v-btn>
				</v-col>
			</v-row>
			<v-row class="">
				<v-col class="ma-2 py-0 my-0   " md="12">
					<v-col cols="3">
					</v-col>
					<v-data-table :headers="datas_header" :items="datas" :page.sync="page" :options.sync="options"
						:server-items-length="totalData" :items-per-page="itemsPerPage" :loading="loading" dense
						hide-default-footer multi-sort @page-count="pageCount = $event" class="elevation-1">
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
					<div class="text-center pt-2">
						<v-pagination v-model="page" :length="pageCount"></v-pagination>
					</div>

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
					<span class="text-h5">신규테스트 등록</span>
				</v-card-title>
				<v-card-text>
					<v-container>
						<v-row>
							<v-col cols="10">
								<v-text-field label="실험군 명" :rules="nameRules" hide-details="auto"
									v-model="editedItem.testName"></v-text-field>
							</v-col>
							<v-col cols="2" class="d-flex align-center">
								<v-menu v-model="menu" :close-on-content-click="false" :nudge-width="400" offset-x
									max-height="600">
									<template v-slot:activator="{ on, attrs }">
										<v-btn color="white" @click="getDataSimple()" v-bind="attrs" v-on="on" small
											v-show="editedIndex == -1">
											불러오기
										</v-btn>
									</template>

									<v-card class="pa-3">
										<v-data-table :headers="datas_header_simple" :items="datas_simple" dense
											:items-per-page=100 item-key="name" class="elevation-1" :search="search"
											hide-default-footer height="300">
											<template v-slot:top>
												<v-text-field v-model="search" label="실험명으로 검색"
													class="mx-4"></v-text-field>
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
								<v-text-field @input="numSampleNum()" min="1" v-model="editedItem.numTreatment"
									type="number" label="처리구 수" hint="2~15개">
								</v-text-field>
							</v-col>
							<v-col v-for="idx in Array.from({ length: editedItem.numTreatment }, (v, i) => i + 1)"
								:key="idx" cols="12" sm="6" md="4">

								<v-text-field clearable :placeholder="idx + '번 처리구명'" hint="최대 50자"
									v-model="nameArr[idx - 1]" type="text"> </v-text-field>
							</v-col>
							<v-col cols="12">
								<v-text-field label="작성 날짜 개수*" type="number" min="1"
									v-model="editedItem.numDay"></v-text-field>
							</v-col>
							<v-col cols="12">
								<v-text-field label="실험조건" v-model="editedItem.testCondition"></v-text-field>
							</v-col>
						</v-row>
					</v-container>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="blue darken-1" text @click="dialogClose()">
						닫기
					</v-btn>
					<v-btn color="blue darken-1" text @click="save()">
						등록
					</v-btn>


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

	</v-app>
</template>
<script>
// import {
// 	MakeBeforeTestDefaulted, //해당실험기반생성
// 	getGrowthResearch, //생육조사실험조회
// 	LoadGrowthResearch, //생육조사실험 불러오기
// 	RegisterGrowthResearch, //생육조사실험등록
// 	DeleteGrowthResearch //생육조사일지 삭제(행삭제)
// } from "@/api/index.js";
import * as api from "@/api/index.js";
export default {
	name: "InputData",
	data() {
		return {
			page: 1,
			loading: false,
			itemsPerPage: 12,
			options: {},
			totalData: 0, //총 데이타의 개수 백엔드에서받아서 교체할것임
			pageCount: 10,
			keyword: '', //검색어
			nameRules: [ // 모달창 등록 시 유효성검사
				v => !!v || '실험군 명을 입력해주세요.',
				v => (v && v.length <= 50) || '50자 이내입니다.',
			],
			items: [],
			menu: false,
			snackbar: false,	// 스낵바
			delete_snackbar: false,
			delete_text: "삭제되었습니다.",
			text: "등록되었습니다.",
			timeout: 2000,
			search: "",
			startDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
				.toISOString()
				.substr(0, 10),
			endDate: new Date().toISOString().substr(0, 10),
			dialog: false,
			dialogDelete: false,
			editedIndex: -1,
			datas_header: [
				{
					text: "실험명",
					value: "testName",
				},
				{ text: "작성날짜 개수", value: "numDay" },
				{ text: "개체 수", value: "numSample" },
				{ text: "처리구 개수", value: "numTreatment" },
				{ text: "메모", value: "testCondition" },
				{ text: "상세조회", value: "showmore" },
				{ text: "해당실험 기반 생성", value: "load" },
				{ text: "삭제", value: "delete" },
			],
			datas: [],
			datas_header_simple: [
				{
					text: "실험명",
					value: "testName",
				}
			],
			datas_simple: [],
			menu1: false,
			menu2: false,
			editedItem: {
				//모달
				testName: "",
				testCondition: '',
				numTreatment: 1,
				numSample: 2,
				numDay: 1,
				treatmentNames: [],
			},
			nameArr: [],
			defaultItem: {
				testName: "",
				testCondition: '',
				numTreatment: 1,
				numSample: 2,
				numDay: 1,
				treatmentNames: [],
			},
		};
	},
	mounted() {
		this.twoMonthAgo();
		this.getData();
	},
	watch: {
		dialog(val) {
			val || this.close();
		},
		dialogDelete(val) {
			val || this.closeDelete();
		},
		options: {
			handler() {
				this.getData();
			},
			deep: true,
		},
	},
	methods: {
		twoMonthAgo() {
			console.log('투먼스어고투먼스어고투먼스어고투먼스어고')
			var now = new Date();	// 현재 날짜 및 시간
			var twoMonthAgo = new Date(now.setMonth(now.getMonth() - 2));	// 한달 전
			const year = twoMonthAgo.getFullYear();
			const month = ('0' + (twoMonthAgo.getMonth() + 1)).slice(-2);
			const day = ('0' + twoMonthAgo.getDate()).slice(-2);
			const dateStr = year + '-' + month + '-' + day;
			this.startDate = dateStr
		},
		close() {
			this.dialog = false;
			this.$nextTick(() => {
				this.editedItem = Object.assign({}, this.defaultItem);
				this.editedIndex = -1;
			});
		},
		// 행 삭제
		// 불러올때 간단한 데이터테이블  만드는 api
		getDataSimple() {
			api.growthresearch.LoadGrowthResearch().then((res) => {
				this.datas_simple = res.data.responseData;
			});
		},
		// 불러올때 간단한 데이터테이블  만드는 api

		// 생육조사 일지 조회 api
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
		},
		// 생육조사 일지 조회 api
		// 다이아로그오픈
		dialogOpen() {// 다이아로그오픈
			this.dialog = true;
		},
		// 다이아로그 닫기
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
		},
		deleteItem(item) { //휴지통 눌렀을때 
			let id = item.growthReportId
			this.editedIndex = this.datas.indexOf(item);
			this.editedItem = Object.assign({}, item);
			this.dialogDelete = true;
		},
		deleteItemConfirm() { //예를 눌렀을때
			this.datas.splice(this.editedIndex, 1)
			let id = {
				growthReportId: this.editedItem.growthReportId
			}
			api.growthresearch.DeleteGrowthResearch(id).then((res) => {
			})
			this.closeDelete();
			this.delete_snackbar = true
		},
		closeDelete() { //삭제취소눌렀을때 
			this.dialogDelete = false;
			this.$nextTick(() => {
				this.editedItem = Object.assign({}, this.defaultItem);
				this.editedIndex = -1;
			});
		},
		save() {
			if (this.editedItem.testName == '') {
				alert('실험군 명을 입력해주세요.')
				return
			} else if (this.nameArr.length == 0) {
				alert('처리구명을 입력해주세요.')
				return
			}
			else if (this.editItem.testName != '') {
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
								this.testSweet();
								return;
							}
						});
				}
				this.snackbar = true
			}
			this.close();
		},
		editItem(item) {
			this.editedIndex = this.datas.indexOf(item);
			this.editedItem = Object.assign({}, item);
			this.dialog = true;
			let id = {
				growthReportId: item.growthReportId,
			};
			api.growthresearch.MakeBeforeTestDefaulted(id).then((res) => {
				this.nameArr = res.data.responseData.treatmentNames;
			});
		},
		cloneItem(item) {
			let id = {
				growthReportId: item.growthReportId,
			};
			api.growthresearch.MakeBeforeTestDefaulted(id).then((res) => {
				this.editedItem = res.data.responseData
				this.nameArr = res.data.responseData.treatmentNames;
			})
		},
	},

};
</script>
