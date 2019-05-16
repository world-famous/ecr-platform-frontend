<template>
    <section>
        <!--  content  -->
        <div class="ecrw-content">
            <div class="ecrw-in">
                <div class="ecrw-ready ">
                    <div class="ecrw-ready-wrap">
                        <div class="ecrw-ready-wrap-center">
                            <div class="ecrw-ready-wrap-det">
                                <div class="ecrw-content-title">
                                    <ecr-content-subtitle
                                        :items="areas"
                                        :default="curArea"
                                        :limit.native="10"
                                        itemTitleKey="areaname"
                                        more-url="javascript:;"
                                        @item-click="onFamousAreaSelected">
                                    </ecr-content-subtitle>
                                    名校资源
                                </div>    
                                <div class="ecrw-ready-resource-wrap" v-loading="listFamousLoading">
                                    <ecr-school-subtitle
                                        :items="famousSchools"
                                        :default="curFamousSchool"
                                        :limit.native="11"
                                        more-url="javascript:;"
                                        @item-click="loadForSchool">
                                    </ecr-school-subtitle>
                                    
                                    <img src="static/images/ecrw-empty-data-resource.png" :style="{ width:(imageSize.width) + 'px', height:(imageSize.height) + 'px' }" v-if="famousSchools.length==0">
                                </div>
                            </div>

                            <div class="ecrw-ready-resource-pic"
                                style="background-color: lightgray;"
                                :style="{ backgroundImage:'url(' + ECO_MEDIA_PATH + curFamousInfo.photopath + ')' }" v-if="curFamousSchool!=null && curFamousInfo!=null">
                                <div class="ecrw-ready-resource-pic-text">
                                    <ul>
                                        <li class="ecrw-ready-resource-pic-text-big">
                                            {{ curFamousInfo.orgname }}
                                        </li>
                                        <li class="ecrw-ready-resource-pic-text-small">
                                            
                                            <span class="dothide" style="-webkit-box-orient: vertical;" v-tooltip="{
                                                            content: curFamousInfo.description,
                                                            placement: 'bottom',
                                                            classes: ['info'],
                                                            targetClasses: ['it-has-a-tooltip'],
                                                            offset: 10,
                                                            delay: {
                                                                show: 100,
                                                                hide: 100,
                                                            },
                                                        }">{{ curFamousInfo.description}}</span>
                                            
                                            <a href="javascript:;" @click="goPage('/famous/' + curFamousSchool.orgid)" class="ecrw-color-red">查看详细</a>
                                        </li>

                                    </ul>
                                </div>

                                <div class="ecrw-ready-resource-pic-icon">
                                    <ul>

                                        <li class="ecrw-ready-resource-pic-icon-li">
                                            <div class="ecrw-ready-resource-pic-icon-num"><span class="ecrw-color-red">{{ curFamousInfo.totalviewtimes }} 次</span></div>

                                            <div class="ecrw-ready-resource-pic-icon-img">
                                                <div class="ecrw-ready-resource-pic-empress"></div>
                                            </div>

                                            <div class="ecrw-ready-resource-pic-icon-name">浏览数</div>
                                        </li>

                                        <li class="ecrw-ready-resource-pic-icon-li">
                                            <div class="ecrw-ready-resource-pic-icon-num"><span class="ecrw-color-red">{{ curFamousInfo.totalclicktimes }} 次</span></div>
                                            <div class="ecrw-ready-resource-pic-icon-img">
                                                <div class="ecrw-ready-resource-pic-zan"></div>
                                            </div>
                                            <div class="ecrw-ready-resource-pic-icon-name">资源点赞</div>
                                        </li>

                                        <li class="ecrw-ready-resource-pic-icon-li">
                                            <div class="ecrw-ready-resource-pic-icon-num"><span class="ecrw-color-red">{{ curFamousInfo.totalcollectiontimes }} 次</span></div>
                                            <div class="ecrw-ready-resource-pic-icon-img">
                                                <div class="ecrw-ready-resource-pic-add"></div>
                                            </div>
                                            <div class="ecrw-ready-resource-pic-icon-name">资源收藏</div>
                                        </li>

                                        <li class="ecrw-ready-resource-pic-icon-li">
                                            <div class="ecrw-ready-resource-pic-icon-num"><span class="ecrw-color-red">{{ curFamousInfo.totaldowntimes }} 次</span></div>
                                            <div class="ecrw-ready-resource-pic-icon-img">
                                                <div class="ecrw-ready-resource-pic-down"></div>
                                            </div>
                                            <div class="ecrw-ready-resource-pic-icon-name">资源下载</div>
                                        </li>

                                    </ul>
                                </div>
                            </div>
                            <div class="ecrw-ready-wrap-det">
                                <div class="ecrw-content-title">
                                    <ecr-content-subtitle
                                        :items="subjects"
                                        :default="curSubject"
                                        :limit.native="10"
                                        itemTitleKey="dictname"
                                        :allSubjectsShow.native="1"
                                        more-url="javascript:;"
                                        @item-click="onSubjectSelected">
                                    </ecr-content-subtitle>
                                    本校资源
                                </div>

                                <div class="ecrw-ready-resource-wrap clearfix" v-loading="listLoading">
                                    <img src="static/images/ecrw-empty-data-resource.png" :style="{ width:(imageSize.width) + 'px', height:(imageSize.height) + 'px' }" v-if="leftResources.length==0 && rightResources.length==0">
                                    <div class="ecrw-ready-resource-col ecrw-ready-resource-pdl">
                                        <ul>
                                            <li class="ecrw-ready-resource-col-li" 
                                                :class="ECRUtil.resourceType(item.resource.contenttype)"
                                                v-for="(item,idx) in leftResources"
                                                :key="idx"
                                                :data="item">
                                                <span class="ecrw-right-time">
                                                    {{ ECRUtil.formatDate.format(new Date(item.onshelftime), 'y/M/d') }}
                                                </span>
                                                <a :href="'resource/' + item.resource.contentid" target="_blank"> {{ item.resource.name }} </a>
                                            </li>
                                        </ul>
                                    </div>
                                    
                                    <div class="ecrw-ready-resource-col ecrw-ready-resource-pdr">
                                        <ul>
                                            <li class="ecrw-ready-resource-col-li" 
                                                :class="ECRUtil.resourceType(item.resource.contenttype)"
                                                v-for="(item,idx) in rightResources" 
                                                :key="idx" 
                                                :data="item">
                                                <span class="ecrw-right-time">
                                                    {{ ECRUtil.formatDate.format(new Date(item.onshelftime), 'y/M/d') }}
                                                </span>
                                                <a :href="'resource/' + item.resource.contentid" target="_blank"> {{ item.resource.name }} </a>
                                            </li>
                                        </ul>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--  content end  -->
    </section>
