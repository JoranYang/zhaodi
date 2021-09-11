<template>
	<view class="siyuan">
		<u-toast ref="uToast" />
		<view style="display: flex;margin: 30rpx;align-items: center;">
			<view style="width: 5px;height: 20px;background: #1779FF;border-radius: 5000px;"></view>
			<view style="margin-left: 1%;font-weight: bold;font-size: 34rpx;">货物明细</view>
		</view>
		<view v-if="verifyDetails.length>0">
			<view v-for="(item,index) in verifyDetails" :key="index" style="background-color: #FFFFFF;">
				<view style="padding: 10rpx 30rpx;">
					<u-row><text style="font-size: 30rpx;font-weight: bold;">{{item.productName}}</text></u-row>
					<u-row class="u-m-t-20" gutter="1">
						<u-col span="4">
							<text class="body_font_size">总金额</text>
							<text style="margin-left: 10rpx;">{{item.totalAmount}}</text>
						</u-col>
						<u-col span="4">
							<text class="body_font_size">总套数</text>
							<text style="margin-left: 10rpx;">{{item.totalNumber}}</text>
						</u-col>
						<u-col span="4">
							<text class="body_font_size">总米数</text>
							<text style="margin-left: 10rpx;">{{item.totalMeters}}</text>
						</u-col>
					</u-row>
				</view>
				<u-line v-if="index<verifyDetails.length-1" class="u-m-b-10" color="#ebeef5" />
			</view>
		</view>
		<view style="display: flex;margin: 30rpx;align-items: center;">
			<view style="width: 5px;height: 20px;background: #1779FF;border-radius: 5000px;"></view>
			<view style="margin-left: 1%;font-weight: bold;font-size: 34rpx;">账单异议</view>
		</view>
		<view style="background-color: #fff;">
			<u-input v-model="errorVerify.errorMsg" :type="type" :height="height" :auto-height="autoHeight" :custom-style="customStyle"
			 @blur="handleBlur" />
		</view>
		<view style="margin: 10px;">
			<view class="wpf-btn" @click="saveMag">提交</view>
		</view>
	</view>
</template>

<script>
	import {
		saveErrorVerify
	} from '@/common/reconciliation.js'
	export default {
		data() {
			return {
				errorVerify: {
					errorMsg: '',
					statementid: '',
					invoiceId: ''
				},
				labelPosition: 'left',
				border: false,
				labelWidth: 140,
				titleStyle: {
					fontSize: '30rpx'
				},
				customStyle: {
					paddingLeft: '20upx'
				},
				verifyInfo: {},
				verifyDetails: [],
				type: 'textarea',
				height: 100,
				autoHeight: true,
				kValue: false
			}
		},
		onLoad: function(options) {
			this.verifyInfo = JSON.parse(options.item)
			this.verifyDetails = this.verifyInfo.details
		},
		methods: {
			saveMag() {
				if (!this.kValue) {
					this.$refs.uToast.show({
						title: '请填写异议内容',
						type: 'error',
						position: 'top'
					})
					return
				}
				this.errorVerify.statementid = this.verifyInfo.statementId
				this.errorVerify.invoiceId = this.verifyInfo.id
				saveErrorVerify(this.errorVerify).then(res => {
					this.$refs.uToast.show({
						title: '提交成功',
						type: 'success',
						position: 'top',
						url: '/pages/kh/reconciliation/info'
					})
				})
			},
			handleBlur(e) {
				const flag = e.trim().length
				if (flag <= 0) {
					this.kValue = false
					this.$refs.uToast.show({
						title: '请填写异议内容',
						type: 'error',
						position: 'top'
					})
				} else {
					this.kValue = true
				}
			}
		}
	}
</script>

<style>
	.wpf-btn {
		width: 100%;
		border-radius: 500px;
		background-color: #1779FF;
		font-size: 16px;
		color: white;
		text-align: center;
		line-height: 45px;
	}
</style>
