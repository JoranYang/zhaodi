import ajax from '@/util/ajax.js'

const URL = {
	PROJECT_LIST: 'user/myProjectList', // 获取我的项目列表
	PROJECT_QUERY: 'client/getProjectDetails', //获取项目详请
	PROJECT_APPLY_SAVE:'commodity/shipments',//申请发货
	PROJECT_CANCEL_DELIVERY:'ship/cancelDelivery' ,//撤销发货
	PROJECT_SHIPAPP_PRODUCT:'shipmentOrder/returnShipAppProductList' ,// 退桩 详情型号
	PROJECT_SHIPAPP_SAVE:'shipmentOrder/returnShipApp' // 提交退桩信息
}


export function getProjectList(data) {
	return ajax({
		url: URL.PROJECT_LIST,
		params: data,
		method: 'GET'
	})
}

export function getProjectById(data) {
	return ajax({
		url: URL.PROJECT_QUERY + '/' + data.id,
		method: 'GET'
	})
}

export function saveProjectApply(data) {
	return ajax({
		url: URL.PROJECT_APPLY_SAVE,
		data: data,
		method: 'POST'
	})
}

//撤销发货申请
export function cancelProjectApply(data) {
	return ajax({
		url: URL.PROJECT_CANCEL_DELIVERY,
		data: data,
		method: 'POST'
	})
}

export function getProjectApplyDetail(data) {
	return ajax({
		url: URL.PROJECT_SHIPAPP_PRODUCT,
		data: data,
		method: 'POST'
	})
}


export function saveAppProjectApplyDetail(data) {
	return ajax({
		url: URL.PROJECT_SHIPAPP_SAVE,
		data: data,
		method: 'POST'
	})
}






