<script>
	export default {
		onLaunch: function() {
			// #ifdef APP-PLUS  
			// 监听APP推送消息
			plus.push.addEventListener('click', function(message) {});
			plus.push.addEventListener('receive', function(message) {
				const payload = JSON.parse(message.payload)
				console.log('payload:', payload)
				const type = payload.type
				switch (type) {
					case 1:
						uni.navigateTo({
							url: '/pages/px/community/detail?id=' + payload.id
						})
						break
					case 3:
						uni.navigateTo({
							url: '/pages/kh/goods/info?id=' + payload.shipAppId + '&content=null'
						})
						break
					case 5:
						uni.navigateTo({
							url: '/pages/kh/goods/test?current=2'
						})
						break
				}
			})
			// #endif 
		}
	}
</script>

<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "uview-ui/index.scss";
	/*每个页面公共css */
	@import "./colorui/main.css";
	@import "./static/font/iconfont.css";

	@font-face {
		font-family: "siyuan";
		src: url("/static/font/siyuan.ttf")
	}

	.siyuan {
		font-family: 'siyuan' !important;
	}
</style>
