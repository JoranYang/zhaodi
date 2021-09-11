<template>
	<view class="siyuan">
		<u-toast ref="uToast" />
		<view style="display: flex;margin: 30rpx;align-items: center;">
			<view style="width: 5px;height: 20px;background: #1779FF;border-radius: 5000px;"></view>
			<view style="margin-left: 1%;font-weight: bold;font-size: 34rpx;">账单主体</view>
		</view>
		<u-form :model="verifyInfo" style="padding: 0rpx 30rpx;background-color: #FFFFFF;">
			<u-form-item :label-position="labelPosition" label="项目名称" prop="projectName" :label-width="labelWidth" :label-style="titleStyle">
				<u-input :border="border" placeholder="" v-model="verifyInfo.projectName" type="text" :disabled="true" />
			</u-form-item>
			<u-form-item :label-width="labelWidth" :label-position="labelPosition" label="项目类型" prop="xmlx" :label-style="titleStyle">
				<u-input :border="border" placeholder="" v-model="verifyInfo.xmlx" type="text" :disabled="true" :value="verifyInfo.xmlx" />
			</u-form-item>
			<u-form-item :label-width="labelWidth" :label-position="labelPosition" label="合同编号" prop="khbh" :label-style="titleStyle">
				<u-input :border="border" placeholder="" v-model="verifyInfo.khbh" type="text" :disabled="true" />
			</u-form-item>
			<u-form-item :label-position="labelPosition" label="账单日期" prop="startDate" :label-width="labelWidth" :label-style="titleStyle">
				<u-input :border="border" placeholder="" :value="date(verifyInfo)" type="text" :disabled="true" />
			</u-form-item>
			<!-- <u-form-item :label-width="labelWidth" :label-position="labelPosition" label="发货地址" prop="xmdz" :label-style="titleStyle">
				<u-input :border="border" placeholder="请输入发货地址" v-model="verifyInfo.xmdz" type="text" :disabled="true" />
			</u-form-item> -->
			<u-form-item :label-width="labelWidth" :label-position="labelPosition" label="联系方式" prop="qsrlxfs" :label-style="titleStyle">
				<u-input :border="border" placeholder="" v-model="verifyInfo.qsrlxfs" type="text" :disabled="true" />
			</u-form-item>
			<u-form-item :label-width="labelWidth" :label-position="labelPosition" label="总米数" prop="totalMeters" :label-style="titleStyle">
				<u-input :border="border" placeholder="" v-model="verifyInfo.totalMeters" type="text" :disabled="true" />
			</u-form-item>
			<u-form-item :label-width="labelWidth" :label-position="labelPosition" label="账单总金额" prop="totalAmount" :label-style="titleStyle">
				<u-input :border="border" placeholder="" v-model="verifyInfo.totalAmount" type="text" :disabled="true" />
			</u-form-item>
		</u-form>
		<view style="display: flex;margin: 30rpx;align-items: center;">
			<view style="width: 5px;height: 20px;background: #1779FF;border-radius: 5000px;"></view>
			<view style="margin-left: 1%;font-weight: bold;font-size: 34rpx;">账单明细</view>
		</view>
		<!-- <u-line class="u-m-b-10" color="#ebeef5" /> -->
		<!-- 合同详请列表小于2条显示 -->
		<view v-if="verifyDetails.length>0">
			<view v-for="(item,index) in verifyDetails" :key="index" style="background-color: #FFFFFF;pointer-events: auto;"
			 @click="goInfo(item,verifyInfo.status)">
				<view style="padding: 10rpx 30rpx;pointer-events: none;">
					<u-row class="u-m-t-20" gutter="1">
						<text style="font-size: 30rpx;font-weight: bold;">单号:{{item.docNo}} </text>
						<u-icon v-show="verifyInfo.status!='2'" name="question-circle" color="#909399" size="26" label="账单异议" label-color="#909399"
						 label-size="26" style="margin-left: auto;" />
					</u-row>
					<view>
						<u-row class="u-m-t-20" gutter="1">
							<u-col>
								<text class="body_font_size">车牌号</text>
								<text style="margin-left: 10rpx;">{{item.numberPlate}}</text>
							</u-col>
						</u-row>

						<u-row class="u-m-t-20" gutter="1">
							<u-col span="4">
								<text class="body_font_size">总金额/元</text>
								<text style="margin-left: 10rpx;">{{item.totalAmount}}</text>
							</u-col>
							<u-col span="4">
								<text class="body_font_size">总套数/套</text>
								<text style="margin-left: 10rpx;">{{item.totalNumber}}</text>
							</u-col>
							<u-col span="4">
								<text class="body_font_size">总米数</text>
								<text style="margin-left: 10rpx;">{{item.totalMeters}}</text>
							</u-col>
						</u-row>
						<u-row class="u-m-t-20" gutter="1">
							<u-col>
								<text class="body_font_size">签收人</text>
								<text style="margin-left: 10rpx;">{{item.transportCompany}}</text>
							</u-col>
							<!-- <u-col span="4">
								<text class="body_font_size">总根数</text>
								<text style="margin-left: 10rpx;">{{item.totalNumber}}</text>
							</u-col>
							<u-col span="4">
								<text class="body_font_size">总米数</text>
								<text style="margin-left: 10rpx;">{{item.totalMeters}}</text>
							</u-col> -->
						</u-row>
					</view>
				</view>
				<u-line v-if="index<verifyDetails.length-1" class="u-m-b-10" color="#ebeef5" />
			</view>
		</view>
		<view v-if="verifyReturnShipDetails.length>0" style="margin-top: 10rpx;">
			<view v-for="(item,index) in verifyReturnShipDetails" :key="index" style="background-color: #FFFFFF;pointer-events: auto;"
			 @click="goRetInfo(item)">
				<view style="padding: 10rpx 30rpx;pointer-events: none;">
					<u-row class="u-m-t-20" gutter="1">
						<text style="font-size: 30rpx;font-weight: bold;">{{item.docNo}}</text>
					</u-row>
					<view>
						<u-row class="u-m-t-20" gutter="1">
							<u-col span="4">
								<text class="body_font_size">总金额</text>
								<text style="margin-left: 10rpx;">{{item.orderPrice}}(元)</text>
							</u-col>
							<!-- <u-col span="4">
								<text class="body_font_size">总根数</text>
								<text style="margin-left: 10rpx;">{{item.totalNumber}}</text>
							</u-col> -->
							<u-col span="4">
								<text class="body_font_size">总米数</text>
								<text style="margin-left: 10rpx;">{{item.totalMeters}}(米)</text>
							</u-col>
						</u-row>
						<!-- <u-row class="u-m-t-20" gutter="1">
							<u-col span="4">
								<text class="body_font_size">签收人</text>
								<text style="margin-left: 10rpx;">{{item.transportCompany}}</text>
							</u-col>
						</u-row> -->
					</view>
				</view>
				<u-line v-if="index<verifyDetails.length-1" class="u-m-b-10" color="#ebeef5" />
			</view>
		</view>
		<view style="margin: 10px;" v-show="this.verifyInfo.status!=2">
			<view class="wpf-btn" @click="save">确认对账</view>
		</view>
	</view>
