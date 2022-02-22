module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1645497392640, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  numberLiteralFromRaw: true,
  withLoc: true,
  withRaw: true,
  funcParam: true,
  indexLiteral: true,
  memIndexLiteral: true,
  instruction: true,
  objectInstruction: true,
  traverse: true,
  signatures: true,
  cloneNode: true,
  moduleContextFromModuleAST: true
};
Object.defineProperty(exports, "numberLiteralFromRaw", {
  enumerable: true,
  get: function get() {
    return _nodeHelpers.numberLiteralFromRaw;
  }
});
Object.defineProperty(exports, "withLoc", {
  enumerable: true,
  get: function get() {
    return _nodeHelpers.withLoc;
  }
});
Object.defineProperty(exports, "withRaw", {
  enumerable: true,
  get: function get() {
    return _nodeHelpers.withRaw;
  }
});
Object.defineProperty(exports, "funcParam", {
  enumerable: true,
  get: function get() {
    return _nodeHelpers.funcParam;
  }
});
Object.defineProperty(exports, "indexLiteral", {
  enumerable: true,
  get: function get() {
    return _nodeHelpers.indexLiteral;
  }
});
Object.defineProperty(exports, "memIndexLiteral", {
  enumerable: true,
  get: function get() {
    return _nodeHelpers.memIndexLiteral;
  }
});
Object.defineProperty(exports, "instruction", {
  enumerable: true,
  get: function get() {
    return _nodeHelpers.instruction;
  }
});
Object.defineProperty(exports, "objectInstruction", {
  enumerable: true,
  get: function get() {
    return _nodeHelpers.objectInstruction;
  }
});
Object.defineProperty(exports, "traverse", {
  enumerable: true,
  get: function get() {
    return _traverse.traverse;
  }
});
Object.defineProperty(exports, "signatures", {
  enumerable: true,
  get: function get() {
    return _signatures.signatures;
  }
});
Object.defineProperty(exports, "cloneNode", {
  enumerable: true,
  get: function get() {
    return _clone.cloneNode;
  }
});
Object.defineProperty(exports, "moduleContextFromModuleAST", {
  enumerable: true,
  get: function get() {
    return _astModuleToModuleContext.moduleContextFromModuleAST;
  }
});

var _nodes = require("./nodes");

Object.keys(_nodes).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _nodes[key];
    }
  });
});

var _nodeHelpers = require("./node-helpers.js");

var _traverse = require("./traverse");

var _signatures = require("./signatures");

var _utils = require("./utils");

Object.keys(_utils).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _utils[key];
    }
  });
});

var _clone = require("./clone");

