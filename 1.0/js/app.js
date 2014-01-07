'use strict';

var app = angular.module('strap', ['$strap.directives']);

app.controller('StrapCtrl', function($scope, $window, $q, $location, $modal) {

  $scope.$alert = $window.alert.bind(null);

  // Modal directive
  // http://plnkr.co/edit/xKP5PW3Dco1CczmCuuVN?p=preview
  $scope.modal = {content: 'Hello Modal', saved: false};
  var modalPromise = $modal({
    template: 'partials/modal.html',
    persist: true,
    show: false,
    backdrop: 'static',
    scope: $scope
  });
  $scope.showModalViaService = function() {
    $q.when(modalPromise).then(function(modalEl) {
      modalEl.modal('show');
    });
  };

  // Dropdown directive
  // http://plnkr.co/edit/ywCmR5wcMpZElwE5Qk9S?p=preview
  $scope.dropdown = [
    {text: 'Another action', href: '#anotherAction'},
    {text: 'Something else here', click: '$alert(\'working ngClick!\')'},
    {divider: true},
    {text: 'Separated link', href: '#',
      submenu: [
        {text: 'Second level link', href: '#'},
        {text: 'Second level link 2', href: '#'}
      ]
    }
  ];

  // Navbar directive
  // http://plnkr.co/edit/G67eybC4zwlF1sqLH93t?p=preview
  $scope.$location = $location;

  // Tab directive
  // http://plnkr.co/edit/3C9vTbdhLRGo3X2Nu0yw?p=preview
  $scope.tabs = [
    {title:'Home', content: 'Raw denim you probably haven\'t heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica.'},
    {title:'Profile', content: 'Food truck fixie locavore, accusamus mcsweeney\'s marfa nulla single-origin coffee squid. Exercitation +1 labore velit, blog sartorial PBR leggings next level wes anderson artisan four loko farm-to-table craft beer twee.'},
    {title:'About', content: 'Etsy mixtape wayfarers, ethical wes anderson tofu before they sold out mcsweeney\'s organic lomo retro fanny pack lo-fi farm-to-table readymade.'}
  ];
  $scope.tabs.activeTab = 1;

  // Tooltip
  // http://plnkr.co/edit/DoLKYXF54BzjL44Zm8Cs?p=preview
  $scope.tooltip = {title: "Hello Tooltip<br />This is a multiline message!", checked: false};

  // Popover
  // http://plnkr.co/edit/lThOkfVJCVf6RDiqvQZG?p=preview
  $scope.popover = {content: "Hello Popover<br />This is a multiline message!", saved: false};

  // Select directive
  // http://plnkr.co/edit/T1D3wF88RYqk5x77MJDT?p=preview
  $scope.selects = [
    {id: '1', name: '<i class="icon-star"></i>&nbsp;foo'},
    {id: '2', name: '<i class="icon-heart"></i>&nbsp;bar'},
    {id: '3', name: '<i class="icon-fire"></i>&nbsp;baz'}
  ];
  $scope.selectedItem = '1';
  $scope.selectedItems = ['1'];
  $scope.pushSelect = function() { $scope.selects.push({id: '' + ($scope.selects.length + 1), name: '<i class="icon-globe"></i>&nbsp;qux' }); };

  // Datepicker directive
  // http://plnkr.co/edit/QAxwgLSWQaYbGzkzeu4g?p=preview
  $scope.datepicker = {date: new Date("2012-09-01T00:00:00.000Z")};

  $scope.alerts = [{type:'success', title: 'Holy guacamole!', content: 'Best check yo self, you\'re not looking too good.<br><br><pre>2 + 3 = {{ 2 + 3 }}</pre>'}];
  $scope.addAlert = function() { $scope.alerts.push({type: 'info', title: 'Heads up!', content: 'To prevent databinding issues, <em>"the rule of thumb is, if you﻿ use <code>ng-model</code> there has to be a dot somewhere." Miško Hevery</em>'}); };
  $scope.button = {active: true};
  $scope.buttonSelect = {price: '89,99', currency: '€'};
  $scope.checkbox = {left: false, middle: true, right: false};
  $scope.radio = {left: false, middle: true, right: false};
  $scope.radioValue = 'middle';
  $scope.typeahead = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Dakota","North Carolina","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"];
  $scope.timepicker = {time: ''};

});


// Docs styles
//
$(function() {

  $("html").removeClass("no-js").addClass("js");

  var $window = $(window);

  new FastClick(document.body);

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

  });

});