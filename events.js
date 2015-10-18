//Creates the data structure that handles events

// Event : {weatherSprite: , objectSprite: }. 
// we need to perform an event.

var levelEvents = [[],[],[],[],[],[],[],[],[],[]]; // [0][..] will contain level 0's events and etc...

function eventManager(){

//Creates an Event.
// weather, obj = Sprite
	this.event=function(weather,obj){
		return {weatherSprite:weather,objectSprite:obj,eventFunction:undefined};
	};
	
	//Creates an Event and adds it to a specified level
	// level = int
	// weather, obj = Sprite
	this.createLevelEvent=function(level,weather,obj){
		levelEvents[level].push(this.event(weather,obj));
	};
	
	// Looks up and returns an event. If the event is not found, 
	this.findEvent=function(level,weather,obj){
		for(var i = 0; i < levelEvents[level].length; i++){
			if(levelEvents[level][i].weatherSprite == weather && 
				levelEvents[level][i].objectSprite == obj) return levelEvents[level][i];
		}
		return undefined;
	};
	
	//Defines an event for an already mapped sprite
	// event = event: {weatherSprite: , objSprite: }
	// funct = function
	this.defineEvent=function(event,funct){
		event.eventFunction = funct;
	};
	
	//Calls an event function of a objSprite, if it exists.
	this.doEvent=function(level,weather,obj){
		var ev = this.findEvent(level,weather,obj);
		if(ev != undefined && ev.eventFunction != undefined){
			ev.eventFunction();
		}
	};
}