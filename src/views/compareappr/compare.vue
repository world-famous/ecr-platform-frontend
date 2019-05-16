<template>
    <section class="ecrw-body ecrw-pingbi-body">
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
                        <a href="javascript:;" class="ecrw-mode-nav-href" @click="goPage('/compareappr/type/0')">首页</a>
                        <a href="javascript:;" class="ecrw-mode-nav-href" @click="goPage('/compareappr/' + activityid)">活动详情</a>
                        <a href="javascript:;" class="ecrw-mode-nav-href ecrw-mode-nav-sel">活动评比</a>
                        <a href="javascript:;" class="ecrw-mode-nav-href" v-if="activityInfo!=null&&activityInfo.status=='0'" @click="goPage('/compareappr/public/' + activityid)">结果公示</a>
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
                                <li class="ecrw-mode-float-li-list" v-if="ECRUtil.isLoggedIn()&&ECRUtil.isTeacher()&&(activityInfo!=null&&activityInfo.status=='1')">
                                    <a href="javascript:;" @click="goPage('/compareappr/upload/' + activityid)" class="ecrw-mode-float-cy">参与活动</a>
                                </li>
                                <li class="ecrw-mode-float-li-list">
                                    <a href="javascript:;" @click="goPage('/compareappr/' + activityid)" class="ecrw-mode-float-cy">活动详情</a>
                                </li>
                                <li class="ecrw-mode-float-li-list" v-if="activityInfo!=null&&activityInfo.status=='0'">
                                    <a href="javascript:;" @click="goPage('/compareappr/public/' + activityid)" class="ecrw-mode-float-cy">结果公示</a>
                                </li>
                                <li class="ecrw-mode-float-li-bot">
                                    <a href="javascript:;" class="ecrw-mode-float-top" @click="goTop">TOP</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                  
                    <div class="ecrw-mode-wrap">
                        <div class="ecrw-mode-pingjia-wrap clearfix">
                            <div class="ecrw-mode-pingjia-cond">
                                <a href="javascript:;" class="ecrw-mode-pingjia-href" @click="searchRecent" :class="{ 'ecrw-mode-pingjia-select':orderby_recent==true }">最新上传</a>
                                <a href="javascript:;" class="ecrw-mode-pingjia-href" @click="searchVotetime" :class="{ 'ecrw-mode-pingjia-select':orderby_vote==true }">票数</a>
                                <input type="text" class="input-type" v-model="filters.searchkey">
                                <a href="javascript:;" class="ecrw-zhengji-upload-form-href" @click="search">查询</a>
                            </div>
                            <div class="clearfix" v-loading="listLoading">
                                <div v-for="(item, idx) in teacherList" :key="idx" :data="item">
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
                            </div>
                            <img src="static/images/ecrw-empty-data-resource.png" :style="{ width:(imageSize.width) + 'px', height:(imageSize.height) + 'px' }" v-if="teacherList.length==0">
                            <el-col :span="24" style="margin-bottom: 50px; margin-top: 30px;">
                                <my-pagination @current-change="handleCurrentChange" :page="page" :page-size="page_size" :total="total"></my-pagination>
                            </el-col>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
    import ECRUtil from '../../common/js/util'
    import { getEstimateTeacherList, voteTeacher, getEstimateActivity } from '../../api/api';

    export default {
        data() {
            return {
                filters: {
                    searchkey: ''
                },
                orderby_recent: false,
                orderby_vote: false,
                ECRUtil:ECRUtil,
                /////////// Pagination ///////////
                total: 0,
                page: 1,
                page_size: 6,
                /////////// Pagination End ////////
                activityid: '',
                activityInfo: null,
                teacherList: [],
                listLoading: false,
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
                let params = {
                    pagination:{
                        numPerPage:this.page_size,
                        pageNo:this.page
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
                this.listLoading = true;
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
                    this.listLoading = false;
                    this.imageSize.width = $('.ecrw-mode-wrap').width();
                    this.imageSize.height = 610;
                }).catch(() => {
                    this.listLoading = false;
                    this.total = 0;
                    this.teacherList = [];
                    
                    this.$message({
                        message: '加载失败!',
                        type: 'error'
                    });
                });
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
            search() {
                this.page = 1;
                this.load();
            },
            goTop() {
                $("html,body").animate({scrollTop:0},"fast");
            },
            handleCurrentChange(page) {
                this.page = page;
                this.load();
            },
            voteTeacher(userid) {
                voteTeacher(userid).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.load();
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                    }
                });
            },
            searchRecent() {
                this.orderby_recent = true;
                this.orderby_vote = false;
                this.load();
            },
            searchVotetime() {
                this.orderby_vote = true;
                this.orderby_recent = false;
                this.load();
            },
            goPage(url) {
                this.$router.push(url);
            }
        },
        created() {
            this.activityid = this.$route.params.id;
            this.load();
            this.getEstimateActivity();
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