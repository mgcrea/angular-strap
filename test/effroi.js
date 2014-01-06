!function(e){"object"==typeof exports?module.exports=e():"function"==typeof define&&define.amd?define(e):"undefined"!=typeof window?window.effroi=e():"undefined"!=typeof global?global.effroi=e():"undefined"!=typeof self&&(self.effroi=e())}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function Keyboard() {

  var utils = require('../utils.js');
  var mouse = require('./mouse.js');
  var uiFocus = require('../ui/focus.js');

  // Configuration
  this.locale = ''; // ex: en-US

  // Consts
  // Maps for key / char properties
  // http://www.w3.org/TR/DOM-Level-3-Events/#key-values-list
  this.KEY_TO_CHAR = {
    'Cancel': '\u0018',
    'Esc': '\u001B',
    'Spacebar': '\u0020',
    'Add': '\u002B',
    'Subtract': '\u2212',
    'Multiply': '\u002A', // alternative '\u00D7'
    'Divide': '\u00F7',
    'Equals': '\u003D',
    'Decimal': '\u2396', // alternatives '\u002E' or '\u00B7'
    'Tab': '\u0009',
    'Backspace': '\u0008',
    'Del': '\u007F',
    'DeadGrave': '\u0300',
    'DeadAcute': '\u0301',
    'DeadCircumflex': '\u0302',
    'DeadTilde': '\u0303',
    'DeadMacron': '\u0304',
    'DeadBreve': '\u0306',
    'DeadAboveDot': '\u0307',
    'DeadUmlaut': '\u0308',
    'DeadAboveRing': '\u030A',
    'DeadDoubleAcute': '\u030B',
    'DeadCaron': '\u030C',
    'DeadCedilla': '\u0327',
    'DeadOgonek': '\u0328',
    'DeadIota': '\u0345',
    'DeadVoicedSound': '\u3099',
    'DeadSemivoicedSound': '\u309A'
  };
  this.CHAR_TO_KEY = {
    '\u0018': 'Cancel',
    '\u001B': 'Esc',
    '\u0020': 'Spacebar',
    '\u002B': 'Add',
    '\u2212': 'Subtract',
    '\u002A': 'Multiply',
    '\u00D7': 'Multiply',
    '\u00F7': 'Divide',
    '\u003D': 'Equals',
    '\u2396': 'Decimal',
    '\u002E': 'Decimal',
    '\u00B7': 'Decimal',
    '\u0009': 'Tab',
    '\u0008': 'Backspace',
    '\u007F': 'Del',
    '\u0300': 'DeadGrave',
    '\u0301': 'DeadAcute',
    '\u0302': 'DeadCircumflex',
    '\u0303': 'DeadTilde',
    '\u0304': 'DeadMacron',
    '\u0306': 'DeadBreve',
    '\u0307': 'DeadAboveDot',
    '\u0308': 'DeadUmlaut',
    '\u030A': 'DeadAboveRing',
    '\u030B': 'DeadDoubleAcute',
    '\u030C': 'DeadCaron',
    '\u0327': 'DeadCedilla',
    '\u0328': 'DeadOgonek',
    '\u0345': 'DeadIota',
    '\u3099': 'DeadVoicedSound',
    '\u309A': 'DeadSemivoicedSound'
  };
  this.KEYS = [
    'Attn', 'Apps', 'Crsel', 'Exsel', 'F1', 'F2', 'F3', 'F4',
    'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'F13',
    'F14', 'F15', 'F16', 'F17', 'F18', 'F19', 'F20', 'F21',
    'F22', 'F23', 'F24', 'LaunchApplication1', 'LaunchApplication2',
    'LaunchMail', 'List', 'Props', 'Soft1', 'Soft2', 'Soft3', 'Soft4',
    'Accept', 'Again', 'Enter', 'Find', 'Help', 'Info', 'Menu', 'Pause',
    'Play', 'Scroll', 'Execute', 'Cancel', 'Esc', 'Exit', 'Zoom', 'Separator',
    'Spacebar', 'Add', 'NumLock', 'Subtract', 'NumLock', 'Multiply',
    'Divide', 'Equals', 'Decimal', 'BrightnessDown', 'BrightnessUp', 'Camera',
    'Eject', 'Power', 'PrintScreen', 'BrowserFavorites', 'BrowserHome',
    'BrowserRefresh', 'BrowserSearch', 'BrowserStop', 'BrowserBack',
    'BrowserForward', 'Left', 'PageDown', 'PageUp', 'Right', 'Up', 'UpLeft',
    'UpRight', 'Down', 'DownLeft', 'DownRight', 'Home', 'End', 'Select', 'Tab',
    'Backspace', 'Clear', 'Copy', 'Cut', 'Del', 'EraseEof', 'Insert', 'Paste',
    'Undo', 'DeadGrave', 'DeadAcute', 'DeadCircumflex', 'DeadTilde',
    'DeadMacron', 'DeadBreve', 'DeadAboveDot', 'DeadUmlaut', 'DeadAboveRing',
    'DeadDoubleAcute', 'DeadCaron', 'DeadCedilla', 'DeadOgonek', 'DeadIota',
    'DeadVoicedSound', 'DeadSemivoicedSound', 'Alphanumeric', 'Alt', 'AltGraph',
    'CapsLock', 'Control', 'Fn', 'FnLock', 'Meta', 'Process', 'NumLock', 'Shift',
    'SymbolLock', 'OS', 'Compose', 'AllCandidates', 'NextCandidate',
    'PreviousCandidate', 'CodeInput', 'Convert', 'Nonconvert', 'FinalMode',
    'FullWidth', 'HalfWidth', 'ModeChange', 'RomanCharacters', 'HangulMode',
    'HanjaMode', 'JunjaMode', 'Hiragana', 'KanaMode', 'KanjiMode', 'Katakana',
    'AudioFaderFront', 'AudioFaderRear', 'AudioBalanceLeft',
    'AudioBalanceRight', 'AudioBassBoostDown', 'AudioBassBoostUp', 'VolumeMute',
    'VolumeDown', 'VolumeUp', 'MediaPause', 'MediaPlay', 'MediaTrackEnd',
    'MediaNextTrack', 'MediaPlayPause', 'MediaPreviousTrack', 'MediaTrackSkip',
    'MediaTrackStart', 'MediaStop', 'SelectMedia', 'Blue', 'Brown',
    'ChannelDown', 'ChannelUp', 'ClearFavorite0', 'ClearFavorite1',
    'ClearFavorite2', 'ClearFavorite3', 'Dimmer', 'DisplaySwap', 'FastFwd',
    'Green', 'Grey', 'Guide', 'InstantReplay', 'MediaLast', 'Link', 'Live',
    'Lock', 'NextDay', 'NextFavoriteChannel', 'OnDemand', 'PinPDown',
    'PinPMove', 'PinPToggle', 'PinPUp', 'PlaySpeedDown', 'PlaySpeedReset',
    'PlaySpeedUp', 'PrevDay', 'RandomToggle', 'RecallFavorite0',
    'RecallFavorite1', 'RecallFavorite2', 'RecallFavorite3', 'MediaRecord',
    'RecordSpeedNext', 'Red', 'MediaRewind', 'RfBypass', 'ScanChannelsToggle',
    'ScreenModeNext', 'Settings', 'SplitScreenToggle', 'StoreFavorite0',
    'StoreFavorite1', 'StoreFavorite2', 'StoreFavorite3', 'Subtitle',
    'AudioSurroundModeNext', 'Teletext', 'VideoModeNext', 'DisplayWide', 'Wink',
    'Yellow', 'Unidentified'
  ];
  // Frequently used keys
  this.UP = 'Up';
  this.DOWN = 'Down';
  this.LEFT = 'Left';
  this.RIGHT =  'Right';
  this.ESC = 'Esc';
  this.SPACE = 'Spacebar';
  this.BACK_SPACE = 'Backspace';
  this.TAB = 'Tab';
  this.DELETE = 'Del';
  this.ENTER = 'Enter';
  this.CTRL = 'Control';
  this.CAPS_LOCK = 'CapsLock';
  this.FN = 'Fn';
  this.FN_LOCK = 'FnLock';
  this.META = 'Meta';
  this.NUM_LOCK = 'NumLock';
  this.SCROLL_LOCK = 'ScrollLock';
  this.SHIFT = 'Shift';
  this.SYM_LOCK = 'SymbolLock';
  this.ALT_GR = 'AltGraph';
  this.OS = 'OS';
  // Legacy map: http://www.w3.org/TR/DOM-Level-3-Events/#fixed-virtual-key-codes
  this.KEY_TO_CHARCODE = {
    'Up': 38,
    'Down': 40,
    'Left': 37,
    'Right': 39,
    'Esc': 27,
    'Spacebar': 32,
    'Backspace': 8,
    'Tab': 9,
    'Del': 46,
    'Enter': 13,
    'Control': 17,
    'Caps': 20,
    'NumLock': 144,
    'Shift': 16,
    'OS': 91,
    'Alt': 18,
    'CapsLock': 20,
    'PageUp': 33,
    'PageDown': 34,
    'End': 35,
    'Home': 36
  };
  // Modifiers (legacy) http://www.w3.org/TR/DOM-Level-3-Events/#keys-Modifiers
  this.MODIFIERS = [this.ALT, this.ALT_GR, this.CAPS_LOCK, this.CTRL, this.FN,
    this.META, this.NUM_LOCK, this.SCROLL_LOCK, this.SHIFT, this.SYM_LOCK,
    this.OS
  ];

  // Private vars
  var _downKeys = [], _keyDownDispatched = [], _that=this;

  // Private functions

  // Return the char corresponding to the key if any
  function _charIsPrintable(charCode) {
    // C0 control characters
    if((charCode >=0 && charCode <= 0x1F) || 0x7F === charCode) {
      return false;
    }
    // C1 control characters
    if(charCode >= 0x80 && charCode <= 0x9F) {
      return false;
    }
    if(-1 !== _downKeys.indexOf(this.CTRL)) {
      return false;
    }
    return true;
  }

  // Try to add the char corresponding to the key to the activeElement
  function _inputChar(char) {
    if(_charIsPrintable(char.charCodeAt(0))
      &&utils.isSelectable(document.activeElement)) {
      // add the char
      // FIXME: put at caretPosition/replace selected content
      document.activeElement.value += char;
      // fire an input event
      utils.dispatch(document.activeElement, {type: 'input'});
    }
  }

  // Compute current modifiers
  function _getModifiers() {
    var modifiers = '';
    if(_downKeys.length) {
      for(var i=_downKeys.length-1; i>=0; i--) {
        if(-1 !== _that.MODIFIERS.indexOf(_downKeys[i])) {
          modifiers += (modifiers ? ' ' : '') + _downKeys[i];
        }
      }
    }
    return modifiers;
  }

  /**
  * Focus an element by using tab
  *
  * @param  DOMElement  element   A DOMElement to tab to
  * @return Boolean
  */
  this.focus = function focus(element) {
    var activeElement = document.activeElement;
    // If the element is already focused return false
    if(activeElement === element) {
      return false;
    }
    // Performing a first tab
    this.tab();
    activeElement = document.activeElement;
    while(element != document.activeElement && this.tab()
      && activeElement != document.activeElement) {
      continue;
    }
    if(activeElement !== element) {
      return false;
    }
    return true;
  };

  /**
  * Tab to the next element
  *
  * @return Boolean
  */
  this.tab = function tab() {
    var elements = utils.getFocusableElements(), dispatched;
    // if nothing/nothing else to focus, fail
    if(1 >= elements.length) {
      return false;
    }
    // Looking for the activeElement index
    for(var i=elements.length-1; i>=0; i--) {
      if(elements[i] === document.activeElement) {
        break;
      }
    }
    // Push the tab key down
    this.down(this.TAB);
    // Focus the next element
    dispatched = uiFocus.focus(-1 === i || i+1 >= elements.length ?
      elements[0] : elements[i+1]);
    // Release the tab key
    this.up(this.TAB);
    return dispatched;
  };

  /**
  * Cut selected content like if it were done by a user with Ctrl + X.
  *
  * @param  DOMElement  element   A DOMElement to dblclick
  * @param  String      content   The content to paste
  * @return Boolean
  */
  this.cut = function cut() {
    var content, element = document.activeElement;
    // if the keydown event is prevented we can't cut content
    if(!this.down(this.CTRL, 'x')) {
      this.up(this.CTRL, 'x');
      return '';
    }
    // if content is selectable, we cut only the selected content
    if(utils.isSelectable(element)) {
      content = element.value.substr(element.selectionStart, element.selectionEnd-1);
      element.value =
        (element.selectionStart ?
          element.value.substr(0, element.selectionStart) : '')
        + (element.selectionEnd ?
          element.value.substr(element.selectionEnd) :
          '');
    // otherwise we cut the full content
    } else {
      content = element.value;
      element.value = null;
    }
    // finally firing keyup events
    this.up(this.CTRL, 'x');
    return content;
  };

  /**
  * Paste content like if it were done by a user with Ctrl + V.
  *
  * @param  DOMElement  element   A DOMElement to dblclick
  * @param  String      content   The content to paste
  * @return Boolean
  */
  this.paste = function paste(content) {
    var element = document.activeElement;
    // The content of a paste is always a string
    if('string' !== typeof content) {
      throw Error('Can only paste strings (received '+(typeof content)+').');
    }
    if(!utils.canAcceptContent(element, content)) {
      throw Error('Unable to paste content in the given element.');
    }
    // if the keydown event is prevented we can't paste content
    if(!this.down(this.CTRL, 'v')) {
      this.up(this.CTRL, 'v');
      return false;
    }
    // if content is selectable, we paste content in the place of the selected content
    if(utils.isSelectable(element)) {
      element.value =
        (element.selectionStart ?
          element.value.substr(0, element.selectionStart) : '')
        + content
        + (element.selectionEnd ?
          element.value.substr(element.selectionEnd) :
          '');
    // otherwise we just replace the value
    } else {
      element.value = content;
    }
    // finally firing the keyup events
    return this.up(this.CTRL, 'v');
  };

  /**
  * Perform a key combination.
  *
  * @param  ArgumentList   arguments   Keycodes of the keys
  * @return Boolean
  */
  this.combine = function () {
    var dispatched;
    if(0 === arguments.length) {
      throw Error('The combine method wait at least one key.');
    }
    // Pushing the keys sequentially
    dispatched = this.down.apply(this, arguments);
    // Releasing the keys sequentially
    return this.up.apply(this, arguments) && dispatched;
  };

  /**
  * Hit somes keys sequentially.
  *
  * @param  ArgumentList   arguments   Keycodes of the keys
  * @return Boolean
  */
  this.hit = function () {
    var dispatched = true;
    if(0 === arguments.length) {
      throw Error('The hit method wait at least one key.');
    }
    // Hitting the keys sequentially
    for(var i=0, j=arguments.length; i<j; i++) {
      // Push the key
      dispatched = this.down(arguments[i]) && dispatched;
      // Release the key
      dispatched = this.up(arguments[i]) && dispatched;
    }
    return dispatched;
  };

  /**
  * Release somes keys of the keyboard.
  *
  * @param  ArgumentList   arguments   Keycodes of the keys
  * @return Boolean
  */

  this.up = function () {
    var dispatched = true, keyIndex;
    if(0 === arguments.length) {
      throw Error('The up method wait at least one key.');
    }
    // Releasing the keys sequentially
    for(var i=0, j=arguments.length; i<j; i++) {
      // get the platform specific key
      // check the key is down
      keyIndex = _downKeys.indexOf(arguments[i]);
      if(-1 === keyIndex) {
        throw Error('Can\'t release a key that is not down ('+arguments[i]+')');
      }
      // unregister the key
      _downKeys.splice(keyIndex, 1);
      // dispatch the keyup event
      dispatched = this.dispatch(document.activeElement, {
          type: 'keyup',
          key: arguments[i]
        }) && dispatched;
    }
    return dispatched;
  };

  /**
  * Push somes keys of the keyboard.
  *
  * @param  ArgumentList   arguments   Keycodes of the keys
  * @return Boolean
  */
  this.down = function () {
    var dispatched = true;
    if(0 === arguments.length) {
      throw Error('The down method wait at least one key.');
    }
    // Pushing the keys sequentially
    for(var i=0, j=arguments.length; i<j; i++) {
      dispatched = true;
      // get the platform specific key
      // check the key is down
      if(-1 !== _downKeys.indexOf(arguments[i])) {
        throw Error('Can\'t push a key already down ('+arguments[i]+')');
      }
      // register the newly down key
      _downKeys.push(arguments[i]);
      // dispatch the keydown event
      dispatched = this.dispatch(document.activeElement, {
          type: 'keydown',
          key: arguments[i]
        }) && dispatched;
      // dispatch the keypress event if the keydown has been dispatched
      // and the CTRL key is not pressed
      if(dispatched&&-1 === _downKeys.indexOf(this.CTRL)) {
        dispatched = this.dispatch(document.activeElement, {
          type: 'keypress',
          key: arguments[i]
        });
        // if keypress has been dispatched, try to input the char
        if(dispatched && 1 === arguments[i].length) {
          _inputChar(arguments[i]);
        }
      }
    }
    return dispatched;
  };

  /**
  * Dispatches a keyboard event to the given DOM element.
  *
  * @param  DOMElement  element   A DOMElement on wich to dispatch the event
  * @param  Object      options   Event options
  * @return Boolean
  */
  this.dispatch = function (element, options) {
    var event, char, charCode, keyCode,
      modifiers = _getModifiers(), location = 0;
    options=options || {};
    options.canBubble = ('false' === options.canBubble ? false : true);
    options.cancelable = ('false' === options.cancelable ? false : true);
    options.view = options.view || window;
    options.key = options.key || 'Unidentified';
    options.repeat = !!options.repeat;
    if('string' !== typeof options.key) {
      throw Error('The key option must be a string.');
    }
    if(-1 !== this.KEYS.indexOf(options.key)) {
      char = this.KEY_TO_CHAR[options.key] || '';
    } else if(1 === options.key.length) {
      char = options.key;
    } else {
      throw Error('Unknown key value "'+key+'".');
    }
    charCode = char ? char.charCodeAt(0) : 0;
    keyCode = this.KEY_TO_CHARCODE[options.key] || charCode;
    // try to use the constructor (recommended with DOM level 3)
    // http://www.w3.org/TR/DOM-Level-3-Events/#new-event-interface-initializers
    try {
      event = new KeyboardEvent(options.type, {
        bubbles: options.canBubble,
        cancelable: options.cancelable,
        view: options.view,
        char: char,
        location: options.location,
        modifiers: modifiers,
        ctrlKey: -1 !== _downKeys.indexOf(this.CTRL),
        shiftKey: -1 !== _downKeys.indexOf(this.SHIFT),
        altKey: -1 !== _downKeys.indexOf(this.ALT),
        metaKey: -1 !== _downKeys.indexOf(this.META),
        repeat: options.repeat,
        locale: this.locale,
        // legacy
        charCode: charCode,
        which: keyCode,
        keyCode: keyCode
      });
      // Chrome seems to not set those properties properly
      utils.setEventProperty(event, 'char', char);
      utils.setEventProperty(event, 'charCode', charCode);
      utils.setEventProperty(event, 'keyCode', keyCode);
      return element.dispatchEvent(event);
    } catch(e) {
      if(document.createEvent) {
        event = document.createEvent('KeyboardEvent');
        if(typeof event.initKeyboardEvent !== 'undefined') {
          event.initKeyboardEvent(options.type,
            options.canBubble, options.cancelable,
            options.view || window, char, options.charCode,
            options.location, modifiers,
            options.repeat, this.locale);
        } else {
          event.initKeyEvent(options.type,
          'false' === options.canBubble ? false : true,
          'false' === options.cancelable ? false : true,
          options.view||window,
          -1 !== _downKeys.indexOf(this.CTRL), -1 !== _downKeys.indexOf(this.ALT),
          -1 !== _downKeys.indexOf(this.SHIFT), -1 !== _downKeys.indexOf(this.META),
          keyCode, charCode);
        }
        utils.setEventProperty(event, 'ctrlKey',
          -1 !== _downKeys.indexOf(this.CTRL));
        utils.setEventProperty(event, 'altKey',
          -1 !== _downKeys.indexOf(this.ALT));
        utils.setEventProperty(event, 'shiftKey',
          -1 !== _downKeys.indexOf(this.SHIFT));
        utils.setEventProperty(event, 'metaKey',
          -1 !== _downKeys.indexOf(this.META));
        utils.setEventProperty(event, 'keyCode', keyCode);
        utils.setEventProperty(event, 'which', keyCode);
        utils.setEventProperty(event, 'charCode', charCode);
        utils.setEventProperty(event, 'char', char);
        return element.dispatchEvent(event);
      } else if(document.createEventObject) {
        event = document.createEventObject();
        event.eventType = options.type;
        event.altKey = -1 !== _downKeys.indexOf(this.ALT);
        event.ctrlKey = -1 !== _downKeys.indexOf(this.CTRL);
        event.shiftKey = -1 !== _downKeys.indexOf(this.SHIFT);
        event.metaKey = -1 !== _downKeys.indexOf(this.META);
        event.keyCode = keyCode;
        event.charCode = charCode;
        event.char=char;
        return element.fireEvent('on'+options.type, event);
      }
    }
  };

}

