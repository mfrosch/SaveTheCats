jQuery( document ).ready(function($) {
	
	
	
	$(document).keydown(function(e) {
		
		var catcherwidth = parseInt($('#catcher').css('width'));
		var currentleft = parseInt($('#catcher').css('left'));
		var parentwidth = parseInt($('#wrapper').css('width'));
		var steps = 5;
		var step = parentwidth / steps;
		var maxstep = step*5;
		var minstep = step - catcherwidth;

		
	    switch(e.which) {
	        case 37: // left
	        	var newleft = currentleft - step;
	        	if (newleft >= minstep)
        		{
	        		$('#catcher').css('left', newleft);	
        		}
	        break;

	        case 38: // up
	        break;

	        case 39: // right
	        	var newleft = currentleft + step;
	        	if (newleft <= maxstep)
        		{	        	
	        		$('#catcher').css('left', newleft);
        		}
	        break;

	        case 40: // down
	        break;

	        default: return; // exit this handler for other keys
	    }
	    e.preventDefault(); // prevent the default action (scroll / move caret)
	});
});