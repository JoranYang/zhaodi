<template>
	<view>
		<view style="padding: 40rpx;">
			<view style="font-size:48rpx ;">
				{{news.title}}
			</view>
			<view>
				<text>{{news.createdName}}</text>
				<text style="margin-left: 10rpx;color: #BABABA;">{{news.createdOn | createdOn | timeFrom(false)}}</text>
			</view>
			<view style="margin-top: 40rpx;font-size: 30rpx;text-align: justify;">
				<u-parse  :imageProp="imageProp"  :content="news.content" @preview="preview" @navigate="navigate"></u-parse>
			</view>
		</view>
		<view style="background-color: #fff;">
			<view style="padding: 10px 0px 0px 20px;font-size: 20px;font-weight: bold;">热点新闻</view>
			<view class="news-list" v-for="(item,index) in newsList" :key="index" style="display: flex;" @click="goToInfo(item.id,item.type)">
				<view :class="item.banners?'news-list-p':'news-list-k'">
					<view style="font-size: 30rpx;font-weight: bold;">
						{{item.title}}
					</view>
					<view style="font-size: 22rpx;color: #BABABA;margin-top: auto;">
						<text>{{item.CreatedName}}</text>
						<text style="margin-left: 20rpx;">{{item.CreatedOn | createdOn | timeFrom(false)}}</text>
					</view>
				</view>
				<image v-if="item.banners" class="news-list-bannar" :src="item.banners | banners | getDownloadUrl" mode="aspectFill" />
			</view>
		</view>
	</view>
</template>

<script>
	import {
		queryNewsInfo,
		fetchNewsList
	} from '@/common/news.js'
	import uParse from '@/components/u-parse/u-parse.vue'
	export default {
		components: {
			uParse
		},
		data() {
			return {
				news: {},
				listQuery: {
					pageSize: 10,
					pageNum: 1,
					queryInfo: {
						type: undefined,
						content: undefined,
						id: undefined
					}
				},
				/**
				 * @param {Array} 新闻列表
				 */
				newsList: [],
				imageProp:{
					lazyLoad:true,
					mode:'aspectFit',
					padding:0
				}
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
		onLoad: function(options) {
			const id = options.id
			const type = options.type
			this.listQuery.queryInfo.id = id
			this.listQuery.queryInfo.type = type
			this.getInfo(id)
			this.getList()
		},
		methods: {
			/**
			 * @param {Id} id
			 * @description 获取新闻详情
			 */
			getInfo(id) {
				queryNewsInfo(id).then(res => {
					this.news = res.info
				})
			},
			/**
			 * @description 获取新闻热点详情
			 */
			getList() {
				fetchNewsList(this.listQuery).then(res => {
					this.newsList = res.info.pageInfo
				})
			},
			/**
			 * 跳转详请页
			 * @param {Id} id
			 * @param {String} type 新闻类型 
			 */
			goToInfo(id, type) {
				uni.navigateTo({
					url: './info?id=' + id + '&type=' + type
				})
			},
		}
	}
</script>

<style>
	
	@import url("@/components/u-parse/u-parse.css");
	
	.news-list {
		width: 100%;
		height: 180rpx;
		background-color: white;
		border-bottom: thick solid #f4f4f4;
		border-width: 1px;
	}

	.news-list-bannar {
		max-width: 224rpx;
		height: 130rpx;
		margin-left: auto;
		margin-top: auto;
		margin-bottom: auto;
		padding-right: 20px;
	}

	.news-list-p {
		padding: 10px 0px 10px 20px;
		display: flex;
		flex-direction: column;
	}

	.news-list-k {
		margin-top: auto;
		margin-bottom: auto;
		padding: 10px 0px 10px 20px;
	}
</style>
