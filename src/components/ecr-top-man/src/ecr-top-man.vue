<template>
    <section>
        <div class="ecrw-content-title ecrw-title-font18">
            达人排名
        </div>
        <div class="ecrw-zhengji-upload-new-content">
            <ul>
                <li class="ecrw-zhengji-upload-new-content-li" v-for="(item,idx) in items" :key="idx" :data="item">
                    <span class="ecrw-zhengji-upload-new-content-li-ready">
                        已完成：
                            <span class="ecrw-color-red">
                                {{item.count}}
                            </span>
                            个征集
                    </span>

                    <span class="ecrw-zhengji-upload-new-content-li-name">
                        <span class="ecrw-zhengji-upload-new-content-li-num" :class="{'ecrw-zhengji-num1':idx == '0' , 'ecrw-zhengji-num2':idx == '1' , 'ecrw-zhengji-num3':idx == '2'}">{{idx + 1}}</span>
                        {{item.username}}
                    </span>
                </li>
            </ul>
        </div>
    </section>
</template>

<script>
    import { getCollectionExportManList } from '../../../api/api';
    import ECRUtil from '../../../common/js/util.js';

    export default {
        props: {
            
        },
        data: function () {
            return {
                items: [],
                ECRUtil:ECRUtil,
                pageNo:8
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
                getCollectionExportManList(params).then((res) => {
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
                });
            }
        },
        created() {
            this.load();
        }
    }
</script>