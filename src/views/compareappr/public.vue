<template>
    <section>
        <body class="ecrw-body ecrw-pingbi-body">
            <div class="ecrw-mode" style="background-color: #ffdbb1;">
                <div class="ecrw-mode-banner">
                    <div class="ecrw-mode-banner-text">
                        <p>主办方：辅导员杂志社 承办方：学科网 </p>
                        <p>  官方媒体：中国教育在线 易学网</p>
                    </div>
                </div>
                <div class="ecrw-mode-nav">
                    <div class="ecrw-in">
                        <div class="ecrw-mode-nav-in clearfix">
                            <a href="javascript:;" class="ecrw-mode-nav-href" @click="goPage('/home')">首页</a>
                            <a href="javascript:;" @click="goPage('/compareappr/' + activityid)" class="ecrw-mode-nav-href">活动详情</a>
                            <a href="javascript:;" @click="goPage('/compareappr/activity/' + activityid)" class="ecrw-mode-nav-href">活动评比</a>
                            <a href="javascript:;" class="ecrw-mode-nav-href ecrw-mode-nav-sel">结果公示</a>
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
                                    <li class="ecrw-mode-float-li-list" v-if="ECRUtil.isLoggedIn() && ECRUtil.isTeacher() && (activityInfo.status == 1)">
                                        <a href="javascript:;" @click="goPage('/compareappr/upload/' + activityid)" class="ecrw-mode-float-cy">参与活动</a>
                                    </li>
                                    <li class="ecrw-mode-float-li-list">
                                        <a href="javascript:;" @click="goPage('/compareappr/' + activityid)" class="ecrw-mode-float-cy">活动详情</a>
                                    </li>
                                    <li class="ecrw-mode-float-li-list">
                                        <a href="javascript:;" @click="goPage('/compareappr/activity/' + activityid)" class="ecrw-mode-float-cy">活动评比</a>
                                    </li>
                                    <li class="ecrw-mode-float-li-bot">
                                        <a href="javascript:;" class="ecrw-mode-float-top" @click="goTop">TOP</a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div class="ecrw-mode-wrap">
                            <div class="ecrw-mode-wrap-content" v-if="activityInfo!= null">
                                <ul>
                                    <li class="ecrw-mode-wrap-end" id="enddescription">
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </body>
    </section>
</template>
<script>
    import ECRUtil from '../../common/js/util'
    import { getEstimateActivity } from '../../api/api';

    export default {
        data() {
            return {
                ECRUtil:ECRUtil,
                activityid: '',
                activityInfo: null
            }
        },
        computed: {
            
        },
        methods: {
            load() {
                this.getEstimateActivity();
            },
            getEstimateActivity() {
                getEstimateActivity(this.activityid).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.activityInfo = res.data.responseEntity;

                        let _this = this;
                        this.$nextTick(function() {
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
            goTop() {
                $("html,body").animate({scrollTop:0},"fast");
            },
            goPage(url) {
                this.$router.push(url);
            }
        },
        created() {
            this.activityid = this.$route.params.id;
        },
        mounted() {
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