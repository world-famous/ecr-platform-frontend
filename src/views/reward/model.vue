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
                                    <a href="javascript:;" @click="goPage('/reward/create')" v-if="ECRUtil.isLoggedIn()">我发起的</a>
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
                                    <div  v-for="(item, idx) in activity_goods" :key="idx" :data="item">
                                        <div class="ecrw-exam-list  clearfix">
                                            <div class="ecrw-exam-list-left" :class="ECRUtil.getDefaultThumb(item, thumbpath)">
                                                <img :src="thumbpath.localpath" v-if="thumbpath.localpath!=''" style="width:90px;height:100px;"/>
                                            </div>
                                            <div class="ecrw-exam-list-center">
                                                <div class="ecrw-exam-list-desc">
                                                    <ul>
                                                        <li class="ecrw-exam-list-title">
                                                            <a href="javascript:;" class="ecrw-exam-list-title-href">
                                                                <span class="ecrw-exam-list-title-gray" v-if="item.activitystatus == 0">已结束</span>
                                                                <span class="ecrw-exam-list-title-span" v-if="item.activitystatus == 1">待解决</span>
                                                                <span class="ecrw-exam-list-title-green" v-if="item.activitystatus == 2">已解决</span>
                                                                {{item.name}}
                                                            </a>
                                                        </li>
                                                        <li class="ecrw-exam-list-det">
                                                            {{item.description}}
                                                        </li>
                                                        <li class="ecrw-exam-list-other">
                                                            <span class="ecrw-exam-list-other-span">
                                                                上传时间：{{ ECRUtil.formatDate.format(new Date(item.createtime), 'y/M/d') }}
                                                            </span>
                                                            <span class="ecrw-exam-list-other-span" v-if="item.isanonymity == '0'">
                                                                参与者：{{item.creatorname}}
                                                            </span>

                                                            <span class="ecrw-exam-list-other-span">
                                                                浏览次数：<span class="ecrw-color-red">
                                                                    {{item.viewtimes}}
                                                                </span>
                                                            </span>
                                                            <span class="ecrw-exam-list-other-span">
                                                                下载次数：
                                                                <span class="ecrw-color-red">{{item.downtimes}}</span>
                                                            </span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div class="ecrw-exam-list-right ecrw-exam-list-right-zhengji-own">
                                                <ul>
                                                    <li class="ecrw-exam-list-right-li" v-if="item.isanswer == 1">
                                                        <span class="ecrw-color-red ecrw-exam-list-best">被选为最佳答案</span>
                                                    </li>
                                                    <li class="ecrw-exam-list-right-li" v-if="item.isanswer == 0 && item.activitystatus == 1">
                                                        <a href="javascript:;" class="ecrw-exam-list-right-down" @click="passResource(item.contentid)">设为最佳答案</a>
                                                    </li>
                                                    <li class="ecrw-exam-list-right-li">
                                                        <a :href="'resource/' + item.contentid" class="ecrw-exam-list-right-down" target="_blank">查看资源</a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <img src="static/images/ecrw-empty-data-resource.png" :style="{ width:(imageSize.width) + 'px', height:(imageSize.height) + 'px' }" v-if="activity_goods.length==0">
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
    import { getManyRewardResourceTypeList, getActivityResourceList, setGoodAnswer, getRewardCountInfo, getUserCountInfo } from '../../api/api'

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
                activity_goods: [],
                reward_countInfo: null,
                topReosurceType1: '',
                topReosurceType2: '',
                topContentType1: '',
                topContentType2: '',
                contentTypes: CONTENT_TYPE,
                activityid: '',
                thumbpath:{ localpath:'' },
                listLoading: false,
                imageSize: {
                    width: 0,
                    height: 0
                },
                steps: []
            }
        },
        methods: {
            load() {
                this.getMyResourceList();
                this.getRewardCountInfo();
                this.getUserCountInfo();

                this.steps = [
                    {
                        title:'首页',
                        url:'/home'
                    },
                    {
                        title:'我发起的',
                        url:'/reward/create'
                    }
                ];
                localStorage.setItem('step', JSON.stringify(this.steps));
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            handleCurrentChange(page) {
                this.page = page;
                this.load(this.type);
            },
            getTopCountType() {
                let params = {

                };
                getManyRewardResourceTypeList({}).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.topReosurceType1 = res.data.pageInfo.list[0];
                        this.topReosurceType2 = res.data.pageInfo.list[1];
                        this.getContentType();
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.topReosurceType1 = [];
                        this.topReosurceType2 = [];
                    }
                });
            },
            getContentType() {
                for (var i = 0; i<this.contentTypes.length; i++) {
                    if (this.topReosurceType1 == this.contentTypes[i].contenttype) {
                        this.topContentType1 = this.contentTypes[i].contentname;
                    }
                    if (this.topReosurceType2 == this.contentTypes[i].contenttype) {
                        this.topContentType2 = this.contentTypes[i].contentname;
                    }
                }
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
            getMyResourceList() {
                let params = {
                    pagination:{
                        numPerPage:this.page_size,
                        pageNo:this.page,
                        calTotal:true
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
                            fieldName: 'activitytype',
                            fieldValues: [
                                '2'
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childConditions: null
                        }
                    ]
                };
                this.listLoading = true;
                getActivityResourceList(params).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.total = res.data.pageInfo.total;
                        this.activity_goods = res.data.pageInfo.list;
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.total = 0;
                        this.activity_goods = [];
                    }
                    this.listLoading = false;
                    this.imageSize.width = $('.ecrw-zhengji-upload-answer').width();
                    this.imageSize.height = 610;
                }).catch(() => {
                    this.listLoading = false;
                    this.total = 0;
                    this.activity_goods = [];
                    
                    this.$message({
                        message: '加载失败!',
                        type: 'error'
                    });
                });
            },
            passResource(contentid) {
                this.$confirm('是否确定将此答案标记为最佳？', '提示', {
                    type: 'warning'
                }).then(() => {
                    setGoodAnswer(contentid).then((res) => {
                         if (res.data.serverResult.resultCode == "200") {
                            this.$message({
                                message: "操作成功",
                                type: 'success'
                            });
                            this.$router.push({ path:'/reward'});
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

                }).catch(() => {

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
            this.activityid = this.$route.params.id;
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

</style>