<template>
    <section v-if="contenttype!=''"> 
        <div class="ecrw-content-hot-title">
            <a href="javascript:;" class="ecrw-content-hot-change" @click="load">换一批</a>
            {{contenttype}}
        </div>
        <div class="ecrw-content-hot-det">
            <ul>
                <li class="ecrw-content-hot-li" :class="ECRUtil.resourceType(item.contenttype)" v-for="(item,idx) in items" :key="idx" :data="item">
                    <span class="ecrw-content-hot-time">
                        {{ ECRUtil.formatDate.format(new Date(item.createtime), 'M-d') }}
                    </span>
                    <a :href="'resource/' + item.contentid" style="padding-left: 25px;" class="ecrw-hot-href" target="_blank">{{ item.name }}</a>
                </li>
            </ul>
        </div>
    </section>
</template>

<script>
    import { getRewardResourceList } from '../../../api/api';
    import ECRUtil from '../../../common/js/util.js';

    export default {
        props: {
            contenttype: String,
            resourcetype: String
        },
        data: function () {
            return {
                items: [],
                ECRUtil:ECRUtil,
                pageNo:1
            }
        },
        watch: {
            contenttype: function(val, oldval) {
                if (this.contenttype != null || this.contenttype != ''){
                    this.load();
                }
            }
        },
        methods: {
            load() {
                if (this.items.length < 8 || this.pageNo == 10) {
                    this.pageNo = 1;
                } else {
                    this.pageNo += 1;
                }
                let params = {
                    pagination: {
                        numPerPage:8,
                        pageNo:this.pageNo
                    },
                    conditions: [
                        {
                            fieldName: 'contenttype',
                            fieldValues: [
                                this.resourcetype
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        },
                        {
                            fieldName: 'isgoods',
                            fieldValues: [
                                '1'
                            ],
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

                getRewardResourceList(params).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.items = res.data.pageInfo.list;
                        if ((this.pageNo !=1)&&(this.items.length < 8 || this.pageNo == 10)) {
                            this.$message({
                                message: '已是全部资源',
                                type: 'warning'
                            });        
                        }
                        if (this.items.length == 0 && this.pageNo > 1) this.load();
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.items = [];
                    }
                }).catch(() => {
                    this.items = [];
                });
            }
        }
    }
</script>