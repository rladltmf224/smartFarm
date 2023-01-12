<template>
    <div class="">
        <v-col cols="12" class="  d-flex  py-0 my-2 align-center">
            <h3>{{ i + 1 }} 페이지</h3>
            <v-spacer></v-spacer>
            <v-btn color="primary" icon small @click="Save()"> <v-icon>mdi-check</v-icon> </v-btn>
            <v-btn icon fab class="px-2" x-small @click="openDeleteDialog(table, i)" rounded>
                <v-icon color="grey">mdi-trash-can-outline</v-icon> </v-btn>
        </v-col>
        <v-col cols="12" class=" py-0 my-0  d-flex  align-center ">
            <v-col cols="4">
                <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
                    offset-y min-width="auto">
                    <template v-slot:activator="{ on, attrs }">
                        <v-text-field v-model="startDate" label="시작일" prepend-icon="mdi-calendar" readonly
                            v-bind="attrs" v-on="on"></v-text-field>
                    </template>
                    <v-date-picker v-model="startDate" @change="putDate(), menu = false" no-title></v-date-picker>
                </v-menu>
            </v-col>

            <v-btn fab elevation="0" x-small class="mx-3" color="white" @click="openAlbum()">
                <v-icon color="grey"> mdi-camera</v-icon></v-btn>
        </v-col>
        <!-- 데이터 테이블  -->


        <v-row class="pa-4 mx-0">
            <v-data-table :headers="datas_header" hide-default-footer :items="table.carousel_data" class="elevation-1">
                <!-- ㅁㄴㅇㅁㄴㅇ -->
                <template #item="{ item, index }">
                    <tr :class="index === selectedRow ? 'custom-highlight-row' : ''"
                        v-for="(item_sub, index) in item.datas" :key="item_sub.name">
                        <!-- 처리구명  -->
                        <td v-if="index == 0" :rowspan="item.datas.length">
                            <input type="text" disabled name="text" size="20" style="width:100%; border: 0"
                                v-model="item.treatmentName"> </input>
                        </td>
                        <!-- 개체수  -->
                        <td>
                            <input v-if="item_sub.sampleNumber != '평균입니다.'" type="number" name="text" size="20" disabled
                                style="width:100%; border: 0" v-model.number="item_sub.sampleNumber"></input>
                            <p class="pa-0 ma-0" v-else> 평균</p>
                        </td>
                        <!-- 엽수  -->
                        <td>
                            <input step="0.1" type="number" name="text" size="20" @change="Save()"
                                :disabled="item_sub.sampleNumber == '평균입니다.'" style="width:100%; border: 0"
                                v-model.number="item_sub.leafStage"> </input>
                        </td>
                        <!-- 초장  -->
                        <td>
                            <input step="0.1" type="number" name="text" size="20" @change="Save()"
                                :disabled="item_sub.sampleNumber == '평균입니다.'" style="width:100%; border: 0"
                                v-model.number="item_sub.leafHeight"> </input>
                        </td>
                        <!-- 엽폭  -->
                        <td>
                            <input step="0.1" type="number" name="text" size="20" @change="Save()"
                                :disabled="item_sub.sampleNumber == '평균입니다.'" style="width:100%; border: 0"
                                v-model.number="item_sub.leafWidth"> </input>
                        </td>
                        <!-- 엽장  -->
                        <td>
                            <input step="0.1" type="number" name="text" size="20" @change="Save()"
                                :disabled="item_sub.sampleNumber == '평균입니다.'" style="width:100%; border: 0"
                                v-model.number="item_sub.leafLength"> </input>
                        </td>
                        <!-- 경경  -->
                        <td>
                            <input step="0.1" type="number" name="text" size="20" @change="Save()"
                                :disabled="item_sub.sampleNumber == '평균입니다.'" style="width:100%; border: 0"
                                v-model.number="item_sub.stemThickness"> </input>
                        </td>
                        <!-- 절간장  -->
                        <td>
                            <input step="0.1" type="number" name="text" size="20" @change="Save()"
                                :disabled="item_sub.sampleNumber == '평균입니다.'" style="width:100%; border: 0"
                                v-model.number="item_sub.internodeLength"> </input>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </v-row>










        <!-- 사진 조회 및 등록 -->
        <v-dialog v-model="dialog" persistent max-width="1000" max-height="1000">
            <v-card height="800" style="overflow:auto">

                <v-card-title class="text-h5 grey lighten-2">
                    사진 조회 및 등록
                    <v-spacer></v-spacer>
                    <v-btn icon text @click="closeDialog()"><v-icon>mdi-close</v-icon></v-btn>
                </v-card-title>

                <v-card-text class="pa-5 ">
                    <v-row class="">
                        <v-col cols="4" class="mx-0">
                            <h5 class="   searchbox-title ">사진 업로드</h5>
                        </v-col>
                    </v-row>
                    <v-row class=" py-0 my-0">
                        <v-col cols="12" class="d-flex justify-center align-center">
                            <v-col cols="4">
                                <v-select class="px-2" v-model="selectTreatMent" :items="imageDatas"
                                    item-text="treatmentName" item-value="abbr" label="처치구 선택" persistent-hint
                                    return-object single-line>
                                </v-select>
                            </v-col>
                            <v-col cols="6">
                                <input class="px-2" type="file" multiple @change="onInputImage()" ref="serveyImage"
                                    alt="" accept=".jpg, .jpeg, .png"></input>
                            </v-col>
                            <v-col cols="2" class="d-flex justify-center">
                                <v-btn small @click="sendImage()">업로드</v-btn>

                            </v-col>
                        </v-col>
                    </v-row>
                    <LoadingSpinner v-if="isLoading"></LoadingSpinner>
                    <!-- 이미지 미리보기 -->
                    <v-row v-else>
                        <v-col cols="12" v-for=" (item, i) in imageDatas " :key="i">
                            <h4 class="searchbox-title"> {{ item.treatmentName }} </h4>
                            <v-row>
                                <v-col cols="2" v-for="(child, i) in item.fileNames" :key="i">
                                    <v-img v-if="child != ['이미지 없음']" max-height="200" max-width="200" ref="myimg"
                                        :src="child.fileData" class="grey lighten-2 pa-0 ma-0" aspect-ratio="1"
                                        @dblclick="getSingleImage(item, child)">
                                        <v-btn v-if="child != ['이미지 없음']" icon color="red"
                                            @click="openDeleteImageDialog(item, child)">
                                            <v-icon small color="grey lighten-1">mdi-trash-can-outline
                                            </v-icon>
                                        </v-btn>
                                    </v-img>
                                    <h6>
                                        {{ child.fileName }}
                                    </h6>
                                    <p v-if="child == ['이미지 없음']">이미지가 없습니다.</p>


                                </v-col>
                            </v-row>

                        </v-col>
                    </v-row>






                    <!-- 사진을 삭제하시겠습니까? 다이아로그 -->
                    <v-dialog v-model="deleteImageDialog" persistent max-width="500">
                        <v-card>
                            <v-card-title class="text-h5">
                                선택된 사진을 삭제하시겠습니까?
                            </v-card-title>
                            <v-card-text>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="green darken-1" text @click="deleteImageDialog = false">
                                    취소
                                </v-btn>
                                <v-btn color="red darken-1" text @click="DeleteNowImage()">
                                    삭제
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <!-- 사진이 삭제되었습니다 스낵바  -->
                    <v-snackbar v-model="snackbar_delete" :timeout="timeout">
                        {{ text_delete }}
                        <template v-slot:action="{ attrs }">
                            <v-btn color="blue" text v-bind="attrs" @click="snackbar_delete = false">Close</v-btn>
                        </template>
                    </v-snackbar>
                    <!-- 사진이 저장되었습니다 스낵바 -->
                    <v-snackbar v-model="snackbar_save" :timeout="timeout">
                        {{ text_save }}
                        <template v-slot:action="{ attrs }">
                            <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
                                Close
                            </v-btn>
                        </template>
                    </v-snackbar>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="dialog = false">
                        닫기
                    </v-btn>
                </v-card-actions>

            </v-card>
        </v-dialog>
        <v-snackbar v-model="snackbar_delete" :timeout="timeout">
            {{ text_delete }}
            <template v-slot:action="{ attrs }">
                <v-btn color="blue" text v-bind="attrs" @click="snackbar_delete = false">
                    Close
                </v-btn>
            </template>
        </v-snackbar>
        <!-- 사진 확대하는 다이아로그 -->
        <v-dialog v-model="zoomInDialog" width="1000">
            <v-card>
                <v-card-title>{{ zoomItem.fileName }}</v-card-title>
                <v-card-text class="d-flex align-center justify-center">
                    <LoadingSpinner v-if="isLoading"></LoadingSpinner>
                    <v-img v-else max-height="800" max-width="800" ref="myimg" :src="this.url"
                        class="grey lighten-2 pa-0 ma-0" aspect-ratio="1"></v-img>

                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>           
