<!-- 申请发货 -->
<template>
	<view class="siyuan">
		<u-navbar title-color="#fff" back-icon-color="#fff" title="发货申请" :background="background">
			<view class="slot-wrap">
				<view class="navbar-right">
					<view class="dot-box right-item">
						<text @tap="$u.throttle(save, 1000)" style="color: #FFFFFF;">提交</text>
					</view>
				</view>
			</view>
		</u-navbar>
		<view class="content">
			<view style="display: flex;margin: 30rpx;align-items: center;">
				<view style="width: 5px;height: 20px;background: #1779FF;border-radius: 5000px;"></view>
				<view style="margin-left: 1%;font-weight: bold;font-size: 34rpx;">发货主体</view>
			</view>
			<view style="background-color: white;">
				<u-form :model="goodsApply" ref="applyForm" style="padding: 0rpx 30rpx;">
					<u-form-item :label-position="labelPosition" label="项目名称" prop="xmmc" :label-width="lableWidth" :label-style="titleStyle">
						<u-input :border="border" type="select" :select-open="selectInputShow" v-model="goodsApply.xmmc" placeholder="请选择项目名称"
						 @click="selectInputShow = true" :custom-style="titleStyle"></u-input>
					</u-form-item>
					<u-form-item :label-width="lableWidth" :label-position="labelPosition" label="项目类型" prop="xmlxmc" :label-style="titleStyle">
						<u-input :border="border" placeholder="请输入项目类型" v-model="goodsApply.xmlxmc" type="text" :disabled="true"
						 :custom-style="titleStyle" />
					</u-form-item>
					<u-form-item :label-width="lableWidth" :label-position="labelPosition" label="合同编号" prop="htbh" :label-style="titleStyle">
						<u-input :border="border" placeholder="请输入合同编号" v-model="goodsApply.htbh" type="text" :disabled="true"
						 :custom-style="titleStyle" />
					</u-form-item>
					<u-form-item :label-position="labelPosition" label="发货日期" prop="fhrq" :label-width="lableWidth" :label-style="titleStyle">
						<u-input v-if="fhrqShow" :border="border" placeholder="请输入发货日期" v-model="goodsApply.fhrq" type="text" :disabled="true"
						 :custom-style="titleStyle" />
						<u-input v-else :border="border" type="select" :select-open="calendarShow" v-model="goodsApply.fhrq" placeholder="请选择发货日期"
						 @click="calendarShow = true"></u-input>
					</u-form-item>
					<u-form-item :label-width="lableWidth" :label-position="labelPosition" label="公司名称" prop="khmc" :label-style="titleStyle">
						<u-input :border="border" placeholder="请输入公司名称" v-model="goodsApply.khmc" type="text" :disabled="true"
						 :custom-style="titleStyle" />
					</u-form-item>
					<u-form-item :label-width="lableWidth" :label-position="labelPosition" label="发货地址" prop="xmdz" :label-style="titleStyle">
						<u-input :border="border" placeholder="请输入发货地址" v-model="goodsApply.xmdz" type="text" :disabled="true"
						 :custom-style="titleStyle" />
					</u-form-item>
					<u-form-item :label-width="lableWidth" :label-position="labelPosition" label="签收人" prop="qsrxm" :label-style="titleStyle">
						<u-input :border="border" placeholder="请输入签收人" v-model="goodsApply.qsrxm" type="text" :disabled="true"
						 :custom-style="titleStyle" />
					</u-form-item>
					<u-form-item :label-width="lableWidth" :label-position="labelPosition" label="联系方式" prop="qsrlxfs" :label-style="titleStyle">
						<u-input :border="border" placeholder="请输入联系方式" v-model="goodsApply.qsrlxfs" type="text" :disabled="true"
						 :custom-style="titleStyle" />
					</u-form-item>
				</u-form>
			</view>
			<u-select mode="single-column" :list="projectList" v-model="selectInputShow" @confirm="selectInputConfirm" />
			<view style="display: flex;margin: 30rpx;align-items: center;">
				<view style="width: 5px;height: 20px;background: #1779FF;border-radius: 5000px;"></view>
				<view style="margin-left: 1%;font-weight: bold;font-size: 34rpx;">发货明细</view>
			</view>
			<!-- 合同详请列表小于2条显示 -->
			<view id="swipe-action" v-if="showProjectDetailList">
				<view v-for="(item, index) in projectDetailList" :key="item.id+'_'+index" style="pointer-events: auto;" @click="goProjectDetailInfo(index)"
				 @longpress="del(index)">
					<view class="content-box" style="pointer-events: none;padding: 10rpx 30rpx;">
						<u-row class="u-m-t-20" gutter="1" style="font-size: 30rpx;font-weight: bold;">
							{{item.mc}} {{item.zx}}
						</u-row>
						<u-row gutter="1">
							<u-col span="4">
								<text class="body_font_size">桩类型</text>
								<text style="margin-left: 10rpx;">{{item.selectname}}</text>
							</u-col>
							<u-col span="4">
								<text class="body_font_size">组合桩长/米</text>
								<text style="margin-left: 10rpx;">{{item.zcm}}</text>
							</u-col>
							<u-col span="4">
								<text class="body_font_size">套数/套</text>
								<text style="margin-left: 10rpx;">{{item.gs}}</text>
							</u-col>
						</u-row>
						<u-row gutter="1">
							<u-col span="4">
								<text class="body_font_size">申请数量/米</text>
								<text style="margin-left: 10rpx;">{{item.sqsl}}</text>
							</u-col>
						</u-row>
					</view>
				</view>
			</view>
			<view class="wpf-add" @click="goProjectDetailInfoAdd">
				<u-icon name="plus" size="28"></u-icon><text>添加</text>
			</view>
			<!-- <view class="wpf-btn" @click="save">提交申请</view> -->
			<!-- 日期信息 -->
			<calendar :is-show="calendarShow" :start-date="startDate" @callback="getDate" />
			<!-- 弹出框 -->
			<u-popup v-model="popupShow" mode="bottom" border-radius="14" length="auto">
				<view class="wrap">
					<view class="u-demo-title u-text-center u-font-16" style="font-weight: bold;">选择发货内容</view>
					<u-form :model="projectDetail" ref="projectDetailForm">
						<u-form-item label-width="120" :label-position="labelPosition" label="产品型号" prop="zx">
							<u-input v-if="projectDetailListSelect.length>1" :border="border" type="select" :select-open="selectShow"
							 v-model="projectDetail.zx" placeholder="请选择产品型号" @click="selectShow = true"></u-input>
							<u-input v-else v-model="projectDetail.zx" :disabled="true"></u-input>
						</u-form-item>
						<u-form-item label-width="120" :label-position="labelPosition" label="桩类型" prop="selectname">
							<u-input :border="border" v-model="projectDetail.selectname" type="text" :disabled="true" placeholder="" />
						</u-form-item>
						<u-form-item label-width="120" :label-position="labelPosition" label="组合桩长" prop="zcm">
							<u-number-box ref="numberBoxzcm" v-model="projectDetail.zcm" :disabled="numberBox" @change="sumZcm" :min="5" :max="60"></u-number-box>
						</u-form-item>
						<u-form-item label-width="120" :label-position="labelPosition" label="套数" prop="gs">
							<u-number-box ref="numberBoxgs" v-model="projectDetail.gs" :disabled="numberBox" @change="sumGs" :min="1"></u-number-box>
						</u-form-item>
						<u-form-item label-width="120" :label-position="labelPosition" label="发货米数" prop="sqsl">
							<u-input v-model="projectDetail.sqsl" type="number" :disabled="true" />
						</u-form-item>
						<u-form-item label-width="120" :label-position="labelPosition" label="备注" prop="bz">
							<u-input v-model="projectDetail.bz" type="textarea" :border="true" height="100" :auto-height="true" />
						</u-form-item>
						<u-button size="default" type="primary" form-type="submit" @click="saveProjectDetail">{{editFlag?'编辑':'确定'}}</u-button>
					</u-form>
				</view>
			</u-popup>
			<u-modal v-model="showModal" :content="content" :show-title="false" :show-cancel-button="false" @confirm="queding"></u-modal>
			<u-toast ref="uToast" />
			<!-- 项目名称下拉框 -->
			<u-select mode="single-column" :list="projectDetailListSelect" v-model="selectShow" @confirm="selectConfirm" />
		</view>
	</view>
