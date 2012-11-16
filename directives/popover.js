
angular.module('$strap.directives')

.directive('bsPopover', ['$compile', '$http', '$templateCache', '$timeout',  function($compile, $http, $templateCache, $timeout) {

  // Hide popovers when pressing esc
  $("body").on("keyup", function(ev) {
    if(ev.keyCode == 27) $("body > .popover").each(function() {
      var $this = $(this);
      $this.popover('hide');
    });
  })

  return {
    restrict: 'A',
    link: function postLink(scope, element, attr, ctrl) {
      //console.warn('postLink', this, arguments);
      //$templateCache.removeAll();
      var r = (Math.random() * 10e12).toFixed();
      $http.get(attr.bsPopover, {cache: false}).success(function(data) {

        // Provide dismiss function
        scope.dismiss = function() {
          element.popover('hide');
          //console.warn(element.data('popover').tip().scope(), scope)
          //element.data('popover').tip().find("form").get(0).reset();
        };

        scope.show = function() {
          element.popover('show');
          //console.warn(element.data('popover').tip().scope(), scope)
          //element.data('popover').tip().find("form").get(0).reset();
        };

        // Visibility handling
        element.on('click', function(ev) {
          var popover = element.data('popover'),
            visibility = !popover.tip().hasClass('in');

          // Hide any active popover except self
          if(!attr.multiple) $("body > .popover").each(function() {
            var $this = $(this),
              popover = $this.data('popover');
            if(popover && !popover.$element.is(element)) $this.popover('hide');
          });

          // Toggle the popover
          element.popover(visibility ? 'show' : 'hide');
        });

        // Create popover
        element.popover({
          content: function() {
            $timeout(function(){
              $compile(element.data('popover').tip())(scope);
            });
            return data;
          },
          trigger: 'manual',
          html: true
        });

        // Bootstrap override to provide events & tip() reference
        var popover = element.data('popover');
        popover.show = function() {
          var e = $.Event('show');
          this.$element.trigger(e);
          if (e.isDefaultPrevented()) return;
          var r = $.fn.tooltip.Constructor.prototype.show.apply(this, arguments);
          // Bind popover to the tip()
          this.tip().data('popover', this);
          return r;
        }
        popover.hide = function() {
          var e = $.Event('hide');
          this.$element.trigger(e);
          if (e.isDefaultPrevented()) return;
          return $.fn.tooltip.Constructor.prototype.hide.apply(this, arguments);
        }

      });
    }
  };
}]);
