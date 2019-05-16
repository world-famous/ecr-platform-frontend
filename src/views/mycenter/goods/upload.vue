<template>
    <div class="ecrw-profile-content">
        <div class="ecrw-content-title ecrw-profile-right-title">我的上传</div>
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
                    <div v-if="resources.length>0">
                        <div class="ecrw-profile-table-wrap-title">
                            个人资源统计
                        </div>
                        <table class="ecrw-profile-det-table" style="margin-bottom: 30px;">
                            <tr>
                                <th>被下载</th>
                                <th>被收藏</th>
                                <th>被点赞</th>
                                <th>被浏览</th>
                            </tr>
                            <tr>
                                <td>{{statistics.totaldowntimes}}</td>
                                <td>{{statistics.totalcolletiontimes}}</td>
                                <td>{{statistics.totalclicktimes}}</td>
                                <td>{{statistics.totalviewtimes}}</td>
                            </tr>
                        </table>
                    </div>
                    <img src="static/images/ecrw-empty-data-resource.png" :style="{ width:(imageSize.width) + 'px', height:(imageSize.height) + 'px' }" v-if="resources.length==0">
                    <el-table :data="resources" v-loading="listLoading" v-if="resources.length>0">
                        <el-table-column label="商品名" align="center">
                            <template slot-scope="resource">
                                <ecr-myupload-resource :resource="resource.row"></ecr-myupload-resource>
                            </template>
                        </el-table-column>
                        <el-table-column prop="lastupdatetime" label="上传时间" align="center" width="150"></el-table-column>
                        <el-table-column label="审核状态" align="center" width="100">
                            <template slot-scope="resource">
                                <span :class="{ 'ecrm-color-red':resource.row.status=='已驳回', 'ecrm-color-green':resource.row.status=='已审核', 'ecrm-color-blue':resource.row.status=='待审核' ,}">{{ resource.row.status }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="积分" align="center" width="100">
                            <template slot-scope="resource">
                                <span class="ecrw-color-red">{{ getGoodPrice(resource.row) }}</span>分
                            </template>
                        </el-table-column>     
                        <el-table-column label="操作" align="center" width="100">
                            <template slot-scope="resource">
                                <span class="ecrw-center">
                                    <a href="javascript:;" @click="goPage('/resourcemodify/' + resource.row.contentid)" class="ecrw-profile-enter" v-if=" resource.row.status == '待审核' || resource.row.status == '已驳回' ">修改</a>
                                </span>
                                <span class="ecrw-center">
                                    <a href="javascript:;" class="ecrw-profile-enter" v-if="resource.row.status == '已审核' " @click="onDownload(resource.row)">下载</a>
                                </span>
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
    import { getUploadResourceByUser, getResourceInfo, downloadResource, getResource} from '../../../api/api'

    export default {
        data() {
            return {
                ECRUtil:ECRUtil,
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
                statistics: {
                    totalviewtimes:0,
                    totalcolletiontimes:0,
                    totaldowntimes:0,
                    totalclicktimes:0
                },
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
            loadStatistics() {
                getResourceInfo().then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        if (res.data.responseEntity != null) {
                            this.statistics.totalviewtimes = res.data.responseEntity.viewtimes;
                            this.statistics.totalcolletiontimes = res.data.responseEntity.collectiontimes;
                            this.statistics.totaldowntimes = res.data.responseEntity.downtimes;
                            this.statistics.totalclicktimes = res.data.responseEntity.votetimes;
                        }
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                    }
                });
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
                    ],
                    orderMethods: [
                        {
                            field: '最新上传',
                            method: 'DESC'
                        }
                    ]
                };
                this.listLoading = true;
                getUploadResourceByUser(params).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.resources = res.data.pageInfo.list;
                        for (var i = 0; i < this.resources.length; i++) {
                            if(this.resources[i].status == "1") {
                                this.resources[i].status = "待审核";
                            }
                            if(this.resources[i].status == "3") {
                                this.resources[i].status = "已审核";
                            }
                            if(this.resources[i].status == "4") {
                                this.resources[i].status = "已驳回";
                            }
                        }
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
            getGoodPrice(resource) {
                if (resource.goodinfo) return resource.goodinfo.goodprice;
                return 0;
            },
            onDownload(resource) {
                if (localStorage.getItem('frontend-user') == null) {
                    window.EventHub.$emit('request-login');
                    return;
                }
                getResource(resource.contentid).then((res) =>{
                    if (res.data.serverResult.resultCode == "200") {
                        if (this.ECRUtil.downloadResource(res.data.responseEntity, this.$message) == false) {
                            this.$message({
                                message: '文件不存在。',
                                type: 'error'
                            });
                        }
                    }
                })
                .catch(() => {
                    this.$message({
                        message: '文件不存在。',
                        type: 'error'
                    });
                });
            },
            goPage(url) {
                this.$router.push(url);
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
                    title:'我的上传',
                    url:'/mycenter/goods/upload'
                }
            ];
            localStorage.setItem('step', JSON.stringify(steps));

            if (this.kinds.length > 0) {
                this.curKind = this.kinds[0];
            }
            this.load(this.curKind);
            this.loadStatistics();
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
    .ecrm-color-red {
        color: #ff3333;
    }
    .ecrm-color-green {
        color: #00aa00;
    }
    .ecrm-color-blue {
        color: #0000aa;
    }
    .ecrm-color-jgreen {
        color: #5affaa;
    }

</style>