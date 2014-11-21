jQuery( document ).ready(function($) {
	
    var PLAYGROUND_WIDTH	= '500';
    var PLAYGROUND_HEIGHT	= '500';
    
//    var PLAYGROUND_WIDTH	= $(window).width();
//    var PLAYGROUND_HEIGHT	= $(window).height();    
	
	$("#playground").playground({width: PLAYGROUND_WIDTH, height: PLAYGROUND_WIDTH, keyTracker: true})
		.addGroup("background", {width: PLAYGROUND_WIDTH, height: PLAYGROUND_WIDTH}).end()
		.addGroup("fire", {width: PLAYGROUND_WIDTH, height: PLAYGROUND_WIDTH}).end()
		.addGroup("catsdeadline", {width: PLAYGROUND_WIDTH, height: 20, posy:480}).end();
//		.addGroup("cats", {width: PLAYGROUND_WIDTH, height: PLAYGROUND_WIDTH}).end()
//		.addGroup("catcher", {width: PLAYGROUND_WIDTH, height: PLAYGROUND_WIDTH}).end()
//		.addGroup("gui", {width: PLAYGROUND_WIDTH, height: PLAYGROUND_WIDTH}).end();

	var deadline = new $.gQ.Animation({});
    $("#catsdeadline").addSprite("deadline", {animation: bgHouse,
        width: PLAYGROUND_WIDTH, height: 20});	
	
	var bgHouse = new $.gQ.Animation({imageURL: "img/house.png"});
//	var bgFire1 = new $.gQ.Animation({imageURL: "img/fire1.png"});
//	var bgFire2 = new $.gQ.Animation({imageURL: "img/fire2.png"});
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
    
    var catcherAnimation = new Array(3);
    catcherAnimation["idle"] = 	new $.gameQuery.Animation({imageURL: "img/catcher_idle.png"});
    catcherAnimation["left"] = 	new $.gameQuery.Animation({imageURL: "img/catcher_left.png",
        numberOfFrame: 2, delta: 54, rate: 60,
        type: $.gameQuery.ANIMATION_VERTICAL});
	catcherAnimation["right"] = 	new $.gameQuery.Animation({imageURL: "img/catcher_right.png",
	        numberOfFrame: 2, delta: 50, rate: 60,
	        type: $.gameQuery.ANIMATION_VERTICAL});
	
	
    // Initialize the background
    $.playground().addGroup("actors", {width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT})
            .addGroup("catcher", {posx: PLAYGROUND_WIDTH/2, posy: PLAYGROUND_HEIGHT - 54,
                  width: 90, height: 54})
              .addSprite("catcheridle", {animation: catcherAnimation["idle"], 
                  width: 78, height: 51})
              .addSprite("catcherleft",{width: 73, height: 54})
              .addSprite("catcherright", {width: 90, height: 50});
	
	
    $(document).keydown(function(e){
        switch(e.keyCode){
          case 65: //this is left! (a)
        	  $("#catcheridle").setAnimation();
            $("#catcherleft").setAnimation(catcherAnimation["left"]);
            
            break;
          case 68: //this is right (d)
        	  $("#catcheridle").setAnimation();
            $("#catcherright").setAnimation(catcherAnimation["right"]);
            break;
        }
      });
      //this is where the keybinding occurs
      $(document).keyup(function(e){
        switch(e.keyCode){
          case 65: //this is left! (a)
            $("#catcherleft").setAnimation();
            $("#catcheridle").setAnimation(catcherAnimation["idle"]);
            break;
          case 68: //this is right (d)
        	  $("#catcherright").setAnimation();
        	  $("#catcheridle").setAnimation(catcherAnimation["idle"]);
            break;
        }
      });	
    
    var cats = new Array(1); // for beginning only one cat type
    cats[0] = new Array();
    cats[0]["onroof"]	= new $.gQ.Animation({imageURL: "img/cat_onroof.png", numberOfFrame: 2,
        delta: 92, rate: 60, type: $.gQ.ANIMATION_VERTICAL});
    cats[0]["jump"]	= new $.gQ.Animation({imageURL: "img/cat_jump.png", numberOfFrame: 2,
        delta: 80, rate: 60, type: $.gQ.ANIMATION_ONCE | $.gQ.ANIMATION_VERTICAL | $.gQ.ANIMATION_CALLBACK});
    cats[0]["fall"]	= new $.gQ.Animation({imageURL: "img/cat_fall.png", numberOfFrame: 2,
        delta: 104, rate: 60, type: $.gQ.ANIMATION_VERTICAL | $.gQ.ANIMATION_CALLBACK});    
    
    
    
    
    
    function Catcher(node) {

    	this.node = node;
        this.catches = 0; 
         
        this.catcatch = function() {
    	   this.catches++;
    	   return true;
        };
    }
    
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
    
    // add cats
    $.playground().registerCallback(function(){
    	
        if(!gameOver){
            var name = "cat_"+Math.ceil(Math.random()*1000);

            $("#actors").addSprite(name, {animation: cats[0]["onroof"], 
                posx: Math.random()*PLAYGROUND_WIDTH, posy: PLAYGROUND_HEIGHT*0.2,
                width: 68, height: 92});
            $("#"+name).addClass("cat");
            $("#"+name).addClass("onroof");
            $("#"+name)[0].cat = new Cat($("#"+name));
//            gameOver = true; // DEV
        }
      }, 1000);     
    
    var score = 0;
    
    // move da cats
    $.playground().registerCallback(function(){
//    	console.log(gameOver);
        if(!gameOver){
        	
          //Update the movement of the enemies
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
            	score++;
//            	console.log(score);
            	$(this).remove();
            }
            else
        	{
                var collideddead = $(this).collision("#deadline,#catsdeadline");
                if(collideddead.length > 0){
//                	console.log('dead');
                	gameOver = true;
                }            	
        	}
          });
        }
      }, 30);    
    
    $.playground().registerCallback(function()
	{
        if(!gameOver)
        {
            if(jQuery.gameQuery.keyTracker[65]){ //this is left! (a)
              var nextpos = parseInt($("#catcher").css("left"))-5;
              if(nextpos > PLAYGROUND_WIDTH - PLAYGROUND_WIDTH - PLAYGROUND_WIDTH/2){
//                $("#catcher").css("left", ""+nextpos+"px");
                $("#catcher").x(-5, true);
              }
            }
            if(jQuery.gameQuery.keyTracker[68]){ //this is right! (d)
              var nextpos = parseInt($("#catcher").css("left"))+5;
              if(nextpos < PLAYGROUND_WIDTH - PLAYGROUND_WIDTH/2 - 90){
//            	  $("#catcher").css("left", ""+nextpos+"px");
            	  $("#catcher").x(+5, true);
              }
            }
        }
	}, 30);
    
    
    
    
    
    
    
    $.playground().startGame(function(){ });    
    
});

//function moveCatcher(direction) {
//	
//	var catcherwidth = parseInt($('#catcher').css('width'));
//	var currentleft = parseInt($('#catcher').css('left'));
//	var parentwidth = parseInt($('#wrapper').css('width'));
//	var steps = 5;
//	var step = parentwidth / steps;
//	var maxstep = step*5;
//	var minstep = step - catcherwidth;
//	
//	if (direction == 'right')
//	{
//    	var newleft = currentleft + step;
//    	if (newleft <= maxstep)
//		{	        	
//    		$('#catcher').css('left', newleft);
//		}			
//	}
//	else
//	{
//    	var newleft = currentleft - step;
//    	if (newleft >= minstep)
//		{
//    		$('#catcher').css('left', newleft);	
//		}		
//	}
//}
