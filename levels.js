//Data Structure that manages the data for levels in the game
//
// Controls 'global' sprites: backgrounds, main character, weather bar/elements
// Has 2D array of sprites for 'local' sprites (sprites specific to specific levels)

// [0][0...] should be level 1's content (count starting at 0)
//
//
// should have an init_level function
//
//
// Should have a function that loads all the sprites
// in the array of the current node
//
// Should have a function that unloads a level


// Array of URLs for backgrounds
var backgrounds = [];
backgrounds.push("http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level1%20hill/resizedBackground.png");       //0
backgrounds.push("http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/backgrounds/plain.png");      //1
backgrounds.push("http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level3%20plantTown/resizedBackground.png");                  //2
backgrounds.push("http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level4/forestEdge.png");     						//3
backgrounds.push("http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level5%20forest/resizedBackground.png");  //4
backgrounds.push("http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/backgrounds/crossroad.png"); 	   //5
backgrounds.push("http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level7%20beach/beachBackground.png");    //6
backgrounds.push("http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/backgrounds/crossroad.png"); //7
backgrounds.push("http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/backgrounds/evilField.png");  //8
backgrounds.push("http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level11%20ending/endScene.png");  //9

//Array for the draggable wheather icons. This is static throughout the whole game.
var weatherSprites = [];
weatherSprites.push(makeSprite(75, 75, 50, 525,"http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/weather%20sprites/wind.png"));
weatherSprites.push(makeSprite(75, 75, 150, 525,"http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/weather%20sprites/sun.png"));
weatherSprites.push(makeSprite(75, 75, 250, 525,"http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/weather%20sprites/cloud.png"));
weatherSprites.push(makeSprite(75, 75, 350, 525,"http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/weather%20sprites/rain.png"));
weatherSprites.push(makeSprite(75, 75, 450, 525,"http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/weather%20sprites/lightning.png"));
weatherSprites.push(makeSprite(75, 75, 550, 525,"http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/weather%20sprites/fog.png"));
weatherSprites.push(makeSprite(75, 75, 650, 525,"http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/weather%20sprites/sandstorm.png"));
weatherSprites.push(makeSprite(75, 75, 750, 525,"http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/weather%20sprites/rainbow.png"));


function level_manager(){
	//the static background for the game so that the white canvas does not appear
	this.canvasBackground = makeSprite((canvas.width),(canvas.height),0,0,
			'http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/menu%20and%20logo/parchment.png');
	
	//Global Sprite that manages background of each level
	this.background = makeSprite((canvas.width)-100, (canvas.height)-150, 50, 25, backgrounds[0]);
	
	//Global Sprite that manages main character
	this.hero = makeSprite(100, 150, 350 ,235,"");

	//Global Sprite for text
	
	this.gameText = new TextBox();
	this.gameText.font = 'Harrington';
	this.gameText.fontSize = 20;
	this.gameText.color = '#000000';
    gInput.addMouseUpListener(this.gameText);
	
	// Global Sprite for the quill (the sprite that lets the user know when to click to progress text)
	this.quill = makeSprite(45,45,10,10,"http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/menu%20and%20logo/quill.png");
	
	//Keeps track of what level we are in. Must be set manually when levels change
	// Will be used for array indexing
	this.currLevel = 0;
	
	// Array that holds objects for each level
	this.objects = [[],[],[],[],[],[],[],[],[],[]];
	
	// Add the static parchment background
	this.addStaticParchment = function(){
		world.addChild(this.canvasBackground);
	};
	
	//Adds the background
	this.add_background=function(){
		world.addChild(this.background);
	};
	
	//Init the text
	this.initText=function(){
		world.addChild(this.gameText);
	};
	
	//Go to the next line in the script
	this.nextText=function(){
		scriptIndex += 1;
		this.gameText.text = script[scriptIndex];
	};
	
	//Changes the position of the text
	this.moveText=function(x,y){
		this.gameText.x = x;
		this.gameText.y = y;
	};
	//Removes the text sprite
	this.clearText=function(){
		world.removeChild(this.gameText);
	};
	
	//Makes the quill a child of the gameText 
	this.initQuill=function(){
		this.gameText.addChild(this.quill);
	};
	
	this.moveQuill=function(x,y){
		this.quill.x = x;
		this.quill.y = y;
	};
	//Flips the visibility of the quill
	this.setQuill=function(){
		this.quill.visible = !(this.quill.visible);
	};
	
	//Place the weather sprites bar 
	this.init_weather=function(){
		for(var i = 0; i < weatherSprites.length; i++){
			world.addChild(weatherSprites[i]);
		}
	};
	//Adds a single weather icon to the weather bar
	this.add_weather=function(wSprite){
		world.addChild(wSprite);
	};
	
	//Remove the weater sprites bar
	this.clear_weather=function(){
		for(var i = 0; i < weatherSprites.length; i++){
			world.removeChild(weatherSprites[i]);
		}
	};
	
	//Adds all objects to the world, based on the level passed in.
	this.loadLevel=function(level_num){
		for(var j = 0; j < this.objects[level_num].length; j++){
			world.addChild(this.objects[level_num][j]);
		}
	};
	
	//Removes all objects to the world, based on the lvl passed in.
	this.unloadLevel=function(level_num){
		for(var j = 0; j < this.objects[level_num].length; j++){
			if(this.objects[level_num][j] != undefined && this.objects[level_num][j] != null)
				world.removeChild(this.objects[level_num][j]);
		}
	};
	
	//Add a single object to a specified level
	this.add_obj=function(level_num, sprt){
		this.objects[level_num].push(sprt);
	};
	
}
