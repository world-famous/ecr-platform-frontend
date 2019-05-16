<template>
    <div class="ecrw-school-subtitle">
        <!-- <a href="javascript:;" 
            class="ecrw-subtitle-href"
            v-for="idx in size"
            :key="idx"
            :data="idx"
            :class="{ 'ecrw-subtitle-sel':items[idx-1]==currentItem }"
            @click="onItemClick(idx-1, 0)">
            {{ items[idx-1][itemTitleKey] }}
        </a> -->

        <ul class="clearfix">
            <li class="ecrw-ready-resource-li"
                v-for="idx in size" 
                :class="{ 'ecrw-ready-resource-li-sel':currentItem==items[idx-1] }"
                :key="idx"
                :data="idx">
                <a href="javascript:;" @click="onItemClick(idx-1, 0)">{{ (items[idx-1].orgname.length<14 ? items[idx-1].orgname:items[idx-1].orgname.substr(0, 12)+'..') + ' ( ' + items[idx-1].goodscount + ' 份 )'}}</a>
            </li>

            <li class="ecrw-ready-resource-li" v-if="otherSize>0">
                <a href="javascript:;" @click="showAllData"> 更多> </a>
            </li>
            
        </ul>

        
        <div class="ecrw-list-pos-addr" v-if="otherDataFormVisible==true" style="z-index:1;" @mouseleave="otherDataFormVisible=false">
            <ul class="clearfix">
                <li class="ecrw-ready-resource-li"
                    v-for="idx in otherSize" 
                    :key="idx"
                    :data="idx">
                    <a href="javascript:;" @click="onItemClick(idx-1 + limit, 1)">{{ items[idx-1+limit].orgname + ' ( ' + items[idx-1+limit].goodscount + ' 份 )'}}</a>
                </li>
            </ul>
<!-- 
            <a href="javascript:;"
            class="ecrw-subtitle-href"
            v-for="idx in otherSize"
            :key="idx"
            :data="idx"
            :class="{ 'ecrw-subtitle-sel':items[idx-1 + limit]==currentItem }"
            @click="onItemClick(idx-1 + limit, 1)">
            {{ items[idx-1 + limit][itemTitleKey] }}
            </a> -->
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            items:Array,
            default:{
                type:Object,
                default:null,
                required:false
            },
            limit:{
                type:Number,
                default:3,
                required:false
            },
            moreUrl:String,
            // itemTitleKey: {
            //     type: String,
            //     default: 'label',
            //     required: false
            // },            
        },
        computed: {
            size() {
                return Math.min(this.limit, this.items.length);
            },
            otherSize() {
                return (this.items.length - this.limit);
            }
        },
        watch: {
            default(val, oldval) {
                this.currentItem = val;
            }
        },
        data() {
            return {
                currentItem: this.default,
                otherDataFormVisible: false
            }
        },
        methods: {
            onItemClick(item_id, flag) {
                this.otherDataFormVisible = false;
                if(flag == 1)
                {
                    this.item = this.items[item_id];
                    this.items.splice(item_id, 1);
                    this.items.splice(0, 0, this.item);
                    item_id = 0;
                }
                this.currentItem = this.items[item_id];

                this.$emit('item-click', this.items[item_id]);
            },
            showAllData() {
                if (this.otherDataFormVisible == true) {
                    this.otherDataFormVisible = false;
                    return;
                }
                if (this.items.length > this.limit) {
                    this.otherDataFormVisible = true;
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    @import '~scss_vars';

    .ecrw-ready-resource-li:nth-child(4n) {
        margin-right: 0;
    }
    .ecrw-school-subtitle {
        position: relative;
    }
    .ecrw-list-pos-addr {
        position: absolute;
        right: 0px;
        top: 30px;
        width:950px;
    }
</style>
