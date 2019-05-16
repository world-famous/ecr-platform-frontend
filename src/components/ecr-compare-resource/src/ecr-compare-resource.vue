<template>
    <div class="ecrw-ready-bk-wrap ecrw-exam-list clearfix" v-if="data != null">
        <div class="ecrw-exam-list-left" :class="ECRUtil.getDefaultThumb(data, thumbpath)">
            <a :href="'resource/' + data.contentid" style="width:100%;height:100%;display:inline-block;" target="_blank">
                <img :src="thumbpath.localpath" v-if="thumbpath.localpath!=''" style="width: 90px; height: 100px;" />
            </a>
        </div>

        <div class="ecrw-exam-list-center">
            <div class="ecrw-exam-list-desc">
                <ul>
                    <li class="ecrw-exam-list-title">
                        <a :href="'resource/' + data.contentid" class="ecrw-exam-list-title-href" target="_blank">{{ data.name }}</a>
                        <my-rate :rate="data.ratesum==null?0:data.ratesum"></my-rate>
                    </li>
                    <li class="ecrw-exam-list-det" style="min-height:2em">
                        {{ data.description }}
                    </li>

                    <li class="ecrw-exam-list-icon clearfix">
                        <div class="ecrw-list-icon-wrap">
                            <a href="javascript:;" title="浏览次数" class="ecrw-list-det-bro">{{ data.viewtimes }}&nbsp;</a>
                            <a href="javascript:;" title="点赞次数" class="ecrw-list-det-zan" :class="{ 'ecrw-list-det-zan-sel':data.isvote==1 }" @click="vote">{{ data.clicktimes }}&nbsp;</a>
                            <a href="javascript:;" title="收藏次数" class="ecrw-list-det-add" :class="{ 'ecrw-list-det-add-sel':data.isfavourite==1 }" @click="collect">{{ data.collectiontimes }}&nbsp;</a>
                            <a href="javascript:;" title="下载次数" class="ecrw-list-det-down">{{ data.downtimes }}&nbsp;</a>
                        </div>
                        <div class="ecrw-exam-list-icon-wenben">
                            <span v-if="data.fileInfo!=null">文件大小： {{ ECRUtil.getFileSize(data.fileInfo.size, 2) }} | </span>
                            <span>上传者： {{ data.creatorname }}  </span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>

        <div class="ecrw-exam-list-right">
            <ul>
                <li class="ecrw-exam-list-right-li">
                    <span class="ecrw-exam-list-right-span">{{ data.score }}积分</span>
                </li>
                
                <li class="ecrw-exam-list-right-li">
                    <a href="javascript:;" class="ecrw-button ecrw-exam-list-right-down" @click="download(data)">下载</a>
                </li>

            </ul>
        </div>
    </div>
</template>

<script>
    import ECRUtil from '../../../common/js/util.js'
    import { voteResource, addToFavorite, removeFromFavorite } from '../../../api/api'

    export default {
        props: {
            data: Object,
            labeltag: {
                type: Boolean,
                default: false,
                required: false
            }
        },
        data: function () {
            return {
                ECRUtil:ECRUtil,
                thumbpath: {localpath:''},
            }
        },
        methods: {
            vote() {
                if (localStorage.getItem("frontend-user") == null) {
                    window.EventHub.$emit('request-login');
                    return;
                }

                voteResource(this.data.contentid).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.data.clicktimes = res.data.responseEntity.clicktimes;
                        this.data.isvote = res.data.responseEntity.isvote;
                        // Author : GOD
                        // Date Start : 2019-2-6 
                        // Reason : Bug ID 397
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'success'
                        });
                        // Author : GOD
                        // Date End : 2019-2-6 
                        // Reason : Bug ID 397
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
            },
            collect() {
                if (localStorage.getItem("frontend-user") == null) {
                    window.EventHub.$emit('request-login');
                    return;
                }

                if (this.data.isfavourite == 1) {
                    removeFromFavorite(this.data.contentid).then((res) => {
                        if (res.data.serverResult.resultCode == "200") {
                            this.data.isfavourite = 0;
                            this.data.collectiontimes = res.data.responseEntity.collectiontimes;
                            // Author : GOD
                            // Date Start : 2019-2-6 
                            // Reason : Bug ID 397
                            this.$message({
                                message: res.data.serverResult.resultMessage,
                                type: 'success'
                            });
                            // Author : GOD
                            // Date End : 2019-2-6 
                            // Reason : Bug ID 397
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
                } else {
                    addToFavorite(this.data.contentid).then((res) => {
                        if (res.data.serverResult.resultCode == "200") {
                            this.data.isfavourite = 1;
                            this.data.collectiontimes = res.data.responseEntity.collectiontimes;
                            // Author : GOD
                            // Date Start : 2019-2-6 
                            // Reason : Bug ID 397
                            this.$message({
                                message: res.data.serverResult.resultMessage,
                                type: 'success'
                            });
                            // Author : GOD
                            // Date End : 2019-2-6 
                            // Reason : Bug ID 397
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
                }
            },
            download(data) {
                if (localStorage.getItem("frontend-user") == null) {
                    window.EventHub.$emit('request-login');
                    return;
                }

                if (this.ECRUtil.downloadResource(data, this.$message) === false) {
                    this.$message({
                        message: '文件不存在。',
                        type: 'error'
                    });
                }
            }
        }
    }
</script>