module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1645497392671, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shrinkPaddedLEB128 = shrinkPaddedLEB128;

var _wasmParser = require("@webassemblyjs/wasm-parser");

var _leb = require("./leb128.js");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OptimizerError =
/*#__PURE__*/
function (_Error) {
  _inherits(OptimizerError, _Error);

  function OptimizerError(name, initalError) {
    var _this;

    _classCallCheck(this, OptimizerError);

    _this = _possibleConstructorReturn(this, (OptimizerError.__proto__ || Object.getPrototypeOf(OptimizerError)).call(this, "Error while optimizing: " + name + ": " + initalError.message));
    _this.stack = initalError.stack;
    return _this;
  }

  return OptimizerError;
}(Error);

var decoderOpts = {
  ignoreCodeSection: true,
  ignoreDataSection: true
};

function shrinkPaddedLEB128(uint8Buffer) {
  try {
    var ast = (0, _wasmParser.decode)(uint8Buffer.buffer, decoderOpts);
    return (0, _leb.shrinkPaddedLEB128)(ast, uint8Buffer);
  } catch (e) {
    throw new OptimizerError("shrinkPaddedLEB128", e);
  }
}
}, function(modId) {var map = {"./leb128.js":1645497392672}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497392672, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shrinkPaddedLEB128 = shrinkPaddedLEB128;

var _ast = require("@webassemblyjs/ast");

var _encoder = require("@webassemblyjs/wasm-gen/lib/encoder");

var _helperBuffer = require("@webassemblyjs/helper-buffer");

function shiftFollowingSections(ast, _ref, deltaInSizeEncoding) {
  var section = _ref.section;
  // Once we hit our section every that is after needs to be shifted by the delta
  var encounteredSection = false;
  (0, _ast.traverse)(ast, {
    SectionMetadata: function SectionMetadata(path) {
      if (path.node.section === section) {
        encounteredSection = true;
        return;
      }

      if (encounteredSection === true) {
        (0, _ast.shiftSection)(ast, path.node, deltaInSizeEncoding);
      }
    }
  });
}

function shrinkPaddedLEB128(ast, uint8Buffer) {
  (0, _ast.traverse)(ast, {
    SectionMetadata: function SectionMetadata(_ref2) {
      var node = _ref2.node;

      /**
       * Section size
       */
      {
        var newu32Encoded = (0, _encoder.encodeU32)(node.size.value);
        var newu32EncodedLen = newu32Encoded.length;
        var start = node.size.loc.start.column;
        var end = node.size.loc.end.column;
        var oldu32EncodedLen = end - start;

        if (newu32EncodedLen !== oldu32EncodedLen) {
          var deltaInSizeEncoding = oldu32EncodedLen - newu32EncodedLen;
          uint8Buffer = (0, _helperBuffer.overrideBytesInBuffer)(uint8Buffer, start, end, newu32Encoded);
          shiftFollowingSections(ast, node, -deltaInSizeEncoding);
        }
      }
    }
  });
  return uint8Buffer;
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1645497392671);
})()
//miniprogram-npm-outsideDeps=["@webassemblyjs/wasm-parser","@webassemblyjs/ast","@webassemblyjs/wasm-gen/lib/encoder","@webassemblyjs/helper-buffer"]
//# sourceMappingURL=index.js.map