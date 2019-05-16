<template>
    <section>
        <div class="ecrw-in">
            <div class="ecrw-ready ">
                <div class="ecrw-ready-wrap">
                    <ecr-breadcrumb :steps="steps"></ecr-breadcrumb>
                    <ecr-grade 
                    ref="grade"
                        @school-section-change="onSchoolSectionChange" 
                        @subject-change="onSubjectChange" 
                        @grade-change="onGradeChange" 
                        @book-model-change="onBookModelChange" 
                        @edition-type-change="onEditionTypeChange">
                    </ecr-grade>
                    <div class="ecrw-ready-wrap-left">
                        <ecr-course-special ref="courseTree" @item-select="onCourseSelect" @item-deselect="onCourseDeselect" :twolabel="twolabelname"></ecr-course-special>
                    </div>
                    
                    <div class="ecrw-ready-wrap-right" v-loading="resourceLoading">
                        <div class="ecrw-exam-content">
                            <div class="ecrw-exam-content-wrap">
                                <ecr-resource-special v-for="(item, idx) in data"
                                    :key="idx"
                                    :data="item"
                                    :goods="item">
                                </ecr-resource-special>
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
    import ECRUtil from '../../common/js/util';
    import { getGoodsList, getThemeDetail } from '../../api/api';

    export default {
        data() {
            return {
                specialLabels: [],
                twolabelname: null,
                page: 1,
                page_size: 5,
                total: 0,
                steps:[],
                data:[],
                selectedItems: {
                    schoolsectionid: '',
                    subjectid: '',
                    gradeid: '',
                    bookmodelid: '',
                    editiontypeid: ''
                },
                last_call: 0,
                action: null,
                resourceLoading: false,
                themeid: '',
                searchKey: '',
                imageSize: {
                    width: 0,
                    height: 0
                },
                themeName: ''
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
                    },
                    {
                        title:this.themeName,
                        url:'/special/' + this.twolabelname
                    }
                ];
                localStorage.setItem('step', JSON.stringify(this.steps));
                this.fillData(this.twolabelname, new Date().getTime());
            },
            fillData(twolabel, calltime) {
                this.twolabelname = twolabel;

                let params = {
                    pagination:{
                        numPerPage:this.page_size,
                        pageNo:this.page
                    },
                    conditions: [
                        {
                            fieldName: 'themeids',
                            fieldValues: [
                                this.themeid
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
                        }
                    ]
                };
                this.resourceLoading = true;
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
                    this.resourceLoading = false;
                    this.imageSize.width = $('.ecrw-exam-content').width();
                    this.imageSize.height = 610;
                }).catch(() => {
                    this.resourceLoading = false;
                    this.total = 0;
                    this.data = [];
                    
                    this.$message({
                        message: '加载失败!',
                        type: 'error'
                    });
                });
            },
            getDetail(id) {
                getThemeDetail(id).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.themeName = res.data.responseEntity.themename;
                        this.load();
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                    }
                }).catch(() => {
                    this.$message({
                        message: '加载失败!',
                        type: 'error'
                    });
                });
            },
            onChangePage(page) {
                this.page = page;
                this.fillData(this.twolabelname, new Date().getTime());
            },
            onSchoolSectionChange: function(val, byuser) {
                this.page = 1;
                this.selectedItems = val;
                this.$refs.courseTree.loadChapter(this.selectedItems);
                if (this.$refs.courseTree.selectedItem==null) {
                    return;
                } else {
                    this.themeid = '';
                }
            },
            onSubjectChange: function(val, byuser) {
                this.page = 1;
                this.selectedItems = val;
                this.$refs.courseTree.loadChapter(this.selectedItems);
                if (this.$refs.courseTree.selectedItem==null) {
                    return;
                } else {
                    this.themeid = '';
                }
            },
            onGradeChange: function(val, byuser) {
                this.page = 1;
                this.selectedItems = val;
                this.$refs.courseTree.loadChapter(this.selectedItems);
                this.fillData(this.twolabelname, new Date().getTime());
                if (this.$refs.courseTree.selectedItem==null) {
                    return;
                } else {
                    this.themeid = '';
                }
            },
            onEditionTypeChange: function(val, byuser) {
                this.page = 1;
                this.selectedItems = val;
                if (this.$refs.courseTree.selectedItem==null) {
                    return;
                } else {
                    this.themeid = '';
                }
            },
            onBookModelChange: function(val, byuser) {
                this.page = 1;
                this.selectedItems = val;
                this.$refs.courseTree.loadChapter(this.selectedItems);
                this.fillData(this.twolabelname, new Date().getTime());
                if (this.$refs.courseTree.selectedItem==null) {
                    return;
                } else {
                    this.themeid = '';
                }
            },
            onCourseSelect(item) {
                this.page = 1;
                this.themeid = item.themeData.themeid;
                this.fillData(this.twolabelname, new Date().getTime());
            },
            onCourseDeselect(item) {
                this.page = 1;
                this.themeid = '';
                this.fillData(this.twolabelname, new Date().getTime());
            },
            sort_by(sort_by) {

            },
            search() {

            }
        },
        created() {
            this.twolabelname = this.$route.params.twolabel;
            this.themeid = this.twolabelname;
            this.getDetail(this.twolabelname);
            // this.load();
        },
        mounted() {
            var specialNavi = {
                schoolsectionid: 'PRIMARY_SCHOOL' // 小学
            };
            this.$refs.grade.setNavigation(specialNavi);
        }
    }
</script>

<style scoped lang="scss">
    @import '~scss_vars';

</style>