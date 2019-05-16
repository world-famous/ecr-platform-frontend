<template>
    <section>
        <!-- dialog -->
        <div class="ecrw-mask" v-if="success"></div>
        <div class="ecrw-resource-open" v-if="success">
            <div class="ecrw-resource-open-title">
                提示
                <a href="javascript:;" @click="goPage('/home')" class="ecrw-login-close"></a>
            </div>
            <div class="ecrw-resource-open-content">注册完成了！</div>
            <div class="ecrw-resource-open-but">
                <a href="javascript:;" @click="goPage('/home')">确认</a>
            </div>
        </div>
        <!-- dialog end -->

        <!--  content  -->
        <div class="ecrw-in ecrw-reg-in">
            <div class="ecrw-reg-title clearfix">
                <ul>
                    <li class="ecrw-reg-title-li">
                        <a href="javascript:;" :class="{ 'ecrw-reg-title-sel':role==0 }" @click="changeSignup(0)">
                            注册学生账户
                        </a>
                    </li>
                    <li class="ecrw-reg-title-li">
                        <a href="javascript:;" :class="{ 'ecrw-reg-title-sel':role==1 }" @click="changeSignup(1)">
                            注册老师账户
                        </a>
                    </li>
                </ul>
            </div>
            <el-form ref="studentForm" :model="studentForm" :rules="studentFormRules" label-width="120px" v-if="role==0" style="margin-top: 30px">
                <el-col :span="24">
                    <el-form-item label="用户名称：" class="is-required" prop="username">
                        <el-input type="text" placeholder="请输入用户名" v-model="studentForm.username"></el-input>
                    </el-form-item>    
                    <el-form-item label="用户密码：" class="is-required" prop="password">
                        <el-input type="password" placeholder="密码" v-model="studentForm.password"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码：" prop="confirm">
                        <el-input type="password" placeholder="重复密码" v-model="studentForm.confirm"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码：" prop="mobile">
                        <el-input type="text" placeholder="手机号码" :disabled="func1" :class="{ 'noneSMS': studentForm.smsRequire == false, 'clickedSMS': studentForm.smsRequire == true }" v-model="studentForm.mobile"></el-input>
                        <a href="javascript:;" v-if="!requestBtn" class="sms" @click="requireSMSKey(0)">{{ studentForm.btnSMSKey }}</a>
                        <a href="javascript:;" v-if="requestBtn" class="sms">{{ studentForm.btnSMSKey }}</a>
                    </el-form-item>
                    <el-form-item label="手机验证码：" prop="smskey">
                        <el-input type="text" placeholder="手机验证码" v-model="studentForm.smskey"></el-input>
                    </el-form-item>
                    <el-form-item label="姓名：" prop="realname">
                        <el-input type="text" placeholder="姓名" v-model="studentForm.realname"></el-input>
                    </el-form-item>
                    <el-form-item label="学校：" prop="school">
                        <el-input type="text" placeholder="学校" v-model="studentForm.school"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <p>
                            <input type="button" value="立即注册" class="ecrw-button ecrw-reg-button" style="width: 100%" :class="{ 'ecrw-button-disabled':!studentForm.approve }" @click="doSignup(studentForm, 'addStudent')"/>
                        </p>
                        <p>
                            <input type="checkbox" id="ecrw-reg-check" v-model="studentForm.approve"/>
                            <label for="ecrw-reg-check">我已阅读并接受服务条款</label>
                        </p>
                    </el-form-item>
                </el-col>
            </el-form>
            <el-form ref="teacherForm" :model="teacherForm" :rules="teacherFormRules" label-width="120px" v-if="role==1" style="margin-top: 30px">
                <el-col :span="24">
                    <el-form-item label="用户名称：" class="is-required" prop="username">
                        <el-input type="text" placeholder="请输入用户名" v-model="teacherForm.username"></el-input>
                    </el-form-item>    
                    <el-form-item label="用户密码：" class="is-required" prop="password">
                        <el-input type="password" placeholder="密码" v-model="teacherForm.password"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码：" prop="confirm">
                        <el-input type="password" placeholder="重复密码" v-model="teacherForm.confirm"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码：" prop="mobile">
                        <el-input type="text" placeholder="手机号码" :disabled="func2" :class="{ 'noneSMS': teacherForm.smsRequire == false, 'clickedSMS': teacherForm.smsRequire == true }" v-model="teacherForm.mobile"></el-input>
                        <a href="javascript:;" v-if="!requestBtn" class="sms" @click="requireSMSKey(1)">{{ teacherForm.btnSMSKey }}</a>
                        <a href="javascript:;" v-if="requestBtn" class="sms">{{ teacherForm.btnSMSKey }}</a>
                    </el-form-item>
                    <el-form-item label="手机验证码：" prop="smskey">
                        <el-input type="text" placeholder="手机验证码" v-model="teacherForm.smskey"></el-input>
                    </el-form-item>
                    <el-form-item label="姓名：" prop="realname">
                        <el-input type="text" placeholder="姓名" v-model="teacherForm.realname"></el-input>
                    </el-form-item>
                    <el-form-item label="学校：" prop="school">
                        <el-input type="text" placeholder="学校" v-model="teacherForm.school"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <p>
                            <input type="button" value="立即注册" class="ecrw-button ecrw-reg-button" style="width: 100%" :class="{ 'ecrw-button-disabled':!teacherForm.approve }" @click="doSignup(teacherForm, 'addTeacher')"/>
                        </p>
                        <p>
                            <input type="checkbox" id="ecrw-reg-check" v-model="teacherForm.approve"/>
                            <label for="ecrw-reg-check">我已阅读并接受服务条款</label>
                        </p>
                    </el-form-item>                            
                </el-col>
            </el-form>
        </div>
        <!--  content end  -->
    </section>
