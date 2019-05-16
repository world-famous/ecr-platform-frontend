<template>
    <div class="ecrw-content">
        <div class="ecrw-in">
            <el-row>
                <el-col :span="24" align="center" v-for="(form,idx) in forms" :key="idx" :data="form" v-if="percentVisible[idx]">
                <span>{{ form.file!=null?form.file.name:'' }}</span><el-progress :percentage="uploadProgress[idx]" style="width:50%; margin-bottom: 50px;"></el-progress>
                </el-col>
                
                <el-col :span="24" align="right">
                    <div class="ecrm-upload-second">
                        <span>
                            <el-button type="primary" @click="addForm" :disabled="forms.length == 15">上传更多</el-button>
                        </span>
                        <span>
                            <el-button type="primary" @click="onSubmit" :loading="addLoading">确定</el-button>
                        </span>
                    </div>
                </el-col>
            </el-row>

            <!--  file Dialog  -->
            <input type="file" id="inputfile" name="inputfile" hidden @change="chosenFile"></input>

            <!-- main -->
            <el-form ref="form" :model="form" v-for="(form, frmIdx) in forms" :rules="formRules" :key="frmIdx" :data="form" label-width="90px" style="margin:20px;" class="ecrm-upload-resource">
                <el-form-item label="资源标题 :" prop="name">
                    <span>
                        <el-input v-model="form.name" :maxlength="25" style="width: 70%;"></el-input>
                    </span>
                    <span class="ecrm-upload-resource-desc">
                        备注：上传文件后，自动读取文件名。
                        <el-button type="primary" @click="removeForm(frmIdx)" v-if="forms.length > 1">关闭</el-button>
                    </span>
                </el-form-item>
                <el-form-item label="资源描述 :" prop="description" class="is-required">
                    <span>
                        <el-input type="textarea" v-model="form.description" style="width: 70%;"></el-input>
                    </span>
                </el-form-item>
                <el-form-item label="类别 :" prop="type">
                    <el-button type="bgsmall"
                        v-for="(contentType,idx) in CONTENT_TYPE"
                        :key="idx"
                        :data="contentType"
                        :class="{ 'el-button-selected':form.type==contentType.contenttype }"
                        :disabled="!ECRUtil.hasExtensionOfContentType(contentType, form.ext)"
                        @click="setType(form, contentType.contenttype)">
                        {{ contentType.contentname }}
                    </el-button>
                </el-form-item>
                <el-form-item label="所属学段 :" prop="schoolsectionid" class="is-required" style="display:inline-block">
                    <el-select v-model="form.schoolsectionid" @change="onChangeSchoolSection(form.schoolsectionid, frmIdx)">
                        <el-option :label="item.dictname" :value="item.dictvalue" v-for="(item, idx) in schoolsectionitems" :key="idx" :data="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属学科 :" prop="subjectid" class="is-required" style="display:inline-block">
                    <el-select v-model="form.subjectid" @change="onChangeSubject(form.schoolsectionid,form.subjectid,frmIdx)">
                        <el-option :label="item.dictname" :value="item.dictvalue" v-for="(item, idx) in form.subjectitems" :key="idx" :data="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属年级 :" prop="gradeid" class="is-required" style="display:inline-block">
                    <el-select v-model="form.gradeid" @change="onChangeGrade(frmIdx)">
                        <el-option :label="item.dictname" :value="item.dictvalue" v-for="(item, idx) in form.gradeitems" :key="idx" :data="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="教材版本:" prop = "editiontypeid" class = "is-required">
                            <el-select v-model = "form.editiontypeid" @change="onChangeEditionType(form.schoolsectionid, form.subjectid,form.editiontypeid,frmIdx)">                                   
                                <el-option :label = "item.dictname" :value = "item.dictvalue" v-for = "(item,idx) in form.editiontypeitems" :key = "idx" :data = "item"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="册别:" prop = "bookmodelid" class = "is-required">
                            <el-select v-model = "form.bookmodelid" @change="onChangeBookModel(frmIdx)">                                    
                                <el-option :label = "item.dictname" :value = "item.dictvalue" v-for = "(item, idx) in form.bookmodelitems" :key = "idx" data = "item"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item :label="cptIdx==0?'所属章节 :':''" v-for="(chapter, cptIdx) in form.chapters" :key="cptIdx" :data="chapter">
                    <span>
                        <ecr-tree-input @click.native="getChapter(frmIdx, cptIdx)" placeholder="请选择所属章节" :models="form.chapterPath[cptIdx]"></ecr-tree-input>
                    </span>
                    <span v-if="cptIdx==0">
                        <el-button type="primary" @click="addChapterForm" ><b>+</b></el-button>
                        <el-button type="primary"  @click="delChapterForm" ><b>-</b></el-button>
                    </span>
                </el-form-item>
                <el-form-item label="共享范围 :" prop="sharerange">
                    <el-select v-model="form.sharerange" placeholder="请选择共享范围">
                        <el-option value="1" label="全网"></el-option>
                        <el-option value="2" label="本省"></el-option>
                        <el-option value="3" label="本市"></el-option>
                        <el-option value="4" label="本区"></el-option>
                        <el-option value="5" label="本校"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>

            <el-col style="margin-bottom: 100px;" align="center">
                <el-button type="primary" @click="onSubmit" :loading="addLoading">确定</el-button>
            </el-col>

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
                    <el-button type="primary" @click.native="addProperty" :disabled="selectedRootBool">确定</el-button>
                    <el-button @click.native="includedChapterVisible = false">取消</el-button>
                </div>
            </el-dialog>

            <el-dialog v-model="successVisible" :close-on-click-modal="false" style="width: 100%;">
                <el-col style="font-size: 26px; color: #07b9ad;" align="center">
                    文件已经成功上传！
                </el-col>
                <el-col style="margin-bottom: 50px; margin-top: 50px" align="center">
                    <el-button type="primary" @click="onSuccess">确定</el-button>
                </el-col>
            </el-dialog>

            <el-dialog v-model="failureVisible" :close-on-click-modal="false" style="width: 100%;">
                <el-col style="font-size: 26px; color: #ff3333;" align="center">
                    文件失败上传！
                </el-col>
                <el-col style="margin-bottom: 50px; margin-top: 50px" align="center">
                    <el-button type="primary" @click="onSuccess">确定</el-button>
                </el-col>
            </el-dialog>
        </div>
    </div>

