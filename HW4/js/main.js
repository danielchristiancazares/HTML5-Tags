/// <reference path="../../typings/jquery/jquery.d.ts"/>
if (typeof jQuery == 'undefined')
	alert("jQuery is not defined.")
else {

	$(document).ready(function () {

		var searchTimeout,
			searchBox = $('.navbar-right input.form-control'); 
		
		// attach search function to the search input
		searchBox.on('input', function (event) {
			clearTimeout(searchTimeout);
			searchTimeout = setTimeout(function () {
				searchBox.val(searchTimeout);


			}, 250);
		});
	});
}