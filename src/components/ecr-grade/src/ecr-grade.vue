<template>
	<section>
        <div class="ecrw-ready-banner">
    		<table style="display: table;" v-show="toggle" v-loading="listLoading">
                <tbody>
                    <tr v-if="showSchoolsection">
                        <td class="ecrw-ready-banner-tdl">
                            学段：
                        </td>
                        <td style="padding:6px 0px">
                            <ecr-button-group ref="schoolsection" :items="schoolSections" @button-click="onChangeSchoolSection" value="dictname"></ecr-button-group>
                        </td>
                    </tr>
                    <tr v-if="showSubject">
                        <td class="ecrw-ready-banner-tdl">
                            学科：
                        </td>
                        <td style="padding:6px 0px">
                            <ecr-button-group ref="subject" :items="subjects" @button-click="onChangeSubject" value="dictname"></ecr-button-group>
                        </td>
                    </tr>
                    <tr v-if="showGrade">
                        <td class="ecrw-ready-banner-tdl">
                            年级：
                        </td>
                        <td style="padding:6px 0px">
                            <ecr-button-group ref="grade" :items="grades" @button-click="onChangeGrade" value="dictname"></ecr-button-group>
                        </td>
                    </tr>
                    <tr v-if="showEditiontype">
                        <td class="ecrw-ready-banner-tdl">
                            版本：
                        </td>
                        <td style="padding:6px 0px">
                            <ecr-button-group ref="editiontype" :items="editionTypes" @button-click="onChangeEditionType" value="dictname"></ecr-button-group>
                        </td>
                    </tr>
                    <tr v-if="showBookmodel">
                        <td class="ecrw-ready-banner-tdl">
                            册别： 
                        </td>
                        <td style="padding:6px 0px">
                            <ecr-button-group ref="bookmodel" :items="bookModels" @button-click="onChangeBookModel" value="dictname"></ecr-button-group>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="ecrw-ready-banner-down">
                <a href="javascript:;" :class="{ 'ecrw-ready-banner-toggle':!toggle }" @click="toggleBanner">{{ toggleText }}</a>
            </div>
        </div>
	</section>
</template>

