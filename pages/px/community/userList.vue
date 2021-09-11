<template>
	<view>
		<view class="cu-bar bg-gray search">
			<view class="search-form round">
				<text class="icon-search"></text>
				<input type="text" placeholder="搜索" v-model="inputValue" confirm-type="search" @input="search"></input>
				<text class="icon-roundclosefill lg" style="font-size:30rpx;" @tap="qxAction"></text>
			</view>
			<view class="action" @tap="qxAction">
				<text class="text-blue">取消</text>
			</view>
		</view>
		<view class="cu-list menu-avatar">
			<view v-for="(item, index) in userList" :key="index" class="cu-item" @tap="pointUser(item)">
				<view class="cu-avatar radius lg" v-if="item.avatar" :style="'background-image:url(' + item.avatar + ');'"></view>
				<view class="cu-avatar radius lg" v-else style="background-image:url(../../../static/login/mine_def_touxiang_3x.png);"></view>
				<view class="content">
					<view class="text-black">
						<text class="text-cut">{{item.username}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const app = getApp();
	import {
		getUserListInfo
	} from "@/common/login.js";

	export default {
		data() {
			return {
				listQuery: {
					pageNum: 0,
					pageSize: 0
				},
				inputValue: '',
				//用户数据列表
				userList: [],
				userListSearch: [],
				prevText: '',
				prevIndex: -1,
				atUser: {},
				atUserS: [],
				textValue: "",
				focus: false,
				textNum: ""
			};
		},

		components: {},
		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			this.prevText = options.textValue;
			this.atUserS = JSON.parse(options.atUserS);
			// console.log('load', this.atUserS); // 获取上个页面 设置输入框自动聚焦及光标位置
			let pages = getCurrentPages();
			let prevPage = pages[pages.length - 2];
			prevPage.textValue = this.prevText
			// console.log(this.prevText)
			prevPage.textNum = this.prevText.length
			prevPage.atUserS = this.atUserS
			prevPage.focus = true
			// console.log('data-->',prevPage)
			this.getUserList();
		},
		methods: {
			/**
			 * 获取用户列表
			 */
			getUserList() {
				getUserListInfo(this.listQuery).then(res => {
					let userList = res.data.pageInfo;
					if (this.atUserS.length > 0) {
						for (const it of this.atUserS) {
							Object.keys(it).forEach(key => {
								userList = userList.filter(item => item.id != it[key])
							});
						}
					}

					for (const k in userList) {
						userList[k].index = Number(k)
						if (userList[k].deptName) {
							userList[k].username = userList[k].username.concat('-').concat(userList[k].deptName)
						}
						if (userList[k].avatar) {
							userList[k].avatar = this.$common.getDownloadUrl(userList[k].avatar)
						}
					}
					this.userListSearch = userList
					this.userList = userList
				});
			},

			/**
			 * 搜索用户
			 */
			search(e) {
				const value = e.detail.value;
				const searchUserList = this.userListSearch.filter(item => item.username.includes(value) == true); //判断是否含有匹配字符

				if (searchUserList.length > 0) {
					this.userList = searchUserList
				} else {
					this.userList = []
				}
			},

			/**
			 * 取消搜索
			 * 请求input值
			 */
			qxAction() {
				this.userList = this.userListSearch
				this.inputValue = null
			},

			/**
			 * 点击艾特某个用户
			 * 并返回上一页
			 */
			pointUser(item) {
				// 获取到选择人的昵称
				let text = this.userListSearch[item.index].username;
				let userId = this.userListSearch[item.index].id;
				let textValue = '@' + text + '\t';
				let pages = getCurrentPages();
				let prevPage = pages[pages.length - 2];
				this.atUser[textValue] = userId;
				this.atUserS.push(this.atUser);
				let valueA = this.prevText.concat(text).concat('\t');
				prevPage.textValue = valueA
				prevPage.$vm.textValue= valueA
				prevPage.$vm.textNum = `${this.prevText}${text}\t`.length
				prevPage.$vm.atUserS = this.atUserS
				prevPage.$vm.focus = true
				pages[pages.length - 2] = prevPage;
				uni.navigateBack({
					delta: 1,
				});
			}

		}
	};
</script>
<style>
	.round {
		border-radius: 12rpx;
	}

	.cu-bar .search-form {
		background-color: #fff;
	}
</style>
