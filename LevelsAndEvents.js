// We initialize the level and event manager data structures here so that
// it is also available in main.js . Here is also where we will define functions to
// initialize individual levels and their events for the game.

var level = new level_manager();
level.addStaticParchment();


var events = new eventManager();

var addedWeather =  [];

//If you skipped the intro of the game and jumped to a different level,
// we need to know when to do things differently
var startingLevel = firstLevel;
var skipped = false;

//Function to create the first level
function firstLevel(){
	
	level.currLevel = 0;

	
	var apple = makeSprite(50,50,355,75,"http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level1%20hill/apple.png");
	var mc = makeSprite(150, 115, 345 ,235,"http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/spriteSheets/Weatherly/sleepingSheet.png");
	mc.frameWidth = 330;
	mc.frameHeight = 340;
	mc.frameCount = 4;
	mc.frameRate = 1;
	mc.addAnimation('sleeping',0,4);
	mc.animation = 'sleeping';
	level.hero = mc;
	
	level.add_obj(level.currLevel,apple);
	level.add_obj(level.currLevel,mc);
	
	events.createLevelEvent(level.currLevel,weatherSprites[0],apple);
	var E_WindApple = events.findEvent(level.currLevel,weatherSprites[0],apple);
	var appleFalling = function(){
		var yVel = 1.5;
		apple.update = function(){
			if(!spritesCollision(apple,mc)){
				E_WindApple.objectSprite.y += yVel;
			}else{
				world.removeChild(apple);
				mc.image = Textures.load("http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/spriteSheets/Weatherly/wakeUp.png");
				mc.frameWidth = 500;
				mc.frameHeight = 525;
				mc.frameCount = 6;
				mc.frameRate = 1;
				mc.addAnimation('wake_up',0,6);
				mc.addAnimation('standing',4,1);
				mc.animation = 'wake_up';
				mc.frame = 0;
				level.nextText();
				mc.update = function(){
					if(this.frame > 4){
						this.animation = 'standing';
						events.defineEvent(E_WindMc, flyingCharacter);
						this.frame = 0;
					}
				};
			}
		};
	};
	events.defineEvent(E_WindApple, appleFalling); 
	
	events.createLevelEvent(level.currLevel,weatherSprites[0],mc);
	var E_WindMc = events.findEvent(level.currLevel,weatherSprites[0],mc);
	var flyingCharacter = function(){
		level.gameText.visible = false;
		mc.image = Textures.load("http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/Weatherly/flyingRoll.png");
		mc.frameWidth = -1;
		mc.frameHeight = -1;
		mc.frameCount = 1;
		mc.frameRate = 1;
		mc.addAnimation('flying',0,1);
		mc.animation = 'flying';
		xVel = 4;
		yVel = 0.30;
		mc.update = function(){
			this.x += xVel;
			this.y -= yVel;
			this.rotation += DTR(7);
			if(this.x >= level.background.width){
				level.unloadLevel(level.currLevel);
				secondLevel();
			}
		};
	};
	
	level.loadLevel(level.currLevel);
	
	level.moveText(450,125);
	level.moveQuill(95,85);
	level.nextText();
	var clicks = 0;
	level.gameText.onMouseUp = function(){
		if(clicks > 2) return;
		if(checkSprite(level.gameText, gInput.mouse.x, gInput.mouse.y)){
			clicks += 1;
			level.nextText();
			switch(clicks){
				case 1:
					level.moveQuill(10,20);
					break;
				case 2:
					level.moveQuill(10,20);
					break;
			}
			if(clicks == 3){
				level.add_weather(weatherSprites[0]);
				addedWeather.push(weatherSprites[0]);
				level.setQuill();
			}
		}
	};
}


function secondLevel(){
	level.currLevel = 1;
	
	level.background.image = Textures.load(backgrounds[level.currLevel]);
	
	level.gameText.visible = true;
	level.quill.visible = true;
	level.moveText(100,160);
	level.gameText.text = script[5];
	scriptIndex = 5;
	level.moveQuill(615,40);
    var clicks = 0;
    level.gameText.onMouseUp = function(){
    	if(clicks > 0) return;
    	if(checkSprite(level.gameText, gInput.mouse.x, gInput.mouse.y)){
			clicks += 1;
			level.nextText();
			if(clicks == 1) {
    			level.add_weather(weatherSprites[1]);
				addedWeather.push(weatherSprites[1]);
				level.setQuill();
    		}
		}
    };
    
	var mc = makeSprite(150,200, 450 ,275,"http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/spriteSheets/Weatherly/walkSheet2.png");
	mc.frameWidth = 170;
	mc.frameHeight = 251;
	mc.frameCount = 4;
	mc.frameRate = 2.5;
	mc.addAnimation('walkingRight',0,5);
	mc.addAnimation('idle',3,1);
	mc.animation = 'idle';
	
	var evilClouds = makeSprite((canvas.width)-100, (canvas.height)-150, 50, 25,
		"http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level2%20plain/cloudClearing.png");
	evilClouds.frameWidth = 740;
	evilClouds.frameHeight = 610;
	evilClouds.frameCount = 6;
	evilClouds.frameRate = 3;
	evilClouds.addAnimation('idle',0,1);
	evilClouds.addAnimation('clearing',0,7);
	evilClouds.animation = 'idle';
	
	level.hero = mc;
	level.add_obj(level.currLevel,mc);
	level.add_obj(level.currLevel,evilClouds);
	
	events.createLevelEvent(level.currLevel,weatherSprites[1],evilClouds);
	var E_SunEvilClouds = events.findEvent(level.currLevel,weatherSprites[1],evilClouds);
	var clearSkys = function(){
		level.nextText();
		evilClouds.animation = 'clearing';
		xVel = 2;
		level.add_weather(weatherSprites[2]);
		addedWeather.push(weatherSprites[2]);
		mc.update = function(){
			if(evilClouds.frame > 5){
				world.removeChild(evilClouds);
				this.x += xVel;
				this.animation = 'walkingRight';
				if(this.x >= level.background.width-100){
					level.gameText.visible = false;
					level.unloadLevel(level.currLevel);
					thirdLevel();
				}
			}
		};	
	};
	events.defineEvent(E_SunEvilClouds,clearSkys);

   //If the user skipped to this level, we need to give him the weather
   // he did not get from previous levels
   if(skipped){
   		addMissing(1);
		skipped = false;
   }

	level.loadLevel(level.currLevel);
}


