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


SwitchPage = function(page_reference) {
	var html_file_name = page_correspondance[page_reference]
	fetch(html_file_name).then(function(response) {
		return response.text();
	}).then(function(html) {
		document.getElementById('content').innerHTML = html;
	}).catch(function (err) {
		console.warn('Something went wrong.', err);
	})
}