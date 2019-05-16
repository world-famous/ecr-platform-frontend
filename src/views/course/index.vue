<template>
    <section>
        <div class="ecrw-in">
            <div class="ecrw-ready ">
                <!-- wrap -->
                <div class="ecrw-dao-wrap">
                    <ecr-breadcrumb :steps="steps"></ecr-breadcrumb>
                    <div class="ecrw-ready-wrap">
                        <ecr-brief
                            v-for="(dt,idx) in data"
                            :key="idx"
                            :data="dt"
                            :items="dt.items" 
                            :title="dt.title" 
                            :more-url="dt.url" 
                            item-thumb-key="thumb" 
                            item-title-key="name"
                            item-id-key="contentid">
                        </ecr-brief>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import { getGoodsList } from '../../api/api'

    export default {
        data() {
            return {
                data: [
                    {
                        title:'微视频课程',
                        url:'/course/video',
                        items:[]
                    },
                    {
                        title:'培生英语课程',
                        url:'/course/eng',
                        items:[]
                    },
                    {
                        title:'STEM课程',
                        url:'/course/stem',
                        items:[]
                    },
                    {
                        title:'美育课程',
                        url:'/course/moral',
                        items:[]
                    }
                ],
                steps: [],
            }
        },
        methods: {
            load() {
                this.steps = [
                    {
                        title:'首页',
                        url:'/home'
                    },
                    {
                        title:'课程导航',
                        url:'/course'
                    }
                ];
                localStorage.setItem('step', JSON.stringify(this.steps));
                
                this.fillData(0, '微视频课程');
                this.fillData(1, '培生英语课程');
                this.fillData(2, 'STEM课程');
                this.fillData(3, '美育课程');
            },
            fillData(idx, onelabel) {
                let params = {
                    pagination:{
                        numPerPage:5,
                        pageNo:1
                    },
                    conditions: [
                        {
                            fieldName: 'onelabel',
                            fieldValues: [
                                onelabel
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        }
                    ]
                };
                getGoodsList(params).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.data[idx].items = res.data.pageInfo.list;
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.data[idx].items = [];
                    }
                }).catch((res) => {
                    this.data[idx].items = [];
                    
                    this.$message({
                        message: '加载失败!',
                        type: 'error'
                    });
                });
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