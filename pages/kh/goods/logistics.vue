<!-- 查看物流列表 -->
<template>
	<view class="siyuan">
		<u-checkbox-group @change="checkboxGroupChange">
			<u-checkbox @change="checkboxChange" v-model="item.checked" v-for="(item, index) in shipLogisticsList" :key="index"
			 class="shipLog-list" :disabled="item.shipmentApplicationOrderStatusfalse">
				<view class="item-title">
					<view class="docno">订单单号：{{item.docNo}}</view>
					<u-tag class="item-tag" :text="item.shipmentApplicationOrderStatus | orderStatus" mode="light" size="mini" :type="item.shipmentApplicationOrderStatus | orderColor" />
				</view>
				<view class="item-car">
					<u-tag class="car-tag" :text="'车牌号'+ item.numberPlate +' | 总米数'+item.totalMater" mode="plain" size="mini" type="error" />
				</view>
				<view v-for="info in item.shipAppDetails" :key="info.id" class="details-list">
					<view><label>规格</label>{{info.specs}}</view>
					<view><label>根数</label>{{Number(info.number)}}</view>
					<view><label>桩类型</label>{{info.productName}}</view>
					<view><label>发货米数</label>{{info.shipmentMeters}}</view>
				</view>
				<view style="text-align: end;">
					<u-button v-if="item.shipmentApplicationOrderStatus==='01' || item.shipmentApplicationOrderStatus==='02'" size="mini"
					 style=" margin: 40rpx 0rpx 0rpx;color: #1779FF;" @click="receipt(item.docNo)" plain>确认收货</u-button>
				</view>
				<!-- <view class="wpf-logisitcs-list-a">
					<view style="font-size: 32rpx;font-weight: bold;line-height: 30px;">
						<view>单号：{{item.docNo}}</view>车牌号：{{item.numberPlate}} 总米数：{{item.totalMater}}
					</view>
					<view style="margin-left: auto;" :style="item.shipmentApplicationOrderStatus | orderColor">{{item.shipmentApplicationOrderStatus | orderStatus}}</view>
				</view>
				<view v-for="info in item.shipAppDetails" :key="info.id" style="padding-top: 20rpx;">
					<u-row>
						<view style="" class="wpf-shipAppDetails-arcile"></view>
						<text style="font-size: 32rpx;margin-left: 10rpx;">{{info.productName}} {{info.specs}}</text>
					</u-row>
					<u-row style="padding-top: 30rpx;">
						<u-col span="6">
							<view>
								<text class="wpf-info-font">桩类型</text><text class="wpf-info-font-b">{{info.productName}}</text>
							</view>
						</u-col>
						<u-col span="6">
							<view>
								<text class="wpf-info-font">根数/根</text><text class="wpf-info-font-b">{{Number(info.number)}}</text>
							</view>
						</u-col>
					</u-row>
					<u-row>
						<u-col span="6">
							<view>
								<text class="wpf-info-font">发货米数/米</text><text class="wpf-info-font-b">{{info.shipmentMeters}}</text>
							</view>
						</u-col>
					</u-row>
				</view>
				<view style="text-align: end;">
					<u-button v-if="item.shipmentApplicationOrderStatus==='01' || item.shipmentApplicationOrderStatus==='02'" size="mini"
					 style=" margin: 40rpx 0rpx 0rpx;color: #1779FF;" @click="receipt(item.docNo)" plain>确认收货</u-button>
				</view> -->
			</u-checkbox>
		</u-checkbox-group>
		<!-- <view v-for="(item,index) in shipLogisticsList" :key="index" class="wpf-logisitcs-list">
			<view class="wpf-logisitcs-list-a">
				<view style="font-size: 32rpx;font-weight: bold;line-height: 30px;">
					<view>单号：{{item.docNo}}</view>车牌号：{{item.numberPlate}} 总米数：{{item.totalMater}}
				</view>
				<view style="margin-left: auto;" :style="item.shipmentApplicationOrderStatus | orderColor">{{item.shipmentApplicationOrderStatus | orderStatus}}</view>
			</view>
			<view v-for="info in item.shipAppDetails" :key="info.id" style="padding-top: 20rpx;">
				<u-row>
					<view style="" class="wpf-shipAppDetails-arcile"></view>
					<text style="font-size: 32rpx;margin-left: 10rpx;">{{info.productName}} {{info.specs}}</text>
				</u-row>
				<u-row style="padding-top: 30rpx;">
					<u-col span="6">
						<view>
							<text class="wpf-info-font">桩类型</text><text class="wpf-info-font-b">{{info.productName}}</text>
						</view>
					</u-col>
					<u-col span="6">
						<view>
							<text class="wpf-info-font">根数/根</text><text class="wpf-info-font-b">{{Number(info.number)}}</text>
						</view>
					</u-col>
				</u-row>
				<u-row>
					<u-col span="6">
						<view>
							<text class="wpf-info-font">发货米数/米</text><text class="wpf-info-font-b">{{info.shipmentMeters}}</text>
						</view>
					</u-col>
				</u-row>
			</view>
			<view style="text-align: end;">
				<u-button v-if="item.shipmentApplicationOrderStatus==='01' || item.shipmentApplicationOrderStatus==='02'" size="mini"
				 style=" margin: 40rpx 0rpx 0rpx;color: #1779FF;" @click="receipt(item.docNo)" plain>确认收货</u-button>
			</view>
		</view> -->
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {
		getShipLogisticsList,
		getShipLogisticsSign
	} from '@/common/my.js'
	export default {
		data() {
			return {
				listQuery: {
					pageNum: 1,
					pageSize: 10,
					shipAppNo: undefined
				},
				total: 0,
				shipLogisticsList: [],
				/**
				 * 单号
				 */
				docNoList: [],
				showPopup: false
			}
		},
		filters: {
			cfrj(val) {
				const time = new Date(val)
				return time.toLocaleString()
			},
			orderStatus(val) {
				switch (val) {
					case '01':
						return "运输中"
					case '02':
						return "待签收"
					case '03':
					case '04':
					case '05':
						return "已签收"
					case '06':
						return "已对账"
				}
			},
			orderColor(val) {
				switch (val) {
					case '01':
						return "warning"
					case '02':
						return "error"
					case '03':
						return "success"
					case '04':
						return "success"
					case '05':
						return "success"
					case '06':
						return "primary"
				}
			}
		},
		onLoad(options) {
			this.listQuery.shipAppNo = options.id
			this.getList()
		},
		methods: {
			getList() {
				getShipLogisticsList(this.listQuery).then(res => {
					if (res.result) {
						this.shipLogisticsList = res.info.pageInfo
						this.shipLogisticsList.map((val, index) => {
							this.docNoList.push(val.docNo)
							val.totalMater = 0
							const detail = {
								shipmentMeters: 60,
								productName: '异性罐装',
								number: 5,
								specs: 'TP'
							}
							val.shipAppDetails.push(detail)
							const shipAppDetailsList = val.shipAppDetails
							shipAppDetailsList.map((value, i) => {
								val.totalMater = val.totalMater + value.shipmentMeters
							})
						})
						this.total = res.total
					}
				})
			},
			/**
			 * 确认收货
			 */
			/**
			 * 确认收货
			 * @param {Object} docno 出货单单号
			 */
			receipt(docno) {
				this.showPopup = true
				uni.showLoading({
					title: '确认收货中'
				})
				getShipLogisticsSign({
					docno: docno
				}).then(res => {
					uni.hideLoading()
					this.$refs.uToast.show({
						title: '收货成功',
						type: 'success'
					})
					this.getList()
				})
			}
		}
	}
