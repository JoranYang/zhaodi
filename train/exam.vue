<template>
	<view class="siyuan wrap">
		<!-- <view style="font-size: 48rpx;font-weight: bold;text-align: center;padding-bottom: 20rpx;">{{paperInfo.title}}</view> -->
		<view v-for="(item,index) in questionList" :key="index">
			<view v-for="(questionType,k) in item" :key="questionType.id" class="u-padding-20">
				<!-- <u-tag :text="tranfer(questionType.type)" mode="plain" size="mini" /> -->

				<view class="title-font">{{k+1}}、{{questionType.title}}({{questionType.sorce}}分)</view>
				<view>
					<block v-if="questionType.type==0 || questionType.type==1">
						<u-radio-group v-model="questionType.answer" @change="radioGroupChange(questionType.id,$event)" class="options-flex">
							<u-radio v-for="(op,h) in JSON.parse(questionType.options)" :key="h" :name="op.option" :disabled="false">
								{{op.option}}、{{op.content}}
							</u-radio>
						</u-radio-group>
					</block>
					<block v-if="questionType.type==2">
						<u-checkbox-group @change="checkboxGroupChange(questionType.id,$event)" v-model="questionType.answer" :wrap="true">
							<u-checkbox v-for="(op,h) in questionType.options" :key="h" v-model="op.checked" :name="op.option">{{op.option}}、{{op.content}}</u-checkbox>
						</u-checkbox-group>
					</block>
					<block v-if="questionType.type==3">
						<view v-for="(tk,t) in getTkCount(questionType.title)" :key="t">
							第{{t+1}}空：
							<u-input :ref="questionType.id+'_'+t" />
						</view>
					</block>
					<block v-if="questionType.type==4">
						<u-input type="textarea"></u-input>
					</block>
				</view>
			</view>
		</view>
		<u-button size="default" type="primary" form-type="submit" @click="save">提交</u-button>
	</view>
</template>

<script>
	import {
		queryPaperInfo,
		saveUserPaper
	} from '@/common/train.js'
	export default {
		data() {
			return {
				paperInfo: {},
				/**
				 * @description 问题列表 
				 */
				questionList: [],
				/**
				 * @param {Array} 题目类型列表
				 */
				trainQuestionType: [],
				userAnswer: {},
				/**
				 * @param {Object} startTime 开始时间 
				 */
				startTime: null,
				/**
				 * @param {Object} endTime 结束时间
				 */
				endTime: null
			}
		},
		onLoad: function(options) {
			this.getInfo(options.id)
			this.getQuestionType()
			this.startTime = new Date()
		},
		methods: {
			/**
			 * @param {IdString} id
			 */
			getInfo: function(id) {
				queryPaperInfo({
					id: id,
					isShow: false
				}).then(res => {
					this.paperInfo = res.info
					this.questionList = res.info.questions
					for (const index in this.questionList) {
						if (Number(index) === 2) {
							for (const item of this.questionList[index]) {
								var options = JSON.parse(item.options)
								options.map((it, index) => {
									it.name = it.content
									it.checked = false
									it.disabled = false
								})
								item.options = options
							}
						}
					}
				})
			},
			/**
			 * @description 获取题目类型
			 */
			getQuestionType() {
				this.$common.getDataDictory('train_question_type').then(res => {
					this.trainQuestionType = res.info
				})
			},
			/**
			 * @alias 转换题目类型编码
			 * @param {String} no 题目类型编码
			 */
			tranfer(no) {
				let ret
				this.trainQuestionType.map((item, index) => {
					if (Number(item.Code) === no) {
						ret = item.Interpretation
					}
				})
				return ret
			},
			getTkCount(title) {
				return title.split('____').length - 1
			},
			/**
			 * @description 添加用户的单选和判断答案
			 * @param {Object} id 题目id
			 * @param {Object} e 选中的值
			 */
			radioGroupChange(id, e) {
				this.userAnswer[id] = e
			},
			/**
			 * @description 提交用户答案
			 */
			save() {
				const saveEntity = {} // 保存对象
				for (const i in this.$refs) { // 遍历填空题
					const questionKeys = i.split('_') //  [问题主键-索引]
					const questionKey = questionKeys[0] // 问题主键
					if (!this.userAnswer[questionKey]) {
						this.userAnswer[questionKey] = []
					}
					const answer = this.userAnswer[questionKey] // 答案数组
					answer.push(this.$refs[i][0].defaultValue)
				}
				this.endTime = new Date()
				const ppTime = new Date(this.endTime - this.startTime).valueOf()
				const parma = {
					ppTime: ppTime,
					trainPaperId: this.paperInfo.id,
					userAnswer: JSON.stringify(this.userAnswer)
				}
				saveUserPaper(parma).then(res => {
					uni.showToast({
						title: '提交成功',
						icon: 'success'
					});
					setTimeout(() => {
						uni.navigateBack({
							delta: 2,
						})
					}, 2000)
				})
			},
			/**
			 * @param {Object} id 题目id
			 * @param {Object} e 选中的值
			 * @description 选择填空题答案
			 */
			checkboxGroupChange(id, e) {
				this.userAnswer[id] = e
			}
			
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: white;
	}

	.wrap {
		padding: 30rpx;
	}

	.title-font {
		font-weight: bold;
		font-size: $uni-font-size-base;
		padding-bottom: 10px;
	}

	.options-flex {
		display: flex;
		flex-direction: column;
	}
</style>
