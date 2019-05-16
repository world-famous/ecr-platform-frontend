<template>
    <section>
        <div class="ecrw-in">
            <div class="ecrw-ready ">
                <div class="ecrw-ready-wrap-juti-title">
                    <span>{{ this.orgname }}</span>
                    <span>
                        资源：
                        <span class="ecrw-color-red">{{ this.count }}</span> 
                        份
                    </span>
                </div>
                <!-- wrap -->
                <div class="ecrw-dao-wrap">
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
                        <div class="ecrw-ready-wrap-left">
                            <ecr-course-tree ref="courseTree" @item-select="onCourseSelect" @item-deselect="onCourseDeselect"></ecr-course-tree>
                        </div>
                        <div class="ecrw-ready-wrap-right">
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
            </div>
        </div>
    </section>
</template>

<script>
    import ECRUtil from '../../common/js/util';
    import { getSchoolGoodsList, getGoodsStatisticsBySchoolId } from '../../api/api';

    export default {
        data() {
            return {
                page: 1,
                page_size: 5,
                total: 0,
                data:[],               
                steps: [],
                sort_by: '推荐排序',
                searchKey:'',
                selectedItems: {
                    schoolsectionid: '',
                    subjectid: '',
                    gradeid: '',
                    bookmodelid: '',
                    editiontypeid: ''
                },
                orgid: '',
                orgname: '',
                count: '',
                last_call: 0,
                listLoading: false,
                imageSize: {
                    width: 0,
                    height: 0
                }
            }
        },
        methods: {
            load(calltime) {
                this.orgid= this.$route.params.id;
                getGoodsStatisticsBySchoolId(this.orgid).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        var schoolInfo = res.data.responseEntity;
                        this.orgname = schoolInfo.orgname;
                        this.count = schoolInfo.total;
                        this.composeStep();
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                    }
                }).catch(() => {
                });

                this.loadData(calltime);
            },
            composeStep() {
                this.steps = [
                    {
                        title:'首页',
                        url:'/home'
                    },
                    {
                        title:'名校资源',
                        url:'/famous'
                    },
                    {
                        title:this.orgname,
                        url:'/famous/' + this.orgid
                    }
                ];
                localStorage.setItem('step', JSON.stringify(this.steps));

            },
            loadData(calltime) {
                let params = {
                    pagination:{
                        numPerPage:this.page_size,
                        pageNo:this.page
                    },
                    conditions: [
                        {
                            fieldName: 'orgid',
                            fieldValues: [
                                this.orgid
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
                                this.searchKey.trim()
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

                if (this.$refs.courseTree != null && 
                    this.$refs.courseTree.selectedItem != null) {
                    params.conditions.push({
                            fieldName: 'catalogids',
                            fieldValues: this.$refs.courseTree.selectedItem.catalogids,
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        });
                }
                this.listLoading = true;
                getSchoolGoodsList(params).then((res) => {
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
                }).catch(() => {
                    this.listLoading = false;
                    this.total = 0;
                    this.data = [];
                    
                    this.$message({
                        message: '加载失败!',
                        type: 'error'
                    });
                });
            },
            search() {
                this.page = 1;
                this.loadData(new Date().getTime());
            },
            sortBy(sort_by) {
                this.page = 1;
                this.sort_by = sort_by;
                this.loadData(new Date().getTime());
            },
            setSession() {
                localStorage.setItem('famous-school-navigation', JSON.stringify(this.selectedItems));
            },
            onChangePage(page) {
                this.page = page;
                this.loadData(new Date().getTime());
            },
            onSchoolSectionChange: function(val, byuser) {
                this.page = 1;
                this.selectedItems = val;
                this.$refs.courseTree.loadChapter(this.selectedItems);
                if (byuser) this.setSession();
            },
            onSubjectChange: function(val, byuser) {
                this.page = 1;
                this.selectedItems = val;
                this.$refs.courseTree.loadChapter(this.selectedItems);
                if (byuser) this.setSession();
            },
            onGradeChange: function(val, byuser) {
                this.page = 1;
                this.selectedItems = val;
                this.$refs.courseTree.loadChapter(this.selectedItems);
                this.loadData(new Date().getTime());
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
                this.$refs.courseTree.loadChapter(this.selectedItems);
                this.loadData(new Date().getTime());
                if (byuser) this.setSession();
            },
            onCourseSelect(item) {
                this.page = 1;
                this.loadData(new Date().getTime());
            },
            onCourseDeselect(item) {
                this.page = 1;
                this.loadData(new Date().getTime());
            }
        },
        created() {
            this.load(new Date().getTime());
        },
        mounted() {
            let schoolNavi = localStorage.getItem('famous-school-navigation');
            if (schoolNavi != null && schoolNavi != '') {
                schoolNavi = JSON.parse(schoolNavi);
                if (schoolNavi.schoolsectionid == '' || 
                    schoolNavi.schoolsectionid == undefined) {
                    schoolNavi.schoolsectionid = 'PRIMARY_SCHOOL'; // 小学
                }
                this.$refs.grade.setNavigation(schoolNavi);
            } else {
                schoolNavi = {
                    schoolsectionid: 'PRIMARY_SCHOOL' // 小学
                };
                this.$refs.grade.setNavigation(schoolNavi);
            }
        }
    }
</script>

<style scoped lang="scss">
    @import '~scss_vars';

</style>