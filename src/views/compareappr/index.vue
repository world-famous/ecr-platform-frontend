<template>
    <section>
        <div class="ecrw-in">
            <div class="ecrw-ready">
                <div class="ecrw-dao-tab">
                    <ul class="clearfix">
                        <li class="ecrw-dao-li">
                            <a href="javascript:;" class="ecrw-dao-href" :class="{'ecrw-dao-sel':type==0}" @click="selectType(0)">最新活动</a>
                        </li>
                        <li class="ecrw-dao-li">
                            <a href="javascript:;" class="ecrw-dao-href" :class="{'ecrw-dao-sel':type==1}" @click="selectType(1)">历史活动</a>
                        </li>
                    </ul>
                </div>
                <div class="ecrw-content-zhengji" v-loading="listLoading">
                    <div class="ecrw-big-in  clearfix">
                        <div  v-for="(item, idx) in activities" :key="idx" :data="item">
                            <div class="ecrw-big-wrap">
                                <ul>
                                    <li class="ecrw-big-pic">
                                        <span class="ecrw-big-progress" v-if="item.status == 1">进行中</span>
                                        <span class="ecrw-big-progress" v-if="item.status == 0">已结束</span>
                                        <a href="javascript:;" @click="goPage('/compareappr/' + item.activityid)">
                                            <img :src="ECO_MEDIA_PATH + item.logopath">
                                        </a>
                                    </li>
                                    <li class="ecrw-big-title">
                                        {{item.activityname}}
                                    </li>
                                    <li class="ecrw-big-desc">
                                        参与人数：{{item.joinercount}}人
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <img src="static/images/ecrw-empty-data-resource.png" :style="{ width:(imageSize.width) + 'px', height:(imageSize.height) + 'px' }" v-if="activities.length==0">
                    <el-col :span="24" style="margin-bottom: 50px; margin-top: 30px;">
                        <my-pagination @current-change="handleCurrentChange" :page="page" :page-size="page_size" :total="total"></my-pagination>
                    </el-col>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import { getRecentEstimateList, getEstimateActivityList } from '../../api/api'

    export default {
        data() {
            return {
                ECO_MEDIA_PATH: ECO_MEDIA_PATH,
                type:0,
                page: 1,
                page_size: 6,
                total: 0,
                activities: [],
                listLoading: false,
                imageSize: {
                    width: 0,
                    height: 0
                }
            }
        },
        methods: {
            selectType(type) {
                this.page = 1;
                this.type = type;
                this.load(type);
            },
            load(type) {
                this.type = type;
                this.getEstimateActivity(this.type);
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            handleCurrentChange(page) {
                this.page = page;
                this.load(this.type);
            },
            // Author : GOD, 2019-2-12 Bug ID: #681
            getEstimateActivity(type) {
                let params = {
                    pagination:{
                        numPerPage:this.page_size,
                        pageNo:this.page,
                        calTotal:true
                    },
                    conditions: []
                };
                this.listLoading = true;
                if (type == 0) {
                    this.total = 0;
                    getRecentEstimateList(params).then((res) => {
                        if (res.data.serverResult.resultCode == "200") {
                            this.total = res.data.pageInfo.total;
                            this.activities = res.data.pageInfo.list;
                            this.listLoading = false;
                        } else {
                            this.$message({
                                message: res.data.serverResult.resultMessage,
                                type: 'error'
                            });
                            this.total = 0;
                            this.activities = [];
                            this.listLoading = false;
                        }
                        this.imageSize.width = $('.ecrw-content-zhengji').width();
                        this.imageSize.height = 610;
                    }).catch(() => {
                        this.total = 0;
                        this.activities = [];

                        this.$message({
                            message: '加载失败!',
                            type: 'error'
                        });
                        this.listLoading = false;
                    });
                } else if (type == 1) {
                    this.total = 0;
                    params.conditions.push({
                            fieldName: 'status',
                            fieldValues: ["0"],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                    });
                    getEstimateActivityList(params).then((res) => {
                        if (res.data.serverResult.resultCode == "200") {
                            this.total = res.data.pageInfo.total;
                            this.activities = res.data.pageInfo.list;
                            this.listLoading = false;
                        } else {
                            this.$message({
                                message: res.data.serverResult.resultMessage,
                                type: 'error'
                            });
                            this.total = 0;
                            this.activities = [];
                            this.listLoading = false;
                        }
                        this.imageSize.width = $('.ecrw-content-zhengji').width();
                        this.imageSize.height = 610;
                    }).catch(() => {
                        this.total = 0;
                        this.activities = [];

                        this.$message({
                            message: '加载失败!',
                            type: 'error'
                        });
                        this.listLoading = false;
                    });
                }
            },
            // Author : GOD, 2019-2-12 Bug ID: #681
            goPage(url) {
                this.$router.push(url);
            }
        },
        created() {
            var type = parseInt(this.$route.params.type);
            if (type) {
                this.load(type);
            } else {
                this.load(0);
            }
        }
    }
</script>

<style scoped lang="scss">
    @import '~scss_vars';

</style>