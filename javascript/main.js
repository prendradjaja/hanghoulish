'use strict';
/**
 * hangul.js
 * http://github.com/clee704/hangul-js
 * @version 1.1.2
 * @copyright Copyright 2013, Choongmin Lee
 * @license MIT license
 */
/**
 * @namespace hangul
 */
var hangul = (function (undefined) {
"use strict";

// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
    if (this === void 0 || this === null) throw new TypeError();
    var t = Object(this);
    var len = t.length >>> 0;
    if (len === 0) return -1;
    var n = 0;
    if (arguments.length > 0) {
      n = Number(arguments[1]);
      if (n !== n) { // shortcut for verifying if it's NaN
        n = 0;
      } else if (n !== 0 && n !== Infinity && n !== -Infinity) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
      }
    }
    if (n >= len) return -1;
    var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
    for (; k < len; k++) {
      if (k in t && t[k] === searchElement) return k;
    }
    return -1;
  };
}

/**
 * @constructor
 * @name hangul.Set
 */
function Set() {
  var i;
  this.items = {};
  for (i = 0; i < arguments.length; i++) {
    this.add(arguments[i]);
  }
}

/**
 * Returns true if this set contains the specified object.
 * @param e {object} object whose presence in this set is to be tested
 * @method hangul.Set#has
 */
Set.prototype.has = function (e) {
  return e in this.items;
};

/**
 * Adds the specified object into this set.
 * @param e {object} object to be added this set
 * @method hangul.Set#add
 */
Set.prototype.add = function (e) {
  this.items[e] = 1;
};

/**
 * Constructs a new map, optionally containing the properties of the specified
 * object.
 * @classdesc A simple map supporting an inverse view.
 * @constructor
 * @name hangul.Map
 */
function Map(o, _inverse) {
  this.items = {};
  /**
   * Inverse view of the map.
   * @member {hangul.Map} hangul.Map#inverse
   */
  this.inverse = _inverse || new Map(undefined, this);
  if (o) {
    this.addAll(o);
  }
}

/**
 * @param k {object} key
 * @param v {object} value
 * @method hangul.Map#add
 */
Map.prototype.add = function (k, v) {
  this.items[k] = v;
  this.inverse.items[v] = k;
};

/**
 * @param o {object} object whose properties are to be added to this map
 * @method hangul.Map#addAll
 */
Map.prototype.addAll = function (o) {
  var k;
  for (k in o) {
    this.add(k, o[k]);
  }
};

/**
 * Returns true if this map has a mapping for the specified key.
 * @param k {object} key
 * @method hangul.Map#hasKey
 */
Map.prototype.hasKey = function (k) {
  return k in this.items;
};

/**
 * Returns true if this map has a mapping for the specified value.
 * @param v {object} value
 * @method hangul.Map#hasValue
 */
Map.prototype.hasValue = function (v) {
  return v in this.inverse.items;
};

/**
 * Returns the associated object for the specified key or undefined
 * if there is no mapping for the key.
 * @param k {object} key
 * @method hangul.Map#get
 */
Map.prototype.get = function (k) {
  return this.items[k];
};

/**
 * List of modern hangul jamo (U+3131-U+3163).
 * @member {hangul.Map} hangul.jamo
 */
var jamo = collectJamo(0x3131, 0x3163);

/**
 * List of modern hangul initial jamo. Actually some of these charaters are
 * not just initials, but can also be final jamo. Thus many characters in this
 * list overlap with the characters in {@link hangul.finals}.
 * @member {hangul.Map} hangul.initials
 */
var initials = collectJamo(0x3131, 0x314e,
    [2, 4, 5, 9, 10, 11, 12, 13, 14, 15, 19]);

/**
 * List of modern hangul medials.
 * @member {hangul.Map} hangul.medials
 */
var medials = collectJamo(0x314f, 0x3163);

/**
 * List of modern hangul finals. The details are the same as
 * {@link hangul.initials}. The list does not include a filler.
 * @member {hangul.Map} hangul.finals
 */
var finals = collectJamo(0x3131, 0x314e, [7, 18, 24]);

function collectJamo(from, to, exclude) {
  var map = new Map(),
      length = to - from + 1;
  for (var i = 0, j = 0; i < length; i++) {
    if (!exclude || exclude.indexOf(i) < 0) {
      map.add(j++, String.fromCharCode(i + from));
    }
  }
  return map;
}

/**
 * Returns true if the first character of the specified string represents
 * modern hangul characters (U+3131-U+3163 and U+AC00-U+D7A3; no support for
 * the "Hangul Jamo", "Hangul Jamo Extended-A", "Hangul Jamo Extended-B"
 * blocks).
 * @param {string} s
 * @function hangul.isHangul
 */
