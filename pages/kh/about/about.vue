<template>
	<view>
		<view class="title">
			<u-image width="120rpx" height="120rpx" :src="logoSrc"></u-image>
			<view class="title-name">兆弟APP</view>
			<view>Version 1.0.0</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				logoSrc: '/static/logo.jpg',
				version: ''
			};
		},
		onLoad() {
			
		},
		methods: {

		}
	}
</script>

<style lang="scss">
	.title {
		display: flex;
		flex-direction: column;
		align-items: center;
		font-weight: bold;

		.title-name {
			margin: 10px 0px 3px 0px;
			font-size: $uni-font-size-lg;
		}
	}
</style>