function thirdLevel(){;
	level.currLevel = 2;
	
	level.background.image = Textures.load(backgrounds[level.currLevel]);
	
	level.clearText();
	level.initText();
	level.gameText.visible = true;
	level.gameText.text = script[8];
	scriptIndex = 8;
	level.moveText(830,350);
	level.quill.visible = true;
	level.moveQuill(0,100);
	
	level.gameText.onMouseUp = function(){};
	
	var clicks = 0;
    level.gameText.onMouseUp = function(){
    	if(clicks > 1) return;
    	if(checkSprite(level.gameText, gInput.mouse.x, gInput.mouse.y)){
			clicks += 1;
			level.nextText();
		}
		if(clicks==2) level.setQuill();
    }; 
	
	var mc = makeSprite(150,200,100,280,"http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/spriteSheets/Weatherly/walkSheet2.png");
	mc.frameWidth = 170;
	mc.frameHeight = 251;
	mc.frameCount = 4;
	mc.frameRate = 2.5;
	mc.addAnimation('walkingRight',0,5);
	mc.addAnimation('idle',3,1);
	mc.animation = 'walkingRight';
	mc.frame = 0;
	mc.update = function(){
		if(this.x < 500) this.x += 0.75;
		else this.y -= 0.75;
		
		if(this.y < 175){
			world.addChild(feast);
			level.add_obj(level.currLevel,feast);
			feast.animation = 'feast';
			events.defineEvent(E_SunWater,makeRain);
			world.removeChild(this);
			//this.update = function(){};
		}
	}; 
	level.hero = mc;
	
	var plant = makeSprite(100,100,225,310,"http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level3%20plantTown/dead%20plant.png");
	var water = makeSprite(125,100,700,290,"http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level3%20plantTown/water.png");
	var feast = makeSprite(350,200,900,100,'http://people.ucsc.edu/~kercoffm/AdventuresOfWeatherly/spriteSheets/feasting.png');
	feast.frameWidth = 690;
	feast.frameHeight = 563;
	feast.frameCount = 5;
	feast.frameRate = 2;
	feast.addAnimation('feast',0,6);
	var RainCloud = makeSprite(200,225,500,100,'http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level3%20plantTown/rain.png');
	
	level.add_obj(level.currLevel,plant);
	level.add_obj(level.currLevel,water);
	level.add_obj(level.currLevel,mc);
	
	events.createLevelEvent(level.currLevel,weatherSprites[1],water);
	var E_SunWater = events.findEvent(level.currLevel,weatherSprites[1],water);
	var makeRain = function(){
		water.image = Textures.load('http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level3%20plantTown/watertrough.png');
		world.addChild(RainCloud);
		level.add_obj(level.currLevel,RainCloud); //Remember to add later sprites to obj array
		events.defineEvent(E_WindRainCloud,growPlant);
	};
	
	events.createLevelEvent(level.currLevel,weatherSprites[0],RainCloud);
	var E_WindRainCloud = events.findEvent(level.currLevel,weatherSprites[0],RainCloud);
	var growPlant = function(){
		RainCloud.update = function(){
			if(this.x > plant.x-50){
				this.x -= 0.75;
			} 
			else{
				plant.image = Textures.load('http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level3%20plantTown/alive%20plant.png');
				world.removeChild(RainCloud);
				level.add_weather(weatherSprites[3]);
				addedWeather.push(weatherSprites[3]);
				throwWeatherly();
				this.update = function(){};
			}
		};
	};
	var villagers = makeSprite(150,150,520,220,
				'http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level3%20plantTown/villagersCarryWeatherly.png');
	var throwWeatherly = function(){
		level.gameText.visible = false;
		feast.image = Textures.load('http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level3%20plantTown/window.png');
		feast.frameWidth = feast.frameHeight = -1; 
		feast.frameCount = 1;
		villagers.addChild(mc);
		mc.x = -25;
		mc.y = -125;
		level.add_obj(level.currLevel,villagers);
		world.addChild(villagers);
		mc.update = function(){};
		mc.image = Textures.load("http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level3%20plantTown/tossableWeatherly.png");
		mc.frameWidth = mc.frameHeight = -1;
		mc.frameCount = mc.frameRate = 1;
		mc.addAnimation('carried',0,1);
		mc.animation = 'carried';
		mc.width = mc.height = 150;
		villagers.update = function(){
			if(this.y < 330) this.y += 0.75;
			else if(this.x <= 999) this.x += 0.75;
			
			if(this.x >= 999){
				if(mc.x < 300){
					mc.y -= 0.25;
					mc.x += 2;
				}	
				else{
					level.unloadLevel(level.currLevel);
					fourthLevel();
				}
			}
		};
	};
	
   //If the user skipped to this level, we need to give him the weather
   // he did not get from previous levels
    if(skipped){
		addMissing(3);
		skipped = false;
    }
    
	level.loadLevel(level.currLevel);
}

