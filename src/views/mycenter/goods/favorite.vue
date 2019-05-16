<template>
    <div class="ecrw-profile-content">
        <div class="ecrw-content-title ecrw-profile-right-title">我的收藏</div>
        <div class="ecrw-profile-det">                        
            <div class="ecrw-profile-tab">
                <ul class="clearfix">
                    <li class="ecrw-dao-li" v-for="(kind,idx) in kinds" :key="idx" :data="kind" style="min-width: 10%">
                        <a href="javascript:;" class="ecrw-profile-tab-href" :class="{ 'ecrw-profile-tab-sel':curKind==kind }" @click="selectKind(kind)">
                            {{ kind.name }}
                        </a>
                    </li>
                </ul>
            </div>

            <!-- 循环遍历这个就可以-->
            <div class="ecrw-profile-det-intro">
                <ul>
                    <li class="ecrw-profile-det-li" style="text-align: right;">
                        <span class="ecrw-profile-det">
                            <el-input v-model="filter.name" placeholder="请输入商品名" style="width: 300px"></el-input>
                            <!-- <a href="javascript:;" class="ecrw-profile-enter" @click="load(curKind)">查询</a> -->
                            <!-- <a href="javascript:;" class="ecrw-profile-enter" @click="doBatchRemove">删除</a> -->
                            <el-button type="table-op" size="medium" @click="load(curKind)">查询</el-button>
                            <el-button type="table-op" size="medium" :disabled="this.sels.length===0" @click="doBatchRemove">批量删除</el-button>
                        </span>                       
                    </li>
                </ul>
            </div>
            <div class="ecrw-profile-table-wrap">
                <div class="ecrw-profile-det-det ecrw-profile-det-upload">
                    <img src="static/images/ecrw-empty-data-good.png" :style="{ width:(imageSize.width) + 'px', height:(imageSize.height) + 'px' }" v-if="resources.length==0">
                    <el-table :data="resources" v-loading="listLoading" v-if="resources.length>0" @selection-change="selsChange">
                        <el-table-column type="selection" width="55" align="center"></el-table-column>
                        <el-table-column label="商品名" align="center">    
                            <template slot-scope="resource">
                                <ecr-basket-resource :resource="resource.row"></ecr-basket-resource>
                            </template>
                        </el-table-column>
                        <el-table-column label="积分" align="center" width="130">
                            <template slot-scope="resource">
                                <span class="ecrw-color-red">{{ getGoodPrice(resource.row) }}</span>分
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center" width="160">
                            <template slot-scope="resource">
                                <span class="ecrw-center">
                                    <a href="javascript:;" class="ecrw-profile-enter" @click="deleteFromFavorite(resource.$index,resource.row.contentid)">删除</a>
                                </span>
                                <span class="ecrw-center">
                                    <a href="javascript:;" class="ecrw-profile-enter" @click="download(resource.row)">下载</a>
                                </span>
                            </template>
                        </el-table-column>    
                    </el-table>
                    <el-col :span="24" style="margin-bottom: 50px; margin-top: 30px;">
                        <my-pagination @current-change="goCurrentPage" :page="page" :page-size="page_size" :total="total"></my-pagination>
                    </el-col>
                </div>                
            </div>       

            <!-- 循环遍历这个就可以 end-->
        </div>
    </div>
</template>

