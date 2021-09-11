<template>
	<view class="wrap">
		<view style="width: 100%;height:300upx;background-color: #1779FF;" class="siyuan">
			<view style="display: flex;align-items: center;padding-top: 176rpx;padding-left: 72rpx;padding-top:76upx">
				<!-- <u-lazy-load :image="avatar" :loading-img="loadingImg" :error-img="errorImg"></u-lazy-load> -->
				<u-avatar :src="avatar" size="135" />
				<view class="u-flex" style="flex-direction: column;align-items: flex-start;">
					<view class="lastName">{{lastName}}</view>
					<view style="display: flex;" class="u-margin-top-15" @click="goEdit">
						<u-image src="/static/my/edit.png" mode="widthFix" style="width: 35rpx;height: 35rpx;margin-left: 10rpx;"></u-image><label
						 class="u-margin-left-15" style="color: white;">编辑</label>
					</view>
				</view>
			</view>
		</view>
		<view style="background-color: #ffffff;">
			<view style="display: flex;padding: 30rpx 40rpx;">
				<view style="font-size: 32rpx;" class="siyuan">我的货物</view>
				<view style="margin-left: auto;font-size: 28rpx;color: #7D7D7D;" class="siyuan">
					<navigator url="/pages/kh/goods/test?current=0">查看全部</navigator>
				</view>
			</view>
			<u-grid :col="goodsGrid.length" :border="false" style="padding: 0px 20px 15px 20px;">
				<u-grid-item v-for="(item,index) in goodsGrid" :key="index">
					<navigator :url="item.url" hover-class="navigator-hover">
						<u-badge :count="item.num" size="mini" style="z-index: 999;"></u-badge>
						<u-image :src="item.icon" mode="widthFix" style="width: 65%;margin:0 auto"></u-image>
						<view class="grid-text">{{item.name}}</view>
					</navigator>
				</u-grid-item>
			</u-grid>
		</view>

		<view class="u-m-t-30 siyuan" style="color: black;">
			<u-cell-group>
				<u-cell-item v-if="item.chengePassword!=true" :title="item.name" :title-style="titleStyle" v-for="(item, index) in gridList"
				 :key="index" @click="goCellItem(item)">
					<u-icon slot="icon" size="50" custom-prefix="custom-icon" :name="item.icon"></u-icon>
					<u-badge :count="item.badgeCount" :is-dot="true" :absolute="false" slot="right-icon"></u-badge>
				</u-cell-item>
			</u-cell-group>
		</view>

		<wpf-update-version :updateVersionObject="updateApp" :showUpdateFlag="showUpdateFlag" v-on:clickName="updateVersion"></wpf-update-version>
		<view class="u-m-t-30 u-m-b-10 siyuan" style="line-height: 100rpx;color: red;text-align: center;font-size: 32rpx;background-color: #FFFFFF;"
		 @click="loginOut">
			退出登录
		</view>
		<!-- #ifdef APP-PLUS -->
		<view class="version">
			当前版本号:{{version}}
		</view>
		<!-- #endif -->

		<u-toast ref="uToast" />
		<u-tabbar :list="menu" :mid-button="false"></u-tabbar>
	</view>
</template>

