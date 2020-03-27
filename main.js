window.onload = function () {
	// var button = document.getElementsByName('Animate').item(0);
	// button.addEventListener("click", onButtonClick)
	// scene.background_image = document.getElementById('bg-img');
	// scene.train_image = document.getElementById('bg-train-img');
	scene.bg_element.image = document.getElementById('bg-img');
	scene.train_element.image = document.getElementById('bg-train-img');
	document.addEventListener("keydown", scene.onKeyDown.bind(scene));
	window.requestAnimationFrame(scene.animate.bind(scene));
}

var scene = new Scene()

function Scene() {
	this.background_image
	this.train_image
	this.train_element = new SceneElements(1000)
	this.bg_element = new SceneElements(1000)
	this.last_time = 0
	this.slideTo = function(object, position) {
		object.image.style.transform = "translateX(-"+position+"px)";
	}
	this.animate = function(global_time) {
		window.requestAnimationFrame(this.animate.bind(this));
		var delta_time = global_time - this.last_time
		this.last_time = global_time
		this.bg_element.animation.animate(this.bg_element, delta_time)
	}
	this.onKeyDown = function(event) {
		var to_pixel = undefined
		if (event.code === "ArrowDown") {
			to_pixel = 500;
		} else if (event.code === "ArrowUp") {
			to_pixel = 6000;
		} else if (event.code === "ArrowLeft") {
			to_pixel = 1500;
		} else if (event.code === "ArrowRight") {
			to_pixel = 0;
		}
		if (to_pixel !== undefined) {
			scene.bg_element.update_animation(to_pixel)
		}
	}
}

function SceneElements(animation_duration) {
	this.animation_duration = animation_duration
	this.image
	this.current_position = 0
	this.animation = new Animation(this.current_position, 0, this.animation_duration)
	this.update_animation = function (to_pixel) {
		this.animation = new Animation(this.current_position, to_pixel, this.animation_duration)
	}
	this.slideTo = function(position) {
		this.image.style.transform = "translateX(-"+position+"px)";
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
  this.animate = function(object, delta_time) {
  	this.time_elapsed += delta_time
  	if (this.time_elapsed < this.animation_duration) {
  		var offset_pixels = this.offset_pixels()
  		object.slideTo(this.from_pixel + offset_pixels);
  		object.current_position = this.from_pixel + offset_pixels;
  	}
  }
}


