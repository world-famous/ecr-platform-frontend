<template>
    <section>
        <div class="ecrw-ready-left-title">课程目录</div>
        <el-col :span="24" v-loading="loading">
            <div class="ecrw-ready-left-list">
                <my-tree
                    :data="items"
                    :selectlevel="0"
                    itemlabel="labelname"
                    @item-select="onItemSelect"
                    @item-deselect="onItemDeselect"
                    @item-click="onItemClick">
                </my-tree>
            </div>
        </el-col>
    </section>
</template>

<script>
    import { getOneLabelList, getTwoLabelList } from '../../../api/api';

    export default {
        props: {
            onelabel: String
        },
        data() {
            return {
                onelabels: [],
                items:[],
                selectedItem:null,
                loading:false
            }
        },
        methods: {
            loadOnelabels() {
                getOneLabelList({}).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.onelabels = res.data.pageInfo.list;
                        for (var i=0; i<this.onelabels.length; i++) {
                            if (this.onelabels[i].labelname == this.onelabel) {
                                this.loadTwolabels(this.onelabels[i].labelid);
                            }
                        }
                    } else {
                        this.onelabels = [];
                    }
                }).catch(() => {
                    this.onelabels = [];
                });
            },
            loadTwolabels(onelabelid) {
                let param = { "parentlabelid": onelabelid };
                this.loading = true;
                getTwoLabelList(param).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.items = res.data.pageInfo.list;
                    } else {
                        this.items = [];
                    }
                    this.loading = false;
                }).catch(() => {
                    this.loading = false;
                    this.items = [];
                });
            },
            onItemSelect(target, item, items) {
                this.selectedItem = item;
                this.$emit('item-select', item);
            },
            onItemDeselect(target, item, items) {
                if (this.selectedItem == item) {
                    this.selectedItem = null;
                    this.$emit('item-deselect', item);
                }
            },
            onItemClick(target, item, items) {
                this.$emit('item-click', item);
            }
        },
        created: function() {
            this.loadOnelabels();
        }
    }
</script>