function isHangul(s) {
  var c = s && s.charAt && s.charAt(0);
  return jamo.hasValue(c) || isSyllable(c);
}

/**
 * Returns true if the first character of the specified string represents
 * modern hangul syllables (U+AC00-U+D7A3).
 * @param {string} s
 * @function hangul.isSyllable
 */
function isSyllable(s) {
  var code = s && s.charCodeAt && s.charCodeAt(0);
  return 0xac00 <= code && code <= 0xd7a3;
}

/**
 * Returns true if the first character of the specified string represents
 * modern jamo (U+3131-U+3163).
 * @param {string} s
 * @function hangul.isJamo
 */
function isJamo(s) {
  return jamo.hasValue(s && s.charAt && s.charAt(0));
}

/**
 * Returns true if the first character of the specified string represents
 * modern hangul initials.
 * @param {string} s
 * @function hangul.isInitial
 */
function isInitial(s) {
  return initials.hasValue(s && s.charAt && s.charAt(0));
}

/**
 * Returns true if the first character of the specified string represents
 * modern hangul medials.
 * @param {string} s
 * @function hangul.isMedial
 */
function isMedial(s) {
  return medials.hasValue(s && s.charAt && s.charAt(0));
}

/**
 * Returns true if the first character of the specified string represents
 * modern hangul finals.
 * @param {string} s
 * @function hangul.isFinal
 */
function isFinal(s) {
  return finals.hasValue(s && s.charAt && s.charAt(0));
}

/**
 * Returns the initial of the first chacater of the specified string.
 * Returns undefined if the character is not a hangul syllable.
 * @param {string} s
 * @function hangul.getInitial
 */
function getInitial(s) {
  var code = s && s.charCodeAt && s.charCodeAt(0);
  return initials.get(Math.floor((code - 0xac00) / 28 / 21));
}

/**
 * Returns the medial of the first chacater of the specified string.
 * Returns undefined if the character is not a hangul syllable.
 * @param {string} s
 * @function hangul.getMedial
 */
function getMedial(s) {
  var code = s && s.charCodeAt && s.charCodeAt(0);
  return medials.get(Math.floor((code - 0xac00) / 28) % 21);
}

/**
 * Returns the final of the first chacater of the specified string, or
 * an empty string '' if the syllable has no final jamo. Returns undefined
 * if the character is not a hangul syllable.
 * @param {string} s
 * @function hangul.getFinal
 */
function getFinal(s) {
  var code = s && s.charCodeAt && s.charCodeAt(0),
      i = (code - 0xac00) % 28;
  return i > 0 ? finals.get(i - 1) : i === 0 ? '' : undefined;
}

/**
 * Decomposes the first character of the specified string into constituent
 * jamo and returns them as an array of length 3 (or 2 if there is no final).
 * They are obtained using {@link hangul.getInitial}, {@link hangul.getMedial}
 * and {@link hangul.getFinal}. Returns undefined if the character is not a
 * hangul syllable.
 * @param {string} s
 * @function hangul.decompose
 */
function decompose(s) {
  var c = s && s.charAt && s.charAt(0);
  if (!isSyllable(c)) {
    return undefined;
  }
  var jamo = [getInitial(c), getMedial(c), getFinal(c)];
  if (jamo[2] === '') {
    jamo.pop();
  }
  return jamo;
}

/**
 * Composes from the specified constituent jamo a hangul syllable. Use
 * undefined or an empty string '' for the final filler. Returns undefined if
 * any of the arguments are not a modern jamo, except for the final which can
 * also be either undefined or an empty string.
 * @param {string} s
 * @function hangul.compose
 */
function compose(ini, med, fin) {
  var x = initials.inverse.get(ini),
      y = medials.inverse.get(med),
      z = fin === undefined || fin === '' ? 0 : finals.inverse.get(fin) + 1,
      c = String.fromCharCode(0xac00 + (x * 21 + y) * 28 + z);
  return isSyllable(c) ? c : undefined;
}

/**
 * List of modern hangul double jamo (clusters and compounds).
 */
var doubleJamo = new Map({
  '\u3133': '\u3131\u3145', '\u3135': '\u3134\u3148',
  '\u3136': '\u3134\u314e', '\u313a': '\u3139\u3131',
  '\u313b': '\u3139\u3141', '\u313c': '\u3139\u3142',
  '\u313d': '\u3139\u3145', '\u313e': '\u3139\u314c',
  '\u313f': '\u3139\u314d', '\u3140': '\u3139\u314e',
  '\u3144': '\u3142\u3145', '\u3132': '\u3131\u3131',
  '\u3138': '\u3137\u3137', '\u3143': '\u3142\u3142',
  '\u3146': '\u3145\u3145', '\u3149': '\u3148\u3148',
  '\u3158': '\u3157\u314f', '\u3159': '\u3157\u3150',
  '\u315a': '\u3157\u3163', '\u315d': '\u315c\u3153',
  '\u315e': '\u315c\u3154', '\u315f': '\u315c\u3163',
  '\u3162': '\u3161\u3163'
});

