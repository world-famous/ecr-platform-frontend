<template>
    <section>
        <div class="ecrw-content-title ecrw-profile-right-title">
            个人信息
        </div>
        <div class="ecrw-profile-det"> 
            <div class="ecrw-profile-user" style="margin-top: 30px;">
                <div style="margin-top: 30px; margin-left: 50px;">
                    <a href="javascript:;" @click="goPage('/mycenter/info/avatar')"><img :src="setUserImage(userInfo)" class="ecrw-userinfo-defalt-image"/></a></br>
                    <span> &nbsp;</span>
                    <span style="font-size: 16px"> <b>个人基本信息</b> </span></br></br></br>
                    <div style=" color: #666">
                        <span> &nbsp; &nbsp; </span>
                        <span> 用户名 :</span>
                        <span> &nbsp; {{ userInfo.loginName }}</span>
                        <span style="float: right; margin-right: 250px;"> 用户ID :
                        <span> &nbsp; {{ userInfo.userId }}</span></span> </br></br></br>

                        <span> &nbsp; &nbsp; </span>
                        <span> 邮&nbsp; &nbsp;箱 :</span>
                        <span> &nbsp; {{ userInfo.loginEmail }} &nbsp;</span>
                        <a href="javascript:;" class="ecrw-profile-enter">绑定</a>
                        <span style="float: right; margin-right: 250px;"> 注册时间 :
                        <span> &nbsp; {{ userInfo.createTime }}</span></span>
                         </br></br></br>

                        <span style="margin-left: 135px;"> &nbsp;&nbsp;</span>
                        <span> 会&nbsp; &nbsp;员 :</span>
                        <span style="color: #00beb2">&nbsp; (校园号) &nbsp;</span>
                        <span v-if="userInfo.member"> &nbsp; {{ userInfo.member.memberno }}</span>
                    </div>            
                </div>
                <div style="margin-top: 50px; margin-left: 185px;">
                    <span> &nbsp;</span>
                    <span style="font-size: 16px;"><b>个人身份信息</b> </span></br>
                    <div style="margin-top: 30px; color: #666">
                        <span> &nbsp; &nbsp; </span>
                        <span> 性 &nbsp; &nbsp; &nbsp; 别 : &nbsp; </span>
                        <span> {{userInfo.sex}} </span></br></br></br>

                        <span> &nbsp; &nbsp; </span>
                        <span> 生 &nbsp; &nbsp; &nbsp; 日 : &nbsp; </span>
                        <span> {{userInfo.birthday}} </span></br></br></br>

                        <span> &nbsp; &nbsp; </span>
                        <span> &nbsp; &nbsp;手机号 : &nbsp; </span>
                        <span> {{userInfo.loginMobile}} </span></br></br></br>

                        <span> &nbsp; &nbsp; </span>
                        <span> 邮 &nbsp; &nbsp; &nbsp; 箱 : &nbsp; </span>
                        <span> {{userInfo.loginEmail}} </span></br></br></br>
                        <span> &nbsp; &nbsp; </span>

                        <span> 所属城市 : &nbsp;</span>
                        <span v-for="(area, idx) in areaList" :key="idx" :data="area"> {{area.areaname}} </span></br></br></br>
                        <span> &nbsp; &nbsp; </span>
                        <div class="vscroll" style="height: 100px">
                            <div v-for="(item, idx) in userInfo.classinfo" style="margin-left: 18px;">
                                <span> 所属学校 : &nbsp; </span>
                                <span class="ecrw-color-green"> {{item.orgname}} </span>
                                <span v-if="ECRUtil.isTeacher()">
                                    <span> &nbsp; &nbsp; </span>
                                    <span> 所属学科 : &nbsp; </span>
                                    <span v-if="userInfo.classinfo!=null" class="ecrw-color-green"> {{item.subject}} </span>

                                    <span> &nbsp; &nbsp; </span>
                                    <span> 所属年级 : &nbsp; </span>
                                    <span v-if="userInfo.classinfo!=null" class="ecrw-color-green"> {{item.grade}} </span>
                                </span>
                                <span> &nbsp; &nbsp; </span>
                                <span> 所属班级 : &nbsp; </span>
                                <span v-if="userInfo.classinfo!=null" class="ecrw-color-green"> {{item.name}} </span></br></br></br>
                            </div>
                        </div>
                    </div>
                    <div style="margin-top: 30px; margin-left: 30%;">
                        <a href="javascript:;" @click="goPage('/mycenter/info/update')" class="ecrw-profile-enter">资料修改</a>
                        <a href="javascript:;" @click="goPage('/mycenter/info/changepwd')" class="ecrw-button-primary">密码修改</a>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import ECRUtil from '../../../common/js/util.js';
    
    export default {
        data() {
            return {
                userInfo:[],
                areaList:[],
                ECRUtil:ECRUtil
            }
        },
        methods: {
            load: function() {
                this.userInfo = JSON.parse(localStorage.getItem('frontend-user'));
                if(this.userInfo){
                    this.areaList = this.userInfo.areaList;
                    if(this.userInfo.sex == 0) {
                        this.userInfo.sex = "男";
                    } else if(this.userInfo.sex == 1) {
                        this.userInfo.sex = "女";
                    }
                }
            },
            setUserImage(user) {
                // Author : GOD 2019-2-19 Bug ID: #831
                if (user && user.roleid && user.roleid.includes("1000000003") && user.path == null) {
                    return "static/images/ecrw-profile-student.png";
                } else if (user && user.roleid && user.roleid.includes("1000000002") && user.path == null) {
                    return "static/images/ecrw-profile-teacher.png";
                } else {
                    return "static/images/ecrw-profile-teacher.png";
                }
                // Author : GOD 2019-2-19 Bug ID: #831
            },
            goPage(url) {
                this.$router.push(url);
            }
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

    ul {
        height: 34px;
        margin-top: 15px;
    }
    li {
        min-width: 160px;
    }
    li a {
        width: calc(100% - 30px);
        text-align: center;
    }
    .ecrw-userinfo-defalt-image {width: 120px; height: 120px; float:left; margin-right: 10px; border-radius:50%;}
    .ecrw-userinfo-border{height:220px; position: relative;border-bottom:1px solid #ededed;}
    .ecrw-button-primary{padding:6px 15px;color:#00beb2;background:#fff;border-radius:3px;margin-left:10px; border: 1px solid #00beb2;}
    .ecrw-button-primary:hover{padding:6px 15px;color:#ff0000;background:#fff;border-radius:3px;margin-left:10px; border: 1px solid #f00;}
</style>