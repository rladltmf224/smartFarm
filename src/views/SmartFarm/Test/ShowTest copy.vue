<template>
	<v-app>
		<v-container fluid>
			<v-row>
				<v-row>
					<v-col class="ma-2" md="12">
						<h4 class="searchbox-title">조회 조건</h4>
						<v-sheet class="pa-3" color="#F6F8F9" height="80" elevation="2">
							<v-row>
								<v-col cols="2">
									<v-menu v-model="menu1" :close-on-content-click="false" :nudge-right="40"
										transition="scale-transition" offset-y min-width="auto">
										<template v-slot:activator="{ on, attrs }">
											<v-text-field v-model="test_date1" label="시작일" prepend-icon="mdi-calendar"
												readonly v-bind="attrs" v-on="on"></v-text-field>
										</template>
										<v-date-picker v-model="test_date1" @input="menu1 = false" no-title></v-date-picker>
									</v-menu>
									<!-- 종료일테스트 -->
								</v-col>
								<v-col cols="2">
									<v-menu v-model="menu2" :close-on-content-click="false" :nudge-right="40"
										transition="scale-transition" offset-y="offset-y" min-width="auto">
										<template v-slot:activator="{ on, attrs }">
											<v-text-field v-model="e_date" label="종료일" prepend-icon="mdi-calendar"
												readonly="readonly" v-bind="attrs" v-on="on"></v-text-field>
										</template>
										<v-date-picker no-title v-model="e_date" @input="menu2 = false" :min="s_date"
											:max="date"></v-date-picker>
									</v-menu>
								</v-col>
								<!-- 검색어 -->
								<v-col cols="2">
									<v-text-field label="검색어" v-model="keyword"
										append-icon="mdi-magnify"></v-text-field>
								</v-col>
								<!-- 조회버튼 -->
								<v-col cols="1" class="d-flex justify-center align-center">
									<v-btn color="primary" @click="getData()">
										조회
									</v-btn>
								</v-col>
								<!-- 조회버튼 -->

								<!-- 여기row
								 -->
							</v-row>
						</v-sheet>
					</v-col>
				</v-row>
			</v-row>
		</v-container>
		<v-container fluid>
			<v-row class="text-right " >
				<v-col class="mt-0  pt-2 pb-0 mb-0">
					<v-btn color="primary" @click="dialogOpen">신규테스트 등록</v-btn>
				</v-col>
			</v-row>
			<v-row class="">
				<v-col class="ma-2 py-0 my-0   " md="12">
					<v-col cols="3">
					</v-col>
					<v-data-table :headers="datas_header" :items="datas" :page.sync="page" :options.sync="options"
					:server-items-length="totalData"
					:items-per-page="itemsPerPage" :loading="loading" dense
						hide-default-footer multi-sort @page-count="pageCount = $event" class="elevation-1"
						>
						<template v-slot:item.showmore="{ item } ">
							<v-btn class="my-2"
								@click="$router.push({ name: 'ShowTestForm', params: { id: item.growthReportId } })" fab
								x-small color="white" elevation="2">
								<v-icon dark>
									mdi-magnify
								</v-icon>
							</v-btn>
						</template>
						<template v-slot:item.load="{ item }">
							<v-btn small class="ma-1" @click="editItem(item)">생성</v-btn>
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
											hide-default-footer :custom-filter="filterOnlyCapsText" height="300">
											<template v-slot:top>
												<v-text-field v-model="search" label="실험명으로 검색"
													class="mx-4"></v-text-field>
											</template>
											<template v-slot:item.testName="{ item }">
												<v-btn @click="editItem(item)" class="ma-2" outlined color="indigo">
													{{ item.testName }}
												</v-btn>
											</template>

										</v-data-table>
										</v-list-item>
										</v-list>
										<v-divider></v-divider>
										<v-card-actions>
											<v-spacer></v-spacer>
											<v-btn text @click="menu = false" >
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
								<v-text-field v-model="editedItem.numTreatment" type="number" ref="input" label="개체수">
								</v-text-field>
							</v-col>
							<v-col cols="6">
								<v-text-field @input="numSampleNum()" min="1" v-model="editedItem.numSample"
									type="number" label="처리구 수" hint="2~15개">
								</v-text-field>
							</v-col>
							<v-col v-for="idx in Array.from({ length: editedItem.numTreatment }, (v, i) => i + 1)"
								cols="12" sm="6" md="4">

								<v-text-field clearable :placeholder="idx + '번 처리구명'" hint="최대 50자"
									v-model="nameArr[idx - 1]" type="text"> </v-text-field>
							</v-col>
							<v-col cols="12">
								<v-text-field label="작성 날짜 개수*(페이지 개수)" type="number" min="1"
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
					<v-btn color="grey"    text @click="dialogClose()">
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
		</v-snackbar>
	</v-app>
