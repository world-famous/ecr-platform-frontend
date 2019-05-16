<template>
    <section>
        <div class="ecrw-in">
            <div class="ecrw-content-title ecrw-title-font20">
                发起资源悬赏
            </div>

            <div class="ecrw-zhengji-upload">
                <div class="ecrw-zhengji-upload-left">
                    <div class="ecrw-zhengji-upload-wrap">
                        <div class="ecrw-zhengji-upload-det ecrw-xuanshang-form">
                            <el-form ref="uploadForm" :model="uploadForm" :rules="uploadFormRules" label-width="120px" style="margin-top: 30px">
                                <el-row class="content">
                                    <el-form-item label="悬赏主题:" class="is-required" prop="activityname">
                                        <el-input type="text" v-model="uploadForm.activityname" @keyup.native="checkname" :maxlength="20"></el-input>
                                    </el-form-item>    
                                    <el-form-item label="悬赏有效期:" class="is-required" prop="timeprop">
                                        <el-date-picker type="date" v-model="uploadForm.starttime"></el-date-picker>
                                        -
                                        <el-date-picker type="date" v-model="uploadForm.endtime"></el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="资源类型:">
                                        <el-select v-model="uploadForm.contenttype" @change="onChangeConentType(uploadForm.contenttype)">
                                            <el-option :label="item.contentname" :value="item.contenttype" v-for="(item, idx) in contentTypes" :key="idx" :data="item"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label=" 悬赏要求:" class="is-required" prop="requirement">
                                        <el-input type="textarea" :rows.native="5" v-model="uploadForm.requirement" :maxlength="500" auto-complete="off"></el-input>
                                    </el-form-item>
                                    <el-form-item label="资源格式设置:" class="is-required" prop="checkprop">
                                        <el-checkbox-group v-model="uploadForm.formats">
                                            <el-checkbox :label="item" v-for="(item, idx) in extensions" :key="idx" :data="item"></el-checkbox>
                                        </el-checkbox-group>
                                    </el-form-item>
                                    <el-form-item label="奖励积分:" prop="bonuspoints" class="is-required">
                                        <el-input-number v-model.number="uploadForm.bonuspoints" :min="1"></el-input-number>
                                    </el-form-item>
                                </el-row>
                            </el-form>
                        </div>
                        <div style="text-align: center; margin-bottom: 50px">
                            <span class="ecrw-zhengji-upload-check">
                                <el-checkbox label="匿名" v-model="form.anonymity" style="margin-right: 30px"></el-checkbox>
                            </span>
                            <span class="ecrw-zhengji-upload-button">
                                <el-button type="primary" @click="submit" :loading="loading">提交</el-button>
                            </span>
                        </div>
                    </div>
                </div>

                <div class="ecrw-zhengji-upload-right">
                    <div class="ecrw-zhengji-upload-right-wrap">

                        <div class="ecrw-zhengji-upload-user ecrw-zhengji-upload-nopadding">
                            <div class="ecrw-zhengji-upload-user-left" v-if="userStatInfo!=null">
                                <ul>
                                    <li class="ecrw-zhengji-upload-user-left-pic">
                                        <a href="javascript:;">
                                            <img src="static/images/ecrw-head.png"/>
                                        </a>
                                    </li>
                                    <li class="ecrw-zhengji-upload-user-left-name">{{loginInfo.name}}</li>
                                </ul>
                            </div>
                            <div class="ecrw-zhengji-upload-user-right" v-if="userStatInfo!= null">
                                <ul>
                                    <li class="ecrw-zhengji-upload-user-text" v-if="ECRUtil.isLoggedIn() && ECRUtil.isTeacher()">
                                        参与征集：<span class="ecrw-color-red">{{userStatInfo.collectionjoincount}}</span>次
                                    </li>
                                    
                                    <li class="ecrw-zhengji-upload-user-text" v-if="ECRUtil.isLoggedIn() && ECRUtil.isTeacher()">
                                        参与悬赏：<span class="ecrw-color-red">{{userStatInfo.rewardjoincount}}</span>次
                                    </li>
                                    <li class="ecrw-zhengji-upload-user-text" v-if="ECRUtil.isLoggedIn() && ECRUtil.isTeacher()">
                                        参与评比：<span class="ecrw-color-red">{{userStatInfo.estimatejoincount}}</span>次
                                    </li>
                                    <li class="ecrw-zhengji-upload-user-text" :class="{'upload-user-text': (ECRUtil.isLoggedIn() && ECRUtil.isStudent())}">
                                        我发起的悬赏：<span class="ecrw-color-red">{{userStatInfo.rewardcreatecount}}</span>次
                                    </li>
                                </ul>
                            </div>
                            <div class="ecrw-zhengji-upload-user-button" :class="{'upload-user-button': (ECRUtil.isLoggedIn() && ECRUtil.isStudent())}">
                                <a href="javascript:;">结束资源悬赏</a>
                            </div>

                        </div>

                        <div class="ecrw-zhengji-upload-new">
                            <ecr-last-reward
                                ref="topreward"
                                >
                            </ecr-last-reward>
                        </div>

                        <div class="ecrw-zhengji-upload-new">
                            <ecr-top-rewarder
                                ref="toprewarder"
                                >
                            </ecr-top-rewarder>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
    import ECRUtil from '../../common/js/util'
    import { CONTENT_TYPE } from '../../common/js/const.js';
    import { addRewardActivity, getUserCountInfo } from '../../api/api';

    export default {
        data() {
            return {
                ECRUtil: ECRUtil,
                form: {
                    anonymity: false
                },
                uploadForm: {
                    activityname: '',
                    formats: [],
                    starttime: '',
                    endtime: '',
                    bonuspoints: 0,
                    contenttype: CONTENT_TYPE[0].contenttype,
                    requirement: ''
                },
                uploadFormRules: {
                    timeprop: [
                        { validator: this.validateActivityTime },
                    ],
                    checkprop: [
                        { validator: this.validateCheck, trigger: 'blur' },
                    ],
                    activityname: [
                        { validator: this.validateActivityName, trigger: 'blur' }
                    ],
                    requirement: [
                        { validator: this.validateRequirement, trigger: 'blur' }
                    ],
                    bonuspoints: [
                        { validator: this.validateBonuspoint, trigger: 'blur' }
                    ]
                },
                contentTypes: CONTENT_TYPE,
                extensions: CONTENT_TYPE[0].extensions,
                loginInfo: {
                    name: '',
                    userid: ''
                },
                userStatInfo: null,
                loading: false
            }
        },
        computed: {
            
        },
        methods: {
            validateBonuspoint(rule, value, callback) {
                if (this.uploadForm.bonuspoints != parseInt(this.uploadForm.bonuspoints)) {
                    callback(new Error('不能输入小数'));
                } else {
                    callback();
                }
            },
            validateActivityName(rule, value, callback) {
                if (this.uploadForm.activityname == "" || this.uploadForm.activityname == null) {
                    callback(new Error('请输入悬赏主题'));
                } else {
                    callback();
                }
            },
            checkname() {
                this.uploadForm.activityname = ECRUtil.removespace(this.uploadForm.activityname);
            },
            validateRequirement(rule, value, callback) {
                if (this.uploadForm.requirement.trim() == "" || this.uploadForm.requirement == null) {
                    callback(new Error('请输入悬赏要求'));
                } else {
                    callback();
                }
            },
            load() {
                this.getUserCountInfo();
            },
            validateActivityTime(rule, value, callback) {
                if (this.uploadForm.starttime == '') {
                    callback(new Error('请输入开始时间'));
                } else if (this.uploadForm.endtime == '') {
                    callback(new Error('请输入结束时间'));
                } else if(new Date(this.uploadForm.starttime) > new Date(this.uploadForm.endtime)){
                    callback(new Error('查询结束时间不得大于开始时间。'));
                } else if(ECRUtil.formatDate.format(new Date(this.uploadForm.starttime), 'yyyy-MM-dd') == ECRUtil.formatDate.format(new Date(this.uploadForm.endtime), 'yyyy-MM-dd')){
                    callback(new Error('结束日期不能等于开始日期。'));
                } else {
                    callback();
                }
            },
            validateCheck(rule, value, callback) {
                if (this.uploadForm.formats.length == 0) {
                    callback(new Error('请输入资源格式设置'));
                } else {
                    callback();
                }
            },
            submit() {
                this.$refs.uploadForm.validate((valid) => {
                      if (valid) {
                        if (this.uploadForm.starttime != '' && this.uploadForm.endtime != '') {
                            if (new Date(this.uploadForm.starttime) > new Date(this.uploadForm.endtime)) {
                                this.$message({
                                    message: '查询结束时间不得大于开始时间。',
                                    type: 'error'
                                });
                                return;
                            } else if (ECRUtil.formatDate.format(new Date(this.uploadForm.starttime), 'yyyy-MM-dd') == ECRUtil.formatDate.format(new Date(this.uploadForm.endtime), 'yyyy-MM-dd')) {
                                this.$message({
                                    message: '结束日期不能等于开始日期。',
                                    type: 'warning'
                                });
                                return;
                            }
                        }
                        let params = {
                            activityname: this.uploadForm.activityname,
                            starttime: ECRUtil.formatDate.format(new Date(this.uploadForm.starttime), 'yyyy-MM-dd hh:mm:ss'),
                            endtime: ECRUtil.formatDate.format(new Date(this.uploadForm.endtime), 'yyyy-MM-dd hh:mm:ss'),
                            requirement: this.uploadForm.requirement,
                            formats: this.uploadForm.formats,
                            bonuspoints: this.uploadForm.bonuspoints,
                            contenttype: this.uploadForm.contenttype,
                            isanonymity: (this.form.anonymity)?1:0
                        };
                        this.loading = true;
                        addRewardActivity(params).then((res) => {
                            if (res.data.serverResult.resultCode == "200") {
                                this.$router.push('/reward/create');
                            } else {
                                this.$message({
                                    message: res.data.serverResult.resultMessage,
                                    type: 'error'
                                });
                            }
                            this.loading = false;
                        }).catch(() => {
                            this.$message({
                                message: '操作失败',
                                type: 'error'
                            });
                            this.loading = false;
                        });
                      }
                  });
            },
            onChangeConentType(contenttype) {
                for(var i=0; i<this.contentTypes.length; i++) {
                    if (this.contentTypes[i].contenttype == contenttype) {
                        this.extensions = this.contentTypes[i].extensions;
                    }        
                }
            },
            getUserCountInfo() {
                var user = localStorage.getItem('frontend-user');
                if (user != null) {
                    this.loginInfo.name = JSON.parse(user).realName;
                    this.loginInfo.userid = JSON.parse(user).userId;

                    getUserCountInfo(this.loginInfo.userid).then((res) => {
                        if (res.data.serverResult.resultCode == "200") {
                            this.userStatInfo = res.data.responseEntity;
                        } else {
                            this.$message({
                                message: res.data.serverResult.resultMessage,
                                type: 'error'
                            });
                        }
                    });
                }
            }
        },
        created() {
            ECRUtil.authenticate(this.$router, '/home');
            this.load();
        }
    }

</script>
<style scoped lang="scss">
    @import '~scss_vars';
    .upload-user-button {
        margin-top: 50px;
    }
    .upload-user-text {
        padding-top: 42px;
    }
</style>