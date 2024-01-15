// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const uniID = require('uni-id-common');
module.exports = {
	_before() {
		const clientInfo = this.getClientInfo()
		this.uniID = uniID.createInstance({ // 创建uni-id实例，其上方法同uniID
			clientInfo
		})

		this.dbJQL = uniCloud.databaseForJQL({
			clientInfo: this.getClientInfo()
		})

		this.getUid = async () => {
			const token = this.getUniIdToken()
			// 未登录，无token
			if (!token) {
				return [false, undefined]
			}
			payload = await this.uniID.checkToken(token)
			// token验证失败
			if (payload.errCode != 0) {
				return [false, undefined]
			}
			const userId = payload.uid
			return [true, userId]
		}
	},
	insert: async function(params) {
		const httpInfo = this.getHttpInfo()
		const article = JSON.parse(httpInfo.body)
		let inputArticleTitle = article.title
		const existingArticleNum = await this.dbJQL.collection('custom-articles')
			.where(`title=="${inputArticleTitle}"`)
			.count()
		console.log(existingArticleNum.total)
		if (existingArticleNum.total === 0) {
			const bookQueryRes = await this.dbJQL.collection('custom-articles').add(article) // 直接执行数据库操作
			return {
				success: true,
				data: {
					message: "添加成功"
				}
			}
		} else {
			return {
				success: false,
				data: {
					message: `文章重名：${inputArticleTitle}`
				}
			}
		}
	},
	max_collect_date: async function(params) {
		const queryRes = await this.dbJQL.collection('custom-articles').where({
			"province": params.province,
			"exam_type": params.exam_type,
			"info_type": params.info_type,
		}).orderBy("collect_date", "desc").field("collect_date").get()
		if (queryRes.data.length > 0) {
			return {
				success: true,
				data: {
					max_collect_date: queryRes.data[0].collect_date
				}
			}
		} else {
			return {
				success: false
			}
		}
	},
	is_favorite: async function(params) {
		const [
			success,
			userId
		] = await this.getUid()
		if (!success) {
			return {
				success: false,
				data: {
					message: '未登录'
				}
			}
		}
		const queryRes = await this.dbJQL.collection('opendb-news-favorite')
			.where(`article_id == "${params.articleId}" && user_id == "${userId}"`)
			.count()

		return {
			success: true,
			data: {
				is_favorite: queryRes.total === 1
			}
		}
	},
	add_favorite: async function(params) {
		const [
			success,
			userId
		] = await this.getUid()
		if (!success) {
			return {
				success: false,
				data: {
					message: '未登录'
				}
			}
		}

		this.dbJQL.collection('opendb-news-favorite').add({
			article_id: params.articleId,
			user_id: userId
		})
	},
	delete_favorite: async function(params) {
		const [
			success,
			userId
		] = await this.getUid()
		if (!success) {
			return {
				success: false,
				data: {
					message: '未登录'
				}
			}
		}

		this.dbJQL.collection('opendb-news-favorite')
			.where(`article_id == "${params.articleId}" && user_id == "${userId}"`)
			.remove()
	}
}