</template>

<script>
    import CryptoJS from 'crypto-js';
    import util from '../common/js/util'
    import { signupStudent, signupTeacher, getSMSKey } from '../api/api'

    export default {
        data() {
            return {
                success: false,
                role: 0, // 0 - student, 1 - teacher
                mobileStatus: false,
                studentForm: {
                    btnSMSKey: '免费获取手机验证码',
                    discountInterval: null,
                    countSec: 0,
                    username: '', 
                    password: '', 
                    confirm: '',
                    mobile: '', 
                    smskey: '', 
                    realname: '', 
                    school: '', 
                    approve: false,
                    smsRequire: false
                },
                teacherForm: {
                    btnSMSKey: '免费获取手机验证码',
                    discountInterval: null,
                    countSec: 0,
                    username: '', 
                    password: '', 
                    confirm: '',
                    mobile: '', 
                    smskey: '', 
                    realname: '', 
                    school: '',
                    approve: false,
                    smsRequire: false
                },
                studentFormRules: {
                    username: [
                        { validator: this.validateStudentUserName, trigger: 'blur' },
                    ],
                    password: [
                        { validator: this.validateStudentPassWord, trigger: 'blur'}
                    ],
                    confirm: [
                        { required: true, message: '请重复输入上面的密码。', trigger: 'blur'}
                    ],
                    mobile: [
                        { required: true, message: '请输入手机号码。', trigger: 'blur'}
                    ],
                    smskey: [
                        { required: true, message: '请输入手机验证码', trigger: 'blur'}
                    ],
                    realname: [
                        { required: true, message: '请输入姓名', trigger: 'blur'}
                    ]
                },
                teacherFormRules: {
                    username: [
                        { validator: this.validateTeacherUserName, trigger: 'blur' },
                    ],
                    password: [
                        { validator: this.validateTeacherPassWord, trigger: 'blur'}
                    ],
                    confirm: [
                        { required: true, message: '请重复输入上面的密码。', trigger: 'blur'}
                    ],
                    mobile: [
                        { required: true, message: '请输入手机号码。', trigger: 'blur'}
                    ],
                    smskey: [
                        { required: true, message: '请输入手机验证码', trigger: 'blur'}
                    ],
                    realname: [
                        { required: true, message: '请输入姓名', trigger: 'blur'}
                    ]
                },
                requestBtn: false
            }
        },
        methods: {
            validateStudentUserName(rule, value, callback) {
                if (this.studentForm.username.length < 3 || this.studentForm.username.length > 14) {
                    callback(new Error('请输入3-14位字符，英文、数字、下划线的组合。'));
                } else {
                    callback();
                }
            },
            validateStudentPassWord(rule, value, callback) {
                if (this.studentForm.password.length < 6 || this.studentForm.password.length > 8) {
                    callback(new Error('请输入6-18位字符，不允许空格。'));
                } else {
                    callback();
                }
            },
            validateTeacherUserName(rule, value, callback) {
                if (this.teacherForm.username.length < 3 || this.teacherForm.username.length > 14) {
                    callback(new Error('请输入3-14位字符，英文、数字、下划线的组合。'));
                } else {
                    callback();
                }
            },
            validateTeacherPassWord(rule, value, callback) {
                if (this.teacherForm.password.length < 6 || this.teacherForm.password.length > 8) {
                    callback(new Error('请输入6-18位字符，不允许空格。'));
                } else {
                    callback();
                }
            },
            changeSignup(role) {
                this.stopDiscount(this.role);
                this.role = role;
            },
            requireSMSKey(role) {
                var who = role==0?this.studentForm:this.teacherForm;
                who.smsRequire = true;
                if (this.validMobile(who.mobile)) {
                    this.doRequestKey(who.mobile);
                    this.startDiscount(role);
                }
            },
            doSignup(form, type) {
                if (form.approve == false) return;
                
                if (type == 'addStudent') {
                    this.$refs.studentForm.validate((valid) => {
                          if (valid) {
                            // 对密码进行加密
                            var key = CryptoJS.enc.Utf8.parse(ENCRYPT_KEY);
                            //这一段就是上面的client_secret
                            var password = CryptoJS.AES.encrypt(this.studentForm.password, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7});
                            let param = {
                                student: {
                                    loginName: this.studentForm.username,
                                    name: this.studentForm.realname,
                                    orgName: this.studentForm.school
                                },
                                user: {
                                    branchCode: "TWSMECR",
                                    isLocked: false,
                                    loginMobile: this.studentForm.mobile,
                                    loginName: this.studentForm.username,
                                    orgName: this.studentForm.school,
                                    realName: this.studentForm.realname,
                                    staticPassword: password.toString()
                                }
                            }
                            signupStudent(param, type).then((res) => {
                                if (res.data.serverResult.resultCode == "200") {
                                    this.success = true;
                                } else {
                                    this.$message({
                                        message: res.data.serverResult.resultMessage,
                                        type: 'error'
                                    });
                                }
                            }).catch(() => {
                                this.$message({
                                    message: '操作失败',
                                    type: 'error'
                                });
                            });
                        }
                    });
                } else {
                    this.$refs.teacherForm.validate((valid) => {
                          if (valid) {
                            // 对密码进行加密
                            var key = CryptoJS.enc.Utf8.parse(ENCRYPT_KEY);
                            //这一段就是上面的client_secret
                            var password = CryptoJS.AES.encrypt(this.teacherForm.password, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7});
                            let param = {
                                teacher: {
                                   loginName: this.teacherForm.username,
                                    name: this.teacherForm.realname,
                                    orgName: this.teacherForm.school
                                },
                                user: {
                                    "branchCode": "TWSMECR",
                                    "isLocked": false,
                                    "loginMobile": this.teacherForm.mobile,
                                    "loginName": this.teacherForm.username,
                                    "orgName": this.teacherForm.school,
                                    "realName": this.teacherForm.realname,
                                    "staticPassword": password.toString()
                                }
                            }
                            signupTeacher(param, type).then((res) => {
                                if (res.data.serverResult.resultCode == "200") {
                                    this.success = true;
                                } else {
                                    this.$message({
                                        message: res.data.serverResult.resultMessage,
                                        type: 'error'
                                    });
                                }
                            }).catch(() => {
                                this.$message({
                                    message: '操作失败',
                                    type: 'error'
                                });
                            });
                        }
                    });
                }
            },
            startDiscount(role) {
                this.requestBtn = true;
                var who = role==0?this.studentForm:this.teacherForm;
                if (who.countSec > 0) return;
                who.btnSMSKey = "免费获取手机验证码 (60)";
                who.countSec = 60;
                var _this = this;
                who.discountInterval = setInterval(function() {
                    who.countSec -= 1;
                    who.btnSMSKey = "免费获取手机验证码 (" + who.countSec + ")";
                    if (who.countSec == 0) {
                        _this.stopDiscount(role);
                    }
                }, 1000);
            },
            stopDiscount(role) {
                this.requestBtn = false;
                var who = role==0?this.studentForm:this.teacherForm;
                clearInterval(who.discountInterval);
                who.btnSMSKey = "免费获取手机验证码";
                who.countSec = 0;
                who.smsRequire = false;
            },
            doRequestKey(mobile) {
                var param = {
                    messageType: '1',
                    sender: 'xxxx',
                    content: {
                        title: 'titlexxxx',
                        payload: 'xxxx',
                        link: 'http://xx.com'
                    },
                    receivers: ['x1', 'x2', 'x3'],
                    appId: 'xxx',
                    notifyType: '1',
                    notifyContent: 'xxx',
                    notifyreceivers: [mobile, 'xx2', 'xx3']
                };
                getSMSKey(param).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        });

                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                    }
                }).catch((res) => {
                    this.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
            },
            isValid(form) {
                return true;
            },
            validMobile(mobile) {
                return true;
            },
            goPage(url) {
                this.$router.push(url);
            }
        },
        computed: {
            func1() {
                if (this.studentForm.countSec != 0)
                    return true;
                else
                    return false;
            },
            func2() {
                if (this.teacherForm.countSec != 0)
                    return true;
                else
                    return false;
            }
        }
    }
</script>

<style scoped lang="scss">
    @import '~scss_vars';
    .sms {
        padding: 0px 16px;
        background: #f0f0f0;
        color: #666;
        vertical-align: middle;
        margin-left: 10px;
        border-radius: 2px;
        text-align: center;
        float: right;
        height: 36px;
        line-height: 36px;
        display: inline-block;
        border: 1px solid #f0f0f0;
    }
    .clickedSMS {
        width: 58%;
    }
    .noneSMS {
        width: 64%;
    }

</style>