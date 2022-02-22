module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1645497393553, function(require, module, exports) {


const path = require("path");

const os = require("os");

const {
  SourceMapConsumer
} = require("source-map");

const {
  validate
} = require("schema-utils");

const serialize = require("serialize-javascript");

const {
  Worker
} = require("jest-worker");

const {
  throttleAll,
  terserMinify,
  uglifyJsMinify,
  swcMinify,
  esbuildMinify
} = require("./utils");

const schema = require("./options.json");

const {
  minify
} = require("./minify");
/** @typedef {import("schema-utils/declarations/validate").Schema} Schema */

/** @typedef {import("webpack").Compiler} Compiler */

/** @typedef {import("webpack").Compilation} Compilation */

/** @typedef {import("webpack").WebpackError} WebpackError */

/** @typedef {import("webpack").Asset} Asset */

/** @typedef {import("./utils.js").TerserECMA} TerserECMA */

/** @typedef {import("./utils.js").TerserOptions} TerserOptions */

/** @typedef {import("jest-worker").Worker} JestWorker */

/** @typedef {import("source-map").RawSourceMap} RawSourceMap */

/** @typedef {RegExp | string} Rule */

/** @typedef {Rule[] | Rule} Rules */

/**
 * @callback ExtractCommentsFunction
 * @param {any} astNode
 * @param {{ value: string, type: 'comment1' | 'comment2' | 'comment3' | 'comment4', pos: number, line: number, col: number }} comment
 * @returns {boolean}
 */

/**
 * @typedef {boolean | 'all' | 'some' | RegExp | ExtractCommentsFunction} ExtractCommentsCondition
 */

/**
 * @typedef {string | ((fileData: any) => string)} ExtractCommentsFilename
 */

/**
 * @typedef {boolean | string | ((commentsFile: string) => string)} ExtractCommentsBanner
 */

/**
 * @typedef {Object} ExtractCommentsObject
 * @property {ExtractCommentsCondition} [condition]
 * @property {ExtractCommentsFilename} [filename]
 * @property {ExtractCommentsBanner} [banner]
 */

/**
 * @typedef {ExtractCommentsCondition | ExtractCommentsObject} ExtractCommentsOptions
 */

/**
 * @typedef {Object} MinimizedResult
 * @property {string} code
 * @property {RawSourceMap} [map]
 * @property {Array<Error | string>} [errors]
 * @property {Array<Error | string>} [warnings]
 * @property {Array<string>} [extractedComments]
 */

/**
 * @typedef {{ [file: string]: string }} Input
 */

/**
 * @typedef {{ [key: string]: any }} CustomOptions
 */

/**
 * @template T
 * @typedef {T extends infer U ? U : CustomOptions} InferDefaultType
 */

/**
 * @typedef {Object} PredefinedOptions
 * @property {boolean} [module]
 * @property {TerserECMA} [ecma]
 */

/**
 * @template T
 * @typedef {PredefinedOptions & InferDefaultType<T>} MinimizerOptions
 */

/**
 * @template T
 * @callback BasicMinimizerImplementation
 * @param {Input} input
 * @param {RawSourceMap | undefined} sourceMap
 * @param {MinimizerOptions<T>} minifyOptions
 * @param {ExtractCommentsOptions | undefined} extractComments
 * @returns {Promise<MinimizedResult>}
 */

/**
 * @typedef {object} MinimizeFunctionHelpers
 * @property {() => string | undefined} [getMinimizerVersion]
 */

/**
 * @template T
 * @typedef {BasicMinimizerImplementation<T> & MinimizeFunctionHelpers} MinimizerImplementation
 */

/**
 * @template T
 * @typedef {Object} InternalOptions
 * @property {string} name
 * @property {string} input
 * @property {RawSourceMap | undefined} inputSourceMap
 * @property {ExtractCommentsOptions | undefined} extractComments
 * @property {{ implementation: MinimizerImplementation<T>, options: MinimizerOptions<T> }} minimizer
 */

/**
 * @template T
 * @typedef {JestWorker & { transform: (options: string) => MinimizedResult, minify: (options: InternalOptions<T>) => MinimizedResult }} MinimizerWorker
 */

/**
 * @typedef {undefined | boolean | number} Parallel
 */

/**
 * @typedef {Object} BasePluginOptions
 * @property {Rules} [test]
 * @property {Rules} [include]
 * @property {Rules} [exclude]
 * @property {ExtractCommentsOptions} [extractComments]
 * @property {Parallel} [parallel]
 */

/**
 * @template T
 * @typedef {T extends TerserOptions ? { minify?: MinimizerImplementation<T> | undefined, terserOptions?: MinimizerOptions<T> | undefined } : { minify: MinimizerImplementation<T>, terserOptions?: MinimizerOptions<T> | undefined }} DefinedDefaultMinimizerAndOptions
 */

/**
 * @template T
 * @typedef {BasePluginOptions & { minimizer: { implementation: MinimizerImplementation<T>, options: MinimizerOptions<T> } }} InternalPluginOptions
 */

/**
 * @template [T=TerserOptions]
 */


class TerserPlugin {
  /**
   * @param {BasePluginOptions & DefinedDefaultMinimizerAndOptions<T>} [options]
   */
  constructor(options) {
    validate(
    /** @type {Schema} */
    schema, options || {}, {
      name: "Terser Plugin",
      baseDataPath: "options"
    }); // TODO make `minimizer` option instead `minify` and `terserOptions` in the next major release, also rename `terserMinify` to `terserMinimize`

    const {
      minify =
      /** @type {MinimizerImplementation<T>} */
      terserMinify,
      terserOptions =
      /** @type {MinimizerOptions<T>} */
      {},
      test = /\.[cm]?js(\?.*)?$/i,
      extractComments = true,
      parallel = true,
      include,
      exclude
    } = options || {};
    /**
     * @private
     * @type {InternalPluginOptions<T>}
     */

    this.options = {
      test,
      extractComments,
      parallel,
      include,
      exclude,
      minimizer: {
        implementation: minify,
        options: terserOptions
      }
    };
  }
  /**
   * @private
   * @param {any} input
   * @returns {boolean}
   */


  static isSourceMap(input) {
    // All required options for `new SourceMapConsumer(...options)`
    // https://github.com/mozilla/source-map#new-sourcemapconsumerrawsourcemap
    return Boolean(input && input.version && input.sources && Array.isArray(input.sources) && typeof input.mappings === "string");
  }
  /**
   * @private
   * @param {unknown} warning
   * @param {string} file
   * @returns {Error}
   */


  static buildWarning(warning, file) {
    /**
     * @type {Error & { hideStack: true, file: string }}
     */
    // @ts-ignore
    const builtWarning = new Error(warning.toString());
    builtWarning.name = "Warning";
    builtWarning.hideStack = true;
    builtWarning.file = file;
    return builtWarning;
  }
  /**
   * @private
   * @param {any} error
   * @param {string} file
   * @param {SourceMapConsumer} [sourceMap]
   * @param {Compilation["requestShortener"]} [requestShortener]
   * @returns {Error}
   */


  static buildError(error, file, sourceMap, requestShortener) {
    /**
     * @type {Error & { file?: string }}
     */
    let builtError;

    if (typeof error === "string") {
      builtError = new Error(`${file} from Terser plugin\n${error}`);
      builtError.file = file;
      return builtError;
    }

    if (error.line) {
      const original = sourceMap && sourceMap.originalPositionFor({
        line: error.line,
        column: error.col
      });

      if (original && original.source && requestShortener) {
        builtError = new Error(`${file} from Terser plugin\n${error.message} [${requestShortener.shorten(original.source)}:${original.line},${original.column}][${file}:${error.line},${error.col}]${error.stack ? `\n${error.stack.split("\n").slice(1).join("\n")}` : ""}`);
        builtError.file = file;
        return builtError;
      }

      builtError = new Error(`${file} from Terser plugin\n${error.message} [${file}:${error.line},${error.col}]${error.stack ? `\n${error.stack.split("\n").slice(1).join("\n")}` : ""}`);
      builtError.file = file;
      return builtError;
    }

    if (error.stack) {
      builtError = new Error(`${file} from Terser plugin\n${typeof error.message !== "undefined" ? error.message : ""}\n${error.stack}`);
      builtError.file = file;
      return builtError;
    }

    builtError = new Error(`${file} from Terser plugin\n${error.message}`);
    builtError.file = file;
    return builtError;
  }
  /**
   * @private
   * @param {Parallel} parallel
   * @returns {number}
   */


  static getAvailableNumberOfCores(parallel) {
    // In some cases cpus() returns undefined
    // https://github.com/nodejs/node/issues/19022
    const cpus = os.cpus() || {
      length: 1
    };
    return parallel === true ? cpus.length - 1 : Math.min(Number(parallel) || 0, cpus.length - 1);
  }
  /**
   * @private
   * @param {Compiler} compiler
   * @param {Compilation} compilation
   * @param {Record<string, import("webpack").sources.Source>} assets
   * @param {{availableNumberOfCores: number}} optimizeOptions
   * @returns {Promise<void>}
   */


  async optimize(compiler, compilation, assets, optimizeOptions) {
    const cache = compilation.getCache("TerserWebpackPlugin");
    let numberOfAssets = 0;
    const assetsForMinify = await Promise.all(Object.keys(assets).filter(name => {
      const {
        info
      } =
      /** @type {Asset} */
      compilation.getAsset(name);

      if ( // Skip double minimize assets from child compilation
      info.minimized || // Skip minimizing for extracted comments assets
      info.extractedComments) {
        return false;
      }

      if (!compiler.webpack.ModuleFilenameHelpers.matchObject.bind( // eslint-disable-next-line no-undefined
      undefined, this.options)(name)) {
        return false;
      }

      return true;
    }).map(async name => {
      const {
        info,
        source
      } =
      /** @type {Asset} */
      compilation.getAsset(name);
      const eTag = cache.getLazyHashedEtag(source);
      const cacheItem = cache.getItemCache(name, eTag);
      const output = await cacheItem.getPromise();

      if (!output) {
        numberOfAssets += 1;
      }

      return {
        name,
        info,
        inputSource: source,
        output,
        cacheItem
      };
    }));

    if (assetsForMinify.length === 0) {
      return;
    }
    /** @type {undefined | (() => MinimizerWorker<T>)} */


    let getWorker;
    /** @type {undefined | MinimizerWorker<T>} */

    let initializedWorker;
    /** @type {undefined | number} */

    let numberOfWorkers;

    if (optimizeOptions.availableNumberOfCores > 0) {
      // Do not create unnecessary workers when the number of files is less than the available cores, it saves memory
      numberOfWorkers = Math.min(numberOfAssets, optimizeOptions.availableNumberOfCores); // eslint-disable-next-line consistent-return

      getWorker = () => {
        if (initializedWorker) {
          return initializedWorker;
        }

        initializedWorker =
        /** @type {MinimizerWorker<T>} */
        new Worker(require.resolve("./minify"), {
          numWorkers: numberOfWorkers,
          enableWorkerThreads: true
        }); // https://github.com/facebook/jest/issues/8872#issuecomment-524822081

        const workerStdout = initializedWorker.getStdout();

        if (workerStdout) {
          workerStdout.on("data", chunk => process.stdout.write(chunk));
        }

        const workerStderr = initializedWorker.getStderr();

        if (workerStderr) {
          workerStderr.on("data", chunk => process.stderr.write(chunk));
        }

        return initializedWorker;
      };
    }

    const {
      SourceMapSource,
      ConcatSource,
      RawSource
    } = compiler.webpack.sources;
    /** @typedef {{ extractedCommentsSource : import("webpack").sources.RawSource, commentsFilename: string }} ExtractedCommentsInfo */

    /** @type {Map<string, ExtractedCommentsInfo>} */

    const allExtractedComments = new Map();
    const scheduledTasks = [];

    for (const asset of assetsForMinify) {
      scheduledTasks.push(async () => {
        const {
          name,
          inputSource,
          info,
          cacheItem
        } = asset;
        let {
          output
        } = asset;

        if (!output) {
          let input;
          /** @type {RawSourceMap | undefined} */

          let inputSourceMap;
          const {
            source: sourceFromInputSource,
            map
          } = inputSource.sourceAndMap();
          input = sourceFromInputSource;

          if (map) {
            if (!TerserPlugin.isSourceMap(map)) {
              compilation.warnings.push(
              /** @type {WebpackError} */
              new Error(`${name} contains invalid source map`));
            } else {
              inputSourceMap =
              /** @type {RawSourceMap} */
              map;
            }
          }

          if (Buffer.isBuffer(input)) {
            input = input.toString();
          }
          /**
           * @type {InternalOptions<T>}
           */


          const options = {
            name,
            input,
            inputSourceMap,
            minimizer: {
              implementation: this.options.minimizer.implementation,
              // @ts-ignore https://github.com/Microsoft/TypeScript/issues/10727
              options: { ...this.options.minimizer.options
              }
            },
            extractComments: this.options.extractComments
          };

          if (typeof options.minimizer.options.module === "undefined") {
            if (typeof info.javascriptModule !== "undefined") {
              options.minimizer.options.module = info.javascriptModule;
            } else if (/\.mjs(\?.*)?$/i.test(name)) {
              options.minimizer.options.module = true;
            } else if (/\.cjs(\?.*)?$/i.test(name)) {
              options.minimizer.options.module = false;
            }
          }

          if (typeof options.minimizer.options.ecma === "undefined") {
            options.minimizer.options.ecma = TerserPlugin.getEcmaVersion(compiler.options.output.environment || {});
          }

          try {
            output = await (getWorker ? getWorker().transform(serialize(options)) : minify(options));
          } catch (error) {
            const hasSourceMap = inputSourceMap && TerserPlugin.isSourceMap(inputSourceMap);
            compilation.errors.push(
            /** @type {WebpackError} */
            TerserPlugin.buildError(error, name, hasSourceMap ? new SourceMapConsumer(
            /** @type {RawSourceMap} */
            inputSourceMap) : // eslint-disable-next-line no-undefined
            undefined, // eslint-disable-next-line no-undefined
            hasSourceMap ? compilation.requestShortener : undefined));
            return;
          }

          if (typeof output.code === "undefined") {
            compilation.errors.push(
            /** @type {WebpackError} */
            new Error(`${name} from Terser plugin\nMinimizer doesn't return result`));
            return;
          }

          if (output.warnings && output.warnings.length > 0) {
            output.warnings = output.warnings.map(
            /**
             * @param {Error | string} item
             */
            item => TerserPlugin.buildWarning(item, name));
          }

          if (output.errors && output.errors.length > 0) {
            const hasSourceMap = inputSourceMap && TerserPlugin.isSourceMap(inputSourceMap);
            output.errors = output.errors.map(
            /**
             * @param {Error | string} item
             */
            item => TerserPlugin.buildError(item, name, hasSourceMap ? new SourceMapConsumer(
            /** @type {RawSourceMap} */
            inputSourceMap) : // eslint-disable-next-line no-undefined
            undefined, // eslint-disable-next-line no-undefined
            hasSourceMap ? compilation.requestShortener : undefined));
          }

          let shebang;

          if (
          /** @type {ExtractCommentsObject} */
          this.options.extractComments.banner !== false && output.extractedComments && output.extractedComments.length > 0 && output.code.startsWith("#!")) {
            const firstNewlinePosition = output.code.indexOf("\n");
            shebang = output.code.substring(0, firstNewlinePosition);
            output.code = output.code.substring(firstNewlinePosition + 1);
          }

          if (output.map) {
            output.source = new SourceMapSource(output.code, name, output.map, input,
            /** @type {RawSourceMap} */
            inputSourceMap, true);
          } else {
            output.source = new RawSource(output.code);
          }

          if (output.extractedComments && output.extractedComments.length > 0) {
            const commentsFilename =
            /** @type {ExtractCommentsObject} */
            this.options.extractComments.filename || "[file].LICENSE.txt[query]";
            let query = "";
            let filename = name;
            const querySplit = filename.indexOf("?");

            if (querySplit >= 0) {
              query = filename.substr(querySplit);
              filename = filename.substr(0, querySplit);
            }

            const lastSlashIndex = filename.lastIndexOf("/");
            const basename = lastSlashIndex === -1 ? filename : filename.substr(lastSlashIndex + 1);
            const data = {
              filename,
              basename,
              query
            };
            output.commentsFilename = compilation.getPath(commentsFilename, data);
            let banner; // Add a banner to the original file

            if (
            /** @type {ExtractCommentsObject} */
            this.options.extractComments.banner !== false) {
              banner =
              /** @type {ExtractCommentsObject} */
              this.options.extractComments.banner || `For license information please see ${path.relative(path.dirname(name), output.commentsFilename).replace(/\\/g, "/")}`;

              if (typeof banner === "function") {
                banner = banner(output.commentsFilename);
              }

              if (banner) {
                output.source = new ConcatSource(shebang ? `${shebang}\n` : "", `/*! ${banner} */\n`, output.source);
              }
            }

            const extractedCommentsString = output.extractedComments.sort().join("\n\n");
            output.extractedCommentsSource = new RawSource(`${extractedCommentsString}\n`);
          }

          await cacheItem.storePromise({
            source: output.source,
            errors: output.errors,
            warnings: output.warnings,
            commentsFilename: output.commentsFilename,
            extractedCommentsSource: output.extractedCommentsSource
          });
        }

        if (output.warnings && output.warnings.length > 0) {
          for (const warning of output.warnings) {
            compilation.warnings.push(
            /** @type {WebpackError} */
            warning);
          }
        }

        if (output.errors && output.errors.length > 0) {
          for (const error of output.errors) {
            compilation.errors.push(
            /** @type {WebpackError} */
            error);
          }
        }
        /** @type {Record<string, any>} */


        const newInfo = {
          minimized: true
        };
        const {
          source,
          extractedCommentsSource
        } = output; // Write extracted comments to commentsFilename

        if (extractedCommentsSource) {
          const {
            commentsFilename
          } = output;
          newInfo.related = {
            license: commentsFilename
          };
          allExtractedComments.set(name, {
            extractedCommentsSource,
            commentsFilename
          });
        }

        compilation.updateAsset(name, source, newInfo);
      });
    }

    const limit = getWorker && numberOfAssets > 0 ?
    /** @type {number} */
    numberOfWorkers : scheduledTasks.length;
    await throttleAll(limit, scheduledTasks);

    if (initializedWorker) {
      await initializedWorker.end();
    }
    /** @typedef {{ source: import("webpack").sources.Source, commentsFilename: string, from: string }} ExtractedCommentsInfoWIthFrom */


    await Array.from(allExtractedComments).sort().reduce(
    /**
     * @param {Promise<unknown>} previousPromise
     * @param {[string, ExtractedCommentsInfo]} extractedComments
     * @returns {Promise<ExtractedCommentsInfoWIthFrom>}
     */
    async (previousPromise, [from, value]) => {
      const previous =
      /** @type {ExtractedCommentsInfoWIthFrom | undefined} **/
      await previousPromise;
      const {
        commentsFilename,
        extractedCommentsSource
      } = value;

      if (previous && previous.commentsFilename === commentsFilename) {
        const {
          from: previousFrom,
          source: prevSource
        } = previous;
        const mergedName = `${previousFrom}|${from}`;
        const name = `${commentsFilename}|${mergedName}`;
        const eTag = [prevSource, extractedCommentsSource].map(item => cache.getLazyHashedEtag(item)).reduce((previousValue, currentValue) => cache.mergeEtags(previousValue, currentValue));
        let source = await cache.getPromise(name, eTag);

        if (!source) {
          source = new ConcatSource(Array.from(new Set([...
          /** @type {string}*/
          prevSource.source().split("\n\n"), ...
          /** @type {string}*/
          extractedCommentsSource.source().split("\n\n")])).join("\n\n"));
          await cache.storePromise(name, eTag, source);
        }

        compilation.updateAsset(commentsFilename, source);
        return {
          source,
          commentsFilename,
          from: mergedName
        };
      }

      const existingAsset = compilation.getAsset(commentsFilename);

      if (existingAsset) {
        return {
          source: existingAsset.source,
          commentsFilename,
          from: commentsFilename
        };
      }

      compilation.emitAsset(commentsFilename, extractedCommentsSource, {
        extractedComments: true
      });
      return {
        source: extractedCommentsSource,
        commentsFilename,
        from
      };
    },
    /** @type {Promise<unknown>} */
    Promise.resolve());
  }
  /**
   * @private
   * @param {any} environment
   * @returns {TerserECMA}
   */


  static getEcmaVersion(environment) {
    // ES 6th
    if (environment.arrowFunction || environment.const || environment.destructuring || environment.forOf || environment.module) {
      return 2015;
    } // ES 11th


    if (environment.bigIntLiteral || environment.dynamicImport) {
      return 2020;
    }

    return 5;
  }
  /**
   * @param {Compiler} compiler
   * @returns {void}
   */


  apply(compiler) {
    const pluginName = this.constructor.name;
    const availableNumberOfCores = TerserPlugin.getAvailableNumberOfCores(this.options.parallel);
    compiler.hooks.compilation.tap(pluginName, compilation => {
      const hooks = compiler.webpack.javascript.JavascriptModulesPlugin.getCompilationHooks(compilation);
      const data = serialize({
        minimizer: typeof this.options.minimizer.implementation.getMinimizerVersion !== "undefined" ? this.options.minimizer.implementation.getMinimizerVersion() || "0.0.0" : "0.0.0",
        options: this.options.minimizer.options
      });
      hooks.chunkHash.tap(pluginName, (chunk, hash) => {
        hash.update("TerserPlugin");
        hash.update(data);
      });
      compilation.hooks.processAssets.tapPromise({
        name: pluginName,
        stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE,
        additionalAssets: true
      }, assets => this.optimize(compiler, compilation, assets, {
        availableNumberOfCores
      }));
      compilation.hooks.statsPrinter.tap(pluginName, stats => {
        stats.hooks.print.for("asset.info.minimized").tap("terser-webpack-plugin", (minimized, {
          green,
          formatFlag
        }) => minimized ?
        /** @type {Function} */
        green(
        /** @type {Function} */
        formatFlag("minimized")) : "");
      });
    });
  }

}

TerserPlugin.terserMinify = terserMinify;
TerserPlugin.uglifyJsMinify = uglifyJsMinify;
TerserPlugin.swcMinify = swcMinify;
TerserPlugin.esbuildMinify = esbuildMinify;
module.exports = TerserPlugin;
}, function(modId) {var map = {"./utils":1645497393554,"./options.json":1645497393555,"./minify":1645497393556}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497393554, function(require, module, exports) {


/** @typedef {import("source-map").RawSourceMap} RawSourceMap */

/** @typedef {import("terser").FormatOptions} TerserFormatOptions */

/** @typedef {import("terser").MinifyOptions} TerserOptions */

/** @typedef {import("terser").ECMA} TerserECMA */

/** @typedef {import("./index.js").ExtractCommentsOptions} ExtractCommentsOptions */

/** @typedef {import("./index.js").ExtractCommentsFunction} ExtractCommentsFunction */

/** @typedef {import("./index.js").ExtractCommentsCondition} ExtractCommentsCondition */

/** @typedef {import("./index.js").Input} Input */

/** @typedef {import("./index.js").MinimizedResult} MinimizedResult */

/** @typedef {import("./index.js").PredefinedOptions} PredefinedOptions */

/** @typedef {import("./index.js").CustomOptions} CustomOptions */

/**
 * @typedef {Array<string>} ExtractedComments
 */
const notSettled = Symbol(`not-settled`);
/**
 * @template T
 * @typedef {() => Promise<T>} Task
 */

/**
 * Run tasks with limited concurency.
 * @template T
 * @param {number} limit - Limit of tasks that run at once.
 * @param {Task<T>[]} tasks - List of tasks to run.
 * @returns {Promise<T[]>} A promise that fulfills to an array of the results
 */

function throttleAll(limit, tasks) {
  if (!Number.isInteger(limit) || limit < 1) {
    throw new TypeError(`Expected \`limit\` to be a finite number > 0, got \`${limit}\` (${typeof limit})`);
  }

  if (!Array.isArray(tasks) || !tasks.every(task => typeof task === `function`)) {
    throw new TypeError(`Expected \`tasks\` to be a list of functions returning a promise`);
  }

  return new Promise((resolve, reject) => {
    const result = Array(tasks.length).fill(notSettled);
    const entries = tasks.entries();

    const next = () => {
      const {
        done,
        value
      } = entries.next();

      if (done) {
        const isLast = !result.includes(notSettled);
        if (isLast) resolve(
        /** @type{T[]} **/
        result);
        return;
      }

      const [index, task] = value;
      /**
       * @param {T} x
       */

      const onFulfilled = x => {
        result[index] = x;
        next();
      };

      task().then(onFulfilled, reject);
    };

    Array(limit).fill(0).forEach(next);
  });
}
/* istanbul ignore next */

/**
 * @param {Input} input
 * @param {RawSourceMap | undefined} sourceMap
 * @param {PredefinedOptions & CustomOptions} minimizerOptions
 * @param {ExtractCommentsOptions | undefined} extractComments
 * @return {Promise<MinimizedResult>}
 */


async function terserMinify(input, sourceMap, minimizerOptions, extractComments) {
  /**
   * @param {any} value
   * @returns {boolean}
   */
  const isObject = value => {
    const type = typeof value;
    return value != null && (type === "object" || type === "function");
  };
  /**
   * @param {TerserOptions & { sourceMap: undefined } & ({ output: TerserFormatOptions & { beautify: boolean } } | { format: TerserFormatOptions & { beautify: boolean } })} terserOptions
   * @param {ExtractedComments} extractedComments
   * @returns {ExtractCommentsFunction}
   */


  const buildComments = (terserOptions, extractedComments) => {
    /** @type {{ [index: string]: ExtractCommentsCondition }} */
    const condition = {};
    let comments;

    if (terserOptions.format) {
      ({
        comments
      } = terserOptions.format);
    } else if (terserOptions.output) {
      ({
        comments
      } = terserOptions.output);
    }

    condition.preserve = typeof comments !== "undefined" ? comments : false;

    if (typeof extractComments === "boolean" && extractComments) {
      condition.extract = "some";
    } else if (typeof extractComments === "string" || extractComments instanceof RegExp) {
      condition.extract = extractComments;
    } else if (typeof extractComments === "function") {
      condition.extract = extractComments;
    } else if (extractComments && isObject(extractComments)) {
      condition.extract = typeof extractComments.condition === "boolean" && extractComments.condition ? "some" : typeof extractComments.condition !== "undefined" ? extractComments.condition : "some";
    } else {
      // No extract
      // Preserve using "commentsOpts" or "some"
      condition.preserve = typeof comments !== "undefined" ? comments : "some";
      condition.extract = false;
    } // Ensure that both conditions are functions


    ["preserve", "extract"].forEach(key => {
      /** @type {undefined | string} */
      let regexStr;
      /** @type {undefined | RegExp} */

      let regex;

      switch (typeof condition[key]) {
        case "boolean":
          condition[key] = condition[key] ? () => true : () => false;
          break;

        case "function":
          break;

        case "string":
          if (condition[key] === "all") {
            condition[key] = () => true;

            break;
          }

          if (condition[key] === "some") {
            condition[key] =
            /** @type {ExtractCommentsFunction} */
            (astNode, comment) => (comment.type === "comment2" || comment.type === "comment1") && /@preserve|@lic|@cc_on|^\**!/i.test(comment.value);

            break;
          }

          regexStr =
          /** @type {string} */
          condition[key];

          condition[key] =
          /** @type {ExtractCommentsFunction} */
          (astNode, comment) => new RegExp(
          /** @type {string} */
          regexStr).test(comment.value);

          break;

        default:
          regex =
          /** @type {RegExp} */
          condition[key];

          condition[key] =
          /** @type {ExtractCommentsFunction} */
          (astNode, comment) =>
          /** @type {RegExp} */
          regex.test(comment.value);

      }
    }); // Redefine the comments function to extract and preserve
    // comments according to the two conditions

    return (astNode, comment) => {
      if (
      /** @type {{ extract: ExtractCommentsFunction }} */
      condition.extract(astNode, comment)) {
        const commentText = comment.type === "comment2" ? `/*${comment.value}*/` : `//${comment.value}`; // Don't include duplicate comments

        if (!extractedComments.includes(commentText)) {
          extractedComments.push(commentText);
        }
      }

      return (
        /** @type {{ preserve: ExtractCommentsFunction }} */
        condition.preserve(astNode, comment)
      );
    };
  };
  /**
   * @param {PredefinedOptions & TerserOptions} [terserOptions={}]
   * @returns {TerserOptions & { sourceMap: undefined } & ({ output: TerserFormatOptions & { beautify: boolean } } | { format: TerserFormatOptions & { beautify: boolean } })}
   */


  const buildTerserOptions = (terserOptions = {}) => {
    // Need deep copy objects to avoid https://github.com/terser/terser/issues/366
    return { ...terserOptions,
      compress: typeof terserOptions.compress === "boolean" ? terserOptions.compress : { ...terserOptions.compress
      },
      // ecma: terserOptions.ecma,
      // ie8: terserOptions.ie8,
      // keep_classnames: terserOptions.keep_classnames,
      // keep_fnames: terserOptions.keep_fnames,
      mangle: terserOptions.mangle == null ? true : typeof terserOptions.mangle === "boolean" ? terserOptions.mangle : { ...terserOptions.mangle
      },
      // module: terserOptions.module,
      // nameCache: { ...terserOptions.toplevel },
      // the `output` option is deprecated
      ...(terserOptions.format ? {
        format: {
          beautify: false,
          ...terserOptions.format
        }
      } : {
        output: {
          beautify: false,
          ...terserOptions.output
        }
      }),
      parse: { ...terserOptions.parse
      },
      // safari10: terserOptions.safari10,
      // Ignoring sourceMap from options
      // eslint-disable-next-line no-undefined
      sourceMap: undefined // toplevel: terserOptions.toplevel

    };
  }; // eslint-disable-next-line global-require


  const {
    minify
  } = require("terser"); // Copy `terser` options


  const terserOptions = buildTerserOptions(minimizerOptions); // Let terser generate a SourceMap

  if (sourceMap) {
    // @ts-ignore
    terserOptions.sourceMap = {
      asObject: true
    };
  }
  /** @type {ExtractedComments} */


  const extractedComments = [];

  if (terserOptions.output) {
    terserOptions.output.comments = buildComments(terserOptions, extractedComments);
  } else if (terserOptions.format) {
    terserOptions.format.comments = buildComments(terserOptions, extractedComments);
  }

  const [[filename, code]] = Object.entries(input);
  const result = await minify({
    [filename]: code
  }, terserOptions);
  return {
    code:
    /** @type {string} **/
    result.code,
    // @ts-ignore
    // eslint-disable-next-line no-undefined
    map: result.map ?
    /** @type {RawSourceMap} **/
    result.map : undefined,
    extractedComments
  };
}
/**
 * @returns {string | undefined}
 */


terserMinify.getMinimizerVersion = () => {
  let packageJson;

  try {
    // eslint-disable-next-line global-require
    packageJson = require("terser/package.json");
  } catch (error) {// Ignore
  }

  return packageJson && packageJson.version;
};
/* istanbul ignore next */

/**
 * @param {Input} input
 * @param {RawSourceMap | undefined} sourceMap
 * @param {PredefinedOptions & CustomOptions} minimizerOptions
 * @param {ExtractCommentsOptions | undefined} extractComments
 * @return {Promise<MinimizedResult>}
 */


async function uglifyJsMinify(input, sourceMap, minimizerOptions, extractComments) {
  /**
   * @param {any} value
   * @returns {boolean}
   */
  const isObject = value => {
    const type = typeof value;
    return value != null && (type === "object" || type === "function");
  };
  /**
   * @param {import("uglify-js").MinifyOptions & { sourceMap: undefined } & { output: import("uglify-js").OutputOptions & { beautify: boolean }}} uglifyJsOptions
   * @param {ExtractedComments} extractedComments
   * @returns {ExtractCommentsFunction}
   */


  const buildComments = (uglifyJsOptions, extractedComments) => {
    /** @type {{ [index: string]: ExtractCommentsCondition }} */
    const condition = {};
    const {
      comments
    } = uglifyJsOptions.output;
    condition.preserve = typeof comments !== "undefined" ? comments : false;

    if (typeof extractComments === "boolean" && extractComments) {
      condition.extract = "some";
    } else if (typeof extractComments === "string" || extractComments instanceof RegExp) {
      condition.extract = extractComments;
    } else if (typeof extractComments === "function") {
      condition.extract = extractComments;
    } else if (extractComments && isObject(extractComments)) {
      condition.extract = typeof extractComments.condition === "boolean" && extractComments.condition ? "some" : typeof extractComments.condition !== "undefined" ? extractComments.condition : "some";
    } else {
      // No extract
      // Preserve using "commentsOpts" or "some"
      condition.preserve = typeof comments !== "undefined" ? comments : "some";
      condition.extract = false;
    } // Ensure that both conditions are functions


    ["preserve", "extract"].forEach(key => {
      /** @type {undefined | string} */
      let regexStr;
      /** @type {undefined | RegExp} */

      let regex;

      switch (typeof condition[key]) {
        case "boolean":
          condition[key] = condition[key] ? () => true : () => false;
          break;

        case "function":
          break;

        case "string":
          if (condition[key] === "all") {
            condition[key] = () => true;

            break;
          }

          if (condition[key] === "some") {
            condition[key] =
            /** @type {ExtractCommentsFunction} */
            (astNode, comment) => (comment.type === "comment2" || comment.type === "comment1") && /@preserve|@lic|@cc_on|^\**!/i.test(comment.value);

            break;
          }

          regexStr =
          /** @type {string} */
          condition[key];

          condition[key] =
          /** @type {ExtractCommentsFunction} */
          (astNode, comment) => new RegExp(
          /** @type {string} */
          regexStr).test(comment.value);

          break;

        default:
          regex =
          /** @type {RegExp} */
          condition[key];

          condition[key] =
          /** @type {ExtractCommentsFunction} */
          (astNode, comment) =>
          /** @type {RegExp} */
          regex.test(comment.value);

      }
    }); // Redefine the comments function to extract and preserve
    // comments according to the two conditions

    return (astNode, comment) => {
      if (
      /** @type {{ extract: ExtractCommentsFunction }} */
      condition.extract(astNode, comment)) {
        const commentText = comment.type === "comment2" ? `/*${comment.value}*/` : `//${comment.value}`; // Don't include duplicate comments

        if (!extractedComments.includes(commentText)) {
          extractedComments.push(commentText);
        }
      }

      return (
        /** @type {{ preserve: ExtractCommentsFunction }} */
        condition.preserve(astNode, comment)
      );
    };
  };
  /**
   * @param {PredefinedOptions & import("uglify-js").MinifyOptions} [uglifyJsOptions={}]
   * @returns {import("uglify-js").MinifyOptions & { sourceMap: undefined } & { output: import("uglify-js").OutputOptions & { beautify: boolean }}}
   */


  const buildUglifyJsOptions = (uglifyJsOptions = {}) => {
    // eslint-disable-next-line no-param-reassign
    delete minimizerOptions.ecma; // eslint-disable-next-line no-param-reassign

    delete minimizerOptions.module; // Need deep copy objects to avoid https://github.com/terser/terser/issues/366

    return { ...uglifyJsOptions,
      // warnings: uglifyJsOptions.warnings,
      parse: { ...uglifyJsOptions.parse
      },
      compress: typeof uglifyJsOptions.compress === "boolean" ? uglifyJsOptions.compress : { ...uglifyJsOptions.compress
      },
      mangle: uglifyJsOptions.mangle == null ? true : typeof uglifyJsOptions.mangle === "boolean" ? uglifyJsOptions.mangle : { ...uglifyJsOptions.mangle
      },
      output: {
        beautify: false,
        ...uglifyJsOptions.output
      },
      // Ignoring sourceMap from options
      // eslint-disable-next-line no-undefined
      sourceMap: undefined // toplevel: uglifyJsOptions.toplevel
      // nameCache: { ...uglifyJsOptions.toplevel },
      // ie8: uglifyJsOptions.ie8,
      // keep_fnames: uglifyJsOptions.keep_fnames,

    };
  }; // eslint-disable-next-line global-require, import/no-extraneous-dependencies


  const {
    minify
  } = require("uglify-js"); // Copy `uglify-js` options


  const uglifyJsOptions = buildUglifyJsOptions(minimizerOptions); // Let terser generate a SourceMap

  if (sourceMap) {
    // @ts-ignore
    uglifyJsOptions.sourceMap = true;
  }
  /** @type {ExtractedComments} */


  const extractedComments = []; // @ts-ignore

  uglifyJsOptions.output.comments = buildComments(uglifyJsOptions, extractedComments);
  const [[filename, code]] = Object.entries(input);
  const result = await minify({
    [filename]: code
  }, uglifyJsOptions);
  return {
    code: result.code,
    // eslint-disable-next-line no-undefined
    map: result.map ? JSON.parse(result.map) : undefined,
    errors: result.error ? [result.error] : [],
    warnings: result.warnings || [],
    extractedComments
  };
}
/**
 * @returns {string | undefined}
 */


uglifyJsMinify.getMinimizerVersion = () => {
  let packageJson;

  try {
    // eslint-disable-next-line global-require, import/no-extraneous-dependencies
    packageJson = require("uglify-js/package.json");
  } catch (error) {// Ignore
  }

  return packageJson && packageJson.version;
};
/* istanbul ignore next */

/**
 * @param {Input} input
 * @param {RawSourceMap | undefined} sourceMap
 * @param {PredefinedOptions & CustomOptions} minimizerOptions
 * @return {Promise<MinimizedResult>}
 */


async function swcMinify(input, sourceMap, minimizerOptions) {
  /**
   * @param {PredefinedOptions & import("@swc/core").JsMinifyOptions} [swcOptions={}]
   * @returns {import("@swc/core").JsMinifyOptions & { sourceMap: undefined }}
   */
  const buildSwcOptions = (swcOptions = {}) => {
    // Need deep copy objects to avoid https://github.com/terser/terser/issues/366
    return { ...swcOptions,
      compress: typeof swcOptions.compress === "boolean" ? swcOptions.compress : { ...swcOptions.compress
      },
      mangle: swcOptions.mangle == null ? true : typeof swcOptions.mangle === "boolean" ? swcOptions.mangle : { ...swcOptions.mangle
      },
      // ecma: swcOptions.ecma,
      // keep_classnames: swcOptions.keep_classnames,
      // keep_fnames: swcOptions.keep_fnames,
      // module: swcOptions.module,
      // safari10: swcOptions.safari10,
      // toplevel: swcOptions.toplevel
      // eslint-disable-next-line no-undefined
      sourceMap: undefined
    };
  }; // eslint-disable-next-line import/no-extraneous-dependencies, global-require


  const swc = require("@swc/core"); // Copy `swc` options


  const swcOptions = buildSwcOptions(minimizerOptions); // Let `swc` generate a SourceMap

  if (sourceMap) {
    // @ts-ignore
    swcOptions.sourceMap = true;
  }

  const [[filename, code]] = Object.entries(input);
  const result = await swc.minify(code, swcOptions);
  let map;

  if (result.map) {
    map = JSON.parse(result.map); // TODO workaround for swc because `filename` is not preset as in `swc` signature as for `terser`

    map.sources = [filename];
    delete map.sourcesContent;
  }

  return {
    code: result.code,
    map
  };
}
/**
 * @returns {string | undefined}
 */


swcMinify.getMinimizerVersion = () => {
  let packageJson;

  try {
    // eslint-disable-next-line global-require, import/no-extraneous-dependencies
    packageJson = require("@swc/core/package.json");
  } catch (error) {// Ignore
  }

  return packageJson && packageJson.version;
};
/* istanbul ignore next */

/**
 * @param {Input} input
 * @param {RawSourceMap | undefined} sourceMap
 * @param {PredefinedOptions & CustomOptions} minimizerOptions
 * @return {Promise<MinimizedResult>}
 */


async function esbuildMinify(input, sourceMap, minimizerOptions) {
  /**
   * @param {PredefinedOptions & import("esbuild").TransformOptions} [esbuildOptions={}]
   * @returns {import("esbuild").TransformOptions}
   */
  const buildEsbuildOptions = (esbuildOptions = {}) => {
    // eslint-disable-next-line no-param-reassign
    delete esbuildOptions.ecma;

    if (esbuildOptions.module) {
      // eslint-disable-next-line no-param-reassign
      esbuildOptions.format = "esm";
    } // eslint-disable-next-line no-param-reassign


    delete esbuildOptions.module; // Need deep copy objects to avoid https://github.com/terser/terser/issues/366

    return {
      minify: true,
      legalComments: "inline",
      ...esbuildOptions,
      sourcemap: false
    };
  }; // eslint-disable-next-line import/no-extraneous-dependencies, global-require


  const esbuild = require("esbuild"); // Copy `esbuild` options


  const esbuildOptions = buildEsbuildOptions(minimizerOptions); // Let `esbuild` generate a SourceMap

  if (sourceMap) {
    esbuildOptions.sourcemap = true;
    esbuildOptions.sourcesContent = false;
  }

  const [[filename, code]] = Object.entries(input);
  esbuildOptions.sourcefile = filename;
  const result = await esbuild.transform(code, esbuildOptions);
  return {
    code: result.code,
    // eslint-disable-next-line no-undefined
    map: result.map ? JSON.parse(result.map) : undefined,
    warnings: result.warnings.length > 0 ? result.warnings.map(item => {
      return {
        name: "Warning",
        source: item.location && item.location.file,
        line: item.location && item.location.line,
        column: item.location && item.location.column,
        plugin: item.pluginName,
        message: `${item.text}${item.detail ? `\nDetails:\n${item.detail}` : ""}${item.notes.length > 0 ? `\n\nNotes:\n${item.notes.map(note => `${note.location ? `[${note.location.file}:${note.location.line}:${note.location.column}] ` : ""}${note.text}${note.location ? `\nSuggestion: ${note.location.suggestion}` : ""}${note.location ? `\nLine text:\n${note.location.lineText}\n` : ""}`).join("\n")}` : ""}`
      };
    }) : []
  };
}
/**
 * @returns {string | undefined}
 */


esbuildMinify.getMinimizerVersion = () => {
  let packageJson;

  try {
    // eslint-disable-next-line global-require, import/no-extraneous-dependencies
    packageJson = require("esbuild/package.json");
  } catch (error) {// Ignore
  }

  return packageJson && packageJson.version;
};

module.exports = {
  throttleAll,
  terserMinify,
  uglifyJsMinify,
  swcMinify,
  esbuildMinify
};
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497393555, function(require, module, exports) {
module.exports = {
  "definitions": {
    "Rule": {
      "description": "Filtering rule as regex or string.",
      "anyOf": [
        {
          "instanceof": "RegExp",
          "tsType": "RegExp"
        },
        {
          "type": "string",
          "minLength": 1
        }
      ]
    },
    "Rules": {
      "description": "Filtering rules.",
      "anyOf": [
        {
          "type": "array",
          "items": {
            "description": "A rule condition.",
            "oneOf": [
              {
                "$ref": "#/definitions/Rule"
              }
            ]
          }
        },
        {
          "$ref": "#/definitions/Rule"
        }
      ]
    }
  },
  "title": "TerserPluginOptions",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "test": {
      "description": "Include all modules that pass test assertion.",
      "link": "https://github.com/webpack-contrib/terser-webpack-plugin#test",
      "oneOf": [
        {
          "$ref": "#/definitions/Rules"
        }
      ]
    },
    "include": {
      "description": "Include all modules matching any of these conditions.",
      "link": "https://github.com/webpack-contrib/terser-webpack-plugin#include",
      "oneOf": [
        {
          "$ref": "#/definitions/Rules"
        }
      ]
    },
    "exclude": {
      "description": "Exclude all modules matching any of these conditions.",
      "link": "https://github.com/webpack-contrib/terser-webpack-plugin#exclude",
      "oneOf": [
        {
          "$ref": "#/definitions/Rules"
        }
      ]
    },
    "terserOptions": {
      "description": "Options for `terser` (by default) or custom `minify` function.",
      "link": "https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions",
      "additionalProperties": true,
      "type": "object"
    },
    "extractComments": {
      "description": "Whether comments shall be extracted to a separate file.",
      "link": "https://github.com/webpack-contrib/terser-webpack-plugin#extractcomments",
      "anyOf": [
        {
          "type": "boolean"
        },
        {
          "type": "string",
          "minLength": 1
        },
        {
          "instanceof": "RegExp"
        },
        {
          "instanceof": "Function"
        },
        {
          "additionalProperties": false,
          "properties": {
            "condition": {
              "anyOf": [
                {
                  "type": "boolean"
                },
                {
                  "type": "string",
                  "minLength": 1
                },
                {
                  "instanceof": "RegExp"
                },
                {
                  "instanceof": "Function"
                }
              ],
              "description": "Condition what comments you need extract.",
              "link": "https://github.com/webpack-contrib/terser-webpack-plugin#condition"
            },
            "filename": {
              "anyOf": [
                {
                  "type": "string",
                  "minLength": 1
                },
                {
                  "instanceof": "Function"
                }
              ],
              "description": "The file where the extracted comments will be stored. Default is to append the suffix .LICENSE.txt to the original filename.",
              "link": "https://github.com/webpack-contrib/terser-webpack-plugin#filename"
            },
            "banner": {
              "anyOf": [
                {
                  "type": "boolean"
                },
                {
                  "type": "string",
                  "minLength": 1
                },
                {
                  "instanceof": "Function"
                }
              ],
              "description": "The banner text that points to the extracted file and will be added on top of the original file",
              "link": "https://github.com/webpack-contrib/terser-webpack-plugin#banner"
            }
          },
          "type": "object"
        }
      ]
    },
    "parallel": {
      "description": "Use multi-process parallel running to improve the build speed.",
      "link": "https://github.com/webpack-contrib/terser-webpack-plugin#parallel",
      "anyOf": [
        {
          "type": "boolean"
        },
        {
          "type": "integer"
        }
      ]
    },
    "minify": {
      "description": "Allows you to override default minify function.",
      "link": "https://github.com/webpack-contrib/terser-webpack-plugin#number",
      "instanceof": "Function"
    }
  }
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497393556, function(require, module, exports) {


/** @typedef {import("./index.js").MinimizedResult} MinimizedResult */

/** @typedef {import("./index.js").CustomOptions} CustomOptions */

/**
 * @template T
 * @param {import("./index.js").InternalOptions<T>} options
 * @returns {Promise<MinimizedResult>}
 */
async function minify(options) {
  const {
    name,
    input,
    inputSourceMap,
    extractComments
  } = options;
  const {
    implementation,
    options: minimizerOptions
  } = options.minimizer;
  return implementation({
    [name]: input
  }, inputSourceMap, minimizerOptions, extractComments);
}
/**
 * @param {string} options
 * @returns {Promise<MinimizedResult>}
 */


async function transform(options) {
  // 'use strict' => this === undefined (Clean Scope)
  // Safer for possible security issues, albeit not critical at all here
  // eslint-disable-next-line no-param-reassign
  const evaluatedOptions =
  /**
   * @template T
   * @type {import("./index.js").InternalOptions<T>}
   * */
  // eslint-disable-next-line no-new-func
  new Function("exports", "require", "module", "__filename", "__dirname", `'use strict'\nreturn ${options}`)(exports, require, module, __filename, __dirname);
  return minify(evaluatedOptions);
}

module.exports = {
  minify,
  transform
};
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1645497393553);
})()
//miniprogram-npm-outsideDeps=["path","os","source-map","schema-utils","serialize-javascript","jest-worker","terser","terser/package.json","uglify-js","uglify-js/package.json","@swc/core","@swc/core/package.json","esbuild","esbuild/package.json"]
//# sourceMappingURL=index.js.map