/**
 * angular-strap
 * @version v2.3.12 - 2017-11-20
 * @link http://mgcrea.github.io/angular-strap
 * @author Olivier Louvignes <olivier@mg-crea.com> (https://github.com/mgcrea)
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
(function(window, document, undefined) {
  'use strict';
  angular.module('mgcrea.ngStrapDocs').controller('TypeaheadDemoCtrl', [ '$scope', '$templateCache', '$http', function($scope, $templateCache, $http) {
    $scope.selectedState = '';
    $scope.states = [ 'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming' ];
    $scope.selectedIcon = '';
    $scope.icons = [ {
      value: 'Gear',
      label: '<i class="fa fa-gear"></i> Gear'
    }, {
      value: 'Globe',
      label: '<i class="fa fa-globe"></i> Globe'
    }, {
      value: 'Heart',
      label: '<i class="fa fa-heart"></i> Heart'
    }, {
      value: 'Camera',
      label: '<i class="fa fa-camera"></i> Camera'
    } ];
    $scope.selectedAddress = '';
    $scope.getAddress = function(viewValue) {
      var params = {
        address: viewValue,
        sensor: false
      };
      return $http.get('http://maps.googleapis.com/maps/api/geocode/json', {
        params: params
      }).then(function(res) {
        return res.data.results;
      });
    };
  } ]);
  angular.module('mgcrea.ngStrapDocs').config([ '$tooltipProvider', function($tooltipProvider) {
    angular.extend($tooltipProvider.defaults, {
      html: true
    });
  } ]).controller('TooltipDemoCtrl', [ '$scope', '$q', '$sce', '$tooltip', function($scope, $q, $sce, $tooltip) {
    $scope.tooltip = {
      title: 'Hello Tooltip<br />This is a multiline message!',
      checked: false
    };
  } ]);
  angular.module('mgcrea.ngStrapDocs').controller('TimepickerDemoCtrl', [ '$scope', '$http', function($scope, $http) {
    $scope.time = new Date(1970, 0, 1, 10, 30, 40);
    $scope.selectedTimeAsNumber = 10 * 36e5 + 30 * 6e4 + 40 * 1e3;
    $scope.selectedTimeAsString = '10:00';
    $scope.sharedDate = new Date(new Date().setMinutes(0, 0));
    $scope.emptySharedDate = null;
  } ]);
  angular.module('mgcrea.ngStrapDocs').controller('TabDemoCtrl', [ '$scope', '$templateCache', function($scope, $templateCache) {
    $scope.tabs = [ {
      title: 'Home',
      content: 'Raw denim you probably haven\'t heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica.'
    }, {
      title: 'Profile',
      content: 'Food truck fixie locavore, accusamus mcsweeney\'s marfa nulla single-origin coffee squid. Exercitation +1 labore velit, blog sartorial PBR leggings next level wes anderson artisan four loko farm-to-table craft beer twee.'
    }, {
      title: 'About',
      content: 'Etsy mixtape wayfarers, ethical wes anderson tofu before they sold out mcsweeney\'s organic lomo retro fanny pack lo-fi farm-to-table readymade.',
      disabled: true
    } ];
    $scope.pushTab = function() {
      $scope.tabs.push({
        title: 'Contact',
        content: 'Reprehenderit butcher retro keffiyeh dreamcatcher synth. Cosby sweater eu banh mi, qui irure terry richardson ex squid.'
      });
    };
    $scope.toggleThirdTab = function() {
      $scope.tabs[2].disabled = !$scope.tabs[2].disabled;
    };
  } ]);
  angular.module('mgcrea.ngStrapDocs').controller('SelectDemoCtrl', [ '$scope', '$http', function($scope, $http) {
    $scope.selectedIcon = '';
    $scope.selectedIcons = [ 'Globe', 'Heart' ];
    $scope.icons = [ {
      value: 'Gear',
      label: '<i class="fa fa-gear"></i> Gear'
    }, {
      value: 'Globe',
      label: '<i class="fa fa-globe"></i> Globe'
    }, {
      value: 'Heart',
      label: '<i class="fa fa-heart"></i> Heart'
    }, {
      value: 'Camera',
      label: '<i class="fa fa-camera"></i> Camera'
    } ];
    $scope.selectedMonth = 0;
    $scope.months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
  } ]);
  angular.module('mgcrea.ngStrapDocs').config([ '$popoverProvider', function($popoverProvider) {
    angular.extend($popoverProvider.defaults, {
      html: true
    });
  } ]).controller('PopoverDemoCtrl', [ '$scope', '$popover', function($scope, $popover) {
    $scope.popover = {
      title: 'Title',
      content: 'Hello Popover<br />This is a multiline message!'
    };
    var asAServiceOptions = {
      title: $scope.popover.title,
      content: $scope.popover.content,
      trigger: 'manual'
    };
    var myPopover = $popover(angular.element(document.querySelector('#popover-as-service')), asAServiceOptions);
    $scope.togglePopover = function() {
      myPopover.$promise.then(myPopover.toggle);
    };
  } ]);
  angular.module('mgcrea.ngStrapDocs').controller('NavbarDemoCtrl', [ '$scope', '$location', function($scope, $location) {
    $scope.$location = $location;
  } ]);
  angular.module('mgcrea.ngStrapDocs').config([ '$modalProvider', function($modalProvider) {
    angular.extend($modalProvider.defaults, {
      html: true
    });
  } ]).controller('ModalDemoCtrl', [ '$scope', '$modal', function($scope, $modal) {
    $scope.modal = {
      title: 'Title',
      content: 'Hello Modal<br />This is a multiline message!'
    };
    function MyModalController($scope) {
      $scope.title = 'Some Title';
      $scope.content = 'Hello Modal<br />This is a multiline message from a controller!';
    }
    MyModalController.$inject = [ '$scope' ];
    var myModal = $modal({
      controller: MyModalController,
      templateUrl: 'modal/docs/modal.demo.tpl.html',
      show: false
    });
    $scope.showModal = function() {
      myModal.$promise.then(myModal.show);
    };
    $scope.hideModal = function() {
      myModal.$promise.then(myModal.hide);
    };
  } ]);
  angular.module('mgcrea.ngStrapDocs').config([ '$dropdownProvider', function($dropdownProvider) {
    angular.extend($dropdownProvider.defaults, {
      html: true
    });
  } ]).controller('DropdownDemoCtrl', [ '$scope', '$alert', function($scope, $alert) {
    $scope.dropdown = [ {
      text: '<i class="fa fa-download"></i>&nbsp;Another action',
      href: '#anotherAction',
      active: true
    }, {
      text: '<i class="fa fa-globe"></i>&nbsp;Display an alert',
      click: '$alert("Holy guacamole!")'
    }, {
      text: '<i class="fa fa-external-link"></i>&nbsp;External link',
      href: '/auth/facebook',
      target: '_self'
    }, {
      divider: true
    }, {
      text: 'Separated link',
      href: '#separatedLink'
    } ];
    $scope.$alert = function(title) {
      $alert({
        title: title,
        content: 'Best check yo self, you\'re not looking too good.',
        placement: 'top',
        type: 'info',
        keyboard: true,
        show: true
      });
    };
  } ]);
  angular.module('mgcrea.ngStrapDocs').config([ '$datepickerProvider', function($datepickerProvider) {
    angular.extend($datepickerProvider.defaults, {
      dateFormat: 'dd/MM/yyyy',
      startWeek: 1
    });
  } ]).controller('DatepickerDemoCtrl', [ '$scope', '$http', function($scope, $http) {
    $scope.selectedDate = new Date();
    $scope.selectedDateAsNumber = Date.UTC(1986, 1, 22);
    $scope.getType = function(key) {
      return Object.prototype.toString.call($scope[key]);
    };
    $scope.clearDates = function() {
      $scope.selectedDate = null;
    };
  } ]);
  angular.module('mgcrea.ngStrapDocs').controller('CollapseDemoCtrl', [ '$scope', '$templateCache', function($scope, $templateCache) {
    $scope.panels = [ {
      title: 'Collapsible Group Item #1',
      body: 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch.'
    }, {
      title: 'Collapsible Group Item #2',
      body: 'Food truck fixie locavore, accusamus mcsweeney\'s marfa nulla single-origin coffee squid. Exercitation +1 labore velit, blog sartorial PBR leggings next level wes anderson artisan four loko farm-to-table craft beer twee.'
    }, {
      title: 'Collapsible Group Item #3',
      body: 'Etsy mixtape wayfarers, ethical wes anderson tofu before they sold out mcsweeney\'s organic lomo retro fanny pack lo-fi farm-to-table readymade.'
    } ];
    $scope.panels.activePanel = 1;
    $scope.multiplePanels = {
      activePanels: [ 0, 1 ]
    };
    $scope.pushPanel = function() {
      $scope.panels.push({
        title: 'Collapsible Group Item #4',
        body: 'Reprehenderit butcher retro keffiyeh dreamcatcher synth. Cosby sweater eu banh mi, qui irure terry richardson ex squid.'
      });
    };
  } ]);
  angular.module('mgcrea.ngStrapDocs').controller('ButtonDemoCtrl', [ '$scope', function($scope) {
    $scope.button = {
      toggle: false,
      checkbox: {
        left: false,
        middle: true,
        right: false
      },
      radio: 'left'
    };
  } ]);
  angular.module('mgcrea.ngStrapDocs').config([ '$asideProvider', function($asideProvider) {
    angular.extend($asideProvider.defaults, {
      container: 'body',
      html: true
    });
  } ]).controller('AsideDemoCtrl', [ '$scope', function($scope) {
    $scope.aside = {
      title: 'Title',
      content: 'Hello Aside<br />This is a multiline message!'
    };
  } ]);
  angular.module('mgcrea.ngStrapDocs').controller('AlertDemoCtrl', [ '$scope', '$templateCache', '$timeout', '$alert', function($scope, $templateCache, $timeout, $alert) {
    $scope.alert = {
      title: 'Holy guacamole!',
      content: 'Best check yo self, you\'re not looking too good.',
      type: 'info'
    };
    var myAlert = $alert({
      title: 'Holy guacamole!',
      content: 'Best check yo self, you\'re not looking too good.',
      placement: 'top',
      type: 'info',
      keyboard: true,
      show: false
    });
    $scope.showAlert = function() {
      myAlert.show();
    };
  } ]);
})(window, document);