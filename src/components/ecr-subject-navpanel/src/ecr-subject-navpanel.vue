<template>
    <div class="ecrw-banner-left-detial-list" v-if="subject != null" @mouseover.stop="">
        <div class="ecrw-banner-left-detial-mode">
            <div class="ecrw-banner-left-detial-mode-title">
                {{ schoolsection.dictname}}{{ subject.dictname }}
            </div>
            <div class="ecrw-banner-left-detial-mode-content">
                <table style="width:100%;">
                    <tr>
                        <td class="ecrw-banner-left-tdl">年级：</td>
                        <td style="position:relative;padding-right:30px;">
                            <div :class="{ 'collapsed':iscollapsed[0].value, 'uncollapsed':!iscollapsed[0].value }">
                                <div ref="content1">
                                    <a ref="handler1" :class="{ 'ecrw-banner-left-tdl-up':iscollapsed[0].value, 'ecrw-banner-left-tdl-down':!iscollapsed[0].value }" @click="toggle(0)"></a>
                                    <a href="teaching" class="ecrw-banner-left-tda" v-for="(grade,idx) in grades" :key="idx" :data="grade" @click="onDetail(schoolsection.dictvalue, subject.dictvalue, grade.dictvalue, '', '')" target="_blank">
                                        {{ grade.dictname }}
                                    </a>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td class="ecrw-banner-left-tdl">版本：</td>
                        <td style="position:relative;padding-right:30px;">
                            <div :class="{ 'collapsed':iscollapsed[1].value, 'uncollapsed':!iscollapsed[1].value }">
                                <div ref="content2">
                                    <a ref="handler2" :class="{ 'ecrw-banner-left-tdl-up':iscollapsed[1].value, 'ecrw-banner-left-tdl-down':!iscollapsed[1].value }" @click="toggle(1)"></a>
                                    <a href="teaching" class="ecrw-banner-left-tda" v-for="(editionType,idx) in editionTypes" :key="idx" :data="editionType" @click="onDetail(schoolsection.dictvalue, subject.dictvalue, '', editionType.dictvalue, '')" target="_blank">
                                        {{ editionType.dictname }}
                                    </a>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td class="ecrw-banner-left-tdl">册别：</td>
                        <td style="position:relative;padding-right:30px;">
                            <div :class="{ 'collapsed':iscollapsed[2].value, 'uncollapsed':!iscollapsed[2].value }">
                                <div ref="content3">
                                    <a ref="handler3" :class="{ 'ecrw-banner-left-tdl-up':iscollapsed[2].value, 'ecrw-banner-left-tdl-down':!iscollapsed[2].value }" @click="toggle(2)"></a>
                                    <a href="teaching" class="ecrw-banner-left-tda" v-for="(bookModel,idx) in bookModels" :key="idx" :data="bookModel" @click="onDetail(schoolsection.dictvalue, subject.dictvalue, '', '', bookModel.dictvalue)" target="_blank">
                                        {{ bookModel.dictname }}
                                    </a>
                                </div>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    import ECRUtil from '../../../common/js/util';
    import { getNaviGradeList, getNaviBookModelList, getNaviEditionTypeList } from '../../../api/api';

    export default {
        props: {
            subject: Object,
            schoolsection: Object
        },
        data() {
            return {
                grades: [],
                editionTypes: [],
                bookModels: [],
                iscollapsed: [{value:true}, {value:true}, {value:true}],
                loginInfo: {
                    name: '',
                    userid: ''
                },
            }
        },
        watch: {
            subject(val, oldval) {
                this.load()
            },
            schoolsection(val, oldval) {
                this.load();
            }
        },
        methods: {
            toggle(index) {
                this.iscollapsed[index].value = !this.iscollapsed[index].value;
            },
            load() {
                this.iscollapsed = [{value:true}, {value:true}, {value:true}];
                this.loadGradeList();
                this.loadEditionTypeList();
                this.loadBookModelList();
            },
            loadGradeList() {
                let para = {
                    schoolsectionid: this.schoolsection?this.schoolsection.dictvalue:''
                };
                getNaviGradeList(para).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.grades = ECRUtil.composeSysDict(res.data.pageInfo.list);
                        let _this = this;
                        this.$nextTick(function() {
                            if ($(_this.$refs.content1).height() > 18) {
                                $(_this.$refs.handler1).show();
                            } else {
                                $(_this.$refs.handler1).hide();
                            }
                        });
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.grades = [];
                    }
                });
            },
            loadEditionTypeList() {
                let para = {
                    schoolsectionid: this.schoolsection?this.schoolsection.dictvalue:'',
                    subjectid: this.subject?this.subject.dictvalue:''
                };
                getNaviEditionTypeList(para).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.editionTypes = ECRUtil.composeSysDict(res.data.pageInfo.list);
                        let _this = this;
                        this.$nextTick(function() {
                            if ($(_this.$refs.content2).height() > 18) {
                                $(_this.$refs.handler2).show();
                            } else {
                                $(_this.$refs.handler2).hide();
                            }
                        });
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.editionTypes = [];
                    }
                });
            },
            loadBookModelList() {
                let para = {
                    schoolsectionid: this.schoolsection?this.schoolsection.dictvalue:'',
                    subjectid: this.subject?this.subject.dictvalue:''
                };
                getNaviBookModelList(para).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.bookModels = ECRUtil.composeSysDict(res.data.pageInfo.list);
                        let _this = this;
                        this.$nextTick(function() {
                            if ($(_this.$refs.content3).height() > 18) {
                                $(_this.$refs.handler3).show();
                            } else {
                                $(_this.$refs.handler3).hide();
                            }
                        });
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.bookModels = [];
                    }
                });
            },
            onDetail(schoolsectionid, subjectid, gradeid, editiontypeid, bookmodelid) {
                var user = localStorage.getItem('frontend-user');
                if (user != null) {
                    this.loginInfo.name = JSON.parse(user).realName;
                    this.loginInfo.userid = JSON.parse(user).userId;
                }
                let teachingNavi = {
                    schoolsectionid:schoolsectionid,
                    subjectid:subjectid,
                    gradeid:gradeid,
                    editiontypeid:editiontypeid,
                    bookmodelid:bookmodelid
                };
                localStorage.setItem('teaching-navigation' + this.loginInfo.userid, JSON.stringify(teachingNavi));
            }
        },
        created() {
            var user = localStorage.getItem('frontend-user');
            if (user != null) {
                this.loginInfo.name = JSON.parse(user).realName;
                this.loginInfo.userid = JSON.parse(user).userId;
            }
        },
    }
</script>

<style scoped>
    .ecrw-banner-left-tdl-down {
        position:absolute;
        right:0px;
        background: url(../../../../static/images/ecrw-arr-upper.png) no-repeat right center;
        height: 1em;
        width: 12px;
        cursor: pointer;
    }
    .ecrw-banner-left-tdl-up {
        position:absolute;
        right:0px;
        background: url(../../../../static/images/ecrw-arr-down.png) no-repeat right center;
        height: 1em;
        width: 12px;
        cursor: pointer;
    }
    .collapsed {
        width:100%;
        height:18px;
        overflow-y:hidden;
    }
    .uncollapsed {
        width:100%;
    }
    td {
        padding-top: 11px;
        padding-bottom: 11px;
    }
</style>