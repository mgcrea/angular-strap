'use strict';

angular.module('mgcrea.ngStrapDocs')

.value('indent', function(text, spaces) {

  if(!text) return text;
  var lines = text.split(/\r?\n/);
  var prefix = '      '.substr(0, spaces || 0);
  var i;

  // Remove any leading blank lines
  while(lines.length && lines[0].match(/^\s*$/)) lines.shift();
  // Remove any trailing blank lines
  while(lines.length && lines[lines.length - 1].match(/^\s*$/)) lines.pop();
  // Calculate proper indent
  var minIndent = 999;
  for(i = 0; i < lines.length; i++) {
    var line = lines[0];
    var indent = line.match(/^\s*/)[0];
    if(indent !== line && indent.length < minIndent) {
      minIndent = indent.length;
    }
  }

  for(i = 0; i < lines.length; i++) {
    lines[i] = prefix + lines[i].substring(minIndent).replace(/=""/g, '');
  }
  lines.push('');
  return lines.join('\n');

});
