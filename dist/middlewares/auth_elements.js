"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mysql_1 = __importDefault(require("../mysql/mysql"));
var authPersonage = function (req, res, next) {
    var escapedId = mysql_1.default.instance.connection.escape(req.params.id);
    var query = "\n        SELECT * FROM personages WHERE id = " + escapedId + "\n    ";
    mysql_1.default.getQuery(query, function (err, personage) {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        if (personage[0].user_id != req.user.id) {
            return res.status(403).json({
                ok: false,
                err: {
                    message: "El personaje no pertenece al usuario"
                }
            });
        }
        next();
    });
};
exports.authPersonage = authPersonage;
var authStory = function (req, res, next) {
    var escapedId = mysql_1.default.instance.connection.escape(req.params.id);
    var query = "\n        SELECT * FROM stories WHERE id = " + escapedId + "\n    ";
    mysql_1.default.getQuery(query, function (err, story) {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        if (story[0].user_id != req.user.id) {
            return res.status(403).json({
                ok: false,
                err: {
                    message: "La historia no pertenece al usuario"
                }
            });
        }
        next();
    });
};
exports.authStory = authStory;
var authStoryPersonage = function (req, res, next) {
    var body = req.method === 'POST' ? req.body : req.query;
    var query = "\n        SELECT * FROM personages WHERE id = " + body.personage_id + "\n    ";
    mysql_1.default.getQuery(query, function (err, personage) {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        if (personage[0].user_id != req.user.id) {
            return res.status(403).json({
                ok: false,
                err: {
                    message: "El personage no pertenece al usuario"
                }
            });
        }
        var query = "\n            SELECT * FROM stories WHERE id = " + body.story_id + "\n        ";
        mysql_1.default.getQuery(query, function (err, story) {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }
            if (story[0].user_id != req.user.id) {
                return res.status(403).json({
                    ok: false,
                    err: {
                        message: "La historia no pertenece al usuario"
                    }
                });
            }
            next();
        });
    });
};
exports.authStoryPersonage = authStoryPersonage;
