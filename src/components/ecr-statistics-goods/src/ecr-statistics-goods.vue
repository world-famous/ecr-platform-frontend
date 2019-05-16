<template>
    <div class="ecrw-banner-right-open">
        <div class="ecrw-banner-right-open-in">
            <ul>
                <li class="ecrw-banner-open-li">
                    <p class="ecrw-banner-open-li-name">资源总数</p>
                    <p class="ecrw-banner-open-li-num">{{ totalCount }}条</p>
                </li>
                <li class="ecrw-banner-open-li">
                    <p class="ecrw-banner-open-li-name">上周新增资源</p>
                    <p class="ecrw-banner-open-li-num">{{ weekCount }}条</p>
                </li>
                <li class="ecrw-banner-open-li">
                    <p class="ecrw-banner-open-li-name">今日新增资源</p>
                    <p class="ecrw-banner-open-li-num ecrw-banner-open-li-new">{{ todayCount }}条</p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            totalCount: Number,
            weekCount: Number,
            todayCount: Number
        },
        watch: {
        },
        computed: {
        },
        methods: {
        },
        created() {
        }
    }
</script>