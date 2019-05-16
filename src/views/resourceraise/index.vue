<template>
    <section>
        <div class="ecrw-banner">
            <div class="ecrw-in ecrw-assort">
                <div class="ecrw-banner-left">
                    <div class="ecrw-banner-zhengji">
                        <a href="javascript:;" @click="goPage('/collection/0')">
                            征集活动
                        </a>
                    </div>
                    <div class="ecrw-banner-canyu" :class="{ 'ecrw-banner-canyu-disabled':!ECRUtil.isLoggedIn() || ECRUtil.isStudent() }">
                        <a href="javascript:;" v-if="ECRUtil.isLoggedIn() && ECRUtil.isTeacher()" @click="goPage('/collection/1')">
                            我参与的
                        </a>
                        <a href="javascript:;" v-if="!(ECRUtil.isLoggedIn() && ECRUtil.isTeacher())">
                            我参与的
                        </a>
                    </div>
                </div>
                <div class="ecrw-banner-right">
                    <div class="ecrw-banner-swiper">
                        <a href="javascript:;" class="ecrw-swiper-left"></a>
                        <a href="javascript:;" class="ecrw-swiper-right"></a>
                        <div class="swiper-container ecrw-swiper">
                            <div class="swiper-wrapper">
                                <div class="swiper-slide" v-for="(activity, idx) in recommandActivities" :key="idx" :data="activity">
                                    <a :href="'collection/detail/' + activity.activityid" target="_blank">
                                        <img :src="ECO_MEDIA_PATH + activity.logopath"/>
                                    </a>
                                </div>
                            </div>
                            <div class="pagination1"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="ecrw-content">
            <div class="ecrw-in">
                <div class="ecrw-content-wrap clearfix" id="ecrw-tegong">
                    <div class="ecrw-content-title ecrw-content-title-tg">
                        <div class="ecrw-content-subtitle">
                            <a href="javascript:;" @click="goPage('/collection/0')" class="ecrw-subtitle-href ecrw-subtitle-more">
                                更多&gt; 
                            </a>
                        </div>
                        最新征集
                    </div>
                    <div class="ecrw-content-zhengji" v-loading="listLoading">
                        <div class="ecrw-big-in  clearfix">
                            <div  v-for="(item, idx) in latestActivities" :key="idx" :data="item">
                                <div class="ecrw-big-wrap">
                                    <div class="ecrw-big-pic">
                                        <span class="ecrw-big-progress" v-if="item.status == 1">进行中</span>
                                        <span class="ecrw-big-progress" v-if="item.status == 0">已结束</span>
                                        <a href="javascript:;" @click="goPage('/collection/detail/' + item.activityid)">
                                            <img :src="ECO_MEDIA_PATH + item.logopath">
                                        </a>
                                    </div>
                                    <div class="ecrw-big-title">
                                        <span class="ecrw-big-num">{{item.bonuspoints}} 积分</span>
                                        {{item.activityname}}
                                    </div>
                                    <div class="ecrw-big-desc">
                                        {{ ECRUtil.formatDate.format(new Date(item.starttime), 'y-M-d') }}
                                        -
                                        {{ ECRUtil.formatDate.format(new Date(item.endtime), 'y-M-d') }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <img src="static/images/ecrw-empty-data-resource.png" :style="{ width:(imageSize.width) + 'px', height:(imageSize.height) + 'px' }" v-if="latestActivities.length==0">
                    </div>
                </div>
                <div class="ecrw-content-wrap" id="ecrw-hot">
                    <div class="ecrw-content-title">
                        最新上传
                    </div>
                    <div class="ecrw-content-det clearfix">
                        <div class="ecrw-content-hot-left">
                            <ecr-study-schedule
                                ref="studyschedule"
                                :contenttype="topContentType1"
                                :resourcetype="topResourceType1">
                            </ecr-study-schedule>
                        </div>
                        <div class="ecrw-content-hot-right">
                            <ecr-test-answer
                                ref="testanswer"
                                :contenttype="topContentType2"
                                :resourcetype="topResourceType2">
                            </ecr-test-answer>
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
    import { getRecentCollectionList, getManyResourceTypeList, getCollectionActivityList } from '../../api/api';

    export default {
        data() {
            return {
                ECRUtil:ECRUtil,
                topResourceType1: '',
                topResourceType2: '',
                topContentType1: '',
                topContentType2: '',
                latestActivities: [],
                recommandActivities: [],
                ECO_MEDIA_PATH: ECO_MEDIA_PATH,
                contentTypes: CONTENT_TYPE,
                listLoading: false,
                imageSize: {
                    width: 0,
                    height: 0
                }
            }
        },
        methods: {
            load() {
                this.getTopCountType();
                this.getActivities();
                this.getRecommandActivities();
            },
            getTopCountType() {
                getManyResourceTypeList({}).then((res) => {
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
            getActivities() {
                let params = {
                    pagination:{
                        numPerPage:6,
                        pageNo:1
                    }
                };
                this.listLoading = true;
                getRecentCollectionList(params).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.latestActivities = res.data.pageInfo.list;
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.latestActivities = [];
                    }
                    this.listLoading = false;
                    this.imageSize.width = $('.ecrw-content-zhengji').width();
                    this.imageSize.height = 610;
                }).catch(() => {
                    this.listLoading = false;
                    this.latestActivities = [];
                    
                    this.$message({
                        message: '加载失败!',
                        type: 'error'
                    });
                });
            },
            getRecommandActivities() {
                let params = {
                    pagination: {},
                    conditions: [
                        {
                            fieldName: 'recommand',
                            fieldValues: [
                                '1'
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        }
                    ]
                };
                getCollectionActivityList(params).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.recommandActivities = res.data.pageInfo.list;
                        var _this = this;
                        this.$nextTick(function() {
                            _this.initAdvertSwiper();
                        });
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.recommandActivities = [];
                    }
                }).catch(() => {
                    this.recommandActivities = [];
                });
            },
            initAdvertSwiper() {
                var mySwiper = $(".ecrw-swiper").swiper({
                    autoplay:5000,
                    loop:true,
                    pagination: '.pagination1',
                    autoplayDisableOnInteraction:false,
                    paginationClickable: true
                });

                $('.ecrw-swiper-left').on('click', function(e){
                    e.preventDefault()
                    mySwiper.swipePrev()
                })
                $('.ecrw-swiper-right').on('click', function(e){
                    e.preventDefault()
                    mySwiper.swipeNext()
                });
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
                    url:'/collection'
                }
            ];
            localStorage.setItem('step', JSON.stringify(steps));
            this.load();
        },
        mounted() {
        }
    }
</script>

<style scoped lang="scss">
    @import '~scss_vars';

</style>