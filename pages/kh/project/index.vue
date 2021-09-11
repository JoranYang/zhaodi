<template>
	<view class="siyuan">
		<view v-if="projectListCon!=undefined">
			<view class="u-m-b-20 project-list" v-for="(item, index) in projectList" style="pointer-events: auto;width: auto;"
			 :key="index" @click="jump(item.id)">
				<view style="pointer-events: none;">
					<view class="u-m-t-20" style="font-weight: bold;font-size: 34rpx;">{{item.xmmc}}</view>
					<view class="u-m-t-20">
						<u-icon name="map" color="#909399" />
						<text class="body_font_size">项目地址</text><text style="margin-left: 10rpx;">{{item.xmdz?item.xmdz:'暂无'}}</text>
					</view>
					<u-row class="u-m-t-20" gutter="1">
						<u-col span="6">
							<text class="body_font_size">总桩量/米</text><text style="margin-left: 10rpx;">{{item.sl?item.sl:0}}</text>
						</u-col>
						<u-col span="6">
							<text class="body_font_size">运输中/米</text><text style="margin-left: 10rpx;">{{item.carriage?item.carriage:0}}</text>
						</u-col>
						
					</u-row>
					<u-row class="u-m-t-20" gutter="1">
						<u-col span="6">
							<text class="body_font_size">未签收/米</text><text style="margin-left: 10rpx;">{{item.unSign?item.unSign:0}}</text>
						</u-col>
						<u-col span="6">
							<text class="body_font_size">已签收/米</text><text style="margin-left: 10rpx;">{{item.arrive?item.arrive:0}}</text>
						</u-col>
					</u-row>
				</view>
				<u-line v-if="index<projectList.length-1" class="u-m-t-20" color="#ebeef5" />
			</view>
		</view>
		<u-tabbar :list="menu" :mid-button="false"></u-tabbar>
	</view>

</template>

<script>
	import {
		getProjectList
	} from '@/common/project.js'
	export default {
		data() {
			return {
				listQuery: {
					pageSize: 10,
					pageNum: 1
				},
				projectList: [],
				projectListCon: [],
				total: 0,
				menu: uni.getStorageSync('menu')
			}
		},
		onShow() {
			this.listQuery.pageNum = 1
			this.projectList = []
			this.getList()
		},
		methods: {
			/**
			 * 获取项目列表
			 */
			getList() {
				uni.showLoading({
					title: '努力加载中'
				})
				getProjectList(this.listQuery).then(res => {
					setTimeout(() => {
						uni.hideLoading()
						if (res.code == 0) {
							//这里做了修正，因为后台这次测试中并没有返回pageInfo的数据结构  2021/3/12
							this.projectListCon = res.data.pageInfo != undefined ? res.data.pageInfo:res.data
							if (this.projectListCon != undefined) {
								this.projectList = this.projectList.length > 0 ? this.projectList.concat(this.projectListCon) : this.projectListCon
								this.total = res.data.total
							}
						}
					}, 500)
				})
			},
			/**
			 * 跳转详情页
			 * @param {Object} id
			 */
			jump(id) {
				uni.navigateTo({
					url: './edit?id=' + id
				})
			}
		},
		/**
		 * 上拉
		 */
		onReachBottom() {
			this.listQuery.pageNum++
			const totalPage = Math.ceil(this.total / this.listQuery.pageSize)
			if (totalPage >= this.listQuery.pageNum) {
				this.getList()
			}
		},
		onPullDownRefresh() {
			this.listQuery.pageNum = 1
			this.projectList = []
			this.getList()
			uni.stopPullDownRefresh()
		}
	}
</script>

<style scoped lang="scss">
	.project-list {
		background-color: white;
		padding: 10px 30rpx;
	}

	.body_font_size {
		color: #909399;
		font-size: 28rpx;
	}
</style>
