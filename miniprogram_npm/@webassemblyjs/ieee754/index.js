module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1645497392659, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encodeF32 = encodeF32;
exports.encodeF64 = encodeF64;
exports.decodeF32 = decodeF32;
exports.decodeF64 = decodeF64;
exports.DOUBLE_PRECISION_MANTISSA = exports.SINGLE_PRECISION_MANTISSA = exports.NUMBER_OF_BYTE_F64 = exports.NUMBER_OF_BYTE_F32 = void 0;

var _ieee = require("@xtuc/ieee754");

/**
 * According to https://webassembly.github.io/spec/binary/values.html#binary-float
 * n = 32/8
 */
var NUMBER_OF_BYTE_F32 = 4;
/**
 * According to https://webassembly.github.io/spec/binary/values.html#binary-float
 * n = 64/8
 */

exports.NUMBER_OF_BYTE_F32 = NUMBER_OF_BYTE_F32;
var NUMBER_OF_BYTE_F64 = 8;
exports.NUMBER_OF_BYTE_F64 = NUMBER_OF_BYTE_F64;
var SINGLE_PRECISION_MANTISSA = 23;
exports.SINGLE_PRECISION_MANTISSA = SINGLE_PRECISION_MANTISSA;
var DOUBLE_PRECISION_MANTISSA = 52;
exports.DOUBLE_PRECISION_MANTISSA = DOUBLE_PRECISION_MANTISSA;

function encodeF32(v) {
  var buffer = [];
  (0, _ieee.write)(buffer, v, 0, true, SINGLE_PRECISION_MANTISSA, NUMBER_OF_BYTE_F32);
  return buffer;
}

function encodeF64(v) {
  var buffer = [];
  (0, _ieee.write)(buffer, v, 0, true, DOUBLE_PRECISION_MANTISSA, NUMBER_OF_BYTE_F64);
  return buffer;
}

function decodeF32(bytes) {
  var buffer = Buffer.from(bytes);
  return (0, _ieee.read)(buffer, 0, true, SINGLE_PRECISION_MANTISSA, NUMBER_OF_BYTE_F32);
}

function decodeF64(bytes) {
  var buffer = Buffer.from(bytes);
  return (0, _ieee.read)(buffer, 0, true, DOUBLE_PRECISION_MANTISSA, NUMBER_OF_BYTE_F64);
}
}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1645497392659);
})()
//miniprogram-npm-outsideDeps=["@xtuc/ieee754"]
//# sourceMappingURL=index.js.map