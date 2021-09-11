<template>
	<view class="wrap">
		<!-- #ifdef H5 -->
		<view class="app-down">
			<a class="download" style="color: white;text-decoration:none;" href="https://zhaodigroup.cn/download/兆弟集团.apk">下载APP</a>
		</view>
		<!-- #endif -->
		<view>
			<u-swiper :list="list" class="u-margin-top-30 u-margin-bottom-30" @click="handleBannar"></u-swiper>

			<u-grid :col="4" :border="false" class="u-margin-bottom-30">
				<u-grid-item v-for="(item,index) in gradList" :key="index">
					<navigator :url="item.url+'?type='+item.type" class="gradList">
						<view class="item-bg-icon">
							<u-image :src="item.icon" width="50" height="50"></u-image>
						</view>
						<view class="grid-text u-margin-15">{{item.name}}</view>
					</navigator>
				</u-grid-item>
			</u-grid>

			<u-notice-bar mode="vertical" :list="noticeList"></u-notice-bar>
			<view class="grid-gn">
				<navigator url="./childCompany" class="gn-bg">
					<view>
						子公司介绍
						<view class="gn-abstract">
							-
						</view>
						<u-image src="/static/gn/zgs.png" width="100" height="100" style="position: absolute;right: 0px;bottom: 0px;opacity: 0.2;"></u-image>
					</view>

				</navigator>
				<view class="gn-bg" @click="showPhone">
					合作商机
					<view class="gn-abstract">
						快来联系我吧
					</view>
					<u-image src="/static/gn/phone.png" width="100" height="100" style="position: absolute;right: 0px;bottom: 0px;opacity: 0.2;"></u-image>
				</view>

			</view>
			<view class="chanping">
				产品介绍
			</view>
			<view v-for="(item,index) in introduceList" :key="index" @click="seeInfo(item)">
				<view v-if="item.id!=37" class="list-chanping">
					<u-image v-if="item.banners" width="100%" height="120px" :src="addHttp(item.banners)"></u-image>
					<view class="u-padding-25 title">
						{{item.title}}
					</view>
				</view>
			</view>
			<u-tabbar :list="LoginBeforeMenu" active-color="#1779FF" inactive-color="#606266" :mid-button="false"></u-tabbar>
			<wpf-update-version :updateVersionObject="updateVersionObject" :showUpdateFlag="showUpdateFlag" v-on:clickName="updateVersion"></wpf-update-version>

		</view>
	</view>
</template>