var _astModuleToModuleContext = require("./transform/ast-module-to-module-context");
}, function(modId) {var map = {"./nodes":1645497392641,"./node-helpers.js":1645497392642,"./traverse":1645497392643,"./signatures":1645497392645,"./utils":1645497392646,"./clone":1645497392647,"./transform/ast-module-to-module-context":1645497392648}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497392641, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.module = _module;
exports.moduleMetadata = moduleMetadata;
exports.moduleNameMetadata = moduleNameMetadata;
exports.functionNameMetadata = functionNameMetadata;
exports.localNameMetadata = localNameMetadata;
exports.binaryModule = binaryModule;
exports.quoteModule = quoteModule;
exports.sectionMetadata = sectionMetadata;
exports.producersSectionMetadata = producersSectionMetadata;
exports.producerMetadata = producerMetadata;
exports.producerMetadataVersionedName = producerMetadataVersionedName;
exports.loopInstruction = loopInstruction;
exports.instr = instr;
exports.ifInstruction = ifInstruction;
exports.stringLiteral = stringLiteral;
exports.numberLiteral = numberLiteral;
exports.longNumberLiteral = longNumberLiteral;
exports.floatLiteral = floatLiteral;
exports.elem = elem;
exports.indexInFuncSection = indexInFuncSection;
exports.valtypeLiteral = valtypeLiteral;
exports.typeInstruction = typeInstruction;
exports.start = start;
exports.globalType = globalType;
exports.leadingComment = leadingComment;
exports.blockComment = blockComment;
exports.data = data;
exports.global = global;
exports.table = table;
exports.memory = memory;
exports.funcImportDescr = funcImportDescr;
exports.moduleImport = moduleImport;
exports.moduleExportDescr = moduleExportDescr;
exports.moduleExport = moduleExport;
exports.limit = limit;
exports.signature = signature;
exports.program = program;
exports.identifier = identifier;
exports.blockInstruction = blockInstruction;
exports.callInstruction = callInstruction;
exports.callIndirectInstruction = callIndirectInstruction;
exports.byteArray = byteArray;
exports.func = func;
exports.internalBrUnless = internalBrUnless;
exports.internalGoto = internalGoto;
exports.internalCallExtern = internalCallExtern;
exports.internalEndAndReturn = internalEndAndReturn;
exports.assertInternalCallExtern = exports.assertInternalGoto = exports.assertInternalBrUnless = exports.assertFunc = exports.assertByteArray = exports.assertCallIndirectInstruction = exports.assertCallInstruction = exports.assertBlockInstruction = exports.assertIdentifier = exports.assertProgram = exports.assertSignature = exports.assertLimit = exports.assertModuleExport = exports.assertModuleExportDescr = exports.assertModuleImport = exports.assertFuncImportDescr = exports.assertMemory = exports.assertTable = exports.assertGlobal = exports.assertData = exports.assertBlockComment = exports.assertLeadingComment = exports.assertGlobalType = exports.assertStart = exports.assertTypeInstruction = exports.assertValtypeLiteral = exports.assertIndexInFuncSection = exports.assertElem = exports.assertFloatLiteral = exports.assertLongNumberLiteral = exports.assertNumberLiteral = exports.assertStringLiteral = exports.assertIfInstruction = exports.assertInstr = exports.assertLoopInstruction = exports.assertProducerMetadataVersionedName = exports.assertProducerMetadata = exports.assertProducersSectionMetadata = exports.assertSectionMetadata = exports.assertQuoteModule = exports.assertBinaryModule = exports.assertLocalNameMetadata = exports.assertFunctionNameMetadata = exports.assertModuleNameMetadata = exports.assertModuleMetadata = exports.assertModule = exports.isIntrinsic = exports.isImportDescr = exports.isNumericLiteral = exports.isExpression = exports.isInstruction = exports.isBlock = exports.isNode = exports.isInternalEndAndReturn = exports.isInternalCallExtern = exports.isInternalGoto = exports.isInternalBrUnless = exports.isFunc = exports.isByteArray = exports.isCallIndirectInstruction = exports.isCallInstruction = exports.isBlockInstruction = exports.isIdentifier = exports.isProgram = exports.isSignature = exports.isLimit = exports.isModuleExport = exports.isModuleExportDescr = exports.isModuleImport = exports.isFuncImportDescr = exports.isMemory = exports.isTable = exports.isGlobal = exports.isData = exports.isBlockComment = exports.isLeadingComment = exports.isGlobalType = exports.isStart = exports.isTypeInstruction = exports.isValtypeLiteral = exports.isIndexInFuncSection = exports.isElem = exports.isFloatLiteral = exports.isLongNumberLiteral = exports.isNumberLiteral = exports.isStringLiteral = exports.isIfInstruction = exports.isInstr = exports.isLoopInstruction = exports.isProducerMetadataVersionedName = exports.isProducerMetadata = exports.isProducersSectionMetadata = exports.isSectionMetadata = exports.isQuoteModule = exports.isBinaryModule = exports.isLocalNameMetadata = exports.isFunctionNameMetadata = exports.isModuleNameMetadata = exports.isModuleMetadata = exports.isModule = void 0;
exports.nodeAndUnionTypes = exports.unionTypesMap = exports.assertInternalEndAndReturn = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

// THIS FILE IS AUTOGENERATED
// see scripts/generateNodeUtils.js
function isTypeOf(t) {
  return function (n) {
    return n.type === t;
  };
}

function assertTypeOf(t) {
  return function (n) {
    return function () {
      if (!(n.type === t)) {
        throw new Error('n.type === t' + " error: " + (undefined || "unknown"));
      }
    }();
  };
}

function _module(id, fields, metadata) {
  if (id !== null && id !== undefined) {
    if (!(typeof id === "string")) {
      throw new Error('typeof id === "string"' + " error: " + ("Argument id must be of type string, given: " + _typeof(id) || "unknown"));
    }
  }

  if (!(_typeof(fields) === "object" && typeof fields.length !== "undefined")) {
    throw new Error('typeof fields === "object" && typeof fields.length !== "undefined"' + " error: " + (undefined || "unknown"));
  }

  var node = {
    type: "Module",
    id: id,
    fields: fields
  };

  if (typeof metadata !== "undefined") {
    node.metadata = metadata;
  }

  return node;
}

function moduleMetadata(sections, functionNames, localNames, producers) {
  if (!(_typeof(sections) === "object" && typeof sections.length !== "undefined")) {
    throw new Error('typeof sections === "object" && typeof sections.length !== "undefined"' + " error: " + (undefined || "unknown"));
  }

  if (functionNames !== null && functionNames !== undefined) {
    if (!(_typeof(functionNames) === "object" && typeof functionNames.length !== "undefined")) {
      throw new Error('typeof functionNames === "object" && typeof functionNames.length !== "undefined"' + " error: " + (undefined || "unknown"));
    }
  }

  if (localNames !== null && localNames !== undefined) {
    if (!(_typeof(localNames) === "object" && typeof localNames.length !== "undefined")) {
      throw new Error('typeof localNames === "object" && typeof localNames.length !== "undefined"' + " error: " + (undefined || "unknown"));
    }
  }

  if (producers !== null && producers !== undefined) {
    if (!(_typeof(producers) === "object" && typeof producers.length !== "undefined")) {
      throw new Error('typeof producers === "object" && typeof producers.length !== "undefined"' + " error: " + (undefined || "unknown"));
    }
  }

  var node = {
    type: "ModuleMetadata",
    sections: sections
  };

  if (typeof functionNames !== "undefined" && functionNames.length > 0) {
    node.functionNames = functionNames;
  }

  if (typeof localNames !== "undefined" && localNames.length > 0) {
    node.localNames = localNames;
  }

  if (typeof producers !== "undefined" && producers.length > 0) {
    node.producers = producers;
  }

  return node;
}

function moduleNameMetadata(value) {
  if (!(typeof value === "string")) {
    throw new Error('typeof value === "string"' + " error: " + ("Argument value must be of type string, given: " + _typeof(value) || "unknown"));
  }

  var node = {
    type: "ModuleNameMetadata",
    value: value
  };
  return node;
}

function functionNameMetadata(value, index) {
  if (!(typeof value === "string")) {
    throw new Error('typeof value === "string"' + " error: " + ("Argument value must be of type string, given: " + _typeof(value) || "unknown"));
  }

  if (!(typeof index === "number")) {
    throw new Error('typeof index === "number"' + " error: " + ("Argument index must be of type number, given: " + _typeof(index) || "unknown"));
  }

  var node = {
    type: "FunctionNameMetadata",
    value: value,
    index: index
  };
  return node;
}

function localNameMetadata(value, localIndex, functionIndex) {
  if (!(typeof value === "string")) {
    throw new Error('typeof value === "string"' + " error: " + ("Argument value must be of type string, given: " + _typeof(value) || "unknown"));
  }

  if (!(typeof localIndex === "number")) {
    throw new Error('typeof localIndex === "number"' + " error: " + ("Argument localIndex must be of type number, given: " + _typeof(localIndex) || "unknown"));
  }

  if (!(typeof functionIndex === "number")) {
    throw new Error('typeof functionIndex === "number"' + " error: " + ("Argument functionIndex must be of type number, given: " + _typeof(functionIndex) || "unknown"));
  }

  var node = {
    type: "LocalNameMetadata",
    value: value,
    localIndex: localIndex,
    functionIndex: functionIndex
  };
  return node;
}

function binaryModule(id, blob) {
  if (id !== null && id !== undefined) {
    if (!(typeof id === "string")) {
      throw new Error('typeof id === "string"' + " error: " + ("Argument id must be of type string, given: " + _typeof(id) || "unknown"));
    }
  }

  if (!(_typeof(blob) === "object" && typeof blob.length !== "undefined")) {
    throw new Error('typeof blob === "object" && typeof blob.length !== "undefined"' + " error: " + (undefined || "unknown"));
  }

  var node = {
    type: "BinaryModule",
    id: id,
    blob: blob
  };
  return node;
}

function quoteModule(id, string) {
  if (id !== null && id !== undefined) {
    if (!(typeof id === "string")) {
      throw new Error('typeof id === "string"' + " error: " + ("Argument id must be of type string, given: " + _typeof(id) || "unknown"));
    }
  }

  if (!(_typeof(string) === "object" && typeof string.length !== "undefined")) {
    throw new Error('typeof string === "object" && typeof string.length !== "undefined"' + " error: " + (undefined || "unknown"));
  }

  var node = {
    type: "QuoteModule",
    id: id,
    string: string
  };
  return node;
}

function sectionMetadata(section, startOffset, size, vectorOfSize) {
  if (!(typeof startOffset === "number")) {
    throw new Error('typeof startOffset === "number"' + " error: " + ("Argument startOffset must be of type number, given: " + _typeof(startOffset) || "unknown"));
  }

  var node = {
    type: "SectionMetadata",
    section: section,
    startOffset: startOffset,
    size: size,
    vectorOfSize: vectorOfSize
  };
  return node;
}

function producersSectionMetadata(producers) {
  if (!(_typeof(producers) === "object" && typeof producers.length !== "undefined")) {
    throw new Error('typeof producers === "object" && typeof producers.length !== "undefined"' + " error: " + (undefined || "unknown"));
  }

  var node = {
    type: "ProducersSectionMetadata",
    producers: producers
  };
  return node;
}

function producerMetadata(language, processedBy, sdk) {
  if (!(_typeof(language) === "object" && typeof language.length !== "undefined")) {
    throw new Error('typeof language === "object" && typeof language.length !== "undefined"' + " error: " + (undefined || "unknown"));
  }

  if (!(_typeof(processedBy) === "object" && typeof processedBy.length !== "undefined")) {
    throw new Error('typeof processedBy === "object" && typeof processedBy.length !== "undefined"' + " error: " + (undefined || "unknown"));
  }

  if (!(_typeof(sdk) === "object" && typeof sdk.length !== "undefined")) {
    throw new Error('typeof sdk === "object" && typeof sdk.length !== "undefined"' + " error: " + (undefined || "unknown"));
  }

  var node = {
    type: "ProducerMetadata",
    language: language,
    processedBy: processedBy,
    sdk: sdk
  };
  return node;
}

function producerMetadataVersionedName(name, version) {
  if (!(typeof name === "string")) {
    throw new Error('typeof name === "string"' + " error: " + ("Argument name must be of type string, given: " + _typeof(name) || "unknown"));
  }

  if (!(typeof version === "string")) {
    throw new Error('typeof version === "string"' + " error: " + ("Argument version must be of type string, given: " + _typeof(version) || "unknown"));
  }

  var node = {
    type: "ProducerMetadataVersionedName",
    name: name,
    version: version
  };
  return node;
}

function loopInstruction(label, resulttype, instr) {
  if (!(_typeof(instr) === "object" && typeof instr.length !== "undefined")) {
    throw new Error('typeof instr === "object" && typeof instr.length !== "undefined"' + " error: " + (undefined || "unknown"));
  }

  var node = {
    type: "LoopInstruction",
    id: "loop",
    label: label,
    resulttype: resulttype,
    instr: instr
  };
  return node;
}

function instr(id, object, args, namedArgs) {
  if (!(typeof id === "string")) {
    throw new Error('typeof id === "string"' + " error: " + ("Argument id must be of type string, given: " + _typeof(id) || "unknown"));
  }

  if (!(_typeof(args) === "object" && typeof args.length !== "undefined")) {
    throw new Error('typeof args === "object" && typeof args.length !== "undefined"' + " error: " + (undefined || "unknown"));
  }

  var node = {
    type: "Instr",
    id: id,
    args: args
  };

  if (typeof object !== "undefined") {
    node.object = object;
  }

  if (typeof namedArgs !== "undefined" && Object.keys(namedArgs).length !== 0) {
    node.namedArgs = namedArgs;
  }

  return node;
}

function ifInstruction(testLabel, test, result, consequent, alternate) {
  if (!(_typeof(test) === "object" && typeof test.length !== "undefined")) {
    throw new Error('typeof test === "object" && typeof test.length !== "undefined"' + " error: " + (undefined || "unknown"));
  }

  if (!(_typeof(consequent) === "object" && typeof consequent.length !== "undefined")) {
    throw new Error('typeof consequent === "object" && typeof consequent.length !== "undefined"' + " error: " + (undefined || "unknown"));
  }

  if (!(_typeof(alternate) === "object" && typeof alternate.length !== "undefined")) {
    throw new Error('typeof alternate === "object" && typeof alternate.length !== "undefined"' + " error: " + (undefined || "unknown"));
  }

  var node = {
    type: "IfInstruction",
    id: "if",
    testLabel: testLabel,
    test: test,
    result: result,
    consequent: consequent,
    alternate: alternate
  };
  return node;
}

function stringLiteral(value) {
  if (!(typeof value === "string")) {
    throw new Error('typeof value === "string"' + " error: " + ("Argument value must be of type string, given: " + _typeof(value) || "unknown"));
  }

  var node = {
    type: "StringLiteral",
    value: value
  };
  return node;
}

function numberLiteral(value, raw) {
  if (!(typeof value === "number")) {
    throw new Error('typeof value === "number"' + " error: " + ("Argument value must be of type number, given: " + _typeof(value) || "unknown"));
  }

  if (!(typeof raw === "string")) {
    throw new Error('typeof raw === "string"' + " error: " + ("Argument raw must be of type string, given: " + _typeof(raw) || "unknown"));
  }

  var node = {
    type: "NumberLiteral",
    value: value,
    raw: raw
  };
  return node;
}

function longNumberLiteral(value, raw) {
  if (!(typeof raw === "string")) {
    throw new Error('typeof raw === "string"' + " error: " + ("Argument raw must be of type string, given: " + _typeof(raw) || "unknown"));
  }

  var node = {
    type: "LongNumberLiteral",
    value: value,
    raw: raw
  };
  return node;
}

function floatLiteral(value, nan, inf, raw) {
  if (!(typeof value === "number")) {
    throw new Error('typeof value === "number"' + " error: " + ("Argument value must be of type number, given: " + _typeof(value) || "unknown"));
  }

  if (nan !== null && nan !== undefined) {
    if (!(typeof nan === "boolean")) {
      throw new Error('typeof nan === "boolean"' + " error: " + ("Argument nan must be of type boolean, given: " + _typeof(nan) || "unknown"));
    }
  }

  if (inf !== null && inf !== undefined) {
    if (!(typeof inf === "boolean")) {
      throw new Error('typeof inf === "boolean"' + " error: " + ("Argument inf must be of type boolean, given: " + _typeof(inf) || "unknown"));
    }
  }

  if (!(typeof raw === "string")) {
    throw new Error('typeof raw === "string"' + " error: " + ("Argument raw must be of type string, given: " + _typeof(raw) || "unknown"));
  }

  var node = {
    type: "FloatLiteral",
    value: value,
    raw: raw
  };

  if (nan === true) {
    node.nan = true;
  }

  if (inf === true) {
    node.inf = true;
  }

  return node;
}

function elem(table, offset, funcs) {
  if (!(_typeof(offset) === "object" && typeof offset.length !== "undefined")) {
    throw new Error('typeof offset === "object" && typeof offset.length !== "undefined"' + " error: " + (undefined || "unknown"));
  }

  if (!(_typeof(funcs) === "object" && typeof funcs.length !== "undefined")) {
    throw new Error('typeof funcs === "object" && typeof funcs.length !== "undefined"' + " error: " + (undefined || "unknown"));
  }

  var node = {
    type: "Elem",
    table: table,
    offset: offset,
    funcs: funcs
  };
  return node;
}

function indexInFuncSection(index) {
  var node = {
    type: "IndexInFuncSection",
    index: index
  };
  return node;
}

function valtypeLiteral(name) {
  var node = {
    type: "ValtypeLiteral",
    name: name
  };
  return node;
}

function typeInstruction(id, functype) {
  var node = {
    type: "TypeInstruction",
    id: id,
    functype: functype
  };
  return node;
}

function start(index) {
  var node = {
    type: "Start",
    index: index
  };
  return node;
}

function globalType(valtype, mutability) {
  var node = {
    type: "GlobalType",
    valtype: valtype,
    mutability: mutability
  };
  return node;
}

function leadingComment(value) {
  if (!(typeof value === "string")) {
    throw new Error('typeof value === "string"' + " error: " + ("Argument value must be of type string, given: " + _typeof(value) || "unknown"));
  }

  var node = {
    type: "LeadingComment",
    value: value
  };
  return node;
}

function blockComment(value) {
  if (!(typeof value === "string")) {
    throw new Error('typeof value === "string"' + " error: " + ("Argument value must be of type string, given: " + _typeof(value) || "unknown"));
  }

  var node = {
    type: "BlockComment",
    value: value
  };
  return node;
}

function data(memoryIndex, offset, init) {
  var node = {
    type: "Data",
    memoryIndex: memoryIndex,
    offset: offset,
    init: init
  };
  return node;
}

function global(globalType, init, name) {
  if (!(_typeof(init) === "object" && typeof init.length !== "undefined")) {
    throw new Error('typeof init === "object" && typeof init.length !== "undefined"' + " error: " + (undefined || "unknown"));
  }

  var node = {
    type: "Global",
    globalType: globalType,
    init: init,
    name: name
  };
  return node;
}

function table(elementType, limits, name, elements) {
  if (!(limits.type === "Limit")) {
    throw new Error('limits.type === "Limit"' + " error: " + ("Argument limits must be of type Limit, given: " + limits.type || "unknown"));
  }

  if (elements !== null && elements !== undefined) {
    if (!(_typeof(elements) === "object" && typeof elements.length !== "undefined")) {
      throw new Error('typeof elements === "object" && typeof elements.length !== "undefined"' + " error: " + (undefined || "unknown"));
    }
  }

  var node = {
    type: "Table",
    elementType: elementType,
    limits: limits,
    name: name
  };

  if (typeof elements !== "undefined" && elements.length > 0) {
    node.elements = elements;
  }

  return node;
}

function memory(limits, id) {
  var node = {
    type: "Memory",
    limits: limits,
    id: id
  };
  return node;
}

function funcImportDescr(id, signature) {
  var node = {
    type: "FuncImportDescr",
    id: id,
    signature: signature
  };
  return node;
}

function moduleImport(module, name, descr) {
  if (!(typeof module === "string")) {
    throw new Error('typeof module === "string"' + " error: " + ("Argument module must be of type string, given: " + _typeof(module) || "unknown"));
  }

  if (!(typeof name === "string")) {
    throw new Error('typeof name === "string"' + " error: " + ("Argument name must be of type string, given: " + _typeof(name) || "unknown"));
  }

  var node = {
    type: "ModuleImport",
    module: module,
    name: name,
    descr: descr
  };
  return node;
}

function moduleExportDescr(exportType, id) {
  var node = {
    type: "ModuleExportDescr",
    exportType: exportType,
    id: id
  };
  return node;
}

function moduleExport(name, descr) {
  if (!(typeof name === "string")) {
    throw new Error('typeof name === "string"' + " error: " + ("Argument name must be of type string, given: " + _typeof(name) || "unknown"));
  }

  var node = {
    type: "ModuleExport",
    name: name,
    descr: descr
  };
  return node;
}

function limit(min, max, shared) {
  if (!(typeof min === "number")) {
    throw new Error('typeof min === "number"' + " error: " + ("Argument min must be of type number, given: " + _typeof(min) || "unknown"));
  }

  if (max !== null && max !== undefined) {
    if (!(typeof max === "number")) {
      throw new Error('typeof max === "number"' + " error: " + ("Argument max must be of type number, given: " + _typeof(max) || "unknown"));
    }
  }

  if (shared !== null && shared !== undefined) {
    if (!(typeof shared === "boolean")) {
      throw new Error('typeof shared === "boolean"' + " error: " + ("Argument shared must be of type boolean, given: " + _typeof(shared) || "unknown"));
    }
  }

  var node = {
    type: "Limit",
    min: min
  };

  if (typeof max !== "undefined") {
    node.max = max;
  }

  if (shared === true) {
    node.shared = true;
  }

  return node;
}

function signature(params, results) {
  if (!(_typeof(params) === "object" && typeof params.length !== "undefined")) {
    throw new Error('typeof params === "object" && typeof params.length !== "undefined"' + " error: " + (undefined || "unknown"));
  }

  if (!(_typeof(results) === "object" && typeof results.length !== "undefined")) {
    throw new Error('typeof results === "object" && typeof results.length !== "undefined"' + " error: " + (undefined || "unknown"));
  }

  var node = {
    type: "Signature",
    params: params,
    results: results
  };
  return node;
}

function program(body) {
  if (!(_typeof(body) === "object" && typeof body.length !== "undefined")) {
    throw new Error('typeof body === "object" && typeof body.length !== "undefined"' + " error: " + (undefined || "unknown"));
  }

  var node = {
    type: "Program",
    body: body
  };
  return node;
}

function identifier(value, raw) {
  if (!(typeof value === "string")) {
    throw new Error('typeof value === "string"' + " error: " + ("Argument value must be of type string, given: " + _typeof(value) || "unknown"));
  }

  if (raw !== null && raw !== undefined) {
    if (!(typeof raw === "string")) {
      throw new Error('typeof raw === "string"' + " error: " + ("Argument raw must be of type string, given: " + _typeof(raw) || "unknown"));
    }
  }

  var node = {
    type: "Identifier",
    value: value
  };

  if (typeof raw !== "undefined") {
    node.raw = raw;
  }

  return node;
}

function blockInstruction(label, instr, result) {
  if (!(_typeof(instr) === "object" && typeof instr.length !== "undefined")) {
    throw new Error('typeof instr === "object" && typeof instr.length !== "undefined"' + " error: " + (undefined || "unknown"));
  }

  var node = {
    type: "BlockInstruction",
    id: "block",
    label: label,
    instr: instr,
    result: result
  };
  return node;
}

function callInstruction(index, instrArgs, numeric) {
  if (instrArgs !== null && instrArgs !== undefined) {
    if (!(_typeof(instrArgs) === "object" && typeof instrArgs.length !== "undefined")) {
      throw new Error('typeof instrArgs === "object" && typeof instrArgs.length !== "undefined"' + " error: " + (undefined || "unknown"));
    }
  }

  var node = {
    type: "CallInstruction",
    id: "call",
    index: index
  };

  if (typeof instrArgs !== "undefined" && instrArgs.length > 0) {
    node.instrArgs = instrArgs;
  }

  if (typeof numeric !== "undefined") {
    node.numeric = numeric;
  }

  return node;
}

function callIndirectInstruction(signature, intrs) {
  if (intrs !== null && intrs !== undefined) {
    if (!(_typeof(intrs) === "object" && typeof intrs.length !== "undefined")) {
      throw new Error('typeof intrs === "object" && typeof intrs.length !== "undefined"' + " error: " + (undefined || "unknown"));
    }
  }

  var node = {
    type: "CallIndirectInstruction",
    id: "call_indirect",
    signature: signature
  };

  if (typeof intrs !== "undefined" && intrs.length > 0) {
    node.intrs = intrs;
  }

  return node;
}

function byteArray(values) {
  if (!(_typeof(values) === "object" && typeof values.length !== "undefined")) {
    throw new Error('typeof values === "object" && typeof values.length !== "undefined"' + " error: " + (undefined || "unknown"));
  }

  var node = {
    type: "ByteArray",
    values: values
  };
  return node;
}

function func(name, signature, body, isExternal, metadata) {
  if (!(_typeof(body) === "object" && typeof body.length !== "undefined")) {
    throw new Error('typeof body === "object" && typeof body.length !== "undefined"' + " error: " + (undefined || "unknown"));
  }

  if (isExternal !== null && isExternal !== undefined) {
    if (!(typeof isExternal === "boolean")) {
      throw new Error('typeof isExternal === "boolean"' + " error: " + ("Argument isExternal must be of type boolean, given: " + _typeof(isExternal) || "unknown"));
    }
  }

  var node = {
    type: "Func",
    name: name,
    signature: signature,
    body: body
  };

  if (isExternal === true) {
    node.isExternal = true;
  }

  if (typeof metadata !== "undefined") {
    node.metadata = metadata;
  }

  return node;
}

function internalBrUnless(target) {
  if (!(typeof target === "number")) {
    throw new Error('typeof target === "number"' + " error: " + ("Argument target must be of type number, given: " + _typeof(target) || "unknown"));
  }

  var node = {
    type: "InternalBrUnless",
    target: target
  };
  return node;
}

function internalGoto(target) {
  if (!(typeof target === "number")) {
    throw new Error('typeof target === "number"' + " error: " + ("Argument target must be of type number, given: " + _typeof(target) || "unknown"));
  }

  var node = {
    type: "InternalGoto",
    target: target
  };
  return node;
}

function internalCallExtern(target) {
  if (!(typeof target === "number")) {
    throw new Error('typeof target === "number"' + " error: " + ("Argument target must be of type number, given: " + _typeof(target) || "unknown"));
  }

  var node = {
    type: "InternalCallExtern",
    target: target
  };
  return node;
}

function internalEndAndReturn() {
  var node = {
    type: "InternalEndAndReturn"
  };
  return node;
}

var isModule = isTypeOf("Module");
exports.isModule = isModule;
var isModuleMetadata = isTypeOf("ModuleMetadata");
exports.isModuleMetadata = isModuleMetadata;
var isModuleNameMetadata = isTypeOf("ModuleNameMetadata");
exports.isModuleNameMetadata = isModuleNameMetadata;
var isFunctionNameMetadata = isTypeOf("FunctionNameMetadata");
exports.isFunctionNameMetadata = isFunctionNameMetadata;
var isLocalNameMetadata = isTypeOf("LocalNameMetadata");
exports.isLocalNameMetadata = isLocalNameMetadata;
var isBinaryModule = isTypeOf("BinaryModule");
exports.isBinaryModule = isBinaryModule;
var isQuoteModule = isTypeOf("QuoteModule");
exports.isQuoteModule = isQuoteModule;
var isSectionMetadata = isTypeOf("SectionMetadata");
exports.isSectionMetadata = isSectionMetadata;
var isProducersSectionMetadata = isTypeOf("ProducersSectionMetadata");
exports.isProducersSectionMetadata = isProducersSectionMetadata;
var isProducerMetadata = isTypeOf("ProducerMetadata");
exports.isProducerMetadata = isProducerMetadata;
var isProducerMetadataVersionedName = isTypeOf("ProducerMetadataVersionedName");
exports.isProducerMetadataVersionedName = isProducerMetadataVersionedName;
var isLoopInstruction = isTypeOf("LoopInstruction");
exports.isLoopInstruction = isLoopInstruction;
var isInstr = isTypeOf("Instr");
exports.isInstr = isInstr;
var isIfInstruction = isTypeOf("IfInstruction");
exports.isIfInstruction = isIfInstruction;
var isStringLiteral = isTypeOf("StringLiteral");
exports.isStringLiteral = isStringLiteral;
var isNumberLiteral = isTypeOf("NumberLiteral");
exports.isNumberLiteral = isNumberLiteral;
var isLongNumberLiteral = isTypeOf("LongNumberLiteral");
exports.isLongNumberLiteral = isLongNumberLiteral;
var isFloatLiteral = isTypeOf("FloatLiteral");
exports.isFloatLiteral = isFloatLiteral;
var isElem = isTypeOf("Elem");
exports.isElem = isElem;
var isIndexInFuncSection = isTypeOf("IndexInFuncSection");
exports.isIndexInFuncSection = isIndexInFuncSection;
var isValtypeLiteral = isTypeOf("ValtypeLiteral");
exports.isValtypeLiteral = isValtypeLiteral;
var isTypeInstruction = isTypeOf("TypeInstruction");
exports.isTypeInstruction = isTypeInstruction;
var isStart = isTypeOf("Start");
exports.isStart = isStart;
var isGlobalType = isTypeOf("GlobalType");
exports.isGlobalType = isGlobalType;
var isLeadingComment = isTypeOf("LeadingComment");
exports.isLeadingComment = isLeadingComment;
var isBlockComment = isTypeOf("BlockComment");
exports.isBlockComment = isBlockComment;
var isData = isTypeOf("Data");
exports.isData = isData;
var isGlobal = isTypeOf("Global");
exports.isGlobal = isGlobal;
var isTable = isTypeOf("Table");
exports.isTable = isTable;
var isMemory = isTypeOf("Memory");
exports.isMemory = isMemory;
var isFuncImportDescr = isTypeOf("FuncImportDescr");
exports.isFuncImportDescr = isFuncImportDescr;
var isModuleImport = isTypeOf("ModuleImport");
exports.isModuleImport = isModuleImport;
var isModuleExportDescr = isTypeOf("ModuleExportDescr");
exports.isModuleExportDescr = isModuleExportDescr;
var isModuleExport = isTypeOf("ModuleExport");
exports.isModuleExport = isModuleExport;
var isLimit = isTypeOf("Limit");
exports.isLimit = isLimit;
var isSignature = isTypeOf("Signature");
exports.isSignature = isSignature;
var isProgram = isTypeOf("Program");
exports.isProgram = isProgram;
var isIdentifier = isTypeOf("Identifier");
exports.isIdentifier = isIdentifier;
var isBlockInstruction = isTypeOf("BlockInstruction");
exports.isBlockInstruction = isBlockInstruction;
var isCallInstruction = isTypeOf("CallInstruction");
exports.isCallInstruction = isCallInstruction;
var isCallIndirectInstruction = isTypeOf("CallIndirectInstruction");
exports.isCallIndirectInstruction = isCallIndirectInstruction;
var isByteArray = isTypeOf("ByteArray");
exports.isByteArray = isByteArray;
var isFunc = isTypeOf("Func");
exports.isFunc = isFunc;
var isInternalBrUnless = isTypeOf("InternalBrUnless");
exports.isInternalBrUnless = isInternalBrUnless;
var isInternalGoto = isTypeOf("InternalGoto");
exports.isInternalGoto = isInternalGoto;
var isInternalCallExtern = isTypeOf("InternalCallExtern");
exports.isInternalCallExtern = isInternalCallExtern;
var isInternalEndAndReturn = isTypeOf("InternalEndAndReturn");
exports.isInternalEndAndReturn = isInternalEndAndReturn;

var isNode = function isNode(node) {
  return isModule(node) || isModuleMetadata(node) || isModuleNameMetadata(node) || isFunctionNameMetadata(node) || isLocalNameMetadata(node) || isBinaryModule(node) || isQuoteModule(node) || isSectionMetadata(node) || isProducersSectionMetadata(node) || isProducerMetadata(node) || isProducerMetadataVersionedName(node) || isLoopInstruction(node) || isInstr(node) || isIfInstruction(node) || isStringLiteral(node) || isNumberLiteral(node) || isLongNumberLiteral(node) || isFloatLiteral(node) || isElem(node) || isIndexInFuncSection(node) || isValtypeLiteral(node) || isTypeInstruction(node) || isStart(node) || isGlobalType(node) || isLeadingComment(node) || isBlockComment(node) || isData(node) || isGlobal(node) || isTable(node) || isMemory(node) || isFuncImportDescr(node) || isModuleImport(node) || isModuleExportDescr(node) || isModuleExport(node) || isLimit(node) || isSignature(node) || isProgram(node) || isIdentifier(node) || isBlockInstruction(node) || isCallInstruction(node) || isCallIndirectInstruction(node) || isByteArray(node) || isFunc(node) || isInternalBrUnless(node) || isInternalGoto(node) || isInternalCallExtern(node) || isInternalEndAndReturn(node);
};

exports.isNode = isNode;

var isBlock = function isBlock(node) {
  return isLoopInstruction(node) || isBlockInstruction(node) || isFunc(node);
};

exports.isBlock = isBlock;

var isInstruction = function isInstruction(node) {
  return isLoopInstruction(node) || isInstr(node) || isIfInstruction(node) || isTypeInstruction(node) || isBlockInstruction(node) || isCallInstruction(node) || isCallIndirectInstruction(node);
};

exports.isInstruction = isInstruction;

var isExpression = function isExpression(node) {
  return isInstr(node) || isStringLiteral(node) || isNumberLiteral(node) || isLongNumberLiteral(node) || isFloatLiteral(node) || isValtypeLiteral(node) || isIdentifier(node);
};

exports.isExpression = isExpression;

var isNumericLiteral = function isNumericLiteral(node) {
  return isNumberLiteral(node) || isLongNumberLiteral(node) || isFloatLiteral(node);
};

exports.isNumericLiteral = isNumericLiteral;

var isImportDescr = function isImportDescr(node) {
  return isGlobalType(node) || isTable(node) || isMemory(node) || isFuncImportDescr(node);
};

exports.isImportDescr = isImportDescr;

var isIntrinsic = function isIntrinsic(node) {
  return isInternalBrUnless(node) || isInternalGoto(node) || isInternalCallExtern(node) || isInternalEndAndReturn(node);
};

exports.isIntrinsic = isIntrinsic;
var assertModule = assertTypeOf("Module");
exports.assertModule = assertModule;
var assertModuleMetadata = assertTypeOf("ModuleMetadata");
exports.assertModuleMetadata = assertModuleMetadata;
var assertModuleNameMetadata = assertTypeOf("ModuleNameMetadata");
exports.assertModuleNameMetadata = assertModuleNameMetadata;
var assertFunctionNameMetadata = assertTypeOf("FunctionNameMetadata");
exports.assertFunctionNameMetadata = assertFunctionNameMetadata;
var assertLocalNameMetadata = assertTypeOf("LocalNameMetadata");
exports.assertLocalNameMetadata = assertLocalNameMetadata;
var assertBinaryModule = assertTypeOf("BinaryModule");
exports.assertBinaryModule = assertBinaryModule;
var assertQuoteModule = assertTypeOf("QuoteModule");
exports.assertQuoteModule = assertQuoteModule;
var assertSectionMetadata = assertTypeOf("SectionMetadata");
exports.assertSectionMetadata = assertSectionMetadata;
var assertProducersSectionMetadata = assertTypeOf("ProducersSectionMetadata");
exports.assertProducersSectionMetadata = assertProducersSectionMetadata;
var assertProducerMetadata = assertTypeOf("ProducerMetadata");
exports.assertProducerMetadata = assertProducerMetadata;
var assertProducerMetadataVersionedName = assertTypeOf("ProducerMetadataVersionedName");
exports.assertProducerMetadataVersionedName = assertProducerMetadataVersionedName;
var assertLoopInstruction = assertTypeOf("LoopInstruction");
exports.assertLoopInstruction = assertLoopInstruction;
var assertInstr = assertTypeOf("Instr");
exports.assertInstr = assertInstr;
var assertIfInstruction = assertTypeOf("IfInstruction");
exports.assertIfInstruction = assertIfInstruction;
var assertStringLiteral = assertTypeOf("StringLiteral");
exports.assertStringLiteral = assertStringLiteral;
var assertNumberLiteral = assertTypeOf("NumberLiteral");
exports.assertNumberLiteral = assertNumberLiteral;
var assertLongNumberLiteral = assertTypeOf("LongNumberLiteral");
exports.assertLongNumberLiteral = assertLongNumberLiteral;
var assertFloatLiteral = assertTypeOf("FloatLiteral");
exports.assertFloatLiteral = assertFloatLiteral;
var assertElem = assertTypeOf("Elem");
exports.assertElem = assertElem;
var assertIndexInFuncSection = assertTypeOf("IndexInFuncSection");
exports.assertIndexInFuncSection = assertIndexInFuncSection;
var assertValtypeLiteral = assertTypeOf("ValtypeLiteral");
exports.assertValtypeLiteral = assertValtypeLiteral;
var assertTypeInstruction = assertTypeOf("TypeInstruction");
exports.assertTypeInstruction = assertTypeInstruction;
var assertStart = assertTypeOf("Start");
exports.assertStart = assertStart;
var assertGlobalType = assertTypeOf("GlobalType");
exports.assertGlobalType = assertGlobalType;
var assertLeadingComment = assertTypeOf("LeadingComment");
exports.assertLeadingComment = assertLeadingComment;
var assertBlockComment = assertTypeOf("BlockComment");
exports.assertBlockComment = assertBlockComment;
var assertData = assertTypeOf("Data");
exports.assertData = assertData;
var assertGlobal = assertTypeOf("Global");
exports.assertGlobal = assertGlobal;
var assertTable = assertTypeOf("Table");
exports.assertTable = assertTable;
var assertMemory = assertTypeOf("Memory");
exports.assertMemory = assertMemory;
var assertFuncImportDescr = assertTypeOf("FuncImportDescr");
exports.assertFuncImportDescr = assertFuncImportDescr;
var assertModuleImport = assertTypeOf("ModuleImport");
exports.assertModuleImport = assertModuleImport;
var assertModuleExportDescr = assertTypeOf("ModuleExportDescr");
exports.assertModuleExportDescr = assertModuleExportDescr;
var assertModuleExport = assertTypeOf("ModuleExport");
exports.assertModuleExport = assertModuleExport;
var assertLimit = assertTypeOf("Limit");
exports.assertLimit = assertLimit;
var assertSignature = assertTypeOf("Signature");
exports.assertSignature = assertSignature;
var assertProgram = assertTypeOf("Program");
exports.assertProgram = assertProgram;
var assertIdentifier = assertTypeOf("Identifier");
exports.assertIdentifier = assertIdentifier;
var assertBlockInstruction = assertTypeOf("BlockInstruction");
exports.assertBlockInstruction = assertBlockInstruction;
var assertCallInstruction = assertTypeOf("CallInstruction");
exports.assertCallInstruction = assertCallInstruction;
var assertCallIndirectInstruction = assertTypeOf("CallIndirectInstruction");
exports.assertCallIndirectInstruction = assertCallIndirectInstruction;
var assertByteArray = assertTypeOf("ByteArray");
exports.assertByteArray = assertByteArray;
var assertFunc = assertTypeOf("Func");
exports.assertFunc = assertFunc;
var assertInternalBrUnless = assertTypeOf("InternalBrUnless");
exports.assertInternalBrUnless = assertInternalBrUnless;
var assertInternalGoto = assertTypeOf("InternalGoto");
exports.assertInternalGoto = assertInternalGoto;
var assertInternalCallExtern = assertTypeOf("InternalCallExtern");
exports.assertInternalCallExtern = assertInternalCallExtern;
var assertInternalEndAndReturn = assertTypeOf("InternalEndAndReturn");
exports.assertInternalEndAndReturn = assertInternalEndAndReturn;
var unionTypesMap = {
  Module: ["Node"],
  ModuleMetadata: ["Node"],
  ModuleNameMetadata: ["Node"],
  FunctionNameMetadata: ["Node"],
  LocalNameMetadata: ["Node"],
  BinaryModule: ["Node"],
  QuoteModule: ["Node"],
  SectionMetadata: ["Node"],
  ProducersSectionMetadata: ["Node"],
  ProducerMetadata: ["Node"],
  ProducerMetadataVersionedName: ["Node"],
  LoopInstruction: ["Node", "Block", "Instruction"],
  Instr: ["Node", "Expression", "Instruction"],
  IfInstruction: ["Node", "Instruction"],
  StringLiteral: ["Node", "Expression"],
  NumberLiteral: ["Node", "NumericLiteral", "Expression"],
  LongNumberLiteral: ["Node", "NumericLiteral", "Expression"],
  FloatLiteral: ["Node", "NumericLiteral", "Expression"],
  Elem: ["Node"],
  IndexInFuncSection: ["Node"],
  ValtypeLiteral: ["Node", "Expression"],
  TypeInstruction: ["Node", "Instruction"],
  Start: ["Node"],
  GlobalType: ["Node", "ImportDescr"],
  LeadingComment: ["Node"],
  BlockComment: ["Node"],
  Data: ["Node"],
  Global: ["Node"],
  Table: ["Node", "ImportDescr"],
  Memory: ["Node", "ImportDescr"],
  FuncImportDescr: ["Node", "ImportDescr"],
  ModuleImport: ["Node"],
  ModuleExportDescr: ["Node"],
  ModuleExport: ["Node"],
  Limit: ["Node"],
  Signature: ["Node"],
  Program: ["Node"],
  Identifier: ["Node", "Expression"],
  BlockInstruction: ["Node", "Block", "Instruction"],
  CallInstruction: ["Node", "Instruction"],
  CallIndirectInstruction: ["Node", "Instruction"],
  ByteArray: ["Node"],
  Func: ["Node", "Block"],
  InternalBrUnless: ["Node", "Intrinsic"],
  InternalGoto: ["Node", "Intrinsic"],
  InternalCallExtern: ["Node", "Intrinsic"],
  InternalEndAndReturn: ["Node", "Intrinsic"]
};
exports.unionTypesMap = unionTypesMap;
var nodeAndUnionTypes = ["Module", "ModuleMetadata", "ModuleNameMetadata", "FunctionNameMetadata", "LocalNameMetadata", "BinaryModule", "QuoteModule", "SectionMetadata", "ProducersSectionMetadata", "ProducerMetadata", "ProducerMetadataVersionedName", "LoopInstruction", "Instr", "IfInstruction", "StringLiteral", "NumberLiteral", "LongNumberLiteral", "FloatLiteral", "Elem", "IndexInFuncSection", "ValtypeLiteral", "TypeInstruction", "Start", "GlobalType", "LeadingComment", "BlockComment", "Data", "Global", "Table", "Memory", "FuncImportDescr", "ModuleImport", "ModuleExportDescr", "ModuleExport", "Limit", "Signature", "Program", "Identifier", "BlockInstruction", "CallInstruction", "CallIndirectInstruction", "ByteArray", "Func", "InternalBrUnless", "InternalGoto", "InternalCallExtern", "InternalEndAndReturn", "Node", "Block", "Instruction", "Expression", "NumericLiteral", "ImportDescr", "Intrinsic"];
exports.nodeAndUnionTypes = nodeAndUnionTypes;
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497392642, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.numberLiteralFromRaw = numberLiteralFromRaw;
exports.instruction = instruction;
exports.objectInstruction = objectInstruction;
exports.withLoc = withLoc;
exports.withRaw = withRaw;
exports.funcParam = funcParam;
exports.indexLiteral = indexLiteral;
exports.memIndexLiteral = memIndexLiteral;

var _helperNumbers = require("@webassemblyjs/helper-numbers");

var _nodes = require("./nodes");

function numberLiteralFromRaw(rawValue) {
  var instructionType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "i32";
  var original = rawValue; // Remove numeric separators _

  if (typeof rawValue === "string") {
    rawValue = rawValue.replace(/_/g, "");
  }

  if (typeof rawValue === "number") {
    return (0, _nodes.numberLiteral)(rawValue, String(original));
  } else {
    switch (instructionType) {
      case "i32":
        {
          return (0, _nodes.numberLiteral)((0, _helperNumbers.parse32I)(rawValue), String(original));
        }

      case "u32":
        {
          return (0, _nodes.numberLiteral)((0, _helperNumbers.parseU32)(rawValue), String(original));
        }

      case "i64":
        {
          return (0, _nodes.longNumberLiteral)((0, _helperNumbers.parse64I)(rawValue), String(original));
        }

      case "f32":
        {
          return (0, _nodes.floatLiteral)((0, _helperNumbers.parse32F)(rawValue), (0, _helperNumbers.isNanLiteral)(rawValue), (0, _helperNumbers.isInfLiteral)(rawValue), String(original));
        }
      // f64

      default:
        {
          return (0, _nodes.floatLiteral)((0, _helperNumbers.parse64F)(rawValue), (0, _helperNumbers.isNanLiteral)(rawValue), (0, _helperNumbers.isInfLiteral)(rawValue), String(original));
        }
    }
  }
}

function instruction(id) {
  var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var namedArgs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return (0, _nodes.instr)(id, undefined, args, namedArgs);
}

function objectInstruction(id, object) {
  var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var namedArgs = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  return (0, _nodes.instr)(id, object, args, namedArgs);
}
/**
 * Decorators
 */


function withLoc(n, end, start) {
  var loc = {
    start: start,
    end: end
  };
  n.loc = loc;
  return n;
}

function withRaw(n, raw) {
  n.raw = raw;
  return n;
}

function funcParam(valtype, id) {
  return {
    id: id,
    valtype: valtype
  };
}

function indexLiteral(value) {
  // $FlowIgnore
  var x = numberLiteralFromRaw(value, "u32");
  return x;
}

function memIndexLiteral(value) {
  // $FlowIgnore
  var x = numberLiteralFromRaw(value, "u32");
  return x;
}
}, function(modId) { var map = {"./nodes":1645497392641}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497392643, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.traverse = traverse;

var _nodePath = require("./node-path");

var _nodes = require("./nodes");

// recursively walks the AST starting at the given node. The callback is invoked for
// and object that has a 'type' property.
function walk(context, callback) {
  var stop = false;

  function innerWalk(context, callback) {
    if (stop) {
      return;
    }

    var node = context.node;

    if (node === undefined) {
      console.warn("traversing with an empty context");
      return;
    }

    if (node._deleted === true) {
      return;
    }

    var path = (0, _nodePath.createPath)(context);
    callback(node.type, path);

    if (path.shouldStop) {
      stop = true;
      return;
    }

    Object.keys(node).forEach(function (prop) {
      var value = node[prop];

      if (value === null || value === undefined) {
        return;
      }

      var valueAsArray = Array.isArray(value) ? value : [value];
      valueAsArray.forEach(function (childNode) {
        if (typeof childNode.type === "string") {
          var childContext = {
            node: childNode,
            parentKey: prop,
            parentPath: path,
            shouldStop: false,
            inList: Array.isArray(value)
          };
          innerWalk(childContext, callback);
        }
      });
    });
  }

  innerWalk(context, callback);
}

var noop = function noop() {};

function traverse(node, visitors) {
  var before = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : noop;
  var after = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : noop;
  Object.keys(visitors).forEach(function (visitor) {
    if (!_nodes.nodeAndUnionTypes.includes(visitor)) {
      throw new Error("Unexpected visitor ".concat(visitor));
    }
  });
  var context = {
    node: node,
    inList: false,
    shouldStop: false,
    parentPath: null,
    parentKey: null
  };
  walk(context, function (type, path) {
    if (typeof visitors[type] === "function") {
      before(type, path);
      visitors[type](path);
      after(type, path);
    }

    var unionTypes = _nodes.unionTypesMap[type];

    if (!unionTypes) {
      throw new Error("Unexpected node type ".concat(type));
    }

    unionTypes.forEach(function (unionType) {
      if (typeof visitors[unionType] === "function") {
        before(unionType, path);
        visitors[unionType](path);
        after(unionType, path);
      }
    });
  });
}
}, function(modId) { var map = {"./node-path":1645497392644,"./nodes":1645497392641}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497392644, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPath = createPath;

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function findParent(_ref, cb) {
  var parentPath = _ref.parentPath;

  if (parentPath == null) {
    throw new Error("node is root");
  }

  var currentPath = parentPath;

  while (cb(currentPath) !== false) {
    // Hit the root node, stop
    // $FlowIgnore
    if (currentPath.parentPath == null) {
      return null;
    } // $FlowIgnore


    currentPath = currentPath.parentPath;
  }

  return currentPath.node;
}

function insertBefore(context, newNode) {
  return insert(context, newNode);
}

function insertAfter(context, newNode) {
  return insert(context, newNode, 1);
}

function insert(_ref2, newNode) {
  var node = _ref2.node,
      inList = _ref2.inList,
      parentPath = _ref2.parentPath,
      parentKey = _ref2.parentKey;
  var indexOffset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  if (!inList) {
    throw new Error('inList' + " error: " + ("insert can only be used for nodes that are within lists" || "unknown"));
  }

  if (!(parentPath != null)) {
    throw new Error('parentPath != null' + " error: " + ("Can not remove root node" || "unknown"));
  }

  // $FlowIgnore
  var parentList = parentPath.node[parentKey];
  var indexInList = parentList.findIndex(function (n) {
    return n === node;
  });
  parentList.splice(indexInList + indexOffset, 0, newNode);
}

function remove(_ref3) {
  var node = _ref3.node,
      parentKey = _ref3.parentKey,
      parentPath = _ref3.parentPath;

  if (!(parentPath != null)) {
    throw new Error('parentPath != null' + " error: " + ("Can not remove root node" || "unknown"));
  }

  // $FlowIgnore
  var parentNode = parentPath.node; // $FlowIgnore

  var parentProperty = parentNode[parentKey];

  if (Array.isArray(parentProperty)) {
    // $FlowIgnore
    parentNode[parentKey] = parentProperty.filter(function (n) {
      return n !== node;
    });
  } else {
    // $FlowIgnore
    delete parentNode[parentKey];
  }

  node._deleted = true;
}

function stop(context) {
  context.shouldStop = true;
}

function replaceWith(context, newNode) {
  // $FlowIgnore
  var parentNode = context.parentPath.node; // $FlowIgnore

  var parentProperty = parentNode[context.parentKey];

  if (Array.isArray(parentProperty)) {
    var indexInList = parentProperty.findIndex(function (n) {
      return n === context.node;
    });
    parentProperty.splice(indexInList, 1, newNode);
  } else {
    // $FlowIgnore
    parentNode[context.parentKey] = newNode;
  }

  context.node._deleted = true;
  context.node = newNode;
} // bind the context to the first argument of node operations


function bindNodeOperations(operations, context) {
  var keys = Object.keys(operations);
  var boundOperations = {};
  keys.forEach(function (key) {
    boundOperations[key] = operations[key].bind(null, context);
  });
  return boundOperations;
}

function createPathOperations(context) {
  // $FlowIgnore
  return bindNodeOperations({
    findParent: findParent,
    replaceWith: replaceWith,
    remove: remove,
    insertBefore: insertBefore,
    insertAfter: insertAfter,
    stop: stop
  }, context);
}

function createPath(context) {
  var path = _extends({}, context); // $FlowIgnore


  Object.assign(path, createPathOperations(path)); // $FlowIgnore

  return path;
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497392645, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signatures = void 0;

function sign(input, output) {
  return [input, output];
}

var u32 = "u32";
var i32 = "i32";
var i64 = "i64";
var f32 = "f32";
var f64 = "f64";

var vector = function vector(t) {
  var vecType = [t]; // $FlowIgnore

  vecType.vector = true;
  return vecType;
};

var controlInstructions = {
  unreachable: sign([], []),
  nop: sign([], []),
  // block ?
  // loop ?
  // if ?
  // if else ?
  br: sign([u32], []),
  br_if: sign([u32], []),
  br_table: sign(vector(u32), []),
  return: sign([], []),
  call: sign([u32], []),
  call_indirect: sign([u32], [])
};
var parametricInstructions = {
  drop: sign([], []),
  select: sign([], [])
};
var variableInstructions = {
  get_local: sign([u32], []),
  set_local: sign([u32], []),
  tee_local: sign([u32], []),
  get_global: sign([u32], []),
  set_global: sign([u32], [])
};
var memoryInstructions = {
  "i32.load": sign([u32, u32], [i32]),
  "i64.load": sign([u32, u32], []),
  "f32.load": sign([u32, u32], []),
  "f64.load": sign([u32, u32], []),
  "i32.load8_s": sign([u32, u32], [i32]),
  "i32.load8_u": sign([u32, u32], [i32]),
  "i32.load16_s": sign([u32, u32], [i32]),
  "i32.load16_u": sign([u32, u32], [i32]),
  "i64.load8_s": sign([u32, u32], [i64]),
  "i64.load8_u": sign([u32, u32], [i64]),
  "i64.load16_s": sign([u32, u32], [i64]),
  "i64.load16_u": sign([u32, u32], [i64]),
  "i64.load32_s": sign([u32, u32], [i64]),
  "i64.load32_u": sign([u32, u32], [i64]),
  "i32.store": sign([u32, u32], []),
  "i64.store": sign([u32, u32], []),
  "f32.store": sign([u32, u32], []),
  "f64.store": sign([u32, u32], []),
  "i32.store8": sign([u32, u32], []),
  "i32.store16": sign([u32, u32], []),
  "i64.store8": sign([u32, u32], []),
  "i64.store16": sign([u32, u32], []),
  "i64.store32": sign([u32, u32], []),
  current_memory: sign([], []),
  grow_memory: sign([], [])
};
var numericInstructions = {
  "i32.const": sign([i32], [i32]),
  "i64.const": sign([i64], [i64]),
  "f32.const": sign([f32], [f32]),
  "f64.const": sign([f64], [f64]),
  "i32.eqz": sign([i32], [i32]),
  "i32.eq": sign([i32, i32], [i32]),
  "i32.ne": sign([i32, i32], [i32]),
  "i32.lt_s": sign([i32, i32], [i32]),
  "i32.lt_u": sign([i32, i32], [i32]),
  "i32.gt_s": sign([i32, i32], [i32]),
  "i32.gt_u": sign([i32, i32], [i32]),
  "i32.le_s": sign([i32, i32], [i32]),
  "i32.le_u": sign([i32, i32], [i32]),
  "i32.ge_s": sign([i32, i32], [i32]),
  "i32.ge_u": sign([i32, i32], [i32]),
  "i64.eqz": sign([i64], [i64]),
  "i64.eq": sign([i64, i64], [i32]),
  "i64.ne": sign([i64, i64], [i32]),
  "i64.lt_s": sign([i64, i64], [i32]),
  "i64.lt_u": sign([i64, i64], [i32]),
  "i64.gt_s": sign([i64, i64], [i32]),
  "i64.gt_u": sign([i64, i64], [i32]),
  "i64.le_s": sign([i64, i64], [i32]),
  "i64.le_u": sign([i64, i64], [i32]),
  "i64.ge_s": sign([i64, i64], [i32]),
  "i64.ge_u": sign([i64, i64], [i32]),
  "f32.eq": sign([f32, f32], [i32]),
  "f32.ne": sign([f32, f32], [i32]),
  "f32.lt": sign([f32, f32], [i32]),
  "f32.gt": sign([f32, f32], [i32]),
  "f32.le": sign([f32, f32], [i32]),
  "f32.ge": sign([f32, f32], [i32]),
  "f64.eq": sign([f64, f64], [i32]),
  "f64.ne": sign([f64, f64], [i32]),
  "f64.lt": sign([f64, f64], [i32]),
  "f64.gt": sign([f64, f64], [i32]),
  "f64.le": sign([f64, f64], [i32]),
  "f64.ge": sign([f64, f64], [i32]),
  "i32.clz": sign([i32], [i32]),
  "i32.ctz": sign([i32], [i32]),
  "i32.popcnt": sign([i32], [i32]),
  "i32.add": sign([i32, i32], [i32]),
  "i32.sub": sign([i32, i32], [i32]),
  "i32.mul": sign([i32, i32], [i32]),
  "i32.div_s": sign([i32, i32], [i32]),
  "i32.div_u": sign([i32, i32], [i32]),
  "i32.rem_s": sign([i32, i32], [i32]),
  "i32.rem_u": sign([i32, i32], [i32]),
  "i32.and": sign([i32, i32], [i32]),
  "i32.or": sign([i32, i32], [i32]),
  "i32.xor": sign([i32, i32], [i32]),
  "i32.shl": sign([i32, i32], [i32]),
  "i32.shr_s": sign([i32, i32], [i32]),
  "i32.shr_u": sign([i32, i32], [i32]),
  "i32.rotl": sign([i32, i32], [i32]),
  "i32.rotr": sign([i32, i32], [i32]),
  "i64.clz": sign([i64], [i64]),
  "i64.ctz": sign([i64], [i64]),
  "i64.popcnt": sign([i64], [i64]),
  "i64.add": sign([i64, i64], [i64]),
  "i64.sub": sign([i64, i64], [i64]),
  "i64.mul": sign([i64, i64], [i64]),
  "i64.div_s": sign([i64, i64], [i64]),
  "i64.div_u": sign([i64, i64], [i64]),
  "i64.rem_s": sign([i64, i64], [i64]),
  "i64.rem_u": sign([i64, i64], [i64]),
  "i64.and": sign([i64, i64], [i64]),
  "i64.or": sign([i64, i64], [i64]),
  "i64.xor": sign([i64, i64], [i64]),
  "i64.shl": sign([i64, i64], [i64]),
  "i64.shr_s": sign([i64, i64], [i64]),
  "i64.shr_u": sign([i64, i64], [i64]),
  "i64.rotl": sign([i64, i64], [i64]),
  "i64.rotr": sign([i64, i64], [i64]),
  "f32.abs": sign([f32], [f32]),
  "f32.neg": sign([f32], [f32]),
  "f32.ceil": sign([f32], [f32]),
  "f32.floor": sign([f32], [f32]),
  "f32.trunc": sign([f32], [f32]),
  "f32.nearest": sign([f32], [f32]),
  "f32.sqrt": sign([f32], [f32]),
  "f32.add": sign([f32, f32], [f32]),
  "f32.sub": sign([f32, f32], [f32]),
  "f32.mul": sign([f32, f32], [f32]),
  "f32.div": sign([f32, f32], [f32]),
  "f32.min": sign([f32, f32], [f32]),
  "f32.max": sign([f32, f32], [f32]),
  "f32.copysign": sign([f32, f32], [f32]),
  "f64.abs": sign([f64], [f64]),
  "f64.neg": sign([f64], [f64]),
  "f64.ceil": sign([f64], [f64]),
  "f64.floor": sign([f64], [f64]),
  "f64.trunc": sign([f64], [f64]),
  "f64.nearest": sign([f64], [f64]),
  "f64.sqrt": sign([f64], [f64]),
  "f64.add": sign([f64, f64], [f64]),
  "f64.sub": sign([f64, f64], [f64]),
  "f64.mul": sign([f64, f64], [f64]),
  "f64.div": sign([f64, f64], [f64]),
  "f64.min": sign([f64, f64], [f64]),
  "f64.max": sign([f64, f64], [f64]),
  "f64.copysign": sign([f64, f64], [f64]),
  "i32.wrap/i64": sign([i64], [i32]),
  "i32.trunc_s/f32": sign([f32], [i32]),
  "i32.trunc_u/f32": sign([f32], [i32]),
  "i32.trunc_s/f64": sign([f32], [i32]),
  "i32.trunc_u/f64": sign([f64], [i32]),
  "i64.extend_s/i32": sign([i32], [i64]),
  "i64.extend_u/i32": sign([i32], [i64]),
  "i64.trunc_s/f32": sign([f32], [i64]),
  "i64.trunc_u/f32": sign([f32], [i64]),
  "i64.trunc_s/f64": sign([f64], [i64]),
  "i64.trunc_u/f64": sign([f64], [i64]),
  "f32.convert_s/i32": sign([i32], [f32]),
  "f32.convert_u/i32": sign([i32], [f32]),
  "f32.convert_s/i64": sign([i64], [f32]),
  "f32.convert_u/i64": sign([i64], [f32]),
  "f32.demote/f64": sign([f64], [f32]),
  "f64.convert_s/i32": sign([i32], [f64]),
  "f64.convert_u/i32": sign([i32], [f64]),
  "f64.convert_s/i64": sign([i64], [f64]),
  "f64.convert_u/i64": sign([i64], [f64]),
  "f64.promote/f32": sign([f32], [f64]),
  "i32.reinterpret/f32": sign([f32], [i32]),
  "i64.reinterpret/f64": sign([f64], [i64]),
  "f32.reinterpret/i32": sign([i32], [f32]),
  "f64.reinterpret/i64": sign([i64], [f64])
};
var signatures = Object.assign({}, controlInstructions, parametricInstructions, variableInstructions, memoryInstructions, numericInstructions);
exports.signatures = signatures;
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497392646, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAnonymous = isAnonymous;
exports.getSectionMetadata = getSectionMetadata;
exports.getSectionMetadatas = getSectionMetadatas;
exports.sortSectionMetadata = sortSectionMetadata;
exports.orderedInsertNode = orderedInsertNode;
exports.assertHasLoc = assertHasLoc;
exports.getEndOfSection = getEndOfSection;
exports.shiftLoc = shiftLoc;
exports.shiftSection = shiftSection;
exports.signatureForOpcode = signatureForOpcode;
exports.getUniqueNameGenerator = getUniqueNameGenerator;
exports.getStartByteOffset = getStartByteOffset;
exports.getEndByteOffset = getEndByteOffset;
exports.getFunctionBeginingByteOffset = getFunctionBeginingByteOffset;
exports.getEndBlockByteOffset = getEndBlockByteOffset;
exports.getStartBlockByteOffset = getStartBlockByteOffset;

var _signatures = require("./signatures");

var _traverse = require("./traverse");

var _helperWasmBytecode = _interopRequireWildcard(require("@webassemblyjs/helper-wasm-bytecode"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return _sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function isAnonymous(ident) {
  return ident.raw === "";
}

function getSectionMetadata(ast, name) {
  var section;
  (0, _traverse.traverse)(ast, {
    SectionMetadata: function (_SectionMetadata) {
      function SectionMetadata(_x) {
        return _SectionMetadata.apply(this, arguments);
      }

      SectionMetadata.toString = function () {
        return _SectionMetadata.toString();
      };

      return SectionMetadata;
    }(function (_ref) {
      var node = _ref.node;

      if (node.section === name) {
        section = node;
      }
    })
  });
  return section;
}

function getSectionMetadatas(ast, name) {
  var sections = [];
  (0, _traverse.traverse)(ast, {
    SectionMetadata: function (_SectionMetadata2) {
      function SectionMetadata(_x2) {
        return _SectionMetadata2.apply(this, arguments);
      }

      SectionMetadata.toString = function () {
        return _SectionMetadata2.toString();
      };

      return SectionMetadata;
    }(function (_ref2) {
      var node = _ref2.node;

      if (node.section === name) {
        sections.push(node);
      }
    })
  });
  return sections;
}

function sortSectionMetadata(m) {
  if (m.metadata == null) {
    console.warn("sortSectionMetadata: no metadata to sort");
    return;
  } // $FlowIgnore


  m.metadata.sections.sort(function (a, b) {
    var aId = _helperWasmBytecode.default.sections[a.section];
    var bId = _helperWasmBytecode.default.sections[b.section];

    if (typeof aId !== "number" || typeof bId !== "number") {
      throw new Error("Section id not found");
    }

    return aId - bId;
  });
}

function orderedInsertNode(m, n) {
  assertHasLoc(n);
  var didInsert = false;

  if (n.type === "ModuleExport") {
    m.fields.push(n);
    return;
  }

  m.fields = m.fields.reduce(function (acc, field) {
    var fieldEndCol = Infinity;

    if (field.loc != null) {
      // $FlowIgnore
      fieldEndCol = field.loc.end.column;
    } // $FlowIgnore: assertHasLoc ensures that


    if (didInsert === false && n.loc.start.column < fieldEndCol) {
      didInsert = true;
      acc.push(n);
    }

    acc.push(field);
    return acc;
  }, []); // Handles empty modules or n is the last element

  if (didInsert === false) {
    m.fields.push(n);
  }
}

function assertHasLoc(n) {
  if (n.loc == null || n.loc.start == null || n.loc.end == null) {
    throw new Error("Internal failure: node (".concat(JSON.stringify(n.type), ") has no location information"));
  }
}

function getEndOfSection(s) {
  assertHasLoc(s.size);
  return s.startOffset + s.size.value + ( // $FlowIgnore
  s.size.loc.end.column - s.size.loc.start.column);
}

function shiftLoc(node, delta) {
  // $FlowIgnore
  node.loc.start.column += delta; // $FlowIgnore

  node.loc.end.column += delta;
}

function shiftSection(ast, node, delta) {
  if (node.type !== "SectionMetadata") {
    throw new Error("Can not shift node " + JSON.stringify(node.type));
  }

  node.startOffset += delta;

  if (_typeof(node.size.loc) === "object") {
    shiftLoc(node.size, delta);
  } // Custom sections doesn't have vectorOfSize


  if (_typeof(node.vectorOfSize) === "object" && _typeof(node.vectorOfSize.loc) === "object") {
    shiftLoc(node.vectorOfSize, delta);
  }

  var sectionName = node.section; // shift node locations within that section

  (0, _traverse.traverse)(ast, {
    Node: function Node(_ref3) {
      var node = _ref3.node;
      var section = (0, _helperWasmBytecode.getSectionForNode)(node);

      if (section === sectionName && _typeof(node.loc) === "object") {
        shiftLoc(node, delta);
      }
    }
  });
}

function signatureForOpcode(object, name) {
  var opcodeName = name;

  if (object !== undefined && object !== "") {
    opcodeName = object + "." + name;
  }

  var sign = _signatures.signatures[opcodeName];

  if (sign == undefined) {
    // TODO: Uncomment this when br_table and others has been done
    //throw new Error("Invalid opcode: "+opcodeName);
    return [object, object];
  }

  return sign[0];
}

function getUniqueNameGenerator() {
  var inc = {};
  return function () {
    var prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "temp";

    if (!(prefix in inc)) {
      inc[prefix] = 0;
    } else {
      inc[prefix] = inc[prefix] + 1;
    }

    return prefix + "_" + inc[prefix];
  };
}

function getStartByteOffset(n) {
  // $FlowIgnore
  if (typeof n.loc === "undefined" || typeof n.loc.start === "undefined") {
    throw new Error( // $FlowIgnore
    "Can not get byte offset without loc informations, node: " + String(n.id));
  }

  return n.loc.start.column;
}

function getEndByteOffset(n) {
  // $FlowIgnore
  if (typeof n.loc === "undefined" || typeof n.loc.end === "undefined") {
    throw new Error("Can not get byte offset without loc informations, node: " + n.type);
  }

  return n.loc.end.column;
}

function getFunctionBeginingByteOffset(n) {
  if (!(n.body.length > 0)) {
    throw new Error('n.body.length > 0' + " error: " + (undefined || "unknown"));
  }

  var _n$body = _slicedToArray(n.body, 1),
      firstInstruction = _n$body[0];

  return getStartByteOffset(firstInstruction);
}

function getEndBlockByteOffset(n) {
  // $FlowIgnore
  if (!(n.instr.length > 0 || n.body.length > 0)) {
    throw new Error('n.instr.length > 0 || n.body.length > 0' + " error: " + (undefined || "unknown"));
  }

  var lastInstruction;

  if (n.instr) {
    // $FlowIgnore
    lastInstruction = n.instr[n.instr.length - 1];
  }

  if (n.body) {
    // $FlowIgnore
    lastInstruction = n.body[n.body.length - 1];
  }

  if (!(_typeof(lastInstruction) === "object")) {
    throw new Error('typeof lastInstruction === "object"' + " error: " + (undefined || "unknown"));
  }

  // $FlowIgnore
  return getStartByteOffset(lastInstruction);
}

function getStartBlockByteOffset(n) {
  // $FlowIgnore
  if (!(n.instr.length > 0 || n.body.length > 0)) {
    throw new Error('n.instr.length > 0 || n.body.length > 0' + " error: " + (undefined || "unknown"));
  }

  var fistInstruction;

  if (n.instr) {
    // $FlowIgnore
    var _n$instr = _slicedToArray(n.instr, 1);

    fistInstruction = _n$instr[0];
  }

  if (n.body) {
    // $FlowIgnore
    var _n$body2 = _slicedToArray(n.body, 1);

    fistInstruction = _n$body2[0];
  }

  if (!(_typeof(fistInstruction) === "object")) {
    throw new Error('typeof fistInstruction === "object"' + " error: " + (undefined || "unknown"));
  }

  // $FlowIgnore
  return getStartByteOffset(fistInstruction);
}
}, function(modId) { var map = {"./signatures":1645497392645,"./traverse":1645497392643}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497392647, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cloneNode = cloneNode;

function cloneNode(n) {
  return Object.assign({}, n);
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497392648, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.moduleContextFromModuleAST = moduleContextFromModuleAST;
exports.ModuleContext = void 0;

var _nodes = require("../../nodes.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function moduleContextFromModuleAST(m) {
  var moduleContext = new ModuleContext();

  if (!(m.type === "Module")) {
    throw new Error('m.type === "Module"' + " error: " + (undefined || "unknown"));
  }

  m.fields.forEach(function (field) {
    switch (field.type) {
      case "Start":
        {
          moduleContext.setStart(field.index);
          break;
        }

      case "TypeInstruction":
        {
          moduleContext.addType(field);
          break;
        }

      case "Func":
        {
          moduleContext.addFunction(field);
          break;
        }

      case "Global":
        {
          moduleContext.defineGlobal(field);
          break;
        }

      case "ModuleImport":
        {
          switch (field.descr.type) {
            case "GlobalType":
              {
                moduleContext.importGlobal(field.descr.valtype, field.descr.mutability);
                break;
              }

            case "Memory":
              {
                moduleContext.addMemory(field.descr.limits.min, field.descr.limits.max);
                break;
              }

            case "FuncImportDescr":
              {
                moduleContext.importFunction(field.descr);
                break;
              }

            case "Table":
              {
                // FIXME(sven): not implemented yet
                break;
              }

            default:
              throw new Error("Unsupported ModuleImport of type " + JSON.stringify(field.descr.type));
          }

          break;
        }

      case "Memory":
        {
          moduleContext.addMemory(field.limits.min, field.limits.max);
          break;
        }
    }
  });
  return moduleContext;
}
/**
 * Module context for type checking
 */


var ModuleContext =
/*#__PURE__*/
function () {
  function ModuleContext() {
    _classCallCheck(this, ModuleContext);

    this.funcs = [];
    this.funcsOffsetByIdentifier = [];
    this.types = [];
    this.globals = [];
    this.globalsOffsetByIdentifier = [];
    this.mems = []; // Current stack frame

    this.locals = [];
    this.labels = [];
    this.return = [];
    this.debugName = "unknown";
    this.start = null;
  }
  /**
   * Set start segment
   */


  _createClass(ModuleContext, [{
    key: "setStart",
    value: function setStart(index) {
      this.start = index.value;
    }
    /**
     * Get start function
     */

  }, {
    key: "getStart",
    value: function getStart() {
      return this.start;
    }
    /**
     * Reset the active stack frame
     */

  }, {
    key: "newContext",
    value: function newContext(debugName, expectedResult) {
      this.locals = [];
      this.labels = [expectedResult];
      this.return = expectedResult;
      this.debugName = debugName;
    }
    /**
     * Functions
     */

  }, {
    key: "addFunction",
    value: function addFunction(func
    /*: Func*/
    ) {
      // eslint-disable-next-line prefer-const
      var _ref = func.signature || {},
          _ref$params = _ref.params,
          args = _ref$params === void 0 ? [] : _ref$params,
          _ref$results = _ref.results,
          result = _ref$results === void 0 ? [] : _ref$results;

      args = args.map(function (arg) {
        return arg.valtype;
      });
      this.funcs.push({
        args: args,
        result: result
      });

      if (typeof func.name !== "undefined") {
        this.funcsOffsetByIdentifier[func.name.value] = this.funcs.length - 1;
      }
    }
  }, {
    key: "importFunction",
    value: function importFunction(funcimport) {
      if ((0, _nodes.isSignature)(funcimport.signature)) {
        // eslint-disable-next-line prefer-const
        var _funcimport$signature = funcimport.signature,
            args = _funcimport$signature.params,
            result = _funcimport$signature.results;
        args = args.map(function (arg) {
          return arg.valtype;
        });
        this.funcs.push({
          args: args,
          result: result
        });
      } else {
        if (!(0, _nodes.isNumberLiteral)(funcimport.signature)) {
          throw new Error('isNumberLiteral(funcimport.signature)' + " error: " + (undefined || "unknown"));
        }

        var typeId = funcimport.signature.value;

        if (!this.hasType(typeId)) {
          throw new Error('this.hasType(typeId)' + " error: " + (undefined || "unknown"));
        }

        var signature = this.getType(typeId);
        this.funcs.push({
          args: signature.params.map(function (arg) {
            return arg.valtype;
          }),
          result: signature.results
        });
      }

      if (typeof funcimport.id !== "undefined") {
        // imports are first, we can assume their index in the array
        this.funcsOffsetByIdentifier[funcimport.id.value] = this.funcs.length - 1;
      }
    }
  }, {
    key: "hasFunction",
    value: function hasFunction(index) {
      return typeof this.getFunction(index) !== "undefined";
    }
  }, {
    key: "getFunction",
    value: function getFunction(index) {
      if (typeof index !== "number") {
        throw new Error("getFunction only supported for number index");
      }

      return this.funcs[index];
    }
  }, {
    key: "getFunctionOffsetByIdentifier",
    value: function getFunctionOffsetByIdentifier(name) {
      if (!(typeof name === "string")) {
        throw new Error('typeof name === "string"' + " error: " + (undefined || "unknown"));
      }

      return this.funcsOffsetByIdentifier[name];
    }
    /**
     * Labels
     */

  }, {
    key: "addLabel",
    value: function addLabel(result) {
      this.labels.unshift(result);
    }
  }, {
    key: "hasLabel",
    value: function hasLabel(index) {
      return this.labels.length > index && index >= 0;
    }
  }, {
    key: "getLabel",
    value: function getLabel(index) {
      return this.labels[index];
    }
  }, {
    key: "popLabel",
    value: function popLabel() {
      this.labels.shift();
    }
    /**
     * Locals
     */

  }, {
    key: "hasLocal",
    value: function hasLocal(index) {
      return typeof this.getLocal(index) !== "undefined";
    }
  }, {
    key: "getLocal",
    value: function getLocal(index) {
      return this.locals[index];
    }
  }, {
    key: "addLocal",
    value: function addLocal(type) {
      this.locals.push(type);
    }
    /**
     * Types
     */

  }, {
    key: "addType",
    value: function addType(type) {
      if (!(type.functype.type === "Signature")) {
        throw new Error('type.functype.type === "Signature"' + " error: " + (undefined || "unknown"));
      }

      this.types.push(type.functype);
    }
  }, {
    key: "hasType",
    value: function hasType(index) {
      return this.types[index] !== undefined;
    }
  }, {
    key: "getType",
    value: function getType(index) {
      return this.types[index];
    }
    /**
     * Globals
     */

  }, {
    key: "hasGlobal",
    value: function hasGlobal(index) {
      return this.globals.length > index && index >= 0;
    }
  }, {
    key: "getGlobal",
    value: function getGlobal(index) {
      return this.globals[index].type;
    }
  }, {
    key: "getGlobalOffsetByIdentifier",
    value: function getGlobalOffsetByIdentifier(name) {
      if (!(typeof name === "string")) {
        throw new Error('typeof name === "string"' + " error: " + (undefined || "unknown"));
      }

      return this.globalsOffsetByIdentifier[name];
    }
  }, {
    key: "defineGlobal",
    value: function defineGlobal(global
    /*: Global*/
    ) {
      var type = global.globalType.valtype;
      var mutability = global.globalType.mutability;
      this.globals.push({
        type: type,
        mutability: mutability
      });

      if (typeof global.name !== "undefined") {
        this.globalsOffsetByIdentifier[global.name.value] = this.globals.length - 1;
      }
    }
  }, {
    key: "importGlobal",
    value: function importGlobal(type, mutability) {
      this.globals.push({
        type: type,
        mutability: mutability
      });
    }
  }, {
    key: "isMutableGlobal",
    value: function isMutableGlobal(index) {
      return this.globals[index].mutability === "var";
    }
  }, {
    key: "isImmutableGlobal",
    value: function isImmutableGlobal(index) {
      return this.globals[index].mutability === "const";
    }
    /**
     * Memories
     */

  }, {
    key: "hasMemory",
    value: function hasMemory(index) {
      return this.mems.length > index && index >= 0;
    }
  }, {
    key: "addMemory",
    value: function addMemory(min, max) {
      this.mems.push({
        min: min,
        max: max
      });
    }
  }, {
    key: "getMemory",
    value: function getMemory(index) {
      return this.mems[index];
    }
  }]);

  return ModuleContext;
}();

exports.ModuleContext = ModuleContext;
}, function(modId) { var map = {"../../nodes.js":1645497392641}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1645497392640);
})()
//miniprogram-npm-outsideDeps=["@webassemblyjs/helper-numbers","@webassemblyjs/helper-wasm-bytecode"]
//# sourceMappingURL=index.js.map