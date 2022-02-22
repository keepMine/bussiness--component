module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1645497392655, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "resizeSectionByteSize", {
  enumerable: true,
  get: function get() {
    return _resize.resizeSectionByteSize;
  }
});
Object.defineProperty(exports, "resizeSectionVecSize", {
  enumerable: true,
  get: function get() {
    return _resize.resizeSectionVecSize;
  }
});
Object.defineProperty(exports, "createEmptySection", {
  enumerable: true,
  get: function get() {
    return _create.createEmptySection;
  }
});
Object.defineProperty(exports, "removeSections", {
  enumerable: true,
  get: function get() {
    return _remove.removeSections;
  }
});

var _resize = require("./resize");

var _create = require("./create");

var _remove = require("./remove");
}, function(modId) {var map = {"./resize":1645497392656,"./create":1645497392657,"./remove":1645497392658}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497392656, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resizeSectionByteSize = resizeSectionByteSize;
exports.resizeSectionVecSize = resizeSectionVecSize;

var _wasmGen = require("@webassemblyjs/wasm-gen");

var _ast = require("@webassemblyjs/ast");

var _helperBuffer = require("@webassemblyjs/helper-buffer");

function resizeSectionByteSize(ast, uint8Buffer, section, deltaBytes) {
  var sectionMetadata = (0, _ast.getSectionMetadata)(ast, section);

  if (typeof sectionMetadata === "undefined") {
    throw new Error("Section metadata not found");
  }

  if (typeof sectionMetadata.size.loc === "undefined") {
    throw new Error("SectionMetadata " + section + " has no loc");
  } // keep old node location to be overriden


  var start = sectionMetadata.size.loc.start.column;
  var end = sectionMetadata.size.loc.end.column;
  var newSectionSize = sectionMetadata.size.value + deltaBytes;
  var newBytes = (0, _wasmGen.encodeU32)(newSectionSize);
  /**
   * update AST
   */

  sectionMetadata.size.value = newSectionSize;
  var oldu32EncodedLen = end - start;
  var newu32EncodedLen = newBytes.length; // the new u32 has a different encoded length

  if (newu32EncodedLen !== oldu32EncodedLen) {
    var deltaInSizeEncoding = newu32EncodedLen - oldu32EncodedLen;
    sectionMetadata.size.loc.end.column = start + newu32EncodedLen;
    deltaBytes += deltaInSizeEncoding; // move the vec size pointer size the section size is now smaller

    sectionMetadata.vectorOfSize.loc.start.column += deltaInSizeEncoding;
    sectionMetadata.vectorOfSize.loc.end.column += deltaInSizeEncoding;
  } // Once we hit our section every that is after needs to be shifted by the delta


  var encounteredSection = false;
  (0, _ast.traverse)(ast, {
    SectionMetadata: function SectionMetadata(path) {
      if (path.node.section === section) {
        encounteredSection = true;
        return;
      }

      if (encounteredSection === true) {
        (0, _ast.shiftSection)(ast, path.node, deltaBytes);
      }
    }
  });
  return (0, _helperBuffer.overrideBytesInBuffer)(uint8Buffer, start, end, newBytes);
}

function resizeSectionVecSize(ast, uint8Buffer, section, deltaElements) {
  var sectionMetadata = (0, _ast.getSectionMetadata)(ast, section);

  if (typeof sectionMetadata === "undefined") {
    throw new Error("Section metadata not found");
  }

  if (typeof sectionMetadata.vectorOfSize.loc === "undefined") {
    throw new Error("SectionMetadata " + section + " has no loc");
  } // Section has no vector


  if (sectionMetadata.vectorOfSize.value === -1) {
    return uint8Buffer;
  } // keep old node location to be overriden


  var start = sectionMetadata.vectorOfSize.loc.start.column;
  var end = sectionMetadata.vectorOfSize.loc.end.column;
  var newValue = sectionMetadata.vectorOfSize.value + deltaElements;
  var newBytes = (0, _wasmGen.encodeU32)(newValue); // Update AST

  sectionMetadata.vectorOfSize.value = newValue;
  sectionMetadata.vectorOfSize.loc.end.column = start + newBytes.length;
  return (0, _helperBuffer.overrideBytesInBuffer)(uint8Buffer, start, end, newBytes);
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497392657, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEmptySection = createEmptySection;

var _wasmGen = require("@webassemblyjs/wasm-gen");

var _helperBuffer = require("@webassemblyjs/helper-buffer");

var _helperWasmBytecode = _interopRequireDefault(require("@webassemblyjs/helper-wasm-bytecode"));

var t = _interopRequireWildcard(require("@webassemblyjs/ast"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function findLastSection(ast, forSection) {
  var targetSectionId = _helperWasmBytecode.default.sections[forSection]; // $FlowIgnore: metadata can not be empty

  var moduleSections = ast.body[0].metadata.sections;
  var lastSection;
  var lastId = 0;

  for (var i = 0, len = moduleSections.length; i < len; i++) {
    var section = moduleSections[i]; // Ignore custom section since they can actually occur everywhere

    if (section.section === "custom") {
      continue;
    }

    var sectionId = _helperWasmBytecode.default.sections[section.section];

    if (targetSectionId > lastId && targetSectionId < sectionId) {
      return lastSection;
    }

    lastId = sectionId;
    lastSection = section;
  }

  return lastSection;
}

function createEmptySection(ast, uint8Buffer, section) {
  // previous section after which we are going to insert our section
  var lastSection = findLastSection(ast, section);
  var start, end;
  /**
   * It's the first section
   */

  if (lastSection == null || lastSection.section === "custom") {
    start = 8
    /* wasm header size */
    ;
    end = start;
  } else {
    start = lastSection.startOffset + lastSection.size.value + 1;
    end = start;
  } // section id


  start += 1;
  var sizeStartLoc = {
    line: -1,
    column: start
  };
  var sizeEndLoc = {
    line: -1,
    column: start + 1
  }; // 1 byte for the empty vector

  var size = t.withLoc(t.numberLiteralFromRaw(1), sizeEndLoc, sizeStartLoc);
  var vectorOfSizeStartLoc = {
    line: -1,
    column: sizeEndLoc.column
  };
  var vectorOfSizeEndLoc = {
    line: -1,
    column: sizeEndLoc.column + 1
  };
  var vectorOfSize = t.withLoc(t.numberLiteralFromRaw(0), vectorOfSizeEndLoc, vectorOfSizeStartLoc);
  var sectionMetadata = t.sectionMetadata(section, start, size, vectorOfSize);
  var sectionBytes = (0, _wasmGen.encodeNode)(sectionMetadata);
  uint8Buffer = (0, _helperBuffer.overrideBytesInBuffer)(uint8Buffer, start - 1, end, sectionBytes); // Add section into the AST for later lookups

  if (_typeof(ast.body[0].metadata) === "object") {
    // $FlowIgnore: metadata can not be empty
    ast.body[0].metadata.sections.push(sectionMetadata);
    t.sortSectionMetadata(ast.body[0]);
  }
  /**
   * Update AST
   */
  // Once we hit our section every that is after needs to be shifted by the delta


  var deltaBytes = +sectionBytes.length;
  var encounteredSection = false;
  t.traverse(ast, {
    SectionMetadata: function SectionMetadata(path) {
      if (path.node.section === section) {
        encounteredSection = true;
        return;
      }

      if (encounteredSection === true) {
        t.shiftSection(ast, path.node, deltaBytes);
      }
    }
  });
  return {
    uint8Buffer: uint8Buffer,
    sectionMetadata: sectionMetadata
  };
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497392658, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeSections = removeSections;

var _ast = require("@webassemblyjs/ast");

var _helperBuffer = require("@webassemblyjs/helper-buffer");

function removeSections(ast, uint8Buffer, section) {
  var sectionMetadatas = (0, _ast.getSectionMetadatas)(ast, section);

  if (sectionMetadatas.length === 0) {
    throw new Error("Section metadata not found");
  }

  return sectionMetadatas.reverse().reduce(function (uint8Buffer, sectionMetadata) {
    var startsIncludingId = sectionMetadata.startOffset - 1;
    var ends = section === "start" ? sectionMetadata.size.loc.end.column + 1 : sectionMetadata.startOffset + sectionMetadata.size.value + 1;
    var delta = -(ends - startsIncludingId);
    /**
     * update AST
     */
    // Once we hit our section every that is after needs to be shifted by the delta

    var encounteredSection = false;
    (0, _ast.traverse)(ast, {
      SectionMetadata: function SectionMetadata(path) {
        if (path.node.section === section) {
          encounteredSection = true;
          return path.remove();
        }

        if (encounteredSection === true) {
          (0, _ast.shiftSection)(ast, path.node, delta);
        }
      }
    }); // replacement is nothing

    var replacement = [];
    return (0, _helperBuffer.overrideBytesInBuffer)(uint8Buffer, startsIncludingId, ends, replacement);
  }, uint8Buffer);
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1645497392655);
})()
//miniprogram-npm-outsideDeps=["@webassemblyjs/wasm-gen","@webassemblyjs/ast","@webassemblyjs/helper-buffer","@webassemblyjs/helper-wasm-bytecode"]
//# sourceMappingURL=index.js.map