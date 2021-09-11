<template>
	<view>
		<u-modal v-model="show" :title="title" :title-style="{color: 'red'}">
			<view class="slot-content">
				<rich-text :nodes="content"></rich-text>
			</view>
		</u-modal>
	</view>
</template>
	
<script>
	export default {
		data() {	
			return {
				show: true,
				title:'提示',
				content: "　　请你务必审慎阅读、充分理解“服务协议”和“隐私政策”各条款，包括但不限于：为了更好的向你提供服务，我们需要收集你的设备标识、操作日志等信息用于分析、优化应用性能。<br/>　　你可阅读<a href=\"https:\//www.iconfont.cn\">《服务协议》</a>和<a href=\"https://www.iconfont.cn\">《隐私政策》</a>了解详细信息。如果你同意，请点击下面按钮开始接受我们的服务。"
			}
		},
		methods: {
			
		}
	}
</script>
<style lang="scss" scoped>
	.slot-content {
		font-size: 28rpx;
		color: $u-content-color;
		padding-left: 30rpx;
	}
</style>