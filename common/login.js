import ajax from '@/util/ajax.js'
/**
 * 登录接口 和 基础公共接口
 */
const URL = {
	/**
	 * @description 获取token
	 */
	LOGIN_KEY: 'hr/getKey',
	LOGIN_INFO: 'hr/post.do',
	LOGIN_KH_INFO: 'hr/client.do',
	/**
	 * @description 获取长期token
	 */
	LOGIN_TOKEN: 'hr/getUserInfo',
	/**
	 * @description 修改密码
	 */
	LOGIN_MOFITY: 'client/changePwd',
	CLIENT_KEY: 'client/getKey',
	USERLIST: 'user/getUserList',
	AGREEMENT_PRIVACY: 'agreement/privacy',
}

export function getKey() {
	return ajax({
		url: URL.LOGIN_KEY,
		method: 'POST'
	})
}

export function getUserInfo(data, token) {
	return ajax({
		url: URL.LOGIN_INFO,
		method: 'POST',
		data: data,
		headers: {
			'X-Token': token
		}
	})
}

export function getKhUserInfo(data, token) {
	return ajax({
		url: URL.LOGIN_KH_INFO,
		method: 'POST',
		data: data,
		headers: {
			'X-Token': token
		}
	})
}

/**
 * @description 免登录
 * @param {Object} token
 */
export function getForeverToken(source) {
	return ajax({
		url: URL.LOGIN_TOKEN,
		method: 'POST',
		data: {
			source
		}
	})
}

/**
 * @description 修改密码
 * @param {Object} 私钥
 */
export function motifyPass(data) {
	return ajax({
		url: URL.LOGIN_MOFITY,
		method: 'POST',
		data: data
	})
}

export function getClientKey() {
	return ajax({
		url: URL.CLIENT_KEY,
		method: 'GET'
	})
}

/**
 * @description 获取用户列表
 * @param {Object} data
 */
export function getUserListInfo(data) {
	return ajax({
		url: URL.USERLIST,
		method: 'GET',
		params: data
	});
}

export function getAgreement(data) {
	return ajax({
		url: URL.AGREEMENT_PRIVACY,
		method: 'GET',
		params: data
	});
}