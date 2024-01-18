// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
function formatDateTimeStr(dateString) {
	const parts = dateString.split('-');
	if (parts.length === 3) {
		const [year, month, day] = parts.map(Number);
		const formattedDate = `${year}年${month}月${day}日`;
		return formattedDate;
	} else {
		return dateString;
	}
}

function convertChineseDateToNumeric(inputDate) {
	// 定义中文数字和对应的阿拉伯数字的映射
	const chineseNumbers = ['元', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];

	// 使用正则表达式匹配中文数字并替换为阿拉伯数字
	for (let i = 0; i < chineseNumbers.length; i++) {
		const chineseChar = chineseNumbers[i];
		const regex = new RegExp(chineseChar, 'g');
		inputDate = inputDate.replace(regex, i === 0 ? '1' : i.toString());
	}

	return inputDate;
}
module.exports = {
	_before: function() { // 通用预处理器

	},
	ask_ai: async function(params) {
		console.log(params)
		// 因涉及费用，ai能力调用均需在服务器端进行，也就是uniCloud云函数或云对象中
		let llmManager = uniCloud.ai.getLLMManager({
			provider: 'azure',
			appId: params.appId
			// apiKey: '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',
			// proxy: 'https://api.openai.com',
		})
		const userMsg = convertChineseDateToNumeric(params.text)
		console.log(userMsg)

		const currentYear = params.collectDate.split('-')[0]
		// const formatedDateStr = formatDateTimeStr(params.collectDate)
		const msg = `你将完成提取报名截止时间任务。
					若输入中无明确时间信息，请结合下述规则进行推断，并且你的回答应只包含时间，不含任何其他内容，包括推理过程。时间的格式为“YYYY-mm-dd hh:mm”。
					若无法推断，则只返回“未知”。推断规则如下：
					1. 今/即日是${params.collectDate}
					2. 若输入包含起止时间，则截止时间必须晚于开始日期，即后面的时间大于前面的时间
					3. 若输入中没有时、分信息，则补足为23:59
					示例：
					  输入："报名时间：即日起至1月1号/日"。分析：由于即日是${params.collectDate}, 根据规则2，后面的1月1号/日必须晚于${params.collectDate}，所以你应该返回“2025-01-01 23:59”
					  输入："报名时间：招聘公告全年有效"。分析：全年代表今年，故你应该返回“${currentYear}-12-31 23:59”
					  输入："报名时间：详情见公告"。分析：由于既没有明确时间信息，又无法推断，所以你应该返回“未知”
					现在输入为"${userMsg}"，请给出提取结果
			`
		console.log(msg);
		const res = await llmManager.chatCompletion({
			messages: [{
					role: 'system',
					content: msg
				},
				// {
				// 	role: 'user',
				// 	content: userMsg
				// },
			]
		})
		return res.reply
	}
}