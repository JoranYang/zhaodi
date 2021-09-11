<template>
	<view>
		<view class="cu-bar bg-white search">
			<view class="search-form round">
				<text class="icon-search"></text>
				<input type="text" placeholder="输入搜索的关键词" v-model="content" confirm-type="search" @confirm="search"></input>
				<text class="icon-roundclosefill lg" style="font-size:30rpx;" @tap="clear"></text>
			</view>
		</view>

		<scroll-view scroll-x class="bg-white nav text-center">
			<view v-for="(item, index) in newsType" :key="index" :class="'cu-item ' + (index==TabCur?'text-blue cur':'')" @tap="tabSelect(index)">
				{{item.Interpretation}}
			</view>
		</scroll-view>

		<view class="content">
			<view class="content-top-pic" v-if="bannerLength>0">
				<u-swiper :list="newsBannerList" name="banners" duration="3000" :circular="false" interval="5000"></u-swiper>
				<!-- <swiper class="swiper"  @change="handleSwiperChange" autoplay="true" interval="30000" duration="300">
					<block v-for="(item, index) in newsBannerList" :key="index">
						<swiper-item @tap="detail(item)" >
							<image :src="item.banners" class="slide-image" mode="aspectFill"></image>
						</swiper-item>
					</block>
				</swiper>
				<view class="swiper-index">{{swiperIndex}}/{{bannerLength}}</view> -->
			</view>

			<view class="wrap">
				<view class="news-list siyuan" v-for="(item,index) in newsList" :key="index" style="display: flex;" @click="detail(item)">
					<view :class="item.banners?'news-list-p':'news-list-k'">
						<view style="font-size: 32rpx;">
							{{item.title}}
						</view>
						<view :class="item.banners?'news-list-t':'news-list-bt'">
							<text>{{item.CreatedName}}</text>
							<text style="margin-left: 40rpx;">{{item.CreatedOn | createdOn | timeFrom(false)}}</text>
						</view>
					</view>
					<u-image v-if="item.banners" height="130rpx" class="news-list-bannar" border-radius="6" :src="item.banners">
						<u-loading slot="loading"></u-loading>
					</u-image>
				</view>
			</view>
		</view>
		<!-- <wpf-update-version :updateVersionObject="updateVersionObject" :showUpdateFlag="showUpdateFlag" v-on:clickName="updateVersion"></wpf-update-version> -->
		<u-tabbar :list="menu" :mid-button="false"  active-color="#1779FF"></u-tabbar>
	</view>
</template>

