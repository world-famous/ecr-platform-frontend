<template>
    <section>
        <div class="ecrw-in">
            <div class="ecrw-ready ">
                <!-- wrap -->
                <div class="ecrw-dao-wrap">
                    <ecr-breadcrumb :steps="steps"></ecr-breadcrumb>
                    <div class="ecrw-ready-wrap">
                        <div class="ecrw-ready-wrap-left">
                            <ecr-course ref="courseTree" @item-select="onCourseSelect" @item-deselect="onCourseDeselect"></ecr-course>
                        </div>
                        <div class="ecrw-ready-wrap-right">
                            <ecr-brief
                                v-for="(dt,idx) in threeLabelList"
                                :key="idx"
                                :data="dt"
                                :items="itemList[idx].resources"
                                :title="dt.labelname"
                                :more-url="itemList[idx].url"
                                item-thumb-key="thumb"
                                item-title-key="name"
                                item-id-key="contentid">
                            </ecr-brief>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import { getGoodsList, getThreeLabelList } from '../../api/api'

    export default {
        data() {
            return {
                package: null,
                subject: null,
                threeLabelList:[],
                labelData:[],
                itemList:[],
                urlList:[],
                onelabel:'',
                twolabel:'',
                threelabel:'',

                steps: [
                    {
                        title:'首页',
                        url:'#/home'
                    }
                ]
            }
        },
        watch: {
            steps: function(val, oldval) {
                localStorage.setItem('step', JSON.stringify(this.steps));
//                sessionStorage.setItem('step', JSON.stringify(this.steps));
            }
        },
        methods: {
            fillData() {
                this.itemList = [];
                for (var i=0; i<this.threeLabelList.length; i++) {
                    this.itemList.push({ resources:[], url:'' });
                    this.fillDataForLabel(i);
                }
            },
            fillDataForLabel(index) {
                this.itemList[index].url = '#' + this.$router.history.current.path + '/' + this.threeLabelList[index].labelname + '/detail';
                let params = {
                    pagination:{
                        numPerPage:5,
                        pageNo:1
                    },
                    conditions: [
                        {
                            fieldName: 'onelabel',
                            fieldValues: [
                                sessionStorage.getItem('onelabel')
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        },
                        {
                            fieldName: 'twolabel',
                            fieldValues: [
                                sessionStorage.getItem('twolabel')
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childConditions: null
                        },
                        {
                            fieldName: 'threelabel',
                            fieldValues: [
                                this.threeLabelList[index].labelname
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childConditions: null
                        }
                    ]
                };
                if (this.$refs.courseTree != null && 
                    this.$refs.courseTree.selectedItem != null) {
                    params.conditions.push({
                            fieldName: 'catalogids',
                            fieldValues: this.$refs.courseTree.selectedItem.catalogids,
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        });
                }
                getGoodsList(params).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.itemList[index].resources = res.data.pageInfo.list;
                    } else {
                        this.itemList[index].resources = [];
                    }
                });
            },
            onCourseSelect(item) {
                this.fillData();
            },
            onCourseDeselect(item) {
                this.fillData();
            },
            loadlist() {
                this.steps.push({
                    title:sessionStorage.getItem('onelabel'),
                    url:'#/package/' + this.$router.history.current.params.oneLabel
                });
                this.steps.push({
                    title:sessionStorage.getItem('twolabel'),
                    url:'#/package/' + this.$router.history.current.params.oneLabel + '/' + this.$router.history.current.params.twoLabel
                });
                let param = { "parentlabelid": this.$router.history.current.params.twoLabel };
                getThreeLabelList(param).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.threeLabelList = res.data.pageInfo.list;
                        this.fillData();

                    }
                });
            }
        },
        created() {
        },
        mounted() {
            this.loadlist();
        }
    }
</script>

<style scoped lang="scss">
    @import '~scss_vars';

</style>