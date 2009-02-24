/* Russian (UTF-8) initialisation for the jQuery UI date picker plugin. */
/* Written by Andrew Stromnov (stromnov@gmail.com). */
jQuery(function($){
	$.datepicker.regional['ru'] = {
		clearText: 'Очи�?тить', clearStatus: '',
		closeText: 'Закрыть', closeStatus: '',
		prevText: '&#x3c;Пред',  prevStatus: '',
		prevBigText: '&#x3c;&#x3c;', prevBigStatus: '',
		nextText: 'След&#x3e;', nextStatus: '',
		nextBigText: '&#x3e;&#x3e;', nextBigStatus: '',
		currentText: 'Сегодн�?', currentStatus: '',
		monthNames: ['Январь','Февраль','Март','�?прель','Май','Июнь',
		'Июль','�?вгу�?т','Сент�?брь','Окт�?брь','�?о�?брь','Декабрь'],
		monthNamesShort: ['Янв','Фев','Мар','�?пр','Май','Июн',
		'Июл','�?вг','Сен','Окт','�?о�?','Дек'],
		monthStatus: '', yearStatus: '',
		weekHeader: '�?е', weekStatus: '',
		dayNames: ['во�?кре�?енье','понедельник','вторник','�?реда','четверг','п�?тница','�?уббота'],
		dayNamesShort: ['в�?к','пнд','втр','�?рд','чтв','птн','�?бт'],
		dayNamesMin: ['В�?','Пн','Вт','Ср','Чт','Пт','Сб'],
		dayStatus: 'DD', dateStatus: 'D, M d',
		dateFormat: 'dd.mm.yy', firstDay: 1, 
		initStatus: '', isRTL: false};
	$.datepicker.setDefaults($.datepicker.regional['ru']);
});