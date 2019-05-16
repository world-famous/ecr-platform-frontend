<template>
    <section>
        <div class="ecrw-in">
            <div class="ecrw-ready ">
                <ecr-breadcrumb 
                :steps="steps"
                style="width: calc(100% - 200px); float:left;"></ecr-breadcrumb>

                <ecr-grade
                    ref="courseTree"
                    @school-section-change="onSchoolSectionChange" 
                    @subject-change="onSubjectChange" 
                    @grade-change="onGradeChange" 
                    @book-model-change="onBookModelChange" 
                    :show-editiontype="true">
                </ecr-grade>
<!-- Author : GOD 2019-2-20 Bug ID: #792 -->

                <el-col :span="24" class="ecrm-content-panel">
                    
                    <el-form label-width="80px">

                        <el-col :span="8" >
                            <el-form-item label="发布时间:">
                                <el-date-picker type="date" v-model="filters.begin_time" style="width:40%;"></el-date-picker> -
                                <el-date-picker type="date" v-model="filters.end_time" style="width:40%;"></el-date-picker>
                            </el-form-item>
                        </el-col>

                        <el-col :span="14">
                            <div class="ecrw-ready-search-span">
                                <!-- GOD 2019-2-25 Bug ID: #903 -->
                                <a href="javascript:;" class="ecrw-ready-but" @mouseover="mouseOver">
                                <!-- GOD 2019-2-25 Bug ID: #903 -->
                                    选择学校
                                </a>
                                <span class="ecrw-ready-search-span_span">{{selDepart + " " + selCity + " " + selArea}}</span>
                                <div class="ecrw-ready-search-wrap">
                                    <div>
                                        省份:
                                        <select v-model="filters.departid" @change="getCityByDepart" class="ecrw-ready-select">
                                            <option label="全部" value></option>
                                            <option
                                                :label="item.areaname"
                                                :value="item.areaid"
                                                v-for="(item, idx) in departlist"
                                                :key="idx"
                                                :data="item"
                                            ></option>
                                        </select>
                                        城市:
                                        <select v-model="filters.cityid" @change="getAreaByCity"  class="ecrw-ready-select">
                                            <option label="全部" value></option>
                                            <option
                                                :label="item.areaname"
                                                :value="item.areaid"
                                                v-for="(item, idx) in cities"
                                                :key="idx"
                                                :data="item"
                                            ></option>
                                        </select>
                                        区域:
                                        <select v-model="filters.areaid" @change="getAreaIdByArea" class="ecrw-ready-select">
                                            <option label="全部" value></option>
                                            <option
                                                :label="item.areaname"
                                                :value="item.areaid"
                                                v-for="(item, idx) in areas"
                                                :key="idx"
                                                :data="item"
                                            ></option>
                                        </select>

                                    </div>
                                </div>
                            </div>
                        </el-col>

                        <el-col :span="2">
                            <el-button type="primary" v-on:click="search" id="searchBtn">查询</el-button>
                        </el-col>
                    

                    </el-form>
                </el-col>
