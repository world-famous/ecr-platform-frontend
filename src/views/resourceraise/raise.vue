<template>
    <section>
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
                        <a href="javascript:;" class="ecrw-mode-nav-href" @click="goPage('/collection')">首页</a>
                        <a href="javascript:;" @click="goPage('/collection/detail/' + activityid)" class="ecrw-mode-nav-href">活动介绍</a>
                        <a href="javascript:;" class="ecrw-mode-nav-href ecrw-mode-nav-sel">征集展示</a>
                    </div>
                </div>
            </div>
            <div class="ecrw-mode-content" v-if="resources != null">
                <div class="ecrw-in">
                    <div class="ecrw-mode-float-new">
                        <div class="ecrw-mode-float-in">
                            <ul>
                                <li class="ecrw-mode-float-li-people">
                                </li>
                                <li class="ecrw-mode-float-li-list2" v-if="activityInfo!=null && ECRUtil.isLoggedIn() && ECRUtil.isTeacher() && (activityInfo.status == 1)">
                                    <a href="javascript:;" @click="goPage('/collection/upload/' + activityid)" class="ecrw-mode-float-cy">参与征集</a>
                                </li>

                                <li class="ecrw-mode-float-li-bot2">
                                    <a href="javascript:;" class="ecrw-mode-float-top" @click="goTop">TOP</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="ecrw-mode-wrap">
                        <div class="ecrw-mode-wrap-title ecrw-mode-wrap-title1">
                            征集展示
                        </div>
                        <div class="ecrw-mode-wrap-det">
                            <div class="ecrw-mode-det-title">
                                <span>
                                    活动名称： <input type="text" class="ecrw-mode-form" v-model="filters.activityname"/>
                                </span>
                                <span>
                                    活动状态： 
                                    <select class="ecrw-mode-select" v-model="filters.status">
                                        <option value="">全部</option>
                                        <option value="0">已结束</option>
                                        <option value="1">进行中</option>
                                    </select>
                                </span>
                                <a href="javascript:;" class="ecrw-mode-button" @click="getActivityResourceList">查询</a>
                            </div>
                            <div class="ecrw-mode-detial" v-loading="listLoading">
                                <div  v-for="(item, idx) in resources" :key="idx" :data="item">
                                    <div class="ecrw-exam-list  clearfix">
                                        <div class="ecrw-exam-list-left" :class="resources_class[idx].name">
                                            <img :src="resources_class[idx].path.localpath" v-if="resources_class[idx].path.localpath!=''"/>
                                        </div>
                                        <div class="ecrw-exam-list-center">
                                            <div class="ecrw-exam-list-desc">
                                                <ul>
                                                    <li class="ecrw-exam-list-title">
                                                        <a :href="'resource/' + item.contentid" class="ecrw-exam-list-title-href" target="_blank">
                                                            <span class="ecrw-exam-list-title-span" v-if="item.status != 7">进行中</span>
                                                            <span class="ecrw-exam-list-title-gray" v-if="item.status == 7">已结束</span>{{item.name}}
                                                        </a>
                                                    </li>
                                                    <li class="ecrw-exam-list-det">
                                                            {{item.description}}
                                                    </li>
                                                    <li class="ecrw-exam-list-other">
                                                        <span class="ecrw-exam-list-other-span">
                                                            上传时间：{{item.createtime}}
                                                        </span>
                                                        <span class="ecrw-exam-list-other-span" v-if="item.isanonymity=='0'">
                                                            发起人：{{item.creatorname}}
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
                                                <li class="ecrw-exam-list-right-li">
                                                    <span class="ecrw-color-red">{{ECRUtil.formatScore(item.score)}}积分</span>
                                                </li>
                                                <li class="ecrw-exam-list-right-li">
                                                    <a :href="'resource/' + item.contentid" class="ecrw-exam-list-right-down" target="_blank">查看资源</a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div style="margin-top: 50px">
                                    <my-pagination @current-change="handleCurrentChange" :page="page" :page-size="page_size" :total="total"></my-pagination>
                                </div>
                                <img src="static/images/ecrw-empty-data-resource.png" :style="{ width:(imageSize.width) + 'px', height:(imageSize.height) + 'px' }" v-if="resources.length==0">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
    import ECRUtil from '../../common/js/util';
    import { getActivityResourceList, getActivity } from '../../api/api';

    export default {
        data() {
            return {
                filters: {
                    activityname: '',
                    status: ''
                },
                ECRUtil: ECRUtil,
                /////////// Pagination ///////////
                total: 0,
                page: 1,
                page_size: 5,
                /////////// Pagination End ////////
                activityid: '',
                activityInfo: null,
                resources: [],
                thumbpath:{ localpath:'' },
                imageSize: {
                    width: 0,
                    height: 0
                },
                listLoading: false,
                resources_class: [],
            }
        },
        computed: {
            
        },
        methods: {
            load() {
                this.getActivityResourceList();
                this.getActivityInfo();
            },
            getActivityResourceList() {
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
                        // Author : GOD, 2019-2-12 Bug ID: #680
                        {
                            fieldName: 'activityid',
                            fieldValues: [
                                this.activityid
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        },
                        // Author : GOD, 2019-2-12 Bug ID: #680
                        {
                            fieldName: 'status',
                            fieldValues: [
                                this.filters.status
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        },
                        {
                            fieldName: 'activitytype',
                            fieldValues: [
                                '1'
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        }
                    ]
                };
                this.listLoading = true;
                getActivityResourceList(params).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.total = res.data.pageInfo.total;
                        this.resources = res.data.pageInfo.list;
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.resources = [];
                        this.total = 0;
                    }
                    this.imageSize.width = $('.ecrw-mode-detial').width();
                    this.imageSize.height = 610;
                    this.listLoading = false;
                }).catch(() => {
                    this.resources = [];
                    this.total = 0;
                    this.listLoading = false;
                });
            },
            getActivityInfo() {
                getActivity(this.activityid).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.activityInfo = res.data.responseEntity;
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
            goTop() {
                $("html,body").animate({scrollTop:0},"fast");
            },
            handleCurrentChange(page) {
                this.page = page;
                this.getActivityResourceList();
            },
            goPage(url) {
                this.$router.push(url);
            }
        },
        created() {
            let steps = [
                {
                    title:'首页',
                    url:'/home'
                },
                {
                    title:'征集活动',
                    url:'/collection/0'
                }
            ];
            localStorage.setItem('step', JSON.stringify(steps));

            this.activityid = this.$route.params.id;
            this.load();
        },
        watch: {
            "resources": function (value) {
                for(var idx in value){
                    var thumbpath = {};
                    this.resources_class[idx] = {
                        'name': '',
                        'path': ''
                    };                   
                    this.resources_class[idx].name = ECRUtil.getDefaultThumb(value[idx], thumbpath);
                    this.resources_class[idx].path = thumbpath;
                }                
            }
        },        
        
    }
</script>
<style scoped lang="scss">
    @import '~scss_vars';

    section {
        background-color: #bbe8d7;
        margin-top: -20px;
    }
    .ecrw-exam-list-left img{
        width: 100%;
        height:100%;
    }
</style>