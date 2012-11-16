
angular.module('$strap.directives')

.directive('bsPopover', ['$compile', '$http', '$timeout', function($compile, $http, $timeout) {

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

      $http.get(attr.bsPopover).success(function(data) {

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

        element.popover({
          content: function() {
            $timeout(function(){
              $compile(element.data('popover').tip())(scope);
            });
            return data;
          },
          trigger: 'manual',
          html: true
        }).on('click', function(ev) {
          var popover = element.data('popover'),
            tip = popover.tip(),
            visibility = !tip.hasClass('in');

          // Hide any active popover except self
          if(!attr.multiple) $("body > .popover").each(function() {
            var $this = $(this),
              popover = $this.data('popover');
            if(popover && !popover.$element.is(element)) $this.popover('hide');
          });

          // Rebind the popover
          if(!tip.data('popover')) tip.data('popover', popover);

          // Trigger events (should be in bootstrap core)
          var e = $.Event(visibility ? 'show' : 'hide');
          element.trigger(e);
          if (e.isDefaultPrevented()) return;

          // Toggle the popover
          element.popover(visibility ? 'show' : 'hide');

        }).on('show', function(ev) {
          console.warn('show!');
        });

      });
    }
  };
}]);
