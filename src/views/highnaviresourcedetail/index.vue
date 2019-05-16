<template>
    <section>
        <div class="ecrw-in">
            <div class="ecrw-list clearfix">
                <div class="ecrw-list-left">
                    <ecr-breadcrumb :steps="steps"></ecr-breadcrumb>
                    <div class="ecrw-list-media">
                        <div class="ecrw-list-resource">
                            <ecr-resource-viewer :item="resource"></ecr-resource-viewer>
                        </div>
                        <div class="ecrw-list-det">
                            <ul>
                                <li class="ecrw-list-det-li">
                                    <div class="ecrw-list-icon-wrap">
                                        <a href="javascript:;" title="浏览次数" class="ecrw-list-det-bro">{{ resource.viewtimes }}&nbsp;</a>
                                        <a href="javascript:;" title="点赞次数" class="ecrw-list-det-zan" :class="{ 'ecrw-list-det-zan-sel':resource.isvote==1 }" @click="vote">{{ resource.clicktimes }}&nbsp;</a>
                                        <a href="javascript:;" title="收藏次数" class="ecrw-list-det-add" :class="{ 'ecrw-list-det-add-sel':resource.isfavourite==1 }" @click="collect">{{ resource.collectiontimes }}&nbsp;</a>
                                        <a href="javascript:;" title="下载次数" class="ecrw-list-det-down">{{ resource.downtimes }}&nbsp;</a>
                                        <a href="javascript:;" title="资源篮" class="ecrw-list-det-basket" :class="{ 'ecrw-list-det-basket-sel':resource.isbasket==1 }" @click="basketOP">&nbsp;</a>
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
                                        <span class="ecrw-list-icon-num">{{ resource.score }}积分</span>
                                        <a href="javascript:;" class="ecrw-button ecrw-list-icon-down" :class="{ 'ecrw-button-disabled':resource.contentid=='' }" @click="download">下载</a>
                                    </div>
                                </li>
                                <li class="ecrw-list-det-li">
                                    <span>资源星级：</span>
                                    <my-rate :rate="resource.ratesum==null?0:resource.ratesum" @mouseover.native="showRatingPanel"></my-rate>
                                    <div class="ecrw-list-det-comment" v-if="isRating" @mouseleave="hideRatingPanel">
                                        <span>您的评星：</span>
                                        <a href="javascript:;" v-for="i in 5" class="ecrw-list-star-big" :class="{ 'ecrw-list-star-big-sel':resource.rating>=i }" @click="rate(i)"></a>
                                        <span class="ecrw-list-det-comment-num">{{ resource.rating }}</span>分
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <span style="float: right;">
                    <a href="javascript:;" class="ecrw-profile-enter" :class="{ 'ecrw-button-disabled':resource.contentid=='' }" style="color:#fff" @click="report(resource)">报错</a>
                </span>
                <span style="float: right;">
                    <span class="ecrw-list-icon-num">{{ twoTotalScore }}积分</span>
                    <a href="javascript:;" class="ecrw-profile-enter" :class="{ 'ecrw-button-disabled':resource.contentid=='' }" style="color:#fff" @click="downloadExtra">下载资源</a>
                </span>
                <div class="ecrw-list-right">
                    <div class="ecrw-list-blank"></div>
                    <ecr-shortcut-panel3
                        v-for="(threelabel, idx) in threelabellist"
                        :items="resources[idx].data"
                        :title="threelabel"
                        empty-string="当前类型的资源有点少~"
                        item-title-key="name" 
                        item-id-key="contentid" 
                        item-type-key="contenttype"
                        :key="idx"
                        :data="threelabel"
                        @button-click="selectedResource"
                        @update="loadResources(idx)">
                    </ecr-shortcut-panel3>
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
                <el-form-item label="图片上传 :">
                    <input type="file" id="errorthumb" @change="readThumb(errorContent.errorthumb)" style="display:none" accept=".png,.jpg"/>
                    <img :src="errorContent.errorthumb.blobfile" class="ecrm-upload-image" @click="openThumbFile"/>
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
                    <el-input placeholder="请输入联系电话" v-model="reportContent.userphone"></el-input>
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
                <el-button type="primary" @click="send">确定</el-button>
            </div>
        </el-dialog> 
    </section>
</template>

