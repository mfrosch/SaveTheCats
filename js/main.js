jQuery( document ).ready(function($) {
	
//    var PLAYGROUND_WIDTH	= '500';
//    var PLAYGROUND_HEIGHT	= '500';
    
    var PLAYGROUND_WIDTH	= $(window).width();
    var PLAYGROUND_HEIGHT	= $(window).height();    
	
    // add stage
	$("#playground").playground({width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT, keyTracker: true})
		.addGroup("background", {width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT}).end()
//		.addGroup("fire", {width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT}).end()
		.addGroup("catsdeadline", {width: PLAYGROUND_WIDTH, height: 20, posy:PLAYGROUND_HEIGHT - 20}).end()
		.addGroup("gui", {width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT}).end();
	
	// gui - score
	$("#gui").append("<div id='score'></div>");	

	// deadend for cats
    $("#catsdeadline").addSprite("deadline", {width: PLAYGROUND_WIDTH, height: 20});
	
    // bacgrkound sprites
	var bgHouse = new $.gQ.Animation({imageURL: "img/housetest3.svg"});
//	var bgFireSprite = new $.gQ.Animation({
//				imageURL: "img/firesprite.png",
//				numberOfFrame: 2,
//				delta: 500,
//				rate: 100,
//				type: $.gQ.ANIMATION_VERTICAL
//	});
	
    var HOUSE_WIDTH		= PLAYGROUND_HEIGHT * 1.5; // the house has a aspect ratio of 3:2
    var HOUSE_HEIGHT	= PLAYGROUND_HEIGHT;     
    
    var HOUSE_POSX 		= PLAYGROUND_WIDTH / 2 - HOUSE_WIDTH / 2;
    var HOUSE_POSY		= PLAYGROUND_HEIGHT - HOUSE_HEIGHT;
    $("#background").addSprite("bgHouse", {posx: HOUSE_POSX, posy: HOUSE_POSY, animation: bgHouse,
                width: HOUSE_WIDTH, height: HOUSE_HEIGHT});
    $('#bgHouse').css('background-size', HOUSE_WIDTH + 'px ' + HOUSE_HEIGHT + 'px');  

//    $("#fire").addSprite("bgFire1", {posx: HOUSE_POSX, posy: HOUSE_POSY, animation: bgFireSprite,
//        width: HOUSE_WIDTH, height: HOUSE_HEIGHT});  
    
    // catcher animations
    var catcherAnimation = new Array(3);
    catcherAnimation["idle"] = 	new $.gameQuery.Animation({imageURL: "img/grils.svg"});
//    catcherAnimation["left"] = 	new $.gameQuery.Animation({imageURL: "img/catcher_left.png",
//        	numberOfFrame: 2, delta: 54, rate: 60,
//        	type: $.gameQuery.ANIMATION_VERTICAL});
//	catcherAnimation["right"] = 	new $.gameQuery.Animation({imageURL: "img/catcher_right.png",
//	        numberOfFrame: 2, delta: 50, rate: 60,
//	        type: $.gameQuery.ANIMATION_VERTICAL});
	
	var STEPS = 5;
	var STEP = HOUSE_WIDTH / STEPS;	
	var catcherWidth = STEP;
	var catcherHeight = STEP * 0.665; // ascpect ratio ...
    // catcher sprites
    $.playground().addGroup("actors", {width: HOUSE_WIDTH, height: HOUSE_HEIGHT, posx: HOUSE_POSX, posy: HOUSE_POSY})
    				.addGroup("catcher", {posx: HOUSE_WIDTH/2 - STEP / 2, posy: HOUSE_HEIGHT - catcherHeight*0.3, width: STEP, height: catcherHeight*0.3})
    					.addSprite("catcheridle", {posy: -catcherHeight*0.7, animation: catcherAnimation["idle"], width: STEP, height: catcherHeight});
//						.addSprite("catcherleft",{posx: STEP/2 - 73/2, width: 73, height: 54})
//						.addSprite("catcherright", {posx: STEP/2 - 90/2, width: 90, height: 50});
	
    $("#catcheridle")[0].catcher = new Catcher($("#catcheridle"));
    
	// catcher sprite animations switch
    /*
    $(document).keydown(function(e){
    	switch(e.keyCode){
    		case 65: //this is left! (a)
//    			$("#catcheridle").setAnimation();
//    			$("#catcherleft").setAnimation(catcherAnimation["left"]);
            break;
    		case 68: //this is right (d)
//    			$("#catcheridle").setAnimation();
//    			$("#catcherright").setAnimation(catcherAnimation["right"]);
            break;
        }
      });
    //this is where the keybinding occurs
    $(document).keyup(function(e){
    	switch(e.keyCode){
    		case 65: //this is left! (a)
//				$("#catcherleft").setAnimation();
//          		$("#catcheridle").setAnimation(catcherAnimation["idle"]);
      		break;
    		case 68: //this is right (d)
//    			$("#catcherright").setAnimation();
//    			$("#catcheridle").setAnimation(catcherAnimation["idle"]);
            break;
    	}
    });	
    */
    
    // cats sprites
    var cats = new Array(1); // for beginning only one cat type
    cats[0] = new Array();
    cats[0]["onroof"]	= new $.gQ.Animation({imageURL: "img/cat_onroof.png", numberOfFrame: 2,
    	delta: 92, rate: 60, type: $.gQ.ANIMATION_VERTICAL});
    cats[0]["jump"]	= new $.gQ.Animation({imageURL: "img/cat_jump.png", numberOfFrame: 2,
    	delta: 80, rate: 60, type: $.gQ.ANIMATION_ONCE | $.gQ.ANIMATION_VERTICAL | $.gQ.ANIMATION_CALLBACK});
    cats[0]["fall"]	= new $.gQ.Animation({imageURL: "img/cat_fall.png", numberOfFrame: 2,
    	delta: 104, rate: 60, type: $.gQ.ANIMATION_VERTICAL | $.gQ.ANIMATION_CALLBACK});    
    
    // catcher class
    function Catcher(node) {

    	this.node = node;
        this.catches = 0; 
        
    	var maxstep = STEP*4;
    	var minstep = 0;
    	
        this.catcatch = function() {
    	   this.catches++;
    	   $('#score').html('' + this.catches);
    	   return true;
        };
        
        this.moveright = function() {
        	currentleft = matrixToArray($('#catcher').css('transform'))[4];
        	var newleft = parseInt(currentleft) + parseInt(STEP);
        	
        	if (newleft <= maxstep)
    		{	        	
        		$('#catcher').x(newleft);
    		}	
        };
        
        this.moveleft = function() {
        	currentleft = matrixToArray($('#catcher').css('transform'))[4];
        	var newleft = parseInt(currentleft) - parseInt(STEP);
        	if (newleft >= minstep)
    		{
        		$('#catcher').x(newleft);	
    		}	
        };      
    }
    
    // cat class
    function Cat(node){
    	
        this.node = $(node);
        this.stayonroof = 1000;
        this.alreadystayedonroof = 0;
        this.jumptick = 0;
        
        this.update = function(){
        	
        	if ($(this.node).hasClass('onroof'))
    		{
        		this.alreadystayedonroof += 30;	
        		
        		if (this.alreadystayedonroof >= this.stayonroof)
    			{
        			$(this.node).removeClass('onroof');
        			$(this.node).addClass('jump');
        			$(this.node).setAnimation(cats[0]["jump"]);
    			}
    		}
        	else if ($(this.node).hasClass('jump'))
    		{
        		this.jumptick += 1;
        		
        		if (this.jumptick == 2)
    			{
        			$(this.node).removeClass('jump');
        			$(this.node).addClass('fall');       
        			$(this.node).setAnimation(cats[0]["fall"]);
    			}
    		}
        	else
    		{
              this.node.y(5, true);        		
    		}
        	
        };	
    }
    
    var gameOver = false;
    
    
    var catid = 0;
    // add cats
    $.playground().registerCallback(function(){
    	
        if(!gameOver){
            var name = "cat_"+catid;
            catid++;

            var newposx = Math.random()*HOUSE_WIDTH;
            if (newposx < 0)
        	{
            	newposx = 0;
        	}
            else if (newposx > HOUSE_WIDTH - 92) // 92 cat width
        	{
            	newposx = HOUSE_WIDTH - 92;
        	}
            
            $("#actors").addSprite(name, {animation: cats[0]["onroof"], 
                posx: newposx, posy: PLAYGROUND_HEIGHT*0.2, // 92 cat width
                width: 68, height: 92});
            $("#"+name).addClass("cat");
            $("#"+name).addClass("onroof");
            $("#"+name)[0].cat = new Cat($("#"+name));
//            gameOver = true; // DEV
        }
      }, 1000);     
    
    // move cats
    $.playground().registerCallback(function(){
        if(!gameOver){
        	
          //Update the movement of the cat
          $(".cat").each(function(){
            this.cat.update();

            var posy = parseInt($(this).css("top"));
            if((posy - PLAYGROUND_HEIGHT) > 0){
              $(this).remove();
              return;
            }            
            
            //Test for collisions
//            var collided = $(this).collision("#playerBody,.group");
            
            var collided = $(this).collision("#catcheridle,#catcher,#actors");
            if(collided.length > 0){
            	$('#catcheridle')[0].catcher.catcatch();
            	$(this).remove();
            }
            else
        	{
                var collideddead = $(this).collision("#deadline,#catsdeadline");
                if(collideddead.length > 0){
//                	console.log('dead');
                	// ONLY FOR DEV REMOVE
                	gameOver = true;
//            		$('#playground').append('<div id="welcomeScreen"><div id="restart"><br><br><center>restart</center></div></div>');
//            		$('#gQ_scenegraph').remove();
                }            	
        	}
          });
        }
      }, 30);    
    
    $( "body" ).on( "click", "#restart", function() {
    	window.location.reload();
    });
    
    // move catcher
//    $.playground().registerCallback(function()
//	{
//        if(!gameOver)
//        {
//            if(jQuery.gameQuery.keyTracker[65]){ //this is left! (a)
//              var nextpos = parseInt($("#catcher").css("left"))-5;
//              if(nextpos > PLAYGROUND_WIDTH - PLAYGROUND_WIDTH - PLAYGROUND_WIDTH/2){
//                $("#catcher").x(-5, true);
//              }
//            }
//            if(jQuery.gameQuery.keyTracker[68]){ //this is right! (d)
//              var nextpos = parseInt($("#catcher").css("left"))+5;
//              if(nextpos < PLAYGROUND_WIDTH - PLAYGROUND_WIDTH/2 - 90){
//            	  $("#catcher").x(+5, true);
//              }
//            }
//        }
//	}, 30);
    
    // CONTROLS
    // KEYBOARD
	$(document).keydown(function(e)	{
		
	    switch(e.which) 
	    {
	        case 65: // left
//	        	moveCatcher('left');
	        	$('#catcheridle')[0].catcher.moveleft();
	        break;
	        case 68: // right
//	        	moveCatcher('right');
	        	$('#catcheridle')[0].catcher.moveright();
	        break;
	        default: return; // exit this handler for other keys
	    }
	    e.preventDefault(); // prevent the default action (scroll / move caret)
	});    
	
	$.playground().addGroup("controls", {width: PLAYGROUND_WIDTH, height: PLAYGROUND_WIDTH});
    $("#controls").addSprite("controlleft", {width: PLAYGROUND_WIDTH/2, height: PLAYGROUND_HEIGHT});
    $("#controls").addSprite("controlright", {width: PLAYGROUND_WIDTH/2, height: PLAYGROUND_HEIGHT, posx: PLAYGROUND_WIDTH/2});
    
	// NO ! click - NO !! if you add touch AND click it will count twice for mobile !
    
	// touch
	$( document ).on( "touchstart", "#controlright", function() {
//		moveCatcher('right');
		$('#catcheridle')[0].catcher.moveright();
	});
	$( document ).on( "touchstart", "#controlleft", function() {
//		moveCatcher('left');
		$('#catcheridle')[0].catcher.moveleft();
	});	 
	
    // start Game
	//initialize the start button
    $("#startbutton").click(function(){
      $.playground().startGame(function(){
        $("#welcomeScreen").fadeTo(400,0,function(){$(this).remove();});
      });
    })	    
    
	$.loadCallback(function(percent){
		$("#loadBar").width(400*percent);
		$("#loadtext").html(""+percent+"%")
	});
    
});
/*
function moveCatcher(direction) {
	var catcherwidth = parseInt($('#catcher').css('width'));
	var currentleft = matrixToArray($('#catcher').css('transform'))[4];
	var parentwidth = parseInt($('#playground').css('width'));
//	var parentwidth = HOUSE_WIDTH;
	var steps = 5;
	var step = parentwidth / steps;
	var maxstep = step*5;
	var minstep = 0;
//	console.log(step);
	if (direction == 'right')
	{
    	var newleft = parseInt(currentleft) + parseInt(step);
    	if (newleft <= maxstep)
		{	        	
    		$('#catcher').x(newleft);
		}			
	}
	else
	{
    	var newleft = parseInt(currentleft) - parseInt(step);
    	if (newleft >= minstep)
		{
    		$('#catcher').x(newleft);	
		}		
	}
}
*/

var matrixToArray = function(str){
    return str.match(/(-?[0-9\.]+)/g);
};
