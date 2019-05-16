// Author : GOD
// Date Start : 2019-2-11 4:30 PM
// Reason : 特供专题 Data Misloading
<template>
    <div class="ecrw-ready-bk-wrap ecrw-exam-list clearfix" v-if="goods != null">
        <div class="ecrw-exam-list-left" :class="ECRUtil.getDefaultThumb(goods.resource, thumbpath)">
            <div class="ecrw-exam-bk-new" v-if="goods.resource.isnew==1">新</div>
            <a :href="'resource/' + goods.resource.contentid" style="width:100%;height:100%;display:inline-block;" target="_blank">
                <img :src="thumbpath.localpath" v-if="thumbpath.localpath!=''" style="width:100%;height:100%;"/>
            </a>
        </div>
        <div class="ecrw-exam-list-center">
            <div class="ecrw-exam-list-desc">
                <ul>
                    <li class="ecrw-exam-list-title">
                        <span class="ecrw-exam-list-title-span" v-if="labeltag">{{ goods.resource[labeltagname] }}</span>
                        <a :href="'resource/' + goods.resource.contentid" class="ecrw-exam-list-title-href" target="_blank">{{ goods.resource.name }}</a>
                        <my-rate :rate="goods.resource.ratesum==null?0:goods.resource.ratesum"></my-rate>
                    </li>
                    <li class="ecrw-exam-list-det" style="min-height:2em">
                        {{ goods.resource.description }}
                    </li>
                    <li class="ecrw-exam-list-icon clearfix">
                        <div class="ecrw-list-icon-wrap">
                            <a href="javascript:;" title="浏览次数" class="ecrw-list-det-bro">{{ goods.resource.viewtimes }}&nbsp;</a>
                            <a href="javascript:;" title="点赞次数" class="ecrw-list-det-zan" :class="{ 'ecrw-list-det-zan-sel':goods.resource.isvote==1 }" @click="vote">{{ goods.resource.clicktimes }}&nbsp;</a>
                            <a href="javascript:;" title="收藏次数" class="ecrw-list-det-add" :class="{ 'ecrw-list-det-add-sel':goods.resource.isfavourite==1 }" @click="collect">{{ goods.resource.collectiontimes }}&nbsp;</a>
                            <a href="javascript:;" title="下载次数" class="ecrw-list-det-down">{{ goods.resource.downtimes }}&nbsp;</a>
                        </div>
                        <div class="ecrw-exam-list-icon-wenben">
                            <span v-if="goods.resource.fileInfo!=null">文件大小： {{ ECRUtil.getFileSize(goods.resource.fileInfo.size, 2) }} | </span>
                            <span>上传者： {{ goods.resource.creatorname }}  </span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>

        <div class="ecrw-exam-list-right">
            <ul>
                <li class="ecrw-exam-list-right-li">
                    <span class="ecrw-exam-list-right-span">{{ goods.goodprice }}积分</span>
                </li>
                <li class="ecrw-exam-list-right-li">
                    <a href="javascript:;" v-if="goods.resource.isallowdownload=='0'" class="ecrw-button ecrw-exam-list-right-down" :class="{'ecrw-banner-canyu-disabled': goods.resource.isallowdownload=='0'}">下载</a>
                    
                    <a href="javascript:;" v-if="goods.resource.isallowdownload=='1'" class="ecrw-button ecrw-exam-list-right-down" @click="download(goods)">下载</a>
                </li>
                <li class="ecrw-exam-list-right-li">
                    <a href="javascript:;" v-if="goods.resource.isallowdownload=='0'" class="ecrw-button ecrw-exam-list-right-down" :class="{'ecrw-banner-canyu-disabled': goods.resource.isallowdownload=='0'}" v-show="saveBasket">加入资源篮</a>

                    <a href="javascript:;" v-if="goods.resource.isallowdownload=='1'" class="ecrw-button ecrw-exam-list-right-down" style="background: white; color: black; border: solid 1px #0bc2b6;" @click="addToBasket(goods)" v-show="saveBasket">加入资源篮</a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import ECRUtil from '../../../common/js/util.js'
    import { voteResource, addToFavorite, removeFromFavorite, addToBasket } from '../../../api/api'

    export default {
        props: {
            goods: Object,
            labeltag: {
                type: Boolean,
                default: false,
                required: false
            },
            labeltagname: {
                type: String,
                default: 'twolabel',
                required: false
            },
            addLoading: false
            
        },
        data: function () {
            return {
                ECRUtil:ECRUtil,
                saveBasket: true,
                thumbpath:{ localpath:'' }
            }
        },
        methods: {
            vote() {
                if (localStorage.getItem("frontend-user") == null) {
                    window.EventHub.$emit('request-login');
                    return;
                }
                voteResource(this.goods.resource.contentid).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.goods.resource.clicktimes = res.data.responseEntity.clicktimes;
                        this.goods.resource.isvote = res.data.responseEntity.isvote;
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
                if (this.goods.resource.isfavourite == 1) {
                    removeFromFavorite(this.goods.resource.contentid).then((res) => {
                        if (res.data.serverResult.resultCode == "200") {
                            this.goods.resource.isfavourite = 0;
                            this.goods.resource.collectiontimes = res.data.responseEntity.collectiontimes;
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
                    addToFavorite(this.goods.resource.contentid).then((res) => {
                        if (res.data.serverResult.resultCode == "200") {
                            this.goods.resource.isfavourite = 1;
                            this.goods.resource.collectiontimes = res.data.responseEntity.collectiontimes;
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
            download(goods) {
                if (localStorage.getItem("frontend-user") == null) {
                    window.EventHub.$emit('request-login');
                    return;
                }
                if (this.ECRUtil.downloadResource(goods.resource, this.$message) === false) {
                    this.$message({
                        message: '文件不存在。',
                        type: 'error'
                    });
                }
            },
            addToBasket(goods) {
                if (this.addLoading)
                    return;
                this.addLoading = true;
                addToBasket(this.goods.resource.contentid).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        window.EventHub.$emit('add-basket');
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'success'
                        });
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                    }
                    this.addLoading = false;
                }).catch(() => {
                    this.addLoading = false;
                    this.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
            }
        }
    }
</script>
// Author : GOD
// Date End : 2019-2-11 5:30 PM
// Reason : 特供专题 Data Misloading