<template>
    <div class="ecrw-exam-content-wrap ecrw-show">
        <div class="ecrw-exam-list  clearfix">
            <div class="ecrw-exam-list-left" :class="ECRUtil.getDefaultThumb(resource, thumbpath)">
                <img :src="thumbpath.localpath" v-if="thumbpath.localpath!=''" style="width: 90px; height: 100px;" />
            </div>
            <div class="ecrw-exam-list-center" style="width: calc(100% - 290px)">
                <div class="ecrw-exam-list-desc">
                    <ul>

                        <li class="ecrw-exam-list-title">
                            <a :href="'resource/' + resource.contentid" class="ecrw-exam-list-title-href" target="_blank">{{ resource.name }}</a>
                        </li>

                        <li class="ecrw-exam-list-det">
                                {{ resource.description }}
                        </li>

                        <li class="ecrw-exam-list-other">

                            <span class="ecrw-exam-list-other-span">
                                上传时间：{{ ECRUtil.formatDate.format(new Date(resource.createtime), 'y/M/d') }}
                            </span>

                            <span class="ecrw-exam-list-other-span">
                                参与者：{{ resource.creatorname }}
                            </span>

                            <span class="ecrw-exam-list-other-span">
                                浏览次数：<span class="ecrw-color-red">
                                    {{ resource.viewtimes }}
                                </span>
                            </span>

                            <span class="ecrw-exam-list-other-span">
                                下载次数：
                                <span class="ecrw-color-red">{{ resource.downtimes }}</span>
                            </span>

                        </li>

                    </ul>
                </div>
            </div>

            <div class="ecrw-exam-list-right ecrw-exam-list-right-zhengji">
                <ul>
                    
                    <li class="ecrw-exam-list-right-li">
                        <a :href="'resource/' + resource.contentid" class="ecrw-exam-list-right-down" target="_blank">查看资源</a>
                    </li>

                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import ECRUtil from '../../../common/js/util.js'

    export default {
        props: {
            resource: Object
        },
        data: function () {
            return {
                ECRUtil:ECRUtil,
                thumbpath: {
                    localpath: '',
                }
            }
        },
        methods: {
        }
    }
</script>