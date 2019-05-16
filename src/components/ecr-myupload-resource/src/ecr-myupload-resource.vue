<template>
    <div class="ecrw-profile-upload-det">
        <div class="ecrw-ready-bk-wrap ecrw-profile-upload-det clearfix">
            <div class="ecrw-profile-upload-left" :class="class_name">
                <a :href="'resource/' + resource.contentid" style="width:100%;height:100%;display:inline-block;" target="_blank">
                    <img :src="thumbpath.localpath" v-if="thumbpath.localpath!=''"/>
                </a>
            </div>
            <div class="ecrw-profile-upload-right">
                <div class="ecrw-profile-upload-right-in"> 
                    <ul>
                        <li class="ecrw-profile-upload-title">
                            <div class="ecrw-zhanbo-left-name"><a :href="'resource/' + resource.contentid" target="_blank">{{ resource.name }}</a></div>
                            <div class="ecrw-zhanbo-left-star">
                                <span class="ecrw-list-star-wrap">
                                    <my-rate :rate="resource.ratesum==null?0:resource.ratesum"></my-rate>
                                </span>
                            </div>
                        </li>
                        <li class="ecrw-profile-upload-li">
                            <span class="ecrw-profile-upload-span">
                                {{ ECRUtil.resourceLabel(resource.contenttype) }}
                            </span>    
                            
                            <span class="ecrw-profile-upload-span">
                                 {{ resource.subject }} &nbsp; {{ resource.grade }} &nbsp; {{ resource.schoolsection }}
                            </span>    
                            
                            <span class="ecrw-profile-upload-span">
                                <span class="ecrw-color-red">{{ ECRUtil.getShareRange(resource.sharerange) }}</span>
                            </span>    
                        </li>
                        <li class="ecrw-profile-upload-li">
                            <span class="ecrw-profile-upload-span">
                                浏览：<span v-show="resource.viewtimes" class="ecrw-color-red">{{ resource.viewtimes }}</span> 次
                            </span>
                            <span class="ecrw-profile-upload-span">
                                收藏：<span class="ecrw-color-red">{{ resource.collectiontimes }}</span> 次
                            </span>
                            <span class="ecrw-profile-upload-span">
                                下载：<span class="ecrw-color-red">{{ resource.downtimes }}</span> 次
                            </span>
                            <span class="ecrw-profile-upload-span">
                                点赞：<span class="ecrw-color-red">{{ resource.clicktimes }}</span> 次
                            </span>
                        </li>

                        <li class="ecrw-profile-upload-li">审核意见：
                            <span v-if="resource.auditinfo == null || resource.auditinfo.remark == null" class="ecrw-color-green" style="font-style: italic;">无</span>
                            <span v-if="resource.auditinfo != null && resource.auditinfo.remark != null" class="ecrw-color-red">{{resource.auditinfo.remark}}</span>
                        </li>
                    </ul>
                </div>
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
                thumbpath:{ localpath:'' },
                class_name: '',
            }
        },
        methods: {
        },
        created() {
            this.class_name = ECRUtil.getDefaultThumb(this.resource, this.thumbpath);
        },
        watch: {
            'resource':function(val){
                this.class_name = ECRUtil.getDefaultThumb(val, this.thumbpath);
            }
        }
    }
</script>