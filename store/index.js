import Vue from 'vue'
import Vuex from 'vuex'
import JSEncrypt from 'jsencrypt'
import common from '../util/common.js'
import {
	getKey,
	getUserInfo,
	getKhUserInfo,
	getForeverToken
} from '@/common/login.js'
Vue.use(Vuex)

let lifeData = {};

try {
	// 尝试获取本地是否存在lifeData变量，第一次启动APP时是不存在的
	lifeData = uni.getStorageSync('lifeData');
} catch (e) {

}

// 需要永久存储，且下次APP启动需要取出的，在state中的变量名
let saveStateKeys = ['lastName', 'token', 'avatar', 'menu'];

// 保存变量到本地存储中
const saveLifeData = function(key, value) {
	// 判断变量名是否在需要存储的数组中
	if (saveStateKeys.indexOf(key) != -1) {
		// 获取本地存储的lifeData对象，将变量添加到对象中
		let tmp = uni.getStorageSync('lifeData');
		// 第一次打开APP，不存在lifeData变量，故放一个{}空对象
		tmp = tmp ? tmp : {};
		tmp[key] = value;
		// 执行这一步后，所有需要存储的变量，都挂载在本地的lifeData对象中
		uni.setStorageSync('lifeData', tmp);
	}
}

const saveUserInfo = function(commit, userInfo) {
	commit('SET_NAME', userInfo.lastName)
	uni.setStorageSync('lastName', userInfo.lastName)
	if (userInfo.avatar) {
		commit('SET_AVATAR', common.getDownloadUrl(userInfo.avatar))
		uni.setStorageSync('avatar', common.getDownloadUrl(userInfo.avatar))
	}
	commit('SET_SEX', userInfo.sex)
	commit('SET_DEPARTMENTID', userInfo.departmentId)
	commit('SET_DEPARTMENTNAME', userInfo.departmentName)
	commit('SET_MENU', userInfo.menu)
	commit('SET_PHONE', userInfo.phone)
	commit('SET_ID', userInfo.id)
	uni.setStorageSync('soruce', userInfo.soruce)
	uni.setStorageSync('phone', userInfo.phone)
	uni.setStorageSync('departmentName', userInfo.departmentName)
	uni.setStorageSync('menu', userInfo.menu)
	uni.setStorageSync('departmentId', userInfo.departmentId)
	uni.setStorageSync('introduction', userInfo.introduction)
	uni.setStorageSync('sex', userInfo.sex)
	uni.setStorageSync('id', userInfo.id)
	uni.setStorageSync('chengePassword', userInfo.chengePassword)
}

const store = new Vuex.Store({
	state: {
		// 如果上面从本地获取的lifeData对象下有对应的属性，就赋值给state中对应的变量
		// 加上vuex_前缀，是防止变量名冲突，也让人一目了然
		vuex_name: '用户',
		vuex_avatar: '',
		vuex_sex: '男',
		// 如果vuex_version无需保存到本地永久存储，无需lifeData.vuex_version方式
		vuex_version: '1.1',
		// 自定义tabbar数据
		vuex_tabbar: [],
		vuex_phone: '',
		vuex_baseUrl: 'https://zhaodigroup.cn/admin/api/',
		vuex_id: ''
	},
	mutations: {
		SET_MENU: (state, menu) => {
			state.vuex_tabbar = menu
		},
		SET_NAME: (state, name) => {
			state.vuex_name = name
		},
		SET_AVATAR: (state, avatar) => {
			state.vuex_avatar = avatar
		},
		SET_DEPARTMENTID: (state, departmentId) => {
			state.vuex_departmentId = departmentId
		},
		SET_DEPARTMENTNAME: (state, departmentName) => {
			state.vuex_departmentName = departmentName
		},
		SET_SEX: (state, sex) => {
			state.vuex_sex = sex
		},
		SET_PHONE: (state, phone) => {
			state.vuex_phone = phone
		},
		SET_ID: (state, id) => {
			state.vuex_id = id
		},
		$uStore(state, payload) {
			// 判断是否多层级调用，state中为对象存在的情况，诸如user.info.score = 1
			let nameArr = payload.name.split('.');
			let saveKey = '';
			let len = nameArr.length;
			if (len >= 2) {
				let obj = state[nameArr[0]];
				for (let i = 1; i < len - 1; i++) {
					obj = obj[nameArr[i]];
				}
				obj[nameArr[len - 1]] = payload.value;
				saveKey = nameArr[0];
			} else {
				// 单层级变量，在state就是一个普通变量的情况
				state[payload.name] = payload.value;
				saveKey = payload.name;
			}
			// 保存变量到本地，见顶部函数定义
			saveLifeData(saveKey, state[saveKey])
		}
	},
	actions: {
		async loginByUsername({
			commit
		}, userInfo) {
			let data = await getKey()
			var encrypt = new JSEncrypt()
			encrypt.setPublicKey(data.info.publicKey)
			const d = encrypt.encrypt(JSON.stringify(userInfo))
			const token = data.info['X-Token']
			uni.setStorageSync('token', token)
			let user = await getUserInfo({
				k: d
			}, token)
			if (user.result) {
				saveUserInfo(commit, user.info)
				uni.setStorageSync('url', '/pages/px/news/index')
			} else {
				let userKh = await getKhUserInfo({
					k: d
				}, token)
				if (userKh.result) {
					saveUserInfo(commit, userKh.info)
					uni.setStorageSync('url', '/pages/kh/product/index')
					const acount = uni.getStorageSync('acount')
					if (acount) {
						let acountRepeat = false
						acount.map(item => {
							if (item.username === userInfo.username) {
								acountRepeat = true
							}
						})
						if(!acountRepeat){
							acount.push(userInfo)
							uni.setStorageSync('acount', acount)
						}
					} else {
						const acountList = []
						acountList.push(userInfo)
						uni.setStorageSync('acount', acountList)
					}
				} else {
					uni.hideLoading()
					uni.showModal({
						title: '提示',
						content: '账号或密码错误',
						showCancel: false
					})
					uni.clearStorage()
				}
			}
		}
	}
})

export default store
