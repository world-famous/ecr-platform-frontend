<template>
    <section>
        <div class="ecrw-content-title ecrw-title-font18">
            <a href="javascript:;" class="ecrw-zhengji-upload-new-change" @click="load">换一批</a>
            最新征集
        </div>
        <div class="ecrw-content-hot-det">
            <ul>
                <li class="ecrw-zhengji-upload-new-content-li" v-for="(item,idx) in items" :key="idx" :data="item">
                    <a href="javascript:;" class="ecrw-zhengji-upload-new-content-canyu" @click="goPage('/collection/upload/' + item.activityid)">参与</a>
                    <a href="javascript:;" class="ecrw-zhengji-upload-new-content-href" @click="goPage('/collection/goods/' + item.activityid)" :class="ECRUtil.resourceType(item.contenttype)">{{ item.activityname }}</a>
                </li>
            </ul>
        </div>
    </section>
</template>

<script>
    import { getRecentCollectionList } from '../../../api/api';
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
        methods: {
            load() {
                if (this.items.length < 6 || this.pageNo == 10) {
                    this.pageNo = 1;
                } else {
                    this.pageNo += 1;
                }
                let params = {
                    pagination: {
                        numPerPage:6,
                        pageNo:this.pageNo
                    }
                };
                getRecentCollectionList(params).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.items = res.data.pageInfo.list;
                        if ((this.pageNo !=1)&&(this.items.length < 6 || this.pageNo == 10)) {
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