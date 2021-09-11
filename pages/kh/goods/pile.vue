<!-- 申请发货 -->
<template>
	<view class="siyuan">
		<u-navbar title-color="#fff" back-icon-color="#fff" title="退桩申请" :background="background">
			<view class="slot-wrap">
				<view class="navbar-right">
					<view class="dot-box right-item">
						<text @tap="$u.throttle(save, 1000)" style="color: #FFFFFF;">提交</text>
					</view>
				</view>
			</view>
		</u-navbar>
		<view class="content">
			<view style="background-color: white;">
				<u-form :model="goodsApply" :rules="rules" ref="applyForm" :errorType="errorType"
					style="padding: 0rpx 30rpx;">
					<u-form-item :label-position="labelPosition" label="项目名称" prop="xmmc" :label-width="lableWidth"
						:label-style="titleStyle">
						<u-input v-if="projectList.length>1" :border="border" type="select"
							:select-open="selectInputShow" v-model="goodsApply.xmmc" placeholder="请选择项目名称"
							@click="selectInputShow = true" mode="single-column" :custom-style="titleStyle"></u-input>
						<u-input v-else :border="border" placeholder="" v-model="goodsApply.xmmc" type="text"
							:custom-style="titleStyle" />
					</u-form-item>
					<u-form-item :label-width="lableWidth" :label-position="labelPosition" label="项目类型" prop="xmlxmc"
						:label-style="titleStyle">
						<u-input :border="border" placeholder="请输入项目类型" v-model="goodsApply.xmlxmc" type="text"
							:disabled="true" :custom-style="titleStyle" />
					</u-form-item>
					<u-form-item :label-width="lableWidth" :label-position="labelPosition" label="合同编号" prop="htbh"
						:label-style="titleStyle">
						<u-input :border="border" placeholder="请输入合同编号" v-model="goodsApply.htbh" type="text"
							:disabled="true" :custom-style="titleStyle" />
					</u-form-item>
					<u-form-item :label-position="labelPosition" label="退桩类型" prop="typeLabel" :label-width="lableWidth"
						:label-style="titleStyle">
						<u-input :border="border" type="select" :select-open="selectPileInputShow"
							v-model="goodsApply.typeLabel" placeholder="请选择项目名称" @click="selectPileInputShow = true"
							:custom-style="titleStyle"></u-input>
					</u-form-item>
					<u-form-item v-show="goodsApply.type!=null &&goodsApply.type!=0" :label-position="labelPosition"
						label="发生日期" prop="occurrenceDate" :label-width="lableWidth" :label-style="titleStyle">
						<u-input :border="border" type="select" v-model="goodsApply.occurrenceDate"
							placeholder="请选择发生日期" @click="showCalendar=true"></u-input>
					</u-form-item>
					<u-form-item v-show="goodsApply.type!=null &&goodsApply.type!=2" :label-width="lableWidth"
						:label-position="labelPosition" label="原因" prop="reason" :label-style="titleStyle">
						<u-input :border="border" placeholder="请填写原因" v-model="goodsApply.reason" type="textarea"
							:custom-style="titleStyle" />
					</u-form-item>
					<u-form-item v-show="goodsApply.type!=null &&goodsApply.type!=0" :label-width="lableWidth"
						:label-position="labelPosition" label="备注" prop="remarks" :label-style="titleStyle">
						<u-input :border="border" placeholder="请填写备注" v-model="goodsApply.remarks" type="textarea"
							:custom-style="titleStyle" />
					</u-form-item>
					<view class="cu-bar bg-white margin-top">
						<view class="action">
							图片上传
						</view>
						<view class="action">
							{{imgList.length}}/9
						</view>
					</view>
					<view class="cu-form-group">
						<u-upload :action="action" ref="uUpload" :file-list="imgList" :header="header" :to-json="true"
							max-count="9"></u-upload>
					</view>
				</u-form>
			</view>
			<u-select mode="single-column" :list="projectList" v-model="selectInputShow"
				@confirm="selectInputConfirm" />
			<u-select mode="single-column" :list="pileList" v-model="selectPileInputShow"
				@confirm="selectPileInputConfirm" />
			<view style="display: flex;margin: 30rpx;align-items: center;">
				<view style="width: 5px;height: 20px;background: #1779FF;border-radius: 5000px;"></view>
				<view style="margin-left: 1%;font-weight: bold;font-size: 34rpx;">退货明细</view>
			</view>
			<!-- 合同详请列表小于2条显示 -->
			<view v-if="projectDetailList.length>0">
				<view v-for="(item, index) in projectDetailList" :key="item.id+'_'+index" style="pointer-events: auto;"
					@click="goProjectDetailInfo(index)" @longpress="del(index)">
					<view class="content-box" style="pointer-events: none;padding: 10rpx 30rpx;">
						<u-row gutter="1">
							<u-col span="12">
								<text class="body_font_size">规格型号</text>
								<text style="margin-left: 10rpx;">{{item.specs}}</text>
							</u-col>
						</u-row>
						<u-row gutter="1">
							<u-col span="4">
								<text class="body_font_size">米数</text>
								<text style="margin-left: 10rpx;">{{item.meters}}</text>
							</u-col>
							<u-col span="4">
								<text class="body_font_size">根数</text>
								<text style="margin-left: 10rpx;">{{item.number}}</text>
							</u-col>
							<u-col span="4">
								<text class="body_font_size">桩长</text>
								<text style="margin-left: 10rpx;">{{item.len}}</text>
							</u-col>
						</u-row>
					</view>
				</view>
			</view>
			<view v-show="projectDetailList.length<projectDetailListSelect.length" class="wpf-add"
				@click="goProjectDetailInfoAdd" style="color: #909399;">
				<u-icon name="plus" size="28"></u-icon><text>添加</text>
			</view>

			<!-- 弹出框 -->
			<u-popup v-model="popupShow" mode="bottom" border-radius="14" length="auto">
				<view class="wrap">
					<view class="u-demo-title u-text-center u-font-16" style="font-weight: bold;">选择退货明细</view>
					<u-form :model="projectDetail" ref="projectDetailForm">
						<u-form-item label-width="120" :label-position="labelPosition" label="产品型号" prop="specs">
							<u-input v-if="projectDetailListSelect.length>1" :border="border" type="select"
								:select-open="selectShow" v-model="projectDetail.specs" placeholder="请选择产品型号"
								@click="selectShow = true"></u-input>
							<u-input v-else v-model="projectDetail.specs" :disabled="true"></u-input>
						</u-form-item>
						<u-form-item label-width="120" :label-position="labelPosition" label="桩长" prop="len">
							<u-input v-model="projectDetail.len" type="number" :disabled="true" />
						</u-form-item>
						<u-form-item label-width="120" :label-position="labelPosition" label="根数" prop="number">
							<u-number-box v-model="projectDetail.number" @change="sumNumber" :min="1"
								:max="projectDetail.totalNumber" :disabled="numberDisable"></u-number-box>
						</u-form-item>
						<u-form-item label-width="120" :label-position="labelPosition" label="米数" prop="meters">
							<u-input :border="border" v-model="projectDetail.meters" type="text" :disabled="true"
								placeholder="" />
						</u-form-item>
						<!-- <u-form-item v-show="goodsApply.type===2" label-width="120" :label-position="labelPosition" label="补桩米数" prop="replenishment">
							<u-number-box v-model="projectDetail.replenishment" @change="sumZcm" :min="1"></u-number-box>
						</u-form-item> -->
						<u-button size="default" type="primary" form-type="submit" @click="saveProjectDetail">
							{{editFlag?'编辑':'确定'}}</u-button>
					</u-form>
				</view>
			</u-popup>
			<u-modal v-model="showModal" :content="content" :show-title="false" :show-cancel-button="false"
				@confirm="queding"></u-modal>
			<u-toast ref="uToast" />
			<!-- 项目名称下拉框 -->
			<u-select mode="single-column" value-name="specs" label-name="specs" :list="projectDetailListSelect"
				v-model="selectShow" @confirm="selectConfirm" />

			<!-- 弹起日历 -->
			<u-calendar v-model="showCalendar" mode="date" @change="changeCalendar"></u-calendar>
		</view>
	</view>