/**
 * Composes from the specified jamo a double jamo. Returns undefined if
 * the specified jamo do not make a double jamo.
 * @param {string} c1
 * @param {string} c2
 * @function hangul.composeDoubleJamo
 */
function composeDoubleJamo(c1, c2) {
  return doubleJamo.inverse.get(c1 + c2);
}

/**
 * Decomposes the specified double jamo into two jamo and returns them as an
 * array of length 2. Returns undefined if the specified jamo is not a double
 * jamo.
 * @param {string} c
 * @function hangul.decomposeDoubleJamo
 */
function decomposeDoubleJamo(c) {
  var cc = doubleJamo.get(c);
  return cc === undefined ? cc : [cc.charAt(0), cc.charAt(1)];
}

var iotizedVowels = new Set(
  '\u3163', '\u3151', '\u3152', '\u3155', '\u3156', '\u315b', '\u3160'
);

/**
 * Returns true if the first character of the specified string represents
 * a iotized vowel (including the close front vowel) that may cause
 * palatalization.
 * @param {string} s
 * @function hangul.isIotizedVowel
 */
function isIotizedVowel(s) {
  return iotizedVowels.has(s && s.charAt && s.charAt(0));
}

return {
  Set: Set,
  Map: Map,
  jamo: jamo,
  initials: initials,
  medials: medials,
  finals: finals,
  isHangul: isHangul,
  isSyllable: isSyllable,
  isJamo: isJamo,
  isInitial: isInitial,
  isMedial: isMedial,
  isFinal: isFinal,
  getInitial: getInitial,
  getMedial: getMedial,
  getFinal: getFinal,
  decompose: decompose,
  compose: compose,
  composeDoubleJamo: composeDoubleJamo,
  decomposeDoubleJamo: decomposeDoubleJamo,
  isIotizedVowel: isIotizedVowel
};

})();












const abc = {  // ptodo-rename
  'a': 'ㅏ',
  'b': 'ㅂ',
  'c': 'ㅊ',
  'd': 'ㄷ',
  'e': 'ㅓ',
  'f': 'ㅉ',
  'g': 'ㄱ',
  'h': 'ㅎ',
  'i': 'ㅣ',
  'j': 'ㅈ',
  'k': 'ㅋ',
  'l': 'ㄹ',
  'm': 'ㅁ',
  'n': 'ㄴ',
  'o': 'ㅗ',
  'p': 'ㅍ',
  'q': 'ㄸ',
  'r': 'ㄲ',
  's': 'ㅅ',
  't': 'ㅌ',
  'u': 'ㅜ',
  'v': 'ㅃ',
  'w': 'ㅘ',
  'x': 'ㅇ',
  'y': 'ㅟ',
  'z': 'ㅆ',

  // placeholders
  'V': 'ㅡ',
  'C': 'ㅇ',

  'ㅏ': 'a',
  'ㅂ': 'b',
  'ㅊ': 'c',
  'ㄷ': 'd',
  'ㅓ': 'e',
  'ㅉ': 'f',
  'ㄱ': 'g',
  'ㅎ': 'h',
  'ㅣ': 'i',
  'ㅈ': 'j',
  'ㅋ': 'k',
  'ㄹ': 'l',
  'ㅁ': 'm',
  'ㄴ': 'n',
  'ㅗ': 'o',
  'ㅍ': 'p',
  'ㄸ': 'q',
  'ㄲ': 'r',
  'ㅅ': 's',
  'ㅌ': 't',
  'ㅜ': 'u',
  'ㅃ': 'v',
  'ㅘ': 'w',
  'ㅇ': 'x',
  'ㅟ': 'y',
  'ㅆ': 'z',
};









const ascii_lowercase = 'abcdefghijklmnopqrstuvwxyz';

function contains(seq, elem) {
    return seq.indexOf(elem) !== -1;
}









// ptodo
// . all the 'aesthetic' stuff from the OP's rules
// . X-disambiguation rule
// . include extension-specific stuff

// ptodo: specific bad results (and their expected results)
// . over = o ver
// . takes = tak es OR ta kes? not sure
// . iterable = i te rab le?
// . together = to get her

// ptodo-style
// . basically all the identifiers are poorly chosen













/// import hangul  (contains hangul.compose(init, med, final?))
/// import abc
/// import ascii_lowercase
/// import contains

const _test_words = [
    'han',
    'hanhan',
    'than',
    'theo',
]
.concat('the quick brown fox jumps over the lazy dog'.split(' '));

const test_prose = "Hello, world!";

