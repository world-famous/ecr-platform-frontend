<template>
    <section>
        <div class="ecrw-in">
            <div class="ecrw-list clearfix">
                <div class="ecrw-list-left">
                    <ecr-breadcrumb :steps="steps" :change-chapter="true"></ecr-breadcrumb>
                    <div class="ecrw-list-media">
                        <div class="ecrw-list-resource" v-loading="listLoading">
                            <ecr-resource-viewer :item="resource"></ecr-resource-viewer>
                        </div>
                        <div class="ecrw-list-det" v-if="resource!=null">
                            <ul>
                                <li class="ecrw-list-det-li">
                                    <div class="ecrw-list-icon-wrap">
                                        <a href="javascript:;" title="浏览次数" class="ecrw-list-det-bro">{{ resource.viewtimes }}&nbsp;</a>
                                        <a v-if="resource.status != '3'" href="javascript:;" title="点赞次数" class="ecrw-list-det-zan">{{ resource.clicktimes }}&nbsp;</a>
                                        <a v-if="resource.status == '3'" href="javascript:;" title="点赞次数" class="ecrw-list-det-zan" :class="{ 'ecrw-list-det-zan-sel':resource.isvote==1 }" @click="vote">{{ resource.clicktimes }}&nbsp;</a>
                                        <a v-if="resource.status != '3'" href="javascript:;" title="收藏次数" class="ecrw-list-det-add">{{ resource.collectiontimes }}&nbsp;</a>
                                        <a v-if="resource.status == '3'" href="javascript:;" title="收藏次数" class="ecrw-list-det-add" :class="{ 'ecrw-list-det-add-sel':resource.isfavourite==1 }" @click="collect">{{ resource.collectiontimes }}&nbsp;</a>
                                        <a href="javascript:;" title="下载次数" class="ecrw-list-det-down">{{ resource_downtimes }}&nbsp;</a>
                                        <a v-if="resource.status != '3'" href="javascript:;" title="资源篮" class="ecrw-list-det-basket">&nbsp;</a>
                                        <a v-if="resource.status == '3'" href="javascript:;" title="资源篮" class="ecrw-list-det-basket" :class="{ 'ecrw-list-det-basket-sel':resource.isbasket==1 }" @click="basketOP">&nbsp;</a>
                                    </div>
                                    资源名称：<span>{{ resource.name }}</span>
                                </li>
                                <li class="ecrw-list-det-li">
                                    作者：<span>{{ resource.creatorname }}</span>
                                </li>
                                <li class="ecrw-list-det-li">
                                    上传时间：<span>{{ resource.createtime }}</span>
                                </li>
                                <li class="ecrw-list-det-li">
                                    <div class="ecrw-list-icon-wrap">
                                        <span class="ecrw-list-det-comment-num">{{ (resource.goodinfo && resource.goodinfo.goodprice!=null) ? resource.goodinfo.goodprice:0 }}</span>分
                                        <a href="javascript:;" class="ecrw-button ecrw-list-icon-down" :class="{ 'ecrw-button-disabled':(resource.contentid=='' || resource.isallowdownload=='0') }" v-if="!(this.path != '/collection/0' && resource.isallowdownload=='1')">下载</a>
                                        <a href="javascript:;" class="ecrw-button ecrw-list-icon-down" :class="{ 'ecrw-button-disabled':(resource.contentid=='' || resource.isallowdownload=='0') }" @click="download" v-if="(this.path != '/collection/0' && resource.isallowdownload=='1')">下载</a>
                                    </div>
                                </li>
                                <li class="ecrw-list-det-li">
                                    <span>资源星级：</span>
                                    <my-rate :rate="resource.ratesum==null?0:resource.ratesum" @mouseover.native="showRatingPanel"></my-rate>
                                    <div class="ecrw-list-det-comment" v-if="isRating && resource.status=='3'" @mouseleave="hideRatingPanel">
                                        <span>您的评星：</span>
                                        <a href="javascript:;" v-for="i in 5" class="ecrw-list-star-big" :class="{ 'ecrw-list-star-big-sel':resource.rating>=i }" @click="rate(i)"></a>
                                        <span class="ecrw-list-det-comment-num">{{ resource.rating }}</span>分
                                    </div>
                                </li>
                                <li class="ecrw-list-det-li">
                                    <div class="div-flex">
                                        <div>资源描述：</div>
                                        <div class="div-detail">{{ resource.description }}</div>
                                    </div>
                                    
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <span style="float: right;">
                    <a href="javascript:;" class="ecrw-profile-enter" :class="{ 'ecrw-button-disabled':resource.contentid=='' }" style="color: #fff" @click="report(resource)">报错</a>
                </span>
                <div class="ecrw-list-right">
                    <div class="ecrw-list-blank"></div>
                    <ecr-shortcut-panel 
                        :items="similarResources" 
                        title="同类资源" 
                        empty-string="当前类型的资源有点少~"
                        item-title-key="name" 
                        item-id-key="contentid" 
                        item-type-key="contenttype" 
                        @button-click="reload"
                        @update="updateSimilarResources">
                    </ecr-shortcut-panel>
                    <ecr-shortcut-panel 
                        :items="relatedResources" 
                        title="关联资源" 
                        empty-string="当前关联的资源有点少~"
                        more-url="/related" 
                        item-title-key="name" 
                        item-id-key="contentid" 
                        item-type-key="contenttype" 
                        @button-click="reload"
                        @update="updateRelatedResources">
                    </ecr-shortcut-panel>
                </div>
            </div>
        </div>

        <el-dialog title="举报" v-model="uiVisible" :close-on-click-modal="false">
            <el-row>
                <el-col :span="24" class="ecrm-search-title" style="cursor: pointer; margin-bottom: 20px;">
                    <a :class="{'selected': isReport == true}" @click="goReportUI">资源举报</a>
                    <a :class="{'selected': isError == true}" @click="goErrorReportUI">资源报错</a>
                </el-col>
            </el-row>
            <el-form :model="errorContent" label-width="100px" :rules="formRules" ref="errorContent" v-show="isError">
                <el-form-item prop="description" label="挑错描述 :" class="is-required">
                    <el-input type="textarea" placeholder="注：不超过100个汉字。不可为空，不可为空字符串。" v-model="errorContent.description"></el-input>
                </el-form-item>
                <el-form-item label="图片上传 :" class = "is-required">
                    <input type="file" id="errorthumb" @change="readThumb(errorContent.errorthumb)" style="display:none" accept=".png,.jpg"/>
                    <img :src="errorContent.errorthumb.blobfile"  @click="openThumbFile" style="width: 210px; height: 121px; border: 1px dashed gray; float: left; margin-right: 10px;"/>
                    <span style="margin-left: 30px; color: #999">注：系统自动读取到资源路径，呈现在后台</span>
                </el-form-item>
            </el-form>
            <el-form :model="reportContent" label-width="100px" :rules="reportFormRules" ref="reportContent" v-show="isReport">
                <el-form-item prop="description" label="举报描述 :" class="is-required">
                    <el-input type="textarea" placeholder="注：不超过100个汉字。不可为空，不可为空字符串。" v-model="reportContent.description"></el-input>
                </el-form-item>
                <el-form-item label="举报类型 :" prop="subtype">
                    <el-select placeholder="举报类型" v-model="reportContent.subtype">
                        <el-option label="黄色" value="黄色"></el-option>
                        <el-option label="暴力" value="暴力"></el-option>
                        <el-option label="反政治" value="反政治"></el-option>
                        <el-option label="广告" value="广告"></el-option>
                        <el-option label="版权争议" value="版权争议"></el-option>
                        <el-option label="其它" value="其它"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="联系电话 :" prop="userphone" class="is-required">
                    <el-input placeholder=  "请输入联系电话" v-model="reportContent.userphone" :maxlength="16"></el-input>
                </el-form-item>
                <el-form-item label="联系QQ :">
                    <el-input placeholder="请输入联系QQ" v-model="reportContent.userqq"></el-input>
                </el-form-item>
                <el-form-item label="联系邮箱 :" prop="useremail" class="is-required">
                    <el-input type="text" placeholder="请输入联系邮箱" v-model="reportContent.useremail"></el-input>
                </el-form-item>
                <el-form-item label="用户名 :">
                    <el-input type="text" v-model="reportContent.username" readonly style="width: 50%"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="send" :loading="sendLoading">确定</el-button>
            </div>
        </el-dialog> 
    </section>
