jQuery( document ).ready(function($) {
	
	
	
	$(document).keydown(function(e) {
	    switch(e.which) {
	        case 37: // left
	        	moveCatcher('left');
	        break;

	        case 38: // up
	        break;

	        case 39: // right
	        	moveCatcher('right');
	        break;

	        case 40: // down
	        break;

	        default: return; // exit this handler for other keys
	    }
	    e.preventDefault(); // prevent the default action (scroll / move caret)
	});
	
	$( document ).on( "touchstart", ".control#right", function() {
		moveCatcher('right');
	});
	
	$( document ).on( "touchstart", ".control#left", function() {
		moveCatcher('left');
	});
	
	$( document ).on( "click", "#menu .start", function() {
		$('.overlay').fadeOut();
	});
	
	function moveCatcher(direction) 
	{
		var catcherwidth = parseInt($('#catcher').css('width'));
		var currentleft = parseInt($('#catcher').css('left'));
		var parentwidth = parseInt($('#wrapper').css('width'));
		var steps = 5;
		var step = parentwidth / steps;
		var maxstep = step*5;
		var minstep = step - catcherwidth;
		
		if (direction == 'right')
		{
        	var newleft = currentleft + step;
        	if (newleft <= maxstep)
    		{	        	
        		$('#catcher').css('left', newleft);
    		}			
		}
		else
		{
        	var newleft = currentleft - step;
        	if (newleft >= minstep)
    		{
        		$('#catcher').css('left', newleft);	
    		}		
		}
	}
	
});