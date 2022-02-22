module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1645497392651, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.overrideBytesInBuffer = overrideBytesInBuffer;
exports.makeBuffer = makeBuffer;
exports.fromHexdump = fromHexdump;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function concatUint8Arrays() {
  for (var _len = arguments.length, arrays = new Array(_len), _key = 0; _key < _len; _key++) {
    arrays[_key] = arguments[_key];
  }

  var totalLength = arrays.reduce(function (a, b) {
    return a + b.length;
  }, 0);
  var result = new Uint8Array(totalLength);
  var offset = 0;

  for (var _i = 0; _i < arrays.length; _i++) {
    var arr = arrays[_i];

    if (arr instanceof Uint8Array === false) {
      throw new Error("arr must be of type Uint8Array");
    }

    result.set(arr, offset);
    offset += arr.length;
  }

  return result;
}

function overrideBytesInBuffer(buffer, startLoc, endLoc, newBytes) {
  var beforeBytes = buffer.slice(0, startLoc);
  var afterBytes = buffer.slice(endLoc, buffer.length); // replacement is empty, we can omit it

  if (newBytes.length === 0) {
    return concatUint8Arrays(beforeBytes, afterBytes);
  }

  var replacement = Uint8Array.from(newBytes);
  return concatUint8Arrays(beforeBytes, replacement, afterBytes);
}

function makeBuffer() {
  for (var _len2 = arguments.length, splitedBytes = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    splitedBytes[_key2] = arguments[_key2];
  }

  var bytes = [].concat.apply([], splitedBytes);
  return new Uint8Array(bytes).buffer;
}

function fromHexdump(str) {
  var lines = str.split("\n"); // remove any leading left whitespace

  lines = lines.map(function (line) {
    return line.trim();
  });
  var bytes = lines.reduce(function (acc, line) {
    var cols = line.split(" "); // remove the offset, left column

    cols.shift();
    cols = cols.filter(function (x) {
      return x !== "";
    });
    var bytes = cols.map(function (x) {
      return parseInt(x, 16);
    });
    acc.push.apply(acc, _toConsumableArray(bytes));
    return acc;
  }, []);
  return Buffer.from(bytes);
}
}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1645497392651);
})()
//miniprogram-npm-outsideDeps=[]
//# sourceMappingURL=index.js.map