<template>
	<view>
		<view>
			<view class="bg-gray">
				<view class="padding">
					<view class="text-black text-bold text-xl">{{community.contentTitle}}</view>
					<image v-if="community.status ===0" class="audit" src="/static/static/tishi/unaudit.png" />
					<image v-if="community.status ===3" class="audit" src="/static/static/tishi/violation.png" />
					<view class="margin-top-sm">
						<view>
							<image v-if="community.avatar" class="cu-avatar xs" :src="community.avatar"
								style="background-color:transparent;"></image>
							<image class="cu-avatar xs round" v-else
								src="/static/static/login/mine_def_touxiang_3x.png"></image>
						</view>
						<view class="margin-left-sm">
							<view>
								<view style="font-weight: bold;color: #485683;">{{community.createdName}}</view>
								<!-- <view style="margin-left:auto;" @tap="delWdInfo"  v-if="flag === 'true'">
									删除
								</view> -->
							</view>
							<view class="margin-top-xs">{{community.CreatedOn | createdOn | timeFrom(false)}}</view>
						</view>
					</view>
				</view>
				<view class="padding" style="background-color: white;">
					<view>
						<u-parse :content="community.contentBody" @preview="preview" @navigate="navigate"></u-parse>
						<image v-for="(item,index) in community.uploads" mode="widthFix" :key="index" :src="item">
						</image>
						<view class="margin-top-sm wpf-right">
							<view class="padding-right-sm wpf-flex-bottom">
								<view
									@tap.stop="community.isCollec === 0?pointCollect(community):pointUnCollect(community)"
									style="display: flex;align-items: center;">
									<image class="margin-lr-xs wpf-image-width"
										:src="community.isCollec === 0?'/static/tishi/collect.png':'/static/tishi/collect-s.png'">
									</image><text class="wpf-gray">{{community.collec}}</text>
								</view>
							</view>
							<view class="padding-right-sm wpf-flex-bottom">
								<view @tap.stop="community.isLike === 0?pointLike(community):pointUnLike(community)"
									style="display: flex;align-items: center;">
									<image class="margin-lr-xs wpf-image-width"
										:src="community.isLike === 0?'/static/tishi/dianzan.png':'/static/tishi/dianzan-s.png'">
									</image><text class="wpf-gray">{{community.like}}</text>
								</view>
							</view>
							<view class="padding-right-sm wpf-flex-bottom" @tap="handleRespond"
								style="display: flex;align-items: center;">
								<image class="margin-lr-xs wpf-image-width" src="/static/tishi/pinlun.png"></image><text
									class="wpf-gray">{{community.respond}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view style="background-color:#dfdfdf;height:10rpx;"></view>
			<view v-if="respondsList.length>0">
				<view v-for="(item, index) in respondsList" :key="index" class="padding wpf-border-top">
					<view style="display: flex;">
						<view>
							<image v-if="item.avatar.length>0" class="cu-avatar xs round" :src="item.avatar"></image>
							<image class="cu-avatar xs round" v-else
								src="/static/static/login/mine_def_touxiang_3x.png"></image>
						</view>
						<view class="margin-left-sm">
							<view style="display:flex;">
								<view style="font-weight: bold;color: #485683;">{{item.createdName}}</view>
								<view style="position: absolute;right: 8px;color:#485683;" @tap="delRes(item)"
									v-if="item.flag">删除</view>
							</view>
							<view class="margin-top-xs wpf-richText">{{item.respondBody}}</view>
						</view>
					</view>
					<view class="margin-top-sm" style="margin-left: 80rpx;">
						<view class="grid flex-sub wpf-padding-lr  col-3 grid-square">
							<view v-for="(img, index2) in item.uploads" :key="index2" class="bg-img"
								:style="'background-image:url(' + img + ');'" @tap="viewImage(img,item.uploads)">
							</view>
						</view>
					</view>
					<view class="wpf-margin-right padding-right-sm wpf-flex-bottom">
						<view @tap="item.isLike === 0?pointRespondLike(item):pointUnRespondLike(item)"
							style="display: flex;">
							<image class="margin-lr-xs wpf-image-width"
								:src="item.isLike === 0?'/static/tishi/dianzan.png':'/static/tishi/dianzan-s.png'">
							</image>
							<view class="wpf-gray" style="margin: auto;">{{item.like}}</view>
						</view>
					</view>
				</view>
			</view>
			<!-- <view v-else style="display: flex;flex-direction: column;align-items: center;">
				<image src="/static/static/tishi/kong.png" style="transform: scale(0.5);" class="tui-photo"></image>
				<text style="position: relative;top: -100rpx;">做第一个评论的人</text>
			</view> -->
			<view v-if="isShow" :style="'bottom:' + inputBottom + 'px'" class="inputBottom">
				<view class="cu-bar search">
					<view class="search-form">
						<input v-model="commnet.respondBody" focus="true" type="text" placeholder="评论"
							confirm-type="done" adjust-position="false" class="padding-left-sm" @focus="inputFocus"
							@blur="inputBlur"></input>
					</view>
					<view class="action" style="width:20%;">
						<button class="cu-btn bg-blue" @click="saveRespond">评论</button>
					</view>
				</view>
				<u-upload :action="action" ref="uUpload" :file-list="imgList" :header="header" :to-json="true"
					max-count="9" :show-progress="false"></u-upload>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		detail,
		respondList,
		saveCommunityContentCollect,
		saveCommunityContentLike,
		pinLun,
		unCommentLike,
		unCommentCollect,
		unCommentDel,
		unCommentDelrRes
	} from "@/common/community.js"; //在使用的View中引入WxParse模块
	import uParse from '@/components/u-parse/u-parse.vue'
	export default {
		components: {
			uParse
		},
		filters: {
			/**
			 * 将服务器时间转化为时间戳
			 * @param {Object} val 服务器时间
			 */
			createdOn(val) {
				const date = new Date(val)
				const timestamp = date.getTime()
				return timestamp
			}
		},
		data() {
			return {
				listQuery: {
					id: '',
					pageSize: 10,
					pageNum: 1
				},
				total: 0,
				flag: false,
				jump: false,
				inputBottom: "",
				article_contentBody: "",

				/**
				 * @param {String} id 内容id  
				 */
				id: '',
				/**
				 * @param {Object} 社区内容对象  
				 */
				community: {},
				/**
				 * @param {Object} 请求参数  
				 */
				reqParam: {},
				/**
				 * @param {Array} 评论列表  
				 */
				respondsList: [],
				/**
				 * @param {String} 是否弹起评论  
				 */
				isShow: false,
				/**
				 * @param {Object} 评论内容  
				 */
				commnet: {},
				/**
				 * @param {Array} 上传图片列表  
				 */
				imgList: [],
				/**
				 * @param {Array} 上传图片的id  
				 */
				uploadIds: [],
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
				}
			};
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			this.action = this.$baseUrl + 'upload/push',
				this.flag = options.flag
			// that.setData({
			// 	flag: options.flag,
			// 	jump: options.jump
			// });
			this.listQuery.id = options.id;
			this.getDetail();
			this.getRespondList();
		},
		methods: {
			/**
			 * @alias 监听用户获取社区内容详情信息
			 */
			getDetail() {
				detail({
					id: this.listQuery.id
				}).then(res => {
					this.community = res.data
					this.community.avatar = this.$common.getDownloadUrl(this.community.avatar)
					this.community.contentBody = this.community.contentBody.replace(/\<img/gi,
						'<img style="max-width:100%;height:auto" ');
					if (this.community.uploads) {
						this.community.uploads = this.community.uploads.split(',');
						let fileImgs = []
						for (const item of this.community.uploads) {
							fileImgs.push(this.$common.getDownloadUrl(item))
						}
						this.community.uploads = fileImgs
					}
				})
			},

			/**
			 * @alias 监听加载评论列表内容
			 */
			getRespondList() {
				const that = this
				respondList(that.listQuery).then(res => {
					const respondList = res.data.pageInfo
					for (const item of respondList) {
						item.avatar = that.$common.getDownloadUrl(item.avatar)
						if (item.uploads) {
							item.uploads = item.uploads.split(',');
							let fileImgs = []
							for (const it of item.uploads) {
								fileImgs.push(this.$common.getDownloadUrl(it))
							}
							item.uploads = fileImgs
						}
					}
					that.total = res.data.total
					that.respondsList = that.respondsList.length > 0 ? that.respondsList.concat(respondList) :
						respondList
				})
			},

			/**
			 * @alias 监听用户收藏
			 */
			pointCollect() {
				this.community.collec++;
				this.community.isCollec = 1;
				this.reqParam = {
					contentId: this.community.id,
					type: this.community.type
				}
				saveCommunityContentCollect(this.reqParam)
			},

			/**
			 * @alias 监听用户取消收藏
			 */
			pointUnCollect() {
				this.community.collec--;
				this.community.isCollec = 0;
				unCommentCollect({
					id: this.community.id
				})
			},

			/**
			 * @alias 监听用户点赞动作
			 * @description type = 1 表示文章点赞
			 */
			pointLike() {
				this.community.like++;
				this.community.isLike = 1;
				this.reqParam = {
					contentId: this.community.id,
					type: this.community.type
				}
				saveCommunityContentLike(this.reqParam)
			},

			/**
			 * @alias 监听用户评论点赞动作事件
			 * @description type = 2 表示评论点赞
			 * @param {Object} item 评论内容
			 */
			pointRespondLike(item) {
				item.like++;
				item.isLike = 1;
				this.reqParam = {
					contentId: item.id,
					type: 2
				}
				saveCommunityContentLike(this.reqParam)
			},

			/**
			 * @alias 监听用户取消点赞动作
			 */
			pointUnLike() {
				this.community.like--;
				this.community.isLike = 0;
				unCommentLike({
					id: this.community.id
				})
			},

			/**
			 * @alias 监听用户取消评论点赞动作
			 * @param {Object} item 评论对象
			 */
			pointUnRespondLike(item) {
				item.like--;
				item.isLike = 0;
				unCommentLike({
					id: item.id
				})
			},

			/**
			 * @param {Object} e
			 * @description 图片预览存在bug 暂未修复
			 */
			viewImage(img, urls) {
				uni.previewImage({
					urls: urls,
					current: img
				})
			},

			/**
			 * @alias 监听用户唤起评论框
			 * @description 调起评论框
			 */
			handleRespond() {
				this.isShow = true
			},

			/**
			 * @alias 监听用户提交保存评论信息动作事件
			 * @return {String} 成功 or 失败
			 */
			saveRespond() {
				this.isShow = false
				this.commnet.type = this.community.type
				this.commnet.contentId = this.community.id
				this.respondsList = []
				let files = this.$refs.uUpload.lists //上传图片数组
				const uploadIds = []; //存放图片id
				for (const item of files) {
					this.uploadIds.push(item.response.data.id);
				}
				this.commnet.uploadIds = this.uploadIds.toString();
				pinLun(this.commnet).then(res => {
					this.getDetail() //刷新详情中的评论数
					this.getRespondList() //刷新评论列表
				})
				this.uploadIds = [] //清除上传图片id列表
				this.imgList = [] //清除上传图片列表
				this.commnet = {} //清除评论对象
			},

			/**
			 * @alias 监听页面触底刷新动作事件
			 */
			onReachBottom() {
				this.listQuery.pageNum++
				const totalPage = Math.ceil(this.total / this.listQuery.pageSize)
				if (totalPage >= this.listQuery.pageNum) {
					this.getRespondList()
				}
			},

			/**
			 * @alias 监听光标聚焦动作事件
			 * @param {Object} e 获取高度
			 */
			inputFocus(e) {
				this.inputBottom = e.detail.height
			},

			/**
			 * @alias 监听失去焦点事件
			 */
			inputBlur() {
				this.inputBottom = 0
			},

			/**
			 * 删除我的回答
			 * @param {id} 问答详请id 
			 */
			// delWdInfo: function(e) {
			// 	const id = e.currentTarget.dataset.id;
			// 	unCommentDel({
			// 		id
			// 	}).then(res => {
			// 		if (res.code == 0) {
			// 			// 标识  提交完成之后，刷新列表页面
			// 			app.globalData.flag = true;

			// 			if (this.jump) {
			// 				uni.redirectTo({
			// 					url: '../../my/myTw/myTw'
			// 				});
			// 			} else {
			// 				uni.switchTab({
			// 					url: '../community'
			// 				});
			// 			}
			// 		}
			// 	});
			// },

			/**
			 * 删除我的评论
			 */
			delRes: function(item) {
				uni.showModal({
					title: '提示',
					content: '是否删除?',
					success(res) {
						if (res.confirm) {
							unCommentDelrRes({
								id: item.id
							}).then(res => {
								this.getRespondList()
							});
						}
					}
				});
			}
		}
	};