<script>
	import {
		fetchNewsList
	} from '@/common/product.js'
	import {
		queryNewsNotice
	} from '@/common/news.js'
	import wpfUpdateVersion from '@/components/wpf-update-version.vue'
	export default {
		components: {
			wpfUpdateVersion
		},
		data() {
			return {
				listQuery: {
					pageSize: 10,
					pageNum: 1,
					queryInfo: {
						type: 2,
						content: null
					}
				},
				list: [{
					image: 'https://zhaodigroup.cn/admin/api/upload/pull?fileName=801124012817256448.png',
					title: '昨夜星辰昨夜风，画楼西畔桂堂东'
				}],
				noticeList: [],
				keyword: '请搜索关键词',
				src: 'https://zhaodigroup.cn/admin/api/upload/pull?fileName=801125042070097920.jpg',
				gradList: [{
						icon: '/static/gn/js.png',
						name: '企业介绍',
						url: '/pages/index/introduce',
						type: 6
					}, {
						icon: '/static/gn/al.png',
						name: '案例对比',
						url: '/pages/index/list',
						type: 3
					},
					{
						icon: '/static/gn/wj.png',
						name: '地方文件',
						url: '/pages/index/list',
						type: 4
					},
					{
						icon: '/static/gn/bg.png',
						name: '检测报告',
						url: '/pages/index/list',
						type: 5
					},
					{
						icon: '/static/gn/sc.png',
						name: '施工手册',
						url: '/pages/index/list',
						type: 7
					},
					{
						icon: '/static/gn/tj.png',
						name: '图集查阅',
						url: '/pages/index/list',
						type: 8
					},
					{
						icon: '/static/gn/lw.png',
						name: '研究论文',
						url: '/pages/index/list',
						type: 9
					},
					{
						icon: '/static/gn/jx.png',
						name: '重大奖项',
						url: '/pages/index/prize',
						type: 10
					},
				],
				introduceList: [],
				LoginBeforeMenu: [{
						iconPath: "home",
						selectedIconPath: "home-fill",
						text: '首页',
						customIcon: false,
						pagePath: '/pages/index/index',
					},
					{
						iconPath: "account",
						selectedIconPath: "account-fill",
						text: '登录',
						customIcon: false,
						pagePath: '/pages/login/index',
					}
				],
				isClose: false,
				showUpdateFlag: {
					flag: false, //更新提示
				},
				updateVersionObject: {},
			};
		},
		onLoad() {
			this.$common.getDataDictory("news_type").then(res => {
				console.log(res)
			})
			this.getNoticeList()
			this.getList(2)
			// #ifdef APP-PLUS
			this.checkVersion()
			// #endif
		},
		methods: {
			/**
			 * @description  获取产品介绍部分信息展示
			 * @param {Object} type 2 产品介绍
			 */
			getList(type) {
				this.listQuery.queryInfo.type = type
				fetchNewsList(this.listQuery).then(res => {
					this.introduceList = res.info.pageInfo
				})
			},
			/**
			 * 获取公告信息
			 */
			getNoticeList() {
				queryNewsNotice().then(res => {
					for (const item of res.info) {
						this.noticeList.push(`${item.createdOn}兆弟集团与${item.projectName}签订了合同！`)
					}
				})
			},
			/**
			 * @description  添加域名前缀
			 * @param {Object} img 图片名称
			 */
			addHttp(img) {
				return this.$common.getDownloadUrl(img)
			},
			/**
			 * @description 查看产品介绍详情
			 * @param {Object} id
			 */
			seeInfo(item) {
				uni.navigateTo({
					url: 'query?id=' + item.id + '&title=' + item.title
				})
			},
			handleBannar(e) {
				this.$u.route('/pages/index/introduce');
			},
			/**
			 * 复制内容
			 */
			showPhone() {
				uni.showModal({
					title: '联系人',
					content: '甘先生:18067952093',
					confirmText: '复制',
					success: function() {
						if (res.confirm) {
							uni.setClipboardData({
								data: '18067952093'
							});
						}
					}
				})
			},
			/**
			 * 检查版本更新
			 * 小版本更新
			 */
			checkVersion() {
				const that = this
				plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
					that.$common.getVersionDictory({
						'category': 'app_version',
						'code': widgetInfo.version.substring(0, 1)
					}).then(res => {
						console.log('返回的res=>', res)
						that.updateVersionObject = res.info[0] // 查询数据字典 存在更新内容
						if (that.updateVersionObject.interpretation != widgetInfo.version && that.updateVersionObject.special2) {
							that.showUpdateFlag.flag = true
							console.log('flag=>', that.showUpdateFlag.flag)
						}
					})
				});
			},

			/**
			 * 更新版本
			 */
			updateVersion() {
				console.log("更新版本")
				this.showUpdateFlag.flag = false
				uni.downloadFile({
					url: this.updateVersionObject.special2,
					success: (downloadResult) => {
						console.log("更新版本"+downloadResult.statusCode)
						if (downloadResult.statusCode === 200) {
							plus.runtime.install(downloadResult.tempFilePath, {
								force: false
							}, function() {
								console.log('install success...');
								plus.runtime.restart(); //重启APP
							}, function(e) {
								console.error('install fail...', e);
							});
						}
					}
				});
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: white;
	}

	.wrap {
		padding: 20rpx;

		.app-down {
			position: fixed;
			right: 10px;
			bottom: 120px;
			z-index: 999;
			background: #1779FF;
			color: white;
			-webkit-border-radius: 999px;
			border-radius: 999px;
			line-height: 60px;
			height: 60px;
			text-align: center;
			width: 60px;
			font-size: 11px;
		}

		.slot-wrap {
			display: flex;
			width: 100%;
			padding: 0px 15px;
		}

		.item-bg-icon {
			height: 40px;
			width: 40px;
			background: #f7f7f8;
			border-radius: 500px;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.chanping {
			padding: 20px 0px 5px 0px;
			font-weight: bold;
			font-size: 16px;
		}

		.list-chanping {
			border-radius: 12rpx;
			box-shadow: 0 0 2px 1px #a2a2a3;
			// border: 1px solid #a2a2a3;
			margin: 15px 0px 20px;

			/deep/ .u-image__image {
				border-radius: 12rpx 12rpx 0rpx 0rpx !important;
			}

			.title {
				font-size: $uni-font-size-base;
			}
		}

		.gradList {
			align-items: center;
			justify-content: center;
			display: flex;
			flex-direction: column;

			.grid-text {
				letter-spacing: 1rpx;
				font-size: $uni-font-size-sm;
			}
		}

		.grid-gn {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			grid-gap: 1rem;
			height: 4rem;
			margin-top: 15px;
			letter-spacing: 1px;

			.gn-bg {
				background-color: #f7f7f8;
				border-radius: 6px;
				padding: 0.7rem;
				position: relative;
			}

			.gn-abstract {
				font-size: $uni-font-size-sm;
				color: #a2a2a3;
				margin-top: 10rpx;
			}
		}
	}
</style>
