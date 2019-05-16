<template>
    <section>
        <my-modal
            ref="logoutConfirm"
            title="提示"
            btn-positive="确定"
            btn-negative="取消"
            @positive="doLogout"
            @negative="cancelLogout">
            <div slot="content" class="ecrm-dialog-textcont">
                确认退出吗?
            </div>
        </my-modal>
        <!-- login -->
        <div class="ecrw-mask" v-if="login.visible"></div>
        <div class="ecrw-login" v-if="login.visible">
            <a href="javascript:;" class="ecrw-login-close" @click="closeLogin"></a>
            <div class="ecrw-login-wrap">
                <div class="ecrw-login-tab clearfix">
                    <ul>
                        <li class="ecrw-login-tab-li">
                            <a href="javascript:;" :class="{ 'ecrw-login-tab-sel':login.kind=='student' }" @click="changeLogin('student')">学生登录</a>
                        </li>
                        <li class="ecrw-login-tab-li">
                            <a href="javascript:;" :class="{ 'ecrw-login-tab-sel':login.kind=='teacher' }" @click="changeLogin('teacher')">老师登录</a>
                        </li>
                    </ul>
                </div>
                <div class="ecrw-login-content">
                    <div class="ecrw-login-change" v-if="login.kind=='student'">
                        <ul>
                            <li class="ecrw-login-change-li">
                                <input type="text" ref="inputAccount" class="ecrw-login-change-text ecrw-login-change-name" v-model="login.form.account" @keyup="checkAccount" placeholder="请输入登录账号" />
                            </li>
                            <li class="ecrw-login-change-li">
                                <input type="password" ref="inputPassword" class="ecrw-login-change-text ecrw-login-change-password" v-model="login.form.checkPass" @keyup="checkPassword" placeholder="请输入登录密码" />
                            </li>
                            <li class="ecrw-login-change-li">
                                <input type="text" ref="capchaKey" class="ecrw-login-change-text ecrw-login-change-yzm" v-model="login.form.capchaKey" @keyup.enter="validateAccount" @keyup="checkCapcha" placeholder="请输入登验证码"/>
                                <span class="ecrw-login-yzm-span">
                                    <img :src="login.form.capcha"  style="height: 44px; width: 108px"/>
                                </span>
                                <a href="javascript:;" @click="changeCapcha" class="ecrw-login-refresh">刷新</a>
                            </li>
                            <li class="ecrw-login-change-li">
                                <el-checkbox class="ecrw-login-change-auto" v-model="autoLogin">自动登录</el-checkbox>
                            </li>
                            <li class="ecrw-login-change-li">
                                <el-button type="primary" class="ecrw-button ecrw-login-change-button"  @click="validateAccount" :loading="logining">登录</el-button>
                            </li>
                            <li class="ecrw-login-change-li ecrw-login-change-other">
                                <a v-bind:href='"https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=" + qq_appid + "&redirect_uri=" + qq_redirect_url + "&state=xuesheng"' class="ecrw-login-qq">
                                    <span>QQ登录</span>
                                </a>
                                <a v-bind:href='"https://open.weixin.qq.com/connect/qrconnect?appid=" + wx_appid + "&redirect_uri=" + wechat_redirect_url + "&response_type=code&scope=snsapi_login&state=xuesheng#wechat_redirect"' class="ecrw-login-wechat">
                                    <span>微信登录</span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div class="ecrw-login-change" v-if="login.kind=='teacher'">
                        <ul>
                            <li class="ecrw-login-change-li">
                                <input type="text" class="ecrw-login-change-text ecrw-login-change-name" v-model="login.form.account" @keyup="checkAccount" placeholder="请输入登录账号"/>
                            </li>
                            <li class="ecrw-login-change-li">
                                <input type="password" class="ecrw-login-change-text ecrw-login-change-password" v-model="login.form.checkPass" @keyup="checkPassword" placeholder="请输入登录密码"/>
                            </li>
                            <li class="ecrw-login-change-li">
                                <input type="text" ref="capchaKey" class="ecrw-login-change-text ecrw-login-change-yzm" v-model="login.form.capchaKey" @keyup.enter="validateAccount" @keyup="checkCapcha" placeholder="请输入登验证码"/>
                                <span class="ecrw-login-yzm-span">
                                    <img :src="login.form.capcha"  style="height: 44px; width: 108px"/>
                                </span>
                                <a href="javascript:;" @click="changeCapcha" class="ecrw-login-refresh">刷新</a>
                            </li>
                            <li class="ecrw-login-change-li">
                                <el-checkbox class="ecrw-login-change-auto" v-model="autoLogin">自动登录</el-checkbox>
                            </li>
                            <li class="ecrw-login-change-li">
                                <el-button type="primary" class="ecrw-button ecrw-login-change-button" style="width:100%;" @click="validateAccount" :loading="logining">登录</el-button>
                            </li>
                            <li class="ecrw-login-change-li ecrw-login-change-other">
                                <a v-bind:href='"https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=" + qq_appid + "&redirect_uri=" + qq_redirect_url + "&state=laoshi"' class="ecrw-login-qq">
                                    <span>QQ登录</span>
                                </a>
                                <a v-bind:href='"https://open.weixin.qq.com/connect/qrconnect?appid=" + wx_appid + "&redirect_uri=" + wechat_redirect_url + "&response_type=code&scope=snsapi_login&state=laoshi#wechat_redirect"' class="ecrw-login-wechat">
                                    <span>微信登录</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="ecrw-login-footer">
                <div class="ecrw-login-footer-in">
                    <a href="http://open.teewon.net/#/findPassword" target="__blank">
                        忘记密码?
                    </a>
                    |
                    <el-dropdown @command="handleRegister" >
                        <el-button type="text" style="color: #666;">
                            免费注册
                        </el-button>
                        <el-dropdown-menu slot="dropdown" placement="top-start" :popper-options="{placement: 'top-start'}">
                            <el-dropdown-item command="teacher" style="color: #666">老师注册</el-dropdown-item>
                            <el-dropdown-item command="student" style="color: #666">学生注册</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
        </div>
        <!-- login end-->    

        <!-- header -->
        <div class="ecrw-header" id="ecrw-header">

            <div class="ecrw-header-top">
                <div class="ecrw-in">
                    <span v-if="login.afterLoginVisible">
                        <a href="javascript:;" @click="goPage('/mycenter/info')" class="ecrw-header-icon"><img src="static/images/ecrw-head.png"/></a>
                        <span class="ecrw-header-tips">
                            {{ headerInfo }}
                        </span>
                        <a href="javascript:;" @click="logout">用户退出</a>
                    </span>
                    <span v-else="login.afterLoginVisible">
                        <a href="javascript:;" @click="reqLogin">用户登录</a>
                    </span>
                </div>
            </div>

            <div class="ecrw-header-bot">
                <div class="ecrw-in">

                    <div class="ecrw-logo">
                        <a  href="javascript:;">
                            <img src="static/images/ecrw-logo.png"/>
                        </a>
                    </div>

                    <div class="ecrw-header-func" :model="login.form" :rules="login.rule" ref="login.form">
                        <span class="ecrw-sub-span ecrw-search-span">
                            <input type="text" class="ecrw-header-sub" ref="searchInput" v-model="searchKey" placeholder="请输入关键字" @keyup.enter="search"/>
                            <a href="javascript:;" class="ecrw-search-icon" @click="search"><img src="static/images/ecrw-search.png"/></a>
                        </span>

                        <span class="ecrw-func-span">
                            <a href="mycenter/basket" class="ecrw-func-resource" target="_blank"><img src="static/images/ecrw-resource.png"/>资源篮</a>
                            <span class="ecrw-func-notice" v-if="basketCount>0">{{ basketCount }}</span>
                        </span>

                        <span class="ecrw-func-span">
                            <a href="mycenter/charge" class="ecrw-func-resource" target="_blank"><img src="static/images/ecrw-money.png"/>充值</a>
                        </span>

                        <span class="ecrw-func-span">
                            <a href="collection" class="ecrw-func-resource" target="_blank"><img src="static/images/ecrw-zhengji.png"/>征集</a>
                        </span>

                        <span class="ecrw-func-span">
                            <a href="reward" class="ecrw-func-resource" target="_blank"><img src="static/images/ecrw-xs.png"/>悬赏</a>
                        </span>

                        <span class="ecrw-func-span">
                            <a href="compareappr/type/0" class="ecrw-func-resource" target="_blank"><img src="static/images/ecrw-tc.png"/>评比</a>
                        </span>

                    </div>

                </div>
            </div>

        </div>
        <!-- header end-->

        <!-- nav -->
        <div class="ecrw-nav">
            <div class="ecrw-in">
                <ul>
                    <li class="ecrw-nav-li" :class="{ 'ecrw-nav-sel':$route.path.startsWith(item.children[0].path) }" v-for="(item,index) in confirmedRoutes" v-if="!item.hidden">
                        <a href="javascript:;" class="ecrw-nav-a" @click="goPage(item.children[0].path)">
                            {{ item.children[0].name }}
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        <!-- nav end-->

        <!-- right bar -->
        <div class="ecrw-rightbar">
            <ul>
                <li class="ecrw-rightbar-li ecrw-rightbar-uoload" v-if="isLoggedIn && isTeacher">
                    <a href="javascript:;" @click="onResourceUpload">上传</a>
                </li>
                <li class="ecrw-rightbar-li ecrw-rightbar-kefu">
                    <a href="javascript:;">客服</a>
                </li>
                <li class="ecrw-rightbar-li ecrw-rightbar-help">
                    <a href="javascript:;">帮助</a>
                </li>
            </ul>
        </div>
        <!-- right bar -->

        <div class="ecrw-content">
            <transition name="fade" mode="out-in">
                <router-view></router-view>
            </transition>
        </div>
        
        <!--  footer  -->
        <div class="ecrw-footer">
            <div class="ecrw-footer-top">
                <div class="ecrw-in">
                    <ul class="clearfix">
                        <li class="ecrw-footer-li">
                            <div class="ecrw-footer-header">产品服务</div>
                            <ul>
                                <li class="ecrw-footer-li-inner">
                                    <a href="javascript:;">
                                        网校通 
                                    </a>
                                </li>

                                <li class="ecrw-footer-li-inner">
                                    <a href="javascript:;">
                                        e卷通  
                                    </a>
                                </li>

                                <li class="ecrw-footer-li-inner">
                                    <a href="javascript:;">
                                        学易书城 
                                    </a>
                                </li>

                                <li class="ecrw-footer-li-inner">
                                    <a href="javascript:;">
                                        e网通 
                                    </a>
                                </li>

                            </ul>
                        </li>
                        
                        <li class="ecrw-footer-li">
                            <div class="ecrw-footer-header">友情链接</div>
                            <ul>
                                <li class="ecrw-footer-li-inner">
                                    <a href="javascript:;">
                                        网易卡搭
                                    </a>
                                </li>
                                
                                <li class="ecrw-footer-li-inner">
                                    <a href="javascript:;">
                                        网易云课堂 
                                    </a>
                                </li>

                                <li class="ecrw-footer-li-inner">
                                    <a href="javascript:;">
                                        网易100分 
                                    </a>
                                </li>

                            </ul>
                        </li>

                        <li class="ecrw-footer-li">
                            <div class="ecrw-footer-header">帮助中心</div>
                            <ul>
                                <li class="ecrw-footer-li-inner">
                                    <a href="javascript:;">
                                        支付问题
                                    </a>
                                </li>

                                <li class="ecrw-footer-li-inner">
                                    <a href="javascript:;">
                                        课件指南 
                                    </a>
                                </li>

                                <li class="ecrw-footer-li-inner">
                                    <a href="javascript:;">
                                        售后政策
                                    </a>
                                </li>

                                <li class="ecrw-footer-li-inner">
                                    <a href="javascript:;">
                                        应用下载
                                    </a>
                                </li>

                            </ul>
                        </li>

                        <li class="ecrw-footer-li  ecrw-footer-last">
                            <div class="ecrw-footer-header">联系我们</div>
                            <ul>
                                <li class="ecrw-footer-li-inner ecrw-footer-addr">
                                    天闻数媒科技（北京）有限公司
                                </li>

                                <li class="ecrw-footer-li-inner">
                                    电话：0755-28471296
                                </li>

                                <li class="ecrw-footer-li-inner">
                                    传真：0755-28471296
                                </li>

                            </ul>
                        </li>

                    </ul>
                </div>
            </div>

            <div class="ecrw-footer-bot">
                Copyright ©  2008-{{ ECRUtil.formatDate.format(new Date(), 'yyyy') }} 天闻数媒科技（北京）有限公司, All Rights Reserved版本号V001R001C01版权 
            </div>

            <iframe id="download_iframe" src="" style="display:none"></iframe>
        </div>
        <!--  footer end  -->
    </section>
