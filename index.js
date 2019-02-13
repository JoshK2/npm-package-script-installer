var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var fs = require('fs');
var rimraf = require("rimraf");
var exec = require('child-process-promise').exec;
var path = process.cwd();
function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}
function asyncForEach(array, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var index;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    index = 0;
                    _a.label = 1;
                case 1:
                    if (!(index < array.length)) return [3 /*break*/, 4];
                    return [4 /*yield*/, callback(array[index], index, array)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    index++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function timeout(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
function createDirectory() {
    return __awaiter(this, void 0, void 0, function () {
        var name;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    name = makeid();
                    return [4 /*yield*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                fs.mkdir(path + "/temp/" + name, function (err) {
                                    if (err)
                                        reject(err);
                                    else
                                        resolve();
                                });
                                return [2 /*return*/];
                            });
                        }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, name];
            }
        });
    });
}
function deleteDirectory(directory) {
    return __awaiter(this, void 0, void 0, function () {
        var deleted;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    deleted = false;
                    return [4 /*yield*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                rimraf(path + "/temp/" + directory, function () {
                                    console.log('delete done');
                                    deleted = true;
                                    resolve();
                                });
                                return [2 /*return*/];
                            });
                        }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, deleted];
            }
        });
    });
}
function installPackage(dir, command) {
    return __awaiter(this, void 0, void 0, function () {
        var packageInstalled;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    packageInstalled = false;
                    return [4 /*yield*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                exec("npm init --yes", { cwd: path + "/temp/" + dir }).then(function (result) {
                                    var stdout = result.stdout;
                                    var stderr = result.stderr;
                                    console.log('stdout: ', stdout);
                                    console.log('stderr: ', stderr);
                                    exec("" + command, { cwd: path + "/temp/" + dir }).then(function (result) {
                                        var stdout = result.stdout;
                                        var stderr = result.stderr;
                                        console.log('stdout: ', stdout);
                                        console.log('stderr: ', stderr);
                                        packageInstalled = true;
                                        resolve();
                                    })["catch"](function (err) {
                                        console.error('ERROR: ', err);
                                        reject(err);
                                    });
                                })["catch"](function (err) {
                                    console.error('ERROR: ', err);
                                });
                                return [2 /*return*/];
                            });
                        }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, packageInstalled];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var numberArray, index;
        return __generator(this, function (_a) {
            numberArray = [];
            for (index = 0; index < params.installNumber; index++) {
                numberArray.push(index);
            }
            asyncForEach(numberArray, function () {
                return __awaiter(this, void 0, void 0, function () {
                    var dir, packageInstalled, deleted;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, timeout(10000)];
                            case 1:
                                _a.sent(); // 10 secondes
                                return [4 /*yield*/, createDirectory()];
                            case 2:
                                dir = _a.sent();
                                console.log("created directory " + dir);
                                return [4 /*yield*/, installPackage(dir, "npm i " + params.packageName)];
                            case 3:
                                packageInstalled = _a.sent();
                                console.log("package installed " + packageInstalled);
                                return [4 /*yield*/, deleteDirectory(dir)];
                            case 4:
                                deleted = _a.sent();
                                console.log("directory delete " + deleted);
                                return [2 /*return*/];
                        }
                    });
                });
            });
            return [2 /*return*/];
        });
    });
}
var params = {
    packageName: 'jotils',
    installNumber: 1
};
main();
