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
	}, ]
}]