<!-- Author : GOD 2019-2-20 Bug ID: #792 -->
                <div class="ecrw-ready-wrap" v-loading="labelLoading">
                    <!-- <div class="ecrw-ready-wrap-zhanbo">
                        <div class="ecrw-exam-tab clearfix">
                            <div class="ecrw-exam-search">
                                <span>
                                    共为您找到 <span class="ecrw-color-red">{{ total }} </span>个课件包
                                </span>
                            </div>               
                        </div>
                    </div> -->

                    <div class="ecrw-exam-content">
                        <div class="ecrw-exam-content-wrap clearfix">
                            <ecr-high-resource :goods="item" :path="onelabel" v-for="(item, idx) in twoLabelList" :key="idx" :data="item"></ecr-high-resource>
                            <!-- <ecr-high-resource :goods="item" :path="onelabel" v-for="(item, idx) in twoLabelList" :key="idx" :data="item"></ecr-high-resource> -->
                        </div>
                        <my-pagination @current-change="onChangePage" :page="page" :page-size="page_size" :total="total"></my-pagination>
                        <img src="static/images/ecrw-empty-data-resource.png" :style="{ width:(imageSize.width) + 'px', height:(imageSize.height) + 'px' }" v-if="twoLabelList.length==0">
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import { getAreasByParent, getTwoLabelList, getOneLabelList } from '../../api/api';
    import ECRUtil from '../../common/js/util';
    
    export default {
        data() {
            return {
                ECRUtil:ECRUtil,
                onelabel:'',
                twoLabelList:[],
                selectedItems: {
                    subjectid: '',
                    schoolsectionid: '',
                    gradeid: '',
                    bookmodelid: ''
                },
                page_size: 10,
                page: 1,
                total: 0,
                steps:[],
                departlist: [],
                cities: [],
                areas: [],
                curArea: null,
                last_call: 0,
                imageSize: {
                    width: 0,
                    height: 0
                },
                filters: {
                    begin_time: "",
                    end_time : "",
                    departid: "",
                    cityid: "",
                    areaid: "",
                },
                areaid: "",
                labelLoading: false,
                selDepart : "",
                selCity : "", 
                selArea : ""
            }
        },
        methods: {
            load(calltime) {
                this.steps = [
                    {
                        title:'首页',
                        url:'/home'
                    }
                ];
                let onelabelName = localStorage.getItem('onelabel');
                if (typeof onelabelName !== "undefined") {
                    this.steps.push({
                        title: onelabelName,
                        url: 'javascript:;'
                    });
                }

                if (this.filters.begin_time != "" && this.filters.end_time != "") {
                    if (
                    new Date(this.filters.begin_time) > new Date(this.filters.end_time)
                    ) {
                    this.$message({
                        message: "查询结束时间不得大于开始时间。",
                        type: "error"
                    });
                    return;
                    }
                }

                let param = {
                    numPerPage:this.page_size,
                    pageNo:this.page,
                    parentlabelid: this.onelabel,
                    schoolsectionid: this.selectedItems.schoolsectionid,
                    subjectid: this.selectedItems.subjectid,
                    gradeid: this.selectedItems.gradeid,
                    bookmodelid: this.selectedItems.bookmodelid,
                    areaid: this.areaid,
                    lang: 'zh_CN'
                };

                if (this.filters.begin_time != "") {
                    param.begin_time = ECRUtil.formatDate.format(new Date(this.filters.begin_time));
                }
                if (this.filters.end_time != "") {
                    param.end_time = ECRUtil.formatDate.format(new Date(this.filters.end_time));
                }

                this.labelLoading = true;
                /// To get the onelabel title from id
                getOneLabelList({}).then((res) => {
                    if(res.data.serverResult.resultCode == '200') {
                        let onelabels = res.data.pageInfo.list;
                        let onelabel = onelabels.find((element) => {
                           return element.labelid === this.$route.params.oneLabel;
                        });
                        this.steps = [
                            {
                                title:'首页',
                                url:'/home'
                            },
                            {
                                title: onelabel['labelname'],
                                url:'javascript:;'
                            }
                        ];
                        
                    }
                });
                //////////////////////////////////////////////
                getTwoLabelList(param).then((res) => {
                    if (this.last_call != 0 && this.last_call > calltime) return;
                    this.last_call = calltime;

                    if (res.data.serverResult.resultCode == "200") {
                        this.twoLabelList = res.data.pageInfo.list;
                        this.total = res.data.pageInfo.total;

                        this.labelLoading = false;
                    } else {
                        this.labelLoading = false;
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.itemList = [];
                        this.total = 0;
                    }
                    this.imageSize.width = $('.ecrw-exam-content').width();
                    this.imageSize.height = 610;
                }).catch(() => {
                    this.labelLoading = false;
                    this.total = 0;
                    this.itemList = [];
                    
                    this.$message({
                        message: '加载失败!',
                        type: 'error'
                    });
                });
            },

            setSession() {
                localStorage.setItem('highnaviresource-navigation', JSON.stringify(this.selectedItems));
            },
            onChangePage(page) {
                this.page = page;
                this.load(new Date().getTime());
            },
            onSchoolSectionChange: function(val, byuser) {
                this.page = 1;
                this.selectedItems = val;
                if (byuser) this.setSession();
            },
            onSubjectChange: function(val, byuser) {
                this.page = 1;
                this.selectedItems = val;
                if (byuser) this.setSession();
            },
            onGradeChange: function(val, byuser) {
                this.page = 1;
                this.selectedItems = val;
                this.load(new Date().getTime());
                if (byuser) this.setSession();
            },
            onBookModelChange: function(val, byuser) {
                this.page = 1;
                this.selectedItems = val;
                this.load(new Date().getTime());
                if (byuser) this.setSession();
            },
            onAreaSelected(area) {
                this.curArea = area;
                this.load(new Date().getTime());
            },
            getCityByDepart(e) {
                
                if(this.filters.departid != "") {
                    getAreasByParent(this.filters.departid)
                    .then(res => {
                        if (res.data.serverResult.resultCode == "200") {
                        this.cities = res.data.pageInfo.list;
                        this.filters.cityid = "";
                        this.filters.areaid = "";
                        this.areas = [];
                        } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: "error"
                        });
                        this.cities = [];
                        }
                    })
                    .catch(() => {
                        this.cities = [];
                    });

                    if(this.filters.cityid == "")
                        this.areaid = this.filters.departid;

                    let selectedDepart = this.departlist.find((element) => element.areaid == e.target.value);

                    this.selDepart = selectedDepart.areaname;
                    this.selCity = "";
                    this.selArea = "";
                    
                } else {
                    this.filters.cityid = "";
                    this.filters.areaid = "";
                    this.filters.orgid = "";
                    this.cities = [];
                    this.areas = [];
                    this.areaid = "";

                    this.selDepart = "全部";
                    this.selCity = "";
                    this.selArea = "";
                }
            },
            getAreaByCity(e) {
                if (this.filters.cityid != "") {
                    getAreasByParent(this.filters.cityid)
                    .then(res => {
                        if (res.data.serverResult.resultCode == "200") {
                        this.areas = res.data.pageInfo.list;
                        this.filters.areaid = "";
                        } else {
                        this.areas = [];
                        }
                    })
                    .catch(() => {
                        this.areas = [];
                    });

                    if(this.filters.areaid == "")
                        this.areaid = this.filters.cityid;

                    let selectedCity = this.cities.find((element) => element.areaid == e.target.value);

                    this.selCity = selectedCity.areaname;
                    this.selArea = "";
                } else {
                    this.filters.areaid = "";
                    this.areas = [];
                    this.areaid = this.filters.departid;
                    this.selCity = "";
                    this.selArea = "";
                }
            },
            getAreaIdByArea(e) {
                let prevSelSchool = this.selSchool;
                if(this.filters.areaid != "") {
                    this.areaid = this.filters.areaid;

                    let selectedArea = this.areas.find((element) => element.areaid == e.target.value);

                    this.selArea = selectedArea.areaname;
                } else {
                    this.areaid = this.filters.cityid;
                    this.selArea = "";
                }
            },
            getDepartlist() {
                getAreasByParent("-1")
                .then(res => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.departlist = res.data.pageInfo.list;
                    } else {
                        this.$message({
                        message: res.data.serverResult.resultMessage,
                        type: "error"
                        });
                        this.departlist = [];
                    }
                    })
                .catch(() => {
                    this.departlist = [];
                });
            },
            search() {
                this.load(new Date().getTime());
            },
            closeSpan() {
                $(".ecrw-ready-but").removeClass("ecrw-ready-but-sel");
                $(".ecrw-ready-search-wrap").hide();
            },
            // GOD 2019-2-25 Bug ID: #903
            mouseOver() {
                $(".ecrw-ready-but").addClass("ecrw-ready-but-sel");
                $(".ecrw-ready-search-wrap").show();
            }
            // GOD 2019-2-25 Bug ID: #903
        },
        created() {
            this.onelabel = this.$route.params.oneLabel;
            this.getDepartlist();
        },
        mounted() {
            let highNavi = localStorage.getItem('highnaviresource-navigation');
            if (highNavi != null && highNavi != '') {
                highNavi = JSON.parse(highNavi);
                if (highNavi.schoolsectionid == '' || 
                    highNavi.schoolsectionid == undefined) {
                    highNavi.schoolsectionid = 'PRIMARY_SCHOOL'; // 小学
                }
                this.$refs.courseTree.setNavigation(highNavi);
            } else {
                highNavi = {
                    schoolsectionid: 'PRIMARY_SCHOOL' // 小学
                };
                this.$refs.courseTree.setNavigation(highNavi);
            }
        }
    }
    
</script>

<style scoped lang="scss">
    @import '~scss_vars';
    .ecrw-ready-search-span {
        padding-top: 10px;
    }
    .ecrw-ready-search-span_span {
        padding-left: 20px;
    }
    .ecrw-ready-search-wrap {
        top: 35px !important;
    }

</style>
<!-- Author : GOD 2019-2-20 Bug ID: #792 -->