// 'use strict';
const uniID = require('uni-id-common');

exports.main = async (event, context) => {
	//event为客户端上传的参数
	// console.log('event : ', event)
	const uniIDIns = uniID.createInstance({ // 创建uni-id实例
		context: context,
		// config: {} // 完整uni-id配置信息，使用config.json进行配置时无需传此参数
	})
	payload = await uniIDIns.checkToken(event.uniIdToken)
	//返回数据给客户端
	return {
		'event': event,
		'context': context,
		'payload': payload
	}
};