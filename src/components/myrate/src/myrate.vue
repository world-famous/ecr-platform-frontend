<template>
    <span class="ecrw-list-star-wrap">
        <a href="javascript:;" class="ecrw-list-star"></a>
        <a href="javascript:;" class="ecrw-list-star"></a>
        <a href="javascript:;" class="ecrw-list-star"></a>
        <a href="javascript:;" class="ecrw-list-star"></a>
        <a href="javascript:;" class="ecrw-list-star"></a>

        <span class="ecrw-list-star-wrap ecrw-list-star-inner" :style="{ width: width + '%' }">
            <a href="javascript:;" class="ecrw-list-star ecrw-list-star-sel"></a>
            <a href="javascript:;" class="ecrw-list-star ecrw-list-star-sel"></a>
            <a href="javascript:;" class="ecrw-list-star ecrw-list-star-sel"></a>
            <a href="javascript:;" class="ecrw-list-star ecrw-list-star-sel"></a>
            <a href="javascript:;" class="ecrw-list-star ecrw-list-star-sel"></a>
        </span>
    </span>
</template>

<script>
    export default {
        props: {
            rate:{
                type:Number,
                default:0,
                required:true
            }
        },
        data: function () {
            return {
            }
        },
        computed: {
            width() {
                return this.rate * 20;
            }
        },
        methods: {
        }
    }
</script>