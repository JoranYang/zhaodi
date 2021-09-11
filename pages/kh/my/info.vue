<template>
	<view class="warp">
		<u-form>
			<block v-if="flag==2">
				<u-form-item v-for="(item,index) in sexList" :key="index" :right-icon="vuex_sex===item.label?'checkbox-mark':''"
				 v-model="vuex_sex" :right-icon-style="iconStyle">
					<u-input :value="item.label" @click="changeSex(item.value,item.label)" :disabled="true" />
				</u-form-item>
			</block>
			<block v-if="flag==3">
				<u-form-item>
					<input type="number" v-model="vuex_phone" @confirm="editPhone" @blur="editPhone" />
				</u-form-item>
			</block>
			<block v-if="flag==4">
				<u-form-item>
					新密码：
					<u-input type="password" v-model="password" />
				</u-form-item>
				<u-form-item>
					确认密码：
					<u-input type="password" v-model="passwordAg" @confirm="confirmPass" @blur="confirmPass" />
				</u-form-item>
			</block>
			<u-toast ref="uToast" />
			<u-modal v-model="show" :content="content" :show-title="false"></u-modal>
		</u-form>
	</view>
</template>

<script>
	import {
		editUser
	} from '@/common/my.js'
	import JSEncrypt from 'jsencrypt'
	import {
		getKey,
		motifyPass,
		getClientKey
	} from '@/common/login.js'
	export default {
		data() {
			return {
				flag: 0,
				titleStyle: {
					fontSize: "32rpx"
				},
				iconStyle: {
					color: '#4DE5A0'
				},
				flagPhoneK: false,
				show: false,
				content: '修改成功',
				sexList: [{
					value: 1,
					label: '男'
				}, {
					value: 0,
					label: '女'
				}],
				sexVal: null,
				password: '',
				passwordAg: ''
			}
		},
		computed: {
			vuex_phone: {
				get() {
					return this.$store.state.vuex_phone
				},
				set(value) {
					this.$store.commit('SET_PHONE', value)
				}
			},
			vuex_sex: {
				get() {
					return this.$store.state.vuex_sex
				},
				set(value) {
					this.$store.commit('SET_SEX', value)
				}
			}
		},
		onLoad(options) {
			this.flag = options.index
		},
		/**
		 * 监听自定义导航栏按钮事件
		 * @param {Object} e
		 */
		onNavigationBarButtonTap(e) {
			console.log(e)
			if (this.flagPhoneK) {
				editUser({
					phone: this.$store.state.vuex_phone,
					sex: this.sexVal
				}).then(res => {
					if (res.code == 0) {
						this.show = true
					}
				})
			}
			if (this.sexVal != null) {
				editUser({
					sex: this.sexVal
				}).then(res => {
					if (res.code == 0) {
						this.show = true
					}
				})
			}

			if (this.passwordAg.length > 0) {
				console.log()
				getClientKey().then(res => {
					var encrypt = new JSEncrypt()
					encrypt.setPublicKey(res.info)
					const d = encrypt.encrypt(JSON.stringify({
						password: this.password
					}))
					motifyPass({
						k: d
					}).then(res => {
						if (res.result) {
							// localStorage.removeItem('chengePassword') // 清除是否修改密码标识
							this.$refs.uToast.show({
								title: '修改成功',
								type: 'success'
							})

							uni.clearStorage()
							setTimeout(() => {
								uni.redirectTo({
									url: '/pages/login/index'
								})
							}, 1000)

						}
					})
				})
			} else if (this.flag === 4) {
				this.$refs.uToast.show({
					title: '请确认是否校验密码',
					type: 'warning'
				})
			}
		},
		methods: {
			/**
			 * 验证手机号码
			 */
			editPhone() {
				const phone = this.$store.state.vuex_phone
				const flagPhone = this.$u.test.mobile(phone)
				this.flagPhoneK = flagPhone
				if (phone) {
					if (!flagPhone) {
						this.$refs.uToast.show({
							title: '手机号码格式不正确',
							type: 'warning'
						})
					}
				} else {
					this.$refs.uToast.show({
						title: '手机号码不能为空',
						type: 'warning'
					})
				}
			},
			/**
			 * 监听用户修改性别
			 * @param {Object} val
			 * @param {Object} label
			 */
			changeSex(val, label) {
				this.$store.commit('SET_SEX', label)
				this.sexVal = val
			},
			confirmPass(e) {
				if (e != this.password) {
					this.$refs.uToast.show({
						title: '密码不一致',
						type: 'warning'
					})
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.warp {
		padding: 0rpx 20rpx;
	}
</style>
