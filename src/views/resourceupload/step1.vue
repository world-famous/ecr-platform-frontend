<template>
    <div class="ecrm-mode-content">
        <div class="ecrm-upload-sub">
            <input type="button" value="上传我的资源" class="ecrm-upload-button" @click="chooseFile"/>
            <div class="ecrm-upload-tips">
                （支持单个文件、多个文件、以及文件夹的上传）
            </div>
        </div>
        <input type="file" id="inputfile" name="inputfile" hidden @change="chosenFile"></input>
        <div class="ecrm-upload-det">
            <table class="ecrm-upload-table">
                <tr>
                    <td class="ecrm-upload-tdl">MS Office文档</td>
                    <td class="ecrm-upload-tdr">
                        <span class="ecrm-upload-text ecrm-icon-word">doc,docx</span>
                        <span class="ecrm-upload-text ecrm-icon-ppt">ppt,pptx</span>
                    </td>
                </tr>
                <tr>
                    <td class="ecrm-upload-tdl">PDF</td>
                    <td class="ecrm-upload-tdr">
                        <span class="ecrm-upload-text ecrm-icon-pdf">PDF</span>
                    </td>
                </tr>
                <tr>
                    <td class="ecrm-upload-tdl">纯文本</td>
                    <td class="ecrm-upload-tdr"><span class="ecrm-upload-text ecrm-icon-text">txt</span></td>
                </tr>
                <tr>
                    <td class="ecrm-upload-tdl">Flash</td>
                    <td class="ecrm-upload-tdr"><span class="ecrm-upload-text ecrm-icon-flash">flv,swf</span></td>
                </tr>
                <tr>
                    <td class="ecrm-upload-tdl">音频</td>
                    <td class="ecrm-upload-tdr"><span class="ecrm-upload-text ecrm-icon-music">mp3,aac</span></td>
                </tr>
                <tr>
                    <td class="ecrm-upload-tdl">视频</td>
                    <td class="ecrm-upload-tdr"><span class="ecrm-upload-text  ecrm-icon-video">mp4,mpg,avi,wmv</span></td>
                </tr>
                <tr>
                    <td class="ecrm-upload-tdl">图片</td>
                    <td class="ecrm-upload-tdr"><span class="ecrm-upload-text ecrm-icon-pic">jpg,png,gif</span></td>
                </tr>
                <tr>
                    <td class="ecrm-upload-tdl">电子书</td>
                    <td class="ecrm-upload-tdr"><span class="ecrm-upload-text ecrm-icon-epub">epub</span></td>
                </tr>
                <tr>
                    <td class="ecrm-upload-tdl">动画资源</td>
                    <td class="ecrm-upload-tdr"><span class="ecrm-upload-text  ecrm-icon-zip">zip,rar</span></td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
    import { ALL_EXTENSIONS } from '../../common/js/const'
    import ECRUtil from '../../common/js/util'
    import { getFileList } from '../../api/api';

    export default {
        data() {
            return {
                format: ALL_EXTENSIONS
            }
        },
        methods: {
            nextStep: function(file) {
                this.$router.file = file;
                this.$router.push({ path: '/upload/step2' });
            },
            chooseFile: function() {
                document.getElementById("inputfile").click();
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
                    var fileFormat = ECRUtil.pickFileFormatOnly(file.name);
                    for (var i = 0; i < this.format.length; i++) {
                        if(fileFormat == this.format[i]) {
                            this.nextStep(file);
                            return;
                        } 
                    }
                    this.$message({
                        message: "您上传的文件格式不支持",
                        type: 'error'
                    });                    
                }).catch(()=>{                    
                });                
                
            }
        },
        created() {
            ECRUtil.authenticate(this.$router, '/home');
        }
    }
</script>

<style scoped lang="scss">
    @import '~scss_vars';

    .ecrm-mode-content {
        margin-bottom: 70px;
    }
</style>