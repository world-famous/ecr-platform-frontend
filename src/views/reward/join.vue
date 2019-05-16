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
                                <li class="ecrw-zhengji-upload-wrap-tab-li">
                                    <a href="javascript:;" @click="goPage('/reward/create')" v-if="ECRUtil.isLoggedIn()">我发起的</a>
                                </li>
                                <li class="ecrw-zhengji-upload-wrap-tab-li ecrw-zhengji-upload-wrap-tab-sel">
                                    <a href="javascript:;" @click="goPage('/reward/join')" v-if="ECRUtil.isLoggedIn() && ECRUtil.isTeacher()">我参与的</a>
                                </li>
                            </ul>
                        </div>
                        <div class="ecrw-zhengji-upload-list" v-if="ECRUtil.isLoggedIn() && ECRUtil.isTeacher()">
                            <div class="ecrw-zhengji-upload-cond">
                                悬赏名称：  
                                    <input type="text" class="ecrw-zhengji-upload-form" v-model="filters.activityname"/>
                                    悬赏状态：
                                    <select class="ecrw-zhengji-upload-form-select" v-model="filters.status">
                                        <option value="">全部</option>
                                        <option value="0">已结束</option>
                                        <option value="1">待解决</option>
                                        <option value="2">已解决</option>
                                    </select>
                                    <a href="javascript:;" class="ecrw-zhengji-upload-form-href" @click="getIJoinedRewardList">查询</a>
                            </div>
                            <div class="ecrw-zhengji-upload-answer" v-loading="listLoading">
                                <div class="ecrw-exam-content-wrap ecrw-show">
                                    <div  v-for="(item, idx) in joined_activities" :key="idx" :data="item">
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
                                                                <span class="ecrw-exam-list-title-green" v-if="item.status == 2">已解决</span>{{item.activityname}}
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
                                                    <li class="ecrw-exam-list-right-li" v-if="!item.answeruserid">
                                                        <span class="ecrw-color-red">{{ECRUtil.formatScore(item.bonuspoints)}}积分</span>
                                                    </li>
                                                    <li class="ecrw-exam-list-right-li" v-if="item.answeruserid == loginInfo.userid">
                                                        <span class="ecrw-color-red ecrw-exam-list-best">被选为最佳答案</span>
                                                    </li>
                                                    <li class="ecrw-exam-list-right-li">
                                                        <a href="javascript:;" @click="goPage('/reward/join/' + item.activityid)" class="ecrw-exam-list-right-down">查看资源</a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <img src="static/images/ecrw-empty-data-resource.png" :style="{ width:(imageSize.width) + 'px', height:(imageSize.height) + 'px' }" v-if="joined_activities.length==0">
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
                                    <li class="ecrw-zhengji-upload-user-text">
                                        参与征集：<span class="ecrw-color-red">{{userStatInfo.collectionjoincount}}</span>次
                                    </li>
                                    
                                    <li class="ecrw-zhengji-upload-user-text">
                                        参与悬赏：<span class="ecrw-color-red">{{userStatInfo.rewardjoincount}}</span>次
                                    </li>
                                    <li class="ecrw-zhengji-upload-user-text">
                                        参与评比：<span class="ecrw-color-red">{{userStatInfo.estimatejoincount}}</span>次
                                    </li>
                                    <li class="ecrw-zhengji-upload-user-text">
                                        被采纳：<span class="ecrw-color-red">{{userStatInfo.goodansweredcount}}</span>次
                                    </li>
                                    <li class="ecrw-zhengji-upload-user-text">
                                        我发起的悬赏：<span class="ecrw-color-red">{{userStatInfo.rewardcreatecount}}</span>次
                                    </li>
                                </ul>
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
    import { getIJoinedRewardList, getUserCountInfo } from '../../api/api'

    export default {
        data() {
            return {
                ECRUtil: ECRUtil,
                filters: {
                    activityname: '',
                    status: ''
                },
                loginInfo: {
                    name: '',
                    userid: '-1'
                },
                userStatInfo: null,
                page: 1,
                page_size: 5,
                total: 0,
                joined_activities: [],
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
                this.getIJoinedRewardList();
                this.getUserCountInfo();
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            handleCurrentChange(page) {
                this.page = page;
                this.load();
            },
            getIJoinedRewardList() {
                let params = {
                    pagination:{
                        numPerPage:this.page_size,
                        pageNo:this.page,
                        calTotal:true
                    },
                    conditions: [
                        {
                            fieldName: 'activityname',
                            fieldValues: [
                                this.filters.activityname.trim()
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        },
                        {
                            fieldName: 'status',
                            fieldValues: [
                                this.filters.status
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        }
                    ]
                };
                this.listLoading = true;
                getIJoinedRewardList(params).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.total = res.data.pageInfo.total;
                        this.joined_activities = res.data.pageInfo.list;
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.total = 0;
                        this.joined_activities = [];
                    }
                    this.listLoading = false;
                    this.imageSize.width = $('.ecrw-zhengji-upload-answer').width();
                    this.imageSize.height = 610;
                }).catch(() => {
                    this.listLoading = false;
                    this.total = 0;
                    this.joined_activities = [];
                    
                    this.$message({
                        message: '加载失败!',
                        type: 'error'
                    });
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

</style>