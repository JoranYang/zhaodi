import store from '@/store'
/* 传入文件名称，获取文件下载地址
 * @param String fileName 文件名称
 * @return 下载地址
 */
function getDownloadUrl(fileName) {
	if (fileName) {
		const downloadapi = 'upload/pull' + '?fileName='
		return store.state.vuex_baseUrl + downloadapi + fileName
	}
}

function formateDate(datetime) {
	function addDateZero(num) {
		return (num < 10 ? "0" + num : num);
	}
	let d = new Date(datetime);
	let formatdatetime = d.getFullYear() + '-' + addDateZero(d.getMonth() + 1) + '-' + addDateZero(d.getDate()) + ' ' +
		addDateZero(d.getHours()) + ':' + addDateZero(d.getMinutes()) + ':' + addDateZero(d.getSeconds());
	return formatdatetime;
}

export default {
	getDownloadUrl,
	formateDate
}
