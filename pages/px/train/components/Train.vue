<!-- 单个课程的处理 -->
<template>
	<view class="page-box">
		<view class="order" v-for="(item, index) in trainList" :key="index">
			<!-- 最上面的内容展示部分 -->
			<view class="item">
				<view class="left">
					<image :src="`https://zhaodigroup.cn/admin/api/upload/pull?fileName=${
              item.courseCover.split(',')[0]
            }`" mode="aspectFill"></image>
				</view>
				<view class="content">
					<!-- 标题 -->
					<view class="title u-line-2" style="height: 56upx">{{
            item.title
          }}</view>
					<!-- 简述 -->
					<view class="type u-line-2" style="height: 64upx">{{
            item.courseDesc
          }}</view>
					<!-- 作者 -->
					<view class="delivery-time" style="height: 32upx">{{
            item.author
          }}</view>
					<!-- 时间 -->
					<view class="delivery-time" style="height: 40upx">本课程共{{ item.courseHours }}小节|共{{
              item.courseLength
            }}分钟</view>
				</view>
			</view>
			<!-- 是否需要学习 -->
			<view class="total">
				<template
					v-if="item.isGoExam === 0 && item.trainStudyStatus===1&& item.examinationCount === 0 && item.paperId !=null">
					<text class="noneJoinExam exam"></text>
					<text class="total-price">本课程您未参加考试</text>
				</template>

				<template v-else-if="item.isGoExam === 1 && item.examinationCount >= 1 && item.paperId !=null ">
					<text class="hasJoinExam exam"></text>
					<text class="total-price">
						本课程您已参加{{ item.examinationCount }}次考试，考试{{
              item.examinationResults === 1 ? "已通过" : "未通过"
            }}，成绩{{ item.userMaxScore }}分
					</text>
				</template>

				<template v-else-if="item.examinationCount===0">
					<text class="noneExam exam"></text>
					<text class="total-price">本课程不需要考试</text>
				</template>
			</view>

			<!-- 学习考试button展示 -->
			<view class="bottom">
				<view class="btn" @click="goInfo(item.id, item.type)">学习</view>
				<view class="btn" v-if="
            item.examinationResults === 0 &&
			item.trainStudyStatus===1 &&
            item.isGoExam === 1 &&
            item.examinationCount <= 2 &&
            item.paperId
          " @click="goToExam(item)">考试</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "Train",
		props: {
			trainList: {
				type: Array,
			},
		},
		data() {
			return {};
		},
		methods: {
			/**
			 * 跳转详请页
			 * @param {Object} id
			 */
			goInfo(id, type) {
				uni.navigateTo({
					url: "/pages/px/train/info?id=" + id,
				});
			},
			/**
			 * @description index页点击考试，去考试去吧~
			 */
			goToExam(item) {
				if (!(item.trainStudyStatus && item.isHaveCourse)) {
					this.$refs.uToast.show({
						title: "请先完成学习",
						type: "error",
					});
					return;
				}
				//跳转到考试页面
				uni.navigateTo({
					url: "/pages/px/train/exam?id=" + item.paperId,
				});
			},
		},
	};
</script>
<style lang='scss' scoped>
	.order {
		width: 100%;
		background-color: #ffffff;
		margin: 20upx auto;
		border-radius: 20upx;
		box-sizing: border-box;
		padding: 20upx;
		font-size: 28upx;

		.top {
			display: flex;
			justify-content: space-between;

			.left {
				display: flex;
				align-items: center;

				.store {
					margin: 0 10upx;
					font-size: 32upx;
					font-weight: bold;
				}
			}

			.right {
				color: #ff1212;
			}
		}

		.item {
			display: flex;
			margin: 20upx 0 0;

			.left {
				margin-right: 20upx;

				image {
					width: 200upx;
					height: 200upx;
					border-radius: 10upx;
				}
			}

			.content {
				.title {
					font-size: 28upx;
					line-height: 50upx;
					white-space: nowrap;
				}

				.type {
					margin: 10upx 0;
					font-size: 24upx;
					color: $u-tips-color;
				}

				.delivery-time {
					font-size: 24upx;
				}
			}

			.right {
				margin-left: 10upx;
				padding-top: 20upx;
				text-align: right;

				.decimal {
					font-size: 24upx;
					margin-top: 4upx;
				}

				.number {
					color: $u-tips-color;
					font-size: 24upx;
				}
			}
		}

		.total {
			margin-top: 20upx;
			text-align: center;
			font-size: 24upx;

			.total-price {
				font-size: 24upx;
			}

			.exam {
				border-radius: 50%;
				width: 10px;
				height: 10px;
				margin-right: 10px;
				display: inline-block;
			}

			.hasJoinExam {
				background: #00a881;
			}

			.noneJoinExam {
				background: #f04134;
			}

			.noneExam {
				background: #e2dde2;
			}
		}

		.bottom {
			display: flex;
			margin-top: 40upx;
			padding: 0 10upx;
			justify-content: space-between;
			align-items: center;

			.btn {
				line-height: 80upx;
				width: 100%;
				border-radius: 26upx;
				border: 2upx solid $u-border-color;
				font-size: 26upx;
				text-align: center;
				color: $u-type-info-dark;
			}

			.evaluate {
				color: #ffffff;
				border: 2upx solid transparent;
				background: linear-gradient(to right, #ff6034, #ee0a24);
			}
		}
	}
</style>
