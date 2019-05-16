<template>
    <section @mouseover="hideSubPanel">
         <!-- left bar -->
         <div class="ecrw-leftbar">
             <ul>
                 <li class="ecrw-leftbar-slide">
                     <a href="javascript:;" @click="goSelectedRouter('ecrw-header')" :class="{'ecrw-leftbar-selected': selectedId == 'ecrw-header'}">
                        回顶端
                     </a>
                 </li>
                 <li class="ecrw-leftbar-slide">
                     <a href="javascript:;" @click="goSelectedRouter('ecrw-famous')" :class="{'ecrw-leftbar-selected': selectedId == 'ecrw-famous'}">
                        名师名校
                     </a>
                 </li>
                 <li class="ecrw-leftbar-slide">
                     <a href="javascript:;" @click="goSelectedRouter('ecrw-anays')" :class="{'ecrw-leftbar-selected': selectedId == 'ecrw-anays'}">
                        同步资源
                     </a>
                 </li>
                 <li class="ecrw-leftbar-slide">
                     <a href="javascript:;" @click="goSelectedRouter('ecrw-shijuan')" :class="{'ecrw-leftbar-selected': selectedId == 'ecrw-shijuan'}">
                        试卷
                     </a>
                 </li>
                 <li class="ecrw-leftbar-slide">
                     <a href="javascript:;" @click="goSelectedRouter('ecrw-tegong')" :class="{'ecrw-leftbar-selected': selectedId == 'ecrw-tegong'}">
                        特供专题
                     </a>
                 </li>
                 <li class="ecrw-leftbar-slide">
                     <a href="javascript:;" @click="goSelectedRouter('ecrw-class')" :class="{'ecrw-leftbar-selected': selectedId == 'ecrw-class'}">
                        课程
                     </a>
                 </li>
                 <li class="ecrw-leftbar-slide">
                     <a href="javascript:;" @click="goSelectedRouter('ecrw-hot')" :class="{'ecrw-leftbar-selected': selectedId == 'ecrw-hot'}">
                        最新最热
                     </a>
                 </li>
             </ul>
        </div>
        <!-- left bar -->

        <!-- banner -->
        <div class="ecrw-banner" ref="ecrw-header">
            <div class="ecrw-in">
                <div class="ecrw-banner-left" @mouseover="hideSubPanel">
                    <div class="ecrw-banner-left-detial">
                        <ecr-subject-navpanel v-show="subPanelVisible" :schoolsection="curSchoolSection" :subject="curSubject" :style="{ top:subPanelTop + 'px' }">
                        </ecr-subject-navpanel>
                    </div>
                    <div class="ecrw-banner-left-title" style="position:relative">
                        <span>
                            学科资源导航
                        </span>
                        <ecr-panel-item
                            :items="schoolSections"
                            :linear="true"
                            save-state="navigation-schoolsection"
                            default-state="PRIMARY_SCHOOL"
                            item-title-key="dictname"
                            item-id-key="dictvalue"
                            @item-click="onSchoolSectionSelected"
                            @show="onChoosePanelVisible"
                            style="position:absolute; right: 10px; top: 0px;">
                        </ecr-panel-item>
                    </div>
                    <div class="ecrw-banner-left-list scroll vscroll" ref="leftbanner" v-loading="subjectLoading">
                        <ul>
                            <li class="ecrw-banner-left-li"            
                                v-for="(subject, idx) in subjects" 
                                :key="idx" 
                                :data="subject" 
                                @mouseover.stop="showSubPanel($event, subject)">
                                <a href="javascript:;" :class="{ 'highlighted':curSubject==subject }">{{ subject.dictname }}</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="ecrw-banner-right">
                    <ecr-statistics-goods :totalCount="totalCount" :weekCount="weekCount" :todayCount="todayCount" v-loading="statisticLoading"></ecr-statistics-goods>
                    <div class="ecrw-banner-swiper">
                        <a href="javascript:;" class="ecrw-swiper-left"></a>
                        <a href="javascript:;" class="ecrw-swiper-right"></a>
                        <div class="swiper-container ecrw-swiper">
                            <div class="swiper-wrapper">
                                <div class="swiper-slide" v-for="(advert, idx) in advertList" :key="idx" :data="advert">
                                    <a :href="advert.adverturl==''?'javascript:;':advert.adverturl" target="_blank">
                                        <img :src="ECO_MEDIA_PATH + advert.imagepath"/>
                                    </a>
                                </div>
                            </div>
                            <div class="pagination1"></div>
                        </div>
                    </div>
                    <div class="ecrm-banner-pic scroll hscroll">
                        <ul style="width:2000px">
                            <li class="ecrm-banner-li-pic" v-for="(bannerOne,idx) in bannerOneLabelList" :key="idx" :data="bannerOne">
                                <a :href="getPkgUrl(bannerOne)" @click="goPackage(bannerOne)" target="_blank">
                                    <img :src="ECO_MEDIA_PATH + bannerOne.labelData.localpath"/>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <!-- banner end-->

        <!--  content  -->
        <div class="ecrw-content">
            <div class="ecrw-in">
                <!-- 名校名师资源 -->
                <div class="ecrw-content-wrap"  ref="ecrw-famous">
                    <div class="ecrw-content-title">
                        <ecr-content-subtitle
                            :items="areas"
                            :default="curArea"
                            :limit.native="10"
                            itemTitleKey="areaname"
                            more-url="javascript:;"
                            @item-click="onFamousAreaSelected">
                        </ecr-content-subtitle>
                        名校名师资源
                    </div>
                    <div class="ecrw-content-det clearfix" v-loading="topThreeSchoolloading">
                        <div class="ecrw-content-left">
                            <div class="ecrw-content-subcont">
                                <div class="ecrw-content-left-title">
                                    <ul>
                                        <li class="ecrw-content-left-title-ch">推荐</li>
                                        <li class="ecrw-content-left-title-en">RECOMMEND</li>
                                    </ul>
                                </div>
                                <div class="swiper-container ecrw-swiper2">
                                    <div class="swiper-wrapper">
                                        <div class="swiper-slide" v-for="(school,idx) in topThreeSchools" :key="idx" :data="school">
                                            <a :href="'famous/' + school.orgid" target="_blank">
                                                <img :src="ECO_MEDIA_PATH + (school.photopath? school.photopath:defaultSchoolPhotoPath)" style="width:180px;height:250px;"/>
                                            </a>
                                        </div>
                                    </div>
                                    <div class="pagination2"></div>
                                </div>
                            </div>
                        </div>

                        <div class="ecrw-content-center">
                            <ul class="clearfix">
                                <li class="ecrw-content-center-li" v-for="(teacher,idx) in famousTeachers" :key="idx" :data="teacher">
                                    <ul>
                                        <li class="ecrw-center-son-pic">
                                            <a :href="'famous/teacher/' + teacher.userid" target="_blank">
                                                <img :src="ECO_MEDIA_PATH + (teacher.photopath? teacher.photopath: defaultTeacherPhotoPath)" style="width: 100%; height: 100%;"/>
                                            </a>
                                        </li>
                                        <li class="ecrw-center-son-name">
                                            <span class="ecrw-center-span">{{ getShareRange(teacher) }}名师</span>
                                            {{ teacher.realname }}&nbsp;
                                        </li>
                                        <li class="ecrw-center-num">课堂实录：{{ teacher.goodscount }}份</li>
                                    </ul>
                                </li>
                            </ul>
                        </div>

                        <div class="ecrw-content-right">
                            <div class="ecrw-content-title ecrw-content-title-sm">
                                名校
                            </div>

                            <div class="ecrw-right-wrap">
                                <ul>
                                    <li class="ecrw-right-li" v-for="(school,idx) in famousSchools" :key="idx" :data="school">
                                        <div class="ecrw-right-name"><a :href="'famous/' + school.orgid" target="_blank">{{ school.orgname }}</a></div>
                                        <div class="ecrw-right-desc">百强校 共 <span>{{ school.goodscount }}</span> 份资源</div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 名校名师资源  end-->

                <!-- 同步资源 -->
                <div class="ecrw-content-wrap"  ref="ecrw-anays">
                    <div class="ecrw-content-title">
                        <div class="ecrw-content-subtitle">
                            <a href="teaching" class="ecrw-subtitle-href ecrw-subtitle-more" target="_blank">
                                更多> 
                            </a>
                        </div>
                        同步资源
                    </div>
                    <div class="ecrw-content-det clearfix" v-loading="teachDataLoading">
                        <div class="ecrw-content-left1" v-if="teachData.length>0">
                            <ul class="clearfix" v-if="teachData.length>1">
                                <li class="ecrw-content-center-li-new1" v-for="i in Math.min(teachData.length-1, 8)" :key="i" :data="i" >
                                    <a :href="'resource/' + teachData[i].resource.contentid" target="_blank" @click="setItems1(1)">
                                        <ul>
                                            <li class="ecrw-center-son-pic" style="width: 210px" :class="thumbpath">
                                                <img :src="teachData[i].resource.thumbnailpath" style="width:100%;height:100%;" v-if=" teachData[i].resource.thumbnailpath != null"/>
                                            </li>
                                            <li class="ecrw-center-num" style="text-align:center">
                                                <a :href="'resource/' + teachData[i].resource.contentid" target="_blank" @click="setItems1(1)">{{ teachData[i].resource.name }}</a>
                                            </li>
                                        </ul>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div class="ecrw-content-right">
                            <ecr-shortcut-panel2 :items="teachData" item-title-key="name" item-type-key="contenttype" item-id-key="contentid" step="同步资源">
                            </ecr-shortcut-panel2>
                        </div>
                    </div>
                </div>
                <!-- 同步资源 end -->

                <!-- 试卷 -->
                <div class="ecrw-content-wrap"  ref="ecrw-shijuan">
                    <div class="ecrw-content-title">
                        <div class="ecrw-content-subtitle">
                            <a href="answer" class="ecrw-subtitle-href ecrw-subtitle-more" target="_blank">
                                更多> 
                            </a>
                        </div>
                        试卷
                    </div>
                    <div class="ecrw-content-det clearfix" v-loading="answerLabelLoading">
                        <div class="ecrw-content-left1" v-if="answerLabels.length>0">
                            <ul class="clearfix" v-if="answerLabels.length>1">
                                <li class="ecrw-content-center-li-new1" v-for="i in Math.min(answerLabels.length-1, 8)" :key="i" :data="i">
                                    <a :href="'resource/' + answerLabels[i].resource.contentid" target="_blank" @click="setItems1(2)">
                                        <ul>
                                            <li class="ecrw-center-son-pic" style="width: 210px" :class="answerLabels_class[i].name">
                                                <img :src="answerLabels_class[i].path.localpath" style="width:100%;height:100%;" v-if="answerLabels_class[i].path.localpath != ''"/>
                                            </li>
                                            <li class="ecrw-center-num" style="text-align:center">
                                                <a :href="'resource/' + answerLabels[i].resource.contentid" target="_blank" @click="setItems1(2)">{{ answerLabels[i].resource.name }}</a>
                                            </li>
                                        </ul>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <!-- </div> -->
                        <div class="ecrw-content-right">
                            <ecr-shortcut-panel2 :items="answerData" item-title-key="name" item-type-key="contenttype" item-id-key="contentid" step="同步资源">
                            </ecr-shortcut-panel2>
                        </div>
                    </div>
                </div>
                <!-- 试卷 end -->

                <!-- 特供专题 -->
                <div class="ecrw-content-wrap"  ref="ecrw-tegong">
                    <div class="ecrw-content-title">
                        <div class="ecrw-content-subtitle">
                            <a href="special" class="ecrw-subtitle-href ecrw-subtitle-more" target="_blank">
                                更多> 
                            </a>
                        </div>
                        特供专题
                    </div>
                    <div class="ecrw-content-det clearfix" v-loading="specialLabelLoading">
                        <div class="ecrw-content-left" v-if="specialLabels.length>0">
                            <div class="ecrw-content-subcont ecrw-content-statc">
                                <a :href="'special/' + specialLabels[0].themeData.themeid" target="_blank">
                                    <img :src="ECO_MEDIA_PATH + specialLabels[0].themeData.logopath" style="width:100%;height:100%;"/>
                                </a>
                            </div>
                            <div class="ecrw-content-subcont-statc-des">{{ specialLabels[0].themeName }}</div>
                        </div>
                        <div class="ecrw-content-center ecrw-content-center-resource">
                            <ul class="clearfix" v-if="specialLabels.length>1">
                                <li class="ecrw-content-center-li" v-for="i in Math.min(specialLabels.length-1, 6)" :key="i" :data="i">
                                    <ul>
                                        <li class="ecrw-center-son-pic">
                                            <a :href="'special/' + specialLabels[i].themeData.themeid" target="_blank">
                                                <img :src="ECO_MEDIA_PATH + specialLabels[i].themeData.logopath" style="width:100%;height:100%;"/>
                                            </a>
                                        </li>
                                        <li class="ecrw-center-num">{{ specialLabels[i].themeName }}：{{ specialLabels[i].themeData.goodscount }}份</li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                        <div class="ecrw-content-right">
                            <ecr-shortcut-panel2 :items="specialData" item-title-key="name" item-type-key="contenttype" item-id-key="contentid" step="特供专题">
                            </ecr-shortcut-panel2>
                        </div>
                    </div>
                </div>
                <!-- 特供专题 end -->

                <!-- 课程 -->
                <div class="ecrw-content-wrap"  ref="ecrw-class">
                    <div class="ecrw-content-title">
                        <div class="ecrw-content-subtitle">
                            <a href="course" class="ecrw-subtitle-href ecrw-subtitle-more" target="_blank">
                                更多> 
                            </a>
                        </div>
                        课程
                    </div>
                    <div class="ecrw-content-det clearfix" v-loading="courseLabelLoading">
                        <div class="ecrw-content-left" v-if="courseLabels.length>0">
                            <div class="ecrw-content-subcont ecrw-content-statc">
                                <a :href="getCourseURL(courseLabels[0][0].label)" target="_blank">
                                    <img :src="ECO_MEDIA_PATH + courseLabels[0][0].labelData.localpath" style="width:100%;height:100%;"/>
                                </a>
                            </div>
                            <div class="ecrw-content-subcont-statc-des">{{ courseLabels[0][0].label }}</div>
                        </div>
                        <div class="ecrw-content-center ecrw-content-center-resource">
                            <ul class="clearfix" v-if="courseLabels.length>1">
                                <li class="ecrw-content-center-li" v-for="i in Math.min(courseLabels.length-1, 6)" :key="i" :data="i">
                                    <ul>
                                        <li class="ecrw-center-son-pic">
                                            <a :href="getCourseURL(courseLabels[i][0].label)" target="_blank">
                                                <img :src="ECO_MEDIA_PATH + courseLabels[i][0].labelData.localpath" style="width:100%;height:100%;"/>
                                            </a>
                                        </li>
                                        <li class="ecrw-center-num">{{ courseLabels[i][0].label }}：{{ courseLabels[i][0].labelData.goodscount }}份</li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                        <div class="ecrw-content-right">
                            <ecr-shortcut-panel2 :items="courseData" item-title-key="name" item-type-key="contenttype" item-id-key="contentid" step="课程">
                            </ecr-shortcut-panel2>
                        </div>
                    </div>
                </div>
                <!-- 课程 end -->

                 <!-- 最新最热 -->
                 <div class="ecrw-content-wrap" ref="ecrw-hot" style="min-height:400px">
                                                                                                              
                    <div class="ecrw-content-title">
                        <div class="ecrw-content-subtitle">
                            <ul>
                                <li class="ecrw-content-hot-addr-li">
                                    <ecr-panel-item
                                        :items="areas"
                                        item-title-key="areaname"
                                        item-id-key="areaid"
                                        @item-click="onHotAreaChanged">
                                    </ecr-panel-item>
                                </li>
                                <ecr-dropdown style="z-index: 1000" :items="contentTypes" title="类型" itemLabelKey="contentname" @item-select="onHotContentTypeChanged"></ecr-dropdown>
                                <ecr-dropdown style="z-index: 1000" :items="allSubjects" title="学科" itemLabelKey="dictname" @item-select="onHotSubjectChanged"></ecr-dropdown>
                                <ecr-dropdown style="z-index: 1000" :items="grades" title="年级" itemLabelKey="dictname" @item-select="onHotGradeChanged"></ecr-dropdown>
                            </ul>
                        </div>
                        最新最热
                    </div>

                    <div class="ecrw-content-det clearfix">
                        <div class="ecrw-content-hot-left">
                            <ecr-newest-panel
                                ref="newestPanel"
                                :area="hotArea"
                                :content-type="hotContentType"
                                :subject="hotSubject"
                                :grade="hotGrade">
                            </ecr-newest-panel>
                        </div>
                        <div class="ecrw-content-hot-right">
                            <ecr-hot-panel
                                ref="hotPanel"
                                :area="hotArea"
                                :content-type="hotContentType"
                                :subject="hotSubject"
                                :grade="hotGrade">
                            </ecr-hot-panel>
                        </div>
                    </div>
                </div>
                <!-- 最新最热 end -->
            </div>
        </div>
        <!--  content end  -->
    </section>
