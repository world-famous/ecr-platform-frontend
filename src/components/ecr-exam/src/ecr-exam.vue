<template>
    <section>
        <div class="ecrw-exam-list  clearfix">
            <div class="ecrw-exam-list-left">
                <a href="javascript:;">
                    <img :src="item.thumb']"/>
                </a>
            </div>

            <div class="ecrw-exam-list-center">
                <div class="ecrw-exam-list-desc">
                    <ul>

                        <li class="ecrw-exam-list-title">
                            <a href="javascript:;" class="ecrw-exam-list-title-href">{{ item.title }}</a>
                            <span class="ecrw-list-star-wrap">
                                <a href="javascript:;" class="ecrw-list-star"></a>
                                <a href="javascript:;" class="ecrw-list-star"></a>
                                <a href="javascript:;" class="ecrw-list-star"></a>
                                <a href="javascript:;" class="ecrw-list-star"></a>
                                <a href="javascript:;" class="ecrw-list-star"></a>

                                <span class="ecrw-list-star-wrap ecrw-list-star-inner">
                                    <a href="javascript:;" class="ecrw-list-star ecrw-list-star-sel"></a>
                                    <a href="javascript:;" class="ecrw-list-star ecrw-list-star-sel"></a>
                                    <a href="javascript:;" class="ecrw-list-star ecrw-list-star-sel"></a>
                                    <a href="javascript:;" class="ecrw-list-star ecrw-list-star-sel"></a>
                                    <a href="javascript:;" class="ecrw-list-star ecrw-list-star-sel"></a>
                                </span>
                            </span>
                        </li>
                        <li class="ecrw-exam-list-det">
                                {{ item.content }}
                        </li>

                        <li class="ecrw-exam-list-icon clearfix">
                                <div class="ecrw-list-icon-wrap">
                                    <a href="javascript:;" class="ecrw-list-det-bro">{{ item.seeNum }}</a>
                                    <a href="javascript:;" class="ecrw-list-det-zan">{{ item.recomNum }}</a>
                                    <a href="javascript:;" class="ecrw-list-det-add">{{ item.rateNum }}</a>
                                    <a href="javascript:;" class="ecrw-list-det-down">{{ item.downNum }}</a>
                                </div>

                                <div class="ecrw-exam-list-icon-wenben">
                                    <span>文件大小： {{ item.size }} </span>|
                                    <span>上传者： {{ item.importer }}  </span>
                                </div>
                        </li>

                    </ul>
                </div>
            </div>

            <div class="ecrw-exam-list-right">
                <ul>
                    <li class="ecrw-exam-list-right-li">
                        <span class="ecrw-exam-list-right-span">{{ item.totalSize }}</span>
                    </li>
                    
                    <li class="ecrw-exam-list-right-li">
                        <a href="javascript:;" class="ecrw-button ecrw-exam-list-right-down" @click="download(item)">下载</a>
                    </li>

                </ul>
            </div>
        </div>
    </section>
</template>

<script>
    import ECRUtil from '../../../common/js/util.js'

    export default {
        props: {
            item: Object
        },
        data: function () {
            return {
                ECRUtil:ECRUtil
            }
        },
        methods: {
            download(resource) {
                if (sessionStorage.getItem("user") == null) {
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