/* Bulgarian initialisation for the jQuery UI date picker plugin. */
/* Written by Stoyan Kyosev (http://svest.org). */
jQuery(function($){
    $.datepicker.regional['bg'] = {
		clearText: 'изчи�?ти', clearStatus: 'изчи�?ти актуалната дата',
        closeText: 'затвори', closeStatus: 'затвори без промени',
        prevText: '&#x3c;назад', prevStatus: 'покажи по�?ледни�? ме�?ец',
		prevBigText: '&#x3c;&#x3c;', prevBigStatus: '',
        nextText: 'напред&#x3e;', nextStatus: 'покажи �?ледващи�? ме�?ец',
		nextBigText: '&#x3e;&#x3e;', nextBigStatus: '',
        currentText: 'дне�?', currentStatus: '',
        monthNames: ['Януари','Февруари','Март','�?прил','Май','Юни',
        'Юли','�?вгу�?т','Септември','Октомври','�?оември','Декември'],
        monthNamesShort: ['Яну','Фев','Мар','�?пр','Май','Юни',
        'Юли','�?вг','Сеп','Окт','�?ов','Дек'],
        monthStatus: 'покажи друг ме�?ец', yearStatus: 'покажи друга година',
        weekHeader: 'Wk', weekStatus: '�?едмица от ме�?еца',
        dayNames: ['�?едел�?','Понеделник','Вторник','Ср�?да','Четвъртък','Петък','Събота'],
        dayNamesShort: ['�?ед','Пон','Вто','Ср�?','Чет','Пет','Съб'],
        dayNamesMin: ['�?е','По','Вт','Ср','Че','Пе','Съ'],
        dayStatus: 'Сложи DD като първи ден от �?едмицата', dateStatus: 'Избери D, M d',
        dateFormat: 'dd.mm.yy', firstDay: 1,
        initStatus: 'Избери дата', isRTL: false};
    $.datepicker.setDefaults($.datepicker.regional['bg']);
});
