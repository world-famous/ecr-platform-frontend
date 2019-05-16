<template>
    <div ecrm-upload-wrap>
        <div class="ecrm-upload-cond">
            <div class="ecrm-upload-wrap">
                <div class="ecrm-upload-step" :class="{ 'ecrm-upload-sel':$route.path=='/upload/step1' }">
                    <div class="ecrm-step-num">1</div>
                    <div class="ecrm-step-desc">上传文件</div>
                </div>
                <div class="ecrm-upload-step" :class="{ 'ecrm-upload-sel':$route.path=='/upload/step2' }">
                    <div class="ecrm-step-num">2</div>
                    <div class="ecrm-step-desc">完善属性</div>
                </div>
                <div class="ecrm-upload-step" :class="{ 'ecrm-upload-sel':$route.path=='/upload/step3' }">
                    <div class="ecrm-step-num">3</div>
                    <div class="ecrm-step-desc">完成上传</div>
                </div>
                <div class="clearfix"></div>
            </div>
        </div>
        <div class="main">
            <transition name="fade" mode="out-in">
                <router-view></router-view>
            </transition>
        </div>
    </div>
</template>

<script>
    import ECRUtil from '../../common/js/util.js'
    
    export default {
        data() {
            return {
            }
        },
        methods: {
        },
        created() {
            ECRUtil.authenticate(this.$router, '/home');
        }
    }
</script>

<style scoped lang="scss">
    @import '~scss_vars';
    
</style>