var sounds = [
	{id:"Menu", src:"sounds/EverydayScene.ogg"}, //0
	{id:"Normal", src:"sounds/EverydayScene2.ogg"}, //1
	{id:"Beach", src:"sounds/beachMusic.ogg"}, //2
	{id:"Boss", src:"sounds/BossEnd2.ogg"}, //3
];


function initMusic(pair){
	// if initializeDefaultPlugins returns false, we cannot play sound in this browser
	if (!createjs.Sound.initializeDefaultPlugins()) {
		console.log("Current Browser Does Not Support Sound");
		 return; }
	
	createjs.Sound.alternateExtensions = ["mp3"];

 	createjs.Sound.registerSound(pair);
	createjs.Sound.addEventListener("fileload", handleLoad);
	
	
}

var instance = undefined;
function handleLoad(event){
	if(instance != undefined) instance.stop();
	instance = createjs.Sound.play(event.id, {loop:-1});
}

