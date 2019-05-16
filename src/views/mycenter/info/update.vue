<template>
    <section>
        <div class="ecrw-content-title ecrw-profile-right-title">
            修改资料
        </div>
        <div class="ecrw-profile-det"> 
            <div class="ecrw-profile-user" style="margin-top: 30px;">
                <div style="margin-top: 30px; margin-left: 50px;">
                    <img :src="setUserImage(userInfo)" class="ecrw-userinfo-image"/></br>
                </div>
                <div style="margin-left: 220px;" >
                    <span>姓 &nbsp; &nbsp; &nbsp; 名 : &nbsp; &nbsp;</span>
                    <el-input v-model="userData.name" style="width: 50%"></el-input></br></br></br>
                    <span>性 &nbsp; &nbsp; &nbsp; 别 : &nbsp; &nbsp;</span>
                    <el-radio-group v-model="userData.sex">
                        <el-radio class="radio" :label="'0'">男</el-radio>
                        <el-radio class="radio" :label="'1'">女</el-radio>
                    </el-radio-group>
                    </br></br></br>

                    <span>生 &nbsp; &nbsp; &nbsp; 日 : &nbsp; &nbsp;</span>
                    <el-date-picker type="date" v-model="userData.birthday" placeholder="选择日期" style="width: 20%;"></el-date-picker> </br></br></br>

                    <span>手 &nbsp; &nbsp; &nbsp; 机 : &nbsp; &nbsp;</span>
                    <el-input v-model="userData.phone" :value="userData.phone" style="width: 50%" :maxlength="20"></el-input></br></br></br>                    

                    <span>邮 &nbsp; &nbsp; &nbsp; 箱 : &nbsp; &nbsp;</span>
                    <el-input v-model="userData.email" style="width: 50%" :maxlength="100"></el-input></br></br></br>
                </div>
                <div style="margin-top: 50px; margin-left: 50%;">
                    <a href="javascript:;" class="ecrw-profile-enter" @click="saveUserInfo">保存</a>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import ECRUtil from '../../../common/js/util.js';
    import { updateUserECO,  updateUser } from '../../../api/api';
    
    export default {
        data() {
            return {
                ECRUtil:ECRUtil,

                userInfo:[],
                isteacher: false,
                userData: {
                    name:'',
                    sex:'',
                    birthday:'',
                    cardNo:'',
                    phone:'',
                    email:'',
                },
                phoneMaxLength: 20,
                departlist:[],
                cities:[],
                areas:[],
                schoolList:[],

                selectedDepart:'',
                selectedCity: '',

                saveLoading: false
            }
        },
        watch:{
            'userData.phone': function(newValue, oldValue){
                if(!newValue) return;
                var flag = /^\d+$/.test(newValue);                                
                if(!flag){                    
                    this.$nextTick(() => {                   
                        this.userData.phone = oldValue;
                    });
                } else {                    
                    this.$nextTick(() => {                   
                        this.userData.phone = newValue;
                    });
                }                         
            },
            'userData.email': function(newValue,oldValue){
                if(!newValue) return;
                var flag = /^[\x00-\x7F]*$/.test(newValue);                                
                if(!flag){                    
                    this.$nextTick(() => {
                        this.userData.email = oldValue;
                    });
                } else {                    
                    this.$nextTick(() => {                   
                        this.userData.email = newValue;
                    });
                }                         
            }
        },
        methods: {
            load() {
                this.userInfo = JSON.parse(localStorage.getItem('frontend-user') );
                if (this.userInfo.roleid == "1000000003") {
                    this.isteacher = false;
                } else if (this.userInfo.roleid == "1000000002") {
                    this.isteacher = true;
                }

                this.userData.name = this.userInfo.realName;
                this.userData.sex = this.userInfo.sex;
                this.userData.birthday = this.userInfo.birthday;
                this.userData.phone = this.userInfo.loginMobile;
                this.userData.email = this.userInfo.loginEmail;
                this.userData.sex = this.userInfo.sex;
            },
            saveUserInfo() {
                if (this.saveLoading)
                    return;
                let birthday = '';

                if (this.userData.birthday !== '' && typeof this.userData.birthday !== "undefined") {
                    birthday = ECRUtil.formatDate.format(new Date(this.userData.birthday), 'y-M-d');
                }
                this.saveLoading = true;
                let para = {
                    entity: {
                        birthday: birthday,
                        imagePath:this.userInfo.imagePath,
                        loginEmail:this.userData.email,
                        loginMobile:this.userData.phone,
                        realName:this.userData.name,
                        sex:this.userData.sex,
                        status:"1",
                        userId:JSON.parse(localStorage.getItem('frontend-user') ).userId
                    }
                };
                updateUserECO(para, this.$message).then((res) => {
                    if(res.data.serverResult.resultCode == "200") {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'success'
                        });

                        this.updateUser();
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                    }
                    this.saveLoading = false;
                }).catch(() => {
                    this.saveLoading = false;
                    this.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
            },
            updateUser() {

                let birthday = '';
                if (this.userData.birthday !== '' && typeof this.userData.birthday !== "undefined") {
                    birthday = ECRUtil.formatDate.format(new Date(this.userData.birthday), 'y-M-d');
                }
                let para = {
                        birthday:birthday,
                        imagePath:this.userInfo.imagePath,
                        loginEmail:this.userData.email,
                        loginMobile:this.userData.phone,
                        realName:this.userData.name,
                        sex:this.userData.sex,
                        status:"1",
                        userId:JSON.parse(localStorage.getItem('frontend-user') ).userId
                };
                updateUser(para).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        localStorage.setItem('frontend-user', JSON.stringify(res.data.responseEntity));
                        this.$router.push('/mycenter/info');
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
            setUserImage(user) {
                if (user && user.roleid && user.roleid.includes("1000000003") && user.path == null) {
                    return "static/images/ecrw-profile-student.png";
                } else if (user && user.roleid && user.roleid.includes("1000000002") && user.path == null) {
                    return "static/images/ecrw-profile-teacher.png";
                } else {
                    return "static/images/ecrw-profile-teacher.png";
                }
            },
        },
        created() {
            ECRUtil.authenticate(this.$router, '/home');
            
        },
        mounted() {
            this.load();
        }
    }
</script>

<style scoped lang="scss">
    @import '~scss_vars';

    .ecrw-userinfo-image {
        width: 120px;
        height: 120px;
        float:left;
        margin-right: 10px;
        border-radius:50%;
    }
</style>