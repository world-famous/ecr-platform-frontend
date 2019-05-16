<template>
    <section ref="playerContainer">
        <ecr-video-player :path="path" v-if="type=='video'"></ecr-video-player>
        <ecr-image-viewer :path="path" v-if="type=='image'"></ecr-image-viewer>
        <ecr-doc-viewer :path="path" v-if="type=='document'"></ecr-doc-viewer>
        <ecr-animation-player :path="path" v-if="type=='animation'"></ecr-animation-player>
        <span style="width:100%;text-align:center;display:inline-block;" :style="{ marginTop:marginTop + 'px' }" v-if="path!='' && type!='video'&&type!='image'&&type!='document'&&type!='animation'">不支持查看内容类型为{{ ECRUtil.resourceLabel(item.contenttype) }}的资源</span>
    </section>
</template>

<script>
    import ECRUtil from '../../../common/js/util.js';

    export default {
        props: {
            item: Object
        },
        data() {
            return {
                marginTop: 0,
                ECRUtil:ECRUtil
            };
        },
        computed: {
            path() {
                if (this.item.fileInfo != null) return this.item.fileInfo.localpath;
                return '';
            },
            type() {
                if (this.item.contenttype=='6' || this.item.contenttype=='7') return 'video';
                if (this.item.contenttype=='5') return 'image';
                if (this.item.contenttype=='1' || this.item.contenttype=='10' || this.item.contenttype=='2' || this.item.contenttype=='3' || this.item.contenttype=='4') return 'document';
                if (this.item.contenttype=='8' || this.item.contenttype=='9') return 'animation';
                if (this.item.contenttype == '11') return ''; // zip
                if (this.item.contenttype == '12') return ''; // other
                if (this.item.contenttype == '21') return 'document';
                if (this.item.contenttype == '22') return 'document';
                if (this.item.contenttype == '31') return 'document';

                return '';
            }
        },
        mounted() {
            var height = this.$refs.playerContainer.clientWidth * 1080 / 1920;
            this.marginTop = height / 2;
            $(this.$refs.playerContainer).height(height);
        },
        created() {
        }
    }
</script>

<style scoped lang="scss">
    section {
        width: 100%;
    }
</style>