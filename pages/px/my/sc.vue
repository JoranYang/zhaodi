<template>
	<view>
		<view class="cu-bar bg-gray search">
			<view class="search-form round">
				<text class="icon-search"></text>
				<input type="text" placeholder="输入搜索的关键词" v-model="inputValue" confirm-type="search" @confirm="search"></input>
				<text class="icon-roundclosefill lg" style="font-size:30rpx;" @tap="twAction"></text>
			</view>
			<view class="action" @tap="twAction">
				<text class="text-blue">取消</text>
			</view>
		</view>
		<scroll-view scroll-x class="nav wpf-border">
			<view class="flex text-center">
				<view v-for="(item, index) in navList" :key="index" :class="'cu-item flex-sub ' + (index==TabCur?'text-blue cur':'')"
				 @tap="tabSelect(index)">
					{{item.name}}
				</view>
			</view>
		</scroll-view>
		<view class="cu-list menu-avatar">
			<view v-if="contentsList.length<=0" style="position: relative;margin-top: 30%;left: 43%;">暂无数据！</view>
			<view v-for="(item, index) in contentsList" :key="index" :class="'cu-item ' + (index==contentsList.length-1?'':'wpf-border')"
			 @tap="jump(item)">
				<view v-if="item.uploadIds!=null" class="cu-avatar radius lg" :style="'background-image:url(' + item.uploadIds + ');'"></view>
				<view :class="item.uploadIds==null?'noImgContent':'content'">
					<view class="text-black">
						<text class="text-cut">{{item.contentTitle}}</text>
					</view>
					<view class="text-gray text-sm flex">
						<text class="text-gray" space="nbsp">{{item.createdName}} {{item.CreatedOn}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		myCollect
	} from "@/common/user.js";
	const app = getApp();

	export default {
		data() {
			return {
				TabCur: 0,
				scrollLeft: 0,
				navList: [{
					name: '全部'
				}, {
					name: '知识'
				}, {
					name: '提问'
				}],
				listQuery: {
					type: undefined,
					contentTitle: undefined,
					pageSize: 10,
					pageNum: 1
				},
				/**
				 * @param {Array} 我的收藏列表  
				 */
				contentsList: [],
				total: 0,
				/**
				 * @param {type}  搜索内容
				 */
				inputValue: ''
			};
		},
		mounted() {
			this.myCollectList()
		},
		methods: {
			/**
			 * @description 监听用户加载我的收藏列表动作事件
			 */
			myCollectList() {
				myCollect(this.listQuery).then(res => {
					const contentList = res.data.pageInfo;
					this.total = res.data.total;
					for (const item of contentList) {
						if (item.uploadIds) {
							item.uploadIds = item.uploadIds.split(',')
							item.uploadIds = this.$common.getDownloadUrl(item.uploadIds[0])
						}
					}
					this.contentsList = this.contentsList.length > 0 ? this.contentsList.concat(contentList) : contentList
				})
			},

			/**
			 * @description 监听用户查看详情页动作事件
			 * @param {Object} item 获取详情页id 
			 */
			jump(item) {
				uni.navigateTo({
					url: '../community/detail?id=' + item.id
				})
			},

			/**
			 * @description 监听用户切换tab动作事件
			 * @param {Object} index 下标
			 */
			tabSelect(index) {
				this.listQuery.pageNum = 1
				this.listQuery.type = index > 0 ? index : undefined
				this.contentsList = []
				this.myCollectList()
				this.TabCur = index
				screenLeft = (index - 1) * 60
			},

			/**
			 * @description 监听用户清空搜索框中内容动作事件
			 */
			twAction() {
				this.listQuery.contentTitle = undefined;
				this.listQuery.pageNum = 1;
				this.contentsList = [];
				this.myCollectList();
				this.inputValue = null
			},

			/**
			 * @description 监听用户搜索动作事件
			 */
			search() {
				this.listQuery.pageNum = 1
				this.contentsList = []
				this.listQuery.contentTitle = this.inputValue
				this.myCollectList()
			},

			/**
			 * @description 监听用户下拉加载数据动作事件
			 */
			onReachBottom() {
				this.listQuery.pageNum++
				const totalPage = Math.ceil(this.total / this.listQuery.pageSize)
				if (totalPage >= this.listQuery.pageNum) {
					this.myCollectList()
				}
			}
		}
	};
</script>
<style>
	page {
		background-color: #fff;
	}

	.cu-bar .search-form {
		background-color: #fff;
	}

	.round {
		border-radius: 12rpx;
	}

	.cu-list.menu-avatar>.cu-item.arrow {
		padding-right: 90rpx;
	}

	.cu-list.menu-avatar>.cu-item.arrow:before {
		content: "\e6a3";
		position: absolute;
		top: 0;
		right: 30rpx;
		bottom: 0;
		display: block;
		margin: auto;
		width: 30rpx;
		height: 30rpx;
		color: var(--grey);
		text-align: center;
		font-size: 34rpx;
		font-family: cuIcon;
		line-height: 30rpx;
	}

	.cu-list.menu-avatar>.cu-item .noImgContent {
		position: absolute;
		width: calc(100% -90rpx - 60rpx - 120rpx - 20rpx);
		line-height: 1.6em;
		left: 30rpx;
	}

	.wpf-border {
		border-bottom: 1rpx solid #dfdfdf;
	}
</style>
