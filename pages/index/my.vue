<template>
	<view>
		<u-tabbar :list="LoginBeforeMenu" :mid-button="false"></u-tabbar>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				LoginBeforeMenu: [{
						iconPath: "home",
						selectedIconPath: "home-fill",
						text: '首页',
						count: 2,
						isDot: true,
						customIcon: false,
						pagePath: '/pages/index/index',
					},
					{
						iconPath: "photo",
						selectedIconPath: "photo-fill",
						text: '我的',
						customIcon: false,
						pagePath: '/pages/index/my',
					}
				]
			};
		}
	}
</script>

<style lang="scss">
	page{
		background-color: white;
	}
</style>
