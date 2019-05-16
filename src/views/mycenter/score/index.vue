<template>
    <div class="ecrw-profile-content">
        <div class="ecrw-content-title ecrw-profile-right-title">个人积分</div>
        <div class="ecrw-profile-det">
            <div class="ecrw-profile-det-intro">
                <ul>
                    <li class="ecrw-profile-det-li">
                        <span class="ecrw-profile-det-span">
                            用户名： <span class="ecrw-log-name">{{ userInfo.loginName }}</span>
                        </span>
                    </li>
                    <li class="ecrw-profile-det-li">
                        <span class="ecrw-profile-det-span">
                            姓名： <span class="ecrw-real-name">{{ userInfo.realName }}</span>
                        </span>
                    </li>
                    <li class="ecrw-profile-det-li">
                        <span class="ecrw-profile-det-span">
                            积分：<span class="ecrw-color-red" style="font-size: 18px">{{ score }}</span>分
                        </span>
                        <a href="javascript:;" @click="goPage('/mycenter/score/log')" class="ecrw-profile-enter">查看积分明细</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import ECRUtil from '../../../common/js/util.js'
    import { getMyScore } from '../../../api/api'

    export default {
        data() {
            var userInfo = JSON.parse(localStorage.getItem('frontend-user'));
            return {
                userInfo: userInfo,
                score: 0
            }
        },
        methods: {
            getScore() {
                getMyScore().then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.score = parseInt(res.data.responseEntity);
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.score = '?';
                    }
                }).catch(() => {
                    this.score = '?';
                    
                    this.$message({
                        message: '加载失败!',
                        type: 'error'
                    });
                });
            },
            goPage(url) {
                this.$router.push(url);
            }
        },
        created() {
            ECRUtil.authenticate(this.$router, '/home');
            this.getScore();
        },
        mounted() {
        }
    }
</script>

<style scoped lang="scss">
    @import '~scss_vars';
     .ecrw-log-name{
        color: #3394ff;
        font-size: 18px;
        font-style: bold;
    }
    .ecrw-real-name{
        color: #ff54a4;
        font-size: 18px;
        font-style: bold;
    }

</style>