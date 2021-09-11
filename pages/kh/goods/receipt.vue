<template>
	<view class="container">
		<u-image v-if="showEmpty" mode="widthFix" src="/static/info/empty.png" style="transform: scale(0.6);"></u-image>
		<view v-for="(item,index) in list" :key="index" class="list">
			<u-read-more show-height="400" text-indent="0" close-text="展开详情" open-text="收起详情" :toggle="true">
				{{item.projectName}}
				<u-tag class="item-tag" :text="item.receiptStatus | receiptStatus" size="mini" />
				<view class="u-padding-5 u-font-10">
					<u-icon name="map" /><label>项目地址</label> {{item.xmdz?item.xmdz:'暂无'}}</view>
				<view class="u-padding-5 u-font-10" v-show="item.shipmentAppSingleNumber">
					<u-icon name="calendar" /><label>申请单号</label> {{item.shipmentAppSingleNumber}}</view>
				<view class="u-padding-5 u-font-10" v-show="item.orderNo">
					<u-icon name="calendar" /><label>签收单号</label> {{item.orderNo}}</view>
				<view class="u-padding-5 u-font-10">
					<u-icon name="calendar" /><label>创建时间</label> {{$u.timeFormat(formatTime(item.createdOn), 'yyyy年mm月dd日 hh时MM分ss秒')  }}</view>
				<view class="u-flex" style="font-weight: bold;padding: 15rpx 0rpx;">
					<view>实到</view>
					<view style="margin-left: auto;">
						<text>总米数: {{item.totalMeters}}</text>
						<text class="u-margin-left-20">总根数: {{item.totalNumber}}</text>
					</view>
				</view>
				<view v-for="(invoice,invoice_index) in item.invoice" :key="invoice_index" class="list_item_invoice">
					<view><label class="detail-lable">单号</label>{{invoice.docNo}}</view>
					<view v-for="(details,details_index) in invoice.details" :key="details_index" class="item_record">
						<view><label class="detail-lable">规格</label>{{details.specs}}</view>
						<view><label class="detail-lable">根数</label>{{Number(details.number)}}</view>
						<view><label class="detail-lable">发货米数</label>{{details.shipmentMeters}}</view>
					</view>
				</view>
				<view class="u-flex" style="font-weight: bold;padding: 15rpx 0rpx;">
					<view>实收</view>
					<view style="margin-left: auto;">
						<text>总米数: {{item.confirmMeters}}</text>
						<text class="u-margin-left-20">总根数: {{item.confirmNumber}}</text>
					</view>
				</view>
				<view class="list_item_invoice">
					<view v-for="(record,record_index) in item.record" :key="record.id" class="item_record">
						<view><label class="detail-lable">规格</label>{{record.specs}}</view>
						<view><label class="detail-lable">根数</label>{{Number(record.confirmNumber)}}</view>
						<view><label class="detail-lable">实收米数</label>{{record.confirmMeters}}</view>
					</view>
				</view>
				<view v-show="item.returnDetails&&item.returnDetails.length>0">
					<view class="u-flex" style="font-weight: bold;padding: 15rpx 0rpx;">
						<view>退货</view>
						<view style="margin-left: auto;">
							<text>总米数: {{returnConfirmMeters(item)}}</text>
							<text class="u-margin-left-20">总根数: {{returnConfirmNumber(item)}}</text>
						</view>
					</view>
					<view class="list_item_invoice">
						<view v-for="(returnDetail,returnDetail_index) in item.returnDetails" :key="returnDetail_index" class="item_record">
							<view><label class="detail-lable">规格</label>{{returnDetail.specs}}</view>
							<view><label class="detail-lable">根数</label>{{Number(returnDetail.number)}}</view>
							<view><label class="detail-lable">退货米数</label>{{returnDetail.meters}}</view>
						</view>
					</view>
				</view>
				<view style="text-align: end;padding: 15px 0px;" v-if="item.receiptStatus===1">
					<u-button @click="save(item.id,item.batch)" size="mini" shape="circle" plain>确认无误</u-button>
				</view>
			</u-read-more>

		</view>
	</view>
</template>

<script>
	import {
		getShipList,
		saveReceiptConfirm
	} from '@/common/my.js'
	export default {
		data() {
			return {
				listQuery: {
					pageSize: 5,
					pageNum: 1,
					status: 0
				},
				total: 0,
				list: [],
				showEmpty: undefined
			};
		},
		filters: {
			receiptStatus(val) {
				switch (val) {
					case 0:
						return "确认中"
					case 1:
						return "待确认"
					case 2:
						return "已确认"
				}
			}
		},
		computed: {
			returnConfirmMeters() {
				return function(item) {
					return item.totalMeters - item.confirmMeters
				}
			},
			returnConfirmNumber() {
				return function(item) {
					return item.totalNumber - item.confirmNumber
				}
			}
		},
		onLoad() {
			this.getList()
		},
		methods: {
			getList() {
				uni.showLoading({
					title: '加载中'
				})
				getShipList(this.listQuery).then(res => {
					uni.hideLoading()
					this.total = res.info.total
					this.list = res.info.pageInfo
					this.showEmpty = this.list.length > 0 ? false : true
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
			 * @description 确认签收
			 * @param {Object} id  主键
			 */
			save(id, batch) {
				const _this = this
				uni.showModal({
					title: '提示',
					content: '确认无误',
					success: function(res) {
						if (res.confirm) {
							uni.showLoading({
								title: '确认中'
							})
							saveReceiptConfirm({
								id: id,
								batch: batch
							}).then(res => {
								uni.hideLoading()
								setTimeout(() => {
									_this.listQuery.pageNum = 1
									_this.getList()
								}, 500)
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		padding: 15px;
	}

	.list {
		background-color: white;
		padding: 15px;
		border-radius: 12px;
		margin-bottom: 10px;
	}

	.item-tag {
		float: right;
	}

	.list_item_invoice {
		padding: 5px 10px;
		background-color: #f8f8f8;
		// margin: 15px 0px;
		// border-radius: 6px;

		.item_record {
			padding: 10px 0px;
		}
	}

	.invoice_number {
		width: 15px;
		height: 15px;
		background-color: white;
		border-radius: 6px;
		text-align: center;
	}

	.comfirmMeter {
		// color: red;
		// font-size: 20px;
		// letter-spacing: 1px;
		// margin-left: 7px;
	}

	.confirmNumber {
		background-color: white;
		padding: 3px;
		border-radius: 6px;
		margin-left: auto;

		.comfirmNumber-label {
			margin-right: 1px;
		}
	}

	.detail-lable {
		display: inline-block;
		width: 60px;
		color: #a3a3a3;
		padding: 2px 0px;
	}

	label {
		color: #a3a3a3;
		margin-right: 5px;
	}
</style>