</template>

<script>
    import ECRUtil from '../../common/js/util';
    import { CONTENT_TYPE } from '../../common/js/const';
    import { getSchoolSectionList, getSubjectList, getNaviGradeList, getGoodsList, getLabelList, getAdvertList, getAreasByParent, getNamedSchoolInfoListByAreaId, getNamedTeacherList, getThumbnail, getGoodsTotalCount, getThemeList, getHomeList, requestWeixin } from '../../api/api';

    export default {
        data() {
            let contentTypes = JSON.parse(JSON.stringify(CONTENT_TYPE));
            contentTypes.splice(0, 0, { 'contentname':'全部', 'contenttype':'' });

            return {
                ECRUtil: ECRUtil,
                CONTENT_TYPE: CONTENT_TYPE,
                contentTypes: contentTypes,
                areas: [],
                curArea: null,
                famousSchools: [],
                topThreeSchools: [],
                famousTeachers: [],
                schoolSections: [],
                curSchoolSection: null,
                advertList: [],
                subjects: [],
                allSubjects: [],
                grades: [],
                subPanelVisible: false,
                subPanelTop: -10,
                curSubject: null,
                small: true,
                answerLabels: [],
                answerLabels_class: [],
                courseLabels: [],
                specialLabels: [],
                teachData: [],
                answerData: [],
                courseData: [],
                specialData: [],
                newestData: [],
                hotArea: null,
                hotContentType: null,
                hotSubject: null,
                hotGrade: null,
                bannerOneLabelList:[],
                ECO_MEDIA_PATH: ECO_MEDIA_PATH,
                steps: [],
                user: null,
                selectedId: '',
                thumbpath: '',
                todayCount: 0,
                weekCount: 0,
                totalCount: 0,
                statisticLoading: false,
                topThreeSchoolloading: false,
                teachDataLoading: false,
                courseLabelLoading: false,
                answerLabelLoading: false,
                specialLabelLoading: false,
                subjectLoading: false,
                themeids: [],
                defaultSchoolPhotoPath: '/TWSMECR/2019/2/7/png/35eadf0e-a83b-4627-8a3d-7f988b9effc8.png',//default school photo path for null
                defaultTeacherPhotoPath: '/TWSMECR/2018/11/5/jpg/f186fa33-3ea9-45e3-802e-3e3a44c4e406.jpg',//default teacher photo path for null
            }
        },
        computed: {
            isLoggedIn() {
                if (this.user != null) return true;
                return false;
            },
            isTeacher() {
                if (this.isLoggedIn) {
                    if (this.user.roleList == null) return false;
                    for (var i=0; i<this.user.roleList.length; i++) {
                        if (this.user.roleList[i].roleid == '1000000002') {
                            return true;
                        }
                    }
                }
                return false;
            }
        },
        methods: {
            setItems1(type1){
                let steps = [
                    {
                        title:'首页',
                        url:'/home'
                    }
                ];
                if(type1 == 1){
                    steps.push({
                        title:'同步资源',
                        url:'/teaching'
                    });
                }
                else if(type1 == 2){
                    steps.push({
                        title:'试卷',
                        url:'/answer'
                    });
                }
                localStorage.setItem('step', JSON.stringify(steps));
            },
            getTotalCount() {
                this.statisticLoading = true;
                getGoodsTotalCount().then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.totalCount = res.data.responseEntity.total;
                        this.weekCount = res.data.responseEntity.lastweek;
                        this.todayCount = res.data.responseEntity.today;
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                    }
                    this.statisticLoading = false;
                });
            },
            goSelectedRouter(val) {
                var element = this.$refs[val];
                if (val == 'ecrw-header') {
                    window.scrollTo(0, 0);
                } else {
                    var pos = element.offsetTop + element.offsetHeight;
                    window.scrollTo(0, pos);
                }
                
                this.selectedId = val;
            },
            getShareRange(teacher) {
                if (teacher.sharerange == "1") return "全国";
                else if (teacher.sharerange == "2") return "全省";
                else if (teacher.sharerange == "3") return "全市";
            },
            getCourseURL(index) {
                if (index == 'STEM课程') {
                    return 'course/stem';
                } else if (index == '微视频课程') {
                    return 'course/video';
                } else if (index == '美育课程') {
                    return 'course/moral';
                } else if (index == '培生英语课程') {
                    return 'course/eng';
                }
                return '';
            },
            showSubPanel(event, subject) {
                if (event.target.tagName.toLowerCase() == "a") return;
                this.subPanelTop = event.target.offsetTop - 60 - this.$refs.leftbanner.scrollTop;
                this.curSubject = subject;
                this.subPanelVisible = true;
            },
            hideSubPanel() {
                this.subPanelVisible = false;
                this.curSubject = null;
            },
            onChoosePanelVisible(visibility) {
                if (visibility) {
                    this.hideSubPanel();
                }
            },
            getAreas() {
                getAreasByParent("-1").then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.areas = res.data.pageInfo.list;
                        this.areas.splice(0, 0, { areaid:'', areaname:'全国' });
                        this.onFamousAreaSelected(this.areas[0]);
                    } else {
                        this.areas = [];
                        this.curArea = null;
                    }
                }).catch(() => {
                    this.areas = [];
                    this.curArea = null;
                });
            },
            loadAdvertisement() {
                let params = {
                    conditions: [
                        {
                            fieldName: 'status',
                            fieldValues: [
                                '1'
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        }
                    ]
                };
                getAdvertList(params).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.advertList = res.data.pageInfo.list;
                        var _this = this;
                        this.$nextTick(function() {
                            _this.initAdvertSwiper();
                        });
                    } else {
                        this.advertList = [];
                    }
                });
            },
            loadSpecial() {
                
                let params = {
                    pagination:{
                        numPerPage:10,
                        pageNo:1
                    },
                    conditions: [
                    {
                        fieldName: 'themeids',
                        fieldValues: this.themeids,
                        prepender: null,
                        operator: 'EQUAL',
                        childCondtions: null}
                        
                    ]
                };
                getGoodsList(params).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.specialData = res.data.pageInfo.list;
                    } else {
                        this.specialData = [];
                    }
                });
            },
            loadBannerLabel() {
                let params = {
                    pagination:{},
                    conditions: [
                        {
                            fieldName: 'labeltype',
                            fieldValues: [
                                '4'
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        },
                        {
                            fieldName: 'parentlabelid',
                            fieldValues: [
                                '0'
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        }
                    ]
                };
                getLabelList(params).then((res) => {
                    
                    if (res.data.serverResult.resultCode == "200") {
                        this.bannerOneLabelList = res.data.pageInfo.list;

                        this.loadTestTwoLabels();
                        this.loadSpecialTwoLabels();
                        this.loadVideoOneLabel();
                        this.loadEngOneLabel();
                        this.loadStemOneLabel();
                        this.loadMoralOneLabel();
                    } else {
                        this.bannerOneLabelList = [];
                    }
                });
            },
            loadTestTwoLabels() {
                let params = {
                    pagination:{
                        numPerPage: 10,
                        pageNo: 1
                    },
                    conditions: [
                        {
                            fieldName: 'contenttype',
                            fieldValues: [
                                '4'
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        }
                    ]
                };
                this.answerLabelLoading = true;
                getGoodsList(params).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.answerLabels = res.data.pageInfo.list;
                    } else {
                        this.answerLabels = [];
                    }
                    this.answerLabelLoading = false;
                }).catch((res) => {
                    this.answerLabelLoading = false;
                    this.answerLabels = [];
                });
            },
            loadSpecialTwoLabels() {
                let params = {
                    pagination:{
                        numPerPage: 7,
                        pageNo: 1
                    },
                    conditions: [
                        {
                            "fieldName":"parentthemeid",
                            "fieldValues":["0"],
                            "prepender":null,
                            "operator":"EQUAL",
                            "childConditions":null
                        },
                    ]
                };
                this.specialLabelLoading = true;
                getThemeList(params).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.specialLabels = res.data.pageInfo.list;
                        for(var i=0;i<this.specialLabels.length;i++) {
                            this.themeids.push(this.specialLabels[i].themeData.themeid);
                        }
                        this.loadSpecial();
                    } else {
                        this.specialLabels = [];
                    }
                    this.specialLabelLoading = false;
                }).catch((res) => {
                    this.specialLabelLoading = false;
                    this.specialLabels = [];
                });
            },
            loadVideoOneLabel() {
                let params = {
                    pagination:{},
                    conditions: [
                        {
                            fieldName: 'labelname',
                            fieldValues: [
                                '微视频课程'
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        },
                        {
                            fieldName: 'parentlabelid',
                            fieldValues: [
                                '0'
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        }
                    ]
                };
                getLabelList(params).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.videoCourseLabel = res.data.pageInfo.list;
                        this.courseLabels.push(this.videoCourseLabel);
                    } else {
                        this.videoCourseLabel = [];
                    }
                }).catch((res) => {
                    this.videoCourseLabel = [];
                });
            },
            loadEngOneLabel() {
                let params = {
                    pagination:{},
                    conditions: [
                        {
                            fieldName: 'labelname',
                            fieldValues: [
                                '培生英语课程'
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        },
                        {
                            fieldName: 'parentlabelid',
                            fieldValues: [
                                '0'
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        }
                    ]
                };
                getLabelList(params).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.engCourseLabel = res.data.pageInfo.list;
                        this.courseLabels.push(this.engCourseLabel);
                    } else {
                        this.engCourseLabel = [];
                    }
                }).catch((res) => {
                    this.engCourseLabel = [];
                });
            },
            loadStemOneLabel() {
                let params = {
                    pagination:{},
                    conditions: [
                        {
                            fieldName: 'labelname',
                            fieldValues: [
                                'STEM课程'
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        },
                        {
                            fieldName: 'parentlabelid',
                            fieldValues: [
                                '0'
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        }
                    ]
                };
                getLabelList(params).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.stemCourseLabel = res.data.pageInfo.list;
                        this.courseLabels.push(this.stemCourseLabel);
                    } else {
                        this.stemCourseLabel = [];
                    }
                }).catch((res) => {
                    this.stemCourseLabel = [];
                });
            },
            loadMoralOneLabel() {
                let params = {
                    pagination:{},
                    conditions: [
                        {
                            fieldName: 'labelname',
                            fieldValues: [
                                '美育课程'
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        },
                        {
                            fieldName: 'parentlabelid',
                            fieldValues: [
                                '0'
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        }
                    ]
                };
                this.courseLabelLoading = true;
                getLabelList(params).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.moralCourseLabel = res.data.pageInfo.list;
                        this.courseLabels.push(this.moralCourseLabel);
                    } else {
                        this.moralCourseLabel = [];
                    }
                    this.courseLabelLoading = false;
                }).catch((res) => {
                    this.courseLabelLoading = false;
                    this.moralCourseLabel = [];
                });
            },
            loadTeaching() {
                let params = {
                    pagination:{
                        numPerPage:10,
                        pageNo:1
                    },
                    conditions: [
                        {
                            fieldName: 'onelabel',
                            fieldValues: [
                                '同步资源'
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        }
                    ]
                };
                this.teachDataLoading = true;
                getGoodsList(params).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.teachData = res.data.pageInfo.list;
                        if (this.teachData.length != 0) {
                            for (var i=0; i < 4; i++) {
                                this.getFileThumbnail(this.teachData[i].resource, i);
                            }
                        }
                    } else {
                        this.teachData = [];
                    }
                    this.teachDataLoading = false;
                });
            },
            getFileThumbnail(resource, idx) {
                if (resource.fileInfo != null && 
                    (resource.fileInfo.format.toLowerCase() == 'jpg' 
                        || resource.fileInfo.format.toLowerCase() == 'png' 
                        || resource.fileInfo.format.toLowerCase() == 'gif')) {
                    this.getThumbnail(resource, '1', idx);
                } else if (resource.fileInfo != null && 
                    (resource.fileInfo.format.toLowerCase() == 'ppt' 
                        || resource.fileInfo.format.toLowerCase() == 'pptx') ) {
                    this.getThumbnail(resource, '2', idx);
                } else if (resource.fileInfo != null && 
                    ( resource.fileInfo.format.toLowerCase() == 'mp4' 
                        || resource.fileInfo.format.toLowerCase() == 'flv' 
                        || resource.fileInfo.format.toLowerCase() == 'wmv' 
                        || resource.fileInfo.format.toLowerCase() == 'avi' 
                        || resource.fileInfo.format.toLowerCase() == 'mpg') ) {
                    this.getThumbnail(resource, '3', idx);
                } else {
                    var type = resource.contenttype;
                    if (type == '1') {
                        this.thumbpath = 'ecrw-exam-bk-word';
                    } else if (type == '2') {
                        this.thumbpath = 'ecrw-exam-bk-teach';
                    } else if (type == '3') {
                        this.thumbpath = 'ecrw-exam-bk-ext';
                    } else if (type == '4') {
                        this.thumbpath = 'ecrw-exam-bk-test';
                    } else if (type == '5') {
                        this.thumbpath = 'ecrw-exam-bk-pic';
                    } else if (type == '6') {
                        this.thumbpath = 'ecrw-exam-bk-video';
                    } else if (type == '7') {
                        this.thumbpath = 'ecrw-exam-bk-audio';
                    } else if (type == '8') {
                        this.thumbpath = 'ecrw-exam-bk-swf';
                    } else if (type == '9') {
                        this.thumbpath = 'ecrw-exam-bk-h5';
                    } else if (type == '10') {
                        this.thumbpath = 'ecrw-exam-bk-epub';
                    } else if (type == '11') {
                        this.thumbpath = 'ecrw-exam-bk-zip';
                    } else if (type == '12') {
                        this.thumbpath = 'ecrw-exam-bk-other';
                    } else if (type == '21') {
                        this.thumbpath = 'ecrw-exam-bk-shiti';
                    } else if (type == '22') {
                        this.thumbpath = 'ecrw-exam-bk-shiti';
                    } else if (type == '31') {
                        this.thumbpath = 'ecrw-exam-bk-jiaocai';
                    }
                }
            },
            getThumbnail(resource, filetype, idx) {
                var aryFiles = new Array();
                aryFiles[0] = ECO_MEDIA_PATH + resource.fileInfo.localpath;
                var params = {"filesPath": aryFiles, "fileType": filetype };
                params = JSON.stringify(params);
        
                getThumbnail(params).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.teachData[idx].resource.thumbnailpath = res.data.pageInfo.list[0].targetImagePath;
                    } else {
                        /*this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });*/

                    }
                }).catch(() => {
                }); 
            },
            loadAnswer() {
                let params = {
                    pagination:{
                        numPerPage:10,
                        pageNo:1
                    },
                    conditions: [
                        {
                            fieldName: 'onelabel',
                            fieldValues: [
                                '试卷'
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        }
                    ]
                };
                getGoodsList(params).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.answerData = res.data.pageInfo.list;
                    } else {
                        this.answerData = [];
                    }
                });
            },
            loadCourse() {
                let params = {
                    pagination:{
                        numPerPage:10,
                        pageNo:1
                    },
                    conditions: [
                        {
                            fieldName: 'onelabel',
                            fieldValues: [
                                '培生英语课程', '微视频课程', '美育课程', 'STEM课程'
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        }
                    ]
                };
                getGoodsList(params).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.courseData = res.data.pageInfo.list;
                    } else {
                        this.courseData = [];
                    }
                });
            },
            loadSchoolSections() {
                getSchoolSectionList({}).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.schoolSections = ECRUtil.composeSysDict(res.data.pageInfo.list);
                    } else {
                        this.schoolSections = [];
                    }
                }).catch(() => {
                    this.schoolSections = [];
                });
            },
            loadSubjects(schoolSection) {
                let params = {
                    schoolsectionid:schoolSection.dictvalue
                };
                this.subjectLoading = true;
                getSubjectList(params).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.subjects = ECRUtil.composeSysDict(res.data.pageInfo.list);
                    } else {
                        this.subjects = [];
                    }
                    this.subjectLoading = false;
                }).catch(() => {
                    this.subjectLoading = false;
                    this.subjects = [];
                });
            },
            loadAllSubjects() {
                getSubjectList({}).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.allSubjects = ECRUtil.composeSysDict(res.data.pageInfo.list);
                        this.allSubjects.splice(0, 0, { dictvalue:'', dictname:'全部' });
                    } else {
                        this.allSubjects = [];
                    }
                }).catch(() => {
                    this.allSubjects = [];
                });
            },
            loadGrades() {
                getNaviGradeList({}).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.grades = ECRUtil.composeSysDict(res.data.pageInfo.list);
                        this.grades.splice(0, 0, { 'dictvalue':'', 'dictname':'全部' });
                    } else {
                        this.grades = [];
                    }
                }).catch(() => {
                    this.grades = [];
                });
            },
            loadFamousSchools() {
                let params = {
                    pagination:{
                        numPerPage:6,
                        pageNo:1
                    },
                    conditions: []
                };
                if (this.curArea != null) {
                    params.conditions.push(
                        {
                            fieldName: 'areaid',
                            fieldValues: [
                                this.curArea.areaid
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        }
                    );
                }
                getNamedSchoolInfoListByAreaId(params).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.famousSchools = res.data.pageInfo.list;
                    } else {
                        this.famousSchools = [];
                    }
                }).catch(() => {
                    this.famousSchools = [];
                });
            },
            loadFamousTeachers() {
                let params = {
                    pagination:{
                        numPerPage:6,
                        pageNo:1
                    },
                    conditions: []
                };
                if (this.curArea != null) {
                    params.conditions.push(
                        {
                            fieldName: 'areaid',
                            fieldValues: [
                                this.curArea.areaid
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        }
                    );
                }
                getNamedTeacherList(params).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.famousTeachers = res.data.pageInfo.list;                        
                    } else {
                        this.famousTeachers = [];
                    }
                }).catch(() => {
                    this.famousTeachers = [];
                });
            },
            loadTopThreeSchools() {
                let params = {
                    pagination:{
                        numPerPage:3,
                        pageNo:1
                    },
                    conditions: []
                };
                this.topThreeSchoolloading = true;
                getNamedSchoolInfoListByAreaId(params).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.topThreeSchools = res.data.pageInfo.list;                        
                    } else {
                        this.topThreeSchools = [];
                    }
                    var _this = this;
                    this.$nextTick(function() {
                        _this.initFamousSwiper();
                    });
                    this.topThreeSchoolloading = false;
                }).catch(() => {
                    this.topThreeSchoolloading = false;
                    this.topThreeSchools = [];
                });
            },
            initAdvertSwiper() {
                var mySwiper = $(".ecrw-swiper").swiper({
                    autoplay:5000,
                    loop:true,
                    pagination: '.pagination1',
                    autoplayDisableOnInteraction:false,
                    paginationClickable: true
                });

                $('.ecrw-swiper-left').on('click', function(e){
                    e.preventDefault()
                    mySwiper.swipePrev()
                })
                $('.ecrw-swiper-right').on('click', function(e){
                    e.preventDefault()
                    mySwiper.swipeNext()
                });
            },
            initFamousSwiper() {
                var mySwiper2 = $(".ecrw-swiper2").swiper({
                    autoplay:5000,
                    loop:true,
                    pagination: '.pagination2',
                    autoplayDisableOnInteraction:false,
                    paginationClickable: true
                });
            },
            onSchoolSectionSelected(schoolSection) {
                this.curSchoolSection = schoolSection;
                this.loadSubjects(this.curSchoolSection);
            },
            onFamousAreaSelected(area) {
                this.curArea = area;
                this.loadFamousSchools();
                this.loadFamousTeachers();
            },
            onHotAreaChanged(area) {
                this.hotArea = area;
            },
            onHotContentTypeChanged(contentType) {
                this.hotContentType = contentType;
            },
            onHotSubjectChanged(subject) {
                this.hotSubject = subject;
            },
            onHotGradeChanged(grade) {
                this.hotGrade = grade;
            },
            getPkgUrl(obj) {
                if (obj.labelData.property == "1" || obj.labelData.property == "3") {
                    return 'package/' + obj.labelData.labelid;
                } else if (obj.labelData.property == "2") {
                    return 'navipackage/' + obj.labelData.labelid;
                }
                return 'javascript:;';
            },
            goPackage(obj) {
                localStorage.setItem('onelabel', obj.label);
            },
            onLogin(user) {
                this.user = user;
            },
            onLogout() {
                this.user = null;
            }
        },
        created() {

            if (typeof this.$route.query.accredit_code !== "undefined") {
                var loginParams = {
                    accredit_code: this.$route.query.accredit_code
                };
                requestWeixin(loginParams)
                    .then((res) => {
                        if (res.data.serverResult.resultCode == "200") {
                            // localStorage.setItem('isFirstLogin', 1);
                            this.user = res.data.responseEntity;
                            localStorage.setItem('frontend-user', JSON.stringify(this.user));
                            localStorage.setItem('frontend-token', this.user.token);
                            localStorage.setItem('afterLoginVisible', true);
                            //localStorage.setItem('badwords', this.user.badwords);
                            this.login.afterLoginVisible = true;
                            this.getBasketCount();
                            window.EventHub.$emit('loggedin', this.user);
                        } else {
                            this.$message({
                                message: res.data.serverResult.resultMessage,
                                type: 'error'
                            });
                        }
                    })
                    .catch(() => {
                        this.$message({
                            message: '登录失败',
                            type: 'error'
                        });
                    });
            }

            this.steps = [
                {
                    title:'首页',
                    url:'home'
                }
            ];
            localStorage.setItem('step', JSON.stringify(this.steps));

            this.user = JSON.parse(localStorage.getItem('frontend-user'));
            this.getTotalCount();
            this.getAreas();
            this.loadTopThreeSchools();
            this.loadSchoolSections();
            this.loadBannerLabel();
            this.loadGrades();
            this.loadAllSubjects();
            this.loadTeaching();
            this.loadAnswer();
            this.loadCourse();
            this.loadAdvertisement();

            window.EventHub.$on('loggedin', this.onLogin);
            window.EventHub.$on('loggedout', this.onLogout);
        },
        watch: {
            "answerLabels": function (value) {
                for(var idx in value){
                    var thumbpath = {};
                    this.answerLabels_class[idx] = {
                        'name': '',
                        'path': ''
                    };
                
                    this.answerLabels_class[idx].name = ECRUtil.getDefaultThumb(value[idx].resource, thumbpath);
                    this.answerLabels_class[idx].path = thumbpath;                    
                }                
            }
        },        
    }
</script>

<style scoped lang="scss">
    @import '~scss_vars';

    .ecrw-center-son-pic {
        width: 210px;
        height: 128px;
    }

    .ecrw-leftbar-selected {background:#00beb2;color:#fff;}

    .selectedColor {
        color: green;
    }

</style>

<style>
    .ecrw-content-hot-addr-li .ecrw-list-pos-name {
        width: auto;
    }
</style>