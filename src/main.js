import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import './assets/theme/theme-ecr/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
import routes from './routes'
import Mock from './mock'
import ECRUtil from './common/js/util'
// import MyPagination from './components/mypagination'
Mock.bootstrap();

/**** CSS Import ****/

import './assets/theme/theme-ecr/table.css'
import './assets/theme/theme-ecr/table-column.css'
import './assets/theme/theme-ecr/button.css'
import './assets/theme/theme-ecr/date-picker.css'
import './assets/theme/theme-ecr/time-picker.css'
import './assets/theme/theme-ecr/icon.css'
import './assets/theme/theme-ecr/tree.css'
import './assets/theme/theme-ecr/dialog.css'
import './assets/theme/theme-ecr/progress.css'
import './assets/theme/theme-ecr/form.css'
import './assets/theme/theme-ecr/form-item.css'
import './assets/theme/theme-ecr/select.css'
import './assets/theme/theme-ecr/option.css'
import './assets/theme/theme-ecr/radio.css'
import './assets/theme/theme-ecr/radio-group.css'
import 'font-awesome/css/font-awesome.min.css'

/**** CSS Import End ****/

/**** Component Import ****/

import './components/mypagination/index.js'
import './components/mytree/index.js'
import './components/mycoursetree/index.js'
import './components/mycoursespecial/index.js'
import './components/myrate/index.js'
import './components/mymodal/index.js'
import './components/mymessage/index.js'
import './components/ecr-breadcrumb/index.js'
import './components/ecr-grade/index.js'
import './components/ecr-course/index.js'
import './components/ecr-course-tree/index.js'
import './components/ecr-course-special/index.js'
import './components/ecr-resource/index.js'
import './components/ecr-resource-special/index.js'
import './components/ecr-compare-resource/index.js'
import './components/ecr-basket-resource/index.js'
import './components/ecr-brief/index.js'
import './components/ecr-special-brief/index.js'
import './components/ecr-button-group/index.js'
import './components/ecr-my-button-group/index.js'
import './components/ecr-thumb/index.js'
import './components/ecr-dropdown/index.js'
import './components/ecr-shortcut-panel/index.js'
import './components/ecr-shortcut-panel2/index.js'
import './components/ecr-shortcut-panel3/index.js'
import './components/ecr-subject-navpanel/index.js'
import './components/ecr-content-subtitle/index.js'
import './components/ecr-school-subtitle/index.js'
import './components/ecr-newest-panel/index.js'
import './components/ecr-hot-panel/index.js'
import './components/ecr-resource-viewer/index.js'
import './components/ecr-myupload-resource/index.js'
import './components/ecr-high-resource/index.js'
import './components/ecr-study-schedule/index.js'
import './components/ecr-test-answer/index.js'
import './components/ecr-top-reward1/index.js'
import './components/ecr-top-reward2/index.js'
import './components/ecr-tree-input/index.js'
import './components/ecr-last-activity/index.js'
import './components/ecr-top-man/index.js'
import './components/ecr-top-rewarder/index.js'
import './components/ecr-my-activity/index.js'
import './components/ecr-activity-model/index.js'
import './components/ecr-last-compare/index.js'
import './components/ecr-last-reward/index.js'
import './components/ecr-top-compare/index.js'
import './components/ecr-statistics-goods/index.js'
import './components/ecr-panel-item/index.js'
import './components/ecr-twolabels/index.js'

/**** Component Import End ****/

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

import VTooltip from 'v-tooltip'
Vue.use(VTooltip)

const router = new VueRouter({
  routes:routes,
  mode:'history'
})

router.beforeEach((to, from, next) => {
    if (to.path == '/') {
        next({ path: '/home' })
    } else {
        next()
    }
    // if (ECRUtil.isLoggedIn()) ECRUtil.autoLogin();
})

window.EventHub = new Vue()

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
