<template>
	<view>
		<view class="cu-bar bg-gray search">
			<view class="search-form round">
				<text class="icon-search"></text>
				<input type="text" placeholder="输入搜索的关键词" v-model="content" confirm-type="search" @confirm="search"></input>
				<text class="icon-roundclosefill lg" style="font-size:30rpx;" @tap="clear"></text>
			</view>
			<view class="action" @tap="jumpTw">
				<text class="text-blue">我要提问</text>
			</view>
		</view>
		
		<view class="cu-list menu-avatar">
			<view v-if="twList.length<=0" style="position: relative;margin-top: 30%;left: 35%;">暂无数据！</view>
			<view v-for="(item, index) in twList" :key="index" class="cu-item  wpf-border" @tap="jump(item)">
				<view v-if="item.banners!=null" class="cu-avatar radius lg" :style="'background-image:url(' + item.banners + ');'"></view>
				<view :class="item.banners==null?'noImgContent':'content'">
					<view class="text-black">
						<text class="text-cut">{{item.content_title}}</text>
					</view>
					<view class="text-gray text-sm flex">
						<text class="text-gray" space="nbsp">{{item.username}} {{item.CreatedOn | createdOn | timeFrom(false)}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getList
	} from '@/common/user.js'
	export default {
		data() {
			return {
				listQuery: {
					pageNum: 1,
					pageSize: 10,
					type: 1,
					queryInfo: {
						contentTitle: undefined,
						type: 2,
						createdName: 1
					}
				},
				/**
				 * @param {String} 我的提问列表
				 */
				twList: [],
				/**
				 * @param {String} 列表总数
				 */
				total: 0,
				/**
				 * @param {String} 搜索关键词 
				 */
				content: ''
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
			}
		},
		mounted: function() {
			this.getList()
		},
		methods: {
			/**
			 * @alias 获取我的提问列表内容
			 */
			getList() {
				getList(this.listQuery).then(res => {
					const list = res.data.pageInfo
					this.total = res.data.total
					if (list != undefined) {
						this.twList = this.twList.length > 0 ? this.twList.concat(list) : list
					}
					console.log(this.twList)
				})
			},

			/**
			 * @alias 监听搜索内容
			 * @description 搜索关键词内容
			 * @return {Array} 返回搜索数组内容
			 */
			search() {
				this.listQuery.pageNum = 1;
				this.twList = [];
				this.listQuery.queryInfo.contentTitle = this.content
				this.getList()
			},

			/**
			 * @alias 监听跳转我的提问
			 * @description 用户将跳转到我的提问页面
			 */
			jumpTw() {
				uni.navigateTo({
					url: '../community/tw'
				})
			},

			/**
			 * @alias 清除搜索框内容
			 * @description 清除搜索内容 分页 页数置为1
			 */
			clear() {
				this.twList = []
				this.listQuery.queryInfo.contentTitle = undefined
				this.listQuery.pageNum = 1
				this.content = null
				this.getList()
			},

			/**
			 * @alias 监听跳转详情页面
			 * @description 跳转到详情页面
			 * @param {Object} item 详情对象 
			 */
			jump(item) {
				uni.navigateTo({
					url: '../community/detail?id=' + item.id + '&flag=' + item.flag
				})
			},

			/**
			 * @description 页面上拉触底事件的处理函数
			 */
			onReachBottom() {
				this.listQuery.pageNum++
				const totalPage = Math.ceil(this.total / this.listQuery.pageSize)
				if (totalPage >= this.listQuery.pageNum) {
					this.getList()
				}
			}
		}
	}
</script>

<style>
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
