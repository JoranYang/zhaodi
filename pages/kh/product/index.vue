<template>
	<view>
		<!-- #ifdef H5 -->
		<view class="zd-nag u-flex" :style="{'display': isClose?'none':''}">
			<view class="zd-nag-inline" style="display: inline-flex;background-color: black;">
				<u-icon name="close-circle" class="nag-icon" color="#acacac" size="40" @click="isClose=true"></u-icon>
				<view class="u-flex">
					<u-image width="35px" height="35px" src="/static/logo/app-logo.png"></u-image>
					<text style="color: white;margin-left: 5px;">兆弟APP</text>
				</view>
			</view>
			<view class="zd-nag-inline dakai">
				<a class="download" href="https://zhaodigroup.cn/download/兆弟集团.apk">立即下载</a>
			</view>
		</view>
		<!-- #endif -->
		<u-swiper :list="bannerList" :title="true" border-radius="0" mode="none" height="340" @click="goToBannarInfo"></u-swiper>
		<view class="wrap">
			<view class="news-list siyuan" v-for="(item,index) in list" :key="index" style="display: flex;" @click="goToInfo(item.id)">
				<view :class="item.banners?'news-list-p':'news-list-k'">
					<view style="font-size: 32rpx;font-weight: bold;">
						{{item.title}}
					</view>
					<view :class="item.banners?'news-list-t':'news-list-bt'">
						<text>{{item.CreatedName}}</text>
						<text style="margin-left: 40rpx;">{{item.CreatedOn | createdOn | timeFrom(false)}}</text>
					</view>
				</view>
				<image v-if="item.banners" class="news-list-bannar" :src="item.banners | banners | getDownloadUrl" mode="aspectFill" />
			</view>
		</view>


		<!-- <wpf-update-version :updateVersionObject="updateVersionObject" :showUpdateFlag="showUpdateFlag" v-on:clickName="updateVersion"></wpf-update-version> -->

		<u-tabbar :list="menu" :mid-button="false"></u-tabbar>
	</view>
</template>

<script>
	import {
		fetchNewsBannerList,
		fetchNewsList
	} from '@/common/product.js'

	// import wpfUpdateVersion from '@/components/wpf-update-version.vue'
	export default {
		// components: {
		// 	wpfUpdateVersion
		// },
		data() {
			return {
				bannerList: [],
				listQuery: {
					pageSize: 10,
					pageNum: 1,
					queryInfo: {
						type: 2,
						content: null
					}
				},
				list: [],
				total: 0,
				menu: uni.getStorageSync('menu'),
				chengePassword: uni.getStorageSync('chengePassword'),
				// isClose: false,
				// showUpdateFlag: {
				// 	flag: false, //更新提示
				// },
				// updateVersionObject: {},
			}
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
			},
			/**
			 * 截取图片名称，保留第一个
			 * @param {Object} val 图片名称
			 */
			banners(val) {
				return val.split(',')[0]
			}
		},
		onShow: function() {
			this.getBannarList()
			this.listQuery.pageNum = 1
			this.list = []
			this.getList()
			this.topPassWord()
			// this.showUpdateFlag.flag = false
			// #ifdef H5
			var u = navigator.userAgent;
			var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器 
			var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
			if (isAndroid) {
				this.isClose = false
			} else {
				this.isClose = true
			}
			//#endif
		},
		onLoad() {
			
		},
		methods: {

			topPassWord() {
				const chengePassword = uni.getStorageSync('chengePassword')
				if (chengePassword) {
					uni.showModal({
						title: '提示修改密码',
						content: '为安全考虑，请修改初始密码',
						success: function(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '../my/info?index=4'
								})
							} else {
								console.log('用户点击取消');
							}
						}
					})
				}
			},
			/**
			 * 获取轮播图
			 */
			getBannarList() {
				fetchNewsBannerList(this.listQuery).then(res => {
					if (res.result) {
						const imageList = res.info.pageInfo
						imageList.map((val, index) => {
							this.bannerList.push({
								title: val.title,
								image: this.$common.getDownloadUrl(val.banners.split(',')[0]),
								id: val.id
							})
						})
					}
				})
			},
			getList() {
				fetchNewsList(this.listQuery).then(res => {
					if (res.result) {
						const productList = res.info.pageInfo
						if (productList != undefined) {
							this.list = this.list.length > 0 ? this.list.concat(productList) : productList
							this.total = res.info.total
						}
					}
				})
			},
			/**
			 * 上拉获取下一页
			 */
			onReachBottom() {
				this.listQuery.pageNum++
				const totalPage = Math.ceil(this.total / this.listQuery.pageSize)
				if (totalPage >= this.listQuery.pageNum) {
					this.getList()
				}
			},
			/**
			 * 跳转详请页
			 * @param {Object} id
			 */
			goToInfo(id) {
				uni.navigateTo({
					url: './info?id=' + id
				})
			},
			goToBannarInfo(index) {
				const id = this.bannerList[index].id
				uni.navigateTo({
					url: './info?id=' + id
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.wrap {
		padding: 0rpx 40rpx 0rpx 30rpx;
		background-color: white;
	}

	.news-list {
		width: 100%;
		height: 180rpx;
		background-color: white;
		border-bottom: thick solid #f4f4f4;
		border-width: 1px;
	}

	.news-list-bannar {
		width: 190rpx;
		height: 130rpx;
		margin-left: auto;
		margin-top: auto;
		margin-bottom: auto;
	}

	.news-list-p {
		padding: 10px 0px;
		position: relative;
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

	.zd-nag {
		line-height: 45px;
		background-color: #20251f;

		.zd-nag-inline {
			display: inline-block;
			width: 75%;
		}

		.nag-icon {
			width: 15%;
			justify-content: center;
		}

		.dakai {
			width: 25%;
			text-align: center;
			background-color: #ca2720;
			color: white;
		}
	}

	.download {
		color: white;
		text-decoration: none;
	}
</style>