</template>

<script>
import Swal from "sweetalert2";
import {
	waterECpHRegister,MakeBeforeTestDefaulted,
	waterECpHInfo,
	waterECpHEdit,
	getGrowthResearch, //생육조사실험조회
	LoadGrowthResearch, //생육조사실험 불러오기
	RegisterGrowthResearch, //생육조사실험등록
	DeleteGrowthResearch //생육조사일지 삭제(행삭제)
} from "@/api/index.js";
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
			// 모달창 등록 시 유효성검사
			nameRules: [
				v => !!v || '실험군 명을 입력해주세요.',
				v => (v && v.length <= 50) || '50자 이내입니다.',
			],
			
			// 모달창 등록 시 유효성검사
			// 모달창 오른쪽 메뉴
			items: [],
			selectedItem: 0,
			fav: true,
			menu: false,
			message: false,
			hints: true,
			// 모달창 오른쪽 메뉴
			// 상세조회 페이지로 보낼 res 데이터
			res: "",
			// 상세조회 페이지로 보낼 res 데이터
			// 스낵바
			snackbar: false,
			delete_snackbar: false,
			delete_text: "삭제되었습니다.",
			text: "등록되었습니다.",
			timeout: 2000,
			// 스낵바
			// 데이터테이블검색기능
			search: "",
			// 데이터테이블검색기능

			// 테스트날짜
			// 1
			test_date1: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)

				.toISOString()
				.substr(0, 10),
			
			// 	.toISOString()
			// 	.substr(0, 10)
			test_menu1: false,
			test_modal1: false,
			// 1
			// 2
			test_date2: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)

				.toISOString()
				.substr(0, 10),
			test_menu2: false,
			test_modal2: false,

			// 2

			// 테스트
			// 이미 있는 날짜일 시 dialog 띄우기
			DateCheck_dialog: false,

			// 이미 있는 날짜일 시 dialog 띄우기

		
			// 데이터추가시 날짜
			DIA_date: new Date().toISOString().substr(0, 10),
			DIA_s_date: new Date().toISOString().substr(0, 10),
			DIA_e_date: new Date().toISOString().substr(0, 10),
			DIA_menu1: false,
			DIA_menu2: false,
			// 데이터추가시 날짜
			// 데이터테이블 테스트
			dialog: false,
			dialogDelete: false,

			editedIndex: -1,

			// 데이터테이블 테스트
			//이슬이꺼
			//테스트

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
				},
			],
			datas_simple: [],
			startDate: false,
			endDate: false,
			date: new Date().toISOString().substr(0, 10),
			s_date: new Date().toISOString().substr(0, 10),
			e_date: new Date().toISOString().substr(0, 10),
			menu1: false,
			menu2: false,
			search_list1: [
				{ name: "양액EC", value: "ec" },
				{ name: "양액pH", value: "ph" },
				{ name: "전체", value: "all" },
			],
			search_type_1: "all",
			search_list2: [
				{ name: "오전", value: "오전" },
				{ name: "오후", value: "오후" },
			],
			search_type_2: "발아/활착실",
			search_condition: {
				controlItem: [],
				selectedRoom: "",
				startDate: "",
				endDate: "",
			},
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
			editedIndex: -1,
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
		
		close() {
			this.dialog = false;
			this.$nextTick(() => {
				this.editedItem = Object.assign({}, this.defaultItem);
				this.editedIndex = -1;
			});
		},
		// 행 삭제
		// 데이터 테이블 검색api
		filterOnlyCapsText(value, search, item) {
			return (
				value != null &&
				search != null &&
				typeof value === "string" &&
				value.toString().toLocaleUpperCase().indexOf(search) !== -1
			);
		},
		// 데이터 테이블 검색api

		// 불러올때 간단한 데이터테이블  만드는 api
		getDataSimple() {
			LoadGrowthResearch().then((res) => {
				console.log("간단조회가 성공했습니다.");
				this.datas_simple = res.data.responseData;
				console.log(this.datas_simple);
			});
		},
		// 불러올때 간단한 데이터테이블  만드는 api
		// 개체수에 따른 개체수이름필드 v-for
		numSampleNum() {
			console.log("숫자숫자", this.editedItem.numTreatment);
			console.log("에디티드아이템", this.editedItem);
		},
		// 개체수에 따른 개체주 이름필드 v-for
		// 생육조사 일지 조회 api
		getData() {
			this.loading = true;
			const { page, itemsPerPage, sortBy, sortDesc } = this.options;
			let item = {
				testName: this.keyword,			//검색어
				startDate: this.test_date1,			//시작일
				endDate: this.e_date,			//종료일
				page: page,			//페이지 수
				size: itemsPerPage, //보여주고싶은 행의개수
				sortBy: sortBy,			//sortby
				sortDesc: sortDesc,			//sortDesc
			}
			getGrowthResearch(item)
				.then((res) => {

			
					console.log("생육조사 일지 조회 api 연결 성공", res);
					this.loading = false;
					this.datas = res.data.responseData;
					this.items = res.data.responseData;
					this.totalData = res.data.totalCount;
				

					console.log('페이지는?',this.page)



					
				})
				.catch((error) => {
					console.log("생육조사일지 조회 api의 에러입니다.", error);
				});
		},
		// 생육조사 일지 조회 api
		// 다이아로그오픈
		dialogOpen() {
			console.log("인덱스", this.editedIndex);
			this.dialog = true;
		},
		// 다이아로그오픈
		// 다이아로그 닫기
		dialogClose() {
			this.dialog = false;
		},

		// 다이아로그 닫기
		// 등록버튼 누르면 이동하는 메서드
		CompletedRegister() { },
		// 등록버튼 누르면 이동하는 메서드
		// 시작일을 두달전으로 디폴트하기 
		twoMonthAgo(){
		var now = new Date();	// 현재 날짜 및 시간
		console.log("현재 : ", now);
		var twoMonthAgo = new Date(now.setMonth(now.getMonth() - 2));	// 한달 전
		console.log("한달 전 : ", twoMonthAgo);   
		const year = twoMonthAgo.getFullYear();
		const month = ('0' + (twoMonthAgo.getMonth() + 1)).slice(-2);
		const day = ('0' + twoMonthAgo.getDate()).slice(-2);
		const dateStr = year + '-' + month + '-' + day;
		this.test_date1=dateStr
		},
		//스윗알러트
		testSweet() {
			this.$swal({
				title: "이미 등록되어있는 날짜입니다.다른 날짜를 선택해주세요.",
				icon: "error",
				position: "top",
				showCancelButton: false,
				showConfirmButton: false,
				toast: true,
				timer: 2000,
			});
		},

		deleteItem(item) { //휴지통 눌렀을때 
			console.log('item', item.growthReportId)
			let id = item.growthReportId
			this.editedIndex = this.datas.indexOf(item);
			this.editedItem = Object.assign({}, item);
			console.log('editedItem', this.editedItem)
			console.log('.editedIndex', this.editedIndex)
			this.dialogDelete = true;

		},
		deleteItemConfirm() { //예를 눌렀을때
			this.datas.splice(this.editedIndex, 1)
			let id = {
				growthReportId: this.editedItem.growthReportId
			}
			DeleteGrowthResearch(id).then((res) => {
				console.log('삭제완료,', res)
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
		// 데이터 추가시 날짜
		DIA_s_date_search(v) {
			this.DIA_s_date = v;
			this.DIA_menu1 = false;
			this.$refs.DIA_menu1.save(v);
		},
		DIA_e_date_search(v) {
			this.DIA_e_date = v;
			this.DIA_menu2 = false;
			this.$refs.DIA_menu2.save(v);
		},
		// 데이터 추가시 날짜
		// 테스트 데이타테이블
		save() {
			console.log('네임어레이', this.nameArr)
			if (this.editedItem.testName == '') {
				alert('실험군 명을 입력해주세요.')
				return
			} else if (this.nameArr.length == 0) {
				alert('처리구명을 입력해주세요.')
				return
			}
			else if (this.editItem.testName != '') {
				if (this.editedIndex == -1) {
					console.log("등록버젼입니다.");
					RegisterGrowthResearch()
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
				} else {
					// 수정api연결해야함.
					let item = {
						id:this.editedItem.id
					} 

					alert('이건가?')
					MakeBeforeTestDefaulted(item).then((response) => {
						this.getData();
					});
				}
				this.snackbar=true
			}
			this.close();
		},
		
		editItem(item) {
			this.editedIndex = this.datas.indexOf(item);
			console.log("인덱스", this.editedIndex);
			this.editedItem = Object.assign({}, item);
			this.dialog = true;
			let id = {
				growthReportId: item.growthReportId,
			};

			// MakeBeforeTestDefaulted(id).then((res) => {
			// 	this.nameArr = res.data.responseData.treatmentNames;
			
			// });
		},





		// 테스트 데이타테이블

		s_date_search(v) {
			this.s_date = v;
			this.menu1 = false;
			this.$refs.menu1.save(v);
		},
		e_date_search(v) {
			this.e_date = v;
			this.menu2 = false;
			this.$refs.menu2.save(v);
		},
	},

	computed: {
		formTitle() {
			return this.editedIndex === -1 ? "New Item" : "Edit Item";
		},
	},
	created() { 
		this.getData()
	},
};
</script>
<style>
.select {
	max-width: 200px;
}
</style>
