
$(function() {

	$("html").removeClass("no-js").addClass("js");

	$(document).ready(function($) {

		var $sidenav = $(".bs-docs-sidenav");
		var offset = $sidenav.offset();
		$sidenav.affix({offset: offset.top - 20}).addClass("animated");

		/*$("pre.prettyprint").each(function() {
			var $this = $(this);
			$this.text($this.html().replace('/\s+/ig', ''));
		});*/
		prettyPrint();

	});

});

var app = angular.module('strap', ['$strap.directives']);

app.controller('StrapCtrl', function($scope) {
	$scope.modal = {content: 'Hello Modal', saved: false};
	$scope.popover = {content: 'Hello Popover', saved: false};
	$scope.button = {active: true};
	$scope.checkbox = {left: false, middle: true, right: false};
	$scope.datepicker = {date: ''};
});