const EXTRA_SPACING = '';
// const EXTRA_SPACING = '\u00A0';

// uniq
const test_words = [];
_test_words.forEach(w => {
    if (test_words.indexOf(w) === -1) {
        test_words.push(w);
    }
});

// what is the word for the type Vowel | Consonant?
function to_buckets(word) {
    let result = '';
    for (let i = 0; i < word.length; i++) {
        const letter = word.charAt(i);
        result += to_bucket(letter);
    }
    return result;
}

function to_bucket(letter) {
    if (ascii_lowercase.indexOf(letter) === -1) {
        throw 'AssertionError';
    }
    if ('aeiouwy'.indexOf(letter) !== -1) {
        return 'v';
    } else {
        return 'c';
    }
}



function segments(word) {
    // if (contains(word, 'w') || contains(word, 'y')) {
    //     throw 'NotImplemented';
    // }
    const bucketed = to_buckets(word);

    const ret = [];
    let i = 0;
    while (i < word.length) {
        const r_buckets = bucketed.substring(i);  // remaining buckets
        let use;

        // Lookahead cases
        if (r_buckets.startsWith('cvcv')) {
            use = 3;
        } else if (r_buckets.startsWith('vcv')) {
            use = 2;

        // Normal cases
        } else if (r_buckets.startsWith('cvc')) {
            use = 3;
        } else if (r_buckets.startsWith('vc')) {
            use = 2;
        } else if (r_buckets.startsWith('cv')) {
            use = 2;
        } else if (r_buckets.startsWith('c')) {
            use = 1;
        } else if (r_buckets.startsWith('v')) {
            use = 1;
        } else {
            throw 'ptodo bug?';
        }

        const seg = word.substring(i, i+use);
        const last_char = seg.charAt(seg.length - 1);

        if (! contains('fqv', last_char) || seg.length === 1) {
            ret.push(seg);
            i += use;
        } else {
            const shorter_seg = seg.substring(0, seg.length - 1);
            ret.push(shorter_seg);
            i += use - 1;
        }
    }
    return ret;
}

function encode(word) {
    try {
        let new_segs = segments(word).map(x => encode_segment(x, word));
        return new_segs.join('');
    } catch (e) {
        return word + EXTRA_SPACING;
    }
}

function encode_segment(orig_seg, word) {
    const seg = add_placeholders(orig_seg);
    const jamos = seg.split('').map(letter => abc[letter]);
    try {
        const res = hangul.compose.apply(null, jamos);
        if (res) {
            return res;
        } else {
            return orig_seg;
        }
    } catch (e) {
        console.log('Word              :', word);
        console.log('Segment           :', orig_seg);
        console.log('With placeholders :', seg);
        console.log('Jamos             :',jamos);
    }
}

function add_placeholders(seg) {
    const bucketed = to_buckets(seg);
    switch (bucketed) {
        case 'cvc':
            return seg;
        case 'vc':
            return 'C' + seg;
        case 'cv':
            return seg;
        case 'c':
            return seg + 'V';
        case 'v':
            return 'C' + seg;
        default:
            throw 'ptodo bug?';
    }
}

function encode_text(text) {
    const tokens = tokenize(text.toLowerCase());
    return tokens.map(w => encode(w)).join('');
}

function tokenize(line) {
    let curr_token = '';
    let is_alpha_token;
    let tokens = [];
    line.split('').forEach(c => {
        const is_alpha_char = contains(ascii_lowercase, c);
        if (curr_token === '') {
            is_alpha_token = is_alpha_char;
            curr_token += c;
        } else {
            if (is_alpha_token === is_alpha_char) {
                curr_token += c;
            } else {
                tokens.push(curr_token);
                curr_token = c;
                is_alpha_token = is_alpha_char;
            }
        }
    });
    tokens.push(curr_token);
    return tokens;
}

function demo_words() {
    const maxlen = Math.max.apply(null, test_words.map(x => x.length));
    test_words.forEach(w => {
        console.log(w + '\t:', encode(w))
    });
}

function demo_prose() {
    console.log(encode_text(test_prose));
}

function textNodesUnder(el){
  var n, a=[], walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null,false);
  while(n=walk.nextNode()) a.push(n);
  return a;
}

function main() {
  const trigger = [71, 72, 222];  // gh'
  const keypresses = trigger.map(x => 0);
  document.body.onkeydown = (evt) => {
    keypresses.push(evt.keyCode);
    keypresses.shift();
    if (''+keypresses == ''+trigger) {
      encode_all();
    }
  };
}

// https://stackoverflow.com/questions/10730309/find-all-text-nodes-in-html-page
function encode_all() {
  textNodesUnder(document.body).forEach(n => {
    n.textContent = encode_text(n.textContent);
  });
}


// demo_words();
// demo_prose();
// main();
