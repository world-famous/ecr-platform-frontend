<template>
    <div class="ecrw-profile-content">
        <div class="ecrw-content-title ecrw-profile-right-title">
            我的订单
        </div>

        <div class="ecrw-profile-det">
            <div class="ecrw-profile-det-intro">
                <ul>
                    <li class="ecrw-profile-det-li" style="text-align: right;">
                        <span class="ecrw-profile-det">
                            <el-input v-model="filter.searchkey" placeholder="请输入商品名称 / 订单号" style="width: 300px" @keyup.enter="search"></el-input>
                            <a href="javascript:;" class="ecrw-profile-enter" @click="search">查询</a>
                        </span>                        
                    </li>
                </ul>
            </div>
            <div class="ecrw-profile-table-wrap">
                <img src="static/images/ecrw-empty-data-resource.png" :style="{ width:(imageSize.width) + 'px', height:(imageSize.height) + 'px' }" v-if="myOrders.length==0">
                <div class="ecrw-profile-det-det">
                    <el-table :data="myOrders" v-loading="listLoading" ref="basketTable" v-if="myOrders.length>0">
                        <el-table-column prop="orderid" label="订单号" align="center">
                        </el-table-column>
                        <el-table-column prop="orderamount" label="数目" align="center">
                        </el-table-column>
                        <el-table-column prop="integralprice" label="价格" align="center">
                        </el-table-column>
                        <el-table-column prop="ispaid" label="状态" align="center">
                            <template slot-scope="order">
                                <span :class="{ 'ecrw-color-red':order.row.ispaid=='0', 'ecrw-color-green':order.row.ispaid=='1'}">{{ getOrderStatus(order.row.ispaid) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center" width="140">
                            <template slot-scope="order">
                                <div class="ecrw-profile-table-op-button">
                                    <a href="javascript:;" class="ecrw-profile-table-wrap-href" :class="{ 'ecrw-button-disabled':order.row.ispaid=='1' }" @click="pay(order.row)">支付</a>
                                </div>
                                <div class="ecrw-profile-table-op-button">
                                    <a href="javascript:;" class="ecrw-profile-table-wrap-href" @click="showGoods(order.row)">商品信息</a>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-col :span="24" style="margin-bottom: 50px; margin-top: 30px;">
                        <my-pagination @current-change="handleCurrentChange" :page="page" :page-size="page_size" :total="total"></my-pagination>
                    </el-col>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import ECRUtil from '../../../common/js/util.js'
    import { getMyOrderList, payOrder, getGoodsListByOrder } from '../../../api/api'

    export default {
        data() {
            return {
                filter: {
                    searchkey: ''
                },
                myOrders: [],
                goodsOforder: [],
                sels: [],
                total: 0,
                page: 1,
                page_size: 5,
                payLoading: false,
                listLoading: false,
                imageSize: {
                    width: 0,
                    height: 0
                }
            }
        },
        methods: {
            getOrderStatus(ispaid) {
                if (ispaid == '0') return '待支付';
                return '已支付';
            },
            load() {
                let params = {
                    pagination:{
                        numPerPage:this.page_size,
                        pageNo:this.page,
                        calTotal:true
                    },
                    conditions: [
                        {
                            fieldName: 'searchkey',
                            fieldValues: [
                                this.filter.searchkey.trim()
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        }
                    ]
                };
                this.listLoading = true;
                getMyOrderList(params).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.myOrders = res.data.pageInfo.list;
                        this.total = res.data.pageInfo.total;
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.myOrders = [];
                        this.total = 0;
                    }
                    this.listLoading = false;
                    this.imageSize.width = $('.ecrw-profile-table-wrap').width();
                    this.imageSize.height = 610;
                }).catch(() => {
                    this.total = 0;
                    this.myOrders = [];
                    this.listLoading = false;
                    this.$message({
                        message: '加载失败!',
                        type: 'error'
                    });
                });
            },
            handleCurrentChange(val) {
                this.page = val;
                this.load();
            },
            pay(order) {
                if (this.payLoading)
                    return;
                if (order.ispaid == '1') return;
                this.payLoading = true;
                payOrder(order.orderid).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.$message({
                            message: '支付成功',
                            type: 'success'
                        });
                        order.ispaid = 1;
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                    }
                    this.payLoading = false;
                }).catch(() => {
                    this.payLoading = false;
                    this.$message({
                        message: '支付失败',
                        type: 'error'
                    });
                });
            },
            showGoods(order) {
                this.$router.push('/mycenter/ordergoods/' + order.orderid);
            },
            search() {
                this.page = 1;
                this.load();
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

    .ecrw-profile-table-op-button {
        margin-bottom: 10px;
    }
</style>