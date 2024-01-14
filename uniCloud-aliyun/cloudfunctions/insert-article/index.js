// 简单的使用示例
'use strict';
exports.main = async (event, context) => {
	// const article = event
	// console.log(article)
	const article = JSON.parse(event.body)
	const dbJQL = uniCloud.databaseForJQL({ // 获取JQL database引用，此处需要传入云函数的event和context，必传
		event,
		context
	})
	let inputArticleTitle = article.title
	console.log(inputArticleTitle)
	const existingArticleNum = await dbJQL.collection('custom-articles')
		.where(`title=="${inputArticleTitle}"`)
		.count()
	console.log(existingArticleNum.total)
	if (existingArticleNum.total === 0) {
		const bookQueryRes = await dbJQL.collection('custom-articles').add(article) // 直接执行数据库操作
		return 'Successfully added!'
	} else {
		let msg = `Article with title ${inputArticleTitle} has already been collected!`
		console.log(msg)
		return msg
	}
};