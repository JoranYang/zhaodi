<template>
	<view class="siyuan">
		<!-- title和时间倒数 -->
		<view class="info">
			<text class="info-title">{{ trainInfo.title }}</text>
			<text class="info-time" v-if="times.minuteTime && trainInfo.trainStudyTime">{{ times.minuteTime }} : {{ times.secondTime }}</text>
		</view>

		<template >
		    <view>
		        <view class="uni-padding-wrap uni-common-mt"  >
		            <view v-if="srcurl">
		                <video  id="myVideo" :src="srcurl"  autoplay="true"  show-loading="false" 
						enable-progress-gesture="false" direction='rate' show-center-play-btn='true' class="video" controls
						@error="videoErrorCallback" ></video>
								
		            </view>
		            
		        </view>
		    </view>
		</template>

		<view class="image">
			<!-- 图片 -->
			<u-parse :content="imgData[0]" v-if="imgData && imgData[0]"></u-parse>
			<u-parse :content="trainInfo.content" v-if="!imgData && !videoData"></u-parse>
		</view>
	</view>
</template>

<script>
import { getTrainDetail, setVideoData, userTrainLog } from '@/common/train.js';
import uParse from '@/components/u-parse/u-parse.vue';

export default {
	name: 'Detail',
	components: {
		uParse
	},
	data() {
		return {
			/**
			 * 倒计时初始值
			 */
			times: {
				minuteTime: '', //倒计时分钟
				secondTime: '' //倒计时秒
			},
			durationTime: 0, //倒计时时长
			/**
			 * 定时器执行次数
			 */
			interval: 0,
			/**
			 * 考试不及格次数
			 */
			amountScore: null,
			/**
			 * 是否禁用按钮
			 */
			disabled: true, //去考试
			trainInfo: {},
			timeId: 0,
			/**
			 * @param {string} 试卷id
			 */
			paperId: '',
			id: '', //当前课程id
			detailInfo: [], //当前课程详情
			imgData: '', //要展示的图片内容
			videoData: '', //要展示的视频内容
			srcurl:'',
			 rate:1
			
		};
	},
	 onReady: function(res) {
		 
			
		},
	onLoad(options) {
		// #ifndef MP-ALIPAY
		
		this.videoContext = uni.createVideoContext('myVideo')
		// #endif
		if (options.amountScore === 'undefined') {
			this.amountScore = 0;
		} else {
			this.amountScore = options.amountScore;
		}
		//
		this.paperId = options.id;
		console.log(this.paperId)
		this.getInfo();
		this.timeId = setInterval(this.studyTime, 10000);
		
	},
	computed: {
		player() {
			return this.$refs.videoPlayer.player;
		}
	},
	methods: {
		
		        videoErrorCallback: function(e) {
					console.log("____________________播放错误_______________")
					console.log(e)
					console.log(e.target)
					console.log(e.target.errMsg)
		         /*   uni.showModal({
		                content: e.target.errMsg,
		                showCancel: true
		            }) */
		        },
		       
		/**
		 * 协调定时器函数
		 * 倒计时
		 */
		close() {
			if (this.durationTime >= 1) {
				//倒计时
				this.durationTime -= 1;
				this.times.minuteTime = this.double(Math.floor((this.durationTime / 60) % 60));
				this.times.secondTime = this.double(Math.floor(this.durationTime % 60));
			} else {
				this.disabled = false;
				//清除倒计时定时器
				clearInterval(this.interval);
				//更改观看状态
				this.setVideoData();
			}
		},
		/**
		 * 获取详请
		 * @param {Object} id
		 */
		getInfo() {
			console.log("----------进入获取详情------------")
			//显示加载中，视频加载速度慢
			uni.showLoading({ title: '加载中', mask: true });
			getTrainDetail({
				id: this.paperId
			}).then(res => {
				this.trainInfo = res.data;
				//把video和图片分开
				const { content } = this.trainInfo;
				this.imgData = content.match(/<p><img (.*?)<\/p>/g);
				console.log("----------进入获取视频地址------------")
				this.videoData = content.match(/https:\/\/(.*?).(swf|avi|flv|mpg|rm|mov|wav|asf|3gp|mkv|rmvb|mp4)/g);
				
				console.log(this.videoData)
				this.durationTime = this.trainInfo.trainStudyTime * 60;
				this.times.minuteTime = this.double(Math.floor((this.durationTime / 60) % 60));
				this.times.secondTime = this.double(Math.floor(this.durationTime % 60));

				//关闭加载中

				setTimeout(function() {
					uni.hideLoading();
				}, 100);

				//没有视频的情况下，数据请求完毕就执行倒计时操作【定时器】
				if (!this.videoData) {
					this.interval = setInterval(this.close, 1000);
				} else {
					this.srcurl = this.videoData[0];
					this.interval = setInterval(this.close, 1000);
				}
			});
		},

		/**
		 * @param {string}
		 * @description 监听用户阅读时间 向后台发送日志信息
		 */
		studyTime() {
			userTrainLog({ trainId: this.$route.query.id })
				.then(response => {
					return true;
				})
				.catch(err => {
					console.log(err);
				});
		},

		
		/**  视频播放相关  **/
		// 倒计时结束，更新为已经看完
		setVideoData() {
			setVideoData({
				trainId: this.paperId
			}).then(res => console.log(res));
		},

		double(n) {
			if (n < 10) {
				n = '0' + n;
			}
			return n;
		}

		//视频播放进度 -》同步

		/**  视频播放相关 end **/
	},

	destroyed() {
		//清除定时器
		window.clearInterval(this.interval);
		window.clearInterval(this.timeId);
	}
};
</script>

<style scoped lang="scss">
.info {
	margin: 10upx;
	width: 100%;
	height: 80upx;
	line-height: 80upx;
	font-size: 32upx;
	text-align: center;
	/*设置背景渐变，渐变占了60%*/
	background: linear-gradient(
		45deg,
		rgb(245, 241, 234) 25%,
		rgba(85, 136, 170, 0.143) 0,
		rgb(225, 235, 241) 50%,
		rgba(255, 187, 51, 0.068) 0,
		rgba(255, 187, 51, 0.047) 75%,
		rgba(85, 136, 170, 0.081) 0
	);
	/*线性渐变的宽度*/
	background-size: 30px 30px;
	.info-title {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.info-time {
		display: inline-block;
		color: red;
	}
}
.video {
	width:680upx; height:460upx; margin: 30upx;
}
</style>

