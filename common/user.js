import ajax from '@/util/ajax.js'

const URL = {
	CONTENT_PAGE: 'communityContent/pageDetails', //分页查询
	CONTENT_DETAILS: 'communityContent/getById', //社区内容详情
	MY_COLLEC: 'myCommunity/myCollec', //我的收藏
	MY_RESPOND: 'communityContent/myRespondList' //我的回答
}

/**
 * @alias 监听收藏列表
 * @param {Object} data
 * @description 获取收藏列表
 */
export function getList(data) {
	return ajax({
		url: URL.CONTENT_PAGE,
		data: data,
		method: 'POST'
	})
}

export function getById(data) {
	return ajax({
		url: URL.CONTENT_DETAILS,
		data: data,
		params: 'GET'
	})
}

export function myCollect(data) {
	return ajax({
		url: URL.MY_COLLEC,
		method: 'GET',
		params: data
	});
}

export function myRespond(data) {
	return ajax({
		url: URL.MY_RESPOND,
		method: 'GET',
		params: data
	});
}
