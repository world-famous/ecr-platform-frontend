<template>
    <section>
        <!-- hot banner -->
        <div class="ecrw-hot-banner" v-bind:style="{'background': 'url('+hotBannerBackground+')' + 'no-repeat center'}">
        </div>
        <!-- hot banner end-->

        <!-- hot content -->
        <div
            class="ecrw-hot-content"
            v-loading="isLoading"
            style="min-height: 300px"
        >
            <div class="ecrw-in ecrw-hot-in">
                <div class="ecrw-hot-wrap" v-for="(data, key, index) in groupedList" :key="index" :data="data">
                    <div class="ecrw-hot-title">
                        <div class="ecrw-hot-title-in">
                            {{ key }}
                        </div>
                    </div>
                    <div class="ecrw-hot-det">
                        <ul class="clearfix">
                            <li class="ecrw-hot-det-li" v-for="(twoLabel, idx) in data" :key="idx" :data="twoLabel">
                                <a :href="'package/' + onelabel + '/'  + twoLabel.labelid" @click="onTwoLabel(twoLabel)" target="_blank">
                                    <img :src="ECO_MEDIA_PATH + twoLabel.localpath"/>
                                </a>
                                <div class="ecrw-hot-det-name">
                                    <span class="ecrw-hot-det-name-span">{{ twoLabel.labelname }}</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <!-- hot content end-->
    </section>
</template>

<script>
    import ECRUtil from '../../common/js/util';
    import { getTwoLabelList, getSchoolSectionList, getNaviGradeList, getLabelById } from '../../api/api';

    export default {
        data() {
            return {
                twoLabelList:[],
                onelabel:'',
                ECO_MEDIA_PATH: ECO_MEDIA_PATH,
                groupedList: [],
                schoolSectionList: [],
                gradeList: [],
                isLoadingLabel: true,
                isLoadingSchoolSection: true,
                isLoadingGrade: true,
                hotBannerBackground: ''
            }
        },
        methods: {
            load() {

                /**
                 * Get Current Label
                 *
                 *
                 */
                getLabelById(this.onelabel).then((res) => {
                    if (res.data.serverResult.resultCode === "200") {
                        this.hotBannerBackground = ECO_MEDIA_PATH + res.data.responseEntity.localpath;
                    }
                });

                let param = { "parentlabelid": this.onelabel };
                /**
                 *  Get two level Label list
                */
                this.isLoadingLabel = true;
                getTwoLabelList(param).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.twoLabelList = res.data.pageInfo.list;
                        this.isLoadingLabel = false;
                    } else {
                        this.isLoadingLabel = false;
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.twoLabelList = [];
                    }
                }).catch(() => {
                    this.isLoadingLabel = false;
                    this.twoLabelList = [];
                    
                    this.$message({
                        message: '加载失败!',
                        type: 'error'
                    });
                });

                /**
                 * Get school sections
                 */

                this.isLoadingSchoolSection = true;
                getSchoolSectionList({}).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.schoolSectionList = ECRUtil.composeSysDict(res.data.pageInfo.list);
                        this.isLoadingSchoolSection = false;
                    } else {
                        this.schoolSectionList = [];
                        this.isLoadingSchoolSection = false;
                    }
                }).catch(() => {
                    this.isLoadingSchoolSection = false;
                });

                /*
                Get grade list
                 */
                this.isLoadingGrade = true;
                let para = {
                    schoolsectionid: ""
                };
                getNaviGradeList(para).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.gradeList = ECRUtil.composeSysDict(res.data.pageInfo.list);
                        this.isLoadingGrade = false;
                    } else {
                        this.gradeList = [];
                        this.isLoadingGrade = false;
                    }
                }).catch(() => {
                    this.isLoadingGrade = false;
                });
            },
            onTwoLabel(twoLabel) {
                localStorage.setItem('twolabel', twoLabel.labelname);
            }
        },
        created() {
            this.onelabel = this.$route.params.onelabel;
            this.load();
        },
        computed: {
            isLoading: function() {
                return this.isLoadingGrade || this.isLoadingSchoolSection || this.isLoadingLabel
            }
        },
        watch : {
            isLoading: function (value) {
                // Loading all information is done
                let groupedList = {};
                if (value === false) {
                    this.twoLabelList.forEach((element) => {

                        let gradeLabel = this.gradeList.find((el) => {
                            let dicArray = el.dictvalue.split(',');
                            return !!(dicArray && dicArray.includes(element.gradeid));
                        });

                        let schoolSection = this.schoolSectionList.find((el) => {
                            return el.dictvalue === element.schoolsectionid
                        });
                        let gradeLabelText = '';
                        let schoolSectionText = '';
                        if (typeof gradeLabel !== "undefined") {
                             gradeLabelText = gradeLabel.dictname;
                        }
                        if (typeof schoolSection !== "undefined") {
                            schoolSectionText = schoolSection.dictname;
                        }

                        let propertyName = '';
                        if (typeof gradeLabel !== "undefined" && typeof schoolSection !== "undefined") {
                            propertyName = schoolSectionText + ' ' + gradeLabelText;
                        } else {
                            propertyName = "其他"
                        }

                        if (typeof groupedList[propertyName] === "undefined") {
                            groupedList[propertyName] = [];
                        }
                        groupedList[propertyName].push(element);
                    });
                    this.groupedList = groupedList;
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    @import '~scss_vars';

    section {
        margin-top: -20px;
    }
</style>