
angular.module('$strap.directives')

.directive('bsNavbar', ['$location', function($location) {
	'use strict';

	return {
		restrict: 'A',
		link: function postLink($scope, element, attrs, controller) {
			// Watch for the $location
			$scope.$watch(function() {
				return $location.path();
			}, function(newValue, oldValue) {

				element.find('li[data-match-route]').each(function(k, li) {
					var $li = angular.element(li),
						// data('match-rout') does not work with dynamic attributes
						pattern = $li.attr('data-match-route'),
						regexp = new RegExp('^' + pattern + '$', ["i"]);

					if(regexp.test(newValue)) {
						$li.addClass('active');
					} else {
						$li.removeClass('active');
					}

				});
			});
		}
	};
}]);
