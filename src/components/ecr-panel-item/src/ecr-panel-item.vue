<template>
    <div class="ecrw-list-pos-gps" v-if="items.length>0 && currentItem!=null">
        <span class="ecrw-list-pos-name" @click="showAllData">{{ currentItem[itemTitleKey] }}</span>
        <div class="ecrw-list-pos-addr" v-if="otherDataFormVisible==true" style="z-index:1;" @mouseleave="otherDataFormVisible=false" :style="widthStyle">
            <a href="javascript:;"
            v-for="(item, idx) in items"
            :key="idx"
            :data="item"
            :style="displayStyle"
            @click="onItemClick(item)">
            {{ item[itemTitleKey] }}
            </a>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            items:Array,
            itemTitleKey: String,
            itemIdKey: String,
            linear: {
                type: Boolean,
                default: false,
                required: false
            },
            saveState: {
                type: String,
                default: '',
                required: false
            },
            defaultState: {
                type: String,
                default: '',
                required: false
            }
        },
        watch: {
            items: function(val, oldval) {
                if (val.length > 0) {
                    if (this.saveState.length > 0) {
                        let itemId = localStorage.getItem(this.saveState);
                        let item = null;
                        if (itemId == null) {
                            if (this.defaultState.length > 0) {
                                itemId = this.defaultState;
                            } else {
                                itemId = val[0][this.itemIdKey];
                            }
                        }
                        for (var i=0; i<val.length; i++) {
                            if (val[i][this.itemIdKey] == itemId) {
                                item = val[i];
                                break;
                            }
                        }
                        if (item == null) item = val[0];
                        this.onItemClick(item);
                    } else {
                        this.onItemClick(val[0]);
                    }
                }
            },
            otherDataFormVisible: function(val, oldval) {
                this.$emit('show', val);
            }
        },
        data() {
            return {
                widthStyle: this.linear?{width:'auto'}:'',
                displayStyle: this.linear?{display:'block'}:{display:'inline-block'},
                currentItem: this.items.length > 0?this.items[0]:null,
                otherDataFormVisible: false
            }
        },
        methods: {
            onItemClick(item) {
                this.otherDataFormVisible = false;           
                this.currentItem = item;
                if (this.saveState.length > 0) {
                    localStorage.setItem(this.saveState, this.currentItem[this.itemIdKey]);
                }
                this.$emit('item-click', item);
            },
            showAllData() {
                if (this.otherDataFormVisible == false)
                    this.otherDataFormVisible = true;
                else
                    this.otherDataFormVisible = false;
            }
        }
    }
</script>

<style scoped lang="scss">
    .ecrw-list-pos-gps {
        position: relative;
    }
    .ecrw-list-pos-addr {
        position: absolute;
        right: 0px;
        top: 30px;
        text-align: left;
    }
</style>