window.onload = function () {
	// var button = document.getElementsByName('Animate').item(0);
	// button.addEventListener("click", onButtonClick)
	// scene.background_image = document.getElementById('bg-img');
	// scene.train_image = document.getElementById('bg-train-img');
	var scene = new Scene()
	var factory = new ElementFactory(scene)
	factory.createElement('bg', document.getElementById('bg-img'))
	factory.createElement('train', document.getElementById('bg-train-img'))
	// factory.createElement('foreground', document.getElementById('fg-hide-train-img'))
	console.log(scene.elements_list[0].image.getBoundingClientRect())
	window.addEventListener("resize", scene.onResize.bind(scene));
	document.addEventListener("keydown", scene.onKeyDown.bind(scene));
	window.requestAnimationFrame(scene.animate.bind(scene));
}

var train_state = {
	0: {position: 0, duration: 500},
	1: {position: 250, duration: 500},
	2: {position: 500, duration: 500},
	3: {position: 750, duration: 500},
	4: {position: 1000, duration: 500},
	5: {position: 1150, duration: 500},
	6: {position: 1300, duration: 500},
	7: {position: 1400, duration: 500},
	8: {position: 1500, duration: 500}
}

var bg_state = {
	0: {position: 0, duration: 1000},
	1: {position: -700, duration: 1000},
	2: {position: -1300, duration: 1000},
	3: {position: -2100, duration: 1000},
	4: {position: -3100, duration: 1000},
	5: {position: -4100, duration: 1000},
	6: {position: -5100, duration: 1000},
	7: {position: -6100, duration: 1000},
	8: {position: -7200, duration: 1000}
}

var fg_state = {
	0: {position: 0, duration: 0},
	1: {position: 0, duration: 0},
	2: {position: 0, duration: 0},
	3: {position: 0, duration: 0},
	4: {position: 0, duration: 0},
	5: {position: 0, duration: 0},
	6: {position: 0, duration: 0},
	7: {position: 0, duration: 0},
	8: {position: 0, duration: 0}
}

function ElementFactory(scene) {
	this.scene = scene
	this.createElement = function(element, image) {
		if (element == 'train') {
			var train_element = new SceneElements(image, train_state);
			this.addElementToScene(train_element);
			train_element.image.style.top = (0.93*this.scene.elements_list[0].image.getBoundingClientRect().height)+"px";
		} else if (element == 'bg') {
			var bg_element = new SceneElements(image, bg_state);
			bg_element.is_background = true;
			this.addElementToScene(bg_element);
			this.addBackgroundToScene(bg_element);
		} else if (element == 'foreground') {
			var foreground_element = new SceneElements(image, fg_state);
			this.addElementToScene(foreground_element);
		}
	}
	this.addElementToScene = function(element) {
		this.scene.addElement(element);
		element.scene = this.scene;
	}
	this.addBackgroundToScene = function(element) {
		this.addBackground = element;
	}
}

function Scene() {
	this.background;
	this.elements_list = [];
	this.last_time = 0;
	this.ratio = window.innerHeight / 1025;
	this.addElement = function (element) {
		this.elements_list.push(element);
	}
	this.addBackground = function(element) {
		this.background = element;
	}
	this.animate = function(global_time) {
		window.requestAnimationFrame(this.animate.bind(this));
		var delta_time = global_time - this.last_time;
		this.last_time = global_time;
		for (var index in this.elements_list) {
			this.elements_list[index].animate(delta_time);
		}
	}
	this.onKeyDown = function(event) {
		var new_state = undefined
		if (event.code === "KeyW") {
			new_state = 1;
		} else if (event.code === "KeyE") {
			new_state = 2;
		} else if (event.code === "KeyR") {
			new_state = 3;
		} else if (event.code === "KeyT") {
			new_state = 4;
		} else if (event.code === "KeyY") {
			new_state = 5;
		} else if (event.code === "KeyU") {
			new_state = 6;
		} else if (event.code === "KeyI") {
			new_state = 7;
		} else if (event.code === "KeyO") {
			new_state = 8;
		} else if (event.code === "KeyQ") {
			new_state = 0;
		}

		if (new_state !== undefined) {
			for (var index in this.elements_list) {
				var to_pixel = this.elements_list[index].state_dict[new_state]['position'];
				var animation_duration = this.elements_list[index].state_dict[new_state]['duration'];
				if ((to_pixel + 1100)>9100) {
					to_pixel = this.elements_list[index].state_dict[new_state]['position']
				}
				this.elements_list[index].updateAnimation(new_state, to_pixel, animation_duration);
			}
		}
	}
	this.onResize = function(event) {
		this.ratio = window.innerHeight / 1025;
		if (this.ratio < 1) {
			this.ratio = 1;
		}
		for (var index in this.elements_list) {
			this.elements_list[index].updateOnResize();
		}
	} 
}

function SceneElements(image, state_dict) {
	this.image = image
	this.scene
	this.is_background = false
	this.state_dict = state_dict
	this.current_state = 0
	this.animation_duration = this.state_dict[this.current_state]['duration']
	this.current_position = this.state_dict[this.current_state]['position']
	this.animation = new Animation(this, this.current_position, 0, this.animation_duration)
	this.animate = function(delta_time) {
		if (this.animation.isAnimationOver() == false) {
			this.animation.animate(delta_time)
		}
	}
	this.updateAnimation = function(state, to_pixel, duration) {
		this.current_state = state;
		this.animation_duration = duration;
		this.animation = new Animation(this, this.current_position, to_pixel, this.animation_duration);
	}
	this.slideTo = function(position) {
		var scene_ratio = this.scene.ratio;
		var target_position = position * scene_ratio;
		if (Math.abs(target_position) > 9100 * this.scene.ratio - window.innerWidth) {
			target_position = -9100 * this.scene.ratio + window.innerWidth;
		}
		this.image.style.transform = "translateX("+target_position+"px)";
	}
	this.updateOnResize = function() {
		var updated_position = this.state_dict[this.current_state]['position'];
		this.slideTo(updated_position);
		if (this.is_background == false) {
			if (this.scene.ratio > 1) {
				this.image.style.top = (0.93*this.scene.elements_list[0].image.getBoundingClientRect().height)+"px";
			}
		}
		console.log(this.scene.elements_list[0].image.getBoundingClientRect().height);
	}
}

function Animation(object, from_pixel, to_pixel, animation_duration) {
	this.object = object
	this.from_pixel = from_pixel;
	this.to_pixel = to_pixel;
	this.animation_duration = animation_duration;
	this.time_elapsed = 0;
	this.offsetPixels = function() {
		var dist_to_move = this.to_pixel - this.from_pixel;
		var next_position = (dist_to_move / this.animation_duration) * this.time_elapsed
		return next_position
	};
	this.animate = function(delta_time) {
		this.time_elapsed += delta_time
		if (this.time_elapsed > this.animation_duration) {
			this.time_elapsed = this.animation_duration
		}
		if (this.time_elapsed <= this.animation_duration) {
			var offset_pixels = this.offsetPixels()
			this.object.slideTo(this.from_pixel + offset_pixels);
			this.object.current_position = this.from_pixel + offset_pixels;
		}
	}
	this.isAnimationOver = function() {
		return this.time_elapsed >= this.animation_duration
	} 
}


