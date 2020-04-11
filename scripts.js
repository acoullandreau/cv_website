page_correspondance = {
	0:'home.html',
	1:'presentation.html',
	2:'contact_form.html',
	3:'temoignages.html',
	4:'exp-pro.html',
	5:'competences.html',
	6:'accomplissements.html',
	7:'exp_pers.html',
	8:'eductaion.html',
	9:'passions.html'
}

overlay_dict_correspondance = {
	'missions':'Missions',
	'competences_mobilisées':'Compétences mobilisées',
	'competences_acquises':'Compétences acquises',
	'perfectionnement_professionnel':'Perfectionnement professionnel'
}

SwitchPage = function(page_reference) {
	var html_file_name = page_correspondance[page_reference]
	fetch(html_file_name).then(function(response) {
		return response.text();
	}).then(function(html) {
		document.getElementById('content').innerHTML = html;
		scene.changePage(page_reference);
	}).catch(function (err) {
		console.warn('Something went wrong.', err);
	})
}


OpenOverlay = function(section_reference, element_reference) {
	var overlay_template = 'overlay_template_one_div.html';
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