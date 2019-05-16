<template>
    <div class="ecrw-content-subtitle">
        <a href="javascript:;" 
            v-if="allSubjectsShow==1"
            class="ecrw-subtitle-href"
            :class="{ 'ecrw-subtitle-sel':null==currentItem }"
            @click="onItemClick(-1, 0)">
            全部
        </a>
        <a href="javascript:;" 
            class="ecrw-subtitle-href"
            v-if="hide_idx>0"
            :class="{ 'ecrw-subtitle-sel':items[hide_idx]==currentItem }"
            @click="onItemClick(hide_idx, 1)">
            {{ items[hide_idx][itemTitleKey] }}
        </a>
        <a href="javascript:;" 
            class="ecrw-subtitle-href"
            v-for="idx in size"
            :key="idx"
            :data="idx"
            :class="{ 'ecrw-subtitle-sel':items[idx-1]==currentItem }"
            @click="onItemClick(idx-1, 0)">
            {{ items[idx-1][itemTitleKey] }}
        </a>
        <a :href="moreUrl" class="ecrw-subtitle-href ecrw-subtitle-more" @click="showAllData">
            更多> 
        </a>
        <div class="ecrw-list-pos-addr" v-if="otherDataFormVisible==true" style="z-index:1;" @mouseleave="otherDataFormVisible=false">
            <a href="javascript:;"
            class="ecrw-subtitle-href"
            v-for="idx in otherSize"
            :key="idx"
            :data="idx"
            :class="{ 'ecrw-subtitle-sel':(items[idx-1 + limit]==currentItem && (idx-1+limit) != hide_idx) }"
            @click="onItemClick(idx-1 + limit, 1)">
            {{ items[idx-1 + limit][itemTitleKey] }}
            </a>
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
                default:10,
                required:false
            },
            allSubjectsShow:{
                type:Number,
                default:0,
                required:false
            },
            moreUrl:String,
            itemTitleKey: {
                type: String,
                default: 'label',
                required: false
            }
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
                otherDataFormVisible: false,
                hide_idx: 0
            }
        },
        methods: {
            onItemClick(item_id, flag) {
                this.otherDataFormVisible = false;
                if(item_id < 0)
                    this.currentItem = null;
                else{
                    if(flag == 1)
                        this.hide_idx = item_id;
                    this.currentItem = this.items[item_id];
                }

                this.$emit('item-click', this.currentItem);
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
    .ecrw-content-subtitle {
        position: relative;
    }
    .ecrw-list-pos-addr {
        position: absolute;
        right: 0px;
        top: 30px;
    }
</style>