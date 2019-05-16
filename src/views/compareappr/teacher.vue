<template>
    <section>
        <body class="ecrw-body ecrw-pingbi-body">
            <div class="ecrw-mode">
                <div class="ecrw-mode-banner">
                    <div class="ecrw-mode-banner-text">
                        <p>主办方：辅导员杂志社 承办方：学科网 </p>
                        <p>官方媒体：中国教育在线 易学网</p>
                    </div>
                 </div>
                <div class="ecrw-mode-nav">
                    <div class="ecrw-in">
                        <div class="ecrw-mode-nav-in clearfix">
                            <a href="javascript:;" class="ecrw-mode-nav-href" @click="goPage('/home')">首页</a>
                            <a href="javascript:;" class="ecrw-mode-nav-href ecrw-mode-nav-sel">活动详情</a>
                            <a href="javascript:;" @click="goPage('/compareappr/activity/' + activityid)" class="ecrw-mode-nav-href">活动评比</a>
                            <a href="javascript:;" @click="goPage('/compareappr/public/' + activityid)" class="ecrw-mode-nav-href" v-if="activityInfo!=null&&activityInfo.status=='0'">结果公示</a>
                        </div>
                    </div>
                </div>
                <div class="ecrw-mode-content">
                    <div class="ecrw-in">
                         <div class="ecrw-mode-float-new">
                            <div class="ecrw-mode-float-in">
                                <ul v-if="activityInfo!=null">
                                    <li class="ecrw-mode-float-li-people">
                                    </li>
                                    <li class="ecrw-mode-float-li-list" v-if="ECRUtil.isLoggedIn() && ECRUtil.isTeacher() && (activityInfo.status == 1)">
                                        <a href="javascript:;" @click="goPage('/compareappr/upload/' + activityid)" class="ecrw-mode-float-cy">参与活动</a>
                                    </li>
                                    <li class="ecrw-mode-float-li-list">
                                        <a href="javascript:;" @click="goPage('/compareappr/activity/' + activityid)" class="ecrw-mode-float-cy">活动评比</a>
                                    </li>
                                    <li class="ecrw-mode-float-li-list" v-if="activityInfo.status=='0'">
                                        <a href="javascript:;" @click="goPage('/compareappr/public/' + activityid)" class="ecrw-mode-float-cy">结果公示</a>
                                    </li>
                                    <li class="ecrw-mode-float-li-bot">
                                        <a href="javascript:;" class="ecrw-mode-float-top" @click="goTop">TOP</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="ecrw-mode-wrap">
                            <div class="ecrw-mode-wrap-content ecrw-mode-detial-wrap">
                                <div class="ecrw-mode-detial-information clearfix">
                                    <div class="ecrw-mode-pingjia-list" v-if="teacherInfo!= null">
                                        <div class="ecrw-mode-pingjia-left">
                                            <img src="/static/images/ecrw-mode-icon.png">
                                        </div>
                                        <div class="ecrw-mode-pingjia-center">
                                            <ul>
                                                <li class="ecrw-mode-pingjia-li-title">{{teacherInfo.realName}}</li>
                                                <li class="ecrw-mode-pingjia-li-desc">学校：{{teacherInfo.orgName}}</li>
                                                <li class="ecrw-mode-pingjia-li-desc">资源贡献：{{teacherInfo.contribution}} 份</li>
                                                <li class="ecrw-mode-pingjia-li-desc">
                                                    <a href="javascript:;" class="ecrw-list-det-bro">{{teacherInfo.totalviewtimes}}&nbsp;</a>
                                                    <a href="javascript:;" class="ecrw-list-det-zan">{{teacherInfo.totalvotetimes}}&nbsp;</a>
                                                    <a href="javascript:;" class="ecrw-list-det-add">{{teacherInfo.totalcollectiontimes}}&nbsp;</a>
                                                    <a href="javascript:;" class="ecrw-list-det-down">{{teacherInfo.totaldowntimes}}&nbsp;</a>
                                                </li>
                                            </ul>
                                        </div>
                                        <div class="ecrw-mode-pingjia-right">
                                            <ul>
                                                <li class="ecrw-mode-pingjia-li-button">
                                                    <a href="javascript:;" class="ecrw-mode-pingjia-li-tp" @click="voteTeacher">
                                                        <span class="ecrw-mode-pingjia-li-tp-heart">{{teacherInfo.votetimes}} 票</span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div class="ecrw-mode-detial" v-loading="listLoading">
                                    <div class="ecrw-mode-detial-information-title">
                                        参赛作品
                                    </div>
                                    <ecr-compare-resource v-for="(item, idx) in resourceList" :key="idx" :data="item"></ecr-compare-resource>
                                    <img src="static/images/ecrw-empty-data-resource.png" :style="{ width:(imageSize.width) + 'px', height:(imageSize.height) + 'px' }" v-if="resourceList.length==0">
                                </div>
                                <div style="margin-top: 50px">
                                    <my-pagination @current-change="handleCurrentChange" :page="page" :page-size="page_size" :total="total"></my-pagination>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </body>
    </section>