function fourthLevel(){
	level.currLevel = 3;
	
	level.hero = undefined;
	level.background.image = Textures.load(backgrounds[level.currLevel]);
	
	level.clearText();
	level.initText();
	level.gameText.visible = true;
	level.quill.visible = true;
	level.moveQuill(0,40);
	level.gameText.text = script[11];
	scriptIndex = 11;
	level.moveText(500,375);
	var clicks = 0;
    level.gameText.onMouseUp = function(){
    	if(clicks > 0) return;
    	if(checkSprite(level.gameText, gInput.mouse.x, gInput.mouse.y)){
			clicks += 1;
			level.nextText();
		}
		if(clicks == 1) level.setQuill();
    };
	
	var mc = makeSprite(300,300,150,210,'http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level4/rdSpriteSheet.png');
	mc.frameWidth = 146;
	mc.frameHeight = 134;
	mc.frameCount = 10;
	mc.frameRate = 3;
	mc.addAnimation('donkeyIdle',0,1);
	mc.addAnimation('donkeyRun',2,8);
	mc.animation = 'donkeyIdle';
	mc.frame = 0;
	level.hero = mc;
	
	var tree = makeSprite(500,390,50,25,'http://people.ucsc.edu/~kercoffm/Level%204/tree.png');
	var stormCloud = makeSprite(1065,325,225,25,'http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level4/stormCloud.png');
	var thunder = makeSprite(400,400,350,50,'http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level4/lightning.png');
	var stormWind = makeSprite(600,200,500,25,'http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level4/windSpriteSheet.png');
	stormWind.frameWidth = 365;
	stormWind.frameHeight = 215;
	stormWind.frameCount = 4;
	stormWind.frameRate = 2;
	stormWind.addAnimation('windy',0,5);
	stormWind.animation = 'windy';
	var bkgndCopy = makeSprite(level.background.width,level.background.height,
								level.background.x,level.background.y,'');
	
	level.add_obj(level.currLevel,bkgndCopy);
	level.add_obj(level.currLevel,tree);
	level.add_obj(level.currLevel,mc);
	
	events.createLevelEvent(level.currLevel,weatherSprites[2],bkgndCopy);
	var E_CloudBkgnd = events.findEvent(level.currLevel,weatherSprites[2],bkgndCopy);
	var madeCloud = false;
	var makeStormCloud = function(){
		if(madeCloud == true) return;
		madeCloud = true;
		world.addChild(stormCloud);
		level.add_obj(level.currLevel,stormCloud);
		world.removeChild(bkgndCopy);
		events.defineEvent(E_RainStormCloud,startRain);
	};
	events.defineEvent(E_CloudBkgnd,makeStormCloud);
	
	events.createLevelEvent(level.currLevel,weatherSprites[3],stormCloud);
	var E_RainStormCloud = events.findEvent(level.currLevel,weatherSprites[3],stormCloud);
	var startedRain = false;
	var startRain = function(){
		if(startedRain == true) return;
		startedRain = true;
		stormCloud.image = Textures.load('http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level4/rain.png');
		stormCloud.x += 250;
		stormCloud.width -= 250;
		stormCloud.height -= 75;
		events.defineEvent(E_WindStormCloud,thunderStrike);
	};
	
	events.createLevelEvent(level.currLevel,weatherSprites[0],stormCloud);
	var E_WindStormCloud = events.findEvent(level.currLevel,weatherSprites[0],stormCloud);
	var thunderStruck = false;
	var thunderStrike = function(){
		if(thunderStruck == true) return;
		thunderStruck = true;
		world.addChild(stormWind);
		level.add_obj(level.currLevel,stormWind);
		var i = 0;
		stormWind.update = function(){
			if(this.frame >= 3 && this.frame <= 4) ++i;
			if(i == 45){
				world.addChild(thunder);
				level.add_obj(level.currLevel,thunder);
				tree.image = Textures.load('http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level4/treeFire.png');
				runningDonkey();
			}
		};
	};
	
	var runningDonkey = function(){
		level.gameText.visible = false;
		mc.animation = 'donkeyRun';
		mc.update = function(){
			this.x += 3.5;
			if(this.x >= level.background.width - 200){
				level.unloadLevel(level.currLevel);
				level.add_weather(weatherSprites[4]);
				addedWeather.push(weatherSprites[4]);
				fifthLevel();
			}
		};
	};

//If the user skipped to this level, we need to give him the weather
// he did not get from previous levels
    if(skipped){
   		addMissing(4);
		skipped = false;
    }
    
	level.loadLevel(level.currLevel);
}


