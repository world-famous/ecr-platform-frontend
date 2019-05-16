<template>
    <section>
        <div class="ecrw-content-title ecrw-profile-right-title">
            充值明细
        </div>

        <div class="ecrw-profile-det"> 
            <div class="ecrw-profile-user">
                <span> 用户名：</span>
                <span > &nbsp; &nbsp;</span>
                <span class="ecrw-log-name">{{loginname}}</span>
                <span style="margin-left: 80px;"> 姓名：</span>
                <span> &nbsp; &nbsp;</span>
                <span class="ecrw-real-name">{{realname}}</span>
            </div>
            <div class="ecrw-profile-det-intro" style="margin-bottom: 30px">
                <ul>
                    <li class="ecrw-profile-det-li">
                        <span class="">
                                充值日期：
                        </span>
                        <span class="ecrw-profile-time">
                            <el-date-picker type="date" v-model="selectedStartDate" placeholder="选择日期" style="width: 20%;"></el-date-picker> 
                            -   
                            <el-date-picker type="date" v-model="selectedEndDate" placeholder="选择日期" style="width: 20%;"></el-date-picker> 

                            <a href="javascript:;" class="ecrw-profile-enter" @click="search">查询</a>
                        </span>                        
                    </li>

                </ul>
            </div>
            <div class="ecrw-profile-table-wrap">
                <img src="static/images/ecrw-empty-data-resource.png" :style="{ width:(imageSize.width) + 'px', height:(imageSize.height) + 'px' }" v-if="chargelist.length==0">
                <div class="ecrw-profile-det-det">
                    <el-table :data="chargelist" v-loading="listLoading" highlight-current-row @selection-change="selsChange" border v-if="chargelist.length>0">
                        <el-table-column prop="createtime" label="充值日期" align="center">
                        </el-table-column>
                        <el-table-column prop="cost" label="充值金额（元）" align="center">
                        </el-table-column>
                        <el-table-column prop="status" label="充值状态" align="center">
                            <template slot-scope="charge">
                                <span :class="{ 'ecrw-color-red':charge.row.status=='0', 'ecrw-color-green':charge.row.status=='1'}">{{ getChargeStatus(charge.row.status) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="realname" label="操作人" align="center" width="150">
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <el-col :span="24" style="margin-bottom: 50px; margin-top: 30px;">
                <my-pagination @current-change="goCurrentPage" :page="page" :page-size="page_size" :total="total"></my-pagination>
            </el-col>

        </div>
    </section>
</template>

<script>
    import ECRUtil from '../../../common/js/util.js'
    import { getChargeItemList } from '../../../api/api'
    export default {
        data() {
            return {
                chargelist:[],

                page_size: 10,
                total: 0,
                page: 1,

                loginname:'',
                realname:'',
                selectedStartDate: '',
                selectedEndDate:'',           
                listLoading: false,
                imageSize: {
                    width: 0,
                    height: 0
                }
            }
        },
        methods: {
            getChargeStatus(status) {
                if (status == '1') {
                    return '成功';
                } else {
                    return '失败';
                }
            },
            load() {
                this.loginname  = JSON.parse( localStorage.getItem('frontend-user') ).loginName;
                this.realname  = JSON.parse( localStorage.getItem('frontend-user') ).realName;
                
                let params = {
                    pagination:{
                        numPerPage:this.page_size,
                        pageNo:this.page
                    },
                    conditions: [
                        {
                            fieldName: 'userid',
                            fieldValues: [
                                JSON.parse( localStorage.getItem('frontend-user') ).userId
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        },
                    ]
                };
                if (this.selectedStartDate != '' && this.selectedEndDate != '') {
                    if (new Date(this.selectedStartDate) > new Date(this.selectedEndDate)) {
                        this.$message({
                            message: '查询结束时间不得大于开始时间。',
                            type: 'error'
                        });
                        return;
                    }
                }
                if (this.selectedStartDate != '') {
                    params.conditions.push(
                        {
                            fieldName: 'begin_time',
                            fieldValues: [
                                ECRUtil.formatDate.format(new Date(this.selectedStartDate))
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        }
                    );
                }
                if (this.selectedEndDate != '') {
                    params.conditions.push(
                        {
                            fieldName: 'end_time',
                            fieldValues: [
                                ECRUtil.formatDate.format(new Date(this.selectedEndDate))
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        }
                    );
                }
                this.listLoading = true;
                getChargeItemList(params).then((res) =>{
                    if (res.data.serverResult.resultCode == "200") {
                        this.chargelist = res.data.pageInfo.list;
                        this.total = res.data.pageInfo.total;
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.chargelist = [];
                        this.total = 0;
                    }
                    this.listLoading = false;
                    this.imageSize.width = $('.ecrw-profile-table-wrap').width();
                    this.imageSize.height = 610;
                }).catch(() => {
                    this.total = 0;
                    this.chargelist = [];
                    this.listLoading = false;
                    this.$message({
                        message: '加载失败!',
                        type: 'error'
                    });
                });
            },
            goCurrentPage(val) {
                this.page = val;
                this.load();
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            search: function() {
                this.load();
            }
            
        },
        mounted() {
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
        min-width: 160px;
    }
    li a {
        width: calc(100% - 30px);
        text-align: center;
    }
    .el-table th {
        background: #fafafa;
    }
    .ecrw-profile-user {
        margin-top: 30px;
    }
    .ecrw-log-name{
        color: #3394ff;
        font-size: 18px;
        font-style: bold;
    }
    .ecrw-real-name{
        color: #ff94a4;
        font-size: 18px;
        font-style: bold;
    }

</style>