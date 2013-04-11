/**
 * Single module for including all directives.
 *
 * TODO: Consider moving the Angular module definition here.
 */

/*global define:false */

define([
    './directives/alert'
    , './src/directives/button'
    , './src/directives/buttonSelect'
    , './src/directives/datepicker'
    , './src/directives/dropdown'
    , './src/directives/modal'
    , './src/directives/navbar'
    , './src/directives/popover'
    , './src/directives/tab'
    , './src/directives/timepicker'
    , './src/directives/tooltip'
    , './src/directives/typeahead'
], function () {
    return {}
})