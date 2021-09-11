import Vue from 'vue'
import App from './App'
import common from './util/common.js'
import moment from 'moment'
import base_url from './util/baseUrl.js'
import filters from '@/filter/index.js'


Vue.config.productionTip = false 



moment.locale('zh-cn') // 设置语言 或 moment.lang('zh-cn');
Vue.prototype.$moment = moment // 赋值使用

Vue.prototype.$common = common // 赋值使用

Vue.prototype.$baseUrl = base_url

App.mpType = 'app'

import store from '@/store'
// 引入uView提供的对vuex的简写法文件
let vuexStore = require('@/store/$u.mixin.js')
Vue.mixin(vuexStore)

Object.keys(filters).forEach(key => {
	Vue.filter(key, filters[key]) //插入过滤器名和对应方法
})

import uView from "uview-ui";
Vue.use(uView);

//#ifdef APP-PLUS
plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
	Vue.prototype.$version = widgetInfo.version
})
// #endif
const app = new Vue({
	store,
	...App
})

app.$mount()
export default app