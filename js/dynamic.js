$(document).ready(function() {
    addEvents();
});


//moves the green arrow to be aligned underneath the text
function getArrow(el) {
    var arrow = $('#green_arrow');
    arrow.removeClass('hidden');

    var id = el.id;
    var container = $('#' + id + '_arrow_container');
    arrow.appendTo(container);
}

//redo this to be a designed overlay
function contactMe() {
    var contact = prompt('Are you sure you want to talk to me?', 'yes');
    if (contact) {
	window.open('https://sarapearce.net', '_blank');
    }
}

function addEvents() {
    var nav_links = $("#header_wrapper").find("a");
    nav_links.each(function(link){
	link.mouseover(function(){
	    getArrow(link);
	});
    });
}



