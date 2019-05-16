<template>
    <div class="ecrw-profile-content">
        <div class="ecrw-content-title ecrw-profile-right-title">我的下载</div>
        <div class="ecrw-profile-det">                        
            <div class="ecrw-profile-tab">
                <ul class="clearfix">
                    <li class="ecrw-dao-li" v-for="(kind,idx) in kinds" :key="idx" :data="kind">
                        <a href="javascript:;" class="ecrw-profile-tab-href" :class="{ 'ecrw-profile-tab-sel':curKind==kind }" @click="selectKind(kind)" >
                            {{ kind.name }}
                        </a>
                    </li>
                </ul>
            </div>

            <!-- 循环遍历这个就可以-->

            <div class="ecrw-profile-table-wrap">
                <div class="ecrw-profile-det-det ecrw-profile-det-upload">
                    <img src="static/images/ecrw-empty-data-resource.png" :style="{ width:(imageSize.width) + 'px', height:(imageSize.height) + 'px' }" v-if="resources.length==0">
                    <el-table :data="resources" v-loading="listLoading" v-if="resources.length>0">
                        <el-table-column label="商品名" align="center">
                            <template slot-scope="resource">
                                <ecr-basket-resource :resource="resource.row"></ecr-basket-resource>
                            </template>
                        </el-table-column>
                        <el-table-column prop="downTime" label="下载时间" align="center" width="170"></el-table-column>
                        <el-table-column label="积分" align="center" width="130">
                            <template slot-scope="resource">
                                <span class="ecrw-color-red">{{ getGoodPrice(resource.row) }}</span>分
                            </template>
                        </el-table-column>     
                    </el-table>
                    <el-col :span="24" style="margin-bottom: 50px; margin-top: 30px;">
                        <my-pagination @current-change="goCurrentPage" :page="page" :page-size="page_size" :total="total"></my-pagination>
                    </el-col>
                </div>
            </div>       
        </div>
    </div>
</template>

<script>
    import ECRUtil from '../../../common/js/util.js'
    import { getDownloadResourceByUser, } from '../../../api/api'

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
                curKind:0,
                total: 0,
                page:1,
                page_size: 5,
                resources:[],
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
                            fieldName: 'contenttype',
                            fieldValues: kind.ids,
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        }
                    ]
                };
                this.listLoading = true;
                getDownloadResourceByUser(params).then((res) => {
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
            getGoodPrice(resource) {
                if (resource.goodinfo) return resource.goodinfo.goodprice;
                return 0;
            },
            goCurrentPage(val) {
                this.page = val;
                this.load(this.curKind);
            },
        },
        created() {
            ECRUtil.authenticate(this.$router, '/home');
            
            var steps = [
                {
                    title:'首页',
                    url:'/home'
                },
                {
                    title:'我的下载',
                    url:'/mycenter/goods/download'
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
    .ecrm-color-red {
        color: #ff3333;
    }
</style>