import ajax from '@/util/ajax.js'

const URL = {
	/**
	 * @description 换头像
	 */
	MY_AVATAR: 'myCommunity/changeImg', 
	/**
	 * @description 修改用户信息
	 */
	MY_INFOEDIT: 'user/editUser', 
	/**
	 * @description 我的货物列表
	 */
	MY_GOODS_SHIPLIST: 'ship/shipList', 
	/**
	 * @description 发货申请详请
	 */
	MY_GOODS_SHIPINFO: 'ship/getShipAppDetail', 
	/**
	 * @description 查看物流详请
	 */
	MY_GOODS_LOGISTIC: 'ship/getShippingDetails', 
	/**
	 * @description 确认收货
	 */
	MY_GOODS_LOGISTIC_SHIPSIGN: 'shipmentOrder/sign',
	/**
	 * @description 获取最新物流信息
	 */
	MY_INDEX_LOGISTIC_STATUS: 'ship/getCustomerShipmentOrder',
	/**
	 * @description 获取物流数量
	 */
	MY_SHIPCOUNT:'ship/shipCount',
	MY_RECEIPT_CONFIRM:'shipmentOrder/receiptConfirm' ,// 确认签收
	MY_SIGNCONFIRM:'ship/getSignConfirming',
	MY_AFTER_SALE_LIST:'shipmentOrder/getReturnShipAppList', //我的售后
	MY_SHIP_APP_CONFIRM:'shipmentOrder/returnShipAppConfirm', // 确认
	MY_UNDO_RETURN_SHOP:'shipmentOrder/undoReturnShipApp', // 撤销
	MY_TRAIN_SCORE:'trainUserCredit/getTrainUserCreditByUserId',
	// 根据用户ID查询学分
	TRAIN_USER_CREDIT_BY_USER_ID: 'trainUserCredit/getTrainUserCreditByUserId',
	ADMIN_GETKEY: 'hr/getKey', // 获取token
}

/**
 * 获取培训的积分
 * @param {Object} 
 */
export function getTrainScore() {
	return ajax({
		url: URL.MY_TRAIN_SCORE,
		method: 'GET'
	})
}



export function changeImg(data) {
	return ajax({
		url: URL.MY_AVATAR,
		method: 'GET',
		params: data
	})
}

export function editUser(data) {
	return ajax({
		url: URL.MY_INFOEDIT,
		method: 'POST',
		data: data
	})
}

/**
 * 获取我的货物列表
 * @param {Object} data
 */
export function getShipList(data) {
	return ajax({
		url: URL.MY_GOODS_SHIPLIST,
		method: 'GET',
		params: data
	})
}

/**
 * 获取我的货物详请
 * @param {Object} data
 */
export function getShipInfo(data) {
	return ajax({
		url: URL.MY_GOODS_SHIPINFO + '/' + data.id,
		method: 'GET'
	})
}

/**
 * 查看物流列表
 * @param {Object} data
 */
export function getShipLogisticsList(data) {
	return ajax({
		url: URL.MY_GOODS_LOGISTIC,
		method: 'GET',
		params: data
	})
}

/**
 * 物流确认收货
 * @param {Object} data
 */
export function getShipLogisticsSign(data) {
	return ajax({
		url: URL.MY_GOODS_LOGISTIC_SHIPSIGN,
		method: 'POST',
		data: data
	})
}


/**
 * 个人中心页面
 * 获取最新物流信息
 */
export function getShipLogisticsStatus() {
	return ajax({
		url: URL.MY_INDEX_LOGISTIC_STATUS,
		method: 'GET',
	})
}

/**
 * 个人中心页面
 * @description 获取运输中和待签收的数量
 */
export function getShipCount() {
	return ajax({
		url: URL.MY_SHIPCOUNT,
		method: 'GET',
	})
}
/**
 * @description 获取我的退货列表
 */
export function getSaleList(data) {
	return ajax({
		url: URL.MY_AFTER_SALE_LIST,
		method: 'GET',
		params: data
	})
}


/**
 * @description 确认签收
 * @param {Object} data id
 */
export function saveReceiptConfirm(data) {
	return ajax({
		url: URL.MY_RECEIPT_CONFIRM,
		method: 'POST',
		data: data
	})
}


export function getSignConfirm(data){
	return ajax({
		url: URL.MY_SIGNCONFIRM,
		method: 'POST',
		data: data
	})
}

export function saveShipAppConfirm(data){
	return ajax({
		url: URL.MY_SHIP_APP_CONFIRM,
		method: 'POST',
		data: data
	})
}

// 撤销退货
export function undoReturn(data){
	return ajax({
		url: URL.MY_UNDO_RETURN_SHOP,
		method: 'POST',
		data: data
	})
}

/**
 * @param {Object} data
 * @description: 根据用户ID查询学分
 */
export function queryUserCreditByUserId() {
  return ajax({
    url: URL.TRAIN_USER_CREDIT_BY_USER_ID,
    method: 'GET'
  })
}


/**
 * 获取token和公钥
 */
export function getKey() {
  return ajax({
    url: URL.ADMIN_GETKEY,
    method: 'POST'
  })
}

