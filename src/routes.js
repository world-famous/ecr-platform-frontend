import NotFound from './views/404.vue'
import template from './views/template.vue'
import main from './views/main.vue'
import signup from './views/signup.vue'
import search from './views/search.vue'
import home from './views/home/index.vue'
import famous from './views/famous/index.vue'
import famousWhole from './views/famous/whole.vue'
import teacherWhole from './views/famous/teacher.vue'
import teaching from './views/teaching/index.vue'
import answer from './views/answer/index.vue'
import special from './views/special/index.vue'
import special_more from './views/special/more.vue'
import course from './views/course/index.vue'
import video from './views/course/video.vue'
import eng from './views/course/eng.vue'
import stem from './views/course/stem.vue'
import moral from './views/course/moral.vue'
import brand from './views/brand/index.vue'
import resource from './views/resource/index.vue'
import highnaviresourcedetail from './views/highnaviresourcedetail/index.vue'
import packages from './views/package/index.vue'
import package_more from './views/package/more.vue'
import resourceraise from './views/resourceraise/index.vue'
import raisedetail from './views/resourceraise/detail.vue'
import raisetype from './views/resourceraise/type.vue'
import uploadraise from './views/resourceraise/upload.vue'
import raise_activity from './views/resourceraise/raise.vue'
import compareappr_index from './views/compareappr/index.vue'
import compareappr_detail from './views/compareappr/detail.vue'
import compareappr_upload from './views/compareappr/upload.vue'
import compareappr_teacherinfo from './views/compareappr/teacher.vue'
import compareappr_activity from './views/compareappr/compare.vue'
import compareappr_public from './views/compareappr/public.vue'
import reward from './views/reward/propose.vue'
import reward_index from './views/reward/index.vue'
import reward_upload from './views/reward/upload.vue'
import reward_create from './views/reward/create.vue'
import reward_join from './views/reward/join.vue'
import reward_resource from './views/reward/resource.vue'
import reward_model from './views/reward/model.vue'
import reward_join_resource from './views/reward/join_resource.vue'
import reward_activity_resource from './views/reward/activity_resuorce.vue'
import mycenter from './views/mycenter.vue'
import info from './views/mycenter/info/index.vue'
import updateinfo from './views/mycenter/info/update.vue'
import changepwd from './views/mycenter/info/changepwd.vue'
import avatar from './views/mycenter/info/avatar.vue'
import myorder from './views/mycenter/order/myorder.vue'
import basket from './views/mycenter/order/basket.vue'
import ordergoods from './views/mycenter/order/detail.vue'
import charge from './views/mycenter/charge/index.vue'
import chargelog from './views/mycenter/charge/log.vue'
import score from './views/mycenter/score/index.vue'
import scorelog from './views/mycenter/score/log.vue'
import scoreconversion from './views/mycenter/score/conversion.vue'
import scorerule from './views/mycenter/score/rule.vue'
import mydownload from './views/mycenter/goods/download.vue'
import myupload from './views/mycenter/goods/upload.vue'
import myfavorite from './views/mycenter/goods/favorite.vue'
import message from './views/mycenter/message/index.vue'
import notice from './views/mycenter/notice/index.vue'
import resourceupload from './views/resourceupload/upload.vue'
import uploadstep1 from './views/resourceupload/step1.vue'
import uploadstep2 from './views/resourceupload/step2.vue'
import navipackages from './views/highnaviresource/index.vue'
import resourcemodify from './views/resourcemodify/index.vue'
import weixinLogin from './views/weixinLogin.vue';

