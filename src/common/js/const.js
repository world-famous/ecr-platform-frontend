const CONTENT_TYPE = [
    {
        contenttype:'1',
        contentname:'课件',
        unit:'个',
        extensions:['ppt', 'pptx', 'pdf', 'txt']
    },
    {
        contenttype:'2',
        contentname:'教学设计',
        unit:'个',
        extensions:['doc', 'docx', 'pdf', 'txt']
    },
    {
        contenttype:'3',
        contentname:'拓展文本',
        unit:'个',
        extensions:['doc', 'docx', 'pdf', 'txt']
    },
    {
        contenttype:'4',
        contentname:'试卷',
        unit:'个',
        extensions:['doc', 'docx', 'pdf', 'txt']
    },
    {
        contenttype:'5',
        contentname:'图片',
        unit:'张',
        extensions:['jpg', 'png', 'gif']
    },
    {
        contenttype:'6',
        contentname:'视频',
        unit:'个',
        extensions:['mp4', 'flv', 'wmv', 'avi', 'mpg']
    },
    {
        contenttype:'7',
        contentname:'音频',
        unit:'个',
        extensions:['mp3', 'wma', 'aac']
    },
    {
        contenttype:'8',
        contentname:'动画(SWF)',
        unit:'个',
        extensions:['flv', 'swf']
    },
    {
        contenttype:'9',
        contentname:'动画(H5)',
        unit:'个',
        extensions:['zhtml']
    },
    {
        contenttype:'10',
        contentname:'电子书',
        unit:'个',
        extensions:['epub', 'pdf', 'txt']
    },
    {
        contenttype:'11',
        contentname:'压缩文件',
        unit:'个',
        extensions:['zip']
    },
    {
        contenttype:'12',
        contentname:'其他',
        unit:'个',
        extensions:['zip', 'rar']
    }
];

const ALL_EXTENSIONS = ['docx', 'doc', 'pdf', 'txt', 'ppt', 'pptx', 'flv', 'swf', 'mp3', 'aac', 'mp4', 'mpg', 'avi', 'wmv', 'wma', 'zhtml', 'jpg', 'png', 'gif', 'epub', 'zip', 'rar'];

const SHARE_RANGE = [
	{
		value: '1',
		label: '全网'
	},
	{
		value: '2',
		label: '本省'
	},
	{
		value: '3',
		label: '本市'
	},
	{
		value: '4',
		label: '本区'
	},
	{
		value: '5',
		label: '本校'
	}
];

const SCORE_MNGTYPE = [
	{
		value: '1',
		label: '用户充值'
	},
	{
		value: '2',
		label: '购买校园号'
	},
	{
		value: '3',
		label: '用户登录'
	},
	{
		value: '4',
		label: '完善信息'
	},
	{
		value: '5',
		label: '完成任务 上'
	},
	{
		value: '6',
		label: '上传资源'
	},
	{
		value: '7',
		label: '参与征集资源'
	},
	{
		value: '8',
		label: '参与悬赏资源'
	},
	{
		value: '9',
		label: '评星资源'
	},
	{
		value: '10',
		label: '点赞资源'
	},
	{
		value: '11',
		label: '收藏资源'
	},
	{
		value: '12',
		label: '纠错资源'
	},
	{
		value: '13',
		label: '举报资源属实'
	},
	{
		value: '14',
		label: '发起悬赏资源'
	},
	{
		value: '15',
		label: '订单支付'
	},
	{
		value: '16',
		label: '资源下载'
	},
    {
        value: '17',
        label: '悬赏积分退回'
    },
    {
        value: '18',
        label: '参与评比资源'
    }
];

const SCORE_TYPE = [
    {
        value: '1',
        label: '日常积分'
    },
    {
        value: '2',
        label: '任务积分'
    },
    {
        value: '3',
        label: '活动积分'
    },
    {
        value: '4',
        label: '资源积分'
    },
    {
        value: '5',
        label: '题库积分'
    },
    {
        value: '6',
        label: '充值积分'
    }
];

export { CONTENT_TYPE, SHARE_RANGE, SCORE_MNGTYPE, SCORE_TYPE, ALL_EXTENSIONS };