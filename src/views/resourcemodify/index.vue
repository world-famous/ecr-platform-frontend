<template>
    <section>
        <div class="ecrw-in">
            <div class="ecrw-ready">
                <div class="ecrw-dao-wrap">
                    <ecr-breadcrumb :steps="steps"></ecr-breadcrumb>
                </div>
            </div>
        </div>
        <div class="ecrw-content">
            <div class="ecrw-in">   
                <div class="ecrw-content-title ecrw-title-font20">
                    资源修改
                </div>
                <div>
                    <el-progress :percentage="uploadProgress" v-if="percentVisible"></el-progress>  
                    <!--  file Dialog  -->
                    <input type="file" id="inputfile" name="inputfile" hidden @change="chosenFile"></input>

                    <!-- main -->
                    <el-form ref="form" :model="form" :rules="formRules" label-width="90px" style="margin:20px;" class="ecrm-upload-resource">                        
                        <el-form-item label="上传资源 :" prop="name">
                            <span>
                                <el-input v-model="form.name" style="width: 70%;"></el-input>
                            </span>
                            <span class="ecrm-upload-resource-desc">
                                <el-button type="primary" @click="seletedFile">选择</el-button>
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
                                :class="{ 'el-button-selected':form.type==contentType.contenttype }"
                                :disabled="!ECRUtil.hasExtensionOfContentType(contentType, form.ext)"
                                @click="setType(contentType.contenttype)">
                                {{ contentType.contentname }}
                            </el-button>
                        </el-form-item>
                        <el-form-item label="所属学段 :" prop="schoolsectionid" class="is-required" style="display:inline-block;">
                            <el-select v-model="form.schoolsectionid" @change="onChangeSchoolSection(form.schoolsectionid)">
                                <el-option :label="item.dictname" :value="item.dictvalue" v-for="(item, idx) in schoolsectionitems" :key="idx" :data="item"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="所属学科 :" prop="subjectid" class="is-required" style="display:inline-block;">
                            <el-select v-model="form.subjectid" @change="onChangeSubject(form.subjectid)">
                                <el-option :label="item.dictname" :value="item.dictvalue" v-for="(item, idx) in subjectitems" :key="idx" :data="item"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="所属年级 :" prop="gradeid" class="is-required" style="display:inline-block;">
                            <el-select v-model="form.gradeid" @change="onChangeGrade()">
                                <el-option :label="item.dictname" :value="item.dictvalue" v-for="(item, idx) in gradeitems" :key="idx" :data="item"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="教材版本:" prop="editiontypeid" class="is-required" style="display:inline-block;">
                                    <el-select v-model="form.editiontypeid" @change="onChangeEditionType(form.editiontypeid)">                                   
                                        <el-option :label="item.dictname" :value="item.dictvalue" v-for="(item, idx) in editiontypeitems" :key="idx" :data="item"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="册别:" prop="bookmodelid" class="is-required" style="display:inline-block;">
                                    <el-select v-model="form.bookmodelid" @change="onChangeNaviDetail">                                    
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
                        <el-form-item label="共享范围 :" prop="sharerange">
                            <el-select v-model="form.sharerange" placeholder="请选择共享范围">
                                <el-option value="1" label="全网"></el-option>
                                <el-option value="2" label="本省"></el-option>
                                <el-option value="3" label="本市"></el-option>
                                <el-option value="4" label="本区"></el-option>
                                <el-option value="5" label="本校任选其一"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>

                    <el-col style="margin-bottom: 100px;" align="center">
                        <el-button :loading="listloading" type="primary" @click="doUpload">确定</el-button>
                    </el-col>                    
                </div>
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
        </div>
    </section>
</template>