let routes = [
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    },
    {
        path: '/',
        component: template,
        name: '',
        leaf: true,
        hidden: true,
        children: [
            { path: '/signup', component: signup }
        ]
    },
    {
        path: '/',
        component: template,
        name: '',
        leaf: true,
        hidden: true,
        children: [
            { path: '/ssoLogin', component: weixinLogin }
        ]
    },
    {
        path: '/',
        component: template,
        name: '',
        leaf: true,
        hidden: true,
        children: [
            { path: '/search/:key', component: search }
        ]
    },
    {
        path: '/',
        component: template,
        name: '',
        leaf: true,
        hidden: true,
        children: [
            { path: '/search', component: search }
        ]
    },
    {
        path: '/',
        component: template,
        name: '',
        leaf: true,
        hidden: true,
        children: [
            { path: '/resource/:id', component: resource, name: '资源详情' }
        ]
    },
    {
        path: '/',
        component: template,
        name: '',
        leaf: true,
        hidden: true,
        children: [
            { path: '/highnaviresourcedetail/:onelabelid/:twolabelid', component: highnaviresourcedetail, name: '优秀课例包-资源详情' }
        ]
    },
    {
        path: '/',
        component: template,
        name: '',
        leaf: true,
        children: [
            { path: '/home', component: home, name: '首页' },
            { path: '/ecrw-header', component: home, name: '首页-回顶端' },
            { path: '/ecrw-famous', component: home, name: '首页-名师名校' },
            { path: '/ecrw-anays', component: home, name: '首页-同步资源' },
            { path: '/ecrw-shijuan', component: home, name: '首页-试卷' },
            { path: '/ecrw-class', component: home, name: '首页-课程' },
            { path: '/ecrw-tegong', component: home, name: '首页-特供专题' },
            { path: '/ecrw-hot', component: home, name: '首页-最新最热' }
        ]
    },
    {
        path: '/',
        component: template,
        name: '',
        leaf: false,
        hidden: true,
        children: [
            { path: '/collection', component: resourceraise, name: '征集-Raise'}
        ]
    },
    {
        path: '/',
        component: template,
        name: '',
        leaf: true,
        hidden: true,
        children: [
            { path: '/collection/detail/:id', component: raisedetail, name: '征集详情' }
        ]
    },
    {
        path: '/',
        component: template,
        name: '',
        leaf: false,
        hidden: true,
        children: [
            { path: '/collection/upload/:id', component: uploadraise, name: '上传征集资源'}
        ]
    },
    {
        path: '/',
        component: template,
        name: '',
        leaf: false,
        hidden: true,
        children: [
            { path: '/collection/goods/:id', component: raise_activity, name: '征集展示'}
        ]
    },
    {
        path: '/',
        component: template,
        name: '',
        leaf: true,
        hidden: true,
        children: [
            { path: '/collection/:type', component: raisetype, name: '征集-Index', hidden:true }
        ]
    },
    {
        path: '/',
        component: template,
        name: '',
        leaf: true,
        hidden: true,
        children: [
            { path: '/compareappr/type/:type', component: compareappr_index, name: '评比活动', hidden:true }
        ]
    },
    {
        path: '/',
        component: template,
        name: '',
        leaf: true,
        hidden: true,
        children: [
            { path: '/compareappr/:id', component: compareappr_detail, name: '模板', hidden:true }
        ]
    },
    {
        path: '/',
        component: template,
        name: '',
        leaf: true,
        hidden: true,
        children: [
            { path: '/compareappr/upload/:id', component: compareappr_upload, name: '上传评比资源', hidden:true }
        ]
    },
    {
        path: '/',
        component: template,
        name: '',
        leaf: true,
        hidden: true,
        children: [
            { path: '/compareappr/teacher/:userid/:id', component: compareappr_teacherinfo, name: '评比老师详情', hidden:true }
        ]
    }, 
    {
        path: '/',
        component: template,
        name: '',
        leaf: true,
        hidden: true,
        children: [
            { path: '/compareappr/activity/:id', component: compareappr_activity, name: '活动评比', hidden:true }
        ]
    },
    {
        path: '/',
        component: template,
        name: '',
        leaf: true,
        hidden: true,
        children: [
            { path: '/compareappr/public/:id', component: compareappr_public, name: '结果公示', hidden:true }
        ]
    },
    {
        path: '/',
        component: template,
        name: '',
        leaf: true,
        hidden: true,
        children: [
            { path: '/reward/propose', component: reward, name: '资源悬赏-Propose', hidden:true }
        ]
    },
    {
        path: '/',
        component: template,
        name: '',
        leaf: true,
        hidden: true,
        children: [
            { path: '/reward/create', component: reward_create, name: '资源悬赏-Created', hidden:true }
        ]
    },
    {
        path: '/',
        component: template,
        name: '',
        leaf: true,
        hidden: true,
        children: [
            { path: '/reward/join', component: reward_join, name: '资源悬赏-Joined', hidden:true }
        ]
    },
    {
        path: '/',
        component: template,
        name: '',
        leaf: true,
        hidden: true,
        children: [
            { path: '/reward/resource', component: reward_resource, name: '资源悬赏-资源', hidden:true }
        ]
    },
    {
        path: '/',
        component: template,
        name: '',
        leaf: true,
        hidden: true,
        children: [
            { path: '/reward/model/:id', component: reward_model, name: '资源悬赏-Model', hidden:true }
        ]
    },
    {
        path: '/',
        component: template,
        name: '',
        leaf: true,
        hidden: true,
        children: [
            { path: '/reward/join/:id', component: reward_join_resource, name: '资源悬赏-Model', hidden:true }
        ]
    },
    {
        path: '/',
        component: template,
        name: '',
        leaf: true,
        hidden: true,
        children: [
            { path: '/reward/reward_resource/:id', component: reward_activity_resource, name: '资源悬赏-Model', hidden:true }
        ]
    },
    {
        path: '/',
        component: template,
        name: '',
        leaf: true,
        hidden: true,
        children: [
            { path: '/reward', component: reward_index, name: '资源悬赏-Index', hidden:true }
        ]
    },
    {
        path: '/',
        component: template,
        name: '',
        leaf: true,
        hidden: true,
        children: [
            { path: '/reward/upload/:id', component: reward_upload, name: '参与资源悬赏', hidden:true }
        ]
    },
    {
        path: '/',
        component: template,
        name: '',
        leaf: true,
        children: [
            { path: '/famous', component: famous, name: '名师名校' }
        ]
    },
    {
        path: '/',
        component: template,
        name: '',
        leaf: true,
        hidden: true,
        children: [
            { path: '/famous/:id', component: famousWhole, name: '全部名校资源' }
        ]
    },
    {
        path: '/',
        component: template,
        name: '',
        leaf: true,
        hidden: true,
        children: [
            { path: '/famous/teacher/:id', component: teacherWhole, name: '全部名师资源' }
        ]
    },
    {
        path: '/',
        component: template,
        name: '',
        leaf: true,
        children: [
            { path: '/teaching', component: teaching, name: '同步资源' },
            { path: '/teaching/:twolabel', component: teaching, name: '同步资源-Twolabel' },
        ]
    },
    {
        path: '/',
        component: template,
        name: '',
        leaf: true,
        children: [
            { path: '/answer', component: answer, name: '试卷' },
            { path: '/answer/:twolabel', component: answer, name: '试卷Detail' },
        ]
    },
    {
        path: '/',
        component: template,
        name: '',
        leaf: true,
        children: [
            { path: '/special', component: special, name: '特供专题' }
        ]
    },
    {
        path: '/',
        component: template,
        name: '',
        leaf: true,
        hidden: true,
        children: [
            { path: '/special/:twolabel', component: special_more, name: '' }
        ]
    },
    {
        path: '/',
        component: template,
        name: '',
        leaf: true,
        hidden: true,
        children: [
            { path: '/course', component: course, name: '课程' }
        ]
    },
    {
        path: '/',
        component: template,
        name: '',
        leaf: true,
        children: [
            { path: '/course/video', component: video, name: '微视频课程' }
        ]
    },
    {
        path: '/',
        component: template,
        name: '',
        leaf: true,
        children: [
            { path: '/course/eng', component: eng, name: '培生英语课程' }
        ]
    },
    {
        path: '/',
        component: template,
        name: '',
        leaf: true,
        children: [
            { path: '/course/stem', component: stem, name: 'STEM课程' }
        ]
    },
    {
        path: '/',
        component: template,
        name: '',
        leaf: true,
        children: [
            { path: '/course/moral', component: moral, name: '美育课程' }
        ]
    },
    {
        path: '/',
        component: template,
        name: '',
        leaf: true,
        children: [
            { path: '/brand', component: brand, name: '品牌专区' }
        ]
    },
    {
        path: '/',
        component: template,
        name: '',
        leaf: true,
        hidden: true,
        children: [
            { path: '/package/:onelabel', component: packages, name: '' }
        ]
    },
    {
        path: '/',
        component: template,
        name: '',
        leaf: true,
        hidden: true,
        children: [
            { path: '/package/:onelabel/:twolabel', component: package_more, name: '' }
        ]
    },
    {
        path: '/',
        component: template,
        name: '',
        leaf: true,
        hidden: true,
        children: [
            { path: '/mycenter', component: mycenter, name: '' }
        ]
    },
    {
        path: '/',
        component: template,
        name: '',
        leaf: true,
        hidden: true,
        children: [
            { 
                path: '/mycenter',
                component: mycenter,
                name: '',
                children: [
                    { path: '/mycenter/info', component: info, name: ''},
                    { path: '/mycenter/info/update', component: updateinfo, name: ''},
                    { path: '/mycenter/info/changepwd', component: changepwd, name: ''},
                    { path: '/mycenter/info/avatar', component: avatar, name: ''},
                    { path: '/mycenter/order/mine', component: myorder, name: ''},
                    { path: '/mycenter/basket', component: basket, name: ''},
                    { path: '/mycenter/ordergoods/:orderid', component: ordergoods, name: '', hidden: true},
                    { path: '/mycenter/charge', component: charge, name: ''},
                    { path: '/mycenter/charge/log', component: chargelog, name: ''},
                    { path: '/mycenter/score', component: score, name: ''},
                    { path: '/mycenter/score/log', component: scorelog, name: ''},
                    { path: '/mycenter/score/conversion', component: scoreconversion, name: ''},
                    { path: '/mycenter/score/rule', component: scorerule, name: ''},
                    { path: '/mycenter/goods/download', component: mydownload, name: ''},
                    { path: '/mycenter/goods/upload', component: myupload, name: ''},
                    { path: '/mycenter/goods/favorite', component: myfavorite, name: ''},
                    { path: '/mycenter/message', component: message, name: ''},
                    { path: '/mycenter/notice', component: notice, name: ''},
                ]
            }
        ]
    },
    
    {
        path: '/',
        component: template,
        name: '',
        hidden: true,
        children: [
            { 
                path: '/upload/step1', 
                component: resourceupload, 
                name: '',
                children: [
                    { path: '/upload/step1' , component: uploadstep1 , name: '1' }
                ] 
            },
            { 
                path: '/upload/step2',
                component: resourceupload,
                name: '',
                children: [
                    { path: '/upload/step2', component: uploadstep2, name: '2' }
                ]
            },
            { 
                path: '/upload/step3',
                component: resourceupload,
                name: '',
                children: [
                    { path: '/upload/step3', component: uploadstep2, name: '3' }
                ]
            }
        ]
    },
    
    {
        path: '/',
        component: template,
        name: '',
        leaf: true,
        hidden: true,
        children: [
            { path: '/navipackage/:oneLabel', component: navipackages, name: '' }
        ]
    },
    {
        path: '/',
        component: template,
        name: '',
        leaf: true,
        hidden: true,
        children: [
            { path: '/resourcemodify/:contentid', component: resourcemodify, name: '' }
        ]
    },

];

export default routes;