<template>
	<view class="wrap">
		<u-navbar :is-back="false" title="" :border-bottom="false">
			<view class="slot-wrap">
				<u-icon name="close" color="#a2a2a3" size="35" style="margin: 15px 0px 0px 15px;" @click="goBack"></u-icon>
			</view>
		</u-navbar>
		<view class="content">
			<view class="head-content">
				<u-avatar class="avatar" size="160" src="/static/logo.jpg"></u-avatar>
				<view class="head-content-title">与使用者共赢、与参与者分享</view>
			</view>
			<u-form :model="userInfo" :rules="rules" ref="userInfo" style="margin-top: 50rpx;" :error-type="errorType">
				<u-form-item prop="username" type="number">
					<u-input placeholder="客户请输入合同号" height="100" placeholder-style="font-size: 15px;color: #c0c4cc;" v-model="userInfo.username"
					 type="text"></u-input>
					<u-icon v-show="acountList.length>0" @click="selectAcount" :name="selectAcountFlag?'arrow-up-fill':'arrow-down-fill'"
					 color="rgb(220, 223, 230)"></u-icon>
				</u-form-item>
				<view v-show="acountList.length>0&&selectAcountFlag" class="select-acount">
					<view class="acount-list" v-for="(item,index) in acountList" :key="index" @tap="selectCurrent(item)">
						<view>{{item.username}}</view>
						<view @tap.stop="closeCurrent(item)" class="acount-close">
							<u-icon name="close" size="15"></u-icon>
						</view>

					</view>
				</view>
				<u-form-item prop="password">
					<u-input type="password" height="100" placeholder-style="font-size: 15px;color: #c0c4cc;" :password-icon="true"
					 v-model="userInfo.password" placeholder="请输入密码"></u-input>
				</u-form-item>
			</u-form>
			<u-button @click="submit" :style="[inputStyle]" class="getCaptcha" :ripple="true">登录</u-button>
		</view>
		<view style="color: #c0c0c0;font-size: 12px;position: fixed;bottom: 15px;width:100%;text-align: center;">
			登录即代表您已同意<text style="color: #0081FF;" @click="goAgreement">《兆弟集团隐私政策》</text>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {
		getKey
	} from '@/common/login.js'
	export default {
		data() {
			return {
				userInfo: {
					username: '',
					password: ''
				},
				rules: {
					username: [{
						required: true,
						message: '请输入账号',
						trigger: 'blur'
					}],
					password: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}]

				},
				/**
				 * 显示模态框状态
				 */
				show: false,
				content: '请前往OA系统找回密码。',
				showLoading: false,
				errorType: ['toast'],
				selectAcountFlag: false, // 判断是否下拉状态
				acountList:''
			}
		},
		computed: {
			inputStyle() {
				let style = {};
				if (this.userInfo.username && this.userInfo.password) {
					style.backgroundColor = this.$u.color['primary'];
				}
				return style;
			}
		},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			this.$refs.userInfo.setRules(this.rules);
		},
		onShow() {
			this.userInfo = {}
			console.log('缓存内容：',uni.getStorageSync('acount'))
			this.acountList = uni.getStorageSync('acount')
		},
		onLoad() {
			/**
			 * @description 用户左滑退出app
			 */
			// #ifdef APP-PLUS
			var page = this.$mp.page.$getAppWebview();
			page.setStyle({
				popGesture: 'none'
			});
			console.log("进来了",uni.getStorageSync('acount'))
			// #endif
		},
		onBackPress(event) {
			plus.runtime.quit();
		},
		methods: {
			/**
			 * 用户登录
			 */
			submit() {
				this.$refs.userInfo.validate(valid => {
					if (valid) {
						uni.removeStorageSync('token')
						uni.showLoading({
							title: '正在登录'
						})
						// #ifdef APP-PLUS
						this.userInfo.cid = plus.push.getClientInfo().clientid
						// #endif
						this.$store.dispatch('loginByUsername', this.userInfo).then((res) => {
							uni.hideLoading()
							console.log(uni.getStorageSync('url'))
							uni.switchTab({
								url: uni.getStorageSync('url')
							})
						})
					}
				})
			},
			goAgreement() {
				uni.navigateTo({
					url: './agreement'
				})
			},
			selectAcount() {
				this.selectAcountFlag = this.selectAcountFlag ? false : true
			},
			/**
			 * @description 监听用户选择下拉框内容
			 * @param {Object} item 当前内容
			 */
			selectCurrent(item) {
				this.userInfo = this.$u.deepClone(item)
				this.selectAcountFlag = this.selectAcountFlag ? false : true
			},
			/**
			 * @description 监听用户删除当前选择的缓存中的账号和密码
			 * @param {Object} item
			 */
			closeCurrent(item) {
				const list = uni.getStorageSync('acount') // 获取缓存中的账号密码
				for (const i in list) {
					if (list[i].username === item.username) {
						list.splice(i, 1)
						break;
					}
				}
				this.acountList = list

				uni.setStorageSync('acount', list)
			},
			goBack() {
				uni.switchTab({
					url: '../index/index'
				})
			}
		},
	}
</script>

<style lang="scss">
	page {
		background: white;
	}

	.head-content {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}

	.head-content-title {
		color: #c0c0c0;
		font-size: 12px;
	}

	.wrap {
		font-size: 28rpx;

		.content {
			width: 600rpx;
			margin: 80rpx auto 0;

			.avatar {
				margin-bottom: 20rpx;
			}

			.title {
				text-align: left;
				font-size: 40rpx;
				font-weight: bold;
				margin-bottom: 20rpx;
			}

			.u-form-item {
				padding: 0;
			}

			input {
				text-align: left;
				margin-bottom: 10rpx;
				padding-bottom: 6rpx;
			}

			.tips {
				color: $u-type-info;
				margin-bottom: 60rpx;
				margin-top: 8rpx;
			}

			.getCaptcha {
				background-color: rgb(152, 208, 255);
				color: $uni-bg-color;
				border: none;
				font-size: 30rpx;
				padding: 8rpx 0;
				margin-top: 30px;
				border-radius: 500px;
				line-height: 35px;

				&::after {
					border: none;
				}
			}

			.alternative {
				color: $u-tips-color;
				display: flex;
				justify-content: space-between;
				margin-top: 20rpx;
			}
		}

		.addSite {
			display: flex;
			justify-content: space-around;
			width: 600rpx;
			line-height: 100rpx;
			position: fixed;
			bottom: 30rpx;
			left: 80rpx;
			border-radius: 60rpx;
			font-size: 30rpx;

			.add {
				display: flex;
				align-items: center;
				color: rgb(83, 194, 64);

				.icon {
					margin-right: 10rpx;
				}
			}
		}
	}

	.select-acount {
		z-index: 9999999;
		background-color: rgb(247, 247, 248);
		border-radius: 6px;
		position: absolute;
		width: 288px;
		padding: 10px 15px;

		.acount-list {
			display: flex;
			padding: 10px 0px;

			.acount-close {
				margin-left: auto;
			}
		}
	}
</style>
