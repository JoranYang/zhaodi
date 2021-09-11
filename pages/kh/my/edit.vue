<template>
	<view class="wrap">
		<view class="siyuan" style="color: black;">
			<u-cell-group>
				<u-cell-item title="用户头像" :title-style="titleStyle" :value-style="titleStyle" :center="true" @click="getChooseImage">
					<u-avatar :src="avatar" size="70" slot="right-icon" mode="square"></u-avatar>
				</u-cell-item>
				<u-cell-item title="用户姓名" :value="lastName" :title-style="titleStyle" :value-style="titleStyle" :arrow="false"></u-cell-item>
				<u-cell-item title="用户性别" :value="vuex_sex" :title-style="titleStyle" :value-style="titleStyle" @click="goInfo(2)"></u-cell-item>
				<u-cell-item title="联系电话" :value="vuex_phone" :title-style="titleStyle" :value-style="titleStyle" @click="goInfo(3)"></u-cell-item>
				<u-cell-item title="修改密码" :title-style="titleStyle" :value-style="titleStyle" @click="goInfo(4)"></u-cell-item>
			</u-cell-group>

		</view>
	</view>
</template>

<script>
	import {
		changeImg,
		editUser,
		list
	} from '@/common/my.js'
	export default {
		data() {
			return {
				titleStyle: {
					fontSize: "32rpx"
				},
				labelPosition: 'left',
				selectShow: false,
				avatar: uni.getStorageSync('avatar'),
				lastName:uni.getStorageSync('lastName')
			}
		},
		computed: {
			vuex_avatar: {
				get() {
					return this.$store.state.vuex_avatar
				},
				set(value) {
					this.$store.commit('SET_AVATAR', value)
				}
			}
		},
		methods: {
			getChooseImage() {
				const that = this
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: function(res) {
						uni.uploadFile({
							// url: 'http://zhaodigroup.cn:13310/admin/api/upload/push',
							url: that.$baseUrl + 'upload/push',
							filePath: res.tempFilePaths[0],
							name: 'file',
							header: {
								token: uni.getStorageSync('token'),
								data: '99',
								type: '2'
							},
							success(r) {
								const uploadData = JSON.parse(r.data)
								if (uploadData.code === 0) {
									// that.vuex_avatar.set(uploadData.data.url)
									// console.log(that.vuex_avatar=that.$common.getDownloadUrl(uploadData.data.url))
									that.avatar = that.$common.getDownloadUrl(uploadData.data.url)
									uni.setStorageSync('avatar',that.$common.getDownloadUrl(uploadData.data.url))
									changeImg({
										avatar: uploadData.data.id
									})
								}
							}
						})
					}
				})
			},
			/**
			 * 跳转编辑页面
			 * @param {Object} index 参数为显示不同的修改内容
			 */
			goInfo(index) {
				uni.navigateTo({
					url: 'info?index=' + index
				})
			},

		}
	}
</script>

<style scoped lang="scss">
	.wrap {
		height: 100vh;
		background-color: #F7F9FB;
	}
</style>