</template>

<script>
	import {
		getProjectById,
		saveProjectApply,
		getProjectList,
		getProjectApplyDetail,
		saveAppProjectApplyDetail
	} from '@/common/project.js'
	import Calendar from 'mobile-calendar-simple/Calendar.vue'
	export default {
		components: {
			Calendar
		},
		data() {
			return {
				// startDate: this.$moment(new Date()).add(1, 'd').format('YYYY-MM-DD'),
				startDate: '',
				/**
				 * 步数器是否禁用
				 */
				numberBox: true,
				goodsApply: {
					typeLabel: ''
				},
				selectShow: false,
				selectInputShow: false,
				selectPileInputShow: false,
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
				},
				pileList: [{
						value: 0,
						label: '退桩'
					},
					{
						value: 2,
						label: '爆桩'
					},
					{
						value: 3,
						label: '损桩'
					}
				],
				showCalendar: false,
				numberDisable: true,
				/**
				 * @param {String} 请求地址  
				 */
				action: '',
				/**
				 * @param {Object} 请求头信息  
				 */
				header: {
					token: uni.getStorageSync('token'),
					data: 99,
					type: 2
				},
				imgList: [],
				rules: {
					// typeLabel: [{
					// 	required: true,
					// 	message: '请选择退桩类型',
					// 	// 可以单个或者同时写两个触发验证方式 
					// 	trigger: 'blur,change',
					// }],
					// reason: [{
					// 	required: true,
					// 	message: '请填写原因',
					// 	// 可以单个或者同时写两个触发验证方式 
					// 	trigger: 'blur',
					// }],
					// occurrenceDate: [{
					// 	required: true,
					// 	message: '请选择发生日期',
					// 	// 可以单个或者同时写两个触发验证方式 
					// 	trigger: 'blur,change',
					// }]
				},
				errorType: ['message']
			}
		},
		onLoad(options) {
			this.startDate = this.$moment(new Date()).add(1, 'd').format('YYYY-MM-DD')
			this.action = this.$baseUrl + 'upload/push';
			this.getList()
		},
		onReady() {
			this.$refs.applyForm.setRules(this.rules);
			// 得到整个组件对象，内部图片列表变量为"lists"
			this.imgList = this.$refs.uUpload.lists;
		},
		methods: {
			//获取回调的日期数据
			getDate(date) {
				this.goodsApply.fhrq = date.startStr.dateStr
				this.calendarShow = false
				this.startDate = date.startStr.dateStr
			},
			/**
			 * 查看可退桩 详情
			 * 返回总根数 桩长等
			 */
			getDetails() {
				getProjectApplyDetail({
					id: this.goodsApply.id
				}).then(res => {
					this.projectDetailListSelect = res.info
					if (this.projectDetailListSelect.length <= 0) {
						uni.showToast({
							title: '您暂无已签收的货物，无法申请售后',
							icon: 'none'
						})
						return
					}
					if (this.projectDetailListSelect.length <= 1) {
						this.projectDetail = this.projectDetailListSelect[0]
						// 可用计算属性重写这段代码
						const lensplit = this.projectDetail.specs.split('-')
						this.projectDetail.len = Number(lensplit[lensplit.length - 1])
						this.projectDetail.meters = this.projectDetail.len
						this.projectDetail.number = 1
					} else {
						for (const item of this.projectDetailListSelect) {
							item.number = 1
						}
					}
				})
			},
			/**
			 * 获取项目详请
			 * @param {Object} id
			 */
			getById(id) {
				getProjectById({
					id: id
				}).then(res => {
					if (res.result) {
						//项目详请
						this.goodsApply = res.info
						this.editFlag = false
						switch (this.goodsApply.xmlx) {
							case 0:
								this.goodsApply.xmlxmc = "合同项目"
								break
							case 1:
								this.goodsApply.xmlxmc = "试桩项目"
								break
						}
						this.goodsApply.projectCode = this.goodsApply.xmbm
						this.goodsApply.contractCode = this.goodsApply.htbh
						this.goodsApply.salesmanId = this.goodsApply.yxy
						this.goodsApply.projectId = this.goodsApply.id
						this.goodsApply.areaId = this.goodsApply.qy
						this.goodsApply.officeId = this.goodsApply.xmszbsc
						this.goodsApply.serviceStaffId = this.goodsApply.hqfwId
						this.getDetails()
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
						if (this.projectList.length <= 1) {
							this.getById(this.projectList[0].id)
						} else {
							/**
							 * 将获取到值，转化成所需要的格式
							 */
							for (const i in this.projectList) {
								this.projectList[i].label = this.projectList[i].xmmc
								this.projectList[i].value = this.projectList[i].id
							}
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
				this.numberDisable = false
				for (const item of this.projectDetailListSelect) {
					if (item.specs === e[0].value) {
						const lensplit = item.specs.split('-')
						item.len = Number(lensplit[lensplit.length - 1])
						item.meters = item.len
						this.projectDetail = item
						break
					}
				}
			},
			/**
			 * 项目下拉框
			 * 带出选中项目详请
			 * @param {Object} e
			 */
			selectInputConfirm(e) {
				this.getById(e[0].value)
			},
			selectPileInputConfirm(e) {
				// this.projectDetail = {}
				console.log('projectDetail-->', e)
				this.projectDetailList = []
				this.goodsApply.type = e[0].value
				this.goodsApply.typeLabel = e[0].label
			},
			/**
			 * 查看项目明细列表
			 */
			goProjectDetailInfo(index) {
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
				this.editFlag = false
				this.popupShow = true

				if (this.projectDetailListSelect.length > 1) {
					this.projectDetail = {}
					this.numberDisable = true // 没有选择规格时  禁用选择米数
				} else {
					this.numberDisable = false

				}
			},
			sumGs(e) {
				this.projectDetail.sqsl = e.value * this.projectDetail.zcm
				this.$forceUpdate(); //强制刷新
			},
			sumNumber(e) {
				this.projectDetail.meters = this.projectDetail.len * e.value
				this.$forceUpdate(); //强制刷新
			},
			/**
			 * 将选择发货的内容表单
			 * push到projectDetailListAdd列表里
			 */
			saveProjectDetail() {
				this.popupShow = false
				if (!this.editFlag) {
					const projectDetail = this.$u.deepClone(this.projectDetail) // copy一份
					this.projectDetailList.push(projectDetail)
				}
			},
			/**
			 * 左滑删除
			 * @param {Object} index
			 */
			del(index) {
				console.log(index)
				const _this = this
				uni.showModal({
					title: '提示',
					content: '确认删除',
					success: function(res) {
						if (res.confirm) {
							console.log(_this.projectDetailList)
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
				this.goodsApply.totalNumber = 0
				this.goodsApply.totalMeters = 0
				if (this.goodsApply.type === undefined) {
					this.$refs.uToast.show({
						title: '请选择退桩类型',
						type: 'warning'
					})
					return
				}
				// 0  2  3

				if (this.goodsApply.type === 0) {
					if (this.goodsApply.reason == null || this.goodsApply.reason == '') {
						this.$refs.uToast.show({
							title: '请填写原因',
							type: 'warning'
						})
						return
					}
				} else if (this.goodsApply.type === 2) {
					if (this.goodsApply.occurrenceDate == null || this.goodsApply.occurrenceDate == '') {
						this.$refs.uToast.show({
							title: '请填写发生日期',
							type: 'warning'
						})
						return
					}
				} else {
					if (this.goodsApply.reason == null || this.goodsApply.reason == '') {
						this.$refs.uToast.show({
							title: '请填写原因',
							type: 'warning'
						})
						return
					}
					if (this.goodsApply.occurrenceDate == null || this.goodsApply.occurrenceDate == '') {
						this.$refs.uToast.show({
							title: '请填写发生日期',
							type: 'warning'
						})
						return
					}
				}


				if (!this.editFlag) {
					this.goodsApply['details'] = this.projectDetailList
					for (const item of this.projectDetailList) {
						this.goodsApply.totalNumber = this.goodsApply.totalNumber + item.number
						this.goodsApply.totalMeters = this.goodsApply.totalMeters + item.meters
					}
				}
				console.log(this.goodsApply)
				let files = this.$refs.uUpload.lists //上传图片数组
				const uploadIds = []; //存放图片id
				for (const item of files) {
					uploadIds.push(item.response.data.id);
				}
				if (uploadIds.length <= 0) {
					this.$refs.uToast.show({
						title: '请上传图片',
						type: 'warning'
					})
					return
				}
				this.goodsApply.picIds = uploadIds.toString()
				uni.showLoading({
					title: '正在提交中'
				})
				saveAppProjectApplyDetail(this.goodsApply).then(res => {
					if (res.result) {
						uni.hideLoading()
						uni.showToast({
							title: '提交成功',
							icon: 'success'
						})
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							})
						}, 1000)

					} else {
						uni.showToast({
							title: res.errorMessage,
							duration: 2500,
							icon: 'none'
						})
					}
				})
				// if (this.goodsApply.type===undefined) {
				// 	this.$refs.uToast.show({
				// 		title: '请选择退桩类型',
				// 		type: 'warning'
				// 	})
				// 	return
				// }
				// this.$refs.applyForm.validate(valid => {
				// 	if (valid) {

				// 	}
				// })
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
			},
			changeCalendar(e) {
				console.log(e)
				this.goodsApply.occurrenceDate = e.result
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
		border: 1px dashed #b3b2ad; //#ebeef5
	}

	.wpf-btn {
		// position: fixed;
		// bottom: 0%;
		// width: 100%;
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

	.cu-form-group {
		padding: 0px;
	}

	.cu-bar .action:first-child {
		margin-left: 0px;
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