<script>
    import ECRUtil from '../../common/js/util';
    import { CONTENT_TYPE, ALL_EXTENSIONS } from '../../common/js/const';
    import { getSubjectList , getSchoolSectionList, getNaviGradeList, getTeachCatalogList, getFileList,getNaviEditionTypeList,getNaviBookModelList,uploadFile, uploadFileInfo, editResource, getResource } from '../../api/api';

    export default {
        data() {
            return {
                ECRUtil: ECRUtil,
            
                format: ALL_EXTENSIONS,
                loading: false,
                steps: [],
                treeData: [],
                schoolsectionitems:[],
                subjectitems:[],
                gradeitems:[],
                editiontypeitems:[],
                bookmodelitems: [],
                selectedschoolsection:'',
                selectedsubject:'',
                selectedgrade:'',
                selectededitiontype: '',
                selectedbookmodel: '',
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
                    sharerange: '',
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
                    editiontypeid: '',
                    bookmodelid:'',
                    description:''
                },
                formRules: {
                    name: [
                        { required: true, message: '请输入资源标题', trigger: 'blur' }
                    ],
                    description: [
                        { required: true, message: '请输入资源描述', trigger: 'blur'}
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
                    sharerange: [
                        { required: true, message: '请选项共享范围', trigger: 'blur' }
                    ]
                },

                CONTENT_TYPE: CONTENT_TYPE,
                curChapterIndex: 0,
                chapterThread: [],
                chapterid: null,
                clickedCptId:-1,

                
                includedChapterVisible: false,
                percentVisible: false,
                addLoading: false,
                listloading: false,
                uploadProgress: 0,
                selectedRootBool: true,
               
                resources: []
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
                        title:'我的上传',
                        url:'/mycenter/goods/upload'
                    },
                    {
                        title:'资源修改',
                        url:'/resourcemodify/' + this.contentid
                    }
                ];
                localStorage.setItem('step', JSON.stringify(this.steps));
                getSchoolSectionList({}).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.schoolsectionitems = ECRUtil.composeSysDict(res.data.pageInfo.list);
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
                getResource(this.$route.params.contentid).then((res) => {                    
                    if (res.data.serverResult.resultCode == "200") {
                        this.resources = res.data.responseEntity;
                        this.form.name = res.data.responseEntity.name;
                        this.form.ext = res.data.responseEntity.fileInfo.format;
                        this.form.description = res.data.responseEntity.description;
                        this.form.type = res.data.responseEntity.contenttype;
                        this.form.schoolsectionid = res.data.responseEntity.schoolsectionid;
                        this.selectedschoolsection = res.data.responseEntity.schoolsectionid;
                        this.form.subjectid = res.data.responseEntity.subjectid;
                        this.selectedsubject = res.data.responseEntity.subjectid;
                        this.form.gradeid = res.data.responseEntity.gradeid;
                        this.selectedgrade = res.data.responseEntity.gradeid;
                        this.form.editiontypeid = res.data.responseEntity.editiontypeid;
                        this.selectededitiontype = res.data.responseEntity.editiontypeid;
                        this.form.bookmodelid = res.data.responseEntity.bookmodelid;
                        this.selectedbookmodel = res.data.responseEntity.bookmodelid;

                        this.form.sharerange = res.data.responseEntity.sharerange;
                        this.form.file = null;
                        if (res.data.responseEntity.catalogids != null && res.data.responseEntity.catalogids.length > 0) {
                            this.form.chapters = res.data.responseEntity.catalogids;
                        }
                        this.form.chapterPath = [];
                        for (var i = 0; i < this.resources.subnaviInfos.length; i++) {
                            if (this.resources.subnaviInfos.length - 1 < i) {
                                this.form.chapterPath.push([]);
                                continue;
                            }
                            this.form.chapterPath.push([
                                { label: this.resources.subnaviInfos[i].schoolsection, dictvalue: this.resources.subnaviInfos[i].schoolsectionid },
                                { label: this.resources.subnaviInfos[i].subject, dictvalue: this.resources.subnaviInfos[i].subjectid },
                                { label: this.resources.subnaviInfos[i].grade, dictvalue: this.resources.subnaviInfos[i].gradeid },
                                { label: this.resources.subnaviInfos[i].editiontype, dictvalue: this.resources.subnaviInfos[i].editiontypeid },
                                { label: this.resources.subnaviInfos[i].bookmodel, dictvalue: this.resources.subnaviInfos[i].bookmodelid },                                
                                { label: this.resources.subnaviInfos[i].bookname, dictvalue: this.resources.subnaviInfos[i].bookid },
                                { label: this.resources.subnaviInfos[i].chapter },
                                { label: this.resources.subnaviInfos[i].section },
                                { label: this.resources.subnaviInfos[i].lesson }
                            ]);
                        }
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                    }
                }).catch(() => {
                   
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
            nodeClicked:function(nodeData, node, obj) {
                this.chapterThread = this.getThread(node, []).reverse();
                if (nodeData.children.length == 0 && this.chapterThread.length > 6) {
                    this.selectedRootBool = false;
                    this.clickedCptId = nodeData.catalogids[0];
                } else {
                    this.selectedRootBool = true;
                }
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
                    
                }).catch(()=>{                    
                });                
            },
            setType(type) {
                this.form.type = type;
            },
            onChangeSchoolSection(section) {
                let param = {
                    schoolsectionid: section
                };
                this.selectedschoolsection = section;
                this.getNaviSubject(param);
                this.getNaviGrade(param);
                this.onChangeNaviDetail();
            },
            onChangeSubject(subjectid) {
                this.onChangeNaviDetail();

                this.selectedsubject = subjectid;
                // this.form.editiontypeid = '';                
                this.getEditionTypeOfOptions(this.selectedschoolsection, this.selectedsubject);
                this.onChangeNaviDetail();                
            },
            onChangeGrade() {
                this.onChangeNaviDetail()
            },
            onChangeEditionType(editiontype) {             
                this.selectededitiontype = editiontype;
                this.selectedbookmodel = '';                
                this.getBookModelOfOptions(this.selectedschoolsection, this.selectedsubject, this.selectededitiontype);
                this.onChangeNaviDetail();
            },
            onChangeNaviDetail() {
                if (this.selectedschoolsection != this.form.schoolsectionid || this.selectedsubject != this.form.subjectid || this.selectedgrade != this.form.gradeid) {
                    this.form.chapterPath = [];
                    this.form.chapters = [''];
                } else {
                    
                }
            },
            addFile(file) {
                this.form.name = ECRUtil.pickFileNameOnly(file.name);
                this.form.ext = ECRUtil.pickFileFormatOnly(file.name);
                let contentTypes = ECRUtil.getContentTypesOfExt(this.form.ext);
                if (contentTypes.length > 0) this.form.type = contentTypes[0].contenttype;
            },
            doUpload: function() {
                this.$refs.form.validate((valid) =>{
                    if(valid) {
                        if(this.form.file == null) {
                            this.listloading = true;
                            let param = {
                                contentid:this.contentid,
                                name:this.form.name,
                                contenttype:this.form.type,
                                sharerange:this.form.sharerange,
                                description:this.form.description,
                                subjectid:this.form.subjectid,
                                schoolsectionid: this.form.schoolsectionid,
                                gradeid: this.form.gradeid,
                                editiontypeid: this.form.editiontypeid,
                                bookmodelid: this.form.bookmodelid,                                
                                catalogids:this.form.chapters,
                                fileInfo: this.resources.fileInfo
                            };                            
                            editResource(param).then((res) => {
                                this.listloading = false;
                                this.$router.push('/mycenter/goods/upload');
                            });
                        } else {
                            this.listloading = true;
                            let para = {
                                name: this.form.name,
                                description: this.form.description,
                                catalogids: this.form.chapters,
                                contenttype: this.form.type ,
                                sharerange: this.form.sharerange,
                                subjectid: this.form.subjectid,
                                schoolsectionid: this.form.schoolsectionid,
                                editiontypeid: this.form.editiontypeid,
                                bookmodelid: this.form.bookmodelid,         
                                gradeid: this.form.gradeid,
                            };
                            var file = this.form.file;
                            this.uploadFile(file);
                                
                        }
                        
                    }
                });
            },
            uploadFile: function(file) {
                const data = new FormData();
                data.append('file', file);
                this.uploadProgress = 0;
                this.percentVisible = true;

                uploadFile({ data:data, onUploadProgress:this.onUploadProgress }).then((res) => {
                    if (res.data.serverReults.resultCode == "200") {
                        this.uploadFileInfo(res.data.fileInfos[0]);
                        this.uploadProgress = 100;
                    } else {
                        this.$message({
                              message: res.data.serverReults.resultMessage,
                              type: 'error'
                        });
                    }
                });
            },
            uploadFileInfo: function(fileInfo) {
                let para = {
                    contentid:this.contentid,
                    name:this.form.name,
                    contenttype:this.form.type,
                    sharerange:this.form.sharerange,
                    description:this.form.description,
                    subjectid:this.form.subjectid,
                    schoolsectionid: this.form.schoolsectionid,
                    gradeid: this.form.gradeid,
                    editiontypeid: this.form.editiontypeid,
                    bookmodelid: this.form.bookmodelid,         
                    catalogids:this.form.chapters,
                    fileInfo:{
                        fileid:this.resources.fileInfo.fileid,
                        filename:fileInfo.fileName,
                        size:fileInfo.size,
                        localpath:fileInfo.localPath,
                        format:fileInfo.format,
                        md5:fileInfo.md5,
                        createtime:fileInfo.createTime,
                        lastmodifytime:fileInfo.lastModifyTime
                    }
                };
                editResource(para).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.listloading = false;
                        var resultMessage = res.data.serverResult.resultMessage;
                        this.$message({
                            message: resultMessage,
                            type: 'success'
                        });
                        this.percentVisible = false;
                        this.$router.push('/mycenter/goods/upload');
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
            getThread: function(node, thread) {
                if (node.parent != null) {
                    thread.push({ label: node.label, dictvalue: node.data.id });
                    thread = this.getThread(node.parent, thread);
                }
                return thread;
            },
        },
        created() {
            this.contentid = this.$route.params.contentid;
            this.load();
        }
    }
</script>

<style scoped lang="scss">
    @import '~scss_vars';
    
</style>