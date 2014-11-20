jQuery( document ).ready(function($) {
	
	/* CONTROL */
	/* Keyboard */
	$(document).keydown(function(e)	{	
	    switch(e.which) 
	    {
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
	
	/* Touch */
	$( document ).on( "touchstart", ".control#right", function() {
		moveCatcher('right');
	});
	
	$( document ).on( "touchstart", ".control#left", function() {
		moveCatcher('left');
	});
	/* END CONTROL */
	
	/* MENU ACTIONS */
	$( document ).on( "click", "#menu .start", function() {
		$('body').trigger( "startGame" );
	});
	
//	$( document ).on( "click", "#menu .exit", function() {
//		if (navigator.app != undefined)
//		{
//			navigator.app.exitApp();	
//		}
//	});
	/* END MENU ACTIONS */

	/* GAME START */
	$( document ).on( "startGame", "body", function() {
		$('.overlay').fadeOut();
		
		addCats(1000, 200);
	});	
	/* END GAME START */
	
	$( document ).on( "catAdded", ".cat", function(e) {
		
		var cat = e.currentTarget;
		
		catJump(cat);
	});		
	
	
});

function addCats(initduration, reduce) {
	
    var timestamp = new Date().getTime();
	waitForFinalEvent(function(){
		
		addCat();
		
		var newduration = initduration - reduce;
		if (newduration <= 0)
		{
			// for dev
			return true;
			
			newduration = initduration;	
		}
		addCats(newduration, reduce);	
		
	}, initduration, timestamp);	
}

function addCat() {
	var position = Math.floor((Math.random() * 5) + 1);
	
	var timestamp = new Date().getTime();
	
	$('#roof').append('<div class="cat pos' + position + ' onroof ' + timestamp + '">CAT</div>');
	
	$('.cat.' + timestamp).trigger( "catAdded" );
}

function catJump(cat) {
    var timestamp = new Date().getTime();
    
//    console.log('init');
//    console.log(cat);
    
	waitForFinalEvent(function(){
//		console.log('exec');
//		console.log(cat);
		cat.remove();
		
	}, 2000, timestamp);		
}

function moveCatcher(direction) {
	
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

var waitForFinalEvent = (function() {
	var timers = {};
	return function(callback, ms, uniqueId) {
		if (!uniqueId) {
			uniqueId = "Don't call this twice without a uniqueId";
		}
		if (timers[uniqueId]) {
			clearTimeout(timers[uniqueId]);
		}
		timers[uniqueId] = setTimeout(callback, ms);
	};
})();