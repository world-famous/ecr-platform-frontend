<template>
    <section>
        <div class="ecrw-content-title ecrw-profile-right-title">
            修改密码
        </div>
        <el-form :model="pwdForm" label-width="100px" :rules="pwdFormRules" ref="pwdForm" style="margin-top: 50px;">
            <el-form-item prop="oldPassword" label="原始密码 :">
                <el-input type="password" placeholder="请输入原始密码" v-model="pwdForm.oldPassword"></el-input>
            </el-form-item>
            <el-form-item prop="staticPassword" label="新密码 :">
                <el-input type="password" placeholder="请输入新密码" v-model="pwdForm.staticPassword"></el-input>
            </el-form-item>
            <el-form-item prop="checkPassword" label="重复密码 :">
                <el-input type="password" placeholder="请输入重复密码" v-model="pwdForm.checkPassword"></el-input>
            </el-form-item>
            <el-row>
                <el-col :span="24">
                    <a href="javascript:;" class="ecrw-profile-enter" @click="updatePassword">保存</a>
                </el-col>
            </el-row>
        </el-form>
    </section>
</template>

<script>
    import ECRUtil from '../../../common/js/util.js'
    import { updatePwdECO } from '../../../api/api';
    import CryptoJS from 'crypto-js';
    
    export default {
        data() {
            return {
                pwdForm: {
                    oldPassword:'',
                    staticPassword:'',
                    checkPassword:''
                },
                pwdFormRules: {
                    oldPassword: [
                        { required: true, message: '请输入原始密码', trigger: 'blur' }
                    ],
                    staticPassword: [
                        { required: true, message: '6~16个字符，包括字母，数字，特殊符号区分大小写', trigger: 'blur' }
                    ],
                    checkPassword: [
                        { required: true, message: '6~16个字符，包括字母，数字，特殊符号区分大小写', trigger: 'blur' }
                    ],
                },
                updateLoading: false,
            }
        },
        methods: {
            updatePassword: function() {
                this.$refs.pwdForm.validate((valid) => {
                    if (this.updateLoading)
                        return;
                    this.updateLoading = true;
                    if (this.pwdForm.staticPassword == this.pwdForm.checkPassword) {
                        if (this.pwdForm.staticPassword.length < 6) {
                            this.$message({
                                message: "新密码不少于6位",
                                type: 'error'
                            });
                        } else {
                            // 对密码进行加密
                            var key = CryptoJS.enc.Utf8.parse(ENCRYPT_KEY);
                            //这一段就是上面的client_secret
                            var encryptOldPassword = CryptoJS.AES.encrypt(this.pwdForm.oldPassword, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7});
                            var encryptNewPassword = CryptoJS.AES.encrypt(this.pwdForm.staticPassword, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7});
                            let param ={
                                oldPassword: encryptOldPassword.toString(),
                                staticPassword: encryptNewPassword.toString(),
                                userId: JSON.parse(localStorage.getItem('frontend-user') ).userId
                            };
                            updatePwdECO(param, this.$message).then((res) =>{
                                this.updateLoading = false;
                                if (res.data.serverResult.resultCode == "200") {
                                    var resultMessage = res.data.serverResult.resultMessage;
                                    this.$message({
                                        message: resultMessage,
                                        type: 'success'
                                    });
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
                    } else {
                        this.$message({
                            message: "重复密码与新密码不一致",
                            type: 'error'
                        });
                    }
                });
                
            }
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

    section {
        float:left;
        width: 100%;
    }
    .el-form {
        max-width: 600px;
    }
    .el-form .el-col {
        margin-top: 50px;
        text-align: center;
    }
</style>