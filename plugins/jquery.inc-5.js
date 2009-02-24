/*

inc v5

A super-tiny client-side include JavaScript jQuery plugin

<http://johannburkard.de/blog/programming/javascript/inc-a-super-tiny-client-side-include-javascript-jquery-plugin.html>

MIT license.

Johann Burkard
<http://johannburkard.de>
<mailto:jb@eaio.com>

*/
(function($){
    
$.fn.inc = function(url, transform, post) {
 return this.each(function() {
  var t = $(this);

  var transfer = function(txt) {
   t.html($.isFunction(transform) ? transform(txt) : txt);
   if (post) {
    post();
   }
  };

  if ($.browser.msie) {

   do {
    var f = 'inc' + (Math.round(Math.random() * 999));
   }
   while ($('#' + f).length);

   $('<iframe><\/iframe>').hide().attr('id', f).bind('readystatechange', function() {
    if (this.readyState == 'complete') {
     transfer(document.frames(f).document.body.innerHTML);
    }
   }).attr('src', url).appendTo(document.body);

  }
  else {
   $.ajax({
    url: url,
    complete: function(res, status) {
     if (status == 'success') transfer(res.responseText);
    }
   });
  }
 });
};

$(function() {
 $('[@class~=inc]').each(function() {
  $(this).inc(unescape(this.className.replace(/.*inc:([^ ]+)( .*|$)/, '$1')));
 });
});

})(jQuery);