</template>

<script>
    import { getGoodsList, getResource, rateResource, voteResource, addToFavorite, removeFromFavorite, addToBasket, removeFromBasket, upLoadFeedback, uploadFile, getMyScore, isAlreadyDownload } from '../../api/api'
    import ECRUtil from '../../common/js/util.js'

    export default {
        data() {
            return {
                isvoting: false,
                iscollecting: false,
                ECRUtil:ECRUtil,
                resource_downtimes: 0,
                resource: {
                    viewtimes:0,
                    clicktimes:0,
                    collectiontimes:0,
                    ratecount:0,
                    downtimes:0,
                    name:'',
                    creatorname:'',
                    goodinfo: { goodprice:0 },
                    ratesum:0,
                    contentid:''
                },
                similarResources: [],
                relatedResources: [],
                steps: [],
                myRating: 0,
                isRating: false,
                similarPage:1,
                relatedPage:1,

                uiVisible: false,
                isError: false,
                isReport: false,
                content:[],
                errorContent:{
                    description:'',
                    errorthumb: {
                        blobfile: '',
                        file: null
                    },
                },
                formRules: {
                    description: [
                        { validator: this.validateErrorDescription, trigger: 'blur' }
                    ]
                },
                reportContent:{
                    description:'',
                    subtype:'',
                    username:'',
                    useremail:'',
                    userqq:'',
                    userphone:''
                    
                },
                reportFormRules: {
                    description: [
                        { validator: this.validateReportDescription, trigger: 'blur' },
                    ],
                    subtype: [
                        { required: true, message: '请选择举报类型', trigger: 'blur' }
                    ],
                    userphone: [
                        { validator: this.validatePhone, trigger: 'blur' }
                    ],
                    userqq: [
                        { validator: this.validateQQ, trigger: 'blur' }
                    ],
                    useremail: [
                        { validator: this.validateEmail, trigger: 'blur' }
                    ]
                },
                action: null,
                path:'',
                listLoading: false,
                sendLoading:false,
            }
        },
        methods: {            
            load() {
                var resourceId = this.$route.params.id;
                this.listLoading = true;
                getResource(resourceId).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.resource = res.data.responseEntity;
                        if (this.resource.goodinfo == null) {
                            this.resource.goodinfo = { goodprice:0 };
                        }
                        this.myRating = this.resource.ratesum;
                        this.similarPage = 1;
                        this.relatedPage = 1;
                        this.loadSimilarResources(this.resource);
                        this.loadRelatedResources(this.resource);

                        this.composeSteps();
                        this.startInputAction();
                        this.resource_downtimes = this.resource.downtimes? this.resource.downtimes: 0; 
                    } else {
                        this.resource = null;
                        this.relatedResources = [];
                        this.similarResources = [];
                        this.myRating = 0;

                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                    }
                    this.listLoading = false;
                }).catch(() => {
                    this.listLoading = false;
                    this.resource = null;
                    this.relatedResources = [];
                    this.similarResources = [];
                    this.myRating = 0;
                    
                    this.$message({
                        message: '加载失败!',
                        type: 'error'
                    });
                });
                this.clearThumbFile();       
            },
            clearThumbFile () {            
                this.errorContent.errorthumb.blobfile = '';
                this.errorContent.errorthumb.file = null;             
            },
            composeSteps() {
//                this.steps = JSON.parse(sessionStorage.getItem('step'));
//                alert("session-step="+JSON.stringify(this.steps));
//                if (this.steps == null) 
                {
                    this.steps = JSON.parse(localStorage.getItem('step'));
                }
                this.steps.push(
                        {
                            title: (this.resource.schoolsection!=null?this.resource.schoolsection:'') + ' ' + 
                                (this.resource.subject!=null?this.resource.subject:'') + ' ' + 
                                (this.resource.editiontype!=null?this.resource.editiontype:'') + ' ' + 
                                (this.resource.grade!=null?this.resource.grade:'') + ' ' + 
                                (this.resource.bookmodel!=null?this.resource.bookmodel:''),
                                url: ''
                        }
                    );
                this.steps.push(
                    {
                        title:this.resource.name,
                        url:'/resource/' + this.resource.contentid
                    }
                );
                 
                this.path = this.steps[1].url;
            },
            startInputAction() {
                if (this.resource.onelabel == '同步资源' || 
                    this.resource.onelabel == '试卷' || 
                    this.resource.onelabel == '特供专题' || 
                    this.resource.onelabel == '微视频课程' || 
                    this.resource.onelabel == '培生英语课程' || 
                    this.resource.onelabel == 'STEM课程' || 
                    this.resource.onelabel == '美育课程' || 
                    this.resource.onelabel == '品牌专区') {
                    this.action = ECRUtil.startAction(this.resource.onelabel, this.resource.contentid);
                    return;
                    }
            },
            loadSimilarResources(resource) {
                if (this.resource.contentid == '') return;

                let params = {
                    pagination:{
                        numPerPage:7,
                        pageNo:this.similarPage
                    },
                    conditions: [
                        {
                            fieldName: 'contenttype',
                            fieldValues: [
                                resource.contenttype
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        },
                        {
                            fieldName: 'schoolsectionid',
                            fieldValues: [
                                resource.schoolsectionid
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        },
                        {
                            fieldName: 'subjectid',
                            fieldValues: [
                                resource.subjectid
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        },
                        {
                            fieldName: 'gradeid',
                            fieldValues: [
                                resource.gradeid
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        },
                        {
                            fieldName: 'bookmodelid',
                            fieldValues: [
                                resource.bookmodelid
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        },
                        {
                            fieldName: 'editiontypeid',
                            fieldValues: [
                                resource.editiontypeid
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        }
                    ],
                    orderMethods: [
                        {
                            field: 'downtimes',
                            method: 'DESC'
                        }
                    ]
                };
                getGoodsList(params).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.similarResources = res.data.pageInfo.list;
                        for (var i=0; i<this.similarResources.length; i++) {
                            if (this.similarResources[i].resource.contentid == this.resource.contentid) {
                                this.similarResources.splice(i, 1);
                                break;
                            }
                        }
                        if (this.similarResources.length == 0 && this.similarPage > 1) {
                            this.updateSimilarResources();
                        }
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.similarResources = [];
                    }
                }).catch(() => {
                    this.similarResources = [];
                });

            },
            loadRelatedResources(resource) {
                if (this.resource.contentid == '') return;
                
                let params = {
                    pagination:{
                        numPerPage:7,
                        pageNo:this.relatedPage
                    },
                    conditions: [
                        {
                            fieldName: 'schoolsectionid',
                            fieldValues: [
                                resource.schoolsectionid
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        },
                        {
                            fieldName: 'subjectid',
                            fieldValues: [
                                resource.subjectid
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        },
                        {
                            fieldName: 'gradeid',
                            fieldValues: [
                                resource.gradeid
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        },
                        {
                            fieldName: 'bookmodelid',
                            fieldValues: [
                                resource.bookmodelid
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        },
                        {
                            fieldName: 'editiontypeid',
                            fieldValues: [
                                resource.editiontypeid
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        },
                    ],
                    orderMethods: [
                        {
                            field: 'downtimes',
                            method: 'DESC'
                        }
                    ]
                };
                if (resource.catalogids != null && resource.catalogids != '') {
                    params.conditions.push({
                            fieldName: 'catalogids',
                            fieldValues: resource.catalogids,
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        });
                }
                getGoodsList(params).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.relatedResources = res.data.pageInfo.list;
                        for (var i=0; i<this.relatedResources.length; i++) {
                            if (this.relatedResources[i].resource.contentid == this.resource.contentid) {
                                this.relatedResources.splice(i, 1);
                                break;
                            }
                        }
                        if (this.relatedResources.length == 0 && this.relatedPage > 1) {
                            this.updateRelatedResources();
                        }
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.relatedResources = [];
                    }
                }).catch(() => {
                    this.relatedResources = [];
                });
            },
            updateSimilarResources() {
                if (this.similarResources.length < 7 || this.similarPage == 10) {
                    this.similarPage = 1;
                } else {
                    this.similarPage += 1;
                }
                this.loadSimilarResources(this.resource);
            },
            updateRelatedResources() {
                if (this.relatedResources.length < 7 || this.relatedPage == 10) {
                    this.relatedPage = 1;
                } else {
                    this.relatedPage += 1;
                }
                this.loadRelatedResources(this.resource);
            },
            showRatingPanel() {
                this.isRating = true;
            },
            hideRatingPanel() {
                this.isRating = false;
            },
            rate(val) {
                if (localStorage.getItem('frontend-user') == null) {
                    window.EventHub.$emit('request-login');
                    return;
                }

                this.myRating = val;
                let params = {
                    contentid:this.resource.contentid,
                    rating:val
                };
                rateResource(params).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.resource.ratecount = res.data.responseEntity.ratingcount;
                        this.resource.ratesum = res.data.responseEntity.rateSum;
                        this.resource.rating = this.myRating;
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                    }
                }).catch(() => {
                    this.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
            },
            vote() {
                if (localStorage.getItem('frontend-user') == null) {
                    window.EventHub.$emit('request-login');
                    return;
                }

                if(this.isvoting) return;
                this.isvoting = true;

                voteResource(this.resource.contentid).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.$message({
                            message: '已点赞',
                            type: 'success'
                        });
                        this.resource.clicktimes = res.data.responseEntity.clicktimes;
                        this.resource.isvote = res.data.responseEntity.isvote;
                        
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                    }
                    this.isvoting = false;
                }).catch(() => {
                    this.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                    this.isvoting = false;
                });
            },
            collect() {
                if (localStorage.getItem('frontend-user') == null) {
                    window.EventHub.$emit('request-login');
                    return;
                }

                if(this.iscollecting) return;
                this.iscollecting = true;

                if (this.resource.isfavourite == 1) {
                    removeFromFavorite(this.resource.contentid).then((res) => {
                        if (res.data.serverResult.resultCode == "200") {
                            this.resource.isfavourite = 0;
                            this.resource.collectiontimes = res.data.responseEntity.collectiontimes;
                            this.$message({
                                message: res.data.serverResult.resultMessage,
                                type: 'success'
                            });
                        } else {
                            this.$message({
                                message: res.data.serverResult.resultMessage,
                                type: 'error'
                            });
                        }
                        this.iscollecting = false;
                    }).catch(() => {
                        this.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                        this.iscollecting = false;
                    });
                } else {
                    addToFavorite(this.resource.contentid).then((res) => {
                        if (res.data.serverResult.resultCode == "200") {
                            this.$message({
                                message: '已收藏',
                                type: 'success'
                            });
                            this.resource.isfavourite = 1;
                            this.resource.collectiontimes = res.data.responseEntity.collectiontimes;
                        } else {
                            this.$message({
                                message: res.data.serverResult.resultMessage,
                                type: 'error'
                            });
                        }
                        this.iscollecting = false;
                    }).catch(() => {
                        this.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                        this.iscollecting = false;
                    });
                }
            },
            basketOP() {
                if (localStorage.getItem('frontend-user') == null) {
                    window.EventHub.$emit('request-login');
                    return;
                }

                if (this.resource.isbasket == '1') {
                    this.removeFromBasket();
                } else {
                    this.addToBasket();
                }
            },
            addToBasket() {
                addToBasket(this.resource.contentid).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        window.EventHub.$emit('add-basket');
                        this.resource.isbasket = 1;
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                    }
                }).catch(() => {
                    this.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
            },
            removeFromBasket() {
                removeFromBasket(this.resource.contentid).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.resource.isbasket = 0;
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                    }
                }).catch(() => {
                    this.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
            },
            download: function() {
                if (this.resource.contentid == '') return;
                
                if (localStorage.getItem('frontend-user') == null) {
                    window.EventHub.$emit('request-login');
                    return;
                }
// Author : GOD 2019-2-14 Bug ID: #770
                getMyScore().then(function(res){
                    if (res.data.serverResult.resultCode == "200") {
                        let score = parseInt(res.data.responseEntity);
                        let myUploadresource = false;
                        if(localStorage.getItem("frontend-user")){

                            if(JSON.parse(localStorage.getItem("frontend-user")).userId == this.resource.creator)
                                myUploadresource = true;
                            
                        }
                        if(this.resource.goodinfo.goodprice == 0 || myUploadresource)
                        {
                            if (this.ECRUtil.downloadResource(this.resource, this.$message) === false) {
                                this.$message({
                                    message: '文件不存在。',
                                    type: 'error'
                                });
                            }
                            isAlreadyDownload(this.resource.contentid).then(function(res1){
                                if (res1.data.serverResult.resultCode == "200") {
                                    let bAlreadyDownloaded = parseInt(res1.data.responseEntity);
                                    if (this.ECRUtil.downloadResource(this.resource, this.$message) === false) {
                                        this.$message({
                                            message: '文件不存在。',
                                            type: 'error'
                                        });
                                    } else {
                                        if(!bAlreadyDownloaded){
                                            this.resource_downtimes = this.resource_downtimes + 1;
                                        }
                                    }
                                    
                                } else {
                                    this.$message({
                                        message: res1.data.serverResult.resultMessage,
                                        type: 'error'
                                    });
                                }

                            }.bind(this)).catch(() => {
                                this.$message({
                                    message: '加载失败!',
                                    type: 'error'
                                });
                            });                            
                        }
                        else{
                            isAlreadyDownload(this.resource.contentid).then(function(res1){
                                if (res1.data.serverResult.resultCode == "200") {
                                    let bAlreadyDownload = parseInt(res1.data.responseEntity);
                                    if(bAlreadyDownload){
                                        if (this.ECRUtil.downloadResource(this.resource, this.$message) === false) {
                                            this.$message({
                                                message: '文件不存在。',
                                                type: 'error'
                                            });
                                        }
                                    }
                                    else{
            //                            let strConfirm = "您下载" + this.resource.name + "需要扣除" + this.resource.goodinfo.goodprice + "个积分，您共有积分" + score + "分。";
                                        let strConfirm = "下载当前资源需要扣除: " + this.resource.goodinfo.goodprice + "积分 ，您当前积分余额为:" + score;
                                        this.$confirm(strConfirm, '提示', {    
                                            type: 'warning'
                                        }).then(() => {
                                            if (this.ECRUtil.downloadResource(this.resource, this.$message) === false) {
                                                this.$message({
                                                    message: '文件不存在。',
                                                    type: 'error'
                                                });
                                            } else {
                                                this.resource_downtimes = this.resource_downtimes + 1;
                                            }
                                        }).catch(()=>{

                                        });

                                    }

                                } else {
                                    this.$message({
                                        message: res1.data.serverResult.resultMessage,
                                        type: 'error'
                                    });
                                }

                            }.bind(this)).catch(() => {
                                this.$message({
                                    message: '加载失败!',
                                    type: 'error'
                                });
                            });
                        }

                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.score = '?';
                    }
                }.bind(this)).catch(() => {
                    this.score = '?';
                    this.$message({
                        message: '加载失败!',
                        type: 'error'
                    });
                });
// Author : GOD 2019-2-14 Bug ID: #770                
            },
            reload() {
                this.load();
            },
            initialize() {
                this.reportContent.description = '';
                this.reportContent.username = '';
                this.reportContent.useremail = '';
                this.reportContent.userphone = '';
                this.reportContent.userqq = '';
                this.reportContent.subtype = '';                          
            },
            validateReportDescription(rule, value, callback) {
                if (this.reportContent.description.length > 100) {
                    callback(new Error('内容超出范围'));
                } else if (this.reportContent.description == null || this.reportContent.description == "") {
                    callback(new Error('举报内容描述不能为空'));
                } else {
                    callback();
                }
            },
            validatePhone(rule, value, callback) {
                var phoneRegExp = /^((\+)?[1-9]{1,2})?([-\s\.])?((\(\d{1,4}\))|\d{1,4})(([-\s\.])?[0-9]{1,12}){1,2}$/;
                if (phoneRegExp.test(value)) {
                    callback();
                } else {
                    callback(new Error('手机号格式不正确'));
                }
            },
            validateEmail(rule, value, callback) {
                var emailRegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
                if (emailRegExp.test(value)) {
                    callback();
                } else {
                    callback(new Error('邮箱地址格式不正确'));
                }
            },
            validateQQ(rule, value, callback) {
                var qqRegExp = /^[0-9]+$/;
                if (qqRegExp.test(value)) {
                    callback();
                } else {
                    callback(new Error('QQ号码格式不正确'));
                }
            },
            validateErrorDescription(rule, value, callback) {
                if (this.errorContent.description.length > 100) {
                    callback(new Error('内容超出范围'));
                } else if (this.errorContent.description == null || this.errorContent.description == "") {
                    callback(new Error('举报内容描述不能为空'));
                } else {
                    callback();
                }
            },
            report(data) {
                if (this.resource.contentid == '') return;

                if (localStorage.getItem('frontend-user') == null) {
                    window.EventHub.$emit('request-login');
                } else {
                    this.uiVisible = true;
                    this.content = data;
                    this.goReportUI();
                }
            },
            goReportUI() {
                this.isError = false;
                this.isReport = true;
                this.reportContent.username = JSON.parse(localStorage.getItem('frontend-user') ).realName;
                this.reportContent.useremail = JSON.parse(localStorage.getItem('frontend-user') ).loginEmail;
                this.reportContent.userphone = JSON.parse(localStorage.getItem('frontend-user') ).loginMobile;
                this.errorContent.description = "";
                this.errorContent.errorthumb.blobfile = "";
                this.errorContent.errorthumb.file = null;
            },
            goErrorReportUI() {
                this.isError = true;
                this.isReport = false;
                this.reportContent.description = "";
                this.reportContent.subtype = "";
                this.reportContent.username = "";
                this.reportContent.useremail = "";
                this.reportContent.userphone = "";
                this.reportContent.userqq = "";
            },
            openThumbFile() {
                document.getElementById('errorthumb').click();
            },
            readThumb(errorthumb) {
                var input = document.getElementById('errorthumb');
                var reader = new FileReader();

                reader.onload = function (e) {
                    errorthumb.blobfile = e.target.result;
                }
                errorthumb.file = input.files[0];
                reader.readAsDataURL(errorthumb.file);
            },
            send() {
                if (this.isReport) {
                    if (this.reportContent.userqq != "") {
                        var qqRegExp = /^[0-9]+$/;
                        if (qqRegExp.test(this.reportContent.userqq)) {
                            this.sendReport();
                        } else {
                            this.$message({
                                message: 'QQ号码格式不正确',
                                type: 'error'
                            });
                        }
                        
                    } else {
                        this.sendReport();
                    }
                } else if (this.isError) {
                    this.sendError();
                }
            },
            sendError() {
                this.$refs.errorContent.validate((valid) => {
                    if (valid) {
                        var file = this.errorContent.errorthumb.file;
                        if(!file){
                            this.$message({
                                message: '请选择图片文件',
                                type: 'error'
                            });
                            return;
                        }
                        var localPath = "";
                        this.sendLoading = true;
                        this.uploadImage(file).then((res) =>{
                            if (res.data.serverReults.resultCode == "200") {
                                if(res.data.fileInfos.length == 0){
                                    this.uploadErrorResource(null);                                   
                                }
                                localPath = res.data.fileInfos[0].localPath;
                                this.uploadErrorResource(localPath);
                            } else {
                                this.sendLoading = false;
                            }
                            
                        }).catch((err)=>{
                            this.sendLoading = false;
                        });
                    }    
                });
                
            },
            sendReport() {
                this.$refs.reportContent.validate((valid) => {
                    if (valid) {
                        let param = {
                            "objectid":this.content.contentid,
                            "type":"2",
                            "remark":this.reportContent.description,
                            "subtype": this.reportContent.subtype,
                            "userphone": this.reportContent.userphone,
                            "useremail": this.reportContent.useremail,
                            "userqq": this.reportContent.userqq,
                            "username": this.reportContent.username
                        };
                        this.sendLoading = true;
                        upLoadFeedback(param).then((res) => {
                            this.uiVisible = false;
                            if (res.data.serverResult.resultCode == "200") {
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.initialize();
                            } else {
                                this.$message({
                                    message: res.data.serverResult.resultMessage,
                                    type: 'error'
                                });
                            }
                            this.sendLoading = false;
                        }).catch(() => {
                            this.$message({
                                message: '操作失败',
                                type: 'error'
                            });
                            this.sendLoading = false;
                        });
                    }    
                });
            },
            uploadImage(file) {
                const data = new FormData();
                data.append('file' , file);

                return uploadFile({data:data});
            },
            uploadErrorResource(localpath) {
                let param = {
                    "objectid":this.content.contentid,
                    "type":"1",
                    "remark":this.errorContent.description,
                    "screenshot":{
                        "size":this.errorContent.errorthumb.file.size,
                        "localpath":localpath,
                        "width":"200",
                        "height":"120",
                        "format":ECRUtil.pickFileFormatOnly(this.errorContent.errorthumb.file.name),
                        "filename":this.errorContent.errorthumb.file.name
                    }
                };
                this.sendLoading = true;
                upLoadFeedback(param).then((res) =>{
                    if (res.data.serverResult.resultCode == "200" ) {
                        this.isError = false;
                        this.uiVisible = false;
                        this.errorContent.description = '';
                        this.errorContent.errorthumb.blobfile = '';
                        this.errorContent.errorthumb.file = null;
                        this.$message({
                            message: '提交成功',
                            type: 'success'
                        });
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                    }
                    this.sendLoading = false;
                }).catch(() => {
                    this.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                    this.sendLoading = false;
                });
            },
        },        
        created() {
            ECRUtil.authenticate(this.$router, '/home');
            this.load();
        },
        destroyed() {
            ECRUtil.stopAction(this.action);
        }
    }
</script>

<style scoped lang="scss">
    @import '~scss_vars';
    // .ecrm-upload-image {width: 200px; height: 120px; border: 1px dashed gray; float:left; margin-right: 10px;}
    .div-flex{
        display: flex;
    }
    .div-detail{
        max-width: 600px;
    }
</style>