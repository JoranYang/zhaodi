<template>
	<view>
		<u-navbar title-color="black" back-icon-color="black" title="选择时间" :background="background">
			<view class="slot-wrap">
				<view class="navbar-right">
					<view class="dot-box right-item">
						<text @click="nagToAfterSale" style="color: black;">完成</text>
					</view>
				</view>
			</view>
		</u-navbar>
		<view class="date">
			<u-input input-align="center" @click="startDateShow = true" placeholder="请选择开始日期" v-model="startDate" :type="type" :border="border" disabled />
			<span class="date-span">-</span>
			<u-input input-align="center" @click="endDateShow= true" placeholder="请选择截止日期" v-model="endDate" :type="type" :border="border" disabled />
		</view>
		<u-picker v-model="startDateShow" mode="time" @confirm="handleTime($event,'startDate')"></u-picker>
		<u-picker v-model="endDateShow" mode="time" @confirm="handleTime($event,'endDate')"></u-picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				startDateShow: false,
				endDateShow: false,
				startDate: '',
				endDate: '',
				type: 'text',
				border: true,
				background: {
					backgroundColor: '#fff'
				}
			};
		},
		methods: {
			/**
			 * @description 监听用户选择开始或者结束时间
			 * @param {Object} val 选中时间值
			 * @param {Object} dateParma 开始时间或者结束时间
			 */
			handleTime(val, dateParma) {
				this[dateParma] = val.year + '-' + val.month + '-' + val.day
			},
			/**
			 * @description 提交筛选条件
			 */
			nagToAfterSale() {
				let pages = getCurrentPages();
				let prevPage = pages[pages.length - 2]; // 获取上一个页面的data
				if (this.startDate) {
					prevPage.$vm.listQuery.startDate = this.startDate
				}
				if (this.endDate) {
					prevPage.$vm.listQuery.endDate = this.endDate
				}
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style lang="scss">
	.slot-wrap {
		margin-right: 24rpx;
		display: flex;
		margin-left: auto;
	}

	.date {
		display: inline-flex;
		padding: 10px;

		.date-span {
			display: inline-block;
			line-height: 35px;
			padding: 0px 5px;
		}
	}
</style>
