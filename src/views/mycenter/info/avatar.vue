<template>
    <section>
        <div class="ecrw-content-title ecrw-profile-right-title">
            修改头像
        </div>
        <div style="margin-top: 30px;">
            <el-col :span="24">
                <el-col :span="12">
                    
                </el-col>
            </el-col>
        </div>
    </section>
</template>

<script>
    import ECRUtil from '../../../common/js/util.js'
    
    export default {
        data() {
            return {
            }
        },
        methods: {
        },
        created() {
            ECRUtil.authenticate(this.$router, '/home');
        },
        mounted() {
        }
    }
</script>

<style scoped lang="scss">
    @import '~scss_vars';

</style>