<script>
    import { getGoodsList, getResource, getLabelById, getMyScore, isAlreadyDownload, rateResource, voteResource, addToFavorite, removeFromFavorite, addToBasket, removeFromBasket, upLoadFeedback, uploadFile, getThreeLabelList } from '../../api/api';
    import ECRUtil from '../../common/js/util';

    export default {
        data() {
            return {
                ECRUtil:ECRUtil,
                threelabellist:[],
                resource: {
                    viewtimes:0,
                    clicktimes:0,
                    collectiontimes:0,
                    ratecount:0,
                    downtimes:0,
                    name:'',
                    score:0,
                    creatorname:'',
                    ratesum:0,
                    contentid:''
                },
                resources: [],
                threelabelPage:[],
                steps: [],
                myRating: 0,
                isRating: false,
                twoTotalScore: 0, //author:han
                twoTotalRescources: [], //author:han

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
                action: null
            }
        },
        methods: {
            load() {
                this.steps = [
                    {
                        title:'首页',
                        url:'/home'
                    },
                    {
                        title:'...',
                        url:'/navipackage/' + this.$route.params.onelabelid
                    },
                    {
                        title: '...',
                        url: ''
                    },
                    {
                        title:this.resource.name,
                        url:'javascript:;'
                    }
                ];

                //--- get label from labelid ------- author:han
                getLabelById(this.$route.params.onelabelid).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.steps[1].title = res.data.responseEntity.labelname;
                    } 
                });
                getLabelById(this.$route.params.twolabelid).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        if(res.data.responseEntity.score != null){
                            this.twoTotalScore = parseInt(res.data.responseEntity.score);
                        }
                    } 
                });
                //end:han
                
                let param = {
                    onelabelid:this.$route.params.onelabelid,
                    twolabelid:this.$route.params.twolabelid
                };
                getThreeLabelList(param).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        for (var i=0; i <res.data.pageInfo.list.length; i++) {
                            this.resources.push({ data:[] });
                            this.threelabelPage.push(1);
                        }
                        this.threelabellist = res.data.pageInfo.list;
                        if (this.threelabellist.length == 0) {
                            this.$message({
                                message: '没有三级标签',
                                type: 'error'
                            });
                            this.$router.push('/navipackage/' + this.$route.params.onelabelid);
                        } else {
                            for (var i=0; i <this.threelabellist.length; i++) {
                                this.loadResources(i);
                            }      
                        }
                    } else {
                        this.threelabellist = [];
                    }
                });
            },
            loadResources(idx) {
                if (this.resources[idx].data.length < 7 || this.threelabelPage[idx] == 10) {
                    this.threelabelPage[idx] = 1;
                } else {
                    this.threelabelPage[idx] += 1;
                }
                let params = {
                    pagination:{
                        numPerPage:7,
                        pageNo:this.threelabelPage[idx]
                    },
                    conditions: [
                        {
                            fieldName: 'threelabel',
                            fieldValues: [
                                this.threelabellist[idx].labelname
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        }
                    ]
                };
                getGoodsList(params).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.resources[idx].data = res.data.pageInfo.list;
                        //author:han
                        for(var i = 0; i < res.data.pageInfo.list.length; i++){
                            if(this.twoTotalRescources.length < 10){
                                this.twoTotalRescources.push(res.data.pageInfo.list[i].resource);
                            }
                        }
                        //end:han
                        this.loadFirstResource();
                        if (this.resources[idx].data.length == 0 && this.threelabelPage[idx] > 1) {
                            this.loadResources(idx);
                        }
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.resources[idx].data = [];
                    }
                }).catch(() => {
                    this.resources[idx].data = [];
                });
            },
            loadFirstResource() {
                if (this.resource.contentid == '') {
                    for (var i=0; i<this.resources.length; i++) {
                        if (this.resources[i].data.length > 0) {
                            this.loadResource(this.resources[i].data[0]);
                            break;
                        }
                    }
                }
            },
            loadResource(resource) {
                var resourceId = resource.resource.contentid;
                getResource(resourceId).then((res) => {
                    if (res.data.responseEntity == null) return;
                    this.resource = res.data.responseEntity;
                    this.resource.score = resource.goodprice;
                    this.myRating = this.resource.ratesum;

                    this.steps[2].title = (this.resource.schoolsection!=null?this.resource.schoolsection:'') + ' ' + 
                            (this.resource.subject!=null?this.resource.subject:'') + ' ' + 
                            (this.resource.editiontype!=null?this.resource.editiontype:'') + ' ' + 
                            (this.resource.grade!=null?this.resource.grade:'') + ' ' + 
                            (this.resource.bookmodel!=null?this.resource.bookmodel:''),
                    this.steps[3].title = this.resource.name;                    

                    this.similarPage = 1;

                });
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
                        // Author : GOD
                        // Date Start : 2019-2-6 
                        // Reason : Bug ID 397
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'success'
                        });
                        // Author : GOD
                        // Date End : 2019-2-6 
                        // Reason : Bug ID 397
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

                voteResource(this.resource.contentid).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.resource.clicktimes = res.data.responseEntity.clicktimes;
                        this.resource.isvote = res.data.responseEntity.isvote;
                        // Author : GOD
                        // Date Start : 2019-2-6 
                        // Reason : Bug ID 397
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'success'
                        });
                        // Author : GOD
                        // Date End : 2019-2-6 
                        // Reason : Bug ID 397
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
            collect() {
                if (localStorage.getItem('frontend-user') == null) {
                    window.EventHub.$emit('request-login');
                    return;
                }

                if (this.resource.isfavourite == 1) {
                    removeFromFavorite(this.resource.contentid).then((res) => {
                        if (res.data.serverResult.resultCode == "200") {
                            this.resource.isfavourite = 0;
                            this.resource.collectiontimes = res.data.responseEntity.collectiontimes;
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
                } else {
                    addToFavorite(this.resource.contentid).then((res) => {
                        if (res.data.serverResult.resultCode == "200") {
                            this.resource.isfavourite = 1;
                            this.resource.collectiontimes = res.data.responseEntity.collectiontimes;
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
            download() {
                if (this.resource.contentid == '') return;

                if (localStorage.getItem('frontend-user') == null) {
                    window.EventHub.$emit('request-login');
                    return;
                }

                getMyScore().then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        let score = parseInt(res.data.responseEntity);
                        let myUploadresource = false;
                        if(localStorage.getItem("frontend-user")){
                            if(JSON.parse(localStorage.getItem("frontend-user")).userId == this.resource.creator)
                                myUploadresource = true;
                        }
                        if(this.resource.goodinfo.goodprice == 0 || myUploadresource){
                            if (this.ECRUtil.downloadResource(this.resource, this.$message) === false) {
                                this.$message({
                                    message: '文件不存在。',
                                    type: 'error'
                                });
                            }
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
                                        let strConfirm = "下载当前资源需要扣除: " + this.resource.goodinfo.goodprice + "积分 ，您当前积分余额为:" + score;
                                        this.$confirm(strConfirm, '提示', {
                                            type: 'warning'
                                        }).then(() => {
                                            if (this.ECRUtil.downloadResource(this.resource, this.$message) === false) {
                                                this.$message({
                                                    message: '文件不存在。',
                                                    type: 'error'
                                                });
                                            }
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
                    }
                }).catch(() => {
                    this.$message({
                        message: '加载失败!',
                        type: 'error'
                    });
                });

            },
            //author:han
            downloadExtra() {
                if (this.twoTotalRescources.length == 0) return;
                if (localStorage.getItem('frontend-user') == null) {
                    window.EventHub.$emit('request-login');
                    return;
                }
                var resourceIds = [];
                for(var i = 0;i < this.twoTotalRescources.length; i++){
                    if(i >= 10){
                        return;
                    }
                    resourceIds.push(this.twoTotalRescources[i].contentid);
                }
                
                getMyScore().then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        let score = parseInt(res.data.responseEntity);
                        let myUploadresource = false;
                        if(localStorage.getItem("frontend-user")){
                            if(JSON.parse(localStorage.getItem("frontend-user")).userId == this.resource.creator)
                                myUploadresource = true;
                        }
                        if(this.twoTotalScore == 0 || myUploadresource){
                            this.ECRUtil.downloadResourceExtra(resourceIds, this.$route.params.twolabelid);
                        } else{
                            if(score >= this.twoTotalScore){
                                let strConfirm = "下载当前资源需要扣除: " + this.twoTotalScore + "积分 ，您当前积分余额为:" + score;
                                this.$confirm(strConfirm, '提示', {
                                    type: 'warning'
                                }).then(() => {
                                    this.ECRUtil.downloadResourceExtra(resourceIds, this.$route.params.twolabelid);
                                });
                            } else{
                                let strConfirm = "下载当前资源需要扣除: " + this.twoTotalScore + "积分 ，可您当前积分余额为:" + score + ", 不能下载!";
                                this.$confirm(strConfirm, '积分不足', {
                                    type: 'warning'
                                }).then(() => {

                                });
                            }
                            
                        }
                    }
                });
                
            }, 
            //end:han
            selectedResource(item) {
                this.resource = item;
                if(item.score == null){
                    this.resource.score = 0;
                } else{
                    this.resource.score = item.score;
                }
                this.steps[2].title = (this.resource.schoolsection!=null?this.resource.schoolsection:'') + ' ' + 
                            (this.resource.subject!=null?this.resource.subject:'') + ' ' + 
                            (this.resource.editiontype!=null?this.resource.editiontype:'') + ' ' + 
                            (this.resource.grade!=null?this.resource.grade:'') + ' ' + 
                            (this.resource.bookmodel!=null?this.resource.bookmodel:''),
                this.steps[3].title = item.name;
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
                    return;
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

            },
            goErrorReportUI() {
                this.isError = true;
                this.isReport = false;
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
                        var localPath = "";
                        this.uploadImage(file).then((res) =>{
                            if (res.data.serverReults.resultCode == "200") {
                                    localPath = res.data.fileInfos[0].localPath;
                                    this.uploadErrorResource(localPath);
                                }
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
                        }).catch(() => {
                            this.$message({
                                message: '操作失败',
                                type: 'error'
                            });
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
                }).catch(() => {
                    this.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
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
    .ecrm-upload-image {width: 200px; height: 120px; border: 1px dashed gray; float:left; margin-right: 10px;}

</style>