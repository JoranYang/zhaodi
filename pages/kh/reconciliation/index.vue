<template>
	<view>
		<view class="wrap siyuan" v-if="verifyList.length>0">
			<view class="u-m-b-20" v-for="(item, index) in verifyList" :key="index" @click="goInfo(item)">
				<view class="u-m-t-20" style="display: flex;align-items: center;"><text style="font-weight: bold;font-size: 34rpx;">{{item.projectName}}</text>
					<u-tag :text="status(item.status)" mode="light" :type="item.status == 3 ? 'error' : item.status == 1 ? 'warning' : 'success'"
					 size="mini" style="margin-left: 5px;" />
				</view>
				<view class="u-m-t-20">
					<u-icon name="map" color="#909399" />
					<text class="body_font_size">项目地址</text><text style="margin-left: 10rpx;">{{item.xmdz}}</text></view>
				<u-row class="u-m-t-20" gutter="1">
					<u-col>
						<text class="body_font_size">总金额/元</text><text style="margin-left: 10rpx;">{{item.totalAmount}}</text>
					</u-col>
					<!-- <u-col span="4">
						<text class="body_font_size">运输中</text><text style="margin-left: 10rpx;">{{item.carriage}}</text>
					</u-col>
					<u-col span="4">
						<text class="body_font_size">已签收</text><text style="margin-left: 10rpx;">{{item.arrive}}</text>
					</u-col> -->
				</u-row>
				<u-line v-if="index<verifyList.length-1" class="u-m-t-20" color="#ebeef5" />
			</view>
		</view>
		<view class="zd-img-center" v-else>
			<image src="/static/info/empty.png" mode="widthFix" />
		</view>
		<u-tabbar :list="menu" :mid-button="false"></u-tabbar>
	</view>
</template>

<script>
	import {
		getWaitVerifyList
	} from '@/common/reconciliation.js'
	export default {
		data() {
			return {
				listQuery: {
					pageSize: 10,
					pageNum: 1
				},
				total: 0,
				verifyList: [],
				verifyListCon: [],
				menu: uni.getStorageSync('menu')
			}
		},
		onShow: function() {
			this.listQuery.pageNum = 1
			this.verifyList = []
			this.getList()
		},
		methods: {
			status(sta) {
				switch (sta) {
					case 3:
						return '有异议'
						break
					case 1:
						return '未核对'
						break
					case 2:
						return '已核对'
						break
				}
			},
			/**
			 * 获取对账列表
			 */
			getList() {
				getWaitVerifyList(this.listQuery).then(res => {
					this.verifyListCon = res.data.pageInfo
					if (this.verifyListCon != undefined) {
						this.verifyList = this.verifyList.length > 0 ? this.verifyList.concat(this.verifyListCon) : this.verifyListCon
						this.total = res.data.total
					}
					this.total = res.data.total
				})
			},
			/**
			 * 跳转详情页
			 * @param {Object} item
			 * 参数为 详情全部数据
			 */
			goInfo(item) {
				for (const i in item.details) {
					item.details[i].deliveryDate = this.formateDate(item.details[i].deliveryDate)
				}
				uni.navigateTo({
					url: './info?item=' + JSON.stringify(item)
				})
			},
			//转换时间格式
			formateDate(datetime) {
				function addDateZero(num) {
					return (num < 10 ? "0" + num : num);
				}
				let d = new Date(datetime);
				let formatdatetime = d.getFullYear() + '-' + addDateZero(d.getMonth() + 1) + '-' + addDateZero(d.getDate()) + ' ' +
					addDateZero(d.getHours()) + ':' + addDateZero(d.getMinutes()) + ':' + addDateZero(d.getSeconds());
				return formatdatetime;
			}
		}
	}
</script>

<style>
	.wrap {
		padding: 10rpx 30rpx 20rpx;
		background-color: #FFFFFF;
	}

	.zd-img-center {
		text-align: center;
	}

	.body_font_size {
		color: #909399;
		font-size: 28rpx;
	}
</style>
