
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
	$scope.typeahead = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Dakota","North Carolina","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"];
	$scope.datepicker = {date: ''};
});