function fifthLevel(){
	level.currLevel = 4;
	level.hero = undefined;
	level.background.image = Textures.load(backgrounds[level.currLevel]);
	
	level.clearText();
	level.initText();
	level.gameText.visible = true;
	level.gameText.color = '#ffffff';
	level.gameText.text = script[13];
	scriptIndex = 13;
	level.moveText(120,55);
	
	level.quill.visible = false;
	level.gameText.onMouseUp = function(){};
	
	
	var mc = makeSprite(100,100,100,225,'http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level5%20forest/facePlant.png');
	level.hero = mc;
	var donkey = makeSprite(250,250,50,250,'http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level5%20forest/donkeySpriteSheet.png');
	donkey.frameWidth = 400;
	donkey.frameHeight = 366;
	donkey.frameCount = 8;
	donkey.frameRate = 4;
	donkey.addAnimation('run',0,9);
	donkey.animation = 'run';	
	
	var minion1 = makeSprite(100,120,300,175,'http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level5%20forest/minion1.png');
	var minion2 = makeSprite(100,120,1000,220,'http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level5%20forest/minion2.png');
	var minion3 = makeSprite(100,120,300,375,'http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level5%20forest/minion3.png');
	var fog1 = makeSprite(100,75,0,0,'http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level5%20forest/fogConceal.png');
	
	level.add_obj(level.currLevel,mc);
	
	world.addChild(donkey);
	donkey.update = function(){
		if(this.x <= level.background.width - 200) this.x += 3;
		else{
			world.addChild(minion1);
			events.defineEvent(E_CloudMinion1,blindMinion1);
			world.addChild(minion2);
			events.defineEvent(E_CloudMinion2,blindMinion2);
			world.addChild(minion3);
			events.defineEvent(E_CloudMinion3,blindMinion3);
			level.add_obj(level.currLevel,minion1);
			level.add_obj(level.currLevel,minion2);
			level.add_obj(level.currLevel,minion3);
			mc.image = Textures.load('http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level5%20forest/coweringWeatherly.png');
			world.removeChild(this);
			this.update = function(){};
		} 
	};
	mc.update = function(){
		if(this.y < 315){
			this.x += 1;
			this.y += 2;
		}else{
			this.image = Textures.load('http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level5%20forest/sittingWeatherly.png');
			this.update = function(){};
		} 
	};
	var xVel1 = 1;
	minion1.update = function(){
		if(this.y < 300){
			this.x += 2;
			this.y += 1;
		}else{
			this.x += xVel1;
			if(this.x <= 500) xVel1 = xVel1*-1;
			else if(this.x >= 650) xVel1 = xVel1*-1;
		}
	};
	var xVel2 = 1;
	minion2.update = function(){
		if(this.y < 375){
			this.y += 1.5;
		}else{
			this.x += xVel2;
			if(this.x <= 850) xVel2 = xVel2*-1;
			else if(this.x >= 1100) xVel2 = xVel2*-1;
		}
	};
	var xVel3 = 1;
	minion3.update = function(){
		if(this.x < 500){
			this.x += 1.5;
		}else{
			this.x += xVel3;
			if(this.x <= 500) xVel3 = xVel3*-1;
			else if(this.x >= 750) xVel3 = xVel3*-1;
		}
	};
	
	var fogFlag = 0;
	events.createLevelEvent(level.currLevel,weatherSprites[2],minion1);
	var E_CloudMinion1 = events.findEvent(level.currLevel,weatherSprites[2],minion1);
	var blindMinion1 = function(){
		createFog(minion1);
	};
	
	events.createLevelEvent(level.currLevel,weatherSprites[2],minion2);
	var E_CloudMinion2 = events.findEvent(level.currLevel,weatherSprites[2],minion2);
	var blindMinion2 = function(){
		createFog(minion2);
	};
	
	events.createLevelEvent(level.currLevel,weatherSprites[2],minion3);
	var E_CloudMinion3 = events.findEvent(level.currLevel,weatherSprites[2],minion3);
	var blindMinion3 = function(){
		createFog(minion3);
	};
	
	var alreadyFogged = [];
	var createFog = function(sprite){
		for(var i = 0; i < alreadyFogged.length; i++){
			if(alreadyFogged[i] == sprite) return;
		}
		sprite.addChild(fog1);
		alreadyFogged.push(sprite);
		level.add_obj(level.currLevel,fog1);
		fogFlag++;
		if(fogFlag == 3) endLevel();
	};
	
	var endLevel = function(){
		//mc.image = 
		level.nextText();
		mc.update = function(){
			if(this.x <= 600) this.x += 2;
			else if(this.y <= 400) this.y += 2;
			else this.x += 2;
			
			
			if(this.x >= level.background.width - 50){
				level.gameText.visible = false;
				level.unloadLevel(level.currLevel);
				level.add_weather(weatherSprites[5]);
				addedWeather.push(weatherSprites[5]);
				crossRoadP1();
			}
		};
	};
//If the user skipped to this level, we need to give him the weather
// he did not get from previous levels
    if(skipped){
   		addMissing(5);
		skipped = false;
    }
	level.loadLevel(level.currLevel);
};

