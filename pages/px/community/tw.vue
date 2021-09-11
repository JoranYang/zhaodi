<template>
	<view>
		<form>
			<view class="cu-form-group">
				<view class="title">标题</view>
				<input placeholder="标题" v-model="contentTitle"></input>
			</view>
			<view class="cu-form-group top">
				<view class="title">内容</view>
				<textarea placeholder="请输入内容" maxlength="-1" :focus="focus" :selection-start="textNum" :selection-end="textNum"
				 fixed @input="textInput" v-model="textValue"></textarea>
			</view>
			<view class="cu-bar bg-white margin-top">
				<view class="action">
					图片上传
				</view>
				<view class="action">
					{{imgList.length}}/9
				</view>
			</view>
			<view class="cu-form-group">
				<u-upload :action="action" ref="uUpload" :file-list="imgList" :header="header" :to-json="true" max-count="9"
				 :show-progress="false"></u-upload>
			</view>
			<view style="text-align: center;">
				<button class="bg-blue margin  round" @click="saveTw">提交</button>
			</view>
		</form>
		<!-- <editor id="editor" class="ql-container" :placeholder="placeholder" @ready="onEditorReady"></editor> -->
	</view>
</template>

<script>
	import {
		twSave
	} from "@/common/community.js";
	export default {
		data() {
			return {
				imgList: [],
				uploadIds: [],

				textNum: -1,
				focus: true,
				atUser: {},
				atUserS: [],
				/**
				 * @param {Object} 问答对象  
				 */
				twObject: {},
				/**
				 * @param {String} 输入内容的值 
				 */
				textValue: '',
				/**
				 * @param {String} 内容标题
				 */
				contentTitle: '',
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
				isClick: true,
				placeholder: '开始输入...'
			};
		},
		onLoad() {
			this.action= this.$baseUrl + 'upload/push'
		},
		methods: {

			// 提交
			saveTw() {
				if (this.isClick) {
					this.isClick = false;
					let files = this.$refs.uUpload.lists //上传图片数组
					const uploadIds = []; //存放图片id
					for (const item of files) {
						uploadIds.push(item.response.data.id);
					}
					const userIds = []; //存储@人的id

					for (const item of this.atUserS) {
						Object.keys(item).forEach(key => {
							userIds.push(item[key])
						})
					}

					const pama = {
						uploadIds: uploadIds.toString(),
						type: 2,
						userIds: userIds,
						contentTitle: this.contentTitle,
						contentBody: this.textValue
					};
					Object.assign(this.twObject, pama)
					twSave(this.twObject).then(res => {
						uni.showToast({
							title: '提交成功',
							icon: 'success'
						});
						setTimeout(() => {
							uni.navigateBack({
								delta: 1,
							})
						}, 1000)
					})
					// 防止用户重复提交信息
					setTimeout(function() {
						this.isClick = true;
					}, 1000); //一秒内不能重复点击
				}

			},

			/**
			 * 监听input值
			 */
			textInput(e) {
				uni.navigateTo({
					url: 'index'
				})
				let textValue = e.detail.value;
				if (Array.isArray(this.atUserS)) {
					if (this.textValue.length > textValue.length) {
						// 删除操作 只做赋值 不做判断是否有@符号
						const zeValue = textValue.match(/\@.*?\t/gi);
						if (zeValue) {
							if (zeValue.length < this.atUserS.length) {
								for (var i = 0; i < this.atUserS.length; i++) {
									if (this.atUserS[i][zeValue[i]] == undefined) {
										textValue = textValue.replace(Object.keys(this.atUserS[i])[0].trim(), '');
										this.atUserS.splice(i, 1);
										console.log('this.data.atUserSaa-->', this.atUserS);
									}
								}
							}
						} else {
							console.log('data.atUserS', this.atUserS[0]);
							textValue = textValue.replace(Object.keys(this.atUserS[0])[0].trim(), '');
							this.atUserS.splice(0, 1);
						}
						this.textValue = textValue;
					} else {
						// 输入操作
						this.textValue = textValue;
						var textIndex = textValue.indexOf('@', this.textValue.length - 1);
						if (textIndex > -1) {
							uni.navigateTo({
								url: './userList?textValue=' + textValue + '&atUserS=' + JSON.stringify(this.atUserS)
							});
						}
					}
				}
			},
			// 编译器
			onEditorReady() {
				uni.createSelectorQuery().select('#editor').context((res) => {
					this.editorCtx = res.context
				}).exec()
			},
			undo() {
				this.editorCtx.undo()
			}
		}
	}
</script>
<style scoped lang="scss">
	.container {
		padding: 10 px;
	}

	#editor {
		width: 100%;
		height: 300 px;
		background-color: #CCCCCC;
	}

	button {
		margin-top: 10 px;
	}
</style>
