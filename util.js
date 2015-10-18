

// File for common use functions


// Global funct. Creates and returns a Sprite
function makeSprite(w, h, xpos, ypos, pic) {
    var pictureA = new Sprite();
    pictureA.width = w;
    pictureA.height = h;
    pictureA.x = xpos;
    pictureA.y = ypos;
    pictureA.image = Textures.load(pic);
    return pictureA;
}

// Global funct.
// Check if given (x,y) coordinates are within the sprite's area.
function checkSprite(sprite,x,y){
  var minX = sprite.x;
  var maxX = sprite.x+sprite.width;
  var minY = sprite.y;
  var maxY = sprite.y+sprite.height;
  var mx = x;
  var my = y;
  
  if(mx >= minX && mx <= maxX && my >= minY && my <= maxY){
    return true;
  }
  return false;
}

//Global Function.
// Checks if two sprites are colliding
function spritesCollision(a,b){
	var axMin = a.x;
	var ayMin = a.y;
	var bxMin = b.x;
	var byMin = b.y;
	var axMax = a.x + a.width;
	var ayMax = a.y + a.height;
	var bxMax = b.x + b.width;
	var byMax = b.y + b.height;
	
	if(axMax < bxMin || axMin > bxMax){
		return false;
	}
	if(ayMax < byMin || ayMin > byMax){
		return false;
	}

	return true;
}
