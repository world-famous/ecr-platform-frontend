<template>
    <div class="ecrw-profile-content">
        <div class="ecrw-content-title ecrw-profile-right-title">
            我的资源篮
        </div>
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

            <div class="ecrw-profile-table-wrap">
                <div class="ecrw-profile-det-det ecrw-profile-det-upload">
                    <div class="ecrw-profile-table-wrap-title" v-if="myResources.length>0">
                        <span class="ecrw-profile-table-wrap-title-span">
                            小计（<span class="ecrw-color-red">{{ sels.length }}</span> 件商品） <span class="ecrw-color-red">{{ totalAmount }}</span> 积分 
                            <span class="ecrw-profile-table-wrap-title-button">
                                <el-button size="medium" @click="addOrder" :disabled="sels.length==0" :loading="addLoading">提交订单</el-button>
                            </span>
                        </span>
                    </div>
                    <img src="static/images/ecrw-empty-data-resource.png" :style="{ width:(imageSize.width) + 'px', height:(imageSize.height) + 'px' }" v-if="myResources.length==0">
                    <el-table :data="myResources" ref="basketTable" @selection-change="selsChange" v-loading="listLoading" v-if="myResources.length>0">
                        <el-table-column type="selection" width="55" align="center">
                        </el-table-column>
                        <el-table-column label="商品名" align="center">
                            <template slot-scope="resource">
                                <ecr-basket-resource :resource="resource.row"></ecr-basket-resource>
                            </template>
                        </el-table-column>
                        <el-table-column label="购买积分数" align="center" width="100" :formatter="goodPrice">
                        </el-table-column>
                        <el-table-column label="操作" align="center" width="140">
                            <template slot-scope="resource">
                                <div class="ecrw-profile-table-op-button" v-if="resource.row.collectid==null">
                                    <a href="javascript:;" class="ecrw-profile-table-wrap-href" @click="handleMove(resource.$index, resource.row)">移入收藏夹</a>
                                </div>
                                <div class="ecrw-profile-table-op-button">
                                    <a href="javascript:;" class="ecrw-profile-table-wrap-href" @click="handleDel(resource.$index, resource.row)">删除</a>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-col :span="24" style="margin-bottom: 50px; margin-top: 30px;">
                        <my-pagination @current-change="handleCurrentChange" :page="page" :page-size="page_size" :total="total"></my-pagination>
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
    import { getBasketResourceByUser, removeFromBasket, addToFavorite, addToOrder } from '../../../api/api'

    export default {
        data() {
            return {
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
                myResources: [],
                sels: [],
                total: 0,
                page: 1,
                page_size: 5,
                listLoading: false,
                addLoading: false,
                pageSels: [],
                imageSize: {
                    width: 0,
                    height: 0
                },
                isFavoriteSaving: false
            }
        },
        computed: {
            totalAmount() {
                let amount = 0;
                this.sels.forEach(function(resource) {
                    if (resource.goodinfo == null) return;
                    amount += resource.goodinfo.goodprice;
                });

                return amount;
            }
        },
        methods: {
            goodPrice(row, col) {
                if (row.goodinfo == null) return 0;
                return row.goodinfo.goodprice;
            },
            selectKind(kind) {
                this.page = 1;
                this.load(kind);
            },
            load(kind) {
                this.curKind = kind;

                let params = {
                    pagination:{
                        numPerPage:this.page_size,
                        pageNo:this.page,
                        calTotal:true
                    },
                    conditions: [
                        {
                            fieldName: 'contenttype',
                            fieldValues: kind.ids,
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        }
                    ]
                };
                if (ECRUtil.isLoggedIn()) {
                    this.listLoading = true;
                    getBasketResourceByUser(params).then((res) => {
                        if (res.data.serverResult.resultCode == "200") {
                            this.myResources = res.data.pageInfo.list;
                            this.total = res.data.pageInfo.total;

                            // var _this = this;
                            // this.$nextTick(function() {
                            //     _this.selectAll();
                            // });
                        } else {
                            this.$message({
                                message: res.data.serverResult.resultMessage,
                                type: 'error'
                            });
                            this.myResources = [];
                            this.total = 0;
                        }
                        this.listLoading = false;
                        this.imageSize.width = $('.ecrw-profile-table-wrap').width();
                        this.imageSize.height = 610;
                    }).catch(() => {
                        this.listLoading = false;
                        this.total = 0;
                        this.myResources = [];
                        
                        this.$message({
                            message: '加载失败!',
                            type: 'error'
                        });
                    });
                }
            },
            // selectAll() {
            //     var _this = this;
            //     this.myResources.forEach(function(resource) {
            //         if (_this.$refs.basketTable)
            //             _this.$refs.basketTable.toggleRowSelection(resource);
            //     });
            // },
            selsChange: function (sels) {
                this.sels = sels;
            },
            handleCurrentChange(val) {
                this.page = val;
                this.load(this.curKind);
            },
            addOrder() {
                if (this.sels.length == 0) return;
                var ids = this.sels.map(item => item.contentid);
                this.addLoading = true;
                addToOrder(ids).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.$router.push('/mycenter/order/mine');
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                    }
                    this.addLoading = true;
                }).catch(() => {
                    this.addLoading = true;
                    this.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
            },
            handleDel(index, resource) {
                this.$confirm('确定要删除该商品吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    removeFromBasket(resource.contentid).then((res) => {
                        if (res.data.serverResult.resultCode == "200") {
                            this.load(this.curKind);
                            window.EventHub.$emit('add-basket');
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
            handleMove(index, resource) {
                if(this.isFavoriteSaving) return;
                this.isFavoriteSaving = true;
                addToFavorite(resource.contentid).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        resource.isfavourite = 1;
                        resource.collectid = "aaa";
                        resource.collectiontimes = res.data.responseEntity.collectiontimes;
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                    }
                    this.isFavoriteSaving = false;
                }).catch(() => {
                    this.isFavoriteSaving = false;
                    this.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
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
                    title:'我的资源篮',
                    url:'/mycenter/basket'
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
        min-width: 10%;
    }
    li a {
        width: calc(100% - 30px);
        text-align: center;
    }
    .el-table th {
        background: #fafafa;
    }
</style>