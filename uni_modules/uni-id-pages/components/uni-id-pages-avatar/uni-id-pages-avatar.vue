<template>
	<button open-type="chooseAvatar" @chooseavatar="bindchooseavatar" @click="uploadAvatarImg" class="box"
		:class="{'showBorder':border}" :style="{width,height,lineHeight:height}">
		<cloud-image v-if="avatar_file" :src="avatar_file.url" :width="width" :height="height"></cloud-image>
		<uni-icons v-else :style="{width,height,lineHeight:height}" class="chooseAvatar" type="plusempty" size="30"
			color="#dddddd"></uni-icons>
	</button>
</template>

<script>
	import {
		store,
		mutations
	} from '@/uni_modules/uni-id-pages/common/store.js'
	/**
	 * uni-id-pages-avatar 
	 * @description 用户头像组件
	 * @property {String} width	图片的宽，默认为：50px
	 * @property {String} height	图片的高，默认为：50px
	 */
	export default {
		data() {
			return {
				isPC: false
			}
		},
		props: {
			//头像图片宽
			width: {
				type: String,
				default () {
					return "50px"
				}
			},
			//头像图片高
			height: {
				type: String,
				default () {
					return "50px"
				}
			},
			border: {
				type: Boolean,
				default () {
					return false
				}
			}
		},
		async mounted() {
			// #ifdef H5
			this.isPC = !['ios', 'android'].includes(uni.getSystemInfoSync().platform);
			// #endif
		},
		computed: {
			hasLogin() {
				return store.hasLogin
			},
			userInfo() {
				return store.userInfo
			},
			avatar_file() {
				return store.userInfo.avatar_file
			}
		},
		methods: {
			setAvatarFile(avatar_file) {
				// 使用 clientDB 提交数据
				mutations.updateUserInfo({
					avatar_file
				})
			},
			replaceAvatar(filePath, avatar_file) {
				try {
					uni.showLoading({
						title: "更新中",
						mask: true
					});

					let cloudPath = 'avatar/' + this.userInfo._id + '/' + Date.now()
					avatar_file.name = cloudPath
					uniCloud.importObject('avatar').del_avatar_from_cloud_storage()
						.then(async (res) => {
							console.log('del_avatar: ', res)
							await uniCloud.uploadFile({
								filePath: filePath,
								cloudPath: cloudPath,
								cloudPathAsRealPath: true,
								fileType: "image",
								success: (res) => {
									console.log('uploadImage success, res is:', res)
									avatar_file.url = res.fileID
									uni.hideLoading()
									this.setAvatarFile(avatar_file)
								}
							});
						})

				} catch (e) {
					console.error('error: ', e);
					uni.showToast({
						icon: 'none',
						title: '替换头像失败'
					})
				}
			},
			bindchooseavatar(res) {
				let avatarUrl = res.detail.avatarUrl
				let avatar_file = {
					extname: avatarUrl.split('.')[avatarUrl.split('.').length - 1],
					name: '',
					url: ''
				}
				this.replaceAvatar(avatarUrl, avatar_file)
			},
			uploadAvatarImg(res) {
				// #ifdef MP-WEIXIN
				return false // 微信小程序走 bindchooseavatar方法
				// #endif

				// #ifndef MP-WEIXIN
				if (!this.hasLogin) {
					return uni.navigateTo({
						url: '/uni_modules/uni-id-pages/pages/login/login-withoutpwd'
					})
				};
				const crop = {
					quality: 100,
					width: 600,
					height: 600,
					resize: true
				};
				uni.chooseImage({
					count: 1,
					crop,
					success: (res) => {
						let tempFile = res.tempFiles[0],
							avatar_file = {
								// #ifdef H5
								extname: tempFile.name.split('.')[tempFile.name.split('.').length - 1],
								// #endif
								// #ifndef H5
								extname: tempFile.path.split('.')[tempFile.path.split('.').length - 1]
								// #endif
							},
							filePath = res.tempFilePaths[0]

						this.replaceAvatar(filePath, avatar_file)
					}
				})
				// #endif
			}
		}
	}
</script>

<style>
	/* #ifndef APP-NVUE */
	.box {
		overflow: hidden;
	}

	/* #endif */
	.box {
		padding: 0;
	}

	.chooseAvatar {
		/* #ifndef APP-NVUE */
		display: inline-block;
		box-sizing: border-box;
		/* #endif */
		border-radius: 10px;
		text-align: center;
		padding: 1px;
	}

	.showBorder {
		border: solid 1px #ddd;
	}
</style>