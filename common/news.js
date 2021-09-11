import ajax from '@/util/ajax.js'

const URL = {
	NEWS_USER_LIST: 'news/getUserNews',
	NEWS_QUERY: 'news/getNewsById', // 新闻详请
	NEWS_BANNER: 'news/getBanners', //轮播图
	NEWS_NOTICE: 'news/notice'
}

export function fetchNewsList(data) {
	return ajax({
		url: URL.NEWS_USER_LIST,
		method: 'GET',
		params: data
	});
}
export function fetchNewsBannerList(data) {
	return ajax({
		url: URL.NEWS_BANNER,
		method: 'GET',
		params: data
	});
}
export function queryNewsInfo(data) {
	return ajax({
		url: URL.NEWS_QUERY + '/' + data,
		method: 'GET',
		params: data
	});
}


export function queryNewsNotice() {
	return ajax({
		url: URL.NEWS_NOTICE,
		method: 'GET'
	});
}
