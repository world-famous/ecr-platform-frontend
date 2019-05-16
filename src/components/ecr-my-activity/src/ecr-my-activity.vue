<template>
    <div class="ecrw-exam-content-wrap ecrw-show">
        <div class="ecrw-exam-list  clearfix">
            <img class="ecrw-exam-list-left" :src="ECO_MEDIA_PATH + activity.logopath" style="height: 115px" />
            <div class="ecrw-exam-list-center" style="width: calc(100% - 300px)">
                <div class="ecrw-exam-list-desc">
                    <ul>
                        <li class="ecrw-exam-list-title">
                            <a href="javascript:;" class="ecrw-exam-list-title-href" v-if="activity.status == 1">
                                <span class="ecrw-exam-list-title-span">进行中</span>
                            </a>
                            <a href="javascript:;" class="ecrw-exam-list-title-href" v-if="activity.status == 0">
                                <span class="ecrw-exam-list-title-gray">已结束</span>
                            </a>
                            {{activity.activityname}}
                        </li>
                        <li class="ecrw-exam-list-det">
                            {{activity.requirementtext}}
                        </li>
                        <li class="ecrw-exam-list-other">
                            <span class="ecrw-exam-list-other-span">
                                上传时间：{{ ECRUtil.formatDate.format(new Date(activity.createtime), 'y-M-dd') }}
                            </span>

                            <span class="ecrw-exam-list-other-span"> 
                                发起人：{{ activity.creatorname }}
                            </span>

                            <span class="ecrw-exam-list-other-span">
                                浏览次数：<span class="ecrw-color-red">
                                    {{ activity.viewtimes }}
                                </span>
                            </span>

                            <span class="ecrw-exam-list-other-span">
                                下载次数：
                                <span class="ecrw-color-red">{{ activity.downtimes }}</span>
                            </span>

                        </li>

                    </ul>
                </div>
            </div>
            <div class="ecrw-exam-list-right ecrw-exam-list-right-zhengji-list">
                <ul>
                    <li class="ecrw-exam-list-right-li">
                        <span class="ecrw-color-red">{{activity.bonuspoints}}积分</span>
                    </li>
                    <li class="ecrw-exam-list-right-li" v-if="ECRUtil.isLoggedIn() && ECRUtil.isTeacher() && type == 0">
                        <a href="javascript:;" @click="goPage((activity.status==1)?'/collection/upload/' + activity.activityid:'javascript:;')" class="ecrw-exam-list-right-down" :class="{'ecrw-banner-canyu-disabled':(activity.status == 0)}">上传征集资源</a>
                    </li> 
                    <li class="ecrw-exam-list-right-li">
                        <a href="javascript:;" @click="goPage('/collection/goods/' + activity.activityid)" class="ecrw-exam-list-right-down">查看资源</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import ECRUtil from '../../../common/js/util.js'

    export default {
        props: {
            activity: Object,
            type: Number
        },
        data: function () {
            return {
                ECRUtil:ECRUtil,
                ECO_MEDIA_PATH: ECO_MEDIA_PATH
            }
        },
        methods: {
            goPage(url) {
                this.$router.push(url);
            }
        },
        mounted() {
        }
    }
</script>