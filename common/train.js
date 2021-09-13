import ajax from '@/util/ajax.js'

const URL = {
	
	/**
	 * @description 学习专区--》学习列表【所有课程】
	 */
	LEARN_LIST: 'trainCourse/getAllTrainCoursePicList',
	/**
	 * @description 培训列表--》所有课程
	 */
	TRAIN_LIST: 'trainCourse/getUserTrainCoursePicList',
	
	/**
	 * @description 培训列表--》单个课程的所有章节
	 */
	TRAIN_INFO: 'train/pageViewTrainUser',
	
	/**
	 * @description 培训详情
	 */
	TRAIN_QUERY: 'train/getById',

	/**
	 * @description 观看视频标记
	 */
	TRAIN_LEARN: 'train/addTrainUserStudy',

	/**
	 * @description 用户学习日志
	 */
	TRAIN_USER_STUDY_LOG: 'train/accumulation',
	/**
	 * @description 试卷详情
	 */
	PAPER_QUERY: 'paper/userGetTrainPaperById',
	/**
	 * @description 用户提交试卷
	 */
	PAPER_USER_ANSWER: 'paper/answer',
}

/**
 * 获取学习专区列表
 * @param {Object} data
 */
export function getLearnList(pageInfo,category) {
	return ajax({
		url: URL.LEARN_LIST+`?pageSize=${pageInfo.pageSize}&pageNum=${pageInfo.pageNum}&category=${category}`,
		method: 'GET'
	})
}


/**
 * 获取培训列表详请
 * @param {Object} data
 */
export function getTrainList(pageInfo,type) {
	return ajax({
		url: URL.TRAIN_LIST+`?pageSize=${pageInfo.pageSize}&pageNum=${pageInfo.pageNum}&type=${type}`,
		method: 'GET'
	})
}

/**
 * 获取培训列表详请  -> 单个课程的所有章节
 * @param {Object} data
 */
export function getTrainInfo(data){
	return ajax({
		url: URL.TRAIN_INFO,
		data: data,
		method: 'POST'
	})
}



/**
 * 获取详情
 * @param {Object} data
 */
export function getTrainDetail(data) {
	return ajax({
		url: URL.TRAIN_QUERY,
		params: data,
		method: 'GET'
	})
}

/**
 * 标记视频已观看
 * @param {Object} data
 * train_id
 */
export function setVideoData(data) {
	return ajax({
		url: URL.TRAIN_LEARN,
		params: data,
		method: 'GET'
	})
}


/**
 * @alias 请求试卷详情接口
 * @param {Object} data
 * @description 监听获取试卷详情信息
 */
export function queryPaperInfo(data) {
	return ajax({
		url: URL.PAPER_QUERY,
		method: 'GET',
		params: data
	})
}

/**
 * @alias 请求提交试卷接口
 * @param {Object} data
 * @description 监听提交试卷信息
 */
export function saveUserPaper(data) {
	return ajax({
		url: URL.PAPER_USER_ANSWER,
		method: 'POST',
		data: data
	})
}

/**
 * @description 监听记录用户日志信息
 * @param {Object} data
 */
export function userTrainLog(data) {
	return ajax({
		url: URL.TRAIN_USER_STUDY_LOG,
		method: 'GET',
		params: data
	})
}
