<template>
    <section>
        <div class="ecrw-in">
            <div class="ecrw-ready ">
                <div class="ecrw-list-pos">
                    <span class="ecrw-list-search">与{{searchKey}}相关内容如下：</span>
                </div>
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
                        <div class="ecrw-ready-bk-tab">
                            <ul>
                                <li class="ecrw-ready-bk-li" v-for="(contentType,idx) in contentTypes" :key="idx" :data="contentType">
                                    <a href="javascript:;" class="ecrw-ready-bk-href " :class="{ 'ecrw-ready-bk-sel':curContentType==contentType }" @click="load(contentType)">
                                        {{ contentType.name }} <span v-if="curContentType==contentType">( {{ total }}份 )</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div class="ecrw-exam-tab clearfix">
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
                                    :goods="item"
                                    :labeltag="true"
                                    labeltagname="contentname">
                                </ecr-resource>
                                <my-pagination @current-change="onChangePage" :page="page" :page-size="page_size" :total="total"></my-pagination>
                            </div>
                            <img src="static/images/ecrw-empty-data-resource.png" :style="{ width:(imageSize.width) + 'px', height:(imageSize.height) + 'px' }" v-if="data.length==0">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import ECRUtil from '../common/js/util.js';
    import { search } from '../api/api';

    export default {
        data() {
            return {
                page: 1,
                page_size: 5,
                contentTypes: [
                    { ids:[''], name:'全部' },
                    { ids:['1'], name:'课件' },
                    { ids:['2'], name:'教学设计' },
                    { ids:['3'], name:'拓展文本' },
                    { ids:['4'], name:'试卷' },
                    { ids:['5'], name:'图片' },
                    { ids:['6'], name:'视频' },
                    { ids:['7'], name:'音频' },
                    { ids:['8', '9'], name:'动画' },
                    { ids:['10'], name:'电子书' }
                ],
                loginInfo: {
                    name: '',
                    userid: ''
                },
                curContentType: null,
                total: 0,
                sort_by: '推荐排序',
                steps:[],
                data:[],
                searchKey:'',
                selectedItems: {
                    subjectid: '',
                    schoolsectionid: '',
                    gradeid: '',
                    bookmodelid: '',
                    editiontypeid: ''
                },
                last_call: 0,
                listLoading: false,
                imageSize: {
                    width: 0,
                    height: 0
                }
            }
        },
        methods: {
            load(contentType, calltime) {
                this.curContentType = contentType;

                let params = {
                    pagination:{
                        numPerPage:this.page_size,
                        pageNo:this.page
                    },
                    conditions: [
                        {
                            fieldName: 'contenttype',
                            fieldValues: contentType.ids,
                            prepender: null,
                            operator: 'EQUAL',
                            childConditions: null
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
                                (this.searchKey=='')?'':this.searchKey.trim()
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
                search(params).then((res) => {
                    if (this.last_call != 0 && this.last_call > calltime) return;
                    this.last_call = calltime;
                    if (res.data.serverResult.resultCode == "200") {
                        this.data = res.data.pageInfo.list;
                        this.total = res.data.pageInfo.total;
                        for (var i=0; i<this.data.length; i++) {
                            this.data[i].resource.contentname = ECRUtil.resourceLabel(this.data[i].resource.contenttype);
                        }
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
                }).catch((res) => {
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
            },
            sortBy(sort_by) {
                this.page = 1;
                this.sort_by = sort_by;
                this.load(this.curContentType, new Date().getTime());
            },
            setSession() {
                localStorage.setItem('search-navigation' + this.loginInfo.userid, JSON.stringify(this.selectedItems));
            },
            onChangePage(page) {
                this.page = page;
                this.load(this.curContentType, new Date().getTime());
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
                this.load(this.curContentType, new Date().getTime());
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
                this.load(this.curContentType, new Date().getTime());
                if (byuser) this.setSession();
            },
            onCourseSelect(item) {
                this.page = 1;
                this.load(this.curContentType, new Date().getTime());
            },
            onCourseDeselect(item) {
                this.page = 1;
                this.load(this.curContentType, new Date().getTime());
            }
        },
        created() {
            var user = localStorage.getItem('frontend-user');
            if (user != null) {
                this.loginInfo.name = JSON.parse(user).realName;
                this.loginInfo.userid = JSON.parse(user).userId;
            }
            if (this.contentTypes.length > 0) {
                this.curContentType = this.contentTypes[0];
            }

            this.searchKey = this.$route.params.key;
            if (this.searchKey == undefined || this.searchKey == null)
                this.searchKey = '';
            this.load(this.curContentType, new Date().getTime());
            let _this = this;
            window.EventHub.$on('request-search', function(searchKey) {
                if (searchKey == undefined || searchKey == null || searchKey == '')
                    _this.searchKey = '';
                _this.searchKey = searchKey;
                _this.load(_this.curContentType, new Date().getTime());
            });
        },
        mounted() {
        }
    }
</script>

<style scoped lang="scss">
    @import '~scss_vars';

    .ecrw-ready-bk-href {
        text-align: center;
    }
</style>