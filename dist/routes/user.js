"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_token_1 = require("../middlewares/auth_token");
var mysql_1 = __importDefault(require("../mysql/mysql"));
var bcrypt = require("bcrypt");
var router = express_1.Router();
router.get('/users', auth_token_1.authToken, function (req, res) {
    var query = "\n        SELECT  id, name, email, type, status, updated_at, created_at FROM users\n    ";
    mysql_1.default.getQuery(query, function (err, users) {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        if (users.length == 0) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: "No hay existencia de usuarios"
                }
            });
        }
        return res.json({
            ok: true,
            users: users
        });
    });
});
router.get('/users/:id', auth_token_1.authToken, function (req, res) {
    var id = req.params.id;
    var escapedId = mysql_1.default.instance.connection.escape(id);
    var query = "\n        SELECT  id, name, email, type, status, updated_at, created_at FROM users WHERE id = " + escapedId + "\n    ";
    mysql_1.default.getQuery(query, function (err, user) {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        if (!user) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: "No se pudo encontrar el usuario"
                }
            });
        }
        return res.json({
            ok: true,
            user: user[0]
        });
    });
});
router.post('/users', [auth_token_1.authToken, auth_token_1.authAdmin], function (req, res) {
    var body = req.body;
    var post = {
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        type: body.type,
    };
    var query = "\n        INSERT INTO users SET ?\n    ";
    mysql_1.default.postQuery(query, post, function (err, data) {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        var query = "\n            SELECT  id, name, email, type, status, updated_at, created_at FROM users WHERE id = " + data.insertId + "\n        ";
        mysql_1.default.getQuery(query, function (err, user) {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }
            return res.json({
                ok: true,
                user: user[0]
            });
        });
    });
});
router.put('/users/:id', [auth_token_1.authToken, auth_token_1.authAdmin], function (req, res) {
    var id = req.params.id;
    var escapedId = mysql_1.default.instance.connection.escape(id);
    var body = req.body;
    var query = "\n        UPDATE users SET ? WHERE id = " + escapedId + "\n    ";
    mysql_1.default.updateQuery(query, body, function (err, user) {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        var query = "\n            SELECT  id, name, email, type, status, updated_at, created_at FROM users WHERE id = " + escapedId + "\n        ";
        mysql_1.default.getQuery(query, function (err, user) {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }
            return res.json({
                ok: true,
                user: user[0]
            });
        });
    });
});
router.delete('/users/:id', [auth_token_1.authToken, auth_token_1.authAdmin], function (req, res) {
    var id = req.params.id;
    var escapedId = mysql_1.default.instance.connection.escape(id);
    var query = "\n        DELETE FROM users WHERE id = " + escapedId + "\n    ";
    mysql_1.default.deleteQuery(query, function (err) {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        return res.json({
            ok: true,
            message: 'el usuario fue eliminado con exito'
        });
    });
});
router.get('/users/:id/personages', auth_token_1.authToken, function (req, res) {
    var id = req.params.id;
    var escapedId = mysql_1.default.instance.connection.escape(id);
    var query = "\n        SELECT personages.id, personages.name, personages.features, personages.age, personages.height, personages.origin \n        FROM personages INNER JOIN users ON personages.user_id=users.id\n        WHERE user_id = " + escapedId + ";\n    ";
    mysql_1.default.getQuery(query, function (err, personages) {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        if (personages.length === 0) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: "No se encontro el registro"
                }
            });
        }
        return res.json({
            ok: true,
            personages: personages
        });
    });
});
router.get('/users/:id/stories', auth_token_1.authToken, function (req, res) {
    var id = req.params.id;
    var escapedId = mysql_1.default.instance.connection.escape(id);
    var query = "\n        SELECT stories.id, stories.title, stories.plot, stories.report\n        FROM stories INNER JOIN users ON stories.user_id=users.id\n        WHERE user_id = " + escapedId + ";\n    ";
    mysql_1.default.getQuery(query, function (err, stories) {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        if (stories.length === 0) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: "El resgitro no existe"
                }
            });
        }
        return res.json({
            ok: true,
            stories: stories
        });
    });
});
var routerUser = router;
exports.default = routerUser;
