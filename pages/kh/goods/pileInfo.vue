<template>
	<view class="siyuan">
		<view style="display: flex;margin: 30rpx;align-items: center;">
			<view style="width: 5px;height: 20px;background: #1779FF;border-radius: 5000px;"></view>
			<view style="margin-left: 1%;font-weight: bold;font-size: 34rpx;">发货主体</view>
		</view>
		<u-form :model="goodsInfo" style="padding: 0rpx 30rpx;background-color: #FFFFFF;">
			<u-form-item :label-position="labelPosition" label="项目名称" prop="projectName" :label-width="labelWidth" :label-style="titleStyle">
				<u-input :border="border" placeholder="" v-model="goodsInfo.projectName" type="text" :disabled="true" />
			</u-form-item>
			<u-form-item :label-width="labelWidth" :label-position="labelPosition" label="项目类型" prop="xmlxmc" :label-style="titleStyle">
				<u-input :border="border" placeholder="" v-model="goodsInfo.xmlxmc" type="text" :disabled="true" />
			</u-form-item>
			<u-form-item :label-width="labelWidth" :label-position="labelPosition" label="合同编号" prop="hth" :label-style="titleStyle">
				<u-input :border="border" placeholder="" v-model="goodsInfo.hth" type="text" :disabled="true" />
			</u-form-item>
			<u-form-item :label-position="labelPosition" label="发货日期" prop="fhrq" :label-width="labelWidth" :label-style="titleStyle">
				<u-input :border="border" placeholder="" v-model="goodsInfo.fhrq" type="text" :disabled="true" />
			</u-form-item>
			<u-form-item :label-position="labelPosition" label="状态" prop="statusMc" :label-width="labelWidth" :label-style="titleStyle">
				<u-input :border="border" placeholder="" v-model="goodsInfo.statusMc" type="text" :disabled="true" />
			</u-form-item>
			<u-form-item :label-width="labelWidth" :label-position="labelPosition" label="公司名称" prop="khmc" :label-style="titleStyle">
				<u-input :border="border" placeholder="请输入公司名称" v-model="goodsInfo.khmc" type="text" :disabled="true" />
			</u-form-item>
			<u-form-item :label-width="labelWidth" :label-position="labelPosition" label="发货地址" prop="xmdz" :label-style="titleStyle">
				<u-input :border="border" placeholder="请输入发货地址" v-model="goodsInfo.xmdz" type="text" :disabled="true" />
			</u-form-item>
			<u-form-item :label-width="labelWidth" :label-position="labelPosition" label="签收人" prop="qsr" :label-style="titleStyle">
				<u-input :border="border" placeholder="请输入签收人" v-model="goodsInfo.qsr" type="text" :disabled="true" />
			</u-form-item>
			<u-form-item :label-width="labelWidth" :label-position="labelPosition" label="联系方式" prop="qsrlxfs" :label-style="titleStyle">
				<u-input :border="border" placeholder="请输入联系方式" v-model="goodsInfo.qsrlxfs" type="text" :disabled="true" />
			</u-form-item>
		</u-form>
		<view style="display: flex;margin: 30rpx;align-items: center;">
			<view style="width: 5px;height: 20px;background: #1779FF;border-radius: 5000px;"></view>
			<view style="margin-left: 1%;font-weight: bold;font-size: 34rpx;">发货明细</view>
		</view>
		<!-- <u-line class="u-m-b-10" color="#ebeef5" /> -->
		<!-- 合同详请列表小于2条显示 -->
		<view v-if="projectDetailList.length>0">
			<view v-for="(item, index) in projectDetailList" :key="item.id" style="background-color: #FFFFFF;">
				<view style="padding: 10rpx 30rpx;">
					<u-row class="u-m-t-20" gutter="1" style="font-size: 30rpx;font-weight: bold;">
						{{item.mc}} {{item.zx}}
					</u-row>
					<u-row class="u-m-t-10" gutter="1">
						<u-col span="4">
							<text class="body_font_size">申请数量</text>
							<text style="margin-left: 10rpx;">{{item.sqsl}}(米)</text>
						</u-col>
					</u-row>
					<u-row class="u-m-t-20" gutter="1">
						<u-col span="4">
							<text class="body_font_size">桩类型</text>
							<text style="margin-left: 10rpx;">{{item.zlx2}}</text>
						</u-col>
						<u-col span="4">
							<text class="body_font_size">组合桩长</text>
							<text style="margin-left: 10rpx;">{{item.zhzc1}}</text>
						</u-col>
						<u-col span="4">
							<text class="body_font_size">套数</text>
							<text style="margin-left: 10rpx;">{{item.gs}}(套)</text>
						</u-col>
					</u-row>
					<u-row class="u-m-t-20" gutter="1">
						<u-col span="4">
							<text class="body_font_size">运输中米数</text>
							<text style="margin-left: 10rpx;">{{item.carriage?item.carriage:0}}</text>
						</u-col>
						<u-col span="4">
							<text class="body_font_size">待签收米数</text>
							<text style="margin-left: 10rpx;">{{item.noSign?item.noSign:0}}</text>
						</u-col>
						<u-col span="4">
							<text class="body_font_size">已签收米数</text>
							<text style="margin-left: 10rpx;">{{item.signed?item.signed:0}}</text>
						</u-col>
					</u-row>
					<u-row class="u-m-t-10" gutter="1">
						<u-col span="4">
							<text class="body_font_size">备注</text>
							<text style="margin-left: 10rpx;">{{item.bz}}</text>
						</u-col>
					</u-row>
					<u-line v-if="index<projectDetailList.length-1" class="u-m-b-10" color="#ebeef5" />
				</view>
			</view>
		</view>
		<u-alert-tips v-if="goodsInfo.revokeAppRemark" class="u-margin-15" type="warning" title="撤销原因" :show-icon="true" :description="goodsInfo.revokeAppRemark"></u-alert-tips>
	</view>
</template>

<script>
	import {
		getShipInfo
	} from '@/common/my.js'
	export default {
		data() {
			return {
				goodsInfo: {},
				/**
				 * 项目明细列表
				 * @param {Object} options
				 */
				projectDetailList: [],
				labelPosition: 'left',
				border: false,
				labelWidth:140,
				titleStyle: {
					fontSize: '30rpx'
				}
			}
		},
		onLoad(options) {
			
		},
		methods: {
			/**
			 * 获取发货申请详请
			 */
			getInfo(id) {
				getShipInfo({
					id
				}).then(res => {
					if (res.result) {
						this.goodsInfo = res.info
						switch (this.goodsInfo.status) {
							case 1:
								this.goodsInfo.statusMc = "待审核"
								break
							case 2:
								this.goodsInfo.statusMc = "审核不通过"
								break
							case 3:
							case 4:
								this.goodsInfo.statusMc = "待发货"
								break
							case 5:
							case 6:
								this.goodsInfo.statusMc = "在途"
								break
							case 7:
								this.goodsInfo.statusMc = "待签收"
								break
							case 8:
								this.goodsInfo.statusMc = "已签收"
								break
						}
						this.projectDetailList = res.info.shipmentApplicationDetails
					}
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
</style>
