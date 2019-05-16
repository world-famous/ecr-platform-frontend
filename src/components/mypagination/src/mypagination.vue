<template>
    <div class="ecrw-ready-page" v-if="total > 0">
        <a href="javascript:;" class="ecrw-ready-page-href" @click="toPage(0)">首页</a>
        <a href="javascript:;" class="ecrw-ready-page-href" @click="toPage(curPg-1)">上一页</a>
        <a href="javascript:;" class="ecrw-ready-page-href" v-if="Math.floor((curPg-1)/5) * 5 + 1 > 5" @click="toPage(Math.floor((curPg-1)/5) * 5)">...</a>
        <a href="javascript:;" v-for="i in pages" @click="toPage(i)" class="ecrw-ready-page-href" :class="{'ecrw-ready-page-sel':i==curPg}" v-bind:data="i" v-bind:key="i">{{ i }}</a>
        <a href="javascript:;" class="ecrw-ready-page-href" v-if="Math.floor((curPg-1)/5) * 5 + 5 < lastPg" @click="toPage(Math.floor((curPg-1)/5) * 5 + 6)">...</a>
        <a href="javascript:;" class="ecrw-ready-page-href" @click="toPage(curPg+1)">下一页</a>
        <a href="javascript:;" class="ecrw-ready-page-href" @click="toPage(lastPg)">末页</a>
        <span class="ecrw-ready-page-text">
            共<span>{{ total }}</span>条
        </span>
        <span class="ecrw-ready-page-form">
            到<input type="text" class="ecrw-ready-page-wenben" v-model="toPg"/>页
        </span>
        <a href="javascript:;" class="ecrw-ready-page-enter" @click="toPage(toPg)">确定</a>
    </div>
</template>

<script>
    export default {
        props: {
            page: {
                type: Number,
                default: 1,
                required: false
            },
            total: {
                type: Number,
                default: 0,
                required: true
            },
            pageSize: {
                type: Number,
                default: 10,
                required: false
            }
        },
        watch: {
            curPg: function (val, oldVal) {
                this.toPg = val;
            },
            page: function(val, oldVal) {
                this.curPg = val;
            }
        },
        data: function () {
            return {
                curPg: 1,
                toPg: 1
            }
        },
        computed: {
            lastPg() {
                if (this.pageSize == 0) return 0;
                return Math.ceil(this.total / this.pageSize);
            },
            pages: function() {
                var startPg = Math.floor((this.curPg-1)/5) * 5 + 1;
                var endPg = Math.min(this.lastPg, Math.floor((this.curPg-1)/5) * 5 + 5);
                var pageNums = [];
                for (var i=startPg; i<=endPg; i++) {
                    pageNums.push(i);
                }
                return pageNums;
            }
        },
        methods: {
            toPage: function(pg) {
                if (pg < 1) pg = 1;
                if (pg > this.lastPg) pg = this.lastPg;
                this.curPg = pg;

                this.$emit('current-change', parseInt(this.curPg));
            }
        }
    }
</script>