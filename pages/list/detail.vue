<template>
	<!--
	 本页面模板教程：https://ext.dcloud.net.cn/plugin?id=2717
	 uni-list 文档：https://ext.dcloud.net.cn/plugin?id=24
	 uniCloud 文档：https://uniapp.dcloud.io/uniCloud/README
	 unicloud-db 组件文档：https://uniapp.dcloud.net.cn/uniCloud/unicloud-db-component
	 DB Schema 规范：https://uniapp.dcloud.net.cn/uniCloud/schema
	 -->
	<view class="article">
		<!-- #ifdef APP-PLUS -->
		<uni-nav-bar :statusBar="true" :border="false"></uni-nav-bar>
		<!-- #endif -->
		<view class="article-title">{{ title }}</view>
		<unicloud-db ref="detail" v-slot:default="{data, loading, error, options}" :options="formData"
			collection="custom-articles" :field="field" :getone="true" :where="where" :manual="true" @load="loadData">
			<template v-if="!loading && data">
				<uni-list :border="false">
					<uni-list-item>
						<!-- 通过body插槽定义作者信息内容 -->
						<template v-slot:body>
							<view class="header-content">
								<uni-fav :checked="is_favorite" class="favBtn" :circle="true" bg-color="#dd524d"
									bg-color-checked="#007aff" fg-color="#ffffff" fg-color-checked="#ffffff"
									@click="switchFavArtivle(data._id)" />
							</view>
						</template>
						<template v-slot:footer>
							<view class="footer">
								<view class="uni-note">截止日期：
									<uni-dateformat v-if="isDateString(data.apply_deadline)" :date="data.apply_deadline"
										format="yyyy-MM-dd hh:mm" :threshold="[60000, 2592000000]" />
									<view v-else>
										{{data.apply_deadline}}
									</view>
								</view>
							</view>
						</template>
					</uni-list-item>
				</uni-list>
				<view class="article-content">
					<!-- #ifdef WEB -->
					<u-parse :content="data.html_content" @navigate="navigate" :endHandler="custom_end">
					<!-- #endif -->
						<!-- #ifndef WEB -->
						<u-parse :content="data.html_content" @navigate="navigate">
						<!-- #endif -->
						</u-parse>
				</view>
			</template>
		</unicloud-db>
	</view>
</template>

