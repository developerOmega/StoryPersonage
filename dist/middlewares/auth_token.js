"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("../config/config");
var jwt = require("jsonwebtoken");
var authToken = function (req, res, next) {
    var token = req.get('Authorization');
    jwt.verify(token, config_1.JsonEnv.seed, function (err, decode) {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: err
            });
        }
        req.user = decode.user;
        next();
    });
};
exports.authToken = authToken;
var authAdmin = function (req, res, next) {
    if (req.user.type != 'admin') {
        return res.status(403).json({
            ok: false,
            err: {
                message: "El usuario no posee los permisos necesarios para este contenido"
            }
        });
    }
    next();
};
exports.authAdmin = authAdmin;
