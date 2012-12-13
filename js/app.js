
$(function() {

	$("html").removeClass("no-js").addClass("js");

	var $window = $(window);

	$(document).ready(function($) {

		// Disable certain links in docs
		$('section [href^=#]').click(function (e) {
			e.preventDefault();
		});

		// Sidebar
		var $sidenav = $('.bs-docs-sidenav'), offset = $sidenav.offset();
		$sidenav.affix({offset: {top: offset.top - ($window.width() <= 979 ? 20 : 70), bottom: 270}}).addClass('animated');

		// Make code pretty
		window.prettyPrint && window.prettyPrint();

		/*$("pre.prettyprint").each(function() {
			var $this = $(this);
			$this.text($this.html().replace('/\s+/ig', ''));
		});*/

	});

});

var app = angular.module('strap', ['$strap.directives']);

app.controller('StrapCtrl', function($scope) {
	$scope.dropdown = [
		{text: 'Another action', href: '#anotherAction'},
		{text: 'Something else here', href: '#', click: 'modal.saved=true'},
		{divider: true},
		{text: 'Separated link', href: '#',
			submenu: [
				{text: 'Second level link', href: '#'},
				{text: 'Second level link 2', href: '#'}
			]
		}
	];
	$scope.formattedDropdown = "[\n  {text: 'Another action', href:'#anotherAction'},\n  {text: 'Another action', href:'#anotherAction'},\n  {divider: true},\n  {text: 'Separated link', href:'#', submenu: [\n    {text: 'Second level link', href: '#'},\n    {text: 'Second level link 2', href: '#'}\n  ]}\n]";
	$scope.modal = {content: 'Hello Modal', saved: false};
	$scope.tooltip = {title: "Hello Tooltip<br />This is a multiline message!"};
	$scope.popover = {content: "Hello Popover<br />This is a multiline message!", saved: false};
	$scope.button = {active: true};
	$scope.checkbox = {left: false, middle: true, right: false};
	$scope.typeahead = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Dakota","North Carolina","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"];
	$scope.datepicker = {date: ''};
	$scope.timepicker = {time: ''};
});
