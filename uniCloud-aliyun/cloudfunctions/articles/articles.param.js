// 本文件中的内容将在云对象【运行】时解析为运行参数
// 配置教程参考：https://uniapp.dcloud.net.cn/uniCloud/rundebug.html#run-obj-param

const clientInfo = { // 模拟clientInfo
	uniPlatform: 'web',
	source: 'client', // 调用来源，不传时默认为 client
	clientIP: '127.0.0.1', // 客户端ip，不传时默认为 127.0.0.1
	// userAgent: 'xx MicroMessenger/xxx', // 客户端ua，不传时默认为 HBuilderX
	// uniIdToken: 'xxx',
	appId: "__UNI__749580A", // 应用DCloud AppId
}

// insert({
// 	appId: "__UNI__749580A",
// 	body: "{\"id\":\"1374df441-b55f-42c0-bd08-fbda02c08058\",\"title\":\"自然资源部北海局所属事业单位2024年公开招聘(不含博士研究生岗位)公告ddd\",\"province\":\"1国家\",\"exam_type\":\"事业单位\",\"info_type\":\"招考公告\",\"collect_date\":1703520000,\"apply_deadline\":\"2024-1-11 24:00\",\"html_content\":\"something\"}"
// })

max_collect_date({
	'province': '国家',
	'exam_type': '公务员',
	'info_type': '招考公告',
})