</template>

<script>
	import {
		saveVerify
	} from '@/common/reconciliation.js'
	export default {
		data() {
			return {
				verifyInfo: {},
				/**
				 * @description 项目明细列表
				 */
				projectDetailList: [],
				labelPosition: 'left',
				border: false,
				labelWidth: 160,
				titleStyle: {
					fontSize: '30rpx'
				},
				verifyDetails: [],
				/**
				 * @description 弹出框状态
				 */
				popupShow: false,
				/**
				 * @description 退货详情
				 */
				verifyReturnShipDetails: []
			}
		},
		onLoad(options) {
			this.verifyInfo = JSON.parse(options.item)
			switch (this.verifyInfo.xmlx) {
				case '0':
					this.verifyInfo.xmlx = "合同项目"
					break
				case '1':
					this.verifyInfo.xmlx = "试桩项目"
					break
			}
			this.verifyDetails = this.verifyInfo.details
			this.verifyReturnShipDetails = this.verifyInfo.returnShipDetails
			console.log(this.verifyReturnShipDetails)
		},
		methods: {
			//组合账单日期 
			date(val) {
				return val.startDate + ' 至 ' + val.endDate
			},
			/**
			 * 确认对账
			 */
			save() {
				saveVerify({
					statementIds: this.verifyInfo.statementId
				}).then(res => {
					this.$refs.uToast.show({
						title: '对账成功',
						position: 'top',
						type: 'success',
						url: '/pages/kh/reconciliation/index'
					})
				})
			},
			/**
			 * @param {Object} item
			 * @description 查看项目明细详情
			 */
			goInfo(item, status) {
				item['statementId'] = this.verifyInfo.statementId
				uni.navigateTo({
					url: './detailInfo?item=' + JSON.stringify(item) + '&status=' + status
				})
			},
			/**
			 * @param {Object} item
			 * @description 查看项目明细详情
			 */
			goRetInfo(item) {
				item['statementId'] = this.verifyInfo.statementId
				uni.navigateTo({
					url: './retGood?item=' + JSON.stringify(item)
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.wrap {
		padding: 10rpx 30rpx 30rpx 30rpx;
	}

	.body_font_size {
		color: #909399;
		font-size: 28rpx;
	}

	.wpf-btn {
		width: 100%;
		border-radius: 500px;
		background-color: #1779FF;
		font-size: 16px;
		color: white;
		text-align: center;
		line-height: 45px;
	}

	.content {
		padding: 24upx;
	}
</style>
