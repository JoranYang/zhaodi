<template>
	<view class="siyuan">
		<u-toast ref="uToast" />
		<view style="display: flex;margin: 30rpx;align-items: center;">
			<view style="width: 5px;height: 20px;background: #1779FF;border-radius: 5000px;"></view>
			<view style="margin-left: 1%;font-weight: bold;font-size: 34rpx;">信息主体</view>
		</view>
		<u-form :model="verifyInfo" style="padding: 0rpx 30rpx;background-color: #FFFFFF;">
			<u-form-item :label-position="labelPosition" label="货运车辆" prop="numberPlate" :label-width="labelWidth" :label-style="titleStyle">
				<u-input :border="border" placeholder="" v-model="verifyInfo.numberPlate" type="text" :disabled="true" />
			</u-form-item>
			<u-form-item :label-width="labelWidth" :label-position="labelPosition" label="发货日期" prop="deliveryDate" :label-style="titleStyle">
				<u-input :border="border" placeholder="" v-model="verifyInfo.deliveryDate" type="text" :disabled="true" />
			</u-form-item>
			<u-form-item :label-width="labelWidth" :label-position="labelPosition" label="收货日期" prop="deliveryDate" :label-style="titleStyle">
				<u-input :border="border" placeholder="" v-model="verifyInfo.deliveryDate" type="text" :disabled="true" />
			</u-form-item>
			<u-form-item :label-position="labelPosition" label="收货人" prop="transportCompany" :label-width="labelWidth"
			 :label-style="titleStyle">
				<u-input :border="border" placeholder="" v-model="verifyInfo.transportCompany" type="text" :disabled="true" />
			</u-form-item>
			<u-form-item :label-width="labelWidth" :label-position="labelPosition" label="总米数" prop="totalMeters" :label-style="titleStyle">
				<u-input :border="border" placeholder="" v-model="verifyInfo.totalMeters" type="text" :disabled="true" />
			</u-form-item>
			<u-form-item :label-width="labelWidth" :label-position="labelPosition" label="总套数" prop="totalNumber" :label-style="titleStyle">
				<u-input :border="border" placeholder="" v-model="verifyInfo.totalNumber" type="text" :disabled="true" />
			</u-form-item>
			<u-form-item :label-width="labelWidth" :label-position="labelPosition" label="金额" prop="totalAmount" :label-style="titleStyle">
				<u-input :border="border" placeholder="" v-model="verifyInfo.totalAmount" type="text" :disabled="true" />
			</u-form-item>
		</u-form>
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
							<text style="margin-left: 10rpx;">{{item.totalAmount}}(元)</text>
						</u-col>
						<u-col span="4">
							<text class="body_font_size">总套数</text>
							<text style="margin-left: 10rpx;">{{item.totalNumber}}(套)</text>
						</u-col>
						<u-col span="4">
							<text class="body_font_size">总米数</text>
							<text style="margin-left: 10rpx;">{{item.totalMeters}}(米)</text>
						</u-col>
					</u-row>
				</view>
				<u-line v-if="index<verifyDetails.length-1" class="u-m-b-10" color="#ebeef5" />
			</view>
		</view>
		<block v-if="status!=2">
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
		</block>
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
				kValue: false,
				status:0//判断是否显示账单异议
			}
		},
		onLoad: function(options) {
			this.verifyInfo = JSON.parse(options.item)
			this.status = Number(options.status)
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
