<template>
    <div class="ecrw-profile-content">
        <div class="ecrw-content-title ecrw-profile-right-title">
            订单的商品
        </div>
        <div class="ecrw-profile-det">
            <!-- <div class="ecrw-profile-tab">
                <ul class="clearfix">
                    <li class="ecrw-dao-li" v-for="(kind,idx) in kinds" :key="idx" :data="kind" style="min-width: 10%">
                        <a href="javascript:;" class="ecrw-profile-tab-href" :class="{ 'ecrw-profile-tab-sel':curKind==kind }" @click="selectKind(kind)">
                            {{ kind.name }}
                        </a>
                    </li>
                </ul>
            </div> -->
           
            <!-- 循环遍历这个就可以-->

            <div class="ecrw-profile-table-wrap">
                <div class="ecrw-profile-det-det ecrw-profile-det-upload">
                    <!-- <div class="ecrw-profile-table-wrap-title">
                        <span class="ecrw-profile-table-wrap-title-span">
                            小计（<span class="ecrw-color-red">{{ sels.length }}</span> 件商品） <span class="ecrw-color-red">{{ totalAmount }}</span> 积分 
                            <span class="ecrw-profile-table-wrap-title-button">
                                <a href="javascript:;" class="ecrw-profile-table-wrap-href" :class="{ 'ecrw-button-disabled':sels.length==0 }" @click="addOrder">提交订单</a>
                            </span>
                        </span>
                    </div> -->
                    <el-table :data="myResources" ref="basketTable">
                        <el-table-column label="商品名" align="center">
                            <template slot-scope="resource">
                                <ecr-basket-resource :resource="resource.row.resource"></ecr-basket-resource>
                            </template>
                        </el-table-column>
                        <el-table-column label="购买积分数" align="center" width="100" :formatter="goodPrice">
                        </el-table-column>
                        <el-table-column label="操作" align="center" width="140">
                            <template slot-scope="resource">
                                <div class="ecrw-profile-table-op-button">
                                    <a href="javascript:;" class="ecrw-profile-table-wrap-href" @click="download(resource.row.resource)">下载</a>
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
    import { getGoodsListByOrder , removeFromBasket, addToFavorite, addToOrder } from '../../../api/api'

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
                page_size: 5
            }
        },
        computed: {
        },
        methods: {
            goodPrice(row, col) {
                if (row.goodprice == null) return 0;
                return row.goodprice;
            },
            selectKind(kind) {
                this.page = 1;
                this.load(kind);
            },
            load() {
                // this.curKind = kind;

                let params = {
                    pagination:{
                        numPerPage:this.page_size,
                        pageNo:this.page
                    },
                    conditions: [
                        {
                            fieldName: 'orderid',
                            fieldValues: [this.$route.params.orderid],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        }
                    ]
                };
                if (ECRUtil.isLoggedIn()) {
                    getGoodsListByOrder(params).then((res) => {
                        if (res.data.serverResult.resultCode == "200") {
                            this.myResources = res.data.pageInfo.list;
                        } else {
                            this.$message({
                                message: res.data.serverResult.resultMessage,
                                type: 'error'
                            });
                            this.myResources = [];
                        }
                    }).catch(() => {
                        this.$message({
                            message: '支付失败',
                            type: 'error'
                        });
                    });
                }
            },
            handleCurrentChange(val) {
                this.page = val;
                this.load(this.curKind);
            },
            download(resource) {
                if (resource.contentid == '') return;
                
                if (localStorage.getItem('frontend-user') == null) {
                    window.EventHub.$emit('request-login');
                    return;
                }

                if (ECRUtil.downloadResource(resource, this.$message) === false) {
                    this.$message({
                        message: '文件不存在。',
                        type: 'error'
                    });
                }
            }
        },
        created() {
            ECRUtil.authenticate(this.$router, '/home');

            this.load();
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