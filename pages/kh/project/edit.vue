<template>
	<view class="siyuan wrap">
		<u-notice-bar mode="horizontal" :list="tipList" type="error"></u-notice-bar>
		<view style="display: flex;padding: 11px 13px;align-items: center;">
			<view style="width: 5px;height: 20px;background: #1779FF;border-radius: 5000px;"></view>
			<view style="margin-left: 1%;font-weight: bold;font-size: 34rpx;">合同主体</view>
		</view>
		<u-cell-group>
			<u-cell-item title="合同编号" :arrow="false" hover-class="none" :title-style="titleStyle" :value-style="titleStyle">{{projectInfo.htbh}}</u-cell-item>
			<u-cell-item title="项目名称" :arrow="false" hover-class="none" :title-style="titleStyle" :value-style="titleStyle">{{projectInfo.xmmc}}</u-cell-item>
			<u-cell-item title="合同签订单位名称" :arrow="false" hover-class="none" :title-style="titleStyle" :value-style="titleStyle">{{projectInfo.khmc}}</u-cell-item>
			<u-cell-item title="项目详细地址" :arrow="false" hover-class="none" :title-style="titleStyle" :value-style="titleStyle">{{projectInfo.xmdz}}</u-cell-item>
		</u-cell-group>
		<view style="display: flex;padding: 11px 13px;align-items: center;">
			<view style="width: 5px;height: 20px;background: #1779FF;border-radius: 5000px;"></view>
			<view style="margin-left: 1%;font-weight: bold;font-size: 34rpx;">合同明细</view>
		</view>
		<view v-for="(item,index) in projectDetail" :key="index" style="background-color: white;">
			<u-row class="u-p-t-20 u-m-l-30" gutter="1" style="font-size: 32rpx;font-weight: bold;">
				{{item.mc}} {{item.zx}}
			</u-row>
			<u-row class="u-m-t-20 u-m-l-30">
				<u-col span="6">
					<text class="body_font_size">桩类型</text>
					<text style="margin-left: 10rpx;">{{item.selectname}}</text>
				</u-col>
			</u-row>
			<u-row class="u-m-t-20 u-m-l-30">
				<u-col span="6">
					<text class="body_font_size">抗压特性</text>
					<text style="margin-left: 10rpx;">{{item.kyczl}}</text>
				</u-col>
				<u-col span="6">
					<text class="body_font_size">抗拔特性</text>
					<text style="margin-left: 10rpx;">{{item.kbczl}}</text>
				</u-col>
			</u-row>
			<u-row class="u-m-t-20 u-m-l-30">
				<u-col span="6">
					<text class="body_font_size">桩长</text>
					<text style="margin-left: 10rpx;">{{item.zcm}}</text>
				</u-col>
				<u-col span="6">
					<text class="body_font_size">数量</text>
					<text style="margin-left: 10rpx;">{{item.sl}}</text>
				</u-col>
			</u-row>
			<u-line class="u-m-t-20" color="#ebeef5" />
		</view>
		<u-alert-tips v-if="chengePassword" class="u-margin-15" type="warning" :show-icon="true" description="请先修改初始密码,否则无法发起申请发货"></u-alert-tips>
		<u-gap height="100"></u-gap>
		<!-- <u-button @click="getPile" type="primary">发起退桩</u-button> -->
		<view class="btn-fix">
			<u-button :disabled='chengePassword' @click="getApply" type="primary" shape="circle" style="width: 90%;">申请发货</u-button>
		</view>
	</view>
</template>

<script>
	import {
		getProjectById
	} from '@/common/project.js'
	export default {
		data() {
			return {
				/**
				 * 项目详情
				 */
				projectInfo: {},
				/**
				 * 合同详请
				 */
				projectDetail: [],
				titleStyle: {
					fontSize: '30rpx'
				},
				tipList: [
					'为了保证您的发货申请正常提交，请及时对已到的货物进行确认签收!!!'
				],
				chengePassword: uni.getStorageSync('chengePassword')
			}
		},
		onLoad(options) {
			const id = options.id
			this.getById(id)
		},
		methods: {
			/**
			 * 获取项目详请
			 * @param {Object} id
			 */
			getById(id) {
				getProjectById({
					id: id
				}).then(res => {
					if (res.result) {
						this.projectInfo = res.info
						this.projectDetail = res.info.projectDetail
					}
				})
			},
			/**
			 * 跳转申请发货
			 */
			getApply() {
				uni.navigateTo({
					url: './apply?id=' + this.projectInfo.id
				})
			},
			// 跳转退桩页面
			getPile() {
				uni.navigateTo({
					url: '../goods/pile'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	page {
		background-color: #F7F9FB;
	}

	.wpf-btn {
		position: fixed;
		bottom: 0%;
		width: 100%;
		background-color: #1779FF;
		font-size: 16px;
		color: white;
		text-align: center;
		line-height: 50px;
		z-index: 999;
	}

	.body_font_size {
		color: #909399;
		font-size: 28rpx;
	}

	.btn-fix {
		width: 100%;
		height: 60px;
		position: fixed;
		bottom: 0px;
		background-color: white;
		display: flex;
		align-items: center;
	}
</style>