</template>

<script>
    var _ = require('lodash')
    import ECRUtil from '../../common/js/util';
    import { getAreasByParent, getNamedSchoolInfoListByAreaId, getGoodsStatisticsBySchoolId, getSchoolGoodsList, getSubjectList } from '../../api/api';

    export default {
        data() {
            return {
                steps: [],
                areas: [],
                subjects: [],
                famousSchools: [],
                curFamousSchool: null,
                curFamousInfo: null,
                curArea: null,
                curSubject: {},
                leftResources: [],
                rightResources: [],
                ECRUtil:ECRUtil,
                ECO_MEDIA_PATH:ECO_MEDIA_PATH,
                listLoading: false,
                listFamousLoading: false,
                imageSize: {
                    width: 0,
                    height: 0
                }
            }
        },
        methods: {
            
            loadFamousSchools() {
                this.curFamousSchool = null;
                this.curFamousInfo = null;
                this.rightResources = [];
                this.leftResources = [];

                let params = {
                    pagination:{
                        numPerPage:120,
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
                this.listFamousLoading = true;
                getNamedSchoolInfoListByAreaId(params).then((res) => {
                    if (res.data.responseEntity && res.data.responseEntity.areaId == this.curArea.areaid){
                        if (res.data.serverResult.resultCode == "200") {

                            this.famousSchools = _.orderBy(res.data.pageInfo.list, 'goodscount', 'desc');

                            if (this.famousSchools.length > 0){
                                this.loadForSchool(this.famousSchools[0]);
                            }

                        } else {
                            this.$message({
                                message: res.data.serverResult.resultMessage,
                                type: 'error'
                            });
                            this.famousSchools = [];
                        }
                        this.imageSize.width = $('.ecrw-ready-resource-wrap').width();
                        this.imageSize.height = 610;
                        this.listFamousLoading = false;
                    }
                }).catch(() => {
                    this.famousSchools = [];
                    
                    this.$message({
                        message: '加载失败!',
                        type: 'error'
                    });
                    this.listFamousLoading = false;
                });
            },
            
            loadForSchool(item) {
                this.curFamousSchool = item;
                getGoodsStatisticsBySchoolId(this.curFamousSchool.orgid).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.curFamousInfo = res.data.responseEntity;
                        if (this.curFamousInfo != null)
                            this.loadResources();
                    } else {
                        // Check if this error happens because of expired token or just navigated to 名师名校 page
                        // If frontend-user is null then we assume user not logged in so not invalid token
                        let frontendUser = localStorage.getItem('frontend-user');
                        if (frontendUser != null) {
                            this.$message({
                                message: res.data.serverResult.resultMessage,
                                type: 'error'
                            });
                        }
                    }
                }).catch(() => {
                });
            },
            loadResources() {
                this.rightResources = [];
                this.leftResources = [];

                let params = {
                    conditions: [
                        {
                            fieldName: 'orgid',
                            fieldValues: [
                                this.curFamousSchool.orgid
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        }
                    ]
                };
                if(this.curSubject != null){
                    params.conditions.push({
                            fieldName: 'subjectid',
                            fieldValues: this.curSubject.dictvalue.split(","),
                            prepender: null,
                            operator: 'EQUAL',
                            childConditions: null
                        });
                }
                this.listLoading = true;
                getSchoolGoodsList(params).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        var goods = res.data.pageInfo.list;
                        if (goods.length > 0) {
                            for (var i=0; i<16; i++) {
                                if (goods.length < i+1)
                                    break;

                                if (i > 7) {
                                    this.rightResources.push(goods[i]);
                                } else {
                                    this.leftResources.push(goods[i]);
                                }
                            }
                        }
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                    }
                    this.listLoading = false;
                }).catch(() => {
                    this.listLoading = false;
                });
            },
            onFamousAreaSelected(area) {
                this.curArea = area;
                this.famousSchools = [];
                this.curFamousSchool = null;
                this.curFamousInfo = null;
                this.loadFamousSchools();
            },
            onSubjectSelected(subject) {
                this.curSubject = subject;
                this.loadResources();
            },
            getAreas() {
                this.steps = [
                    {
                        title:'首页',
                        url:'/home'
                    },
                    {
                        title:'名校资源',
                        url:'/famous'
                    }
                ];
                localStorage.setItem('step', JSON.stringify(this.steps));

                getAreasByParent("-1").then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.areas = res.data.pageInfo.list;
                        if (this.areas.length > 0) {
                            this.curArea = this.areas[0];
                        }
                        this.loadFamousSchools();
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.areas = [];
                    }
                }).catch(() => {
                    this.areas = [];
                });
            },
            getSubjects() {
                getSubjectList({}).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.subjects = ECRUtil.composeSysDict(res.data.pageInfo.list);
                        this.curSubject = null;
                        // if (this.subjects.length > 0)
                        //     this.curSubject = this.subjects[0];
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.subjects = [];
                    }
                }).catch(() => {
                    this.subjects = [];
                });
            },
            goPage(url) {
                this.$router.push(url);
            }
        },
        created() {
            this.getAreas();
            this.getSubjects();
        }
    }
