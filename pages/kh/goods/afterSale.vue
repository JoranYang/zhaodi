<template>
	<view>
		<u-navbar title-color="black" back-icon-color="black" title="售后" :background="background">
			<view class="slot-wrap">
				<view class="navbar-right">
					<view class="dot-box right-item">
						<text @click="goPile" style="color: black;">申请售后</text>
					</view>
				</view>
			</view>
		</u-navbar>
		<u-tabs :list="data" :is-scroll="false" :current="current" @change="handleTabChange" bg-color="#f7f9fb" class="tabs"
		 active-color="red" :bar-style="barStyle" inactive-color="#000"></u-tabs>
		<view v-show="list.length<=0" style="text-align: center;">
			<u-image mode="widthFix" src="/static/info/empty.png" style="transform: scale(0.6);"></u-image>
		</view>
		<!-- @click="goInfo(item)" -->
		<u-icon v-if="list.length>0" @tap="goScreen" :color="(listQuery.startDate || listQuery.endDate) ? 'red':''" name="shaixuan" custom-prefix="custom-icon" size="38" class="shaixuan"></u-icon>
		<view v-for="(item,index) in list" :key="index" class="page-box-list">
			<view class="u-flex">
				<label>申请单号:</label> {{item.orderNo}}
				<u-tag class="item-tag" :text="item.status | status" :type="item.status | colorType" size="mini" />
			</view>
			<view>申请日期:{{$u.timeFormat(formatTime(item.CreatedOn), 'yyyy年mm月dd日 hh时MM分ss秒')}}</view>
			<view>
				<label v-show="current === 0">退桩米数:</label>
				<label v-show="current === 1">爆桩米数:</label>
				<label v-show="current === 2">损桩米数:</label>
				{{item.totalMeters}}</view>
			<view>原因:{{item.reason}}</view>
			<view>备注:{{item.remarks}}</view>
			<view class="u-flex" style="font-weight: bold;padding: 15rpx 0rpx;">
				<view>退货</view>
				<view style="margin-left: auto;" v-show="item.status===1 || item.status===2">
					<text>确认总根数:{{item.confirmNumber}}</text>
					<text class="u-margin-left-20">确认总米数:{{item.confirmMeters}}</text>
				</view>
				<view style="margin-left: auto;" v-show="item.status===0 || item.status===3">
					<text>申请总根数:{{item.totalNumber}}</text>
					<text class="u-margin-left-20">申请总米数:{{item.totalMeters}}</text>
				</view>
			</view>
			<view class="list_item_invoice">
				<view v-for="(detail,detail_index) in item.details" :key="detail_index" class="item_record">
					<view class="u-padding-bottom-10"><label class="detail-lable">产品型号</label>{{detail.specs}}</view>
					<view>
						<u-row gutter="1">
							<u-col span="5">
								<label class="detail-lable">申请根数</label>{{Number(detail.appNumber)}}
							</u-col>
							<u-col span="5">
								<label class="detail-lable">申请米数</label>{{Number(detail.appMeters)}}
							</u-col>

						</u-row>
					</view>
					<view v-show="item.status ===1 || item.status ===2">
						<u-row gutter="1">
							<u-col span="5">
								<label class="detail-lable">确认根数</label>{{detail.number}}
							</u-col>
							<u-col span="5">
								<label class="detail-lable">确认米数</label>{{detail.meters}}
							</u-col>
						</u-row>
					</view>
				</view>
			</view>
			<view style="text-align: end;padding: 15px 0px;">
				<u-button v-show="item.status===1" @click="save(item.id,item.batch)" size="mini" shape="circle" plain>确认</u-button>
				<u-button v-show="item.status===0" @click="undoSave(item.id)" size="mini" shape="circle" plain class='u-margin-left-20'>撤销</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getSaleList,
		saveShipAppConfirm,
		undoReturn,
		getShipList
	} from '@/common/my.js'
	export default {
		data() {
			return {
				listQuery: {
					pageSize: 5,
					pageNum: 1,
					type: 0
				},
				list: [],
				data: [{
					name: '退桩',
					status: 0,
					pageNum: 1
				}, {
					name: '爆桩',
					status: 2,
					pageNum: 1
				}, {
					name: '损桩',
					status: 3,
					pageNum: 1
				}],
				barStyle: {
					color: 'red',
					borderRadius: '12px'
				},
				background: {
					backgroundColor: '#fff'
				},
				current: 0,
				total: 0
			};
		},
		filters: {
			colorType(val) {
				switch (val) {
					case 0:
						return "info"
					case 2:
						return "error"
					case 3:
						return "warning"
				}
			},
			status(val) {
				switch (val) {
					case 0:
						return "确认中"
					case 1:
						return "待确认"
					case 2:
						return "已确认"
					case 3:
						return "已撤销"
				}
			}
		},
		onLoad(options) {
			// console.log(this.listQuery)
			this.listQuery.status = 0
			getShipList(this.listQuery).then(res => {
				console.log('res=>', res.info)
			})
		},
		onShow() {
			console.log(this.listQuery)
			this.listQuery.pageNum = 1 //页码初始化
			this.list = [] // list初始化
			this.getList()
		},
		methods: {
			getList() {
				getSaleList(this.listQuery).then(res => {
					let page = res.info.pageInfo
					this.list = [...this.list, ...page] // 将下一页的值 合并在同一个数组中
					this.total = res.info.total
				})
			},
			handleTabChange(index) {
				this.listQuery.pageNum = 1 //页码初始化
				this.list = [] // list初始化
				this.current = index
				this.listQuery.type = this.data[index].status // 同步修改切换的状态值
				this.getList()
			},
			/**
			 * 时间格式化
			 * @param {Object} time 申请时间
			 */
			formatTime(time) {
				const t = new Date(time)
				return t.getTime()
			},
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
							saveShipAppConfirm({
								id: id,
								batch: batch
							}).then(res => {
								uni.hideLoading()
								setTimeout(() => {
									_this.listQuery.pageNum = 1
									_this.list = [] // list初始化
									_this.getList()
								}, 500)
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
			},
			undoSave(id) {
				const _this = this
				uni.showLoading({
					title: '撤销中'
				})
				undoReturn({
					id: id
				}).then(res => {
					uni.hideLoading()

					uni.showToast({
						title: '撤销成功',
						icon: 'success'
					})
					setTimeout(() => {
						_this.listQuery.pageNum = 1
						_this.list = [] // list初始化
						_this.getList()
					}, 500)
				})
			},
			onReachBottom() {
				const _this = this
				_this.listQuery.pageNum++
				const totalPage = Math.ceil(_this.total / _this.listQuery.pageSize)
				if (totalPage >= _this.listQuery.pageNum) {
					_this.getList()
				} else {
					_this.loadStatus = '没有更多了'
				}
			},
			goPile() {
				uni.navigateTo({
					url: './pile'
				})
			},
			goInfo(item) {
				uni.navigateTo({
					url: './pileInfo?item=' + JSON.stringify(item)
				})
			},
			goScreen() {
				delete this.listQuery.startDate
				delete this.listQuery.endDate
				uni.navigateTo({
					url: 'screen'
				})
			}
		}
	}
</script>

<style lang="scss">
	.page-box-list {
		background-color: white;
		border-radius: 5px;
		margin: 9px 9px 0px;
		padding: 20px 15px;

		.project-list-name {
			font-weight: bold;
		}

		.item-list {
			background-color: #f7f7f8;
			padding: 10px;
			margin-top: 5px;
			border-radius: 6px;
		}

		.item-title {
			padding-bottom: 5px;
		}

		.detail-lable {
			display: inline-block;
			width: 60px;
			color: #a3a3a3;
		}

		.tabs {
			margin: 15px 0px 20px;
			padding: 0px 20px;
		}
	}

	.item-tag {
		margin-left: auto;
	}

	.slot-wrap {
		display: flex;
		align-items: center;
		/* 如果您想让slot内容占满整个导航栏的宽度 */
		flex: 1;
		/* 如果您想让slot内容与导航栏左右有空隙 */
		/* padding: 0 30rpx; */
	}

	.navbar-right {
		margin-right: 24rpx;
		display: flex;
		margin-left: auto;
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

	.search-wrap {
		width: calc(100% - 80px);
	}

	.shaixuan {
		display: inline-block;
		text-align: right;
		width: 100%;
		padding-right: 5px;
	}
</style>
