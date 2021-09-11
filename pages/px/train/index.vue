<!-- 培训首页 -->
<template>
	<view>
		<u-tabs :list="list" :is-scroll="false" :current="current" @change="change" active-color="#DC143C"
			inactive-color="#000"></u-tabs>
		<!-- 学习专区 -->
		<block v-if="isFlag">
			<!--导航菜单-->
			<scroll-view scroll-x="true" enable-flex="true" class="nav-scroll-category">
				<view class="nav-scroll-category-item" :style="{ color: category == 1 ? '#007AFF' : '' }"
					@click="changeCategory(1)">入职培训</view>
				<view class="nav-scroll-category-item" :style="{ color: category == 2 ? '#007AFF' : '' }"
					@click="changeCategory(2)">每月一课</view>
				<view class="nav-scroll-category-item" :style="{ color: category == 3 ? '#007AFF' : '' }"
					@click="changeCategory(3)">岗位培训</view>
				<view class="nav-scroll-category-item" :style="{ color: category == 4 ? '#007AFF' : '' }"
					@click="changeCategory(4)">技能培训</view>
				<view class="nav-scroll-category-item" :style="{ color: category == 5 ? '#007AFF' : '' }"
					@click="changeCategory(5)">员工培训</view>
				<view class="nav-scroll-category-item" :style="{ color: category == 0 ? '#007AFF' : '' }"
					@click="changeCategory(0)">全部</view>
			</scroll-view>

			<!--课程列表-->
			<Train :trainList="trainList" />
			<u-empty mode="data" v-if="!trainList.length && status === 'nomore'"></u-empty>
			<u-loadmore :status="status" bgColor="#f2f2f2" v-if="trainList.length" />
		</block>

		<!-- block else 之 我的课程 -->
		<block v-else>
			<!--滑块标题-->
			<scroll-view scroll-x class="nav-scroll">
				<view class="nav-item tab1" key="0" @click="changeNavId(0)" :class="{ 'nav-active': navId === 0 }">必修
				</view>
				<view class="nav-item tab2" key="1" @click="changeNavId(1)" :class="{ 'nav-active': navId === 1 }">选修
				</view>
			</scroll-view>
			<!--课程列表-->
			<Train :trainList="trainList" />
			<u-empty mode="data" v-if="!trainList.length && status === 'nomore'"></u-empty>
			<u-loadmore :status="status" bgColor="#f2f2f2" v-if="trainList.length" />
			<!-- 课程列表完成 -->
		</block>
		<!-- 加载更多 -->
		<u-tabbar :list="menu" :mid-button="false" active-color="#1779FF" />
		<!-- 错误提示 -->
		<view>
			<u-toast ref="uToast" />
		</view>
	</view>
</template>