</script>
<style>
	/* pages/community/detail/detail.wxss */

	page {
		background-color: #fff;
	}

	.margin-top-sm {
		display: flex;
		align-items: center;
	}

	/* 同级css使用display:flex时，使div右对齐 */

	.wpf-right {
		justify-content: flex-end;
	}

	.wpf-margin-right {
		margin-left: auto;
	}

	.wpf-richText {
		text-align: justify;
		line-height: 1.5;
		font-size: 32rpx;
	}

	.wpf-border-top {
		border-bottom: dashed #bbb;
		border-bottom-width: 1rpx;
	}

	.cu-bar .search-form {
		background-color: #fff;
	}

	.solids::after {
		border: 8rpx solid #fff;
	}

	.cu-form-group {
		padding: 1rpx 30rpx 20rpx 30rpx;
	}

	/*  */

	.inputBottom {
		width: 100%;
		position: fixed;
		left: 0rpx;
		bottom: 0rpx;
		background-color: #f0f0f0;
		/* height: 100rpx; */
		box-sizing: border-box;
		/* padding: 18rpx 10rpx; */
	}

	.wpf-flex-bottom {
		align-items: flex-end;
		justify-content: flex-end;
		display: flex;
	}

	.wpf-image-width {
		width: 16px;
		height: 16px;
	}

	.wpf-padding-lr {
		padding-right: 0rpx;
		padding-top: 30rpx;
	}

	/* 图片自适应 */
	rich-text .wscnph {
		width: 100%;
		height: auto;
	}

	.wpf-gray {
		color: #dfdfdf;
	}

	.audit {
		width: 50px;
		height: 50px;
		position: absolute;
		right: 20px;
		top: 20px;
	}
</style>
