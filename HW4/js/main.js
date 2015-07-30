/// <reference path="../../typings/jquery/jquery.d.ts"/>
if (typeof jQuery == 'undefined')
	alert("jQuery is not defined.")
else if (typeof Firebase == 'undefined')
	alert('Firebase is not defined');
else {
	// search utility
	var SearchUtil = function (tagList) {
		var list = [];

		tagList.on('value', function (xs) {
			xs.forEach(function (x) {
				var tagName = x.key(),
					tagData = x.val(); // {category, description, example}
				list.push(tagName);
			});
		});

		this.search = function (query) {
			var results = [];
			list.forEach(function (result) {
				if (result.indexOf(query) != -1) {
					results.push(result);
				}
					
			});
			return results;
		}
	};

	$(document).ready(function () {
		var searchTimeout,
			body = $('body'),
			searchBox = $('.navbar-right input.form-control'),
			resultBox = $('<div class="search-result-box"></div>').appendTo(body),
			resultList = $('<ul></ul>').appendTo(resultBox),
			tagList = new Firebase('https://boiling-heat-3594.firebaseio.com').child('tags'),
			su = new SearchUtil(tagList);
		// attach search function to the search input
		searchBox.on('input', function (event) {
			clearTimeout(searchTimeout);
			searchTimeout = setTimeout(function () {
				var results = su.search(searchBox.val());
				// show list
				resultList.empty();
				for (var result in results) {
					var data = results[result],
						li = $('<li></li>').appendTo(resultList),
						link = $('<a></a>').text(data).attr('href', 'tag.html?id=' + data).appendTo(li);
				}

			}, 250);
		});
	});
}