</template>

<script>
	import {
		getProjectById,
		saveProjectApply,
		getProjectList
	} from '@/common/project.js'
	import Calendar from 'mobile-calendar-simple/Calendar.vue'
	
	export default {
		components: {
			Calendar
		},
		data() {
			return {
				startDate: '',
				showProjectDetailList: false,
				/**
				 * 步数器是否禁用
				 */
				numberBox: true,
				goodsApply: {},
				selectShow: false,
				selectInputShow: false,
				/**
				 * 日历状态
				 */
				calendarShow: false,
				popupShow: false,
				border: false,
				labelPosition: 'left',
				projectDetailList: [],
				/**
				 * 发货内容
				 */
				projectDetail: {},
				/**
				 * 选择发货的表单列表
				 */
				projectDetailListAdd: [],
				/**
				 * 项目列表
				 */
				projectList: [],
				projectDetailListSelect: [],
				/**
				 * 判断是否是添加还是编辑
				 */
				editFlag: false,
				/**
				 * 判断发货时间
				 * 是否日历
				 */
				fhrqShow: true,
				disabled: false,
				btnWidth: 180,
				show: false,
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}],
				showModal: false,
				content: '提交成功',
				titleStyle: {
					fontSize: '30rpx'
				},
				lableWidth: 140,
				background: {
					backgroundColor: '#1779FF'
				}
			}
		},
		onLoad(options) {
			this.startDate = this.$moment(new Date()).add(0, 'd').format('YYYY-MM-DD'),
			/**
			 * 项目id
			 */
			this.getList()
			const id = options.id
			if (id) {
				this.getById(id)
			}
		},
		onReady() {
			this.$refs.applyForm.setRules(this.rules);
		},
		methods: {
			//获取回调的日期数据
			getDate(date) {
				this.goodsApply.fhrq = date.startStr.dateStr
				this.calendarShow = false
				this.startDate = date.startStr.dateStr
			},
			/**
			 * 获取项目详请
			 * @param {Object} id
			 */
			getById(id) {
				const that = this
				uni.showLoading({
					title: '加载中'
				})
				getProjectById({
					id: id
				}).then(async res => {
					uni.hideLoading()
					if (res.result) {
						let interpretation = '08:20:00'
						await that.$common.getDataDictory('ship_app_time').then(rtn => {
							interpretation = rtn.info[0].Interpretation
						})
						//项目详请
						this.goodsApply = res.info
						this.editFlag = false
						const dat = this.$moment(new Date()).format('YYYY-MM-DD')
						const zdsj = this.$moment(dat + ' ' + interpretation).valueOf() //发货指定时间
						const dqsj = this.$moment(new Date()).valueOf() //获取当前时间戳
						if (dqsj <= zdsj) {
							this.goodsApply.fhrq = this.$moment(dqsj).format('YYYY-MM-DD')
							this.fhrqShow = false
						} else {
							this.goodsApply.fhrq = this.$moment(dqsj).add(1, 'd').format('YYYY-MM-DD')
							this.fhrqShow = false
						}
						switch (this.goodsApply.xmlx) {
							case 0:
								this.goodsApply.xmlxmc = "合同项目"
								break
							case 1:
								this.goodsApply.xmlxmc = "试桩项目"
								break
						}
						this.projectDetailList = this.goodsApply.projectDetail
						/**
						 * 将获取到值，转化成所需要的格式
						 */
						for (const i in this.projectDetailList) {
							// 
							if(Number(this.projectDetailList[i].zcm)){
								this.projectDetailList[i].zcm = Number(this.projectDetailList[i].zcm)
							}else{
								this.projectDetailList[i].zcm = 5
							}
							
							this.projectDetailList[i].gs = 1
							this.projectDetailList[i].sqsl = this.projectDetailList[i].zcm * this.projectDetailList[i].gs
							this.projectDetailList[i].show = false
							this.projectDetailList[i].label = this.projectDetailList[i].zx
							// this.projectDetailList[i].value = this.projectDetailList[i].zlx1
							this.projectDetailList[i].value = i
							this.projectDetailList[i].options = [{
								text: '删除',
								style: {
									backgroundColor: 'rgb(255,58,49)'
								}
							}]
						}
						this.projectDetailListSelect = JSON.parse(JSON.stringify(this.projectDetailList))
						if (this.projectDetailList.length > 1) {
							this.projectDetailList = []
						}
						this.showProjectDetailList = true
					}
				})
			},
			/**
			 * 获取项目列表
			 */
			getList() {
				uni.showLoading({
					title: '加载中'
				})
				getProjectList({}).then(res => {
					uni.hideLoading()
					if (res.code == 0) {
						this.projectList = res.data.pageInfo
						/**
						 * 将获取到值，转化成所需要的格式
						 */
						for (const i in this.projectList) {
							this.projectList[i].label = this.projectList[i].xmmc
							this.projectList[i].value = this.projectList[i].id
						}
					}
				})
			},
			/**
			 * 将选择的日期赋值给发货日期
			 * @param {Object} e 
			 * e.result为当前日期
			 */
			calendarChange(e) {
				this.goodsApply.fhrq = e.result
			},
			/**
			 * 下拉选择产品型号
			 * @param {Object} e
			 */
			selectConfirm(e) {
				this.projectDetail = this.$u.deepClone(this.projectDetailListSelect[Number(e[0].value)]) // 深拷贝详情内容
				this.$refs.numberBoxzcm.inputVal = this.projectDetail.zcm // 组合桩长
				this.$refs.numberBoxgs.inputVal = 1 //根数
				this.numberBox = false
			},
			/**
			 * 项目下拉框
			 * 带出选中项目详请
			 * @param {Object} e
			 */
			selectInputConfirm(e) {
				this.getById(e[0].value)
			},
			/**
			 * 查看项目明细列表
			 */
			goProjectDetailInfo(index) {
				console.log('a-->', index)
				this.editFlag = true
				this.projectDetail = this.projectDetailList[index]
				this.$forceUpdate();
				this.popupShow = true
				this.numberBox = false
			},
			/**
			 * 添加项目合同明细
			 */
			goProjectDetailInfoAdd() {
				console.log(this.projectDetailListSelect)
				if (this.projectDetailListSelect && this.projectDetailListSelect.length > 0) {
					this.projectDetail = {}
					if (this.projectDetailListSelect.length < 2) {
						this.projectDetail = this.projectDetailListSelect[0]
						this.numberBox = false
					} else {
						this.numberBox = true
					}
					this.editFlag = false
					this.popupShow = true
				} else {
					this.$refs.uToast.show({
						title: '请先选择项目！',
						type: 'warning'
					})
				}
			},
			sumGs(e) {
				this.projectDetail.sqsl = e.value * this.projectDetail.zcm
				// this.$forceUpdate(); //强制刷新
			},
			sumZcm(e) {

				this.projectDetail.sqsl = this.projectDetail.gs * e.value
				// this.$forceUpdate(); //强制刷新
			},
			/**
			 * 将选择发货的内容表单
			 * push到projectDetailListAdd列表里
			 */
			saveProjectDetail() {
				console.log('projectDetail-->', this.projectDetail)
				if (this.projectDetail.id === undefined) {
					this.$refs.uToast.show({
						title: '请填写产品型号',
						type: 'warning'
					})
					return false
				}
				this.popupShow = false
				if (!this.editFlag) {
					const detail = this.$u.deepClone(this.projectDetail); // 深拷贝一份
					this.projectDetailList.push(detail)
				}
			},
			/**
			 * 左滑删除
			 * @param {Object} index
			 */
			del(index) {
				const _this = this
				uni.showModal({
					title: '提示',
					content: '确认删除',
					success: function(res) {
						if (res.confirm) {
							_this.projectDetailList.splice(index, 1)
							_this.$refs.uToast.show({
								title: '删除成功',
								type: 'success'
							})
						}
					}
				})
			},
			/**
			 * 打开左滑
			 * @param {Object} index
			 */
			// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
			open(index) {
				// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
				// 原本为'false'，再次设置为'false'会无效
				this.projectDetailList[index].show = true;
				this.projectDetailList.map((val, idx) => {
					if (index != idx) this.projectDetailList[idx].show = false;
				})
			},
			/**
			 * 保存发货申请表单
			 */
			save() {
				if (!this.goodsApply.fhrq) {
					this.$refs.uToast.show({
						title: '请填写发货日期',
						type: 'warning'
					})
					return
				}
				this.$refs.applyForm.validate(valid => {
					if (valid) {
						if (!this.editFlag) {
							this.goodsApply['projectDetail'] = this.projectDetailList
						}
						if (this.goodsApply.projectDetail.length <= 0) {
							this.$refs.uTips.show({
								title: '请填写发货明细',
								type: 'warning',
								duration: '2300'
							})
							return
						}
						uni.showLoading({
							title: '提交中'
						})
						saveProjectApply(this.goodsApply).then(res => {
							uni.hideLoading()
							console.log(res)
							if (res.result) {
								this.showModal = true
							} else {
								uni.showToast({
									title: res.errorMessage,
									duration: 2500,
									icon: 'none'
								})
							}
						})
					}
				})
			},
			/**
			 * 监听用户点击模态框状态
			 */
			queding() {
				this.showModal = false
				/**
				 * 跳转我的项目列表
				 */
				uni.switchTab({
					url: './index'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.wrap {
		padding: 10rpx 30rpx 30rpx 30rpx;
	}

	.u-config-item {
		display: flex;
	}

	.u-row {
		margin: 40rpx 0;
	}

	.demo-layout {
		height: 80rpx;
		border-radius: 8rpx;
	}

	.bg-purple {
		background: #d3dce6;
	}

	.bg-purple-light {
		background: #e5e9f2;
	}

	.bg-purple-dark {
		background: #99a9bf;
	}

	.wpf-add {
		margin: 10rpx 10rpx;
		text-align: center;
		line-height: 6;
		// border: 1px dashed #b3b2ad;
		background-color: #1779FF;
		color: white;
	}

	.wpf-btn {
		background-color: #1779FF;
		font-size: 16px;
		color: white;
		text-align: center;
		line-height: 100rpx;
		z-index: 999;
	}

	.body_font_size {
		color: #909399;
		font-size: 28rpx;
	}


	.slot-wrap {
		display: flex;
		align-items: center;
		/* 如果您想让slot内容占满整个导航栏的宽度 */
		flex: 1;
		/* 如果您想让slot内容与导航栏左右有空隙 */
		/* padding: 0 30rpx; */
	}

	.navbar-right {
		margin-right: 24rpx;
		display: flex;
		margin-left: auto;
	}

	.content-box {
		flex: 1;
		padding: 0 15px;
		position: relative;
		background-color: #fff;
		border-bottom-color: #f5f5f5;
		border-bottom-width: 1px;
		border-bottom-style: solid;
	}
</style>
