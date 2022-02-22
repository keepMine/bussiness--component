module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1645497392676, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
const WEBPACK_PACKAGE = process.env.WEBPACK_PACKAGE || "webpack";
class ConfigTestCommand {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    async apply(cli) {
        await cli.makeCommand({
            name: "configtest [config-path]",
            alias: "t",
            description: "Validate a webpack configuration.",
            pkg: "@webpack-cli/configtest",
            dependencies: [WEBPACK_PACKAGE],
        }, [], async (configPath) => {
            cli.webpack = await cli.loadWebpack();
            const config = await cli.loadConfig(configPath ? { config: [configPath] } : {});
            const configPaths = new Set();
            if (Array.isArray(config.options)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                config.options.forEach((options) => {
                    if (config.path.get(options)) {
                        configPaths.add(config.path.get(options));
                    }
                });
            }
            else {
                if (config.path.get(config.options)) {
                    configPaths.add(config.path.get(config.options));
                }
            }
            if (configPaths.size === 0) {
                cli.logger.error("No configuration found.");
                process.exit(2);
            }
            cli.logger.info(`Validate '${Array.from(configPaths).join(" ,")}'.`);
            try {
                const error = cli.webpack.validate(config.options);
                // TODO remove this after drop webpack@4
                if (error && error.length > 0) {
                    throw new cli.webpack.WebpackOptionsValidationError(error);
                }
            }
            catch (error) {
                if (cli.isValidationError(error)) {
                    cli.logger.error(error.message);
                }
                else {
                    cli.logger.error(error);
                }
                process.exit(2);
            }
            cli.logger.success("There are no validation errors in the given webpack configuration.");
        });
    }
}
exports.default = ConfigTestCommand;

}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1645497392676);
})()
//miniprogram-npm-outsideDeps=[]
//# sourceMappingURL=index.js.map