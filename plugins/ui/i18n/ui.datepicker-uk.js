/* Ukrainian (UTF-8) initialisation for the jQuery UI date picker plugin. */
/* Written by Maxim Drogobitskiy (maxdao@gmail.com). */
jQuery(function($){
	$.datepicker.regional['uk'] = {
		clearText: 'Очи�?тити', clearStatus: '',
		closeText: 'Закрити', closeStatus: '',
		prevText: '&#x3c;',  prevStatus: '',
		prevBigText: '&#x3c;&#x3c;', prevBigStatus: '',
		nextText: '&#x3e;', nextStatus: '',
		nextBigText: '&#x3e;&#x3e;', nextBigStatus: '',
		currentText: 'Сьогодні', currentStatus: '',
		monthNames: ['Січень','Лютий','Березень','Квітень','Травень','Червень',
		'Липень','Серпень','Вере�?ень','Жовтень','Ли�?топад','Грудень'],
		monthNamesShort: ['Січ','Лют','Бер','Кві','Тра','Чер',
		'Лип','Сер','Вер','Жов','Ли�?','Гру'],
		monthStatus: '', yearStatus: '',
		weekHeader: '�?е', weekStatus: '',
		dayNames: ['неділ�?','понеділок','вівторок','�?ереда','четвер','п�?тниц�?','�?уббота'],
		dayNamesShort: ['нед','пнд','вів','�?рд','чтв','птн','�?бт'],
		dayNamesMin: ['�?д','Пн','Вт','Ср','Чт','Пт','Сб'],
		dayStatus: 'DD', dateStatus: 'D, M d',
		dateFormat: 'dd.mm.yy', firstDay: 1, 
		initStatus: '', isRTL: false};
	$.datepicker.setDefaults($.datepicker.regional['uk']);
});