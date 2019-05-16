<template>
    <section>
        <div class="ecrw-in">
            <div class="ecrw-zhengji-upload clearfix">
                <div class="ecrw-zhengji-upload-left">
                    <div class="ecrw-zhengji-upload-wrap">
                        <div class="ecrw-zhengji-upload-wrap-tab">
                            <ul class="clearfix">
                                <li class="ecrw-zhengji-upload-wrap-tab-li">
                                    <a href="javascript:;" @click="goPage('/reward')">资源悬赏列表</a>
                                </li>
                                <li class="ecrw-zhengji-upload-wrap-tab-li ecrw-zhengji-upload-wrap-tab-sel">
                                    <a href="javascript:;" v-if="ECRUtil.isLoggedIn()">我发起的</a>
                                </li>
                                <li class="ecrw-zhengji-upload-wrap-tab-li">
                                    <a href="javascript:;" @click="goPage('/reward/join')" v-if="ECRUtil.isLoggedIn() && ECRUtil.isTeacher()">我参与的</a>
                                </li>
                            </ul>
                        </div>
                        <div class="ecrw-zhengji-upload-list">
                            <div class="ecrw-zhengji-upload-cond ecrw-xuanshang-cond" v-if="reward_countInfo!= null">
                                <span class="ecrw-text-cond">
                                    发起资源悬赏   
                                    <span class="ecrw-color-red">{{reward_countInfo.created}}</span>  
                                    次
                                </span>
                                <span class="ecrw-text-cond" v-if="ECRUtil.isLoggedIn() && ECRUtil.isTeacher()">
                                    我参与资源悬赏   
                                    <span class="ecrw-color-red">{{reward_countInfo.joined}}</span>  
                                    次
                                </span>
                            </div>
                            <div class="ecrw-zhengji-upload-answer" v-loading="listLoading">
                                <div class="ecrw-exam-content-wrap ecrw-show">
                                    <div  v-for="(item, idx) in my_activities" :key="idx" :data="item">
                                        <div class="ecrw-exam-list  clearfix">
                                            <div class="ecrw-exam-list-left" :class="ECRUtil.getDefaultThumb(item, thumbpath)">
                                                <img :src="thumbpath.localpath" v-if="thumbpath.localpath!=''"/>
                                            </div>
                                            <div class="ecrw-exam-list-center">
                                                <div class="ecrw-exam-list-desc">
                                                    <ul>
                                                        <li class="ecrw-exam-list-title">
                                                            <a href="javascript:;" class="ecrw-exam-list-title-href">
                                                                <span class="ecrw-exam-list-title-gray" v-if="item.status == 0">已结束</span>
                                                                <span class="ecrw-exam-list-title-span" v-if="item.status == 1">待解决</span>
                                                                <span class="ecrw-exam-list-title-green" v-if="item.status == 2">已解决</span>
                                                                {{item.activityname}}
                                                            </a>
                                                        </li>
                                                        <li class="ecrw-exam-list-det">
                                                            {{item.requirement}}
                                                        </li>
                                                        <li class="ecrw-exam-list-other">
                                                            <span class="ecrw-exam-list-other-span">
                                                                发布时间：{{ ECRUtil.formatDate.format(new Date(item.createtime), 'y/M/d') }}
                                                            </span>
                                                            <span class="ecrw-exam-list-other-span">
                                                            回答次数：<span class="ecrw-color-red">
                                                                {{item.answercount}}
                                                            </span>
                                                            <span class="ecrw-exam-list-other-span">
                                                            浏览次数：<span class="ecrw-color-red">
                                                                {{item.viewtimes}}
                                                            </span>
                                                        </span>
                                                        </span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div class="ecrw-exam-list-right ecrw-exam-list-right-zhengji-own">
                                                <ul>
                                                    <li class="ecrw-exam-list-right-li">
                                                        <span class="ecrw-color-red">{{item.bonuspoints}}积分</span>
                                                    </li>
                                                    <li class="ecrw-exam-list-right-li" v-if="item.isanswer == 1">
                                                        <span class="ecrw-color-red ecrw-exam-list-best">被选为最佳答案</span>
                                                    </li>
                                                    
                                                    <li class="ecrw-exam-list-right-li" v-if="ECRUtil.isLoggedIn">
                                                        <a href="javascript:;" @click="goPage('/reward/model/' + item.activityid)" class="ecrw-exam-list-right-down">查看资源</a>
                                                    </li>
                                                    <li class="ecrw-exam-list-right-li" v-if="ECRUtil.isLoggedIn && item.status != 0">
                                                        <a href="javascript:;" class="ecrw-exam-list-right-down" @click="handleClose(item.activityid)">结束资源悬赏</a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <img src="static/images/ecrw-empty-data-resource.png" :style="{ width:(imageSize.width) + 'px', height:(imageSize.height) + 'px' }" v-if="my_activities.length==0">
                            </div>
                            <el-col :span="24" style="margin-bottom: 50px; margin-top: 30px;">
                                <my-pagination @current-change="handleCurrentChange" :page="page" :page-size="page_size" :total="total"></my-pagination>
                            </el-col>
                        </div>
                    </div>
                </div>
                <div class="ecrw-zhengji-upload-right">
                    <div class="ecrw-zhengji-upload-right-wrap">
                        <div class="ecrw-zhengji-upload-user">
                            <div class="ecrw-zhengji-upload-user-left" v-if="userStatInfo!=null">
                                <ul>
                                    <li class="ecrw-zhengji-upload-user-left-pic">
                                        <a href="javascript:;">
                                            <img src="static/images/ecrw-head.png"/>
                                        </a>
                                    </li>
                                    <li class="ecrw-zhengji-upload-user-left-name">{{ loginInfo.name }}</li>
                                </ul>
                            </div>
                            <div class="ecrw-zhengji-upload-user-right" v-if="userStatInfo!= null">
                                <ul>
                                    <li class="ecrw-zhengji-upload-user-text" v-if="ECRUtil.isLoggedIn() && ECRUtil.isTeacher()">
                                        参与征集：<span class="ecrw-color-red">{{userStatInfo.collectionjoincount}}</span>次
                                    </li>
                                    
                                    <li class="ecrw-zhengji-upload-user-text" v-if="ECRUtil.isLoggedIn() && ECRUtil.isTeacher()">
                                        参与悬赏：<span class="ecrw-color-red">{{userStatInfo.rewardjoincount}}</span>次
                                    </li>
                                    <li class="ecrw-zhengji-upload-user-text" v-if="ECRUtil.isLoggedIn() && ECRUtil.isTeacher()">
                                        参与评比：<span class="ecrw-color-red">{{userStatInfo.estimatejoincount}}</span>次
                                    </li>
                                    <li class="ecrw-zhengji-upload-user-text" :class="{'upload-user-text': (ECRUtil.isLoggedIn() && ECRUtil.isStudent())}">
                                        我发起的悬赏：<span class="ecrw-color-red">{{userStatInfo.rewardcreatecount}}</span>次
                                    </li>
                                </ul>
                            </div>
                            <div class="ecrw-zhengji-upload-user-button" :class="{'upload-user-button': (ECRUtil.isLoggedIn() && ECRUtil.isStudent())}">
                                <a href="reward/propose" target="_blank">发起资源悬赏</a>
                            </div>
                        </div>
                        <div class="ecrw-zhengji-upload-new">
                            <ecr-last-reward
                                ref="topreward"
                                >
                            </ecr-last-reward>
                        </div>
                        <div class="ecrw-zhengji-upload-new">
                            <ecr-top-rewarder
                                ref="toprewarder"
                                >
                            </ecr-top-rewarder>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import ECRUtil from '../../common/js/util'
    import { CONTENT_TYPE } from '../../common/js/const.js';
    import { getManyRewardResourceTypeList, getMyRewardList, getRewardCountInfo, getUserCountInfo, endRewardActivity } from '../../api/api'

    export default {
        data() {
            return {
                ECRUtil: ECRUtil,
                loginInfo: {
                    name: '',
                    userid: '-1'
                },
                userStatInfo: null,
                page: 1,
                page_size: 5,
                total: 0,
                my_activities: [],
                reward_countInfo: null,
                thumbpath:{ localpath:'' },
                listLoading: false,
                imageSize: {
                    width: 0,
                    height: 0
                }
            }
        },
        computed: {},
        methods: {
            load() {
                this.getMyRewardList();
                this.getRewardCountInfo();
                this.getUserCountInfo();
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            handleCurrentChange(page) {
                this.page = page;
                this.load(this.type);
            },
            getMyRewardList() {
                let params = {
                    pagination:{
                        numPerPage:this.page_size,
                        pageNo:this.page,
                        calTotal:true
                    },
                    conditions: []
                };
                this.listLoading = true;
                getMyRewardList(params).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.total = res.data.pageInfo.total;
                        this.my_activities = res.data.pageInfo.list;
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.total = 0;
                        this.my_activities = [];
                    }
                    this.listLoading = false;
                    this.imageSize.width = $('.ecrw-zhengji-upload-answer').width();
                    this.imageSize.height = 610;
                }).catch(() => {
                    this.listLoading = false;
                    this.total = 0;
                    this.my_activities = [];
                    
                    this.$message({
                        message: '加载失败!',
                        type: 'error'
                    });
                });
            },
            getRewardCountInfo() {
                getRewardCountInfo({}).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.reward_countInfo = res.data.responseEntity;
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                    }
                });
            },
            getUserCountInfo() {
                getUserCountInfo(this.loginInfo.userid).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.userStatInfo = res.data.responseEntity;
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                    }
                });
            },
            handleClose(activityid) {
                this.$confirm('是否结束当前活动？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    endRewardActivity(activityid).then((res) => {
                        if (res.data.serverResult.resultCode == "200") {
                            this.$router.push('/reward');
                        } else {
                            this.$message({
                                message: res.data.serverResult.resultMessage,
                                type: 'error'
                            });
                            this.listLoading = false;
                        }
                    }).catch(() => {
                        this.listLoading = false;

                        this.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                    });
                });
            },
            goPage(url) {
                this.$router.push(url);
            }
        },
        created() {
            ECRUtil.authenticate(this.$router, '/home');
            
            var user = localStorage.getItem('frontend-user');
            if (user != null) {
                this.loginInfo.name = JSON.parse(user).realName;
                this.loginInfo.userid = JSON.parse(user).userId;
            }
            this.load();
        }
    }
</script>

<style scoped lang="scss">
    @import '~scss_vars';
    .upload-user-button {
        margin-top: 50px;
    }
    .upload-user-text {
        padding-top: 42px;
    }
    .ecrw-zhengji-upload-user-button a{
        font-size: 22px;
    }

</style>