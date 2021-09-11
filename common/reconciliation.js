import ajax from '@/util/ajax.js'

const URL = {
	//对账
	WAITVERIFY_LIST: 'ship/client/waitVerify', // 对账列表
	WAITVERIFY_SAVE: 'ship/verify', //确认对账
	/**
	 * @description 对账不一致，提出异议
	 */
	ERROTVERIFY_SAVE: 'ship/errorVerify',
	SHIP_DETAIL: 'ship/getShipDetail',
	SHIP_ARRIVED: 'ship/arrived'
}

/**
 * 获取对账列表
 * @param {Object} data
 */
export function getWaitVerifyList(data) {
	return ajax({
		url: URL.WAITVERIFY_LIST,
		params: data,
		method: 'GET'
	})
}

/**
 * 确认对账
 * @param {Object} data
 */
export function saveVerify(data) {
	return ajax({
		url: URL.WAITVERIFY_SAVE,
		params: data,
		method: 'GET'
	})
}

/**
 * @param {Object} data
 * @description 保存对账异常信息
 */
export function saveErrorVerify(data) {
	return ajax({
		url: URL.ERROTVERIFY_SAVE,
		params: data,
		method: 'GET'
	})
}

/**
 * @param {String} shipNo
 * @description 司机获取发货单详情
 */
export function getShipDetail(shipNo) {
	return ajax({
		url: URL.SHIP_DETAIL + '/' + shipNo,
		method: 'GET'
	})
}

/**
 * @param {Object} data
 * @description 司机确认收货
 */
export function saveShipArrive(data) {
	return ajax({
		url: URL.SHIP_ARRIVED,
		method: 'POST',
		data: data
	})
}
