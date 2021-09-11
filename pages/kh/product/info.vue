<template>
	<view>
		<view class="container u-skeleton">
			<view style="font-size:48rpx ;padding: 20rpx 0rpx;">
				<text class="u-skeleton-rect">{{detail.title}}</text>
			</view>
			<view style="margin: 10px 0">
				<!--u-skeleton-rect 绘制矩形-->
				<text class="u-skeleton-rect">{{detail.createdName}}</text>
				<text class="u-skeleton-rect" style="margin-left: 10rpx;color: #BABABA;">{{detail.createdOn | createdOn | timeFrom(false)}}</text>
			</view>
			<view class="u-skeleton-rect" style="margin-top: 40rpx;font-size: 30rpx;text-align: justify;">
				<!-- <rich-text :nodes="detail.content"></rich-text> -->
				<u-parse :content="detail.content"></u-parse>
			</view>
		</view>
		<!--引用组件-->
		<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
	</view>
</template>

<script>
	import {
		queryNewsInfo
	} from '@/common/product.js'
	import uParse from '@/components/u-parse/u-parse.vue'
	export default {
		components: {
			uParse
		},
		data() {
			return {
				detail: {
					title: '兆弟集团新闻标题',
					createdName: 'IT部管理员',
					createdOn: '三个月前',
					content: '君不见，黄河之水天上来，奔流到海不复回。君不见，高堂明镜悲白发，朝如青丝暮成雪。'
				},
				loading: true, // 是否显示骨架屏组件
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
		onLoad(options) {
			this.getInfo(options.id)
		},
		methods: {
			getInfo(id) {
				queryNewsInfo(id).then(res => {
					if (res.result) {
						this.loading = false;
						this.detail = res.info
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import url("@/components/u-parse/u-parse.css");

	.warp {
		padding: 0rpx 30rpx;
	}

	.container {
		padding: 20rpx 30rpx;
	}

	.lists {
		margin: 10px 0;
	}
</style>
