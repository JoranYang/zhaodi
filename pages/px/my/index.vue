<template>
	<view class="siyuan">
		<view
			style="background-color:#1779FF;min-height: 400rpx;color: white;display: flex;align-items: center;justify-content: center;flex-direction: column;">
			<view>
				<u-avatar :src="avatar" size="135" />
			</view>
			<view>{{lastName}}</view>
			<view>积分:{{trainCredit}}</view>
		</view>
		<view style="color: black;">
			<u-cell-group>
				<u-cell-item :title="item.name" :title-style="titleStyle" v-for="(item, index) in gridList" :key="index"
					@click="goCellItem(item)">
					<u-icon slot="icon" size="50" custom-prefix="custom-icon" :name="item.icon"></u-icon>
					<u-badge :count="item.badgeCount" :is-dot="true" :absolute="false" slot="right-icon"></u-badge>
				</u-cell-item>
			</u-cell-group>
		</view>

		<wpf-update-version :updateVersionObject="updateApp" :showUpdateFlag="showUpdateFlag"
			v-on:clickName="updateVersion"></wpf-update-version>
		<view class="u-m-t-30 u-m-b-10"
			style="line-height: 100rpx;color: red;text-align: center;font-size: 32rpx;background-color: #FFFFFF;"
			@click="loginOut">
			退出登录
		</view>
		<u-toast ref="uToast" />
		<u-tabbar :list="menu" :mid-button="false" active-color="#1779FF"></u-tabbar>
	</view>
</template>

<script>
	import wpfUpdateVersion from '@/components/wpf-update-version.vue'
	import {
		getKey,
		queryUserCreditByUserId
	} from '@/common/my.js'
	export default {
		components: {
			wpfUpdateVersion
		},
		data() {
			return {
				titleStyle: {
					marginLeft: '10rpx',
					fontSize: '32rpx'
				},
				credit: 0,
				gridList: [{
					icon: 'zhishiwenda',
					name: '我的提问',
					url: '/pages/px/my/tw',
					badgeCount: 0
				}, {
					icon: 'jiaoyu',
					name: '我的贡献',
					url: '/pages/px/my/gx',
					badgeCount: 0
				}, {
					icon: 'shoucang2',
					name: '我的收藏',
					url: '/pages/px/my/sc',
					badgeCount: 0
				}],
				menu: uni.getStorageSync('menu'),
				avatar: uni.getStorageSync('avatar'), // 头像
				lastName: uni.getStorageSync('lastName'), //名字
				trainCredit: uni.getStorageSync('trainCredit'),
				showUpdateFlag: {
					flag: false
				},

				tokenValue: '',
				updateApp: {}
			}
		},
		onLoad() {
			this.getVersion()
			// this.queryUserCreditByUserIdOn()
		},
		methods: {
			/**
			 * @description: 根据用户ID查询学分
			 * @param {type}
			 * @return: 用户学分
			 * @author: yzb
			 */
			/* queryUserCreditByUserIdOn() {
				console.log("把分数的数据从其他界面传递过来")
				this.tokenValue = uni.getStorageSync('token');
				uni.request({
					url:'https://zhaodigroup.cn/admin/api/trainUserCredit/getTrainUserCreditByUserId',
					header:{
						'X-Token':this.tokenValue
					},
					success(res) {
						console.log("获取数据:",res.data)
						console.log("获取数据:",res.data.data.id)
						console.log("获取数据:",res.data.data.credit)
						this.trainScore = res.data.data.credit	
					}
				})

			}, */

			goCellItem(item) {
				if (item.url) {
					uni.navigateTo({
						url: item.url
					})
				}
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
			},
			/**
			 * @alias 退出登录
			 * @description 清除缓存信息 返回登录页
			 */
			loginOut() {

				const value = uni.getStorageSync('token');

				console.log("token:", value);
				uni.clearStorage()
				uni.switchTab({
					url: '../../index/index'
				})
			},
			/**
			 * 获取当前app版本号
			 * 检测是否需要更新app
			 */
			getVersion() {
				//#ifdef APP-PLUS
				this.gridList.push({
					icon: 'pilianggengxin',
					name: '检查更新',
					url: '',
					tabFlag: false,
					chengePassword: false,
					badgeCount: 0
				})
				const that = this
				that.version = plus.runtime.version

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
				//#endif
			},
			/**
			 * 更新大版本
			 */
			updateVersion() {
				this.showUpdateFlag.flag = false
				uni.downloadFile({
					url: this.updateApp.special1,
					success: (downloadResult) => {
						console.log(downloadResult)
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
					}
				});
			},
		}
	}
</script>

<style>
	page {
		background-color: #F7F9FB;
	}
</style>
