window.onload = function () {
	// var button = document.getElementsByName('Animate').item(0);
	// button.addEventListener("click", onButtonClick)
	document.addEventListener("keydown", onKeyDown);
	window.requestAnimationFrame(animate);
}

var last_time = 0
var current_position = 0
var animation = new Animation(current_position, 0, 1000)

function slideTo(position) {
  var background_image = document.getElementById('bg-img');
  background_image.style.transform = "translateX(-"+position+"px)";
}

function animate(global_time) {
	window.requestAnimationFrame(animate);
	var delta_time = global_time - last_time
	last_time = global_time
	animation.animate(delta_time)
}

function onKeyDown(event) {
	var to_pixel = undefined
	if (event.code === "ArrowDown") {
		to_pixel = 500;
	} else if (event.code === "ArrowUp") {
		to_pixel = 3500;
	} else if (event.code === "ArrowLeft") {
		to_pixel = 1500;
	} else if (event.code === "ArrowRight") {
		to_pixel = 0;
	}

	if (to_pixel !== undefined) {
		animation = new Animation(current_position, to_pixel, 1000)
	}
}


function Animation(from_pixel, to_pixel, animation_duration) {
  this.from_pixel = from_pixel;
  this.to_pixel = to_pixel;
  this.animation_duration = animation_duration;
  this.time_elapsed = 0;
  this.offset_pixels = function() {
  	var dist_to_move = this.to_pixel - this.from_pixel;
  	var next_position = (dist_to_move / this.animation_duration) * this.time_elapsed
  	return next_position
  };
  this.animate = function(delta_time) {
  	this.time_elapsed += delta_time
  	if (this.time_elapsed < this.animation_duration) {
  		var offset_pixels = this.offset_pixels()
  		slideTo(this.from_pixel + offset_pixels);
  		current_position = this.from_pixel + offset_pixels;
  	}
  }
}
