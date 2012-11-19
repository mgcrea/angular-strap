
$(function() {

	$("html").removeClass("no-js").addClass("js");

	$(document).ready(function($) {

		var offset = $("header").height() + $(".navbar-fixed-top").height();
		$(".bs-docs-sidenav").affix({offset: offset}).addClass("animated");


		/*$("pre.prettyprint").each(function() {
			var $this = $(this);
			$this.text($this.html().replace('/\s+/ig', ''));
		});*/
		prettyPrint();


	});

});

var app = angular.module('strap', ['$strap.directives']);

app.controller('StrapCtrl', function($scope) {
	$scope.popover = {content: 'Hello World'};
	$scope.button = {active: true};
	$scope.checkbox = {left: false, middle: true, right: false};
	$scope.datepicker = {date: ''};
});