</template>
<script>
    import ECRUtil from '../../common/js/util';
    import { getEstimateResourceList, voteTeacher, getTeacherInfo, getEstimateActivity } from '../../api/api';

    export default {
        data() {
            return {
                ECRUtil: ECRUtil,
                /////////// Pagination ///////////
                total: 0,
                page: 1,
                page_size: 6,
                /////////// Pagination End ////////
                activityInfo: null,
                activityid: '',
                userid: '',
                resourceList: [],
                teacherInfo: null,
                listLoading: false,
                imageSize: {
                    width: 0,
                    height: 0
                }
            }
        },
        methods: {
            load() {
                this.getTeacherInfo();
                this.getEstimateResourceList();
                this.getEstimateActivity();
            },
            getEstimateActivity() {
                getEstimateActivity(this.activityid).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.activityInfo = res.data.responseEntity;
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                    }
                });
            },
            getEstimateResourceList() {
                let params = {
                    pagination:{
                        numPerPage:this.page_size,
                        pageNo:this.page,
                        calTotal:true
                    },
                    conditions: [
                        {
                            fieldName: 'creator',
                            fieldValues: [
                                this.userid
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        },
                        {
                            fieldName: 'isgoods',
                            fieldValues: [
                                '1'
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        },
                        {
                            fieldName: 'activityid',
                            fieldValues: [
                                this.activityid
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        }
                    ]
                };
                this.listLoading = true;
                getEstimateResourceList(params).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.total = res.data.pageInfo.total;
                        this.resourceList = res.data.pageInfo.list;
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.total = 0;
                        this.resourceList = [];
                    }
                    this.listLoading = false;
                    this.imageSize.width = $('.ecrw-mode-wrap').width();
                    this.imageSize.height = 610;
                }).catch(() => {
                    this.listLoading = false;
                    this.total = 0;
                    this.resourceList = [];
                });
            },
            getTeacherInfo() {
                getTeacherInfo(this.userid).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.teacherInfo = res.data.responseEntity;
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
            voteTeacher() {
                voteTeacher(this.userid).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.getTeacherInfo();
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                    }
                }).catch(() => {
                    this.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
            },
            handleCurrentChange(page) {
                this.page = page;
                this.getEstimateResourceList();
            },
            goTop() {
                $("html,body").animate({scrollTop:0},"fast");
            },
            goPage(url) {
                this.$router.push(url);
            }
        },
        created() {
            this.userid = this.$route.params.userid;
            this.activityid = this.$route.params.id;
            this.load();
        }
    }

</script>
<style scoped lang="scss">
    @import '~scss_vars';

    section {
        background-color: #ffdbb1;
        margin-top: -20px;
    }
</style>