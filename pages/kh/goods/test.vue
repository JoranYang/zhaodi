<template>
	<view>
		<u-tabs :list="data" :is-scroll="false" :current="current" @change="handleTabChange" bg-color="#f7f9fb" class="tabs"
		 active-color="red" :bar-style="barStyle" inactive-color="#000"></u-tabs>
		<view class="page-box" :style="{marginBottom: (current===2?'50px':'0px')}">
			<!--  -->
			<!-- revokeStatus 0 撤销中 1 撤销成功 2 撤销失败 -->
			<view v-show="goodsList.length<=0" style="text-align: center;">
				<u-image mode="widthFix" src="/static/info/empty.png" style="transform: scale(0.6);"></u-image>
			</view>
			<view v-for="(item,index) in goodsList" :key="index" class="page-box-list">
				<u-read-more show-height="600" text-indent="0" close-text="展开详情" open-text="收起详情" :toggle="true">
					<view @click="goInfo(item)">
						<view class="u-padding-5 u-flex">
							<view v-if="current ===2" class="checkbox-border" @click.stop="checkboxItem(item,goodsList)" :style="item.checked?checkboxIconStyle:''">
								<u-icon v-if="item.checked" name="checkbox-mark" color="white"></u-icon>
							</view>
							<view class="project-list-name">{{ item.projectName }}</view>
							<u-tag v-if="item.status!=null && current!=2" class="item-tag" :text="item.status | status" :type="item.status | colorStatus"
							 size="mini" style="width: 65px;"/>
							<!-- <u-tag v-else class="item-tag" :text="item.receiptStatus | receiptStatus" :type="item.receiptStatus | colorStatus"
					 size="mini" /> -->
						</view>
						<view class="u-padding-5">
							<u-icon name="map" /><label>项目地址</label> {{item.xmdz?item.xmdz:'暂无'}}</view>
						<view class="u-padding-5">
							<u-icon name="calendar" /><label>发货日期</label> {{item.fhrq}}</view>
						<view class="u-padding-5" v-show="item.shipmentAppSingleNumber">
							<!--   shipmentApplicationNumber-->
							<u-icon name="calendar" /><label>申请单号</label> {{item.shipmentAppSingleNumber}}</view>
						<view class="u-padding-5">
							<!--   shipmentApplicationNumber-->
							<u-icon name="calendar" /><label>创建时间</label>
							{{$u.timeFormat(formatTime(item.ApplyOn?item.ApplyOn:item.createdOn), 'yyyy年mm月dd日 hh时MM分ss秒')  }}</view>
						<view style="text-align: end;" v-if="current ===1&& item.revokeStatus==null && item.status!=4">
							<u-button @click="cancleChange(item)" size="mini" shape="circle" plain>申请撤销</u-button>
						</view>
						<view v-if="(item.status===5|| item.status===6)&& item.docNos!=undefined">
							<view v-for="(iter, q) in item.docNos" :key="q" class="iter-list">
								<view class="docno u-flex">
									<view v-if="current ===2" class="checkbox-border" @click.stop="checkboxChange(iter,item)" :style="iter.checked?checkboxIconStyle:''">
										<u-icon v-if="iter.checked" name="checkbox-mark" color="white"></u-icon>
									</view>
									<view class="u-margin-left-5 u-font-10">送货单号 {{iter.docNo}}</view>
									<u-tag v-if="iter.status!=null" class="item-tag" :text="iter.status | sjStatus" :type="iter.status | colorStatus"
									 size="mini" />
								</view>
								<view class="item-car">
									<u-tag class="car-tag" :text="'车牌号 '+iter.numberPlate + ' | 总米数 '+sumShipMeter(iter.details)" mode="plain"
									 size="mini" type="error" />
								</view>
								<view v-for="(infoDetail,ind) in iter.details" :key="ind" class="details-list">
									<view><label class="detail-lable">规格</label>{{infoDetail.specs}}</view>
									<view><label class="detail-lable">根数</label>{{Number(infoDetail.number)}}</view>
									<view><label class="detail-lable">桩类型</label>{{infoDetail.productType?infoDetail.productType:'暂无'}}</view>
									<view><label class="detail-lable">发货米数</label>{{infoDetail.shipmentMeters}}</view>
								</view>
							</view>
						</view>
						<view v-show="current===1&&item.revokeAppRemark" class="item_content">
							撤销原因：{{item.revokeAppRemark}}
						</view>
						<view v-show="current===1&&item.revokeContent" class="item_content">
							驳回原因：{{unRichHtml(item.revokeContent)}}
						</view>
						<view v-show="current===0&&item.content" class="item_content">
							拒发原因：{{unRichHtml(item.content)}}
						</view>
						<u-line color="#f8f8f8" margin="10px" />
						<u-image v-if="current===1 && item.revokeStatus!=null" :src="showRevoke(item.revokeStatus)" class="show_revoke"></u-image>
						<u-image v-if="current===0 && item.status" src="/static/info/refuse.png" class="show_revoke"></u-image>
						<view style="color: #a3a3a3;">
							查看详情
						</view>
					</view>
				</u-read-more>
			</view>
			<view class="loadstatus"><label>{{loadStatus}}</label></view>
		</view>
		<view v-show="current == 2 && goodsList.length>0" class="fix-bottom u-flex u-padding-right-20 u-padding-left-20">
			<view v-if="current ===2" class="checkbox-border" @click.stop="checkboxTotal" :style="totalChecked?checkboxIconStyle:''">
				<u-icon v-if="totalChecked" name="checkbox-mark" color="white"></u-icon>
			</view>
			<view>全选</view>
			<view v-show="showPopup" class="u-flex">
				<view class="u-margin-left-20">合计</view>
				<view class="u-flex direct u-font-10">
					<view>根数 {{totalShipDocNos.num}}</view>
					<view>米数 {{totalShipDocNos.meters}}</view>
				</view>
			</view>
			<u-button shape="circle" :disabled='confirmingStatus' type="error" size="mini" class="u-margin-right-0" @click="confirmShip()">{{showPopup?'确认签收':'去确认'}}</u-button>
		</view>
		<u-popup v-model="showPopup" mode="bottom" :closeable="true" border-radius="20" height="70%">
			<view class="popup-title">签收明细</view>
			<view v-for="(item,index) in totalShipDocNos" :key="index">
				<view v-if="item" class="u-padding-30">
					<view class="u-flex u-margin-bottom-30">
						<view>项目名称</view>
						<view style="margin-left: auto;font-weight: bold;">{{item.projectName}}</view>
					</view>
					<view style="background-color: #f8f8f8;padding: 15px;border-radius: 6px;">
						<view v-for="(confirmQuantity,k) in item.confirmQuantity" :key="k" style="margin: 10px 0px;">
							<view>{{confirmQuantity.type}}</view>
							<view class="u-flex" style="padding: 10px 0px;">
								<view><label>米数</label><text class="comfirmMeter">{{confirmQuantity.meters}}</text></view>
								<view style="margin-left: auto;">
									<u-number-box v-model="confirmQuantity.num" :max="confirmQuantity.max" @change="numberBoxChange(confirmQuantity,$event)"></u-number-box>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		getShipList,
		getShipLogisticsSign
	} from '@/common/my.js'
	export default {
		data() {
			return {
				data: [{
					name: '拒发货',
					status: -2,
					pageNum: 1
				}, {
					name: '发货中',
					status: -1,
					pageNum: 1
				}, {
					name: '已发货',
					status: 1,
					pageNum: 1
				}],
				current: 0,
				swiperCurrent: 0,
				tabsHeight: 0,
				dx: 0,
				listQuery: {
					pageSize: 5,
					pageNum: 1,
					status: null
				},
				/**
				 * 我的货物列表
				 */
				goodsList: [],
				/**
				 * 总数
				 */
				totalList: [],
				goodsListConStatus: [],
				/**
				 * @description 监听列表加载状态
				 */
				showLoad: false,
				/**
				 * @description 监听下拉加载状态
				 */
				showLoadBottom: false,
				/**
				 * @description 监听各个状态的pageNum
				 */
				pageNumList: {},
				showPopup: false,
				totalShipDetail: [], //选择之后存放在收货明细中
				barStyle: {
					color: 'red',
					borderRadius: '12px'
				},
				confirmQuantity: [],
				totalShipDocNos: [], //一个单号的全选
				checkboxIconStyle: {
					backgroundColor: '#2979ff',
					borderColor: '#2979ff'
				},
				totalChecked: false, //全选状态
				totalShip: [], //全选
				modalShow: false,
				total: 0,
				loadStatus: undefined,
				confirmingStatus: true // 禁用按钮状态
			}
		},
		filters: {
			sjStatus(val) {
				switch (val) {
					case '01':
						return "运输中"
					case '02':
						return "已送达"
				}
			},
			status(val) {
				switch (val) {
					case 0:
					case 1:
						return "待审核"
					case 2:
						return "拒发货"
					case 3:
					case 4:
						return "待发货"
					case 5:
					case 6:
						return "运输中"
					case 7:
						return "待签收"
					case 8:
						return "已签收"
				}
			},
			colorStatus(val) {
				switch (val) {
					case 0:
					case 1:
						return "info"
					case 2:
						return "error"
					case 3:
					case 4:
						return "info"
					case 5:
					case 6:
						return "warning"
					case 7:
						return "primary"
					case 8:
						return "success"
				}
			},
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
		watch: {
			goodsList: {
				handler(val) {
					let checkedObject = {}
					for (const item of val) {
						if (item.docNos) {
							for (const docNo of item.docNos) {
								checkedObject[docNo.checked] = 1
							}
						}
					}
					if (Object.keys(checkedObject).length === 1 && Object.keys(checkedObject)[0] === 'false') {
						this.confirmingStatus = true // 监听勾选的变化 动态修改 按钮是否禁用状态 
					} else {
						this.confirmingStatus = false
					}
				},
				deep: true //true 深度监听
			}
		},
		onLoad(options) {
			this.listQuery.status = this.data[options.current].status
			this.current = Number(options.current)
			this.queryShipList()
		},
		methods: {
			/**
			 * 切换tab
			 * @param {Object} index tabs 下标
			 */
			handleTabChange(index) {
				this.listQuery.pageNum = 1 //页码初始化
				this.goodsList = [] // list初始化
				this.current = index
				this.listQuery.status = this.data[index].status // 同步修改切换的状态值
				this.loadstatus = undefined //清除加载更多的样式
				this.queryShipList() // 修改状态 重新请求
			},
			/**
			 * 获取我的货物列表
			 */
			queryShipList() {
				uni.showLoading({
					title: '努力加载中'
				})
				getShipList(this.listQuery).then(res => {
					setTimeout(() => {
						if (res.result) {
							uni.hideLoading()
							this.total = res.info.total
							let goods = res.info.pageInfo
							// 为了方便全选 在已发货状态下 添加选择表示 checked 属性 初始值为false 
							if (this.listQuery.status === 1 && goods) {
								for (const item of goods) {
									item.checked = false
									for (const info of item.docNos) {
										info.checked = false
									}
								}
							}
							this.goodsList = [...this.goodsList, ...goods] // 将下一页的值 合并在同一个数组中
						} else {
							uni.showToast({
								title: '系统异常',
								icon: 'none'
							})
						}

					}, 100)

				})
			},
			/**
			 * 跳转发货申请详请页面
			 * @param {Object} item
			 */
			goInfo(item) {
				const pages = getCurrentPages();
				const curPage = pages[pages.length - 1];
				const options = curPage.options
				options.current = this.current
				uni.navigateTo({
					url: './info?id=' + item.id + '&content=' + item.content
				})
			},
			/**
			 * @description 跳转物流明细
			 * @param {Object} shipmentApplicationNumber
			 */
			goLogistics(shipmentApplicationNumber) {
				const pages = getCurrentPages();
				const curPage = pages[pages.length - 1];
				const options = curPage.options
				options.current = this.current
				uni.navigateTo({
					url: './logistics?id=' + shipmentApplicationNumber
				})
			},
			onReachBottom() {
				const _this = this
				_this.listQuery.pageNum++
				const totalPage = Math.ceil(_this.total / _this.listQuery.pageSize)
				if (totalPage >= _this.listQuery.pageNum) {
					_this.queryShipList()
				} else {
					_this.loadStatus = '没有更多了'
				}
			},
			/**
			 * 下拉刷新数据
			 */
			onPullDownRefresh() {
				this.listQuery.pageNum = 1
				this.goodsList = []
				this.queryShipList()
				uni.stopPullDownRefresh()
			},
			// 合并车牌号
			detailsGroup(val) {
				let object = {}
				let numberPlateList = []
				for (const item of val) {
					object[item.numberPlate] = 1
				}
				const r = Object.keys(object).join('、') + '正在运输中...'
				numberPlateList.push(r)
				return numberPlateList
			},
			//计算总米数
			sumShipMeter(details) {
				let meter = 0
				for (const item of details) {
					meter = item.shipmentMeters + meter
				}
				return meter
			},
			// 如果选中 则push 否则 则 remove  
			/**
			 * 选择发货单
			 * @param {Object} item 发货单
			 * @param {Object} topItem 发货申请
			 */
			checkboxChange(item, topItem) {
				item.checked = this.checkboxUtil(item.checked)
				let isCheckAll = true
				for (const docNo of topItem.docNos) {
					isCheckAll = isCheckAll && docNo.checked
					if (!isCheckAll)
						break
				}
				topItem.checked = isCheckAll
				let pageInfoDoc = this.goodsList
				let totalCheckedStatusObject = {} // 存放发货单的全选标识
				for (const item of pageInfoDoc) {
					item.totalChecked = item.checked && topItem.checked
					totalCheckedStatusObject[item.totalChecked] = "判断是否是全选标识"
				}
				this.totalChecked = Object.keys(totalCheckedStatusObject).length === 1 && Object.keys(totalCheckedStatusObject)[0] ===
					'true' ? true : false //根据选择的标识判断是否改变全选的状态
			},
			//一个单号的全选
			/**
			 * 选择发货申请
			 * @param {Object} item 发货申请
			 */
			checkboxItem(item, topItem) {
				item.checked = this.checkboxUtil(item.checked)
				for (const info of item.docNos) {
					info.checked = item.checked
				}
				if (!item.checked) {
					this.totalChecked = item.checked
				} else {
					let isCheckAll = true
					for (const info of topItem) {
						isCheckAll = info.checked && isCheckAll
						if (!isCheckAll)
							break
					}
					this.totalChecked = isCheckAll
				}
			},
			checkboxUtil(checked) {
				return checked ? false : true
			},
			//全选
			checkboxTotal() {
				this.showPopup = false //关闭弹框 
				this.totalChecked = this.checkboxUtil(this.totalChecked)
				this.confirmingStatus = !this.totalChecked // 修改是否启用去签收按钮
				this.totalShip = this.goodsList
				// 当点击全选按钮时 同步子节点下的checked状态
				for (const item of this.totalShip) {
					item.checked = this.totalChecked
					for (const info of item.docNos) {
						info.checked = this.totalChecked
					}
				}
			},
			//确认收货
			confirmShip() {
				if (this.showPopup) {
					const _this = this
					this.showPopup = false
					uni.showLoading({
						title: '正在签收中'
					})
					getShipLogisticsSign({
						data: this.totalShipDocNos
					}).then(res => {
						try {
							setTimeout(() => {
								uni.hideLoading()
								if (res.result) {
									uni.showToast({
										title: '签收成功',
										icon: 'success'
									})
									_this.listQuery.pageNum = 1
									_this.goodsList = []
									setTimeout(() => {
										_this.queryShipList()
									}, 500)

								} else {
									uni.showToast({
										title: '签收失败',
										icon: 'none'
									})
								}
							}, 500)
						} catch (e) {
							console.log('aaaa',e)
						}

					})
				} else {
					this.showPopup = true

					this.totalShipDocNos = JSON.parse(JSON.stringify(this.goodsList))

					for (const item of this.totalShipDocNos) {
						for (const i in item.docNos) {
							if (!item.docNos[i].checked) {
								delete item.docNos[i] // 删除未选中的明细内容
							}
						}
						item.docNos = item.docNos.filter(function(s) {
							if (s) {
								return s
							}
						});
					}

					let shipAppMap = {} // 发货申请单号为key内容为规格确认数量列表
					for (let i in this.totalShipDocNos) {
						let specsMap
						if (shipAppMap[this.totalShipDocNos[i].projectId]) { // 有值
							specsMap = shipAppMap[this.totalShipDocNos[i].projectId]
							this.totalShipDocNos[i].confirmQuantity = specsMap
						} else { // 没有值
							specsMap = {}
							shipAppMap[this.totalShipDocNos[i].projectId] = specsMap
							this.totalShipDocNos[i].confirmQuantity = shipAppMap[this.totalShipDocNos[i].projectId]
						}
						if (this.totalShipDocNos[i].docNos.length <= 0) {
							delete this.totalShipDocNos[i]
						} else {
							for (let docNo of this.totalShipDocNos[i].docNos) {
								let confirmQuantityArray = []
								for (let detail of docNo.details) {
									let specs
									if (specsMap[detail.specs]) { // 有规格
										specs = specsMap[detail.specs]
									} else { // 没有规格
										specs = {}
										specs.type = detail.specs
										specs.len = detail.specs.split("-")[detail.specs.split("-").length - 1]
										specs.num = 0
										specs.meters = 0
										specsMap[detail.specs] = specs
									}
									specs.num += Number(detail.number)
									specs.meters += detail.shipmentMeters
									specs.max = specs.num //计步器 最大值 取 根数
								}
							}
						}
					}
					console.log(this.totalShipDocNos)
					let da = {}
					for (const item of this.totalShipDocNos) {
						if (item && item.docNos != null && item.docNos != undefined && item.docNos.length > 0) {
							var projectObject
							if (da[item.projectId]) {
								projectObject = da[item.projectId]
								projectObject.docNos = [...projectObject.docNos, ...item.docNos]
							} else {
								da[item.projectId] = JSON.parse(JSON.stringify(item))
							}
						}
					}
					this.totalShipDocNos = Object.values(da) //获取对象当中的values值
				}
			},
			/**
			 * 修改根数 重新计算米数
			 * @param {Object} item 子项（包含根数、米数）
			 * @param {Object} e 修改的根数
			 */
			numberBoxChange(item, e) {
				item.meters = Number(item.len) * e.value
				this.$forceUpdate(); //强制刷新
				this.totalShipDocNos.num = 0
				this.totalShipDocNos.meters = 0

				// 统计根数和米数
				for (const item of this.totalShipDocNos) {
					item.num = 0
					item.meters = 0
					for (const confirmQuantity of Object.values(item.confirmQuantity)) {
						item.num = confirmQuantity.num + item.num
						item.meters = confirmQuantity.meters + item.meters
					}
					this.totalShipDocNos.num = item.num + this.totalShipDocNos.num //统计选择的总根数                            
					this.totalShipDocNos.meters = item.meters + this.totalShipDocNos.meters //统计选择的总米数
				}
			},
			/**
			 * 撤销
			 * @param {Object} item 主体
			 */
			cancleChange(item) {
				uni.navigateTo({
					url: './revoke?item=' + JSON.stringify(item)
				})
			},
			showRevoke(status) {
				switch (status) {
					case 0:
						return "/static/info/revokeing.png"
					case 1:
						return "/static/info/unrevoke.png"
					case 2:
						return "/static/info/revoked.png"
				}
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
			 * 去除富文本信息
			 * @param {Object} content 富文本内容
			 */
			unRichHtml(content) {
				if (content) {
					const reg = /<[^<>]+>/g //去除标签 留下文本值
					return content.replace(reg, '')
				}
			}
		}
	}
</script>

<style>
	/* #ifndef H5 */
	page {
		height: 100%;
		background-color: #F7F9FB;
	}

	/* #endif */
</style>

<style lang="scss" scoped>
	.wrap {
		display: flex;
		flex-direction: column;
		height: calc(100vh - var(--window-top));
		width: 100%;
		letter-spacing: 1px;
	}

	.swiper-box {
		flex: 1;
	}

	.swiper-item {
		height: 100%;
	}

	.zd-loading-bottom {
		position: absolute;
		left: 0;
		right: 0;
		margin: 5px auto;
	}


	.u-tabs-box {
		box-shadow: 0px 7px 15px -14px #a3a3a3;
		z-index: 2;
	}

	.swiper-scroll {
		height: 100%;
		width: 100%;
	}

	.page-box-list {
		background-color: #ffffff;
		border-radius: 12rpx;
		margin: 20rpx 20rpx 0rpx;
		position: relative;
		padding: 20px 15px;
	}

	.item-tag {
		// width: 60px;
		text-align: center;
		margin-left: auto;
	}

	label {
		color: #a3a3a3;
		margin-right: 5px;
	}

	.item-car {
		margin: 5px 0px;
	}

	.item-detail-car {
		width: 100%;
		line-height: 70rpx;
		background-color: #f8f8f8;
		border-radius: 12rpx;
		padding: 0rpx 20rpx;
		font-size: $uni-font-size-base;
	}

	/deep/ .u-notice-bar-wrap {
		margin-top: 10px;
	}

	.iter-list {
		background-color: #f8f8f8;
		padding: 15px;
		margin: 10px 0px;
		border-radius: 6px;
		font-size: 10px;
	}

	.details-list {
		background-color: white;
		padding: 10px 15px;
		border-radius: 6px;
		margin: 5px 0px;
		font-size: 10px;
	}

	.detail-lable {
		display: inline-block;
		width: 60px;
		color: #a3a3a3;
		padding: 2px 0px;
	}

	/deep/ .u-checkbox__label {
		margin-left: 10px;
	}

	.checkbox-border {
		border: 1px solid #c8c9cc;
		width: 17px;
		height: 17px;
		border-radius: 3px;
		margin-right: 5px;
	}

	.project-list-name {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		width: calc(100% - 48px);
	}


	.fix-bottom {
		position: fixed;
		bottom: 0px;
		height: 55px;
		background-color: white;
		right: 0;
		left: 0;
		z-index: 99999;
	}

	.popup-title {
		text-align: center;
		padding: 10px;
		font-weight: bold;
		font-size: 20px;
	}

	/deep/ .u-checkbox {
		align-items: baseline;
		display: -webkit-inline-box;
		line-height: 1.5;
	}

	.tabs {
		margin: 15px 0px 20px;
		padding: 0px 20px;
	}

	/deep/ .u-tabs-item {
		color: black !important;
		letter-spacing: 1px;
	}

	.comfirmMeter {
		color: red;
		font-size: 20px;
		letter-spacing: 1px;
		margin-left: 7px;
	}

	.add-mask {
		filter: brightness(75%);

		&::after {
			content: '撤销中';
			font-size: 45px;
			color: red;
			text-align: center;
			position: fixed;
			top: 30%;
			bottom: 0;
			left: 0;
			right: 0;
		}
	}

	.add-mask-1 {
		filter: brightness(75%);

		&::after {
			content: '已撤销';
			font-size: 45px;
			color: red;
			text-align: center;
			position: fixed;
			top: 30%;
			bottom: 0;
			left: 0;
			right: 0;
		}
	}

	.direct {
		flex-direction: column;
	}

	.loadstatus {
		text-align: center;
		padding: 10px 0px;
	}

	.tabs {
		margin: 15px 0px 20px;
		padding: 0px 20px;
	}

	/deep/ .u-tab-item {
		color: black !important;
		letter-spacing: 1px;
	}

	.show_revoke {
		position: absolute;
		width: 50px !important;
		height: 50px !important;
		right: 15px;
		bottom: 15px;
	}

	.item_content {
		line-height: 30px;
		min-height: 30px;
		background-color: #f8f8f8;
		border-radius: 6px;
		margin-top: 6px;
		padding-left: 10px;
		word-break: keep-all;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.checkbox-border {
		justify-content: center;
		align-items: center;
		display: flex;
	}
</style>
