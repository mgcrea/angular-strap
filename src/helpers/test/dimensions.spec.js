'use strict';

describe('dimensions', function () {

  var $compile, scope, dimensions;

  var lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur non velit nulla. Suspendisse sit amet tempus diam. Sed at ultricies neque. Suspendisse id felis a sem placerat ornare. Donec auctor, purus at molestie tempor, arcu enim molestie lacus, ac imperdiet massa urna eu massa. Praesent velit tellus, scelerisque a fermentum ut, ornare in diam. Phasellus egestas molestie feugiat. Vivamus sit amet viverra metus.';

  beforeEach(module('mgcrea.ngStrap.helpers.dimensions'));

  beforeEach(inject(function (_$rootScope_, _$compile_, _dimensions_) {
    scope = _$rootScope_;
    $compile = _$compile_;
    dimensions = _dimensions_;
  }));

  afterEach(function() {
    // $('body').html('');
    // scope.$destroy();
  });

  // Templates

  var templates = {
    'default': {
      element: '<div style="margin:5px; padding: 10px;" class="btn">Foo</div>'
    },
    'static-container': {
      element: '<div class="container"><div style="margin:5px; padding: 10px;" class="btn">Foo</div></div>'
    },
    'relative-container': {
      element: '<div class="container" style="position: relative;"><div style="margin:5px; padding: 10px;" class="btn">Foo</div></div>'
    },
    'relative-positioned-container': {
      element: '<div class="container" style="position: relative; left: 200px; top: 20px;"><div style="margin:5px; padding: 10px;" class="btn">Foo</div></div>'
    },
    'absolute-positioned-container': {
      element: '<div class="container" style="position: absolute; left: 200px; top: 20px;"><div style="margin:5px; padding: 10px;" class="btn">Foo</div></div>'
    },
    'fixed-positioned-container': {
      element: '<div class="container" style="position: fixed; left: 200px; bottom: 20px;"><div style="margin:5px; padding: 10px;" class="btn">Foo</div></div>'
    },
    'absolute-positioned-overflowing-container': {
      element: '<div class="container" style="height: 50px; overflow: scroll;overflow-x: hidden; position: absolute;">' + lorem + '<div style="margin:5px; padding: 10px;" class="btn">Foo</div></div>'
    },
    'static-container-float-content': {
      element: '<div class="container"><div style="margin:5px; padding: 10px; float: right;" class="btn">Foo</div></div>'
    },
    'table-container': {
      element: '<table class="container"><tbody><tr><td>' + lorem + '</td><td><div class="btn">Foo</div></td></tr></tbody></table>'
    },
    'table-inside-relative-positioned-container': {
      element: '<div class="container" style="position: absolute; left: 200px; top: 20px;"><table class="container"><tbody><tr><td>' + lorem + '</td><td><div class="btn">Foo</div></td></tr></tbody></table></div>'
    },
    'multiple-paragraphs': {
      element: '<div class="container">' + (new Array(5 + 1)).join('<p>' + lorem + '</p>') + '<div style="margin:5px; padding: 10px;" class="btn">Foo</div>' + (new Array(5 + 1)).join('<p>' + lorem + '</p>') + '</td></tr></tbody></table></div>'
    }

  };

  function compileDirective(template) {
    template = templates[template];
    var element = $(template.element).appendTo('body');
    return jQuery(element[0]);
  }

  // Tests

  describe('fn.css', function () {

    it('should correctly match jQuery output for every template', function () {
      angular.forEach(templates, function(template, name) {
        var element = compileDirective(name);
        if(!element.is('.btn')) element = element.find('.btn:first');
        var top = dimensions.css(element[0], 'top');
        var jQueryTop = element.css('top');
        expect(top).toBe(jQueryTop);
        var left = dimensions.css(element[0], 'left');
        var jQueryLeft = element.css('left');
        expect(left).toBe(jQueryLeft);
      });
    });

  });

  describe('fn.offset', function () {

    it('should correctly match jQuery output for every template', function () {
      angular.forEach(templates, function(template, name) {
        var element = compileDirective(name);
        if(!element.is('.btn')) element = element.find('.btn:first');
        var offset = dimensions.offset(element[0]);
        var jQueryOffset = element.offset();
        expect(offset.top).toBe(jQueryOffset.top);
        expect(offset.left).toBe(jQueryOffset.left);
      });
    });

  });

  describe('fn.position', function () {

    it('should correctly match jQuery output for every template', function () {
      angular.forEach(templates, function(template, name) {
        var element = compileDirective(name);
        if(!element.is('.btn')) element = element.find('.btn:first');
        var position = dimensions.position(element[0]);
        var jQueryPosition = element.position();
        expect(position.top).toBe(jQueryPosition.top);
        expect(position.left).toBe(jQueryPosition.left);
      });
    });

  });

  describe('fn.height, fn.width', function () {

    it('should correctly match jQuery output for every template', function () {
      angular.forEach(templates, function(template, name) {
        var element = compileDirective(name);
        if(!element.is('.btn')) element = element;
        var height = dimensions.height(element[0]);
        var jQueryHeight = element.height();
        expect(height).toBe(jQueryHeight);
        var width = dimensions.width(element[0]);
        var jQueryWidth = element.width();
        expect(width).toBe(jQueryWidth);
      });
    });

  });

});
