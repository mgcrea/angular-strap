
angular.module('$bs.config', []).value('$bs.config', {});
angular.module('$bs.filters', ['$bs.config']);
angular.module('$bs.directives', ['$bs.config']);
angular.module('$bs', ['$bs.filters', '$bs.directives', '$bs.config']);