<script>
	import {
		fetchNewsBannerList,
		fetchNewsList
	} from '@/common/news.js'
	// import wpfUpdateVersion from '@/components/wpf-update-version.vue'
	export default {
		// components: {
		// 	wpfUpdateVersion
		// },
		data() {
			return {
				TabCur: 0,
				scrollLeft: 0,
				swiperIndex: 1,
				listQuery: {
					pageNum: 1,
					pageSize: 10,
					queryInfo: {
						type: 0,
						content: null
					}
				},
				newsList: [],
				total: 0,
				newsType: "",
				newsBannerList: "",
				bannerLength: "",
				menu: uni.getStorageSync('menu'),
				/**
				 * @param {String} 搜索内容  
				 */
				content: '',
				// showUpdateFlag:{
				// 	flag:false
				// },
				// updateVersionObject:{}
			};
		},
		filters: {
			/**
			 * 将服务器时间转化为时间戳
			 * @param {Object} val 服务器时间
			 */
			createdOn(val) {
				const date = new Date(val)
				const timestamp = date.getTime()
				return timestamp
			}
		},
		onLoad() {
			//#ifdef APP-PLUS
			this.checkVersion()
			// #endif
		},
		mounted() {
			this.queryNewsList();
			this.fetchNewsBannerList();
			this.getNewsType()
		},
		methods: {
			/**
			 * @alias 获取新闻类型
			 * @description 获取新闻类型
			 */
			getNewsType() {
				this.$common.getDataDictory('news_type').then(res => {
					this.newsType = res.info
				})
			},
			/**
			 * 检查版本更新
			 */
			checkVersion() {
				const that = this
				plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
					that.$common.getVersionDictory({
						'category': 'app_version',
						'code': widgetInfo.version.substring(0, 1)
					}).then(res => {
						console.log(res)
						that.updateVersionObject = res.info[0] // 查询数据字典 存在更新内容
						if (that.updateVersionObject.interpretation != widgetInfo.version && that.updateVersionObject.special2) {
							that.showUpdateFlag.flag = true
						}
					})
				});
			},

			/**
			 * @description 获取新闻列表
			 */
			queryNewsList() {
				// uni.showLoading({
				// 	title: '正在加载'
				// });
				fetchNewsList(this.listQuery).then(res => {
					// uni.hideLoading();
					// uni.stopPullDownRefresh();
					const info = res.info.pageInfo;
					this.total = res.info.total;
					if (info.length > 0) {
						for (const item of info) {
							item.content = item.content.replace(/<\/?.+?\/?>/g, '');
							if (item.banners) {
								item.banners = item.banners.split(',');
								item.banners = this.$common.getDownloadUrl(item.banners[0]);
							}
						}
					}
					this.newsList = this.newsList.length > 0 ? this.newsList.concat(info) : info
				});
			},

			/**
			 * @description 获取轮播图列表
			 */
			fetchNewsBannerList() {
				fetchNewsBannerList(this.listQuery).then(res => {
					const info = res.info.pageInfo;

					for (const item of info) {
						if (item.banners) {
							item.banners = item.banners.split(',');
							item.banners = this.$common.getDownloadUrl(item.banners[0]);
						}
					}
					this.newsBannerList = info,
						this.bannerLength = info.length
				});
			},

			/**
			 * @description 搜索
			 * @return {Array} 返回新闻内容
			 * @param {String} content 搜索内容  
			 */
			search() {
				this.listQuery.queryInfo.content = this.content
				this.listQuery.pageNum = 1
				this.newsList = []
				this.queryNewsList()
			},

			/**
			 * @description  清除搜索框内容
			 */
			clear() {
				this.newsList = [];
				this.content = null
				this.listQuery.queryInfo.content = null;
				this.queryNewsList(this.listQuery);
			},

			/**
			 * @description 切换轮播图
			 * @param {Object} e
			 */
			handleSwiperChange: function(e) {
				this.swiperIndex = `${e.detail.current + 1}`
			},

			/**
			 * @description 跳转详情页
			 * @param {Object} item 新闻内容详情
			 */
			detail(item) {
				console.log(item)
				uni.navigateTo({
					url: './info?id=' + item.id + '&type=' + item.type
				});
			},

			/**
			 * @description 切换tab
			 * @param {Object} index 数组下标
			 */
			tabSelect(index) {
				this.listQuery.queryInfo.type = index
				this.listQuery.pageNum = 1;
				this.newsList = [];
				this.queryNewsList(this.listQuery);
				this.fetchNewsBannerList(this.listQuery);
				this.TabCur = index,
					this.scrollLeft = (index - 1) * 60
			},

			/**
			 * @description 页面上拉触底事件的处理函数
			 */
			onReachBottom() {
				this.listQuery.pageNum++
				const totalPage = Math.ceil(this.total / this.listQuery.pageSize)
				if (totalPage >= this.listQuery.pageNum) {
					this.queryNewsList()
				}
			},
			/**
			 * 更新版本
			 */
			// updateVersion() {
			// 	this.showUpdateFlag.flag = false
			// 	uni.downloadFile({
			// 		url: this.updateVersionObject.special2,
			// 		success: (downloadResult) => {
			// 			if (downloadResult.statusCode === 200) {
			// 				console.log('正在下载中')
			// 				plus.runtime.install(downloadResult.tempFilePath, {
			// 					force: false
			// 				}, function() {
			// 					console.log('install success...');
			// 					plus.runtime.restart(); //重启APP
			// 				}, function(e) {
			// 					console.error('install fail...', e);
			// 				});
			// 			}
			// 		}
			// 	});
			// },
		}
	};
</script>
<style>
	page {
		background-color: #fff;
	}

	.content-top-pic {
		position: relative;
		height: 300rpx;
		width: 100%;
		padding: 30rpx;
	}

	.swiper-index {
		position: absolute;
		bottom: 10rpx;
		right: 10rpx;
		background-color: rgba(0, 0, 0, 0.6);
		height: 40rpx;
		width: 65rpx;
		border-radius: 20rpx;
		color: #fefefe;
		line-height: 40rpx;
		font-size: 24rpx;
		text-align: center;
	}

	.swiper {
		height: 100%;
		width: 100%;
	}

	.swiper image {
		height: 100%;
		width: 100%;
	}

	/*swiper样式覆盖  */

	.list-item {
		height: 180rpx;
		width: 100%;
		box-sizing: border-box;
	}

	.list-item-right {
		float: left;
		width: 484rpx;
		height: 140rpx;
		position: relative;
	}

	.nav .cu-item.cur {
		border-bottom: none;
	}

	.news-list {
		width: 100%;
		height: 180rpx;
		background-color: white;
		border-bottom: thick solid #f4f4f4;
		border-width: 1px;
	}

	.news-list-bannar {
		max-width: 190rpx;
		margin-left: auto;
		margin-top: auto;
		margin-bottom: auto;
	}

	.news-list-p {
		padding: 10px 10px 10px 0px;
		position: relative;
		text-align: justify;
	}

	.news-list-t {
		font-size: 24rpx;
		color: #BABABA;
		position: absolute;
		bottom: 10px;
		width: 250rpx;
	}

	.news-list-bt {
		font-size: 24rpx;
		color: #BABABA;
	}

	.news-list-k {
		margin-top: auto;
		margin-bottom: auto;
	}

	.wrap {
		padding: 0rpx 30rpx;
	}
</style>
