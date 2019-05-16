<template>
    <section>
        <div class="ecrw-in">
            <div class="ecrw-ready ">
                <div class="ecrw-dao-wrap">
                    <ecr-breadcrumb :steps="steps"></ecr-breadcrumb>
                    <div class="ecrw-ready-wrap">
                        <div class="ecrw-ready-wrap-left">
                            <ecr-twolabels onelabel="STEM课程" @item-select="onTwolabelSelect"></ecr-twolabels>
                        </div>
                        <div class="ecrw-ready-wrap-right" v-loading="listLoading" style="height: 610px">
                            <div class="ecrw-ready-wrap-det-list" v-if="data.length>0">
                                <ul>
                                    <li class="ecrw-ready-wrap-det-li" v-for="(item, idx) in data" :key="idx" :data="item">
                                        <ecr-thumb 
                                            :item="item.resource"
                                            item-thumb-key="thumb" 
                                            item-title-key="name" 
                                            item-id-key="contentid">
                                        </ecr-thumb>
                                    </li>
                                </ul>
                            </div>
                            <img src="static/images/ecrw-empty-data-resource.png" :style="{ width:(imageSize.width) + 'px', height:(imageSize.height) + 'px' }" v-if="data.length==0">
                        </div>
                        <my-pagination @current-change="onChangePage" :page="page" :page-size="page_size" :total="total"></my-pagination>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import ECRUtil from '../../common/js/util';
    import { getGoodsList } from '../../api/api';

    export default {
        data() {
            return {
                page: 1,
                page_size: 15,
                total: 0,
                data: [],
                steps: [],
                twolabel: '',
                listLoading: false,
                imageSize: {
                    width: 0,
                    height: 0
                }
            }
        },
        methods: {
            // To handle routing back to self route : reset two label
            resetToFirstStatus() {
                this.twolabel = '';
                this.load();
            },
            load() {
                this.steps = [
                    {
                        title:'首页',
                        url:'/home'
                    },
                    {
                        title:'课程导航',
                        url:'/course'
                    },
                    {
                        title:'STEM课程',
                        url:'/course/stem',
                        reset: this.resetToFirstStatus
                    }
                ];
                localStorage.setItem('step', JSON.stringify(this.steps));
                
                let params = {
                    pagination:{
                        numPerPage:this.page_size,
                        pageNo:this.page
                    },
                    conditions: [
                        {
                            fieldName: 'onelabel',
                            fieldValues: [
                                'STEM课程'
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        },
                        {
                            fieldName: 'twolabel',
                            fieldValues: [
                                this.twolabel
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childConditions: null
                        }
                    ]
                };
                this.listLoading = true;
                getGoodsList(params).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.data = res.data.pageInfo.list;
                        this.total = res.data.pageInfo.total;
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.data = [];
                        this.total = 0;
                    }
                    this.listLoading = false;
                    this.imageSize.width = $('.ecrw-ready-wrap-right').width();
                    this.imageSize.height = $('.ecrw-ready-wrap-right').height();
                }).catch(() => {
                    this.listLoading = false;
                    this.total = 0;
                    this.data = [];
                    
                    this.$message({
                        message: '加载失败!',
                        type: 'error'
                    });
                });
            },
            onChangePage(page) {
                this.page = page;
                this.load();
            },
            onTwolabelSelect(item) {
                this.twolabel = item.labelname;
                this.load();
            }
        },
        created() {
            this.load();
        }
    }
</script>

<style scoped lang="scss">
    @import '~scss_vars';

</style>