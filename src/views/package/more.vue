<template>
    <section>
        <div class="ecrw-in">
            <div class="ecrw-ready ">
                <div class="ecrw-ready-wrap">
                    <ecr-breadcrumb :steps="steps"></ecr-breadcrumb>
                    <div class="ecrw-ready-wrap-left">
                        <ecr-course-tree ref="courseTree" @item-select="onCourseSelect" @item-deselect="onCourseDeselect"></ecr-course-tree>
                    </div>
                    <div class="ecrw-ready-wrap-right">
                        <div class="ecrw-ready-bk-tab">
                            <ul>
                                <li class="ecrw-ready-bk-li" v-for="(contentType,idx) in contentTypes" :key="idx" :data="contentType">
                                    <a href="javascript:;" class="ecrw-ready-bk-href " :class="{ 'ecrw-ready-bk-sel':curContentType==contentType }" @click="load(contentType)">
                                        {{ contentType.name }}
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div class="ecrw-exam-content" v-loading="listLoading">
                            <div class="ecrw-exam-content-wrap" v-if="data.length>0">
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
    import ECRUtil from '../../common/js/util';
    import { getGoodsList } from '../../api/api';

    export default {
        data() {
            return {
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
                curContentType: null,
                page: 1,
                page_size: 5,
                total: 0,
                steps: [
                    {
                        title:'首页',
                        url:'/home'
                    }
                ],
                onelabel: '',
                twolabel: '',
                data:[],
                listLoading: false,
                imageSize: {
                    width: 0,
                    height: 0
                }
            }
        },
        methods: {
            loadCourseTree() {
                var params = {
                    subjectid: this.subject.subjectid,
                    schoolsectionid: '',
                    bookmodelid: '',
                    editiontypeid: ''
                };
                this.$refs.courseTree.loadChapter(params);
            },
            load(contentType) {
                this.curContentType = contentType;

                this.steps = [
                    {
                        title:'首页',
                        url:'/home'
                    },
                    {
                        title: localStorage.getItem('onelabel'),
                        url:'/package/' + this.onelabel
                    },
                    {
                        title: localStorage.getItem('twolabel'),
                        url:'/package/' + this.onelabel + '/' + this.twolabel
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
                            fieldName: 'onelabelid',
                            fieldValues: [
                                this.onelabel
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        },
                        {
                            fieldName: 'twolabelid',
                            fieldValues: [
                                this.twolabel
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childConditions: null
                        },
                        {
                            fieldName: 'contenttype',
                            fieldValues: contentType.ids,
                            prepender: null,
                            operator: 'EQUAL',
                            childConditions: null
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
                getGoodsList(params).then((res) => {
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
            onChangePage(page) {
                this.page = page;
                this.load(this.curContentType);
            },
            onCourseSelect(item) {
                this.page = 1;
                this.load(this.curContentType);
            },
            onCourseDeselect(item) {
                this.page = 1;
                this.load(this.curContentType);
            }
        },
        created() {
            this.onelabel = this.$route.params.onelabel;
            this.twolabel = this.$route.params.twolabel;
            if (this.contentTypes.length > 0) {
                this.curContentType = this.contentTypes[0];
            }
            this.load(this.curContentType);
        }
    }
</script>

<style scoped lang="scss">
    @import '~scss_vars';

</style>