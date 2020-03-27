window.onload = function () {
	// var button = document.getElementsByName('Animate').item(0);
	// button.addEventListener("click", onButtonClick)
	// scene.background_image = document.getElementById('bg-img');
	// scene.train_image = document.getElementById('bg-train-img');
	var scene = new Scene()
	var factory = new ElementFactory(scene)
	factory.createElement('bg', document.getElementById('bg-img'))
	factory.createElement('train', document.getElementById('bg-train-img'))
	document.addEventListener("keydown", scene.onKeyDown.bind(scene));
	window.requestAnimationFrame(scene.animate.bind(scene));
}

var train_state = {
	0: {position:0, duration:500},
	1: {position:500, duration:500},
	2: {position:700, duration:500},
	3: {position:1000, duration:500}
}

var bg_state = {
	0: {position:0, duration:1000},
	1: {position:-500, duration:1000},
	2: {position:-1500, duration:1000},
	3: {position:-6000, duration:1000}
}


function ElementFactory(scene) {
	this.scene = scene
	this.createElement = function(element, image) {
		if (element == 'train') {
			var train_element = new SceneElements(image, train_state);
			this.addElementToScene(train_element);
		} else if (element == 'bg') {
			var bg_element = new SceneElements(image, bg_state);
			this.addElementToScene(bg_element);
		}
	}
	this.addElementToScene = function(element) {
		this.scene.addElement(element)
	}
}

function Scene() {
	this.elements_list = []
	this.last_time = 0
	this.addElement = function (element) {
		this.elements_list.push(element);
	}
	this.animate = function(global_time) {
		window.requestAnimationFrame(this.animate.bind(this));
		var delta_time = global_time - this.last_time
		this.last_time = global_time
		for (var index in this.elements_list) {
			this.elements_list[index].animate(delta_time)
		}
	}
	this.onKeyDown = function(event) {
		var new_state = undefined
		if (event.code === "ArrowDown") {
			new_state = 1;
		} else if (event.code === "ArrowUp") {
			new_state = 3;
		} else if (event.code === "ArrowLeft") {
			new_state = 2;
		} else if (event.code === "ArrowRight") {
			new_state = 0;;
		}
		if (new_state !== undefined) {
			for (var index in this.elements_list) {
				var to_pixel = this.elements_list[index].state_dict[new_state]['position']
				var animation_duration = this.elements_list[index].state_dict[new_state]['duration']
				this.elements_list[index].update_animation(to_pixel, animation_duration)
			}
		}
	}
}

function SceneElements(image, state_dict) {
	this.image = image
	this.state_dict = state_dict
	this.animation_duration = this.state_dict[0]['duration']
	this.current_position = this.state_dict[0]['position']
	this.animation = new Animation(this, this.current_position, 0, this.animation_duration)
	this.animate = function(delta_time) {
		if (this.animation.isAnimationOver() == false) {
			this.animation.animate(delta_time)
		}
	}
	this.update_animation = function(to_pixel, duration) {
		this.animation_duration = duration
		this.animation = new Animation(this, this.current_position, to_pixel, this.animation_duration)
	}
	this.slideTo = function(position) {
		this.image.style.transform = "translateX("+position+"px)";
	}
}

function Animation(object, from_pixel, to_pixel, animation_duration) {
	this.object = object
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
		if (this.time_elapsed > this.animation_duration) {
			this.time_elapsed = this.animation_duration
		}
		if (this.time_elapsed <= this.animation_duration) {
			var offset_pixels = this.offset_pixels()
			this.object.slideTo(this.from_pixel + offset_pixels);
			this.object.current_position = this.from_pixel + offset_pixels;
		}
	}
	this.isAnimationOver = function() {
		return this.time_elapsed >= this.animation_duration
	} 
}