</template>

<script>
    import ECRUtil from '../common/js/util';
    import { requestLogin, requestCapcha, getBasketResourceCountByUser, getLabelList } from '../api/api';
    import CryptoJS from 'crypto-js';

    export default {
        data() {
            return {
                ECRUtil: ECRUtil,
                login: {
                    visible: false,
                    kind: 'student', // student, teacher
                    message: '上午好！ 杨永慧 老师',
                    form: {
                        account: '',
                        checkPass: '',
                        capchaKey: '',
                        capcha: '',
                        verifyKey: ''
                    },
                    afterLoginVisible: localStorage.getItem('afterLoginVisible'),                    
                },
                confirmedRoutes: [],
                autoLogin: true,
                searchKey: '',
                basketCount: 0,
                user: null,
                logining:false,
                wx_appid: WX_APPID,
                qq_appid: QQ_APPID,
                wechat_redirect_url: encodeURIComponent('http://open.teewon.net:9000/openapi-uc/wexinLogin?ecoappid=' + ECO_APPID + '&appid=' + WX_APPID + '&env=' + APP_ENV),
                qq_redirect_url: encodeURIComponent('http://open.teewon.net:9000/openapi-uc/qqLogin?ecoappid=' + ECO_APPID + '&appid=' + QQ_APPID + '&env=' + APP_ENV),
            }
        },
        computed: {
            isLoggedIn() {
                if (this.user != null) return true;
                return false;
            },
            isTeacher() {
                if (this.isLoggedIn) {
                    if (this.user.roleList == null) return false;
                    for (var i=0; i<this.user.roleList.length; i++) {
                        if (this.user.roleList[i].roleid == '1000000002') {
                            return true;
                        }
                    }
                }
                return false;
            },
            headerInfo() {
                var date = new Date();
                var time = date.getHours();
                var time_message = "";
                var login_message = "";
                var kind_message = "";
                if (time >= 0 && time <=12) {
                    time_message = "上午";
                } else {
                    time_message = "下午";
                }

                if (this.user != null) {
                    login_message = this.user.realName;
                    if (ECRUtil.isStudent()) {
                        kind_message = "学生";
                    } else if (ECRUtil.isTeacher()) {
                        kind_message = "老师";
                    }
                }
                return time_message + "好！" + login_message + " " + kind_message;
            }
        },
        methods: {
            reqLogin() {
                this.login.visible = true;
                this.login.kind = 'teacher';
                this.resetForm();
            },
            handleRegister(command) {
                switch (command) {
                    case "student":
                        window.location.href="http://open.teewon.net:1000/static/#/otherSignup?role=1000000003";
                        break;
                    case "teacher":
                        window.location.href="http://open.teewon.net:1000/static/#/otherSignup?role=1000000002";
                        break;
                    default:
                        break;
                }
            },
            search() {
                if (!this.$route.path.startsWith('/search')) {
                    if (this.searchKey == ''){
                        this.$router.push('/search');
                    }
                    else {
                        this.$router.push('/search/' + this.searchKey);
                    }
                } else if (this.$route.path.startsWith('/search')) {
                    window.EventHub.$emit('request-search', this.searchKey);
                }
                this.$refs.searchInput.focus();
            },
            onResourceUpload() {
                if (localStorage.getItem('frontend-user') == null) {
                    window.EventHub.$emit('request-login');
                } else {
                    this.$router.push({ path:'/upload/step1'});
                }
            },
            logout() {
                this.$refs.logoutConfirm.openModal();
            },
            doLogout() {
                this.$refs.logoutConfirm.closeModal();
                this.didLogout();
            },
            didLogout() {
                localStorage.removeItem('frontend-user');
                localStorage.removeItem('frontend-token');
                localStorage.removeItem('afterLoginVisible');
                localStorage.removeItem('last-visit-url');
                localStorage.removeItem('teachingViewCount');
                localStorage.removeItem('specialViewCount');
                localStorage.removeItem('answerViewCount');
                this.searchKey = '';
                this.user = null;
                this.basketCount = 0;
                this.login.afterLoginVisible = false;
                window.EventHub.$emit('loggedout');
                localStorage.setItem('isFirstLogin', 0);
                this.$router.push('/home');
            },
            cancelLogout() {
                this.$refs.logoutConfirm.closeModal();
            },
            changeLogin(kind) {
                this.login.kind = kind;
                this.resetForm();
            },
            closeLogin() {
                this.login.visible = false;
            },
            checkAccount() {
                this.login.form.account = ECRUtil.alphanumeric(this.login.form.account);
            },
            checkPassword() {
                // this.login.form.checkPass = ECRUtil.alphanumeric(this.login.form.checkPass);
            },
            checkCapcha() {
                this.login.form.capchaKey = ECRUtil.alphanumeric(this.login.form.capchaKey);
            },
            validateAccount() {
                if (this.login.form.account == "" || this.login.form.account == null) {
                    this.$message({
                        message: '请输入登录账号',
                        type: 'error'
                    });
                    $(this.$refs.inputAccount).focus();
                    return;
                }
                this.validatePassword();
            },
            validatePassword() {
                if (this.login.form.checkPass == "" || this.login.form.checkPass == null) {
                    this.$message({
                        message: '请输入登录密码',
                        type: 'error'
                    });
                    $(this.$refs.inputPassword).focus();
                    return;
                }
                this.validateCapcha();
            },
            validateCapcha() {
                if (this.login.form.capchaKey == "" || this.login.form.capchaKey == null) {
                    this.$message({
                        message: '请输入登验证码',
                        type: 'error'
                    });
                    $(this.$refs.capchaKey).focus();
                    return;
                }
                this.doLogin();
            },
            doLogin() {
                // 对密码进行加密
                var key = CryptoJS.enc.Utf8.parse(ENCRYPT_KEY);
                //这一段就是上面的client_secret
                var encryptPassword = CryptoJS.AES.encrypt(this.login.form.checkPass, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
                var loginParams = { username: this.login.form.account, password: encryptPassword.toString(), capcha: this.login.form.capchaKey, kind: this.login.kind, verifykey: this.login.form.verifykey, autologin:this.autoLogin?'1':'0' };
                this.logining = true;
                requestLogin(loginParams).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        // localStorage.setItem('isFirstLogin', 1);
                        this.user = res.data.responseEntity;
                        localStorage.setItem('frontend-user', JSON.stringify(this.user));
                        localStorage.setItem('frontend-token', this.user.token);
                        localStorage.setItem('afterLoginVisible', true);
                        //localStorage.setItem('badwords', this.user.badwords);
                        this.login.afterLoginVisible = true;
                        this.getBasketCount();
                        this.closeLogin();
                        window.EventHub.$emit('loggedin', this.user);
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });

                        this.login.form.capchaKey = '';
                        this.login.form.verifyKey = '';
                        this.changeCapcha();
                        if (res.data.serverResult.resultCode == -1) {
                            this.login.form.checkPass = '';
                            $(this.$refs.inputAccount).focus();
                        } else if (res.data.serverResult.resultCode == -4) {
                            $(this.$refs.capchaKey).focus();
                        }
                    }
                    this.logining = false;
                }).catch(() => {
                    this.logining = false;
                    this.$message({
                        message: '登录失败',
                        type: 'error'
                    });
                    this.logining = false;
                });
            },
            reqSignup() {
                this.closeLogin();
                this.$router.push('/signup');
            },
            resetForm() {
                this.login.form.account = '';
                this.login.form.checkPass = '';
                this.login.form.capchaKey = '';
                this.login.form.verifyKey = '';
                this.changeCapcha();
            },
            changeCapcha: function() {
                this.login.form.capchaKey = '';
                requestCapcha().then((res) => {
                    if(res.data.responseEntity){
                        this.login.form.capcha = res.data.responseEntity.captchaUrl;
                        this.login.form.verifykey = res.data.responseEntity.verifykey;
                    }
                });
            },
            getBasketCount: function() {
                getBasketResourceCountByUser().then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.basketCount = res.data.responseEntity;
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.basketCount = 0;
                    }
                }).catch(() => {
                    this.basketCount = 0;
                });
            },
            onTokenExpired() {
                this.didLogout();
                this.reqLogin();
            },
            onTokenCaught() {
                this.didLogout();
                this.reqLogin();
            },
            onTokenInvalid() {
                this.didLogout();
                this.reqLogin();
            },
            onWindowUnload() {
                if (!this.autoLogin) {
                    this.didLogout();
                }
            },
            goPage(url) {
                this.$router.push(url);
            }
        },
        created() {
            this.user = JSON.parse(localStorage.getItem('frontend-user'));
            window.EventHub.$on('request-login', this.reqLogin);
            window.EventHub.$on('token-is-expired', this.onTokenExpired);
            window.EventHub.$on('token-has-caught', this.onTokenCaught);
            window.EventHub.$on('token-is-invalid', this.onTokenInvalid);
            window.EventHub.$on('window-unload', this.onWindowUnload);
            window.EventHub.$on('add-basket', this.getBasketCount);
            if (this.user != null) {
                this.getBasketCount();
            }
            let params = {
                pagination: {},
                conditions: [
                    {
                        fieldName: 'parentlabelid',
                        fieldValues: [
                            '0'
                        ],
                        prepender: null,
                        operator: 'EQUAL',
                        childCondtions: null
                    }
                ]
            };

            // Fetch parent label list
            getLabelList(params).then((res) => {
                if (res.data.serverResult.resultCode == "200") {
                    let labelList = [];
                    labelList = res.data.pageInfo.list.map((t) => t.label);

                    // Filter `routes` if the route's label is listed in 标签管理 在 '管理端‘
                    this.confirmedRoutes = this.$router.options.routes.filter((t) => {
                        // '首页' route is added by default
                        if (t.children && t.children[0] && t.children[0].name === '首页') {
                            return true;
                        }

                        // Check if label list contains the route label
                        return t.hidden !== true && t.children && t.children[0] && labelList.includes(t.children[0].name);
                    });
                } else {
                    this.confirmedRoutes = [];
                }
            });
        }
    }

</script>
<style scoped lang="scss">
    @import '~scss_vars';

</style>