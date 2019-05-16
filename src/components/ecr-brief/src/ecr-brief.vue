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
                    <div :class="[ small?'ecrw-content-esp-pic':'ecrw-ready-wrap-det-pic', items_class[idx].name ]">
                        <a :href="'resource/' + item.resource[itemIdKey]" style="width:100%;height:100%;display:inline-block;" target="_blank">
                            <img :src="items_class[idx].thumbpath.localpath" v-if="items_class[idx].thumbpath.localpath!=''" style="width:100%;height:100%;"/>
                        </a>
                    </div>
                    <div :class="[ small?'ecrw-content-esp-text':'ecrw-ready-wrap-det-text' ]" style="text-align:center;">
                        <a :href="'resource/' + item.resource[itemIdKey]" target="_blank">{{ item.resource[itemTitleKey] }}</a>
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
        data: function () {
            return {
                ECRUtil:ECRUtil,
                thumbpath:{ localpath:'' },
                items_class: [],
            }
        },
        methods: {
            goPage(url) {
                this.$router.push(url);
            }
        },
        watch: {
            "items": function (value) {
                for(var idx in value){
                    var temp_class = {
                        'name': '',
                        'thumbpath': {
                            localpath:''
                        }
                    };
                    temp_class.name = ECRUtil.getDefaultThumb(value[idx].resource, temp_class.thumbpath);
                    this.items_class[idx] = temp_class; 
                }
            }
        }, 
        created() {
        }
    }
</script>