function crossRoadP1(){
	level.currLevel = 5;
	
	level.hero = undefined;
	level.background.image = Textures.load(backgrounds[level.currLevel]);
	
	level.clearText();
	level.initText();
	level.gameText.visible = true;
	level.gameText.text = script[15];
	scriptIndex = 15;
	level.moveText(120,55);
	level.gameText.color = '#000000';
	level.quill.visible = false;
	
	
	var mc = makeSprite(150,200,100,150,"http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/spriteSheets/Weatherly/walkSheet2.png");
	mc.frameWidth = 171;
	mc.frameHeight = 251;
	mc.frameCount = 4;
	mc.frameRate = 2.5;
	mc.addAnimation('walkingRight',0,5);
	mc.animation = 'walkingRight';
	mc.frame = 0;
	
	level.hero = mc;
	level.add_obj(level.currLevel,mc);
	var flag = false;
	mc.update = function(){
		this.x += 1;
		if(this.x > 600){
			this.y -= 0.20;
			if(flag != true){
				level.nextText();
				flag = true;
			}
		}
		if(this.x >= level.background.width-100){
			level.unloadLevel(level.currLevel);
			initMusic(sounds[2]);
			sixthLevel();
		}
	};
//If the user skipped to this level, we need to give him the weather
// he did not get from previous levels
    if(skipped){
   		addMissing(6);
		skipped = false;
    }
	level.loadLevel(level.currLevel);
}

function sixthLevel(){
	level.currLevel = 6;
		
	level.hero = undefined;
	level.background.image = Textures.load(backgrounds[level.currLevel]);
	
	
	level.clearText();
	level.initText();
	level.gameText.text = script[17];
	scriptIndex = 17;
	level.quill.visible = false;
	level.moveText(890,250);
	
	
	var mc = makeSprite(175,175,400,300,'http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level6%20crossroad1/love.png');
	level.hero = mc;
	var xVel = 2.5;
	mc.update = function(){
		this.x += xVel;
		if(this.x <= 225){
			xVel = xVel*-1;
			this.scaleX *= -1;
		}else if(this.x >= 750){
			 xVel = xVel*-1;
			 this.scaleX *= -1;
		}
	};
	
	var girl1 = makeSprite(225,225,625,100,'http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level7%20beach/sittingSunbather.png');
	girl1.frameWidth = 500;
	girl1.frameHeight = 628;
	girl1.frameCount = 3;
	girl1.frameRate = 1;
	girl1.addAnimation('laying',0,1);
	girl1.addAnimation('rain',1,1);
	girl1.addAnimation('standing',2,1);
	girl1.animation = 'laying';
	girl1.frame = 0;
	
	var girl2 = makeSprite(150,150,200,100,'http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level7%20beach/beachGirl2.png');
	var umbrella = makeSprite(200,150,650,125,'http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level7%20beach/umbrella.png');
	var sand = makeSprite(100,100,720,225,'http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level7%20beach/sand%20pile.png');
	var sandstorm = makeSprite(level.background.width,800,0,0,
		'http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level7%20beach/sandAtmosphere.png');
	
	level.add_obj(level.currLevel,sand);
	level.add_obj(level.currLevel,girl1);
	level.add_obj(level.currLevel,girl2);
	level.add_obj(level.currLevel,umbrella);
	level.add_obj(level.currLevel,mc);
	
	
	events.createLevelEvent(level.currLevel,weatherSprites[0],umbrella);
	var E_ThunderUmbrella = events.findEvent(level.currLevel,weatherSprites[0],umbrella);
	var exterminateUmrella = function(){
		umbrella.update = function(){
			this.x += 1.5;
			this.rotation += DTR(4);
			if(this.x > level.background.width-100){
				world.removeChild(umbrella);
				events.defineEvent(E_RainGirl,makingItRain);
				umbrella.update = function(){};
			}
		};
	};
	events.defineEvent(E_ThunderUmbrella,exterminateUmrella);
	

	events.createLevelEvent(level.currLevel,weatherSprites[3],girl1);
	var E_RainGirl = events.findEvent(level.currLevel,weatherSprites[3],girl1);
	var alreadyRained = false;
	var makingItRain = function(){
		if(alreadyRained == true) return;
		alreadyRained = true;
		girl1.animation = 'rain';
		var i = 0;
		girl1.update = function(){
			if(this.frame == 1) i++;
			if(i > 200){
				this.animation = 'standing';
				if(this.x > 425){
					this.x -= 1;
				}else{
					events.defineEvent(E_WindSand,makeSandStorm);
					this.update = function(){};
				}
			}
		};
	};
	
	events.createLevelEvent(level.currLevel,weatherSprites[0],sand);
	E_WindSand = events.findEvent(level.currLevel,weatherSprites[0],sand);
	var makeSandStorm = function(){
		level.background.addChild(sandstorm);
		level.add_weather(weatherSprites[6]);
		addedWeather.push(weatherSprites[6]);
		endLevel();
	};


	var endLevel = function(){
		level.nextText();
		level.moveText(120,55);
		girl1.update = function(){
			if(this.x > level.background.x) --this.x;
			else{
				world.removeChild(this);
				mc.update = function(){
					if(this.x > level.background.x) this.x -= 0.5;
					else{
						level.gameText.visible = false;
						level.unloadLevel(level.currLevel);
						level.background.removeChild(sandstorm);
						crossRoadP2();
					}
				};
			}
		};
		girl2.update = function(){
			if(this.x > level.background.x) --this.x;
			else{
				world.removeChild(this);
			}
		};
		mc.update = function(){};
		mc.scaleX = 1;
		mc.image = Textures.load('http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level7%20beach/disappoint.png');
	};
	
//If the user skipped to this level, we need to give him the weather
// he did not get from previous levels
    if(skipped){
   		addMissing(6);
		skipped = false;
    }
    
	level.loadLevel(level.currLevel);
}

