export function isDateString(input) {
	// 正则表达式用于匹配 "yyyy-MM-dd hh:mm" 或 "yyyy-MM-dd" 格式
	const dateFormatRegex = /^(\d{4}-\d{2}-\d{2}( \d{2}:\d{2})?)$/;

	// 使用正则表达式检查输入是否匹配
	return dateFormatRegex.test(input);
}

export function getLocalDatetimeStr(offset) {
	let now = new Date()
	const tzOffset = now.getTimezoneOffset() / 60;
	now.setDate(now.getDate() + offset)
	now = new Date(now.getTime() + (-tzOffset) * 3600 * 1000)
	return now.toISOString().replace('T', ' ').replace('Z', '')
}

export function getDatetimeRange(sOffset, eOffset) {
	return {
		startDatetime: getLocalDatetimeStr(sOffset),
		endDatetime: getLocalDatetimeStr(eOffset)
	}
}