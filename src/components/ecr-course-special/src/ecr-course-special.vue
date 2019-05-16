<template>
    <section>
        <div class="ecrw-ready-left-title">课程目录</div>
        <el-col :span="24" v-loading="loading">
            <div class="ecrw-ready-left-list">
                <my-course-special
                    :data="items"
                    :openlevel="1"
                    :openstep="1"
                    :selectlevel="1"
                    @item-select="onItemSelect"
                    @item-deselect="onItemDeselect"
                    @item-click="onItemClick">
                </my-course-special>
            </div>
        </el-col>
    </section>
</template>

<script>
    import { getThemeList } from '../../../api/api';

    export default {
        data() {
            return {
                items:[
                    {
                        children:[]
                    }
                ],
                selectedItem:null,
                loading:false,
                last_call:0
            }
        },
        props: {
            twolabel: {
                type: String,
                default: null,
                required: false
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
                var param = {
                    "conditions":
                    [
                        {
                            "fieldName":"parentthemeid",
                            "fieldValues":[this.twolabel],
                            "prepender":null,
                            "operator":"EQUAL",
                            "childConditions":null
                        },
                        {
                            "fieldName":"themename",
                            "fieldValues":[""],
                            "prepender":null,
                            "operator":"EQUAL",
                            "childConditions":null
                        },
                        {
                            "fieldName":"schoolsection",
                            "fieldValues":[""],
                            "prepender":null,
                            "operator":"EQUAL",
                            "childConditions":null
                        },
                        {
                            "fieldName":"subjectid",
                            "fieldValues":[""],
                            "prepender":null,
                            "operator":"EQUAL",
                            "childConditions":null
                        }
                    ]
                };
                this.loading = true;
                getThemeList(param).then((res) => {
                    if (this.last_call != 0 && this.last_call > calltime) return;
                    this.last_call = calltime;

                    if (res.data.serverResult.resultCode == "200") {
                        this.items[0].children = res.data.pageInfo.list;
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
            }
        },
        created: function() {
            this.loadChapter({});
        }
    }
</script>