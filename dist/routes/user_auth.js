"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var config_1 = require("../config/config");
var mysql_1 = __importDefault(require("../mysql/mysql"));
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
var router = express_1.Router();
router.post('/users/login', function (req, res) {
    var body = req.body;
    var query = "\n        SELECT * FROM users WHERE email = \"" + body.email + "\"\n    ";
    mysql_1.default.getQuery(query, function (err, user) {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        if (!user[0]) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: "Ususario y contrasenia son incorrectos"
                }
            });
        }
        if (!bcrypt.compareSync(body.password, user[0].password)) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: "Usuario y contrasenia son incorrectos"
                }
            });
        }
        delete user[0].password;
        var token = jwt.sign({ user: user[0] }, config_1.JsonEnv.seed, { expiresIn: config_1.JsonEnv.expiredToken });
        return res.json({
            ok: true,
            user: user[0],
            token: token
        });
    });
});
var routerUserAuth = router;
exports.default = routerUserAuth;
