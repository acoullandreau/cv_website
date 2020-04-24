window.onload = function () {
	nav_menu_contact = document.getElementById("contact-text").innerHTML;
	nav_menu_left_bar = document.getElementById("left-nav-bar-text").innerHTML;
	nav_menu_pdf = document.getElementById("cv-file").innerHTML;
	//load the home page in the default browser language	
	// localStorage.removeItem("language"); // we reset the value stored
	var target_page = window.location.href.split('#')[1]
	if (target_page === '') {
		target_page = 'home';
	}
	var browser_default_language = getLanguage();
	var translation_promise = loadTranslatedContent(browser_default_language, target_page);
	changeSelectedLanguage(browser_default_language)

	translation_promise.then(function(value) {
		document.getElementById("loading-page").style.display = "none";
		document.getElementById("loaded-content").style.display = "block";

		// We create the scene instance that will hold the scene elements
		scene = new Scene();
		var factory = new ElementFactory(scene);
		factory.createElement('bg', document.getElementById('bg-img'));
		factory.createElement('train', document.getElementById('bg-train-img'));
		factory.createElement('bg', document.getElementById('fg-hide-train-img'))

		// we add an event that is always listening, not just when the page load
		window.addEventListener("resize", scene.onResize.bind(scene));

		// we initialise the requestAnimationFrame function that will handle the animation of the elements
		window.requestAnimationFrame(scene.animate.bind(scene));
	});
	
}

var nav_menu_contact;
var nav_menu_left_bar;
var nav_menu_pdf;
var scene;
var ORIGINAL_BG_HEIGHT = 1025;
var ORIGINAL_BG_WIDTH = 9100;

