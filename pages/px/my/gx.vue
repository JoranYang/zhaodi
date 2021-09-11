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
		<view class="cu-list menu-avatar">
			<view class="tui-notice-board">
				<view class="tui-icon-bg">
					<view class="icon-notification" style="font-size: 15px;color: #ef8761;"></view>
				</view>
				<view class="tui-scorll-view">
					<view class="tui-notice tui-animation" style="color: #ef8761;overflow: visible;" @longtap="copy"><text selectable="true">小程序端暂不支持分享知识，请使用电脑进入浏览器登录官网地址，分享您的知识。https://zhaodigroup.cn</text></view>
				</view>
			</view>
			<view v-if="communityList.length<=0">
				<view style="position: relative;margin-top: 30%;left: 43%;">暂无数据！</view>
			</view>
			<view v-for="(item, index) in communityList" :key="index" class="cu-item wpf-border" @tap="jump(item)">
				<view v-if="item.banners!=null" class="cu-avatar radius lg" :style="'background-image:url(' + item.banners + ');'"></view>
				<view :class="item.banners==null?'noImgContent':'content'">
					<view class="text-black">
						<text class="text-cut">{{item.content_title}}</text>
					</view>
					<view class="text-gray text-sm flex">
						<text class="text-gray" space="nbsp">{{item.username}} {{item.CreatedOn}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		page
	} from "@/common/community.js";

	export default {
		data() {
			return {
				listQuery: {
					pageNum: 1,
					pageSize: 10,
					type: 1,
					queryInfo: {
						contentTitle: undefined,
						type: 1,
						createdName: 1
					}
				},
				queryInfo: {
					contentTitle: undefined,
					type: 1,
					createdName: 1
				},
				animation: false,
				total: 0,
				communityList: [],
				inputValue: ""
			};
		},

		mounted() {
			this.myKonwList()
			// setTimeout(() => {
			// 	this.setData({
			// 		animation: true
			// 	});
			// }, 600);
		},
		methods: {
			/**
			 * 我的收藏
			 */
			myKonwList() {
				page(this.listQuery).then(res => {
					const communityList = res.data.pageInfo;
					this.total = res.data.total;
					for (const item of communityList) {
						if (item.uploadIds) {
							item.uploadIds = item.uploadIds.split(',')
							item.uploadIds = this.$common.getDownloadUrl(item.uploadIds[0])
						}
					}
					this.communityList = this.communityList.length > 0 ? this.communityList.concat(communityList) : communityList
				});
			},

			/**
			 * 跳转详请页面
			 */
			jump(id) {
				uni.navigateTo({
					url: '../community/detail?id=' + item.id
				});
			},

			/**
			 * 清空搜索框中内容
			 */
			twAction() {
				this.listQuery.pageNum = 1
				this.communityList = []
				this.listQuery.queryInfo.contentTitle = undefined;
				this.myKonwList();
				this.inputValue = null
			},

			/**
			 * 搜索内容
			 */
			search: function() {
				this.listQuery.pageNum = 1
				this.communityList = []
				this.listQuery.queryInfo.contentTitle = this.inputValue;
				this.myKonwList();
			},

			/**
			 * 复制文本
			 */
			copy() {
				uni.setClipboardData({
					data: 'https://zhaodigroup.cn',
					success(res) {
						uni.showToast({
							title: '复制成功'
						});
					}

				});
			},

			/**
			 * @description 监听用户下拉加载数据动作事件
			 */
			onReachBottom() {
				this.listQuery.pageNum++
				const totalPage = Math.ceil(this.total / this.listQuery.pageSize)
				if (totalPage >= this.listQuery.pageNum) {
					this.myKonwList()
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
		content: "\e658";
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

	.tui-notice-board {
		width: 100%;
		padding-right: 30rpx;
		box-sizing: border-box;
		font-size: 28rpx;
		height: 60rpx;
		background: #fdf2ed;
		display: flex;
		align-items: center;
		z-index: 999;
	}

	.tui-icon-bg {
		background: #fdf2ed;
		padding: 0 5rpx;
		position: relative;
		z-index: 10;
	}

	.tui-rolling-icon {
		margin-right: 12rpx;
	}

	.tui-scorll-view {
		flex: 1;
		line-height: 1;
		white-space: nowrap;
		overflow: hidden;
		color: #fff;
	}

	.tui-notice {
		transform: translateX(100%);
	}

	.tui-animation {
		-webkit-animation: tui-rolling 20s linear infinite;
		animation: tui-rolling 20s linear infinite;
	}

	@-webkit-keyframes tui-rolling {
		0% {
			transform: translateX(100%);
		}

		100% {
			transform: translateX(-190%);
		}
	}

	@keyframes tui-rolling {
		0% {
			transform: translateX(100%);
		}

		100% {
			transform: translateX(-190%);
		}
	}
</style>
