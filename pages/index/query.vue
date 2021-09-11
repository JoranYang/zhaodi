<template>
	<view class="warp">
		<view class="u-skeleton">
			<view class="u-skeleton-rect" style="margin-top: 40rpx;font-size: 30rpx;text-align: justify;">
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
				detail: {},
				loading: true, // 是否显示骨架屏组件
			};
		},
		onLoad(options) {
			uni.setNavigationBarTitle({
				title: options.title
			})
			this.getById(options.id)
		},
		methods: {
			getById(id) {
				uni.showLoading({
					title: '加载中...'
				})
				queryNewsInfo(id).then(res => {
					if (res.result) {
						uni.hideLoading()
						this.detail = res.info
						this.loading = false
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	@import url("@/components/u-parse/u-parse.css");
	page {
		background-color: white;
	}
	
	.warp{
		padding: 30rpx;
	}
	
	
	/deep/.p{
		margin-bottom: 15px;
		text-align: justify;
	}
</style>
