/// <reference path="../../typings/jquery/jquery.d.ts"/>
if (typeof jQuery == 'undefined')
	alert("jQuery is not defined.")
else if (typeof Firebase == 'undefined')
	alert('Firebase is not defined');
else {
	// search utility
	var SearchUtil = function (tagList) {
		var that = this,
			list = [];
		this.ready = false;

		tagList.on('value', function (xs) {
			xs.forEach(function (x) {
				var tagName = x.key(),
					tagData = x.val(); // {category, description, example}
				list.push(tagName);
			});
			that.ready = true;
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
	
      /*
       * getParams() - Retrieves the GET parameter 'id' used in searching the Firebase database.
       * 
       * No parameters.
       *
       */
      function getParams() {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
          vars[key] = value;
        });
        return vars;
      }

	$(document).ready(function () {
		var searchTimeout,
			body = $('body'),
			searchBox = $('.navbar-right input.form-control'),
			resultBox = $('<div class="search-result-box list-group"></div>').appendTo(body),
			closeBtn = $('<a class="list-group-item list-group-item-info" href="#">Close<span class="glyphicon glyphicon-close"></span></a>').on('click', function () { 
				resultBox.hide();
			}).appendTo(resultBox),
			tagList = new Firebase('https://boiling-heat-3594.firebaseio.com').child('tags'),
			su = new SearchUtil(tagList);
		// attach search function to the search input
		searchBox.on('input', function (event) {
			var query = searchBox.val();
			if (query.length < 1)
				return;
			clearTimeout(searchTimeout);

			var doSearch = function () {
				if (!su.ready) {
					searchTimeout = setTimeout(doSearch, 250);
					return;
				}
				resultBox.find('a:not(.list-group-item-info)').remove();
				var results = su.search(searchBox.val()),
					first = true;
				// show list
				for (var result in results) {
					var data = results[result],
						link = $('<a class="list-group-item"></a>').appendTo(resultBox).text(data).attr('href', 'tag.html?id=' + data);
					if (first) {
						first = false;
						link.addClass('active');
					}
				}
				resultBox.show();
				if (!results.length) {
					$('<a class="list-group-item list-group-item-warning">No results found!</a>').appendTo(resultBox);
				}
			}

			searchTimeout = setTimeout(doSearch, 250);
		}).keypress(function (event) {
			// enter key was pressed 
			if (event.which == 13) {
				var active = resultBox.find('a.active'),
					link = active.attr('href');
				window.location.href = link;
				return false;
			}
		});
	});
}