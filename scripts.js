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

SwitchPage = function(page_reference) {
	var html_file = page_correspondance[page_reference];
	var content_language = getLanguage();
	scene.changePage(page_reference, function() {
		loadTranslatedContent(content_language, html_file)
	});
}

SwitchLanguage = function(language) {
	localStorage.setItem("language", language);
	var content_language = getLanguage();
	loadTranslatedContent(content_language, current_page);
}

OpenOverlay = function(section_reference, element_reference) {
	var overlay_template = 'overlay_template.html';
	var overlay_json = 'overlay_content.json';

	promise_json = fetch(overlay_json).then(function(response) {
		return response.json();
	})
	promise_html = fetch(overlay_template).then(function(response) {
		return response.text();
	})

	Promise.all([promise_json, promise_html]).then(function(values) {
  		var json = values[0];
  		var html = values[1];
  		var overlay_content = document.getElementById("overlay-content");
  		var content = "";

  		for (var i in json[section_reference][element_reference]) {
  			var elem = json[section_reference][element_reference][i];
  			var template = html.repeat(1);
  			template = template.replace('{title}', elem['title']);
  			
  			var list = "";
  			// can add an if to check if list exists
  			for (var k in elem['list']) {
  				var list_elem = elem['list'][k];
  				list += '<li>' + list_elem + '</li>'
  			}
  			template = template.replace('{list}', list);
  			content+=template;
  		}
  		overlay_content.innerHTML = content;
  		document.getElementById("overlay").style.display = "block";
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

	if (action == 1) {
		elem_to_edit.style.display = "inline-block";
	} else {
		elem_to_edit.style.display = "none";
	}
	
}
