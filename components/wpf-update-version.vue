<template>
	<u-popup v-model="showUpdateFlag.flag" mode="center" border-radius="14" :closeable="true" width="70%" height="40%" >
		<view class="popup-update">
			<view class="update-title"><text class="title">发现新版本</text><text class="version">{{updateVersionObject.interpretation}}</text></view>
			<view class="update-content"><text>{{updateVersionObject.remark}}</text></view>
		</view>
		<view class="update-image">
			<u-image src="/static/update.png" width="100%" height="600rpx" mode="widthFix"></u-image>
		</view>
		<view class="popup-update-btn" v-on:click="$emit('clickName')">更新</view>
	</u-popup>
</template>

<script>
	export default {
		name: 'wpf-update-version',
		props: {
			// 传的内容对象
			updateVersionObject: Object,
			// 是否显示内容
			showUpdateFlag: Object
		},
		data() {
			return {
				
			};
		},
		methods:{
			close(e){
				console.log("关闭")
				this.$emit('showUpdateFlag'); // 通知父组件更新
			}
		}
	}
</script>

<style lang="scss" scoped>
	.popup-update {
		padding: 70px 25px;
		z-index: 1;
		position: absolute;
		width: 100%;

		.update-title {
			font-weight: bold;
			text-align: center;

			.title {
				color: #1779FF;
				font-size: $uni-font-size-title;
			}

			.version {
				margin-left: 5px;
			}

		}

		.update-content {
			margin-top: 15px;
		}
	}

	.update-image {
		width: 45%;
		margin-top: -75px;
		position: fixed;
		margin-left: -8%;
	}

	.popup-update-btn {
		background-color: #1779FF;
		color: white;
		bottom: 0px;
		position: absolute;
		width: 100%;
		line-height: 40px;
		height: 40px;
		text-align: center;
	}
</style>
