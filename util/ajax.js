// import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import Qs from 'qs'
import {
	getForeverToken
} from '@/common/login.js'
import base_url from './baseUrl.js'
import content from '../main.js'
const instance = axios.create({
	baseURL: base_url,
	timeout: 15000
})
//真机获取  
axios.defaults.adapter = function(config) {
	return new Promise((resolve, reject) => {
		var settle = require('axios/lib/core/settle');
		var buildURL = require('axios/lib/helpers/buildURL');
		uni.request({
			method: config.method.toUpperCase(),
			url: buildURL(config.baseURL + config.url, config.params, config.paramsSerializer),
			header: config.headers,
			data: config.data,
			dataType: config.dataType,
			responseType: config.responseType,
			sslVerify: config.sslVerify,
			complete: function complete(response) {
				response = {
					data: response.data,
					status: response.statusCode,
					errMsg: response.errMsg,
					header: response.header,
					config: config
				};
				settle(resolve, reject, response);
			}
		})
	})
}

/**
 * 请求拦截器
 */
instance.interceptors.request.use(
	config => {
		// #ifdef APP-PLUS
		config.headers['version'] = content.$version // 版本号
		// #endif
		
		const token = uni.getStorageSync('token')
		if (token) {
			if (!config.headers['X-Token']) {
				config.headers['X-Token'] = uni.getStorageSync('token')
			}
		}
		if (config.method === 'get') {
			/**
			 * @description 格式化对象参数
			 */
			config.params = Qs.stringify(config.params, {
				arrayFormat: 'indices',
				allowDots: true
			})
			config.params = Qs.parse(config.params)
		}
		return config
	},
	error => {
		return Promise.reject(error)
	}
)

/**
 * 响应拦截器
 */
instance.interceptors.response.use(
	response => {
		if (response.status === 200) {
			if (response.data.code === 0 || response.data.result) {
				return response.data
			} else {
				uni.showModal({
					title: '温馨提示',
					content: response.data.msg,
					showCancel: false
				})
			}
		}
	},
	async error => {
		if (error.response === undefined || error.response === 'undefined') {
			uni.hideLoading()
			uni.showToast({
				title: '请求超时',
				icon:'none'
			})
		}
		if (error.response.status === 401) { // 登录超时
			// debugger
			const soruce = uni.getStorageSync('soruce')
			/**
			 * @description 获取新token
			 */
			const foreverToken = await getForeverToken(soruce)
			if (foreverToken.result) {
				uni.setStorageSync('token', foreverToken.info)
				error.response.config.headers['X-Token'] = foreverToken.info
				const da = await instance(error.response.config)
				return Promise.resolve(da)
			} else {
				uni.showModal({
					title: '温馨提示',
					content: '登录超时，请重新登录',
					showCancel: false,
					success: function(res) {
						if (res.confirm) {
							uni.redirectTo({
								url: '/pages/login/index'
							})
						}
					}
				})
				return Promise.reject(error)
			}

		}
		if (error.response.status === 424) {
			return error.response.data
		} else if (error.response.status === 500) {
			uni.showModal({
				title: '温馨提示',
				content: '服务器在开小差',
				showCancel: false
			})
		} else {
			uni.showModal({
				title: '温馨提示',
				content: '系统异常，尝试重新登录',
				showCancel: false,
				success: function(res) {
					if (res.confirm) {
						uni.redirectTo({
							url: '/pages/login/index'
						})
					}
				}
			})
		}
		return error
	}
)

export default instance
