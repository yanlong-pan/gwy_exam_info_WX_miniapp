// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
module.exports = {
	_before: function () { // 通用预处理器

	},
	/**
	 * method1方法描述
	 * @param {string} param1 参数1描述
	 * @returns {object} 返回值描述
	 */
	/* 
	method1(param1) {
		// 参数校验，如无参数则不需要
		if (!param1) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: '参数不能为空'
			}
		}
		// 业务逻辑
		
		// 返回结果
		return {
			param1 //请根据实际需要返回值
		}
	}
	*/
	ask_ai: async function(params) {
		console.log(params)
	// 因涉及费用，ai能力调用均需在服务器端进行，也就是uniCloud云函数或云对象中
		let llmManager = uniCloud.ai.getLLMManager({
			provider: 'azure',
			appId: params.appId
			// apiKey: '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',
			// proxy: 'https://api.openai.com',
		})
		const res = await llmManager.chatCompletion({
		 messages: [
			{
				role: 'system',
				content: `你将完成提取报名截止时间任务。
					若输入中无明确时间信息，请结合下述规则进行推断，并且你的回答应只包含时间，不含推理过程，格式严格为“YYYY-mm-dd hh:mm”。
					若无法推断，则只返回“未知”。规则如下：
					1. 假设今天的日期是2023年11月30日
					2. 若输入是时间段或者可推断为时间段，则截止时间为后面的日期，且必须晚于前面的日期
					3. 若输入中时、分，则补足为23:59
					示例：
					  报名时间：即日起至元月23号。根据规则2知截止日期必须大于“即日”，时、分由规则3补足，故返回“2024-01-23 23:59”
					  报名时间：招聘公告全年有效。根据规则1知今年为2023年，时、分由规则3补足，故返回“2023-12-31 23:59”
					现将规则1中今天的日期更新为${params.collectDate}，其余规则不变，准备好了吗？
			`},
			{
				role: 'user',
				content: params.text
			},
		 ]
		})
		console.log(res.reply);
		return res.reply
	}
	

}
