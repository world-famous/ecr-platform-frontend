<template>
    <section>
        <div class="ecrw-in">
            <div class="ecrw-ready ">
                <ecr-breadcrumb :steps="steps"></ecr-breadcrumb>
                <ecr-grade
                    ref="grade" 
                    @school-section-change="onSchoolSectionChange" 
                    @subject-change="onSubjectChange" 
                    @grade-change="onGradeChange" 
                    @book-model-change="onBookModelChange" 
                    @edition-type-change="onEditionTypeChange">
                </ecr-grade>
                <div class="ecrw-ready-wrap" v-loading="listLoading">
                    <div class="ecrw-ready-wrap-center">
                        <ecr-special-brief
                            v-for="(dt,idx) in data"
                            :key="idx"
                            :data="dt"
                            :items="dt.items" 
                            :title="dt.title" 
                            :more-url="dt.url"
                            item-thumb-key="thumb" 
                            item-title-key="name"
                            item-id-key="contentid">
                        </ecr-special-brief>
                    </div>
                    <img src="static/images/ecrw-empty-data-resource.png" :style="{ width:(imageSize.width) + 'px', height:(imageSize.height) + 'px' }" v-if="data.length==0">
                </div>
                <my-pagination @current-change="onChangePage" :page="page" :page-size="page_size" :total="total"></my-pagination>
            </div>
        </div>
    </section>
</template>

