/* Chinese initialisation for the jQuery UI date picker plugin. */
/* Written by Cloudream (cloudream@gmail.com). */
jQuery(function($){
	$.datepicker.regional['zh-CN'] = {
		clearText: '清除', clearStatus: '清除已选日期',
		closeText: '关闭', closeStatus: '�?改�?�当�?选择',
		prevText: '&#x3c;上月', prevStatus: '显示上月',
		prevBigText: '&#x3c;&#x3c;', prevBigStatus: '显示上一年',
		nextText: '下月&#x3e;', nextStatus: '显示下月',
		nextBigText: '&#x3e;&#x3e;', nextBigStatus: '显示下一年',
		currentText: '今天', currentStatus: '显示本月',
		monthNames: ['一月','二月','三月','四月','五月','六月',
		'七月','八月','�?月','�??月','�??一月','�??二月'],
		monthNamesShort: ['一','二','三','四','五','六',
		'七','八','�?','�??','�??一','�??二'],
		monthStatus: '选择月份', yearStatus: '选择年份',
		weekHeader: '周', weekStatus: '年内周次',
		dayNames: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
		dayNamesShort: ['周日','周一','周二','周三','周四','周五','周六'],
		dayNamesMin: ['日','一','二','三','四','五','六'],
		dayStatus: '设置 DD 为一周起始', dateStatus: '选择 m月 d日, DD',
		dateFormat: 'yy-mm-dd', firstDay: 1, 
		initStatus: '请选择日期', isRTL: false};
	$.datepicker.setDefaults($.datepicker.regional['zh-CN']);
});
