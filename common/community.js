import ajax from '@/util/ajax.js'
/**
 * 登录接口 和 基础公共接口
 */
const URL = {
	LABEL_LIST: 'myCommunity/TagPage', // 社区标签管理列表
	CONTENT_PAGE: 'communityContent/pageDetails', //分页查询
	CONTENT_DETAILS: 'communityContent/getById', //社区内容详情
	CONTENT_RESPONDLIST: 'communityContent/respondList', //内容对应评论
	COMMUNITY_COMMENT_LIKE: 'communityContent/like', // 点赞
	COMMUNITY_COMMENT_UNLIKE: 'communityContent/removeLike', //取消点赞
	COMMUNITY_COMMENT_COLLECT: 'communityContent/collec', // 收藏
	COMMUNITY_COMMENT_UNCOLLECT: 'communityContent/removeCollec', //取消收藏
	LABEL_CONTENT_SAVE: 'communityContent/addCommunityContent', // 保存提问
	COMMUNITY_COMMENT_SAVE: 'communityContent/addContentRespond', //评论
	COMMUNITY_COMMENT_DEL: 'communityContent/removeMyCommunityContent', //删除我的回答
	COMMUNITY_COMMENT_DEL_RES: 'communityContent/removeMyContentRespond', //删除我的评论
}

export function page(data) {
	return ajax({
		url: URL.CONTENT_PAGE,
		method: 'POST',
		data: data
	})
}

// 保存提问
export function twSave(data) {
	return ajax({
		url: URL.LABEL_CONTENT_SAVE,
		method: 'POST',
		data: data
	})
}

export function pinLun(data) {
	return ajax({
		url: URL.COMMUNITY_COMMENT_SAVE,
		method: 'POST',
		data: data
	})
}
export function detail(data) {
	return ajax({
		url: URL.CONTENT_DETAILS,
		method: 'GET',
		params: data
	})
}
export function respondList(data) {
	return ajax({
		url: URL.CONTENT_RESPONDLIST,
		method: 'GET',
		params: data
	})
}

export function saveCommunityContentCollect(data) {
	return ajax({
		url: URL.COMMUNITY_COMMENT_COLLECT,
		method: 'GET',
		params: data
	})
}

export function saveCommunityContentLike(data) {
	return ajax({
		url: URL.COMMUNITY_COMMENT_LIKE,
		method: 'GET',
		params: data
	})
}

export function queryLabelList(data) {
	return ajax({
		url: URL.LABEL_LIST,
		method: 'GET',
		params: data
	})
}

// 取消点赞
export function unCommentLike(data) {
	return ajax({
		url: URL.COMMUNITY_COMMENT_UNLIKE,
		method: 'GET',
		params: data
	})
}

//取消收藏
export function unCommentCollect(data) {
	return ajax({
		url: URL.COMMUNITY_COMMENT_UNCOLLECT,
		method: 'GET',
		params: data
	})
}

// 删除回答
export function unCommentDel(data) {
	return ajax({
		url: URL.COMMUNITY_COMMENT_DEL,
		method: 'GET',
		params: data
	})
}

//删除评论
export function unCommentDelrRes(data) {
	return ajax({
		url: URL.COMMUNITY_COMMENT_DEL_RES,
		method: 'POST',
		data: data
	})
}