<script>
    import ECRUtil from '../../../common/js/util';
    import { getSchoolSectionList, getSubjectList, getNaviGradeList, getNaviBookModelList, getNaviEditionTypeList } from '../../../api/api';
    
	export default {
        props: {
            showSchoolsection: {
                type: Boolean,
                default: true,
                required: false
            },
            showSubject: {
                type: Boolean,
                default: true,
                required: false
            },
            showGrade: {
                type: Boolean,
                default: true,
                required: false
            },
            showEditiontype: {
                type: Boolean,
                default: true,
                required: false
            },
            showBookmodel: {
                type: Boolean,
                default: true,
                required: false
            }
        },
		data() {
			return {
                navigation: {
                    schoolsectionid:'',
                    subjectid:'',
                    gradeid:'',
                    editiontypeid:'',
                    bookmodelid:''
                },

                schoolSections: [],
                subjects: [],
                grades: [],
                editionTypes: [],
                bookModels: [],

                schoolSectionCallTime:0,
                subjectCallTime:0,
                gradeCallTime:0,
                editionTypeCallTime:0,
                bookModelCallTime:0,

                selectedSchoolSection:{ dictvalue:'', dictname:'' },
                selectedSubject:{ dictvalue:'', dictname:'' },
                selectedEditionType:{ dictvalue:'', dictname:'' },

                toggle: true,
                listLoading: false
			}
		},
		methods: {
            load(){
                this.loadSchoolSectionList(new Date().getTime());
                this.loadSubjectList(new Date().getTime());
                this.loadGradeList(new Date().getTime());
                this.loadEditionTypeList(new Date().getTime());
                this.loadBookModelList(new Date().getTime());
            },
            loadSchoolSectionList(calltime) {
                getSchoolSectionList({}).then((res) => {
                    if (this.schoolSectionCallTime != 0 && this.schoolSectionCallTime > calltime) return;
                    this.schoolSectionCallTime = calltime;

                    if (res.data.serverResult.resultCode == "200") {
                        this.schoolSections = ECRUtil.composeSysDict(res.data.pageInfo.list);
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.schoolSections = [];
                    }

                    let _this = this;
                    _this.$nextTick(function() {
                        if (_this.navigation.schoolsectionid != '' && _this.$refs.schoolsection) {
                            _this.$refs.schoolsection.set(_this.navigation.schoolsectionid);
                        }
                    });
                });
            },
            loadSubjectList(calltime) {
                let para = {
                    schoolsectionid: this.selectedSchoolSection.dictvalue
                };
                getSubjectList(para).then((res) => {
                    if (this.subjectCallTime != 0 && this.subjectCallTime > calltime) return;
                    this.subjectCallTime = calltime;

                    if (res.data.serverResult.resultCode == "200") {
                        this.subjects = ECRUtil.composeSysDict(res.data.pageInfo.list);
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.subjects = [];
                    }
                    let _this = this;
                    _this.$nextTick(function() {
                        if (_this.navigation.subjectid != '' && _this.$refs.subject) {
                            _this.$refs.subject.set(_this.navigation.subjectid);
                        }
                    });
                });
            },
            loadGradeList(calltime) {
                let para = {
                    schoolsectionid: this.selectedSchoolSection.dictvalue
                };
                getNaviGradeList(para).then((res) => {
                    if (this.gradeCallTime != 0 && this.gradeCallTime > calltime) return;
                    this.gradeCallTime = calltime;

                    if (res.data.serverResult.resultCode == "200") {
                        this.grades = ECRUtil.composeSysDict(res.data.pageInfo.list);
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.grades = [];
                    }
                    let _this = this;
                    _this.$nextTick(function() {
                        if (_this.navigation.gradeid != '' && _this.$refs.grade) {
                            _this.$refs.grade.set(_this.navigation.gradeid);
                        }
                    });
                });
            },
            loadEditionTypeList(calltime) {
                let para = {
                    schoolsectionid: this.selectedSchoolSection.dictvalue,
                    subjectid: this.selectedSubject.dictvalue
                };
                getNaviEditionTypeList(para).then((res) => {
                    if (this.editionTypeCallTime != 0 && this.editionTypeCallTime > calltime) return;
                    this.editionTypeCallTime = calltime;

                    if (res.data.serverResult.resultCode == "200") {
                        this.editionTypes = ECRUtil.composeSysDict(res.data.pageInfo.list);
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.editionTypes = [];
                    }
                    let _this = this;
                    _this.$nextTick(function() {
                        if (_this.navigation.editiontypeid != '' && _this.$refs.editiontype) {
                            _this.$refs.editiontype.set(_this.navigation.editiontypeid);
                        }
                    });
                });
            },
            loadBookModelList(calltime) {
                let para = {
                    schoolsectionid: this.selectedSchoolSection.dictvalue,
                    subjectid: this.selectedSubject.dictvalue,
                    editiontypeid: this.selectedEditionType.dictvalue
                };
                this.listLoading = true;
                getNaviBookModelList(para).then((res) => {
                    if (this.bookModelCallTime != 0 && this.bookModelCallTime > calltime) return;
                    this.bookModelCallTime = calltime;

                    if (res.data.serverResult.resultCode == "200") {
                        this.bookModels = ECRUtil.composeSysDict(res.data.pageInfo.list);
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.bookModels = [];
                    }
                    let _this = this;
                    _this.$nextTick(function() {
                        if (_this.navigation.bookmodelid != '' && _this.$refs.bookmodel) {
                            _this.$refs.bookmodel.set(_this.navigation.bookmodelid);
                        }
                    });
                    this.listLoading = false;
                });
            },
            onChangeSchoolSection: function(val, byuser) {
                if (val == null) {
                    val = { dictvalue:'', dictname:'' };
                }
                this.selectedSchoolSection = val;
                if (byuser) {
                    this.navigation.schoolsectionid = val.dictvalue;
                    this.navigation.subjectid = '';
                    this.navigation.gradeid = '';
                }
                this.$emit('school-section-change', this.navigation, byuser);
                this.loadSubjectList(new Date().getTime());
                this.loadGradeList(new Date().getTime());
                this.onChangeSubject({dictvalue:''}, byuser);
            },
            onChangeSubject: function(val, byuser) {
                if (val == null) {
                    val = { dictvalue:'', dictname:'' };
                }
                this.selectedSubject = val;
                if (byuser) {
                    this.navigation.subjectid = val.dictvalue;
                    this.navigation.editiontypeid = '';
                }
                this.$emit('subject-change', this.navigation, byuser);
                this.loadEditionTypeList(new Date().getTime());
                this.onChangeEditionType({dictvalue:''}, byuser);
            },
            onChangeEditionType: function(val, byuser) {
                if (val == null) {
                    val = { dictvalue:'', dictname:'' };
                }
                this.selectedEditionType = val;
                if (byuser) {
                    this.navigation.editiontypeid = val.dictvalue;
                    this.navigation.bookmodelid = '';
                }
                this.$emit('edition-type-change', this.navigation, byuser);
                this.loadBookModelList(new Date().getTime());
                this.onChangeBookModel({dictvalue:''}, byuser);
            },
            onChangeBookModel: function(val, byuser) {
                if (val == null) {
                    val = { dictvalue:'', dictname:'' };
                }
                if (byuser) {
                    this.navigation.bookmodelid = val.dictvalue;
                }
                this.$emit('book-model-change', this.navigation, byuser);
            },
            onChangeGrade: function(val, byuser) {
                if (val == null) {
                    val = { dictvalue:'', dictname:'' };
                }
                if (byuser) {
                    this.navigation.gradeid = val.dictvalue;
                }
                this.$emit('grade-change', this.navigation, byuser);
            },
            toggleBanner:function() {
                this.toggle = !this.toggle;
            },
            setNavigation(navigation) {
                this.navigation = navigation;
                if (this.navigation.schoolsectionid == undefined) {
                    this.$set(this.navigation, 'schoolsectionid', '');
                }
                if (this.navigation.subjectid == undefined) {
                    this.$set(this.navigation, 'subjectid', '');
                }
                if (this.navigation.gradeid == undefined) {
                    this.$set(this.navigation, 'gradeid', '');
                }
                if (this.navigation.editiontypeid == undefined) {
                    this.$set(this.navigation, 'editiontypeid', '');
                }
                if (this.navigation.bookmodelid == undefined) {
                    this.$set(this.navigation, 'bookmodelid', '');
                }
                this.load();
            }
		},
        computed: {
            toggleText() {
                if (this.toggle) return "收起选项";
                return "展开选项";
            }
        },
		created() {
            if (this.$route.path.startsWith('/search')) this.load();
		}
	}
</script>
<style scoped lang="scss">
    @import '~scss_vars';

</style>