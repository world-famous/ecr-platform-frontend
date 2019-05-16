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
                        <a href="javascript:;" class="ecrw-mode-nav-href ecrw-mode-nav-sel">活动介绍</a>
                        <a href="javascript:;" @click="goPage('/collection/goods/' + activityid)" class="ecrw-mode-nav-href">征集展示</a>
                    </div>
                </div>
            </div>
            <div class="ecrw-mode-content" v-if="activityInfo != null">
                <div class="ecrw-in">
                    <div class="ecrw-mode-float-new">
                        <div class="ecrw-mode-float-in">
                            <ul>
                                <li class="ecrw-mode-float-li-people">
                                </li>
                                <li class="ecrw-mode-float-li-list2" v-if="ECRUtil.isLoggedIn() && ECRUtil.isTeacher() && (activityInfo.status == 1)">
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
                            活动介绍
                        </div>
                        <div class="ecrw-mode-wrap-content" id="description" style="word-break: break-all;">
                        </div>
                    </div>
                    <div class="ecrw-mode-wrap">
                        <div class="ecrw-mode-wrap-title ecrw-mode-wrap-title2">
                            征集要求
                        </div>
                        <div class="ecrw-mode-wrap-content ecrw-mode-wrap-yq" id="requirement" style="word-break: break-all;">
                        </div>
                    </div>
                    <div class="ecrw-mode-wrap">
                        <div class="ecrw-mode-wrap-title ecrw-mode-wrap-title3">
                            征集发文
                        </div>
                        <div class="ecrw-mode-wrap-content ecrw-mode-wrap-text">
                            <ul class="clearfix">
                                <li class="ecrw-mode-wrap-text-li">
                                    <a href="javascript:;">
                                        <img :src="ECO_MEDIA_PATH + activityInfo.accordings[0]">
                                    </a>
                                </li>
                                <li class="ecrw-mode-wrap-text-li">
                                    <a href="javascript:;">
                                        <img :src="ECO_MEDIA_PATH + activityInfo.accordings[1]">
                                    </a>
                                </li>
                                <li class="ecrw-mode-wrap-text-li">
                                    <a href="javascript:;">
                                        <img :src="ECO_MEDIA_PATH + activityInfo.accordings[2]">
                                    </a>
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
    import { getActivity } from '../../api/api';

    export default {
        data() {
            return {
                ECRUtil:ECRUtil,
                activityid: '',
                activityInfo: null,
                ECO_MEDIA_PATH: ECO_MEDIA_PATH,
            }
        },
        methods: {
            load() {
                this.getActivityInfo();
            },
            getActivityInfo() {
                getActivity(this.activityid).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.activityInfo = res.data.responseEntity;
                        let _this = this;
                        this.$nextTick(function() {
                            $("#description").html(ECRUtil.getHtmlCode(_this.activityInfo.description));
                            $("#requirement").html(ECRUtil.getHtmlCode(_this.activityInfo.requirement));
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
            goTop() {
                $("html,body").animate({scrollTop:0},"fast");
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
        }
    }

</script>
<style scoped lang="scss">
    @import '~scss_vars';

    section {
        background-color: #bbe8d7;
        margin-top: -20px;
    }
</style>