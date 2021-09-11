<template>
	<view class="warp">
		<u-parse :content="detail.content" :imageProp="imageProp"></u-parse>
		
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
		data(){
			return{
				detail:{},
				imageProp:{
					lazyLoad:true,
					mode:'widthFix'
				}
			}
		},
		onLoad() {
			this.getById(64)
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
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	@import url("@/components/u-parse/u-parse.css");
	/deep/.p{
		margin-bottom: 15px;
		text-align: justify;
	}
	page{
		background-color: white;
	}
	
	.warp{
		padding: 30rpx;
	}
</style>
