<template>
    <section>
        <div class="ecrw-ready-left-title">课程目录</div>
        <el-col :span="24" v-loading="loading">
            <div class="ecrw-ready-left-list">
                <my-course-tree
                    :data="items"
                    :openlevel="1"
                    :openstep="1"
                    :selectlevel="1"
                    @item-select="onItemSelect"
                    @item-deselect="onItemDeselect"
                    @item-click="onItemClick">
                </my-course-tree>
            </div>
        </el-col>
    </section>
</template>

<script>
    import { getTeachCatalogHeader } from '../../../api/api';

    export default {
        data() {
            return {
                items:[],
                selectedItem:null,
                loading:false,
                last_call:0
            }
        },
        methods: {
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
            },
            loadChapter(params) {
                this.loadChapterByTime(params, new Date().getTime());
            },
            loadChapterByTime(params, calltime) {
                this.loading = true;
                params['lang'] = 'zh_CN';
                params['level'] = 0;
                getTeachCatalogHeader(params).then((res) => {
                    if (this.last_call != 0 && this.last_call > calltime) return;
                    this.last_call = calltime;

                    if (res.data.serverResult.resultCode == "200") {
                        let items = this.composeItem(res.data.pageInfo.list, 0);
                        for (var i=0; i<items.length; i++) {
                            items[i]['label'] = items[i]['level3'] + '《' + items[i]['level1'] + '》' + items[i]['level2'] + items[i]['level4'];
                        }
                        this.items = items;
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                    }
                    this.loading = false;
                }).catch(() => {
                    this.loading = false;
                });
            },
            composeItem(items, level) {
                let composeResult = [];
                if (level == 5) {
                    composeResult.push({'children':items});
                } else {
                    for (var i=0; i<items.length; i++) {
                        var childCompositions = this.composeItem(items[i].children, level + 1);
                        for (var j=0; j<childCompositions.length; j++) {
                            childCompositions[j]['level'+level] = items[i].label;
                            composeResult.push(childCompositions[j]);
                        }
                    }
                }
                return composeResult;
            }
        },
        created: function() {
            this.loadChapter({});
        }
    }
</script>