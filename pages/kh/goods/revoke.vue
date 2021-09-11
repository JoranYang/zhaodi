<template>
	<view>
		<view style="background-color: white;padding: 20px;">
			<view>{{item.projectName}}</view>
			<view>地址:{{item.xmdz}}</view>
		</view>
		<view class="revoke_reason">
			<view class="reason_title">撤销原因</view>
			<view class="reason_content">
				<u-input v-model.trim="mark" @blur="inputBlur" :type="type" :height="height" :auto-height="autoHeight" :clearable="false"
				 style='padding: 5px;' />
			</view>
		</view>
		<u-button type="error" shape="circle" class='btn_save' @click="save" :disabled="markSatus">提交</u-button>
	</view>
</template>

<script>
	import {
		cancelProjectApply
	} from '@/common/project.js'
	export default {
		data() {
			return {
				item: {},
				value: '',
				type: 'textarea',
				height: 150,
				autoHeight: true,
				mark: '',
				markSatus: true
			};
		},
		onLoad(options) {
			this.item = JSON.parse(options.item)
		},
		methods: {
			save() {
				uni.showLoading({
					title: '正在提交中'
				})
				this.item.xmmc = this.item.projectName
				this.item.mark = this.mark
				cancelProjectApply(this.item).then(res => {
					setTimeout(() => {
						uni.hideLoading()
						if (res.result) {
							uni.showToast({
								title: '提交成功',
								icon: 'success'
							})
							setTimeout(() => {
								uni.navigateTo({
									url: 'test?current=1'
								})
							}, 1000)
						} else {
							uni.showToast({
								title: '撤销失败！',
								icon: 'none'
							})
						}
					}, 500)
				})
			},
			inputBlur(e) {
				if (e.length > 0) {
					this.markSatus = false
				}else{
					this.markSatus = true
				}
			}
		}
	}
</script>

<style lang="scss">
	.revoke_reason {
		background-color: white;
		margin: 10px 5px;
		padding: 20px 10px;
		border-radius: 6px;

		.reason_title {
			padding: 0px 0px 10px 0px;
			color: #a3a3a3;
			letter-spacing: 0.5px;
		}

		.reason_content {
			background-color: #f8f8f7;
		}
	}


	/deep/ .u-size-default {
		height: 30px;
		line-height: 30px;
	}

	.btn_save {
		margin: 10px;
	}
</style>