<script>
	// #ifdef APP
	import UniShare from '@/uni_modules/uni-share/js_sdk/uni-share.js';
	import uniNavBar from '@/uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.vue';
	const uniShare = new UniShare()
	// #endif
	import uParse from "@/components/feng-parse/parse.vue"
	import {
		isDateString
	} from '@/common/utils.js';
	const db = uniCloud.database();
	const readNewsLog = db.collection('read-news-log')
	export default {
		// #ifdef APP
		components: {
			"uni-nav-bar": uniNavBar,
		},
		onBackPress({
			from
		}) {
			if (from == 'backbutton') {
				if (uniShare.isShow) {
					this.$nextTick(function() {
						console.log(uniShare);
						uniShare.hide()
					})
				}
				return uniShare.isShow;
			}
		},
		// #endif
		components: {
			"u-parse": uParse
		},
		data() {
			return {
				// 当前显示 _id
				id: "",
				is_favorite: false,
				title: 'title',
				// 数据表名
				// 查询字段，多个字段用 , 分割
				field: 'apply_deadline,title,html_content',
				formData: {
					noData: '<p style="text-align:center;color:#666">详情加载中...</p>'
				},
				articlesCloudObj: uniCloud.importObject('articles')
			}
		},
		computed: {
			uniStarterConfig() {
				return getApp().globalData.config
			},
			where() {
				//拼接where条件 查询条件 ,更多详见 ：https://uniapp.dcloud.net.cn/uniCloud/unicloud-db?id=jsquery
				return `_id =="${this.id}"`
			}
		},
		onLoad(event) {
			//获取真实新闻id，通常 id 来自上一个页面
			if (event.id) {
				this.id = event.id
			}
			//若上一页传递了标题过来，则设置导航栏标题
			if (event.title) {
				this.title = event.title
				uni.setNavigationBarTitle({
					title: event.title
				})
			}

			this.checkArticleIsFavorited(this.id)

		},
		onReady() {
			// 开始加载数据，修改 where 条件后才开始去加载 clinetDB 的数据 ，需要等组件渲染完毕后才开始执行 loadData，所以不能再 onLoad 中执行
			if (this.id) { // ID 不为空，则发起查询
				this.$refs.detail.loadData()
			} else {
				uni.showToast({
					icon: 'none',
					title: this.$t('listDetail.newsErr')
				})
			}

		},
		onNavigationBarButtonTap(event) {
			if (event.type == 'share') {
				this.shareClick();
			}
		},
		onPullDownRefresh() {
			this.$refs.detail.loadData({
				clear: true
			}, (res) => {
				uni.stopPullDownRefresh()
			})
		},
		methods: {
			$log(...args) {
				console.log('args', ...args, this.id)
			},
			isDateString,
			async checkArticleIsFavorited(articleId) {
				const result = await this.articlesCloudObj.is_favorite({
					'articleId': articleId
				})
				if (result.success && result.data.is_favorite) {
					this.is_favorite = true
				} else {
					this.is_favorite = false
				}
			},
			setReadNewsLog() {
				let item = {
						"article_id": this.id,
						"last_time": Date.now()
					},
					readNewsLog = uni.getStorageSync('readNewsLog') || [],
					index = -1;
				readNewsLog.forEach(({
					article_id
				}, i) => {
					if (article_id == item.article_id) {
						index = i
					}
				})
				if (index === -1) {
					readNewsLog.push(item)
				} else {
					readNewsLog.splice(index, 1, item)
				}
				uni.setStorageSync('readNewsLog', readNewsLog)
				console.log(readNewsLog);
			},
			setFavorite() {
				if (uniCloud.getCurrentUserInfo().tokenExpired < Date.now()) {
					return console.log('未登录用户');
				}
				let article_id = this.id,
					last_time = Date.now();
				console.log({
					article_id,
					last_time
				});
				readNewsLog.where(`"article_id" == "${article_id}" && "user_id"==$env.uid`)
					.update({
						last_time
					})
					.then(({
						result: {
							updated
						}
					}) => {
						console.log('updated', updated);
						if (!updated) {
							readNewsLog.add({
								article_id
							}).then(e => {
								console.log(e);
							}).catch(err => {
								console.log(err);
							})
						}
					}).catch(err => {
						console.log(err);
					})
			},
			loadData(data) {
				//如果上一页未传递标题过来（如搜索直达详情），则从新闻详情中读取标题
				if (this.title == '' && data[0].title) {
					this.title = data[0].title
					uni.setNavigationBarTitle({
						title: data[0].title
					});

				}
				this.setReadNewsLog();
			},
			/**
			 * followClick
			 * 点击关注
			 */
			followClick() {
				uni.showToast({
					title: this.$t('listDetail.follow'),
					icon: 'none'
				});
			},
			/**
			 * 分享该文章
			 */
			// #ifdef APP
			shareClick() {
				let {
					_id,
					title,
					excerpt,
					avatar
				} = this.$refs.detail.dataList
				console.log(JSON.stringify({
					_id,
					title,
					excerpt,
					avatar
				}));
				uniShare.show({
					content: { //公共的分享类型（type）、链接（herf）、标题（title）、summary（描述）、imageUrl（缩略图）
						type: 0,
						href: this.uniStarterConfig.h5.url + `/#/pages/list/detail?id=${_id}&title=${title}`,
						title: this.title,
						summary: excerpt,
						imageUrl: avatar +
							'?x-oss-process=image/resize,m_fill,h_100,w_100' //压缩图片解决，在ios端分享图过大导致的图片失效问题
					},
					menus: [{
							"img": "/static/app-plus/sharemenu/wechatfriend.png",
							"text": this.$t('common.wechatFriends'),
							"share": {
								"provider": "weixin",
								"scene": "WXSceneSession"
							}
						},
						{
							"img": "/static/app-plus/sharemenu/wechatmoments.png",
							"text": this.$t('common.wechatBbs'),
							"share": {
								"provider": "weixin",
								"scene": "WXSceneTimeline"
							}
						},
						{
							"img": "/static/app-plus/sharemenu/mp_weixin.png",
							"text": this.$t('common.wechatApplet'),
							"share": {
								provider: "weixin",
								scene: "WXSceneSession",
								type: 5,
								miniProgram: {
									id: this.uniStarterConfig.mp.weixin.id,
									path: `/pages/list/detail?id=${_id}&title=${title}`,
									webUrl: this.uniStarterConfig.h5.url +
										`/#/pages/list/detail?id=${_id}&title=${title}`,
									type: 0
								},
							}
						},
						{
							"img": "/static/app-plus/sharemenu/weibo.png",
							"text": this.$t('common.weibo'),
							"share": {
								"provider": "sinaweibo"
							}
						},
						{
							"img": "/static/app-plus/sharemenu/qq.png",
							"text": "QQ",
							"share": {
								"provider": "qq"
							}
						},
						{
							"img": "/static/app-plus/sharemenu/copyurl.png",
							"text": this.$t('common.copy'),
							"share": "copyurl"
						},
						{
							"img": "/static/app-plus/sharemenu/more.png",
							"text": this.$t('common.more'),
							"share": "shareSystem"
						}
					],
					cancelText: this.$t('common.cancelShare'),
				}, e => { //callback
					console.log(e);
				})
			},
			// #endif
			// #ifdef WEB
			// 定义文件下载函数
			downloadFile(url, filename) {
				// 使用fetch绕开浏览器同源策略
				fetch(url)
					.then((response) => response.blob())
					.then((blob) => {
						const url = window.URL.createObjectURL(blob);
						// 创建 <a> 元素并触发点击操作进行下载，以避免需要用户手动保存
						const a = document.createElement('a');
						a.style.display = 'none';
						a.href = url;
						a.download = filename;
						document.body.appendChild(a);
						a.click();
						window.URL.revokeObjectURL(url);
					})
					.catch((error) => {
						console.error('下载文件时出错：', error);
					});
			},

			custom_end(node, results) {
				if (node.tag === "a" && node.nodes !== undefined) {
					// 获取链接元素的文字以供后续使用
					node.attr.text = node.nodes.filter(node => node.node === 'text')[0].text;
				}
			},
			// #endif
			navigate(href, e, attr) {
				// #ifdef WEB
				this.downloadFile(href, attr.text)
				// #endif
				// #ifndef WEB
				// 本地临时文件：临时产生，随时会被回收的文件。运行时最多存储 4GB，结束运行后，如果已使用超过 2GB，会以文件为维度按照最近使用时间从远到近进行清理至少于2GB。
				// 详情见 https://developers.weixin.qq.com/miniprogram/dev/framework/ability/file-system.html
				if (href.includes('file') || href.includes('attach')) {
					uni.downloadFile({
						url: href,
						success: function(res) {
							if (res.statusCode === 403) {
								console.log(res)
							} else if (res.statusCode === 200) {
								const filePath = res.tempFilePath;
								uni.openDocument({
									filePath: filePath,
									success: function(res) {
										console.log(`文件打开成功: ${filePath}`);
									}
								});
							}
						}
					});
				}
				// #endif
			},
			switchFavArtivle(articleId) {
				const shouldFav = !this.is_favorite;
				if (shouldFav) {
					this.articlesCloudObj.add_favorite({
						'articleId': articleId
					}).then((res) => {
						console.log('add_favorite is : ', res)
						if (res && !res.success) {
							uni.navigateTo({
								url: "/uni_modules/uni-id-pages/pages/login/login-withoutpwd"
							})
						} else {
							this.is_favorite = shouldFav;
						}
					}).catch((err) => {
						console.log(err)
					});
				} else {
					this.articlesCloudObj.delete_favorite({
						'articleId': articleId
					}).then((res) => {
						console.log('delete_favorite is : ', res)
						if (res && !res.success) {
							uni.navigateTo({
								url: "/uni_modules/uni-id-pages/pages/login/login-withoutpwd"
							})
						} else {
							this.is_favorite = shouldFav;
						}
					}).catch((err) => {
						console.log(err)
					});
				}
			},
		}
	}
