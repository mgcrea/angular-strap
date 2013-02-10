
angular.module('$strap.directives')

.directive('bsTooltip', ['$parse', '$compile',  function($parse, $compile) {
	'use strict';

	return {
		restrict: 'A',
		scope: true,
		link: function postLink(scope, element, attrs, ctrl) {

			var getter = $parse(attrs.bsTooltip),
				setter = getter.assign,
				value = getter(scope);

			// Watch bsTooltip for changes
			scope.$watch(attrs.bsTooltip, function(newValue, oldValue) {
				if(newValue !== oldValue) {
					value = newValue;
				}
			});

			if(!!attrs.unique) {
				element.on('show', function(ev) {
					// Hide any active popover except self
					$(".tooltip.in").each(function() {
						var $this = $(this),
							tooltip = $this.data('tooltip');
						if(tooltip && !tooltip.$element.is(element)) {
							$this.tooltip('hide');
						}
					});
				});
			}

			// Initialize tooltip
			element.tooltip({
				title: function() { return angular.isFunction(value) ? value.apply(null, arguments) : value; },
				html: true
			});

			// Bootstrap override to provide events & tip() reference
			var tooltip = element.data('tooltip');
			tooltip.show = function() {
				var e = $.Event('show');
				this.$element.trigger(e);
				if (e.isDefaultPrevented()) {
					return;
				}
				var r = $.fn.tooltip.Constructor.prototype.show.apply(this, arguments);
				// Bind popover to the tip()
				this.tip().data('tooltip', this);
				return r;
			};
			tooltip.hide = function() {
				var e = $.Event('hide');
				this.$element.trigger(e);
				if (e.isDefaultPrevented()) {
					return;
				}
				return $.fn.tooltip.Constructor.prototype.hide.apply(this, arguments);
			};

			//Provide scope display functions
			scope._tooltip = function(event) {
				element.tooltip(event);
			};
			scope.hide = function() {
				element.tooltip('hide');
			};
			scope.show = function() {
				element.tooltip('show');
			};
			scope.dismiss = scope.hide;

		}
	};

}]);