<script>
	import {
		getShipLogisticsStatus,
		getShipCount
	} from '@/common/my.js'
	import wpfUpdateVersion from '@/components/wpf-update-version.vue'
	export default {
		components: {
			wpfUpdateVersion
		},
		data() {
			return {
				progress: 0,
				titleStyle: {
					marginLeft: '10rpx',
					fontSize: '32rpx'
				},
				title: '我的货物',
				goodsGrid: [{
					icon: '/static/my/jujue.png',
					name: '拒发货',
					url: '/pages/kh/goods/test?current=0',
					num: 0
				}, {
					icon: '/static/my/send.png',
					name: '发货中',
					url: '/pages/kh/goods/test?current=1',
					num: 0
				}, {
					icon: '/static/my/vipcard.png',
					name: '已发货',
					url: '/pages/kh/goods/test?current=2',
					num: 0
				}, {
					icon: '/static/my/received.png',
					name: '已签收',
					url: '/pages/kh/goods/receipt',
					num: 0
				}],
				gridList: [{
						icon: 'fahuo',
						name: '申请发货',
						url: '/pages/kh/project/apply',
						tabFlag: false,
						chengePassword: false,
						badgeCount: 0
					}, {
						icon: 'xiangmu',
						name: '我的项目',
						url: '/pages/kh/project/index',
						tabFlag: true,
						chengePassword: false,
						badgeCount: 0
					}, {
						icon: 'zhangdanliushui',
						name: '我的售后',
						url: '/pages/kh/goods/afterSale',
						tabFlag: false,
						chengePassword: false,
						badgeCount: 0
					},
					{
						icon: 'pilianggengxin',
						name: '检查更新',
						url: '',
						tabFlag: false,
						chengePassword: false,
						badgeCount: 0
					}
				],
				/**
				 * , {
					icon: 'zhangdanliushui',
					name: '我的账单',
					url: '/pages/kh/reconciliation/index',
					tabFlag: true
				}, 
				 */
				/**
				 * 物流信息
				 */
				logisticInfo: {},
				menu: uni.getStorageSync('menu'),
				lastName: '',
				// avatar: uni.getStorageSync('avatar'),
				loadingImg: '/static/info/empty.png',
				errorImg: '/static/info/empty.png',
				updateApp: {},
				showUpdateFlag: {
					flag: false
				},
				version: '', //版本号
			}
		},
		filters: {
			shipmentApplicationOrderStatus(val) {
				switch (val) {
					case '01':
						return "运输中"
					case '02':
						return "待签收"
					default:
						return "已签收"
				}
			}
		},
		onLoad() {
			//#ifdef APP-PLUS
			this.getVersion()
			//#endif
		},
		onShow: function() {
			this.getLogisticsInfo()
			this.getCount()
			this.avatar = uni.getStorageSync('avatar')
			this.gridList[0].chengePassword = uni.getStorageSync('chengePassword')
			this.lastName = uni.getStorageSync('lastName')
		},
		methods: {
			/**
			 * 获取当前app版本号
			 * 检测是否需要更新app
			 */
			getVersion() {
				
				// this.gridList.push()
				const that = this
				that.version = this.$version

				that.$common.getVersionDictory({
					'category': 'app_version',
					'status': 1
				}).then(res => {
					console.log(res)
					that.updateApp = res.info[0]
					if (that.updateApp.interpretation.substring(0, 1) > that.version.substring(0, 1)) {
						if (that.updateApp.special1) {
							that.gridList[3].badgeCount = 1
						}
					}
				})
				
			},

			/**
			 * @description 获取运输中和待签收数量
			 */
			getCount() {
				getShipCount().then(res => {
					this.goodsGrid[0].num = res.info.unPassCount
					this.goodsGrid[1].num = res.info.beShippedCount
					this.goodsGrid[2].num = res.info.transportCount
					this.goodsGrid[3].num = res.info.arriveCount
				})
			},
			/**
			 * 跳转用户信息编辑页面
			 */
			goEdit() {
				uni.navigateTo({
					url: './edit'
				})
			},
			goCellItem(item) {
				if (item.url) {
					if (item.tabFlag) {
						uni.switchTab({
							url: item.url
						})
					} else {
						uni.navigateTo({
							url: item.url
						})
					}
				} else {
					if (item.badgeCount === 1) {
						const that = this
						// 检查网络
						uni.getNetworkType({
							success: function(res) {
								if (res.networkType != 'wifi') {
									that.$refs.uToast.show({
										title: `检测到您的网络当前处于${res.networkType}状态`,
										position: 'bottom',
										icon: false
									})
								}
							}
						});
						that.showUpdateFlag.flag = true
					} else {
						this.$refs.uToast.show({
							title: '当前版本已是最新版',
							position: 'bottom',
							icon: false
						})
					}
				}



			},
			/**
			 * 更新大版本
			 */
			updateVersion() {
				console.log('我来了')
				console.log(this.updateApp)
				this.showUpdateFlag.flag = false
				let downloadTask = uni.downloadFile({
					url: this.updateApp.special1,
					success: (downloadResult) => {
						if (downloadResult.statusCode === 200) {
							plus.runtime.install(downloadResult.tempFilePath, {
								force: false
							}, function() {
								console.log('install success...');
								plus.runtime.restart(); //重启APP
							}, function(e) {
								alert(e)
								console.error('install fail...', e);
							});
						}
					},
					complete(e) {
						console.info(e)
					},
					fail(e) {
						console.error(e)
					}
				});
			},
			/**
			 * 获取最新物流信息
			 */
			getLogisticsInfo() {
				getShipLogisticsStatus().then(res => {
					if (res.result) {
						this.logisticInfo = res.info
						if (this.logisticInfo.deliveryDate) {
							this.logisticInfo.deliveryDate = this.formateDate(this.logisticInfo.deliveryDate)
						}
					}
				})
			},
			/**
			 * 监听查看最新物流详请
			 */
			goNewLogisticInfo(shipmentApplicationNumber) {
				uni.navigateTo({
					url: '../goods/logistics?id=' + shipmentApplicationNumber
				})
			},
			/**
			 * 退出登录
			 */
			loginOut() {
				// 由于账号密码不需要清除
				// 因此 在清除本地存储信息之前 保存一份
				const acount = uni.getStorageSync('acount')
				const acountCopy =JSON.parse(JSON.stringify(acount)) // 复制一份
				//清除全部存储信息
				uni.clearStorage()
				uni.setStorageSync('acount', acountCopy)
				uni.switchTab({
					url: '../../index/index'
				},1500)
			},
			//转换时间格式
			formateDate(datetime) {
				function addDateZero(num) {
					return (num < 10 ? "0" + num : num);
				}
				let d = new Date(datetime);
				let formatdatetime = d.getFullYear() + '-' + addDateZero(d.getMonth() + 1) + '-' + addDateZero(d.getDate())
				return formatdatetime;
			}
		},
	}
</script>

<style scoped lang="scss">
	page {
		background-color: #F7F9FB;
	}

	.u-cell {
		color: black;
	}

	.wpf-wl {
		height: 210rpx;
		background-color: white;
		margin: 0 20px;
		left: 0;
		right: 0;
		border-radius: 24rpx;
		position: absolute;
		top: 368rpx;
	}

	.lastName {
		color: white;
		margin-left: 9px;
		font-size: 15px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		width: calc(100% - 100px);
		min-width: 150px;
	}

	.version {
		position: fixed;
		bottom: 70px;
		text-align: center;
		width: 100%;
	}
</style>
