
$(document).ready(function(){/* activate sidebar */
$('#sidebar').affix({
  offset: {
    top: 235
  }
});

/* activate scrollspy menu */
var $body   = $(document.body);
var navHeight = $('.navbar').outerHeight(true) + 10;

$body.scrollspy({
	target: '#leftCol',
	offset: navHeight
});

/* smooth scrolling sections */
$('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top - 50
        }, 1000);
        return false;
      }
    }
});
});

//$(document).ready(function(){
//    $('[data-toggle="tooltip"]').tooltip();
//});
$(document).ready(function(){
    $('[data-toggle="popover"]').popover();
});



$('body').on('click', function (e) {
    $('[data-toggle="popover"]').each(function () {
       
    });
});

$('body').on('click', function (e) {
    $('[data-toggle="popover"]').each(function () {

    });
});


$('#netballVisPanel').mouseover(function () {
    $('#netballVisPanel').css("box-shadow", " 0 0 5px black");

}).mouseout(function () {
    $('#netballVisPanel').css("box-shadow", " 0 0 0px black");
});

$('#dwPanel').mouseover(function () {
    $('#dwPanel').css("box-shadow", " 0 0 5px black");

}).mouseout(function () {
    $('#dwPanel').css("box-shadow", " 0 0 0px black");
});

$('#bbPanel').mouseover(function () {
    $('#bbPanel').css("box-shadow", " 0 0 5px black");

}).mouseout(function () {
    $('#bbPanel').css("box-shadow", " 0 0 0px black");
});

$('#mansionBanditPanel').mouseover(function () {
    $('#mansionBanditPanel').css("box-shadow", " 0 0 5px black");

}).mouseout(function () {
    $('#mansionBanditPanel').css("box-shadow", " 0 0 0px black");
});



$("div.overout")
  .mouseover(function () {
      i += 1;
      $(this).find("span").text("mouse over x " + i);
  })
  .mouseout(function () {
      $(this).find("span").text("mouse out ");
  });
