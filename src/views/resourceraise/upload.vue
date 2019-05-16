<template>
    <section>
        <div class="ecrw-in">   
            <div class="ecrw-content-title ecrw-title-font20">
                上传征集资源
            </div>
            <div class="ecrw-zhengji-upload">
                <div class="ecrw-zhengji-upload-left">
                    <div class="ecrw-zhengji-upload-wrap">
                        <div class="ecrw-zhengji-upload-tips" v-if="activityInfo!= null">
                            <span class="ecrw-zhengji-upload-tips-span" :class="ECRUtil.resourceType(activityInfo.contenttype)">
                                {{ activityInfo.activityname + '(文件类型是 ' + activityInfo.format + ')' }}
                            </span>
                            <span class="ecrw-color-red">
                                赏金：{{ activityInfo.bonuspoints }} 积分
                            </span>
                        </div>
                        <div class="ecrw-zhengji-upload-det">
                            <el-progress :percentage="uploadProgress" v-if="percentVisible"></el-progress>  
                            <!--  file Dialog  -->
                            <input type="file" id="inputfile" name="inputfile" hidden @change="chosenFile"></input>

                            <!-- main -->
                            <el-form ref="form" :model="form" :rules="formRules" label-width="90px" style="margin:20px;" class="ecrm-upload-resource">
                                <el-form-item label="上传资源 :" prop="name">
                                    <span>
                                        <el-input v-model="form.name" :maxlength="25" style="width: 70%;"></el-input>
                                    </span>
                                    <span class="ecrm-upload-resource-desc">
                                        <el-button type="primary" @click="seletedFile" :disabled="activityInfo==null">选择</el-button>
                                    </span>
                                </el-form-item>
                                <el-form-item label="资源描述 :" prop="description">
                                    <el-input type="textarea" v-model="form.description" style="width: 70%"></el-input>
                                </el-form-item>
                                <el-form-item label="类别 :" prop="type">
                                    <el-button type="bgsmall"
                                        v-for="(contentType,idx) in CONTENT_TYPE"
                                        :key="idx"
                                        :data="contentType"
                                        :class="{'el-button-selected':form.type==contentType.contenttype }"
                                        :disabled="!ECRUtil.hasExtensionOfContentType(contentType, form.ext)"
                                        @click="setType(contentType.contenttype)">
                                        {{ contentType.contentname }}
                                    </el-button>
                                </el-form-item>
                                <el-row>
                                    <el-col :span="8">
                                        <el-form-item label="所属学段 :" prop="schoolsectionid" class="is-required">
                                            <el-select v-model="form.schoolsectionid" @change="onChangeSchoolSection(form.schoolsectionid)">
                                                <el-option :label="item.dictname" :value="item.dictvalue" v-for="(item, idx) in schoolsectionitems" :key="idx" :data="item"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="所属学科 :" prop="subjectid" class="is-required">
                                            <el-select v-model="form.subjectid" @change="onChangeSubject(form.subjectid)">
                                                <el-option :label="item.dictname" :value="item.dictvalue" v-for="(item, idx) in subjectitems" :key="idx" :data="item"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="所属年级 :" prop="gradeid" class="is-required">
                                            <el-select v-model="form.gradeid" @change="onChangeGrade()">
                                                <el-option :label="item.dictname" :value="item.dictvalue" v-for="(item, idx) in gradeitems" :key="idx" :data="item"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="8">
                                        <el-form-item label="教材版本:" prop="editiontypeid" class="is-required">
                                            <el-select v-model="form.editiontypeid" @change="onChangeEditionType(form.editiontypeid)">                                   
                                                <el-option :label="item.dictname" :value="item.dictvalue" v-for="(item, idx) in editiontypeitems" :key="idx" :data="item"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="册别:" prop="bookmodelid" class="is-required">
                                            <el-select v-model="form.bookmodelid" @change="onChangeBookModel">                                    
                                                <el-option :label="item.dictname" :value="item.dictvalue" v-for="(item, idx) in bookmodelitems" :key="idx" :data="item"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-form-item :label="cptIdx==0?'所属章节 :':''" v-for="(chapter, cptIdx) in form.chapters" :key="cptIdx" :data="chapter">
                                    <span>
                                        <ecr-tree-input @click.native="getChapter(cptIdx)" placeholder="请选择所属章节" :models="form.chapterPath[cptIdx]"></ecr-tree-input>
                                    </span>
                                    <span v-if="cptIdx==0">
                                        <el-button type="primary" @click="addChapterForm" ><b>+</b></el-button>
                                        <el-button type="primary"  @click="delChapterForm" ><b>-</b></el-button>
                                    </span>
                                </el-form-item>
                            </el-form>
                            <el-dialog title="所属章节选项" v-model="includedChapterVisible" :close-on-click-modal="false">
                                <el-tree
                                    style="width: 100%"
                                    :data="treeData"
                                    :default-expand-all="true"
                                    :expand-on-click-node="false"
                                    :show-checkbox="false"
                                    :accordion="false"
                                    :highlight-current="true"
                                    @node-click="nodeClicked"
                                    v-loading="includedChapterLoading"
                                    class="tree-dialog">
                                </el-tree>                                
                                <div slot="footer" class="dialog-footer">
                                    <el-button type="primary" @click.native="addProperty" :disabled="selectedRootBool" :loading="addLoading">确定</el-button>
                                    <el-button @click.native="includedChapterVisible = false">取消</el-button>
                                </div>
                            </el-dialog>
                        </div>
                        <div style="text-align: center; margin-bottom: 50px">
                            <span class="ecrw-zhengji-upload-check">
                                <el-checkbox label="匿名" v-model="form.anonymity" style="margin-right: 30px"></el-checkbox>
                            </span>
                            <span>
                                <el-button type="primary" @click="doUpload" :loading="saveloading">确定</el-button>
                            </span>
                        </div>
                        <div class="ecrw-zhengji-upload-list">
                            <div class="ecrw-content-title ecrw-title-font20">
                                <span class="ecrw-zhengji-upload-list-search">
                                    作者名称：
                                    <input type="text" class="ecrw-zhengji-upload-form" v-model="filters.realname">
                                    <a href="javascript:;" class="ecrw-zhengji-upload-form-href" @click="getResource">查询</a>
                                </span>
                                已有答案
                            </div>
                            <el-table :data="resources" highlight-current-row @selection-change="selsChange" >
                                <el-table-column label="">
                                    <template slot-scope="resource">
                                        <ecr-activity-model :resource="resource.row"></ecr-activity-model>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <el-col :span="24" style="margin-bottom: 50px; margin-top: 30px;">
                                <my-pagination @current-change="handleCurrentChange" :page="page" :page-size="page_size" :total="total"></my-pagination>
                            </el-col>
                        </div>
                    </div>
                </div>
                <div class="ecrw-zhengji-upload-right">
                    <div class="ecrw-zhengji-upload-right-wrap">
                        <div class="ecrw-zhengji-upload-user">
                            <div class="ecrw-zhengji-upload-user-left" v-if="userStatInfo!=null">
                                <ul>
                                    <li class="ecrw-zhengji-upload-user-left-pic">
                                        <a href="javascript:;">
                                            <img src="static/images/ecrw-head.png"/>
                                        </a>
                                    </li>
                                    <li class="ecrw-zhengji-upload-user-left-name">{{ loginInfo.name }}</li>
                                </ul>
                            </div>
                            <div class="ecrw-zhengji-upload-user-right" v-if="userStatInfo!= null">
                                <ul>
                                    <li class="ecrw-zhengji-upload-user-text">
                                        参与征集：<span class="ecrw-color-red">{{userStatInfo.collectionjoincount}}</span>次
                                    </li>
                                    
                                    <li class="ecrw-zhengji-upload-user-text">
                                        参与悬赏：<span class="ecrw-color-red">{{userStatInfo.rewardjoincount}}</span>次
                                    </li>
                                    <li class="ecrw-zhengji-upload-user-text">
                                        参与评比：<span class="ecrw-color-red">{{userStatInfo.estimatejoincount}}</span>次
                                    </li>
                                    <li class="ecrw-zhengji-upload-user-text">
                                        我发起的悬赏：<span class="ecrw-color-red">{{userStatInfo.rewardcreatecount}}</span>次
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="ecrw-zhengji-upload-new">
                            <ecr-last-activity
                                ref="lastactivity"
                                >
                            </ecr-last-activity>
                        </div>
                        <div class="ecrw-zhengji-upload-new">
                            <ecr-top-man
                                ref="topman"
                                >
                            </ecr-top-man>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import ECRUtil from '../../common/js/util';
    import { CONTENT_TYPE, ALL_EXTENSIONS } from '../../common/js/const';
    import { getSubjectList , getSchoolSectionList, getNaviGradeList, getFileList,getNaviEditionTypeList,getTeachCatalogList, getNaviBookModelList,uploadResource, getTeachCatalogHeader, getCatalogList, uploadFile, uploadFileInfo, uploadCollectionResource, getActivityResourceList, getActivity, getUserCountInfo } from '../../api/api';

    export default {
        data() {
            return {
                filters: {
                    realname: ''
                },
                forms: [],
                ECRUtil: ECRUtil,
                page: 1,
                page_size: 5,
                total: 0,
                format: ALL_EXTENSIONS,
                loading: false,
                schoolsectionitems:[],
                subjectitems:[],
                gradeitems:[],
                editiontypeitems:[],
                bookmodelitems: [],
                treeData: [],
                includedChapterLoading:false,
                form: {
                    file: Object,
                    name: '',
                    ext: '',
                    chapters: [''],
                    chapterPath:[],
                    type: '',
                    schoolsectionid:'',
                    subjectid: '',
                    gradeid:'',
                    description: '',
                    anonymity: false,
                    editiontypeid: '',
                    bookmodelid:'',
                },
                resetForm: {
                    file: Object,
                    name: '',
                    ext: '',
                    sharerange: '',
                    chapters: [''],
                    chapterPath:[],
                    type: '',
                    schoolsectionid:'',
                    subjectid: '',
                    gradeid:'',
                    description:'',
                    badWords: '',
                    editiontypeid: '',
                    bookmodelid:'',
                },
                formRules: {
                    name: [
                        { validator: this.validateNameProperty, trigger: 'blur' }
                    ],
                    description: [
                        { validator: this.validateDescriptionProperty, trigger: 'blur' }
                    ],
                    type: [
                        { required: true, message: '请选项类别', trigger: 'blur' }
                    ],
                    schoolsectionid: [
                        { required: true, message: '请选项所属学段', trigger: 'blur' }
                    ],
                    subjectid: [
                        { required: true, message: '请选项所属学科', trigger: 'blur' }
                    ],
                    gradeid: [
                        { required: true, message: '请选项所属年级', trigger: 'blur' }
                    ],
                },

                CONTENT_TYPE: CONTENT_TYPE,
                curChapterIndex: 0,
                chapterid: null,
                clickedCptId:-1,

                includedChapterVisible: false,
                percentVisible: false,
                addLoading: false,
                listLoading: false,
                uploadProgress: 0,
                selectedRootBool: true,
                activityid: '',
                loginInfo: {
                    name: '',
                    userid: '-1'
                },
                userStatInfo: null,
                activityInfo: null,
                resources: [],
                saveloading: false,
                totalResources: [],
                visibleResources:[],
                count: [],
                pageCount: [],
                orderIndex: false,
                firstTotal: [],
                /////////// Label Pagination //////
                label_page_size: 3,
                label_page_no: 1,
                /////////// Label Pagination //////,
                thread: [],
                badWords: ''
            }
        },
        methods: {
            validateNameProperty(rule, value, callback) {
                var filename = value.split("");
                if (value.length > 25) {
                    callback(new Error('文件名不能超过25文字'));
                } else if (value == "" || value == null) {
                    callback(new Error('请输入资源标题'));
                } else {
                    callback();
                }
            },
            validateDescriptionProperty(rule, value, callback) {
                if (value == "" || value == null) {
                    callback(new Error('请输入资源描述'));
                } 
                // else if (this.badWords.includes(value)) {
                //     callback(new Error('不能上传含有黄色暴力反政治等内容的资源文件。'));
                // } 
                else {
                    callback();
                }
            },
            load() {
                getSchoolSectionList({}).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.schoolsectionitems = ECRUtil.composeSysDict(res.data.pageInfo.list);
                        for (var i=0; i<this.schoolsectionitems.length; i++) {
                            if (this.schoolsectionitems[i].dictvalue == this.form.schoolsectionid) return;
                        }
                        if (this.schoolsectionitems.length > 0) this.form.schoolsectionid = this.schoolsectionitems[0].dictvalue;

                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.schoolsectionitems = [];
                    }
                }).catch(() => {
                    this.schoolsectionitems = [];
                });
                this.getResource();
                this.getActivityInfo();
                this.getUserCountInfo();
            },
            getResource() {
                let params = {
                    pagination:{
                        numPerPage:this.page_size,
                        pageNo:this.page,
                        calTotal:true
                    },
                    conditions: [
                        {
                            fieldName: 'realname',
                            fieldValues: [
                                this.filters.realname.trim()
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        },
                        {
                            fieldName: 'activityid',
                            fieldValues: [
                                this.activityid
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childConditions: null
                        },
                        {
                            fieldName: 'activitytype',
                            fieldValues: [
                                '1'
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childConditions: null
                        }
                    ]
                };

                getActivityResourceList(params).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.total = res.data.pageInfo.total;
                        this.resources = res.data.pageInfo.list;
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.total = 0;
                        this.resources = [];
                    }
                }).catch(() => {
                    this.total = 0;
                    this.resources = [];
                });
            },
            getActivityInfo() {
                getActivity(this.activityid).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.activityInfo = res.data.responseEntity;
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                    }
                });
            },
            getUserCountInfo() {
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
            },
            getNaviSubject(schoolsectionid) {
                getSubjectList(schoolsectionid).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.subjectitems = ECRUtil.composeSysDict(res.data.pageInfo.list);
                        for (var i=0; i<this.subjectitems.length; i++) {
                            if (this.subjectitems[i].dictvalue == this.form.subjectid) return;
                        }
                        if (this.subjectitems.length > 0) this.form.subjectid = this.subjectitems[0].dictvalue;
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.subjectitems = [];
                    }
                }).catch(() => {
                    this.subjectitems = [];
                });
            },
            getNaviGrade(schoolsectionid) {
                getNaviGradeList(schoolsectionid).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.gradeitems = ECRUtil.composeSysDict(res.data.pageInfo.list);
                        for (var i=0; i<this.gradeitems.length; i++) {
                            if (this.gradeitems[i].dictvalue == this.form.gradeid) return;
                        }
                        if (this.gradeitems.length > 0) this.form.gradeid = this.gradeitems[0].dictvalue;
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.gradeitems = [];
                    }
                }).catch(() => {
                    this.gradeitems = [];
                });
            },
            getEditionTypeOfOptions(section, subject) {
                let param = {
                    schoolsectionid:section,
                    subjectid:subject
                };
                getNaviEditionTypeList(param).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.editiontypeitems = ECRUtil.composeSysDict(res.data.pageInfo.list);
                        for (var i=0; i<this.editiontypeitems.length; i++) {
                            if (this.editiontypeitems[i].dictvalue == this.form.editiontypeid) return;
                        }
                        if (this.editiontypeitems.length > 0) this.form.editiontypeid = this.editiontypeitems[0].dictvalue;
                    } else {
                        this.editiontypeitems = [];
                    }
                });
            },
            getBookModelOfOptions(section, subject, editiontype) {
                let param = {
                    schoolsectionid:section,
                    subjectid:subject,
                    editiontypeid:editiontype
                };
                getNaviBookModelList(param).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.bookmodelitems = ECRUtil.composeSysDict(res.data.pageInfo.list);
                        for (var i=0; i<this.bookmodelitems.length; i++) {
                            if (this.bookmodelitems[i].dictvalue == this.form.bookmodelid) return;
                        }
                        if (this.bookmodelitems.length > 0) this.form.bookmodelid = this.bookmodelitems[0].dictvalue;

                    } else {
                        this.bookmodelitems = [];
                    }
                });
            },
            nodeClicked:function(nodeData, node, obj) {
                this.chapterThread = this.getThread(node, []).reverse();
                if (nodeData.children.length == 0 && this.chapterThread.length > 6) {
                    this.selectedRootBool = false;
                    this.clickedCptId = nodeData.catalogids[0];
                } else {
                    this.selectedRootBool = true;
                }
            },
            getThread: function(node, thread) {
                if (node.parent != null) {
                    thread.push({ label: node.label, dictvalue: node.data.id });
                    thread = this.getThread(node.parent, thread);
                }
                return thread;
            },
            composeData(data, level) {
                let resources = [];
                data.level = level;
                data.visible = false;
                data.expand = false;
                data.childCount = data.children.length;
                resources.push(data);
                
                for (var i=0; i<data.children.length; i++) {
                    let childTree = this.composeData(data.children[i], level + 1);
                    for (var j=0; j<childTree.length; j++) {
                        resources.push(childTree[j]);
                        if (childTree[j].level == level + 1) {
                            data.childCount += childTree[j].childCount;
                        }
                    }
                }
                return resources;
            },
            getChapter: function(cptIdx) {

                if(!this.form.editiontypeid){
                    this.$message({
                          message: '请选项教材版本',
                          type: 'error'
                    });
                    return;
                }
                if(!this.form.bookmodelid){
                    this.$message({
                          message: '请选项所属册别',
                          type: 'error'
                    });
                    return;
                }
                this.curChapterIndex = cptIdx;
                this.includedChapterVisible = true;
                this.clickedCptId = -1;
                this.selectedRootBool = true;

                let para = {
                    lang:'zh_CN',
                    schoolsectionid: this.form.schoolsectionid,
                    subjectid: this.form.subjectid,
                    gradeid: this.form.gradeid,
                    editiontypeid: this.form.editiontypeid,
                    bookmodelid: this.form.bookmodelid
                };
                this.treeData = [];
                this.includedChapterLoading = true;

                getTeachCatalogList(para).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.treeData = res.data.pageInfo.list;
                        this.includedChapterLoading = false;
                    } else {
                        this.treeData = [];
                        this.includedChapterLoading = false;
                    }
                }).catch(()=>{
                    this.treeData = [];
                    this.includedChapterLoading = false;
                });           
                
            },           
            addProperty: function() {                
                for (var i=0; i<this.form.chapters.length; i++) {
                    if (this.form.chapters[i] == this.clickedCptId) {
                        this.$message({
                            message: '章节重复',
                            type: 'error'
                        });
                        return;
                    }
                }
                this.form.chapterPath[this.curChapterIndex] = this.chapterThread;
                this.form.chapters[this.curChapterIndex] = this.clickedCptId;
                this.includedChapterVisible = false;                               
            },
            addChapterForm: function() {
                this.form.chapters.push('');
            },
            delChapterForm: function() {
                var number = this.form.chapters.length - 1;
                if(number >= 1) {
                    this.form.chapters.splice(number , 1);
                    this.form.chapterPath.splice(number , 1);    
                }
            },
            seletedFile: function() {
                this.loading = true;
                document.getElementById("inputfile").click();
                this.loading = false;
            },
            chosenFile: function(e) {
                if (e.target.files.length == 0) return;
                if(!e.target.files[0].size) {
                    this.$message({
                        message: "您不能上传空白的文件",
                        type: 'error'
                    });
                    return;
                }               
                let params = {
                    filename: e.target.files[0].name,
                    size: e.target.files[0].size.toString(),
                };
                getFileList(params).then((res) => {                    
                    if(res.data.pageInfo.list.length){                        
                        this.$message({
                            message: "您上传的文件已经存在",
                            type: 'error'
                        });
                        return;                       
                    }
                    var file = e.target.files[0];
                    this.form.file = file;
                    var fileFormat = ECRUtil.pickFileFormatOnly(file.name);
                    for(var i=0; i<this.activityInfo.formats.length; i++) {
                        if (this.activityInfo.formats[i] == fileFormat) {
                            this.addFile(file);
                            return;
                        } 
                    }
                    this.$message({
                        message: '文件类型错了,文件类型是' + this.activityInfo.format,
                        type: 'error'
                    });                    
                    
                }).catch(()=>{                    
                });                

               
            },
            setType(type) {
                this.form.type = type;
            },
            onChangeSchoolSection(section) {
                this.form.subjectid = "";
                this.form.gradeid = "";
                let param = {
                    schoolsectionid: section
                };
                this.getNaviSubject(param);
                this.getNaviGrade(param);
                this.onChangeNaviDetail();
            },
            onChangeSubject(subjectid) {
                this.form.editiontypeid = '';                
                this.getEditionTypeOfOptions(this.form.schoolsectionid, subjectid);
                this.onChangeNaviDetail();                  
            },
            onChangeGrade() {
                this.onChangeNaviDetail();
            },
            onChangeEditionType(editiontype) {                
                this.form.bookmodelid = '';                
                this.getBookModelOfOptions(this.form.schoolsectionid, this.form.subjectid, this.editiontype);
                this.onChangeNaviDetail();                
            },
            onChangeBookModel(){
                this.onChangeNaviDetail();            
            },
            onChangeNaviDetail() {                
                this.form.chapterPath = [];
                this.form.chapters = [''];               
            },            
            addFile(file) {
                this.form.name = ECRUtil.pickFileNameOnly(file.name);
                this.form.ext = ECRUtil.pickFileFormatOnly(file.name);
                
                let contentTypes = ECRUtil.getContentTypesOfExt(this.form.ext);
                if (contentTypes.length > 0) {
                    this.form.type = contentTypes[0].contenttype;
                }
            },
            doUpload: function() {
                this.$refs.form.validate((valid) =>{
                    if(valid) {
                        let para = {
                            name: this.form.name,
                            description: this.form.description,
                            catalogids: this.form.chapters,
                            contenttype: this.form.type ,
                            sharerange: this.form.sharerange,
                            subjectid: this.form.subjectid,
                            schoolsectionid: this.form.schoolsectionid,
                            gradeid: this.form.gradeid,
                            isanonymity: (this.form.anonymity)?1:0
                        };
                        var file = this.form.file;
                        this.saveloading = true;
                        uploadCollectionResource(para).then((res) => {
                            if (res.data.serverResult.resultCode == "200") {
                                var contentId = res.data.responseEntity.contentid;
                                this.uploadFile(contentId, file);
                                this.saveloading = false;
                            } else {
                                this.$message({
                                    message: res.data.serverResult.resultMessage,
                                    type: 'error'
                                });
                                this.saveloading = false;
                            }
                        }).catch(() => {
                            this.$message({
                                message: '操作失败',
                                type: 'error'
                            });
                            this.saveloading = false;
                        });
                    }
                });
            },
            uploadFile: function(contentId, file) {
                const data = new FormData();
                data.append('file', file);
                this.uploadProgress = 0;
                this.percentVisible = true;

                uploadFile({ data:data, onUploadProgress:this.onUploadProgress }).then((res) => {
                    if (res.data.serverReults.resultCode == "200") {
                        this.uploadFileInfo(contentId, res.data.fileInfos[0]);
                        this.uploadProgress = 100;
                    } else {
                        this.$message({
                              message: res.data.serverReults.resultMessage,
                              type: 'error'
                        });
                    }
                });
            },
            uploadFileInfo: function(contentId, fileInfo) {
                let para = {
                    contentid:contentId,
                    activityid: this.activityid,
                    fileinfo:{
                        fileid:fileInfo.fileId,
                        filename:fileInfo.fileName,
                        size:fileInfo.size,
                        localpath:fileInfo.localPath,
                        format:fileInfo.format,
                        md5:fileInfo.md5,
                        createtime:fileInfo.createTime,
                        lastmodifytime:fileInfo.lastModifyTime
                    }
                };
                uploadFileInfo(para).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        var resultMessage = res.data.serverResult.resultMessage;
                        this.$message({
                            message: resultMessage,
                            type: 'success'
                        });
                        this.form = Object.assign({} , this.resetForm);
                        this.percentVisible = false;
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
            onUploadProgress: function(progressEvent) {
                this.uploadProgress = Math.floor(progressEvent.loaded * 100 / progressEvent.total);
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getResource();
            },
            selsChapterChange: function (sels) {
                this.thread = [];
                if (sels.length > 0 && sels[0].level >= 5) {
                    for(var i=0;i<sels[0].extInfo.path.length;i++) {
                        this.thread.push({label: sels[0].extInfo.path[i], dictvalue: ''});
                    }
                    this.selectedRootBool = false;
                    this.clickedCptId = sels[0].id;
                } else {
                    this.selectedRootBool = true;
                }
            },
            toggleVisible(item, visible) {
                if (visible) {
                    for (var i=0; i<item.children.length; i++) {
                        item.children[i].visible = visible;
                    }
                } else {
                    var childCount = 0; 
                    for (var i = parseInt(item.index)+1; ; i ++) {
                        if (this.totalResources[i] == undefined) {
                            break;
                        }
                        else if (this.totalResources[i].level <= item.level) {
                            break;
                        } else {
                            childCount ++;
                        }

                    }
                    for (var i=0; i<childCount; i++) {
                        this.totalResources[parseInt(item.index)+1+i].visible = visible;
                        this.totalResources[parseInt(item.index)+1+i].expand = false;
                    }
                } 
            },
            selected(resource, index) {
                this.label_page_no = 1;
                var list = Object.keys(this.totalResources);
                for(var i=0;i<this.totalResources.length;i++){
                    this.totalResources[i].index = list[i];
                }
                if (resource.catalogids.length > 0 && resource.expand == false) {
                    let param = {
                        pagination:{
                            numPerPage:this.label_page_size,
                            pageNo: this.label_page_no
                        },
                        conditions:[
                            {
                                fieldName: "parentcatalogid",
                                fieldValues: [resource.catalogids[0]],
                                prepender: null,
                                operator: "EQUAL",
                                childConditions: null,
                            }
                        ]
                    };
                    getCatalogList(param).then((res) => {
                        if (res.data.serverResult.resultCode == "200") {
                            //mine
                            if (resource.level > 5){
                                this.pageCount[resource.catalogids[0]] = Math.ceil(resource.childcount/this.label_page_size);
                                this.count[resource.catalogids[0]] = 1;    
                            }
                            //end mine
                            let resources = res.data.pageInfo.list;
                            resource.expand = !resource.expand;
                            for (var i=0; i<resources.length;i++) {
                                
                                resources[i].expand = !resource.expand;
                            //    resources[i].showLength = resources.length;
                                resources[i].visible = true;
                                resources[i].level = resource.level + 1;
                                this.totalResources.splice(parseInt(resource.index)+1+i, 0, resources[i]);
                            }
                            this.totalResources[parseInt(resource.index)].showLength = resources.length; 
                            if (resource.level == 5) {
                                this.firstTotal[resource.id] = resources.length;
                            }
                            if (resource.level == 6) {
                                this.firstTotal[resource.parentcatalogid] += resources.length;
                            }
                            this.getVisibleResources();  
                        } else {
                            this.$message({
                                message: res.data.serverResult.resultMessage,
                                type: 'error'
                            });
                        }
                    })
                } else {
                    if(resource.level == 5){
                        this.totalResources.splice(parseInt(resource.index)+1, this.firstTotal[resource.id]);
                        this.firstTotal[resource.id] = 0;
                    }
                    if(resource.level == 6){
                        this.totalResources.splice(parseInt(resource.index)+1, resource.showLength);
                        this.firstTotal[resource.parentcatalogid] -= resource.showLength;
                    }
                    var list = Object.keys(this.totalResources);
                    for(var i=0;i<this.totalResources.length;i++){
                        this.totalResources[i].index = list[i];
                    }
                    resource.expand = !resource.expand;
                    this.toggleVisible(resource, resource.expand);
                    this.getVisibleResources();
                }
            },
            setInc(resource, catalogids) {
                this.orderIndex = true;
                this.count[catalogids] ++;
                this.getMoreData(resource, this.count[catalogids], catalogids);
            },
            getMoreData(resource, pageNo, catalogids) {
                if (this.orderIndex)
                    this.label_page_no ++;
                else 
                    this.label_page_no --;

                var list = Object.keys(this.totalResources);
                for(var i=0;i<this.totalResources.length;i++){
                    this.totalResources[i].index = list[i];
                }
                let param = {
                    pagination:{
                        numPerPage:this.label_page_size,
                        pageNo: pageNo
                    },
                    conditions:[
                        {
                            fieldName: "parentcatalogid",
                            fieldValues: [catalogids],
                            prepender: null,
                            operator: "EQUAL",
                            childConditions: null,
                        }
                    ]
                };
                getCatalogList(param).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        let resources = res.data.pageInfo.list;
                        if (resource.row.level == 5) {
                            this.totalResources.splice(parseInt(resource.row.index)+1, this.firstTotal[resource.row.id]);
                        }
                        if (resource.row.level == 6) {
                            this.totalResources.splice(parseInt(resource.row.index)+1, resource.row.showLength);
                        }
                        for (var i=0; i<resources.length;i++) {
                            resources[i].expand = !resource.row.expand;
                            resources[i].visible = true;
                            resources[i].level = resource.row.level + 1;
                            this.totalResources.splice(parseInt(resource.row.index)+1+i, 0, resources[i]);
                        }
                        this.totalResources[parseInt(resource.row.index)].showLength = resources.length; 
                        if (resource.row.level == 5) {
                            this.firstTotal[resource.row.id] = resources.length;
                        }
                        if (resource.row.level == 6) {
                            this.firstTotal[resource.row.parentcatalogid] -= this.label_page_size;
                            this.firstTotal[resource.row.parentcatalogid] += resources.length;
                        }
                        this.getVisibleResources();  
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                    }
                });
            },
            setDec(resource, catalogids) {
                this.orderIndex = false;
                this.count[catalogids] --;
                this.getMoreData(resource, this.count[catalogids], catalogids);
            },
            getVisibleResources() {
                this.visibleResources = [];
                for (var i=0; i<this.totalResources.length; i++) {
                    if (this.totalResources[i].visible == true) {
                        this.visibleResources.push(this.totalResources[i]);
                    }
                }
            }
        },
        created() {
            this.badWords = localStorage.getItem('badwords');
            ECRUtil.authenticate(this.$router, '/home');
            
            let steps = [
                {
                    title:'首页',
                    url:'/home'
                },
                {
                    title:'征集活动',
                    url:'/collection/0'
                }
            ];
            localStorage.setItem('step', JSON.stringify(steps));

            var user = localStorage.getItem('frontend-user');
            if (user != null) {
                this.loginInfo.name = JSON.parse(user).realName;
                this.loginInfo.userid = JSON.parse(user).userId;
            }
            this.activityid = this.$route.params.id;

            this.load();
        }
    }
</script>

<style scoped lang="scss">
    @import '~scss_vars';
    .ecrm-table-left-list-open {
        background: url('../../../static/images/ecrm-icon-open-open.png') no-repeat left center;
        display: inline-block;
        cursor: pointer;
        width: 18px;
        height: 11px;
    }
    .ecrm-table-left-list-close {
        background: url('../../../static/images/ecrm-icon-open-close.png') no-repeat left center;
        display: inline-block;
        cursor: pointer;
        width: 18px;
        height: 11px;
    }
    .ecrm-tabl-level-ico{
      width:22px;
      height:22px;
      display:inline-block;
      margin-left:8px;
      vertical-align:middle;
      zoom: 1;
      margin-top: 6px;
    }
    .ecrm-dialog-icon-up{background:url('../../../static/images/ecrw-icon-up.png') no-repeat;}
    .ecrm-dialog-icon-down{background:url('../../../static/images/ecrw-icon-down.png') no-repeat;}
    .ecrm-dialog-icon-up:hover{background:url('../../../static/images/ecrw-icon-up-sel.png') no-repeat;}
    .ecrm-dialog-icon-down:hover{background:url('../../../static/images/ecrw-icon-down-sel.png') no-repeat;}
</style>