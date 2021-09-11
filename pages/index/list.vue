<template>
	<view class="warp">
		<view v-for="(item,index) in list" :key="index" class="list u-padding-20">
			<navigator :url="'./query?id='+ item.id +'&title='+item.title" class="u-flex">
				<u-image src="/static/file.png" width="50" height="50"></u-image>
				<view class="u-margin-left-20" style="width: 100%;">
					<view class="item-title">{{item.title}}</view>
					<view class="u-flex">
						<view class="item-date u-margin-top-20">发布日期:{{item.CreatedOn | tranferCreate | date('yyyy-mm-dd')}}</view>
						<view class="item-date u-margin-top-20 fbdw">发布单位:兆弟集团</view>
					</view>
				</view>
			</navigator>
		</view>
	</view>
</template>

<script>
	import {
		fetchNewsList
	} from '@/common/product.js'

	export default {
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
				total: 0,
				list: [],
				type: ''
			};
		},
		filters: {
			tranferCreate(val) {
				const dateTime = new Date(val)
				return dateTime.getTime()
			}
		},
		onLoad(options) {
			this.type = options.type
			this.getList(options.type)

		},
		methods: {
			getList(type) {
				this.listQuery.queryInfo.type = type
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
					this.getList(this.type)
				}
			},
			
		}
	}
</script>

<style lang="scss">
	page {
		background-color: white;
	}

	.warp {
		padding: 30rpx;

		.list {
			margin: 30rpx 0rpx 30rpx;
			// box-shadow: 0 0 2px 1px #a2a2a3;
			border-radius: 3px;
			border: 1px solid #a2a2a3;
			.item-title {
				font-size: $uni-font-size-base;
			}

			.item-date {
				font-size: $uni-font-size-sm;
				color: #a2a2a3;
			}
			
			.fbdw{
				margin-left: auto;
			}
		}

	}
</style>
