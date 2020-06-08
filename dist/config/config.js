"use strict";
//====================================
// Puerto
//====================================
Object.defineProperty(exports, "__esModule", { value: true });
var port = process.env.PORT || '3000';
exports.port = port;
//====================================
// Entorno
//====================================
var nodeEnv = process.env.NODE_ENV || 'development';
exports.nodeEnv = nodeEnv;
//====================================
// JSON WEB TOKEN
//====================================
var JsonEnv = /** @class */ (function () {
    function JsonEnv() {
    }
    JsonEnv.expiredToken = '48h';
    JsonEnv.seed = nodeEnv === 'development' ? 'el-gato-esta-en-desarrollo' : process.env.SEED;
    return JsonEnv;
}());
exports.JsonEnv = JsonEnv;
//====================================
// BASE DE DATOS
//====================================
var DatabaseEnv = /** @class */ (function () {
    function DatabaseEnv() {
    }
    DatabaseEnv.host = nodeEnv === 'development' ? 'localhost' : process.env.HOST;
    DatabaseEnv.user = nodeEnv === 'development' ? 'root' : process.env.USER;
    DatabaseEnv.password = nodeEnv === 'development' ? '1234' : process.env.PASSWROD;
    DatabaseEnv.database = nodeEnv === 'development' ? 'story_personage' : process.env.DATABASE;
    return DatabaseEnv;
}());
exports.DatabaseEnv = DatabaseEnv;