</script>

<style lang="scss">
    @import '~scss_vars';

    .ecrw-ready-resource-li:nth-child(4n) {
        margin-right: 0;
    }

    .dothide {
        display: block;
        display: -webkit-box;
        margin: 0 auto;
        margin-bottom: 15px;
        line-height: 1.5;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 5; 
    }

    .tooltip {
        display: block !important;
        z-index: 10000;

        .tooltip-inner {
            background: black;
            color: white;
            border-radius: 16px;
            padding: 5px 10px 4px;
        }

        .tooltip-arrow {
            width: 0;
            height: 0;
            border-style: solid;
            position: absolute;
            margin: 5px;
            border-color: black;
            z-index: 1;
        }

        &[x-placement^="bottom"] {
            margin-top: 5px;

            .tooltip-arrow {
                border-width: 0 5px 5px 5px;
                border-left-color: transparent !important;
                border-right-color: transparent !important;
                border-top-color: transparent !important;
                top: -5px;
                left: calc(50% - 5px);
                margin-top: 0;
                margin-bottom: 0;
            }
        }


        &[aria-hidden='true'] {
            visibility: hidden;
            opacity: 0;
            transition: opacity .15s, visibility .15s;
        }

        &[aria-hidden='false'] {
            visibility: visible;
            opacity: 1;
            transition: opacity .15s;
        }
        &.info {
            $color: rgba(#000000, .8);

            .tooltip-inner {
                background: $color;
                color: white;
                padding: 15px;
                border-radius: 5px;
                line-height:1.5;
                box-shadow: 0 5px 30px rgba(black, .1);
                max-width: 1100px;
            }

            .tooltip-arrow {
            border-color: $color;
            }
        }
    }
</style>