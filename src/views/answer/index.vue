<template>
    <section>
        <div class="ecrw-in">
            <div class="ecrw-ready">
                <ecr-breadcrumb :steps="steps"></ecr-breadcrumb>
                <ecr-grade 
                    ref="grade"
                    @school-section-change="onSchoolSectionChange" 
                    @subject-change="onSubjectChange" 
                    @grade-change="onGradeChange" 
                    @book-model-change="onBookModelChange" 
                    @edition-type-change="onEditionTypeChange">
                </ecr-grade>
                <div class="ecrw-ready-wrap">
                    <div class="ecrw-exam-tab clearfix">
                        <div class="ecrw-exam-search">
                            <span>共为您找到 {{ total }} 份资源</span>
                            <span>
                                <input type="text" class="ecrw-exam-search-text" placeholder="在结果内搜索" v-model="searchKey" @keyup.enter="search"/>
                                <input type="button" class="ecrw-button ecrw-exam-search-button" value="搜索" @click="search"/>
                            </span>
                        </div>
                        <div class="ecrw-exam-tab-wrap">
                            <ul>
                                <li class="ecrw-exam-tab-wrap-li" @click="sortBy('推荐排序')">
                                    <a href="javascript:;" :class="{ 'ecrw-exam-tab-wrap-sel':sort_by=='推荐排序' }">
                                        推荐排序
                                    </a>
                                </li>
                                <li class="ecrw-exam-tab-wrap-li" @click="sortBy('最新上传')">
                                    <a href="javascript:;" :class="{ 'ecrw-exam-tab-wrap-sel':sort_by=='最新上传' }">
                                        最新上传
                                    </a>
                                </li>
                                <li class="ecrw-exam-tab-wrap-li" @click="sortBy('最受欢迎')">
                                    <a href="javascript:;" :class="{ 'ecrw-exam-tab-wrap-sel':sort_by=='最受欢迎' }">
                                        最受欢迎
                                    </a>
                                </li>
                                <li class="ecrw-exam-tab-wrap-li" @click="sortBy('名校精品')">
                                    <a href="javascript:;" :class="{ 'ecrw-exam-tab-wrap-sel':sort_by=='名校精品' }">
                                        名校精品
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="ecrw-exam-content" v-loading="listLoading">
                        <div class="ecrw-exam-content-wrap">
                            <ecr-resource v-for="(item, idx) in data"
                                :key="idx"
                                :data="item"
                                :goods="item">
                            </ecr-resource>
                            <my-pagination @current-change="onChangePage" :page="page" :page-size="page_size" :total="total"></my-pagination>
                        </div>
                        <img src="static/images/ecrw-empty-data-resource.png" :style="{ width:(imageSize.width) + 'px', height:(imageSize.height) + 'px' }" v-if="data.length==0">
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import ECRUtil from '../../common/js/util';
    import { getGoodsList } from '../../api/api';

    export default {
        data() {
            return {
                page: 1,
                page_size: 10,
                total: 0,
                sort_by: '推荐排序',
                steps:[],
                subjectid: '',
                subjectsel: '',
                grade: '',
                bookmodel: '',
                edittype: '',
                data:[],
                searchKey:'',
                selectedItems: {
                    schoolsectionid: '',
                    subjectid: '',
                    gradeid: '',
                    bookmodelid: '',
                    editiontypeid: ''
                },
                last_call: 0,
                twolabelname: null,
                loginInfo: {
                    name: '',
                    userid: ''
                },
                listLoading: false,
                imageSize: {
                    width: 0,
                    height: 0
                }
            }
        },
        methods: {
            load(searchKey, calltime) {
                this.searchKey = searchKey;
                
                this.steps = [
                    {
                        title:'首页',
                        url:'/home'
                    },
                    {
                        title:'试卷',
                        url:'/answer'
                    }
                ];
                localStorage.setItem('step', JSON.stringify(this.steps));
                let params = {
                    pagination:{
                        numPerPage:this.page_size,
                        pageNo:this.page
                    },
                    conditions: [
                        {
                            fieldName: 'contenttype',
                            fieldValues: [
                                '4'
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
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
                        },
                        {
                            fieldName: 'searchkey',
                            fieldValues: [
                                searchKey.trim()
                            ],
                            prepender: null,
                            operator: 'FUZZY_MATCH',
                            childConditions: null
                        }
                    ],
                    orderMethods: [
                        {
                            field: this.sort_by,
                            method: 'DESC'
                        }
                    ]
                };
                if (this.twolabelname != null) {
                    params.conditions.push(
                        {
                            fieldName: 'twolabel',
                            fieldValues: [
                                this.twolabelname
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        }
                    );
                }

                // If user is logged in add filter params sharerangekey
                if(localStorage.getItem('frontend-user')){
                   
                } else {
                    params.conditions.push({
                        fieldName: 'sharerange',
                        fieldValues: [
                            1
                        ]
                    })
                }

                this.listLoading = true;
                getGoodsList(params).then((res) => {
                    if (this.last_call != 0 && this.last_call > calltime) return;
                    this.last_call = calltime;
                    if (res.data.serverResult.resultCode == "200") {
                        this.data = res.data.pageInfo.list;
                        this.total = res.data.pageInfo.total;
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.data = [];
                        this.total = 0;
                    }
                    this.listLoading = false;
                    this.imageSize.width = $('.ecrw-exam-content').width();
                    this.imageSize.height = 610;
                });
            },
            search() {
                this.page = 1;
                this.load(this.searchKey, new Date().getTime());
            },
            sortBy(sort_by) {
                this.page = 1;
                this.sort_by = sort_by;
                this.load(this.searchKey, new Date().getTime());
            },
            setSession() {
                localStorage.setItem('answer-navigation' + this.loginInfo.userid, JSON.stringify(this.selectedItems));
            },
            onChangePage(page) {
                this.page = page;
                this.load(this.searchKey, new Date().getTime());
            },
            onSchoolSectionChange: function(val, byuser) {
                this.page = 1;
                this.selectedItems = val;
                if (byuser) this.setSession();
            },
            onSubjectChange: function(val, byuser) {
                this.page = 1;
                this.selectedItems = val;
                if (byuser) this.setSession();
            },
            onGradeChange: function(val, byuser) {
                this.page = 1;
                this.selectedItems = val;
                this.load('', new Date().getTime());
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
                this.load('', new Date().getTime());
                if (byuser) this.setSession();
            }
        },
        created() {
            var user = localStorage.getItem('frontend-user');
            if (user != null) {
                this.loginInfo.name = JSON.parse(user).realName;
                this.loginInfo.userid = JSON.parse(user).userId;
            }
            this.twolabelname = this.$route.params.twolabel;
            this.load('', new Date().getTime());
        },
        mounted() {
            let answerNavi;
            // Author : GOD, Bug ID: #401
            var currentMonth = new Date().getMonth() + 1;
            var bookmodel = undefined;
            if ([3,4,5,6,7,8].includes(currentMonth)){
                bookmodel = '2000000001';
            } else if([1,2,9,10,11,12].includes(currentMonth)){
                bookmodel = '2000000002';
            }
            
            if (this.loginInfo.userid == null || this.loginInfo.userid == "") {
                answerNavi = {
                    schoolsectionid: 'PRIMARY_SCHOOL', // 小学
                    bookmodelid: bookmodel
                };
                this.$refs.grade.setNavigation(answerNavi);
            } else {
                var flag = true;
                if (localStorage.getItem('answerViewCount') == null) {
                    flag = true;
                } else {
                    flag = false;
                } 
                if (flag) {
                    answerNavi = {
                        schoolsectionid: 'PRIMARY_SCHOOL', // 小学
                        bookmodelid: bookmodel
                    };
                    this.$refs.grade.setNavigation(answerNavi);
                } else {
                    answerNavi = localStorage.getItem('answer-navigation' + this.loginInfo.userid);    
                    if (answerNavi == null){
                        answerNavi = {
                            schoolsectionid: 'PRIMARY_SCHOOL', // 小学
                            bookmodelid: bookmodel
                        };
                        this.$refs.grade.setNavigation(answerNavi);
                    } else {
                        answerNavi = JSON.parse(answerNavi);
                        this.$refs.grade.setNavigation(answerNavi);
                    }
                }
            }
            localStorage.setItem('answerViewCount', 1);
        }
    }
</script>

<style scoped lang="scss">
    @import '~scss_vars';

</style>