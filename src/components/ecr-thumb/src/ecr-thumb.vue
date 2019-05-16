<template>
    <section class="ecrw-ready-bk-wrap">
        <div class="ecrw-ready-wrap-det-pic" :class="ECRUtil.getDefaultThumb(item, thumbpath)">
            <a :href="'resource/' + item[itemIdKey]" style="width:100%;height:100%;display:inline-block;" target="_blank">
                <img :src="thumbpath.localpath" v-if="thumbpath.localpath!=''"/>
            </a>
        </div>
        <div class="ecrw-ready-wrap-det-text" style="text-align:center">
            <a :href="'resource/' + item[itemIdKey]" target="_blank">{{ item[itemTitleKey] }}</a>
        </div>
    </section>
</template>

<script>
    import ECRUtil from '../../../common/js/util.js'

    export default {
        props: {
            item:Object,
            itemThumbKey:String,
            itemTitleKey:String,
            itemIdKey:String
        },
        watch: {
        },
        data: function () {
            return {
                ECRUtil:ECRUtil,
                thumbpath:{ localpath:'' }
            }
        },
        computed: {
        },
        methods: {
        }
    }
</script>