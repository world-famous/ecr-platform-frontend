// Author : GOD
// Date Start : 2019-2-11 4:30 PM
// Reason : 特供专题 Data Misloading
<template>
    <div class="ecrw-ready-bk-wrap" :class="[ small?'ecrw-content-wrap-det':'ecrw-ready-wrap-det', { 'ecrw-content-esp':small} ]">
        <div class="ecrw-content-title">
            <div class="ecrw-content-subtitle">
                <a href="javascript:;" class="ecrw-subtitle-href ecrw-subtitle-more" @click="goPage(moreUrl)">
                    更多&gt; 
                </a>
            </div>
            {{ title }}
        </div>
        <div class="clearfix" :class="[ small?'ecrw-content-esp-det':'ecrw-ready-wrap-det-list' ]" v-for="(item, idx) in items" :data="item" :key="idx">
            <ul> 
                <li :class="[ small?'ecrw-content-esp-li':'ecrw-ready-wrap-det-li' ]">
                    <div :class="[ small?'ecrw-content-esp-pic':'ecrw-ready-wrap-det-pic', ECRUtil.getDefaultThumb(item.resource, thumbpath) ]">
                        <a :href="'resource/' + item.resource.contentid" style="width:100%;height:100%;display:inline-block;" target="_blank">
                            <img :src="item.resource.thumbnailpath" v-if="(item.resource.thumbnailpath!='')||(item.resource.thumbnailpath!=null)" style="width:100%;height:100%;"/>
                        </a>
                    </div>
                    <div :class="[ small?'ecrw-content-esp-text':'ecrw-ready-wrap-det-text' ]" style="text-align:center;">
                        <a :href="'resource/' + item.resource.contentid" target="_blank">{{ item.resource.name }}</a>
                    </div>
                </li>
            </ul>
        </div>
   </div>
</template>

<script>
    import ECRUtil from '../../../common/js/util.js'

    export default {
        props: {
            items:Array,
            title:String,
            moreUrl:String,
            itemThumbKey:String,
            itemTitleKey:String,
            itemIdKey:String,
            small:{
                type:Boolean,
                default: false,
                required: false
            },
        },
        watch: {
        },
        data: function () {
            return {
                ECRUtil:ECRUtil,
                thumbpath:{ localpath:'' },
            }
        },
        methods: {
            goPage(url) {
                this.$router.push(url);
            }
        },
        created() {

        }
    }
</script>
// Author : GOD
// Date End : 2019-2-11 5:30 PM
// Reason : 特供专题 Data Misloading