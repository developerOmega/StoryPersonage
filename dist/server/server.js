"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path = require("path");
// import bodyParser = require('body-parser');
var Server = /** @class */ (function () {
    function Server(port) {
        this.port = port;
        this.app = express();
    }
    Server.init = function (port) {
        return new Server(port);
    };
    Server.prototype.publicFolder = function () {
        var publicPath = path.resolve(__dirname, '../public');
        this.app.use(express.static(publicPath));
    };
    // private bodyParser(){
    //     this.app.use(bodyParser.urlencoded({ extended: false }));
    //     this.app.use(bodyParser.json());
    // }
    Server.prototype.start = function (callback) {
        this.app.listen(this.port, callback());
        this.publicFolder();
        // this.bodyParser();
    };
    return Server;
}());
exports.default = Server;
