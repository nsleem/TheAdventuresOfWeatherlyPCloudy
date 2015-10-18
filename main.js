//Make sure we're using 2D rendering
use2D = true;
//Initialize Brine. This must be after setting use2D
initGame("canvas");

initMusic(sounds[0]);

//This is the book cover
var bookSprite =  makeSprite(500, 600, 150, 20, 
	'http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/menu%20and%20logo/bookCover.png' );
world.addChild(bookSprite);

//This is the start button that the player will press down on to go to firstLevel()
var startButton = makeSprite(150, 75, 800, 250,
	'http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/menu%20and%20logo/start.png');
world.addChild(startButton);

var creditButton = makeSprite(150, 100, 800, 400,
	'http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/menu%20and%20logo/creditsv2.png' );
world.addChild(creditButton);

var badgerLogo = makeSprite(200,200,1150,0,
	'http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/menu%20and%20logo/logo.png');
world.addChild(badgerLogo);

var internetLabel = makeSprite(250,75,300,475,
	'http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/menu%20and%20logo/internet.png');
world.addChild(internetLabel);


gInput.addMouseUpListener(startButton);

gInput.addMouseUpListener(creditButton);


startButton.onMouseUp = function(){
	if(checkSprite(this, gInput.mouse.x, gInput.mouse.y)){
		world.removeChild(this);
		world.removeChild(bookSprite);
		world.removeChild(creditButton);
		world.removeChild(badgerLogo);
		world.removeChild(internetLabel);
		level.add_background();
		level.initText();
		level.initQuill();
		initMusic(sounds[1]);
		startingLevel(); 
		this.onMouseUp = function(){};
	}
};

creditButton.onMouseUp = function(){
	if(checkSprite(this, gInput.mouse.x, gInput.mouse.y)){
		this.image = Textures.load('http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/menu%20and%20logo/names.png');
		this.width = this.height = 200;
	}
};


// Create a sprite to manage dragging the other sprites.
var manager = new Sprite();
var copySprite = new Sprite(); 
manager.dragging = false;
manager.target = undefined;
manager.dragOffsetX = 0;
manager.dragOffsetY = 0;

// Make sure to add it to the world.
world.addChild(manager);

// Notify manager anytime the mouse is down. 
// (We "listen" for a mouse down to happen)
gInput.addMouseDownListener(manager);

// Notify manager anytime the mouse is up. 
gInput.addMouseUpListener(manager);

// When the mouse is down...
manager.onMouseDown = function(button){
  // For each draggable sprite...  
  for(var sprite in addedWeather){
    var sp = addedWeather[sprite];
    // If we are clicking on that sprite...
    if(checkSprite(sp, gInput.mouse.x, gInput.mouse.y)){
      // ...update dragging variables.  
      this.dragging = true;
      copySprite.x = sp.x;
      copySprite.y = sp.y;
      copySprite.width = copySprite.height = sp.width;
      copySprite.image = sp.image;
      world.addChild(copySprite);
      this.target = copySprite;
      this.dragOffsetX = gInput.mouse.x-copySprite.x;
      this.dragOffsetY = gInput.mouse.y-copySprite.y;
      break;
    }
  }
};

// When the mouse is up, stop dragging the sprite, and reset the target.
manager.onMouseUp = function(){
  this.dragging = false;
  if(this.target != undefined){
  	for(var i = 0; i < level.objects[level.currLevel].length; i++){
  		if(spritesCollision(level.objects[level.currLevel][i], this.target)){
  			//this.target is NOT the same as the actual bckgnd sprite that was used to create
  			// the event pair.
  			events.doEvent(level.currLevel,lookUpWeather(this.target),level.objects[level.currLevel][i]);
  		}
  	}
  	world.removeChild(this.target);
  }
  this.target = undefined;
  
};

// On every update... 
manager.update = function(d){
  // ...check if we're dragging.
  if(this.dragging){
    // If there is a target to drag...  
    if(this.target != undefined){
      // ...change the target's coordinates using the drag offset.  
      this.target.x = gInput.mouse.x-this.dragOffsetX;
      this.target.y = gInput.mouse.y-this.dragOffsetY;
    }
  }
};

//Looks up the sp in the weatherSprite[] and returns it.
// Sprites being dragged and sprites on the bottom of the 
// screen are both separate sprite objects, so we need to 
// look up the originals to call event functions.
function lookUpWeather(sp){
	for(var i = 0; i < weatherSprites.length; i++){
		if(sp.image == weatherSprites[i].image) return weatherSprites[i];
	}
}

//1
gInput.addBool(49,'one');

//2
gInput.addBool(50,'two');

//3
gInput.addBool(51,'three');

//4
gInput.addBool(52,'four');

//5
gInput.addBool(53,'five');

//6
gInput.addBool(54,'six');

//7
gInput.addBool(55,'seven');

//8
gInput.addBool(56,'eight');

//9
gInput.addBool(57,'nine');

//0
gInput.addBool(48,'zero');

bookSprite.update = function(){
	if(gInput.one){
		startingLevel = firstLevel;
		skipped = false;
		console.log("Starting at First Level");
	}
	if(gInput.two){
		startingLevel = secondLevel;
		skipped = true;
		console.log("Starting at Second Level");
	}
	if(gInput.three){
		startingLevel = thirdLevel;
		skipped = true;
		console.log("Starting at Third Level");
	}
	if(gInput.four){
		startingLevel = fourthLevel;
		skipped = true;
		console.log("Starting at Fourth Level");
	}
	if(gInput.five){
		startingLevel = fifthLevel;
		skipped = true;
		console.log("Starting at Fifth Level");
	}
	if(gInput.six){
		startingLevel = crossRoadP1;
		skipped = true;
		console.log("Starting at cutscene 1");
	}
	if(gInput.seven){
		startingLevel = sixthLevel;
		skipped = true;
		console.log("Starting at Sixth Level");
	}
	if(gInput.eight){
		startingLevel = crossRoadP2;
		skipped = true;
		console.log("Starting at cutscene 2");
	}
	if(gInput.nine){
		startingLevel = finalLevel;
		skipped = true;
		console.log("Starting at Final Level");
	}
	if(gInput.zero){
		startingLevel = theEnd;
		skipped = true;
		console.log("Skipping to the End Scene");
	}
};



