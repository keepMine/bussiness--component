module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1645497392677, function(require, module, exports) {

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const envinfo_1 = __importDefault(require("envinfo"));
class InfoCommand {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    async apply(cli) {
        await cli.makeCommand({
            name: "info",
            alias: "i",
            description: "Outputs information about your system.",
            usage: "[options]",
            pkg: "@webpack-cli/info",
        }, [
            {
                name: "output",
                alias: "o",
                configs: [
                    {
                        type: "string",
                    },
                ],
                description: "To get the output in a specified format ( accept json or markdown )",
            },
            {
                name: "additional-package",
                alias: "a",
                configs: [{ type: "string" }],
                multiple: true,
                description: "Adds additional packages to the output",
            },
        ], async (options) => {
            let { output } = options;
            const envinfoConfig = {};
            if (output) {
                // Remove quotes if exist
                output = output.replace(/['"]+/g, "");
                switch (output) {
                    case "markdown":
                        envinfoConfig["markdown"] = true;
                        break;
                    case "json":
                        envinfoConfig["json"] = true;
                        break;
                    default:
                        cli.logger.error(`'${output}' is not a valid value for output`);
                        process.exit(2);
                }
            }
            const defaultInformation = {
                Binaries: ["Node", "Yarn", "npm"],
                Browsers: [
                    "Brave Browser",
                    "Chrome",
                    "Chrome Canary",
                    "Edge",
                    "Firefox",
                    "Firefox Developer Edition",
                    "Firefox Nightly",
                    "Internet Explorer",
                    "Safari",
                    "Safari Technology Preview",
                ],
                Monorepos: ["Yarn Workspaces", "Lerna"],
                System: ["OS", "CPU", "Memory"],
                npmGlobalPackages: ["webpack", "webpack-cli", "webpack-dev-server"],
                npmPackages: "{*webpack*,*loader*}",
            };
            let defaultPackages = ["webpack", "loader"];
            if (typeof options.additionalPackage !== "undefined") {
                defaultPackages = [...defaultPackages, ...options.additionalPackage];
            }
            defaultInformation.npmPackages = `{${defaultPackages
                .map((item) => `*${item}*`)
                .join(",")}}`;
            let info = await envinfo_1.default.run(defaultInformation, envinfoConfig);
            info = info.replace(/npmPackages/g, "Packages");
            info = info.replace(/npmGlobalPackages/g, "Global Packages");
            cli.logger.raw(info);
        });
    }
}
exports.default = InfoCommand;

}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1645497392677);
})()
//miniprogram-npm-outsideDeps=["envinfo"]
//# sourceMappingURL=index.js.map