</template>

<script>
    import ECRUtil from '../../common/js/util';
    import { CONTENT_TYPE, ALL_EXTENSIONS } from '../../common/js/const';
    import { getSubjectList , getSchoolSectionList, getNaviGradeList, uploadResource , getTeachCatalogList ,getNaviEditionTypeList,getNaviBookModelList,getTeachCatalogHeader, getCatalogList, uploadFile, uploadFileInfo } from '../../api/api';

    export default {
        data() {
            return {
                format: ALL_EXTENSIONS,

                schoolsectionitems: [],
                forms: [],
                treeData:[],
                includedChapterLoading:false,
                formRules: {
                    name: [
                        { validator: this.validateNameProperty, trigger: 'blur' }
                    ],
                    description: [
                        { validator: this.validateDescriptionProperty, trigger: 'blur' }
                    ],
                    sharerange: [
                        { required: true, message: '请选项共享范围', trigger: 'blur' }
                    ],
                    'chapter[]': [
                        { required: true, message: '请选项所属章节', trigger: 'blur' }
                    ],
                    type: [
                        { required: true, message: '请选项类别', trigger: 'blur' }
                    ],
                    subjectid: [
                        { validator: this.validateSubjectProperty, trigger: 'blur' },
                    ],
                    schoolsectionid: [
                        { validator: this.validateSchoolsectionProperty, trigger: 'blur' },
                    ],
                    gradeid: [
                        { validator: this.validateGradeProperty, trigger: 'blur' },
                    ],
                    editiontypeid: [
                        { validator:this.validateEditiontypeProperty, trigger: 'blur'},
                    ],
                    bookmodelid: [
                        { validator: this.validateBookmodelProperty,trigger: 'blur'},
                    ]
                },

                ECRUtil: ECRUtil,
                CONTENT_TYPE: CONTENT_TYPE,
                curChapterIndex: 0,
                curFormIndex: 0,
                chapterid: null,
                clickedCptId:-1,

                includedChapterVisible: false,
                successVisible: false,
                failureVisible: false,
                failureMessage: [],
                addLoading: false,
                listLoading: false,
                uploadProgress: [],
                percentVisible: [],
                successCount: 0,
                failCount: 0,
                selectedRootBool: true,

                validateCheckNum: -1,
                clickedtime: 0,
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
                beforethread: [],
                lastthread: [],
                selsCount: 0,
                badWords: '',
                userClassInfo:[],

            }
        },
        methods: {
            validateNameProperty(rule, value, callback) {
                var filename = value.split("");
                if (filename.length > 25) {
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
                } else {
                    callback();
                }
            },
            validateSchoolsectionProperty(rule, value, callback) {
                if (value == "") {
                    callback(new Error('请选项所属学段'));
                } else {
                    callback();
                }
            },
            validateSubjectProperty(rule, value, callback) {
                if (value == "") {
                    callback(new Error('请选项所属学科'));
                } else {
                    callback();
                }
            },
            validateGradeProperty(rule, value, callback) {
                if (value == "") {
                    callback(new Error('请选项所属年级'));
                } else {
                    callback();
                }
            },          
            validateEditiontypeProperty(rule, value, callback) {
                if (value == "") {
                    callback(new Error('请选项教材版本'));
                } else {
                    callback();
                }
            },
            validateBookmodelProperty(rule, value, callback) {
                if (value == "") {
                    callback(new Error('请选项所属册别'));
                } else {
                    callback();
                }
            },
            load() {
                getSchoolSectionList({}).then((res) =>{
                    if(res.data.serverResult.resultCode == "200") {
                        this.schoolsectionitems = ECRUtil.composeSysDict(res.data.pageInfo.list);
                        if (this.schoolsectionitems.length > 0) {
                            if(this.getRecommendSchoolsectionid(this.schoolsectionitems)){
                                this.forms[0].schoolsectionid = this.getRecommendSchoolsectionid(this.schoolsectionitems);
                                return;
                            }
                        }
                        if (this.schoolsectionitems.length > 0) this.forms[0].schoolsectionid = this.schoolsectionitems[0].dictvalue;
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
                if(localStorage.getItem('frontend-user')){
                    this.userClassInfo  = JSON.parse(localStorage.getItem('frontend-user')).classinfo;
                } else {
                    this.userClassInfo = [];
                }               

            },
            getRecommendSchoolsectionid(sectionitems){
                if(this.userClassInfo.length){
                    for(var i = 0; i <sectionitems.length;i++){
                        if((sectionitems[i].dictvalue == this.userClassInfo[0].schoolsectionid) || (localStorage.getItem('recommend_schoolsectionid') == sectionitems[i].dictvalue)){
                            return sectionitems[i].dictvalue;
                        }
                    }
                }
                return null;
            },
            getRecommendGradeid(gradeitems){
                if(this.userClassInfo.length){
                    for(var i = 0; i <gradeitems.length;i++){
                        if((gradeitems[i].dictvalue == this.userClassInfo[0].gradeid) || (localStorage.getItem('recommend_gradeid') == gradeitems[i].dictvalue)){
                            return gradeitems[i].dictvalue;
                        }
                    }                    
                }
                return null;
            },
            getRecommendSubjectid(subjectitems){
                if(this.userClassInfo.length){
                    for(var i = 0; i <subjectitems.length;i++){
                        if((subjectitems[i].dictvalue == this.userClassInfo[0].subjectid) || (localStorage.getItem('recommend_subjectid') == subjectitems[i].dictvalue)){                           
                            return subjectitems[i].dictvalue;
                        }
                    }
                }
                return null;
            },
            getNaviSubject(schoolsectionid, frmIdx) {
                getSubjectList(schoolsectionid).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.forms[frmIdx].subjectitems = ECRUtil.composeSysDict(res.data.pageInfo.list);
                        for (var i=0; i<this.forms[frmIdx].subjectitems.length; i++) {
                            if (this.forms[frmIdx].subjectitems[i].dictvalue == this.forms[frmIdx].subjectid) return;
                        }                        
                        if (this.forms[frmIdx].subjectitems.length > 0) {
                            if(this.getRecommendSubjectid(this.forms[frmIdx].subjectitems)){
                                this.forms[frmIdx].subjectid = this.getRecommendSubjectid(this.forms[frmIdx].subjectitems);
                                return;
                            }
                        }
                        if (this.forms[frmIdx].subjectitems.length > 0) this.forms[frmIdx].subjectid = this.forms[frmIdx].subjectitems[0].dictvalue;
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.forms[frmIdx].subjectitems = [];
                    }
                }).catch(() => {
                    this.forms[frmIdx].subjectitems = [];
                });
            },
            getNaviGrade(schoolsectionid, frmIdx) {
                getNaviGradeList(schoolsectionid).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.forms[frmIdx].gradeitems = ECRUtil.composeSysDict(res.data.pageInfo.list);
                        for (var i=0; i<this.forms[frmIdx].gradeitems.length; i++) {
                            if (this.forms[frmIdx].gradeitems[i].dictvalue == this.forms[frmIdx].gradeid) return;
                        }
                        if (this.forms[frmIdx].gradeitems.length > 0) {
                            if(this.getRecommendGradeid(this.forms[frmIdx].gradeitems)){
                                this.forms[frmIdx].gradeid = this.getRecommendGradeid(this.forms[frmIdx].gradeitems);
                                return;
                            }
                        }
                        if (this.forms[frmIdx].gradeitems.length > 0) this.forms[frmIdx].gradeid = this.forms[frmIdx].gradeitems[0].dictvalue;
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.forms[frmIdx].gradeitems = [];
                    }
                }).catch(() => {
                    this.forms[frmIdx].gradeitems = [];
                });
            },
             getNaviEditionType(schoolsectionid, subjectid,frmIdx) {
                let param = {
                    schoolsectionid:schoolsectionid,
                    subjectid:subjectid
                };
                getNaviEditionTypeList(param).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.forms[frmIdx].editiontypeitems = ECRUtil.composeSysDict(res.data.pageInfo.list);
                        for( var i = 0 ; i < this.forms[frmIdx].editiontypeitems.length;i++){
                            if(this.forms[frmIdx].editiontypeitems[i].dictvalue == this.forms[frmIdx].editiontypeid) return;
                        }
                        if(this.forms[frmIdx].editiontypeitems.length > 0) this.forms[frmIdx].editiontypeid = this.forms[frmIdx].editiontypeitems[0].dictvalue;                        
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.forms[frmIdx].editiontypeitems = [];
                    }
                }).catch(() => {
                    this.forms[frmIdx].editiontypeitems = [];
                });
            },
            getNavBookModel(schoolsectionid, subjectid, editiontypeid,frmIdx) {
                let param = {
                    schoolsectionid:schoolsectionid,
                    subjectid:subjectid,
                    editiontypeid:editiontypeid
                };
                getNaviBookModelList(param).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        // this.bookModels = ECRUtil.composeSysDict(res.data.pageInfo.list);
                        this.forms[frmIdx].bookmodelitems = ECRUtil.composeSysDict(res.data.pageInfo.list);
                        for(var i = 0; i < this.forms[frmIdx].bookmodelitems.length; i++){
                            if(this.forms[frmIdx].bookmodelitems.dictvalue == this.forms[frmIdx].bookmodelid) return;
                        }
                        if(this.forms[frmIdx].bookmodelitems.length > 0) this.forms[frmIdx].bookmodelid = this.forms[frmIdx].bookmodelitems[0].dictvalue;
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error',
                        });
                        this.forms[frmIdx].bookmodelitems = [];
                    }
                }).catch(()=> {                   
                    this.forms[frmIdx].bookmodelitems = [];
                });
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
            getChapter: function(frmIdx, cptIdx) {
                this.includedChapterVisible = true;
                this.curFormIndex = frmIdx;
                this.curChapterIndex = cptIdx;
                this.clickedCptId = -1;
                this.selectedRootBool = true;
                this.thread = [];
                this.beforethread = [];
                this.lastthread = [];

                let para = {
                    lang:'zh_CN',
                    schoolsectionid: this.forms[frmIdx].schoolsectionid,
                    subjectid: this.forms[frmIdx].subjectid,
                    gradeid: this.forms[frmIdx].gradeid,
                    editiontypeid:this.forms[frmIdx].editiontypeid,
                    bookmodelid: this.forms[frmIdx].bookmodelid,
                    level: 0
                };
                this.listLoading = true;
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
                for (var i=0; i<this.forms[this.curFormIndex].chapters.length; i++) {
                    if (this.forms[this.curFormIndex].chapters[i] == this.clickedCptId) {
                        this.$message({
                            message: '章节重复',
                            type: 'error'
                        });
                        return;
                    }
                }
                this.forms[this.curFormIndex].chapterPath[this.curChapterIndex] = this.thread;
                this.forms[this.curFormIndex].chapters[this.curChapterIndex] = this.clickedCptId;
                this.includedChapterVisible = false;                
                this.selsCount = 0;
            },
            nodeClicked:function(nodeData, node, obj) {
                this.thread = this.getThread(node, []).reverse();
                if (nodeData.children.length == 0 && this.thread.length > 6) {
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
            addChapterForm: function() {
                this.forms[this.curFormIndex].chapters.push('');
            },
            delChapterForm: function() {
                var number = this.forms[this.curFormIndex].chapters.length - 1;
                if(number >= 1) {
                    this.forms[this.curFormIndex].chapters.splice(number , 1);
                    this.forms[this.curFormIndex].chapterPath.splice(number , 1);    
                }
            },
            addForm: function() {
                document.getElementById("inputfile").click();
            },
            removeForm(idx) {
                this.forms.splice(idx, 1);
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
                var file = e.target.files[0];
                var fileFormat = ECRUtil.pickFileFormatOnly(file.name);
                for (var i = 0; i < this.format.length; i++) {
                    if (fileFormat == this.format[i]) {
                        this.addFile(file);
                        return;
                    } 
                }
                this.$message({
                      message: "您上传的文件格式不支持",
                      type: 'error'
                });
            },
            setType(form, type) {
                form.type = type;
            },
            addFile(file) {
                var form = {
                    file: file,
                    name: ECRUtil.pickFileNameOnly(file.name),
                    ext: ECRUtil.pickFileFormatOnly(file.name),
                    description: '',
                    sharerange: '1',
                    chapters: [''],
                    chapterPath:[],
                    type: '',
                    gradeid:'',
                    subjectid: '',
                    schoolsectionid:'',
                    subjectitems:[],
                    gradeitems:[],
                     editiontypeid: '',
                    bookmodelid: '',                   
                    editiontypeitems: [],
                    bookmodelitems: [],                  
                };
                let contentTypes = ECRUtil.getContentTypesOfExt(form.ext);
                if (contentTypes.length > 0) {
                    form.type = contentTypes[0].contenttype;
                }
                this.forms.push(form);
                if (this.schoolsectionitems.length > 0) {
                    let _this = this;
                    this.$nextTick(function() {
                        form.schoolsectionid = _this.schoolsectionitems[0].dictvalue;
                    });
                }
            },
            onSubmit:function() {
                var len = this.forms.length;
                this.validateCheckNum = 0;
                for(var i = 0 ; i < len ; i++) {
                    this.$refs.form[i].validate((valid) => {
                        if(!valid) {
                            this.validateCheckNum = 1;
                        }
                    });
                }
                if(this.validateCheckNum == 0) {
                    this.addLoading = true;
                    this.uploadProgress = [];
                    this.percentVisible = [];
                    this.failureMessage = [];
                    for (var i = 0; i < this.forms.length; i++) {
                        this.uploadProgress.push(0);
                        this.percentVisible.push(false);
                        this.doUpload(i);
                    }
                }
            },
            setRecommendClassInfo(para){
                localStorage.setItem('recommend_schoolsectionid',para.schoolsectionid);
                localStorage.setItem('recommend_subjectid',para.subjectid.split(',')[0]);
                localStorage.setItem('recommend_gradeid',para.gradeid);
            },
            doUpload: function(index) {
                if (this.forms[index] == null) return;
                let para = {
                    name: this.forms[index].name,
                    description: this.forms[index].description,
                    catalogids: this.forms[index].chapters,
                    contenttype: this.forms[index].type,
                    sharerange: this.forms[index].sharerange,
                    schoolsectionid: this.forms[index].schoolsectionid,
                    subjectid: this.forms[index].subjectid,
                    gradeid: this.forms[index].gradeid,
                    bookmodelid: this.forms[index].bookmodelid,
                    editiontypeid: this.forms[index].editiontypeid,
                };

                uploadResource(para).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        var contentId = res.data.responseEntity.contentid;
                        ECRUtil.inputUserAction('上传资源', contentId);
                        this.uploadFile(contentId, index);
                        this.setRecommendClassInfo(para);
                    } else {
                        this.failureMessage.push({ resource:this.forms[index].name, message:res.data.serverResult.resultMessage });
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });

                        this.failCount += 1;
                        this.checkFinish('');
                    }
                }).catch(() => {
                    this.failureMessage.push({ resource:this.forms[index].name, message:'网有问题。' });
                    this.$message({
                        message: '资源上传失败',
                        type: 'error'
                    });

                    this.failCount += 1;
                    this.checkFinish('');
                });
            },
            uploadFile: function(contentId, index) {
                var file = this.forms[index].file;
                const data = new FormData();
                data.append('file', file);

                this.$set(this.percentVisible, index, true);
                var _this = this;
                uploadFile({ data:data, onUploadProgress:function(progressEvent) {
                    _this.$set(_this.uploadProgress, index, Math.floor(progressEvent.loaded * 100 / progressEvent.total));
                }}).then((res) => {
                    if (res.data.serverReults.resultCode == "200") {
                        this.uploadProgress[index] = 100;
                        this.uploadFileInfo(contentId, res.data.fileInfos[0], index);
                    } else {
                        this.failureMessage.push({ resource:this.forms[index].name, message:res.data.serverReults.resultMessage });
                        this.$message({
                              message: res.data.serverReults.resultMessage,
                              type: 'error'
                        });
                        this.failCount += 1;
                        this.checkFinish(contentId);
                    }
                }).catch(() => {
                    this.failureMessage.push({ resource:this.forms[index].name, message:'网有问题。' });
                    this.$message({
                          message: '资源文件上传失败',
                          type: 'error'
                    });
                    this.failCount += 1;
                    this.checkFinish(contentId);
                });
            },
            uploadFileInfo: function(contentId, fileInfo, index) {
                let para = {
                    contentid:contentId,
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
                        this.successCount += 1;
                        this.checkFinish(contentId);
                    } else {
                        this.failureMessage.push({ resource:this.forms[index].name, message:res.data.serverResult.resultMessage });
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.failCount += 1;
                        this.checkFinish('');
                    }
                }).catch(() => {
                    this.failureMessage.push({ resource:this.forms[index].name, message:'网有问题。' });
                    this.$message({
                        message: '资源文件上传失败',
                        type: 'error'
                    });
                    this.failCount += 1;
                    this.checkFinish('');
                });
            },
            checkFinish(contentId) {
                ECRUtil.inputUserAction('上传资源', contentId);
                if (this.successCount + this.failCount == this.forms.length) {
                    if (this.successCount == 0) {
                        this.failureVisible = true;
                    } else {
                        this.successVisible = true;
                    }
                    this.addLoading = false;
                    this.$router.push('/upload/step3');
                }
            },
            onSuccess: function() {
                this.$router.push('/upload/step1');
            },
            onChangeSchoolSection(section, frmIdx) {
                this.forms[frmIdx].chapterPath = [];

                let param = {
                    schoolsectionid: section
                };
                this.getNaviSubject(param, frmIdx);
                this.getNaviGrade(param, frmIdx);
            },
            onChangeSubject(schoolsectionid,subjectid,frmIdx) {
                this.forms[frmIdx].chapterPath = [];
                this.getNaviEditionType(schoolsectionid,subjectid,frmIdx);
            },
            onChangeGrade(frmIdx) {
                this.forms[frmIdx].chapterPath = [];
            },
            onChangeEditionType(schoolsectionid,subjectid,editiontypeid,frmIdx) {
                this.forms[frmIdx].chapterPath = [];
                this.getNavBookModel(schoolsectionid,subjectid,editiontypeid,frmIdx);
            },
            onChangeBookModel(frmIdx){
                this.forms[frmIdx].chapterPath = [];
            },
            selsChange: function (sels) {
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
            if(this.$router.file == null) {
                this.$router.push('/upload/step1');
                return;
            }
            this.load();
            this.addFile(this.$router.file);
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