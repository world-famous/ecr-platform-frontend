<template>
    <section>
        <div class="ecrw-in">
            <div class="ecrw-zhengji-upload">
                <div class="ecrw-zhengji-upload-left">
                    <div class="ecrw-zhengji-upload-wrap">
                        <div class="ecrw-zhengji-upload-wrap-tab">
                            <ul class="clearfix">
                                <li class="ecrw-zhengji-upload-wrap-tab-li" :class="{'ecrw-zhengji-upload-wrap-tab-sel':type==0}">
                                    <a href="javascript:;" @click="selectType(0)">征集活动列表</a>
                                </li>
                                <li class="ecrw-zhengji-upload-wrap-tab-li" :class="{'ecrw-zhengji-upload-wrap-tab-sel':type==1}" v-if="ECRUtil.isLoggedIn() && ECRUtil.isTeacher()">
                                    <a href="javascript:;" @click="selectType(1)">我参与的</a>
                                </li>
                            </ul>
                        </div>
                        <div class="ecrw-zhengji-upload-list">
                            <div class="ecrw-zhengji-upload-cond">
                                <!-- GOD 2019-2-12 Bug ID : 665 -->
                                活动名称：
                                <input type="text" v-model="filters.activityname" class="ecrw-zhengji-upload-form"/>
                                <!-- GOD 2019-2-12 Bug ID : 665 -->
                                活动状态：
                                <select class="ecrw-zhengji-upload-form-select" v-model="filters.status">
                                    <option value="">全部</option>
                                    <option value="1">未结束</option>
                                    <option value="0">已结束</option>
                                </select>
                                <a href="javascript:;" class="ecrw-zhengji-upload-form-href" @click="search(type)">查询</a>
                            </div>
                            <div class="ecrw-zhengji-upload-answer" v-loading="listLoading">
                                <div class="ecrw-exam-content-wrap ecrw-show">
                                    <ecr-my-activity :activity="activity" :type="type" v-for="(activity, idx) in activities" :key="idx" :data="activity"></ecr-my-activity>
                                </div>
                            </div>
                            <div style="margin-top: 50px">
                                <my-pagination @current-change="handleCurrentChange" :page="page" :page-size="page_size" :total="total"></my-pagination>
                            </div>
                        </div>
                        <div class="ecrw-zhengji-upload-list" v-if="activities.length == 0">
                            <div class="ecrw-zhengji-upload-list-blank">
                                <ul>
                                    <li>
                                        <img src="static/images/ecrw-blank.jpg"/>
                                    </li>
                                    <li>
                                        暂时没有参与任何活动！
                                    </li>
                                </ul>
                            </div>
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
                                    <li class="ecrw-zhengji-upload-user-left-name">{{loginInfo.name}}</li>
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
                                        我发起的悬赏：<span class="ecrw-color-red">{{userStatInfo.rewardcreatecount}}</span>次
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="ecrw-zhengji-upload-new">
                            <ecr-last-activity></ecr-last-activity>
                        </div>
                        <div class="ecrw-zhengji-upload-new">
                            <ecr-top-man></ecr-top-man>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import ECRUtil from '../../common/js/util'
    import { getCollectionActivityList, getMyCollectionList, getUserCountInfo } from '../../api/api'

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
                type:0,
                page: 1,
                page_size: 5,
                total: 0,
                activities: [],
                listLoading: false
            }
        },
        methods: {
            selectType(type) {
                this.type = type;
                this.load(type);
            },
            load(type) {
                this.type = type;
                this.getActivities(this.type);
                this.getUserCountInfo();
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            handleCurrentChange(page) {
                this.page = page;
                this.load(this.type);
            },
            search(type) {
                this.page = 1;
                this.getActivities(type);
            },
            getActivities(type) {
                let params = {
                    pagination:{
                        numPerPage: this.page_size,
                        pageNo:this.page,
                        calTotal:true
                    },
                    // Author : GOD, 2019-2-12, Bug 665
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
                    // Author : GOD, 2019-2-12, Bug 665
                };
                this.listLoading = true;
                if (type == 0) {
                    getCollectionActivityList(params).then((res) => {
                        if (res.data.serverResult.resultCode == "200") {
                            this.total = res.data.pageInfo.total;
                            this.activities = res.data.pageInfo.list;
                        } else {
                            this.$message({
                                message: res.data.serverResult.resultMessage,
                                type: 'error'
                            });
                            this.total = 0;
                            this.activities = [];
                        }
                    }).catch(() => {
                        this.total = 0;
                        this.activities = [];
                        
                        this.$message({
                            message: '加载失败!',
                            type: 'error'
                        });
                    });
                } else if (type == 1) {
                    getMyCollectionList(params).then((res) => {
                        if (res.data.serverResult.resultCode == "200") {
                            this.total = res.data.pageInfo.total;
                            this.activities = res.data.pageInfo.list;
                        } else {
                            this.$message({
                                message: res.data.serverResult.resultMessage,
                                type: 'error'
                            });
                            this.total = 0;
                            this.activities = [];
                        }
                    }).catch(() => {
                        this.total = 0;
                        this.activities = [];
                        
                        this.$message({
                            message: '加载失败!',
                            type: 'error'
                        });
                    });
                }
                this.listLoading = false;
            },
            getUserCountInfo() {
                var user = localStorage.getItem('frontend-user');
                if (user != null) {
                    this.loginInfo.name = JSON.parse(user).realName;
                    this.loginInfo.userid = JSON.parse(user).userId;

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
                }
            }
        },
        created() {
            var type = parseInt(this.$route.params.type);
            this.load(type);
        }
    }
</script>

<style scoped lang="scss">
    @import '~scss_vars';

</style>