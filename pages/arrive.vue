<template>
	<view class="siyuan">
		<view style="padding: 5px ;text-align: center;background-color: #00284d;height: 65px;">
			<u-row gutter="10">
				<u-col span="6">
					<u-image mode="widthFix" src="/static/logo/logo.png"></u-image>
				</u-col>
				<!-- <u-col span="6" style="text-align: right;place-self: flex-end;">
					<text style="color: white;">兆弟集团送货单</text>
				</u-col> -->
			</u-row>
		</view>
		<view style="margin-left: 1%;font-weight: bold;font-size: 34rpx;padding: 15px;text-align: center;">发货单</view>
		<u-cell-group>
			<u-cell-item title="单号" :arrow="false" hover-class="none" :title-style="titleStyle"
				:value-style="titleStyle">{{projectInfo.docNo}}</u-cell-item>

			<u-cell-item v-show="projectInfo.shipmentApplicationOrderStatus!='01'" title="状态" :arrow="false"
				hover-class="none" :title-style="titleStyle" :value-style="titleStyle">已送达</u-cell-item>
			<u-cell-item title="送货地址" :arrow="false" hover-class="none" :title-style="titleStyle"
				:value-style="titleStyle">{{projectInfo.xmdz}}</u-cell-item>
			<u-cell-item title="发货时间" :arrow="false" hover-class="none" :title-style="titleStyle"
				:value-style="titleStyle">
				{{$u.timeFormat(formatTime(projectInfo.deliveryDate), 'yyyy年mm月dd日 hh时MM分ss秒')}}
			</u-cell-item>
			<u-cell-item title="运输公司" :arrow="false" hover-class="none" :title-style="titleStyle"
				:value-style="titleStyle">{{projectInfo.transportCompany}}</u-cell-item>
			<u-cell-item title="运输车辆" :arrow="false" hover-class="none" :title-style="titleStyle"
				:value-style="titleStyle">{{projectInfo.numberPlate}}</u-cell-item>
			<u-cell-item title="总米数" :arrow="false" hover-class="none" :title-style="titleStyle"
				:value-style="titleStyle">{{projectInfo.totalMeters}}</u-cell-item>
		</u-cell-group>
		<view style="display: flex;padding: 11px 13px;align-items: center;">
			<view style="width: 5px;height: 20px;background: #1779FF;border-radius: 5000px;"></view>
			<view style="margin-left: 1%;font-weight: bold;font-size: 34rpx;">运输内容</view>
		</view>
		<view v-for="(item,index) in shipAppDetails" :key="index" style="background-color: white;">
			<u-row class="u-p-t-20 u-m-l-30" gutter="1" style="font-size: 32rpx;font-weight: bold;">
				{{item.productName}} 【{{item.specs}}】
			</u-row>
			<u-row class="u-m-t-20 u-m-l-30" gutter="1">
				<u-col span="4">
					<text class="body_font_size">根数/根</text>
					<text style="margin-left: 10rpx;">{{Number(item.number)}}</text>
				</u-col>
				<u-col span="4">
					<text class="body_font_size">总米数/米</text>
					<text style="margin-left: 10rpx;">{{item.shipmentMeters}}</text>
				</u-col>
			</u-row>
			<u-line class="u-m-t-20" color="#ebeef5" />
		</view>
		<u-popup v-model="show" mode="bottom">
			<view class="wrap">
				<view class="u-demo-title u-text-center u-font-16" style="font-weight: bold;">拍照确认</view>
				<u-form :model="driverInfo" ref="driverInfoForm" :rules="rules" :errorType="errorType">
					<u-form-item label-width="labelWidth" :label-position="labelPosition" label="签字" prop="signature">
						<u-input :border="border" v-model="driverInfo.signature" type="text" placeholder="请填写姓名" />
					</u-form-item>
					<u-form-item label-width="labelWidth" :label-position="labelPosition" label="手机号码"
						prop="phoneNumber">
						<u-input :border="border" v-model="driverInfo.phoneNumber" type="text" placeholder="请填写手机号码" />
					</u-form-item>
					<view class="cu-bar bg-white margin-top">
						<view class="action">
							图片上传
						</view>
						<!-- <view class="action">
							{{imgList.length}}/9
						</view> -->
					</view>
					<view class="cu-form-group">
						<u-upload :action="action" ref="uUpload" :file-list="imgList" :header="header" :to-json="true"
							max-count="9" :show-progress="false"></u-upload>
					</view>
					<u-button size="default" type="primary" form-type="submit" @click="saveArr">提交</u-button>
				</u-form>
			</view>
		</u-popup>
		<u-gap height="70"></u-gap>
		<u-button v-show="projectInfo.shipmentApplicationOrderStatus=='01'" size="default" type="primary"
			style="margin: 10px;" form-type="submit" @click="show = true">已送达</u-button>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {
		getShipDetail,
		saveShipArrive
	} from '@/common/reconciliation.js'
	export default {
		data() {
			return {
				projectInfo: {},
				shipAppDetails: [],
				titleStyle: {
					fontSize: '30rpx'
				},
				shipNo: '',
				showModal: false,
				content: '已送达',
				show: false,
				imgList: [],
				/**
				 * @param {String} 请求地址  
				 */
				action: '',
				/**
				 * @param {Object} 请求头信息  
				 */
				header: {
					token: uni.getStorageSync('token'),
					data: 99,
					type: 2
				},
				labelWidth: 140,
				border: false,
				labelPosition: 'left',
				driverInfo: {
					docNo: '',
					signature: '',
					phoneNumber: '',
					photo: ''
				},
				rules: {
					signature: [{
						required: true,
						message: '请填写姓名',
						// 可以单个或者同时写两个触发验证方式 
						trigger: 'blur',
					}],
					phoneNumber: [{
						required: true,
						message: '请填写手机号码',
						// 可以单个或者同时写两个触发验证方式 
						trigger: 'blur',
					}]
				},
				errorType: ['message']
			};
		},
		onLoad: function(options) {
			this.action = this.$baseUrl + 'upload/push'
			this.shipNo = options.shipNo
			this.getInfo()
		},
		// mounted() {
		// 	document.querySelector('.uni-page-head-hd').style.display = 'none' //隐藏返回按钮
		// },
		onReady() {
			this.$refs.driverInfoForm.setRules(this.rules);
			this.imgList = this.$refs.uUpload.lists;
		},
		methods: {
			/**
			 * @param {String} shipNo 发货单号
			 */
			getInfo() {
				uni.showLoading({
					title: '加载中'
				})
				getShipDetail(this.shipNo).then(res => {
					uni.hideLoading()
					this.projectInfo = res.info
					this.shipAppDetails = res.info.details
				})
			},
			/**
			 * 时间格式化
			 * @param {Object} time 申请时间
			 */
			formatTime(time) {
				const t = new Date(time)
				return t.getTime()
			},
			/**
			 *   
			 */
			saveArr() {
				this.$refs.driverInfoForm.validate(valid => {
					if (valid) {
						this.driverInfo.docNo = this.shipNo
						let files = this.$refs.uUpload.lists //上传图片数组
						const uploadIds = []; //存放图片id
						if (files.length < 1) {
							this.$refs.uToast.show({
								title: '请上传图片',
								type: 'warning'
							})
							return
						}
						if (!this.driverInfo.signature) {
							this.$refs.uToast.show({
								title: '请签字',
								type: 'warning'
							})
							return
						}
						if (!this.driverInfo.phoneNumber) {
							this.$refs.uToast.show({
								title: '请填写手机号码',
								type: 'warning'
							})
							return
						}
						uni.showLoading({
							title: '提交中'
						})
						for (const item of files) {
							uploadIds.push(item.response.data.id);
						}
						this.driverInfo.photo = uploadIds.toString()
						saveShipArrive(this.driverInfo).then(res => {
							uni.hideLoading()
							if (res.result) {
								uni.showToast({
									title: '提交成功',
									icon: 'success'
								})
								this.getInfo()
								this.show = false
							} else {
								this.$refs.uToast.show({
									title: '提交失败',
									type: 'error'
								})
							}
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.wrap {
		padding: 10rpx;
	}
</style>
