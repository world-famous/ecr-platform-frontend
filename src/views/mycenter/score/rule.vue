<template>   
    <div class="ecrw-profile-content">
        <div class="ecrw-content-title ecrw-profile-right-title">积分规则</div>

        <div class="ecrw-profile-det">

            <div class="ecrw-profile-record-wrap">
                <div class="ecrw-profile-record-icon">
                    <span class="ecrw-profile-record-icon-span ecrw-profile-record-icon-rc">日常积分</span>
                </div>
                <div class="ecrw-profile-record-det">
                    <table>
                        <tr>
                            <th>操作</th>
                            <th>具体事项</th>
                            <th>备注</th>
                            <th style="width:200px">范围</th>
                            <th>获得积分值</th>
                            <th>适用对象</th>
                        </tr>
                        <tr v-for="(item, idx) in usual" :key="idx" :data="item">
                            <td>{{ formatBussiness(item.bussinesstype) }}</td>
                            <td>{{ formatContentType(item.contenttype) }}</td>
                            <td>{{ item.remark }}</td>
                            <td>{{ formatShareRange(item.sharerange) }}</td>
                            <td><span class="ecrw-color-red">{{ item.score }}</span>></td>
                            <td>{{ formatObject(item.forobject) }}</td>
                        </tr>
                    </table>
                </div>
            </div>
            
            <div class="ecrw-profile-record-wrap">
                <div class="ecrw-profile-record-icon">
                    <span class="ecrw-profile-record-icon-span ecrw-profile-record-icon-rw">任务积分</span>
                </div>
                <div class="ecrw-profile-record-det">
                    <table>
                        <tr>
                            <th>操作</th>
                            <th>具体事项</th>
                            <th>备注</th>
                            <th>范围</th>
                            <th>获得积分值</th>
                            <th>适用对象</th>
                        </tr>
                        <tr v-for="(item, idx) in task" :key="idx" :data="item">
                            <td>{{ formatBussiness(item.bussinesstype) }}</td>
                            <td>{{ formatContentType(item.contenttype) }}</td>
                            <td>{{ item.remark }}</td>
                            <td>{{ formatShareRange(item.sharerange) }}</td>
                            <td><span class="ecrw-color-red">{{ item.score }}</span>></td>
                            <td>{{ formatObject(item.forobject) }}</td>
                        </tr>
                    </table>
                </div>
            </div>
            
            <div class="ecrw-profile-record-wrap">
                <div class="ecrw-profile-record-icon">
                    <span class="ecrw-profile-record-icon-span ecrw-profile-record-icon-hd">活动积分</span>
                    <span class="ecrw-profile-record-tips">（注：悬赏活动的发起积分和应答采纳最佳答案积分是由发起人自行定义的）</span>
                </div>
                <div class="ecrw-profile-record-det">
                    <table>
                        <tr>
                            <th>操作</th>
                            <th>具体事项</th>
                            <th>备注</th>
                            <th>范围</th>
                            <th>获得积分值</th>
                            <th>适用对象</th>
                        </tr>
                        <tr v-for="(item, idx) in activity" :key="idx" :data="item">
                            <td>{{ formatBussiness(item.bussinesstype) }}</td>
                            <td>{{ formatContentType(item.contenttype) }}</td>
                            <td>{{ item.remark }}</td>
                            <td>{{ formatShareRange(item.sharerange) }}</td>
                            <td><span class="ecrw-color-red">{{ item.score }}</span>></td>
                            <td>{{ formatObject(item.forobject) }}</td>
                        </tr>
                    </table>
                </div>
            </div>
            
            <div class="ecrw-profile-record-wrap">
                <div class="ecrw-profile-record-icon">
                    <span class="ecrw-profile-record-icon-span ecrw-profile-record-icon-zy">资源积分</span>
                </div>
                <div class="ecrw-profile-record-det">
                    <table>
                        <tr>
                            <th>操作</th>
                            <th>具体事项</th>
                            <th>备注</th>
                            <th style="width:200px">范围</th>
                            <th>获得积分值</th>
                            <th>适用对象</th>
                        </tr>
                        <tr v-for="(item, idx) in resource" :key="idx" :data="item">
                            <td>{{ formatBussiness(item.bussinesstype) }}</td>
                            <td>{{ formatContentType(item.contenttype) }}</td>
                            <td>{{ item.remark }}</td>
                            <td>{{ formatShareRange(item.sharerange) }}</td>
                            <td><span class="ecrw-color-red">{{ item.score }}</span>></td>
                            <td>{{ formatObject(item.forobject) }}</td>
                        </tr>
                    </table>
                </div>
            </div>
            
            <div class="ecrw-profile-record-wrap">
                <div class="ecrw-profile-record-icon">
                    <span class="ecrw-profile-record-icon-span ecrw-profile-record-icon-tk">题库积分</span>
                    <span class="ecrw-profile-record-tips">（注：每个试题、试卷（商品）下载时，会按其定价来扣除积分）</span>
                </div>
                <div class="ecrw-profile-record-det">
                    <table>
                        <tr>
                            <th>操作</th>
                            <th>具体事项</th>
                            <th>备注</th>
                            <th>范围</th>
                            <th>获得积分值</th>
                            <th>适用对象</th>
                        </tr>
                        <tr v-for="(item, idx) in question" :key="idx" :data="item">
                            <td>{{ formatBussiness(item.bussinesstype) }}</td>
                            <td>{{ formatContentType(item.contenttype) }}</td>
                            <td>{{ item.remark }}</td>
                            <td>{{ formatShareRange(item.sharerange) }}</td>
                            <td><span class="ecrw-color-red">{{ item.score }}</span>></td>
                            <td>{{ formatObject(item.forobject) }}</td>
                        </tr>
                    </table>
                </div>
            </div>
            
            <div class="ecrw-profile-record-wrap">
                <div class="ecrw-profile-record-icon">
                    <span class="ecrw-profile-record-icon-span ecrw-profile-record-icon-cz">充值积分</span>
                </div>
                <div class="ecrw-profile-record-det">
                        <span class="ecrw-profile-record-cz">充值人民币一元，获得 <span class="ecrw-color-red">{{ this.supplement.score }}</span>个积分。</span>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import ECRUtil from '../../../common/js/util.js'
    import { CONTENT_TYPE } from '../../../common/js/const.js';
    import { getScoreRule } from '../../../api/api'

    export default {
        data() {
            return {
                rules: [],
                usual: [],
                task: [],
                activity: [],
                resource: [],
                question: [],
                supplement: {},
                contentTypes: CONTENT_TYPE
            }
        },
        methods: {
            getRules() {
                getScoreRule({}).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.rules = res.data.pageInfo.list;
                        for (var i=0; i<this.rules.length; i++) {                
                            if (this.rules[i].scoretype == "1") {
                                this.usual.push(this.rules[i]);
                            } else if (this.rules[i].scoretype == "2") {
                                this.task.push(this.rules[i]);
                            } else if (this.rules[i].scoretype == "3") {
                                this.activity.push(this.rules[i]);
                            } else if (this.rules[i].scoretype == "4") {
                                this.resource.push(this.rules[i]);
                            } else if (this.rules[i].scoretype == "5") {
                                this.question.push(this.rules[i]);
                            } else if (this.rules[i].scoretype == "6") {
                                this.supplement = this.rules[i];
                            }
                        }
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.rules = [];
                    }
                }).catch(() => {
                    this.rules = [];
                    
                    this.$message({
                        message: '加载失败!',
                        type: 'error'
                    });
                });
            },
            formatBussiness(bussinesstype) {
                if (bussinesstype == "0") {
                    return "上传资源";
                } else if (bussinesstype == "1") {
                    return "参与征集资源";
                } else if (bussinesstype == "2") {
                    return "评星";
                } else if (bussinesstype == "3") {
                    return "点赞";
                } else if (bussinesstype == "4") {
                    return "挑错";
                } else if (bussinesstype == "5") {
                    return "收藏";
                } else if (bussinesstype == "6") {
                    return "完善个人信息";
                } else if (bussinesstype == "7") {
                    return "登录";
                } else if (bussinesstype == "8") {
                    return "题库设置积分";
                }

                return "";
            },
            formatContentType(contenttype) {
                for(var i=0; i<this.contentTypes.length; i++) {
                    if (contenttype == 'T') {
                        return "文本";
                    } else if (contenttype == 'T4') {
                        return "试题";
                    }

                    if (this.contentTypes[i].contenttype == contenttype) {
                        return this.contentTypes[i].contentname;
                    }
                }

                return contenttype;
            },
            formatShareRange(sharerange) {
                if (sharerange == 2) {
                    return "本校、本区、本市、本省";
                } else if (sharerange == 1) {
                    return "全网";
                }

                return "";
            },
            formatObject(forobject) {
                if (forobject == "0") {
                    return "学生, 老师";
                } else if (forobject == "1") {
                    return "学生";
                } else if (forobject == "2") {
                    return "老师";
                } else if (forobject == "3") {
                    return "管理员";
                }
            }
        },   
        created() {
            ECRUtil.authenticate(this.$router, '/home');
            this.getRules();
        },
        mounted() {
        }
    }
</script>

<style scoped lang="scss">
    @import '~scss_vars';
</style>