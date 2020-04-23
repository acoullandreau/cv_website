
var current_page;

getLanguage = function() {
	if (localStorage.getItem("language") == null) {
		var userLanguage = navigator.language || navigator.userLanguage; 
		localStorage.setItem("language", userLanguage);
	} 
	return localStorage.getItem("language");
}

getLanguageJson = function(language) {
	var lang_json_name = undefined;

	if (language.includes('fr')) {
		lang_json_name = 'language_dict_fr.json';
	} 
	// else if (language.includes('pt')) {
	// 	lang_json_name = 'language_dict_pt.json';
	// } 
	else {
		lang_json_name = 'language_dict_en.json';
	}
	var lang_json_promise = fetch(lang_json_name).then(function(response) {
		return response.json();
	}).catch(function (err) {
		console.warn('Something went wrong.', err);
	})
	return lang_json_promise;
}

loadTranslatedContent = function(language, page) {
	//get the language dict and the target html content to translate and load
	promise_json = getLanguageJson(language);
	promise_html_content = fetch(page +'.html').then(function(response) {
		return response.text();
	})

	Promise.all([promise_json, promise_html_content]).then(function(values) {
  		var lang_json = values[0];
  		var page_html = values[1];
  		
  		// updates the content of the html
  		var page_content = lang_json[page];
  		for (var i in page_content) {
  			var page_elem = page_content[i];
  			page_html = page_html.replace(new RegExp(i, "g"), page_elem);
  		}
  		document.getElementById("content").innerHTML = page_html;

  		// update the nav bar
  		var nav_bar_lang = lang_json['nav-bar'];
		var nav_menu_contact_translated = nav_menu_contact.repeat(1);
		nav_menu_contact_translated = nav_menu_contact_translated.replace('{nav-bar.contact}', nav_bar_lang['{nav-bar.contact}'])
		var nav_menu_pdf_translated = nav_menu_pdf.repeat(1);
		nav_menu_pdf_translated = nav_menu_pdf_translated.replace('{cv_name}', nav_bar_lang['{cv_name}']);

		var nav_menu_left_bar_translated = nav_menu_left_bar.repeat(1);
  		for (k in nav_bar_lang) {
  			nav_menu_left_bar_translated = nav_menu_left_bar_translated.replace(k, nav_bar_lang[k]);
  		}

		document.getElementById("contact-text").innerHTML=nav_menu_contact_translated;
		document.getElementById("left-nav-bar-text").innerHTML=nav_menu_left_bar_translated;
		document.getElementById("cv-file").innerHTML=nav_menu_pdf_translated;
		
		current_page = page;

	}).catch(function (err) {
		console.warn('Something went wrong.', err);
	})
}

changeSelectedLanguage = function(language) {
	var index;
	if (language == 'fr') {
		index = 0;
	} else if (language == 'pt') {
		index = 2;
	} else {
		index = 1;
	}
	document.getElementById("select-lang").options.selectedIndex = index;
}




