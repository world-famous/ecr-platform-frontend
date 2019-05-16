<template>
    <div class="ecrw-ready-bk-wrap ecrw-exam-list clearfix" v-if="goods != null">
        <div class="ecrw-exam-list-left" :class="ecrwClass">
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
                            <a href="javascript:;" title="浏览次数" class="ecrw-list-det-bro">{{ (goods.resource.viewtimes)? goods.resource.viewtimes: 0  }}&nbsp;</a>
                            <a href="javascript:;" title="点赞次数" class="ecrw-list-det-zan" :class="{ 'ecrw-list-det-zan-sel':goods.resource.isvote==1 }" @click="vote" >{{ (goods.resource.clicktimes)? goods.resource.clicktimes: 0 }}&nbsp;</a>
                            <a href="javascript:;" title="收藏次数" class="ecrw-list-det-add" :class="{ 'ecrw-list-det-add-sel':goods.resource.isfavourite==1 }" @click="collect">{{ (goods.resource.collectiontimes)? goods.resource.collectiontimes: 0 }}&nbsp;</a>
                            <a href="javascript:;" title="下载次数" class="ecrw-list-det-down">{{ resource_downtimes }}&nbsp;</a>
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
    import { voteResource, addToFavorite, removeFromFavorite, addToBasket, getMyScore, isAlreadyDownload } from '../../../api/api'

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
                thumbpath:{ localpath:'' },
                vots_waiting: false,
                collectLoading: false,
                resource_downtimes: 0,
            }
        },
        computed: {
          ecrwClass: function () {
              return ECRUtil.getDefaultThumb(this.goods.resource, this.thumbpath);
          }
        },
        methods: {
            vote() {
                if (localStorage.getItem("frontend-user") == null) {
                    window.EventHub.$emit('request-login');
                    return;
                }
                if(this.vots_waiting == true) return;
                this.vots_waiting = true;
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
                    this.vots_waiting = false;
                }).catch(() => {
                    this.vots_waiting = false;
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
                if(this.collectLoading == true) return;
                this.collectLoading = true;
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
                        this.collectLoading = false;
                    }).catch(() => {
                        this.collectLoading = false;
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
                        this.collectLoading = false;
                    }).catch(() => {
                        this.collectLoading = false;
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

                getMyScore().then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        let score = parseInt(res.data.responseEntity);
                        let myUploadresource = false;
                        if(localStorage.getItem("frontend-user")){
                            if(JSON.parse(localStorage.getItem("frontend-user")).userId == goods.resource.creator)
                                myUploadresource = true;
                        }                                             
                        if(goods.goodprice == 0 || myUploadresource){
                            isAlreadyDownload(goods.resource.contentid).then(function(res1){
                                if (res1.data.serverResult.resultCode == "200") {
                                    let bAlreadyDownloaded = parseInt(res1.data.responseEntity);
                                    if (this.ECRUtil.downloadResource(goods.resource, this.$message) === false) {
                                        this.$message({
                                            message: '文件不存在。',
                                            type: 'error'
                                        });
                                    } else {
                                        if(!bAlreadyDownloaded){
                                            this.resource_downtimes = this.resource_downtimes + 1;
                                        }
                                    }
                                    
                                } else {
                                    this.$message({
                                        message: res1.data.serverResult.resultMessage,
                                        type: 'error'
                                    });
                                }

                            }.bind(this)).catch(() => {
                                this.$message({
                                    message: '加载失败!',
                                    type: 'error'
                                });
                            });                            
                        }
                        else{
                            isAlreadyDownload(goods.resource.contentid).then(function(res1){
                                if (res1.data.serverResult.resultCode == "200") {
                                    let bAlreadyDownload = parseInt(res1.data.responseEntity);
                                    if(bAlreadyDownload){
                                        if (this.ECRUtil.downloadResource(goods.resource, this.$message) === false) {
                                            this.$message({
                                                message: '文件不存在。',
                                                type: 'error'
                                            });
                                        }
                                    }
                                    else{
            //                            let strConfirm = "您下载" + goods.resource.name + "需要扣除" + goods.goodprice + "个积分，您共有积分" + score + "分。";
                                        let strConfirm = "下载当前资源需要扣除: " + goods.goodprice + "积分 ，您当前积分余额为:" + score;
                                        this.$confirm(strConfirm, '提示', {
                                            type: 'warning'
                                        }).then(() => {
                                            if (this.ECRUtil.downloadResource(goods.resource, this.$message) === false) {
                                                this.$message({
                                                    message: '文件不存在。',
                                                    type: 'error'
                                                });
                                            } else {
                                                this.resource_downtimes = this.resource_downtimes + 1;
                                            }
                                        });
                                    }
                                } else {
                                    this.$message({
                                        message: res1.data.serverResult.resultMessage,
                                        type: 'error'
                                    });
                                }

                            }.bind(this)).catch(() => {
                                this.$message({
                                    message: '加载失败!',
                                    type: 'error'
                                });
                            });
                        }

                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.score = '?';
                    }
                }).catch(() => {
                    this.score = '?';
                    
                    this.$message({
                        message: '加载失败!',
                        type: 'error'
                    });
                });
                
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
        },
        created(){
            this.resource_downtimes = this.goods.resource.downtimes;
            // console.log(this.goods.resource.downtimes);
        },
        mounted(){
            this.resource_downtimes = this.goods.resource.downtimes;
        },
        watch: {
            'goods':function(value){
                this.resource_downtimes = value.resource.downtimes;                
            }
        }
    }
</script>