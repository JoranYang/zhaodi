import store from '@/store'
import ajax from '@/util/ajax.js'

const URL = {
	DATADICTION: 'autoapi/v1/getDataDictionaryList', //获取数据字典
	DATADICTIONARY: 'datadictionary/getDataDictList', // 获取版本信息的数据字典
}

/**
 * 获取文件下载地址
 * 传入文件名称，获取文件下载地址
 * @param String fileName 文件名称
 * @return 下载地址
 */
function getDownloadUrl(fileName) {
	if (fileName) {
		const downloadapi = 'upload/pull' + '?fileName='
		return store.state.vuex_baseUrl + downloadapi + fileName
	}
}

/**
 * 传入数据字典种类代码
 * @param String category 种类代码
 */
function getDataDictory(category) {
	return ajax({
		url: URL.DATADICTION,
		method: 'GET',
		params: {
			'category': category
		}
	})
}

function getVersionDictory(queryInfo){
	return ajax({
		url: URL.DATADICTIONARY,
		method: 'GET',
		params: {
			'queryInfo': queryInfo
		}
	})
}

export default {
	getDownloadUrl,
	getDataDictory,
	getVersionDictory
}
