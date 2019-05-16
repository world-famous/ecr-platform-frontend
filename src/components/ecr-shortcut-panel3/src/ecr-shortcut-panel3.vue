<template>
    <div class="ecrw-list-right-wrap">
        <div class="ecrw-content-title">
            <div class="ecrw-content-subtitle">
                <a href="javascript:;" class="ecrw-subtitle-href ecrw-subtitle-more" @click="update">
                    换一批 
                </a>
            </div>
            {{ title.labelname }}
        </div>
        <div class="ecrw-list-right-content">
            <ul v-if="items.length > 0">
                <li class="ecrw-right-li" :class="ECRUtil.resourceType(item.resource[itemTypeKey])" v-for="(item,idx) in items" :key="idx" :data="item">
                    <div class="ecrw-right-file">
                        <a href="javascript:;" @click="handleClick(item.resource)">
                            {{ item.resource[itemTitleKey] }}
                        </a>
                        <a class="ecrw-right-time" href="javascript:;" @click="download(item.resource)">
                            下载
                        </a>
                    </div>
                </li>
            </ul>
            <div class="empty-string" v-if="items.length == 0">
                {{ emptyString }}
            </div>
        </div>
    </div>
</template>

<script>
    import ECRUtil from '../../../common/js/util.js';

    export default {
        props: {
            items:Array,
            title:Object,
            emptyString: {
                type:String,
                default:'',
                required:false
            },
            itemTitleKey:String,
            itemIdKey:String,
            itemTypeKey:String
        },
        data: function () {
            return {
                ECRUtil:ECRUtil
            }
        },
        methods: {
            handleClick(item) {
                this.$emit('button-click', item);
            },
            update() {
                this.$emit('update');
            },
            download(resource) {
                if (localStorage.getItem('frontend-user') == null) {
                    window.EventHub.$emit('request-login');
                    return;
                }

                if (this.ECRUtil.downloadResource(resource, this.$message) === false) {
                    this.$message({
                        message: '文件不存在。',
                        type: 'error'
                    });
                }
            }
        }
    }
</script>

<style scoped>
    div.empty-string {
        width: 100%;
        height: 50px;
        line-height: 50px;
        text-align: center;
    }
</style>