module.exports = new Keyboard();


},{"../ui/focus.js":8,"../utils.js":9,"./mouse.js":2}],2:[function(require,module,exports){
function Mouse() {

  var utils = require('../utils.js');
  var uiFocus = require('../ui/focus.js');

  // Consts
  this.LEFT_BUTTON = 1;
  this.RIGHT_BUTTON = 2;
  this.MIDDLE_BUTTON = 4;
  this.BACK_BUTTON = 8;
  this.FORWARD_BUTTON = 16;
  this.BUTTONS_MASK = this.LEFT_BUTTON | this.RIGHT_BUTTON
    | this.MIDDLE_BUTTON | this.BACK_BUTTON | this.FORWARD_BUTTON;

  // Private vars
  var _x = 1, _y = 1;

  /**
  * Select content like if it were done by a user with his mouse.
  *
  * @param  DOMElement  element   A DOMElement to dblclick
  * @param  Number      start     The selection start
  * @param  Number      end     The selection end
  * @return Boolean
  */
  this.select = function cut(element, start, end) {
    if(!utils.isSelectable(element)) {
      throw Error('Cannot select the element content.');
    }
    if(!start) {
      start = 0;
    } else if(start < 0 || start > element.value.length) {
      throw RangeError('Invalid selection start.');
    }
    if(!end) {
      end = element.value.length;
    } else if(end > element.value.length || end < start) {
      throw RangeError('Invalid selection end.');
    }
    // We move to the element if not over yet
    this.moveTo(element);
    // To select, we keep the mousedown over the input
    options = {};
    options.type = 'mousedown';
    // if the mousedown event is prevented we can't select content
    if(!this.dispatch(element, options)) {
      return false;
    }
    // We move over the selection to perform
    // FIXME: This should be done better with real coords
    options.type = 'mousemove';
    this.dispatch(element, options);
    // if the mouseup event is prevented the whole content is selected
    options.type = 'mouseup';
    if(!this.dispatch(element, options)) {
      end = element.value.length;
    }
    // finally selecting the content
    element.selectionStart = start;
    element.selectionEnd = end;
    return true;
  };

  /**
  * Cut selected content like if it were done by a user with his mouse.
  *
  * @param  DOMElement  element   A DOMElement to dblclick
  * @param  String      content   The content to paste
  * @return Boolean
  */
  this.cut = function cut(element) {
    var content;
    // We move to the element if not over yet
    this.moveTo(element);
    // To cut, we right-click but only the mousedown is fired due to the
    // contextual menu that appears
    options = {};
    options.type = 'mousedown';
    // if the mousedown event is prevented we can't cut content
    if(!this.dispatch(element, options)) {
      return '';
    }
    // if content is selectable, we cut only the selected content
    if(utils.isSelectable(element)) {
      content = element.value.substr(element.selectionStart, element.selectionEnd-1);
      element.value =
        (element.selectionStart ?
          element.value.substr(0, element.selectionStart) : '')
        + (element.selectionEnd ?
          element.value.substr(element.selectionEnd) :
          '');
    // otherwise we cut the full content
    } else {
      content = element.value;
      element.value = null;
    }
    // finally firing an input event
    utils.dispatch(element, {type: 'input'});
    return content;
  };

  /**
  * Paste content like if it were done by a user with his mouse.
  *
  * @param  DOMElement  element   A DOMElement to dblclick
  * @param  String      content   The content to paste
  * @return Boolean
  */
  this.paste = function paste(element, content) {
    // The content of a paste is always a string
    if('string' !== typeof content) {
      throw Error('Can only paste strings (received '+(typeof content)+').');
    }
    if(!utils.canAcceptContent(element, content)) {
      throw Error('Unable to paste content in the given element.');
    }
    // We move to the element if not over yet
    this.moveTo(element);
    options = {};
    options.type = 'mousedown';
    // if the mousedown event is prevented we can't paste content
    if(!this.dispatch(element, options)) {
      return false;
    }
    // if content is selectable, we paste content in the place of the selected content
    if(utils.isSelectable(element)) {
      element.value =
        (element.selectionStart ?
          element.value.substr(0, element.selectionStart) : '')
        + content
        + (element.selectionEnd ?
          element.value.substr(element.selectionEnd) :
          '');
    // otherwise we just replace the value
    } else {
      element.value = content;
    }
    // finally firing an input event
    return utils.dispatch(element, {type: 'input'});
  };

  /**
  * Perform a real mouse double click on the given DOM element.
  *
  * @param  DOMElement  element   A DOMElement to dblclick
  * @param  Object      options   Clic options
  * @return Boolean
  */
  this.dblclick = function dblclick(element, options) {
    var dispatched;
    // We move to the element if not over yet
    this.moveTo(element);
    options = options||{};
    dispatched = this.click(element, options);
    if(!(this.click(element, options)&&dispatched)) {
      return false;
    }
    options.type = 'dblclick';
    return this.dispatch(element, options);
  };

  /**
  * Perform a real mouse rightclick on the given DOM element.
  *
  * @param  DOMElement  element   A DOMElement to rightclick
  * @param  Object      options   Clic options
  * @return Boolean
  */
  this.rightclick = function rightclick(element, options) {
    options = options || {};
    options.buttons = this.RIGHT_BUTTON;
    return this.click(element, options);
  };

  /**
  * Perform a real mouse click on the given DOM element.
  *
  * @param  DOMElement  element   A DOMElement to click
  * @param  Object      options   Clic options
  * @return Boolean
  */
  this.click = function click(element, options) {
    var dispatched;
    // We move to the element if not over yet
    this.moveTo(element);
    options = options || {};
    options.type = 'mousedown';
    dispatched = this.dispatch(element, options);
    options.type = 'mouseup';
    if(!(this.dispatch(element, options)&&dispatched)) {
      return false;
    }
    options.type = 'click';
    return this.dispatch(element, options);
  };

  /**
  * Focus a DOM element with the mouse.
  *
  * @param  DOMElement  element   A DOMElement to focus
  * @param  Object      options   Event options
  * @return Boolean
  */
  this.focus = function focus(element, options) {
    var dispatched;
    // We move to the element if not over yet
    this.moveTo(element);
    options = options || {};
    options.type = 'mousedown';
    dispatched=this.dispatch(element, options);
    // Here, maybe find the first parent element having greater bound rect
    // and move on it's focusable zone or fail if none available
    if(dispatched) {
      uiFocus.focus(element);
    }
    this.moveTo(element.parentNode);
    options.type = 'mouseup';
    this.dispatch(element.parentNode, options);
    return dispatched;
  };

  /**
  * Perform a real mouse move to the given coordinates.
  *
  * @param  int      x         The x position to go
  * @param  int      y         The y position to go
  * @param  Object   options   Clic options
  * @return Boolean
  */
  this.move = function move(x, y, options) {
    var curElement = document.elementFromPoint(_x, _y),
      targetElement,
      oldScrollX = window.scrollX,
      oldScrollY = window.scrollY,
      dispatched;
    // Could move the cursor of %n px and repeat mouseover/out events
    // killer feature or overkill ?
    options = options || {};
    options.type = 'mouseout';
    dispatched = this.dispatch(curElement, options);
    this.scroll(x, y, options);
    _x = x + oldScrollX - window.scrollX;
    _y = y + oldScrollY - window.scrollY;
    if(_x < 0 || _y < 0) {
      throw new Error('The mouse pointer coordinates can\'t be negative.');
    }
    if(_x >= window.innerWidth || _y >= window.innerHeight) {
      throw new Error('The mouse pointer coordinates can\'t be greater than the'
        +' viewport size.');
    }
    targetElement = document.elementFromPoint(_x, _y);
    if(!targetElement) {
      throw Error('Couldn\'t perform the move. Coordinnates seems invalid.');
    }
    if(curElement===targetElement) {
      return false;
    }
    options.type = 'mouseover';
    options.relatedTarget = curElement;
    dispatched = this.dispatch(targetElement, options);
    return true;
  };

  /**
  * Perform a real mouse move to an element.
  *
  * @param  DOMElement  element   A DOMElement on wich to move the cursor
  * @param  Object      options   Clic options
  * @return Boolean
  */
  this.moveTo = function moveTo(element, options) {
    var c = utils.getElementCenter(element);
    // We are giving the related target to avoid calculating it later
    options = options || {};
    options.relatedTarget = element;
    return this.move(c.x, c.y, options);
  };

  /**
  * Perform a scroll with the mouse wheel.
  *
  * @param  int         x         The x delta to scroll to
  * @param  int         y         The y delta to scroll to
  * @param  Object      options   Clic options
  * @return Boolean
  */
  this.scroll = function scroll(x, y, options) {
    var dispatched=true, scrollX = 0, scrollY = 0;
    options = options || {};
    options.type = ('onwheel' in document ? 'wheel' :
      ('onmousewheel' in document ? 'mousewheel' : '')
    );
    if(options.type) {
      // Moving through the x axis
      options.shiftKey = true;
      options.wheelDelta = 120;
      options.wheelDeltaX = (x < 0 ? 120 : -120);
      options.wheelDeltaY = 0;
      while(dispatched && (x+scrollX<0  || x+scrollX > window.innerWidth)) {
        dispatched=this.dispatch(document.elementFromPoint(_x, _y), options);
        if(dispatched) {
          scrollX +=  options.wheelDeltaX;
          window.scrollTo(window.scrollX - options.wheelDeltaX, window.scrollY);
        }
      }
      // Then moving through the y axis
      options.wheelDelta = 120;
      options.wheelDeltaX = 0;
      options.wheelDeltaY = (y < 0 ? 120 : -120);
      while(dispatched && (y+scrollY<0  || y+scrollY > window.innerHeight)) {
        dispatched=this.dispatch(document.elementFromPoint(_x, _y), options);
        if(dispatched) {
          scrollY +=  options.wheelDeltaY;
          window.scrollTo(window.scrollX, window.scrollY - options.wheelDeltaY);
        }
      }
    }
    return dispatched;
  };

  /**
  * Perform a scroll with the mouse wheel.
  *
  * @param  DOMElement  element   A DOMElement on wich to scroll to
  * @param  Object      options   Clic options
  * @return Boolean
  */
  this.scrollTo = function scrollTo(element, options) {
    // Getting element center
    var c = utils.getElementCenter(element);
    // Scroll only if the element is not already in the viewport
    if(c.x<0 || c.y<0 || c.x > window.innerWidth || c.y > window.innerHeight) {
      return this.scroll(c.x, c.y, options);
    }
    return false;
  };

  /**
  * Dispatches a mouse event to the given DOM element.
  *
  * @param  DOMElement  element   A DOMElement on wich to dispatch the event
  * @param  Object      options   Event options
  * @return Boolean
  */
  this.dispatch = function dispatch(element, options) {
    var event, button, coords;
    options = options || {};
    options.type = options.type || 'click';
    if(options.buttons !== options.buttons&this.BUTTONS_MASK) {
      throw Error('Bad value for the "buttons" property.');
    }
    options.buttons = options.buttons || this.LEFT_BUTTON;
    if(options.button) {
      throw Error('Please use the "buttons" property.');
    }
    button=( options.buttons&this.RIGHT_BUTTON ? 2 :
      ( options.buttons&this.MIDDLE_BUTTON? 1 : 0 )
    );
    coords = utils.getPossiblePointerCoords(element);
    if(null===coords) {
      throw Error('Unable to find a point in the viewport at wich the given'
        +' element can receive a mouse event.');
    }
    options.canBubble = ('false' === options.canBubble ? false : true);
    options.cancelable = ('false' === options.cancelable ? false : true);
    options.view = options.view || window;
    options.detail = options.detail || 1;
    options.altKey = !!options.altKey;
    options.ctrlKey = !!options.ctrlKey;
    options.shiftKey = !!options.shiftKey;
    options.metaKey = !!options.metaKey;
    options.relatedTarget = options.relatedTarget||null;
    // try to use the constructor (recommended with DOM level 3)
    // http://www.w3.org/TR/DOM-Level-3-Events/#new-event-interface-initializers
    try {
      event = new MouseEvent(options.type, {
        bubbles: options.canBubble,
        cancelable: options.cancelable,
        view: options.view,
        // FIXME: find a way to get the right screen coordinates
        screenX: coords.x + window.screenLeft,
        screenY: coords.y  + window.screenTop,
        clientX: coords.x,
        clientY: coords.y,
        altKey: options.altKey,
        ctrlKey: options.ctrlKey,
        shiftKey: options.shiftKey,
        metaKey: options.metaKey,
        button: button,
        buttons: options.buttons,
        relatedTarget: options.relatedTarget
      });
      // Chrome seems to not set the buttons property properly
      utils.setEventProperty(event, 'buttons', options.buttons);
      return element.dispatchEvent(event);
    } catch(e) {
      // old fashined event intializer
      if(document.createEvent) {
        event = document.createEvent('MouseEvent');
        event.initMouseEvent(options.type,
          options.canBubble, options.cancelable,
          options.view, options.detail,
          // Screen coordinates (relative to the whole user screen)
          // FIXME: find a way to get the right screen coordinates
          coords.x + window.screenLeft, coords.y  + window.screenTop,
          // Client coordinates (relative to the viewport)
          coords.x, coords.y,
          options.ctrlKey, options.altKey,
          options.shiftKey, options.metaKey,
          button, options.relatedTarget);
        utils.setEventCoords(event, coords.x, coords.y);
        utils.setEventProperty(event, 'buttons', options.buttons);
        return element.dispatchEvent(event);
      // old IE event initializer
      } else if(document.createEventObject) {
        event = document.createEventObject();
        event.eventType = options.type;
        event.button = button;
        event.buttons = option.buttons;
        return element.fireEvent('on'+options.type, event);
      }
    }
  };

}

module.exports = new Mouse();

},{"../ui/focus.js":8,"../utils.js":9}],3:[function(require,module,exports){
function Pointers () {

  // Neeed mouse to perform click
  var mouse = require('./mouse.js');
  var utils = require('../utils.js');

  // Consts
  // Buttons : http://msdn.microsoft.com/en-us/library/ie/ff974878(v=vs.85).aspx
  this.LEFT_BUTTON = 1;
  this.RIGHT_BUTTON = 2;
  this.MIDDLE_BUTTON = 4;
  this.BACK_BUTTON = 8;
  this.FORWARD_BUTTON = 16;
  this.PEN_ERASER_BUTTON = 32;
  this.BUTTONS_MASK = this.LEFT_BUTTON | this.RIGHT_BUTTON
    | this.MIDDLE_BUTTON | this.BACK_BUTTON | this.FORWARD_BUTTON
    | this.PEN_ERASER_BUTTON;
  // Pointer types :
  this.MOUSE = 'mouse';
  this.PEN = 'pen';
  this.TOUCH = 'touch';
  this.UNKNOWN = '';

  // Private vars
  var _prefixed = !!window.navigator.msPointerEnabled;

  /**
  * Indicates if pointer events are available
  *
  * @return Boolean
  */
  this.isConnected = function () {
    return _prefixed || window.navigator.pointerEnabled;
  };

  /**
  * Perform a pen pointing on the given DOM element.
  *
  * @param  DOMElement  element   A DOMElement to point with the pen
  * @param  Object      options   Event options
  * @return Boolean
  */
  this.pen = function (element, options) {
    options = options||{};
    options.pointerType = this.PEN;
    options.buttons = this.LEFT_BUTTON;
    return this.point(element, options);
  };

  /**
  * Perform a touch on the given DOM element.
  *
  * @param  DOMElement  element   A DOMElement to touch
  * @param  Object      options   Event options
  * @return Boolean
  */
  this.touch = function (element, options) {
    options = options||{};
    options.pointerType = this.TOUCH;
    options.buttons = this.LEFT_BUTTON;
    return this.point(element, options);
  };

  /**
  * Perform a click on the given DOM element.
  *
  * @param  DOMElement  element   A DOMElement to point
  * @param  Object      options   Event options
  * @return Boolean
  */
  this.click = function (element, options) {
    options = options||{};
    options.pointerType = this.MOUSE;
    options.buttons = this.LEFT_BUTTON;
    return this.point(element, options);
  };

  /**
  * Perform a real full pointer "click" on the given DOM element.
  *
  * @param  DOMElement  element   A DOMElement to point
  * @param  Object      options   Point options
  * @return Boolean
  */
  this.point = function (element, options) {
    options = options||{};
    options.type = 'pointerdown';
    dispatched = this.dispatch(element, options);
    options.type = 'pointerup';
    dispatched = this.dispatch(element, options)&&dispatched;
    // IE10 trigger the click event even if the pointer event is cancelled
    // also, the click is a MouseEvent
    if(_prefixed) {
      options.type = 'click';
      return mouse.dispatch(element, options);
    // IE11+ fixed the issue and unprefixed pointer events.
    // The click is a PointerEvent
    } else if(dispatched) {
      options.type = 'click';
      return this.dispatch(element, options);
    }
    return false;
  };

  /**
  * Dispatches a pointer event to the given DOM element.
  *
  * @param  DOMElement  element   A DOMElement on wich to dispatch the event
  * @param  Object      options   Event options
  * @return Boolean
  */
  this.dispatch = function(element,options) {
    var button, pointerType, event, coords;
    options = options || {};
    if(options.buttons !== options.buttons&this.BUTTONS_MASK) {
      throw Error('Bad value for the "buttons" property.');
    }
    options.buttons = options.buttons || this.LEFT_BUTTON;
    if(options.button) {
      throw Error('Please use the "buttons" property.');
    }
    if(options.buttons&this.LEFT_BUTTON) {
      button = 0;
    } else if(options.buttons&this.MIDDLE_BUTTON) {
      button = 1;
    } else if(options.buttons&this.RIGHT_BUTTON) {
      button = 2;
    } else if(options.buttons&this.BACK_BUTTON) {
      button = 3;
    } else if(options.buttons&this.FORWARD_BUTTON) {
      button = 4;
    } else if(options.buttons&this.PEN_ERASER_BUTTON) {
      button = 5;
    } else {
      button = -1;
    }
    options.pointerType = options.pointerType || this.UNKNOWN;
    // IE10 fix for pointer types
    // http://msdn.microsoft.com/en-us/library/ie/hh772359(v=vs.85).aspx
    if(_prefixed) {
      if(options.pointerType == this.MOUSE) {
        pointerType = 4;
      } else if(options.pointerType == this.TOUCH) {
        pointerType = 2;
      } else if(options.pointerType == this.PEN) {
        pointerType = 3;
      } else {
        pointerType = 0;
      }
    } else {
      pointerType = options.pointerType;
    }
    event = document.createEvent((_prefixed ? 'MS' : '') + 'PointerEvent');
    coords = utils.getPossiblePointerCoords(element);
    if(null===coords) {
      throw Error('Unable to find a point in the viewport at wich the given'
        +' element can receive a pointer event.');
    }
    utils.setEventCoords(event, element);
    event.initPointerEvent(
      _prefixed ? 'MSPointer' + options.type[7].toUpperCase()
        + options.type.substring(8) : options.type,
      'false' === options.canBubble ? false : true,
      'false' === options.cancelable ? false : true,
      options.view||window, options.detail||1,
      // Screen coordinates (relative to the whole user screen)
      // FIXME: find a way to get the right screen coordinates
      coords.x + window.screenLeft, coords.y  + window.screenTop,
      // Client coordinates (relative to the viewport)
      coords.x, coords.y,
      !!options.ctrlKey, !!options.altKey,
      !!options.shiftKey, !!options.metaKey,
      button, options.relatedTarget||element,
      options.offsetX||0, options.offsetY||0,
      options.width||1, options.height||1,
      options.pressure||255, options.rotation||0,
      options.tiltX||0, options.tiltY||0,
      options.pointerId||1, pointerType,
      options.hwTimestamp||Date.now(), options.isPrimary||true);
    utils.setEventProperty(event, 'buttons', options.buttons);
    utils.setEventProperty(event, 'pointerType', pointerType);
    return element.dispatchEvent(event);
  };

}

module.exports = new Pointers();

},{"../utils.js":9,"./mouse.js":2}],4:[function(require,module,exports){
function Tactile() {

  // Neeed mouse to perform click
  var mouse = require('./mouse.js');
  var utils = require('../utils.js');

  /**
  * Indicates if tactile zone is available
  *
  * @return Boolean
  */
  this.isConnected = function () {
    return !!('ontouchstart' in window);
  };

  /**
  * Touch the screen and release immediatly on the given DOM element.
  *
  * @param  DOMElement  element   A DOMElement to touch
  * @param  Object      options   Touch options
  * @return Boolean
  */
  this.touch = function (element,options) {
    var dispatched;
    this.scrollTo(element);
    options = options || {};
    options.type = 'touchstart';
    dispatched = this.dispatch(element, options);
    options.type = 'touchend';
    if(this.dispatch(element, options)&&dispatched) {
      options.type = 'click';
      return mouse.dispatch(element, options);
    }
    return false;
  };

  /**
  * Perform a scroll with the fingers.
  *
  * @param  int         x         The x delta to scroll to
  * @param  int         y         The y delta to scroll to
  * @param  Object      options   Clic options
  * @return Boolean
  */
  this.scroll = function scroll(x, y, options) {
    var dispatched=true,
      scrollX = (x < 0 ? x :
        (x > window.innerWidth ? x - window.innerWidth : 0)
      ),
      scrollY = (y < 0 ? y :
        (y > window.innerHeight ? y - window.innerHeight : 0)
      ),
      moveX=Math.round(window.innerWidth/2),
      moveY=Math.round(window.innerHeight/2);
    options = options || {};
    // Put the finger on the middle of the screen
    options.type = 'touchstart';
    dispatched = this.dispatch(document.elementFromPoint(moveX, moveY),
      options);
    // Moving through the x/y axis
    while(dispatched && (scrollX !== 0 || scrollY !== 0)) {
      // repeat the move if the finger is about to go out of the screen
      if(moveX<10||moveY<10
        ||moveX>window.innerWidth-10
        ||moveY>window.innerHeight-10) {
        moveX = Math.round(window.innerWidth/2);
        moveY = Math.round(window.innerHeight/2);
      // Remove the finger of the screen
      options.type = 'touchend';
      dispatched = this.dispatch(document.elementFromPoint(moveX, moveY),
        options);
      // Re-put the finger on the middle of the screen
      options.type = 'touchstart';
      dispatched = this.dispatch(document.elementFromPoint(moveX, moveY),
        options);
      }
      // Move the finger
      options.type = 'touchmove';
      dispatched = dispatched &&
        this.dispatch(document.elementFromPoint(moveX, moveY), options);
      if(dispatched) {
        moveX +=  (scrollX < 0 ? 5 : -5);
        moveY +=  (scrollY < 0 ? 5 : -5);
        window.scrollTo(window.scrollX
            - (scrollX < 0 ? 120 : (scrollX > 0 ? -120 : 0)),
          window.scrollY
            - (scrollY < 0 ? 120 : (scrollY > 0 ? -120 : 0)));
        if(scrollX) {
          scrollX =  (scrollX < 0 ?
            (scrollX + 120 > 0 ? 0 : scrollX + 120) :
            (scrollX - 120 < 0 ? 0 : scrollX - 120));
        }
        if(scrollY) {
          scrollY =  (scrollY < 0 ?
            (scrollY + 120 > 0 ? 0 : scrollY + 120) :
            (scrollY - 120 < 0 ? 0 : scrollY - 120));
        }
      }
    }
    // Remove the finger of the screen
    options.type = 'touchend';
    dispatched = dispatched &&
      this.dispatch(document.elementFromPoint(moveX, moveY), options);
    return dispatched;
  };

  /**
  * Perform a scroll with the fingers to an element.
  *
  * @param  DOMElement  element   A DOMElement on wich to scroll to
  * @param  Object      options   Touch options
  * @return Boolean
  */
  this.scrollTo = function scrollTo(element, options) {
    // Getting element center
    var c = utils.getElementCenter(element);
    // Scroll only if the element is not already in the viewport
    if(c.x<0 || c.y<0 || c.x > window.innerWidth || c.y > window.innerHeight) {
      return this.scroll(c.x, c.y, options);
    }
    return false;
  };

  /**
  * Dispatches a touch event to the given DOM element.
  *
  * @param  DOMElement  element   A DOMElement on wich to dispatch the event
  * @param  Object      options   Event options
  * @return Boolean
  */
  this.dispatch = function (element,options) {
    var event = document.createEvent('UIEvent'), coords;
    options = options || {};
    options.canBubble = ('false' === options.canBubble ? false : true);
    options.cancelable = ('false' === options.cancelable ? false : true);
    options.view = options.view || window;
    options.detail = options.detail || 1;
    options.altKey = !!options.altKey;
    options.ctrlKey = !!options.ctrlKey;
    options.shiftKey = !!options.shiftKey;
    options.metaKey = !!options.metaKey;
    options.changedTouches = options.changedTouches || [];
    options.touches = options.touches || [];
    options.scale = options.scale || 1.0;
    options.rotation = options.rotation || 0.0;
    coords = utils.getPossiblePointerCoords(element);
    if(null===coords) {
      throw Error('Unable to find a point in the viewport at wich the given'
        +' element can receive a touch event.');
    }
    // Safari, Firefox: must use initTouchEvent.
    if ("function" === typeof event.initTouchEvent) {
        event.initTouchEvent(options.type,
          options.canBubble, options.cancelable,
          options.view, options.detail,
          // Screen coordinates (relative to the whole user screen)
          // FIXME: find a way to get the right screen coordinates
          coords.x + window.screenLeft, coords.y  + window.screenTop,
          // Client coordinates (relative to the viewport)
          coords.x, coords.y,
          options.ctrlKey, options.altKey,
          options.shiftKey, options.metaKey,
          options.touches, options.targetTouches, options.changedTouches,
          options.scale, options.rotation);
        utils.setEventCoords(event, coords.x, coords.y);
    } else {
        event.initUIEvent(options.type,
          options.canBubble, options.cancelable,
          options.view, options.detail);
        utils.setEventProperty(event, 'altKey', options.altKey);
        utils.setEventProperty(event, 'ctrlKey', options.ctrlKey);
        utils.setEventProperty(event, 'shiftKey', options.shiftKey);
        utils.setEventProperty(event, 'metaKey', options.metaKey);
        utils.setEventProperty(event, 'changedTouches', options.changedTouches);
        utils.setEventProperty(event, 'touches', options.touches);
        utils.setEventProperty(event, 'scale', options.scale);
        utils.setEventProperty(event, 'rotation', options.rotation);
        utils.setEventCoords(event, coords.x, coords.y);
    }
    return element.dispatchEvent(event);
  };

}

module.exports = new Tactile();

},{"../utils.js":9,"./mouse.js":2}],5:[function(require,module,exports){
function Element(selector) {

    var mouse = require('../devices/mouse.js');

    this.selector = selector;
    this.element = document.querySelector(selector);
    if (!this.element) {
        throw new Error("Element not found using selector '" + selector + "'");
    }

    this.isVisible = function isVisible() {
        try {
            var comp = window.getComputedStyle(this.element, null);
            return comp.visibility !== 'hidden' &&
                   comp.display !== 'none' &&
                   this.element.offsetHeight > 0 &&
                   this.element.offsetWidth > 0;
        } catch (e) {console.log(e);
            return false;
        }
    };

    this.click = function click() {
        return mouse.click(this.element);
    };

    this.dblclick = function dblclick() {
        return mouse.dblclick(this.element);
    };
}

module.exports = function element(selector) {
    return new Element(selector);
};

},{"../devices/mouse.js":2}],6:[function(require,module,exports){
function Input(elementOrSelector) {

    var mouse = require('../devices/mouse.js');

    if (typeof elementOrSelector == 'string') {
        this.element = document.querySelector(elementOrSelector);
        if (!this.element) {
            throw new Error("Element not found using selector '" + elementOrSelector + "'");
        }
    } else {
        if (!(elementOrSelector instanceof HTMLElement)) {
            throw new Error("Invalid input() arg: only selector or HTMLElement are supported");
        }
        this.element = elementOrSelector;
    }

    this.val = function val() {
        return this.element.value;
    };

    this.set = function set(value) {
        try {
            this.element.focus();
        } catch (e) {
            throw new Error("Unable to focus() input field " + this.element.getAttribute('name') + ": " + e);
        }

        this.element.value = value;
    };

    this.fill = function fill(value, method) {
        method = method || 'paste';
        switch(method) {
            case 'paste':
                mouse.paste(this.element, value);
                break;
        }
    };
}

module.exports = function input(elementOrSelector) {
    return new Input(elementOrSelector);
};
},{"../devices/mouse.js":2}],7:[function(require,module,exports){
// Devices
module.exports.mouse = require('./devices/mouse.js');
module.exports.keyboard = require('./devices/keyboard.js');
module.exports.tactile = require('./devices/tactile.js');
module.exports.pointers = require('./devices/pointers.js');

// UI
module.exports.focus = require('./ui/focus.js');

// DSL
module.exports.element = require('./dsl/element.js');
module.exports.input = require('./dsl/input.js');

},{"./devices/keyboard.js":1,"./devices/mouse.js":2,"./devices/pointers.js":3,"./devices/tactile.js":4,"./dsl/element.js":5,"./dsl/input.js":6,"./ui/focus.js":8}],8:[function(require,module,exports){
function Focus() {

  var utils = require('../utils.js');

  // Private vars
  var _focusedInput, _focusedInputValue;

  // Consts
  this.EVENT_BLUR = 'blur';
  this.EVENT_FOCUS = 'focus';
  this.EVENT_FOCUSIN = 'focusin';
  this.EVENT_FOCUSOUT = 'focusout';
  this.EVENT_TYPES=[this.EVENT_BLUR, this.EVENT_FOCUS,this.EVENT_FOCUSIN,
    this.EVENT_FOCUSOUT];

  /**
  * Give the focus to the given DOM element.
  * http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent
  *
  * @param  DOMElement  element   A DOMElement to focus
  * @param  Object      options   Event options
  * @return Boolean
  */
  this.focus = function focus(element, options) {
    var activeElement = document.activeElement,
      focusEventFired = false,
      focusinEventFired = false;
    // Default options
    options = options || {};
    options.relatedTarget = options.relatedTarget || activeElement;
    // First blur the activeElement
    if(activeElement) {
      this.blur(options);
    }
    // Registering listeners to check that events are fired
    function focusListener(evt) {
      focusEventFired = true;
      element.removeEventListener(evt.type, focusListener);
    }
    element.addEventListener(this.EVENT_FOCUS, focusListener);
    function focusInListener(evt) {
      focusinEventFired = true;
      element.removeEventListener(evt.type, focusInListener);
    }
    element.addEventListener(this.EVENT_FOCUSIN, focusInListener);
    // Calling the focus method
    element.focus();
    // Saving value for inputs
    if(utils.isValuable(element)) {
      _focusedInputValue = (element.value || element.checked);
      _focusedInput = element;
    } else {
      _focusedInputValue = undefined;
      _focusedInput = null;
    }
    // Dispatch a focus event if not done before
    if(!focusEventFired) {
      element.removeEventListener(this.EVENT_FOCUS, focusListener);
      options.type = this.EVENT_FOCUS;
      options.canBubble = false;
      this.dispatch(element, options);
    }
    // then dispatch a focusin event
    if(!focusinEventFired) {
      element.removeEventListener(this.EVENT_FOCUSIN, focusInListener);
      options.type = this.EVENT_FOCUSIN;
      options.canBubble = true;
      this.dispatch(element, options);
    }
    return !!activeElement;
  };

  /**
  * Blur the currently focused DOM element.
  * http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent
  *
  * @param  Object      options   Event options
  * @return Boolean
  */
  this.blur = function blur(options) {
    function blurListener(evt) {
      blurEventFired = true;
      activeElement.removeEventListener(evt.type, blurListener);
    }
    function focusoutListener(evt) {
      focusoutEventFired = true;
      activeElement.removeEventListener(evt.type, focusoutListener);
    }
    var activeElement = document.activeElement,
      blurEventFired = false,
      focusoutEventFired = false;
    if(activeElement) {
      // Default options
      options = options || {};
      // Fire change event if some changes
      if(_focusedInput === activeElement && 'undefined' !== typeof _focusedInputValue
        && _focusedInputValue !== (activeElement.value || activeElement.checked)) {
        options.type = 'change';
        options.canBubble = true;
        options.cancelable = false;
        utils.dispatch(activeElement, options);
      }
      options.relatedTarget = options.relatedTarget || null;
      // Registering listeners to check that events are fired
      activeElement.addEventListener(this.EVENT_BLUR, blurListener);
      activeElement.addEventListener(this.EVENT_FOCUSOUT, focusoutListener);
      // Calling the blur method
      activeElement.blur();
      // Dispatch a blur event if not done before
      if(!blurEventFired) {
        activeElement.removeEventListener(this.EVENT_BLUR, blurListener);
        options.type = this.EVENT_BLUR;
        options.canBubble = false;
        this.dispatch(activeElement, options);
      }
      // Then a focusout event
      if(!focusoutEventFired) {
        activeElement.removeEventListener(this.EVENT_FOCUSOUT, focusoutListener);
        options.type = this.EVENT_FOCUSOUT;
        options.canBubble = true;
        this.dispatch(activeElement, options);
      }
      return true;
    }
    return false;
  };

  /**
  * Dispatches a FocusEvent instance to the given DOM element.
  * http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent
  *
  * @param  DOMElement  element   A DOMElement on wich to dispatch the event
  * @param  Object      options   Event options
  * @return Boolean
  */
  this.dispatch = function dispatch(element, options) {
    var event;
    // Setting default options
    if((!options.type) || -1 === this.EVENT_TYPES.indexOf(options.type)) {
      throw Error('Bad FocusEvent type provided "'+options.type+'".');
    }
    options.canBubble = ('false' === options.canBubble ? false : true);
    // Every FocusEvent instances aren't cancelable
    options.cancelable = options.cancelable || false;
    options.details = options.detail | 0;
    options.view = options.view || window;
    try {
      // First try to use the constructor
      try {
        event = new FocusEvent(options.type, {
          bubbles: options.canBubble,
          cancelable: options.cancelable,
          view: options.view,
          detail: options.detail,
          relatedTarget: options.relatedTarget
        });
      } catch(e) {
        // the standard interface is FocusEvent, but not always provided
        if('FocusEvent' in window) {
          event = document.createEvent("FocusEvent");
        } else {
          event = document.createEvent("Event");
        }
        // IE9+ provides a initFocusEvent method
        // http://msdn.microsoft.com/en-us/library/ie/ff974341(v=vs.85).aspx
        if('initFocusEvent' in event) {
          event.initFocusEvent(options.type,
            options.canBubble, options.cancelable,
            options.view, options.detail,
            options.relatedTarget);
        } else {
          event.initEvent(options.type, options.canBubble, options.cancelable);
          utils.setEventProperty(event, 'relatedTarget', options.relatedTarget);
        }

      }
      return element.dispatchEvent(event);
    } catch(err) {
      // old IE fallback
      event = document.createEventObject();
      event.eventType = options.type;
      event.relatedTarget = options.relatedTarget;
      return element.fireEvent('on'+type, event);
    }
  };

}

module.exports = new Focus();

},{"../utils.js":9}],9:[function(require,module,exports){
module.exports={

  setEventCoords: function(event, x, y) {
    this.setEventProperty(event, 'clientX', x);
    this.setEventProperty(event, 'clientY', y);
    this.setEventProperty(event, 'pageX', x + window.scrollX);
    this.setEventProperty(event, 'pageY', y + window.scrollY);
  },

  // Find the center of an element
  getElementCenter: function(element) {
    var c={};
    try {
      var rect = element.getBoundingClientRect();
      c.x = Math.floor((rect.left + rect.right) / 2);
      c.y = Math.floor((rect.top + rect.bottom) / 2);
    } catch(e) {
      c.x = 1;
      c.y = 1;
    }
    return c;
  },

  // Find a point in the viewport at wich an element can be the root of
  // a pointer event (is not under another element)
  getPossiblePointerCoords: function(element) {
    var comp, rects, coords = null;
    if(!(element instanceof HTMLElement)) {
      throw new Error('getPossiblePointerCoords needs a valid HTMLElement.');
    }
    comp = window.getComputedStyle(element, null);
    rects=element.getClientRects();
    if('none' !== comp.pointerEvents && rects.length) {
      mainLoop: for(var i=rects.length-1; i>=0; i--) {
        for(var x=rects[i].left, mX=rects[i].right; x<mX; x++) {
          for(var y=rects[i].top, mY=rects[i].bottom; y<mY; y++) {
            if(element === document.elementFromPoint(x,y)) {
              coords = {x: x, y: y};
              break mainLoop;
            }
          }
        }
      }
    }
    return coords;
  },

  // Set event property with a Chromium specific hack
  setEventProperty: function(event, property, value) {
    try {
      Object.defineProperty(event, property, {
        get : function() {
          return value;
        }
      });
    } catch(e) {
      event[property] = value;
    }
  },

  // Tell if the element can accept the given content
  canAcceptContent: function(element, content) {
    var nodeName = element.nodeName.toLowerCase(),
        type = element.hasAttribute('type') ? element.getAttribute('type') : null;

    if (nodeName === 'textarea') {
      return true;
    }
    if (nodeName === 'input'
      && ['text', 'password', 'number', 'date'].indexOf(type) !== -1) {
      return true;
    }
    return false;
  },

  // Tell if the element content can be partially selected
  isSelectable: function(element) {
    if('TEXTAREA'===element.nodeName
      ||('INPUT'===element.nodeName&&element.hasAttribute('type')
        &&('text'===element.getAttribute('type')
          ||'number'===element.getAttribute('type'))
      )
    ) {
      return true;
    }
    return false;
  },

  // Tell if the element is a form element that can contain a value
  isValuable: function(element) {
    if('TEXTAREA'===element.nodeName || 'SELECT'===element.nodeName
      || ('INPUT'===element.nodeName&&element.hasAttribute('type')
        &&('text'===element.getAttribute('type')
          || 'number'===element.getAttribute('type')
          || 'password'===element.getAttribute('type')
          || 'file'===element.getAttribute('type')
          || 'date'===element.getAttribute('type'))
      )
    ) {
      return true;
    }
    return false;
  },

  // Returns a list of focusable elements in the document
  getFocusableElements: function(element) {
    // FIXME: Ordinate elements with tabindexes + fallback for querySelector
    return document.querySelectorAll(
      'input:not(:disabled), textarea:not(:disabled), '
      + 'a[href]:not(:disabled):not(:empty), button:not(:disabled), '
      + 'select:not(:disabled)');
  },

  // dispatch a simple event
  dispatch: function(element, options) {
    var event;
    options = options || {};
    options.canBubble = ('false' === options.canBubble ? false : true);
    options.cancelable = ('false' === options.cancelable ? false : true);
    options.view = options.view || window;
    try {
        event = new Event(options.type, {
          bubbles: options.canBubble,
          cancelable: options.cancelable,
          view: options.view,
          relatedTarget: options.relatedTarget
        });
        return element.dispatchEvent(event);
    } catch(e) {
      try {
        event = document.createEvent("Event");
        event.initEvent(options.type,
          options.canBubble, options.cancelable);
        this.setEventProperty(event, 'relatedTarget', options.relatedTarget);
        return element.dispatchEvent(event);
      } catch(err) {
        // old IE fallback
        event = document.createEventObject();
        event.eventType = options.type;
        event.relatedTarget = options.relatedTarget;
        return element.fireEvent('on'+options.type, event);
      }
    }
  }

};

},{}]},{},[7])
(7)
});
;
