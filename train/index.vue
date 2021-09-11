<template>
	<view>
		<view v-for="(item,index) in trainList" :key="index" style="background-color: white;" class="wrap" @click="goInfo(item.id,item.amountSorce)">
			<view>
				<view class="list-title">{{item.title}}</view>
				<view class="list-score">
					<view :class="item.maxScore?'info-maxScore':'info-maxScoreNull'" v-if="item.paperId">{{item.maxScore>=0?item.maxScore :'暂无成绩'}}<text
						 class="fen" v-show="item.maxScore">分</text></view>
					
					<view :class="item.maxScore?'info-maxScore':'info-maxScoreNull'" v-else>{{item.lookTime?item.lookTime :'请学习'}}</view>
						 
					<view class="score-yg"><text>{{parseTypeName(item.type)}}</text><text class="shuxian">|</text><text>剩余{{3-item.amountScore>0?3-item.amountScore:0}}次</text></view>
				</view>
				<view>
					<text v-if="item.paperId">最高分</text><text v-else>学习时长</text>
					<!-- 判断是否含有试卷 -->
					<block v-if="item.paperId">
						<block v-if="item.unks==0">
							<block v-if="item.isLook==0">
								<u-tag class="finishFlag" text="未学习" bg-color="#ffbdbd" border-color="#ffbdbd" color="#f56c6c" size="mini" />
							</block>
							<block v-else>
								<u-tag class="finishFlag" text="未考试" bg-color="#ffe0ce" border-color="#ffe0ce" color="#fd7f36" size="mini" />
							</block>
						</block>
						<block v-else>
							<block v-if="item.unsh==0">
								<u-tag class="finishFlag" text="批卷中" bg-color="#fffbce" border-color="#fffbce" color="#FDDB2E" size="mini" />
							</block>
							<block v-else>
								<block v-if="item.qualified==0">
									<u-tag class="finishFlag" text="不合格" bg-color="#ffbdbd" border-color="#ffbdbd" color="#CE4337" size="mini" />
								</block>
								<block v-if="item.qualified==1">
									<u-tag class="finishFlag" text="已完成" bg-color="#ceffeb" border-color="#ceffeb" color="#4DE5A0" size="mini" />
								</block>
							</block>
						</block>
					</block>
					<block v-else>
						<block v-if="item.isLook">
							<u-tag class="finishFlag" text="已完成" type="error" border-color="#fef0f0" mode="light" :closeable="false" size="mini" />
						</block>
						<block v-else>
							<u-tag class="finishFlag" text="未学习" bg-color="#ffbdbd" border-color="#ffbdbd" color="#f56c6c" size="mini" />
						</block>
					</block>
				</view>
			</view>
		</view>
		<u-tabbar :list="menu" :mid-button="false" active-color="#1779FF" />
	</view>
</template>

<script>
	import {
		getTrainList
	} from '@/common/train.js'
	export default {
		data() {
			return {
				listQuery: {
					pageSize: 10,
					pageNum: 1
				},
				trainList: [],
				/**
				 * 培训类型列表
				 */
				trainTypeList: [],
				menu: uni.getStorageSync('menu'),
				total:0
			}
		},
		mounted() {
			this.getTrainType()
		},
		onShow() {
			this.trainList = []
			this.listQuery.pageNum =1
			this.getList()
		},
		methods: {
			/**
			 * 获取培训列表信息
			 */
			getList() {
				getTrainList(this.listQuery).then(res => {
					this.total = res.data.total;
					const info = res.data.pageInfo;
					this.trainList = this.trainList.length > 0 ? this.trainList.concat(info) : info
				})
			},
			/**
			 * 获取数据字典
			 */
			getTrainType() {
				this.$common.getDataDictory('train_type').then(res => {
					this.trainTypeList = res.info
				})
			},
			/**
			 * 转化成 名称
			 * @param {Object} type
			 */
			parseTypeName(type) {
				let rts
				this.trainTypeList.map((res, index) => {
					if (type === Number(res.Code)) {
						rts = res.Interpretation
					}
				})
				return rts
			},
			/**
			 * 跳转详请页
			 * @param {Object} id
			 */
			goInfo(id, amountSorce) {
				uni.navigateTo({
					url: './info?id=' + id + '&amountSorce=' + amountSorce
				})
			},
			/**
			 * @description 页面上拉触底事件的处理函数
			 */
			onReachBottom() {
				this.listQuery.pageNum++
				const totalPage = Math.ceil(this.total / this.listQuery.pageSize)
				if (totalPage >= this.listQuery.pageNum) {
					this.getList()
				}
			},
		}
	}
</script>

<style scoped lang="scss">
	.wrap {
		padding: 40upx;
		margin-bottom: 20upx;
		letter-spacing: 0.5px;
	}

	.list-title {
		font-size: 32rpx;
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
</style>
