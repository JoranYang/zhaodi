<!-- 启动页 -->
<template>

</template>
<script>
	export default {
		data() {
			return {
			}
		},
		/**
		 * @description 判断用户是否登录过
		 * 若用户登录过  则跳转指定页面 并关闭启动页
		 * 若用户未登录 则跳转登录页面 并关闭启动页
		 */
		onShow() {
			// #ifdef APP-PLUS 
			const url = uni.getStorageSync('url')
			const refs = uni.getStorageSync('soruce')
			if (refs && url) {
				uni.switchTab({
					url: url,
					success: function(e) {
						setTimeout(() => {

							plus.navigator.closeSplashscreen()

						}, 2000)
					}
				})
			} else {
				uni.switchTab({
					url: '../index/index',
					success: function(e) {
						setTimeout(() => {
							plus.navigator.closeSplashscreen()
						}, 2000)
					}
				})
			}
			// #endif
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