</script>

<style scoped>
	.header-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		font-size: 14px;
	}

	/* 标题 */
	.uni-title {
		display: flex;
		margin-bottom: 5px;
		font-size: 14px;
		font-weight: bold;
		color: #3b4144;
	}

	/* 描述 额外文本 */
	.uni-note {
		color: #999;
		font-size: 12px;

		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
	}

	.footer {
		display: flex;
		align-items: center;
	}

	.footer-button {
		display: flex;
		align-items: center;
		font-size: 12px;
		height: 30px;
		color: #fff;
		background-color: #ff5a5f;
	}

	.banner {
		position: relative;
		margin: 0 15px;
		height: 180px;
		overflow: hidden;
	}

	.banner-img {
		position: absolute;
		width: 100%;
	}

	.banner-title {
		display: flex;
		align-items: center;
		position: absolute;
		padding: 0 15px;
		width: 100%;
		bottom: 0;
		height: 30px;
		font-size: 14px;
		color: #fff;
		background: rgba(0, 0, 0, 0.4);
		overflow: hidden;
		box-sizing: border-box;
	}

	.uni-ellipsis {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.article-title {
		padding: 20px 15px;
		padding-bottom: 0;
	}

	.article-content {
		padding: 15px;
		font-size: 15px;
		overflow: hidden;
	}
</style>