<script>
    import ECRUtil from '../../../common/js/util.js'
    import { CONTENT_TYPE } from '../../../common/js/const'
    import { getFavoriteResourceListByUser, removeFromFavorite, batchRemoveFromFavorite, getResource, getMyScore, isAlreadyDownload } from '../../../api/api'

    export default {
        data() {
            return {
                ECRUtil:ECRUtil,
                filter: {
                    name: ''
                },
                kinds: [
                    { ids:[''], name:'全部' },
                    { ids:['1'], name:'课件' },
                    { ids:['2'], name:'教学设计' },
                    { ids:['3'], name:'拓展文本' },
                    { ids:['4'], name:'试卷' },
                    { ids:['5'], name:'图片' },
                    { ids:['6'], name:'视频' },
                    { ids:['7'], name:'音频' },
                    { ids:['8', '9'], name:'动画' },
                    { ids:['10'], name:'电子书' }
                ],
                curKind: null,
                total: 0,
                page:1,
                page_size: 5,
                resources:[],
                listLoading: false,
                delLoading: false,
                imageSize: {
                    width: 0,
                    height: 0
                },
                sels: [], //列表选中列
            }
        },
        methods: {
            selectKind(kind) {
                this.page = 1;
                this.load(kind);
            },
            load(kind) {
                this.curKind = kind;
                let params = {
                    pagination:{
                        numPerPage:this.page_size,
                        pageNo:this.page
                    },
                    conditions: [
                        {
                            fieldName: 'contenttype',
                            fieldValues: 
                                kind.ids,
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        },
                        {
                            fieldName: 'name',
                            fieldValues: [
                                this.filter.name
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        }
                    ],
                    orderMethods: [
                        {
                            field: "最新上传", 
                            method: "DESC"
                        }
                    ]
                };
                this.listLoading = true;
                getFavoriteResourceListByUser(params).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.resources = res.data.pageInfo.list;
                        this.total = res.data.pageInfo.total;
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.resources = [];
                        this.total = 0;
                    }
                    this.listLoading = false;
                    this.imageSize.width = $('.ecrw-profile-table-wrap').width();
                    this.imageSize.height = 610;
                }).catch(() => {
                    this.listLoading = false;
                    this.total = 0;
                    this.resources = [];
                    
                    this.$message({
                        message: '加载失败!',
                        type: 'error'
                    });
                });
            },
            goCurrentPage(val) {
                this.page = val;
                this.load(this.curKind);
            },
            download(resource) {

                if (localStorage.getItem('frontend-user') == null) {
                    window.EventHub.$emit('request-login');
                    return;
                }
                getResource(resource.contentid).then((res) =>{
                    
                    if (res.data.serverResult.resultCode == "200") {
                        getMyScore().then((res1) => {
                            if (res1.data.serverResult.resultCode == "200") {
                                let score = parseInt(res1.data.responseEntity);
                                let goodPrice = 0;
                                if(resource.goodinfo) goodPrice = resource.goodinfo.goodprice;
                                let myUploadresource = false;
                                if(localStorage.getItem("frontend-user")){
                                    if(JSON.parse(localStorage.getItem("frontend-user")).userId == res.data.responseEntity.creator)
                                        myUploadresource = true;
                                }
                                if(goodPrice == 0 || myUploadresource == true){
                                    if (this.ECRUtil.downloadResource(res.data.responseEntity, this.$message) === false) {
                                        this.$message({
                                            message: '文件不存在。',
                                            type: 'error'
                                        });
                                    }
                                }
                                else{
                                    isAlreadyDownload(resource.contentid).then(function(res2){
                                        if (res1.data.serverResult.resultCode == "200") {
                                            let bAlreadyDownload = parseInt(res2.data.responseEntity);
                                            if(bAlreadyDownload){
                                                if (this.ECRUtil.downloadResource(res.data.responseEntity, this.$message) === false) {
                                                    this.$message({
                                                        message: '文件不存在。',
                                                        type: 'error'
                                                    });
                                                }                                            }
                                            else{
            //                                    let strConfirm = "您下载" + resource.name + "需要扣除" + goodPrice + "个积分，您共有积分" + score + "分。";
                                                let strConfirm = "下载当前资源需要扣除: " + goodPrice + "积分 ，您当前积分余额为:" + score;
                                                this.$confirm(strConfirm, '提示', {
                                                    type: 'warning'
                                                }).then(() => {
                                                    if (this.ECRUtil.downloadResource(res.data.responseEntity, this.$message) === false) {
                                                        this.$message({
                                                            message: '文件不存在。',
                                                            type: 'error'
                                                        });
                                                    }
                                                });
                                            }
                                        } else {
                                            this.$message({
                                                message: res2.data.serverResult.resultMessage,
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
                                    message: res1.data.serverResult.resultMessage,
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
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                    }
                })
                .catch(() => {
                    this.$message({
                        message: '文件不存在。',
                        type: 'error'
                    });
                });
            },
            deleteFromFavorite(index, contentid) {
                if(this.delLoading)
                    return;
                this.$confirm('是否取消收藏？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.delLoading = true;
                    removeFromFavorite(contentid).then((res) =>{
                        if (res.data.serverResult.resultCode == "200") {
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
                            this.load(this.curKind);
                        } else {
                            this.$message({
                                message: res.data.serverResult.resultMessage,
                                type: 'error'
                            });
                        }
                        this.delLoading = false;
                    }).catch(() => {
                        this.delLoading = false;
                        this.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                    });
                });
            },
            selsChange: function(sels) {
                this.sels = sels;
            },
            doBatchRemove() {
                if(this.listLoading)
                    return;
                this.$confirm("是否批量删除选择的资源？", "提示", {
                    type: "warning"
                })
                .then(() => {
                    let params = [];
                    this.sels.forEach(function(resource) {
                        params.push(resource.contentid);
                    });
                    this.listLoading = true;
                    batchRemoveFromFavorite(params)
                        .then(res => {
                            if (res.data.serverResult.resultCode == "200") {
                                this.$message({
                                message: "删除成功！",
                                type: "success"
                                });
                                this.load(this.curKind);
                            } else {
                                this.$message({
                                message: res.data.serverResult.resultMessage,
                                type: "error"
                                });
                                this.listLoading = false;
                            }
                        })
                        .catch(() => {
                            this.listLoading = false;

                            this.$message({
                                message: "操作失败",
                                type: "error"
                            });
                        });
                })
                .catch(() => {});
            },
            getGoodPrice(resource) {
                if (resource.goodinfo) 
                    return resource.goodinfo.goodprice;
                return 0;
            }
        },
        created() {
            ECRUtil.authenticate(this.$router, '/home');
            
            var steps = [
                {
                    title:'首页',
                    url:'/home'
                },
                {
                    title:'我的收藏',
                    url:'/mycenter/goods/favorite'
                }
            ];
            localStorage.setItem('step', JSON.stringify(steps));

            if (this.kinds.length > 0) {
                this.curKind = this.kinds[0];
            }
            this.load(this.curKind);
        }
    }
</script>

<style scoped lang="scss">
    @import '~scss_vars';
    ul {
        height: 34px;
        margin-top: 15px;
    }
    li {
        min-width: 160px;
    }
    li a {
        width: calc(100% - 30px);
        text-align: center;
    }
    .el-table th {
        background: #fafafa;
    }

</style>