var train_state = {
	0: {position: 0, duration: 500},
	1: {position: 250, duration: 500},
	2: {position: 500, duration: 500},
	3: {position: 750, duration: 500},
	4: {position: 900, duration: 500},
	5: {position: 1200, duration: 500},
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
	this.animating = true;
	this.background;
	this.elements_list = [];
	this.animation_list = [];
	this.current_animation_index = 0;
	this.current_state = 0;
	this.last_time = 0;
	this.ratio = window.innerHeight / ORIGINAL_BG_HEIGHT;
	this.addElement = function (element) {
		this.elements_list.push(element);
	}
	this.addBackground = function(element) {
		this.background = element;
	}
	this.animate = function(global_time) {
		// this function is first called when the page is loaded
		// then it is called again everytime this.requestAnimationFrame() is called, and while there are still elements to animate (animations_pending == true)
		var animations_pending = false;
		for (var index in this.animation_list[this.current_animation_index]) {
			var animation = this.animation_list[this.current_animation_index][index]
			if (animation.isAnimationOver() == false) {
				animations_pending = true;
			}
		}
		// There are no animations pending
		if (animations_pending == false) {
			this.current_animation_index += 1;
			// We check if there are more animations to process
			if (this.current_animation_index  >=this.animation_list.length) {
				// We got to the end of the list of animations, we reset the index and stop animating
				this.current_animation_index = 0;
				this.animating = false;
			} else {
				window.requestAnimationFrame(this.animate.bind(this));
			}
		} else {
			// there are animations pending, so we keep requesting frames and computing the animations
			window.requestAnimationFrame(this.animate.bind(this));
			if (this.animating == false) {
				// we update the current state to "we are animating", and we reset the last_time value
				this.animating = true;
				this.last_time = global_time;
			}
			var delta_time = global_time - this.last_time;
			this.last_time = global_time;
			for (var index in this.animation_list[this.current_animation_index]) {
				var animation = this.animation_list[this.current_animation_index][index]
				animation.animate(delta_time);
			}
		}
	}
	this.changePage = function(page_reference, callback) {
		var new_state = undefined
		if (page_reference === 1) {
			new_state = 1;
		} else if (page_reference === 3) {
			new_state = 2;
		} else if (page_reference === 4) {
			new_state = 3;
		} else if (page_reference === 5) {
			new_state = 4;
		} else if (page_reference === 6) {
			new_state = 5;
		} else if (page_reference === 7) {
			new_state = 6;
		} else if (page_reference === 8) {
			new_state = 7;
		} else if (page_reference === 9) {
			new_state = 8;
		} else if (page_reference === 0 || page_reference === 2){
			new_state = 0;
		}

		if (new_state !== undefined) {
			// we set back the current animation index to 0 to make sure we always start by fading out whatever content was loaded
			this.current_animation_index = 0;
			var slide_animations = []
			for (var index in this.elements_list) {
				var to_pixel = this.elements_list[index].state_dict[new_state]['position'];
				if ((to_pixel + window.innerWidth)>ORIGINAL_BG_WIDTH) {
					to_pixel = this.elements_list[index].state_dict[new_state]['position']
				}
				var animation_duration = this.calculate_animation_duration(new_state)
				this.elements_list[index].updateAnimation(new_state, to_pixel, animation_duration);
				slide_animations.push(this.elements_list[index].animation)
			}
			// we update the list of animations with the new target
			this.updateAnimationList(slide_animations, callback);
			this.current_state = new_state;
		}
		// we call the scene.animate function again with the new list of animations
		this.requestAnimationFrame();
	}
	this.onResize = function(event) {
		this.ratio = window.innerHeight / ORIGINAL_BG_HEIGHT;
		for (var index in this.elements_list) {
			this.elements_list[index].updateOnResize();
		}
	}
	this.requestAnimationFrame = function () {
		if (this.animating == false) {
			window.requestAnimationFrame(this.animate.bind(this));
		}
	}
	this.updateAnimationList = function(slide_animations, callback) {
		var content_to_fade = document.getElementById("content-container").style;
		// instead of starting fading out from 1, we start fading out from whatever opacity the content to fade currently has
		// if it doesn't have any set, we arbitrarily set it to 1
		if (content_to_fade.opacity === undefined || content_to_fade.opacity === '') {
			content_to_fade.opacity = 1;
		}

		var fade_out_animation = new Animation(content_to_fade, parseFloat(content_to_fade.opacity), 0, 'opacity', 500, 'linear', callback);
		var fade_in_animation = new Animation(content_to_fade, 0, 1, 'opacity', 500);
		this.animation_list = [[fade_out_animation], slide_animations, [fade_in_animation]];
	}
	this.calculate_animation_duration = function(next_state) {
		var default_duration = 1000;
		var diff_states = Math.abs(next_state - this.current_state);
		return default_duration + diff_states*200
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
	this.animation = new Animation(this, this.current_position, 0, 'pixel', this.animation_duration, 'easeInOutQuart')
	this.animate = function(delta_time) {
		if (this.animation.isAnimationOver() == false) {
			this.animation.animate(delta_time)
		}
	}
	this.updateAnimation = function(state, to_pixel, duration) {
		this.current_state = state;
		this.animation_duration = duration;
		this.animation = new Animation(this, this.current_position, to_pixel, 'pixel', this.animation_duration, 'easeInOutQuart');
	}
	this.slideTo = function(position) {
		var scene_ratio = this.scene.ratio;
		var target_position = position * scene_ratio;
		if (Math.abs(target_position) > ORIGINAL_BG_WIDTH * this.scene.ratio - window.innerWidth) {
			target_position = -ORIGINAL_BG_WIDTH * this.scene.ratio + window.innerWidth;
		}
		this.image.style.transform = "translateX("+target_position+"px)";
	}
	this.updateOnResize = function() {
		var updated_position = this.state_dict[this.current_state]['position'];
		this.slideTo(updated_position);
		if (this.is_background == false) {
			this.image.style.top = (0.93*this.scene.elements_list[0].image.getBoundingClientRect().height)+"px";
		}
	}
}

function Animation(object, from, to, target, animation_duration, easing_function = 'linear', end_callback) {
	this.object = object
	this.from = from;
	this.to = to;
	this.target = target;
	this.animation_duration = animation_duration;
	this.end_callback = end_callback;
	this.time_elapsed = 0;
	this.easing_function = easing_function;
	this.easeInOutQuad = function(x) {
		// x is between 0 and 1, returned value is also between 0 and 1
		return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
	}
	this.easeInOutQuart = function(x){
		return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
	}
	this.linear = function(x) {
		return x;
	}
	this.offsetValue = function() {
		var offset = this.to - this.from;
		var transform_ratio = this[this.easing_function](this.time_elapsed / this.animation_duration);
		return offset*transform_ratio;

	};
	this.animate = function(delta_time) {
		this.time_elapsed += delta_time
		if (this.time_elapsed > this.animation_duration) {
			this.time_elapsed = this.animation_duration
		}
		if (this.time_elapsed <= this.animation_duration) {
			if (this.target == 'pixel') {
				var offset_pixels = this.offsetValue();
				this.object.slideTo(this.from + offset_pixels);
				this.object.current_position = this.from + offset_pixels;
			} else if (this.target == 'opacity') {
				var offset_opacity = this.offsetValue();
				this.object.opacity = this.from + offset_opacity;
			}
		}
	}
	this.isAnimationOver = function() {
		if (this.time_elapsed >= this.animation_duration) {
			if (this.end_callback !== undefined) {
				this.end_callback();
			}
			return true;
		} 
		return false;
	} 
}

// General logic of the code
// 1. we load the page : create all the scene elements, initialise the animation logic, create an event listener for window resize
// 2. whenever the window is resized, we recompute the position of the elements to take into account the new scaling ratio
// 3. whenever the scene.changePage is called (from another script linked to the onclick attribute in the HTML), we compute the target position and duration of the animation,
// we rebuild the list of animation and we call the scene.animate function
// 4. in the scene.animate function : we check if for the current animation in the list that is being handled all the animations are over ;
// if all the animations are over, we increment the index of the current animation and we repeat
// if all the animations are not over, we animate the element
