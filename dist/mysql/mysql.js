"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mysql = require("mysql");
var config_1 = require("../config/config");
var MySQL = /** @class */ (function () {
    function MySQL() {
        this.connected = false;
        this.connection = mysql.createConnection({
            host: config_1.DatabaseEnv.host,
            user: config_1.DatabaseEnv.user,
            password: config_1.DatabaseEnv.password,
            database: config_1.DatabaseEnv.database
        });
        this.connectDB();
    }
    Object.defineProperty(MySQL, "instance", {
        get: function () {
            return this.__instance || (this.__instance = new this());
        },
        enumerable: true,
        configurable: true
    });
    MySQL.getQuery = function (query, callback) {
        this.instance.connection.query(query, function (err, results, fields) {
            if (err) {
                console.log('Error en query');
                console.log(err);
                return callback(err);
            }
            if (results.length === 0) {
                return callback('No existe el registro solicitado');
            }
            callback(null, results);
        });
    };
    MySQL.postQuery = function (query, post, callback) {
        this.instance.connection.query(query, post, function (err, results, fields) {
            if (err) {
                console.log('Error en query');
                console.log(err);
                return callback(err);
            }
            if (!results) {
                return callback('No se puede crear el registro');
            }
            return callback(null, results);
        });
    };
    MySQL.updateQuery = function (query, update, callback) {
        this.instance.connection.query(query, update, function (err, results, fields) {
            if (err) {
                console.log('Error en query');
                console.log(err);
                return callback(err);
            }
            if (!results) {
                return callback('No se puede editar el registro');
            }
            return callback(null, results);
        });
    };
    MySQL.deleteQuery = function (query, callback) {
        this.instance.connection.query(query, function (err, results, fields) {
            if (err) {
                console.log('Error en el query');
                console.log(err);
                return callback(err);
            }
            if (!results) {
                return callback('No se puede eliminar el registro');
            }
            callback(null, results);
        });
    };
    MySQL.prototype.connectDB = function () {
        var _this = this;
        this.connection.connect(function (err) {
            if (err) {
                console.log(err);
                return;
            }
            _this.connected = true;
            console.log('Base de datos ONLINE');
        });
    };
    return MySQL;
}());
exports.default = MySQL;
