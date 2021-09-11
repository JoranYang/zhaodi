<template>
	<view class="warp">
		<u-waterfall v-model="imgList" ref="uWaterfall">

			<template v-slot:left="{leftList}">
				<view v-for="(item, index) in leftList" :key="index" class="u-padding-20">
					<!-- 这里编写您的内容，item为您传递给v-model的数组元素 -->
					<u-lazy-load threshold="-450" border-radius="10" :image="item" :index="index" @tap="previewImage(item)"></u-lazy-load>
					<!-- <u-image :src="item.url" mode="widthFix"></u-image> -->
				</view>
			</template>
			<template v-slot:right="{rightList}">
				<view v-for="(item, index) in rightList" :key="index" class="u-padding-20">
					<!-- 这里编写您的内容，item为您传递给v-model的数组元素 -->
					<u-lazy-load threshold="-450" border-radius="10" :image="item" :index="index"></u-lazy-load>
					<!-- <u-image :src="item.url" mode="widthFix"></u-image> -->
				</view>
			</template>
		</u-waterfall>
	</view>
</template>

<script>
	import {
		queryNewsInfo
	} from '@/common/product.js'
	export default {
		data() {
			return {
				detail: {},
				imgList: [],
				flowList: [],
			};
		},
		onLoad() {
			this.getById(81)
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
						const rgx = /<img[^>]+src=['"]([^'"]+)['"]+/g
						var result = [],
							temp;
						while ((temp = rgx.exec(this.detail.content)) != null) {
							result.push(temp[1]);
						}
						this.imgList = result
					}
				})
			},
			/**
			 * @description  图片预览
			 * @param {Object} url
			 */
			previewImage(url) {
				uni.previewImage({
					urls: this.imgList,
					current: url
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: white;
	}

	.warp {
		padding: 30rpx;

		.gridList {
			display: grid;
			grid-gap: 1rem;
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