<script>
	import {
		getTrainList,
		getLearnList
	} from "@/common/train.js";
	
	import getKey from "@/common/my.js";
	import Train from "./components/Train.vue";
	export default {
		name: "Index",
		components: {
			Train,
		},
		data() {
			return {
				isFlag: false, // 切换我的课程和学习专区
				navId: 0, // 必修和选修高亮显示的标识
				// 头部的
				list: [{
						name: "我的课程",
					},
					{
						name: "学习专区",
					},
				],

				current: 0,

				listQuery: {
					//查询分页条件
					pageSize: 6,
					pageNum: 1,
				},
				trainList: [], //培训内容
				category: 0, //学习专区分类id
				/**
				 * 培训类型列表
				 */
				trainTypeList: [],
				menu: uni.getStorageSync("menu"), //底部菜单
				total: 0, //trainlist总数
				status: "loadmore", //加载更多
			};
		},
		mounted() {
			this.getTrainType();
			this.getUserScore()
		},

		onShow() {
			this.trainList = [];
			this.listQuery.pageNum = 1;
			if (this.current === 0) {
				this.getList();
			} else {
				this.getLearnList();
			}
		},
		methods: {
			/**
			 * 获取积分
			 * 需要获取对应的token值
			 */
			getUserScore() {
				//发送ajax请求
			console.log("把分数的数据从其他界面传递过来")
			this.tokenValue = uni.getStorageSync('token');
			uni.request({
				url:'https://zhaodigroup.cn/admin/api/trainUserCredit/getTrainUserCreditByUserId',
				header:{
					'X-Token':this.tokenValue
				},
				success(res) {
					 uni.setStorageSync('trainCredit', res.data.data.credit);
				}
			})
			},
			
			/**
		 修改选中:我的课程和学习专区
		*/
			change(index) {
				this.current = index;
				this.isFlag = !this.isFlag;
				//1.先置空数据
				this.resetData();
				//2.再获取数据
				this.isFlag ? this.getLearnList() : this.getList();
			},

			/**
			 * 获取培训列表信息
			 */
			getList() {
				this.status = "loading";
				getTrainList(this.listQuery, this.navId).then((res) => {
					this.total = res.data.total;
					const info = res.data.pageInfo;
					this.trainList =
						this.trainList.length > 0 ? this.trainList.concat(info) : info;
					this.status =
						this.listQuery.pageNum >=
						Math.ceil(this.total / this.listQuery.pageSize) ?
						"nomore" :
						"loadmore";
				});
			},

			getLearnList() {
				this.status = "loading";
				getLearnList(this.listQuery, this.category).then((res) => {
					this.total = res.data.total;
					const info = res.data.pageInfo;
					this.trainList =
						this.trainList.length > 0 ? this.trainList.concat(info) : info;
					this.status =
						this.listQuery.pageNum >=
						Math.ceil(this.total / this.listQuery.pageSize) ?
						"nomore" :
						"loadmore";
				});
			},
			/**
			 * 获取数据字典
			 */
			getTrainType() {
				this.$common.getDataDictory("train_type").then((res) => {
					this.trainTypeList = res.info;
				});
			},
			/**
			 * 转化成 名称
			 * @param {Object} type
			 */
			parseTypeName(type) {
				let rts;
				this.trainTypeList.map((res, index) => {
					if (type === Number(res.Code)) {
						rts = res.Interpretation;
					}
				});
				return rts;
			},

			/**
			 * @description 页面上拉触底事件的处理函数
			 */
			onReachBottom() {
				const totalPage = Math.ceil(this.total / this.listQuery.pageSize);

				//1.已经没有数据的情况下
				if (this.listQuery.pageNum >= totalPage) return;
				//2.还有未加载数据的情况下
				this.listQuery.pageNum++;
				this.getLearnList();
			},

			/**
			 * @description 切换必修与选修  切换获取对应tab下的数据，清空数据
			 */
			changeNavId(navId) {
				this.navId = navId;
				this.trainList = [];
				this.getList();
			},
			/**
			 * @description 切换学习专区的培训分类【子分类】
			 */
			changeCategory(categoryId) {
				this.resetData();
				this.category = categoryId;
				this.getLearnList();
			},

			/**
			 * 切换页面时暂且按最新数据加载处理
			 */
			resetData() {
				this.navId = 0;
				this.listQuery = {
					//查询分页条件
					pageSize: 6,
					pageNum: 1,
				};
				this.trainList = [];
				this.category = 0; //学习专区分类id
				this.trainTypeList = [];
				this.total = 0; //trainlist总数
				this.status = "loadmore"; //加载更多
			},
		},
	};
</script>

<style scoped lang="scss">
	.nav-scroll-category {
		display: flex;
		white-space: nowrap;
		background: white;

		.nav-scroll-category-item {
			width: 200rpx;
			padding: 0 50rpx;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			display: inline-block;
		}
	}

	// 菜单
	.grid-text {
		font-size: 28upx;
		margin-top: 4upx;
		color: $u-type-info;
	}

	// 列表项
	.u-card-body {
		display: flex;
	}

	.nav-scroll {
		display: flex;
		white-space: nowrap;
		width: 80%;
		height: 60upx;
		background-color: #fff;
		margin: 10upx 10%;
	}

	.nav-item {
		width: 50%;
		height: 200upx;
		line-height: 60upx;
		text-align: center;
		font-size: 24upx;
		display: inline-block;
		border: 2upx solid #e0e0e0;
	}

	.nav-active {
		background-color: #2979ff;
		border: 0upx solid #e0e0e0;
		color: #fff;
	}

	.wrap {
		padding: 40upx;
		margin-bottom: 20upx;
		letter-spacing: 0.5px;
	}

	.list-title {
		font-size: 32upx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.list-score {
		padding: 10px 0px;
		display: flex;
		align-items: center;
		font-weight: bold;

		.info-maxScore {
			font-size: 26px;
			color: #2c9678;

			.fen {
				font-size: 14px;
				margin-left: 3px;
			}
		}

		.info-maxScoreNull {
			font-size: 20px;
			color: #2c9678;

			.fen {
				font-size: 14px;
				margin-left: 3px;
			}
		}

		.score-yg {
			font-weight: bold;
			margin-left: auto;
		}

		.shuxian {
			padding: 0px 5px;
			color: #a2a2a3;
		}
	}

	.finishFlag {
		float: right;
	}

	.active {
		color: #ffffff;
	}

	.activeText {
		color: #ffffff;
	}
</style>
