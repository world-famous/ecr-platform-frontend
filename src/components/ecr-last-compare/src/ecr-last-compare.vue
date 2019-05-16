<template>
    <section>
        <div class="ecrw-content-hot-title">
            <a href="javascript:;" class="ecrw-content-hot-change" @click="load">换一批</a>
            最新评比
        </div>
        <div class="ecrw-content-hot-det">
            <ul>
                <li class="ecrw-content-hot-li" :class="ECRUtil.resourceType(item.contenttype)" v-for="(item,idx) in items" :key="idx" :data="item">
                    <span class="ecrw-content-hot-time">
                        {{ ECRUtil.formatDate.format(new Date(item.createtime), 'M-d') }}
                    </span>
                    <a href="javascript:;" @click="goPage('/compareappr/' + item.activityid)">{{ item.activityname }}</a>
                </li>
            </ul>
        </div>
    </section>
</template>

<script>
    import { getRecentEstimateList } from '../../../api/api';
    import ECRUtil from '../../../common/js/util.js';

    export default {
        props: {
            
        },
        data: function () {
            return {
                items: [],
                ECRUtil:ECRUtil,
                pageNo:1
            }
        },
        watch: {
            
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
                    conditions: [],
                    orderMethods: []
                };
                getRecentEstimateList(params).then((res) => {
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
            },
            goPage(url) {
                this.$router.push(url);
            }
        },
        created() {
            this.load();
        }
    }
</script>