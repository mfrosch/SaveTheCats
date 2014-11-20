jQuery( document ).ready(function($) {
	
    var PLAYGROUND_WIDTH	= '500';
    var PLAYGROUND_HEIGHT	= '500';
	
	$("#playground").playground({width: PLAYGROUND_WIDTH, height: PLAYGROUND_WIDTH})
		.addGroup("background", {width: PLAYGROUND_WIDTH, height: PLAYGROUND_WIDTH}).end()
		.addGroup("fire", {width: PLAYGROUND_WIDTH, height: PLAYGROUND_WIDTH}).end();
//		.addGroup("cats", {width: PLAYGROUND_WIDTH, height: PLAYGROUND_WIDTH}).end()
//		.addGroup("catcher", {width: PLAYGROUND_WIDTH, height: PLAYGROUND_WIDTH}).end()
//		.addGroup("gui", {width: PLAYGROUND_WIDTH, height: PLAYGROUND_WIDTH}).end();

	var bgHouse = new $.gQ.Animation({imageURL: "img/house.png"});
	var bgFire1 = new $.gQ.Animation({imageURL: "img/fire1.png"});
	var bgFire2 = new $.gQ.Animation({imageURL: "img/fire2.png"});
	var bgFireSprite = new $.gQ.Animation({
				imageURL: "img/firesprite.png",
				numberOfFrame: 2,
				delta: 500,
				rate: 100,
				type: $.gQ.ANIMATION_VERTICAL
	});

    $("#background").addSprite("bgHouse", {animation: bgHouse,
                width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT});

    $("#fire").addSprite("bgFire1", {animation: bgFireSprite,
        width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT});  
    
//    $.playground().registerCallback(function(){
//        //Offset all the pane:
//        var newPos = (parseInt($("#fire").css("left")) - smallStarSpeed - PLAYGROUND_WIDTH)
//        % (-2 * PLAYGROUND_WIDTH) + PLAYGROUND_WIDTH;
//       $("#fire").css("left", newPos);
//     }, 50);
    
    $.playground().startGame(function(){ });    
    
});

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
