const examTypeOptions = [{
		label: '公务员',
		value: '公务员'
	},
	{
		label: '事业单位',
		value: '事业单位'
	},
	{
		label: '教师',
		value: '教师'
	},
	{
		label: '医疗',
		value: '医疗'
	},
	{
		label: '选调',
		value: '选调'
	},
	{
		label: '遴选',
		value: '遴选'
	}, {
		label: '选调生',
		value: '选调生'
	}, {
		label: '三支一扶',
		value: '三支一扶'
	}, {
		label: '大学生村官',
		value: '大学生村官'
	}, {
		label: '基层工作者',
		value: '基层工作者'
	}, {
		label: '银行',
		value: '银行'
	}, {
		label: '国企',
		value: '国企'
	}, {
		label: '公益性岗位',
		value: '公益性岗位'
	}
]

const infoTypeOptions = [{
		label: '招考公告',
		value: '招考公告'
	},
	{
		label: '通知公示',
		value: '通知公示'
	},
]

const provinces = [{
		label: '国家',
		value: '国家',
	}, {
		label: '安徽',
		value: '安徽',
	},
	{
		label: '北京',
		value: '北京',
	}, {
		label: '重庆',
		value: '重庆',
	}, {
		label: '福建',
		value: '福建',
	}, {
		label: '广东',
		value: '广东',
	}, {
		label: '甘肃',
		value: '甘肃',
	}, {
		label: '广西',
		value: '广西',
	}, {
		label: '贵州',
		value: '贵州',
	}, {
		label: '河北',
		value: '河北',
	}, {
		label: '湖北',
		value: '湖北',
	}, {
		label: '黑龙江',
		value: '黑龙江',
	}, {
		label: '河南',
		value: '河南',
	}, {
		label: '海南',
		value: '海南',
	}, {
		label: '湖南',
		value: '湖南',
	}, {
		label: '吉林',
		value: '吉林',
	}, {
		label: '江苏',
		value: '江苏',
	}, {
		label: '江西',
		value: '江西',
	}, {
		label: '辽宁',
		value: '辽宁',
	}, {
		label: '内蒙古',
		value: '内蒙古',
	}, {
		label: '宁夏',
		value: '宁夏',
	}, {
		label: '青海',
		value: '青海',
	}, {
		label: '四川',
		value: '四川',
	}, {
		label: '山东',
		value: '山东',
	}, {
		label: '上海',
		value: '上海',
	}, {
		label: '山西',
		value: '山西',
	}, {
		label: '陕西',
		value: '陕西',
	}, {
		label: '天津',
		value: '天津',
	}, {
		label: '西藏',
		value: '西藏',
	}, {
		label: '新疆',
		value: '新疆',
	}, {
		label: '云南',
		value: '云南',
	}, {
		label: '浙江',
		value: '浙江',
	}, {
		label: '香港',
		value: '香港',
	}, {
		label: '澳门',
		value: '澳门',
	}, {
		label: '台湾',
		value: '台湾',
	},
]

export const DropdownMenu = [{
	title: '分类筛选',
	type: 'filter',
	children: [{
		title: '考试类型',
		type: 'checkbox',
		value: [],
		options: examTypeOptions
	}, {
		title: '公告类型',
		type: 'checkbox',
		value: [],
		options: infoTypeOptions
	}, {
		title: '省份',
		type: 'checkbox',
		value: [],
		options: provinces
	}, ]
}]