<template>
    <section>
        <div class="ecrw-content-title ecrw-profile-right-title">
            <div class="ecrm-profile-title-right">
                <span>
                        当前积分： <span class="ecrw-color-green">{{ score }}</span> 分
                </span>                                     
            </div>
            积分明细
        </div>

        <div class="ecrw-profile-det">           
            <div class="ecrw-profile-tab">
                <ul class="clearfix">
                    <li class="ecrw-dao-li" v-for="(kind,idx) in kinds" :key="idx" :data="kind" style="min-width: 10%">
                        <a href="javascript:;" class="ecrw-profile-tab-href" :class="{ 'ecrw-profile-tab-sel':curKind==kind }" @click="selectKind(kind)">{{ kind.name }}</a>
                    </li>
                </ul>            
            </div>

            <div class="ecrw-profile-det-intro" style="margin-bottom: 30px">
                <ul>
                    <li class="ecrw-profile-det-li">
                        <span>
                            积分时间：
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
                <img src="static/images/ecrw-empty-data-resource.png" :style="{ width:(imageSize.width) + 'px', height:(imageSize.height) + 'px' }" v-if="scorelist.length==0">
                <div class="ecrw-profile-det-det">
                    <el-table :data="scorelist" highlight-current-row @selection-change="selsChange" v-loading="listLoading" v-if="scorelist.length>0">
                        <el-table-column prop="operationtype" label="积分操作" align="center">
                        </el-table-column>
                        <el-table-column prop="scoretype" label="积分形式" align="center">
                        </el-table-column>
                        <el-table-column prop="createtime" label="操作时间" align="center"></el-table-column>
                        <el-table-column label="积分变化" align="center" width="200">
                            <template slot-scope="scope">
                                <span :class="{ 'ecrw-color-red': scope.row.incometype == 1, 'ecrw-color-green': scope.row.incometype == 0 }"><span v-if="scope.row.incometype == 0">+</span><span v-if="scope.row.incometype == 1">-</span>{{ scope.row.integralvalue }}</span>
                            </template>
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
    import { getMyScore , getScoreDetail } from '../../../api/api'

    export default {
        data() {
            return {
                kinds: [
                    { id:'', name:'全部' },
                    { id:'1', name:'日常积分' },
                    { id:'2', name:'任务积分' },
                    { id:'3', name:'活动积分' },
                    { id:'4', name:'资源积分' },
                    { id:'5', name:'题库积分' },
                    { id:'6', name:'充值积分' }
                ],
                scorelist:[],
                curKind:null,

                page_size: 10,
                total: 0,
                page: 1,
                score: 0,

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
                            fieldName: 'scoretype',
                            fieldValues: [ this.curKind.id ],
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
                getScoreDetail(params).then((res) =>{
                    if (res.data.serverResult.resultCode == "200") {
                        this.scorelist = res.data.pageInfo.list;
                        this.total  = res.data.pageInfo.total;
                        for (var i=0; i<this.scorelist.length; i++) {
                            this.scorelist[i].operationtype = ECRUtil.getScoreMNGType(res.data.pageInfo.list[i].operationtype);
                            this.scorelist[i].scoretype = ECRUtil.getScoreType(res.data.pageInfo.list[i].scoretype);
                        }
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.scorelist = [];
                        this.total = 0;
                    }
                    this.listLoading = false;
                    this.imageSize.width = $('.ecrw-profile-table-wrap').width();
                    this.imageSize.height = 610;
                }).catch(() => {
                    this.listLoading = false;
                    this.total = 0;
                    this.scorelist = [];
                    
                    this.$message({
                        message: '加载失败!',
                        type: 'error'
                    });
                });
            },
            getScore: function(){
                getMyScore().then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.score = parseInt(res.data.responseEntity);
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.score = '?';
                    }
                }).catch(() => {
                    this.score = '?';
                });
            },
            goCurrentPage(val) {
                this.page = val;
                this.load(this.curKind);
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            search: function() {
                this.load(this.curKind);
            }
        },
        created() {
            ECRUtil.authenticate(this.$router, '/home');
            this.curKind = this.kinds[0];
            this.load(this.curKind);
            this.getScore();
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