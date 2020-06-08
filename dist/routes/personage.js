"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_token_1 = require("../middlewares/auth_token");
var auth_elements_1 = require("../middlewares/auth_elements");
var mysql_1 = __importDefault(require("../mysql/mysql"));
var router = express_1.Router();
router.get('/personages', auth_token_1.authToken, function (req, res) {
    var query = "\n        SELECT * FROM personages\n    ";
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
                    message: 'No se encontro el regitro'
                }
            });
        }
        return res.json({
            ok: true,
            personages: personages
        });
    });
});
router.get('/personages/:id', auth_token_1.authToken, function (req, res) {
    var id = req.params.id;
    var escapedId = mysql_1.default.instance.connection.escape(id);
    var query = "\n        SELECT * FROM personages WHERE id = " + escapedId + "\n    ";
    mysql_1.default.getQuery(query, function (err, personage) {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        if (!personage) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'No se encontro el registro'
                }
            });
        }
        return res.json({
            ok: true,
            personage: personage[0]
        });
    });
});
router.post('/personages', auth_token_1.authToken, function (req, res) {
    var body = req.body;
    var post = {
        name: body.name,
        features: body.features,
        age: body.age,
        height: body.height,
        origin: body.origin,
        gender: body.gender,
        user_id: req.user.id
    };
    var query = "\n        INSERT INTO personages SET ?\n    ";
    mysql_1.default.postQuery(query, post, function (err, data) {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        var query = "\n            SELECT * FROM personages WHERE id = " + data.insertId + "\n        ";
        mysql_1.default.getQuery(query, function (err, personage) {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }
            return res.json({
                ok: true,
                personage: personage[0]
            });
        });
    });
});
router.put('/personages/:id', [auth_token_1.authToken, auth_elements_1.authPersonage], function (req, res) {
    var id = req.params.id;
    var escapedId = mysql_1.default.instance.connection.escape(id);
    var body = req.body;
    var query = "\n        UPDATE personages SET ? WHERE id = " + escapedId + "\n    ";
    mysql_1.default.updateQuery(query, body, function (err, personage) {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        var query = "\n            SELECT * FROM personages WHERE id = " + escapedId + "\n        ";
        mysql_1.default.getQuery(query, function (err, personage) {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }
            return res.json({
                ok: true,
                user: personage[0]
            });
        });
    });
});
router.delete('/personages/:id', [auth_token_1.authToken, auth_elements_1.authPersonage], function (req, res) {
    var id = req.params.id;
    var escapedId = mysql_1.default.instance.connection.escape(id);
    var query = "\n        DELETE FROM personages WHERE id = " + escapedId + "\n    ";
    mysql_1.default.deleteQuery(query, function (err) {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        return res.json({
            ok: true,
            message: 'El personaje fue eliminado con exito'
        });
    });
});
router.get('/personages/:id/stories', auth_token_1.authToken, function (req, res) {
    var id = req.params.id;
    var escapedId = mysql_1.default.instance.connection.escape(id);
    var query = "\n        SELECT stories.id, stories.title, stories.plot, stories.report\n        FROM stories INNER JOIN story_personages ON stories.id=story_personages.story_id\n        INNER JOIN personages ON story_personages.personage_id=personages.id\n        WHERE personages.id = " + escapedId + ";\n    ";
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
                    message: "No se encontro el registro"
                }
            });
        }
        return res.json({
            ok: true,
            stories: stories
        });
    });
});
router.get('/personages/:id/user', auth_token_1.authToken, function (req, res) {
    var id = req.params.id;
    var escapedId = mysql_1.default.instance.connection.escape(id);
    var query = "\n        SELECT * FROM personages WHERE id = " + escapedId + "\n    ";
    mysql_1.default.getQuery(query, function (err, personage) {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        if (!personage[0]) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: "No se encontro el registro"
                }
            });
        }
        var query = "\n            SELECT id, name, email, type, status, updated_at, created_at FROM users WHERE id = " + personage[0].user_id + "\n        ";
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
var routerPersonage = router;
exports.default = routerPersonage;
