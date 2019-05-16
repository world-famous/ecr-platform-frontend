<template>
    <section>
        <div class="ecrw-in">
            <div class="ecrw-zhengji-upload clearfix">
                <div class="ecrw-zhengji-upload-left ecrw-xuanshang-all">
                    <div class="ecrw-zhengji-upload-wrap">
                        <div class="ecrw-zhengji-upload-wrap-tab">
                            <ul class="clearfix">
                                <li class="ecrw-zhengji-upload-wrap-tab-li ecrw-zhengji-upload-wrap-tab-sel">
                                    <a href="javascript:;">资源悬赏列表</a>
                                </li>
                                <li class="ecrw-zhengji-upload-wrap-tab-li">
                                    <a href="javascript:;" @click="goPage('/reward/create')" v-if="ECRUtil.isLoggedIn()">我发起的</a>
                                </li>
                                <li class="ecrw-zhengji-upload-wrap-tab-li">
                                    <a href="javascript:;" @click="goPage('/reward/join')" v-if="ECRUtil.isLoggedIn() && ECRUtil.isTeacher()">我参与的</a>
                                </li>
                            </ul>
                        </div>
                        <div class="ecrw-zhengji-upload-list">
                            <div class="ecrw-content-title ecrw-content-title-xuanshang">
                                悬赏活动列表
                            </div>
                            <div class="ecrw-zhengji-upload-answer" v-loading="listLoading">
                                <div class="ecrw-exam-content-wrap ecrw-show">
                                    <div class="ecrw-exam-list clearfix" v-for="(item, idx) in activity_lists" :key="idx" :data="item">
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
                                                        {{ item.requirement }}
                                                    </li>
                                                    <li class="ecrw-exam-list-other">
                                                        <span class="ecrw-exam-list-other-span">
                                                            发布时间：{{ ECRUtil.formatDate.format(new Date(item.createtime), 'y/M/d') }}
                                                        </span>
                                                        <span class="ecrw-exam-list-other-span">
                                                            回答次数：<span class="ecrw-color-red">
                                                                {{item.answercount}}
                                                            </span>
                                                        </span>
                                                        <span class="ecrw-exam-list-other-span">
                                                            浏览次数：<span class="ecrw-color-red">
                                                                {{item.viewtimes}}
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
                                                <li class="ecrw-exam-list-right-li" v-if="ECRUtil.isLoggedIn() && ECRUtil.isTeacher() && ((item.creator != loginInfo.userid) && (item.status == 1))">
                                                    <a href="javascript:;" @click="goPage('/reward/upload/' + item.activityid)" class="ecrw-exam-list-right-down">参与悬赏</a>
                                                </li>
                                                <li class="ecrw-exam-list-right-li" v-if="ECRUtil.isLoggedIn() && ECRUtil.isTeacher() && ((item.creator == loginInfo.userid) || (item.status == 0 || item.status == 2))">
                                                    <a href="javascript:;" @click="goPage('/reward/reward_resource/' + item.activityid)" class="ecrw-exam-list-right-down">查看资源</a>
                                                </li>
                                                <li class="ecrw-exam-list-right-li" v-if="ECRUtil.isLoggedIn() && ECRUtil.isStudent()">
                                                    <a href="javascript:;" @click="goPage('/reward/reward_resource/' + item.activityid)" class="ecrw-exam-list-right-down">查看资源</a>
                                                </li>
                                                <li class="ecrw-exam-list-right-li" v-if="(ECRUtil.isLoggedIn) && (item.status != 0) && (item.creator == loginInfo.userid)">
                                                    <a href="javascript:;" class="ecrw-exam-list-right-down" @click="handleClose(item.activityid)">结束资源悬赏</a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <img src="static/images/ecrw-empty-data-resource.png" :style="{ width:(imageSize.width) + 'px', height:(imageSize.height) + 'px' }" v-if="activity_lists.length==0">
                                <div style="margin-top: 50px">
                                    <my-pagination @current-change="handleCurrentChange" :page="page" :page-size="page_size" :total="total"></my-pagination>
                                </div>
                            </div>
                            <div class="ecrw-content-wrap" id="ecrw-hot">
                                <div class="ecrw-content-title">
                                    最新上传
                                </div>
                                <div class="ecrw-content-det clearfix">
                                    <div class="ecrw-content-hot-left">
                                        <ecr-top-reward1
                                            ref="studyschedule"
                                            :contenttype="topContentType1"
                                            :resourcetype="topResourceType1">
                                        </ecr-top-reward1>
                                    </div>
                                    <div class="ecrw-content-hot-right">
                                        <ecr-top-reward2
                                            ref="testanswer"
                                            :contenttype="topContentType2"
                                            :resourcetype="topResourceType2">
                                        </ecr-top-reward2>
                                    </div>
                                </div>
                            </div>
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
    import { getManyRewardResourceTypeList, getRewardActivityList, endRewardActivity } from '../../api/api'

    export default {
        data() {
            return {
                ECRUtil: ECRUtil,
                loginInfo: {
                    name: '',
                    userid: '-1'
                },
                type:0,
                page: 1,
                page_size: 5,
                total: 0,
                recent_activities: [],
                activity_lists: [],
                reward_countInfo: null,
                topResourceType1: '',
                topResourceType2: '',
                topContentType1: '',
                topContentType2: '',
                contentTypes: CONTENT_TYPE,
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
                this.getTopCountType();
                this.getRewardActivityList();
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            handleCurrentChange(page) {
                this.page = page;
                this.load();
            },
            getRewardActivityList() {
                let params = {
                    pagination: {
                        numPerPage: this.page_size,
                        pageNo: this.page,
                        calTotal: true
                    },
                    conditions: []
                };
                this.listLoading = true;
                getRewardActivityList(params).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.total = res.data.pageInfo.total;
                        this.activity_lists = res.data.pageInfo.list;
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.total = 0;
                        this.activity_lists = [];
                    }
                    this.listLoading = false;
                    this.imageSize.width = $('.ecrw-zhengji-upload-answer').width();
                    this.imageSize.height = 610;
                }).catch(() => {
                    this.listLoading = false;
                    this.total = 0;
                    this.activity_lists = [];
                    
                    this.$message({
                        message: '加载失败!',
                        type: 'error'
                    });
                });
            },
            getTopCountType() {
                getManyRewardResourceTypeList({}).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.topResourceType1 = res.data.pageInfo.list[0];
                        this.topResourceType2 = res.data.pageInfo.list[1];
                        this.getContentType();
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.topResourceType1 = [];
                        this.topResourceType2 = [];
                    }
                }).catch(() => {
                    this.topResourceType1 = [];
                    this.topResourceType2 = [];
                });
            },
            getContentType() {
                for (var i = 0; i<this.contentTypes.length; i++) {
                    if (this.topResourceType1 == this.contentTypes[i].contenttype) {
                        this.topContentType1 = this.contentTypes[i].contentname;
                    }
                    if (this.topResourceType2 == this.contentTypes[i].contenttype) {
                        this.topContentType2 = this.contentTypes[i].contentname;
                    }
                }
            },
            handleClose(activityid) {
                this.$confirm('是否结束当前活动？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    endRewardActivity(activityid).then((res) => {
                        if (res.data.serverResult.resultCode == "200") {
                            this.getRewardActivityList();
                            // this.$router.push('/reward');
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

</style>