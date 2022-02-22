module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1645497392652, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parse32F = parse32F;
exports.parse64F = parse64F;
exports.parse32I = parse32I;
exports.parseU32 = parseU32;
exports.parse64I = parse64I;
exports.isInfLiteral = isInfLiteral;
exports.isNanLiteral = isNanLiteral;

var _long = _interopRequireDefault(require("@xtuc/long"));

var _floatingPointHexParser = _interopRequireDefault(require("@webassemblyjs/floating-point-hex-parser"));

var _helperApiError = require("@webassemblyjs/helper-api-error");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parse32F(sourceString) {
  if (isHexLiteral(sourceString)) {
    return (0, _floatingPointHexParser.default)(sourceString);
  }

  if (isInfLiteral(sourceString)) {
    return sourceString[0] === "-" ? -1 : 1;
  }

  if (isNanLiteral(sourceString)) {
    return (sourceString[0] === "-" ? -1 : 1) * (sourceString.includes(":") ? parseInt(sourceString.substring(sourceString.indexOf(":") + 1), 16) : 0x400000);
  }

  return parseFloat(sourceString);
}

function parse64F(sourceString) {
  if (isHexLiteral(sourceString)) {
    return (0, _floatingPointHexParser.default)(sourceString);
  }

  if (isInfLiteral(sourceString)) {
    return sourceString[0] === "-" ? -1 : 1;
  }

  if (isNanLiteral(sourceString)) {
    return (sourceString[0] === "-" ? -1 : 1) * (sourceString.includes(":") ? parseInt(sourceString.substring(sourceString.indexOf(":") + 1), 16) : 0x8000000000000);
  }

  if (isHexLiteral(sourceString)) {
    return (0, _floatingPointHexParser.default)(sourceString);
  }

  return parseFloat(sourceString);
}

function parse32I(sourceString) {
  var value = 0;

  if (isHexLiteral(sourceString)) {
    value = ~~parseInt(sourceString, 16);
  } else if (isDecimalExponentLiteral(sourceString)) {
    throw new Error("This number literal format is yet to be implemented.");
  } else {
    value = parseInt(sourceString, 10);
  }

  return value;
}

function parseU32(sourceString) {
  var value = parse32I(sourceString);

  if (value < 0) {
    throw new _helperApiError.CompileError("Illegal value for u32: " + sourceString);
  }

  return value;
}

function parse64I(sourceString) {
  var long;

  if (isHexLiteral(sourceString)) {
    long = _long.default.fromString(sourceString, false, 16);
  } else if (isDecimalExponentLiteral(sourceString)) {
    throw new Error("This number literal format is yet to be implemented.");
  } else {
    long = _long.default.fromString(sourceString);
  }

  return {
    high: long.high,
    low: long.low
  };
}

var NAN_WORD = /^\+?-?nan/;
var INF_WORD = /^\+?-?inf/;

function isInfLiteral(sourceString) {
  return INF_WORD.test(sourceString.toLowerCase());
}

function isNanLiteral(sourceString) {
  return NAN_WORD.test(sourceString.toLowerCase());
}

function isDecimalExponentLiteral(sourceString) {
  return !isHexLiteral(sourceString) && sourceString.toUpperCase().includes("E");
}

function isHexLiteral(sourceString) {
  return sourceString.substring(0, 2).toUpperCase() === "0X" || sourceString.substring(0, 3).toUpperCase() === "-0X";
}
}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1645497392652);
})()
//miniprogram-npm-outsideDeps=["@xtuc/long","@webassemblyjs/floating-point-hex-parser","@webassemblyjs/helper-api-error"]
//# sourceMappingURL=index.js.map