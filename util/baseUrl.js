let base_url = ""

if(process.env.NODE_ENV === 'development'){
    // 开发环境
	 base_url = 'https://zhaodigroup.cn/admin/api/'
    // base_url = 'http://zhaodigroup.cn:13310/admin/api/'
	//base_url = 'http://192.168.0.101:8023/admin/api/'
}else{
    // 生产环境
    base_url = 'https://zhaodigroup.cn/admin/api/'
	// base_url = 'http://zhaodigroup.cn:13310/admin/api/'
	// base_url = 'http://192.168.0.101:8023/admin/api/'
}

export default base_url