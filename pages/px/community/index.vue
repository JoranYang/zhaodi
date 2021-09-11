<template>
	<view>
		<u-navbar :is-back="false" :background="background">
			<view class="slot-wrap">
				<view class="search-wrap">
					<!-- 如果使用u-search组件，必须要给v-model绑定一个变量 -->


					<!-- #ifdef APP-PLUS || H5 -->
					<u-search v-model="keyword" :show-action="showAction" height="56" :action-style="{color: '#fff'}"></u-search>
					<!-- #endif -->

				</view>
				<view class="navbar-right">
					<view class="dot-box right-item" @click="showPopup=true">
						<u-icon name="plus" size="28" label="发布" color="#fff" label-color="#fff"></u-icon>
					</view>
				</view>
			</view>
		</u-navbar>
		<scroll-view scroll-x class="bg-white nav text-center">
			<view v-for="(item, index) in communityType" :key="index" class="cu-item" :class="index==TabCur?'text-blue cur':''"
			 @click="tabSelect(item,index)">
				{{item.Interpretation}}
			</view>
		</scroll-view>
		<u-popup mode="bottom" v-model="showPopup" border-radius="14" :closeable="true" :safe-area-inset-bottom="true">
			<view class="content">
				<view style="display: flex;align-items: center;margin: 15px 0px 0px 15px;">
					<u-avatar :src="vuex_avatar" size="50"></u-avatar>
					<text style="margin-left: 10rpx;">{{vuex_name}}</text>
				</view>
				<u-grid :col="5" :border="false">
					<u-grid-item>
						<navigator url="./tw">
							<u-icon name="photo" :size="46"></u-icon>
							<view class="grid-text">知识</view>
						</navigator>
					</u-grid-item>
					<u-grid-item>
						<navigator url="./tw">
							<u-icon name="lock" :size="46"></u-icon>
							<view class="grid-text">文章</view>
						</navigator>
					</u-grid-item>
				</u-grid>
			</view>
		</u-popup>
		<view class="bg-gray" v-if="labelList.length>0" style="margin-top:10rpx;height:3rpx;"></view>
		<!-- 标签 -->
		<scroll-view scroll-x class="bg-white nav text-center">
			<view v-for="(item, index) in labelList" :key="index" class="cu-item" style="padding:0;" @click="tagSelect(item,index)">
				<view class="cu-tag" :class="[TagCur[index]==null?'bg-gray':TagCur[index].select?'bg-blue cur':'bg-gray']">{{item.name}}</view>
			</view>
		</scroll-view>
		<view>
			<!-- <view v-if="communityListInfo.length<=0" style="position: absolute;top: 50%;left: 43%;">暂无数据！</view> -->
			<view v-for="(item, index) in communityListInfo" :key="index">
				<view class="bg-gray" style="margin-top:10rpx;height:3rpx;">
				</view>
				<view class="padding" @click="detail(item)">
					<view>
						<view style="display: flex;">
							<view>
								<image v-if="item.avatar.length>0" class="cu-avatar xs" :src="item.avatar" style="background-color:transparent;"></image>
								<image class="cu-avatar xs round" v-else src="/static/static/login/mine_def_touxiang_3x.png"></image>
							</view>
							<view class="margin-left-sm">
								<view style="font-weight: bold;color: #485683;">{{item.username}}</view>
								<view class="margin-top-xs wpf-richText">{{item.content_title}}</view>
							</view>
							<view v-if="item.flag" style="margin: 0 0 auto auto;color:#485683;" @tap.stop="delWdContent(item)">
								删除
							</view>
						</view>
						<view class="grid flex-sub padding-lr col-3 grid-square">
							<view v-for="(img, index2) in item.banners" :key="index2" class="bg-img" :style="'background-image:url(' + img + ');'"
							 @tap.stop="viewImage(item.banners,img)">
							</view>
						</view>
					</view>
					<view style="display: flex;">
						<view class="wpf-margin-right padding-lr-sm wpf-gray wpf-flex-bottom" style="width: 120rpx;">
							<view class="wpf-flex" @tap.stop="item.isCollec === 0?pointCollect(item):pointUnCollect(item)">
								<image class="margin-lr-xs wpf-image-width" :src="item.isCollec === 0?'/static/tishi/collect.png':'/static/tishi/collect-s.png'" />
								<view class="wpf-flex-center">{{item.collec}}</view>
							</view>
						</view>
						<view style="width: 1px; height: 16px; background: #dfdfdf; margin-top: 10px"></view>
						<view class="padding-lr-sm wpf-gray wpf-flex-bottom" style="width: 120rpx;">
							<view class="wpf-flex" @tap.stop="item.isLike === 0?pointLike(item):pointUnLike(item)">
								<image class="
							 margin-lr-xs wpf-image-width" :src="item.isLike === 0?'/static/tishi/dianzan.png':'/static/tishi/dianzan-s.png'" />
								<view class="wpf-flex-center">{{item.like}}</view>
							</view>
						</view>
						<view style="width: 1px; height: 16px; background: #dfdfdf; margin-top: 10px"></view>
						<view class="padding-lr-sm wpf-gray wpf-flex-bottom">
							<image class="
							margin-lr-xs wpf-image-width" :src="item.respond === 0?'/static/tishi/pinlun.png':'/static/tishi/pinlun-s.png'" />
							<view class="wpf-gray" style="margin-top: 26rpx;">{{item.respond}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<u-tabbar :list="menu" :mid-button="false" active-color="#1779FF"></u-tabbar>
	</view>
</template>

<script>
	import {
		page,
		saveCommunityContentCollect,
		saveCommunityContentLike,
		queryLabelList,
		unCommentLike,
		unCommentCollect,
		unCommentDel
	} from "@/common/community.js";

	import uParse from '@/components/u-parse/u-parse.vue'

	import {
		mapState
	} from "vuex";

	export default {
		data() {
			return {
				TabCur: 0,
				TagCur: [],
				scrollLeft: 0,
				communityListInfo: [],
				inputValue: null,
				listQuery: {
					pageNum: 1,
					pageSize: 5,
					type: 1,
					queryInfo: {
						contentTitle: undefined,
						type: 1,
						contentTags: undefined
					}
				},
				queryInfo: {
					contentTitle: undefined,
					type: 1,
					contentTags: undefined
				},
				total: 0,
				communityType: [],
				menu: uni.getStorageSync('menu'),
				/**
				 * @param {Object} 收藏、点赞 传入参数  
				 */
				communityObject: {},
				/**
				 * @param {String} 关键词搜索  
				 */
				content: undefined,
				/**
				 * @param {Array} 标签列表  
				 */
				labelList: [],
				showAction: false,
				keyword: '',
				/**
				 * @description 弹框标识
				 */
				showPopup: false,
				background: {
					backgroundColor: '#1779FF'
				}
			};
		},
		computed: {
			...mapState({
				userInfo: state => state.userInfo.all
			})
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function() {
			this.getList()
			this.getLableList()
			this.getCommunityType()
			// this.userInfo.
		},

		onShow: function() {
			// if (app.globalData.flag) {
			this.listQuery.pageNum = 1;
			this.communityListInfo = [];
			this.getList();
			// }
		},
		methods: {
			/**
			 * @description 社区内容类型
			 * @return {Array} 返回数据字典
			 */
			getCommunityType() {
				this.$common.getDataDictory('community_type').then(res => {
					this.communityType = res.info
				})
			},

			/**
			 * @alias 监听拉去标签列表信息动作事件
			 */
			getLableList() {
				queryLabelList(this.listQuery).then(res => {
					this.labelList = res.data.pageInfo
				});
			},

			//点击标签查询
			tagSelect(item, index) {
				this.listQuery.pageNum = 1;
				const tagId = index;
				const tId = item.id;
				const type = item.type;
				this.listQuery.queryInfo.type = Number(item.type);
				let tagIds = [];
				this.communityListInfo = [];
				this.TagCur[index] = {
					'select': this.TagCur[index] != null && this.TagCur[index].select ?
						false : true,
					'tagId': tId
				};
				for (const tagItem in this.TagCur) {
					if (this.TagCur[tagItem].select) {
						tagIds.push(this.TagCur[tagItem].tagId)
					}
				}

				this.listQuery.queryInfo.contentTags = tagIds.toString();
				this.getList();
				this.scrollLeft = (tId - 1) * 60
			},

			getList: function() {
				page(this.listQuery).then(res => {
					const communityList = res.data.pageInfo;
					this.total = res.data.total;

					for (const i in communityList) {
						communityList[i].flag = uni.getStorageSync('id') == communityList[i].createdId ? true : false;
						communityList[i].avatar = this.$common.getDownloadUrl(communityList[i].avatar);

						if (communityList[i].banners) {
							communityList[i].banners = communityList[i].banners.split(',');

							for (var k in communityList[i].banners) {
								communityList[i].banners[k] = this.$common.getDownloadUrl(communityList[i].banners[k]);
							}
						}
					}

					this.communityListInfo = this.communityListInfo.length > 0 ? this.communityListInfo.concat(communityList) :
						communityList
				});
			},
			twAction: function() {
				uni.navigateTo({
					url: './tw'
				});
			},

			/**
			 * 点击详情
			 */
			detail: function(item) {
				uni.navigateTo({
					url: './detail?id=' + item.id + '&flag=' + item.flag
				});
			},

			// 图片预览
			viewImage(imagelist, img) {
				uni.previewImage({
					urls: imagelist,
					current: img
				});
			},

			/**
			 * 页面上拉触底事件的处理函数
			 */
			onReachBottom() {
				this.listQuery.pageNum++
				const totalPage = Math.ceil(this.total / this.listQuery.pageSize)
				if (totalPage >= this.listQuery.pageNum) {
					this.getList()
				}
			},


			/**
			 * @alias 监听用户收藏
			 * @param {Object} item 问答内容
			 * @param {Object} index 数组下标
			 */
			pointCollect(item) {
				item.collec++;
				item.isCollec = 1;
				this.communityObject.contentId = item.id
				this.communityObject.type = item.type
				saveCommunityContentCollect(this.communityObject) //请求收藏接口
			},

			/**
			 * @alias 监听用户取消收藏动作事件
			 * @param {Object} item
			 */
			pointUnCollect(item) {
				item.collec--;
				item.isCollec = 0;
				//请求取消收藏的接口
				unCommentCollect({
					id: item.id
				})
			},

			/**
			 * @alias 监听点赞功能
			 * @param {Object} item
			 * @description 修改点赞数量 变为已点赞状态
			 */
			pointLike(item) {
				item.like++;
				item.isLike = 1;
				this.communityObject.contentId = item.id
				this.communityObject.type = item.type
				saveCommunityContentLike(this.communityObject)
			},

			/**
			 * @alias 取消点赞
			 * @param {Object} item 内容对象 
			 */
			pointUnLike(item) {
				item.like--;
				item.isLike = 0;
				unCommentLike({
					id: item.id
				})
			},

			/**
			 * @alias 监听搜索内容
			 * @description 监听搜索内容
			 * @return {Array} 社区内容列表
			 */
			search() {
				this.listQuery.pageNum = 1;
				this.listQuery.queryInfo.contentTitle = this.content;
				this.communityListInfo = []
				this.TagCur = []
				this.getList();
			},

			/**
			 * @alias 监听用户清空搜索框内容
			 * @description 用户青春搜索框
			 */
			delInput() {
				this.listQuery.pageNum = 1;
				this.listQuery.queryInfo = {
					contentTitle: undefined,
					contentTags: undefined,
					type: this.listQuery.type
				}
				this.communityListInfo = []
				this.content = undefined
				this.getList();

			},

			/**
			 * @alias 监听用户 切换tab
			 * @param {Object} item
			 * @param {Object} index
			 */
			tabSelect(item, index) {
				this.listQuery.pageNum = 1;
				this.listQuery.type = item.Code;
				this.listQuery.queryInfo = {
					type: item.Code,
					contentTitle: undefined,
					contentTags: undefined
				}
				this.communityListInfo = [];
				this.TabCur = index
				this.scrollLeft = (index - 1) * 60
				this.getList();
				this.getLableList();
			},

			/**
			 * 删除问答内容
			 * @param id
			 */
			delWdContent(it) {
				const that = this
				uni.showModal({
					title: '提示',
					content: '是否删除?',
					success(res) {
						if (res.confirm) {
							unCommentDel({
								id: it.id
							}).then(res => {
								that.communityListInfo = that.communityListInfo.filter(item => item.id != it.id)
							})
						}
					}
				})
			}

		}
	}
</script>
<style>
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
	}

	.wpf-border-top {
		border-top: dashed #bbb;
		border-top-width: 1rpx;
	}

	/* 新增 */

	.cu-bar .search-form {
		background-color: #fff;
	}

	.nav .cu-item.cur {
		border-bottom: none;
	}

	.nav .cu-item {
		margin: none;
	}

	/* 字体颜色 */

	.wpf-gray {
		color: #dfdfdf;
	}

	.wpf-image-width {
		width: 16px;
		height: 16px;
	}

	.wpf-flex-bottom {
		align-items: flex-end;
		justify-content: center;
		display: flex;
	}

	.padding-lr {
		padding-left: 80rpx;
		padding-right: 0rpx;
		padding-top: 30rpx;
	}

	.round {
		border-radius: 12rpx;
	}

	.wpf-flex {
		display: flex;
	}

	.wpf-flex-center {
		margin: auto 0;
	}

	.slot-wrap {
		display: flex;
		align-items: center;
		flex: 1;
		/* 如果您想让slot内容占满整个导航栏的宽度 */
		/* flex: 1; */
		/* 如果您想让slot内容与导航栏左右有空隙 */
		/* padding: 0 30rpx; */
	}

	.navbar-right {
		margin-right: 24rpx;
		display: flex;
		margin-left: auto;
	}

	.search-wrap {
		width: calc(100% - 80px);
		margin-left: 10px;
	}

	/deep/ .u-close--top-right {
		top: 17px;
	}
</style>