<script>
    import ECRUtil from '../../common/js/util';
    import { getGoodsList, getThemeList } from '../../api/api';

    export default {
        data() {
            return {
                specialLabels: [],
                data: [],
                steps: [],
                selectedItems: {
                    subjectid: '',
                    schoolsectionid: '',
                    gradeid: '',
                    bookmodelid: '',
                    editiontypeid: ''
                },
                last_call: [],
                loginInfo: {
                    name: '',
                    userid: ''
                },
                //////////Pagination////////////
                page: 1,
                total: 0,
                page_size: 5,
                //////////End Pagination////////////
                listLoading: false,
                treeLoading: false,
                imageSize: {
                    width: 0,
                    height: 0
                }
            }
        },
        methods: {
            load() {
                this.steps = [
                    {
                        title:'首页',
                        url:'/home'
                    },
                    {
                        title:'特供专题',
                        url:'/special'
                    }
                ];
                localStorage.setItem('step', JSON.stringify(this.steps));
                this.getThemeList(this.page);
            },
            onChangePage(page) {
                this.page = page;
                this.getThemeList(page);
            },
            getThemeList(page) {
                var param = {
                    pagination:{
                        numPerPage:5,
                        pageNo:this.page
                    },
                    conditions:
                    [
                        {
                            "fieldName":"parentthemeid",
                            "fieldValues":["0"],
                            "prepender":null,
                            "operator":"EQUAL",
                            "childConditions":null
                        },
                        {
                            "fieldName":"themename",
                            "fieldValues":[""],
                            "prepender":null,
                            "operator":"EQUAL",
                            "childConditions":null
                        },
                        {
                            "fieldName":"schoolsection",
                            "fieldValues":this.selectedItems.schoolsectionid.split(","),
                            "prepender":null,
                            "operator":"EQUAL",
                            "childConditions":null
                        },
                        {
                            "fieldName":"subjectid",
                            "fieldValues":this.selectedItems.subjectid.split(","),
                            "prepender":null,
                            "operator":"EQUAL",
                            "childConditions":null
                        }
                    ]
                };
                this.treeLoading = true;
                getThemeList(param).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.specialLabels = res.data.pageInfo.list;
                        this.total = res.data.pageInfo.total;
                        for (var i=0; i<this.specialLabels.length; i++) {
                            this.last_call.push(0);
                        }
                    } else {
                        this.specialLabels = [];
                        this.total = 0;
                    }
                    this.treeLoading = false;
                    this.imageSize.width = $('.ecrw-ready-wrap').width();
                    this.imageSize.height = 610;
                    this.fillDataForLabels(new Date().getTime());
                }).catch((res) => {
                    this.specialLabels.children = [];
                    this.total = 0;
                    this.treeLoading = false;
                    this.fillDataForLabels(new Date().getTime());
                });
            },
            fillDataForLabels(calltime) {
                this.data = [];
                var _this = this;
                this.specialLabels.forEach(function(specialLabel) {
                    _this.data.push({
                        title:specialLabel.themeName,
                        url:'/special/' + specialLabel.themeData.themeid,
                        items:[]
                    });
                    _this.fillData(_this.data.length - 1, specialLabel.themeData.themeid, calltime);
                });
            },
            fillData(idx, themeid, calltime) {
                this.data.items = [];
                let params = {
                    pagination:{
                        numPerPage:5,
                        pageNo:1
                    },
                    conditions: [
                        {
                            fieldName:"themeids",
                            fieldValues:[themeid],
                            prepender:null,
                            operator:"EQUAL",
                            childConditions:null
                        },
                        {
                            fieldName: 'schoolsectionid',
                            fieldValues: this.selectedItems.schoolsectionid.split(","),
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        },
                        {
                            fieldName: 'subjectid',
                            fieldValues: this.selectedItems.subjectid.split(","),
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        },
                        {
                            fieldName: 'gradeid',
                            fieldValues: this.selectedItems.gradeid.split(","),
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        },
                        {
                            fieldName: 'editiontypeid',
                            fieldValues: this.selectedItems.editiontypeid.split(","),
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        },
                        {
                            fieldName: 'bookmodelid',
                            fieldValues: this.selectedItems.bookmodelid.split(","),
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        }
                    ]
                };
                this.listLoading = true;
                getGoodsList(params).then((res) => {
                    if (this.last_call[idx] != 0 && this.last_call[idx] > calltime) return;
                    this.last_call[idx] = calltime;

                    if (res.data.serverResult.resultCode == "200") {
                        this.data[idx].items = res.data.pageInfo.list;
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.data[idx].items = [];
                    }
                    this.listLoading = false;
                }).catch(() => {
                    this.listLoading = false;
                    this.data[idx].items = [];
                    
                    this.$message({
                        message: '加载失败!',
                        type: 'error'
                    });
                });
            },
            setSession() {
                localStorage.setItem('special-index-navigation' + this.loginInfo.userid, JSON.stringify(this.selectedItems));
            },
            onSchoolSectionChange: function(val, byuser) {
                this.page = 1;
                this.selectedItems = val;
                this.getThemeList(this.page);
                // this.fillDataForLabels(new Date().getTime());
                if (byuser) this.setSession();
            },
            onSubjectChange: function(val, byuser) {
                this.page = 1;
                this.selectedItems = val;
                this.getThemeList(this.page);
                // this.fillDataForLabels(new Date().getTime());
                if (byuser) this.setSession();
            },
            onGradeChange: function(val, byuser) {
                this.page = 1;
                this.selectedItems = val;
                this.getThemeList(this.page);
                // this.fillDataForLabels(new Date().getTime());
                if (byuser) this.setSession();
            },
            onEditionTypeChange: function(val, byuser) {
                this.page = 1;
                this.selectedItems = val;
                if (byuser) this.setSession();
            },
            onBookModelChange: function(val, byuser) {
                this.page = 1;
                this.selectedItems = val;
                this.getThemeList(this.page);
                // this.fillDataForLabels(new Date().getTime());
                if (byuser) this.setSession();
            }
        },
        created() {
            var user = localStorage.getItem('frontend-user');
            if (user != null) {
                this.loginInfo.name = JSON.parse(user).realName;
                this.loginInfo.userid = JSON.parse(user).userId;
            }
            this.load();
        },
        mounted() {
            let specialIndexNavi;
            // Author : GOD, Bug ID: #401
            var currentMonth = new Date().getMonth() + 1;
            var bookmodel = undefined;
            if ([3,4,5,6,7,8].includes(currentMonth)){
                bookmodel = '2000000001';
            } else if([1,2,9,10,11,12].includes(currentMonth)){
                bookmodel = '2000000002';
            }

            if (this.loginInfo.userid == null || this.loginInfo.userid == "") {
                specialIndexNavi = {
                    schoolsectionid: 'PRIMARY_SCHOOL', // 小学
                    bookmodelid: bookmodel
                };
                this.$refs.grade.setNavigation(specialIndexNavi);
            } else {
                var flag = true;
                if (localStorage.getItem('specialViewCount') == null) {
                    flag = true;
                } else {
                    flag = false;
                } 
                if (flag) {
                    specialIndexNavi = {
                        schoolsectionid: 'PRIMARY_SCHOOL', // 小学
                        bookmodelid: bookmodel
                    };
                    this.$refs.grade.setNavigation(specialIndexNavi);
                } else {
                    specialIndexNavi = localStorage.getItem('special-index-navigation' + this.loginInfo.userid);
                    if (specialIndexNavi == null){
                        specialIndexNavi = {
                            schoolsectionid: 'PRIMARY_SCHOOL', // 小学
                            bookmodelid: bookmodel
                        };
                        this.$refs.grade.setNavigation(specialIndexNavi);
                    } else {
                        specialIndexNavi = JSON.parse(specialIndexNavi);
                        this.$refs.grade.setNavigation(specialIndexNavi);    
                    }
                }
            }
            localStorage.setItem('specialViewCount', 1);
        }
    }
</script>

<style scoped lang="scss">
    @import '~scss_vars';

</style>