<template>
    <div class="ecrw-content">
        <div class="ecrw-in">

            <div class="ecrw-profile clearfix">
            <!-- left -->
                <div class="ecrw-profile-left">
                    <div class="ecrw-profile-title">
                            个人中心
                    </div>
        
                    <div class="ecrw-profile-list">
                        <div class="ecrw-profile-list-title">
                            <a href="javascript:;" @click="goPage('/mycenter/info')" class="ecrw-profile-href ecrw-profile-geren" :class="{ 'ecrw-profile-sel':$route.path=='/mycenter/info' }">
                                个人信息
                            </a>
                        </div>
                        <ul>
                            <li class="ecrw-profile-li">
                                <a href="javascript::" @click="goPage('/mycenter/info/update')" class="ecrw-profile-href" :class="{ 'ecrw-profile-sel':$route.path=='/mycenter/info/update' }">
                                    修改资料
                                </a>
                            </li>
                            
                            <li class="ecrw-profile-li">
                                <a href="javascript:;" @click="goPage('/mycenter/info/changepwd')" class="ecrw-profile-href" :class="{ 'ecrw-profile-sel':$route.path=='/mycenter/info/changepwd' }">
                                    修改密码
                                </a>
                            </li>
                            <li class="ecrw-profile-li">
                                <a href="javascript:;" @click="goPage('/mycenter/info/avatar')" class="ecrw-profile-href" :class="{ 'ecrw-profile-sel':$route.path=='/mycenter/info/avatar' }" style="display: none;">
                                    修改头像
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div class="ecrw-profile-list">
                        <div class="ecrw-profile-list-title">
                            <a href="javascript:;" @click="goPage('/mycenter/order/mine')" class="ecrw-profile-href ecrw-profile-dd ecrw-href-disabled">
                                订单管理
                            </a>
                        </div>
                        <ul>
                            <li class="ecrw-profile-li">
                                <a href="javascript:;" @click="goPage('/mycenter/order/mine')" class="ecrw-profile-href" :class="{ 'ecrw-profile-sel':$route.path=='/mycenter/order/mine' }">
                                    我的订单
                                </a>
                            </li>
                            <li class="ecrw-profile-li">
                                <a href="javascript:;" @click="goPage('/mycenter/basket')" class="ecrw-profile-href" :class="{ 'ecrw-profile-sel':$route.path=='/mycenter/basket' }">
                                    我的资源篮
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div class="ecrw-profile-list">
                        <div class="ecrw-profile-list-title">
                            <a href="javascript:;" @click="goPage('/mycenter/charge')" class="ecrw-profile-href ecrw-profile-cz" :class="{ 'ecrw-profile-sel':$route.path=='/mycenter/charge' }">
                                账号充值
                            </a>
                        </div>
                        <ul>
                            <li class="ecrw-profile-li">
                                <a href="javascript:;" @click="goPage('/mycenter/charge/log')" class="ecrw-profile-href" :class="{ 'ecrw-profile-sel':$route.path=='/mycenter/charge/log' }">
                                    充值明细
                                </a>
                            </li>
                            
                        </ul>
                    </div>

                    <div class="ecrw-profile-list">
                        <div class="ecrw-profile-list-title">
                            <a href="javascript:;" @click="goPage('/mycenter/score')" class="ecrw-profile-href ecrw-profile-jifen" :class="{ 'ecrw-profile-sel':$route.path=='/mycenter/score' }">
                                个人积分
                            </a>
                        </div>
                        <ul>
                            <li class="ecrw-profile-li">
                                <a href="javascript:;" @click="goPage('/mycenter/score/log')" class="ecrw-profile-href" :class="{ 'ecrw-profile-sel':$route.path=='/mycenter/score/log' }">
                                    积分明细
                                </a>
                            </li>

                            <li class="ecrw-profile-li">
                                <a href="javascript:;" @click="goPage('/mycenter/score/rule')" class="ecrw-profile-href" :class="{ 'ecrw-profile-sel':$route.path=='/mycenter/score/rule' }">
                                    积分规则
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div class="ecrw-profile-list">
                        <div class="ecrw-profile-list-title">
                            <a href="javascript:;" @click="goPage('/mycenter/goods/download')" class="ecrw-profile-href ecrw-profile-ziyuan ecrw-href-disabled">
                                个人资源
                            </a>
                        </div>
                        <ul>
                            <li class="ecrw-profile-li">
                                <a href="javascript:;" @click="goPage('/mycenter/goods/download')" class="ecrw-profile-href" :class="{ 'ecrw-profile-sel':$route.path=='/mycenter/goods/download' }">
                                        我的下载
                                </a>
                            </li>
                            
                            <li class="ecrw-profile-li">
                                <a href="javascript:;" @click="goPage('/mycenter/goods/upload')" class="ecrw-profile-href" :class="{ 'ecrw-profile-sel':$route.path=='/mycenter/goods/upload' }">
                                        我的上传
                                </a>
                            </li>
                            <li class="ecrw-profile-li">
                                <a href="javascript:;" @click="goPage('/mycenter/goods/favorite')" class="ecrw-profile-href" :class="{ 'ecrw-profile-sel':$route.path=='/mycenter/goods/favorite' }">
                                        我的收藏
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div class="ecrw-profile-list">
                        <div class="ecrw-profile-list-title">
                            <a href="javascript:;" @click="goPage('/mycenter/message')" class="ecrw-profile-href ecrw-profile-info" :class="{ 'ecrw-profile-sel':$route.path=='/mycenter/message' }">
                                消息
                            </a>
                        </div>
                    </div>

                    <div class="ecrw-profile-list">
                        <div class="ecrw-profile-list-title">
                            <a href="javascript:;" @click="goPage('/mycenter/notice')" class="ecrw-profile-href ecrw-profile-tz" :class="{ 'ecrw-profile-sel':$route.path=='/mycenter/notice' }">
                                通知
                            </a>
                        </div>
                    </div>
                </div>
                <!-- left end-->
        
                <!-- right -->
                <div class="ecrw-profile-right">
                    <transition name="fade" mode="out-in">
                        <router-view></router-view>
                    </transition>
                </div>
                <!-- right end-->
            </div>

        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
            }
        },
        methods: {
            goPage(url) {
                this.$router.push(url);
            }
        },
        mounted() {
        }
    }
</script>

<style scoped lang="scss">
    @import '~scss_vars';

    .ecrw-content {
        padding-top: 0px;
    }

    .ecrw-href-disabled, .ecrw-href-disabled:hover {
        cursor: default;
    }
</style>