module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1645497392664, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "decode", {
  enumerable: true,
  get: function get() {
    return _decoder.decode;
  }
});
Object.defineProperty(exports, "encode", {
  enumerable: true,
  get: function get() {
    return _encoder.encode;
  }
});

var _decoder = require("./decoder");

var _encoder = require("./encoder");
}, function(modId) {var map = {"./decoder":1645497392665,"./encoder":1645497392666}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497392665, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decode = decode;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function con(b) {
  if ((b & 0xc0) === 0x80) {
    return b & 0x3f;
  } else {
    throw new Error("invalid UTF-8 encoding");
  }
}

function code(min, n) {
  if (n < min || 0xd800 <= n && n < 0xe000 || n >= 0x10000) {
    throw new Error("invalid UTF-8 encoding");
  } else {
    return n;
  }
}

function decode(bytes) {
  return _decode(bytes).map(function (x) {
    return String.fromCharCode(x);
  }).join("");
}

function _decode(bytes) {
  if (bytes.length === 0) {
    return [];
  }
  /**
   * 1 byte
   */


  {
    var _bytes = _toArray(bytes),
        b1 = _bytes[0],
        bs = _bytes.slice(1);

    if (b1 < 0x80) {
      return [code(0x0, b1)].concat(_toConsumableArray(_decode(bs)));
    }

    if (b1 < 0xc0) {
      throw new Error("invalid UTF-8 encoding");
    }
  }
  /**
   * 2 bytes
   */

  {
    var _bytes2 = _toArray(bytes),
        _b = _bytes2[0],
        b2 = _bytes2[1],
        _bs = _bytes2.slice(2);

    if (_b < 0xe0) {
      return [code(0x80, ((_b & 0x1f) << 6) + con(b2))].concat(_toConsumableArray(_decode(_bs)));
    }
  }
  /**
   * 3 bytes
   */

  {
    var _bytes3 = _toArray(bytes),
        _b2 = _bytes3[0],
        _b3 = _bytes3[1],
        b3 = _bytes3[2],
        _bs2 = _bytes3.slice(3);

    if (_b2 < 0xf0) {
      return [code(0x800, ((_b2 & 0x0f) << 12) + (con(_b3) << 6) + con(b3))].concat(_toConsumableArray(_decode(_bs2)));
    }
  }
  /**
   * 4 bytes
   */

  {
    var _bytes4 = _toArray(bytes),
        _b4 = _bytes4[0],
        _b5 = _bytes4[1],
        _b6 = _bytes4[2],
        b4 = _bytes4[3],
        _bs3 = _bytes4.slice(4);

    if (_b4 < 0xf8) {
      return [code(0x10000, (((_b4 & 0x07) << 18) + con(_b5) << 12) + (con(_b6) << 6) + con(b4))].concat(_toConsumableArray(_decode(_bs3)));
    }
  }
  throw new Error("invalid UTF-8 encoding");
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497392666, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encode = encode;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function con(n) {
  return 0x80 | n & 0x3f;
}

function encode(str) {
  var arr = str.split("").map(function (x) {
    return x.charCodeAt(0);
  });
  return _encode(arr);
}

function _encode(arr) {
  if (arr.length === 0) {
    return [];
  }

  var _arr = _toArray(arr),
      n = _arr[0],
      ns = _arr.slice(1);

  if (n < 0) {
    throw new Error("utf8");
  }

  if (n < 0x80) {
    return [n].concat(_toConsumableArray(_encode(ns)));
  }

  if (n < 0x800) {
    return [0xc0 | n >>> 6, con(n)].concat(_toConsumableArray(_encode(ns)));
  }

  if (n < 0x10000) {
    return [0xe0 | n >>> 12, con(n >>> 6), con(n)].concat(_toConsumableArray(_encode(ns)));
  }

  if (n < 0x110000) {
    return [0xf0 | n >>> 18, con(n >>> 12), con(n >>> 6), con(n)].concat(_toConsumableArray(_encode(ns)));
  }

  throw new Error("utf8");
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1645497392664);
})()
//miniprogram-npm-outsideDeps=[]
//# sourceMappingURL=index.js.map