<template>
    <section>
        <div class="ecrw-content-hot-title">
            <div class="ecrw-content-subtitle">
                <a href="javascript:;" class="ecrw-content-hot-monweek" :class="{ 'ecrw-content-hot-monweek-sel':estScope=='本周' }" @click="onChangeEstimateScope('本周')">本周</a>
                <a href="javascript:;" class="ecrw-content-hot-monweek" :class="{ 'ecrw-content-hot-monweek-sel':estScope=='本月' }" @click="onChangeEstimateScope('本月')">本月</a>
            </div>
                最热资源
        </div>
        <div class="ecrw-content-hot-det">
            <ul>
                <li class="ecrw-content-hot-li" :class="ECRUtil.resourceType(item.resource.contenttype)" v-for="(item,idx) in items" :key="idx" :data="item">
                    <span class="ecrw-content-hot-time">
                        {{ item.resource.hotvalue }}次
                    </span>
                    <span class="ecrw-hot-num-icon" :class="{ 'ecrw-hot-num-first':item.resource.seq==1, 'ecrw-hot-num-second':item.resource.seq==2, 'ecrw-hot-num-third':item.resource.seq==3 }">{{ item.resource.seq }}</span>
                    <span class="ecrw-hot-num-name">{{ item.resource.subject }} |</span>
                    <a :href="'resource/' + item.resource.contentid" class="ecrw-hot-href" target="_blank">{{ item.resource.name }}</a>
                </li>
            </ul>
        </div>
    </section>
</template>

<script>
    import { getGoodsList } from '../../../api/api';
    import ECRUtil from '../../../common/js/util.js';

    export default {
        props: {
            area: Object,
            contentType: Object,
            subject: Object,
            grade: Object
        },
        data: function () {
            return {
                items: [],
                estScope: '本周',
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
            load() {
                let params = {
                    pagination: {
                        numPerPage:8,
                        pageNo:1
                    },
                    conditions: [
                        {
                            fieldName: 'end_time',
                            fieldValues: [
                                ECRUtil.formatDate.format(new Date())
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        }
                    ],
                    orderMethods: [
                        {
                            field: '最热资源',
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
                if (this.estScope == '本周') {
                    params.conditions.push({
                        fieldName: 'begin_time',
                        fieldValues: [
                            ECRUtil.getWeekDate()
                        ],
                        prepender: null,
                        operator: 'EQUAL',
                        childCondtions: null
                    });
                } else if (this.estScope == '本月') {
                    params.conditions.push({
                        fieldName: 'begin_time',
                        fieldValues: [
                            ECRUtil.getMonthDate()
                        ],
                        prepender: null,
                        operator: 'EQUAL',
                        childCondtions: null
                    });
                }
                getGoodsList(params).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.items = res.data.pageInfo.list;
                        let seq = 0, hotValue = 0;
                        this.items.forEach((item) => {
                            if (seq == 0) {
                                seq = 1;
                                hotValue = item.resource.hotvalue;
                            } else {
                                if (hotValue > item.resource.hotvalue) {
                                    seq = seq + 1;
                                    hotValue = item.resource.hotvalue;
                                }
                            }
                            item.resource.seq = seq;
                        });
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
            onChangeEstimateScope(estScope) {
                this.estScope = estScope;
                this.load();
            }
        },
        created() {
            this.load();
        }
    }
</script>