page_correspondance = {
	0:'home',
	1:'presentation',
	2:'contact_form',
	3:'temoignages',
	4:'exp-pro',
	5:'competences',
	6:'accomplissements',
	7:'exp_pers',
	8:'education',
	9:'passions'
}

nav_bar_correspondance = {
	0:'nav-bar-presentation',
	1:'nav-bar-temoignages',
	2:'nav-bar-exp-pro',
	3:'nav-bar-competences',
	4:'nav-bar-accomplissements',
	5:'nav-bar-exp-pers',
	6:'nav-bar-education',
	7:'nav-bar-passions',
}

nav_bar_hover_state = {
	0:false,
	1:false,
	2:false,
	3:false,
	4:false,
	5:false,
	6:false,
	7:false,
}

SwitchPage = function(page_reference) {
	var target_html_file = page_correspondance[page_reference];

	// triggers change page logic only if the user wants to acces another page
	if (target_html_file !== current_page) {
		var content_language = getLanguage();
		scene.changePage(page_reference, function() {
			loadTranslatedContent(content_language, target_html_file)
		});
	}
}

SwitchLanguage = function(language) {
	localStorage.setItem("language", language);
	var content_language = getLanguage();
	loadTranslatedContent(content_language, current_page);
}

OpenOverlay = function(section_reference, element_reference) {
	var overlay_template = 'overlay_template.html';
	var language = getLanguage()
	
	promise_json = getLanguageJson(language)
	promise_html = fetch(overlay_template).then(function(response) {
		return response.text();
	})

	Promise.all([promise_json, promise_html]).then(function(values) {
  		var json = values[0]['overlay_content'];
  		var html = values[1];
  		var overlay_content = document.getElementById("overlay-content");
  		var content = "";
  		var overlay_type;

  		for (var i in json[section_reference][element_reference]) {
  			var elem = json[section_reference][element_reference][i];
  			var template = html.repeat(1);
  			template = template.replace('{title}', elem['title']);
  			
  			var list = "";
  			// can add an if to check if list exists
  			if ('list' in elem) {
  				overlay_type = 'list';
	  			for (var k in elem['list']) {
	  				var list_elem = elem['list'][k];
	  				list += '<li>' + list_elem + '</li>'
	  			}
  				template = template.replace('{list}', list);
  			} else if ('text' in elem) {
  				//currently specific to the contact form submit message
  				overlay_type = 'message';
  				template = template.replace('{list}', elem['text']);

  			}
  			content+=template;
  		}
  		overlay_content.innerHTML = content;
  		document.getElementById("overlay").style.display = "block";
  		if (overlay_type == 'message') {
			document.getElementById("overlay-quote-left").style.display = "none";
			document.getElementById("overlay-quote-right").style.display = "none";
  		}
	}).catch(function (err) {
		console.warn('Something went wrong.', err);
	})
}

CloseWindow = function() {
	document.getElementById("overlay").style.display = "none";
}


NavBarHover = function(element_reference, action) {
	var elem_ref = nav_bar_correspondance[element_reference];
	var elem_to_edit = document.getElementById(elem_ref);

	for (nav_bar_elem in nav_bar_hover_state) {
		nav_bar_hover_state[nav_bar_elem] = false;
		var elem_to_hide = document.getElementById(nav_bar_correspondance[nav_bar_elem]);
		elem_to_hide.style.display = "none";
	}

	if (action == 1) {
		nav_bar_hover_state[element_reference] = true;
		elem_to_edit.style.display = "inline-block";
	} 
}

FormSubmit = function() {
	// retrieve the content of the form
	var form = document.getElementById("contact-form");
	var fname = form.elements[0].value;
	var lname = form.elements[1].value;
	var email = form.elements[2].value;
	var message = form.elements[3].value;
	// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! missing the attachment !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	console.log(fname, lname, email, message)

	// display an acknowledgment message for the form submission
	OpenOverlay('form', 'success');

}


