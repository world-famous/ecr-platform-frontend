<template>
    <section class="ecrw-body ecrw-pingbi-body">
        <div class="ecrw-mode">
            <div class="ecrw-mode-banner">
                <div class="ecrw-mode-banner-text">
                    <p>主办方：辅导员杂志社 承办方：学科网 </p>
                    <p>  官方媒体：中国教育在线 易学网</p>
                </div>
            </div>
            <div class="ecrw-mode-nav">
                <div class="ecrw-in">
                    <div class="ecrw-mode-nav-in clearfix">
                        <a href="javascript:;" class="ecrw-mode-nav-href" @click="goPage('/compareappr/type/0')">首页</a>
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
                            <ul>
                                <li class="ecrw-mode-float-li-people">
                                </li>
                                <li class="ecrw-mode-float-li-list" v-if="activityInfo!=null && ECRUtil.isLoggedIn() && ECRUtil.isTeacher() && (activityInfo.status == 1)">
                                    <a href="javascript:;" @click="goPage('/compareappr/upload/' + activityid)" class="ecrw-mode-float-cy">参与活动</a>
                                </li>
                                <li class="ecrw-mode-float-li-list">
                                    <a href="javascript:;" class="ecrw-mode-float-cy" @click="goIntro">活动介绍</a>
                                </li>
                                <li class="ecrw-mode-float-li-list">
                                    <a href="javascript:;" class="ecrw-mode-float-cy" @click="goEstimate">活动评比</a>
                                </li>
                                <li class="ecrw-mode-float-li-list" v-if="activityInfo!=null&&activityInfo.status=='0'">
                                    <a href="javascript:;" class="ecrw-mode-float-cy" @click="goResult">结果公示</a>
                                </li>
                                <li class="ecrw-mode-float-li-bot">
                                    <a href="javascript:;" class="ecrw-mode-float-top" @click="goTop">TOP</a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="ecrw-mode-wrap">
                        <div class="ecrw-mode-wrap-title" id="description">
                            <div class="ecrw-mode-pingjia-title">
                                <span class="ecrw-mode-pingjia-num">1</span>
                                <span class="ecrw-mode-pingjia-name">活动介绍</span>
                            </div>
                        </div>

                        <div class="ecrw-mode-wrap-content ecrw-mode-pingjia-content" v-if="activityInfo!= null">
                            <div class="ecrw-mode-wrap-pingjia-title" id="descriptioncontent">
                            </div>
                        </div>
                    </div>
                    <div class="ecrw-mode-wrap">
                        <div class="ecrw-mode-wrap-title" id="requirement">
                            <div class="ecrw-mode-pingjia-title">
                                <span class="ecrw-mode-pingjia-num">2</span>
                                <span class="ecrw-mode-pingjia-name">活动要求</span>
                            </div>
                        </div>

                        <div class="ecrw-mode-wrap-content ecrw-mode-pingjia" v-if="activityInfo!= null">
                            <div class="ecrw-mode-wrap-pingjia-title" id="requirementcontent">
                            </div>
                        </div>
                    </div>
                    <div class="ecrw-mode-wrap">
                        <div class="ecrw-mode-wrap-title" id="compare">
                            <div class="ecrw-mode-pingjia-title">
                                <span class="ecrw-mode-pingjia-num">3</span>
                                <span class="ecrw-mode-pingjia-name">活动评比</span>
                            </div>
                            <a href="javascript:;" @click="goPage('/compareappr/activity/' + activityid)" class="ecrw-mode-pingjia-more">更多 &gt;</a>
                        </div>

                        <div class="ecrw-mode-pingjia-wrap clearfix">
                            <div class="ecrw-mode-pingjia-cond">
                                <a href="javascript:;" class="ecrw-mode-pingjia-href" @click="searchRecent" :class="{ 'ecrw-mode-pingjia-select':orderby_recent==true }">最新上传</a>
                                <a href="javascript:;" class="ecrw-mode-pingjia-href" @click="searchVotetime" :class="{ 'ecrw-mode-pingjia-select':orderby_vote==true }">票数</a>
                                <input type="text" class="input-type" v-model="filters.searchkey">
                                <a href="javascript:;" class="ecrw-zhengji-upload-form-href" @click="search">查询</a>
                            </div>
                            <div  v-for="(item, idx) in teacherList" :key="idx" :data="item">
                                <div class="ecrw-mode-pingjia-list">
                                    <div class="ecrw-mode-pingjia-left">
                                        <img src="static/images/ecrw-mode-icon.png"/>
                                    </div>
                                    <div class="ecrw-mode-pingjia-center">
                                        <ul>
                                            <li class="ecrw-mode-pingjia-li-title">{{item.realName}}</li>
                                            <li class="ecrw-mode-pingjia-li-desc">学校：{{item.orgName}}</li>
                                            <li class="ecrw-mode-pingjia-li-desc">资源贡献：{{item.contribution}} 份</li>
                                        </ul>
                                    </div>
                                    <div class="ecrw-mode-pingjia-right">
                                        <ul>
                                            <li class="ecrw-mode-pingjia-li-button">
                                                <a href="javascript:;" class="ecrw-mode-pingjia-li-tp" @click="voteTeacher(item.userId)">
                                                    <span class="ecrw-mode-pingjia-li-tp-heart">{{item.votetimes}} 票</span>
                                                </a>
                                            </li>
                                            <li class="ecrw-mode-pingjia-li-button">
                                                <a href="javascript:;" @click="goPage('/compareappr/teacher/' + item.userId + '/' + activityid)" class="ecrw-mode-pingjia-li-zp">查看参赛作品</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <img src="static/images/ecrw-empty-data-resource.png" :style="{ width:(imageSize.width) + 'px', height:(imageSize.height) + 'px' }" v-if="teacherList.length==0">
                        </div>
                    </div>
                    <div class="ecrw-mode-wrap" v-if="activityInfo!=null&&activityInfo.status=='0'">
                        <div class="ecrw-mode-wrap-title" id="last">
                            <div class="ecrw-mode-pingjia-title">
                                <span class="ecrw-mode-pingjia-num">4</span>
                                <span class="ecrw-mode-pingjia-name">结果公布</span>
                            </div>
                        </div>

                        <div class="ecrw-mode-wrap-content">
                            <ul>
                                <li class="ecrw-mode-wrap-end" id="enddescription">
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
    import ECRUtil from '../../common/js/util'
    import { getEstimateActivity, getEstimateTeacherList, voteTeacher } from '../../api/api';
    export default {
        data() {
            return {
                ECRUtil:ECRUtil,
                filters: {
                    searchkey : ''
                },
                orderby_recent: false,
                orderby_vote: false,
                activityid: '',
                activityInfo: null,
                teacherList: [],
                imageSize: {
                    width: 0,
                    height: 0
                }
            }
        },
        computed: {
            
        },
        methods: {
            load() {
                this.getEstimateActivity();
                this.getEstimateTeacherList();
            },
            getEstimateActivity() {
                getEstimateActivity(this.activityid).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.activityInfo = res.data.responseEntity;

                        let _this = this;
                        this.$nextTick(function() {
                            $("#descriptioncontent").html(ECRUtil.getHtmlCode(_this.activityInfo.description));
                            $("#requirementcontent").html(ECRUtil.getHtmlCode(_this.activityInfo.requirement));
                            $("#enddescription").html(ECRUtil.getHtmlCode(_this.activityInfo.enddescription));
                        });
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
            getEstimateTeacherList() {
                let params = {
                    pagination:{
                        numPerPage:6,
                        pageNo:1
                    },
                    conditions: [
                        {
                            fieldName: 'activityid',
                            fieldValues: [
                                this.activityid
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        },
                        {
                            fieldName: 'realname',
                            fieldValues: [
                                this.filters.searchkey
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        }
                    ],
                    orderMethods: []
                };
                if (this.orderby_recent) {
                    params.orderMethods.push({
                        field: "OrderByRecentUpload", 
                        method: "ASC"
                    });
                }
                if (this.orderby_vote) {
                    params.orderMethods.push({
                        field: "OrderByVotetimes", 
                        method: "ASC"
                    });
                }

                getEstimateTeacherList(params).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.total = res.data.pageInfo.total;
                        this.teacherList = res.data.pageInfo.list;
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.total = 0;
                        this.teacherList = [];
                    }
                    this.imageSize.width = $('.ecrw-mode-wrap').width();
                    this.imageSize.height = 610;
                }).catch(() => {
                    this.total = 0;
                    this.teacherList = [];
                });
            },
            search() {
                this.page = 1;
                this.getEstimateTeacherList();
            },
            goTop() {
                $("html,body").animate({scrollTop:0},"fast");
            },
            //author: han
            // reason: Smooth Scrolling 
            goIntro() {
                $('html, body').animate({
                    scrollTop: $("#description").offset().top
                }, "fast")
            },
            goEstimate(){
                $('html, body').animate({
                    scrollTop: $("#compare").offset().top
                }, "fast")
            },
            goResult(){
                $('html, body').animate({
                    scrollTop: $("#last").offset().top
                }, "fast")
            },
            //end han
            handleCurrentChange(page) {
                this.page = page;
                this.getEstimateTeacherList();
            },
            voteTeacher(userid) {
                if (this.activityInfo.status == '0') {
                    this.$message({
                        message: '该评比活动已结束，不能点赞。',
                        type: 'error'
                    });
                } else {
                    voteTeacher(userid).then((res) => {
                        if (res.data.serverResult.resultCode == "200") {
                            this.getEstimateTeacherList();
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
                }
            },
            searchRecent() {
                this.orderby_recent = true;
                this.orderby_vote = false;
                this.getEstimateTeacherList();
            },
            searchVotetime() {
                this.orderby_vote = true;
                this.orderby_recent = false;
                this.getEstimateTeacherList();
            },
            goPage(url) {
                this.$router.push(url);
            }
        },
        created() {
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
    .input-type {
        padding: 6px 15px;
        width: 160px;
        border: 1px solid #c8c6c4;
        border-radius: 2px;
        margin-left: 15px
    }
</style>