<template>
    <div class="ecrw-zhanbo-wrap">
        <div class="ecrw-zhanbo-left">
            <a href="javascript:;" style="width:100%;height:100%;display:inline-block;" @click="goPage('/highnaviresourcedetail/' + path + '/' + goods.labelid)">
                <img :src="ECO_MEDIA_PATH + goods.localpath"/>
            </a>
        </div>
        <div class="ecrw-zhanbo-right">

            <div class="ecrw-zhanbo-title clearfix">
                <div class="ecrw-zhanbo-left-name">{{ goods.labelname }}</div>
            </div>          

            <div class="ecrw-zhanbo-text">
                地区 :<span v-if="schoolInfo != null"> {{ schoolInfo.areaname }}</span>
                <span v-if="schoolInfo == null"></span>
            </div>

            <div class="ecrw-zhanbo-text">
                学校：{{ schoolInfo.schoolname }}
            </div>

            <div class="ecrw-zhanbo-text">
                发布时间：{{ goods.createtime }}
            </div>
        </div>
    </div>
</template>

<script>
    import { getSchoolList, getOrgInformation } from '../../../api/api';
    import ECRUtil from '../../../common/js/util.js'
import { getParentAreaId } from '../../../../../backend/src/api/api';

    export default {
        props: {
            goods: Object,
            path: String
        },
        data: function () {
            return {
                ECRUtil:ECRUtil,
                ECO_MEDIA_PATH: ECO_MEDIA_PATH,
                schoolInfo:{
                    'schoolname': '',
                    'areaname': '',
                },
                areaid:'',                
            }
        },
        methods: {
            load(schoolid) {
                if(schoolid == null || schoolid == ""){
                    return;
                }                
                let param ={
                    id:schoolid,
                };
                getOrgInformation(param).then((res) =>{
                    if(res.data.serverResult.resultCode == "200") {                        
                        this.schoolInfo.schoolname = res.data.responseEntity.orgName;
                        this.schoolInfo.areaname = '';
                        this.areaid = res.data.responseEntity.areaId;                        
                        getParentAreaId(this.areaid).then((res)=>{
                            if(res.data.serverResult.resultCode == 200){
                                for(var i = 0;i < res.data.pageInfo.list.length;i++){
                                    this.schoolInfo.areaname = res.data.pageInfo.list[i].areaname + ' ' + this.schoolInfo.areaname;
                                }
                            }
                        });               
                    } else {
                        this.schoolInfo.areaname = '';
                        this.schoolInfo.schoolname = '';
                    }                    
                }).catch(()=> {
                    this.schoolInfo.areaname = '';
                    this.schoolInfo.schoolname = '';
                });

            },
            goPage(url) {
                this.$router.push(url);
            }
        },
        created() {
            // console.log(this.goods);
            this.load(this.goods.schoolid);
        },
        watch: {
            'goods': function(val){
                this.load(val.schoolid);
            }
        }
    }
</script>