function crossRoadP2(){
	level.currLevel = 7;
	
	level.hero = undefined;
	level.background.image = Textures.load(backgrounds[level.currLevel]);
	
	if(instance != undefined) instance.setMute(true);
	
	level.clearText();
	level.initText();
	level.gameText.visible = true;
	level.moveText(120,55);
	level.gameText.text = script[18];
	scriptIndex = 18;
	level.quill.visible = false;
	var mc = makeSprite(150,200,1100,50,"http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level7%20beach/disappoint.png");

	
	level.hero = mc;
	level.add_obj(level.currLevel,mc);
	mc.update = function(){
		if(this.x > 600){
			this.x -= 1.1;
			this.y += 0.25;
		}else{
			this.update = function(){
				this.x += 1;
				this.y += 0.5;
				if(this.y >= level.background.height - 175){
					level.unloadLevel(level.currLevel);
					finalLevel();
				}
			};
		}
	};
	
	//If the user skipped to this level, we need to give him the weather
	// he did not get from previous levels
    if(skipped){
   		addMissing(7);
		skipped = false;
    }
    
	level.loadLevel(level.currLevel);
};

function finalLevel(){
	initMusic(sounds[3]);
	level.currLevel = 8;
		
	level.hero = undefined;
	level.background.image = Textures.load(backgrounds[level.currLevel]);
	var bkgndX = level.background.x;
	var bkgndY= level.background.y;
	
	if(instance != undefined) instance.setMute(false);
	
	level.clearText();
	level.initText();
	level.gameText.color = '#ffffff';
	level.gameText.text = script[19];
	level.moveText(50,50);
	level.moveQuill(550,115);
	level.quill.visible = false;
	
	var startBattle = false;
	var clicks = 0;
	level.gameText.onMouseUp = function(){
		if(clicks > 0 ) return;
    	if(checkSprite(level.gameText, gInput.mouse.x, gInput.mouse.y)){
			if(startBattle == true){
				level.gameText.text = script[20];
				level.moveText(250,250);
				clicks += 1;
				world.addChild(EvilSun);
				level.setQuill();
				events.defineEvent(E_CloudSword,CloudAttack);
			}
		}
    };
	level.gameText.update = function(){
		if(startBattle == true){
			level.setQuill();
			this.update = function(){};
		}
	};
	
	
	var mc = makeSprite(125,125,125,350,'http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level10%20evilEnd/coweringWeatherly.png');
	var boss = makeSprite(475,475,700,25,'http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level10%20evilEnd/evilStatic.png');
	boss.visible = false;
	
	var Xvel = 0.5;
	mc.update = function(){
		this.x += Xvel;
		if(this.x > 600){
			boss.visible = true;
			this.scaleX = -1;
			Xvel = -Xvel*5;
		}
		if(this.x < level.background.x+75){
			this.scaleX = 1;
			this.width = this.height = 150;
			this.y = 325;
			Xvel = 0;
			this.image = Textures.load('http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level10%20evilEnd/coweringHero.png');
			startBattle = true;
			this.update = function(){};
		}
	};
	var swordUpgrade = makeSprite(130,125,50,0,
				'http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level10%20evilEnd/swords/cloudSword.png');
	mc.addChild(swordUpgrade);
	swordUpgrade.visible = false;
	
	var EvilSun = makeSprite(400,200,bkgndX+100,bkgndY,
				'http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level10%20evilEnd/weathers/evilSun.png');
	var HeroCloud = makeSprite(400,200,bkgndX+100,bkgndY,
				'http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level10%20evilEnd/weathers/heroCloud.png');
				
	var EvilRain = makeSprite(700,350,bkgndX,bkgndY,
				'http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level10%20evilEnd/weathers/evilRain.png');
	//EvilRain.visible = false;
	
	
	var HeroSandstorm = makeSprite(700,350,bkgndX,bkgndY,
				'http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level10%20evilEnd/weathers/heroSandstorm.png');

	var EvilCloud = makeSprite(700,300,bkgndX,bkgndY,
				'http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level10%20evilEnd/weathers/evilCloud.png');
	var EvilFog = makeSprite(675,200,bkgndX,bkgndY+275,
				'http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level10%20evilEnd/weathers/evilFog.png');
	var HeroThunder = makeSprite(500,300,bkgndX+100,bkgndY+150,
				'http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level10%20evilEnd/weathers/heroLightning.png');

	var HeroSun = makeSprite(400,200,bkgndX+100,bkgndY,
				'http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level10%20evilEnd/weathers/heroSun.png');

	level.add_obj(level.currLevel,mc);
	level.add_obj(level.currLevel,boss);
	

	events.createLevelEvent(level.currLevel,weatherSprites[2],mc);
	E_CloudSword = events.findEvent(level.currLevel,weatherSprites[2],mc);
	var usedCloud = false;
	var CloudAttack = function(){
		if(usedCloud == true) return;
		usedCloud = true;
		world.addChild(HeroCloud);
		level.gameText.visible = false;
		swordUpgrade.visible = true;
		mc.update = function(){
			if(!spritesCollision(mc,boss)){
				this.x += 1;
			}else{
				mc.image = Textures.load('http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level10%20evilEnd/attackingWeatherly.png');
				boss.image = Textures.load('http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level10%20evilEnd/evilDamaged.png');
				world.removeChild(HeroCloud);
				world.removeChild(EvilSun);
				swordUpgrade.visible = false;
				mc.update = function(){
					if(this.x > level.background.x+75){
						this.x -= 5;
						if(this.x < boss.x - 200 ){
						mc.image = Textures.load(
								'http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level10%20evilEnd/coweringHero.png');
						} 
					}else{
						boss.image = Textures.load(
									'http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level10%20evilEnd/evilStatic.png');
						world.addChild(EvilRain);
						level.gameText.visible = true;
						level.gameText.text = script[21];
						level.moveText(300,400);
						events.defineEvent(E_SandSword,SandAttack);
						this.update = function(){};
					}
				};
			}
		};
	};

	events.createLevelEvent(level.currLevel,weatherSprites[6],mc);
	E_SandSword = events.findEvent(level.currLevel,weatherSprites[6],mc);
	var usedSand = false;
	var SandAttack = function(){
		if(usedSand == true) return;
		usedSand = true;
		world.addChild(HeroSandstorm);
		level.gameText.visible = false;
		swordUpgrade.visible = true;
		swordUpgrade.image = Textures.load(
					'http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level10%20evilEnd/swords/sandSword.png');
		swordUpgrade.x = 55;
		swordUpgrade.y = -5;
		mc.update = function(){
			if(!spritesCollision(mc,boss)){
				this.x += 1;
			}else{
				mc.image = Textures.load('http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level10%20evilEnd/attackingWeatherly.png');
				boss.image = Textures.load('http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level10%20evilEnd/evilDamaged.png');
				world.removeChild(HeroSandstorm);
				world.removeChild(EvilRain);
				swordUpgrade.visible = false;
				mc.update = function(){
					if(this.x > level.background.x+75){
						this.x -= 5;
						if(this.x < boss.x - 200 ){
						mc.image = Textures.load(
								'http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level10%20evilEnd/coweringHero.png');
						} 
					}else{
						boss.image = Textures.load(
									'http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level10%20evilEnd/evilStatic.png');
						world.addChild(EvilFog);
						level.gameText.visible = true;
						level.gameText.text = script[22];
						level.moveText(250,250);
						events.defineEvent(E_ThunderSword,SplitFog);
						this.update = function(){};
					}
				};
			}
		};
	};
	
	events.createLevelEvent(level.currLevel,weatherSprites[4],mc);
	E_ThunderSword = events.findEvent(level.currLevel,weatherSprites[4],mc);
	var usedFog = false;
	var SplitFog = function(){
		if(usedFog == true) return;
		usedFog = true;
		world.addChild(HeroThunder);
		level.gameText.visible = false;
		swordUpgrade.visible = true;
		swordUpgrade.image = Textures.load(
					'http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level10%20evilEnd/swords/lightningSword.png');
		swordUpgrade.x = 50;
		swordUpgrade.y = 0;
		mc.update = function(){
			if(!spritesCollision(mc,boss)){
				this.x += 1;
			}else{
				mc.image = Textures.load('http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level10%20evilEnd/attackingWeatherly.png');
				boss.image = Textures.load('http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level10%20evilEnd/evilDamaged.png');
				world.removeChild(HeroThunder);
				world.removeChild(EvilFog);
				swordUpgrade.visible = false;
				mc.update = function(){
					if(this.x > level.background.x+75){
						this.x -= 5;
						if(this.x < boss.x - 200 ){
						mc.image = Textures.load(
								'http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level10%20evilEnd/coweringHero.png');
						} 
					}else{
						boss.image = Textures.load(
									'http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level10%20evilEnd/evilStatic.png');
						world.addChild(EvilCloud);
						level.gameText.visible = true;
						level.gameText.text = script[23];
						level.moveText(400,300);
						events.defineEvent(E_SunSword,sunnySkies);
						this.update = function(){};
					}
				};
			}
		};
	};
	
	events.createLevelEvent(level.currLevel,weatherSprites[1],mc);
	E_SunSword = events.findEvent(level.currLevel,weatherSprites[1],mc);
	var usedSun = false;
	var sunnySkies = function(){
		if(usedSun == true) return;
		usedSun = true;
		world.addChild(HeroSun);
		level.gameText.visible = false;
		swordUpgrade.visible = true;
		swordUpgrade.image = Textures.load(
					'http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level10%20evilEnd/swords/sunSword.png');
		swordUpgrade.x = 55;
		swordUpgrade.y = -5;
		mc.update = function(){
			if(!spritesCollision(mc,boss)){
				this.x += 1;
			}else{
				mc.image = Textures.load('http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level10%20evilEnd/attackingWeatherly.png');
				boss.image = Textures.load('http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level10%20evilEnd/evilDamaged.png');
				world.removeChild(HeroSun);
				world.removeChild(EvilCloud);
				swordUpgrade.visible = false;
				mc.update = function(){
					if(this.x > level.background.x+75){
						this.x -= 5;
						if(this.x < boss.x - 200 ){
						mc.image = Textures.load(
								'http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level10%20evilEnd/coweringHero.png');
						} 
					}else{
						level.add_weather(weatherSprites[7]);
						addedWeather.push(weatherSprites[7]);
						level.gameText.visible = true;
						level.gameText.text = script[24];
						level.moveText(250,250);
						events.defineEvent(E_RainbowSword,rainbowTime);
						this.update = function(){};
					}
				};
			}
		};
	};	
	
	events.createLevelEvent(level.currLevel,weatherSprites[7],mc);
	E_RainbowSword = events.findEvent(level.currLevel,weatherSprites[7],mc);
	var usedRainbow = false;
	var rainbowTime = function(){
		if(usedRainbow == true) return;
		usedRainbow = true;
		swordUpgrade.visible = true;
		level.gameText.visible = false;
		swordUpgrade.image = Textures.load(
					'http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level10%20evilEnd/swords/epicRainbowSword.png');
		swordUpgrade.width = 250;
		swordUpgrade.height = 250;
		swordUpgrade.x = 40;
		swordUpgrade.y = -90;
		var v = 3;
		var i = 0;
		mc.update = function(){
			if(!spritesCollision(mc,boss)){
				this.x += 1;
			}else{
				mc.image = Textures.load('http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level10%20evilEnd/attackingWeatherly.png');
				boss.image = Textures.load('http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level10%20evilEnd/evilDefeated.png');
				boss.update = function(){
					this.x += v;
					++i;
					if(this.x <= 695) v = v*-1;
					else if(this.x >= 705) v = v*-1;
					if(i == 250) this.visible = false;
				};
				mc.update = function(){
					if(this.x > level.background.x+300){
						this.x -= 5;
						if(this.x < boss.x - 200 ){
						mc.image = Textures.load(
								'http://people.ucsc.edu/~gnagel/adventuresOfWeatherly/level10%20evilEnd/coweringHero.png');
						} 
					}else{
						finalText();
					}
				};
			}
		};
	};
	
	var finalText = function(){
		if(instance != undefined) instance.stop();
		level.gameText.visible = true;
		level.gameText.text = script[25];
		level.moveText(50,50);
		level.moveQuill(0,175);
		level.quill.visible = true;
		level.gameText.onMouseUp = function(){
			this.removeChild(swordUpgrade);
			level.unloadLevel(level.currLevel);
			theEnd();
		};
	};
	
	//If the user skipped to this level, we need to give him the weather
	// he did not get from previous levels
    if(skipped){
   		addMissing(7);
		skipped = false;
    }
	
	
	level.loadLevel(level.currLevel);
}

function theEnd(){
	level.currLevel = 9;
		
	level.hero = undefined;
	level.background.image = Textures.load(backgrounds[level.currLevel]);
	level.clear_weather();
	addedWeather = undefined;
	levelEvents = undefined;
	level.gameText.visible = false;
	level.gameText.removeChild(level.quill);
	level.clearText();
	level.gameText = undefined;
	instance = undefined;
	createjs.Sound.removeSound("Menu");
	createjs.Sound.removeSound("Normal");
	createjs.Sound.removeSound("Beach");
	createjs.Sound.removeSound("Boss");
	level.objects = undefined;
	
};

// Add the first #numOfMissing weather sprites
// if the user skipped levels at start screen
function addMissing(numOfMissing){
    for(var i = 0; i < numOfMissing; i++){
   		level.add_weather(weatherSprites[i]);
		addedWeather.push(weatherSprites[i]);
    }	
	
}
