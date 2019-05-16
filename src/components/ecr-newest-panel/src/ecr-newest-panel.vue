<template>
    <section>
        <div class="ecrw-content-hot-title">
            <a href="javascript:;" class="ecrw-content-hot-change" @click="load">换一批</a>
            最新资源
        </div>
        <div class="ecrw-content-hot-det">
            <ul>
                <li class="ecrw-content-hot-li" :class="ECRUtil.resourceType(item.resource.contenttype)" v-for="(item,idx) in items" :key="idx" :data="item">
                    <span class="ecrw-content-hot-time">
                        {{ ECRUtil.formatDate.format(new Date(item.resource.createtime), 'M-d') }}
                    </span>
                    <a :href="'resource/' + item.resource.contentid" class="ecrw-hot-href" target="_blank" @click="setItems()">{{ item.resource.name }}</a>
                </li>
            </ul>
        </div>
    </section>
</template>

<script>
    import { getGoodsList } from '../../../api/api';
    import ECRUtil from '../../../common/js/util';

    export default {
        props: {
            area: Object,
            contentType: Object,
            subject: Object,
            grade: Object
        },
        data: function () {
            return {
                pageNo: 1,
                items: [],
                ECRUtil:ECRUtil
            }
        },
        watch: {
            area: function(val, oldval) {
                this.load();
            },
            contentType: function(val, oldval) {
                this.load();
            },
            subject: function(val, oldval) {
                this.load();
            },
            grade: function(val, oldval) {
                this.load();
            }
        },
        methods: {
            setItems(){
                let steps = [
                    {
                        title:'首页',
                        url:'/home'
                    }
                ];
                localStorage.setItem('step', JSON.stringify(steps));
            },
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
                    orderMethods: [
                        {
                            field: '最新上传',
                            method: 'DESC'
                        }
                    ]
                };
                if (this.area != null) {
                    params.conditions.push({
                        fieldName: 'areaid',
                        fieldValues: [
                            this.area.areaid
                        ],
                        prepender: null,
                        operator: 'EQUAL',
                        childCondtions: null
                    });
                }
                if (this.contentType != null) {
                    params.conditions.push({
                        fieldName: 'contenttype',
                        fieldValues: [
                            this.contentType.contenttype
                        ],
                        prepender: null,
                        operator: 'EQUAL',
                        childCondtions: null
                    });
                }
                if (this.subject != null) {
                    params.conditions.push({
                        fieldName: 'subjectid',
                        fieldValues: this.subject.dictvalue.split(","),
                        prepender: null,
                        operator: 'EQUAL',
                        childCondtions: null
                    });
                }
                if (this.grade != null) {
                    params.conditions.push({
                        fieldName: 'gradeid',
                        fieldValues: this.grade.dictvalue.split(","),
                        prepender: null,
                        operator: 'EQUAL',
                        childCondtions: null
                    });
                }
                getGoodsList(params).then((res) => {
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
        },
        created() {
            this.load();
            var _this = this;
            setInterval(function() {
                _this.load();
            }, 10 * 60 * 1000); // 10 minutes refresh;
        }
    }
</script>