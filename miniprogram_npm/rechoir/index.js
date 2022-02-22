module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1645497393494, function(require, module, exports) {
var path = require('path');

var extension = require('./lib/extension');
var normalize = require('./lib/normalize');
var register = require('./lib/register');

exports.prepare = function(extensions, filepath, cwd, nothrow) {
  var config, usedExtension, err, option, attempt, error;
  var attempts = [];
  var onlyErrors = true;
  var exts = extension(filepath);

  if (exts) {
    exts.some(function(ext) {
      usedExtension = ext;
      config = normalize(extensions[ext]);
      return !!config;
    });
  }

  if (Object.keys(require.extensions).indexOf(usedExtension) !== -1) {
    return true;
  }

  if (!config) {
    if (nothrow) {
      return;
    }

    throw new Error('No module loader found for "' + usedExtension + '".');
  }

  if (!cwd) {
    cwd = path.dirname(path.resolve(filepath));
  }
  if (!Array.isArray(config)) {
    config = [config];
  }

  for (var i in config) {
    option = config[i];
    attempt = register(cwd, option.module, option.register);
    error = (attempt instanceof Error) ? attempt : null;
    if (error) {
      attempt = null;
    }
    attempts.push({
      moduleName: option.module,
      module: attempt,
      error: error,
    });
    if (!error) {
      onlyErrors = false;
      break;
    }
  }
  if (onlyErrors) {
    err = new Error('Unable to use specified module loaders for "' + usedExtension + '".');
    err.failures = attempts;
    if (nothrow) {
      return err;
    }

    throw err;
  }
  return attempts;
};

}, function(modId) {var map = {"./lib/extension":1645497393495,"./lib/normalize":1645497393496,"./lib/register":1645497393497}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497393495, function(require, module, exports) {


var path = require('path');

function getLongExtension(basename) {
  if (basename[basename.length - 1] === '.') {
    return null;
  }

  var startIndex = (basename[0] === '.') ? 1 : 0;

  var dotIndex = basename.indexOf('.', startIndex);
  if (dotIndex <= startIndex) {
    return null;
  }

  return basename.slice(dotIndex);
}

function getPossibleExtensions(longExtension) {
  var arr = [longExtension];
  var len = longExtension.length;
  var startIndex = 1;

  while (startIndex < len) {
    var dotIndex = longExtension.indexOf('.', startIndex);
    if (dotIndex < 0) {
      break;
    }
    arr.push(longExtension.slice(dotIndex));
    startIndex = dotIndex + 1;
  }

  return arr;
}

module.exports = function(input) {
  var basename = path.basename(input);
  var longExtension = getLongExtension(basename);
  if (!longExtension) {
    return;
  }
  return getPossibleExtensions(longExtension);
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497393496, function(require, module, exports) {
function normalizer(config) {
  if (typeof config === 'string') {
    return { module: config };
  }
  return config;
}

module.exports = function(config) {
  if (Array.isArray(config)) {
    return config.map(normalizer);
  }
  return normalizer(config);
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497393497, function(require, module, exports) {
var resolve = require('resolve');

module.exports = function(cwd, moduleName, register) {
  var result;
  try {
    var modulePath = resolve.sync(moduleName, { basedir: cwd });
    result = require(modulePath);
    if (typeof register === 'function') {
      register(result);
    }
  } catch (e) {
    result = e;
  }
  return result;
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1645497393494);
})()
//miniprogram-npm-outsideDeps=["path","resolve"]
//# sourceMappingURL=index.js.map