</script>
<style>
	page {
		background-color: rgb(242, 242, 242);
	}
</style>
<style scoped lang="scss">
	.item-title {
		display: flex;
		font-size: $uni-font-size-sm;

		.docno {
			font-weight: bold;
		}
	}

	/deep/ .u-checkbox {
		width: 100% !important;
		padding: 10px 10px 10px 20px;
	}

	/deep/ .u-checkbox__label {
		width: 100%;
	}

	.item-tag {
		margin-left: auto;
	}

	.item-car {
		display: flex;
		font-size: 5px;
		line-height: 15px;
	}

	.car-tag {
		max-height: 15px;
		padding: 1px 3px;
	}

	.shipLog-list {
		background-color: white;
		margin-bottom: 10px;
	}

	.details-list {
		background-color: #f8f8f8;
		margin: 15px 0px 10px 15px;
		padding: 15px;
		border-radius: 6px;
		font-size: $uni-font-size-sm;
	}

	label {
		display: inline-block;
		width: 60px;
		color: #a3a3a3;
	}

	// .wpf-logisitcs-list {
	// 	background-color: #FFFFFF;
	// 	padding: 0rpx 30rpx 15rpx 30rpx;
	// 	margin-bottom: 20upx;
	// 	// border-bottom: thick solid #f4f4f4;

	// 	.wpf-logisitcs-list-a {
	// 		display: flex;
	// 		line-height: 110rpx;
	// 		border-bottom: thick solid #f4f4f4;
	// 		border-width: 1px;
	// 	}
	// }

	// .wpf-shipAppDetails-arcile {
	// 	width: 18rpx;
	// 	height: 18rpx;
	// 	background-color: #1779FF;
	// 	border-radius: 500rpx;
	// }

	// .wpf-info-font {
	// 	font-size: 28rpx;
	// 	color: #BABABA;
	// }

	// .wpf-info-font-b {
	// 	font-size: 32rpx;
	// 	margin-left: 10rpx;
	// 	color: black;
	// }
</style>