<script>

import LoadingSpinner from '../Loading/LodingSpinner.vue'; // 로딩스피너
import * as api from '@/api'
import { el } from 'vuetify/lib/locale';
export default {
    props: {
        parentTable: {
            type: [Array, Object],
            default: [],
        },
        i: {
            type: [Array, Object, Number],
            default: null,
        },
        ReportId: {
            type: [Array, Object, Number, String],
            default: null,
        },
    },
    name: 'MESFETableCard',
    components: {
        LoadingSpinner
    },
    data() {
        return {
            yes: false, //임시
            selectedRow: null,
            snackForParents: '',
            deletePageNum: 0, //현재페이지 삭제 시, 해당 i 번째 num을 emit 부모로 보냄.
            selectTreatMent: '', //사진 업로드 시 처치구 선택
            url: null,
            delete_item: {}, //사진 삭제시 리퀘스트바디를 변수에담음
            zoomItem: [],//사진확대하는 다이아로그에서 쓰이는 데이터들
            zoomInDialog: false, //사진확대하는 다이아로그 
            imageDatas: [], // 서버에서 받은 이미지 데이터로 만든 어레이
            fileNames: [],
            emptyImage: false, //서버에서 받은 이미지가 없을때의 변수 
            deleteImageDialog: false, //선택한 사진을 삭제하시겠습니까? 다이아로그 
            input: {
                image: null//업로드할 이미지 배열 
            },
            images: [], //사진 조회하고나서 실제사진을 바인딩할 껍데기 변수
            treatmentId: '',//앨범명에 쓸 트리트먼트아이디
            snackbar_delete: false,
            snackbar_save: false,
            text_delete: '삭제되었습니다.',
            text_save: '등록되었습니다.',
            timeout: 2000,
            isLoading: false,
            dialog: false, //사진 다이아로그
            model: null,
            startDate: '',
            menu: false,
            growthReportDetailId: '',
            growthReportId: '',
            datas_header: [
                {
                    text: "처리구명", value: "treatmentName", sortable: false
                },
                { text: "개체수", value: "sampleNumber", sortable: false },
                { text: "엽수", value: "leafStage", sortable: false },
                { text: "초장", value: "leafHeight", sortable: false },
                { text: "엽폭", value: "leafWidth", sortable: false },
                { text: "엽장", value: "leafLength", sortable: false },
                { text: "경경", value: "stemThickness", sortable: false },
                { text: "절간장", value: "internodeLength", sortable: false },
            ],
            datas: [
            ],
        };
    },
    mounted() {
        this.setData()
        this.plusAVG()

    },
    methods: {
        setData() { //mount 될때, 필요한 데이터들 setting해주기.
            this.startDate = this.table.carousel_date
            this.growthReportDetailId = this.ReportId
            this.growthReportId = this.ReportId
        },
        plusAVG() { //this.table에 각 데이터 평균값추가
            for (let i = 0; i < this.table.carousel_data.length; i++) {
                this.table.carousel_data[i].datas = _.reject(this.table.carousel_data[i].datas, {
                    growthDataId: "평균입니다."
                })
            }
            console.log('평균뺀 텓이블', this.table)
            this.selectedRow = this.table.carousel_data[0].datas.length //평균값 행만 background컬러주기
            let avgArr = []
            let lastLength = this.table.carousel_data[0].datas.length + 1
            for (let top = 0; top < this.table.carousel_data.length; top++) {
                let reduer = (a, b) => a + b; //reduce이용해서 평균구하기 
                let checkLength = _.map(this.table.carousel_data[top].datas, 'internodeLength')
                avgArr.push({
                    growthDataId: '평균입니다.',
                    internodeLength: (_.map(this.table.carousel_data[top].datas, 'internodeLength').reduce(reduer) / checkLength.length).toFixed(2),
                    leafHeight: (_.map(this.table.carousel_data[top].datas, 'leafHeight').reduce(reduer) / checkLength.length).toFixed(2),
                    leafLength: (_.map(this.table.carousel_data[top].datas, 'leafLength').reduce(reduer) / checkLength.length).toFixed(2),
                    leafStage: (_.map(this.table.carousel_data[top].datas, 'leafStage').reduce(reduer) / checkLength.length).toFixed(2),
                    leafWidth: (_.map(this.table.carousel_data[top].datas, 'leafWidth').reduce(reduer) / checkLength.length).toFixed(2),
                    sampleNumber: '평균입니다.',
                    stemThickness: (_.map(this.table.carousel_data[top].datas, 'stemThickness').reduce(reduer) / checkLength.length).toFixed(2)
                })
                this.table.carousel_data[top].datas.push(avgArr[top])
            }
        },
        closeDialog() { //다이아로그 닫으면 데이터 초기화해준다.
            this.input.image = null
            this.imageDatas = []
            this.$refs.serveyImage.files = null
            this.$refs.serveyImage.value = ''
            this.dialog = false
        },
        openDeleteDialog(table, i) {
            this.deletePageNum = i
            this.tableData = table
            console.log('부모에게보냄', this.deletePageNum, this.tableData)
            this.$emit("deletedNum", this.deletePageNum, this.tableData);
        },
        sendImage() { //이미지 업로드
            if (this.selectTreatMent.treatmentId == undefined) {
                alert('처치구를 선택해주세요.')
                this.$refs.serveyImage.value = ''
            } else if (this.input.image == null) {
                alert('파일을 선택해주세요.')
                this.$refs.serveyImage.value = ''
            }
            else {
                console.log('인풋이미지', this.input.image)
                for (let i = 0; i < this.input.image.length; i++) {
                    let fileArr = Array.from(this.input.image)
                    let paramData = { //서버로 보낼 폼 데이타의  형태를 만든다.
                        growthReportId: this.growthReportDetailId,
                        growthReportDetailId: this.table.growthReportDetailId,
                        treatmentId: this.selectTreatMent.treatmentId,
                        files: fileArr[i]
                    };
                    api.growthresearch.SaveGrowthResearchImage(paramData).then((response) => {
                        this.openAlbum()
                        this.$refs.serveyImage.value = ''
                        this.$refs.serveyImage.files = null
                        this.selectTreatMent.treatmentName = ''
                        this.snackbar_save = true
                    })
                }

                // let paramData = { //서버로 보낼 폼 데이타의  형태를 만든다.
                //     growthReportId: this.growthReportDetailId,
                //     growthReportDetailId: this.table.growthReportDetailId,
                //     treatmentId: this.selectTreatMent.treatmentId,
                //     files: fileArr

                // };

                // console.log('이미지보낼것임,', paramData)
                // api.growthresearch.SaveGrowthResearchImage(paramData).then((response) => {
                //     this.openAlbum()
                //     this.$refs.serveyImage.value = ''
                //     this.$refs.serveyImage.files = null
                //     this.selectTreatMent.treatmentName = ''
                //     this.snackbar_save = true
                // })


            }
        },
        DeleteNowImage() {
            let body = this.delete_item
            console.log('삭제할때body', body)
            api.growthresearch.DeleteGrowthResearchImage(body).then((res) => {
                this.sendSnackDelete()
                this.openAlbum()
                this.deleteImageDialog = false
            })
        },
        openDeleteImageDialog(item, child) { //사진을 삭제하시겠습니까? 다이아로그
            let fileNameArr = []
            fileNameArr.push(child.fileName)
            let body = {
                growthReportId: this.growthReportId,
                growthReportDetailId: this.table.growthReportDetailId,
                treatmentId: item.treatmentId,
                fileNames: fileNameArr
            }

            this.delete_item = body
            this.deleteImageDialog = true
        },
        getSingleImage(item, child) { //개별이미지 조회 api 
            console.log('개별이미지보냅니다')
            this.isLoading = false
            let params = {
                growthReportId: this.growthReportId,
                growthReportDetailId: this.table.growthReportDetailId,
                treatmentId: item.treatmentId,
                imageName: child.fileName
            }

            console.log('내가보낸파라미터', params)
            api.growthresearch.GetGrowthResearchImage(params).then((res) => {
                console.log('개별 이미지조회  성공')
                let paramImg = res.data.responseData
                this.zoomInImage(paramImg)
            })
        },
        zoomInImage(paramImg) {
            this.zoomInDialog = true
            this.zoomItem = paramImg
            // 서버에서 받은 이미지 데이터를 인코딩한다
            let images = []
            let imagedata = paramImg
            const contentType = "image/png";
            const b64Data = imagedata.fileData;
            const image_data = atob(b64Data); // base64 인코딩을 풀어준다
            const arraybuffer = new ArrayBuffer(image_data.length);
            const view = new Uint8Array(arraybuffer);
            for (let i = 0; i < image_data.length; i++) {
                view[i] = image_data.charCodeAt(i) & 0xff;
                // charCodeAt() 메서드는 주어진 인덱스에 대한 UTF-16 코드를코드를 나타내는 0부터 65535 사이의 정수를 반환
                // 비트연산자 & 와 0xff(255) 값은 숫자를 양수로 표현하기 위한 설정
            }
            const blob = new Blob([arraybuffer], { type: contentType }); // base64 -> blob
            const blobUrl = URL.createObjectURL(blob); // object url 생성
            images.push({
                url: (blobUrl),
                fileName: imagedata.fileName
            })
            this.url = blobUrl
            this.$refs.myimg.src = this.images;
            this.isLoading = false
        },
        putDate() {
            this.table.carousel_date = this.startDate
            let id = {
                growthReportId: this.growthReportId, // 리퀘스트바디
                reportDate: this.startDate,
                growthReportDetailId: this.table.growthReportDetailId
            }
            if (id.growthReportDetailId == '') {
                api.growthresearch.EditGrowthResearchDate(id).then((res) => {
                    console.log('날짜신규발급완료')
                    this.table.growthReportDetailId = res.data.responseData.growthReportDetailId;
                    this.bindingAfterSave()
                    this.sendSnackSave()
                }).catch((err) => {
                    alert('날짜를 확인해주세요.(중복)')
                    this.startDate = ''
                })
            } else {
                api.growthresearch.EditGrowthResearchDate(id).then((res) => {
                    if (res.data.responseData == null) {
                        console.log('날짜수정완료')
                        this.table.reportDate = this.startDate
                        this.Save()
                    } else {
                        console.log('날짜신규발급함.')
                        this.table.growthReportDetailId = res.data.responseData.growthReportDetailId;
                        this.bindingAfterSave()
                    }
                }).catch((error) => {
                    alert('날짜를 확인해주세요.(중복)')
                    this.startDate = ''
                    console.log('에러입니다.', error)
                })
            }
        },
        bindingAfterSave() {
            let body = []
            for (let i = 0; i < this.table.carousel_data.length; i++) {
                body.push({
                    treatmentId: this.table.carousel_data[i].treatmentId,
                    datas: _.reject(this.table.carousel_data[i].datas, {
                        growthDataId: "평균입니다."
                    })
                })
            }
            let item = {
                growthReportId: this.growthReportId, // 파라미터
                growthReportDetailId: this.table.growthReportDetailId,
                treatments: body
            }

            api.growthresearch.SaveGrowthResearchData(item).then((res) => {
                //save하고난 result의 growthDataId를 바인딩해준다.
                let resData = res.data.responseData.details[0]
                for (let treatNum = 0; treatNum < resData.treatments.length; treatNum++) {
                    for (let dataNum = 0; dataNum < resData.treatments[treatNum].datas.length; dataNum++) {
                        this.table.carousel_data[treatNum].datas[dataNum].growthDataId = resData.treatments[treatNum].datas[dataNum].growthDataId
                    }
                }
            })
        },
        DateCheck() { //날짜발급 유무체크 
            if (this.table.carousel_date != '') {
                console.log('날짜있음.')

            } else {
                alert('날짜를 먼저 발급해주세요.')
                console.log('날짜없음.')

            }
        },
        openAlbum() { //앨범 열때 체크 
            if (this.table.growthReportDetailId == '') {
                alert('날짜먼저발급해주세요.')
            } else {
                this.isLoading = true
                let params = {
                    growthReportId: this.growthReportId,
                    growthReportDetailId: this.table.growthReportDetailId,
                }
                api.growthresearch.GetGrowthResearchImageList(params).then((res) => {
                    console.log('-------------사진조회성공-------------------', res)
                    let imgObj = []
                    //처치구명,트리트먼트아이디,파일네임스로 어레이 틀을 만든다.
                    let defaultArr = []
                    for (let i = 0; i < this.table.carousel_data.length; i++) {
                        let tableNum = this.table.carousel_data[i]
                        defaultArr.push({
                            treatmentId: tableNum.treatmentId,
                            treatmentName: tableNum.treatmentName,
                            fileNames: ['이미지 없음'],
                        })
                    }
                    if (res.data.responseData[0].detailInfo.length == 0) {
                        this.imageDatas = defaultArr
                    } else {
                        //데이터가있으면 데이터를 넣고 없으면 그대로  둔다.
                        let detailInfo = res.data.responseData[0].detailInfo  //1.res.data.responseData를 detailInfo로 함축.

                        console.log('detailInfo', detailInfo)

                        for (let top = 0; top < detailInfo.length; top++) { //2.detailInfo의fileData를 blob화한다.
                            for (let mid = 0; mid < detailInfo[top].fileInfo.length; mid++) {
                                let imagedata = detailInfo[top].fileInfo[mid]
                                const contentType = "image/png";
                                const b64Data = imagedata.fileData;
                                const image_data = atob(b64Data);
                                const arraybuffer = new ArrayBuffer(image_data.length);
                                const view = new Uint8Array(arraybuffer);
                                for (let i = 0; i < image_data.length; i++) {
                                    view[i] = image_data.charCodeAt(i) & 0xff;
                                    // charCodeAt() 메서드는 주어진 인덱스에 대한 UTF-16 코드를코드를 나타내는 0부터 65535 사이의 정수를 반환
                                    // 비트연산자 & 와 0xff(255) 값은 숫자를 양수로 표현하기 위한 설정
                                }
                                const blob = new Blob([arraybuffer], { type: contentType });
                                const blobUrl = URL.createObjectURL(blob);
                                detailInfo[top].fileInfo[mid].fileData = blobUrl  // 보여질 img의 url에 바인딩한다
                            }
                        }

                        for (let arrNum = 0; arrNum < defaultArr.length; arrNum++) { //3.만들어놓은 틀에다가 실제데이터를 바인딩한다.
                            for (let dataNum = 0; dataNum < detailInfo.length; dataNum++) {
                                if (defaultArr[arrNum].treatmentName == detailInfo[dataNum].treatmentName) {
                                    defaultArr[arrNum].fileNames = detailInfo[dataNum].fileInfo
                                }
                            }
                        }
                        console.log('defaultArr', defaultArr)
                        this.imageDatas = defaultArr
                    }
                    this.isLoading = false

                })
                this.dialog = true
            }
        },
        Save() { //데이터 저장
            this.DateCheck()
            let body = []
            for (let i = 0; i < this.table.carousel_data.length; i++) {
                body.push({
                    treatmentId: this.table.carousel_data[i].treatmentId,
                    datas: _.reject(this.table.carousel_data[i].datas, {
                        growthDataId: "평균입니다."
                    })
                })
            }
            let item = {
                growthReportId: this.growthReportId, // 파라미터
                growthReportDetailId: this.table.growthReportDetailId,
                treatments: body
            }
            api.growthresearch.SaveGrowthResearchData(item).then((res) => {
                this.sendSnackSave()
                // then되고나서 PlusAVG하는데,여기서 평균입니다 빼기.
                // then되고나서

                this.plusAVG()
            })
        },
        onInputImage(img) {         // 사진 업로드 api가 들어있는 메서드
            this.input.image = this.$refs.serveyImage.files
        },
        sendSnackSave() {
            this.snackForParents = 'save'
            this.$emit("snackBarTrue", this.snackForParents);
        },
        sendSnackDelete() {
            this.snackForParents = 'delete'
            this.$emit("snackBarTrue", this.snackForParents);
        }
    },
    computed: {
        table: function () {
            console.log('부모테이블 바뀜ㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁ', this.parentTable)
            return this.parentTable
        },
    },
    watch: {
        table() {
            this.startDate = this.table.carousel_date;
            this.plusAVG()
        }
    }
};
</script>         
<style style lang ="scss" scoped>
.custom-highlight-row {
    background-color: rgb(224, 238, 255)
}

.scroll {
    overflow-y: scroll
}
</style>